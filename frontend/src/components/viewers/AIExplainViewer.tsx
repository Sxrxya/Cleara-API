"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Brain, Zap, CheckCircle2, ArrowRight } from "lucide-react";

interface AIExplainViewerProps {
    data: any;
}

export default function AIExplainViewer({ data }: AIExplainViewerProps) {
    const [activeStep, setActiveStep] = useState(0);
    const reasoning = data.ai_reasoning || {};
    const processingSteps = reasoning.processing_steps || [];
    const changeExplanations = reasoning.change_explanations || [];

    useEffect(() => {
        // Animate steps appearing one by one
        let step = 0;
        const interval = setInterval(() => {
            if (step < processingSteps.length) {
                setActiveStep(step);
                step++;
            } else {
                clearInterval(interval);
            }
        }, 800);

        return () => clearInterval(interval);
    }, [processingSteps.length]);

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
                            <Brain className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">AI-EXPLAIN MODE</h2>
                            <p className="text-purple-100">Understanding the AI's decision-making process</p>
                        </div>
                    </div>

                    {reasoning.model_used && (
                        <div className="flex items-center gap-2 mt-4">
                            <Zap className="w-5 h-5" />
                            <span className="text-sm">Powered by: <strong>{reasoning.model_used.toUpperCase()}</strong></span>
                            {reasoning.confidence_score && (
                                <span className="ml-4 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                                    Confidence: {(reasoning.confidence_score * 100).toFixed(0)}%
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Processing Steps */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    AI Processing Pipeline
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Here's how the AI analyzed and cleaned your data, step by step:
                </p>

                <div className="space-y-3">
                    {processingSteps.map((step: string, index: number) => {
                        const isActive = index <= activeStep;
                        return (
                            <div
                                key={index}
                                className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all duration-500 ${isActive
                                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 scale-100 opacity-100'
                                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-900 scale-95 opacity-50'
                                    }`}
                                style={{
                                    transitionDelay: `${index * 100}ms`
                                }}
                            >
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0 ${isActive
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                                    }`}>
                                    {isActive ? (
                                        <CheckCircle2 className="w-6 h-6" />
                                    ) : (
                                        <span className="font-bold">{index + 1}</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className={`font-medium ${isActive
                                            ? 'text-purple-900 dark:text-purple-100'
                                            : 'text-gray-600 dark:text-gray-400'
                                        }`}>
                                        {step}
                                    </p>
                                </div>
                                {isActive && (
                                    <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Change Explanations */}
            {changeExplanations.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                        🔍 Detailed Change Explanations
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        The AI made the following changes to your data. Here's why:
                    </p>

                    <div className="space-y-6">
                        {changeExplanations.map((explanation: any, idx: number) => (
                            <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:border-purple-500 dark:hover:border-purple-500 transition-colors">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                                        Record #{explanation.record_index}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {explanation.changes.length} change(s)
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {explanation.changes.map((change: any, changeIdx: number) => (
                                        <div key={changeIdx} className="bg-gray-50 dark:bg-slate-900 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="font-mono text-sm font-semibold text-purple-600 dark:text-purple-400">
                                                    {change.field}
                                                </span>
                                                <ArrowRight className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                {change.change}
                                            </div>
                                            <div className="flex items-start gap-2 mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
                                                <Brain className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                                    <strong>AI Reasoning:</strong> {change.reasoning}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Quality Assessment */}
            {reasoning.quality_assessment && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                        Quality Assessment
                    </h3>
                    <p className="text-green-800 dark:text-green-200">
                        {reasoning.quality_assessment}
                    </p>
                    {data.metadata && (
                        <div className="mt-4 text-sm text-green-700 dark:text-green-300">
                            <strong>Total Changes:</strong> {data.metadata.total_changes} •
                            <strong className="ml-2">Processing Time:</strong> {data.metadata.processing_time_ms}ms
                        </div>
                    )}
                </div>
            )}

            {/* Cleaned Data Preview */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    ✅ Cleaned Data Output
                </h3>
                <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-64">
                    <pre className="text-sm text-green-400 font-mono">
                        {JSON.stringify(data.cleaned_data, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    );
}
