import React from 'react';
import Icon from '../../../components/AppIcon';

const SpendingKPICards = () => {
  const kpiData = [
    {
      id: 'velocity',
      title: 'Spending Velocity',
      value: '$2,847',
      change: '+12.5%',
      trend: 'up',
      description: 'Weekly average',
      sparklineData: [2100, 2300, 2500, 2700, 2847],
      color: 'text-primary'
    },
    {
      id: 'diversification',
      title: 'Category Diversification',
      value: '8.2',
      change: '+0.3',
      trend: 'up',
      description: 'Diversity index',
      sparklineData: [7.5, 7.8, 8.0, 8.1, 8.2],
      color: 'text-secondary'
    },
    {
      id: 'recurring_ratio',
      title: 'Recurring vs Discretionary',
      value: '65:35',
      change: '-2%',
      trend: 'down',
      description: 'Ratio split',
      sparklineData: [70, 68, 67, 66, 65],
      color: 'text-accent'
    },
    {
      id: 'seasonal_variance',
      title: 'Seasonal Variance',
      value: '18.4%',
      change: '+5.2%',
      trend: 'up',
      description: 'Monthly deviation',
      sparklineData: [15, 16, 17, 18, 18.4],
      color: 'text-warning'
    }
  ];

  const renderSparkline = (data, color) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    
    const points = data?.map((value, index) => {
      const x = (index / (data?.length - 1)) * 60;
      const y = 20 - ((value - min) / range) * 20;
      return `${x},${y}`;
    })?.join(' ');

    return (
      <svg width="60" height="20" className="opacity-60">
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          points={points}
          className={color}
        />
      </svg>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {kpiData?.map((kpi) => (
        <div key={kpi?.id} className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {kpi?.title}
              </h3>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-semibold text-foreground">
                  {kpi?.value}
                </span>
                <div className={`flex items-center space-x-1 text-sm ${
                  kpi?.trend === 'up' ? 'text-success' : 'text-error'
                }`}>
                  <Icon 
                    name={kpi?.trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                    size={14} 
                  />
                  <span>{kpi?.change}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              {renderSparkline(kpi?.sparklineData, kpi?.color)}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {kpi?.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SpendingKPICards;