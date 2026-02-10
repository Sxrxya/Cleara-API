'use client';

import { useState, useEffect } from 'react';
import {
    AlertTriangle,
    AlertCircle,
    Info,
    TrendingDown,
    Clock,
    Server,
    RefreshCw,
    Filter,
    Upload,
    Link as LinkIcon,
    MessageSquare,
    Database,
    FileJson,
    Code,
    Sparkles,
    Terminal,
    ThumbsUp,
    ThumbsDown,
    CheckCircle,
    Activity // Added Activity
} from 'lucide-react';
import DataInspection from '@/components/DataInspection';
import AnalysisModeSelection from '@/components/AnalysisModeSelection';
import ProgressModal, { ProcessingStage } from '@/components/ProgressModal';
import ExportMenu from '@/components/ExportMenu';
import AdvancedFilters from '@/components/AdvancedFilters';
import DeveloperTools from '@/components/DeveloperTools';
import IncidentDeepDive from '@/components/IncidentDeepDive'; // New Import
import { validateData, prepareInspectionData } from '@/utils/dataInspection';
import { AnalysisMode } from '@/config/analysisModes';
import { downloadJSON, downloadCSV, generateTextReport } from '@/utils/exportUtils';

interface Incident {
    incident_id: string;
    root_cause: string;
    confidence: number;
    affected_services: string[];
    related_alerts: number;
    related_logs: number;
    related_metrics: number;
    recommendation: string;
    time_window: string;
    severity: 'critical' | 'warning' | 'info';
    timestamp?: string;
    feedback?: 'positive' | 'negative' | null;
}

interface CorrelationResponse {
    success: boolean;
    incidents: Incident[];
    total_incidents: number;
    noise_reduction: string;
    summary: string;
    timestamp: string;
}

type InputMethod = 'sample' | 'api' | 'natural' | 'file';
type ViewMode = 'list' | 'table' | 'json';

