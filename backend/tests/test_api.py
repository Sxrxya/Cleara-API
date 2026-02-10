"""
Test suite for Cleara API
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


# ============================================================================
# HEALTH CHECK TESTS
# ============================================================================

def test_root_endpoint():
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Cleara API"
    assert "version" in data


def test_health_check():
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_readiness_check():
    """Test readiness check endpoint"""
    response = client.get("/health/ready")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ready"


def test_liveness_check():
    """Test liveness check endpoint"""
    response = client.get("/health/live")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "alive"


# ============================================================================
# DATA CLEANING TESTS
# ============================================================================

def test_clean_data_basic():
    """Test basic data cleaning"""
    payload = {
        "data": [
            {"name": "  john DOE  ", "email": "john@example.com"}
        ],
        "options": {
            "trim": True,
            "normalize_case": True
        }
    }
    
    response = client.post("/v1/clean", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["total_records"] == 1


def test_clean_data_email_typo():
    """Test email typo correction"""
    payload = {
        "data": [
            {"email": "test@gmial.com"}
        ],
        "options": {
            "fix_emails": True
        },
        "explain": True
    }
    
    response = client.post("/v1/clean", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True


def test_clean_data_empty():
    """Test cleaning with empty data"""
    payload = {
        "data": []
    }
    
    response = client.post("/v1/clean", json=payload)
    assert response.status_code == 422  # Validation error


# ============================================================================
# VALIDATION TESTS
# ============================================================================

def test_validate_email():
    """Test email validation"""
    payload = {
        "data": {
            "email": "test@example.com"
        },
        "rules": [
            {"field": "email", "type": "email", "required": True}
        ]
    }
    
    response = client.post("/v1/validate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["valid"] is True


def test_validate_invalid_email():
    """Test invalid email validation"""
    payload = {
        "data": {
            "email": "not-an-email"
        },
        "rules": [
            {"field": "email", "type": "email", "required": True}
        ]
    }
    
    response = client.post("/v1/validate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["valid"] is False


def test_validate_phone():
    """Test phone validation"""
    payload = {
        "data": {
            "phone": "+1234567890"
        },
        "rules": [
            {"field": "phone", "type": "phone", "required": True}
        ]
    }
    
    response = client.post("/v1/validate", json=payload)
    assert response.status_code == 200


# ============================================================================
# DEDUPLICATION TESTS
# ============================================================================

def test_dedupe_basic():
    """Test basic deduplication"""
    payload = {
        "data": [
            {"name": "John Doe", "email": "john@example.com"},
            {"name": "Jon Doe", "email": "john@example.com"},
            {"name": "Jane Smith", "email": "jane@example.com"}
        ],
        "threshold": 0.85
    }
    
    response = client.post("/v1/dedupe", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["original_count"] == 3


def test_dedupe_analyze():
    """Test duplicate analysis"""
    payload = {
        "data": [
            {"name": "John Doe"},
            {"name": "John Doe"}
        ],
        "threshold": 0.9
    }
    
    response = client.post("/v1/dedupe/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True


# ============================================================================
# SCHEMA DETECTION TESTS
# ============================================================================

def test_schema_detect():
    """Test schema detection"""
    payload = {
        "data": [
            {"user_email": "john@example.com", "full_name": "John Doe"},
            {"email": "jane@example.com", "name": "Jane Smith"}
        ]
    }
    
    response = client.post("/v1/schema-detect", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "fields" in data
    assert "suggested_mapping" in data


def test_schema_apply():
    """Test schema mapping application"""
    payload = {
        "data": [
            {"user_email": "john@example.com"}
        ],
        "mapping": {
            "user_email": "email"
        }
    }
    
    response = client.post("/v1/schema-detect/apply", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True


# ============================================================================
# ENRICHMENT TESTS
# ============================================================================

def test_enrich_data():
    """Test data enrichment"""
    payload = {
        "data": [
            {"city": "New York", "email": "john@google.com"}
        ],
        "enrich_fields": ["country", "timezone"]
    }
    
    response = client.post("/v1/enrich", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True


def test_enrich_fields_list():
    """Test enrichable fields list"""
    response = client.get("/v1/enrich/fields")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "enrichable_fields" in data


# ============================================================================
# USAGE TESTS
# ============================================================================

def test_usage_stats():
    """Test usage statistics"""
    response = client.get("/v1/usage")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True


def test_usage_summary():
    """Test usage summary"""
    response = client.get("/v1/usage/summary")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True


# ============================================================================
# ERROR HANDLING TESTS
# ============================================================================

def test_404_error():
    """Test 404 error"""
    response = client.get("/nonexistent")
    assert response.status_code == 404


def test_validation_error():
    """Test validation error handling"""
    response = client.post("/v1/clean", json={"invalid": "data"})
    assert response.status_code == 422


# ============================================================================
# PERFORMANCE TESTS
# ============================================================================

def test_response_time():
    """Test that responses are fast"""
    import time
    
    start = time.time()
    response = client.get("/health")
    end = time.time()
    
    assert response.status_code == 200
    assert (end - start) < 1.0  # Should respond in less than 1 second


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
