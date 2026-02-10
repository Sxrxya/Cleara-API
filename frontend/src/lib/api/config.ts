/**
 * API Configuration and Base URL
 */

// Get API URL from environment or use default
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
export const API_VERSION = '/v1';

// Full API endpoint
export const API_ENDPOINT = `${API_BASE_URL}${API_VERSION}`;

// API endpoints
export const ENDPOINTS = {
    // Health
    health: '/health',
    healthReady: '/health/ready',
    healthLive: '/health/live',

    // Data Operations
    clean: `${API_VERSION}/clean`,
    validate: `${API_VERSION}/validate`,
    deduplicate: `${API_VERSION}/deduplicate`,
    detectSchema: `${API_VERSION}/detect-schema`,
    enrich: `${API_VERSION}/enrich`,

    // AI Operations (NEW!)
    aiClean: `${API_VERSION}/ai/clean`,
    aiExtractEntities: `${API_VERSION}/ai/extract-entities`,
    aiClassify: `${API_VERSION}/ai/classify`,
    aiValidate: `${API_VERSION}/ai/validate`,
    aiStatus: `${API_VERSION}/ai/status`,

    // Usage
    usage: `${API_VERSION}/usage`,
    usageStats: `${API_VERSION}/usage/stats`,
} as const;

// Request timeout
export const REQUEST_TIMEOUT = 30000; // 30 seconds

// Default headers
export const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
};
