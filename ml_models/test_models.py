"""
Test script for trained ML models
"""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from inference.optimized_inference import (
    OptimizedDeduplicationModel,
    OptimizedEmailCorrectionModel
)


def test_deduplication_model():
    """Test deduplication model"""
    print("\n🔄 Testing Deduplication Model")
    print("=" * 50)
    
    try:
        model = OptimizedDeduplicationModel("models/deduplication")
        
        # Test data
        texts = [
            "John Doe",
            "john doe",  # Duplicate (case variation)
            "JOHN DOE",  # Duplicate (case variation)
            "Jane Smith",  # Different
            "Jon Doe",  # Similar but different
        ]
        
        print(f"Testing with {len(texts)} texts...")
        duplicates = model.find_duplicates(texts, threshold=0.85)
        
        print(f"\n✅ Found {len(duplicates)} duplicate pairs:")
        for i, j, score in duplicates:
            print(f"  - '{texts[i]}' ≈ '{texts[j]}' (similarity: {score:.3f})")
        
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_email_correction_model():
    """Test email correction model"""
    print("\n📧 Testing Email Correction Model")
    print("=" * 50)
    
    try:
        model = OptimizedEmailCorrectionModel("models/email_correction")
        
        # Test emails
        test_cases = [
            ("john@gmail.com", "john@gmail.com"),  # Correct
            ("john@gmial.com", "john@gmail.com"),  # Typo
            ("jane@yahooo.com", "jane@yahoo.com"),  # Typo
            ("test@hotmial.com", "test@hotmail.com"),  # Typo
        ]
        
        print("Testing email corrections...")
        correct_count = 0
        
        for original, expected in test_cases:
            corrected = model.correct(original)
            is_correct = corrected == expected
            correct_count += is_correct
            
            status = "✅" if is_correct else "❌"
            print(f"  {status} '{original}' → '{corrected}' (expected: '{expected}')")
        
        accuracy = correct_count / len(test_cases) * 100
        print(f"\n✅ Accuracy: {accuracy:.1f}% ({correct_count}/{len(test_cases)})")
        
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def main():
    """Run all tests"""
    print("\n" + "=" * 50)
    print("🧪 CLEARA ML MODELS - TEST SUITE")
    print("=" * 50)
    
    results = []
    
    # Test deduplication
    results.append(("Deduplication", test_deduplication_model()))
    
    # Test email correction
    results.append(("Email Correction", test_email_correction_model()))
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 TEST SUMMARY")
    print("=" * 50)
    
    for name, passed in results:
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{name}: {status}")
    
    all_passed = all(result[1] for result in results)
    
    if all_passed:
        print("\n🎉 All tests passed!")
    else:
        print("\n⚠️  Some tests failed. Check the output above.")
    
    return all_passed


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
