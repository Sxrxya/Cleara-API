import {
    Download,
    FileText,
    FileJson,
    Table,
    LayoutList,
    Code
} from 'lucide-react';

interface ExportMenuProps {
    onExport: (format: 'json' | 'csv' | 'text') => void;
    viewMode: 'list' | 'table' | 'json';
    onViewChange: (mode: 'list' | 'table' | 'json') => void;
}

export default function ExportMenu({ onExport, viewMode, onViewChange }: ExportMenuProps) {
    return (
        <div className="flex items-center gap-4 bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-2">
            {/* View Toggles */}
            <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-slate-700">
                <button
                    onClick={() => onViewChange('list')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-slate-700 text-cyan-400' : 'text-slate-400 hover:text-white'
                        }`}
                    title="List View"
                >
                    <LayoutList className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onViewChange('table')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'table' ? 'bg-slate-700 text-cyan-400' : 'text-slate-400 hover:text-white'
                        }`}
                    title="Table View"
                >
                    <Table className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onViewChange('json')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'json' ? 'bg-slate-700 text-cyan-400' : 'text-slate-400 hover:text-white'
                        }`}
                    title="JSON View"
                >
                    <Code className="w-4 h-4" />
                </button>
            </div>

            <div className="h-6 w-px bg-slate-700" />

            {/* Export Options */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onExport('text')}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
                    title="Export as Text Report"
                >
                    <FileText className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onExport('csv')}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
                    title="Export as CSV"
                >
                    <Table className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onExport('json')}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
                    title="Export as JSON"
                >
                    <FileJson className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
