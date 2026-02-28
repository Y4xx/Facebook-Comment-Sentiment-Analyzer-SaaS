from typing import List, Dict
from transformers import pipeline
from app.config import settings


class SentimentAnalyzer:
    """
    BERT-based sentiment analyzer using HuggingFace Transformers.
    Uses nlptown/bert-base-multilingual-uncased-sentiment model
    which supports multiple languages including English, French, and Arabic.
    """
    
    _instance = None
    _pipeline = None
    
    def __new__(cls):
        """Singleton pattern to avoid loading model multiple times."""
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        """Initialize the sentiment analysis pipeline."""
        if SentimentAnalyzer._pipeline is None:
            SentimentAnalyzer._pipeline = pipeline(
                "sentiment-analysis",
                model=settings.SENTIMENT_MODEL,
                top_k=None  # Return all scores
            )
    
    @property
    def pipeline(self):
        """Get the sentiment pipeline."""
        return SentimentAnalyzer._pipeline
    
    def _map_stars_to_sentiment(self, label: str, score: float) -> Dict:
        """
        Map star rating to sentiment category.
        
        Mapping:
        - 4-5 stars → Positive
        - 3 stars → Neutral
        - 1-2 stars → Negative
        """
        # Extract star count from label (e.g., "5 stars" -> 5)
        stars = int(label.split()[0])
        
        if stars >= 4:
            sentiment = "positive"
        elif stars == 3:
            sentiment = "neutral"
        else:
            sentiment = "negative"
        
        return {
            "sentiment": sentiment,
            "score": stars,
            "confidence": score,
            "raw_label": label
        }
    
    def analyze(self, text: str) -> Dict:
        """
        Analyze sentiment of a single text.
        
        Args:
            text: The text to analyze
            
        Returns:
            Dict with sentiment, score, confidence, and raw_label
        """
        if not text or not text.strip():
            return {
                "sentiment": "neutral",
                "score": 3.0,
                "confidence": 0.0,
                "raw_label": "3 stars"
            }
        
        # Truncate long texts (model max length)
        text = text[:512]
        
        try:
            # Get predictions - returns list of dicts for each label
            results = self.pipeline(text)
            
            # Handle nested list result
            if isinstance(results[0], list):
                results = results[0]
            
            # Find the highest scoring prediction
            best_result = max(results, key=lambda x: x['score'])
            
            return self._map_stars_to_sentiment(best_result['label'], best_result['score'])
        except Exception as e:
            # Return neutral on error
            return {
                "sentiment": "neutral",
                "score": 3.0,
                "confidence": 0.0,
                "raw_label": "3 stars",
                "error": str(e)
            }
    
    def analyze_batch(self, texts: List[str]) -> List[Dict]:
        """
        Analyze sentiment of multiple texts.
        
        Args:
            texts: List of texts to analyze
            
        Returns:
            List of sentiment results
        """
        results = []
        for text in texts:
            results.append(self.analyze(text))
        return results
