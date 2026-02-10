"use client";

import React, { useState } from "react";
import { BarChart3, PieChart, LineChart, TrendingUp, Download } from "lucide-react";
import {
    BarChart, Bar, PieChart as RePieChart, Pie, LineChart as ReLineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

const CHART_TYPES = [
    { id: 'bar', name: 'Bar Chart', icon: BarChart3, description: 'Compare values across categories' },
    { id: 'pie', name: 'Pie Chart', icon: PieChart, description: 'Show proportions and percentages' },
    { id: 'line', name: 'Line Chart', icon: LineChart, description: 'Track trends over time' },
];

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1'];

interface VisualizationOutputViewerProps {
    data: any;
}

export default function VisualizationOutputViewer({ data }: VisualizationOutputViewerProps) {
    const [selectedChart, setSelectedChart] = useState<string>('bar');
    const [selectedField, setSelectedField] = useState<string>('');

    // Extract chart data
    const charts = data.charts || {};
    const fieldDistribution = charts.field_distribution || {};
    const tableData = data.table_data || [];

    // Get available fields
    const availableFields = Object.keys(fieldDistribution);

    // Set default field if not selected
    React.useEffect(() => {
        if (!selectedField && availableFields.length > 0) {
            setSelectedField(availableFields[0]);
        }
    }, [availableFields, selectedField]);

    // Prepare chart data
    const getChartData = () => {
        if (!selectedField || !fieldDistribution[selectedField]) return [];

        const distribution = fieldDistribution[selectedField];
        return Object.entries(distribution).map(([key, value]) => ({
            name: key,
            value: value as number,
            count: value as number
        }));
    };

    const chartData = getChartData();

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-8 h-8" />
                    <h2 className="text-2xl font-bold">Data Visualization Studio</h2>
                </div>
                <p className="text-purple-100">
                    Interactive charts and graphs to explore your data visually
                </p>
            </div>

            {/* Chart Type Selector */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Choose Chart Type</h3>
                <div className="grid grid-cols-3 gap-4">
                    {CHART_TYPES.map((chart) => {
                        const Icon = chart.icon;
                        const isSelected = selectedChart === chart.id;
                        return (
                            <button
                                key={chart.id}
                                onClick={() => setSelectedChart(chart.id)}
                                className={`p-4 rounded-lg border-2 transition-all ${isSelected
                                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 scale-105'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                                    }`}
                            >
                                <Icon className={`w-8 h-8 mx-auto mb-2 ${isSelected ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'
                                    }`} />
                                <div className={`font-semibold ${isSelected ? 'text-purple-900 dark:text-purple-100' : 'text-gray-700 dark:text-gray-300'
                                    }`}>
                                    {chart.name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {chart.description}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Field Selector */}
            {availableFields.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Select Field to Visualize</h3>
                    <div className="flex flex-wrap gap-2">
                        {availableFields.map((field) => (
                            <button
                                key={field}
                                onClick={() => setSelectedField(field)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedField === field
                                    ? 'bg-purple-600 text-white shadow-lg scale-105'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                {field}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Chart Display */}
            {chartData.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {selectedField} Distribution
                        </h3>
                        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                            <Download className="w-4 h-4" />
                            Export Chart
                        </button>
                    </div>

                    <div className="h-96">
                        {selectedChart === 'bar' && (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#8b5cf6">
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        )}

                        {selectedChart === 'pie' && (
                            <ResponsiveContainer width="100%" height="100%">
                                <RePieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={120}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </RePieChart>
                            </ResponsiveContainer>
                        )}

                        {selectedChart === 'line' && (
                            <ResponsiveContainer width="100%" height="100%">
                                <ReLineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} />
                                </ReLineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            )}

            {/* Data Table Preview */}
            {tableData.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Data Table Preview</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    {Object.keys(tableData[0] || {}).map((key) => (
                                        <th key={key} className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">
                                            {key}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.slice(0, 10).map((row: any, idx: number) => (
                                    <tr key={idx} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        {Object.values(row).map((value: any, cellIdx: number) => (
                                            <td key={cellIdx} className="p-3 text-gray-600 dark:text-gray-400">
                                                {String(value)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {tableData.length > 10 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
                            Showing 10 of {tableData.length} records
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
