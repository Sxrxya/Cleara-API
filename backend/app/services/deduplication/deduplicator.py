"""
Deduplication Service
AI-powered duplicate detection using sentence embeddings
"""

from typing import Dict, Any, List, Optional
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import json

from app.models.schemas import DuplicateGroup


class Deduplicator:
    """AI-powered deduplication service"""
    
    def __init__(self, threshold: float = 0.85):
        self.threshold = threshold
        self.model = None
        self._load_model()
    
    def _load_model(self):
        """Load sentence transformer model"""
        try:
            from sentence_transformers import SentenceTransformer
            # Use lightweight model for fast inference
            self.model = SentenceTransformer('all-MiniLM-L6-v2')
        except Exception as e:
            print(f"Warning: Could not load embedding model: {e}")
            print("Falling back to simple string comparison")
            self.model = None
    
    async def find_duplicates(
        self,
        data: List[Dict[str, Any]],
        fields: Optional[List[str]] = None,
        keep: str = "first"
    ) -> Dict[str, Any]:
        """
        Find and remove duplicates
        
        Args:
            data: List of records
            fields: Specific fields to compare (None = all fields)
            keep: Which duplicate to keep ('first', 'last', 'best')
            
        Returns:
            Dict with unique records and duplicate groups
        """
        if len(data) < 2:
            return {
                'unique_records': data,
                'duplicates_removed': 0,
                'duplicate_groups': []
            }
        
        # Generate embeddings for each record
        embeddings = self._generate_embeddings(data, fields)
        
        # Find duplicate groups
        duplicate_groups = []
        seen_indices = set()
        unique_records = []
        
        for i in range(len(data)):
            if i in seen_indices:
                continue
            
            # Find similar records
            similar_indices = [i]
            for j in range(i + 1, len(data)):
                if j in seen_indices:
                    continue
                
                # Calculate similarity
                similarity = self._calculate_similarity(embeddings[i], embeddings[j])
                
                if similarity >= self.threshold:
                    similar_indices.append(j)
                    seen_indices.add(j)
            
            if len(similar_indices) > 1:
                # Found duplicates
                duplicate_records = [data[idx] for idx in similar_indices]
                
                # Determine which record to keep
                if keep == "first":
                    kept_record = duplicate_records[0]
                elif keep == "last":
                    kept_record = duplicate_records[-1]
                else:  # "best"
                    kept_record = self._select_best_record(duplicate_records)
                
                # Calculate similarity scores
                similarity_scores = []
                for idx in similar_indices[1:]:
                    score = self._calculate_similarity(embeddings[i], embeddings[idx])
                    similarity_scores.append(float(score))
                
                duplicate_groups.append(DuplicateGroup(
                    records=duplicate_records,
                    similarity_scores=similarity_scores,
                    kept_record=kept_record,
                    removed_count=len(duplicate_records) - 1
                ))
                
                unique_records.append(kept_record)
            else:
                # No duplicates found
                unique_records.append(data[i])
        
        return {
            'unique_records': unique_records,
            'duplicates_removed': len(data) - len(unique_records),
            'duplicate_groups': duplicate_groups
        }
    
    async def analyze_duplicates(
        self,
        data: List[Dict[str, Any]],
        fields: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Analyze duplicates without removing them
        
        Returns duplicate groups for review
        """
        embeddings = self._generate_embeddings(data, fields)
        
        duplicate_groups = []
        seen_pairs = set()
        
        for i in range(len(data)):
            for j in range(i + 1, len(data)):
                pair = tuple(sorted([i, j]))
                if pair in seen_pairs:
                    continue
                
                similarity = self._calculate_similarity(embeddings[i], embeddings[j])
                
                if similarity >= self.threshold:
                    seen_pairs.add(pair)
                    duplicate_groups.append({
                        'record_1': data[i],
                        'record_2': data[j],
                        'similarity': float(similarity),
                        'confidence': 'high' if similarity > 0.95 else 'medium' if similarity > 0.85 else 'low'
                    })
        
        return {
            'duplicate_groups': duplicate_groups
        }
    
    def _generate_embeddings(
        self,
        data: List[Dict[str, Any]],
        fields: Optional[List[str]] = None
    ) -> np.ndarray:
        """Generate embeddings for records"""
        # Convert records to text
        texts = []
        for record in data:
            if fields:
                # Use only specified fields
                text_parts = [str(record.get(field, '')) for field in fields if field in record]
            else:
                # Use all fields
                text_parts = [str(v) for v in record.values() if v is not None]
            
            text = ' '.join(text_parts).lower().strip()
            texts.append(text)
        
        if self.model:
            # Use sentence transformer
            embeddings = self.model.encode(texts, convert_to_numpy=True)
        else:
            # Fallback: simple character-based vectors
            embeddings = self._simple_embeddings(texts)
        
        return embeddings
    
    def _simple_embeddings(self, texts: List[str]) -> np.ndarray:
        """Simple character-based embeddings (fallback)"""
        # Create simple bag-of-characters vectors
        all_chars = set(''.join(texts))
        char_to_idx = {char: idx for idx, char in enumerate(sorted(all_chars))}
        
        embeddings = []
        for text in texts:
            vector = np.zeros(len(char_to_idx))
            for char in text:
                if char in char_to_idx:
                    vector[char_to_idx[char]] += 1
            # Normalize
            norm = np.linalg.norm(vector)
            if norm > 0:
                vector = vector / norm
            embeddings.append(vector)
        
        return np.array(embeddings)
    
    def _calculate_similarity(self, embedding1: np.ndarray, embedding2: np.ndarray) -> float:
        """Calculate cosine similarity between two embeddings"""
        # Reshape for sklearn
        emb1 = embedding1.reshape(1, -1)
        emb2 = embedding2.reshape(1, -1)
        
        similarity = cosine_similarity(emb1, emb2)[0][0]
        return similarity
    
    def _select_best_record(self, records: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Select the best record from duplicates
        
        Criteria:
        - Most complete (fewest None/empty values)
        - Longest total content
        """
        best_record = records[0]
        best_score = self._score_record(best_record)
        
        for record in records[1:]:
            score = self._score_record(record)
            if score > best_score:
                best_score = score
                best_record = record
        
        return best_record
    
    def _score_record(self, record: Dict[str, Any]) -> float:
        """Score a record based on completeness and content"""
        score = 0.0
        
        # Count non-empty fields
        non_empty = sum(1 for v in record.values() if v is not None and str(v).strip() != '')
        score += non_empty * 10
        
        # Total content length
        total_length = sum(len(str(v)) for v in record.values() if v is not None)
        score += total_length * 0.1
        
        return score
