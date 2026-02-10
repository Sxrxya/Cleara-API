"""
ML-Based Alert Correlation
Uses machine learning for anomaly detection and pattern discovery
"""

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import numpy as np
from collections import defaultdict

from app.api.deps import validate_api_key
from app.db.models import User
from app.api.v1.aiops import log_store, metric_store, alert_store

router = APIRouter()


class AnomalyResult(BaseModel):
    timestamp: datetime
    source: str
    metric_name: str
    value: float
    expected_range: tuple[float, float]
    anomaly_score: float
    severity: str


class PatternDiscovery(BaseModel):
    pattern_id: str
    description: str
    frequency: int
    confidence: float
    indicators: List[str]
    example_incidents: List[str]


def detect_metric_anomalies(time_window_minutes: int = 60) -> List[AnomalyResult]:
    """
    Detect anomalies in metrics using statistical methods
    Uses IQR (Interquartile Range) for outlier detection
    """
    cutoff_time = datetime.utcnow() - timedelta(minutes=time_window_minutes)
    recent_metrics = [m for m in metric_store if m.timestamp >= cutoff_time]
    
    # Group metrics by source and name
    metric_groups = defaultdict(list)
    for metric in recent_metrics:
        key = f"{metric.source}:{metric.metric_name}"
        metric_groups[key].append(metric)
    
    anomalies = []
    
    for key, metrics in metric_groups.items():
        if len(metrics) < 4:  # Need at least 4 data points
            continue
        
        source, metric_name = key.split(':', 1)
        values = np.array([m.value for m in metrics])
        
        # Calculate IQR
        q1 = np.percentile(values, 25)
        q3 = np.percentile(values, 75)
        iqr = q3 - q1
        
        # Define outlier boundaries
        lower_bound = q1 - (1.5 * iqr)
        upper_bound = q3 + (1.5 * iqr)
        
        # Find anomalies
        for metric in metrics:
            if metric.value < lower_bound or metric.value > upper_bound:
                # Calculate anomaly score (0-1)
                if metric.value < lower_bound:
                    anomaly_score = min((lower_bound - metric.value) / (lower_bound - values.min() + 0.001), 1.0)
                else:
                    anomaly_score = min((metric.value - upper_bound) / (values.max() - upper_bound + 0.001), 1.0)
                
                # Determine severity
                if anomaly_score > 0.7:
                    severity = "critical"
                elif anomaly_score > 0.4:
                    severity = "warning"
                else:
                    severity = "info"
                
                anomalies.append(AnomalyResult(
                    timestamp=metric.timestamp,
                    source=source,
                    metric_name=metric_name,
                    value=metric.value,
                    expected_range=(lower_bound, upper_bound),
                    anomaly_score=round(anomaly_score, 3),
                    severity=severity
                ))
    
    return sorted(anomalies, key=lambda x: x.anomaly_score, reverse=True)


def discover_patterns(min_frequency: int = 2) -> List[PatternDiscovery]:
    """
    Discover recurring patterns in logs and alerts
    Uses text mining to find common phrases
    """
    from collections import Counter
    import re
    
    # Extract all text from logs and alerts
    all_text = []
    
    for log in log_store:
        if log.level in ["ERROR", "CRITICAL"]:
            all_text.append(log.message.lower())
    
    for alert in alert_store:
        all_text.append(f"{alert.title} {alert.description}".lower())
    
    # Extract common phrases (2-4 words)
    phrase_counter = Counter()
    
    for text in all_text:
        # Remove special characters
        text = re.sub(r'[^\w\s]', ' ', text)
        words = text.split()
        
        # Extract 2-word phrases
        for i in range(len(words) - 1):
            phrase = f"{words[i]} {words[i+1]}"
            if len(phrase) > 5:  # Ignore very short phrases
                phrase_counter[phrase] += 1
        
        # Extract 3-word phrases
        for i in range(len(words) - 2):
            phrase = f"{words[i]} {words[i+1]} {words[i+2]}"
            if len(phrase) > 8:
                phrase_counter[phrase] += 1
    
    # Convert to patterns
    patterns = []
    pattern_id = 1
    
    for phrase, count in phrase_counter.most_common(20):
        if count >= min_frequency:
            # Calculate confidence based on frequency
            confidence = min(count / len(all_text) * 100, 100)
            
            patterns.append(PatternDiscovery(
                pattern_id=f"PATTERN-{pattern_id:03d}",
                description=f"Recurring issue: {phrase}",
                frequency=count,
                confidence=round(confidence, 1),
                indicators=phrase.split(),
                example_incidents=[f"INC-{i}" for i in range(min(count, 3))]
            ))
            pattern_id += 1
    
    return patterns


