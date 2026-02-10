"""
Data Enrichment Service
AI-powered data enrichment and field prediction
"""

from typing import Dict, Any, List
import pycountry

from app.models.schemas import EnrichedRecord, EnrichedField


class DataEnricher:
    """AI-powered data enrichment service"""
    
    def __init__(self, confidence_threshold: float = 0.7):
        self.confidence_threshold = confidence_threshold
        
        # City to country mapping (sample - in production, use a comprehensive database)
        self.city_country_map = {
            'new york': 'United States',
            'london': 'United Kingdom',
            'paris': 'France',
            'tokyo': 'Japan',
            'berlin': 'Germany',
            'sydney': 'Australia',
            'toronto': 'Canada',
            'mumbai': 'India',
            'beijing': 'China',
            'moscow': 'Russia',
            'dubai': 'United Arab Emirates',
            'singapore': 'Singapore',
            'hong kong': 'Hong Kong',
            'los angeles': 'United States',
            'chicago': 'United States',
            'san francisco': 'United States',
            'boston': 'United States',
            'seattle': 'United States',
        }
        
        # City to timezone mapping
        self.city_timezone_map = {
            'new york': 'America/New_York',
            'london': 'Europe/London',
            'paris': 'Europe/Paris',
            'tokyo': 'Asia/Tokyo',
            'berlin': 'Europe/Berlin',
            'sydney': 'Australia/Sydney',
            'toronto': 'America/Toronto',
            'mumbai': 'Asia/Kolkata',
            'beijing': 'Asia/Shanghai',
            'moscow': 'Europe/Moscow',
            'dubai': 'Asia/Dubai',
            'singapore': 'Asia/Singapore',
            'hong kong': 'Asia/Hong_Kong',
            'los angeles': 'America/Los_Angeles',
            'chicago': 'America/Chicago',
            'san francisco': 'America/Los_Angeles',
            'boston': 'America/New_York',
            'seattle': 'America/Los_Angeles',
        }
        
        # Common email domain to company mapping
        self.domain_company_map = {
            'google.com': 'Google',
            'microsoft.com': 'Microsoft',
            'apple.com': 'Apple',
            'amazon.com': 'Amazon',
            'facebook.com': 'Meta',
            'meta.com': 'Meta',
            'netflix.com': 'Netflix',
            'tesla.com': 'Tesla',
            'ibm.com': 'IBM',
            'oracle.com': 'Oracle',
            'salesforce.com': 'Salesforce',
            'adobe.com': 'Adobe',
        }
    
    async def enrich_records(
        self,
        data: List[Dict[str, Any]],
        enrich_fields: List[str]
    ) -> Dict[str, Any]:
        """
        Enrich multiple records
        
        Args:
            data: Records to enrich
            enrich_fields: Fields to enrich
            
        Returns:
            Dict with enriched records and statistics
        """
        enriched_records = []
        total_enrichments = 0
        enriched_count = 0
        
        for record in data:
            enriched = await self.enrich_record(record, enrich_fields)
            enriched_records.append(enriched)
            
            if len(enriched.enrichments) > 0:
                enriched_count += 1
                total_enrichments += len(enriched.enrichments)
        
        return {
            'enriched_records': enriched_records,
            'enriched_count': enriched_count,
            'total_enrichments': total_enrichments
        }
    
    async def enrich_record(
        self,
        record: Dict[str, Any],
        enrich_fields: List[str]
    ) -> EnrichedRecord:
        """Enrich a single record"""
        enriched_data = record.copy()
        enrichments = []
        
        for field in enrich_fields:
            # Skip if field already exists
            if field in record and record[field] is not None:
                continue
            
            # Try to enrich the field
            enrichment = await self._enrich_field(field, record)
            
            if enrichment and enrichment.confidence >= self.confidence_threshold:
                enriched_data[field] = enrichment.enriched_value
                enrichments.append(enrichment)
        
        return EnrichedRecord(
            original=record,
            enriched=enriched_data,
            enrichments=enrichments
        )
    
    async def _enrich_field(
        self,
        field: str,
        record: Dict[str, Any]
    ) -> EnrichedField | None:
        """Enrich a specific field"""
        # Geographic enrichment
        if field == 'country':
            return self._enrich_country(record)
        elif field == 'timezone':
            return self._enrich_timezone(record)
        elif field == 'state' or field == 'region':
            return self._enrich_state(record)
        
        # Company enrichment
        elif field == 'company_name':
            return self._enrich_company_name(record)
        
        # Contact enrichment
        elif field == 'first_name':
            return self._enrich_first_name(record)
        elif field == 'last_name':
            return self._enrich_last_name(record)
        
        return None
    
    def _enrich_country(self, record: Dict[str, Any]) -> EnrichedField | None:
        """Enrich country from city"""
        city = record.get('city', '').lower().strip()
        
        if city in self.city_country_map:
            return EnrichedField(
                field='country',
                original_value=None,
                enriched_value=self.city_country_map[city],
                confidence=0.95,
                source='geographic_inference'
            )
        
        return None
    
    def _enrich_timezone(self, record: Dict[str, Any]) -> EnrichedField | None:
        """Enrich timezone from city"""
        city = record.get('city', '').lower().strip()
        
        if city in self.city_timezone_map:
            return EnrichedField(
                field='timezone',
                original_value=None,
                enriched_value=self.city_timezone_map[city],
                confidence=0.95,
                source='geographic_inference'
            )
        
        return None
    
    def _enrich_state(self, record: Dict[str, Any]) -> EnrichedField | None:
        """Enrich state/region from city"""
        # This would use a comprehensive city database in production
        city = record.get('city', '').lower().strip()
        
        # Sample mappings
        state_map = {
            'new york': 'New York',
            'los angeles': 'California',
            'chicago': 'Illinois',
            'san francisco': 'California',
            'boston': 'Massachusetts',
            'seattle': 'Washington',
        }
        
        if city in state_map:
            return EnrichedField(
                field='state',
                original_value=None,
                enriched_value=state_map[city],
                confidence=0.90,
                source='geographic_inference'
            )
        
        return None
    
    def _enrich_company_name(self, record: Dict[str, Any]) -> EnrichedField | None:
        """Enrich company name from email domain"""
        email = record.get('email', '').lower().strip()
        
        if '@' in email:
            domain = email.split('@')[1]
            
            if domain in self.domain_company_map:
                return EnrichedField(
                    field='company_name',
                    original_value=None,
                    enriched_value=self.domain_company_map[domain],
                    confidence=0.85,
                    source='email_domain_lookup'
                )
        
        return None
    
    def _enrich_first_name(self, record: Dict[str, Any]) -> EnrichedField | None:
        """Extract first name from full name"""
        full_name = record.get('name', '').strip()
        
        if full_name:
            parts = full_name.split()
            if len(parts) >= 1:
                return EnrichedField(
                    field='first_name',
                    original_value=None,
                    enriched_value=parts[0],
                    confidence=0.90,
                    source='name_parsing'
                )
        
        return None
    
    def _enrich_last_name(self, record: Dict[str, Any]) -> EnrichedField | None:
        """Extract last name from full name"""
        full_name = record.get('name', '').strip()
        
        if full_name:
            parts = full_name.split()
            if len(parts) >= 2:
                return EnrichedField(
                    field='last_name',
                    original_value=None,
                    enriched_value=parts[-1],
                    confidence=0.90,
                    source='name_parsing'
                )
        
        return None
