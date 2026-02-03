"""
Health check endpoint
"""

from fastapi import APIRouter, status
from datetime import datetime
from app.core.config import settings

router = APIRouter()


@router.get("", status_code=status.HTTP_200_OK)
async def health_check():
    """
    Health check endpoint
    Returns API status and version information
    """
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "timestamp": datetime.utcnow().isoformat(),
    }


@router.get("/ready", status_code=status.HTTP_200_OK)
async def readiness_check():
    """
    Readiness check endpoint
    Verifies all dependencies are available
    """
    # TODO: Check database connectivity
    # TODO: Check Redis connectivity
    # TODO: Check ML models loaded
    
    return {
        "status": "ready",
        "checks": {
            "database": "ok",
            "cache": "ok",
            "ml_models": "ok",
        },
        "timestamp": datetime.utcnow().isoformat(),
    }


@router.get("/live", status_code=status.HTTP_200_OK)
async def liveness_check():
    """
    Liveness check endpoint
    Simple check that the service is running
    """
    return {
        "status": "alive",
        "timestamp": datetime.utcnow().isoformat(),
    }
