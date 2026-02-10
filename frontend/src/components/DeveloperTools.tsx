import { useState } from 'react';
import { Terminal, Copy, Check, Server, Globe, Key } from 'lucide-react';

interface DeveloperToolsProps {
    isOpen: boolean;
    onClose: () => void;
    currentIncidentId?: string;
}

export default function DeveloperTools({ isOpen, onClose, currentIncidentId }: DeveloperToolsProps) {
    const [activeTab, setActiveTab] = useState<'curl' | 'webhook' | 'schema'>('curl');
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const baseUrl = 'http://localhost:8000/v1';

    const curlCommand = currentIncidentId
        ? `curl -X GET "${baseUrl}/incidents/${currentIncidentId}" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`
        : `curl -X POST "${baseUrl}/aiops/analyze" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "time_window": 15,
    "services": ["api-gateway", "db-shard-01"]
  }'`;

    const webhookExample = `{
  "event": "incident.created",
  "data": {
    "id": "${currentIncidentId || 'inc-12345'}",
    "severity": "critical",
    "root_cause": "Database connection pool exhaustion",
    "timestamp": "2026-02-09T12:00:00Z"
  }
}`;

    const schemaExample = `type Incident {
  id: ID!
  severity: Severity!
  rootCause: String
  confidence: Float
  affectedServices: [Service!]!
  createdAt: DateTime!
}`;

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/50">
                    <div className="flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-purple-400" />
                        <h2 className="font-semibold text-white">Developer Tools</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        Close
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-700">
                    {[
                        { id: 'curl', label: 'API Usage', icon: Globe },
                        { id: 'webhook', label: 'Webhooks', icon: Server },
                        { id: 'schema', label: 'Schema', icon: key => <Key className="w-4 h-4" /> } // Fix icon usage if needed
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === tab.id
                                    ? 'bg-slate-800 text-purple-400 border-b-2 border-purple-400'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                }`}
                        >
                            {/* Simple icon rendering for now */}
                            {tab.id === 'curl' && <Globe className="w-4 h-4" />}
                            {tab.id === 'webhook' && <Server className="w-4 h-4" />}
                            {tab.id === 'schema' && <Key className="w-4 h-4" />}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-6 bg-slate-900">
                    <div className="relative group">
                        <div className="absolute right-4 top-4">
                            <button
                                onClick={() => handleCopy(
                                    activeTab === 'curl' ? curlCommand :
                                        activeTab === 'webhook' ? webhookExample :
                                            schemaExample
                                )}
                                className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700"
                                title="Copy to clipboard"
                            >
                                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>

                        <pre className="font-mono text-sm bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300 overflow-x-auto">
                            <code>
                                {activeTab === 'curl' && curlCommand}
                                {activeTab === 'webhook' && webhookExample}
                                {activeTab === 'schema' && schemaExample}
                            </code>
                        </pre>
                    </div>

                    <div className="mt-6">
                        <h4 className="text-sm font-medium text-slate-400 mb-2">Integration Notes</h4>
                        <ul className="text-sm text-slate-500 space-y-1 list-disc list-inside">
                            {activeTab === 'curl' && (
                                <>
                                    <li>Use <code className="text-purple-400">Authorization</code> header for all requests.</li>
                                    <li>Rate limit: 100 requests / minute.</li>
                                    <li>Responses are always JSON.</li>
                                </>
                            )}
                            {activeTab === 'webhook' && (
                                <>
                                    <li>Webhooks are signed with HMAC-SHA256.</li>
                                    <li>Retry policy: Exponential backoff (max 5 attempts).</li>
                                    <li>Events: incident.created, incident.updated, incident.resolved.</li>
                                </>
                            )}
                            {activeTab === 'schema' && (
                                <>
                                    <li>GraphQL endpoint: <code className="text-purple-400">/graphql</code>.</li>
                                    <li>Full introspection enabled in development.</li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
