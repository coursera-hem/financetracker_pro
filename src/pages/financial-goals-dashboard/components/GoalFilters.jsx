import React from 'react';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const GoalFilters = ({ 
  selectedCategory, 
  setSelectedCategory,
  timeHorizon,
  setTimeHorizon,
  achievementThreshold,
  setAchievementThreshold,
  onResetFilters 
}) => {
  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'savings', label: 'Savings Goals' },
    { value: 'debt', label: 'Debt Payoff' },
    { value: 'investment', label: 'Investment Goals' },
    { value: 'purchase', label: 'Purchase Goals' },
    { value: 'emergency', label: 'Emergency Fund' }
  ];

  const timeHorizonOptions = [
    { value: 'all', label: 'All Time Horizons' },
    { value: 'short', label: 'Short-term (< 1 year)' },
    { value: 'medium', label: 'Medium-term (1-3 years)' },
    { value: 'long', label: 'Long-term (> 3 years)' }
  ];

  const thresholdOptions = [
    { value: 0, label: 'All Goals (0%+)' },
    { value: 50, label: 'Likely (50%+)' },
    { value: 70, label: 'Very Likely (70%+)' },
    { value: 85, label: 'Highly Likely (85%+)' }
  ];

  const hasActiveFilters = selectedCategory !== 'all' || timeHorizon !== 'all' || achievementThreshold > 0;

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-elevation-1 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={16} className="text-muted-foreground" />
          <h3 className="font-medium text-foreground">Goal Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onResetFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear All
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select
          label="Category"
          options={categoryOptions}
          value={selectedCategory}
          onChange={setSelectedCategory}
          placeholder="Select category"
        />
        
        <Select
          label="Time Horizon"
          options={timeHorizonOptions}
          value={timeHorizon}
          onChange={setTimeHorizon}
          placeholder="Select time horizon"
        />
        
        <Select
          label="Achievement Probability"
          options={thresholdOptions}
          value={achievementThreshold}
          onChange={setAchievementThreshold}
          placeholder="Select threshold"
        />

        <div className="flex items-end">
          <Button
            variant="outline"
            iconName="RefreshCw"
            onClick={() => window.dispatchEvent(new CustomEvent('refreshGoalData'))}
            className="w-full"
          >
            Refresh Data
          </Button>
        </div>
      </div>
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedCategory !== 'all' && (
            <div className="flex items-center space-x-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              <span>Category: {categoryOptions?.find(opt => opt?.value === selectedCategory)?.label}</span>
              <button onClick={() => setSelectedCategory('all')}>
                <Icon name="X" size={14} />
              </button>
            </div>
          )}
          
          {timeHorizon !== 'all' && (
            <div className="flex items-center space-x-1 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm">
              <span>Time: {timeHorizonOptions?.find(opt => opt?.value === timeHorizon)?.label}</span>
              <button onClick={() => setTimeHorizon('all')}>
                <Icon name="X" size={14} />
              </button>
            </div>
          )}
          
          {achievementThreshold > 0 && (
            <div className="flex items-center space-x-1 px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">
              <span>Probability: {achievementThreshold}%+</span>
              <button onClick={() => setAchievementThreshold(0)}>
                <Icon name="X" size={14} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GoalFilters;