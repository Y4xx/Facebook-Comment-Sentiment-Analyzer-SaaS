from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base


class Comment(Base):
    """Comment model for storing individual comment sentiment results."""
    
    __tablename__ = "comments"
    
    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(Integer, ForeignKey("analyses.id"), nullable=False, index=True)
    comment_text = Column(Text, nullable=False)
    sentiment = Column(String(50), nullable=False)
    score = Column(Float, nullable=False)
    
    # Relationships
    analysis = relationship("Analysis", back_populates="comments")
    
    def __repr__(self):
        return f"<Comment(id={self.id}, sentiment={self.sentiment})>"
