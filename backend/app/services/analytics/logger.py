"""
Analytics Layer for Cleara
Tracks p50, p95, p99 latency, errors, and model performance
"""

import time
import logging
import numpy as np
from typing import Dict, Any, List, Optional
from datetime import datetime

logger = logging.getLogger("cleara.analytics")

class AnalyticsService:
    """
    Step 9: Logging + Analytics
    Logs latency, errors, usage, and metrics
    """
    
    def __init__(self):
        self.latency_buffer = []  # Stores recent latencies
        self.error_log = []
        self.model_usage = {
            "gemini": 0,
            "groq": 0,
            "huggingface": 0
        }

    def log_request(
        self, 
        endpoint: str, 
        latency: float, 
        status_code: int, 
        provider: Optional[str] = None
    ):
        """Log a single request for metrics"""
        self.latency_buffer.append(latency)
        if len(self.latency_buffer) > 1000:
            self.latency_buffer.pop(0)
            
        if status_code >= 400:
            self.error_log.append({
                "time": datetime.utcnow(),
                "endpoint": endpoint,
                "status": status_code
            })
            
        if provider and provider in self.model_usage:
            self.model_usage[provider] += 1
            
        logger.info(
            f"API Metric: {endpoint} | {status_code} | {latency:.2f}ms | {provider}"
        )

    def get_metrics(self) -> Dict[str, Any]:
        """Calculate p50, p95, p99 metrics"""
        if not self.latency_buffer:
            return {"status": "no_data"}
            
        latencies = np.array(self.latency_buffer)
        return {
            "p50": float(np.percentile(latencies, 50)),
            "p95": float(np.percentile(latencies, 95)),
            "p99": float(np.percentile(latencies, 99)),
            "avg": float(np.mean(latencies)),
            "count": len(self.latency_buffer),
            "model_usage": self.model_usage,
            "recent_errors": len(self.error_log[-10:])
        }


# Global instance
_analytics = AnalyticsService()

def get_analytics() -> AnalyticsService:
    """Get Analytics instance"""
    return _analytics
