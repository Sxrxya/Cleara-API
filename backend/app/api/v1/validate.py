"""
Data Validation API Endpoint
Validate data against rules and schemas
"""

from fastapi import APIRouter, HTTPException, status
import time

from app.models.schemas import ValidateRequest, ValidateResponse, FieldValidation
from app.services.validation.validator import DataValidator

router = APIRouter()


@router.post("/validate", response_model=ValidateResponse, status_code=status.HTTP_200_OK)
async def validate_data(request: ValidateRequest):
    """
    Validate data against specified rules
    
    Supports validation for:
    - Email addresses
    - Phone numbers
    - URLs
    - Dates
    - Names
    - Addresses
    - Custom patterns
    
    **Example Request:**
    ```json
    {
        "data": {
            "email": "test@example.com",
            "phone": "+1234567890",
            "name": "John Doe",
            "website": "https://example.com"
        },
        "rules": [
            {"field": "email", "type": "email", "required": true},
            {"field": "phone", "type": "phone", "required": true},
            {"field": "name", "type": "name", "required": true},
            {"field": "website", "type": "url", "required": false}
        ]
    }
    ```
    
    **Example Response:**
    ```json
    {
        "success": true,
        "valid": true,
        "fields": [
            {
                "field": "email",
                "valid": true,
                "value": "test@example.com",
                "error": null,
                "suggestion": null
            },
            {
                "field": "phone",
                "valid": false,
                "value": "+1234567890",
                "error": "Invalid phone number format",
                "suggestion": "+1 (234) 567-890"
            }
        ],
        "errors_count": 1
    }
    ```
    """
    start_time = time.time()
    
    try:
        # Initialize validator
        validator = DataValidator()
        
        # Validate each field
        field_results = []
        errors_count = 0
        
        for rule in request.rules:
            result = await validator.validate_field(
                field=rule.field,
                value=request.data.get(rule.field),
                rule=rule,
                strict=request.strict
            )
            field_results.append(result)
            
            if not result.valid:
                errors_count += 1
                if request.strict:
                    break
        
        # Calculate processing time
        processing_time = (time.time() - start_time) * 1000
        
        return ValidateResponse(
            success=True,
            valid=errors_count == 0,
            fields=field_results,
            errors_count=errors_count,
            processing_time_ms=round(processing_time, 2)
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Validation failed: {str(e)}"
        )
