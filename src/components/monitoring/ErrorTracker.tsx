import React, { createContext, useContext, ReactNode, useCallback } from 'react';

interface ErrorInfo {
  error: Error;
  errorInfo?: any;
  timestamp: number;
  url: string;
  userAgent: string;
  userId?: string;
}

interface ErrorTrackerContextType {
  logError: (error: Error, errorInfo?: any, userId?: string) => void;
  getErrorHistory: () => ErrorInfo[];
  clearErrors: () => void;
}

const ErrorTrackerContext = createContext<ErrorTrackerContextType | undefined>(undefined);

interface ErrorTrackerProviderProps {
  children: ReactNode;
}

export const ErrorTrackerProvider: React.FC<ErrorTrackerProviderProps> = ({ children }) => {
  const logError = useCallback((error: Error, errorInfo?: any, userId?: string) => {
    const errorLog: ErrorInfo = {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } as Error,
      errorInfo,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      userId,
    };

    // Store in localStorage for persistence
    const existingErrors = JSON.parse(localStorage.getItem('error-logs') || '[]');
    existingErrors.push(errorLog);
    
    // Keep only last 50 errors
    if (existingErrors.length > 50) {
      existingErrors.splice(0, existingErrors.length - 50);
    }
    
    localStorage.setItem('error-logs', JSON.stringify(existingErrors));

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', errorLog);
    }

    // In production, you would send this to your error tracking service
    // Example: Sentry, LogRocket, etc.
  }, []);

  const getErrorHistory = useCallback(() => {
    return JSON.parse(localStorage.getItem('error-logs') || '[]');
  }, []);

  const clearErrors = useCallback(() => {
    localStorage.removeItem('error-logs');
  }, []);

  const value = {
    logError,
    getErrorHistory,
    clearErrors,
  };

  return (
    <ErrorTrackerContext.Provider value={value}>
      {children}
    </ErrorTrackerContext.Provider>
  );
};

export const useErrorTracker = () => {
  const context = useContext(ErrorTrackerContext);
  if (!context) {
    throw new Error('useErrorTracker must be used within an ErrorTrackerProvider');
  }
  return context;
};
