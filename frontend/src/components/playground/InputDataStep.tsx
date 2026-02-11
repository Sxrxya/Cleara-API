"use client";

import React, { useState } from "react";
import { Code, Upload, FileText, X, Play } from "lucide-react";
import OutputFormatSelector from "@/components/OutputFormatSelector";

interface InputDataStepProps {
    onStartProcessing: (data: string, formats: number[]) => void;
}

export default function InputDataStep({ onStartProcessing }: InputDataStepProps) {
    const [inputMode, setInputMode] = useState<"json" | "file">("json");
    const [input, setInput] = useState(JSON.stringify([
        { "name": "  john DOE  ", "email": "john@gmial.com", "phone": "1234567890" },
        { "name": "JANE SMITH", "email": "jane@tech.co", "city": "London" }
    ], null, 2));
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedFormats, setSelectedFormats] = useState<number[]>([4]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target?.result as string;
                setInput(content);
            };
            reader.readAsText(file);
        }
    };

    const clearFile = () => {
        setSelectedFile(null);
        setInput(JSON.stringify([
            { "name": "  john DOE  ", "email": "john@gmial.com", "phone": "1234567890" },
            { "name": "JANE SMITH", "email": "jane@tech.co", "city": "London" }
        ], null, 2));
    };

    const toggleFormat = (formatId: number) => {
        setSelectedFormats(prev => {
            if (prev.includes(formatId)) {
                const newFormats = prev.filter(id => id !== formatId);
                // Ensure at least one format is selected, default to Raw Data (4)
                return newFormats.length > 0 ? newFormats : [4];
            } else {
                return [...prev, formatId];
            }
        });
    };

    const handleSubmit = () => {
        if (input.trim()) {
            onStartProcessing(input, selectedFormats);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-white/5 p-8">
                {/* Title */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Input Your Data
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Paste JSON data or upload a file to get started with AI-powered cleaning
                    </p>
                </div>

                {/* Mode Toggle */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Code className="w-5 h-5 text-blue-500" />
                        Input Data
                    </h3>
                    <div className="flex gap-2 bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
                        <button
                            onClick={() => setInputMode("json")}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${inputMode === "json"
                                ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                }`}
                        >
                            JSON
                        </button>
                        <button
                            onClick={() => setInputMode("file")}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${inputMode === "file"
                                ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                }`}
                        >
                            File
                        </button>
                    </div>
                </div>

                {/* Input Area */}
                {inputMode === "json" ? (
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full h-64 font-mono text-sm bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 p-4 rounded-lg border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder='[ { "key": "value" } ]'
                    />
                ) : (
                    <div className="space-y-4">
                        <div className="h-64 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex flex-col items-center justify-center p-6 hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer relative">
                            <input
                                type="file"
                                onChange={handleFileSelect}
                                accept=".txt,.csv,.json,.xml,.pdf,.xlsx,.xls"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            {selectedFile ? (
                                <div className="text-center">
                                    <FileText className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                        {selectedFile.name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {(selectedFile.size / 1024).toFixed(2)} KB
                                    </p>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            clearFile();
                                        }}
                                        className="mt-3 px-3 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <Upload className="w-12 h-12 text-gray-400 mb-3" />
                                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                        Drop file here or click to upload
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Supports: TXT, CSV, JSON, PDF, Excel
                                    </p>
                                </>
                            )}
                        </div>
                        {selectedFile && (
                            <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4 max-h-32 overflow-auto">
                                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Preview:</p>
                                <pre className="text-xs text-gray-900 dark:text-gray-100 font-mono whitespace-pre-wrap">
                                    {input.substring(0, 300)}
                                    {input.length > 300 && "..."}
                                </pre>
                            </div>
                        )}
                    </div>
                )}

                {/* Output Format Selection */}
                <OutputFormatSelector
                    selectedFormats={selectedFormats}
                    onToggleFormat={toggleFormat}
                />

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    disabled={!input.trim()}
                    className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                >
                    <Play className="w-5 h-5" />
                    Start Processing
                </button>
            </div>
        </div>
    );
}
