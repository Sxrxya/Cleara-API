import {
    BarChart3,
    TrendingUp,
    Sparkles,
    Activity,
    FileText,
    Brain,
    Zap,
    Target
} from 'lucide-react';

export type AnalysisMode =
    | 'summary'
    | 'trends'
    | 'predictions'
    | 'anomalies'
    | 'patterns'
    | 'root-cause'
    | 'impact'
    | 'recommendations';

export interface AnalysisModeConfig {
    id: AnalysisMode;
    name: string;
    description: string;
    icon: any;
    color: string;
    features: string[];
    estimatedTime: string;
}

export const ANALYSIS_MODES: AnalysisModeConfig[] = [
    {
        id: 'summary',
        name: 'Quick Summary',
        description: 'Get a high-level overview of incidents and key metrics',
        icon: FileText,
        color: 'from-blue-500 to-cyan-500',
        features: [
            'Total incidents count',
            'Severity distribution',
            'Top affected services',
            'Noise reduction stats'
        ],
        estimatedTime: '< 1 second'
    },
    {
        id: 'trends',
        name: 'Trend Analysis',
        description: 'Analyze incident patterns over time and identify trends',
        icon: TrendingUp,
        color: 'from-green-500 to-emerald-500',
        features: [
            'Time-series visualization',
            'Incident frequency trends',
            'Peak hours detection',
            'Week-over-week comparison'
        ],
        estimatedTime: '2-3 seconds'
    },
    {
        id: 'predictions',
        name: 'Predictive Analysis',
        description: 'Forecast potential incidents using ML models',
        icon: Sparkles,
        color: 'from-purple-500 to-pink-500',
        features: [
            'Incident risk prediction',
            'Resource exhaustion forecast',
            'Failure probability scoring',
            'Proactive recommendations'
        ],
        estimatedTime: '3-5 seconds'
    },
    {
        id: 'anomalies',
        name: 'Anomaly Detection',
        description: 'Identify unusual patterns and outliers in your data',
        icon: Activity,
        color: 'from-orange-500 to-red-500',
        features: [
            'Statistical outlier detection',
            'Metric anomaly scoring',
            'Baseline deviation analysis',
            'Anomaly severity ranking'
        ],
        estimatedTime: '2-4 seconds'
    },
    {
        id: 'patterns',
        name: 'Pattern Discovery',
        description: 'Discover recurring patterns and common failure modes',
        icon: Brain,
        color: 'from-indigo-500 to-purple-500',
        features: [
            'Recurring issue detection',
            'Common error patterns',
            'Service correlation mapping',
            'Pattern frequency analysis'
        ],
        estimatedTime: '3-4 seconds'
    },
    {
        id: 'root-cause',
        name: 'Root Cause Analysis',
        description: 'Deep dive into incident root causes with AI correlation',
        icon: Target,
        color: 'from-red-500 to-rose-500',
        features: [
            'AI-powered correlation',
            'Multi-source event linking',
            'Confidence scoring',
            'Evidence-based diagnosis'
        ],
        estimatedTime: '1-2 seconds'
    },
    {
        id: 'impact',
        name: 'Impact Analysis',
        description: 'Assess the blast radius and business impact of incidents',
        icon: Zap,
        color: 'from-yellow-500 to-orange-500',
        features: [
            'Service dependency mapping',
            'User impact estimation',
            'Downtime calculation',
            'Business metrics correlation'
        ],
        estimatedTime: '2-3 seconds'
    },
    {
        id: 'recommendations',
        name: 'Smart Recommendations',
        description: 'Get AI-generated remediation steps and best practices',
        icon: BarChart3,
        color: 'from-cyan-500 to-blue-500',
        features: [
            'Automated remediation steps',
            'Similar incident solutions',
            'Best practice suggestions',
            'Runbook generation'
        ],
        estimatedTime: '1-2 seconds'
    }
];

export function getAnalysisModeById(id: AnalysisMode): AnalysisModeConfig | undefined {
    return ANALYSIS_MODES.find(mode => mode.id === id);
}

export function getAnalysisModeColor(id: AnalysisMode): string {
    const mode = getAnalysisModeById(id);
    return mode?.color || 'from-gray-500 to-slate-500';
}

export function getAnalysisModeIcon(id: AnalysisMode): any {
    const mode = getAnalysisModeById(id);
    return mode?.icon || FileText;
}
