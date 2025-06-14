
import DOMPurify from 'dompurify';

// XSS Prevention utilities
export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target'],
    ALLOWED_URI_REGEXP: /^https?:\/\//
  });
};

export const sanitizeText = (text: string): string => {
  return text
    .replace(/[<>]/g, '') // Remove HTML brackets
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// Input validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// CSRF Protection
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const setCSRFToken = (token: string): void => {
  sessionStorage.setItem('csrf_token', token);
};

export const getCSRFToken = (): string | null => {
  return sessionStorage.getItem('csrf_token');
};

export const validateCSRFToken = (token: string): boolean => {
  const storedToken = getCSRFToken();
  return storedToken === token;
};

// Secure session management
export const secureSessionStorage = {
  setItem: (key: string, value: string): void => {
    try {
      const encrypted = btoa(value); // Basic encoding (in production, use proper encryption)
      sessionStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Failed to store session data:', error);
    }
  },
  
  getItem: (key: string): string | null => {
    try {
      const encrypted = sessionStorage.getItem(key);
      return encrypted ? atob(encrypted) : null;
    } catch (error) {
      console.error('Failed to retrieve session data:', error);
      return null;
    }
  },
  
  removeItem: (key: string): void => {
    sessionStorage.removeItem(key);
  },
  
  clear: (): void => {
    sessionStorage.clear();
  }
};

// Content Security Policy helpers
export const createNonce = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
};

// Prevent clickjacking
export const isInIframe = (): boolean => {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
};

// Safe URL validation
export const validateUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};
