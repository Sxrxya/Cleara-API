// Data Inspection Utilities
// Helper functions for validating and inspecting data before ingestion

export interface ValidationResult {
    warnings: string[];
    quality: {
        score: number;
        issues: string[];
        suggestions: string[];
    };
}

export function validateData(data: any): ValidationResult {
    const warnings: string[] = [];
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 100;

    // Check if data exists
    if (!data) {
        warnings.push('No data provided');
        score = 0;
        return { warnings, quality: { score, issues, suggestions } };
    }

    // Check data structure
    if (Array.isArray(data)) {
        if (data.length === 0) {
            warnings.push('Empty array - no data to process');
            issues.push('No records found');
            score -= 50;
        } else if (data.length > 1000) {
            warnings.push(`Large dataset (${data.length} records) - processing may take time`);
            suggestions.push('Consider filtering or batching the data');
        }

        // Check first record for structure
        if (data.length > 0) {
            const firstRecord = data[0];
            const requiredFields = ['timestamp', 'message'];
            const missingFields = requiredFields.filter(field => !(field in firstRecord));

            if (missingFields.length > 0) {
                warnings.push(`Missing recommended fields: ${missingFields.join(', ')}`);
                issues.push('Incomplete data structure');
                score -= 20;
                suggestions.push('Add timestamp and message fields for better correlation');
            }
        }
    } else if (typeof data === 'object') {
        // Check for required fields
        const requiredFields = ['timestamp', 'message'];
        const missingFields = requiredFields.filter(field => !(field in data));

        if (missingFields.length > 0) {
            warnings.push(`Missing recommended fields: ${missingFields.join(', ')}`);
            issues.push('Incomplete data structure');
            score -= 20;
            suggestions.push('Add timestamp and message fields for better correlation');
        }

        // Check timestamp format
        if (data.timestamp) {
            const timestamp = new Date(data.timestamp);
            if (isNaN(timestamp.getTime())) {
                warnings.push('Invalid timestamp format');
                issues.push('Timestamp parsing failed');
                score -= 15;
                suggestions.push('Use ISO 8601 format (e.g., 2026-02-09T12:00:00Z)');
            }
        }

        // Check for empty values
        const emptyFields = Object.keys(data).filter(key => !data[key]);
        if (emptyFields.length > 0) {
            warnings.push(`Empty fields detected: ${emptyFields.join(', ')}`);
            score -= 10;
        }
    }

    return {
        warnings,
        quality: {
            score: Math.max(score, 0),
            issues,
            suggestions
        }
    };
}

export function prepareInspectionData(data: any, source: string) {
    return {
        source,
        data,
        recordCount: Array.isArray(data) ? data.length : 1,
        preview: Array.isArray(data) ? data.slice(0, 5) : data,
        fields: Array.isArray(data) && data.length > 0
            ? Object.keys(data[0])
            : typeof data === 'object' ? Object.keys(data) : []
    };
}
