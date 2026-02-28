from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Database
    DATABASE_URL: str = "sqlite:///./sentiment_analyzer.db"
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 10
    
    # Model Configuration
    SENTIMENT_MODEL: str = "nlptown/bert-base-multilingual-uncased-sentiment"
    
    # CORS
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"
    
    class Config:
        env_file = ".env"


settings = Settings()
