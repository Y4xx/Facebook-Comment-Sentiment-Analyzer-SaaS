import re
from typing import List, Dict, Tuple, Optional
from urllib.parse import urlparse, parse_qs
from sqlalchemy.orm import Session
import httpx

from app.models.analysis import Analysis
from app.models.comment import Comment
from app.ai.sentiment import SentimentAnalyzer
from app.config import settings


class AnalysisService:
    """Service for sentiment analysis operations."""
    
    def __init__(self, db: Session):
        self.db = db
        self.sentiment_analyzer = SentimentAnalyzer()
    
    def extract_post_id(self, url: str) -> str:
        """Extract Facebook post ID from URL."""
        # Various Facebook URL patterns
        patterns = [
            r'facebook\.com/share/p/([\w]+)',  # Short share URL for posts
            r'facebook\.com/share/r/([\w]+)',  # Short share URL for reels
            r'facebook\.com/(?:[\w\.]+)/posts/(\d+)',
            r'facebook\.com/(?:[\w\.]+)/videos/(\d+)',
            r'facebook\.com/story\.php\?story_fbid=(\d+)',
            r'facebook\.com/permalink\.php\?story_fbid=(\d+)',
            r'fb\.watch/([\w]+)',
            r'facebook\.com/(?:[\w\.]+)/photos/[\w\.]+/(\d+)',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                return match.group(1)
        
        # Return a hash of the URL as fallback
        return str(hash(url) % 10**8)
    
    def _is_share_url(self, url: str) -> bool:
        """Check if the URL is a Facebook share URL that needs resolution."""
        return '/share/p/' in url or '/share/r/' in url
    
    def _extract_share_hash(self, url: str) -> tuple:
        """
        Extract the share type and hash from a Facebook share URL.
        
        Args:
            url: The Facebook share URL
            
        Returns:
            A tuple of (share_type, hash) where share_type is 'p' or 'r'
            
        Raises:
            ValueError: If the URL is not a valid share URL
        """
        # Match /share/p/{hash} or /share/r/{hash}
        match = re.search(r'/share/(p|r)/([\w]+)', url)
        if not match:
            raise ValueError(f"Invalid share URL format: {url}")
        return match.group(1), match.group(2)
    
    def _resolve_share_url(self, url: str) -> Optional[str]:
        """
        Resolve a Facebook share URL to its final destination URL.
        
        Share URLs (/share/p/{hash} and /share/r/{hash}) are short links that
        redirect to the actual post URL. This method follows the redirects
        to get the final URL.
        
        Args:
            url: The Facebook share URL to resolve
            
        Returns:
            The resolved final URL after following redirects, or None if
            resolution fails (e.g., Facebook blocks the request)
        """
        # Extract share hash and construct a safe URL to prevent SSRF
        try:
            share_type, share_hash = self._extract_share_hash(url)
        except ValueError:
            return None
        
        # Construct a safe Facebook URL using only the extracted hash
        # This prevents SSRF by ensuring we only request from www.facebook.com
        safe_url = f"https://www.facebook.com/share/{share_type}/{share_hash}/"
        
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
        
        # Define allowed Facebook domains for redirect validation
        allowed_domains = (
            'facebook.com',
            'www.facebook.com',
            'web.facebook.com',
            'm.facebook.com',
        )
        
        try:
            with httpx.Client(follow_redirects=True, timeout=10.0) as client:
                response = client.get(safe_url, headers=headers)
                
                # If Facebook returns an error, return None to trigger fallback
                if response.status_code != 200:
                    return None
                
                final_url = str(response.url)
                
                # Validate the final URL is a Facebook URL
                try:
                    parsed = urlparse(final_url)
                    host = parsed.netloc.lower()
                    if parsed.scheme not in ('http', 'https'):
                        return None
                    if not any(host == d or host.endswith('.' + d) for d in allowed_domains):
                        return None
                except Exception:
                    return None
                
                return final_url
                
        except (httpx.TimeoutException, httpx.RequestError):
            # Resolution failed, return None to trigger fallback
            return None
    
    def _resolve_page_name_to_id(self, page_name: str) -> Optional[str]:
        """
        Resolve a Facebook page name to its page ID using the Graph API.
        
        Args:
            page_name: The page username/name to resolve
            
        Returns:
            The page ID or None if resolution fails
        """
        if not settings.FACEBOOK_ACCESS_TOKEN:
            return None
            
        api_url = (
            f"https://graph.facebook.com/{settings.FACEBOOK_API_VERSION}/"
            f"{page_name}"
        )
        
        params = {
            "fields": "id",
            "access_token": settings.FACEBOOK_ACCESS_TOKEN,
        }
        
        try:
            with httpx.Client(timeout=10.0) as client:
                response = client.get(api_url, params=params)
                if response.status_code == 200:
                    data = response.json()
                    return data.get("id")
        except Exception:
            pass
        
        return None
    
    def _build_graph_post_id(self, url: str) -> str:
        """
        Build a Graph API compatible post ID from a resolved Facebook URL.
        
        Handles various URL patterns:
        - /{page_name}/posts/{post_id} → {page_id}_{post_id}
        - /permalink.php?story_fbid={id}&id={page_id} → {page_id}_{id}
        - /reel/{reel_id} → {reel_id}
        - /watch?v={video_id} → {video_id}
        - /{page_name}/videos/{video_id} → {page_id}_{video_id}
        
        Args:
            url: The resolved Facebook URL
            
        Returns:
            A Graph API compatible post ID
        """
        parsed = urlparse(url)
        path = parsed.path
        query_params = parse_qs(parsed.query)
        
        # Pattern: /reel/{reel_id}
        reel_match = re.search(r'/reel/(\d+)', path)
        if reel_match:
            return reel_match.group(1)
        
        # Pattern: /watch?v={video_id}
        if '/watch' in path and 'v' in query_params:
            video_id = query_params['v'][0]
            return video_id
        
        # Pattern: /permalink.php?story_fbid={id}&id={page_id}
        if '/permalink.php' in path:
            story_fbid = query_params.get('story_fbid', [None])[0]
            page_id = query_params.get('id', [None])[0]
            if story_fbid and page_id:
                return f"{page_id}_{story_fbid}"
            elif story_fbid:
                return story_fbid
        
        # Pattern: /{page_name}/posts/{post_id}
        posts_match = re.search(r'/([^/]+)/posts/(\d+)', path)
        if posts_match:
            page_name = posts_match.group(1)
            post_id = posts_match.group(2)
            # Try to resolve page name to ID
            page_id = self._resolve_page_name_to_id(page_name)
            if page_id:
                return f"{page_id}_{post_id}"
            # Fall back to using page name (may work for some pages)
            return f"{page_name}_{post_id}"
        
        # Pattern: /{page_name}/videos/{video_id}
        videos_match = re.search(r'/([^/]+)/videos/(\d+)', path)
        if videos_match:
            page_name = videos_match.group(1)
            video_id = videos_match.group(2)
            # Try to resolve page name to ID
            page_id = self._resolve_page_name_to_id(page_name)
            if page_id:
                return f"{page_id}_{video_id}"
            # Fall back to using just the video ID
            return video_id
        
        # Pattern: /story.php?story_fbid={id}
        if '/story.php' in path:
            story_fbid = query_params.get('story_fbid', [None])[0]
            if story_fbid:
                return story_fbid
        
        # Fallback: extract any numeric ID from the URL
        numeric_match = re.search(r'/(\d{10,})', path)
        if numeric_match:
            return numeric_match.group(1)
        
        # Ultimate fallback: return hash of URL
        return str(hash(url) % 10**8)
    
    def fetch_comments(self, post_url: str) -> List[str]:
        """
        Fetch comments from Facebook post using the Facebook Graph API.
        
        Args:
            post_url: The URL of the Facebook post
            
        Returns:
            List of comment message strings
            
        Raises:
            ValueError: If the access token is missing or the API returns an error
        """
        # Validate access token
        if not settings.FACEBOOK_ACCESS_TOKEN:
            raise ValueError(
                "Facebook access token is not configured. "
                "Please set FACEBOOK_ACCESS_TOKEN in your environment variables."
            )
        
        # Resolve share URLs to their final destination
        if self._is_share_url(post_url):
            # Try to resolve the share URL to its final destination
            resolved_url = self._resolve_share_url(post_url)
            if resolved_url:
                # Resolution succeeded, build the Graph API post ID from resolved URL
                post_id = self._build_graph_post_id(resolved_url)
            else:
                # Resolution failed (e.g., Facebook blocked the request)
                # Fall back to using the share hash directly as the post ID
                post_id = self.extract_post_id(post_url)
        else:
            # Extract post ID from URL directly
            post_id = self.extract_post_id(post_url)
        
        # Build the API URL
        api_url = (
            f"https://graph.facebook.com/{settings.FACEBOOK_API_VERSION}/"
            f"{post_id}/comments"
        )
        
        params = {
            "fields": "message",
            "limit": 100,
            "access_token": settings.FACEBOOK_ACCESS_TOKEN,
        }
        
        comments: List[str] = []
        max_pages = 10  # Limit to prevent excessive API calls
        page_count = 0
        
        with httpx.Client(timeout=30.0) as client:
            while page_count < max_pages:
                page_count += 1
                response = client.get(api_url, params=params)
                
                if response.status_code != 200:
                    try:
                        error_data = response.json()
                        error_message = error_data.get("error", {}).get(
                            "message", "Unknown error"
                        )
                    except Exception:
                        error_message = response.text or "Unknown error"
                    raise ValueError(
                        f"Facebook API error: {error_message}"
                    )
                
                data = response.json()
                
                # Extract comment messages
                for comment in data.get("data", []):
                    message = comment.get("message")
                    if message:
                        comments.append(message)
                
                # Handle pagination
                paging = data.get("paging", {})
                next_url = paging.get("next")
                
                if not next_url:
                    break
                
                # Use the next URL directly for pagination
                api_url = next_url
                params = {}  # Params are included in the next URL
        
        return comments
    
    def clean_text(self, text: str) -> str:
        """Clean and normalize comment text."""
        # Remove URLs
        text = re.sub(r'http[s]?://\S+', '', text)
        # Remove excessive whitespace
        text = ' '.join(text.split())
        return text.strip()
    
    def analyze_post(self, post_url: str) -> Analysis:
        """
        Analyze sentiment of all comments in a Facebook post.
        Returns the Analysis object with all results.
        """
        # Extract post ID for reference
        post_id = self.extract_post_id(post_url)
        
        # Fetch comments
        raw_comments = self.fetch_comments(post_url)
        
        # Clean comments
        cleaned_comments = [self.clean_text(c) for c in raw_comments if self.clean_text(c)]
        
        # Run sentiment analysis on all comments
        sentiment_results = self.sentiment_analyzer.analyze_batch(cleaned_comments)
        
        # Calculate statistics
        positive_count = sum(1 for r in sentiment_results if r['sentiment'] == 'positive')
        neutral_count = sum(1 for r in sentiment_results if r['sentiment'] == 'neutral')
        negative_count = sum(1 for r in sentiment_results if r['sentiment'] == 'negative')
        total_comments = len(sentiment_results)
        
        # Calculate overall sentiment
        avg_score = sum(r['score'] for r in sentiment_results) / total_comments if total_comments > 0 else 0
        if avg_score >= 3.5:
            overall_sentiment = 'positive'
        elif avg_score >= 2.5:
            overall_sentiment = 'neutral'
        else:
            overall_sentiment = 'negative'
        
        # Create analysis record
        analysis = Analysis(
            post_url=post_url,
            overall_sentiment=overall_sentiment,
            overall_score=avg_score,
            positive_count=positive_count,
            neutral_count=neutral_count,
            negative_count=negative_count,
            total_comments=total_comments
        )
        self.db.add(analysis)
        self.db.flush()  # Get the analysis ID
        
        # Create comment records
        for comment_text, result in zip(cleaned_comments, sentiment_results):
            comment = Comment(
                analysis_id=analysis.id,
                comment_text=comment_text,
                sentiment=result['sentiment'],
                score=result['score']
            )
            self.db.add(comment)
        
        self.db.commit()
        self.db.refresh(analysis)
        
        return analysis
    
    def get_all_analyses(self, skip: int = 0, limit: int = 50) -> List[Analysis]:
        """Get all analyses."""
        return (
            self.db.query(Analysis)
            .order_by(Analysis.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_analysis_by_id(self, analysis_id: int) -> Analysis:
        """Get a specific analysis by ID."""
        return (
            self.db.query(Analysis)
            .filter(Analysis.id == analysis_id)
            .first()
        )
