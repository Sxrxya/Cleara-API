export interface incident {
    incident_id: string;
    root_cause: string;
    confidence: number;
    affected_services: string[];
    related_alerts: number;
    related_logs: number;
    related_metrics: number;
    recommendation: string;
    time_window: string;
    severity: string;
    timestamp?: string;
}

export const downloadJSON = (data: any, filename: string) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `${filename}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
};

export const downloadCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row =>
            headers.map(header => {
                const value = row[header];
                return typeof value === 'object'
                    ? `"${JSON.stringify(value).replace(/"/g, '""')}"`
                    : `"${String(value).replace(/"/g, '""')}"`;
            }).join(',')
        )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `${filename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
};

export const generateTextReport = (incidents: incident[], stats: any) => {
    const timestamp = new Date().toLocaleString();
    let report = `AIOPS INCIDENT ANALYSIS REPORT\n`;
    report += `Generated: ${timestamp}\n`;
    report += `================================================\n\n`;

    report += `SUMMARY STATISTICS\n`;
    report += `-----------------\n`;
    report += `Total Incidents: ${stats.totalIncidents}\n`;
    report += `Total Events:    ${stats.totalEvents}\n`;
    report += `Noise Reduction: ${stats.noiseReduction}\n`;
    report += `Avg Confidence:  ${stats.avgConfidence}%\n\n`;

    report += `DETAILED INCIDENTS\n`;
    report += `================================================\n\n`;

    incidents.forEach((inc, index) => {
        report += `INCIDENT #${index + 1}: ${inc.incident_id}\n`;
        report += `Severity:     ${inc.severity.toUpperCase()}\n`;
        report += `Confidence:   ${inc.confidence}%\n`;
        report += `Services:     ${inc.affected_services.join(', ')}\n`;
        report += `Root Cause:   ${inc.root_cause}\n`;
        report += `Evidence:     ${inc.related_alerts} alerts, ${inc.related_logs} logs, ${inc.related_metrics} metrics\n`;
        report += `Recommendation: ${inc.recommendation}\n`;
        report += `------------------------------------------------\n\n`;
    });

    return report;
};

export const downloadTextReport = (incidents: incident[], stats: any, filename: string) => {
    const report = generateTextReport(incidents, stats);
    const blob = new Blob([report], { type: 'text/plain' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `${filename}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
};
