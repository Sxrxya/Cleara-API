"use client";

import { useState } from "react";
import { Key, Plus, Copy, Trash2, Eye, EyeOff, Calendar } from "lucide-react";
import toast from "react-hot-toast";

interface APIKey {
    id: string;
    name: string;
    key: string;
    keyPreview: string;
    createdAt: string;
    lastUsed: string | null;
    isActive: boolean;
}

const mockKeys: APIKey[] = [
    {
        id: "1",
        name: "Production API",
        key: "sk_live_placeholder_key_do_not_use",
        keyPreview: "sk_live_...",
        createdAt: "2026-01-15",
        lastUsed: "2 hours ago",
        isActive: true,
    },
    {
        id: "2",
        name: "Development",
        key: "sk_test_placeholder_key_do_not_use",
        keyPreview: "sk_test_...",
        createdAt: "2026-01-10",
        lastUsed: "1 day ago",
        isActive: true,
    },
];

export default function APIKeysPage() {
    const [keys, setKeys] = useState<APIKey[]>(mockKeys);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newKeyName, setNewKeyName] = useState("");
    const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());

    const handleCreateKey = () => {
        if (!newKeyName.trim()) {
            toast.error("Please enter a key name");
            return;
        }

        const newKey: APIKey = {
            id: Date.now().toString(),
            name: newKeyName,
            key: `sk_live_${Math.random().toString(36).substring(2)}`,
            keyPreview: `sk_live_...${Math.random().toString(36).substring(2, 6)}`,
            createdAt: new Date().toISOString().split("T")[0],
            lastUsed: null,
            isActive: true,
        };

        setKeys([...keys, newKey]);
        setNewKeyName("");
        setShowCreateModal(false);
        toast.success("API key created successfully!");
    };

    const handleCopyKey = (key: string) => {
        navigator.clipboard.writeText(key);
        toast.success("API key copied to clipboard!");
    };

    const handleDeleteKey = (id: string) => {
        if (confirm("Are you sure you want to delete this API key? This action cannot be undone.")) {
            setKeys(keys.filter((k) => k.id !== id));
            toast.success("API key deleted");
        }
    };

    const toggleRevealKey = (id: string) => {
        const newRevealed = new Set(revealedKeys);
        if (newRevealed.has(id)) {
            newRevealed.delete(id);
        } else {
            newRevealed.add(id);
        }
        setRevealedKeys(newRevealed);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        API Keys
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Manage your API keys for authentication
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn btn-primary flex items-center space-x-2"
                >
                    <Plus className="w-5 h-5" />
                    <span>Create New Key</span>
                </button>
            </div>

            {/* Info Banner */}
            <div className="card bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
                <div className="flex items-start space-x-3">
                    <Key className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-primary-900 dark:text-primary-100">
                            Keep your API keys secure
                        </h3>
                        <p className="text-sm text-primary-700 dark:text-primary-300 mt-1">
                            Never share your API keys publicly or commit them to version control.
                            Use environment variables to store them securely.
                        </p>
                    </div>
                </div>
            </div>

            {/* API Keys List */}
            <div className="space-y-4">
                {keys.map((apiKey) => (
                    <div key={apiKey.id} className="card">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-success-500 rounded-lg flex items-center justify-center">
                                        <Key className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {apiKey.name}
                                        </h3>
                                        <div className="flex items-center space-x-4 mt-1">
                                            <div className="flex items-center space-x-2">
                                                <code className="text-sm font-mono text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                                    {revealedKeys.has(apiKey.id)
                                                        ? apiKey.key
                                                        : apiKey.keyPreview}
                                                </code>
                                                <button
                                                    onClick={() => toggleRevealKey(apiKey.id)}
                                                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                    title={revealedKeys.has(apiKey.id) ? "Hide" : "Reveal"}
                                                >
                                                    {revealedKeys.has(apiKey.id) ? (
                                                        <EyeOff className="w-4 h-4" />
                                                    ) : (
                                                        <Eye className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                Created {apiKey.createdAt}
                                            </span>
                                            {apiKey.lastUsed && (
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    Last used {apiKey.lastUsed}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handleCopyKey(apiKey.key)}
                                    className="btn btn-secondary flex items-center space-x-2"
                                >
                                    <Copy className="w-4 h-4" />
                                    <span>Copy</span>
                                </button>
                                <button
                                    onClick={() => handleDeleteKey(apiKey.id)}
                                    className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    title="Delete key"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {keys.length === 0 && (
                    <div className="card text-center py-12">
                        <Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            No API keys yet
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Create your first API key to start using the Cleara API
                        </p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="btn btn-primary"
                        >
                            Create API Key
                        </button>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="card max-w-md w-full animate-slide-up">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Create New API Key
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Give your API key a descriptive name to help you identify it later.
                        </p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Key Name
                                </label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="e.g., Production API, Development, Testing"
                                    value={newKeyName}
                                    onChange={(e) => setNewKeyName(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && handleCreateKey()}
                                />
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={handleCreateKey}
                                    className="btn btn-primary flex-1"
                                >
                                    Create Key
                                </button>
                                <button
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setNewKeyName("");
                                    }}
                                    className="btn btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
