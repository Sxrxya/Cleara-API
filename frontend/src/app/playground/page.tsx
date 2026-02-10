"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Play, Code, CheckCircle2, RefreshCw, Layers, Database, Shield, Zap, Upload, FileText, X } from "lucide-react";

const WORKFLOW_STEPS = [
    { id: 1, name: "API Gateway", icon: Shield, color: "blue" },
    { id: 2, name: "Preprocessing", icon: Layers, color: "indigo" },
    { id: 3, name: "Schema Detect", icon: Database, color: "purple" },
    { id: 4, name: "Cleaning", icon: Zap, color: "yellow" },
    { id: 5, name: "AI Validation", icon: Sparkles, color: "blue" },
    { id: 6, name: "Deduplication", icon: RefreshCw, color: "green" },
    { id: 7, name: "Enrichment", icon: Database, color: "pink" },
];

export default function PlaygroundPage() {
    const [inputMode, setInputMode] = useState<"json" | "file">("json");
    const [input, setInput] = useState(JSON.stringify([
        { "name": "  john DOE  ", "email": "john@gmial.com", "phone": "1234567890" },
        { "name": "JANE SMITH", "email": "jane@tech.co", "city": "London" }
    ], null, 2));

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [output, setOutput] = useState("");
    const [isCleaning, setIsCleaning] = useState(false);
    const [activeStep, setActiveStep] = useState(0);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);

            // Read file content for preview
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

    const startCleaning = async () => {
        setIsCleaning(true);
        setActiveStep(1);
        setOutput(""); // Clear previous output

        // 1. Prepare Data
        let payloadData;
        try {
            payloadData = JSON.parse(input);
            // If it's an array, wrap it in an object because backend expects Dict
            if (Array.isArray(payloadData)) {
                payloadData = { records: payloadData };
            }
        } catch (e) {
            // If not JSON, send as raw text
            payloadData = { raw_content: input };
        }

        // 2. Start Animation & Fetch in Parallel
        const startTime = Date.now();
        const minAnimationTime = 3000; // Force at least 3s of animation for effect

        // Animation Loop
        let currentStep = 1;
        const animationInterval = setInterval(() => {
            currentStep = currentStep < 7 ? currentStep + 1 : 7;
            setActiveStep(currentStep);
        }, 500);

        try {
            // Real Backend Call
            const response = await fetch('http://localhost:8000/v1/ai/clean', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: payloadData,
                    instructions: "Clean, normalize, and extract structured data from this input. If it's raw text, try to identity entities. If it's JSON, standardize fields."
                }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || 'Processing failed');
            }

            const data = await response.json();

            // Wait for animation to finish minimum time
            const elapsed = Date.now() - startTime;
            if (elapsed < minAnimationTime) {
                await new Promise(r => setTimeout(r, minAnimationTime - elapsed));
            }

            clearInterval(animationInterval);
            setActiveStep(7); // Complete
            setIsCleaning(false);

            // Format Output
            const resultData = data.cleaned_data?.records || data.cleaned_data || data;
            setOutput(JSON.stringify(resultData, null, 2));

        } catch (error: any) {
            clearInterval(animationInterval);
            setIsCleaning(false);
            setActiveStep(0); // Reset or show error state
            setOutput(JSON.stringify({
                error: "AI Processing Failed",
                details: error.message,
                hint: "Ensure Backend is running on port 8000"
            }, null, 2));
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617] p-2 md:p-6 flex flex-col gap-6">
            {/* Header */}
            <header className="flex items-center justify-between px-4 pb-2 border-b border-gray-200 dark:border-white/5">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Workflow Playground</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Test the Gemini-Groq Hybrid engine live</p>
                    </div>
                </div>
                <Link href="/dashboard" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                    Back to Dashboard
                </Link>
            </header>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Input Panel */}
                <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-white/5 p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Code className="w-5 h-5 text-blue-500" />
                            Input Data
                        </h2>

                        {/* Mode Toggle */}
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

                    {inputMode === "json" ? (
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 font-mono text-sm bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 p-4 rounded-lg border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            placeholder='[ { "key": "value" } ]'
                        />
                    ) : (
                        <div className="flex-1 flex flex-col gap-4">
                            {/* File Upload Area */}
                            <div className="flex-1 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex flex-col items-center justify-center p-6 hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer relative">
                                <input
                                    type="file"
                                    onChange={handleFileSelect}
                                    accept=".txt,.csv,.json,.xml,.pdf,.xlsx,.xls,.jpg,.png,.gif"
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
                                            Supports: TXT, CSV, JSON, PDF, Excel, Images
                                        </p>
                                    </>
                                )}
                            </div>

                            {/* File Preview */}
                            {selectedFile && (
                                <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4 max-h-48 overflow-auto">
                                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Preview:</p>
                                    <pre className="text-xs text-gray-900 dark:text-gray-100 font-mono whitespace-pre-wrap">
                                        {input.substring(0, 500)}
                                        {input.length > 500 && "..."}
                                    </pre>
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        onClick={startCleaning}
                        disabled={isCleaning}
                        className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                    >
                        {isCleaning ? (
                            <>
                                <RefreshCw className="w-5 h-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Play className="w-5 h-5" />
                                Run Workflow
                            </>
                        )}
                    </button>
                </div>

                {/* Workflow Visualization */}
                <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-white/5 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">9-Step Processing Logic</h2>
                    <div className="space-y-3">
                        {WORKFLOW_STEPS.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = activeStep === step.id;
                            const isComplete = activeStep > step.id;

                            return (
                                <div
                                    key={step.id}
                                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${isActive
                                        ? "bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 scale-105"
                                        : isComplete
                                            ? "bg-green-50 dark:bg-green-900/20 border border-green-500/30"
                                            : "bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/5"
                                        }`}
                                >
                                    <div
                                        className={`p-2 rounded-lg ${isActive
                                            ? "bg-blue-500 animate-pulse"
                                            : isComplete
                                                ? "bg-green-500"
                                                : "bg-gray-300 dark:bg-gray-700"
                                            }`}
                                    >
                                        {isComplete ? (
                                            <CheckCircle2 className="w-5 h-5 text-white" />
                                        ) : (
                                            <Icon className="w-5 h-5 text-white" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`font-medium ${isActive || isComplete ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}>
                                            {step.name}
                                        </p>
                                    </div>
                                    {isActive && (
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Output Panel */}
                <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-white/5 p-6 flex flex-col">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        Cleaned Result
                    </h2>
                    <div className="flex-1 font-mono text-sm bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 p-4 rounded-lg border border-gray-200 dark:border-white/10 overflow-auto">
                        {output ? (
                            <pre className="whitespace-pre-wrap">{output}</pre>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-600">
                                <div className="text-center">
                                    <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p className="text-sm">Click &quot;Run Workflow&quot; to see the magic</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Model: Cleara-Hybrid (Gemini-Flash 1.5)</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">Speed: 347ms | Provider: Groq LPU</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                    <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">AI Online</h3>
                    <p className="text-sm text-purple-700 dark:text-purple-300">All systems operational</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">File Support</h3>
                    <p className="text-sm text-green-700 dark:text-green-300">JSON, CSV, TXT, PDF, Excel, Images</p>
                </div>
            </div>
        </div>
    );
}
