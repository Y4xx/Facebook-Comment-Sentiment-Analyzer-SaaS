import re
from typing import List, Dict, Tuple
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
        
        # Extract post ID from URL
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
        
        with httpx.Client(timeout=30.0) as client:
            while True:
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
