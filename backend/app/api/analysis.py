from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.database import get_db
from app.schemas.analysis import AnalysisCreate, AnalysisResponse, AnalysisListResponse
from app.services.analysis import AnalysisService

router = APIRouter(prefix="/analyses", tags=["Analysis"])

# Rate limiter
limiter = Limiter(key_func=get_remote_address)


@router.post("", response_model=AnalysisResponse, status_code=status.HTTP_201_CREATED)
async def analyze_post(
    analysis_data: AnalysisCreate,
    db: Session = Depends(get_db)
):
    """
    Analyze sentiment of comments on a Facebook post.
    
    - **facebook_post_url**: The URL of the Facebook post to analyze
    
    This endpoint will:
    1. Extract comments from the post
    2. Run BERT sentiment analysis on each comment
    3. Calculate overall sentiment statistics
    4. Store results in the database
    """
    service = AnalysisService(db)
    
    try:
        analysis = service.analyze_post(analysis_data.facebook_post_url)
        return analysis
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error analyzing post: {str(e)}"
        )


@router.get("", response_model=List[AnalysisListResponse])
async def get_analyses(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """
    Get all analyses.
    
    - **skip**: Number of records to skip (pagination)
    - **limit**: Maximum number of records to return
    """
    service = AnalysisService(db)
    analyses = service.get_all_analyses(skip, limit)
    return analyses


@router.get("/{analysis_id}", response_model=AnalysisResponse)
async def get_analysis(
    analysis_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific analysis by ID.
    
    - **analysis_id**: The ID of the analysis to retrieve
    """
    service = AnalysisService(db)
    analysis = service.get_analysis_by_id(analysis_id)
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    return analysis
