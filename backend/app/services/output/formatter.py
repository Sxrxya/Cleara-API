"""
Cleara Output Formatter
Transforms AI intelligence into multiple output formats
"""

from typing import Dict, Any, List, Optional
from enum import Enum
import json
from datetime import datetime


class OutputFormat(str, Enum):
    """Available output formats"""
    JSON = "json"
    DASHBOARD = "dashboard"
    VISUALIZATION = "visualization"
    TABLE = "table"
    SUMMARY = "summary"
    REPORT = "report"
    INSIGHTS = "insights"
    PDF = "pdf"
    API_STRUCTURED = "api_structured"
    RECOMMENDATIONS = "recommendations"


class OutputFormatter:
    """
    Universal Output Formatter
    Transforms Cleara's internal intelligence into any requested format
    """
    
    def __init__(self):
        self.supported_formats = [f.value for f in OutputFormat]
    
    def format_output(
        self, 
        intelligence: Dict[str, Any], 
        output_format: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Transform intelligence into requested format
        
        Args:
            intelligence: Core AI analysis result
            output_format: Desired output format
            metadata: Additional context
            
        Returns:
            Formatted output
        """
        
        if output_format not in self.supported_formats:
            return self._format_json(intelligence, metadata)
        
        formatters = {
            OutputFormat.JSON: self._format_json,
            OutputFormat.DASHBOARD: self._format_dashboard,
            OutputFormat.VISUALIZATION: self._format_visualization,
            OutputFormat.TABLE: self._format_table,
            OutputFormat.SUMMARY: self._format_summary,
            OutputFormat.REPORT: self._format_report,
            OutputFormat.INSIGHTS: self._format_insights,
            OutputFormat.PDF: self._format_pdf,
            OutputFormat.API_STRUCTURED: self._format_api_structured,
            OutputFormat.RECOMMENDATIONS: self._format_recommendations,
        }
        
        formatter = formatters.get(output_format, self._format_json)
        return formatter(intelligence, metadata)
    
    def _format_json(self, intelligence: Dict[str, Any], metadata: Optional[Dict] = None) -> Dict[str, Any]:
        """Developer-friendly JSON format"""
        return {
            "format": "json",
            "data": intelligence,
            "metadata": metadata or {},
            "timestamp": datetime.utcnow().isoformat()
        }
    
    def _format_dashboard(self, intelligence: Dict[str, Any], metadata: Optional[Dict] = None) -> Dict[str, Any]:
        """Dashboard with widgets and charts"""
        
        # Extract key metrics
        metrics = intelligence.get("metrics", {})
        trends = intelligence.get("trends", {})
        
        widgets = []
        
        # Create KPI widgets
        for key, value in metrics.items():
            widgets.append({
                "type": "kpi",
                "title": key.replace("_", " ").title(),
                "value": value,
                "trend": trends.get(key, "neutral")
            })
        
        # Create chart widgets
        if "time_series" in intelligence:
            widgets.append({
                "type": "line_chart",
                "title": "Trend Over Time",
                "data": intelligence["time_series"]
            })
        
        if "categories" in intelligence:
            widgets.append({
                "type": "bar_chart",
                "title": "Category Distribution",
                "data": intelligence["categories"]
            })
        
        return {
            "format": "dashboard",
            "layout": "grid",
            "widgets": widgets,
            "metadata": metadata or {}
        }
    
    def _format_visualization(self, intelligence: Dict[str, Any], metadata: Optional[Dict] = None) -> Dict[str, Any]:
        """Chart and visualization format"""
        
        charts = []
        
        # Detect data types and suggest visualizations
        if "distribution" in intelligence:
            charts.append({
                "type": "pie_chart",
                "title": "Distribution",
                "data": intelligence["distribution"]
            })
        
        if "correlation" in intelligence:
            charts.append({
                "type": "heatmap",
                "title": "Correlation Matrix",
                "data": intelligence["correlation"]
            })
        
        if "scatter_data" in intelligence:
            charts.append({
                "type": "scatter_plot",
                "title": "Data Points",
                "data": intelligence["scatter_data"]
            })
        
        if "time_series" in intelligence:
            charts.append({
                "type": "line_chart",
                "title": "Time Series",
                "data": intelligence["time_series"]
            })
        
        return {
            "format": "visualization",
            "charts": charts,
            "metadata": metadata or {}
        }
    
    def _format_table(self, intelligence: Dict[str, Any], metadata: Optional[Dict] = None) -> Dict[str, Any]:
        """Tabular data format"""
        
        # Extract tabular data
        rows = intelligence.get("rows", [])
        columns = intelligence.get("columns", [])
        
        # If no explicit table structure, create from metrics
        if not rows and "metrics" in intelligence:
            columns = ["Metric", "Value", "Change"]
            rows = []
            for key, value in intelligence["metrics"].items():
                rows.append({
                    "Metric": key.replace("_", " ").title(),
                    "Value": value,
                    "Change": intelligence.get("trends", {}).get(key, "N/A")
                })
        
        return {
            "format": "table",
            "columns": columns,
            "rows": rows,
            "total_rows": len(rows),
            "metadata": metadata or {}
        }
    
    def _format_summary(self, intelligence: Dict[str, Any], metadata: Optional[Dict] = None) -> Dict[str, Any]:
        """Natural language summary"""
        
        summary_parts = []
        
        # Generate summary from intelligence
        if "overview" in intelligence:
            summary_parts.append(intelligence["overview"])
        
        if "key_findings" in intelligence:
            summary_parts.append("Key findings: " + ", ".join(intelligence["key_findings"]))
        
        if "metrics" in intelligence:
            metrics_text = []
            for key, value in intelligence["metrics"].items():
                metrics_text.append(f"{key.replace('_', ' ')}: {value}")
            summary_parts.append(". ".join(metrics_text))
        
        summary = ". ".join(summary_parts) if summary_parts else "Analysis complete."
        
        return {
            "format": "summary",
            "text": summary,
            "word_count": len(summary.split()),
            "metadata": metadata or {}
        }
    
    def _format_report(self, intelligence: Dict[str, Any], metadata: Optional[Dict] = None) -> Dict[str, Any]:
        """Detailed report format"""
        
        sections = []
        
        # Executive Summary
        sections.append({
            "title": "Executive Summary",
            "content": intelligence.get("overview", "Analysis completed successfully.")
        })
        
        # Key Findings
        if "key_findings" in intelligence:
            sections.append({
                "title": "Key Findings",
                "content": intelligence["key_findings"],
                "type": "list"
            })
        
        # Metrics
        if "metrics" in intelligence:
            sections.append({
                "title": "Metrics",
                "content": intelligence["metrics"],
                "type": "table"
            })
        
        # Recommendations
        if "recommendations" in intelligence:
            sections.append({
                "title": "Recommendations",
                "content": intelligence["recommendations"],
                "type": "list"
            })
        
        return {
            "format": "report",
            "title": metadata.get("title", "Cleara Analysis Report") if metadata else "Cleara Analysis Report",
            "date": datetime.utcnow().isoformat(),
            "sections": sections,
            "metadata": metadata or {}
        }
    
    def _format_insights(self, intelligence: Dict[str, Any], metadata: Optional[Dict] = None) -> Dict[str, Any]:
        """Insight cards format"""
        
        insights = []
        
        # Extract insights from intelligence
        if "key_findings" in intelligence:
            for finding in intelligence["key_findings"]:
                insights.append({
                    "type": "finding",
                    "title": "Key Finding",
                    "content": finding,
                    "priority": "high"
                })
        
        if "anomalies" in intelligence:
            for anomaly in intelligence["anomalies"]:
                insights.append({
                    "type": "anomaly",
                    "title": "Anomaly Detected",
                    "content": anomaly,
                    "priority": "critical"
                })
        
        if "opportunities" in intelligence:
            for opportunity in intelligence["opportunities"]:
                insights.append({
                    "type": "opportunity",
                    "title": "Opportunity",
                    "content": opportunity,
                    "priority": "medium"
                })
        
        return {
            "format": "insights",
            "insights": insights,
            "total": len(insights),
            "metadata": metadata or {}
        }
    
    def _format_pdf(self, intelligence: Dict[str, Any], metadata: Optional[Dict] = None) -> Dict[str, Any]:
        """PDF export format (returns structure for PDF generation)"""
        
        # This returns the structure that a PDF generator would use
        report = self._format_report(intelligence, metadata)
        
        return {
            "format": "pdf",
            "pdf_structure": report,
            "export_ready": True,
            "download_url": "/api/export/pdf",  # Would be generated by PDF service
            "metadata": metadata or {}
        }
    
    def _format_api_structured(self, intelligence: Dict[str, Any], metadata: Optional[Dict] = None) -> Dict[str, Any]:
        """API-ready structured data"""
        
        return {
            "format": "api_structured",
            "status": "success",
            "data": {
                "results": intelligence,
                "metadata": {
                    "timestamp": datetime.utcnow().isoformat(),
                    "version": "1.0",
                    "models_used": metadata.get("models_used", []) if metadata else [],
                    "confidence": metadata.get("confidence", 0.0) if metadata else 0.0
                }
            }
        }
    
    def _format_recommendations(self, intelligence: Dict[str, Any], metadata: Optional[Dict] = None) -> Dict[str, Any]:
        """Recommendation-style output"""
        
        recommendations = []
        
        # Extract or generate recommendations
        if "recommendations" in intelligence:
            for rec in intelligence["recommendations"]:
                recommendations.append({
                    "title": rec.get("title", "Recommendation"),
                    "description": rec.get("description", rec if isinstance(rec, str) else ""),
                    "priority": rec.get("priority", "medium"),
                    "impact": rec.get("impact", "moderate")
                })
        
        # Generate from insights
        elif "insights" in intelligence:
            for insight in intelligence["insights"]:
                recommendations.append({
                    "title": f"Action: {insight}",
                    "description": f"Based on analysis: {insight}",
                    "priority": "medium",
                    "impact": "moderate"
                })
        
        return {
            "format": "recommendations",
            "recommendations": recommendations,
            "total": len(recommendations),
            "metadata": metadata or {}
        }
    
    def get_available_formats(self) -> List[Dict[str, str]]:
        """Get list of available output formats"""
        return [
            {"id": "json", "name": "JSON", "description": "Developer-friendly structured data"},
            {"id": "dashboard", "name": "Dashboard", "description": "Interactive widgets and charts"},
            {"id": "visualization", "name": "Charts & Visualizations", "description": "Visual data representations"},
            {"id": "table", "name": "Table Format", "description": "Tabular data view"},
            {"id": "summary", "name": "Summary Text", "description": "Natural language summary"},
            {"id": "report", "name": "Detailed Report", "description": "Comprehensive analysis report"},
            {"id": "insights", "name": "Insights List", "description": "Key insights and findings"},
            {"id": "pdf", "name": "PDF Export", "description": "Downloadable PDF report"},
            {"id": "api_structured", "name": "API-Ready Data", "description": "Structured for API consumption"},
            {"id": "recommendations", "name": "Recommendations", "description": "Actionable recommendations"}
        ]


# Global instance
_formatter = None

def get_output_formatter() -> OutputFormatter:
    """Get or create output formatter instance"""
    global _formatter
    if _formatter is None:
        _formatter = OutputFormatter()
    return _formatter
