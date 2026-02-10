"use client";

import React, { useState, useEffect } from "react";
import { Shield, TrendingUp, AlertTriangle, CheckCircle2, XCircle, Clock, Target } from "lucide-react";

interface ExecutiveModeViewerProps {
    data: any;
}

export default function ExecutiveModeViewer({ data }: ExecutiveModeViewerProps) {
    const [isVisible, setIsVisible] = useState(false);
    const decision = data.decision_summary || {};
    const metrics = data.key_metrics || {};
    const actionItems = data.action_items || [];

    useEffect(() => {
        // Fade in animation
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'LOW': return 'green';
            case 'MEDIUM': return 'yellow';
            case 'HIGH': return 'red';
            default: return 'gray';
        }
    };

    const getDecisionIcon = () => {
        if (decision.recommendation?.includes('APPROVED')) return <CheckCircle2 className="w-16 h-16" />;
        if (decision.recommendation?.includes('HOLD')) return <XCircle className="w-16 h-16" />;
        return <AlertTriangle className="w-16 h-16" />;
    };

    const getDecisionColor = () => {
        if (decision.recommendation?.includes('APPROVED')) return 'green';
        if (decision.recommendation?.includes('HOLD')) return 'red';
        return 'yellow';
    };

    const color = getDecisionColor();
    const riskColor = getRiskColor(decision.risk_level);

    return (
        <div className={`space-y-6 p-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* Hero Decision Banner */}
            <div className={`relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br ${color === 'green' ? 'from-green-500 to-emerald-600' :
                color === 'red' ? 'from-red-500 to-rose-600' :
                    'from-yellow-500 to-orange-600'
                } text-white shadow-2xl`}>
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[url('/grid.svg')]"></div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className={`p-4 rounded-full ${color === 'green' ? 'bg-green-400/30' :
                            color === 'red' ? 'bg-red-400/30' :
                                'bg-yellow-400/30'
                            } backdrop-blur-sm animate-pulse`}>
                            {getDecisionIcon()}
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-medium opacity-90 mb-1">EXECUTIVE DECISION</div>
                            <h2 className="text-4xl font-bold leading-tight">
                                {decision.recommendation}
                            </h2>
                        </div>
                        <div className="text-right">
                            <div className="text-6xl font-bold opacity-20">
                                {decision.quality_score}%
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className={`px-4 py-2 rounded-full font-semibold ${riskColor === 'green' ? 'bg-green-400/30' :
                            riskColor === 'yellow' ? 'bg-yellow-400/30' :
                                'bg-red-400/30'
                            } backdrop-blur-sm`}>
                            Risk Level: {decision.risk_level}
                        </div>
                        <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full font-semibold">
                            {decision.records_processed} Records Processed
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Metrics Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(metrics).map(([key, value], index) => (
                    <div
                        key={key}
                        className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            {key.includes('Quality') && <TrendingUp className="w-5 h-5 text-blue-500" />}
                            {key.includes('Records') && <Target className="w-5 h-5 text-purple-500" />}
                            {key.includes('Fields') && <Shield className="w-5 h-5 text-green-500" />}
                            {key.includes('Status') && <Clock className="w-5 h-5 text-orange-500" />}
                        </div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                            {String(value)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            {key}
                        </div>
                    </div>
                ))}
            </div>

            {/* Quality Score Gauge */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                    Data Quality Score
                </h3>
                <div className="relative w-full max-w-md mx-auto">
                    {/* Circular Progress */}
                    <div className="relative w-64 h-64 mx-auto">
                        <svg className="transform -rotate-90 w-64 h-64">
                            {/* Background Circle */}
                            <circle
                                cx="128"
                                cy="128"
                                r="112"
                                stroke="currentColor"
                                strokeWidth="16"
                                fill="none"
                                className="text-gray-200 dark:text-gray-700"
                            />
                            {/* Progress Circle */}
                            <circle
                                cx="128"
                                cy="128"
                                r="112"
                                stroke="currentColor"
                                strokeWidth="16"
                                fill="none"
                                strokeDasharray={`${2 * Math.PI * 112}`}
                                strokeDashoffset={`${2 * Math.PI * 112 * (1 - (decision.quality_score || 0) / 100)}`}
                                className={`${decision.quality_score >= 90 ? 'text-green-500' :
                                    decision.quality_score >= 70 ? 'text-yellow-500' :
                                        'text-red-500'
                                    } transition-all duration-2000 ease-out`}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-6xl font-bold text-gray-900 dark:text-white">
                                    {decision.quality_score}%
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                    {decision.quality_score >= 90 ? 'Excellent' :
                                        decision.quality_score >= 70 ? 'Good' :
                                            'Needs Improvement'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Items */}
            {actionItems.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Target className="w-6 h-6 text-purple-500" />
                        Recommended Actions
                    </h3>
                    <div className="space-y-3">
                        {actionItems.map((item: string, index: number) => (
                            <div
                                key={index}
                                className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg hover:scale-102 transition-transform"
                            >
                                <div className="flex-shrink-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                    {index + 1}
                                </div>
                                <p className="text-purple-900 dark:text-purple-100 font-medium">
                                    {item}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Timestamp */}
            {data.timestamp && (
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                    Report generated: {new Date(data.timestamp).toLocaleString()}
                </div>
            )}
        </div>
    );
}
