"use client";

import React from "react";
import { FileText, Code, Sparkles, Layers, CheckCircle2 } from "lucide-react";

const OUTPUT_FORMATS = [
    { id: 4, name: "Raw Data Output", desc: "Clean structured JSON/CSV", icon: Code },
    { id: 2, name: "Detailed Report", desc: "Full structured analysis of changes", icon: FileText },
    { id: 5, name: "AI-EXPLAIN MODE", desc: "Output + explanation of reasoning", icon: Sparkles },
] as const;

interface OutputFormatSelectorProps {
    selectedFormats: number[];
    onToggleFormat: (formatId: number) => void;
}

export default function OutputFormatSelector({ selectedFormats, onToggleFormat }: OutputFormatSelectorProps) {
    return (
        <div className="mt-6 border-t border-gray-200 dark:border-white/10 pt-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-500" />
                Choose Output Format(s)
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {OUTPUT_FORMATS.map((format) => {
                    const Icon = format.icon;
                    const isSelected = selectedFormats.includes(format.id);

                    return (
                        <button
                            key={format.id}
                            onClick={() => onToggleFormat(format.id)}
                            className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all duration-200 ${isSelected
                                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-500'
                                : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-700'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center ${isSelected
                                    ? 'bg-blue-500 border-blue-500'
                                    : 'border-gray-300 dark:border-gray-600'
                                    }`}>
                                    {isSelected && (
                                        <CheckCircle2 className="w-3 h-3 text-white" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
                                        <span className={`text-sm font-medium ${isSelected ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}>
                                            {format.name}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{format.desc}</p>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                💡 Tip: Raw Data is selected by default. Add Report or Explanation for more details.
            </p>
        </div>
    );
}
