"""
Direct AIOps Engine Validation
Tests the correlation engine directly without API calls
"""

import sys
sys.path.append('.')

from app.api.v1.aiops_testing import (
    generate_database_incident,
    generate_high_cpu_incident,
    generate_api_latency_incident
)
from app.api.v1.aiops import log_store, metric_store, alert_store
from app.api.v1.correlation import correlate_events

def print_header(text):
    print("\n" + "="*60)
    print(f"  {text}")
    print("="*60)

def clear_stores():
    """Clear all data stores"""
    log_store.clear()
    metric_store.clear()
    alert_store.clear()

def test_scenario(name, generator_func):
    """Test a single scenario"""
    print(f"\n[Testing] {name}")
    print("-" * 60)
    
    # Clear previous data
    clear_stores()
    
    # Generate incident data
    logs, metrics, alerts = generator_func()
    log_store.extend(logs)
    metric_store.extend(metrics)
    alert_store.extend(alerts)
    
    total_events = len(logs) + len(metrics) + len(alerts)
    print(f"  Generated Events:")
    print(f"    • Logs: {len(logs)}")
    print(f"    • Metrics: {len(metrics)}")
    print(f"    • Alerts: {len(alerts)}")
    print(f"    • Total: {total_events}")
    
    # Run correlation
    incidents = correlate_events(time_window_minutes=15)
    
    print(f"\n  Correlation Results:")
    print(f"    • Incidents Detected: {len(incidents)}")
    
    if incidents:
        incident = incidents[0]
        
        # Calculate noise reduction
        noise_reduction = ((total_events - len(incidents)) / total_events * 100) if total_events > 0 else 0
        
        print(f"    • Noise Reduction: {noise_reduction:.1f}%")
        print(f"\n  Incident Details:")
        print(f"    • ID: {incident.incident_id}")
        print(f"    • Root Cause: {incident.root_cause}")
        print(f"    • Confidence: {incident.confidence}%")
        print(f"    • Severity: {incident.severity}")
        print(f"    • Affected Services: {', '.join(incident.affected_services)}")
        print(f"    • Related Events: {incident.related_logs} logs, {incident.related_metrics} metrics, {incident.related_alerts} alerts")
        print(f"\n  Recommendation:")
        print(f"    {incident.recommendation}")
        
        return {
            "name": name,
            "events": total_events,
            "incidents": len(incidents),
            "noise_reduction": noise_reduction,
            "confidence": incident.confidence,
            "severity": incident.severity
        }
    else:
        print("    • No incidents detected!")
        return None

def main():
    print_header("CLEARA AIOPS ENGINE - DIRECT VALIDATION")
    
    scenarios = [
        ("Database Connection Failure", generate_database_incident),
        ("High CPU/Memory Usage", generate_high_cpu_incident),
        ("API Latency Spike", generate_api_latency_incident),
    ]
    
    results = []
    
    for name, generator in scenarios:
        result = test_scenario(name, generator)
        if result:
            results.append(result)
    
    # Summary
    if results:
        print_header("VALIDATION SUMMARY")
        
        total_events = sum(r["events"] for r in results)
        total_incidents = sum(r["incidents"] for r in results)
        avg_noise_reduction = sum(r["noise_reduction"] for r in results) / len(results)
        avg_confidence = sum(r["confidence"] for r in results) / len(results)
        
        print(f"\n  Tests Completed: {len(results)}/{len(scenarios)}")
        print(f"  Total Events: {total_events}")
        print(f"  Total Incidents: {total_incidents}")
        print(f"  Event-to-Incident Ratio: {total_events}:{total_incidents}")
        
        print(f"\n  📊 KEY METRICS:")
        print(f"  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print(f"  ✓ Average Noise Reduction: {avg_noise_reduction:.1f}%")
        print(f"  ✓ Average Confidence: {avg_confidence:.1f}%")
        print(f"  ✓ Reduction Factor: {total_events/total_incidents:.1f}x")
        
        print(f"\n  🎯 VALIDATION CHECKS:")
        print(f"  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        
        # Check 1: Noise Reduction >= 85%
        if avg_noise_reduction >= 85:
            print(f"  ✅ Noise Reduction ≥85%: PASS ({avg_noise_reduction:.1f}%)")
        else:
            print(f"  ❌ Noise Reduction ≥85%: FAIL ({avg_noise_reduction:.1f}%)")
        
        # Check 2: Confidence >= 70%
        if avg_confidence >= 70:
            print(f"  ✅ Confidence Score ≥70%: PASS ({avg_confidence:.1f}%)")
        else:
            print(f"  ❌ Confidence Score ≥70%: FAIL ({avg_confidence:.1f}%)")
        
        # Check 3: Incident reduction
        reduction_ratio = total_events / total_incidents if total_incidents > 0 else 0
        if reduction_ratio >= 5:
            print(f"  ✅ Reduction Factor ≥5x: PASS ({reduction_ratio:.1f}x)")
        else:
            print(f"  ❌ Reduction Factor ≥5x: FAIL ({reduction_ratio:.1f}x)")
        
        # Detailed breakdown
        print(f"\n  📋 DETAILED BREAKDOWN:")
        print(f"  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        for r in results:
            print(f"\n  {r['name']}:")
            print(f"    Events: {r['events']} → Incidents: {r['incidents']}")
            print(f"    Noise Reduction: {r['noise_reduction']:.1f}%")
            print(f"    Confidence: {r['confidence']}%")
            print(f"    Severity: {r['severity']}")
        
        # Final verdict
        print(f"\n  🏆 FINAL VERDICT:")
        print(f"  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        
        all_passed = (avg_noise_reduction >= 85 and 
                     avg_confidence >= 70 and 
                     reduction_ratio >= 5)
        
        if all_passed:
            print(f"  ✅ ALL METRICS VALIDATED!")
            print(f"  Cleara AIOps Engine meets all performance targets.")
        else:
            print(f"  ⚠️  Some metrics need improvement.")
        
        print("\n" + "="*60 + "\n")
        
    else:
        print("\n  ❌ All tests failed!\n")

if __name__ == "__main__":
    main()
