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
    const [inputData, setInputData] = useState("");
    const [selectedFormats, setSelectedFormats] = useState<number[]>([4]);
    const [processingData, setProcessingData] = useState<any>(null);
    const [results, setResults] = useState<any>(null);

    // Step navigation
    const goToStep = (step: 1 | 2 | 3) => {
        setCurrentStep(step);
    };

    const handleStartProcessing = async (data: string, formats: number[]) => {
        setInputData(data);
        setSelectedFormats(formats);
        setCurrentStep(2); // Move to processing step

        // Store processing data for the processing step
        setProcessingData({ data, formats });
    };

    const handleProcessingComplete = (resultData: any) => {
        setResults(resultData);
        setCurrentStep(3); // Move to results step
    };

    const handleReset = () => {
        setCurrentStep(1);
        setInputData("");
        setSelectedFormats([4]);
        setProcessingData(null);
        setResults(null);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617]">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-white/5 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Workflow Playground</h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {currentStep === 1 && "Step 1: Input Data"}
                                {currentStep === 2 && "Step 2: Processing"}
                                {currentStep === 3 && "Step 3: Results"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {currentStep > 1 && (
                            <button
                                onClick={handleReset}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Start Over
                            </button>
                        )}
                        <Link
                            href="/dashboard"
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                </div>

                {/* Progress Indicator */}
                <div className="max-w-7xl mx-auto mt-4">
                    <div className="flex items-center justify-between">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="flex items-center flex-1">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${currentStep >= step
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                                    }`}>
                                    {step}
                                </div>
                                {step < 3 && (
                                    <div className={`flex-1 h-1 mx-2 ${currentStep > step
                                            ? 'bg-blue-600'
                                            : 'bg-gray-200 dark:bg-gray-700'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                        <span>Input Data</span>
                        <span>Processing</span>
                        <span>Results</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="p-6">
                {currentStep === 1 && (
                    <InputDataStep onStartProcessing={handleStartProcessing} />
                )}

                {currentStep === 2 && processingData && (
                    <ProcessingStep
                        inputData={processingData.data}
                        selectedFormats={processingData.formats}
                        onComplete={handleProcessingComplete}
                    />
                )}

                {currentStep === 3 && results && (
                    <ResultsStep
                        results={results}
                        onStartOver={handleReset}
                    />
                )}
            </main>
        </div>
    );
}
