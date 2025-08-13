import React, { useState, useEffect } from 'react';
import Select from './Select';
import Button from './Button';


const GlobalContextBar = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [selectedAccounts, setSelectedAccounts] = useState(['all']);
  const [currency, setCurrency] = useState('USD');
  const [isExpanded, setIsExpanded] = useState(false);

  const dateRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' },
    { value: 'custom', label: 'Custom range' }
  ];

  const accountOptions = [
    { value: 'all', label: 'All Accounts' },
    { value: 'checking', label: 'Checking Account' },
    { value: 'savings', label: 'Savings Account' },
    { value: 'credit', label: 'Credit Cards' },
    { value: 'investment', label: 'Investment Accounts' }
  ];

  const currencyOptions = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'CAD', label: 'CAD (C$)' }
  ];

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedPreferences = localStorage.getItem('financeTrackerPreferences');
    if (savedPreferences) {
      const preferences = JSON.parse(savedPreferences);
      setDateRange(preferences?.dateRange || '30d');
      setSelectedAccounts(preferences?.selectedAccounts || ['all']);
      setCurrency(preferences?.currency || 'USD');
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    const preferences = {
      dateRange,
      selectedAccounts,
      currency
    };
    localStorage.setItem('financeTrackerPreferences', JSON.stringify(preferences));
  }, [dateRange, selectedAccounts, currency]);

  const handleRefresh = () => {
    // Trigger data refresh across the application
    window.dispatchEvent(new CustomEvent('refreshFinancialData'));
  };

  const handleExport = () => {
    // Trigger export functionality
    window.dispatchEvent(new CustomEvent('exportFinancialData', {
      detail: { dateRange, selectedAccounts, currency }
    }));
  };

  return (
    <div className="fixed top-16 left-0 right-0 z-999 bg-muted border-b border-border">
      <div className="px-6 py-3">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between space-x-6">
          <div className="flex items-center space-x-4">
            <Select
              options={dateRangeOptions}
              value={dateRange}
              onChange={setDateRange}
              placeholder="Select date range"
              className="w-40"
            />
            
            <Select
              options={accountOptions}
              value={selectedAccounts}
              onChange={setSelectedAccounts}
              multiple
              placeholder="Select accounts"
              className="w-48"
            />
            
            <Select
              options={currencyOptions}
              value={currency}
              onChange={setCurrency}
              placeholder="Currency"
              className="w-32"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="RefreshCw"
              onClick={handleRefresh}
              className="text-muted-foreground hover:text-foreground"
            >
              Refresh
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              iconName="Download"
              onClick={handleExport}
              className="text-muted-foreground hover:text-foreground"
            >
              Export
            </Button>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-foreground">Filters</span>
              <span className="text-xs text-muted-foreground">
                {dateRangeOptions?.find(opt => opt?.value === dateRange)?.label} • {currency}
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-muted-foreground hover:text-foreground"
            />
          </div>

          {isExpanded && (
            <div className="mt-4 space-y-3">
              <Select
                label="Date Range"
                options={dateRangeOptions}
                value={dateRange}
                onChange={setDateRange}
                placeholder="Select date range"
              />
              
              <Select
                label="Accounts"
                options={accountOptions}
                value={selectedAccounts}
                onChange={setSelectedAccounts}
                multiple
                placeholder="Select accounts"
              />
              
              <Select
                label="Currency"
                options={currencyOptions}
                value={currency}
                onChange={setCurrency}
                placeholder="Currency"
              />

              <div className="flex items-center space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="RefreshCw"
                  onClick={handleRefresh}
                  fullWidth
                >
                  Refresh Data
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Download"
                  onClick={handleExport}
                  fullWidth
                >
                  Export
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalContextBar;