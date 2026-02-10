# 🚀 FREE AI SETUP - COMPLETE GUIDE

## ✅ **WHAT I'VE DONE**

I've integrated **3 completely FREE AI APIs** into Cleara:

1. ✅ **Hugging Face** - Unlimited requests (rate-limited)
2. ✅ **Groq** - 14,400 requests/day, ultra-fast
3. ✅ **Gemini** - 1M tokens/month

**Total cost: $0/month**

---

## 📋 **SETUP CHECKLIST**

### **Step 1: Get API Keys** (10 minutes, no credit card!)

#### **1.1 Hugging Face** ⭐

1. Go to: https://huggingface.co/settings/tokens
2. Click "New token"
3. Name: `Cleara`
4. **Permissions:** Select these checkboxes:
   - ✅ Read access to contents of all repos
   - ✅ **Make calls to Inference Providers** (IMPORTANT!)
   - ✅ Make calls to your Inference Endpoints
5. Click "Create token"
6. Copy the token (starts with `hf_...`)
7. Save it!

#### **1.2 Groq** ⚡

1. Go to: https://console.groq.com/
2. Click "Sign Up" (free, no credit card)
3. Verify your email
4. Go to "API Keys" in sidebar
5. Click "Create API Key"
6. Name: `Cleara`
7. Copy the key (starts with `gsk_...`)
8. Save it!

#### **1.3 Google Gemini** 🌟

1. Go to: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Select "Create API key in new project"
4. Copy the key (starts with `AIza...`)
5. Save it!

---

### **Step 2: Add Keys to Backend** (2 minutes)

1. Open terminal in backend folder:
   ```bash
   cd "C:\Users\welcome\OneDrive\Desktop\Cleara API\Cleara-API\backend"
   ```

2. Copy the example env file:
   ```bash
   copy .env.example .env
   ```

3. Open `.env` file and add your keys:
   ```env
   HUGGINGFACE_API_KEY=hf_your_actual_token_here
   GROQ_API_KEY=gsk_your_actual_key_here
   GOOGLE_API_KEY=AIza_your_actual_key_here
   ```

4. Save the file!

---

### **Step 3: Install Dependencies** (5 minutes)

```bash
# In backend folder
cd backend

# Activate virtual environment (if not already)
venv\Scripts\activate

# Install new AI packages
pip install huggingface-hub groq google-generativeai

# Or install all requirements
pip install -r requirements.txt
```

---

### **Step 4: Test It!** (1 minute)

Start the backend:

```bash
uvicorn app.main:app --reload
```

Then open: http://localhost:8000/docs

You'll see new AI endpoints:
- ✅ `POST /v1/ai/clean` - AI-powered data cleaning
- ✅ `POST /v1/ai/extract-entities` - Extract names, emails, etc.
- ✅ `POST /v1/ai/classify` - Classify text
- ✅ `POST /v1/ai/validate` - AI validation
- ✅ `GET /v1/ai/status` - Check which providers are active

---

## 🎯 **QUICK TEST**

### **Test AI Cleaning:**

1. Go to: http://localhost:8000/docs
2. Find `POST /v1/ai/clean`
3. Click "Try it out"
4. Paste this example:

```json
{
  "data": {
    "name": "  john DOE  ",
    "email": "john@gmial.com",
    "phone": "123-456-7890"
  },
  "instructions": "Fix email typos and standardize formatting"
}
```

5. Click "Execute"
6. See the AI clean your data! 🎉

---

## 📊 **WHAT YOU GET**

### **New AI Endpoints:**

| Endpoint | What it does | Provider | Cost |
|----------|--------------|----------|------|
| `/ai/clean` | Clean data with AI | Groq/Gemini/HF | **$0** |
| `/ai/extract-entities` | Find names, emails, etc. | Hugging Face | **$0** |
| `/ai/classify` | Classify text | Hugging Face | **$0** |
| `/ai/validate` | AI validation | Groq/Gemini | **$0** |
| `/ai/status` | Check providers | - | **$0** |

---

## 🔥 **FEATURES**

### **Automatic Fallbacks:**

If one provider fails, it automatically tries the next:

```
1. Try Groq (fastest)
   ↓ (if fails)
2. Try Gemini (generous free tier)
   ↓ (if fails)
3. Try Hugging Face (unlimited)
```

### **Smart Provider Selection:**

- **Speed priority:** Uses Groq (500 tokens/sec!)
- **Quality priority:** Uses Gemini
- **Unlimited:** Uses Hugging Face

---

## 💰 **COST BREAKDOWN**

### **For 10,000 Requests/Month:**

| Provider | Requests | Cost |
|----------|----------|------|
| Hugging Face | Unlimited | **$0** |
| Groq | 14,400/day | **$0** |
| Gemini | ~30,000/month | **$0** |
| **Total** | **10,000+** | **$0** |

**You save: $50-100/month vs OpenAI!**

---

## 🎯 **USAGE EXAMPLES**

### **1. Clean Data:**

```python
import requests

response = requests.post(
    "http://localhost:8000/v1/ai/clean",
    json={
        "data": {"name": "  john DOE  "},
        "instructions": "Standardize name formatting"
    }
)

print(response.json())
# {"cleaned_data": {"name": "John Doe"}, ...}
```

### **2. Extract Entities:**

```python
response = requests.post(
    "http://localhost:8000/v1/ai/extract-entities",
    json={
        "text": "John Doe works at Google. Email: john@google.com"
    }
)

print(response.json())
# {"entities": [{"entity": "John Doe", "type": "PERSON"}, ...]}
```

### **3. Classify Text:**

```python
response = requests.post(
    "http://localhost:8000/v1/ai/classify",
    json={
        "text": "This product is amazing!",
        "labels": ["positive", "negative", "neutral"]
    }
)

print(response.json())
# {"classification": {"label": "positive", "score": 0.95}}
```

---

## 🐛 **TROUBLESHOOTING**

### **"No AI providers configured"**

**Solution:** Make sure you added API keys to `.env` file

```bash
# Check if .env exists
ls .env

# If not, copy from example
copy .env.example .env

# Then add your keys
```

### **"Provider X failed"**

**Solution:** The service automatically tries other providers. If all fail:

1. Check API keys are correct
2. Check internet connection
3. Check provider status pages

### **"Rate limit exceeded"**

**Solution:** The service automatically switches to another provider

- Hugging Face: Rate-limited but generous
- Groq: 30 requests/minute
- Gemini: 60 requests/minute

---

## 📈 **NEXT STEPS**

### **1. Test All Endpoints**

Go to http://localhost:8000/docs and try each AI endpoint

### **2. Check Status**

Visit `/v1/ai/status` to see which providers are active

### **3. Integrate into Frontend**

Use the AI endpoints from your Next.js frontend

### **4. Monitor Usage**

Watch the logs to see which provider is being used

---

## 🎉 **YOU'RE DONE!**

You now have **3 powerful AI models** integrated into Cleara for **$0/month**!

**What you can do:**
- ✅ AI-powered data cleaning
- ✅ Entity extraction
- ✅ Text classification
- ✅ Smart validation
- ✅ Automatic fallbacks

**Cost:** $0  
**Capacity:** 10,000+ requests/month  
**Speed:** Up to 500 tokens/second (Groq)

---

## 📞 **NEED HELP?**

If you get stuck:

1. Check the API keys are correct in `.env`
2. Make sure all packages are installed
3. Check the logs for errors
4. Test with `/v1/ai/status` endpoint

**Everything working?** 🎉

**Try the AI cleaning endpoint and see the magic!** ✨
