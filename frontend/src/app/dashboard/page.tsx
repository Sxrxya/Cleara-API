"use client";

import React from "react";
import {
    Activity, TrendingUp, Zap, CheckCircle, ArrowUpRight, ArrowDownRight,
    BarChart3, Shield
} from "lucide-react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
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
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-white">Main Dashboard</h1>
                    <p className="text-slate-400">Real-time telemetry and API performance monitoring.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0F172A] bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-300">U{i}</div>
                        ))}
                    </div>
                    <button className="bg-white text-slate-900 hover:bg-slate-200 transition-colors py-2 px-4 text-xs font-bold rounded-full flex items-center gap-2 shadow-lg shadow-white/5">
                        <Shield className="w-3.5 h-3.5" />
                        Upgrade Plan
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardStats.map((stat) => (
                    <div key={stat.name} className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-xl p-6 hover:bg-slate-800/40 transition-colors group shadow-lg shadow-black/20">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2.5 bg-slate-800/50 rounded-xl group-hover:scale-110 transition-transform border border-white/5 shadow-inner">
                                <stat.icon className="w-5 h-5 text-indigo-500" />
                            </div>
                            <div className={`flex items-center text-xs font-bold ${stat.trend === 'up' ? 'text-green-400' : stat.trend === 'down' ? 'text-indigo-400' : 'text-slate-400'}`}>
                                {stat.trend === 'up' && <ArrowUpRight className="w-3 h-3 mr-1" />}
                                {stat.trend === 'down' && <ArrowDownRight className="w-3 h-3 mr-1" />}
                                {stat.change}
                            </div>
                        </div>
                        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">{stat.name}</h3>
                        <p className="text-2xl font-bold mt-1 text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Main Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">

                {/* Usage Trends */}
                <div className="lg:col-span-8 bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-xl p-8 shadow-lg shadow-black/20">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="font-bold text-lg text-white">Request Volume</h3>
                            <p className="text-xs text-slate-400">API throughput over the last 7 days</p>
                        </div>
                        <select className="bg-transparent border-none text-xs font-bold text-indigo-400 outline-none cursor-pointer hover:text-indigo-300 transition-colors">
                            <option className="bg-slate-900">Last 7 Days</option>
                            <option className="bg-slate-900">Last 30 Days</option>
                        </select>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={usageData}>
                                <defs>
                                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#94A3B8' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#94A3B8' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: '#E2E8F0',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                                    }}
                                    itemStyle={{ color: '#E2E8F0' }}
                                    cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
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

                {/* Secondary Context */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-xl p-8 flex flex-col items-center text-center gap-6 shadow-lg shadow-black/20">
                        <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 flex items-center justify-center p-4 border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
                            <Shield className="text-indigo-500 w-full h-full" />
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-bold text-white">Security Scan</h4>
                            <p className="text-xs text-slate-400">No anomalies detected in your recent 50,000 requests. System is stable.</p>
                        </div>
                        <button className="text-xs font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors border border-transparent hover:border-indigo-500/20 px-4 py-2 rounded-lg">RUN AUDIT REPORT →</button>
                    </div>

                    <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-xl p-6 shadow-lg shadow-black/20">
                        <h4 className="font-bold text-sm mb-4 text-white">Latest Logs</h4>
                        <div className="space-y-3">
                            {[
                                { time: "14:20", msg: "v1/clean success", lat: "142ms" },
                                { time: "14:18", msg: "v1/dedupe success", lat: "234ms" },
                                { time: "14:15", msg: "v1/enrich success", lat: "176ms" },
                            ].map((log, i) => (
                                <div key={i} className="flex items-center justify-between text-xs border-b border-white/5 pb-2 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <span className="text-slate-500 font-mono">{log.time}</span>
                                        <span className="font-medium text-slate-300">{log.msg}</span>
                                    </div>
                                    <span className="text-indigo-400 font-bold">{log.lat}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
