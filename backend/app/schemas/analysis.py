from pydantic import BaseModel, HttpUrl
from datetime import datetime
from typing import List, Optional


class AnalysisCreate(BaseModel):
    """Schema for creating a new analysis."""
    facebook_post_url: str


class CommentResponse(BaseModel):
    """Schema for comment sentiment response."""
    id: int
    comment_text: str
    sentiment: str
    score: float
    
    class Config:
        from_attributes = True


class AnalysisResponse(BaseModel):
    """Schema for analysis response with details."""
    id: int
    post_url: str
    overall_sentiment: Optional[str]
    overall_score: Optional[float]
    positive_count: int
    neutral_count: int
    negative_count: int
    total_comments: int
    created_at: datetime
    comments: List[CommentResponse] = []
    
    class Config:
        from_attributes = True


class AnalysisListResponse(BaseModel):
    """Schema for analysis list response (without comments)."""
    id: int
    post_url: str
    overall_sentiment: Optional[str]
    overall_score: Optional[float]
    positive_count: int
    neutral_count: int
    negative_count: int
    total_comments: int
    created_at: datetime
    
    class Config:
        from_attributes = True
