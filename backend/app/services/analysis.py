import re
from typing import List, Dict, Tuple
from sqlalchemy.orm import Session

from app.models.analysis import Analysis
from app.models.comment import Comment
from app.ai.sentiment import SentimentAnalyzer


class AnalysisService:
    """Service for sentiment analysis operations."""
    
    def __init__(self, db: Session):
        self.db = db
        self.sentiment_analyzer = SentimentAnalyzer()
    
    def extract_post_id(self, url: str) -> str:
        """Extract Facebook post ID from URL."""
        # Various Facebook URL patterns
        patterns = [
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
        Fetch comments from Facebook post.
        NOTE: This is a mock implementation since Facebook Graph API
        requires app approval. In production, integrate with Facebook API.
        """
        # Mock comments for demonstration - in production use Facebook API
        mock_comments = [
            "This is absolutely amazing! Love it! ❤️",
            "Great content, keep it up!",
            "I'm not sure about this...",
            "Could be better, but okay.",
            "This is terrible, very disappointed 😞",
            "Wonderful post! So inspiring!",
            "Meh, nothing special.",
            "Best thing I've seen today! 🔥",
            "I disagree with this completely.",
            "Perfect! Just what I needed!",
            "C'est vraiment magnifique! J'adore!",  # French positive
            "Je ne suis pas convaincu.",  # French neutral
            "هذا رائع جدا",  # Arabic positive
            "لا أعتقد أن هذا جيد",  # Arabic negative
        ]
        return mock_comments
    
    def clean_text(self, text: str) -> str:
        """Clean and normalize comment text."""
        # Remove URLs
        text = re.sub(r'http[s]?://\S+', '', text)
        # Remove excessive whitespace
        text = ' '.join(text.split())
        return text.strip()
    
    def analyze_post(self, user_id: int, post_url: str) -> Analysis:
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
            user_id=user_id,
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
    
    def get_user_analyses(self, user_id: int, skip: int = 0, limit: int = 50) -> List[Analysis]:
        """Get all analyses for a user."""
        return (
            self.db.query(Analysis)
            .filter(Analysis.user_id == user_id)
            .order_by(Analysis.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_analysis_by_id(self, user_id: int, analysis_id: int) -> Analysis:
        """Get a specific analysis by ID for a user."""
        return (
            self.db.query(Analysis)
            .filter(Analysis.id == analysis_id, Analysis.user_id == user_id)
            .first()
        )
