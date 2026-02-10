# 🚀 Cleara AIOps - Quick Start & Deployment Guide

## Quick Start (Development)

### **1. Backend is Already Running** ✅
Your backend is running at: `http://localhost:8000`

### **2. Frontend is Already Running** ✅
Your frontend is running at: `http://localhost:3000`

### **3. Access the AIOps Dashboard**
```
http://localhost:3000/aiops
```

### **4. Test the System**

#### **Option A: Use the UI**
1. Go to `http://localhost:3000/aiops`
2. Click "Generate Test Incident"
3. Watch the incident appear in the dashboard
4. Click on the incident to investigate

#### **Option B: Use the API**
```bash
# Generate a test incident
curl -X POST http://localhost:8000/v1/testing/generate/database-incident

# Run correlation
curl -X POST http://localhost:8000/v1/correlation/correlate

# Check ML anomalies
curl -X POST http://localhost:8000/v1/ml/anomalies

# Discover patterns
curl -X POST http://localhost:8000/v1/ml/discover-patterns
```

---

## 🔧 **Configure Integrations (Optional)**

### **Slack Integration**

1. **Create Slack Webhook**:
   - Go to https://api.slack.com/apps
   - Create new app → Incoming Webhooks
   - Add webhook to workspace
   - Copy webhook URL

2. **Set Environment Variable**:
   ```bash
   # Windows (PowerShell)
   $env:SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
   
   # Or add to .env file
   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
   ```

3. **Test Slack Notification**:
   ```bash
   curl -X POST http://localhost:8000/v1/integrations/slack/notify \
     -H "Content-Type: application/json" \
     -d '{
       "incident_id": "INC-TEST-001",
       "root_cause": "Test incident",
       "confidence": 95.0,
       "severity": "warning",
       "affected_services": ["test-service"],
       "recommendation": "This is a test"
     }'
   ```

### **PagerDuty Integration**

1. **Get Integration Key**:
   - Go to PagerDuty → Services
   - Select service → Integrations
   - Add integration → Events API v2
   - Copy Integration Key

2. **Set Environment Variable**:
   ```bash
   # Windows (PowerShell)
   $env:PAGERDUTY_INTEGRATION_KEY="your_integration_key_here"
   
   # Or add to .env file
   PAGERDUTY_INTEGRATION_KEY=your_integration_key_here
   ```

3. **Test PagerDuty**:
   ```bash
   curl -X POST http://localhost:8000/v1/integrations/pagerduty/create \
     -H "Content-Type: application/json" \
     -d '{
       "incident_id": "INC-TEST-001",
       "root_cause": "Test incident",
       "confidence": 95.0,
       "severity": "critical",
       "affected_services": ["test-service"],
       "recommendation": "This is a test"
     }'
   ```

---

## 📊 **API Documentation**

Access the interactive API docs:
```
http://localhost:8000/docs
```

---

## 🎯 **Complete Workflow Example**

### **Scenario: Simulate a Production Incident**

```bash
# 1. Generate a database incident
curl -X POST http://localhost:8000/v1/testing/generate/database-incident

# 2. Run AI correlation
curl -X POST http://localhost:8000/v1/correlation/correlate

# 3. Check for anomalies
curl -X POST http://localhost:8000/v1/ml/anomalies

# 4. Discover patterns
curl -X POST http://localhost:8000/v1/ml/discover-patterns

# 5. Send to Slack (if configured)
curl -X POST http://localhost:8000/v1/integrations/slack/notify \
  -H "Content-Type: application/json" \
  -d '{
    "incident_id": "INC-api-server-01-123",
    "root_cause": "Database connection pool exhausted",
    "confidence": 100.0,
    "severity": "critical",
    "affected_services": ["api-server-01"],
    "recommendation": "Check database server status"
  }'

# 6. Create PagerDuty incident (if configured)
curl -X POST http://localhost:8000/v1/integrations/pagerduty/create \
  -H "Content-Type: application/json" \
  -d '{
    "incident_id": "INC-api-server-01-123",
    "root_cause": "Database connection pool exhausted",
    "confidence": 100.0,
    "severity": "critical",
    "affected_services": ["api-server-01"],
    "recommendation": "Check database server status"
  }'
```

---

## 🐳 **Production Deployment (Docker)**

### **1. Create Production Environment File**

Create `.env.production`:
```env
# Database
DATABASE_URL=postgresql://user:password@postgres:5432/cleara

# Redis
REDIS_URL=redis://redis:6379/0

# Integrations
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
PAGERDUTY_INTEGRATION_KEY=your_integration_key_here

# Security
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=60

# Environment
ENVIRONMENT=production
```

### **2. Update Docker Compose**

Add to `docker-compose.yml`:
```yaml
services:
  postgres:
    image: timescale/timescaledb:latest-pg14
    environment:
      POSTGRES_USER: cleara
      POSTGRES_PASSWORD: your_password
      POSTGRES_DB: cleara
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    environment:
      - DATABASE_URL=postgresql://cleara:your_password@postgres:5432/cleara
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - postgres
      - redis

volumes:
  postgres_data:
```

### **3. Deploy**

```bash
# Build and start
docker-compose up -d

# Check logs
docker-compose logs -f backend

# Access
# Backend: http://localhost:8000
# Frontend: http://localhost:3000
```

---

## 📈 **Monitoring**

### **Health Check**
```bash
curl http://localhost:8000/health
```

### **Metrics**
```bash
# Telemetry stats
curl http://localhost:8000/v1/aiops/telemetry/stats

# ML stats
curl http://localhost:8000/v1/ml/stats

# Integration status
curl http://localhost:8000/v1/integrations/status
```

---

## 🎉 **You're All Set!**

Your Cleara AIOps platform is ready with:
- ✅ **9-step UI workflow** at `/aiops`
- ✅ **ML-based correlation** with anomaly detection
- ✅ **Slack/PagerDuty integrations** (optional)
- ✅ **86.3% noise reduction** (validated)
- ✅ **98.7% confidence** (validated)

**Start using it now at: http://localhost:3000/aiops** 🚀

---

## 📚 **Documentation**

- **API Docs**: http://localhost:8000/docs
- **Phase 1 Report**: `FINAL_VALIDATION_REPORT.md`
- **Phase 2 Summary**: `PHASE_2_SUMMARY.md`
- **Implementation Plan**: `PHASE_2_PLAN.md`

---

## 🆘 **Troubleshooting**

### **Backend not responding**
```bash
# Check if running
curl http://localhost:8000/health

# Restart if needed
cd backend
python -m uvicorn app.main:app --reload
```

### **Frontend not loading**
```bash
# Check if running
# Should see Next.js dev server

# Restart if needed
cd frontend
npm run dev
```

### **Integrations not working**
```bash
# Check status
curl http://localhost:8000/v1/integrations/status

# Verify environment variables
echo $SLACK_WEBHOOK_URL
echo $PAGERDUTY_INTEGRATION_KEY
```

---

**Happy AIOps-ing!** 🎉
