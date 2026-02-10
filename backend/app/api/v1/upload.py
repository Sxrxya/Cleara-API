"""
File Upload Endpoint
Accepts various file types for AI processing
"""

from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from typing import Optional, List
import os
import tempfile
from pathlib import Path

from app.api.deps import validate_api_key
from app.db.models import User
from app.services.ai.free_ai_service import get_ai_service

router = APIRouter()

# Allowed file types
ALLOWED_EXTENSIONS = {
    'text': ['.txt', '.csv', '.json', '.xml', '.log'],
    'document': ['.pdf', '.doc', '.docx'],
    'image': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'],
    'spreadsheet': ['.xlsx', '.xls'],
    'code': ['.py', '.js', '.html', '.css', '.java', '.cpp']
}

ALL_ALLOWED = [ext for exts in ALLOWED_EXTENSIONS.values() for ext in exts]


@router.post("/upload", tags=["File Upload"])
async def upload_file(
    file: UploadFile = File(...),
    instructions: Optional[str] = None,
    user: User = Depends(validate_api_key)
):
    """
    Upload and process a file
    
    **Supported file types:**
    - Text: .txt, .csv, .json, .xml, .log
    - Documents: .pdf, .doc, .docx
    - Images: .jpg, .png, .gif, .webp
    - Spreadsheets: .xlsx, .xls
    - Code: .py, .js, .html, .css
    
    **Parameters:**
    - file: The file to upload
    - instructions: Optional processing instructions
    """
    
    # Check file extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALL_ALLOWED:
        raise HTTPException(
            status_code=400,
            detail=f"File type {file_ext} not supported. Allowed: {', '.join(ALL_ALLOWED)}"
        )
    
    # Read file content
    try:
        content = await file.read()
        file_size = len(content)
        
        # Check file size (max 10MB)
        if file_size > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=400,
                detail="File too large. Maximum size is 10MB"
            )
        
        # Determine file type
        file_type = None
        for category, extensions in ALLOWED_EXTENSIONS.items():
            if file_ext in extensions:
                file_type = category
                break
        
        # Process based on file type
        if file_type == 'text':
            # Text files - read as string
            text_content = content.decode('utf-8')
            result = {
                "filename": file.filename,
                "type": file_type,
                "size": file_size,
                "content_preview": text_content[:500] + "..." if len(text_content) > 500 else text_content,
                "line_count": len(text_content.split('\n')),
                "char_count": len(text_content)
            }
            
        elif file_type == 'image':
            # Image files - return metadata
            result = {
                "filename": file.filename,
                "type": file_type,
                "size": file_size,
                "format": file_ext[1:].upper(),
                "message": "Image uploaded successfully. Use /cleara/vision endpoint for analysis."
            }
            
        elif file_type == 'document':
            # Document files - basic info
            result = {
                "filename": file.filename,
                "type": file_type,
                "size": file_size,
                "format": file_ext[1:].upper(),
                "message": "Document uploaded successfully. Use /cleara/document endpoint for analysis."
            }
            
        else:
            # Other files
            result = {
                "filename": file.filename,
                "type": file_type,
                "size": file_size,
                "format": file_ext[1:].upper()
            }
        
        return {
            "success": True,
            "file": result,
            "instructions": instructions or "No specific instructions provided"
        }
        
    except UnicodeDecodeError:
        raise HTTPException(
            status_code=400,
            detail="Unable to decode file. Please ensure it's a valid text file."
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing file: {str(e)}"
        )


@router.post("/upload/multiple", tags=["File Upload"])
async def upload_multiple_files(
    files: List[UploadFile] = File(...),
    instructions: Optional[str] = None,
    user: User = Depends(validate_api_key)
):
    """
    Upload and process multiple files at once
    
    **Parameters:**
    - files: List of files to upload (max 5 files)
    - instructions: Optional processing instructions
    """
    
    if len(files) > 5:
        raise HTTPException(
            status_code=400,
            detail="Maximum 5 files allowed per request"
        )
    
    results = []
    total_size = 0
    
    for file in files:
        # Check file extension
        file_ext = Path(file.filename).suffix.lower()
        if file_ext not in ALL_ALLOWED:
            results.append({
                "filename": file.filename,
                "success": False,
                "error": f"File type {file_ext} not supported"
            })
            continue
        
        # Read file
        try:
            content = await file.read()
            file_size = len(content)
            total_size += file_size
            
            # Check total size
            if total_size > 20 * 1024 * 1024:
                raise HTTPException(
                    status_code=400,
                    detail="Total file size exceeds 20MB limit"
                )
            
            results.append({
                "filename": file.filename,
                "success": True,
                "size": file_size,
                "type": Path(file.filename).suffix[1:].upper()
            })
            
        except Exception as e:
            results.append({
                "filename": file.filename,
                "success": False,
                "error": str(e)
            })
    
    return {
        "success": True,
        "files_processed": len([r for r in results if r.get("success")]),
        "total_files": len(files),
        "total_size": total_size,
        "results": results,
        "instructions": instructions
    }
