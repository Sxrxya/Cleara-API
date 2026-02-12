"use client";

import React from "react";
import Link from "next/link";
import { Check, Shield, Zap, Sparkles, Layers } from "lucide-react";

export default function PricingPage() {
    return (
        <div className="relative min-h-screen">
            {/* Background Effects */}
            <div className="mesh-bg opacity-30" />

            {/* Navbar Placeholder (Consistent with Home) */}
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl z-50 glass rounded-full px-8 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <Layers className="text-white w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Cleara</span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
                    <Link href="/features" className="hover:text-indigo-500 transition-colors">Features</Link>
                    <Link href="/docs" className="hover:text-indigo-500 transition-colors">Documentation</Link>
                    <Link href="/pricing" className="text-indigo-500">Pricing</Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-sm font-medium hover:text-indigo-500 transition-colors">Login</Link>
                    <Link href="/login?signup=true" className="btn-premium !px-6 !py-2.5 !text-sm whitespace-nowrap">
                        Get Started
                    </Link>
                </div>
            </nav>

            <main className="pt-40 pb-20 px-4 max-w-7xl mx-auto space-y-16">
                <div className="text-center space-y-4">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                        Simple, Transparent <span className="text-gradient">Pricing.</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Choose the plan that fits your data needs. Scale as you grow.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Free Plan */}
                    <div className="glass p-8 rounded-3xl border border-white/5 space-y-6 hover:border-indigo-500 transition-colors">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold">Community</h3>
                            <p className="text-gray-400 text-sm">For hobbyists and prototypes.</p>
                        </div>
                        <div className="text-4xl font-bold">$0 <span className="text-lg text-gray-500 font-normal">/mo</span></div>
                        <Link href="/login?plan=free" className="btn-glass w-full text-center block">Get Started</Link>
                        <ul className="space-y-3 pt-6 border-t border-white/5">
                            <li className="flex items-center gap-3 text-gray-300">
                                <Check className="w-5 h-5 text-green-500" /> 1,000 requests/mo
                            </li>
                            <li className="flex items-center gap-3 text-gray-300">
                                <Check className="w-5 h-5 text-green-500" /> Basic Cleaning Rules
                            </li>
                            <li className="flex items-center gap-3 text-gray-300">
                                <Check className="w-5 h-5 text-green-500" /> Community Support
                            </li>
                        </ul>
                    </div>

                    {/* Pro Plan */}
                    <div className="relative glass p-8 rounded-3xl border border-indigo-500 space-y-6 shadow-2xl shadow-indigo-500/20 transform md:-translate-y-4">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                            Most Popular
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold flex items-center gap-2">
                                <Sparkles className="w-6 h-6 text-indigo-400" /> Pro
                            </h3>
                            <p className="text-gray-400 text-sm">For startups and growing teams.</p>
                        </div>
                        <div className="text-4xl font-bold">$49 <span className="text-lg text-gray-500 font-normal">/mo</span></div>
                        <Link href="/login?plan=pro" className="btn-premium w-full text-center block">Start Pro Trial</Link>
                        <ul className="space-y-3 pt-6 border-t border-white/5">
                            <li className="flex items-center gap-3 text-gray-300">
                                <Check className="w-5 h-5 text-indigo-400" /> 100,000 requests/mo
                            </li>
                            <li className="flex items-center gap-3 text-gray-300">
                                <Check className="w-5 h-5 text-indigo-400" /> AI-Powered Cleaning
                            </li>
                            <li className="flex items-center gap-3 text-gray-300">
                                <Check className="w-5 h-5 text-indigo-400" /> Deduplication Engine
                            </li>
                            <li className="flex items-center gap-3 text-gray-300">
                                <Check className="w-5 h-5 text-indigo-400" /> Priority Email Support
                            </li>
                        </ul>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="glass p-8 rounded-3xl border border-white/5 space-y-6 hover:border-purple-500 transition-colors">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold">Enterprise</h3>
                            <p className="text-gray-400 text-sm">For large-scale operations.</p>
                        </div>
                        <div className="text-4xl font-bold">Custom</div>
                        <Link href="mailto:sales@cleara.com" className="btn-glass w-full text-center block">Contact Sales</Link>
                        <ul className="space-y-3 pt-6 border-t border-white/5">
                            <li className="flex items-center gap-3 text-gray-300">
                                <Shield className="w-5 h-5 text-purple-400" /> Unlimited Requests
                            </li>
                            <li className="flex items-center gap-3 text-gray-300">
                                <Check className="w-5 h-5 text-purple-400" /> Custom AI Models
                            </li>
                            <li className="flex items-center gap-3 text-gray-300">
                                <Check className="w-5 h-5 text-purple-400" /> SSO & Audit Logs
                            </li>
                            <li className="flex items-center gap-3 text-gray-300">
                                <Check className="w-5 h-5 text-purple-400" /> Dedicated Account Manager
                            </li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}
