"""
Data Validation Service
Validate data against various rules and patterns
"""

import re
from typing import Any, Optional
from email_validator import validate_email, EmailNotValidError
import phonenumbers
from datetime import datetime

from app.models.schemas import ValidationRule, FieldValidation


class DataValidator:
    """Main data validation service"""
    
    def __init__(self):
        self.url_pattern = re.compile(
            r'^https?://'  # http:// or https://
            r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain...
            r'localhost|'  # localhost...
            r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
            r'(?::\d+)?'  # optional port
            r'(?:/?|[/?]\S+)$', re.IGNORECASE)
    
    async def validate_field(
        self,
        field: str,
        value: Any,
        rule: ValidationRule,
        strict: bool = False
    ) -> FieldValidation:
        """
        Validate a single field
        
        Args:
            field: Field name
            value: Field value
            rule: Validation rule
            strict: Stop on first error
            
        Returns:
            FieldValidation result
        """
        # Check if required
        if rule.required and (value is None or value == ""):
            return FieldValidation(
                field=field,
                valid=False,
                value=value,
                error="Field is required",
                suggestion=None
            )
        
        # If not required and empty, it's valid
        if value is None or value == "":
            return FieldValidation(
                field=field,
                valid=True,
                value=value,
                error=None,
                suggestion=None
            )
        
        # Validate based on type
        if rule.type == "email":
            return self._validate_email(field, value)
        elif rule.type == "phone":
            return self._validate_phone(field, value)
        elif rule.type == "url":
            return self._validate_url(field, value)
        elif rule.type == "date":
            return self._validate_date(field, value)
        elif rule.type == "name":
            return self._validate_name(field, value)
        elif rule.type == "custom" and rule.pattern:
            return self._validate_pattern(field, value, rule.pattern)
        else:
            return FieldValidation(
                field=field,
                valid=True,
                value=value,
                error=None,
                suggestion=None
            )
    
    def _validate_email(self, field: str, value: str) -> FieldValidation:
        """Validate email address"""
        try:
            # Validate email
            validated = validate_email(value, check_deliverability=False)
            normalized = validated.normalized
            
            return FieldValidation(
                field=field,
                valid=True,
                value=value,
                error=None,
                suggestion=normalized if normalized != value else None
            )
        except EmailNotValidError as e:
            return FieldValidation(
                field=field,
                valid=False,
                value=value,
                error=str(e),
                suggestion=None
            )
    
    def _validate_phone(self, field: str, value: str) -> FieldValidation:
        """Validate phone number"""
        try:
            # Parse phone number (default to US if no country code)
            parsed = phonenumbers.parse(value, "US")
            
            if phonenumbers.is_valid_number(parsed):
                # Format as international
                formatted = phonenumbers.format_number(
                    parsed,
                    phonenumbers.PhoneNumberFormat.INTERNATIONAL
                )
                
                return FieldValidation(
                    field=field,
                    valid=True,
                    value=value,
                    error=None,
                    suggestion=formatted if formatted != value else None
                )
            else:
                return FieldValidation(
                    field=field,
                    valid=False,
                    value=value,
                    error="Invalid phone number",
                    suggestion=None
                )
        except phonenumbers.NumberParseException as e:
            return FieldValidation(
                field=field,
                valid=False,
                value=value,
                error=f"Invalid phone number: {str(e)}",
                suggestion=None
            )
    
    def _validate_url(self, field: str, value: str) -> FieldValidation:
        """Validate URL"""
        if self.url_pattern.match(value):
            return FieldValidation(
                field=field,
                valid=True,
                value=value,
                error=None,
                suggestion=None
            )
        else:
            # Try to suggest a fix
            suggestion = None
            if not value.startswith(('http://', 'https://')):
                suggestion = f"https://{value}"
            
            return FieldValidation(
                field=field,
                valid=False,
                value=value,
                error="Invalid URL format",
                suggestion=suggestion
            )
    
    def _validate_date(self, field: str, value: str) -> FieldValidation:
        """Validate date"""
        # Try common date formats
        date_formats = [
            '%Y-%m-%d',
            '%m/%d/%Y',
            '%d/%m/%Y',
            '%Y/%m/%d',
            '%B %d, %Y',
            '%d %B %Y',
        ]
        
        for fmt in date_formats:
            try:
                parsed_date = datetime.strptime(value, fmt)
                # Suggest ISO format
                iso_format = parsed_date.strftime('%Y-%m-%d')
                
                return FieldValidation(
                    field=field,
                    valid=True,
                    value=value,
                    error=None,
                    suggestion=iso_format if iso_format != value else None
                )
            except ValueError:
                continue
        
        return FieldValidation(
            field=field,
            valid=False,
            value=value,
            error="Invalid date format",
            suggestion="Use format: YYYY-MM-DD"
        )
    
    def _validate_name(self, field: str, value: str) -> FieldValidation:
        """Validate name"""
        # Basic name validation
        if len(value.strip()) < 2:
            return FieldValidation(
                field=field,
                valid=False,
                value=value,
                error="Name too short",
                suggestion=None
            )
        
        # Check for numbers (usually invalid in names)
        if re.search(r'\d', value):
            return FieldValidation(
                field=field,
                valid=False,
                value=value,
                error="Name contains numbers",
                suggestion=re.sub(r'\d', '', value).strip()
            )
        
        # Check for excessive special characters
        if len(re.findall(r'[^a-zA-Z\s\'-]', value)) > 2:
            return FieldValidation(
                field=field,
                valid=False,
                value=value,
                error="Name contains invalid characters",
                suggestion=None
            )
        
        return FieldValidation(
            field=field,
            valid=True,
            value=value,
            error=None,
            suggestion=None
        )
    
    def _validate_pattern(self, field: str, value: str, pattern: str) -> FieldValidation:
        """Validate against custom regex pattern"""
        try:
            if re.match(pattern, value):
                return FieldValidation(
                    field=field,
                    valid=True,
                    value=value,
                    error=None,
                    suggestion=None
                )
            else:
                return FieldValidation(
                    field=field,
                    valid=False,
                    value=value,
                    error=f"Value does not match pattern: {pattern}",
                    suggestion=None
                )
        except re.error as e:
            return FieldValidation(
                field=field,
                valid=False,
                value=value,
                error=f"Invalid regex pattern: {str(e)}",
                suggestion=None
            )
