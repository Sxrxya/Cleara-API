"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    Sparkles, Upload, Image as ImageIcon, FileText, Link as LinkIcon,
    Cpu, Zap, Brain, BarChart3, Table, FileDown, List, MessageSquare,
    FileCheck, Code, ChevronRight, Layers, Check, Loader2
} from "lucide-react";

const INPUT_TYPES = [
    { id: "text", name: "Text", icon: MessageSquare, description: "Questions, documents, logs" },
    { id: "image", name: "Image", icon: ImageIcon, description: "Photos, scans, screenshots" },
    { id: "file", name: "File", icon: FileText, description: "PDF, CSV, Excel" },
    { id: "url", name: "URL", icon: LinkIcon, description: "Web content, APIs" },
];

const OUTPUT_FORMATS = [
    { id: "json", name: "JSON", icon: Code, description: "Developer-friendly data" },
    { id: "dashboard", name: "Dashboard", icon: BarChart3, description: "Widgets & charts" },
    { id: "visualization", name: "Charts", icon: BarChart3, description: "Visual data" },
    { id: "table", name: "Table", icon: Table, description: "Tabular format" },
    { id: "summary", name: "Summary", icon: MessageSquare, description: "Natural language" },
    { id: "report", name: "Report", icon: FileCheck, description: "Detailed analysis" },
    { id: "insights", name: "Insights", icon: Sparkles, description: "Key findings" },
    { id: "pdf", name: "PDF", icon: FileDown, description: "Export ready" },
    { id: "api_structured", name: "API Data", icon: Code, description: "For integrations" },
    { id: "recommendations", name: "Actions", icon: List, description: "Recommendations" },
];

const AI_MODELS = [
    { name: "Groq LLaMA-3.1", speed: "50ms", use: "Ultra-fast text", color: "blue" },
    { name: "Gemini 1.5 Flash", speed: "200ms", use: "Deep reasoning", color: "purple" },
    { name: "HuggingFace", speed: "100ms", use: "Specialized tasks", color: "green" },
];

