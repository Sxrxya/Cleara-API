# ⭐ Cleara - AI-Powered Data Cleaning Platform

**"Make Your Data Make Sense."**

Cleara is a world-class, FAANG-grade SaaS API that performs intelligent data cleaning, validation, deduplication, schema detection, and enrichment using advanced AI models.

---

## 🚀 Features

### Core Capabilities
- **🧹 Data Cleaning**: Trim, normalize, fix casing, remove whitespace
- **✅ Validation**: Email, phone, address, names, dates
- **🔍 Deduplication**: MiniLM embeddings with cosine similarity
- **🗺️ Schema Detection**: Auto-map messy JSON to clean structure
- **🎯 Enrichment**: Predict missing fields using AI
- **📊 Explainability**: Understand why corrections were made
- **⚡ Speed**: Latency < 200ms
- **📈 Scalability**: 10M+ requests/month
- **🛡️ Reliability**: 99.9% uptime SLA

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    API Gateway (AWS)                     │
│            Rate Limiting • JWT Auth • Versioning         │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌──────▼──────┐  ┌────────▼────────┐
│   Cleaning     │  │ Validation  │  │  Deduplication  │
│   Service      │  │  Service    │  │   AI Service    │
└────────────────┘  └─────────────┘  └─────────────────┘
        │                   │                   │
┌───────▼────────┐  ┌──────▼──────┐  ┌────────▼────────┐
│   Embeddings   │  │   Schema    │  │   Enrichment    │
│   Service      │  │  Detection  │  │   AI Service    │
└────────────────┘  └─────────────┘  └─────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌──────▼──────┐  ┌────────▼────────┐
│   DynamoDB     │  │     S3      │  │  ElastiCache    │
│  (Metadata)    │  │ (Models)    │  │   (Cache)       │
└────────────────┘  └─────────────┘  └─────────────────┘
```

---

## 📦 Project Structure

```
cleara-api/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── v1/
│   │   │   │   ├── clean.py
│   │   │   │   ├── validate.py
│   │   │   │   ├── dedupe.py
│   │   │   │   ├── schema.py
│   │   │   │   └── enrich.py
│   │   ├── core/              # Core configuration
│   │   │   ├── config.py
│   │   │   ├── security.py
│   │   │   └── logging.py
│   │   ├── models/            # Data models
│   │   ├── services/          # Business logic
│   │   │   ├── cleaning/
│   │   │   ├── validation/
│   │   │   ├── deduplication/
│   │   │   ├── schema_detection/
│   │   │   └── enrichment/
│   │   ├── ml/                # ML models
│   │   │   ├── embeddings/
│   │   │   ├── classifiers/
│   │   │   └── inference/
│   │   └── main.py
│   ├── tests/
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/                   # Next.js dashboard
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── styles/
│   ├── public/
│   └── package.json
├── infrastructure/             # IaC (Terraform)
│   ├── modules/
│   ├── environments/
│   └── main.tf
├── ml-models/                  # Model training
│   ├── deduplication/
│   ├── validation/
│   ├── schema_detection/
│   └── enrichment/
├── docs/                       # Documentation
│   ├── api-reference/
│   ├── guides/
│   └── tutorials/
└── scripts/                    # Utility scripts
```

---

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Validation**: Pydantic v2
- **Async**: asyncio, aiohttp
- **Testing**: pytest, pytest-asyncio

### ML/AI
- **Transformers**: Hugging Face Transformers
- **Embeddings**: sentence-transformers (MiniLM)
- **NER**: spaCy
- **ML**: scikit-learn, LightGBM
- **Deep Learning**: PyTorch

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI**: React 18, Tailwind CSS
- **Charts**: Recharts
- **Auth**: NextAuth.js
- **State**: Zustand

### Infrastructure
- **Cloud**: AWS
- **Compute**: Lambda, SageMaker, ECS
- **Database**: DynamoDB
- **Cache**: ElastiCache (Redis)
- **Storage**: S3
- **API Gateway**: AWS API Gateway
- **IaC**: Terraform
- **CI/CD**: GitHub Actions

### Monitoring
- **Metrics**: CloudWatch
- **Tracing**: X-Ray
- **Logging**: CloudWatch Logs
- **Alerting**: SNS

### Payments
- **Billing**: Stripe
- **Metering**: Custom usage tracking

---

## 🚦 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- AWS Account
- Stripe Account

### Local Development

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 📡 API Endpoints

### Base URL
```
Production: https://api.cleara.io/v1
Development: http://localhost:8000/v1
```

### Endpoints

#### Clean Data
```http
POST /v1/clean
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "data": [
    {"name": "  john DOE  ", "email": "john@gmial.com"},
    {"name": "JANE SMITH", "email": "jane@example.com"}
  ],
  "options": {
    "trim": true,
    "normalize_case": true,
    "fix_emails": true
  }
}
```

#### Validate Data
```http
POST /v1/validate
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "data": {
    "email": "test@example.com",
    "phone": "+1234567890",
    "name": "John Doe"
  },
  "fields": ["email", "phone", "name"]
}
```

#### Deduplicate
```http
POST /v1/dedupe
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "data": [
    {"name": "John Doe", "company": "Acme Corp"},
    {"name": "Jon Doe", "company": "ACME Corporation"}
  ],
  "threshold": 0.85
}
```

---

## 💰 Pricing

### Free Tier
- 500 requests/month
- 1 project
- Community support

### Pro - ₹799/month
- 100,000 requests/month
- 5 projects
- Priority support
- 99.9% SLA

### Growth - ₹4,999/month
- 1,000,000 requests/month
- Unlimited projects
- Dedicated support
- 99.95% SLA
- Custom integrations

### Enterprise
- Custom volume
- Dedicated infrastructure
- 99.99% SLA
- On-premise option
- Custom contracts

---

## 🔒 Security

- **Encryption**: AES-256 at rest, TLS 1.3 in transit
- **Authentication**: JWT + API keys
- **Authorization**: Role-based access control
- **Compliance**: GDPR, SOC 2 (planned)
- **Rate Limiting**: Tier-based throttling
- **Audit Logs**: Complete request tracking

---

## 📊 Performance

- **Latency**: p95 < 200ms
- **Throughput**: 10,000+ req/sec
- **Uptime**: 99.9% SLA
- **Availability**: Multi-region (planned)

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md).

---

## 📄 License

Proprietary - All rights reserved

---

## 📞 Support

- **Email**: support@cleara.io
- **Documentation**: https://docs.cleara.io
- **Status**: https://status.cleara.io
- **Community**: https://community.cleara.io

---

## 🗺️ Roadmap

### Q1 2026
- [x] Core API development
- [x] ML models training
- [ ] Beta launch
- [ ] Initial customer onboarding

### Q2 2026
- [ ] Enterprise features
- [ ] Multi-region deployment
- [ ] Advanced analytics
- [ ] SDK releases (Python, Node.js, Go)

### Q3 2026
- [ ] No-code integrations
- [ ] Zapier/Make.com connectors
- [ ] CRM integrations
- [ ] Batch processing API

### Q4 2026
- [ ] On-premise offering
- [ ] Advanced AI models
- [ ] Custom model training
- [ ] White-label solution

---

**Built with ❤️ by the Cleara Team**
