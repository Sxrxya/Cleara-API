import { Check, Loader2, Circle, CheckCircle2 } from 'lucide-react';
import { AnalysisMode, getAnalysisModeColor } from '@/config/analysisModes';

export interface ProcessingStage {
    id: string;
    label: string;
    status: 'pending' | 'processing' | 'completed';
    details?: string;
}

interface ProgressModalProps {
    isVisible: boolean;
    stages: ProcessingStage[];
    currentStageIndex: number;
    analysisMode: AnalysisMode;
}

export default function ProgressModal({
    isVisible,
    stages,
    currentStageIndex,
    analysisMode
}: ProgressModalProps) {
    if (!isVisible) return null;

    const modeColor = getAnalysisModeColor(analysisMode);
    const progressPercentage = Math.round(((currentStageIndex) / stages.length) * 100);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 transition-all duration-300">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-slate-800 bg-slate-900/50">
                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                        <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
                        Analyzing Data
                    </h2>
                    <p className="text-slate-400 mt-1 text-sm">
                        Please wait while we process your data using the <span className="text-cyan-400 font-medium">{analysisMode}</span> engine.
                    </p>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8">
                    {/* Progress Bar */}
                    <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                            <div>
                                <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-cyan-500/10 text-cyan-400`}>
                                    Progress
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-semibold inline-block text-cyan-400">
                                    {progressPercentage}%
                                </span>
                            </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-800">
                            <div
                                style={{ width: `${progressPercentage}%` }}
                                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r ${modeColor} transition-all duration-500 ease-out`}
                            ></div>
                        </div>
                    </div>

                    {/* Stages List */}
                    <div className="space-y-6">
                        {stages.map((stage, index) => {
                            const isCompleted = stage.status === 'completed';
                            const isProcessing = stage.status === 'processing';
                            const isPending = stage.status === 'pending';

                            return (
                                <div key={stage.id} className="relative flex items-start group">
                                    {/* Connector Line */}
                                    {index !== stages.length - 1 && (
                                        <div
                                            className={`absolute left-3 top-8 w-0.5 h-full -mb-2 ${isCompleted ? 'bg-cyan-500/50' : 'bg-slate-800'
                                                }`}
                                        />
                                    )}

                                    {/* Icon */}
                                    <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 mr-4 z-10 bg-slate-900 ${isCompleted
                                            ? 'border-cyan-500 bg-cyan-500 text-white'
                                            : isProcessing
                                                ? 'border-cyan-400 text-cyan-400'
                                                : 'border-slate-700 text-slate-700'
                                        }`}>
                                        {isCompleted ? (
                                            <Check className="w-3.5 h-3.5" />
                                        ) : isProcessing ? (
                                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                                        ) : (
                                            <Circle className="w-2 h-2 fill-current" />
                                        )}
                                    </div>

                                    {/* Text */}
                                    <div className="flex-1 pt-0.5">
                                        <h3 className={`text-sm font-medium ${isCompleted ? 'text-white' : isProcessing ? 'text-cyan-400' : 'text-slate-500'
                                            }`}>
                                            {stage.label}
                                        </h3>
                                        {stage.details && (isProcessing || isCompleted) && (
                                            <p className={`text-xs mt-1 ${isProcessing ? 'text-slate-300 animate-pulse' : 'text-slate-500'}`}>
                                                {stage.details}
                                            </p>
                                        )}
                                    </div>

                                    {/* Processing Status Indicator */}
                                    {isProcessing && (
                                        <Loader2 className="w-4 h-4 text-cyan-500 animate-spin ml-2" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-slate-800/30 border-t border-slate-800 text-center">
                    <p className="text-xs text-slate-500">
                        Estimated time remaining: <span className="text-slate-300">{
                            currentStageIndex < stages.length ? `${(stages.length - currentStageIndex) * 2} seconds` : 'Finishing up...'
                        }</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
