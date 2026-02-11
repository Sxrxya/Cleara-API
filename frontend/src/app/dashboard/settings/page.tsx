"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    User, Bell, Shield, Trash2, Save, ArrowLeft, Check
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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight text-white">Account Settings</h1>
                    </div>
                    <p className="text-slate-400">Manage your account preferences and settings</p>
                </div>
            </div>

            {/* Success Message */}
            {success && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <p className="text-green-200">Settings saved successfully!</p>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
                    <p className="text-red-200">Error: {error}</p>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                </div>
            )}

            {/* Settings Form */}
            {!loading && (
                <div className="max-w-3xl space-y-6">
                    {/* Profile Section */}
                    <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-xl p-6 shadow-lg shadow-black/20">
                        <div className="flex items-center gap-3 mb-6">
                            <User className="w-5 h-5 text-indigo-400" />
                            <h2 className="text-xl font-bold text-white">Profile Information</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-white/10 rounded-lg bg-slate-900/50 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-500 transition-all"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-white/10 rounded-lg bg-slate-900/50 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-500 transition-all"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Preferences Section */}
                    <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-xl p-6 shadow-lg shadow-black/20">
                        <div className="flex items-center gap-3 mb-6">
                            <Bell className="w-5 h-5 text-indigo-400" />
                            <h2 className="text-xl font-bold text-white">Preferences</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-white">Email Notifications</p>
                                    <p className="text-sm text-slate-400">
                                        Receive email updates about your API usage
                                    </p>
                                </div>
                                <button
                                    onClick={() => setFormData({ ...formData, notifications_enabled: !formData.notifications_enabled })}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.notifications_enabled ? 'bg-indigo-600' : 'bg-slate-700'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.notifications_enabled ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Theme
                                </label>
                                <select
                                    value={formData.theme}
                                    onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                                    className="w-full px-4 py-2 border border-white/10 rounded-lg bg-slate-900/50 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                >
                                    <option value="dark">Dark (AI Studio)</option>
                                    <option value="light">Light</option>
                                    <option value="system">System</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* API Information */}
                    {settings && (
                        <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-xl p-6 shadow-lg shadow-black/20">
                            <div className="flex items-center gap-3 mb-6">
                                <Shield className="w-5 h-5 text-indigo-400" />
                                <h2 className="text-xl font-bold text-white">API Information</h2>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400">API Version</span>
                                    <span className="font-mono text-sm font-semibold text-indigo-400">
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
                            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/20"
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
                    <div className="bg-red-900/20 border border-red-800/50 rounded-xl p-6 shadow-lg shadow-black/20">
                        <div className="flex items-center gap-3 mb-4">
                            <Trash2 className="w-5 h-5 text-red-500" />
                            <h2 className="text-xl font-bold text-red-200">Danger Zone</h2>
                        </div>
                        <p className="text-sm text-red-300 mb-4">
                            Once you delete your account, there is no going back. Please be certain.
                        </p>
                        <button className="px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-lg font-medium transition-colors border border-red-500/20">
                            Delete Account
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
