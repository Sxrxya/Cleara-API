"""
Sample Data Generator for AIOps Testing
Generates realistic IT incident scenarios
"""

from fastapi import APIRouter, Depends
from datetime import datetime, timedelta
import random

from app.api.deps import validate_api_key
from app.db.models import User
from app.api.v1.aiops import (
    log_store, metric_store, alert_store,
    LogEntry, MetricEntry, AlertEntry, LogLevel
)

router = APIRouter()


def generate_database_incident():
    """Generate a realistic database connection failure scenario"""
    base_time = datetime.utcnow()
    
    logs = [
        LogEntry(
            timestamp=base_time - timedelta(minutes=5),
            level=LogLevel.WARNING,
            source="api-server-01",
            message="Database query slow: 2.5s response time",
            metadata={"query_time": 2.5, "db_host": "prod-db-1"}
        ),
        LogEntry(
            timestamp=base_time - timedelta(minutes=3),
            level=LogLevel.ERROR,
            source="api-server-01",
            message="Database connection timeout after 30s",
            metadata={"error": "ECONNREFUSED", "db_host": "prod-db-1"}
        ),
        LogEntry(
            timestamp=base_time - timedelta(minutes=2),
            level=LogLevel.CRITICAL,
            source="api-server-01",
            message="Connection pool exhausted: 0/50 connections available",
            metadata={"pool_size": 50, "available": 0}
        ),
    ]
    
    metrics = [
        MetricEntry(
            timestamp=base_time - timedelta(minutes=4),
            source="api-server-01",
            metric_name="database_connections",
            value=45.0,
            unit="count"
        ),
        MetricEntry(
            timestamp=base_time - timedelta(minutes=2),
            source="api-server-01",
            metric_name="database_connections",
            value=50.0,
            unit="count"
        ),
        MetricEntry(
            timestamp=base_time - timedelta(minutes=1),
            source="api-server-01",
            metric_name="error_rate",
            value=15.5,
            unit="percent"
        ),
    ]
    
    alerts = [
        AlertEntry(
            timestamp=base_time - timedelta(minutes=2),
            source="prometheus",
            severity="critical",
            title="Database Connection Pool Exhausted on api-server-01",
            description="All database connections in use on api-server-01, new requests failing",
            metadata={"threshold": 45, "current": 50, "service": "api-server-01"}
        ),
    ]
    
    return logs, metrics, alerts


def generate_high_cpu_incident():
    """Generate a high CPU usage scenario"""
    base_time = datetime.utcnow()
    
    logs = [
        LogEntry(
            timestamp=base_time - timedelta(minutes=10),
            level=LogLevel.INFO,
            source="web-server-02",
            message="Started batch processing job",
            metadata={"job_id": "batch-001", "records": 100000}
        ),
        LogEntry(
            timestamp=base_time - timedelta(minutes=5),
            level=LogLevel.WARNING,
            source="web-server-02",
            message="High CPU usage detected: 85%",
            metadata={"cpu_percent": 85}
        ),
        LogEntry(
            timestamp=base_time - timedelta(minutes=2),
            level=LogLevel.ERROR,
            source="web-server-02",
            message="Request timeout: CPU threshold exceeded",
            metadata={"cpu_percent": 95, "timeout": 30}
        ),
    ]
    
    metrics = [
        MetricEntry(
            timestamp=base_time - timedelta(minutes=8),
            source="web-server-02",
            metric_name="cpu_usage",
            value=65.0,
            unit="percent"
        ),
        MetricEntry(
            timestamp=base_time - timedelta(minutes=5),
            source="web-server-02",
            metric_name="cpu_usage",
            value=85.0,
            unit="percent"
        ),
        MetricEntry(
            timestamp=base_time - timedelta(minutes=2),
            source="web-server-02",
            metric_name="cpu_usage",
            value=95.5,
            unit="percent"
        ),
        MetricEntry(
            timestamp=base_time - timedelta(minutes=2),
            source="web-server-02",
            metric_name="memory_usage",
            value=88.0,
            unit="percent"
        ),
    ]
    
    alerts = [
        AlertEntry(
            timestamp=base_time - timedelta(minutes=3),
            source="cloudwatch",
            severity="warning",
            title="High CPU Usage on web-server-02",
            description="CPU usage above 80% for 5 minutes on web-server-02",
            metadata={"threshold": 80, "current": 95.5, "duration": "5m", "service": "web-server-02"}
        ),
    ]
    
    return logs, metrics, alerts


