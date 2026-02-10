"use client";

import React from "react";
import Link from "next/link";
import {
    Sparkles, ArrowRight, Zap, Shield, Layers, Brain, BarChart3,
    Image as ImageIcon, FileText, Link as LinkIcon, MessageSquare,
    Code, Table, FileDown, Check, Cpu
} from "lucide-react";

const CAPABILITIES = [
    {
        icon: MessageSquare,
        title: "Multi-Input Processing",
        description: "Accept text, images, PDFs, URLs, or any combination",
        gradient: "from-blue-500 to-cyan-500"
    },
    {
        icon: Brain,
        title: "Hybrid AI Engine",
        description: "Gemini + Groq + HuggingFace working together",
        gradient: "from-purple-500 to-pink-500"
    },
    {
        icon: BarChart3,
        title: "10 Output Formats",
        description: "JSON, Dashboard, Charts, PDF, and more",
        gradient: "from-green-500 to-emerald-500"
    },
    {
        icon: Zap,
        title: "142ms Average Latency",
        description: "Ultra-fast processing with intelligent routing",
        gradient: "from-yellow-500 to-orange-500"
    }
];

const AI_MODELS = [
    { name: "Groq LLaMA-3.1", speed: "50ms", color: "blue" },
    { name: "Gemini 1.5 Flash", speed: "200ms", color: "purple" },
    { name: "HuggingFace", speed: "100ms", color: "green" }
];

const OUTPUT_FORMATS = [
    "JSON", "Dashboard", "Charts", "Table", "Summary",
    "Report", "Insights", "PDF", "API Data", "Actions"
];

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-[#020617] dark:via-[#0f172a] dark:to-[#1e1b4b]">

            {/* Floating Navbar */}
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 glass px-6 py-3 rounded-full border border-white/20 flex items-center gap-8">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <Layers className="text-white w-5 h-5" />
                    </div>
                    <span className="font-bold">Cleara</span>
                </Link>
                <div className="flex items-center gap-6 text-sm">
                    <Link href="/intelligence" className="hover:text-indigo-600 transition-colors">Intelligence</Link>
                    <Link href="/playground" className="hover:text-indigo-600 transition-colors">Playground</Link>
                    <Link href="/pricing" className="hover:text-indigo-600 transition-colors">Pricing</Link>
                    <Link href="/docs" className="hover:text-indigo-600 transition-colors">Docs</Link>
                </div>
                <Link href="/login" className="btn-premium !px-6 !py-2 !text-sm">
                    Get Started
                </Link>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-32">
                <div className="mesh-bg" />

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-full border border-white/20 mb-8 animate-reveal">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm font-medium">Universal AI Intelligence Layer • Multi-Input • Multi-Output</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 animate-reveal">
                    Any Input
                    <br />
                    <span className="text-gradient">Any Output</span>
                </h1>

                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mb-12 animate-reveal">
                    Accept text, images, files, URLs. Process with hybrid AI.
                    <br />
                    Return in 10 different formats. One API. Infinite possibilities.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 animate-reveal">
                    <Link href="/intelligence" className="btn-premium !px-10 !py-5 !text-lg group">
                        <Brain className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        Try Intelligence Layer
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link href="/docs" className="btn-glass !px-10 !py-5 !text-lg">
                        <Code className="w-5 h-5" />
                        View Documentation
                    </Link>
                </div>

                {/* AI Models Showcase */}
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-bold">Powered by:</span>
                    {AI_MODELS.map((model, idx) => (
                        <div key={idx} className="flex items-center gap-2 px-4 py-2 glass rounded-full">
                            <Cpu className="w-4 h-4" />
                            <span className="font-medium">{model.name}</span>
                            <span className="text-xs opacity-60">({model.speed})</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Capabilities Grid */}
            <section className="max-w-7xl mx-auto px-6 py-20 space-y-12">
                <div className="text-center space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold">
                        Complete AI Intelligence Platform
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Not just data cleaning. A full intelligence layer for any data workflow.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {CAPABILITIES.map((cap, idx) => {
                        const Icon = cap.icon;
                        return (
                            <div key={idx} className="card-premium group hover:scale-105">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cap.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <Icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{cap.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{cap.description}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Input Types Showcase */}
            <section className="max-w-7xl mx-auto px-6 py-20 space-y-12">
                <div className="text-center space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold">
                        Accept <span className="text-gradient">Any Input</span>
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        Text, images, files, URLs, or any combination
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { icon: MessageSquare, name: "Text", desc: "Questions, documents" },
                        { icon: ImageIcon, name: "Images", desc: "Photos, scans" },
                        { icon: FileText, name: "Files", desc: "PDF, CSV, Excel" },
                        { icon: LinkIcon, name: "URLs", desc: "Web content" }
                    ].map((input, idx) => {
                        const Icon = input.icon;
                        return (
                            <div key={idx} className="card-premium text-center group hover:border-indigo-500">
                                <Icon className="w-12 h-12 mx-auto mb-3 text-indigo-600 group-hover:scale-110 transition-transform" />
                                <h3 className="font-bold mb-1">{input.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{input.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Output Formats Showcase */}
            <section className="max-w-7xl mx-auto px-6 py-20 space-y-12">
                <div className="text-center space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold">
                        Return in <span className="text-gradient">Any Format</span>
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        10 different output formats for every use case
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                    {OUTPUT_FORMATS.map((format, idx) => (
                        <div key={idx} className="px-6 py-3 glass rounded-full border border-white/20 hover:border-indigo-500 transition-all hover:scale-105">
                            <span className="font-medium">{format}</span>
                        </div>
                    ))}
                </div>

                <div className="card-premium glass-dark !p-8 max-w-3xl mx-auto">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0">
                            <Check className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">Universal Compatibility</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Same analysis, different formats. Developers get JSON. Executives get dashboards.
                                Analysts get charts. Everyone gets exactly what they need.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-4xl mx-auto px-6 py-20 text-center space-y-8">
                <h2 className="text-4xl md:text-5xl font-bold">
                    Ready to Transform Your Data?
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                    Start with our free tier. No credit card required.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/intelligence" className="btn-premium !px-10 !py-5 !text-lg">
                        <Sparkles className="w-6 h-6" />
                        Start Free
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link href="/pricing" className="btn-glass !px-10 !py-5 !text-lg">
                        View Pricing
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-200 dark:border-white/10 py-12">
                <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>© 2026 Cleara. Universal AI Intelligence Layer.</p>
                    <p className="mt-2">Powered by Gemini + Groq + HuggingFace</p>
                </div>
            </footer>

        </div>
    );
}
