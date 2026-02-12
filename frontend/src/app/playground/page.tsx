"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";
import InputDataStep from "@/components/playground/InputDataStep";
import ProcessingStep from "@/components/playground/ProcessingStep";
import ResultsStep from "@/components/playground/ResultsStep";

export default function PlaygroundPage() {
    // Wizard state
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

    // Data state
    const [inputData, setInputData] = useState<string>("");
    const [resultData, setResultData] = useState<any>(null);

    const handleProcessingComplete = (results: any) => {
        setResultData(results);
        setCurrentStep(3);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="relative flex items-center justify-center py-4 mb-2">
                <Link
                    href="/dashboard"
                    className="absolute left-0 p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div className="text-center space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-white">Interactive Playground</h1>
                    <p className="text-slate-400">Test the Cleara engine with your own data.</p>
                </div>
            </div>

            {/* Stepper */}
            <div className="max-w-2xl mx-auto py-4">
                <div className="flex justify-between">
                    {[1, 2, 3].map((step) => {
                        const isActive = step === currentStep;
                        const isCompleted = step < currentStep;

                        return (
                            <div key={step} className="flex flex-col items-center gap-2 bg-slate-950 px-4">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${isActive
                                        ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] scale-110"
                                        : isCompleted
                                            ? "bg-green-500 text-white"
                                            : "bg-slate-800 text-slate-400"
                                        }`}
                                >
                                    {isCompleted ? (
                                        <Sparkles className="w-5 h-5" />
                                    ) : (
                                        step
                                    )}
                                </div>
                                <span className={`text-xs font-medium ${isActive ? "text-indigo-400" : "text-slate-500"}`}>
                                    {step === 1 && "Input Data"}
                                    {step === 2 && "Processing"}
                                    {step === 3 && "Results"}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 min-h-[600px] shadow-2xl shadow-black/20">
                {currentStep === 1 && (
                    <InputDataStep
                        data={inputData}
                        setData={setInputData}
                        onStartProcessing={(data, formats) => console.log('Starting processing', data, formats)}
                        onNext={() => setCurrentStep(2)}
                    />
                )}
                {currentStep === 2 && (
                    <ProcessingStep
                        inputData={inputData}
                        onComplete={handleProcessingComplete}
                    />
                )}
                {currentStep === 3 && resultData && (
                    <ResultsStep
                        data={resultData}
                        onReset={() => {
                            setInputData("");
                            setResultData(null);
                            setCurrentStep(1);
                        }}
                    />
                )}
            </div>
        </div>
    );
}
