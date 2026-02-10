"use client";

import React from "react";
import Link from "next/link";
import { Check, ArrowRight, Zap, Sparkles, Shield, Rocket } from "lucide-react";

const PLANS = [
    {
        name: "Starter",
        price: "$0",
        desc: "Perfect for exploring the Cleara API capabilities.",
        features: ["1,000 requests/month", "Standard Cleaning Engine", "Community Support", "API Access"],
        icon: Zap,
        color: "blue",
        cta: "Start for Free",
        popular: false
    },
    {
        name: "Professional",
        price: "$49",
        desc: "Advanced features for growing engineering teams.",
        features: ["50,000 requests/month", "AI Workflow Orchestrator", "Priority Support", "Email/Phone Normalization", "Custom Webhooks"],
        icon: Sparkles,
        color: "indigo",
        cta: "Try Pro Free",
        popular: true
    },
    {
        name: "Enterprise",
        price: "Custom",
        desc: "Dedicated power for large-scale data operations.",
        features: ["Unlimited requests", "Custom Model Fine-tuning", "SLA & Uptime Guarantees", "Dedicated Account Manager", "SSO & Audit Logs"],
        icon: Shield,
        color: "slate",
        cta: "Contact Sales",
        popular: false
    }
];

export default function PricingPage() {
    return (
        <div className="relative min-h-screen py-24 px-4 overflow-hidden">
            <div className="mesh-bg opacity-10" />

            <div className="max-w-7xl mx-auto space-y-16 text-center">
                {/* Header */}
                <div className="space-y-4 animate-reveal">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                        Simple, <span className="text-gradient">Scaleable</span> Pricing.
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Choose the plan that fits your dataset. No hidden fees.
                        Scale up or down as your needs change.
                    </p>
                </div>

                {/* Pricing Toggles (Apple Style) */}
                <div className="flex justify-center items-center gap-4 animate-reveal" style={{ animationDelay: '100ms' }}>
                    <span className="text-sm font-medium">Monthly</span>
                    <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform" />
                    </div>
                    <span className="text-sm text-gray-500">Yearly <span className="text-indigo-500 font-bold">(Save 20%)</span></span>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 items-start animate-reveal" style={{ animationDelay: '200ms' }}>
                    {PLANS.map((plan, i) => (
                        <div
                            key={plan.name}
                            className={`card-premium relative overflow-hidden group ${plan.popular ? 'border-indigo-500 ring-4 ring-indigo-500/10' : ''}`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-xl shadow-lg">
                                    Most Popular
                                </div>
                            )}

                            <div className="space-y-6 text-left">
                                <div className={`w-12 h-12 rounded-xl bg-${plan.color}-500/10 flex items-center justify-center`}>
                                    <plan.icon className={`text-${plan.color}-500 w-6 h-6`} />
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{plan.desc}</p>
                                </div>

                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-bold tracking-tighter">{plan.price}</span>
                                    {plan.price !== "Custom" && <span className="text-gray-500">/mo</span>}
                                </div>

                                <Link
                                    href="/login"
                                    className={`btn-premium w-full !px-4 ${!plan.popular ? 'bg-gray-100 !text-gray-900 dark:bg-white/5 dark:!text-white' : ''}`}
                                >
                                    {plan.cta}
                                </Link>

                                <div className="space-y-4 pt-4">
                                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">What's included</p>
                                    {plan.features.map((feature) => (
                                        <div key={feature} className="flex items-center gap-3 text-sm">
                                            <Check className="w-4 h-4 text-green-500 shrink-0" />
                                            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Enterprise Context */}
                <div className="card-premium glass-dark p-12 mt-20 text-left flex flex-col md:flex-row items-center justify-between gap-12 animate-reveal" style={{ animationDelay: '300ms' }}>
                    <div className="space-y-4 max-w-xl">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                                <Rocket className="text-white w-5 h-5" />
                            </div>
                            <h3 className="text-2xl font-bold">Need custom compliance or dedicated nodes?</h3>
                        </div>
                        <p className="text-gray-400 leading-relaxed">
                            Cleara Enterprise offers dedicated GPU clusters on Groq, on-premise deployment options,
                            and SOC2/HIPAA compliant workflows for highly sensitive data cleaning needs.
                        </p>
                    </div>
                    <button className="btn-premium whitespace-nowrap">Schedule Technical Audit</button>
                </div>
            </div>

            {/* Footer Nav */}
            <footer className="mt-40 text-center opacity-30 hover:opacity-100 transition-opacity">
                <Link href="/" className="text-sm font-medium hover:text-indigo-500">← Back to Cleara Home</Link>
            </footer>
        </div>
    );
}
