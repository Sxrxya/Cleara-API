"use client";

import React, { useState } from "react";
import { CheckCircle2, ChevronDown, ChevronRight, RotateCcw, FileText, Code, Sparkles, Download, Copy, Info } from "lucide-react";
import DetailedReportViewer from "@/components/viewers/DetailedReportViewer";
import RawDataViewer from "@/components/viewers/RawDataViewer";
import AIExplainViewer from "@/components/viewers/AIExplainViewer";

const FORMAT_ICONS: Record<string, any> = {
    raw_data: Code,
    detailed_report: FileText,
    ai_explain_mode: Sparkles,
};

interface ResultsStepProps {
    data: any;
    onReset: () => void;
}

export default function ResultsStep({ data, onReset }: ResultsStepProps) {
    const [activeTab, setActiveTab] = useState<"detailed_report" | "raw_data" | "ai_explain_mode">("detailed_report");
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(data, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8 animate-slide-up">
            {/* Success Header */}
            <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Processing Complete</h2>
                        <p className="text-green-400">Successfully processed {data?.cleaned?.length || 0} records in {data?.metrics?.latency || "200ms"}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 hover:bg-slate-800 text-slate-300 rounded-lg text-sm font-medium transition-colors border border-white/5 hover:border-white/10"
                    >
                        {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        {copied ? "Copied!" : "Copy JSON"}
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20">
                        <Download className="w-4 h-4" />
                        Download
                    </button>
                </div>
            </div>

            {/* Viewer Tabs */}
            <div className="space-y-6">
                <div className="flex border-b border-white/10">
                    <button
                        onClick={() => setActiveTab("detailed_report")}
                        className={`pb-4 px-6 text-sm font-medium transition-all relative ${activeTab === "detailed_report"
                                ? "text-indigo-400 glow-text-indigo"
                                : "text-slate-400 hover:text-slate-200"
                            }`}
                    >
                        <span className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Detailed Report
                        </span>
                        {activeTab === "detailed_report" && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab("raw_data")}
                        className={`pb-4 px-6 text-sm font-medium transition-all relative ${activeTab === "raw_data"
                                ? "text-indigo-400 glow-text-indigo"
                                : "text-slate-400 hover:text-slate-200"
                            }`}
                    >
                        <span className="flex items-center gap-2">
                            <Code className="w-4 h-4" />
                            Raw Data
                        </span>
                        {activeTab === "raw_data" && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab("ai_explain_mode")}
                        className={`pb-4 px-6 text-sm font-medium transition-all relative ${activeTab === "ai_explain_mode"
                                ? "text-purple-400 glow-text-purple"
                                : "text-slate-400 hover:text-slate-200"
                            }`}
                    >
                        <span className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            AI Explain
                        </span>
                        {activeTab === "ai_explain_mode" && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                        )}
                    </button>
                </div>

                {/* Viewer Content */}
                <div className="min-h-[500px]">
                    {activeTab === "detailed_report" && <DetailedReportViewer data={data} />}
                    {activeTab === "raw_data" && <RawDataViewer data={data} />}
                    {activeTab === "ai_explain_mode" && <AIExplainViewer data={data} />}
                </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-8 border-t border-white/10 flex justify-between items-center text-sm text-slate-500">
                <div className="flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    <span>Results are cached for 24 hours.</span>
                </div>
                <button
                    onClick={onReset}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors hover:bg-white/5 px-4 py-2 rounded-lg"
                >
                    <RotateCcw className="w-4 h-4" />
                    Process New Dataset
                </button>
            </div>
        </div>
    );
}
