"use client";

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { Sparkles, Database, Zap, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function DemoPage() {
    const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
    const [aiStatus, setAiStatus] = useState<any>(null);
    const [testData, setTestData] = useState({
        name: '  john DOE  ',
        email: 'john@gmial.com',
        phone: '1234567890'
    });
    const [cleanedData, setCleanedData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Check backend connection on mount
    useEffect(() => {
        checkBackendConnection();
        checkAIStatus();
    }, []);

    const checkBackendConnection = async () => {
        setBackendStatus('checking');
        const response = await apiClient.checkHealth();
        setBackendStatus(response.success ? 'connected' : 'disconnected');
    };

    const checkAIStatus = async () => {
        const response = await apiClient.getAIStatus();
        if (response.success) {
            setAiStatus(response.data);
        }
    };

    const handleCleanData = async () => {
        setLoading(true);
        setError(null);
        setCleanedData(null);

        const response = await apiClient.aiCleanData({
            data: testData,
            instructions: 'Fix email typos, format phone number, and standardize name'
        });

        setLoading(false);

        if (response.success) {
            setCleanedData(response.data);
        } else {
            setError(response.error || 'Failed to clean data');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Sparkles className="w-12 h-12 text-purple-400" />
                        <h1 className="text-5xl font-bold text-white">
                            Cleara <span className="text-purple-400">AI</span>
                        </h1>
                    </div>
                    <p className="text-xl text-gray-300">
                        Backend + Frontend Connected! Test the AI-powered data cleaning
                    </p>
                </div>

                {/* Status Cards */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Backend Status */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                                <Database className="w-6 h-6" />
                                Backend Status
                            </h3>
                            {backendStatus === 'checking' && (
                                <Loader2 className="w-6 h-6 text-yellow-400 animate-spin" />
                            )}
                            {backendStatus === 'connected' && (
                                <CheckCircle2 className="w-6 h-6 text-green-400" />
                            )}
                            {backendStatus === 'disconnected' && (
                                <XCircle className="w-6 h-6 text-red-400" />
                            )}
                        </div>
                        <p className="text-gray-300">
                            {backendStatus === 'checking' && 'Checking connection...'}
                            {backendStatus === 'connected' && '✅ Connected to http://localhost:8000'}
                            {backendStatus === 'disconnected' && '❌ Backend not running. Start it with: uvicorn app.main:app --reload'}
                        </p>
                    </div>

                    {/* AI Status */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                                <Zap className="w-6 h-6" />
                                AI Providers
                            </h3>
                            {aiStatus && (
                                <span className="text-sm text-purple-300">
                                    {aiStatus.status?.total_providers || 0} active
                                </span>
                            )}
                        </div>
                        {aiStatus ? (
                            <div className="space-y-2 text-sm text-gray-300">
                                {aiStatus.status?.groq?.available && (
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                                        <span>Groq (Ultra-fast)</span>
                                    </div>
                                )}
                                {aiStatus.status?.gemini?.available && (
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                                        <span>Gemini (Generous)</span>
                                    </div>
                                )}
                                {aiStatus.status?.huggingface?.available && (
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                                        <span>Hugging Face (Unlimited)</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm">Loading AI status...</p>
                        )}
                    </div>
                </div>

                {/* Demo Section */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-purple-400" />
                        AI Data Cleaning Demo
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Input */}
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">
                                Messy Data (Input)
                            </h3>
                            <div className="bg-black/30 rounded-xl p-4 border border-white/10">
                                <pre className="text-sm text-gray-300">
                                    {JSON.stringify(testData, null, 2)}
                                </pre>
                            </div>
                            <div className="mt-4 space-y-3">
                                <input
                                    type="text"
                                    value={testData.name}
                                    onChange={(e) => setTestData({ ...testData, name: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Name"
                                />
                                <input
                                    type="text"
                                    value={testData.email}
                                    onChange={(e) => setTestData({ ...testData, email: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Email"
                                />
                                <input
                                    type="text"
                                    value={testData.phone}
                                    onChange={(e) => setTestData({ ...testData, phone: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Phone"
                                />
                            </div>
                        </div>

                        {/* Output */}
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">
                                Cleaned Data (Output)
                            </h3>
                            <div className="bg-black/30 rounded-xl p-4 border border-white/10 min-h-[200px]">
                                {loading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                                    </div>
                                ) : cleanedData ? (
                                    <pre className="text-sm text-green-300">
                                        {JSON.stringify(cleanedData.cleaned_data, null, 2)}
                                    </pre>
                                ) : error ? (
                                    <p className="text-red-400">{error}</p>
                                ) : (
                                    <p className="text-gray-400 text-center">
                                        Click "Clean with AI" to see the magic! ✨
                                    </p>
                                )}
                            </div>
                            {cleanedData && (
                                <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                                    <p className="text-sm text-green-300">
                                        ✅ Cleaned by: <span className="font-semibold">{cleanedData.provider_used}</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Clean Button */}
                    <div className="mt-8 text-center">
                        <button
                            onClick={handleCleanData}
                            disabled={loading || backendStatus !== 'connected'}
                            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 flex items-center gap-2 mx-auto"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Cleaning...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Clean with AI
                                </>
                            )}
                        </button>
                        {backendStatus !== 'connected' && (
                            <p className="mt-3 text-sm text-red-400">
                                ⚠️ Backend not connected. Start it first!
                            </p>
                        )}
                    </div>
                </div>

                {/* Instructions */}
                <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-blue-300 mb-3">
                        🚀 How to Use
                    </h3>
                    <ol className="space-y-2 text-gray-300 text-sm">
                        <li>1. Make sure backend is running: <code className="bg-black/30 px-2 py-1 rounded">uvicorn app.main:app --reload</code></li>
                        <li>2. Edit the messy data in the input fields</li>
                        <li>3. Click "Clean with AI" button</li>
                        <li>4. Watch the AI clean your data in real-time! ✨</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
