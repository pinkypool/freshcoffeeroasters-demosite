// src/lib/security.ts
// Security utilities for form protection

/**
 * Honeypot field name - use this in forms as a hidden field
 * If this field has any value, it's likely a bot submission
 */
export const HONEYPOT_FIELD = '_hp_check';

/**
 * Check if honeypot field was filled (bot detection)
 */
export function isHoneypotFilled(formData: FormData | Record<string, unknown>): boolean {
    if (formData instanceof FormData) {
        const value = formData.get(HONEYPOT_FIELD);
        return value !== null && value !== '';
    }
    return formData[HONEYPOT_FIELD] !== undefined && formData[HONEYPOT_FIELD] !== '';
}

/**
 * Validate phone number format (Kazakhstan)
 */
export function isValidKZPhone(phone: string): boolean {
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '');
    // Should be 10-11 digits starting with 7
    return /^7\d{10}$/.test(digits) || /^\d{10}$/.test(digits);
}

/**
 * Sanitize string input (basic XSS prevention)
 */
export function sanitizeString(input: string): string {
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .trim();
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Generate a simple CSRF-like token for extra form protection
 */
export function generateFormToken(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 10);
    return `${timestamp}-${random}`;
}

/**
 * Validate form token (basic timing check)
 */
export function isValidFormToken(token: string, maxAgeMs = 3600000): boolean {
    if (!token || typeof token !== 'string') return false;

    const [timestampPart] = token.split('-');
    if (!timestampPart) return false;

    try {
        const timestamp = parseInt(timestampPart, 36);
        const age = Date.now() - timestamp;
        // Token should be between 1 second and maxAge old
        return age > 1000 && age < maxAgeMs;
    } catch {
        return false;
    }
}
