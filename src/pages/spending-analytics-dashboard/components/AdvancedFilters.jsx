import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const AdvancedFilters = ({ onFiltersChange, onReset }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    categories: [],
    merchants: [],
    amountRange: { min: '', max: '' },
    transactionTypes: [],
    tags: [],
    naturalLanguageQuery: ''
  });

  const categoryOptions = [
    { value: 'food_dining', label: 'Food & Dining' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'bills_utilities', label: 'Bills & Utilities' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'travel', label: 'Travel' },
    { value: 'education', label: 'Education' }
  ];

  const merchantOptions = [
    { value: 'amazon', label: 'Amazon' },
    { value: 'starbucks', label: 'Starbucks' },
    { value: 'shell', label: 'Shell Gas Station' },
    { value: 'whole_foods', label: 'Whole Foods' },
    { value: 'netflix', label: 'Netflix' },
    { value: 'target', label: 'Target' },
    { value: 'uber', label: 'Uber' },
    { value: 'spotify', label: 'Spotify' }
  ];

  const transactionTypeOptions = [
    { value: 'purchase', label: 'Purchase' },
    { value: 'refund', label: 'Refund' },
    { value: 'transfer', label: 'Transfer' },
    { value: 'subscription', label: 'Subscription' },
    { value: 'recurring', label: 'Recurring' },
    { value: 'one_time', label: 'One-time' }
  ];

  const tagOptions = [
    { value: 'business', label: 'Business' },
    { value: 'personal', label: 'Personal' },
    { value: 'essential', label: 'Essential' },
    { value: 'discretionary', label: 'Discretionary' },
    { value: 'planned', label: 'Planned' },
    { value: 'impulse', label: 'Impulse' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      dateRange: { start: '', end: '' },
      categories: [],
      merchants: [],
      amountRange: { min: '', max: '' },
      transactionTypes: [],
      tags: [],
      naturalLanguageQuery: ''
    };
    setFilters(resetFilters);
    onReset?.(resetFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters?.dateRange?.start || filters?.dateRange?.end) count++;
    if (filters?.categories?.length > 0) count++;
    if (filters?.merchants?.length > 0) count++;
    if (filters?.amountRange?.min || filters?.amountRange?.max) count++;
    if (filters?.transactionTypes?.length > 0) count++;
    if (filters?.tags?.length > 0) count++;
    if (filters?.naturalLanguageQuery?.trim()) count++;
    return count;
  };

  const handleNaturalLanguageSearch = () => {
    // In a real app, this would integrate with Gemini AI
    console.log('Processing natural language query:', filters?.naturalLanguageQuery);
    // Simulate AI processing
    if (filters?.naturalLanguageQuery?.toLowerCase()?.includes('starbucks')) {
      handleFilterChange('merchants', ['starbucks']);
    }
    if (filters?.naturalLanguageQuery?.toLowerCase()?.includes('food')) {
      handleFilterChange('categories', ['food_dining']);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1">
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} className="text-primary" />
          <h3 className="font-semibold text-foreground">Advanced Filters</h3>
          {getActiveFilterCount() > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              {getActiveFilterCount()} active
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {getActiveFilterCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-muted-foreground hover:text-foreground"
            >
              Reset
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-muted-foreground hover:text-foreground"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>
      </div>
      {/* Natural Language Search - Always Visible */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <Input
              placeholder="Ask about your spending... (e.g., 'Show me all Starbucks purchases last month')"
              value={filters?.naturalLanguageQuery}
              onChange={(e) => handleFilterChange('naturalLanguageQuery', e?.target?.value)}
              onKeyPress={(e) => e?.key === 'Enter' && handleNaturalLanguageSearch()}
            />
          </div>
          <Button
            variant="primary"
            size="sm"
            iconName="Search"
            onClick={handleNaturalLanguageSearch}
            disabled={!filters?.naturalLanguageQuery?.trim()}
          >
            Search
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Powered by AI - Ask questions in natural language about your spending patterns
        </p>
      </div>
      {/* Expanded Filters */}
      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={filters?.dateRange?.start}
              onChange={(e) => handleFilterChange('dateRange', { 
                ...filters?.dateRange, 
                start: e?.target?.value 
              })}
            />
            <Input
              label="End Date"
              type="date"
              value={filters?.dateRange?.end}
              onChange={(e) => handleFilterChange('dateRange', { 
                ...filters?.dateRange, 
                end: e?.target?.value 
              })}
            />
          </div>

          {/* Categories and Merchants */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Categories"
              options={categoryOptions}
              value={filters?.categories}
              onChange={(value) => handleFilterChange('categories', value)}
              multiple
              searchable
              placeholder="Select categories..."
            />
            
            <Select
              label="Merchants"
              options={merchantOptions}
              value={filters?.merchants}
              onChange={(value) => handleFilterChange('merchants', value)}
              multiple
              searchable
              placeholder="Select merchants..."
            />
          </div>

          {/* Amount Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Minimum Amount"
              type="number"
              placeholder="0.00"
              value={filters?.amountRange?.min}
              onChange={(e) => handleFilterChange('amountRange', { 
                ...filters?.amountRange, 
                min: e?.target?.value 
              })}
            />
            <Input
              label="Maximum Amount"
              type="number"
              placeholder="1000.00"
              value={filters?.amountRange?.max}
              onChange={(e) => handleFilterChange('amountRange', { 
                ...filters?.amountRange, 
                max: e?.target?.value 
              })}
            />
          </div>

          {/* Transaction Types and Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Transaction Types"
              options={transactionTypeOptions}
              value={filters?.transactionTypes}
              onChange={(value) => handleFilterChange('transactionTypes', value)}
              multiple
              placeholder="Select transaction types..."
            />
            
            <Select
              label="Tags"
              options={tagOptions}
              value={filters?.tags}
              onChange={(value) => handleFilterChange('tags', value)}
              multiple
              placeholder="Select tags..."
            />
          </div>

          {/* Quick Filter Presets */}
          <div className="pt-4 border-t border-border">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Quick Presets</h4>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  handleFilterChange('categories', ['food_dining']);
                  handleFilterChange('amountRange', { min: '50', max: '' });
                }}
              >
                High Food Spending
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  handleFilterChange('transactionTypes', ['subscription']);
                }}
              >
                Subscriptions Only
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  handleFilterChange('tags', ['impulse']);
                }}
              >
                Impulse Purchases
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const lastWeek = new Date();
                  lastWeek?.setDate(lastWeek?.getDate() - 7);
                  handleFilterChange('dateRange', { 
                    start: lastWeek?.toISOString()?.split('T')?.[0], 
                    end: new Date()?.toISOString()?.split('T')?.[0] 
                  });
                }}
              >
                Last 7 Days
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;