"""
Free AI Service - Hugging Face + Groq + Gemini
Uses completely free AI APIs for data cleaning and processing
"""

from typing import Optional, Dict, Any, List
import os
import json
from huggingface_hub import InferenceClient
from groq import Groq
import google.generativeai as genai
from app.core.config import settings


class FreeAIService:
    """
    Multi-provider free AI service with automatic fallbacks
    
    Providers:
    1. Hugging Face - Unlimited requests (rate-limited)
    2. Groq - 14,400 requests/day, ultra-fast
    3. Gemini - 1M tokens/month
    
    Total cost: $0/month
    """
    
    def __init__(self):
        # Initialize Hugging Face
        hf_token = settings.HUGGINGFACE_API_KEY
        if hf_token:
            self.hf_client = InferenceClient(token=hf_token)
            self.hf_available = True
        else:
            self.hf_available = False
        
        # Initialize Groq
        groq_key = settings.GROQ_API_KEY
        if groq_key:
            self.groq_client = Groq(api_key=groq_key)
            self.groq_available = True
        else:
            self.groq_available = False
        
        # Initialize Gemini
        gemini_key = settings.GOOGLE_API_KEY
        if gemini_key:
            genai.configure(api_key=gemini_key)
            try:
                self.gemini_model = genai.GenerativeModel('gemini-1.5-flash')
                self.gemini_available = True
            except Exception:
                self.gemini_available = False
        else:
            self.gemini_available = False
        
        # Model configurations
        self.hf_models = {
            "text_generation": "Qwen/Qwen2.5-72B-Instruct",
            "ner": "dslim/bert-base-NER",
            "classification": "facebook/bart-large-mnli",
            "cleaning": "mistralai/Mistral-7B-Instruct-v0.3"
        }
        
        self.groq_model = "llama-3.1-70b-versatile"
        
    # ============================================================================
    # STEP 3: SCHEMA DETECTION (Gemini + Groq)
    # ============================================================================
    
    async def detect_schema(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Identify correct field structure and rename inconsistent keys.
        Gemini -> Best for reasoning + structure
        Groq -> Best for validation
        """
        
        # 1. Ask Gemini for structure and mapping
        gemini_prompt = f"""
        Identify the correct field structure and canonical field names for this data.
        Rename inconsistent keys to standard industry names (e.g., 'fname' to 'first_name').
        
        Data Sample: {json.dumps(data)}
        
        Return valid JSON with:
        {{
            "schema": {{ "original_key": "canonical_key" }},
            "types": {{ "canonical_key": "type" }},
            "confidence": 0.0-1.0
        }}
        """
        
        gemini_resp = await self.gemini_model.generate_content_async(
            gemini_prompt,
            generation_config=genai.GenerationConfig(
                temperature=0.1,
                response_mime_type="application/json"
            )
        )
        
        mapping = json.loads(gemini_resp.text)
        
        # 2. Use Groq to validate the mapping (Cross-verify)
        if self.groq_available:
            groq_prompt = f"""
            Validate this schema mapping. Is it logical?
            Mapping: {json.dumps(mapping)}
            Data: {json.dumps(data)}
            
            Return ONLY a boolean 'is_valid' and optional 'adjustments' in JSON.
            """
            
            groq_resp = self.groq_client.chat.completions.create(
                model=self.groq_model,
                messages=[{"role": "user", "content": groq_prompt}],
                temperature=0.0
            )
            validation = json.loads(groq_resp.choices[0].message.content)
            
            if not validation.get("is_valid", True):
                if "adjustments" in validation:
                    mapping.update(validation["adjustments"])
        
        return mapping

    # ============================================================================
    # STEP 5: AI VALIDATION LAYER (Gemini Reasoning + Groq Speed)
    # ============================================================================
    
    async def ai_validate(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate and correct data formats.
        Gemini corrects complex errors, Groq accelerates simple ones.
        """
        
        prompt = f"""
        Validate and correct these values. 
        - Fix email typos (gmial.com -> gmail.com)
        - Standardize phone numbers (+country code)
        - Format addresses
        
        Data: {json.dumps(data)}
        
        Return JSON of corrected values and valid/invalid status for each field.
        """
        
        # We use Gemini for the heavy reasoning part of correction
        response = await self.gemini_model.generate_content_async(
            prompt,
            generation_config=genai.GenerationConfig(
                temperature=0.1,
                response_mime_type="application/json"
            )
        )
        
        return json.loads(response.text)

    # ============================================================================
    # STEP 6: DEDUPLICATION ENGINE (Groq Embeddings)
    # ============================================================================
    
    async def get_embeddings(self, text: str) -> List[float]:
        """
        Generate embeddings using Groq-accelerated models (if available)
        Currently fall back to Hugging Face or Gemini for embeddings 
        as Groq is mainly for chat completions.
        """
        # Using Gemini for high-quality embeddings as Groq doesn't provide an embedding endpoint yet
        result = genai.embed_content(
            model="models/text-embedding-004",
            content=text,
            task_type="retrieval_document"
        )
        return result['embedding']

    # ============================================================================
    # STEP 7: ENRICHMENT ENGINE (Gemini)
    # ============================================================================
    
    async def enrich_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Predict missing fields based on context.
        """
        
        prompt = f"""
        Enrich this data by predicting missing fields.
        - Infer country/city from phone or postal code.
        - Determine business sector from company name.
        - Fill incomplete names if obvious.
        
        Input: {json.dumps(data)}
        
        Return JSON of enriched fields + confidence scores.
        """
        
        response = await self.gemini_model.generate_content_async(
            prompt,
            generation_config=genai.GenerationConfig(
                temperature=0.2,
                response_mime_type="application/json"
            )
        )
        
        return json.loads(response.text)

    # ============================================================================
    # STEP 8 & 9: FULL WORKFLOW ORCHESTRATOR
    # ============================================================================

    async def execute_complete_workflow(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        The 9-step internal workflow implementation.
        """
        try:
            # Step 1 & 2: Preprocessing (Done outside or passed in)
            # Assuming sanitizer was already run or we run it here
            from app.services.preprocessing.sanitizer import get_sanitizer
            sanitizer = get_sanitizer()
            normalized_data = sanitizer.to_canonical_json(raw_data)
            
            # Step 3: Schema Detection
            schema_info = await self.detect_schema(normalized_data)
            
            # Step 4 & 5: Cleaning & Validation
            validation_result = await self.ai_validate(normalized_data)
            cleaned_data = validation_result.get("corrected_values", normalized_data)
            
            # Step 7: Enrichment
            enrichment_result = await self.enrich_data(cleaned_data)
            
            # Final Output Construction (Step 8)
            final_output = {
                **cleaned_data,
                **enrichment_result.get("enriched_fields", {})
            }
            
            return {
                "success": True,
                "data": final_output,
                "metadata": {
                    "schema": schema_info,
                    "validation": validation_result.get("validation_status", {}),
                    "confidence": enrichment_result.get("confidence", 0.9)
                }
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def clean_data(
        self,
        data: Dict[str, Any],
        instructions: Optional[str] = None,
        provider: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Clean data using free AI providers
        
        Args:
            data: Data to clean
            instructions: Optional cleaning instructions
            provider: Force specific provider ("groq", "gemini", "huggingface")
        
        Returns:
            Cleaned data as dict
        """
        
        # Determine provider order
        if provider:
            providers = [provider]
        else:
            # Try fastest first
            providers = []
            if self.groq_available:
                providers.append("groq")
            if self.gemini_available:
                providers.append("gemini")
            if self.hf_available:
                providers.append("huggingface")
        
        # Try each provider
        for prov in providers:
            try:
                if prov == "groq" and self.groq_available:
                    return await self._clean_with_groq(data, instructions)
                elif prov == "gemini" and self.gemini_available:
                    return await self._clean_with_gemini(data, instructions)
                elif prov == "huggingface" and self.hf_available:
                    return await self._clean_with_hf(data, instructions)
            except Exception as e:
                print(f"Provider {prov} failed: {e}, trying next...")
                # Fallback to Hugging Face if everything fails
                if self.hf_available and prov != "huggingface":
                    try:
                        return await self._clean_with_hf(data, instructions)
                    except:
                        pass
                continue
        
        
        # FALLBACK: If all fail, return mock simulation (for Playground/Demo)
        print("⚠️ All AI providers failed. Using internal fallback simulation.")
        return self._internal_fallback_clean(data, instructions)

    def _internal_fallback_clean(self, data: Dict[str, Any], instructions: Optional[str]) -> Dict[str, Any]:
        """Simulation fallback when no AI is available"""
        import copy
        cleaned = copy.deepcopy(data)
        
        # Helper to clean strings
        def clean_val(v):
            if isinstance(v, str):
                v = v.strip()
                # Basic email normalization
                if '@' in v and '.' in v:
                    v = v.lower()
                # Basic name capitalization
                if 'name' in str(v).lower() and ' ' in v:
                    v = v.title()
                return v
            return v

        # Recursive cleaning
        if isinstance(cleaned, dict):
            # Check for "records" or "data" list wrappers
            target_list = None
            if 'records' in cleaned and isinstance(cleaned['records'], list):
                target_list = cleaned['records']
            elif 'data' in cleaned and isinstance(cleaned['data'], list):
                target_list = cleaned['data']
            
            if target_list:
                # Process list of records
                new_list = []
                for rec in target_list:
                    if isinstance(rec, dict):
                        new_list.append({k: clean_val(v) for k, v in rec.items()})
                    else:
                        new_list.append(rec)
                
                if 'records' in cleaned: cleaned['records'] = new_list
                else: cleaned['data'] = new_list
            else:
                # Process single dict
                cleaned = {k: clean_val(v) for k, v in cleaned.items()}
        
        # Add metadata to indicate fallback
        if isinstance(cleaned, dict):
            cleaned['_meta'] = {
                "provider": "Local Fallback Rules",
                "note": "AI Providers unavailable/failed. Performed basic rule-based cleaning.",
                "status": "partial_success"
            }
            
        return cleaned
    
    async def _clean_with_groq(
        self,
        data: Dict[str, Any],
        instructions: Optional[str]
    ) -> Dict[str, Any]:
        """Clean data using Groq (ultra-fast, free)"""
        
        prompt = f"""
        Clean this data and return ONLY valid JSON.
        
        Data: {json.dumps(data)}
        {f'Instructions: {instructions}' if instructions else ''}
        
        Tasks:
        - Remove extra whitespace
        - Standardize formatting
        - Fix common typos
        - Normalize case appropriately
        - Remove duplicates
        
        Return only the cleaned JSON object, no explanations.
        """
        
        response = self.groq_client.chat.completions.create(
            model=self.groq_model,
            messages=[
                {
                    "role": "system",
                    "content": "You are a data cleaning expert. Return only valid JSON."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.1,
            max_tokens=2000
        )
        
        result = response.choices[0].message.content
        
        # Try to parse as JSON
        try:
            return json.loads(result)
        except:
            # If not valid JSON, return original with note
            return {
                "cleaned_data": result,
                "note": "AI returned non-JSON response"
            }
    
    async def _clean_with_gemini(
        self,
        data: Dict[str, Any],
        instructions: Optional[str]
    ) -> Dict[str, Any]:
        """Clean data using Gemini (generous free tier)"""
        
        prompt = f"""
        Clean this data and return valid JSON.
        
        Data: {json.dumps(data)}
        {f'Instructions: {instructions}' if instructions else ''}
        
        Clean the data by:
        - Trimming whitespace
        - Fixing formatting
        - Correcting typos
        - Standardizing values
        """
        
        response = await self.gemini_model.generate_content_async(
            prompt,
            generation_config=genai.GenerationConfig(
                temperature=0.1,
                response_mime_type="application/json"
            )
        )
        
        try:
            return json.loads(response.text)
        except:
            return {"cleaned_data": response.text}
    
    async def _clean_with_hf(
        self,
        data: Dict[str, Any],
        instructions: Optional[str]
    ) -> Dict[str, Any]:
        """Clean data using Hugging Face (unlimited, free)"""
        
        prompt = f"""
        Clean this data and return JSON:
        {json.dumps(data)}
        {f'Instructions: {instructions}' if instructions else ''}
        """
        
        response = self.hf_client.text_generation(
            prompt,
            model=self.hf_models["text_generation"],
            max_new_tokens=1000,
            temperature=0.1
        )
        
        try:
            return json.loads(response)
        except:
            return {"cleaned_data": response}
    
    async def extract_entities(self, text: str) -> List[Dict[str, Any]]:
        """
        Extract named entities (names, emails, locations, etc.)
        Uses Hugging Face NER model (free)
        """
        
        if not self.hf_available:
            raise Exception("Hugging Face not configured")
        
        entities = self.hf_client.token_classification(
            text,
            model=self.hf_models["ner"]
        )
        
        return entities
    
    async def classify_data(
        self,
        text: str,
        labels: List[str]
    ) -> Dict[str, Any]:
        """
        Classify text into categories
        Uses Hugging Face zero-shot classification (free)
        """
        
        if not self.hf_available:
            raise Exception("Hugging Face not configured")
        
        result = self.hf_client.zero_shot_classification(
            text,
            candidate_labels=labels,
            model=self.hf_models["classification"]
        )
        
        return result
    
    async def validate_data(
        self,
        data: Dict[str, Any],
        schema: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Validate data against schema using AI
        """
        
        prompt = f"""
        Validate this data against the schema.
        
        Data: {json.dumps(data)}
        Schema: {json.dumps(schema)}
        
        Return JSON with:
        {{
            "is_valid": boolean,
            "errors": [list of validation errors],
            "suggestions": [list of fixes]
        }}
        """
        
        # Use fastest available provider
        if self.groq_available:
            response = self.groq_client.chat.completions.create(
                model=self.groq_model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1
            )
            result = response.choices[0].message.content
        elif self.gemini_available:
            response = await self.gemini_model.generate_content_async(
                prompt,
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json"
                )
            )
            result = response.text
        else:
            raise Exception("No AI provider available")
        
        try:
            return json.loads(result)
        except:
            return {"is_valid": False, "errors": ["AI validation failed"]}
    
    def get_available_providers(self) -> List[str]:
        """Get list of configured providers"""
        providers = []
        if self.hf_available:
            providers.append("huggingface")
        if self.groq_available:
            providers.append("groq")
        if self.gemini_available:
            providers.append("gemini")
        return providers
    
    def get_status(self) -> Dict[str, Any]:
        """Get service status"""
        return {
            "huggingface": {
                "available": self.hf_available,
                "models": self.hf_models if self.hf_available else None
            },
            "groq": {
                "available": self.groq_available,
                "model": self.groq_model if self.groq_available else None
            },
            "gemini": {
                "available": self.gemini_available,
                "model": "gemini-1.5-flash" if self.gemini_available else None
            },
            "total_providers": len(self.get_available_providers())
        }


# Global instance
_ai_service = None

def get_ai_service() -> FreeAIService:
    """Get or create AI service instance"""
    global _ai_service
    if _ai_service is None:
        _ai_service = FreeAIService()
    return _ai_service
