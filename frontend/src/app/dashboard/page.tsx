"use client";

import React from "react";
import Link from "next/link";
import {
    Activity, TrendingUp, Zap, CheckCircle, ArrowUpRight, ArrowDownRight,
    Layers, Terminal, Key, Info, Sparkles, BarChart3, Database, Shield
} from "lucide-react";
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

// Mock data
const usageData = [
    { date: "Jan 28", requests: 1200 },
    { date: "Jan 29", requests: 1900 },
    { date: "Jan 30", requests: 1600 },
    { date: "Jan 31", requests: 2400 },
    { date: "Feb 1", requests: 2100 },
    { date: "Feb 2", requests: 2800 },
    { date: "Feb 3", requests: 3200 },
];

const dashboardStats = [
    { name: "Total Requests", value: "15,420", change: "+12.5%", trend: "up", icon: Activity },
    { name: "Success Rate", value: "99.8%", change: "+0.2%", trend: "up", icon: CheckCircle },
    { name: "Avg Latency", value: "142ms", change: "-8ms", trend: "down", icon: Zap },
    { name: "Quota Used", value: "15.4%", change: "84.6k left", trend: "neutral", icon: BarChart3 },
];

export default function DashboardPage() {
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
                        { name: "Dashboard", href: "/dashboard", icon: BarChart3, active: true },
                        { name: "Playground", href: "/playground", icon: Terminal },
                        { name: "API Keys", href: "/api-keys", icon: Key },
                        { name: "Usage Stats", href: "/usage", icon: TrendingUp },
                        { name: "Settings", href: "/settings", icon: Info },
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
                    <p className="text-xs text-gray-500 leading-relaxed">You are currently using the Professional tier. Next billing on Mar 1.</p>
                    <button className="text-[10px] font-bold text-white hover:underline">Manage Subscription →</button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 space-y-10 animate-fade-in">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">Main Dashboard</h1>
                        <p className="text-gray-500">Real-time telemetry and API performance monitoring.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-[#020617] bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-[10px] font-bold">U{i}</div>
                            ))}
                        </div>
                        <button className="btn-premium !py-2.5 !px-5 !text-xs">
                            <Sparkles className="w-3.5 h-3.5" />
                            Upgrade Plan
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {dashboardStats.map((stat, index) => (
                        <div key={stat.name} className="card-premium group hover:bg-white/40 dark:hover:bg-white/10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2.5 bg-gray-100 dark:bg-white/5 rounded-xl group-hover:scale-110 transition-transform">
                                    <stat.icon className="w-5 h-5 text-indigo-500" />
                                </div>
                                <div className={`flex items-center text-xs font-bold ${stat.trend === 'up' ? 'text-green-500' : stat.trend === 'down' ? 'text-blue-500' : 'text-gray-400'}`}>
                                    {stat.trend === 'up' && <ArrowUpRight className="w-3 h-3 mr-1" />}
                                    {stat.trend === 'down' && <ArrowDownRight className="w-3 h-3 mr-1" />}
                                    {stat.change}
                                </div>
                            </div>
                            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">{stat.name}</h3>
                            <p className="text-2xl font-bold mt-1">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Main Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">

                    {/* Usage Trends (Apple Style) */}
                    <div className="lg:col-span-8 card-premium glass !p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="font-bold text-lg">Request Volume</h3>
                                <p className="text-xs text-gray-500">API throughput over the last 7 days</p>
                            </div>
                            <select className="bg-transparent border-none text-xs font-bold text-indigo-500 outline-none">
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                            </select>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={usageData}>
                                    <defs>
                                        <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: '#64748b' }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: '#64748b' }}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="requests"
                                        stroke="#6366f1"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorUsage)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Secondary Context (Google Style) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="card-premium glass-dark !p-8 flex flex-col items-center text-center gap-6">
                            <div className="w-16 h-16 rounded-3xl bg-indigo-600/20 flex items-center justify-center p-4">
                                <Shield className="text-indigo-500 w-full h-full" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-bold">Security Scan</h4>
                                <p className="text-xs text-gray-500">No anomalies detected in your recent 50,000 requests. System is stable.</p>
                            </div>
                            <button className="text-xs font-bold uppercase tracking-widest text-indigo-500 hover:text-indigo-400 transition-colors">Run Audit Report →</button>
                        </div>

                        <div className="card-premium !p-6">
                            <h4 className="font-bold text-sm mb-4">Latest Logs</h4>
                            <div className="space-y-3">
                                {[
                                    { time: "14:20", msg: "v1/clean success", lat: "142ms" },
                                    { time: "14:18", msg: "v1/dedupe success", lat: "234ms" },
                                    { time: "14:15", msg: "v1/enrich success", lat: "176ms" },
                                ].map((log, i) => (
                                    <div key={i} className="flex items-center justify-between text-xs border-b border-gray-100 dark:border-white/5 pb-2 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <span className="text-gray-400 font-mono">{log.time}</span>
                                            <span className="font-medium">{log.msg}</span>
                                        </div>
                                        <span className="text-indigo-500 font-bold">{log.lat}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
