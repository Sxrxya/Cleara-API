"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CreditCard, Download, Calendar, TrendingUp, AlertCircle, CheckCircle2, Layers, Settings } from "lucide-react";

export default function BillingPage() {
    const [currentPlan] = useState("Pro");
    const [billingCycle] = useState("Monthly");
    const [nextBillingDate] = useState("March 11, 2026");
    const [usagePercentage] = useState(67);

    return (
        <div className="relative min-h-screen bg-slate-950">
            {/* Background Effects */}
            <div className="mesh-bg opacity-20" />

            {/* Navbar */}
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl z-50 glass rounded-full px-8 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <Layers className="text-white w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Cleara</span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
                    <Link href="/dashboard" className="hover:text-indigo-500 transition-colors">Dashboard</Link>
                    <Link href="/api-keys" className="hover:text-indigo-500 transition-colors">API Keys</Link>
                    <Link href="/billing" className="text-indigo-500">Billing</Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="btn-glass !px-6 !py-2.5 !text-sm">
                        <Settings className="w-4 h-4" />
                    </Link>
                </div>
            </nav>

            <main className="pt-40 pb-20 px-4 max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">Billing & Usage</h1>
                        <p className="text-gray-400 mt-2">Manage your subscription and view usage analytics.</p>
                    </div>
                    <Link href="/pricing" className="btn-premium">
                        Upgrade Plan
                    </Link>
                </div>

                {/* Current Plan Card */}
                <div className="glass p-8 rounded-3xl border border-indigo-500/30 space-y-6">
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <h2 className="text-3xl font-bold">{currentPlan} Plan</h2>
                                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-sm font-semibold">
                                    Active
                                </span>
                            </div>
                            <p className="text-gray-400">Billed {billingCycle} • Next payment on {nextBillingDate}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-bold">$49</div>
                            <div className="text-gray-500 text-sm">per month</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/5">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                                <span>API Requests</span>
                            </div>
                            <div className="text-2xl font-bold">100,000/mo</div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                                <span>AI Workflow</span>
                            </div>
                            <div className="text-2xl font-bold">Enabled</div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                                <span>Support</span>
                            </div>
                            <div className="text-2xl font-bold">Priority</div>
                        </div>
                    </div>
                </div>

                {/* Usage This Month */}
                <div className="glass p-8 rounded-3xl border border-white/5 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <TrendingUp className="w-6 h-6 text-blue-400" />
                            Usage This Month
                        </h2>
                        <span className="text-gray-400 text-sm">February 2026</span>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">API Requests</span>
                            <span className="font-semibold">67,234 / 100,000</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                                style={{ width: `${usagePercentage}%` }}
                            />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <AlertCircle className="w-4 h-4" />
                            <span>{100 - usagePercentage}% remaining this billing cycle</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/5">
                        <div className="space-y-2">
                            <div className="text-gray-400 text-sm">Total Requests</div>
                            <div className="text-3xl font-bold text-blue-400">67.2K</div>
                            <div className="text-green-400 text-xs flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                +12% from last month
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-gray-400 text-sm">Avg Response Time</div>
                            <div className="text-3xl font-bold text-purple-400">245ms</div>
                            <div className="text-green-400 text-xs flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                15% faster
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-gray-400 text-sm">Success Rate</div>
                            <div className="text-3xl font-bold text-green-400">99.8%</div>
                            <div className="text-gray-500 text-xs">Excellent</div>
                        </div>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="glass p-8 rounded-3xl border border-white/5 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <CreditCard className="w-6 h-6 text-green-400" />
                            Payment Method
                        </h2>
                        <button className="btn-glass !px-4 !py-2 !text-sm">
                            Update
                        </button>
                    </div>

                    <div className="flex items-center gap-4 p-6 bg-slate-900/50 rounded-2xl border border-white/5">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                            <CreditCard className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                            <div className="font-semibold">Visa ending in 4242</div>
                            <div className="text-gray-400 text-sm">Expires 12/2027</div>
                        </div>
                        <div className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-semibold">
                            Default
                        </div>
                    </div>
                </div>

                {/* Billing History */}
                <div className="glass p-8 rounded-3xl border border-white/5 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <Calendar className="w-6 h-6 text-yellow-400" />
                            Billing History
                        </h2>
                        <button className="btn-glass !px-4 !py-2 !text-sm flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Export All
                        </button>
                    </div>

                    <div className="space-y-3">
                        {[
                            { date: "Feb 11, 2026", amount: "$49.00", status: "Paid", invoice: "INV-2026-02" },
                            { date: "Jan 11, 2026", amount: "$49.00", status: "Paid", invoice: "INV-2026-01" },
                            { date: "Dec 11, 2025", amount: "$49.00", status: "Paid", invoice: "INV-2025-12" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-900/30 rounded-xl border border-white/5 hover:border-indigo-500/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <div>
                                        <div className="font-semibold">{item.date}</div>
                                        <div className="text-gray-400 text-sm">{item.invoice}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <div className="font-semibold">{item.amount}</div>
                                        <div className="text-green-400 text-sm">{item.status}</div>
                                    </div>
                                    <button className="text-indigo-400 hover:text-indigo-300 transition-colors">
                                        <Download className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
