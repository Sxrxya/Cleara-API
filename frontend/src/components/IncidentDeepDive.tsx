import { useState } from 'react';
import {
    Clock,
    Activity,
    Layers,
    FileText,
    MessageSquare,
    CheckCircle,
    AlertTriangle,
    X,
    Info // Added missing import
} from 'lucide-react';
import TimelineChart from './visualizations/TimelineChart';
import ServiceMap from './visualizations/ServiceMap';

interface IncidentDeepDiveProps {
    incident: any;
    onClose: () => void;
}

export default function IncidentDeepDive({ incident, onClose }: IncidentDeepDiveProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'topology' | 'logs'>('overview');

    if (!incident) return null;

    return (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200">
            <div className="bg-slate-900 w-full h-full max-w-6xl rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-800/50">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${incident.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                                incident.severity === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                                    'bg-blue-500/20 text-blue-400'
                            }`}>
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">{incident.incident_id}</h2>
                            <p className="text-slate-400 text-sm flex items-center gap-2">
                                <Clock className="w-3 h-3" />
                                {new Date().toLocaleTimeString()} • {incident.time_window || '15m window'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 flex flex-col items-end">
                            <span className="text-xs text-slate-500 uppercase font-semibold">Confidence</span>
                            <span className="text-lg font-bold text-cyan-400">{incident.confidence}%</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-700 bg-slate-800/30">
                    {[
                        { id: 'overview', label: 'Overview', icon: Activity },
                        { id: 'timeline', label: 'Timeline', icon: Clock },
                        { id: 'topology', label: 'Service Map', icon: Layers },
                        { id: 'logs', label: 'Raw Data', icon: FileText },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-6 py-4 text-sm font-medium transition-colors flex items-center gap-2 border-b-2 ${activeTab === tab.id
                                    ? 'border-cyan-500 text-cyan-400 bg-slate-800/50'
                                    : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/30'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-900/50">

                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Root Cause Card */}
                            <div className="col-span-2 bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Root Cause Analysis</h3>
                                <p className="text-lg text-white leading-relaxed">
                                    {incident.root_cause}
                                </p>
                                <div className="mt-4 flex gap-2">
                                    {incident.affected_services.map((svc: string) => (
                                        <span key={svc} className="px-3 py-1 bg-slate-700 rounded-full text-xs text-slate-300 border border-slate-600">
                                            {svc}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Recommendation */}
                            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" />
                                        Recommended Action
                                    </h3>
                                    <p className="text-slate-200">{incident.recommendation}</p>
                                </div>
                                <button className="mt-6 w-full py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm font-medium transition-colors">
                                    Apply Automated Fix (Simulation)
                                </button>
                            </div>

                            {/* Impact Stats */}
                            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Impact Scope</h3>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div className="p-4 bg-slate-900 rounded-lg">
                                        <div className="text-2xl font-bold text-white">{incident.related_alerts}</div>
                                        <div className="text-xs text-slate-500 mt-1">Stuck Alerts</div>
                                    </div>
                                    <div className="p-4 bg-slate-900 rounded-lg">
                                        <div className="text-2xl font-bold text-white">{incident.related_logs}</div>
                                        <div className="text-xs text-slate-500 mt-1">Error Logs</div>
                                    </div>
                                    <div className="p-4 bg-slate-900 rounded-lg">
                                        <div className="text-2xl font-bold text-white">{incident.related_metrics}</div>
                                        <div className="text-xs text-slate-500 mt-1">Anomalies</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'timeline' && (
                        <div className="h-full">
                            <TimelineChart
                                incidentId={incident.incident_id}
                                rootCause={incident.root_cause}
                                affectedServices={incident.affected_services}
                            />
                            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800/30 rounded-lg">
                                <p className="text-sm text-blue-300">
                                    <Info className="w-4 h-4 inline mr-2" />
                                    Analysis indicates a cascade effect starting from <b>{incident.affected_services[0]}</b> (Log Error) leading to <b>{incident.affected_services[1] || 'database'}</b> (Latency Spike).
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'topology' && (
                        <div className="h-full flex flex-col">
                            <ServiceMap
                                affectedServices={incident.affected_services}
                                rootCauseService={incident.affected_services[0]}
                            />
                        </div>
                    )}

                    {activeTab === 'logs' && (
                        <div className="bg-slate-950 rounded-xl border border-slate-700 p-4 font-mono text-xs text-slate-300 overflow-auto h-full">
                            <div className="flex border-b border-slate-800 pb-2 mb-2 font-bold text-slate-500">
                                <span className="w-24">TIMESTAMP</span>
                                <span className="w-20">LEVEL</span>
                                <span className="w-32">SOURCE</span>
                                <span className="flex-1">MESSAGE</span>
                            </div>
                            {/* Mock log lines */}
                            {Array.from({ length: 12 }).map((_, i) => (
                                <div key={i} className="flex py-1 hover:bg-slate-900 cursor-pointer">
                                    <span className="w-24 text-slate-500">{new Date(Date.now() - i * 60000).toLocaleTimeString()}</span>
                                    <span className={`w-20 ${i % 3 === 0 ? 'text-red-400' : 'text-blue-400'}`}>
                                        {i % 3 === 0 ? 'ERROR' : 'INFO'}
                                    </span>
                                    <span className="w-32 text-purple-400">{incident.affected_services[i % incident.affected_services.length]}</span>
                                    <span className="flex-1 text-slate-300">
                                        {i % 3 === 0 ? `Connection timeout: ${incident.root_cause}` : 'Processing request...'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
