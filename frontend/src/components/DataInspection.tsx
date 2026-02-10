import { AlertTriangle, CheckCircle, XCircle, Info, Eye, TrendingUp, FileText } from 'lucide-react';

interface InspectionData {
    source: string;
    data: any;
    recordCount: number;
    preview: any;
    fields: string[];
}

interface DataQuality {
    score: number;
    issues: string[];
    suggestions: string[];
}

interface DataInspectionProps {
    inspectionData: InspectionData | null;
    validationWarnings: string[];
    dataQuality: DataQuality;
    loading: boolean;
    onProceed: () => void;
    onCancel: () => void;
}

export default function DataInspection({
    inspectionData,
    validationWarnings,
    dataQuality,
    loading,
    onProceed,
    onCancel
}: DataInspectionProps) {
    if (!inspectionData) return null;

    const getQualityColor = (score: number) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getQualityLabel = (score: number) => {
        if (score >= 80) return 'Excellent';
        if (score >= 60) return 'Good';
        if (score >= 40) return 'Fair';
        return 'Poor';
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <Eye className="w-7 h-7 text-cyan-400" />
                                Data Inspection
                            </h2>
                            <p className="text-slate-400 mt-1">Review and validate data before processing</p>
                        </div>
                        <button
                            onClick={onCancel}
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            <XCircle className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Source Info */}
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Data Source</p>
                                <p className="text-white font-semibold mt-1">{inspectionData.source}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-slate-400 text-sm">Records</p>
                                <p className="text-white font-semibold mt-1">{inspectionData.recordCount}</p>
                            </div>
                        </div>
                    </div>

                    {/* Data Quality Score */}
                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-6 border border-slate-700">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-cyan-400" />
                                Data Quality Score
                            </h3>
                            <div className="text-right">
                                <p className={`text-3xl font-bold ${getQualityColor(dataQuality.score)}`}>
                                    {dataQuality.score}%
                                </p>
                                <p className="text-slate-400 text-sm">{getQualityLabel(dataQuality.score)}</p>
                            </div>
                        </div>

                        {/* Quality Progress Bar */}
                        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                            <div
                                className={`h-full transition-all duration-500 ${dataQuality.score >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                                        dataQuality.score >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                                            'bg-gradient-to-r from-red-500 to-rose-500'
                                    }`}
                                style={{ width: `${dataQuality.score}%` }}
                            />
                        </div>
                    </div>

                    {/* Validation Warnings */}
                    {validationWarnings.length > 0 && (
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                            <h3 className="text-lg font-semibold text-yellow-400 flex items-center gap-2 mb-3">
                                <AlertTriangle className="w-5 h-5" />
                                Validation Warnings ({validationWarnings.length})
                            </h3>
                            <ul className="space-y-2">
                                {validationWarnings.map((warning, index) => (
                                    <li key={index} className="text-yellow-300 text-sm flex items-start gap-2">
                                        <span className="text-yellow-500 mt-0.5">•</span>
                                        {warning}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Issues */}
                    {dataQuality.issues.length > 0 && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                            <h3 className="text-lg font-semibold text-red-400 flex items-center gap-2 mb-3">
                                <XCircle className="w-5 h-5" />
                                Issues Found ({dataQuality.issues.length})
                            </h3>
                            <ul className="space-y-2">
                                {dataQuality.issues.map((issue, index) => (
                                    <li key={index} className="text-red-300 text-sm flex items-start gap-2">
                                        <span className="text-red-500 mt-0.5">•</span>
                                        {issue}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Suggestions */}
                    {dataQuality.suggestions.length > 0 && (
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                            <h3 className="text-lg font-semibold text-blue-400 flex items-center gap-2 mb-3">
                                <Info className="w-5 h-5" />
                                Suggestions ({dataQuality.suggestions.length})
                            </h3>
                            <ul className="space-y-2">
                                {dataQuality.suggestions.map((suggestion, index) => (
                                    <li key={index} className="text-blue-300 text-sm flex items-start gap-2">
                                        <span className="text-blue-500 mt-0.5">•</span>
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Field Detection */}
                    {inspectionData.fields.length > 0 && (
                        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-3">
                                <FileText className="w-5 h-5 text-cyan-400" />
                                Detected Fields ({inspectionData.fields.length})
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {inspectionData.fields.map((field, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-slate-700 text-slate-300 rounded-lg text-sm font-mono"
                                    >
                                        {field}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Data Preview */}
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                        <h3 className="text-lg font-semibold text-white mb-3">Data Preview</h3>
                        <div className="bg-slate-900 rounded-lg p-4 max-h-64 overflow-auto">
                            <pre className="text-slate-300 text-sm font-mono whitespace-pre-wrap">
                                {JSON.stringify(inspectionData.preview, null, 2)}
                            </pre>
                        </div>
                        {inspectionData.recordCount > 5 && (
                            <p className="text-slate-400 text-sm mt-2">
                                Showing first 5 of {inspectionData.recordCount} records
                            </p>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-slate-700 bg-slate-900/50">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-400">
                            {dataQuality.score >= 60 ? (
                                <span className="flex items-center gap-2 text-green-400">
                                    <CheckCircle className="w-4 h-4" />
                                    Data quality is acceptable
                                </span>
                            ) : (
                                <span className="flex items-center gap-2 text-yellow-400">
                                    <AlertTriangle className="w-4 h-4" />
                                    Consider fixing issues before proceeding
                                </span>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={onCancel}
                                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onProceed}
                                disabled={loading || dataQuality.score < 20}
                                className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-lg transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-4 h-4" />
                                        Proceed with Ingestion
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