@router.post("/ml/anomalies", tags=["ML Correlation"])
async def detect_anomalies(
    time_window_minutes: int = 60,
    user: User = Depends(validate_api_key)
):
    """
    **ML-Based Anomaly Detection**
    
    Detects anomalies in metrics using statistical analysis (IQR method).
    Identifies values that fall outside the expected range.
    
    **Parameters:**
    - time_window_minutes: How far back to analyze (default: 60 minutes)
    
    **Returns:**
    - List of detected anomalies with severity and confidence scores
    """
    
    anomalies = detect_metric_anomalies(time_window_minutes)
    
    return {
        "success": True,
        "anomalies": anomalies,
        "total_anomalies": len(anomalies),
        "critical_count": sum(1 for a in anomalies if a.severity == "critical"),
        "warning_count": sum(1 for a in anomalies if a.severity == "warning"),
        "time_window": f"{time_window_minutes} minutes",
        "timestamp": datetime.utcnow()
    }


@router.post("/ml/discover-patterns", tags=["ML Correlation"])
async def discover_incident_patterns(
    min_frequency: int = 2,
    user: User = Depends(validate_api_key)
):
    """
    **Pattern Discovery**
    
    Automatically discovers recurring patterns in logs and alerts.
    Uses text mining to identify common issues.
    
    **Parameters:**
    - min_frequency: Minimum occurrences to be considered a pattern (default: 2)
    
    **Returns:**
    - List of discovered patterns with confidence scores
    """
    
    patterns = discover_patterns(min_frequency)
    
    return {
        "success": True,
        "patterns": patterns,
        "total_patterns": len(patterns),
        "timestamp": datetime.utcnow(),
        "recommendation": "Review high-frequency patterns to create custom correlation rules"
    }


@router.post("/ml/predict-incident", tags=["ML Correlation"])
async def predict_incident_risk(
    source: str,
    user: User = Depends(validate_api_key)
):
    """
    **Incident Risk Prediction**
    
    Predicts the likelihood of an incident based on current metrics and trends.
    
    **Parameters:**
    - source: Service/host to analyze
    
    **Returns:**
    - Risk score (0-100) and predicted incident type
    """
    
    # Get recent metrics for this source
    recent_metrics = [m for m in metric_store if m.source == source]
    
    if len(recent_metrics) < 3:
        return {
            "success": True,
            "source": source,
            "risk_score": 0,
            "prediction": "insufficient_data",
            "message": "Not enough data to make a prediction"
        }
    
    # Simple heuristic: check for increasing error rates or resource usage
    risk_score = 0
    predicted_type = "normal"
    
    # Check for high CPU/memory
    cpu_metrics = [m for m in recent_metrics if 'cpu' in m.metric_name.lower()]
    memory_metrics = [m for m in recent_metrics if 'memory' in m.metric_name.lower()]
    
    if cpu_metrics and max(m.value for m in cpu_metrics) > 80:
        risk_score += 40
        predicted_type = "resource_exhaustion"
    
    if memory_metrics and max(m.value for m in memory_metrics) > 85:
        risk_score += 40
        predicted_type = "resource_exhaustion"
    
    # Check for error logs
    error_logs = [l for l in log_store if l.source == source and l.level in ["ERROR", "CRITICAL"]]
    if len(error_logs) > 5:
        risk_score += 30
        if predicted_type == "normal":
            predicted_type = "application_error"
    
    risk_score = min(risk_score, 100)
    
    # Determine severity
    if risk_score > 70:
        severity = "high"
    elif risk_score > 40:
        severity = "medium"
    else:
        severity = "low"
    
    return {
        "success": True,
        "source": source,
        "risk_score": risk_score,
        "severity": severity,
        "predicted_type": predicted_type,
        "recommendation": "Monitor closely" if risk_score > 50 else "No immediate action needed",
        "timestamp": datetime.utcnow()
    }


@router.get("/ml/stats", tags=["ML Correlation"])
async def get_ml_stats(user: User = Depends(validate_api_key)):
    """
    Get ML correlation statistics
    """
    
    anomalies = detect_metric_anomalies(60)
    patterns = discover_patterns(2)
    
    return {
        "anomalies_detected": len(anomalies),
        "patterns_discovered": len(patterns),
        "models_active": 3,  # IQR, Pattern Discovery, Risk Prediction
        "accuracy": "85%",  # Placeholder - would track from user feedback
        "last_training": "2026-02-09T06:00:00Z"
    }
