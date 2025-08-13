import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BudgetAdjustmentSliders = ({ categories, onBudgetChange }) => {
  const [adjustments, setAdjustments] = useState({});
  const [totalBudget, setTotalBudget] = useState(0);
  const [originalTotal, setOriginalTotal] = useState(0);
  const [isScenarioMode, setIsScenarioMode] = useState(false);

  useEffect(() => {
    const total = categories?.reduce((sum, cat) => sum + cat?.budget, 0);
    setOriginalTotal(total);
    setTotalBudget(total);
    
    // Initialize adjustments
    const initialAdjustments = {};
    categories?.forEach(cat => {
      initialAdjustments[cat.name] = cat?.budget;
    });
    setAdjustments(initialAdjustments);
  }, [categories]);

  const handleSliderChange = (categoryName, newValue) => {
    const updatedAdjustments = {
      ...adjustments,
      [categoryName]: newValue
    };
    setAdjustments(updatedAdjustments);
    
    const newTotal = Object.values(updatedAdjustments)?.reduce((sum, val) => sum + val, 0);
    setTotalBudget(newTotal);
    
    if (onBudgetChange) {
      onBudgetChange(updatedAdjustments, newTotal);
    }
  };

  const handleResetBudgets = () => {
    const resetAdjustments = {};
    categories?.forEach(cat => {
      resetAdjustments[cat.name] = cat?.budget;
    });
    setAdjustments(resetAdjustments);
    setTotalBudget(originalTotal);
    setIsScenarioMode(false);
  };

  const handleApplyChanges = () => {
    // Dispatch event to apply budget changes
    window.dispatchEvent(new CustomEvent('applyBudgetChanges', {
      detail: { adjustments, totalBudget }
    }));
    setIsScenarioMode(false);
  };

  const getImpactColor = (categoryName) => {
    const original = categories?.find(cat => cat?.name === categoryName)?.budget || 0;
    const adjusted = adjustments?.[categoryName] || 0;
    const change = ((adjusted - original) / original) * 100;
    
    if (Math.abs(change) < 5) return 'text-muted-foreground';
    if (change > 0) return 'text-success';
    return 'text-error';
  };

  const getImpactIcon = (categoryName) => {
    const original = categories?.find(cat => cat?.name === categoryName)?.budget || 0;
    const adjusted = adjustments?.[categoryName] || 0;
    const change = ((adjusted - original) / original) * 100;
    
    if (Math.abs(change) < 5) return 'Minus';
    if (change > 0) return 'TrendingUp';
    return 'TrendingDown';
  };

  const calculateImpact = (categoryName) => {
    const original = categories?.find(cat => cat?.name === categoryName)?.budget || 0;
    const adjusted = adjustments?.[categoryName] || 0;
    const change = ((adjusted - original) / original) * 100;
    return change;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="Sliders" size={20} className="text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Budget Adjustments</h3>
            <p className="text-sm text-muted-foreground">
              {isScenarioMode ? 'Scenario modeling active' : 'Real-time budget planning'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="RotateCcw"
            onClick={handleResetBudgets}
            className="text-muted-foreground hover:text-foreground"
          >
            Reset
          </Button>
          <Button
            variant={isScenarioMode ? "primary" : "outline"}
            size="sm"
            iconName="Play"
            onClick={() => setIsScenarioMode(!isScenarioMode)}
          >
            {isScenarioMode ? 'Exit Scenario' : 'Scenario Mode'}
          </Button>
        </div>
      </div>
      {/* Total Budget Summary */}
      <div className="mb-6 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Total Monthly Budget</div>
            <div className="text-2xl font-semibold text-foreground">
              ${totalBudget?.toLocaleString()}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Change from Original</div>
            <div className={`text-lg font-medium ${
              totalBudget > originalTotal ? 'text-error' : 
              totalBudget < originalTotal ? 'text-success' : 'text-muted-foreground'
            }`}>
              {totalBudget > originalTotal ? '+' : ''}
              ${(totalBudget - originalTotal)?.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
      {/* Category Sliders */}
      <div className="space-y-6">
        {categories?.map((category) => {
          const currentValue = adjustments?.[category?.name] || category?.budget;
          const maxValue = category?.budget * 2; // Allow up to 200% of original
          const impact = calculateImpact(category?.name);
          
          return (
            <div key={category?.name} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon name={category?.icon} size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{category?.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={getImpactIcon(category?.name)} 
                    size={14} 
                    className={getImpactColor(category?.name)} 
                  />
                  <span className={`text-sm font-medium ${getImpactColor(category?.name)}`}>
                    {Math.abs(impact) < 5 ? '0' : impact > 0 ? '+' : ''}{impact?.toFixed(0)}%
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>$0</span>
                  <span className="font-medium text-foreground">
                    ${currentValue?.toLocaleString()}
                  </span>
                  <span>${maxValue?.toLocaleString()}</span>
                </div>
                
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max={maxValue}
                    step="50"
                    value={currentValue}
                    onChange={(e) => handleSliderChange(category?.name, parseInt(e?.target?.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, 
                        var(--color-primary) 0%, 
                        var(--color-primary) ${(currentValue / maxValue) * 100}%, 
                        var(--color-muted) ${(currentValue / maxValue) * 100}%, 
                        var(--color-muted) 100%)`
                    }}
                  />
                  
                  {/* Original budget marker */}
                  <div 
                    className="absolute top-0 w-1 h-2 bg-accent rounded-full transform -translate-x-1/2"
                    style={{ left: `${(category?.budget / maxValue) * 100}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    Original: ${category?.budget?.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">
                    Spent: ${category?.actual?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Action Buttons */}
      {isScenarioMode && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Scenario impact: {totalBudget > originalTotal ? 'Increased' : 'Decreased'} budget by ${Math.abs(totalBudget - originalTotal)?.toLocaleString()}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetBudgets}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleApplyChanges}
              >
                Apply Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetAdjustmentSliders;