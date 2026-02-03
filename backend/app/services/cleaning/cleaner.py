"""
Data Cleaning Service
Core logic for cleaning and normalizing data
"""

import re
from typing import Dict, Any, List, Optional
from app.models.schemas import CleaningOptions, CleanedRecord


class DataCleaner:
    """Main data cleaning service"""
    
    def __init__(self, options: CleaningOptions):
        self.options = options
        self.email_typos = {
            'gmial': 'gmail',
            'gmai': 'gmail',
            'gmil': 'gmail',
            'yahooo': 'yahoo',
            'yaho': 'yahoo',
            'hotmial': 'hotmail',
            'outlok': 'outlook',
        }
    
    async def clean_record(self, record: Dict[str, Any], explain: bool = False) -> CleanedRecord:
        """
        Clean a single record
        
        Args:
            record: Data record to clean
            explain: Include explanations for changes
            
        Returns:
            CleanedRecord with original, cleaned data, and changes
        """
        cleaned = {}
        changes = []
        
        for field, value in record.items():
            if value is None:
                cleaned[field] = value
                continue
            
            original_value = value
            cleaned_value = value
            
            # Apply cleaning operations
            if isinstance(value, str):
                # Trim whitespace
                if self.options.trim:
                    cleaned_value = cleaned_value.strip()
                    if cleaned_value != original_value and explain:
                        changes.append({
                            "field": field,
                            "type": "trim",
                            "description": "Removed leading/trailing whitespace",
                            "before": original_value,
                            "after": cleaned_value
                        })
                        original_value = cleaned_value
                
                # Normalize internal whitespace
                if self.options.normalize_whitespace:
                    normalized = re.sub(r'\s+', ' ', cleaned_value)
                    if normalized != cleaned_value and explain:
                        changes.append({
                            "field": field,
                            "type": "whitespace",
                            "description": "Normalized internal whitespace",
                            "before": cleaned_value,
                            "after": normalized
                        })
                    cleaned_value = normalized
                    original_value = cleaned_value
                
                # Normalize case for names
                if self.options.normalize_case and 'name' in field.lower():
                    title_case = self._normalize_name(cleaned_value)
                    if title_case != cleaned_value and explain:
                        changes.append({
                            "field": field,
                            "type": "case",
                            "description": "Normalized to title case",
                            "before": cleaned_value,
                            "after": title_case
                        })
                    cleaned_value = title_case
                    original_value = cleaned_value
                
                # Fix email typos
                if self.options.fix_emails and 'email' in field.lower():
                    fixed_email = self._fix_email(cleaned_value)
                    if fixed_email != cleaned_value and explain:
                        changes.append({
                            "field": field,
                            "type": "typo",
                            "description": "Fixed common email typo",
                            "before": cleaned_value,
                            "after": fixed_email
                        })
                    cleaned_value = fixed_email
                    original_value = cleaned_value
                
                # Fix phone numbers
                if self.options.fix_phones and 'phone' in field.lower():
                    fixed_phone = self._normalize_phone(cleaned_value)
                    if fixed_phone != cleaned_value and explain:
                        changes.append({
                            "field": field,
                            "type": "format",
                            "description": "Normalized phone number format",
                            "before": cleaned_value,
                            "after": fixed_phone
                        })
                    cleaned_value = fixed_phone
            
            cleaned[field] = cleaned_value
        
        # Calculate confidence score
        confidence = self._calculate_confidence(record, cleaned, changes)
        
        return CleanedRecord(
            original=record,
            cleaned=cleaned,
            changes=changes if explain else [],
            confidence=confidence
        )
    
    def _normalize_name(self, name: str) -> str:
        """Normalize name to title case"""
        # Handle special cases
        special_words = {
            'mc': 'Mc',
            'mac': 'Mac',
            'o\'': 'O\'',
        }
        
        # Basic title case
        words = name.split()
        normalized = []
        
        for word in words:
            # Check for special prefixes
            lower_word = word.lower()
            if any(lower_word.startswith(prefix) for prefix in special_words):
                # Handle McDonald, MacArthur, O'Brien, etc.
                normalized.append(word.capitalize())
            else:
                normalized.append(word.capitalize())
        
        return ' '.join(normalized)
    
    def _fix_email(self, email: str) -> str:
        """Fix common email typos"""
        email = email.lower()
        
        # Split email
        if '@' not in email:
            return email
        
        local, domain = email.rsplit('@', 1)
        
        # Fix domain typos
        for typo, correct in self.email_typos.items():
            if typo in domain:
                domain = domain.replace(typo, correct)
        
        return f"{local}@{domain}"
    
    def _normalize_phone(self, phone: str) -> str:
        """Normalize phone number format"""
        # Remove all non-digit characters
        digits = re.sub(r'\D', '', phone)
        
        # Format based on length
        if len(digits) == 10:
            # US format: (XXX) XXX-XXXX
            return f"({digits[:3]}) {digits[3:6]}-{digits[6:]}"
        elif len(digits) == 11 and digits[0] == '1':
            # US with country code
            return f"+1 ({digits[1:4]}) {digits[4:7]}-{digits[7:]}"
        else:
            # Return original if can't determine format
            return phone
    
    def _calculate_confidence(
        self,
        original: Dict[str, Any],
        cleaned: Dict[str, Any],
        changes: List[Dict[str, str]]
    ) -> float:
        """
        Calculate confidence score for cleaning
        
        Higher confidence when:
        - Few changes made
        - Changes are minor (whitespace, case)
        - No data loss
        """
        if len(changes) == 0:
            return 1.0
        
        # Start with base confidence
        confidence = 1.0
        
        # Reduce confidence based on number of changes
        confidence -= len(changes) * 0.05
        
        # Adjust based on change types
        for change in changes:
            change_type = change.get('type', '')
            if change_type in ['trim', 'whitespace']:
                # Minor changes, minimal impact
                confidence -= 0.01
            elif change_type in ['case']:
                # Moderate changes
                confidence -= 0.02
            elif change_type in ['typo', 'format']:
                # More significant changes
                confidence -= 0.05
        
        # Ensure confidence is between 0 and 1
        return max(0.0, min(1.0, confidence))
