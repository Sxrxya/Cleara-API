"use client";

import { useState } from "react";
import {
    BarChart3,
    TrendingUp,
    Download,
    Calendar,
    Filter,
} from "lucide-react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const monthlyData = [
    { month: "Aug", requests: 12000, quota: 100000 },
    { month: "Sep", requests: 24000, quota: 100000 },
    { month: "Oct", requests: 45000, quota: 100000 },
    { month: "Nov", requests: 67000, quota: 100000 },
    { month: "Dec", requests: 89000, quota: 100000 },
    { month: "Jan", requests: 95000, quota: 100000 },
];

const endpointData = [
    { name: "/v1/clean", value: 8500, color: "#2D6CDF" },
    { name: "/v1/validate", value: 4200, color: "#00C482" },
    { name: "/v1/dedupe", value: 2100, color: "#8B5CF6" },
    { name: "/v1/enrich", value: 620, color: "#F59E0B" },
];

const dailyData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    requests: Math.floor(Math.random() * 1000) + 500,
}));

export default function UsagePage() {
    const [timeRange, setTimeRange] = useState("30d");

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Usage Analytics
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Monitor your API usage and track trends
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="input"
                    >
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                        <option value="12m">Last 12 months</option>
                    </select>
                    <button className="btn btn-secondary flex items-center space-x-2">
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                    </button>
                </div>
            </div>

            {/* Current Usage Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="card">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            This Month
                        </span>
                        <BarChart3 className="w-5 h-5 text-primary-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        15,420
                    </p>
                    <p className="text-sm text-success-600 dark:text-success-400 mt-2">
                        +12.5% from last month
                    </p>
                </div>

                <div className="card">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Quota Used
                        </span>
                        <TrendingUp className="w-5 h-5 text-success-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        15.4%
                    </p>
                    <div className="mt-2">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-primary-500 to-success-500 h-2 rounded-full"
                                style={{ width: "15.4%" }}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Avg Response Time
                        </span>
                        <Calendar className="w-5 h-5 text-primary-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        142ms
                    </p>
                    <p className="text-sm text-success-600 dark:text-success-400 mt-2">
                        -8ms improvement
                    </p>
                </div>

                <div className="card">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Success Rate
                        </span>
                        <Filter className="w-5 h-5 text-success-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        99.8%
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        31 errors this month
                    </p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Trend */}
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                        Monthly Usage Trend
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                            <XAxis dataKey="month" stroke="#9CA3AF" style={{ fontSize: "12px" }} />
                            <YAxis stroke="#9CA3AF" style={{ fontSize: "12px" }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1F2937",
                                    border: "none",
                                    borderRadius: "8px",
                                    color: "#fff",
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="requests"
                                stroke="#2D6CDF"
                                strokeWidth={2}
                                name="Requests"
                            />
                            <Line
                                type="monotone"
                                dataKey="quota"
                                stroke="#00C482"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                name="Quota"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Endpoint Distribution */}
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                        Endpoint Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={endpointData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) =>
                                    `${name.split("/").pop()} ${(percent * 100).toFixed(0)}%`
                                }
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {endpointData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1F2937",
                                    border: "none",
                                    borderRadius: "8px",
                                    color: "#fff",
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Daily Requests */}
            <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    Daily Requests (Last 30 Days)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dailyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                        <XAxis dataKey="day" stroke="#9CA3AF" style={{ fontSize: "12px" }} />
                        <YAxis stroke="#9CA3AF" style={{ fontSize: "12px" }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#1F2937",
                                border: "none",
                                borderRadius: "8px",
                                color: "#fff",
                            }}
                        />
                        <Bar dataKey="requests" fill="#2D6CDF" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Usage by Endpoint Table */}
            <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    Detailed Breakdown
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-800">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                                    Endpoint
                                </th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                                    Requests
                                </th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                                    Avg Time
                                </th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                                    Success Rate
                                </th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                                    % of Total
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { endpoint: "/v1/clean", requests: 8500, avgTime: "142ms", successRate: "99.9%", percentage: "55.1%" },
                                { endpoint: "/v1/validate", requests: 4200, avgTime: "98ms", successRate: "99.8%", percentage: "27.2%" },
                                { endpoint: "/v1/dedupe", requests: 2100, avgTime: "234ms", successRate: "99.6%", percentage: "13.6%" },
                                { endpoint: "/v1/enrich", requests: 620, avgTime: "176ms", successRate: "99.7%", percentage: "4.0%" },
                            ].map((row, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                >
                                    <td className="py-3 px-4">
                                        <code className="text-sm font-mono text-primary-600 dark:text-primary-400">
                                            {row.endpoint}
                                        </code>
                                    </td>
                                    <td className="py-3 px-4 text-right text-gray-900 dark:text-white">
                                        {row.requests.toLocaleString()}
                                    </td>
                                    <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">
                                        {row.avgTime}
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <span className="badge badge-success">{row.successRate}</span>
                                    </td>
                                    <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">
                                        {row.percentage}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
