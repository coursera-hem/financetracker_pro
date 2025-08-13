import React, { useState, useEffect } from 'react';

const NavigationProgressIndicator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingType, setLoadingType] = useState('');

  useEffect(() => {
    // Listen for global loading events
    const handleLoadingStart = (event) => {
      setIsLoading(true);
      setProgress(0);
      setLoadingType(event?.detail?.type || 'data');
      
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 200);
    };

    const handleLoadingComplete = () => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
        setLoadingType('');
      }, 300);
    };

    const handleLoadingError = () => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
        setLoadingType('');
      }, 500);
    };

    // Listen for various loading events
    window.addEventListener('financialDataLoading', handleLoadingStart);
    window.addEventListener('financialDataLoaded', handleLoadingComplete);
    window.addEventListener('financialDataError', handleLoadingError);
    window.addEventListener('refreshFinancialData', handleLoadingStart);
    window.addEventListener('exportFinancialData', handleLoadingStart);

    // Listen for navigation changes
    const handleRouteChange = () => {
      handleLoadingStart({ detail: { type: 'navigation' } });
      setTimeout(handleLoadingComplete, 800);
    };

    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('financialDataLoading', handleLoadingStart);
      window.removeEventListener('financialDataLoaded', handleLoadingComplete);
      window.removeEventListener('financialDataError', handleLoadingError);
      window.removeEventListener('refreshFinancialData', handleLoadingStart);
      window.removeEventListener('exportFinancialData', handleLoadingStart);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  if (!isLoading) return null;

  const getLoadingMessage = () => {
    switch (loadingType) {
      case 'navigation':
        return 'Loading dashboard...';
      case 'export':
        return 'Preparing export...';
      case 'refresh':
        return 'Refreshing data...';
      case 'analysis':
        return 'Analyzing spending patterns...';
      default:
        return 'Loading financial data...';
    }
  };

  return (
    <div className="fixed top-16 left-0 right-0 z-1001">
      {/* Progress Bar */}
      <div className="h-1 bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Loading Message - Desktop */}
      <div className="hidden md:block absolute top-1 right-6">
        <div className="bg-popover border border-border rounded-md px-3 py-1 shadow-elevation-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-muted-foreground">{getLoadingMessage()}</span>
          </div>
        </div>
      </div>

      {/* Loading Message - Mobile */}
      <div className="md:hidden bg-muted border-b border-border px-6 py-2">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-muted-foreground">{getLoadingMessage()}</span>
        </div>
      </div>
    </div>
  );
};

export default NavigationProgressIndicator;