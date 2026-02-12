"use client";

import React from "react";
import Link from "next/link";
import { Book, Code, Zap, Shield, Database, Layers, ArrowRight, Copy } from "lucide-react";

export default function DocsPage() {
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="relative min-h-screen">
            {/* Background Effects */}
            <div className="mesh-bg opacity-30" />

            {/* Navbar */}
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl z-50 glass rounded-full px-8 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <Layers className="text-white w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Cleara</span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
                    <Link href="/#features" className="hover:text-indigo-500 transition-colors">Features</Link>
                    <Link href="/docs" className="text-indigo-500">Documentation</Link>
                    <Link href="/pricing" className="hover:text-indigo-500 transition-colors">Pricing</Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-sm font-medium hover:text-indigo-500 transition-colors">Login</Link>
                    <Link href="/playground" className="btn-premium !px-6 !py-2.5 !text-sm whitespace-nowrap">
                        Try Playground
                    </Link>
                </div>
            </nav>

            <main className="pt-40 pb-20 px-4 max-w-7xl mx-auto space-y-16">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium">
                        <Book className="w-4 h-4" />
                        <span>API Documentation v2.0</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                        Build with <span className="text-gradient">Cleara.</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Everything you need to integrate AI-powered data cleaning into your applications.
                    </p>
                </div>

                {/* Quick Start */}
                <div className="glass p-8 rounded-3xl border border-white/5 space-y-6">
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                        <Zap className="w-8 h-8 text-yellow-400" />
                        Quick Start
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-gray-300">1. Get Your API Key</h3>
                            <p className="text-gray-400 mb-3">Sign up and generate your API key from the dashboard.</p>
                            <div className="glass p-4 rounded-xl border border-white/5 font-mono text-sm flex items-center justify-between">
                                <span className="text-green-400">cl_live_demo_key_2026_scientific_symposium</span>
                                <button
                                    onClick={() => copyToClipboard("cl_live_demo_key_2026_scientific_symposium")}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-gray-300">2. Make Your First Request</h3>
                            <p className="text-gray-400 mb-3">Send data to the cleaning endpoint.</p>
                            <div className="glass p-6 rounded-xl border border-white/5 font-mono text-sm space-y-2 overflow-x-auto">
                                <div className="text-gray-500">// Using cURL</div>
                                <div className="text-blue-400">curl -X POST http://localhost:8000/v1/clean \</div>
                                <div className="text-purple-400 pl-4">-H "X-API-Key: YOUR_API_KEY" \</div>
                                <div className="text-purple-400 pl-4">-H "Content-Type: application/json" \</div>
                                <div className="text-purple-400 pl-4">-d '{`{`}</div>
                                <div className="text-yellow-200 pl-8">"data": [{`{"name": "john doe", "email": "john@gmial.com"}`}],</div>
                                <div className="text-yellow-200 pl-8">"options": {`{"use_ai_workflow": true}`}</div>
                                <div className="text-purple-400 pl-4">{`}`}'</div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-gray-300">3. Get Cleaned Results</h3>
                            <p className="text-gray-400 mb-3">Receive AI-enhanced, validated data.</p>
                            <div className="glass p-6 rounded-xl border border-white/5 font-mono text-sm space-y-1 overflow-x-auto">
                                <div className="text-indigo-400">{`{`}</div>
                                <div className="text-purple-400 pl-4">"success": <span className="text-green-400">true</span>,</div>
                                <div className="text-purple-400 pl-4">"data": [</div>
                                <div className="text-yellow-200 pl-8">{`{"name": "John Doe", "email": "john@gmail.com"}`}</div>
                                <div className="text-purple-400 pl-4">]</div>
                                <div className="text-indigo-400">{`}`}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* API Endpoints */}
                <div className="space-y-8">
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                        <Code className="w-8 h-8 text-indigo-400" />
                        API Endpoints
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Clean Endpoint */}
                        <div className="card-premium space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold">POST /v1/clean</h3>
                                <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-mono">200 OK</span>
                            </div>
                            <p className="text-gray-400">Clean and normalize your data with AI-powered validation.</p>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <Database className="w-4 h-4 text-blue-400" />
                                    <span className="text-gray-300">Supports JSON, CSV, and raw text</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-purple-400" />
                                    <span className="text-gray-300">Requires API Key authentication</span>
                                </div>
                            </div>
                        </div>

                        {/* Validate Endpoint */}
                        <div className="card-premium space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold">POST /v1/validate</h3>
                                <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-mono">200 OK</span>
                            </div>
                            <p className="text-gray-400">Validate data quality without modifications.</p>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <Database className="w-4 h-4 text-blue-400" />
                                    <span className="text-gray-300">Returns validation scores</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-purple-400" />
                                    <span className="text-gray-300">Identifies data quality issues</span>
                                </div>
                            </div>
                        </div>

                        {/* Deduplicate Endpoint */}
                        <div className="card-premium space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold">POST /v1/deduplicate</h3>
                                <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-mono">200 OK</span>
                            </div>
                            <p className="text-gray-400">Remove duplicate records using AI similarity matching.</p>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <Database className="w-4 h-4 text-blue-400" />
                                    <span className="text-gray-300">Fuzzy matching with embeddings</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-purple-400" />
                                    <span className="text-gray-300">Configurable similarity threshold</span>
                                </div>
                            </div>
                        </div>

                        {/* Enrich Endpoint */}
                        <div className="card-premium space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold">POST /v1/enrich</h3>
                                <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-mono">200 OK</span>
                            </div>
                            <p className="text-gray-400">Predict and fill missing fields using AI inference.</p>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <Database className="w-4 h-4 text-blue-400" />
                                    <span className="text-gray-300">Context-aware predictions</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-purple-400" />
                                    <span className="text-gray-300">Confidence scores included</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Resources */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link href="/playground" className="card-premium group hover:border-indigo-500 transition-colors">
                        <Zap className="w-10 h-10 text-yellow-400 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Interactive Playground</h3>
                        <p className="text-gray-400 mb-4">Test the API in real-time with sample data.</p>
                        <div className="flex items-center gap-2 text-indigo-400 group-hover:gap-3 transition-all">
                            <span>Try Now</span>
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </Link>

                    <Link href="/api-keys" className="card-premium group hover:border-purple-500 transition-colors">
                        <Shield className="w-10 h-10 text-purple-400 mb-4" />
                        <h3 className="text-xl font-bold mb-2">API Keys</h3>
                        <p className="text-gray-400 mb-4">Manage your authentication credentials.</p>
                        <div className="flex items-center gap-2 text-purple-400 group-hover:gap-3 transition-all">
                            <span>Manage Keys</span>
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </Link>

                    <Link href="/dashboard" className="card-premium group hover:border-green-500 transition-colors">
                        <Database className="w-10 h-10 text-green-400 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Usage Dashboard</h3>
                        <p className="text-gray-400 mb-4">Monitor your API usage and analytics.</p>
                        <div className="flex items-center gap-2 text-green-400 group-hover:gap-3 transition-all">
                            <span>View Stats</span>
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </Link>
                </div>
            </main>
        </div>
    );
}
