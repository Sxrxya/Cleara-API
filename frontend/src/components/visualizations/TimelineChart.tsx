import { useMemo } from 'react';

interface TimelineEvent {
    id: string;
    type: 'log' | 'metric' | 'alert';
    timestamp: number; // relative time (0-100%) or absolute epoch
    severity: 'info' | 'warning' | 'error' | 'critical';
    message: string;
    source: string;
}

interface TimelineChartProps {
    incidentId: string;
    rootCause: string;
    affectedServices: string[];
    startTime?: string;
    endTime?: string;
}

export default function TimelineChart({ incidentId, rootCause, affectedServices }: TimelineChartProps) {
    // Mock data generator (since backend only returns counts)
    const events: TimelineEvent[] = useMemo(() => {
        const mockEvents: TimelineEvent[] = [];
        const baseTime = Date.now();

        // Generate 15-20 events
        const count = 15 + Math.floor(Math.random() * 10);

        for (let i = 0; i < count; i++) {
            const offset = Math.random() * 30 * 60 * 1000; // 30 minutes window
            const type = Math.random() > 0.6 ? 'log' : Math.random() > 0.3 ? 'metric' : 'alert';
            const severity = type === 'alert' ? 'critical' : type === 'log' && Math.random() > 0.7 ? 'error' : 'info';
            const service = affectedServices[Math.floor(Math.random() * affectedServices.length)] || 'unknown-service';

            mockEvents.push({
                id: `evt-${i}`,
                type,
                timestamp: baseTime - offset,
                severity,
                message: type === 'log' ? `Error processing request in ${service}` : type === 'metric' ? `CPU usage > 90% on ${service}` : `${rootCause} detected`,
                source: service
            });
        }
        return mockEvents.sort((a, b) => a.timestamp - b.timestamp);
    }, [incidentId]);

    const startTime = events[0]?.timestamp || Date.now();
    const endTime = events[events.length - 1]?.timestamp || Date.now();
    const duration = endTime - startTime || 1;

    const getPosition = (ts: number) => {
        return ((ts - startTime) / duration) * 100;
    };

    return (
        <div className="w-full h-64 bg-slate-900/50 rounded-xl border border-slate-700 p-4 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#334155_1px,transparent_1px)] bg-[size:40px] opacity-10" />

            <h3 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                Event Timeline
            </h3>

            <div className="relative h-40 flex flex-col justify-center gap-6">
                {/* Swimlanes */}
                {(['alert', 'metric', 'log'] as const).map(type => (
                    <div key={type} className="relative h-8 w-full flex items-center">
                        <div className="absolute left-0 -ml-12 w-12 text-xs text-slate-500 text-right pr-2 uppercase font-semibold tracking-wider">
                            {type}s
                        </div>
                        <div className="w-full h-[1px] bg-slate-800" />

                        {events.filter(e => e.type === type).map(ev => (
                            <div
                                key={ev.id}
                                className={`absolute h-3 w-3 rounded-full border-2 transform -translate-x-1/2 transition-all duration-300 hover:scale-150 cursor-pointer ${ev.severity === 'critical' ? 'bg-red-500 border-red-900 shadow-[0_0_10px_rgba(239,68,68,0.5)]' :
                                        ev.severity === 'error' ? 'bg-orange-500 border-orange-900' :
                                            ev.severity === 'warning' ? 'bg-yellow-500 border-yellow-900' :
                                                'bg-blue-500 border-blue-900'
                                    }`}
                                style={{ left: `${getPosition(ev.timestamp)}%` }}
                                title={`${ev.message} (${new Date(ev.timestamp).toLocaleTimeString()})`}
                            />
                        ))}
                    </div>
                ))}
            </div>

            {/* Time Labels */}
            <div className="flex justify-between text-xs text-slate-600 mt-2 font-mono">
                <span>{new Date(startTime).toLocaleTimeString()}</span>
                <span>{new Date(endTime).toLocaleTimeString()}</span>
            </div>
        </div>
    );
}
