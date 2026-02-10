"""
PagerDuty Integration for AIOps Incident Management
"""

import requests
from typing import Dict, Any, Optional
from datetime import datetime
import os


class PagerDutyIntegration:
    """PagerDuty Events API v2 integration"""
    
    def __init__(self, integration_key: Optional[str] = None):
        self.integration_key = integration_key or os.getenv("PAGERDUTY_INTEGRATION_KEY")
        self.api_url = "https://events.pagerduty.com/v2/enqueue"
    
    def create_incident(
        self,
        incident_id: str,
        root_cause: str,
        confidence: float,
        severity: str,
        affected_services: list,
        recommendation: str,
        source: str = "Cleara AIOps"
    ) -> Optional[str]:
        """
        Create a PagerDuty incident
        
        Args:
            incident_id: Unique incident identifier
            root_cause: AI-detected root cause
            confidence: Confidence score (0-100)
            severity: critical, warning, or info
            affected_services: List of affected services
            recommendation: Actionable recommendation
            source: Source system name
        
        Returns:
            str: PagerDuty dedup_key if successful, None otherwise
        """
        
        if not self.integration_key:
            print("PagerDuty integration key not configured")
            return None
        
        # Map severity to PagerDuty severity
        pd_severity_map = {
            "critical": "critical",
            "warning": "warning",
            "info": "info"
        }
        pd_severity = pd_severity_map.get(severity, "error")
        
        # Build event payload
        payload = {
            "routing_key": self.integration_key,
            "event_action": "trigger",
            "dedup_key": incident_id,
            "payload": {
                "summary": f"[{severity.upper()}] {root_cause}",
                "source": source,
                "severity": pd_severity,
                "timestamp": datetime.utcnow().isoformat(),
                "component": ", ".join(affected_services),
                "group": "AIOps",
                "class": "incident",
                "custom_details": {
                    "incident_id": incident_id,
                    "root_cause": root_cause,
                    "confidence": f"{confidence}%",
                    "affected_services": affected_services,
                    "recommendation": recommendation,
                    "ai_detected": True
                }
            },
            "links": [
                {
                    "href": f"http://localhost:3000/aiops/investigate?id={incident_id}",
                    "text": "View in Cleara Dashboard"
                }
            ]
        }
        
        try:
            response = requests.post(self.api_url, json=payload, timeout=10)
            if response.status_code == 202:
                result = response.json()
                return result.get("dedup_key")
            else:
                print(f"PagerDuty API error: {response.status_code} - {response.text}")
                return None
        except Exception as e:
            print(f"Failed to create PagerDuty incident: {e}")
            return None
    
    def resolve_incident(
        self,
        incident_id: str,
        resolution_notes: str = ""
    ) -> bool:
        """
        Resolve a PagerDuty incident
        
        Args:
            incident_id: Incident ID (dedup_key)
            resolution_notes: Optional resolution notes
        
        Returns:
            bool: True if resolved successfully
        """
        
        if not self.integration_key:
            return False
        
        payload = {
            "routing_key": self.integration_key,
            "event_action": "resolve",
            "dedup_key": incident_id,
            "payload": {
                "summary": f"Incident {incident_id} resolved",
                "source": "Cleara AIOps",
                "severity": "info",
                "custom_details": {
                    "resolution_notes": resolution_notes,
                    "resolved_at": datetime.utcnow().isoformat()
                }
            }
        }
        
        try:
            response = requests.post(self.api_url, json=payload, timeout=10)
            return response.status_code == 202
        except Exception as e:
            print(f"Failed to resolve PagerDuty incident: {e}")
            return False
    
    def acknowledge_incident(
        self,
        incident_id: str,
        acknowledged_by: str = "Cleara AIOps"
    ) -> bool:
        """
        Acknowledge a PagerDuty incident
        
        Args:
            incident_id: Incident ID (dedup_key)
            acknowledged_by: Who acknowledged the incident
        
        Returns:
            bool: True if acknowledged successfully
        """
        
        if not self.integration_key:
            return False
        
        payload = {
            "routing_key": self.integration_key,
            "event_action": "acknowledge",
            "dedup_key": incident_id,
            "payload": {
                "summary": f"Incident {incident_id} acknowledged",
                "source": "Cleara AIOps",
                "severity": "info",
                "custom_details": {
                    "acknowledged_by": acknowledged_by,
                    "acknowledged_at": datetime.utcnow().isoformat()
                }
            }
        }
        
        try:
            response = requests.post(self.api_url, json=payload, timeout=10)
            return response.status_code == 202
        except Exception as e:
            print(f"Failed to acknowledge PagerDuty incident: {e}")
            return False
    
    def add_note(
        self,
        incident_id: str,
        note: str
    ) -> bool:
        """
        Add a note to an existing incident
        
        Args:
            incident_id: Incident ID (dedup_key)
            note: Note content
        
        Returns:
            bool: True if note added successfully
        """
        
        if not self.integration_key:
            return False
        
        # PagerDuty Events API doesn't support notes directly
        # This would require the REST API, but we can trigger an update
        payload = {
            "routing_key": self.integration_key,
            "event_action": "trigger",
            "dedup_key": incident_id,
            "payload": {
                "summary": f"Update: {note[:100]}",
                "source": "Cleara AIOps",
                "severity": "info",
                "custom_details": {
                    "note": note,
                    "updated_at": datetime.utcnow().isoformat()
                }
            }
        }
        
        try:
            response = requests.post(self.api_url, json=payload, timeout=10)
            return response.status_code == 202
        except Exception as e:
            print(f"Failed to add note to PagerDuty incident: {e}")
            return False
