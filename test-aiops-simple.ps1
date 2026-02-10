# Cleara AIOps Engine - Quick Test
$token = "demo-token"
$base = "http://localhost:8000"

Write-Host "CLEARA AIOPS ENGINE TEST" -ForegroundColor Cyan
Write-Host ""

# Generate incident
Write-Host "Generating database incident..." -ForegroundColor Yellow
$gen = Invoke-RestMethod -Uri "$base/v1/testing/generate/database-incident" -Method POST -Headers @{Authorization = "Bearer $token" }
Write-Host "Generated: $($gen.generated.logs) logs, $($gen.generated.metrics) metrics" -ForegroundColor Green
Write-Host ""

# Correlate
Write-Host "Running AI correlation..." -ForegroundColor Yellow
$corr = Invoke-RestMethod -Uri "$base/v1/correlation/correlate" -Method POST -Headers @{Authorization = "Bearer $token" }
Write-Host "Noise Reduction: $($corr.noise_reduction)" -ForegroundColor Green
Write-Host "Incidents: $($corr.total_incidents)" -ForegroundColor Green
Write-Host ""

# Show incident
$incident = $corr.incidents[0]
Write-Host "INCIDENT DETECTED:" -ForegroundColor Red
Write-Host "Root Cause: $($incident.root_cause)" -ForegroundColor Yellow
Write-Host "Confidence: $($incident.confidence)%" -ForegroundColor Cyan
Write-Host "Recommendation: $($incident.recommendation)" -ForegroundColor White
