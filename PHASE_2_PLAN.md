# Cleara AIOps - Phase 2 Implementation Plan

## Overview
Build the complete AIOps platform with UI, ML, integrations, and production deployment.

---

## Phase 2 Objectives

1. **9-Step UI Workflow** - Interactive incident investigation interface
2. **ML-Based Correlation** - Anomaly detection and pattern learning
3. **Slack/PagerDuty Integration** - Real-time alerting
4. **Production Deployment** - Docker, monitoring, scaling

---

## Part 1: 9-Step UI Workflow (Week 1-2)

### Step 1: Incident Dashboard
**Purpose**: Overview of all incidents
**Features**:
- Real-time incident list
- Severity filtering (critical, warning, info)
- Time range selection
- Noise reduction metrics display
- Quick stats (total incidents, events, reduction %)

### Step 2: Incident Selection
**Purpose**: Choose incident to investigate
**Features**:
- Click to select incident
- Preview: ID, root cause, confidence, affected services
- Timeline visualization
- Related incident suggestions

### Step 3: Event Timeline
**Purpose**: Visualize all related events
**Features**:
- Interactive timeline (logs, metrics, alerts)
- Color-coded by type and severity
- Zoom/pan controls
- Event filtering

### Step 4: Root Cause Analysis
**Purpose**: Display AI-detected root cause
**Features**:
- Confidence score visualization
- Pattern match details
- Alternative hypotheses (if confidence < 80%)
- Supporting evidence (which events contributed)

### Step 5: Affected Services Map
**Purpose**: Show service dependency impact
**Features**:
- Service topology graph
- Highlight affected services
- Show cascade effects
- Health status indicators

### Step 6: Recommendations
**Purpose**: Actionable remediation steps
**Features**:
- Prioritized action items
- Runbook links
- Similar past incidents
- Estimated resolution time

### Step 7: Investigation Tools
**Purpose**: Deep dive capabilities
**Features**:
- Log viewer with search
- Metric charts (CPU, memory, latency)
- Alert history
- Export data (JSON, CSV)

### Step 8: Collaboration
**Purpose**: Team coordination
**Features**:
- Add notes/comments
- Assign to team member
- Status updates (investigating, resolved, false positive)
- Share incident link

### Step 9: Resolution & Learning
**Purpose**: Close incident and improve
**Features**:
- Mark as resolved
- Add resolution notes
- Tag incident type
- Feedback: Was root cause correct? (Yes/No/Partial)
- Auto-update ML model with feedback

---

## Part 2: ML-Based Correlation (Week 2-3)

### 2.1 Anomaly Detection
**Algorithms**:
- Isolation Forest (unsupervised)
- LSTM for time-series anomalies
- Statistical outlier detection

**Features**:
- Detect unknown incident patterns
- Baseline learning (normal behavior)
- Adaptive thresholds
- Confidence scoring

### 2.2 Pattern Learning
**Approach**:
- Train on historical incidents
- Learn from user feedback (Step 9)
- Discover new patterns automatically
- Update pattern library

**Models**:
- Text classification (logs/alerts → incident type)
- Time-series forecasting (predict incidents)
- Clustering (group similar incidents)

### 2.3 Implementation
**Files**:
- `ml_models/anomaly_detection.py` - Isolation Forest, LSTM
- `ml_models/pattern_learning.py` - Pattern discovery
- `ml_models/training/train.py` - Model training pipeline
- `backend/app/api/v1/ml_correlation.py` - ML endpoints

---

## Part 3: Slack/PagerDuty Integration (Week 3)

### 3.1 Slack Integration
**Features**:
- Send incident notifications to Slack channel
- Interactive buttons (Acknowledge, Investigate, Resolve)
- Incident summary with root cause
- Link to full investigation UI

**Implementation**:
- Slack Webhook API
- Slash commands (`/cleara incidents`)
- OAuth for authentication

### 3.2 PagerDuty Integration
**Features**:
- Create PagerDuty incidents for critical alerts
- Auto-resolve when Cleara incident is resolved
- Sync status bidirectionally
- Include root cause in PagerDuty notes

**Implementation**:
- PagerDuty Events API v2
- Webhook for status updates
- Incident deduplication

### 3.3 Files
- `backend/app/integrations/slack.py`
- `backend/app/integrations/pagerduty.py`
- `backend/app/api/v1/integrations.py` - Integration endpoints

---

## Part 4: Production Deployment (Week 4)

### 4.1 Database Migration
**Current**: In-memory storage
**Target**: PostgreSQL + TimescaleDB (time-series)

**Schema**:
- `incidents` table
- `events` table (logs, metrics, alerts)
- `patterns` table
- `user_feedback` table
- `ml_models` table (model versions)

### 4.2 Docker Setup
**Services**:
- `backend` - FastAPI app
- `frontend` - Next.js app
- `postgres` - Database
- `redis` - Caching/queuing
- `celery` - Background tasks (ML training)
- `nginx` - Reverse proxy

### 4.3 Monitoring
**Tools**:
- Prometheus - Metrics
- Grafana - Dashboards
- Sentry - Error tracking
- CloudWatch/Datadog - Infrastructure

### 4.4 CI/CD
**Pipeline**:
- GitHub Actions
- Automated tests
- Docker build & push
- Deploy to AWS/GCP/Azure

---

## Implementation Order

### Week 1: UI Foundation
- [ ] Create incident dashboard page
- [ ] Build timeline component
- [ ] Add root cause display
- [ ] Implement service map visualization

### Week 2: UI Completion + ML Start
- [ ] Add investigation tools
- [ ] Build collaboration features
- [ ] Start ML anomaly detection
- [ ] Implement pattern learning

### Week 3: ML + Integrations
- [ ] Complete ML models
- [ ] Slack integration
- [ ] PagerDuty integration
- [ ] Testing

### Week 4: Production
- [ ] Database migration
- [ ] Docker setup
- [ ] Monitoring setup
- [ ] Deploy to production

---

## Tech Stack

### Frontend
- Next.js 14 (React)
- TypeScript
- TailwindCSS
- Recharts (visualizations)
- D3.js (service map)

### Backend
- FastAPI (Python)
- PostgreSQL + TimescaleDB
- Redis
- Celery
- scikit-learn, TensorFlow

### Infrastructure
- Docker + Docker Compose
- Nginx
- AWS/GCP (production)
- GitHub Actions (CI/CD)

---

## Success Metrics

### UI
- [ ] All 9 steps functional
- [ ] <2s page load time
- [ ] Mobile responsive

### ML
- [ ] >90% anomaly detection accuracy
- [ ] Discover 3+ new patterns per week
- [ ] <5% false positive rate

### Integrations
- [ ] <10s Slack notification latency
- [ ] 100% PagerDuty sync accuracy

### Production
- [ ] 99.9% uptime
- [ ] <500ms API response time
- [ ] Auto-scaling working

---

**Let's start building!** 🚀