export default function AIOpsPage() {
    // General State
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        totalEvents: 0,
        totalIncidents: 0,
        noiseReduction: '0%',
        avgConfidence: 0
    });
    const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
    const [severityFilter, setSeverityFilter] = useState<string>('all');
    const [timeWindow, setTimeWindow] = useState(15);
    const [viewMode, setViewMode] = useState<ViewMode>('list');

    // Advanced Filtering State
    const [searchQuery, setSearchQuery] = useState('');
    const [minConfidence, setMinConfidence] = useState(0);
    const [selectedService, setSelectedService] = useState('all');

    // Developer Tools State
    const [showDevTools, setShowDevTools] = useState(false);

    // Input method states
    const [inputMethod, setInputMethod] = useState<InputMethod>('sample');
    const [showInputPanel, setShowInputPanel] = useState(false);
    const [apiUrl, setApiUrl] = useState('');
    const [naturalLanguage, setNaturalLanguage] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Data inspection stage
    const [showInspection, setShowInspection] = useState(false);
    const [inspectionData, setInspectionData] = useState<any>(null);
    const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
    const [dataQuality, setDataQuality] = useState({
        score: 0,
        issues: [] as string[],
        suggestions: [] as string[]
    });
    const [inspectionLoading, setInspectionLoading] = useState(false);

    // Analysis Mode state
    const [showAnalysisMode, setShowAnalysisMode] = useState(false);
    const [selectedAnalysisMode, setSelectedAnalysisMode] = useState<AnalysisMode>('summary');

    // Progress Modal state
    const [showProgress, setShowProgress] = useState(false);
    const [processingStages, setProcessingStages] = useState<ProcessingStage[]>([
        { id: 'ingest', label: 'Ingesting Data', status: 'pending', details: 'Parsing and validating input...' },
        { id: 'analyze', label: 'Running Analysis', status: 'pending', details: ' applying ML models...' },
        { id: 'correlate', label: 'Correlating Events', status: 'pending', details: ' finding relationships...' },
        { id: 'finalize', label: 'Finalizing Results', status: 'pending', details: ' generating insights...' }
    ]);
    const [currentStageIndex, setCurrentStageIndex] = useState(0);

    // Derived: Get unique services for filter dropdown
    const availableServices = Array.from(new Set(incidents.flatMap(inc => inc.affected_services))).sort();

    const fetchIncidents = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/v1/correlation/correlate?time_window_minutes=${timeWindow}`, {
                method: 'POST',
            });
            const data: CorrelationResponse = await response.json();

            // Transform data to ensure feedback field exists if not provided
            const transformedIncidents = (data.incidents || []).map((inc: any) => ({
                ...inc,
                feedback: inc.feedback || null
            }));

            setIncidents(transformedIncidents);
            setStats({
                totalEvents: parseInt(data.summary.split(' ')[1]) || 0,
                totalIncidents: data.total_incidents,
                noiseReduction: data.noise_reduction,
                avgConfidence: data.incidents.length > 0
                    ? Math.round(data.incidents.reduce((sum, i) => sum + i.confidence, 0) / data.incidents.length)
                    : 0
            });
        } catch (error) {
            console.error('Failed to fetch incidents:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFeedback = (incidentId: string, type: 'positive' | 'negative') => {
        setIncidents(prev => prev.map(inc =>
            inc.incident_id === incidentId ? { ...inc, feedback: type } : inc
        ));
        console.log(`Feedback for ${incidentId}: ${type}`);
    };

    const updateStageStatus = (index: number, status: 'pending' | 'processing' | 'completed', details?: string) => {
        setProcessingStages(prev => prev.map((stage, i) => {
            if (i === index) {
                return { ...stage, status, details };
            }
            return stage;
        }));
    };

    const inspectData = async (data: any, source: string) => {
        setInspectionLoading(true);
        setShowInspection(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        const { warnings, quality } = validateData(data);
        const preparedData = prepareInspectionData(data, source);
        setInspectionData(preparedData);
        setValidationWarnings(warnings);
        setDataQuality(quality);
        setInspectionLoading(false);
    };

    const proceedWithIngestion = async () => {
        setShowInspection(false);
        setShowAnalysisMode(true);
    };

    const handleAnalysisStart = async () => {
        if (!inspectionData) return;
        setShowAnalysisMode(false);
        setShowInputPanel(false);
        setShowProgress(true);
        setCurrentStageIndex(0);

        const initialStages: ProcessingStage[] = [
            { id: 'ingest', label: 'Ingesting Data', status: 'pending' },
            { id: 'analyze', label: `Running ${selectedAnalysisMode} Analysis`, status: 'pending' },
            { id: 'correlate', label: 'Correlating Events', status: 'pending' },
            { id: 'finalize', label: 'Finalizing Results', status: 'pending' }
        ];
        setProcessingStages(initialStages);

        try {
            updateStageStatus(0, 'processing', 'Validating and parsing input...');
            await fetch('http://localhost:8000/v1/aiops/logs/ingest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inspectionData.data)
            });
            updateStageStatus(0, 'completed', 'Data ingestion successful');

            setCurrentStageIndex(1);
            updateStageStatus(1, 'processing', `Applying ${selectedAnalysisMode} algorithms...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            updateStageStatus(1, 'completed', 'Analysis complete');

            setCurrentStageIndex(2);
            updateStageStatus(2, 'processing', 'Linking related events...');
            await fetchIncidents();
            await new Promise(resolve => setTimeout(resolve, 1000));
            updateStageStatus(2, 'completed', 'Events correlated');

            setCurrentStageIndex(3);
            updateStageStatus(3, 'processing', 'Generating insights...');
            setInspectionData(null);
            await new Promise(resolve => setTimeout(resolve, 800));
            updateStageStatus(3, 'completed', 'Done!');

            setTimeout(() => {
                setShowProgress(false);
                setCurrentStageIndex(0);
            }, 500);

        } catch (error) {
            console.error('Failed to analyze data:', error);
            alert('Failed to analyze data. Please try again.');
            setShowProgress(false);
        } finally {
            setLoading(false);
        }
    };

    const cancelInspection = () => {
        setShowInspection(false);
        setInspectionData(null);
        setValidationWarnings([]);
        setDataQuality({ score: 0, issues: [], suggestions: [] });
    };

    const handleApiUrlSubmit = async () => {
        if (!apiUrl) return;
        setLoading(true);
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            setLoading(false);
            await inspectData(data, `API: ${apiUrl}`);
        } catch (error) {
            console.error('Failed to fetch from API URL:', error);
            alert('Failed to fetch data from URL. Please check the URL and try again.');
            setLoading(false);
        }
    };

    const handleNaturalLanguageSubmit = async () => {
        if (!naturalLanguage) return;
        setLoading(true);
        try {
            const logEntry = {
                timestamp: new Date().toISOString(),
                source: 'natural-language-input',
                level: 'ERROR',
                message: naturalLanguage,
                metadata: { input_type: 'natural_language' }
            };
            setLoading(false);
            await inspectData(logEntry, 'Natural Language Input');
            setNaturalLanguage('');
        } catch (error) {
            console.error('Failed to process natural language:', error);
            setLoading(false);
        }
    };

    const handleFileUpload = async () => {
        if (!selectedFile) return;
        setLoading(true);
        try {
            const text = await selectedFile.text();
            let data;
            try {
                data = selectedFile.name.endsWith('.json')
                    ? JSON.parse(text)
                    : { raw: text, timestamp: new Date().toISOString(), message: 'File content' };
            } catch (e) {
                data = { raw: text, error: 'Parse failed' };
            }
            setLoading(false);
            await inspectData(data, `File: ${selectedFile.name}`);
            setSelectedFile(null);
        } catch (error) {
            console.error('Failed to read file:', error);
            alert('Failed to read file. Please try again.');
            setLoading(false);
        }
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setMinConfidence(0);
        setSelectedService('all');
        setSeverityFilter('all');
    };

    const filteredIncidents = incidents.filter(inc => {
        if (severityFilter !== 'all' && inc.severity !== severityFilter) return false;
        if (inc.confidence < minConfidence) return false;
        if (selectedService !== 'all' && !inc.affected_services.includes(selectedService)) return false;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchesId = inc.incident_id.toLowerCase().includes(query);
            const matchesRootCause = inc.root_cause.toLowerCase().includes(query);
            const matchesRec = inc.recommendation.toLowerCase().includes(query);
            if (!matchesId && !matchesRootCause && !matchesRec) return false;
        }
        return true;
    });

    const handleExport = (format: 'json' | 'csv' | 'text') => {
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `aiops-report-${timestamp}`;
        switch (format) {
            case 'json':
                downloadJSON({ stats, incidents: filteredIncidents }, filename);
                break;
            case 'csv':
                downloadCSV(filteredIncidents, filename);
                break;
            case 'text':
                const report = generateTextReport(filteredIncidents, stats);
                const blob = new Blob([report], { type: 'text/plain' });
                const href = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = href;
                link.download = `${filename}.txt`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(href);
                break;
        }
    };

    useEffect(() => {
        fetchIncidents();
        const interval = setInterval(fetchIncidents, 30000);
        return () => clearInterval(interval);
    }, [timeWindow]);

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'critical':
                return <AlertTriangle className="w-5 h-5 text-red-500" />;
            case 'warning':
                return <AlertCircle className="w-5 h-5 text-yellow-500" />;
            default:
                return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical':
                return 'bg-red-500/10 border-red-500/20 text-red-400';
            case 'warning':
                return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400';
            default:
                return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
            <div className="max-w-7xl mx-auto mb-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent flex items-center gap-3">
                            AIOps Incident Dashboard
                            <span className="text-sm px-2 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full font-mono">v2.0</span>
                        </h1>
                        <p className="text-slate-400 mt-2">Real-time incident correlation and root cause analysis</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowDevTools(true)}
                            className="px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2 border border-slate-700"
                        >
                            <Terminal className="w-4 h-4" />
                            Dev Tools
                        </button>
                        <button
                            onClick={() => setShowInputPanel(!showInputPanel)}
                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Sparkles className="w-4 h-4" />
                            Add Data
                        </button>
                        <button
                            onClick={fetchIncidents}
                            disabled={loading}
                            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Input Panel */}
                {showInputPanel && (
                    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 mb-6">
                        <h3 className="text-xl font-semibold text-white mb-4">Choose Input Method</h3>

                        {/* Input Method Tabs */}
                        <div className="flex gap-2 mb-6">
                            {[
                                { id: 'sample', label: 'Sample Dataset', icon: Database },
                                { id: 'api', label: 'API/URL', icon: LinkIcon },
                                { id: 'natural', label: 'Natural Language', icon: MessageSquare },
                                { id: 'file', label: 'File Upload', icon: Upload }
                            ].map(method => (
                                <button
                                    key={method.id}
                                    onClick={() => setInputMethod(method.id as InputMethod)}
                                    className={`flex-1 px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${inputMethod === method.id
                                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
                                        : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                                        }`}
                                >
                                    <method.icon className="w-4 h-4" />
                                    {method.label}
                                </button>
                            ))}
                        </div>

                        {/* Input Method Content */}
                        <div className="bg-slate-900/50 rounded-lg p-6">
                            {inputMethod === 'sample' && (
                                <div>
                                    <h4 className="text-lg font-semibold text-white mb-4">Sample Incident Scenarios</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {[
                                            { name: 'Database Connection Failure', endpoint: 'database-incident', icon: '🔴' },
                                            { name: 'High CPU/Memory Usage', endpoint: 'high-cpu-incident', icon: '⚠️' },
                                            { name: 'API Latency Spike', endpoint: 'api-latency-incident', icon: '🐌' },
                                            { name: 'Random Incident', endpoint: 'random-incident', icon: '🎲' }
                                        ].map(scenario => (
                                            <button
                                                key={scenario.endpoint}
                                                onClick={async () => {
                                                    setLoading(true);
                                                    await fetch(`http://localhost:8000/v1/testing/generate/${scenario.endpoint}`, {
                                                        method: 'POST'
                                                    });
                                                    setTimeout(fetchIncidents, 500);
                                                    setShowInputPanel(false);
                                                    setLoading(false);
                                                }}
                                                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-left flex items-center gap-3"
                                            >
                                                <span className="text-2xl">{scenario.icon}</span>
                                                <span className="text-white">{scenario.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {inputMethod === 'api' && (
                                <div>
                                    <h4 className="text-lg font-semibold text-white mb-4">Fetch Data from API/URL</h4>
                                    <div className="flex gap-3">
                                        <input
                                            type="url"
                                            value={apiUrl}
                                            onChange={(e) => setApiUrl(e.target.value)}
                                            placeholder="https://api.example.com/logs"
                                            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500"
                                        />
                                        <button
                                            onClick={handleApiUrlSubmit}
                                            disabled={!apiUrl || loading}
                                            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors disabled:opacity-50"
                                        >
                                            Fetch & Inspect
                                        </button>
                                    </div>
                                </div>
                            )}

                            {inputMethod === 'natural' && (
                                <div>
                                    <h4 className="text-lg font-semibold text-white mb-4">Describe the Issue in Natural Language</h4>
                                    <textarea
                                        value={naturalLanguage}
                                        onChange={(e) => setNaturalLanguage(e.target.value)}
                                        placeholder="Example: Our API server is experiencing high latency and database connection timeouts..."
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 min-h-[120px] resize-none"
                                    />
                                    <button
                                        onClick={handleNaturalLanguageSubmit}
                                        disabled={!naturalLanguage || loading}
                                        className="mt-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        <Sparkles className="w-4 h-4 inline mr-2" />
                                        Process & Inspect
                                    </button>
                                </div>
                            )}

                            {inputMethod === 'file' && (
                                <div>
                                    <h4 className="text-lg font-semibold text-white mb-4">Upload Log/Metric File</h4>
                                    <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center">
                                        <input
                                            type="file"
                                            accept=".json,.csv,.txt"
                                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                            className="hidden"
                                            id="file-upload"
                                        />
                                        <label htmlFor="file-upload" className="cursor-pointer">
                                            <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                                            <p className="text-white mb-2">
                                                {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                                            </p>
                                        </label>
                                    </div>
                                    {selectedFile && (
                                        <button
                                            onClick={handleFileUpload}
                                            disabled={loading}
                                            className="mt-4 w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors disabled:opacity-50"
                                        >
                                            <FileJson className="w-4 h-4 inline mr-2" />
                                            Inspect & Upload
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Total Incidents</p>
                                <p className="text-3xl font-bold text-white mt-1">{stats.totalIncidents}</p>
                            </div>
                            <AlertTriangle className="w-10 h-10 text-red-400 opacity-50" />
                        </div>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Noise Reduction</p>
                                <p className="text-3xl font-bold text-green-400 mt-1">{stats.noiseReduction}</p>
                            </div>
                            <TrendingDown className="w-10 h-10 text-green-400 opacity-50" />
                        </div>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Avg Confidence</p>
                                <p className="text-3xl font-bold text-cyan-400 mt-1">{stats.avgConfidence}%</p>
                            </div>
                            <Clock className="w-10 h-10 text-cyan-400 opacity-50" />
                        </div>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Total Events</p>
                                <p className="text-3xl font-bold text-purple-400 mt-1">{stats.totalEvents}</p>
                            </div>
                            <Server className="w-10 h-10 text-purple-400 opacity-50" />
                        </div>
                    </div>
                </div>

                {/* Filters & Export Toolbar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <select
                                value={timeWindow}
                                onChange={(e) => setTimeWindow(parseInt(e.target.value))}
                                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            >
                                <option value={5}>Last 5m</option>
                                <option value={15}>Last 15m</option>
                                <option value={30}>Last 30m</option>
                                <option value={60}>Last 1h</option>
                            </select>
                        </div>

                        <div className="h-6 w-px bg-slate-700 mx-2 hidden md:block" />

                        <div className="flex items-center gap-2">
                            <span className="text-slate-400 text-sm hidden md:inline">Severity:</span>
                            {['all', 'critical', 'warning', 'info'].map(sev => (
                                <button
                                    key={sev}
                                    onClick={() => setSeverityFilter(sev)}
                                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${severityFilter === sev
                                        ? 'bg-cyan-600 text-white'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                        }`}
                                >
                                    {sev.charAt(0).toUpperCase() + sev.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <ExportMenu
                        onExport={handleExport}
                        viewMode={viewMode}
                        onViewChange={setViewMode}
                    />
                </div>

                {/* Advanced Filters */}
                <div className="mb-6">
                    <AdvancedFilters
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        minConfidence={minConfidence}
                        onConfidenceChange={setMinConfidence}
                        selectedService={selectedService}
                        onServiceChange={setSelectedService}
                        availableServices={availableServices}
                        onClear={handleClearFilters}
                    />
                </div>

                {/* Incidents View */}
                <div className="space-y-4">
                    {loading && !showProgress ? (
                        <div className="text-center py-12">
                            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-cyan-400 mb-4" />
                            <p className="text-slate-400">Loading incidents...</p>
                        </div>
                    ) : filteredIncidents.length === 0 ? (
                        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-12 text-center">
                            <Info className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                            <p className="text-slate-400 text-lg">No incidents found using current filters</p>
                            <p className="text-slate-500 text-sm mt-2">Try adjusting your filters or click "Add Data"</p>
                        </div>
                    ) : (
                        <>
                            {viewMode === 'list' && (
                                <div className="space-y-4">
                                    {filteredIncidents.map((incident) => (
                                        <div
                                            key={incident.incident_id}
                                            onClick={() => setSelectedIncident(incident)}
                                            className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 cursor-pointer transition-all hover:bg-slate-800/70 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 group animate-in fade-in slide-in-from-bottom-2 duration-300"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-4 flex-1">
                                                    <div className={`p-3 rounded-xl transition-colors ${incident.severity === 'critical' ? 'bg-red-500/10 text-red-500 group-hover:bg-red-500/20' :
                                                        incident.severity === 'warning' ? 'bg-yellow-500/10 text-yellow-500 group-hover:bg-yellow-500/20' :
                                                            'bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/20'
                                                        }`}>
                                                        {getSeverityIcon(incident.severity)}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
                                                                {incident.incident_id}
                                                            </h3>
                                                            <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getSeverityColor(incident.severity)}`}>
                                                                {incident.severity.toUpperCase()}
                                                            </span>
                                                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                {incident.time_window || '15m'}
                                                            </span>
                                                        </div>
                                                        <p className="text-slate-300 mb-3 line-clamp-1 group-hover:text-white transition-colors">{incident.root_cause}</p>
                                                        <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
                                                            <span className="flex items-center gap-1 bg-slate-900/50 px-2 py-1 rounded">
                                                                <AlertTriangle className="w-3 h-3" />
                                                                {incident.related_alerts}
                                                            </span>
                                                            <span className="flex items-center gap-1 bg-slate-900/50 px-2 py-1 rounded">
                                                                <FileJson className="w-3 h-3" />
                                                                {incident.related_logs}
                                                            </span>
                                                            <span className="flex items-center gap-1 bg-slate-900/50 px-2 py-1 rounded">
                                                                <Activity className="w-3 h-3" />
                                                                {incident.related_metrics}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full transition-all duration-500 ${incident.confidence > 80 ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'bg-yellow-400'}`}
                                                                style={{ width: `${incident.confidence}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-300">{incident.confidence}%</span>
                                                    </div>
                                                    <span className="text-xs text-slate-500">Confidence</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {viewMode === 'table' && (
                                <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm text-slate-400">
                                            <thead className="bg-slate-900/50 text-slate-200 uppercase font-medium">
                                                <tr>
                                                    <th className="px-6 py-4">Severity</th>
                                                    <th className="px-6 py-4">ID</th>
                                                    <th className="px-6 py-4">Root Cause</th>
                                                    <th className="px-6 py-4">Confidence</th>
                                                    <th className="px-6 py-4">Services</th>
                                                    <th className="px-6 py-4">Evidence</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-700/50">
                                                {filteredIncidents.map((incident) => (
                                                    <tr
                                                        key={incident.incident_id}
                                                        onClick={() => setSelectedIncident(incident)}
                                                        className={`hover:bg-slate-700/30 cursor-pointer transition-colors ${selectedIncident?.incident_id === incident.incident_id ? 'bg-slate-700/30' : ''
                                                            }`}
                                                    >
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(incident.severity)}`}>
                                                                {incident.severity.toUpperCase()}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 font-medium text-white">
                                                            {incident.incident_id}
                                                        </td>
                                                        <td className="px-6 py-4 text-slate-300 max-w-xs truncate" title={incident.root_cause}>
                                                            {incident.root_cause}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                                                    <div
                                                                        className="h-full bg-cyan-400 rounded-full"
                                                                        style={{ width: `${incident.confidence}%` }}
                                                                    />
                                                                </div>
                                                                <span className="text-xs">{incident.confidence}%</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {incident.affected_services.join(', ')}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {incident.related_alerts + incident.related_logs + incident.related_metrics} items
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {viewMode === 'json' && (
                                <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 overflow-auto max-h-[600px]">
                                    <pre className="text-sm font-mono text-cyan-300">
                                        {JSON.stringify(filteredIncidents, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Modals */}
            {showInspection && (
                <DataInspection
                    inspectionData={inspectionData}
                    validationWarnings={validationWarnings}
                    dataQuality={dataQuality}
                    loading={inspectionLoading}
                    onProceed={proceedWithIngestion}
                    onCancel={cancelInspection}
                />
            )}

            {showAnalysisMode && (
                <AnalysisModeSelection
                    selectedMode={selectedAnalysisMode}
                    onSelectMode={setSelectedAnalysisMode}
                    onProceed={handleAnalysisStart}
                    onCancel={() => setShowAnalysisMode(false)}
                />
            )}

            {showProgress && (
                <ProgressModal
                    isVisible={showProgress}
                    stages={processingStages}
                    currentStageIndex={currentStageIndex}
                    analysisMode={selectedAnalysisMode}
                />
            )}

            {showDevTools && (
                <DeveloperTools
                    isOpen={showDevTools}
                    onClose={() => setShowDevTools(false)}
                    currentIncidentId={selectedIncident?.incident_id}
                />
            )}

            {selectedIncident && (
                <IncidentDeepDive
                    incident={selectedIncident}
                    onClose={() => setSelectedIncident(null)}
                />
            )}
        </div>
    );
}
