"""
Preprocessing Layer for Cleara
Sanitizes and normalizes input before AI processing
"""

import re
from typing import Dict, Any, List, Optional


class Sanitizer:
    """
    Step 2: Preprocessing Layer
    Sanitizes input AFTER Gateway and BEFORE AI Models
    """

    @staticmethod
    def normalize_keys(data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Key standardization (fname -> first_name, etc.)
        Standardizes common variations of keys to a canonical format.
        """
        mapping = {
            "fname": "first_name",
            "lname": "last_name",
            "name": "full_name",
            "addr": "address",
            "loc": "location",
            "ph": "phone",
            "tel": "phone",
            "cell": "phone",
            "mob": "phone",
            "mail": "email",
            "dob": "date_of_birth",
            "bday": "birthday",
            "zip": "postal_code",
            "postcode": "postal_code",
        }
        
        normalized = {}
        for key, value in data.items():
            clean_key = key.lower().strip().replace(" ", "_").replace("-", "_")
            # Map common variations to canonical keys
            mapped_key = mapping.get(clean_key, clean_key)
            normalized[mapped_key] = value
            
        return normalized

    @staticmethod
    def sanitize_values(data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Whitespace trim, HTML removal, and string normalization
        """
        sanitized = {}
        for key, value in data.items():
            if isinstance(value, str):
                # Trim whitespace
                clean_val = value.strip()
                # Remove HTML tags (basic)
                clean_val = re.sub(r'<[^>]*>', '', clean_val)
                # Remove non-printable characters
                clean_val = "".join(char for char in clean_val if char.isprintable())
                sanitized[key] = clean_val
            elif isinstance(value, dict):
                sanitized[key] = Sanitizer.sanitize_values(value)
            elif isinstance(value, list):
                sanitized[key] = [
                    Sanitizer.sanitize_values(item) if isinstance(item, dict) else (item.strip() if isinstance(item, str) else item)
                    for item in value
                ]
            else:
                sanitized[key] = value
                
        return sanitized

    @staticmethod
    def to_canonical_json(data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Convert messy input to canonical JSON
        Runs normalize_keys followed by sanitize_values
        """
        normalized = Sanitizer.normalize_keys(data)
        sanitized = Sanitizer.sanitize_values(normalized)
        return sanitized


def get_sanitizer() -> Sanitizer:
    """Get Sanitizer instance"""
    return Sanitizer()
