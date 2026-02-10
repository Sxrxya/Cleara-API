"""
Deduplication Engine for Cleara
Uses embeddings and cosine similarity with AI field resolution
"""

import numpy as np
from typing import List, Dict, Any, Optional
from app.services.ai import get_ai_service

class DeduplicationEngine:
    """
    Step 6: Deduplication Engine (Groq/Gemini Hybrid)
    """

    def __init__(self):
        self.ai_service = get_ai_service()

    def cosine_similarity(self, v1: List[float], v2: List[float]) -> float:
        """Compute cosine similarity between two vectors"""
        v1 = np.array(v1)
        v2 = np.array(v2)
        return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))

    async def detect_duplicates(
        self, 
        data: List[Dict[str, Any]], 
        threshold: float = 0.85
    ) -> List[Dict[str, Any]]:
        """
        1. Generate embeddings (using Gemini text-embedding-004)
        2. Compute similarity
        3. Resolve conflicts via Gemini
        """
        if not data:
            return []

        # 1. Generate text representation for embeddings
        texts = [
            " ".join([str(v) for v in r.values() if v])
            for r in data
        ]
        
        # 2. Get all embeddings
        embeddings = []
        for text in texts:
            emb = await self.ai_service.get_embeddings(text)
            embeddings.append(emb)
            
        # 3. Find groups
        unique_records = []
        visited = [False] * len(data)
        
        for i in range(len(data)):
            if visited[i]:
                continue
                
            group = [data[i]]
            visited[i] = True
            
            for j in range(i + 1, len(data)):
                if visited[j]:
                    continue
                    
                similarity = self.cosine_similarity(embeddings[i], embeddings[j])
                if similarity >= threshold:
                    group.append(data[j])
                    visited[j] = True
            
            # 4. Resolve group into master record
            if len(group) > 1:
                master = await self.resolve_conflicts(group)
                unique_records.append(master)
            else:
                unique_records.append(group[0])
                
        return unique_records

    async def resolve_conflicts(self, group: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Use Gemini to pick best fields from duplicates"""
        import json
        
        prompt = f"""
        Merge these duplicate records into one 'master' record.
        Pick the most complete and accurate values for each field.
        
        Duplicates: {json.dumps(group)}
        
        Return ONLY the resolved JSON master record.
        """
        
        # We use Gemini for this reasoning task
        response = await self.ai_service.gemini_model.generate_content_async(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        
        try:
            return json.loads(response.text)
        except:
            # Fallback to first one
            return group[0]


def get_dedupe_engine() -> DeduplicationEngine:
    """Get Dedupe engine instance"""
    return DeduplicationEngine()
