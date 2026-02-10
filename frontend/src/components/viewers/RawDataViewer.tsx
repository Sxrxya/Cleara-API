"use client";

import React, { useState } from "react";
import { Code, Table, Download, Copy, Check } from "lucide-react";

interface RawDataViewerProps {
    data: any;
}

export default function RawDataViewer({ data }: RawDataViewerProps) {
    const [viewMode, setViewMode] = useState<'json' | 'table'>('table');
    const [copied, setCopied] = useState(false);

    const rawData = data.data || {};
    const records = rawData.records || [rawData];

    const copyToClipboard = () => {
        navigator.clipboard.writeText(JSON.stringify(rawData, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadJSON = () => {
        const blob = new Blob([JSON.stringify(rawData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cleaned_data.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const downloadCSV = () => {
        if (records.length === 0) return;

        const headers = Object.keys(records[0]);
        const csvContent = [
            headers.join(','),
            ...records.map((row: any) =>
                headers.map(header => JSON.stringify(row[header] || '')).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cleaned_data.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-4 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Code className="w-6 h-6 text-blue-500" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Raw Cleaned Data</h3>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode('table')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${viewMode === 'table'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                            }`}
                    >
                        <Table className="w-4 h-4 inline mr-2" />
                        Table
                    </button>
                    <button
                        onClick={() => setViewMode('json')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${viewMode === 'json'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                            }`}
                    >
                        <Code className="w-4 h-4 inline mr-2" />
                        JSON
                    </button>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy JSON'}
                </button>
                <button
                    onClick={downloadJSON}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                    <Download className="w-4 h-4" />
                    Download JSON
                </button>
                <button
                    onClick={downloadCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                    <Download className="w-4 h-4" />
                    Download CSV
                </button>
            </div>

            {/* Content */}
            {viewMode === 'table' ? (
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto max-h-96">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-slate-900 sticky top-0">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                                        #
                                    </th>
                                    {Object.keys(records[0] || {}).map((key) => (
                                        <th key={key} className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                                            {key}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {records.map((row: any, idx: number) => (
                                    <tr key={idx} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400 font-medium">
                                            {idx + 1}
                                        </td>
                                        {Object.values(row).map((value: any, cellIdx: number) => (
                                            <td key={cellIdx} className="px-4 py-3 text-gray-600 dark:text-gray-400">
                                                {value === null || value === undefined ? (
                                                    <span className="text-gray-400 italic">null</span>
                                                ) : (
                                                    String(value)
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-96">
                    <pre className="text-sm text-green-400 font-mono">
                        {JSON.stringify(rawData, null, 2)}
                    </pre>
                </div>
            )}

            {/* Metadata */}
            {data.metadata && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Metadata</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                            <span className="text-blue-700 dark:text-blue-300">Format:</span>
                            <span className="ml-2 font-mono text-blue-900 dark:text-blue-100">{data.metadata.format_type}</span>
                        </div>
                        <div>
                            <span className="text-blue-700 dark:text-blue-300">Records:</span>
                            <span className="ml-2 font-mono text-blue-900 dark:text-blue-100">{data.metadata.record_count}</span>
                        </div>
                        <div>
                            <span className="text-blue-700 dark:text-blue-300">Timestamp:</span>
                            <span className="ml-2 font-mono text-blue-900 dark:text-blue-100 text-xs">
                                {new Date(data.metadata.timestamp).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
