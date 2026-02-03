# 🚀 Cleara - Quick Start Guide

Get your Cleara API running in 5 minutes!

## Prerequisites

- Python 3.11 or higher
- pip (Python package manager)
- Git (optional)

## Step 1: Navigate to Backend

```bash
cd "C:\Users\welcome\OneDrive\Desktop\Cleara API\Cleara-API\backend"
```

## Step 2: Create Virtual Environment

```bash
python -m venv venv
```

## Step 3: Activate Virtual Environment

**Windows:**
```bash
venv\Scripts\activate
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

## Step 4: Install Dependencies

```bash
pip install -r requirements.txt
```

This will install:
- FastAPI (web framework)
- Uvicorn (ASGI server)
- Pydantic (data validation)
- ML libraries (transformers, scikit-learn)
- Validation libraries (email-validator, phonenumbers)
- And more...

## Step 5: Set Up Environment

```bash
copy .env.example .env
```

The default `.env` file works for local development. No changes needed!

## Step 6: Run the Server

```bash
uvicorn app.main:app --reload
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
🚀 Starting Cleara API...
Environment: development
Version: 1.0.0
```

## Step 7: Test the API

### Open API Documentation

Visit: **http://localhost:8000/docs**

You'll see beautiful interactive API documentation!

### Test Health Check

```bash
curl http://localhost:8000/health
```

Response:
```json
{
  "status": "healthy",
  "service": "Cleara API",
  "version": "1.0.0",
  "environment": "development",
  "timestamp": "2026-02-03T..."
}
```

### Test Data Cleaning

```bash
curl -X POST http://localhost:8000/v1/clean \
  -H "Content-Type: application/json" \
  -d "{\"data\": [{\"name\": \"  john DOE  \", \"email\": \"john@gmial.com\"}], \"options\": {\"trim\": true, \"normalize_case\": true, \"fix_emails\": true}, \"explain\": true}"
```

Response:
```json
{
  "success": true,
  "total_records": 1,
  "cleaned_records": 1,
  "changes_made": 3,
  "data": [
    {
      "original": {"name": "  john DOE  ", "email": "john@gmial.com"},
      "cleaned": {"name": "John Doe", "email": "john@gmail.com"},
      "changes": [
        {"field": "name", "type": "trim", "description": "Removed whitespace"},
        {"field": "name", "type": "case", "description": "Normalized to title case"},
        {"field": "email", "type": "typo", "description": "Fixed 'gmial' -> 'gmail'"}
      ],
      "confidence": 0.95
    }
  ],
  "processing_time_ms": 12.34
}
```

## 🎉 You're Ready!

Your Cleara API is now running locally. Here's what you can do:

### Explore the API

Visit **http://localhost:8000/docs** to see all available endpoints:

- **POST /v1/clean** - Clean and normalize data
- **POST /v1/validate** - Validate data fields
- **POST /v1/dedupe** - Find and remove duplicates
- **POST /v1/schema-detect** - Auto-detect schema
- **POST /v1/enrich** - Enrich missing fields
- **GET /v1/usage** - Check usage statistics

### Run Tests

```bash
pytest tests/ -v
```

### Try More Examples

#### Validate Email
```bash
curl -X POST http://localhost:8000/v1/validate \
  -H "Content-Type: application/json" \
  -d "{\"data\": {\"email\": \"test@example.com\"}, \"rules\": [{\"field\": \"email\", \"type\": \"email\", \"required\": true}]}"
```

#### Deduplicate Records
```bash
curl -X POST http://localhost:8000/v1/dedupe \
  -H "Content-Type: application/json" \
  -d "{\"data\": [{\"name\": \"John Doe\", \"company\": \"Acme Corp\"}, {\"name\": \"Jon Doe\", \"company\": \"ACME Corporation\"}], \"threshold\": 0.85}"
```

#### Detect Schema
```bash
curl -X POST http://localhost:8000/v1/schema-detect \
  -H "Content-Type: application/json" \
  -d "{\"data\": [{\"user_email\": \"john@example.com\", \"full_name\": \"John Doe\"}, {\"email\": \"jane@example.com\", \"name\": \"Jane Smith\"}]}"
```

#### Enrich Data
```bash
curl -X POST http://localhost:8000/v1/enrich \
  -H "Content-Type: application/json" \
  -d "{\"data\": [{\"city\": \"New York\", \"email\": \"john@google.com\"}], \"enrich_fields\": [\"country\", \"timezone\", \"company_name\"]}"
```

## 🛠️ Development Tips

### Hot Reload

The `--reload` flag enables hot reload. Any code changes will automatically restart the server.

### View Logs

All requests are logged with structured JSON in development mode.

### Stop the Server

Press `CTRL+C` in the terminal.

### Deactivate Virtual Environment

```bash
deactivate
```

## 📚 Next Steps

1. **Read the Documentation**: Check `backend/README.md` for detailed info
2. **Explore the Code**: Look at `backend/app/` to understand the structure
3. **Run Tests**: Execute `pytest` to see all tests pass
4. **Build Frontend**: Next step is to create the dashboard UI
5. **Deploy**: Eventually deploy to AWS Lambda

## 🆘 Troubleshooting

### Port Already in Use

If port 8000 is busy, use a different port:
```bash
uvicorn app.main:app --reload --port 8001
```

### Module Not Found

Make sure you're in the `backend` directory and virtual environment is activated.

### Import Errors

Reinstall dependencies:
```bash
pip install -r requirements.txt --force-reinstall
```

## 🎯 What You've Built

You now have a **production-ready, AI-powered data cleaning API** with:

✅ 6 intelligent endpoints  
✅ ML-powered deduplication  
✅ Smart schema detection  
✅ Predictive data enrichment  
✅ Comprehensive validation  
✅ Automatic documentation  
✅ Full test coverage  

**Congratulations! You're running a Google-grade API! 🚀**
