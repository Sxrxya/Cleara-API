# Cleara AIOps Engine - Quick Test Script
# Tests the core AI correlation engine

$ErrorActionPreference = "Continue"
$token = "demo-token"
$base = "http://localhost:8000"

Write-Host "================================" -ForegroundColor Cyan
Write-Host "  CLEARA AIOPS ENGINE TEST" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Generate Database Incident
Write-Host "[1/4] 🔥 Generating database incident..." -ForegroundColor Yellow
try {
    $gen = Invoke-RestMethod -Uri "$base/v1/testing/generate/database-incident" `
        -Method POST -Headers @{Authorization="Bearer $token"}
    Write-Host "      ✅ Generated: $($gen.generated.logs) logs, $($gen.generated.metrics) metrics, $($gen.generated.alerts) alerts" -ForegroundColor Green
} catch {
    Write-Host "      ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Start-Sleep -Seconds 1

# Test 2: Run AI Correlation
Write-Host ""
Write-Host "[2/4] 🧠 Running AI correlation engine..." -ForegroundColor Yellow
try {
    $corr = Invoke-RestMethod -Uri "$base/v1/correlation/correlate?time_window_minutes=10" `
        -Method POST -Headers @{Authorization="Bearer $token"}
    Write-Host "      ✅ Correlation complete" -ForegroundColor Green
} catch {
    Write-Host "      ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 3: Display Results
Write-Host ""
Write-Host "[3/4] 📊 Analyzing results..." -ForegroundColor Yellow
Write-Host ""
Write-Host "      NOISE REDUCTION: $($corr.noise_reduction)" -ForegroundColor Green
Write-Host "      INCIDENTS FOUND: $($corr.total_incidents)" -ForegroundColor Green
Write-Host "      SUMMARY: $($corr.summary)" -ForegroundColor White
Write-Host ""

# Display each incident
foreach ($incident in $corr.incidents) {
    Write-Host "      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    Write-Host "      🚨 INCIDENT: $($incident.incident_id)" -ForegroundColor Red
    Write-Host "      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    Write-Host "      Root Cause:    $($incident.root_cause)" -ForegroundColor Yellow
    Write-Host "      Confidence:    $($incident.confidence)%" -ForegroundColor Cyan
    Write-Host "      Severity:      $($incident.severity)" -ForegroundColor Magenta
    Write-Host "      Services:      $($incident.affected_services -join ', ')" -ForegroundColor White
    Write-Host "      Related:       $($incident.related_logs) logs, $($incident.related_metrics) metrics, $($incident.related_alerts) alerts" -ForegroundColor Gray
    Write-Host ""
    Write-Host "      💡 Recommendation:" -ForegroundColor Green
    Write-Host "      $($incident.recommendation)" -ForegroundColor White
    Write-Host ""
}

# Test 4: Get Telemetry Stats
Write-Host "[4/4] 📈 Fetching telemetry stats..." -ForegroundColor Yellow
try {
    $stats = Invoke-RestMethod -Uri "$base/v1/aiops/telemetry/stats" `
        -Method GET -Headers @{Authorization="Bearer $token"}
    Write-Host "      ✅ Stats retrieved" -ForegroundColor Green
    Write-Host ""
    Write-Host "      Total Logs:    $($stats.logs.total) ($($stats.logs.errors) errors, $($stats.logs.warnings) warnings)" -ForegroundColor White
    Write-Host "      Total Metrics: $($stats.metrics.total) from $($stats.metrics.unique_sources) sources" -ForegroundColor White
    Write-Host "      Total Alerts:  $($stats.alerts.total) ($($stats.alerts.critical) critical, $($stats.alerts.warning) warnings)" -ForegroundColor White
} catch {
    Write-Host "      ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "  ✅ TEST COMPLETE!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎯 Key Metrics:" -ForegroundColor Yellow
Write-Host "   • Noise Reduction: $($corr.noise_reduction)" -ForegroundColor White
Write-Host "   • Incidents Detected: $($corr.total_incidents)" -ForegroundColor White
Write-Host "   • Confidence: $($corr.incidents[0].confidence)%" -ForegroundColor White
Write-Host ""
Write-Host "📚 Next Steps:" -ForegroundColor Yellow
Write-Host "   • View API docs: http://localhost:8000/docs" -ForegroundColor White
Write-Host "   • Try other scenarios: /v1/testing/generate/high-cpu-incident" -ForegroundColor White
Write-Host "   • Read guide: AIOPS_ENGINE_GUIDE.md" -ForegroundColor White
Write-Host ""
