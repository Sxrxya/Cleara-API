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

    return (
        <div className="space-y-6 p-6">
            {/* Executive Summary */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-8 h-8" />
                    <h2 className="text-2xl font-bold">Data Quality Report</h2>
                </div>
                <p className="text-blue-100 mb-4">
                    Comprehensive analysis of your dataset with field-level insights and quality metrics.
                </p>
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                        <div className="text-3xl font-bold">{summary.total_records || 0}</div>
                        <div className="text-sm text-blue-100">Total Records</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                        <div className="text-3xl font-bold">{summary.total_fields || 0}</div>
                        <div className="text-sm text-blue-100">Total Fields</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                        <div className="text-3xl font-bold">{summary.completeness_score || 0}%</div>
                        <div className="text-sm text-blue-100">Completeness</div>
                    </div>
                </div>
            </div>

            {/* Introduction */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-500" />
                    Report Overview
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    This report provides a detailed analysis of your dataset. We've examined <strong>{summary.total_records || 0} records</strong> across <strong>{summary.total_fields || 0} fields</strong>,
                    evaluating data quality, completeness, and consistency. The overall data completeness score is <strong>{summary.completeness_score || 0}%</strong>,
                    indicating {summary.completeness_score >= 90 ? 'excellent' : summary.completeness_score >= 70 ? 'good' : 'moderate'} data quality.
                </p>
            </div>

            {/* Field Analysis */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    Field-Level Analysis
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Each field in your dataset has been analyzed for type consistency, null values, and unique value distribution.
                </p>

                <div className="space-y-4">
                    {Object.entries(fieldAnalysis).map(([fieldName, analysis]: [string, any]) => (
                        <div key={fieldName} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white text-lg">{fieldName}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Type: <span className="font-mono text-blue-600 dark:text-blue-400">{analysis.type}</span></p>
                                </div>
                                <div className="flex gap-2">
                                    {analysis.null_count === 0 ? (
                                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3" />
                                            Complete
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs font-medium rounded-full flex items-center gap-1">
                                            <AlertTriangle className="w-3 h-3" />
                                            {analysis.null_count} nulls
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">Unique Values:</span>
                                    <span className="ml-2 font-semibold text-gray-900 dark:text-white">{analysis.unique_count}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">Null Count:</span>
                                    <span className="ml-2 font-semibold text-gray-900 dark:text-white">{analysis.null_count}</span>
                                </div>
                            </div>

                            {analysis.sample_values && analysis.sample_values.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Sample Values:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {analysis.sample_values.slice(0, 5).map((value: string, idx: number) => (
                                            <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded font-mono">
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
                <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Data Completeness by Field</h3>
                    <div className="space-y-3">
                        {Object.entries(dataProfile.data_completeness).map(([field, percentage]: [string, any]) => {
                            const value = parseFloat(percentage);
                            return (
                                <div key={field}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-gray-700 dark:text-gray-300">{field}</span>
                                        <span className="text-gray-600 dark:text-gray-400">{percentage}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all ${value >= 90 ? 'bg-green-500' :
                                                    value >= 70 ? 'bg-yellow-500' :
                                                        'bg-red-500'
                                                }`}
                                            style={{ width: percentage }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Recommendations */}
            {data.recommendations && data.recommendations.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-3">📋 Recommendations</h3>
                    <ul className="space-y-2">
                        {data.recommendations.map((rec: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-blue-800 dark:text-blue-200">
                                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span>{rec}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
