"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Key, Plus, Copy, Trash2, ShieldAlert, CheckCircle2, MoreHorizontal, Terminal, Info, Layers } from "lucide-react";

export default function APIKeysPage() {
    const [keys, setKeys] = useState([
        { id: "1", name: "Default Production Key", key: "cl_pk_********************4a2b", status: "Active", created: "Feb 1, 2026", lastUsed: "2 mins ago" },
        { id: "2", name: "Development Sandbox", key: "cl_sk_********************9f8e", status: "Active", created: "Jan 28, 2026", lastUsed: "Never" }
    ]);

    const [showNotification, setShowNotification] = useState(false);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] flex">

            {/* Sidebar Navigation (Google AI Studio style) */}
            <aside className="w-64 border-r border-gray-200 dark:border-white/5 hidden md:flex flex-col p-6 gap-8 bg-white dark:bg-[#020617]">
                <Link href="/" className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <Layers className="text-white w-5 h-5" />
                    </div>
                    <span className="text-lg font-bold">Cleara</span>
                </Link>

                <nav className="space-y-2 flex-1">
                    {[
                        { name: "Dashboard", href: "/dashboard", icon: Terminal },
                        { name: "Playground", href: "/playground", icon: MoreHorizontal },
                        { name: "API Keys", href: "/api-keys", icon: Key, active: true },
                        { name: "Usage", href: "/usage", icon: MoreHorizontal },
                        { name: "Settings", href: "/settings", icon: Info },
                    ].map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${item.active
                                    ? 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400'
                                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'
                                }`}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="card-premium glass-dark !p-4 !rounded-2xl text-[10px] space-y-2">
                    <div className="flex items-center gap-2 font-bold text-gray-400 uppercase tracking-widest">
                        <ShieldAlert className="w-3 h-3" />
                        Security Tip
                    </div>
                    <p className="text-gray-500 leading-relaxed">Never share your secret API keys in public repositories or client-side code.</p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-12 max-w-6xl mx-auto w-full">

                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
                        <p className="text-gray-500">Manage your access tokens to authenticate with Cleara API.</p>
                    </div>
                    <button className="btn-premium !px-6 !py-3">
                        <Plus className="w-5 h-5" />
                        Create New Key
                    </button>
                </header>

                {/* Info Card (Meta Style) */}
                <div className="mb-8 p-6 rounded-3xl bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-transparent border border-indigo-500/20 flex gap-6 items-start">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
                        <Terminal className="text-white w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-bold">Developer Quickstart</h4>
                        <p className="text-sm text-gray-400">Include your API key in the request header as <code className="bg-black/20 px-1.5 py-0.5 rounded">X-API-Key</code>. Every request consumes quota based on your plan.</p>
                    </div>
                </div>

                {/* Keys Table (Apple/Google Style) */}
                <div className="card-premium !p-0 !rounded-3xl overflow-hidden glass border-gray-200 dark:border-white/5">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-white/5 text-[10px] font-bold uppercase tracking-widest text-gray-500 border-b border-gray-200 dark:border-white/5">
                                <th className="px-6 py-4">Key Name</th>
                                <th className="px-6 py-4">Secret Key</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Last Used</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                            {keys.map((key) => (
                                <tr key={key.id} className="group hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-6">
                                        <span className="font-semibold text-sm">{key.name}</span>
                                        <div className="text-[10px] text-gray-400 mt-0.5">Created on {key.created}</div>
                                    </td>
                                    <td className="px-6 py-6 underline underline-offset-4 decoration-dotted decoration-gray-400">
                                        <code className="text-xs font-mono opacity-60">{key.key}</code>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className="badge badge-success !text-[10px]">{key.status}</span>
                                    </td>
                                    <td className="px-6 py-6 text-sm text-gray-500">{key.lastUsed}</td>
                                    <td className="px-6 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => copyToClipboard(key.key)} className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors" title="Copy Key">
                                                <Copy className="w-4 h-4 text-indigo-500" />
                                            </button>
                                            <button className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-500" title="Revoke Key">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State Help */}
                <div className="mt-12 text-center text-xs text-gray-500 space-y-2">
                    <p>Lost your secret key? Revoke it immediately and create a new one.</p>
                    <Link href="/docs" className="text-indigo-500 hover:underline">Read API Key Security Guide</Link>
                </div>

            </main>

            {/* Notification Toast */}
            {showNotification && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 glass px-6 py-3 rounded-full flex items-center gap-3 animate-slide-up shadow-2xl border-indigo-500/30">
                    <CheckCircle2 className="text-green-500 w-5 h-5" />
                    <span className="text-sm font-medium">API Key copied to clipboard</span>
                </div>
            )}

        </div>
    );
}