def generate_api_latency_incident():
    """Generate API performance degradation scenario"""
    base_time = datetime.utcnow()
    
    logs = [
        LogEntry(
            timestamp=base_time - timedelta(minutes=7),
            level=LogLevel.WARNING,
            source="api-gateway",
            message="Slow API response: /api/users took 1.2s",
            metadata={"endpoint": "/api/users", "response_time": 1.2}
        ),
        LogEntry(
            timestamp=base_time - timedelta(minutes=4),
            level=LogLevel.ERROR,
            source="api-gateway",
            message="API timeout: /api/orders exceeded 5s limit",
            metadata={"endpoint": "/api/orders", "timeout": 5}
        ),
        LogEntry(
            timestamp=base_time - timedelta(minutes=2),
            level=LogLevel.CRITICAL,
            source="api-gateway",
            message="Multiple API endpoints experiencing latency spikes",
            metadata={"affected_endpoints": 5, "p99_latency": 8.5}
        ),
    ]
    
    metrics = [
        MetricEntry(
            timestamp=base_time - timedelta(minutes=6),
            source="api-gateway",
            metric_name="api_latency_p99",
            value=800.0,
            unit="ms"
        ),
        MetricEntry(
            timestamp=base_time - timedelta(minutes=3),
            source="api-gateway",
            metric_name="api_latency_p99",
            value=3500.0,
            unit="ms"
        ),
        MetricEntry(
            timestamp=base_time - timedelta(minutes=1),
            source="api-gateway",
            metric_name="api_latency_p99",
            value=8500.0,
            unit="ms"
        ),
    ]
    
    alerts = [
        AlertEntry(
            timestamp=base_time - timedelta(minutes=3),
            source="datadog",
            severity="critical",
            title="API Latency Spike on api-gateway",
            description="P99 latency increased from 800ms to 8500ms on api-gateway",
            metadata={"baseline": 800, "current": 8500, "service": "api-gateway"}
        ),
    ]
    
    return logs, metrics, alerts


@router.post("/generate/database-incident", tags=["AIOps Testing"])
async def create_database_incident(user: User = Depends(validate_api_key)):
    """
    Generate a realistic database connection failure scenario
    
    **Use Case:** Test the correlation engine with a common incident pattern
    """
    
    logs, metrics, alerts = generate_database_incident()
    
    log_store.extend(logs)
    metric_store.extend(metrics)
    alert_store.extend(alerts)
    
    return {
        "success": True,
        "scenario": "database_connection_failure",
        "generated": {
            "logs": len(logs),
            "metrics": len(metrics),
            "alerts": len(alerts)
        },
        "message": "Database incident scenario generated. Run /correlation/correlate to analyze.",
        "next_step": "POST /v1/correlation/correlate"
    }


@router.post("/generate/high-cpu-incident", tags=["AIOps Testing"])
async def create_high_cpu_incident(user: User = Depends(validate_api_key)):
    """
    Generate a high CPU usage scenario
    
    **Use Case:** Test resource exhaustion detection
    """
    
    logs, metrics, alerts = generate_high_cpu_incident()
    
    log_store.extend(logs)
    metric_store.extend(metrics)
    alert_store.extend(alerts)
    
    return {
        "success": True,
        "scenario": "high_cpu_memory",
        "generated": {
            "logs": len(logs),
            "metrics": len(metrics),
            "alerts": len(alerts)
        },
        "message": "High CPU incident scenario generated. Run /correlation/correlate to analyze.",
        "next_step": "POST /v1/correlation/correlate"
    }


@router.post("/generate/api-latency-incident", tags=["AIOps Testing"])
async def create_api_latency_incident(user: User = Depends(validate_api_key)):
    """
    Generate API performance degradation scenario
    
    **Use Case:** Test latency spike detection
    """
    
    logs, metrics, alerts = generate_api_latency_incident()
    
    log_store.extend(logs)
    metric_store.extend(metrics)
    alert_store.extend(alerts)
    
    return {
        "success": True,
        "scenario": "api_latency_spike",
        "generated": {
            "logs": len(logs),
            "metrics": len(metrics),
            "alerts": len(alerts)
        },
        "message": "API latency incident scenario generated. Run /correlation/correlate to analyze.",
        "next_step": "POST /v1/correlation/correlate"
    }


@router.post("/generate/random-incident", tags=["AIOps Testing"])
async def create_random_incident(user: User = Depends(validate_api_key)):
    """
    Generate a random incident scenario
    
    **Use Case:** Quick testing with varied scenarios
    """
    
    scenarios = [
        ("database_connection_failure", generate_database_incident),
        ("high_cpu_memory", generate_high_cpu_incident),
        ("api_latency_spike", generate_api_latency_incident),
    ]
    
    scenario_name, generator = random.choice(scenarios)
    logs, metrics, alerts = generator()
    
    log_store.extend(logs)
    metric_store.extend(metrics)
    alert_store.extend(alerts)
    
    return {
        "success": True,
        "scenario": scenario_name,
        "generated": {
            "logs": len(logs),
            "metrics": len(metrics),
            "alerts": len(alerts)
        },
        "message": f"Random incident ({scenario_name}) generated. Run /correlation/correlate to analyze.",
        "next_step": "POST /v1/correlation/correlate"
    }
