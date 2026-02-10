"""
Slack Integration for AIOps Incident Notifications
"""

import requests
from typing import Dict, Any, Optional
from datetime import datetime
import os


class SlackIntegration:
    """Slack webhook integration for incident notifications"""
    
    def __init__(self, webhook_url: Optional[str] = None):
        self.webhook_url = webhook_url or os.getenv("SLACK_WEBHOOK_URL")
    
    def send_incident_notification(
        self,
        incident_id: str,
        root_cause: str,
        confidence: float,
        severity: str,
        affected_services: list,
        recommendation: str,
        dashboard_url: str = "http://localhost:3000/aiops"
    ) -> bool:
        """
        Send incident notification to Slack
        
        Args:
            incident_id: Unique incident identifier
            root_cause: AI-detected root cause
            confidence: Confidence score (0-100)
            severity: critical, warning, or info
            affected_services: List of affected services
            recommendation: Actionable recommendation
            dashboard_url: URL to incident dashboard
        
        Returns:
            bool: True if notification sent successfully
        """
        
        if not self.webhook_url:
            print("Slack webhook URL not configured")
            return False
        
        # Determine color based on severity
        color_map = {
            "critical": "#FF0000",  # Red
            "warning": "#FFA500",   # Orange
            "info": "#0000FF"       # Blue
        }
        color = color_map.get(severity, "#808080")
        
        # Determine emoji
        emoji_map = {
            "critical": "🚨",
            "warning": "⚠️",
            "info": "ℹ️"
        }
        emoji = emoji_map.get(severity, "📊")
        
        # Build Slack message
        payload = {
            "text": f"{emoji} *New Incident Detected*",
            "attachments": [
                {
                    "color": color,
                    "blocks": [
                        {
                            "type": "header",
                            "text": {
                                "type": "plain_text",
                                "text": f"{emoji} {incident_id}",
                                "emoji": True
                            }
                        },
                        {
                            "type": "section",
                            "fields": [
                                {
                                    "type": "mrkdwn",
                                    "text": f"*Severity:*\n{severity.upper()}"
                                },
                                {
                                    "type": "mrkdwn",
                                    "text": f"*Confidence:*\n{confidence}%"
                                }
                            ]
                        },
                        {
                            "type": "section",
                            "text": {
                                "type": "mrkdwn",
                                "text": f"*Root Cause:*\n{root_cause}"
                            }
                        },
                        {
                            "type": "section",
                            "text": {
                                "type": "mrkdwn",
                                "text": f"*Affected Services:*\n{', '.join(affected_services)}"
                            }
                        },
                        {
                            "type": "section",
                            "text": {
                                "type": "mrkdwn",
                                "text": f"*Recommendation:*\n{recommendation}"
                            }
                        },
                        {
                            "type": "divider"
                        },
                        {
                            "type": "actions",
                            "elements": [
                                {
                                    "type": "button",
                                    "text": {
                                        "type": "plain_text",
                                        "text": "🔍 Investigate",
                                        "emoji": True
                                    },
                                    "url": f"{dashboard_url}/investigate?id={incident_id}",
                                    "style": "primary"
                                },
                                {
                                    "type": "button",
                                    "text": {
                                        "type": "plain_text",
                                        "text": "✅ Acknowledge",
                                        "emoji": True
                                    },
                                    "value": f"ack_{incident_id}"
                                },
                                {
                                    "type": "button",
                                    "text": {
                                        "type": "plain_text",
                                        "text": "❌ False Positive",
                                        "emoji": True
                                    },
                                    "value": f"false_{incident_id}",
                                    "style": "danger"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
        
        try:
            response = requests.post(self.webhook_url, json=payload, timeout=10)
            return response.status_code == 200
        except Exception as e:
            print(f"Failed to send Slack notification: {e}")
            return False
    
    def send_resolution_notification(
        self,
        incident_id: str,
        resolution_time: str,
        resolution_notes: str
    ) -> bool:
        """Send incident resolution notification"""
        
        if not self.webhook_url:
            return False
        
        payload = {
            "text": "✅ *Incident Resolved*",
            "attachments": [
                {
                    "color": "#00FF00",
                    "blocks": [
                        {
                            "type": "section",
                            "text": {
                                "type": "mrkdwn",
                                "text": f"*Incident:* {incident_id}\n*Resolution Time:* {resolution_time}\n*Notes:* {resolution_notes}"
                            }
                        }
                    ]
                }
            ]
        }
        
        try:
            response = requests.post(self.webhook_url, json=payload, timeout=10)
            return response.status_code == 200
        except Exception as e:
            print(f"Failed to send resolution notification: {e}")
            return False
    
    def send_summary(
        self,
        total_incidents: int,
        critical_count: int,
        resolved_count: int,
        avg_resolution_time: str,
        noise_reduction: str
    ) -> bool:
        """Send daily/weekly summary"""
        
        if not self.webhook_url:
            return False
        
        payload = {
            "text": "📊 *AIOps Summary Report*",
            "attachments": [
                {
                    "color": "#0066CC",
                    "blocks": [
                        {
                            "type": "section",
                            "fields": [
                                {
                                    "type": "mrkdwn",
                                    "text": f"*Total Incidents:*\n{total_incidents}"
                                },
                                {
                                    "type": "mrkdwn",
                                    "text": f"*Critical:*\n{critical_count}"
                                },
                                {
                                    "type": "mrkdwn",
                                    "text": f"*Resolved:*\n{resolved_count}"
                                },
                                {
                                    "type": "mrkdwn",
                                    "text": f"*Avg Resolution Time:*\n{avg_resolution_time}"
                                },
                                {
                                    "type": "mrkdwn",
                                    "text": f"*Noise Reduction:*\n{noise_reduction}"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
        
        try:
            response = requests.post(self.webhook_url, json=payload, timeout=10)
            return response.status_code == 200
        except Exception as e:
            print(f"Failed to send summary: {e}")
            return False
