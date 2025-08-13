import React from 'react';
import Icon from '../../../components/AppIcon';

const GoalProgressCard = ({ goal }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'on-track':
        return 'text-success';
      case 'behind':
        return 'text-warning';
      case 'at-risk':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'on-track':
        return 'TrendingUp';
      case 'behind':
        return 'Clock';
      case 'at-risk':
        return 'AlertTriangle';
      default:
        return 'Target';
    }
  };

  const progressPercentage = (goal?.currentAmount / goal?.targetAmount) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1 hover:shadow-elevation-2 transition-smooth">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name={goal?.icon} size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{goal?.name}</h3>
            <p className="text-sm text-muted-foreground">{goal?.category}</p>
          </div>
        </div>
        <div className={`flex items-center space-x-1 ${getStatusColor(goal?.status)}`}>
          <Icon name={getStatusIcon(goal?.status)} size={16} />
          <span className="text-xs font-medium capitalize">{goal?.status?.replace('-', ' ')}</span>
        </div>
      </div>
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-muted/20"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="text-primary transition-all duration-1000 ease-out"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-foreground">
              {Math.round(progressPercentage)}%
            </span>
            <span className="text-xs text-muted-foreground">Complete</span>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Current</span>
          <span className="font-semibold text-foreground">${goal?.currentAmount?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Target</span>
          <span className="font-semibold text-foreground">${goal?.targetAmount?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Remaining</span>
          <span className="font-semibold text-foreground">
            ${(goal?.targetAmount - goal?.currentAmount)?.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-border">
          <span className="text-sm text-muted-foreground">Target Date</span>
          <span className="font-medium text-foreground">{goal?.targetDate}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Projected</span>
          <span className={`font-medium ${getStatusColor(goal?.status)}`}>
            {goal?.projectedDate}
          </span>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Monthly Contribution</span>
          <span className="font-medium text-foreground">${goal?.monthlyContribution}</span>
        </div>
      </div>
    </div>
  );
};

export default GoalProgressCard;