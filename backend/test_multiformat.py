"""
Test script for multi-format output feature
"""

import requests
import json

# Test data
test_data = {
    "data": {
        "name": "  john DOE  ",
        "email": "john@gmial.com",
        "phone": "1234567890"
    },
    "output_formats": [1, 6]  # Instant Insights + Executive Mode
}

print("🧪 Testing Multi-Format Output Feature...")
print(f"📤 Sending request with formats: {test_data['output_formats']}")
print()

try:
    response = requests.post(
        "http://localhost:8000/v1/ai/clean",
        json=test_data,
        timeout=10
    )
    
    if response.status_code == 200:
        result = response.json()
        print("✅ SUCCESS! Response received:")
        print()
        print("=" * 60)
        print(json.dumps(result, indent=2))
        print("=" * 60)
        print()
        
        # Check if outputs are present
        if "outputs" in result and result["outputs"]:
            print(f"✅ Multi-format outputs generated: {list(result['outputs'].keys())}")
            
            # Show Instant Insights summary
            if "instant_insights" in result["outputs"]:
                insights = result["outputs"]["instant_insights"]
                print()
                print("📊 INSTANT INSIGHTS:")
                print(f"  - Records: {insights['summary']['total_records']}")
                print(f"  - Quality Score: {insights['summary']['data_quality_score']}%")
                print(f"  - Recommendation: {insights['recommendation']}")
            
            # Show Executive Mode decision
            if "executive_mode" in result["outputs"]:
                exec_mode = result["outputs"]["executive_mode"]
                print()
                print("🎯 EXECUTIVE MODE:")
                print(f"  - Decision: {exec_mode['decision_summary']['recommendation']}")
                print(f"  - Risk Level: {exec_mode['decision_summary']['risk_level']}")
                print(f"  - Quality: {exec_mode['decision_summary']['quality_score']}%")
        else:
            print("⚠️ No multi-format outputs in response (using legacy format)")
    else:
        print(f"❌ ERROR: Status {response.status_code}")
        print(response.text)

except requests.exceptions.ConnectionError:
    print("❌ ERROR: Cannot connect to backend at http://localhost:8000")
    print("   Make sure the backend is running!")
except Exception as e:
    print(f"❌ ERROR: {str(e)}")
