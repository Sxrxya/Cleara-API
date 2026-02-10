import { Search, Sliders, X } from 'lucide-react';

interface AdvancedFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    minConfidence: number;
    onConfidenceChange: (confidence: number) => void;
    selectedService: string;
    onServiceChange: (service: string) => void;
    availableServices: string[];
    onClear: () => void;
}

export default function AdvancedFilters({
    searchQuery,
    onSearchChange,
    minConfidence,
    onConfidenceChange,
    selectedService,
    onServiceChange,
    availableServices,
    onClear
}: AdvancedFiltersProps) {
    return (
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search by ID, root cause, or recommendation..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-500"
                    />
                </div>

                {/* Service Filter */}
                <div className="w-full md:w-48">
                    <select
                        value={selectedService}
                        onChange={(e) => onServiceChange(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                        <option value="all">All Services</option>
                        {availableServices.map(service => (
                            <option key={service} value={service}>{service}</option>
                        ))}
                    </select>
                </div>

                {/* Confidence Slider */}
                <div className="w-full md:w-64 flex items-center gap-3 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2">
                    <span className="text-xs text-slate-400 whitespace-nowrap">Min Confidence:</span>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={minConfidence}
                        onChange={(e) => onConfidenceChange(parseInt(e.target.value))}
                        className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                    <span className="text-xs font-medium text-cyan-400 w-8 text-right">{minConfidence}%</span>
                </div>

                {/* Clear Filters */}
                <button
                    onClick={onClear}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2"
                    title="Clear Filters"
                >
                    <X className="w-4 h-4" />
                    <span className="md:hidden">Clear</span>
                </button>
            </div>
        </div>
    );
}
