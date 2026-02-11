"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    Activity, TrendingUp, Zap, Database, ArrowLeft
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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight text-white">Usage Statistics</h1>
                    </div>
                    <p className="text-slate-400">Your API usage and performance metrics</p>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-6">
                    <p className="text-red-200">Error: {error}</p>
                </div>
            )}

            {/* Stats Content */}
            {!loading && !error && stats && (
                <>
                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-xl p-6 shadow-lg shadow-black/20 hover:border-indigo-500/30 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/20 shadow-inner">
                                    <Activity className="w-5 h-5 text-indigo-400" />
                                </div>
                                <span className="text-sm font-medium text-slate-400">Total Requests</span>
                            </div>
                            <div className="text-3xl font-bold text-white">
                                {stats.total_requests.toLocaleString()}
                            </div>
                        </div>

                        <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-xl p-6 shadow-lg shadow-black/20 hover:border-green-500/30 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20 shadow-inner">
                                    <TrendingUp className="w-5 h-5 text-green-400" />
                                </div>
                                <span className="text-sm font-medium text-slate-400">Success Rate</span>
                            </div>
                            <div className="text-3xl font-bold text-white">
                                {stats.success_rate.toFixed(1)}%
                            </div>
                        </div>

                        <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-xl p-6 shadow-lg shadow-black/20 hover:border-purple-500/30 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20 shadow-inner">
                                    <Zap className="w-5 h-5 text-purple-400" />
                                </div>
                                <span className="text-sm font-medium text-slate-400">Avg Latency</span>
                            </div>
                            <div className="text-3xl font-bold text-white">
                                {stats.avg_latency_ms}ms
                            </div>
                        </div>

                        <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-xl p-6 shadow-lg shadow-black/20 hover:border-orange-500/30 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20 shadow-inner">
                                    <Database className="w-5 h-5 text-orange-400" />
                                </div>
                                <span className="text-sm font-medium text-slate-400">Quota Used</span>
                            </div>
                            <div className="text-3xl font-bold text-white">
                                {((stats.quota_used / stats.quota_limit) * 100).toFixed(1)}%
                            </div>
                            <div className="text-sm text-slate-500 mt-2">
                                {stats.quota_used.toLocaleString()} / {stats.quota_limit.toLocaleString()}
                            </div>
                        </div>
                    </div>

                    {/* Additional Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-xl p-6 shadow-lg shadow-black/20">
                            <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0">
                                    <span className="text-slate-400">Requests Today</span>
                                    <span className="font-semibold text-white">
                                        {stats.requests_today.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0">
                                    <span className="text-slate-400">Requests This Month</span>
                                    <span className="font-semibold text-white">
                                        {stats.requests_this_month.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0">
                                    <span className="text-slate-400">Most Used Endpoint</span>
                                    <span className="font-mono text-sm font-semibold text-indigo-400">
                                        {stats.most_used_endpoint}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-xl p-6 shadow-lg shadow-black/20">
                            <h3 className="text-lg font-bold text-white mb-4">Account Info</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0">
                                    <span className="text-slate-400">Account Created</span>
                                    <span className="font-semibold text-white">
                                        {new Date(stats.account_created).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0">
                                    <span className="text-slate-400">Last Request</span>
                                    <span className="font-semibold text-white">
                                        {new Date(stats.last_request).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
