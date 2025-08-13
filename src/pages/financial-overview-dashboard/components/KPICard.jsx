import React from 'react';
import Icon from '../../../components/AppIcon';

const KPICard = ({ title, value, change, changeType, icon, currency = '$' }) => {
  const formatValue = (val) => {
    if (typeof val === 'number') {
      return val?.toLocaleString('en-US', {
        style: 'currency',
        currency: currency === '$' ? 'USD' : 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });
    }
    return val;
  };

  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-error';
    return 'text-muted-foreground';
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') return 'TrendingUp';
    if (changeType === 'negative') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1 hover:shadow-elevation-2 transition-smooth">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name={icon} size={20} className="text-primary" />
        </div>
        <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
          <Icon name={getChangeIcon()} size={16} />
          <span className="text-sm font-medium">{change}</span>
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-2xl font-semibold text-foreground">
          {formatValue(value)}
        </h3>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </div>
  );
};

export default KPICard;