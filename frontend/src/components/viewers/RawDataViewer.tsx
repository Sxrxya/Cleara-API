"use client";

import React, { useState } from "react";
import { Code, Table, Download, Copy, Check, FileJson, FileSpreadsheet } from "lucide-react";

interface RawDataViewerProps {
    data: any;
}

export default function RawDataViewer({ data }: RawDataViewerProps) {
    const [viewMode, setViewMode] = useState<'json' | 'table'>('table');
    const [copied, setCopied] = useState(false);

    const rawData = data.data || {};
    // Extract records properly depending on structure
    const records = Array.isArray(rawData) ? rawData : (rawData.records || [rawData]);

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
        if (!records || records.length === 0) return;

        // Collect all unique headers
        const headers = Array.from(new Set(records.flatMap((r: any) => Object.keys(r)))) as string[];
        const csvContent = [
            headers.join(','),
            ...records.map((row: any) =>
                headers.map(header => JSON.stringify(row[header] !== undefined ? row[header] : '')).join(',')
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
        <div className="space-y-6">
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <Code className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Raw Cleaned Data</h3>
                </div>

                <div className="flex bg-slate-900/50 p-1 rounded-lg border border-white/5">
                    <button
                        onClick={() => setViewMode('table')}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'table'
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Table className="w-4 h-4" />
                        Table View
                    </button>
                    <button
                        onClick={() => setViewMode('json')}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'json'
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Code className="w-4 h-4" />
                        JSON View
                    </button>
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-white/5 text-sm font-medium"
                >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy to Clipboard'}
                </button>
                <div className="flex-1"></div>
                <button
                    onClick={downloadJSON}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-indigo-600 text-white rounded-lg transition-colors border border-white/5 hover:border-indigo-500/50 text-sm font-medium group"
                >
                    <FileJson className="w-4 h-4 text-indigo-400 group-hover:text-white transition-colors" />
                    Download JSON
                </button>
                <button
                    onClick={downloadCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-green-600 text-white rounded-lg transition-colors border border-white/5 hover:border-green-500/50 text-sm font-medium group"
                >
                    <FileSpreadsheet className="w-4 h-4 text-green-400 group-hover:text-white transition-colors" />
                    Download CSV
                </button>
            </div>

            {/* Content Area */}
            {viewMode === 'table' ? (
                <div className="bg-slate-950/50 rounded-xl border border-white/10 overflow-hidden shadow-inner">
                    <div className="overflow-x-auto max-h-[500px] scrollbar-thin scrollbar-thumb-indigo-500/20 scrollbar-track-transparent">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-900/80 sticky top-0 z-10 backdrop-blur-sm">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-slate-300 border-b border-white/10 w-16 text-center">
                                        #
                                    </th>
                                    {records.length > 0 && Object.keys(records[0]).map((key) => (
                                        <th key={key} className="px-6 py-4 font-semibold text-slate-300 border-b border-white/10 whitespace-nowrap">
                                            {key}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {records.map((row: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-3 text-slate-500 font-mono text-xs text-center border-r border-white/5 group-hover:text-indigo-400">
                                            {idx + 1}
                                        </td>
                                        {Object.values(row).map((value: any, cellIdx: number) => (
                                            <td key={cellIdx} className="px-6 py-3 text-slate-300 whitespace-nowrap">
                                                {value === null || value === undefined ? (
                                                    <span className="text-slate-600 italic text-xs">null</span>
                                                ) : typeof value === 'object' ? (
                                                    <span className="text-indigo-300 font-mono text-xs">{JSON.stringify(value).substring(0, 30)}...</span>
                                                ) : (
                                                    <span className={typeof value === 'number' ? 'font-mono text-purple-300' : ''}>
                                                        {String(value)}
                                                    </span>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {records.length === 0 && (
                            <div className="p-8 text-center text-slate-500">
                                No records found to display.
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-slate-950/80 rounded-xl border border-white/10 p-4 shadow-inner">
                    <pre className="text-sm font-mono overflow-auto max-h-[500px] scrollbar-thin scrollbar-thumb-indigo-500/20 scrollbar-track-transparent">
                        <code className="text-green-400/90 shadow-none">
                            {JSON.stringify(rawData, null, 2)}
                        </code>
                    </pre>
                </div>
            )}
        </div>
    );
}
