"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";

interface InstantInsightsViewerProps {
    data: any;
}

export default function InstantInsightsViewer({ data }: InstantInsightsViewerProps) {
    const [messages, setMessages] = useState<Array<{ text: string; type: 'ai' | 'stat' }>>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Generate chatbot-style messages from insights
    const generateMessages = () => {
        const msgs: Array<{ text: string; type: 'ai' | 'stat' }> = [];

        // Greeting
        msgs.push({
            text: "👋 Hi! I've analyzed your data. Here's what I found:",
            type: 'ai'
        });

        // Summary stats
        if (data.summary) {
            msgs.push({
                text: `📊 I processed **${data.summary.total_records} records** and modified **${data.summary.fields_modified} fields**.`,
                type: 'ai'
            });

            msgs.push({
                text: `✨ Your data quality score is **${data.summary.data_quality_score}%** - ${data.summary.data_quality_score >= 90 ? 'Excellent!' :
                        data.summary.data_quality_score >= 70 ? 'Good, but could be improved.' :
                            'Needs attention.'
                    }`,
                type: 'stat'
            });
        }

        // Key findings
        if (data.key_findings && data.key_findings.length > 0) {
            msgs.push({
                text: "🔍 **Key Findings:**",
                type: 'ai'
            });

            data.key_findings.forEach((finding: string) => {
                msgs.push({
                    text: `• ${finding}`,
                    type: 'ai'
                });
            });
        }

        // Anomalies
        if (data.anomalies_detected && data.anomalies_detected.length > 0) {
            msgs.push({
                text: `⚠️ I detected **${data.anomalies_detected.length} anomalies** that needed correction:`,
                type: 'ai'
            });

            data.anomalies_detected.slice(0, 3).forEach((anomaly: any) => {
                msgs.push({
                    text: `**Record ${anomaly.record}** - Field "${anomaly.field}": Changed from "${anomaly.before}" to "${anomaly.after}"`,
                    type: 'stat'
                });
            });

            if (data.anomalies_detected.length > 3) {
                msgs.push({
                    text: `... and ${data.anomalies_detected.length - 3} more corrections.`,
                    type: 'ai'
                });
            }
        }

        // Recommendation
        if (data.recommendation) {
            msgs.push({
                text: `💡 **Recommendation:** ${data.recommendation}`,
                type: 'ai'
            });
        }

        return msgs;
    };

    useEffect(() => {
        const allMessages = generateMessages();
        setMessages([]);
        setCurrentIndex(0);

        // Animate messages appearing one by one
        let index = 0;
        const interval = setInterval(() => {
            if (index < allMessages.length) {
                setMessages(prev => [...prev, allMessages[index]]);
                index++;
            } else {
                clearInterval(interval);
            }
        }, 600);

        return () => clearInterval(interval);
    }, [data]);

    return (
        <div className="space-y-4 p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-500 rounded-full">
                    <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">AI Analysis Assistant</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Instant insights from your data</p>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex items-start gap-3 animate-slide-up`}
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        {msg.type === 'ai' ? (
                            <>
                                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1 bg-white dark:bg-slate-800 rounded-lg rounded-tl-none p-4 shadow-sm">
                                    <p className="text-gray-800 dark:text-gray-200" dangerouslySetInnerHTML={{
                                        __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                    }} />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                    <TrendingUp className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg rounded-tl-none p-4">
                                    <p className="text-gray-800 dark:text-gray-200 font-medium" dangerouslySetInnerHTML={{
                                        __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-green-700 dark:text-green-300">$1</strong>')
                                    }} />
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            {/* Quality Metrics */}
            {data.summary && (
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                            {data.summary.total_records}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Records Processed</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                            {data.summary.fields_modified}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Fields Modified</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                            {data.summary.data_quality_score}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Quality Score</div>
                    </div>
                </div>
            )}
        </div>
    );
}
