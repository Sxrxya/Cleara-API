"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Zap, Shield, Sparkles, Database, Layers, BarChart3 } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="relative min-h-screen">
            {/* Background Effects */}
            <div className="mesh-bg" />

            {/* Navbar */}
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl z-50 glass rounded-full px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <Layers className="text-white w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Cleara</span>
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
                    <Link href="#features" className="hover:text-indigo-500 transition-colors">Features</Link>
                    <Link href="/docs" className="hover:text-indigo-500 transition-colors">Documentation</Link>
                    <Link href="/pricing" className="hover:text-indigo-500 transition-colors">Pricing</Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-sm font-medium hover:text-indigo-500 transition-colors">Login</Link>
                    <Link href="/login?signup=true" className="btn-premium !px-6 !py-2.5 !text-sm whitespace-nowrap">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="pt-40 pb-20 px-4">
                <div className="max-w-7xl mx-auto text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-sm font-medium animate-reveal">
                        <Sparkles className="w-4 h-4" />
                        <span>AI-Powered Data Engine v2.0 is live</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-bold tracking-tight animate-reveal" style={{ animationDelay: '100ms' }}>
                        Clean Data. <br />
                        <span className="text-gradient">No Compromise.</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed animate-reveal" style={{ animationDelay: '200ms' }}>
                        Cleara automates the messy parts of data processing using the Gemini-Groq hybrid engine.
                        Scale your data cleaning from a few records to millions with enterprise precision.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4 animate-reveal" style={{ animationDelay: '300ms' }}>
                        <Link href="/login" className="btn-premium text-lg group w-full md:w-auto">
                            Start Building Now
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="/docs" className="btn-glass text-lg w-full md:w-auto">
                            View API Docs
                        </Link>
                    </div>

                    {/* Feature Showcase Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-32 animate-reveal" style={{ animationDelay: '400ms' }}>
                        <div className="card-premium group">
                            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Zap className="text-blue-500 w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Ultra-Fast Inference</h3>
                            <p className="text-gray-600 dark:text-gray-400">Powered by Groq LPPs, Cleara processes datasets up to 10x faster than traditional LLM pipelines.</p>
                        </div>

                        <div className="card-premium group">
                            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Sparkles className="text-purple-500 w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Semantic Cleaning</h3>
                            <p className="text-gray-600 dark:text-gray-400">Gemini 1.5 Flash understands context, fixing typos and resolving entities with human-level reasoning.</p>
                        </div>

                        <div className="card-premium group">
                            <div className="w-14 h-14 rounded-2xl bg-pink-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Shield className="text-pink-500 w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Enterprise Security</h3>
                            <p className="text-gray-600 dark:text-gray-400">Bank-grade encryption, role-based access, and detailed audit logs keep your sensitive data protected.</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Trust Section */}
            <section className="py-20 bg-gray-50/50 dark:bg-white/5 border-y border-gray-200 dark:border-white/10">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-12">Trusted by modern engineering teams</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        <span className="text-2xl font-bold italic">STREAMLINE</span>
                        <span className="text-2xl font-bold italic">NEXUS AI</span>
                        <span className="text-2xl font-bold italic">QUANTUM</span>
                        <span className="text-2xl font-bold italic">VOYAGER</span>
                    </div>
                </div>
            </section>

            {/* Workflow Visualization (Minimalist) */}
            <section className="py-32 px-4 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-8">
                            The Engine Behind <br />
                            <span className="text-gradient">Premium Data.</span>
                        </h2>
                        <div className="space-y-6">
                            {[
                                "Automatic Schema Inference",
                                "Fuzzy Deduplication (Cosine Similarity)",
                                "AI Enrichment (Predict Missing Fields)",
                                "Real-time Analytics Dashboard"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="text-green-500 w-4 h-4" />
                                    </div>
                                    <span className="text-lg text-gray-700 dark:text-gray-300 font-medium group-hover:text-indigo-500 transition-colors uppercase tracking-tight">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-3xl opacity-50" />
                        <div className="relative glass rounded-[40px] p-8 border border-white/10 shadow-2xl overflow-hidden">
                            <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>
                            <div className="space-y-4 font-mono text-sm">
                                <div className="flex gap-4">
                                    <span className="text-gray-500">1</span>
                                    <span className="text-blue-400">POST</span>
                                    <span className="text-green-400">/v1/workflow</span>
                                </div>
                                <div className="flex gap-4">
                                    <span className="text-gray-500">2</span>
                                    <span className="text-indigo-400">{"{"}</span>
                                </div>
                                <div className="flex gap-4 pl-4">
                                    <span className="text-gray-500">3</span>
                                    <span className="text-purple-400">"data":</span>
                                    <span className="text-yellow-200">[...]</span>
                                </div>
                                <div className="flex gap-4 pl-4">
                                    <span className="text-gray-500">4</span>
                                    <span className="text-purple-400">"ai":</span>
                                    <span className="text-yellow-200">true</span>
                                </div>
                                <div className="flex gap-4">
                                    <span className="text-gray-500">5</span>
                                    <span className="text-indigo-400">{"}"}</span>
                                </div>
                                <div className="pt-4 border-t border-white/5 text-gray-400 italic">
                                    {"// Cleara Engine Processing..."}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Footer */}
            <footer className="py-20 border-t border-gray-200 dark:border-white/10 relative overflow-hidden">
                <div className="mesh-bg opacity-10" />
                <div className="max-w-7xl mx-auto px-4 text-center space-y-8">
                    <h2 className="text-4xl font-bold">Ready to make your data make sense?</h2>
                    <div className="flex justify-center gap-4">
                        <Link href="/login" className="btn-premium">Get Started for Free</Link>
                        <Link href="/docs" className="btn-glass">Read the Docs</Link>
                    </div>
                    <div className="pt-12 text-gray-500 text-sm">
                        © 2026 Cleara API Engine. Built for the future of AI.
                    </div>
                </div>
            </footer>
        </div>
    );
}
