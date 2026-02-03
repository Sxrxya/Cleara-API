"""
Schema Detection API Endpoint
AI-powered schema inference and field mapping
"""

from fastapi import APIRouter, HTTPException, status
import time

from app.models.schemas import SchemaDetectRequest, SchemaDetectResponse
from app.services.schema_detection.detector import SchemaDetector

router = APIRouter()


@router.post("/schema-detect", response_model=SchemaDetectResponse, status_code=status.HTTP_200_OK)
async def detect_schema(request: SchemaDetectRequest):
    """
    Automatically detect schema from sample data
    
    Analyzes sample records to:
    - Infer data types
    - Detect field variations (e.g., "email" vs "email_address")
    - Suggest standardized field names
    - Identify constraints (nullable, unique, etc.)
    
    **Example Request:**
    ```json
    {
        "data": [
            {"user_email": "john@example.com", "full_name": "John Doe", "age": 30},
            {"email": "jane@example.com", "name": "Jane Smith", "age": 25},
            {"email_address": "bob@example.com", "userName": "Bob", "age": null}
        ],
        "suggest_types": true,
        "suggest_constraints": true
    }
    ```
    
    **Example Response:**
    ```json
    {
        "success": true,
        "fields": [
            {
                "name": "email",
                "original_names": ["user_email", "email", "email_address"],
                "type": "email",
                "nullable": false,
                "constraints": {"format": "email"},
                "examples": ["john@example.com", "jane@example.com"],
                "confidence": 0.95
            },
            {
                "name": "name",
                "original_names": ["full_name", "name", "userName"],
                "type": "string",
                "nullable": false,
                "constraints": {"min_length": 1},
                "examples": ["John Doe", "Jane Smith"],
                "confidence": 0.90
            },
            {
                "name": "age",
                "original_names": ["age"],
                "type": "integer",
                "nullable": true,
                "constraints": {"min": 0, "max": 150},
                "examples": [30, 25],
                "confidence": 0.98
            }
        ],
        "suggested_mapping": {
            "user_email": "email",
            "email": "email",
            "email_address": "email",
            "full_name": "name",
            "name": "name",
            "userName": "name",
            "age": "age"
        },
        "confidence": 0.94
    }
    ```
    """
    start_time = time.time()
    
    try:
        # Initialize schema detector
        detector = SchemaDetector(
            suggest_types=request.suggest_types,
            suggest_constraints=request.suggest_constraints
        )
        
        # Detect schema
        result = await detector.detect_schema(data=request.data)
        
        # Calculate processing time
        processing_time = (time.time() - start_time) * 1000
        
        return SchemaDetectResponse(
            success=True,
            fields=result['fields'],
            suggested_mapping=result['mapping'],
            confidence=result['confidence'],
            processing_time_ms=round(processing_time, 2)
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Schema detection failed: {str(e)}"
        )


@router.post("/schema-detect/apply", status_code=status.HTTP_200_OK)
async def apply_schema_mapping(data: list, mapping: dict):
    """
    Apply a schema mapping to transform data
    
    Takes data and a field mapping to standardize field names.
    
    **Example Request:**
    ```json
    {
        "data": [
            {"user_email": "john@example.com", "full_name": "John Doe"}
        ],
        "mapping": {
            "user_email": "email",
            "full_name": "name"
        }
    }
    ```
    """
    try:
        transformed_data = []
        
        for record in data:
            transformed_record = {}
            for old_field, value in record.items():
                new_field = mapping.get(old_field, old_field)
                transformed_record[new_field] = value
            transformed_data.append(transformed_record)
        
        return {
            "success": True,
            "original_count": len(data),
            "transformed_count": len(transformed_data),
            "data": transformed_data
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Schema mapping failed: {str(e)}"
        )
