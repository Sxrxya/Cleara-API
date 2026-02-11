"use client";

import React, { useState } from "react";
import { CheckCircle2, ChevronDown, ChevronRight, Download, RotateCcw, FileText, Code, Sparkles } from "lucide-react";
import DetailedReportViewer from "@/components/viewers/DetailedReportViewer";
import RawDataViewer from "@/components/viewers/RawDataViewer";
import AIExplainViewer from "@/components/viewers/AIExplainViewer";

const FORMAT_ICONS: Record<string, any> = {
    raw_data: Code,
    detailed_report: FileText,
    ai_explain_mode: Sparkles,
};

const FORMAT_LABELS: Record<string, string> = {
    raw_data: "Cleaned Data",
    detailed_report: "Cleaning Report",
    ai_explain_mode: "AI Explanation",
};

interface ResultsStepProps {
    results: any;
    onStartOver: () => void;
}

export default function ResultsStep({ results, onStartOver }: ResultsStepProps) {
    const [expandedFormats, setExpandedFormats] = useState<string[]>([]);

    const toggleFormat = (formatKey: string) => {
        setExpandedFormats(prev =>
            prev.includes(formatKey)
                ? prev.filter(k => k !== formatKey)
                : [...prev, formatKey]
        );
    };

    const downloadJSON = (data: any, filename: string) => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Extract outputs
    const outputs = results.outputs || {};
    const hasMultipleFormats = Object.keys(outputs).length > 0;

    // Render the appropriate viewer for each format
    const renderViewer = (formatKey: string, formatData: any) => {
        switch (formatKey) {
            case 'raw_data':
                return <RawDataViewer data={formatData} />;
            case 'detailed_report':
                return <DetailedReportViewer data={formatData} />;
            case 'ai_explain_mode':
                return <AIExplainViewer data={formatData} />;
            default:
                return (
                    <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
                        <pre className="overflow-auto max-h-96 text-xs font-mono text-gray-900 dark:text-gray-100">
                            {JSON.stringify(formatData, null, 2)}
                        </pre>
                    </div>
                );
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Success Header */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl border border-green-200 dark:border-green-800 p-6 mb-6">
                <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-500">
                        <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                            ✅ Processing Complete!
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Your data has been successfully cleaned and analyzed
                        </p>
                    </div>
                    <button
                        onClick={onStartOver}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        <RotateCcw className="w-4 h-4" />
                        <span className="font-medium">Start Over</span>
                    </button>
                </div>
            </div>

            {/* Results */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-white/5 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Cleaned Results
                    </h3>
                    <button
                        onClick={() => downloadJSON(results, 'cleaned_data.json')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Download All
                    </button>
                </div>

                {hasMultipleFormats ? (
                    // Multi-format outputs
                    <div className="space-y-3">
                        {Object.entries(outputs).map(([formatKey, formatData]: [string, any]) => {
                            const isExpanded = expandedFormats.includes(formatKey);
                            const Icon = FORMAT_ICONS[formatKey] || Code;
                            const label = FORMAT_LABELS[formatKey] || formatKey;

                            return (
                                <div
                                    key={formatKey}
                                    className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                                >
                                    {/* Header */}
                                    <button
                                        onClick={() => toggleFormat(formatKey)}
                                        className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className="w-5 h-5 text-blue-500" />
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {label}
                                            </span>
                                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                                                {formatData.format || formatKey}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    downloadJSON(formatData, `${formatKey}.json`);
                                                }}
                                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                                            >
                                                <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                            </button>
                                            {isExpanded ? (
                                                <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                            ) : (
                                                <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                            )}
                                        </div>
                                    </button>

                                    {/* Content - Use dedicated viewers */}
                                    {isExpanded && (
                                        <div className="bg-white dark:bg-slate-900">
                                            {renderViewer(formatKey, formatData)}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    // Legacy single format
                    <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
                        <pre className="overflow-auto max-h-96 text-sm font-mono text-gray-900 dark:text-gray-100">
                            {JSON.stringify(results.cleaned_data, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
}
