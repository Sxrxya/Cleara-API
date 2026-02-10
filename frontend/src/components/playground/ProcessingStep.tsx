"use client";

import React, { useState, useEffect } from "react";
import { Shield, Layers, Database, Zap, Sparkles, RefreshCw, CheckCircle2 } from "lucide-react";

const WORKFLOW_STEPS = [
    { id: 1, name: "API Gateway", icon: Shield, color: "blue", description: "Authenticating request" },
    { id: 2, name: "Preprocessing", icon: Layers, color: "indigo", description: "Normalizing input format" },
    { id: 3, name: "Schema Detect", icon: Database, color: "purple", description: "Analyzing data structure" },
    { id: 4, name: "Cleaning", icon: Zap, color: "yellow", description: "Applying AI cleaning rules" },
    { id: 5, name: "AI Validation", icon: Sparkles, color: "blue", description: "Validating with AI models" },
    { id: 6, name: "Deduplication", icon: RefreshCw, color: "green", description: "Removing duplicates" },
    { id: 7, name: "Enrichment", icon: Database, color: "pink", description: "Enriching data fields" },
];

interface ProcessingStepProps {
    inputData: string;
    selectedFormats: number[];
    onComplete: (results: any) => void;
}

export default function ProcessingStep({ inputData, selectedFormats, onComplete }: ProcessingStepProps) {
    const [activeStep, setActiveStep] = useState(0);
    const [isProcessing, setIsProcessing] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const processData = async () => {
            setIsProcessing(true);
            setActiveStep(1);

            // Prepare payload
            let payloadData;
            try {
                payloadData = JSON.parse(inputData);
                if (Array.isArray(payloadData)) {
                    payloadData = { records: payloadData };
                }
            } catch (e) {
                payloadData = { raw_content: inputData };
            }

            // Start animation
            const startTime = Date.now();
            const minAnimationTime = 3500;

            // Animation loop
            let currentStep = 1;
            const animationInterval = setInterval(() => {
                currentStep = currentStep < 7 ? currentStep + 1 : 7;
                setActiveStep(currentStep);
            }, 500);

            try {
                // Real backend call
                const response = await fetch('http://localhost:8000/v1/ai/clean', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        data: payloadData,
                        instructions: "Clean, normalize, and extract structured data from this input.",
                        output_formats: selectedFormats
                    }),
                });

                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.detail || 'Processing failed');
                }

                const data = await response.json();

                // Wait for minimum animation time
                const elapsed = Date.now() - startTime;
                if (elapsed < minAnimationTime) {
                    await new Promise(r => setTimeout(r, minAnimationTime - elapsed));
                }

                clearInterval(animationInterval);
                setActiveStep(7);
                setIsProcessing(false);

                // Wait a moment to show completion, then move to results
                setTimeout(() => {
                    onComplete(data);
                }, 1000);

            } catch (error: any) {
                clearInterval(animationInterval);
                setIsProcessing(false);
                setError(error.message);
                setActiveStep(0);
            }
        };

        processData();
    }, [inputData, selectedFormats, onComplete]);

    return (
        <div className="max-w-5xl mx-auto">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-white/5 p-8">
                {/* Title */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Processing Your Data
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        AI-powered cleaning in progress using Groq, Gemini & Hugging Face
                    </p>
                </div>

                {error ? (
                    // Error State
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
                        <div className="text-red-600 dark:text-red-400 text-lg font-semibold mb-2">
                            ❌ Processing Failed
                        </div>
                        <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                        <p className="text-red-600 dark:text-red-400 text-xs mt-2">
                            Ensure backend is running on port 8000
                        </p>
                    </div>
                ) : (
                    // Processing Animation
                    <div className="space-y-4">
                        {WORKFLOW_STEPS.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = activeStep === step.id;
                            const isComplete = activeStep > step.id;
                            const isPending = activeStep < step.id;

                            return (
                                <div
                                    key={step.id}
                                    className={`relative flex items-center gap-4 p-4 rounded-lg border-2 transition-all duration-500 ${isActive
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105'
                                            : isComplete
                                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800'
                                        }`}
                                >
                                    {/* Icon */}
                                    <div className={`flex items-center justify-center w-12 h-12 rounded-full ${isActive
                                            ? 'bg-blue-500 animate-pulse'
                                            : isComplete
                                                ? 'bg-green-500'
                                                : 'bg-gray-300 dark:bg-gray-600'
                                        }`}>
                                        {isComplete ? (
                                            <CheckCircle2 className="w-6 h-6 text-white" />
                                        ) : (
                                            <Icon className={`w-6 h-6 ${isActive ? 'text-white animate-spin' : 'text-white'
                                                }`} />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <h3 className={`font-semibold ${isActive
                                                ? 'text-blue-900 dark:text-blue-100'
                                                : isComplete
                                                    ? 'text-green-900 dark:text-green-100'
                                                    : 'text-gray-600 dark:text-gray-400'
                                            }`}>
                                            {step.name}
                                        </h3>
                                        <p className={`text-sm ${isActive
                                                ? 'text-blue-700 dark:text-blue-300'
                                                : isComplete
                                                    ? 'text-green-700 dark:text-green-300'
                                                    : 'text-gray-500 dark:text-gray-500'
                                            }`}>
                                            {step.description}
                                        </p>
                                    </div>

                                    {/* Status Badge */}
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${isActive
                                            ? 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200'
                                            : isComplete
                                                ? 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                        }`}>
                                        {isActive ? 'Processing...' : isComplete ? 'Complete' : 'Pending'}
                                    </div>

                                    {/* Progress Line */}
                                    {index < WORKFLOW_STEPS.length - 1 && (
                                        <div className={`absolute left-10 top-full w-0.5 h-4 ${isComplete ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                                            }`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Progress Bar */}
                {!error && (
                    <div className="mt-8">
                        <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                            <span>Overall Progress</span>
                            <span>{Math.round((activeStep / 7) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-purple-600 h-full transition-all duration-500 ease-out"
                                style={{ width: `${(activeStep / 7) * 100}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
