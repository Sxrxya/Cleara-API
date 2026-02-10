"""
AIOps Core - Log and Metric Ingestion
Handles incoming telemetry data from IT systems
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime
from enum import Enum

from app.api.deps import validate_api_key
from app.db.models import User

router = APIRouter()


class LogLevel(str, Enum):
    DEBUG = "DEBUG"
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"
    CRITICAL = "CRITICAL"


class LogEntry(BaseModel):
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    level: LogLevel
    source: str = Field(..., description="Service/host name")
    message: str
    metadata: Optional[Dict[str, Any]] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "timestamp": "2024-02-09T10:30:00Z",
                "level": "ERROR",
                "source": "api-server-01",
                "message": "Database connection timeout after 30s",
                "metadata": {"db_host": "prod-db-1", "timeout": 30}
            }
        }


class MetricEntry(BaseModel):
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    source: str = Field(..., description="Service/host name")
    metric_name: str
    value: float
    unit: Optional[str] = None
    tags: Optional[Dict[str, str]] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "timestamp": "2024-02-09T10:30:00Z",
                "source": "api-server-01",
                "metric_name": "cpu_usage",
                "value": 95.5,
                "unit": "percent",
                "tags": {"region": "us-east-1", "env": "production"}
            }
        }


class AlertEntry(BaseModel):
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    source: str
    severity: str = Field(..., description="critical, warning, info")
    title: str
    description: str
    metadata: Optional[Dict[str, Any]] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "timestamp": "2024-02-09T10:30:00Z",
                "source": "prometheus",
                "severity": "critical",
                "title": "High CPU Usage",
                "description": "CPU usage above 90% for 5 minutes",
                "metadata": {"threshold": 90, "current": 95.5}
            }
        }


# In-memory storage for demo (replace with DB in production)
log_store: List[LogEntry] = []
metric_store: List[MetricEntry] = []
alert_store: List[AlertEntry] = []


@router.post("/logs/ingest", tags=["AIOps Ingestion"])
async def ingest_logs(
    logs: List[LogEntry],
    user: User = Depends(validate_api_key)
):
    """
    Ingest application/server logs
    
    **Use Case:** Send logs from your applications for AI analysis
    
    **Example:**
    ```json
    [
        {
            "level": "ERROR",
            "source": "api-server-01",
            "message": "Database connection failed",
            "metadata": {"error_code": "ECONNREFUSED"}
        }
    ]
    ```
    """
    
    # Store logs
    log_store.extend(logs)
    
    # Basic anomaly detection
    error_count = sum(1 for log in logs if log.level in [LogLevel.ERROR, LogLevel.CRITICAL])
    
    return {
        "success": True,
        "ingested": len(logs),
        "errors_detected": error_count,
        "timestamp": datetime.utcnow(),
        "message": f"Ingested {len(logs)} log entries. {error_count} errors detected."
    }


@router.post("/metrics/ingest", tags=["AIOps Ingestion"])
async def ingest_metrics(
    metrics: List[MetricEntry],
    user: User = Depends(validate_api_key)
):
    """
    Ingest system metrics (CPU, memory, latency, etc.)
    
    **Use Case:** Send metrics from Prometheus, CloudWatch, or custom collectors
    
    **Example:**
    ```json
    [
        {
            "source": "web-server-01",
            "metric_name": "cpu_usage",
            "value": 85.5,
            "unit": "percent"
        }
    ]
    ```
    """
    
    # Store metrics
    metric_store.extend(metrics)
    
    # Detect anomalies
    high_cpu = [m for m in metrics if m.metric_name == "cpu_usage" and m.value > 80]
    high_memory = [m for m in metrics if m.metric_name == "memory_usage" and m.value > 85]
    
    anomalies = []
    if high_cpu:
        anomalies.append(f"{len(high_cpu)} instances with high CPU (>80%)")
    if high_memory:
        anomalies.append(f"{len(high_memory)} instances with high memory (>85%)")
    
    return {
        "success": True,
        "ingested": len(metrics),
        "anomalies_detected": len(anomalies),
        "anomalies": anomalies,
        "timestamp": datetime.utcnow()
    }


@router.post("/alerts/ingest", tags=["AIOps Ingestion"])
async def ingest_alerts(
    alerts: List[AlertEntry],
    user: User = Depends(validate_api_key)
):
    """
    Ingest alerts from monitoring systems
    
    **Use Case:** Forward alerts from PagerDuty, Prometheus, Nagios, etc.
    
    **Example:**
    ```json
    [
        {
            "source": "prometheus",
            "severity": "critical",
            "title": "Service Down",
            "description": "API endpoint returning 500 errors"
        }
    ]
    ```
    """
    
    # Store alerts
    alert_store.extend(alerts)
    
    # Count by severity
    critical = sum(1 for a in alerts if a.severity == "critical")
    warning = sum(1 for a in alerts if a.severity == "warning")
    
    return {
        "success": True,
        "ingested": len(alerts),
        "critical": critical,
        "warning": warning,
        "timestamp": datetime.utcnow(),
        "message": f"Ingested {len(alerts)} alerts ({critical} critical, {warning} warnings)"
    }


@router.get("/telemetry/stats", tags=["AIOps Ingestion"])
async def get_telemetry_stats(user: User = Depends(validate_api_key)):
    """
    Get current telemetry statistics
    
    **Returns:** Count of logs, metrics, and alerts in the system
    """
    
    return {
        "logs": {
            "total": len(log_store),
            "errors": sum(1 for log in log_store if log.level in [LogLevel.ERROR, LogLevel.CRITICAL]),
            "warnings": sum(1 for log in log_store if log.level == LogLevel.WARNING)
        },
        "metrics": {
            "total": len(metric_store),
            "unique_sources": len(set(m.source for m in metric_store))
        },
        "alerts": {
            "total": len(alert_store),
            "critical": sum(1 for a in alert_store if a.severity == "critical"),
            "warning": sum(1 for a in alert_store if a.severity == "warning")
        },
        "timestamp": datetime.utcnow()
    }


@router.delete("/telemetry/clear", tags=["AIOps Ingestion"])
async def clear_telemetry(user: User = Depends(validate_api_key)):
    """
    Clear all telemetry data (for testing)
    """
    
    log_store.clear()
    metric_store.clear()
    alert_store.clear()
    
    return {
        "success": True,
        "message": "All telemetry data cleared"
    }
