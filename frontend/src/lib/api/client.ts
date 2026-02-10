/**
 * API Client - Handles all backend communication
 */

import { API_BASE_URL, ENDPOINTS, DEFAULT_HEADERS, REQUEST_TIMEOUT } from './config';

// Types
export interface ApiResponse<T = any> {
    data?: T;
    error?: string;
    message?: string;
    success: boolean;
}

export interface CleanDataRequest {
    data: Record<string, any>;
    options?: {
        remove_duplicates?: boolean;
        standardize_case?: boolean;
        trim_whitespace?: boolean;
    };
}

export interface ValidateDataRequest {
    data: Record<string, any>;
    validation_type: 'email' | 'phone' | 'url' | 'date' | 'all';
}

export interface AICleanRequest {
    data: Record<string, any>;
    instructions?: string;
    provider?: 'groq' | 'gemini' | 'huggingface';
}

/**
 * Base API client with error handling
 */
class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    /**
     * Make a request to the API
     */
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseUrl}${endpoint}`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...DEFAULT_HEADERS,
                    ...options.headers,
                },
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data.message || data.error || 'Request failed',
                    data: null,
                };
            }

            return {
                success: true,
                data,
            };
        } catch (error: any) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                return {
                    success: false,
                    error: 'Request timeout',
                };
            }

            return {
                success: false,
                error: error.message || 'Network error',
            };
        }
    }

    /**
     * GET request
     */
    async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    /**
     * POST request
     */
    async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    /**
     * PUT request
     */
    async put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }

    /**
     * DELETE request
     */
    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }

    // ============================================================================
    // HEALTH ENDPOINTS
    // ============================================================================

    /**
     * Check API health
     */
    async checkHealth() {
        return this.get(ENDPOINTS.health);
    }

    /**
     * Check if API is ready
     */
    async checkReady() {
        return this.get(ENDPOINTS.healthReady);
    }

    // ============================================================================
    // DATA CLEANING ENDPOINTS
    // ============================================================================

    /**
     * Clean data using rule-based cleaning
     */
    async cleanData(request: CleanDataRequest) {
        return this.post(ENDPOINTS.clean, request);
    }

    /**
     * Validate data
     */
    async validateData(request: ValidateDataRequest) {
        return this.post(ENDPOINTS.validate, request);
    }

    /**
     * Deduplicate records
     */
    async deduplicateData(data: Record<string, any>[]) {
        return this.post(ENDPOINTS.deduplicate, { records: data });
    }

    /**
     * Detect schema from data
     */
    async detectSchema(data: Record<string, any>[]) {
        return this.post(ENDPOINTS.detectSchema, { data });
    }

    /**
     * Enrich data
     */
    async enrichData(data: Record<string, any>) {
        return this.post(ENDPOINTS.enrich, { data });
    }

    // ============================================================================
    // AI ENDPOINTS (NEW!)
    // ============================================================================

    /**
     * Clean data using AI
     */
    async aiCleanData(request: AICleanRequest) {
        return this.post(ENDPOINTS.aiClean, request);
    }

    /**
     * Extract entities from text using AI
     */
    async aiExtractEntities(text: string) {
        return this.post(ENDPOINTS.aiExtractEntities, { text });
    }

    /**
     * Classify text using AI
     */
    async aiClassifyText(text: string, labels: string[]) {
        return this.post(ENDPOINTS.aiClassify, { text, labels });
    }

    /**
     * Validate data using AI
     */
    async aiValidateData(data: Record<string, any>, schema: Record<string, any>) {
        return this.post(ENDPOINTS.aiValidate, { data, schema });
    }

    /**
     * Get AI service status
     */
    async getAIStatus() {
        return this.get(ENDPOINTS.aiStatus);
    }

    // ============================================================================
    // USAGE ENDPOINTS
    // ============================================================================

    /**
     * Get usage statistics
     */
    async getUsageStats() {
        return this.get(ENDPOINTS.usageStats);
    }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export class for custom instances
export default ApiClient;
