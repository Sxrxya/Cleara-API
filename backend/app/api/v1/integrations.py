"""
Integrations API - Slack and PagerDuty
"""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from app.api.deps import validate_api_key
from app.db.models import User
from app.integrations.slack import SlackIntegration
from app.integrations.pagerduty import PagerDutyIntegration

router = APIRouter()


class IncidentNotification(BaseModel):
    incident_id: str
    root_cause: str
    confidence: float
    severity: str
    affected_services: list[str]
    recommendation: str


class ResolutionNotification(BaseModel):
    incident_id: str
    resolution_time: str
    resolution_notes: str


@router.post("/slack/notify", tags=["Integrations"])
async def send_slack_notification(
    notification: IncidentNotification,
    user: User = Depends(validate_api_key)
):
    """
    Send incident notification to Slack
    
    **Requires**: SLACK_WEBHOOK_URL environment variable
    """
    
    slack = SlackIntegration()
    success = slack.send_incident_notification(
        incident_id=notification.incident_id,
        root_cause=notification.root_cause,
        confidence=notification.confidence,
        severity=notification.severity,
        affected_services=notification.affected_services,
        recommendation=notification.recommendation
    )
    
    if not success:
        raise HTTPException(status_code=500, detail="Failed to send Slack notification")
    
    return {
        "success": True,
        "message": "Slack notification sent",
        "timestamp": datetime.utcnow()
    }


@router.post("/slack/resolve", tags=["Integrations"])
async def send_slack_resolution(
    resolution: ResolutionNotification,
    user: User = Depends(validate_api_key)
):
    """Send incident resolution notification to Slack"""
    
    slack = SlackIntegration()
    success = slack.send_resolution_notification(
        incident_id=resolution.incident_id,
        resolution_time=resolution.resolution_time,
        resolution_notes=resolution.resolution_notes
    )
    
    if not success:
        raise HTTPException(status_code=500, detail="Failed to send Slack resolution")
    
    return {
        "success": True,
        "message": "Slack resolution sent",
        "timestamp": datetime.utcnow()
    }


@router.post("/pagerduty/create", tags=["Integrations"])
async def create_pagerduty_incident(
    notification: IncidentNotification,
    user: User = Depends(validate_api_key)
):
    """
    Create a PagerDuty incident
    
    **Requires**: PAGERDUTY_INTEGRATION_KEY environment variable
    """
    
    pd = PagerDutyIntegration()
    dedup_key = pd.create_incident(
        incident_id=notification.incident_id,
        root_cause=notification.root_cause,
        confidence=notification.confidence,
        severity=notification.severity,
        affected_services=notification.affected_services,
        recommendation=notification.recommendation
    )
    
    if not dedup_key:
        raise HTTPException(status_code=500, detail="Failed to create PagerDuty incident")
    
    return {
        "success": True,
        "message": "PagerDuty incident created",
        "dedup_key": dedup_key,
        "timestamp": datetime.utcnow()
    }


@router.post("/pagerduty/resolve/{incident_id}", tags=["Integrations"])
async def resolve_pagerduty_incident(
    incident_id: str,
    resolution_notes: Optional[str] = "",
    user: User = Depends(validate_api_key)
):
    """Resolve a PagerDuty incident"""
    
    pd = PagerDutyIntegration()
    success = pd.resolve_incident(incident_id, resolution_notes)
    
    if not success:
        raise HTTPException(status_code=500, detail="Failed to resolve PagerDuty incident")
    
    return {
        "success": True,
        "message": "PagerDuty incident resolved",
        "timestamp": datetime.utcnow()
    }


@router.post("/pagerduty/acknowledge/{incident_id}", tags=["Integrations"])
async def acknowledge_pagerduty_incident(
    incident_id: str,
    user: User = Depends(validate_api_key)
):
    """Acknowledge a PagerDuty incident"""
    
    pd = PagerDutyIntegration()
    success = pd.acknowledge_incident(incident_id)
    
    if not success:
        raise HTTPException(status_code=500, detail="Failed to acknowledge PagerDuty incident")
    
    return {
        "success": True,
        "message": "PagerDuty incident acknowledged",
        "timestamp": datetime.utcnow()
    }


@router.get("/status", tags=["Integrations"])
async def get_integration_status(user: User = Depends(validate_api_key)):
    """Check integration status"""
    
    import os
    
    slack_configured = bool(os.getenv("SLACK_WEBHOOK_URL"))
    pagerduty_configured = bool(os.getenv("PAGERDUTY_INTEGRATION_KEY"))
    
    return {
        "slack": {
            "configured": slack_configured,
            "status": "ready" if slack_configured else "not_configured"
        },
        "pagerduty": {
            "configured": pagerduty_configured,
            "status": "ready" if pagerduty_configured else "not_configured"
        },
        "timestamp": datetime.utcnow()
    }
