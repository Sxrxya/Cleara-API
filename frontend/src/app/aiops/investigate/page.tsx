'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    ArrowLeft,
    Clock,
    Server,
    Activity,
    AlertTriangle,
    CheckCircle,
    FileText,
    MessageSquare,
    Download,
    Share2,
    TrendingUp
} from 'lucide-react';
import Link from 'next/link';

interface Event {
    timestamp: string;
    type: 'log' | 'metric' | 'alert';
    level?: string;
    message?: string;
    name?: string;
    value?: number;
    unit?: string;
    severity?: string;
    title?: string;
    description?: string;
}

interface IncidentDetails {
    incident_id: string;
    source: string;
    logs: Array<{
        timestamp: string;
        level: string;
        message: string;
    }>;
    metrics: Array<{
        timestamp: string;
        name: string;
        value: number;
        unit: string;
    }>;
    alerts: Array<{
        timestamp: string;
        severity: string;
        title: string;
        description: string;
    }>;
}

export default function IncidentInvestigationPage() {
    const searchParams = useSearchParams();
    const incidentId = searchParams.get('id');

    const [details, setDetails] = useState<IncidentDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'timeline' | 'logs' | 'metrics' | 'alerts'>('timeline');
    const [notes, setNotes] = useState('');
    const [status, setStatus] = useState<'investigating' | 'resolved' | 'false_positive'>('investigating');

    useEffect(() => {
        if (incidentId) {
            fetchIncidentDetails();
        }
    }, [incidentId]);

    const fetchIncidentDetails = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/v1/correlation/incident/${incidentId}`);
            const data = await response.json();
            setDetails(data);
        } catch (error) {
            console.error('Failed to fetch incident details:', error);
        } finally {
            setLoading(false);
        }
    };

    const getAllEvents = (): Event[] => {
        if (!details) return [];

        const events: Event[] = [
            ...details.logs.map(log => ({
                timestamp: log.timestamp,
                type: 'log' as const,
                level: log.level,
                message: log.message
            })),
            ...details.metrics.map(metric => ({
                timestamp: metric.timestamp,
                type: 'metric' as const,
                name: metric.name,
                value: metric.value,
                unit: metric.unit
            })),
            ...details.alerts.map(alert => ({
                timestamp: alert.timestamp,
                type: 'alert' as const,
                severity: alert.severity,
                title: alert.title,
                description: alert.description
            }))
        ];

        return events.sort((a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
    };

    const getEventIcon = (type: string) => {
        switch (type) {
            case 'log':
                return <FileText className="w-4 h-4" />;
            case 'metric':
                return <Activity className="w-4 h-4" />;
            case 'alert':
                return <AlertTriangle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    const getEventColor = (event: Event) => {
        if (event.type === 'alert') {
            return event.severity === 'critical' ? 'text-red-400' : 'text-yellow-400';
        }
        if (event.type === 'log') {
            return event.level === 'ERROR' || event.level === 'CRITICAL' ? 'text-red-400' : 'text-blue-400';
        }
        return 'text-green-400';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400">Loading incident details...</p>
                </div>
            </div>
        );
    }

    if (!details) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
                <div className="text-center">
                    <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <p className="text-xl text-slate-300">Incident not found</p>
                    <Link href="/aiops" className="text-cyan-400 hover:text-cyan-300 mt-4 inline-block">
                        ← Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const events = getAllEvents();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href="/aiops"
                        className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Link>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">{incidentId}</h1>
                            <p className="text-slate-400">Source: {details.source}</p>
                        </div>

                        <div className="flex gap-3">
                            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2">
                                <Share2 className="w-4 h-4" />
                                Share
                            </button>
                            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                Export
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <FileText className="w-8 h-8 text-blue-400" />
                            <div>
                                <p className="text-slate-400 text-sm">Logs</p>
                                <p className="text-2xl font-bold text-white">{details.logs.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <Activity className="w-8 h-8 text-green-400" />
                            <div>
                                <p className="text-slate-400 text-sm">Metrics</p>
                                <p className="text-2xl font-bold text-white">{details.metrics.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-8 h-8 text-red-400" />
                            <div>
                                <p className="text-slate-400 text-sm">Alerts</p>
                                <p className="text-2xl font-bold text-white">{details.alerts.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-slate-700">
                    {[
                        { id: 'timeline', label: 'Timeline', icon: Clock },
                        { id: 'logs', label: 'Logs', icon: FileText },
                        { id: 'metrics', label: 'Metrics', icon: Activity },
                        { id: 'alerts', label: 'Alerts', icon: AlertTriangle }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-4 py-3 flex items-center gap-2 transition-colors border-b-2 ${activeTab === tab.id
                                    ? 'border-cyan-500 text-cyan-400'
                                    : 'border-transparent text-slate-400 hover:text-slate-300'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
                            {activeTab === 'timeline' && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-white mb-4">Event Timeline</h3>
                                    {events.map((event, index) => (
                                        <div key={index} className="flex gap-4 pb-4 border-b border-slate-700 last:border-0">
                                            <div className={`mt-1 ${getEventColor(event)}`}>
                                                {getEventIcon(event.type)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="text-xs text-slate-500">
                                                        {new Date(event.timestamp).toLocaleString()}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${event.type === 'alert' ? 'bg-red-500/10 text-red-400' :
                                                            event.type === 'log' ? 'bg-blue-500/10 text-blue-400' :
                                                                'bg-green-500/10 text-green-400'
                                                        }`}>
                                                        {event.type.toUpperCase()}
                                                    </span>
                                                    {event.level && (
                                                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-700 text-slate-300">
                                                            {event.level}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-slate-300 text-sm">
                                                    {event.message || event.title || `${event.name}: ${event.value}${event.unit}`}
                                                </p>
                                                {event.description && (
                                                    <p className="text-slate-400 text-xs mt-1">{event.description}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'logs' && (
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold text-white mb-4">Application Logs</h3>
                                    {details.logs.map((log, index) => (
                                        <div key={index} className="bg-slate-900/50 rounded-lg p-3 font-mono text-sm">
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleString()}</span>
                                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${log.level === 'ERROR' || log.level === 'CRITICAL' ? 'bg-red-500/10 text-red-400' :
                                                        log.level === 'WARNING' ? 'bg-yellow-500/10 text-yellow-400' :
                                                            'bg-blue-500/10 text-blue-400'
                                                    }`}>
                                                    {log.level}
                                                </span>
                                            </div>
                                            <p className="text-slate-300">{log.message}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'metrics' && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-white mb-4">System Metrics</h3>
                                    {details.metrics.map((metric, index) => (
                                        <div key={index} className="bg-slate-900/50 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-slate-300 font-medium">{metric.name}</span>
                                                <span className="text-xs text-slate-500">{new Date(metric.timestamp).toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-2xl font-bold text-cyan-400">{metric.value}</span>
                                                <span className="text-slate-400">{metric.unit}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'alerts' && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-white mb-4">Triggered Alerts</h3>
                                    {details.alerts.map((alert, index) => (
                                        <div key={index} className={`rounded-lg p-4 border ${alert.severity === 'critical'
                                                ? 'bg-red-500/10 border-red-500/20'
                                                : 'bg-yellow-500/10 border-yellow-500/20'
                                            }`}>
                                            <div className="flex items-center gap-3 mb-2">
                                                <AlertTriangle className={`w-5 h-5 ${alert.severity === 'critical' ? 'text-red-400' : 'text-yellow-400'
                                                    }`} />
                                                <span className="font-semibold text-white">{alert.title}</span>
                                                <span className="text-xs text-slate-500 ml-auto">
                                                    {new Date(alert.timestamp).toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="text-slate-300 text-sm">{alert.description}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status */}
                        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Status</h3>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as any)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
                            >
                                <option value="investigating">🔍 Investigating</option>
                                <option value="resolved">✅ Resolved</option>
                                <option value="false_positive">❌ False Positive</option>
                            </select>
                        </div>

                        {/* Notes */}
                        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5" />
                                Investigation Notes
                            </h3>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add your investigation notes here..."
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 min-h-[150px] resize-none"
                            />
                            <button className="w-full mt-3 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors">
                                Save Notes
                            </button>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                            <div className="space-y-2">
                                <button className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-left">
                                    📋 View Runbook
                                </button>
                                <button className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-left">
                                    🔗 Similar Incidents
                                </button>
                                <button className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-left">
                                    👥 Assign to Team
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
