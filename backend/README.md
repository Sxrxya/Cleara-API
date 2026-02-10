# Cleara API - Backend

FastAPI-based backend for the Cleara AI-powered data cleaning platform.

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- pip or poetry

### Installation

1. **Create virtual environment**
```bash
python -m venv venv
```

2. **Activate virtual environment**
```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. **Run the development server**
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📁 Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── v1/              # API endpoints
│   │       ├── clean.py
│   │       ├── validate.py
│   │       ├── dedupe.py
│   │       ├── schema.py
│   │       ├── enrich.py
│   │       ├── usage.py
│   │       └── health.py
│   ├── core/                # Core configuration
│   │   ├── config.py
│   │   ├── security.py
│   │   └── logging.py
│   ├── models/              # Pydantic models
│   │   └── schemas.py
│   ├── services/            # Business logic
│   │   ├── cleaning/
│   │   ├── validation/
│   │   ├── deduplication/
│   │   ├── schema_detection/
│   │   └── enrichment/
│   └── main.py              # Application entry point
├── tests/                   # Test files
├── requirements.txt
└── .env.example
```

## 🧪 Testing

Run tests with pytest:

```bash
pytest
```

With coverage:

```bash
pytest --cov=app tests/
```

## 🔧 Configuration

Key environment variables:

```env
# Application
ENVIRONMENT=development
DEBUG=True

# Security
SECRET_KEY=your-secret-key

# AWS (Optional)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret

# Redis (Optional)
REDIS_HOST=localhost
REDIS_PORT=6379
```

## 📡 API Endpoints

### Health Checks
- `GET /health` - Health check
- `GET /health/ready` - Readiness check
- `GET /health/live` - Liveness check

### Data Operations
- `POST /v1/clean` - Clean data
- `POST /v1/validate` - Validate data
- `POST /v1/dedupe` - Deduplicate records
- `POST /v1/schema-detect` - Detect schema
- `POST /v1/enrich` - Enrich data
- `GET /v1/usage` - Get usage statistics

## 🔐 Authentication

API uses JWT tokens and API keys for authentication.

Example:
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"data": [...]}' \
     http://localhost:8000/v1/clean
```

## 🚀 Deployment

### Docker

Build and run with Docker:

```bash
docker build -t cleara-api .
docker run -p 8000:8000 cleara-api
```

### AWS Lambda

Deploy to AWS Lambda using the provided infrastructure code.

## 📊 Monitoring

- **Logs**: Structured JSON logging
- **Metrics**: CloudWatch metrics (production)
- **Tracing**: X-Ray tracing (production)

## 🛠️ Development

### Code Quality

```bash
# Format code
black app/

# Lint
flake8 app/

# Type checking
mypy app/
```

### Pre-commit Hooks

```bash
pre-commit install
pre-commit run --all-files
```

## 📝 License

Proprietary - All rights reserved

## 🤝 Support

For support, email support@cleara.io
