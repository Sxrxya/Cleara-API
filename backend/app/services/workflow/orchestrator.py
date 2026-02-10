"""
Cleara Workflow Service
Implements the 9-step Google/Gemini architecture
"""

import time
import json
from typing import Dict, Any, List, Optional
from app.services.ai.free_ai_service import get_ai_service
from app.services.preprocessing.sanitizer import Sanitizer
from app.services.analytics.logger import get_analytics
from app.services.deduplication.engine import get_dedupe_engine


class ClearaWorkflowService:
    """
    Orchestrator for the "Google/Gemini Architecture" 9-step workflow.
    """
    
    def __init__(self):
        self.ai = get_ai_service()
        self.sanitizer = Sanitizer()
        self.analytics = get_analytics()
        self.dedupe = get_dedupe_engine()

    async def execute(self, raw_data: List[Dict[str, Any]], user_id: str) -> Dict[str, Any]:
        """
        Execute the full 9-step workflow
        """
        start_time = time.time()
        
        # Step 1: Gateway (Handled by FastAPI deps)
        # Step 2: Preprocessing
        preprocessed_data = [self.sanitizer.to_canonical_json(r) for r in raw_data]
        
        # Step 3: Schema Detection (Using first record as sample)
        schema_info = await self.ai.detect_schema(preprocessed_data[0]) if preprocessed_data else {}
        
        # Step 4 & 5: Cleaning + Validation
        # Process in batches or individually
        cleaned_records = []
        for record in preprocessed_data:
            # AI Validation/Correction
            val_result = await self.ai.ai_validate(record)
            cleaned_record = val_result.get("corrected_values", record)
            cleaned_records.append(cleaned_record)
            
        # Step 6: Deduplication
        unique_records = await self.dedupe.detect_duplicates(cleaned_records)
        
        # Step 7: Enrichment
        final_records = []
        for record in unique_records:
            enrich_result = await self.ai.enrich_data(record)
            enriched_record = {**record, **enrich_result.get("enriched_fields", {})}
            final_records.append(enriched_record)
            
        # Step 8: Final Output Assembly
        # Step 9: Logging + Analytics
        latency = (time.time() - start_time) * 1000
        self.analytics.log_request("/v1/workflow", latency, 200, provider="google_groq_hybrid")
        
        return {
            "success": True,
            "data": final_records,
            "metadata": {
                "original_count": len(raw_data),
                "final_count": len(final_records),
                "schema": schema_info,
                "latency_ms": round(latency, 2),
                "provider": "Cleara Hybrid Engine (Gemini + Groq + HuggingFace)"
            }
        }


def get_workflow_service() -> ClearaWorkflowService:
    """Get Workflow Service instance"""
    return ClearaWorkflowService()
