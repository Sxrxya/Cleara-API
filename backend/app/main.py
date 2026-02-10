"""
Cleara API - Main Application Entry Point
FastAPI application with comprehensive middleware, routing, and configuration
"""

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from contextlib import asynccontextmanager
import time
import logging
from typing import AsyncGenerator

from app.core.config import settings
from app.core.logging import setup_logging
from app.api.v1 import clean, validate, dedupe, schema, enrich, usage, health, ai, analytics, auth, upload, aiops, correlation, aiops_testing, ml_correlation, integrations  # , cleara

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator:
    """Application lifespan events"""
    # Startup
    logger.info("🚀 Starting Cleara API...")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"Version: {settings.VERSION}")
    
    # Initialize services
    # TODO: Load ML models
    # TODO: Initialize database connections
    # TODO: Initialize cache
    
    yield
    
    # Shutdown
    logger.info("🛑 Shutting down Cleara API...")
    # TODO: Cleanup resources


# Create FastAPI application
app = FastAPI(
    title="Cleara API",
    description="AI-Powered Data Cleaning Platform - Make Your Data Make Sense",
    version=settings.VERSION,
    docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT != "production" else None,
    openapi_url="/openapi.json" if settings.ENVIRONMENT != "production" else None,
    lifespan=lifespan,
)


# ============================================================================
# MIDDLEWARE
# ============================================================================

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GZip Compression
app.add_middleware(GZipMiddleware, minimum_size=1000)


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    """Add X-Process-Time header to all responses"""
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = f"{process_time:.4f}"
    return response


@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all incoming requests"""
    logger.info(
        f"Request: {request.method} {request.url.path}",
        extra={
            "method": request.method,
            "path": request.url.path,
            "client": request.client.host if request.client else None,
        }
    )
    response = await call_next(request)
    logger.info(
        f"Response: {response.status_code}",
        extra={"status_code": response.status_code}
    )
    return response


# ============================================================================
# EXCEPTION HANDLERS
# ============================================================================

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors"""
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "validation_error",
            "message": "Invalid request data",
            "details": exc.errors(),
        },
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle all unhandled exceptions"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "internal_server_error",
            "message": "An unexpected error occurred",
            "request_id": request.headers.get("X-Request-ID", "unknown"),
        },
    )


# ============================================================================
# ROUTES
# ============================================================================

# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """Root endpoint - API information"""
    return {
        "name": "Cleara API",
        "version": settings.VERSION,
        "description": "AI-Powered Data Cleaning Platform",
        "tagline": "Make Your Data Make Sense",
        "docs": "/docs" if settings.ENVIRONMENT != "production" else None,
        "status": "operational",
    }


# Health check
app.include_router(health.router, prefix="/health", tags=["Health"])

# API v1 routes
app.include_router(auth.router, prefix="/v1/auth", tags=["Authentication"])
app.include_router(clean.router, prefix="/v1", tags=["Clean"])
app.include_router(validate.router, prefix="/v1", tags=["Validate"])
app.include_router(dedupe.router, prefix="/v1", tags=["Deduplicate"])
app.include_router(schema.router, prefix="/v1", tags=["Schema"])
app.include_router(enrich.router, prefix="/v1", tags=["Enrich"])
app.include_router(usage.router, prefix="/v1", tags=["Usage"])
app.include_router(ai.router, prefix="/v1", tags=["AI"])
app.include_router(analytics.router, prefix="/v1/analytics", tags=["Analytics"])
app.include_router(upload.router, prefix="/v1/upload", tags=["File Upload"])
app.include_router(aiops.router, prefix="/v1/aiops", tags=["AIOps Ingestion"])
app.include_router(correlation.router, prefix="/v1/correlation", tags=["AIOps Correlation"])
app.include_router(aiops_testing.router, prefix="/v1/testing", tags=["AIOps Testing"])
app.include_router(ml_correlation.router, prefix="/v1", tags=["ML Correlation"])
app.include_router(integrations.router, prefix="/v1/integrations", tags=["Integrations"])
# app.include_router(cleara.router, prefix="/cleara", tags=["Cleara Intelligence"])


# ============================================================================
# STARTUP MESSAGE
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.ENVIRONMENT == "development",
        log_level="info",
    )
