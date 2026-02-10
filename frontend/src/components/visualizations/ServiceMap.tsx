import { useEffect, useRef, useState } from 'react';

interface ServiceNode {
    id: string;
    label: string;
    type: 'db' | 'api' | 'web' | 'cache' | 'worker';
    status: 'healthy' | 'warning' | 'critical';
    x: number;
    y: number;
}

interface ServiceLink {
    source: string;
    target: string;
    status: 'ok' | 'fail';
}

interface ServiceMapProps {
    affectedServices: string[];
    rootCauseService: string;
}

export default function ServiceMap({ affectedServices, rootCauseService }: ServiceMapProps) {
    const [nodes, setNodes] = useState<ServiceNode[]>([]);
    const [links, setLinks] = useState<ServiceLink[]>([]);

    useEffect(() => {
        // Generate mock topology
        const newNodes: ServiceNode[] = [];
        const newLinks: ServiceLink[] = [];

        // Define hardcoded services if empty
        const services = affectedServices.length > 0 ? affectedServices : ['api-gateway', 'auth-service', 'user-db'];

        // Center node (Root Cause)
        const root = rootCauseService || services[0];

        // Simple radial layout
        const centerX = 200;
        const centerY = 150;
        const radius = 100;

        // Add root node
        newNodes.push({
            id: root,
            label: root,
            type: root.includes('db') ? 'db' : root.includes('cache') ? 'cache' : 'api',
            status: 'critical',
            x: centerX,
            y: centerY
        });

        // Add dependent nodes around it
        services.filter(s => s !== root).forEach((s, i) => {
            const angle = (i * 2 * Math.PI) / (services.length - 1 || 1);
            newNodes.push({
                id: s,
                label: s,
                type: s.includes('db') ? 'db' : 'web',
                status: 'warning',
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius
            });

            // Link to root
            newLinks.push({
                source: root,
                target: s,
                status: 'fail' // assume critical path failure
            });
        });

        setNodes(newNodes);
        setLinks(newLinks);
    }, [affectedServices, rootCauseService]);

    return (
        <div className="w-full h-80 bg-slate-900 rounded-xl border border-slate-700 p-4 relative overflow-hidden flex items-center justify-center">
            <h3 className="absolute top-4 left-4 text-sm font-medium text-slate-400">
                Service Dependency Map
            </h3>

            <svg width="400" height="300" viewBox="0 0 400 300" className="w-full h-full">
                <defs>
                    <marker id="arrow" markerWidth="10" markerHeight="10" refX="28" refY="3" orient="auto">
                        <path d="M0,0 L0,6 L9,3 z" fill="#64748b" />
                    </marker>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Links */}
                {links.map((link, i) => {
                    const source = nodes.find(n => n.id === link.source);
                    const target = nodes.find(n => n.id === link.target);
                    if (!source || !target) return null;

                    return (
                        <line
                            key={i}
                            x1={source.x}
                            y1={source.y}
                            x2={target.x}
                            y2={target.y}
                            stroke={link.status === 'fail' ? '#ef4444' : '#64748b'}
                            strokeWidth={link.status === 'fail' ? 2 : 1}
                            strokeDasharray={link.status === 'fail' ? '5,5' : 'none'}
                            markerEnd="url(#arrow)"
                            className="transition-all duration-500"
                        />
                    );
                })}

                {/* Nodes */}
                {nodes.map((node) => (
                    <g key={node.id} className="cursor-pointer group">
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r={24}
                            fill={
                                node.status === 'critical' ? '#ef4444' :
                                    node.status === 'warning' ? '#f59e0b' :
                                        '#3b82f6'
                            }
                            filter="url(#glow)"
                            className="transition-all duration-300 group-hover:r-28"
                            opacity="0.2"
                        />
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r={20}
                            fill="#1e293b"
                            stroke={
                                node.status === 'critical' ? '#ef4444' :
                                    node.status === 'warning' ? '#f59e0b' :
                                        '#3b82f6'
                            }
                            strokeWidth={2}
                        />
                        <text
                            x={node.x}
                            y={node.y + 4}
                            textAnchor="middle"
                            fill="white"
                            className="text-xs font-bold pointer-events-none uppercase tracking-wide"
                            style={{ fontSize: '10px' }}
                        >
                            {node.type}
                        </text>

                        {/* Label Tooltip */}
                        <foreignObject x={node.x - 50} y={node.y + 25} width="100" height="30">
                            <div className="text-center">
                                <span className="bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow border border-slate-700 whitespace-nowrap">
                                    {node.label}
                                </span>
                            </div>
                        </foreignObject>
                    </g>
                ))}
            </svg>
        </div>
    );
}