export default function IntelligencePage() {
    const [selectedInputs, setSelectedInputs] = useState<string[]>(["text"]);
    const [selectedOutput, setSelectedOutput] = useState("dashboard");
    const [textInput, setTextInput] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeModel, setActiveModel] = useState<string | null>(null);
    const [result, setResult] = useState<any>(null);

    const toggleInput = (id: string) => {
        setSelectedInputs(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const simulateProcessing = async () => {
        setIsProcessing(true);
        setResult(null);

        // Simulate model processing
        const models = ["Groq LLaMA-3.1", "Gemini 1.5 Flash", "HuggingFace"];
        for (let i = 0; i < models.length; i++) {
            setActiveModel(models[i]);
            await new Promise(resolve => setTimeout(resolve, 800));
        }

        setActiveModel(null);

        // Simulate result
        setResult({
            format: selectedOutput,
            data: {
                summary: "Analysis completed successfully using hybrid AI processing.",
                confidence: 0.94,
                models_used: ["Groq", "Gemini", "HuggingFace"],
                latency_ms: 580
            }
        });

        setIsProcessing(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-[#020617] dark:via-[#0f172a] dark:to-[#1e1b4b]">

            {/* Header */}
            <header className="border-b border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                            <Layers className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">Cleara Intelligence</h1>
                            <p className="text-xs text-gray-500">Universal AI Layer</p>
                        </div>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600">Dashboard</Link>
                        <Link href="/playground" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600">Playground</Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">

                {/* Hero Section */}
                <div className="text-center space-y-4 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-sm font-medium text-indigo-600 dark:text-indigo-400">
                        <Sparkles className="w-4 h-4" />
                        Multi-Input • Hybrid AI • Multi-Output
                    </div>
                    <h1 className="text-5xl font-bold tracking-tight">
                        Universal AI Intelligence
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Accept any input. Process with hybrid AI. Return in any format.
                    </p>
                </div>

                {/* Input Selection */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">1</div>
                        <h2 className="text-2xl font-bold">Select Input Types</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {INPUT_TYPES.map((input) => {
                            const isSelected = selectedInputs.includes(input.id);
                            const Icon = input.icon;
                            return (
                                <button
                                    key={input.id}
                                    onClick={() => toggleInput(input.id)}
                                    className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${isSelected
                                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 scale-[1.02]'
                                            : 'border-gray-200 dark:border-white/10 hover:border-indigo-300 dark:hover:border-indigo-700'
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSelected ? 'bg-indigo-600' : 'bg-gray-100 dark:bg-white/5'
                                            }`}>
                                            <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
                                        </div>
                                        {isSelected && (
                                            <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-lg mb-1">{input.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{input.description}</p>
                                </button>
                            );
                        })}
                    </div>

                    {/* Text Input Area */}
                    {selectedInputs.includes("text") && (
                        <div className="card-premium !p-0 overflow-hidden">
                            <div className="bg-gray-100 dark:bg-white/5 px-4 py-3 border-b border-gray-200 dark:border-white/10">
                                <span className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Text Input</span>
                            </div>
                            <textarea
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                placeholder="Enter your question, document, or data to analyze..."
                                className="w-full p-6 bg-transparent outline-none resize-none min-h-[200px] text-lg"
                                rows={6}
                            />
                        </div>
                    )}
                </section>

                {/* AI Processing Visualization */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold">2</div>
                        <h2 className="text-2xl font-bold">Hybrid AI Processing</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {AI_MODELS.map((model, idx) => {
                            const isActive = activeModel === model.name;
                            return (
                                <div
                                    key={idx}
                                    className={`p-6 rounded-2xl border-2 transition-all duration-500 ${isActive
                                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 scale-105 shadow-lg shadow-indigo-500/20'
                                            : 'border-gray-200 dark:border-white/10'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isActive ? 'bg-indigo-600 animate-pulse' : 'bg-gray-100 dark:bg-white/5'
                                            }`}>
                                            <Cpu className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
                                        </div>
                                        {isActive && <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />}
                                    </div>
                                    <h3 className="font-bold mb-1">{model.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                                        <Zap className="w-4 h-4" />
                                        {model.speed}
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{model.use}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Output Format Selection */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 font-bold">3</div>
                        <h2 className="text-2xl font-bold">Choose Output Format</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {OUTPUT_FORMATS.map((format) => {
                            const isSelected = selectedOutput === format.id;
                            const Icon = format.icon;
                            return (
                                <button
                                    key={format.id}
                                    onClick={() => setSelectedOutput(format.id)}
                                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${isSelected
                                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                            : 'border-gray-200 dark:border-white/10 hover:border-green-300'
                                        }`}
                                >
                                    <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? 'text-green-600' : 'text-gray-600 dark:text-gray-400'}`} />
                                    <div className="text-sm font-bold mb-1">{format.name}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">{format.description}</div>
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* Action Button */}
                <div className="flex justify-center">
                    <button
                        onClick={simulateProcessing}
                        disabled={isProcessing || selectedInputs.length === 0}
                        className="btn-premium !px-12 !py-5 !text-lg disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                Processing with Hybrid AI...
                            </>
                        ) : (
                            <>
                                <Brain className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                Analyze with Cleara
                                <ChevronRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </div>

                {/* Result Display */}
                {result && (
                    <section className="space-y-6 animate-fade-in">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">✓</div>
                            <h2 className="text-2xl font-bold">Result ({result.format})</h2>
                        </div>
                        <div className="card-premium glass-dark !p-8">
                            <pre className="text-sm overflow-auto">
                                {JSON.stringify(result, null, 2)}
                            </pre>
                        </div>
                        <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-2">
                                <Cpu className="w-4 h-4" />
                                Models: {result.data.models_used.join(", ")}
                            </span>
                            <span className="flex items-center gap-2">
                                <Zap className="w-4 h-4" />
                                {result.data.latency_ms}ms
                            </span>
                            <span className="flex items-center gap-2">
                                <Check className="w-4 h-4" />
                                {(result.data.confidence * 100).toFixed(0)}% confidence
                            </span>
                        </div>
                    </section>
                )}

            </main>
        </div>
    );
}
