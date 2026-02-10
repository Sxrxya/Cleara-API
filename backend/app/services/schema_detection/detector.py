"""
Schema Detection Service
AI-powered schema inference and field mapping
"""

from typing import Dict, Any, List, Set
from collections import defaultdict, Counter
import re

from app.models.schemas import FieldSchema


class SchemaDetector:
    """AI-powered schema detection service"""
    
    def __init__(self, suggest_types: bool = True, suggest_constraints: bool = True):
        self.suggest_types = suggest_types
        self.suggest_constraints = suggest_constraints
        
        # Common field name variations
        self.field_synonyms = {
            'email': ['email', 'email_address', 'e_mail', 'user_email', 'contact_email', 'mail'],
            'name': ['name', 'full_name', 'fullname', 'user_name', 'username', 'display_name'],
            'first_name': ['first_name', 'firstname', 'fname', 'given_name'],
            'last_name': ['last_name', 'lastname', 'lname', 'surname', 'family_name'],
            'phone': ['phone', 'phone_number', 'telephone', 'mobile', 'cell', 'contact_number'],
            'address': ['address', 'street_address', 'street', 'location'],
            'city': ['city', 'town', 'municipality'],
            'state': ['state', 'province', 'region'],
            'country': ['country', 'nation'],
            'zip': ['zip', 'zipcode', 'postal_code', 'postcode'],
            'company': ['company', 'organization', 'org', 'employer', 'company_name'],
            'title': ['title', 'job_title', 'position', 'role'],
            'date': ['date', 'created_at', 'updated_at', 'timestamp'],
            'id': ['id', 'user_id', 'customer_id', 'record_id', 'identifier'],
        }
    
    async def detect_schema(self, data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Detect schema from sample data
        
        Args:
            data: Sample records
            
        Returns:
            Dict with detected fields and mapping
        """
        # Collect all field names
        all_fields = defaultdict(list)
        
        for record in data:
            for field, value in record.items():
                all_fields[field].append(value)
        
        # Group similar field names
        field_groups = self._group_similar_fields(list(all_fields.keys()))
        
        # Detect schema for each group
        detected_fields = []
        field_mapping = {}
        
        for standard_name, variations in field_groups.items():
            # Collect all values for this field group
            all_values = []
            for variation in variations:
                all_values.extend(all_fields[variation])
                field_mapping[variation] = standard_name
            
            # Detect field schema
            field_schema = self._detect_field_schema(
                name=standard_name,
                variations=variations,
                values=all_values
            )
            
            detected_fields.append(field_schema)
        
        # Calculate overall confidence
        overall_confidence = sum(f.confidence for f in detected_fields) / len(detected_fields) if detected_fields else 0.0
        
        return {
            'fields': detected_fields,
            'mapping': field_mapping,
            'confidence': round(overall_confidence, 2)
        }
    
    def _group_similar_fields(self, field_names: List[str]) -> Dict[str, List[str]]:
        """Group similar field names together"""
        groups = {}
        assigned = set()
        
        # First, match against known synonyms
        for standard_name, synonyms in self.field_synonyms.items():
            matching_fields = []
            for field in field_names:
                normalized = field.lower().replace('_', '').replace('-', '')
                for synonym in synonyms:
                    normalized_synonym = synonym.lower().replace('_', '').replace('-', '')
                    if normalized == normalized_synonym or normalized in normalized_synonym or normalized_synonym in normalized:
                        matching_fields.append(field)
                        assigned.add(field)
                        break
            
            if matching_fields:
                groups[standard_name] = matching_fields
        
        # Add unmatched fields as their own groups
        for field in field_names:
            if field not in assigned:
                groups[field.lower()] = [field]
        
        return groups
    
    def _detect_field_schema(
        self,
        name: str,
        variations: List[str],
        values: List[Any]
    ) -> FieldSchema:
        """Detect schema for a single field"""
        # Filter out None values for type detection
        non_null_values = [v for v in values if v is not None]
        nullable = len(non_null_values) < len(values)
        
        if not non_null_values:
            return FieldSchema(
                name=name,
                original_names=variations,
                type='unknown',
                nullable=True,
                constraints={},
                examples=[],
                confidence=0.5
            )
        
        # Detect type
        detected_type, type_confidence = self._detect_type(non_null_values)
        
        # Detect constraints
        constraints = {}
        if self.suggest_constraints:
            constraints = self._detect_constraints(non_null_values, detected_type)
        
        # Get examples (up to 3 unique values)
        examples = list(set(non_null_values))[:3]
        
        return FieldSchema(
            name=name,
            original_names=variations,
            type=detected_type,
            nullable=nullable,
            constraints=constraints,
            examples=examples,
            confidence=round(type_confidence, 2)
        )
    
    def _detect_type(self, values: List[Any]) -> tuple[str, float]:
        """Detect the data type of values"""
        # Count types
        type_counts = defaultdict(int)
        
        for value in values:
            value_str = str(value).strip()
            
            # Check for email
            if self._is_email(value_str):
                type_counts['email'] += 1
            # Check for phone
            elif self._is_phone(value_str):
                type_counts['phone'] += 1
            # Check for URL
            elif self._is_url(value_str):
                type_counts['url'] += 1
            # Check for date
            elif self._is_date(value_str):
                type_counts['date'] += 1
            # Check for boolean
            elif self._is_boolean(value_str):
                type_counts['boolean'] += 1
            # Check for number
            elif self._is_number(value_str):
                if '.' in value_str:
                    type_counts['float'] += 1
                else:
                    type_counts['integer'] += 1
            # Default to string
            else:
                type_counts['string'] += 1
        
        # Get most common type
        if type_counts:
            most_common_type = max(type_counts, key=type_counts.get)
            confidence = type_counts[most_common_type] / len(values)
            return most_common_type, confidence
        
        return 'string', 0.5
    
    def _detect_constraints(self, values: List[Any], data_type: str) -> Dict[str, Any]:
        """Detect constraints for a field"""
        constraints = {}
        
        if data_type in ['string', 'email', 'phone', 'url']:
            # String length constraints
            lengths = [len(str(v)) for v in values]
            constraints['min_length'] = min(lengths)
            constraints['max_length'] = max(lengths)
        
        elif data_type in ['integer', 'float']:
            # Numeric constraints
            numeric_values = [float(v) for v in values if self._is_number(str(v))]
            if numeric_values:
                constraints['min'] = min(numeric_values)
                constraints['max'] = max(numeric_values)
        
        # Check for uniqueness
        unique_ratio = len(set(str(v) for v in values)) / len(values)
        if unique_ratio > 0.95:
            constraints['unique'] = True
        
        return constraints
    
    def _is_email(self, value: str) -> bool:
        """Check if value looks like an email"""
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(email_pattern, value))
    
    def _is_phone(self, value: str) -> bool:
        """Check if value looks like a phone number"""
        # Remove common separators
        digits = re.sub(r'[\s\-\(\)\+\.]', '', value)
        return digits.isdigit() and 7 <= len(digits) <= 15
    
    def _is_url(self, value: str) -> bool:
        """Check if value looks like a URL"""
        url_pattern = r'^https?://'
        return bool(re.match(url_pattern, value, re.IGNORECASE))
    
    def _is_date(self, value: str) -> bool:
        """Check if value looks like a date"""
        date_patterns = [
            r'^\d{4}-\d{2}-\d{2}',  # YYYY-MM-DD
            r'^\d{2}/\d{2}/\d{4}',  # MM/DD/YYYY or DD/MM/YYYY
            r'^\d{4}/\d{2}/\d{2}',  # YYYY/MM/DD
        ]
        return any(re.match(pattern, value) for pattern in date_patterns)
    
    def _is_boolean(self, value: str) -> bool:
        """Check if value looks like a boolean"""
        return value.lower() in ['true', 'false', 'yes', 'no', '1', '0', 't', 'f', 'y', 'n']
    
    def _is_number(self, value: str) -> bool:
        """Check if value is a number"""
        try:
            float(value)
            return True
        except (ValueError, TypeError):
            return False
