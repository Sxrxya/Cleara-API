"""
Data Cleaning API Endpoint
Intelligent data cleaning with AI-powered corrections
"""

from fastapi import APIRouter, HTTPException, status, Depends
from typing import Dict, Any, List
import time
import re
from datetime import datetime

from app.models.schemas import CleanRequest, CleanResponse, CleanedRecord
from app.services.cleaning.cleaner import DataCleaner

from app.services.ai import get_ai_service
from app.services.analytics.logger import get_analytics
from app.services.workflow.orchestrator import get_workflow_service
from app.api.deps import validate_api_key
from app.db.models import User

router = APIRouter()


@router.post("/clean", response_model=CleanResponse, status_code=status.HTTP_200_OK)
async def clean_data(
    request: CleanRequest,
    user: User = Depends(validate_api_key)
):
    """
    Clean and normalize data
    
    This endpoint performs intelligent data cleaning including:
    - Trimming whitespace
    - Normalizing casing
    - Fixing common typos (emails, etc.)
    - Standardizing formats
    - Removing duplicates
    
    **Example Request:**
    ```json
    {
        "data": [
            {"name": "  john DOE  ", "email": "john@gmial.com"},
            {"name": "JANE SMITH", "email": "jane@example.com"}
        ],
        "options": {
            "trim": true,
            "normalize_case": true,
            "fix_emails": true
        }
    }
    ```
    
    **Example Response:**
    ```json
    {
        "success": true,
        "total_records": 2,
        "cleaned_records": 2,
        "changes_made": 3,
        "data": [
            {
                "original": {"name": "  john DOE  ", "email": "john@gmial.com"},
                "cleaned": {"name": "John Doe", "email": "john@gmail.com"},
                "changes": [
                    {"field": "name", "type": "trim", "description": "Removed whitespace"},
                    {"field": "name", "type": "case", "description": "Normalized to title case"},
                    {"field": "email", "type": "typo", "description": "Fixed 'gmial' -> 'gmail'"}
                ],
                "confidence": 0.95
            }
        ]
    }
    ```
    """
    start_time = time.time()
    
    analytics = get_analytics()
    
    try:
        # Check if advanced AI workflow is requested OR if we want it by default
        if request.options.use_ai_workflow:
            workflow_service = get_workflow_service()
            
            # Execute the 9-step workflow
            result = await workflow_service.execute(request.data, user.id)
            
            # Assembly CleanResponse format
            cleaned_records = [
                CleanedRecord(
                    original=request.data[i] if i < len(request.data) else {},
                    cleaned=rec,
                    changes=[],
                    confidence=result["metadata"].get("confidence", 0.95)
                ) for i, rec in enumerate(result["data"])
            ]
            
            return CleanResponse(
                success=True,
                total_records=len(request.data),
                cleaned_records=len(cleaned_records),
                changes_made=len(cleaned_records), # Placeholder
                data=cleaned_records,
                processing_time_ms=result["metadata"]["latency_ms"],
                workflow_metadata=result["metadata"]
            )

        # STANDARD WORKFLOW
        # Initialize cleaner
        cleaner = DataCleaner(options=request.options)
        
        # Clean each record
        cleaned_records: List[CleanedRecord] = []
        total_changes = 0
        
        for record in request.data:
            result = await cleaner.clean_record(record, explain=request.explain)
            cleaned_records.append(result)
            total_changes += len(result.changes)
        
        # Calculate processing time
        processing_time = (time.time() - start_time) * 1000
        analytics.log_request("/v1/clean", processing_time, 200, provider="rules")
        
        return CleanResponse(
            success=True,
            total_records=len(request.data),
            cleaned_records=len([r for r in cleaned_records if len(r.changes) > 0]),
            changes_made=total_changes,
            data=cleaned_records,
            processing_time_ms=round(processing_time, 2)
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Data cleaning failed: {str(e)}"
        )


@router.post("/clean/batch", status_code=status.HTTP_202_ACCEPTED)
async def clean_data_batch(request: CleanRequest):
    """
    Clean large datasets asynchronously
    
    For datasets larger than 1000 records, use this endpoint.
    Returns a job ID that can be used to check status.
    """
    # TODO: Implement async batch processing
    return {
        "success": True,
        "job_id": "job_123456",
        "status": "processing",
        "message": "Batch cleaning job started",
        "estimated_completion": "2-5 minutes"
    }
