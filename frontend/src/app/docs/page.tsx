"use client";

import React from "react";
import { FileText, Code, Zap, Shield, Database, RefreshCw } from "lucide-react";

export default function DocsPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-12 py-12 px-4 animate-fade-in">
            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                    Cleara API Documentation
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                    The Smartest Way to Clean, Validate, and Enrich Data at Scale.
                </p>
                <div className="flex justify-center space-x-4">
                    <span className="badge badge-primary">v1.2.0</span>
                    <span className="badge badge-success">Operational</span>
                </div>
            </div>

            {/* Workflow Section */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <RefreshCw className="text-primary-500" />
                    Google/Gemini Architecture
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { step: 1, title: "API Gateway", desc: "Key validation, Rate limiting, JWT" },
                        { step: 2, title: "Preprocessing", desc: "Whitespace trim, Normalization" },
                        { step: 3, title: "Schema Detection", desc: "Gemini identifies field structure" },
                        { step: 4, title: "Cleaning Engine", desc: "Rule-based + ML Hybrid cleaning" },
                        { step: 5, title: "AI Validation", desc: "Gemini corrections + Groq speed" },
                        { step: 6, title: "Deduplication", desc: "Groq-accelerated embeddings" },
                        { step: 7, title: "Enrichment", desc: "Gemini predicts missing fields" },
                        { step: 8, title: "Assembly", desc: "Final clean JSON construction" },
                        { step: 9, title: "Analytics", desc: "p50, p95, p99 latency logging" },
                    ].map((item) => (
                        <div key={item.step} className="card flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold shrink-0">
                                {item.step}
                            </div>
                            <div>
                                <h4 className="font-semibold">{item.title}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Start */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Zap className="text-yellow-500" />
                    Quick Start
                </h2>
                <div className="bg-gray-900 rounded-xl p-6 font-mono text-sm text-gray-300">
                    <div className="flex justify-between mb-4">
                        <span>POST /v1/clean</span>
                        <span className="text-green-500">200 OK</span>
                    </div>
                    <pre className="text-blue-400">{`curl -X POST https://api.cleara.io/v1/clean \\
-H "X-API-Key: YOUR_API_KEY" \\
-H "Content-Type: application/json" \\
-d '{
  "data": [{"name": "  john DOE  ", "email": "john@gmial.com"}],
  "options": { "use_ai_workflow": true }
}'`}</pre>
                </div>
            </div>

            {/* Authentication */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Shield className="text-success-500" />
                    Authentication
                </h2>
                <p>
                    All requests must include an <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">X-API-Key</code>
                    header. You can generate keys in your <a href="/dashboard" className="text-primary-500">Dashboard</a>.
                </p>
            </div>

            {/* Resources */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card text-center space-y-2 hover:border-primary-500 transition-colors">
                    <Code className="w-8 h-8 mx-auto text-primary-500" />
                    <h4 className="font-semibold">Interactive UI</h4>
                    <p className="text-xs text-gray-500 underline underline-offset-4"><a href="/docs/swagger">Explore Swagger</a></p>
                </div>
                <div className="card text-center space-y-2 hover:border-primary-500 transition-colors">
                    <FileText className="w-8 h-8 mx-auto text-primary-500" />
                    <h4 className="font-semibold">Case Studies</h4>
                    <p className="text-xs text-gray-500">Enterprise Workflows</p>
                </div>
                <div className="card text-center space-y-2 hover:border-primary-500 transition-colors">
                    <Database className="w-8 h-8 mx-auto text-primary-500" />
                    <h4 className="font-semibold">SDKs</h4>
                    <p className="text-xs text-gray-500">Python, Node, Go</p>
                </div>
            </div>
        </div>
    );
}
