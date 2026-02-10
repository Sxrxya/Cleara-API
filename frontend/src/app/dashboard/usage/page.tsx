"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    User, Mail, Calendar, Shield, Activity, TrendingUp, Zap, Database,
    Layers, Terminal, Key, Info, BarChart3, Sparkles, ArrowLeft
} from "lucide-react";

interface UserStats {
    total_requests: number;
    success_rate: number;
    avg_latency_ms: number;
    quota_used: number;
    quota_limit: number;
    requests_this_month: number;
    requests_today: number;
    most_used_endpoint: string;
    account_created: string;
    last_request: string;
}

export default function UserStatsPage() {
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchUserStats();
    }, []);

    const fetchUserStats = async () => {
        try {
            const response = await fetch('http://localhost:8000/v1/user/stats', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user stats');
            }

            const data = await response.json();
            setStats(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] flex">
            {/* Sidebar Navigation */}
            <aside className="w-64 border-r border-gray-200 dark:border-white/5 hidden md:flex flex-col p-6 gap-8 bg-white dark:bg-[#020617]">
                <Link href="/" className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <Layers className="text-white w-5 h-5" />
                    </div>
                    <span className="text-lg font-bold">Cleara</span>
                </Link>

                <nav className="space-y-2 flex-1">
                    {[
                        { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
                        { name: "Playground", href: "/playground", icon: Terminal },
                        { name: "API Keys", href: "/dashboard/api-keys", icon: Key },
                        { name: "Usage Stats", href: "/dashboard/usage", icon: TrendingUp, active: true },
                        { name: "Settings", href: "/dashboard/settings", icon: Info },
                    ].map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${item.active
                                    ? 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400'
                                    : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                                }`}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="card-premium glass-dark !p-6 !rounded-3xl space-y-4">
                    <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-widest">
                        <Sparkles className="w-3 h-3" />
                        Pro Active
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        You are currently using the Professional tier.
                    </p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 space-y-10">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <h1 className="text-3xl font-bold tracking-tight">Usage Statistics</h1>
                        </div>
                        <p className="text-gray-500">Your API usage and performance metrics</p>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                        <p className="text-red-800 dark:text-red-200">Error: {error}</p>
                    </div>
                )}

                {/* Stats Content */}
                {!loading && !error && stats && (
                    <>
                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/5 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                        <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Requests</span>
                                </div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {stats.total_requests.toLocaleString()}
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/5 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                        <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Success Rate</span>
                                </div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {stats.success_rate.toFixed(1)}%
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/5 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                        <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Latency</span>
                                </div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {stats.avg_latency_ms}ms
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/5 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                        <Database className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Quota Used</span>
                                </div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {((stats.quota_used / stats.quota_limit) * 100).toFixed(1)}%
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                    {stats.quota_used.toLocaleString()} / {stats.quota_limit.toLocaleString()}
                                </div>
                            </div>
                        </div>

                        {/* Additional Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/5 p-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Requests Today</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {stats.requests_today.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Requests This Month</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {stats.requests_this_month.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Most Used Endpoint</span>
                                        <span className="font-mono text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                                            {stats.most_used_endpoint}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/5 p-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Account Info</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Account Created</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {new Date(stats.account_created).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Last Request</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {new Date(stats.last_request).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
