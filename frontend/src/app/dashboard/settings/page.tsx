"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    User, Mail, Lock, Bell, Shield, Trash2, Save, Layers, Terminal,
    Key, Info, BarChart3, TrendingUp, Sparkles, ArrowLeft, Check
} from "lucide-react";

interface UserSettings {
    email: string;
    name: string;
    notifications_enabled: boolean;
    api_version: string;
    theme: string;
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<UserSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        notifications_enabled: true,
        theme: 'system',
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await fetch('http://localhost:8000/v1/user/settings', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch settings');
            }

            const data = await response.json();
            setSettings(data);
            setFormData({
                name: data.name || '',
                email: data.email || '',
                notifications_enabled: data.notifications_enabled ?? true,
                theme: data.theme || 'system',
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch('http://localhost:8000/v1/user/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to save settings');
            }

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setSaving(false);
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
                        { name: "Usage Stats", href: "/dashboard/usage", icon: TrendingUp },
                        { name: "Settings", href: "/dashboard/settings", icon: Info, active: true },
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
                            <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
                        </div>
                        <p className="text-gray-500">Manage your account preferences and settings</p>
                    </div>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <p className="text-green-800 dark:text-green-200">Settings saved successfully!</p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <p className="text-red-800 dark:text-red-200">Error: {error}</p>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                )}

                {/* Settings Form */}
                {!loading && (
                    <div className="max-w-3xl space-y-6">
                        {/* Profile Section */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/5 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile Information</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Preferences Section */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/5 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Preferences</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Receive email updates about your API usage
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setFormData({ ...formData, notifications_enabled: !formData.notifications_enabled })}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.notifications_enabled ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.notifications_enabled ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Theme
                                    </label>
                                    <select
                                        value={formData.theme}
                                        onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    >
                                        <option value="light">Light</option>
                                        <option value="dark">Dark</option>
                                        <option value="system">System</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* API Information */}
                        {settings && (
                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/5 p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">API Information</h2>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">API Version</span>
                                        <span className="font-mono text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                                            {settings.api_version}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Save Button */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg font-medium transition-colors"
                            >
                                {saving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Danger Zone */}
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                                <h2 className="text-xl font-bold text-red-900 dark:text-red-100">Danger Zone</h2>
                            </div>
                            <p className="text-sm text-red-800 dark:text-red-200 mb-4">
                                Once you delete your account, there is no going back. Please be certain.
                            </p>
                            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors">
                                Delete Account
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
