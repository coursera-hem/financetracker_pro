import React from 'react';
import Icon from '../../../components/AppIcon';

const BudgetMetricsStrip = ({ budgetData, selectedPeriod }) => {
  const metrics = [
    {
      id: 'utilization',
      label: 'Budget Utilization',
      value: budgetData?.utilizationPercentage,
      format: 'percentage',
      icon: 'Target',
      color: budgetData?.utilizationPercentage > 90 ? 'text-error' : budgetData?.utilizationPercentage > 75 ? 'text-warning' : 'text-success',
      bgColor: budgetData?.utilizationPercentage > 90 ? 'bg-error/10' : budgetData?.utilizationPercentage > 75 ? 'bg-warning/10' : 'bg-success/10'
    },
    {
      id: 'remaining',
      label: 'Remaining Budget',
      value: budgetData?.remainingAmount,
      format: 'currency',
      icon: 'Wallet',
      color: budgetData?.remainingAmount < 500 ? 'text-error' : budgetData?.remainingAmount < 1000 ? 'text-warning' : 'text-success',
      bgColor: budgetData?.remainingAmount < 500 ? 'bg-error/10' : budgetData?.remainingAmount < 1000 ? 'bg-warning/10' : 'bg-success/10'
    },
    {
      id: 'variance',
      label: 'Projected Variance',
      value: budgetData?.projectedVariance,
      format: 'currency',
      icon: 'TrendingUp',
      color: budgetData?.projectedVariance > 0 ? 'text-error' : 'text-success',
      bgColor: budgetData?.projectedVariance > 0 ? 'bg-error/10' : 'bg-success/10'
    },
    {
      id: 'daysRemaining',
      label: 'Days Remaining',
      value: budgetData?.daysRemaining,
      format: 'number',
      icon: 'Calendar',
      color: budgetData?.daysRemaining < 5 ? 'text-error' : budgetData?.daysRemaining < 10 ? 'text-warning' : 'text-muted-foreground',
      bgColor: budgetData?.daysRemaining < 5 ? 'bg-error/10' : budgetData?.daysRemaining < 10 ? 'bg-warning/10' : 'bg-muted/10'
    }
  ];

  const formatValue = (value, format) => {
    switch (format) {
      case 'percentage':
        return `${value}%`;
      case 'currency':
        return `$${Math.abs(value)?.toLocaleString()}`;
      case 'number':
        return value?.toString();
      default:
        return value;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics?.map((metric) => (
        <div key={metric?.id} className={`bg-card border border-border rounded-lg p-4 ${metric?.bgColor}`}>
          <div className="flex items-center justify-between mb-2">
            <div className={`w-10 h-10 rounded-lg ${metric?.bgColor} flex items-center justify-center`}>
              <Icon name={metric?.icon} size={20} className={metric?.color} />
            </div>
            {metric?.id === 'utilization' && (
              <div className="text-xs text-muted-foreground">
                {selectedPeriod}
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            <div className={`text-2xl font-semibold ${metric?.color}`}>
              {formatValue(metric?.value, metric?.format)}
            </div>
            <div className="text-sm text-muted-foreground">
              {metric?.label}
            </div>
          </div>

          {metric?.id === 'utilization' && (
            <div className="mt-3">
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    metric?.value > 90 ? 'bg-error' : metric?.value > 75 ? 'bg-warning' : 'bg-success'
                  }`}
                  style={{ width: `${Math.min(metric?.value, 100)}%` }}
                />
              </div>
            </div>
          )}

          {metric?.id === 'variance' && (
            <div className="mt-2 flex items-center space-x-1">
              <Icon 
                name={metric?.value > 0 ? 'TrendingUp' : 'TrendingDown'} 
                size={14} 
                className={metric?.color} 
              />
              <span className="text-xs text-muted-foreground">
                {metric?.value > 0 ? 'Over budget' : 'Under budget'}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BudgetMetricsStrip;