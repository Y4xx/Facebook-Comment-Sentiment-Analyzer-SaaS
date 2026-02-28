from sqlalchemy import Column, Integer, String, DateTime, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Analysis(Base):
    """Analysis model for storing sentiment analysis results."""
    
    __tablename__ = "analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    post_url = Column(String(500), nullable=False)
    overall_sentiment = Column(String(50), nullable=True)
    overall_score = Column(Float, nullable=True)
    positive_count = Column(Integer, default=0)
    neutral_count = Column(Integer, default=0)
    negative_count = Column(Integer, default=0)
    total_comments = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    comments = relationship("Comment", back_populates="analysis", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Analysis(id={self.id}, post_url={self.post_url[:50]})>"
