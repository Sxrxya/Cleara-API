"use client";

import React from "react";
import { FileText, CheckCircle2, AlertTriangle, Info, TrendingUp } from "lucide-react";

interface DetailedReportViewerProps {
    data: any;
}

export default function DetailedReportViewer({ data }: DetailedReportViewerProps) {
    const summary = data.executive_summary || {};
    const fieldAnalysis = data.field_analysis || {};
    const dataProfile = data.data_profile || {};
    const recommendations = data.recommendations || [];

    return (
        <div className="space-y-6 p-6">
            {/* Executive Summary */}
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl p-6 text-white shadow-lg shadow-indigo-500/20">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/10 rounded-lg">
                        <FileText className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold">Data Quality Report</h2>
                </div>
                <p className="text-indigo-100 mb-6 text-sm">
                    Comprehensive analysis of your dataset with field-level insights and quality metrics.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-900/30 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                        <div className="text-2xl font-bold">{summary.total_records || 0}</div>
                        <div className="text-xs text-indigo-200 uppercase tracking-wider font-semibold">Total Records</div>
                    </div>
                    <div className="bg-slate-900/30 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                        <div className="text-2xl font-bold">{summary.total_fields || 0}</div>
                        <div className="text-xs text-indigo-200 uppercase tracking-wider font-semibold">Total Fields</div>
                    </div>
                    <div className="bg-slate-900/30 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                        <div className="text-2xl font-bold">{summary.completeness_score || 0}%</div>
                        <div className="text-xs text-indigo-200 uppercase tracking-wider font-semibold">Completeness</div>
                    </div>
                </div>
            </div>

            {/* Introduction */}
            <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5 text-indigo-400" />
                    Report Overview
                </h3>
                <p className="text-slate-300 leading-relaxed text-sm">
                    This report provides a detailed analysis of your dataset. We've examined <strong className="text-white">{summary.total_records || 0} records</strong> across <strong className="text-white">{summary.total_fields || 0} fields</strong>,
                    evaluating data quality, completeness, and consistency. The overall data completeness score is <strong className="text-white">{summary.completeness_score || 0}%</strong>,
                    indicating {summary.completeness_score >= 90 ? 'excellent' : summary.completeness_score >= 70 ? 'good' : 'moderate'} data quality.
                </p>
            </div>

            {/* Field Analysis */}
            <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Field-Level Analysis
                </h3>
                <p className="text-slate-400 mb-6 text-sm">
                    Each field in your dataset has been analyzed for type consistency, null values, and unique value distribution.
                </p>

                <div className="space-y-4">
                    {Object.entries(fieldAnalysis).map(([fieldName, analysis]: [string, any]) => (
                        <div key={fieldName} className="bg-slate-950/50 border border-white/5 rounded-xl p-5 hover:border-indigo-500/30 transition-colors">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h4 className="font-bold text-white text-base mb-1">{fieldName}</h4>
                                    <p className="text-sm text-slate-500">Type: <span className="font-mono text-indigo-400">{analysis.type}</span></p>
                                </div>
                                <div>
                                    {analysis.null_count === 0 ? (
                                        <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-medium rounded-full flex items-center gap-1.5">
                                            <CheckCircle2 className="w-3 h-3" />
                                            Complete
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-xs font-medium rounded-full flex items-center gap-1.5">
                                            <AlertTriangle className="w-3 h-3" />
                                            {analysis.null_count} nulls
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                <div className="bg-slate-900/50 rounded-lg p-3 border border-white/5">
                                    <span className="text-slate-500 text-xs block mb-1">Unique Values</span>
                                    <span className="font-bold text-white">{analysis.unique_count}</span>
                                </div>
                                <div className="bg-slate-900/50 rounded-lg p-3 border border-white/5">
                                    <span className="text-slate-500 text-xs block mb-1">Null Count</span>
                                    <span className="font-bold text-white">{analysis.null_count}</span>
                                </div>
                            </div>

                            {analysis.sample_values && analysis.sample_values.length > 0 && (
                                <div className="pt-3 border-t border-white/5">
                                    <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-semibold">Sample Values</p>
                                    <div className="flex flex-wrap gap-2">
                                        {analysis.sample_values.slice(0, 5).map((value: string, idx: number) => (
                                            <span key={idx} className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded-md font-mono border border-white/5">
                                                {value}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Data Completeness */}
            {dataProfile.data_completeness && (
                <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Data Completeness by Field</h3>
                    <div className="space-y-4">
                        {Object.entries(dataProfile.data_completeness).map(([field, percentage]: [string, any]) => {
                            const value = parseFloat(percentage);
                            return (
                                <div key={field}>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-medium text-slate-300">{field}</span>
                                        <span className="text-slate-400 font-mono">{percentage}%</span>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ${value >= 90 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' :
                                                    value >= 70 ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)]' :
                                                        'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                                                }`}
                                            style={{ width: `${value}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Recommendations */}
            {recommendations.length > 0 && (
                <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-indigo-300 mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5" />
                        Recommendations
                    </h3>
                    <ul className="space-y-3">
                        {recommendations.map((rec: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-3 text-indigo-200/80 text-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                                <span>{rec}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
