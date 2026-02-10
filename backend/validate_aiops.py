"""
Cleara AIOps Engine - Metrics Validation Script
Tests all scenarios and validates the claimed metrics
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

def print_header(text):
    print("\n" + "="*50)
    print(f"  {text}")
    print("="*50)

def print_result(label, value, color=""):
    print(f"  {label}: {value}")

def test_scenario(scenario_name, endpoint):
    """Test a single incident scenario"""
    print(f"\n[Testing] {scenario_name}...")
    
    # Clear previous data
    try:
        requests.delete(f"{BASE_URL}/v1/aiops/telemetry/clear")
    except:
        pass
    
    # Generate incident
    try:
        gen_response = requests.post(f"{BASE_URL}/v1/testing/{endpoint}")
        gen_data = gen_response.json()
        
        total_events = (gen_data.get("generated", {}).get("logs", 0) + 
                       gen_data.get("generated", {}).get("metrics", 0) + 
                       gen_data.get("generated", {}).get("alerts", 0))
        
        print(f"  ✓ Generated {total_events} events")
        
    except Exception as e:
        print(f"  ✗ Generation failed: {e}")
        return None
    
    # Correlate
    try:
        corr_response = requests.post(f"{BASE_URL}/v1/correlation/correlate")
        corr_data = corr_response.json()
        
        incidents = corr_data.get("total_incidents", 0)
        noise_reduction = corr_data.get("noise_reduction", "0%")
        
        if corr_data.get("incidents") and len(corr_data["incidents"]) > 0:
            incident = corr_data["incidents"][0]
            confidence = incident.get("confidence", 0)
            root_cause = incident.get("root_cause", "Unknown")
            severity = incident.get("severity", "unknown")
            
            print(f"  ✓ Correlated to {incidents} incident(s)")
            print(f"  ✓ Noise Reduction: {noise_reduction}")
            print(f"  ✓ Confidence: {confidence}%")
            print(f"  ✓ Root Cause: {root_cause[:60]}...")
            print(f"  ✓ Severity: {severity}")
            
            return {
                "scenario": scenario_name,
                "events": total_events,
                "incidents": incidents,
                "noise_reduction": float(noise_reduction.replace("%", "")),
                "confidence": confidence,
                "root_cause": root_cause,
                "severity": severity
            }
        else:
            print(f"  ✗ No incidents detected")
            return None
            
    except Exception as e:
        print(f"  ✗ Correlation failed: {e}")
        return None

def main():
    print_header("CLEARA AIOPS METRICS VALIDATION")
    print(f"Testing at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Test scenarios
    scenarios = [
        ("Database Connection Failure", "generate/database-incident"),
        ("High CPU/Memory Usage", "generate/high-cpu-incident"),
        ("API Latency Spike", "generate/api-latency-incident"),
    ]
    
    results = []
    
    for name, endpoint in scenarios:
        result = test_scenario(name, endpoint)
        if result:
            results.append(result)
    
    # Calculate averages
    if results:
        print_header("VALIDATION RESULTS")
        
        avg_noise_reduction = sum(r["noise_reduction"] for r in results) / len(results)
        avg_confidence = sum(r["confidence"] for r in results) / len(results)
        total_events = sum(r["events"] for r in results)
        total_incidents = sum(r["incidents"] for r in results)
        
        print(f"\n  Tests Passed: {len(results)}/{len(scenarios)}")
        print(f"  Total Events Generated: {total_events}")
        print(f"  Total Incidents Detected: {total_incidents}")
        print(f"\n  📊 KEY METRICS:")
        print(f"  ✓ Average Noise Reduction: {avg_noise_reduction:.1f}%")
        print(f"  ✓ Average Confidence: {avg_confidence:.1f}%")
        print(f"  ✓ Event-to-Incident Ratio: {total_events}:{total_incidents}")
        
        # Validation checks
        print(f"\n  🎯 VALIDATION CHECKS:")
        
        if avg_noise_reduction >= 85:
            print(f"  ✅ Noise Reduction ≥85%: PASS ({avg_noise_reduction:.1f}%)")
        else:
            print(f"  ❌ Noise Reduction ≥85%: FAIL ({avg_noise_reduction:.1f}%)")
        
        if avg_confidence >= 70:
            print(f"  ✅ Confidence ≥70%: PASS ({avg_confidence:.1f}%)")
        else:
            print(f"  ❌ Confidence ≥70%: FAIL ({avg_confidence:.1f}%)")
        
        if total_incidents <= total_events * 0.15:  # Max 15% of events
            print(f"  ✅ Incident Reduction: PASS ({total_incidents}/{total_events})")
        else:
            print(f"  ❌ Incident Reduction: FAIL ({total_incidents}/{total_events})")
        
        # Detailed results
        print(f"\n  📋 DETAILED RESULTS:")
        for r in results:
            print(f"\n  Scenario: {r['scenario']}")
            print(f"    Events: {r['events']} → Incidents: {r['incidents']}")
            print(f"    Reduction: {r['noise_reduction']:.1f}%")
            print(f"    Confidence: {r['confidence']}%")
            print(f"    Severity: {r['severity']}")
        
        print("\n" + "="*50)
        print("  ✅ VALIDATION COMPLETE")
        print("="*50 + "\n")
        
    else:
        print("\n  ❌ All tests failed. Check if the server is running.")
        print("  Run: python -m uvicorn app.main:app --reload\n")

if __name__ == "__main__":
    main()
