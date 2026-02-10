import { Check, Clock, Sparkles } from 'lucide-react';
import { ANALYSIS_MODES, AnalysisMode, AnalysisModeConfig } from '@/config/analysisModes';

interface AnalysisModeSelectionProps {
    selectedMode: AnalysisMode;
    onSelectMode: (mode: AnalysisMode) => void;
    onProceed: () => void;
    onCancel: () => void;
}

export default function AnalysisModeSelection({
    selectedMode,
    onSelectMode,
    onProceed,
    onCancel
}: AnalysisModeSelectionProps) {
    const selectedModeConfig = ANALYSIS_MODES.find(m => m.id === selectedMode);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-slate-700 bg-gradient-to-r from-slate-900 to-slate-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                                <Sparkles className="w-8 h-8 text-cyan-400" />
                                Choose Analysis Mode
                            </h2>
                            <p className="text-slate-400 mt-2">
                                Select how you want to analyze your data for maximum insights
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {ANALYSIS_MODES.map((mode) => {
                            const Icon = mode.icon;
                            const isSelected = selectedMode === mode.id;

                            return (
                                <button
                                    key={mode.id}
                                    onClick={() => onSelectMode(mode.id)}
                                    className={`relative group text-left p-6 rounded-xl border-2 transition-all duration-300 ${isSelected
                                            ? 'border-cyan-500 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 shadow-lg shadow-cyan-500/20'
                                            : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800'
                                        }`}
                                >
                                    {/* Selection Indicator */}
                                    {isSelected && (
                                        <div className="absolute top-3 right-3">
                                            <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Icon */}
                                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${mode.color} p-2.5 mb-4`}>
                                        <Icon className="w-full h-full text-white" />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg font-bold text-white mb-2 pr-8">
                                        {mode.name}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                                        {mode.description}
                                    </p>

                                    {/* Features */}
                                    <div className="space-y-1.5 mb-4">
                                        {mode.features.slice(0, 3).map((feature, index) => (
                                            <div key={index} className="flex items-start gap-2 text-xs text-slate-500">
                                                <span className="text-cyan-400 mt-0.5">•</span>
                                                <span className="line-clamp-1">{feature}</span>
                                            </div>
                                        ))}
                                        {mode.features.length > 3 && (
                                            <div className="text-xs text-slate-600">
                                                +{mode.features.length - 3} more features
                                            </div>
                                        )}
                                    </div>

                                    {/* Estimated Time */}
                                    <div className="flex items-center gap-2 text-xs text-slate-500 pt-3 border-t border-slate-700/50">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>{mode.estimatedTime}</span>
                                    </div>

                                    {/* Hover Effect */}
                                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${mode.color} opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none`} />
                                </button>
                            );
                        })}
                    </div>

                    {/* Selected Mode Details */}
                    {selectedModeConfig && (
                        <div className="mt-6 p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700">
                            <div className="flex items-start gap-4">
                                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${selectedModeConfig.color} p-3 flex-shrink-0`}>
                                    <selectedModeConfig.icon className="w-full h-full text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-white mb-2">
                                        {selectedModeConfig.name}
                                    </h3>
                                    <p className="text-slate-300 mb-4">
                                        {selectedModeConfig.description}
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-400 mb-2">Features:</p>
                                            <ul className="space-y-1">
                                                {selectedModeConfig.features.map((feature, index) => (
                                                    <li key={index} className="flex items-start gap-2 text-sm text-slate-300">
                                                        <Check className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                                                        <span>{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-400 mb-2">Analysis Details:</p>
                                            <div className="space-y-2 text-sm text-slate-300">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-cyan-400" />
                                                    <span>Estimated time: {selectedModeConfig.estimatedTime}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Sparkles className="w-4 h-4 text-cyan-400" />
                                                    <span>AI-powered analysis</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-700 bg-slate-900/50">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-400">
                            {selectedModeConfig ? (
                                <span className="flex items-center gap-2 text-cyan-400">
                                    <Check className="w-4 h-4" />
                                    {selectedModeConfig.name} selected
                                </span>
                            ) : (
                                <span>Select an analysis mode to continue</span>
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
                                disabled={!selectedMode}
                                className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-lg transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Sparkles className="w-4 h-4" />
                                Start Analysis
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
