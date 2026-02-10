"""
Quick test script for AI integration
Run this to verify everything is working!
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

print("=" * 60)
print("🧪 TESTING AI INTEGRATION")
print("=" * 60)

# Check API keys
print("\n📋 Checking API Keys...")
print("-" * 60)

groq_key = os.getenv("GROQ_API_KEY")
hf_key = os.getenv("HUGGINGFACE_API_KEY")
gemini_key = os.getenv("GOOGLE_API_KEY")

if groq_key and groq_key != "gsk_your_key_here":
    print("✅ Groq API Key: Configured")
    print(f"   Key: {groq_key[:10]}...{groq_key[-10:]}")
else:
    print("❌ Groq API Key: Not configured")

if hf_key and hf_key != "hf_your_token_here":
    print("✅ Hugging Face API Key: Configured")
    print(f"   Key: {hf_key[:10]}...{hf_key[-10:]}")
else:
    print("⏳ Hugging Face API Key: Not configured (optional)")

if gemini_key and gemini_key != "AIza_your_key_here":
    print("✅ Gemini API Key: Configured")
    print(f"   Key: {gemini_key[:10]}...{gemini_key[-10:]}")
else:
    print("⏳ Gemini API Key: Not configured (optional)")

# Test Groq
print("\n🚀 Testing Groq (Ultra-fast AI)...")
print("-" * 60)

try:
    from groq import Groq
    
    if groq_key and groq_key != "gsk_your_key_here":
        client = Groq(api_key=groq_key)
        
        print("Sending test request to Groq...")
        response = client.chat.completions.create(
            model="llama-3.1-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": "Say 'Hello from Groq!' in exactly 3 words."
                }
            ],
            max_tokens=10,
            temperature=0.1
        )
        
        result = response.choices[0].message.content
        print(f"✅ Groq Response: {result}")
        print(f"✅ Groq is working perfectly!")
    else:
        print("⏭️  Skipping Groq test (no API key)")
        
except Exception as e:
    print(f"❌ Groq Error: {e}")

# Test Hugging Face
print("\n🤗 Testing Hugging Face...")
print("-" * 60)

try:
    from huggingface_hub import InferenceClient
    
    if hf_key and hf_key != "hf_your_token_here":
        client = InferenceClient(token=hf_key)
        
        print("Sending test request to Hugging Face...")
        response = client.text_generation(
            "Say hello in 3 words:",
            model="mistralai/Mistral-7B-Instruct-v0.2",
            max_new_tokens=10
        )
        
        print(f"✅ Hugging Face Response: {response}")
        print(f"✅ Hugging Face is working!")
    else:
        print("⏭️  Skipping Hugging Face test (no API key)")
        
except Exception as e:
    print(f"❌ Hugging Face Error: {e}")

# Test Gemini
print("\n🌟 Testing Google Gemini...")
print("-" * 60)

try:
    import google.generativeai as genai
    
    if gemini_key and gemini_key != "AIza_your_key_here":
        genai.configure(api_key=gemini_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        print("Sending test request to Gemini...")
        response = model.generate_content("Say hello in 3 words")
        
        print(f"✅ Gemini Response: {response.text}")
        print(f"✅ Gemini is working!")
    else:
        print("⏭️  Skipping Gemini test (no API key)")
        
except Exception as e:
    print(f"❌ Gemini Error: {e}")

# Summary
print("\n" + "=" * 60)
print("📊 SUMMARY")
print("=" * 60)

providers = []
if groq_key and groq_key != "gsk_your_key_here":
    providers.append("Groq (Ultra-fast)")
if hf_key and hf_key != "hf_your_token_here":
    providers.append("Hugging Face (Unlimited)")
if gemini_key and gemini_key != "AIza_your_key_here":
    providers.append("Gemini (Generous)")

if providers:
    print(f"✅ {len(providers)} AI provider(s) configured:")
    for p in providers:
        print(f"   • {p}")
    print(f"\n🎉 You're ready to use AI-powered data cleaning!")
    print(f"💰 Total cost: $0/month")
    print(f"\n🚀 Next step: Start the backend with:")
    print(f"   uvicorn app.main:app --reload")
    print(f"\n📖 Then visit: http://localhost:8000/docs")
else:
    print("⚠️  No AI providers configured yet")
    print("Add at least one API key to .env file")

print("=" * 60)
