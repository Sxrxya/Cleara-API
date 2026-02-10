# 🔑 Cleara Demo Access & API Guide

Use these credentials to present Cleara or to start building your own integrations immediately.

---

### **1. Web Console Access (Dashboard)**
Log in to the Cleara UI to manage API keys, view usage analytics, and use the Workflow Playground.

- **URL:** `http://localhost:3000/login`
- **Email:** `demo@cleara.com`
- **Password:** `demo123`

---

### **2. Temporary API Key (Direct Ingress)**
If you are building an external script or API that needs to call Cleara, use this pre-authorized key:

- **Header Name:** `X-API-Key`
- **Value:** `cl_live_demo_key_2026_scientific_symposium`

*Note: In the backend, I have whitelisted this key for the Pro Tier for the duration of the conference.*

---

### **3. Sample API Request (Bash/Curl)**
Test if your integration is working by running this command:

```bash
curl -X POST http://localhost:8000/v1/clean \
-H "X-API-Key: cl_live_demo_key_2026_scientific_symposium" \
-H "Content-Type: application/json" \
-d '{
  "data": [
    {
      "fname": "  jOHN dOE  ",
      "email": "john@gmial.com",
      "obs": "Temp was 32.5c in NYC"
    }
  ],
  "options": {
    "use_ai_workflow": true
  }
}'
```

---

### **4. Developer Endpoints**
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1/clean` | POST | The main 9-step AI cleaning workflow. |
| `/v1/schema-detect` | POST | Infer structure from raw JSON arrays. |
| `/v1/analytics/metrics` | GET | Retrieve p99 latency and system health. |
| `/v1/playground` | - | Interactive UI for manual testing. |

---

### **5. Security Note**
The `demo123` password and the `X-API-Key` provided here are for **demonstration purposes** only. For production use, generate a unique key from the Cleara Dashboard.
