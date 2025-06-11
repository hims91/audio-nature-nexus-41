
export const getStorageErrorType = (error: unknown): 'quota' | 'generic' => {
  if (error instanceof DOMException && 
     (error.name === 'QuotaExceededError' || 
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
    return 'quota';
  }
  return 'generic';
};

export const getStorageErrorMessage = (errorType: 'quota' | 'generic') => {
  switch (errorType) {
    case 'quota':
      return {
        title: "Storage Limit Reached",
        description: "Your browser's storage limit has been reached. Try removing some items or images.",
        variant: "destructive" as const
      };
    case 'generic':
      return {
        title: "Error Saving Data",
        description: "There was a problem saving your portfolio data to browser storage.",
        variant: "destructive" as const
      };
  }
};

export const getStorageWarningMessage = (sizeInMB: string) => {
  if (parseFloat(sizeInMB) > 4.5) {
    return {
      title: "Storage Warning",
      description: "Your portfolio data is getting large. Consider removing unused items."
    };
  }
  return null;
};
