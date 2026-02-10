"""
AI-powered data cleaning endpoint
Uses free AI APIs (Hugging Face, Groq, Gemini)
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List
from app.services.ai import get_ai_service

router = APIRouter()


class AICleanRequest(BaseModel):
    """Request for AI-powered data cleaning"""
    data: Dict[str, Any] = Field(..., description="Data to clean")
    instructions: Optional[str] = Field(None, description="Custom cleaning instructions")
    provider: Optional[str] = Field(None, description="Force specific provider (groq/gemini/huggingface)")
    
    class Config:
        json_schema_extra = {
            "example": {
                "data": {
                    "name": "  john DOE  ",
                    "email": "john@gmial.com",
                    "phone": "123-456-7890"
                },
                "instructions": "Fix email typos and standardize phone format"
            }
        }


class AICleanResponse(BaseModel):
    """Response from AI cleaning"""
    cleaned_data: Dict[str, Any]
    provider_used: str
    success: bool


class EntityExtractionRequest(BaseModel):
    """Request for entity extraction"""
    text: str = Field(..., description="Text to extract entities from")
    
    class Config:
        json_schema_extra = {
            "example": {
                "text": "John Doe works at Google in New York. Contact: john@google.com"
            }
        }


class ClassificationRequest(BaseModel):
    """Request for text classification"""
    text: str = Field(..., description="Text to classify")
    labels: List[str] = Field(..., description="Possible labels")
    
    class Config:
        json_schema_extra = {
            "example": {
                "text": "This product is amazing! Best purchase ever!",
                "labels": ["positive", "negative", "neutral"]
            }
        }


class ValidationRequest(BaseModel):
    """Request for AI-powered validation"""
    data: Dict[str, Any] = Field(..., description="Data to validate")
    schema: Dict[str, Any] = Field(..., description="Schema to validate against")
    
    class Config:
        json_schema_extra = {
            "example": {
                "data": {
                    "email": "invalid-email",
                    "age": "twenty"
                },
                "schema": {
                    "email": {"type": "email"},
                    "age": {"type": "integer"}
                }
            }
        }


@router.post("/ai/clean", response_model=AICleanResponse, tags=["AI"])
async def ai_clean_data(request: AICleanRequest):
    """
    Clean data using AI (FREE!)
    
    Uses free AI providers:
    - Groq (ultra-fast, Llama 3.1 70B)
    - Gemini (generous free tier)
    - Hugging Face (unlimited)
    
    Automatically falls back if one provider fails.
    
    **Cost: $0** - Completely free!
    """
    
    try:
        ai_service = get_ai_service()
        
        # Get available providers
        available = ai_service.get_available_providers()
        if not available:
            raise HTTPException(
                status_code=503,
                detail="No AI providers configured. Please set API keys in .env"
            )
        
        # Clean data
        cleaned = await ai_service.clean_data(
            data=request.data,
            instructions=request.instructions,
            provider=request.provider
        )
        
        # Determine which provider was used
        provider_used = request.provider if request.provider else available[0]
        
        return AICleanResponse(
            cleaned_data=cleaned,
            provider_used=provider_used,
            success=True
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/ai/extract-entities", tags=["AI"])
async def extract_entities(request: EntityExtractionRequest):
    """
    Extract named entities from text (FREE!)
    
    Extracts:
    - Person names
    - Organizations
    - Locations
    - Emails
    - Phone numbers
    - Dates
    
    Uses Hugging Face NER model (free, unlimited)
    """
    
    try:
        ai_service = get_ai_service()
        entities = await ai_service.extract_entities(request.text)
        
        return {
            "entities": entities,
            "count": len(entities),
            "success": True
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/ai/classify", tags=["AI"])
async def classify_text(request: ClassificationRequest):
    """
    Classify text into categories (FREE!)
    
    Uses zero-shot classification - no training needed!
    
    Examples:
    - Sentiment analysis
    - Topic classification
    - Intent detection
    
    Uses Hugging Face (free, unlimited)
    """
    
    try:
        ai_service = get_ai_service()
        result = await ai_service.classify_data(
            text=request.text,
            labels=request.labels
        )
        
        return {
            "classification": result,
            "success": True
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/ai/validate", tags=["AI"])
async def ai_validate_data(request: ValidationRequest):
    """
    Validate data using AI (FREE!)
    
    AI will:
    - Check data against schema
    - Find errors
    - Suggest fixes
    
    Uses fastest available provider (Groq/Gemini)
    """
    
    try:
        ai_service = get_ai_service()
        validation = await ai_service.validate_data(
            data=request.data,
            schema=request.schema
        )
        
        return {
            "validation": validation,
            "success": True
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/ai/status", tags=["AI"])
async def get_ai_status():
    """
    Get AI service status
    
    Shows which providers are configured and available
    """
    
    try:
        ai_service = get_ai_service()
        status = ai_service.get_status()
        
        return {
            "status": status,
            "message": f"{status['total_providers']} provider(s) available",
            "success": True
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
