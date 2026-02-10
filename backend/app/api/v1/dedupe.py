"""
Deduplication API Endpoint
AI-powered duplicate detection using embeddings
"""

from fastapi import APIRouter, HTTPException, status
import time

from app.models.schemas import DedupeRequest, DedupeResponse, DuplicateGroup
from app.services.deduplication.deduplicator import Deduplicator

router = APIRouter()


@router.post("/dedupe", response_model=DedupeResponse, status_code=status.HTTP_200_OK)
async def deduplicate_data(request: DedupeRequest):
    """
    Detect and remove duplicate records using AI
    
    Uses sentence embeddings and cosine similarity to find duplicates,
    even when records have typos or slight variations.
    
    **Example Request:**
    ```json
    {
        "data": [
            {"name": "John Doe", "company": "Acme Corp", "email": "john@acme.com"},
            {"name": "Jon Doe", "company": "ACME Corporation", "email": "john@acme.com"},
            {"name": "Jane Smith", "company": "TechCo", "email": "jane@techco.com"}
        ],
        "threshold": 0.85,
        "fields": ["name", "company"],
        "keep": "first"
    }
    ```
    
    **Example Response:**
    ```json
    {
        "success": true,
        "original_count": 3,
        "unique_count": 2,
        "duplicates_removed": 1,
        "duplicate_groups": [
            {
                "records": [
                    {"name": "John Doe", "company": "Acme Corp"},
                    {"name": "Jon Doe", "company": "ACME Corporation"}
                ],
                "similarity_scores": [0.92],
                "kept_record": {"name": "John Doe", "company": "Acme Corp"},
                "removed_count": 1
            }
        ],
        "data": [
            {"name": "John Doe", "company": "Acme Corp", "email": "john@acme.com"},
            {"name": "Jane Smith", "company": "TechCo", "email": "jane@techco.com"}
        ]
    }
    ```
    """
    start_time = time.time()
    
    try:
        # Initialize deduplicator
        deduplicator = Deduplicator(threshold=request.threshold)
        
        # Find duplicates
        result = await deduplicator.find_duplicates(
            data=request.data,
            fields=request.fields,
            keep=request.keep
        )
        
        # Calculate processing time
        processing_time = (time.time() - start_time) * 1000
        
        return DedupeResponse(
            success=True,
            original_count=len(request.data),
            unique_count=len(result['unique_records']),
            duplicates_removed=result['duplicates_removed'],
            duplicate_groups=result['duplicate_groups'],
            data=result['unique_records'],
            processing_time_ms=round(processing_time, 2)
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Deduplication failed: {str(e)}"
        )


@router.post("/dedupe/analyze", status_code=status.HTTP_200_OK)
async def analyze_duplicates(request: DedupeRequest):
    """
    Analyze duplicates without removing them
    
    Returns duplicate groups and similarity scores for review.
    """
    start_time = time.time()
    
    try:
        deduplicator = Deduplicator(threshold=request.threshold)
        
        # Analyze only, don't remove
        result = await deduplicator.analyze_duplicates(
            data=request.data,
            fields=request.fields
        )
        
        processing_time = (time.time() - start_time) * 1000
        
        return {
            "success": True,
            "total_records": len(request.data),
            "duplicate_groups_found": len(result['duplicate_groups']),
            "duplicate_groups": result['duplicate_groups'],
            "processing_time_ms": round(processing_time, 2)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Duplicate analysis failed: {str(e)}"
        )
