"""
Analytics API Endpoint
Returns performance metrics (p50, p95, p99)
"""

from fastapi import APIRouter, Depends
from app.services.analytics.logger import get_analytics
from app.api.deps import get_current_user
from app.db.models import User

router = APIRouter()


@router.get("/metrics", tags=["Analytics"])
async def get_metrics(current_user: User = Depends(get_current_user)):
    """
    Get API performance metrics
    - p50, p95, p99 latency
    - Model usage distribution
    - Error rates
    """
    analytics = get_analytics()
    metrics = analytics.get_metrics()
    
    return {
        "success": True,
        "metrics": metrics
    }


@router.get("/status", tags=["Analytics"])
async def get_system_status():
    """Get overall system status"""
    return {
        "status": "operational",
        "services": {
            "api_gateway": "online",
            "cleaning_engine": "online",
            "ai_validation": "online",
            "deduplication": "online",
            "enrichment": "online"
        }
    }
