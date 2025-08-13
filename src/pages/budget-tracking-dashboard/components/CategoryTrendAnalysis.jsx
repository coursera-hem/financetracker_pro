import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CategoryTrendAnalysis = ({ trendData, selectedCategories, onCategoryToggle }) => {
  const [viewMode, setViewMode] = useState('spending'); // 'spending' or 'budget'
  const [timeRange, setTimeRange] = useState('6months'); // '3months', '6months', '1year'

  const categoryColors = {
    'Food & Dining': '#10B981',
    'Transportation': '#3B82F6',
    'Shopping': '#8B5CF6',
    'Entertainment': '#F59E0B',
    'Bills & Utilities': '#EF4444',
    'Healthcare': '#06B6D4',
    'Travel': '#84CC16',
    'Education': '#F97316'
  };

  const getTimeRangeData = () => {
    const months = timeRange === '3months' ? 3 : timeRange === '6months' ? 6 : 12;
    return trendData?.slice(-months);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation-3">
          <p className="font-medium text-popover-foreground mb-2">{label}</p>
          <div className="space-y-1">
            {payload?.map((entry, index) => (
              <div key={index} className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry?.color }}
                  />
                  <span className="text-sm text-muted-foreground">{entry?.dataKey}:</span>
                </div>
                <span className="text-sm font-medium">${entry?.value?.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const calculateTrend = (categoryName) => {
    const data = getTimeRangeData();
    if (data?.length < 2) return { direction: 'stable', percentage: 0 };
    
    const firstValue = data?.[0]?.[categoryName] || 0;
    const lastValue = data?.[data?.length - 1]?.[categoryName] || 0;
    
    if (firstValue === 0) return { direction: 'stable', percentage: 0 };
    
    const percentage = ((lastValue - firstValue) / firstValue) * 100;
    const direction = percentage > 5 ? 'up' : percentage < -5 ? 'down' : 'stable';
    
    return { direction, percentage: Math.abs(percentage) };
  };

  const getTrendIcon = (direction) => {
    switch (direction) {
      case 'up': return 'TrendingUp';
      case 'down': return 'TrendingDown';
      default: return 'Minus';
    }
  };

  const getTrendColor = (direction) => {
    switch (direction) {
      case 'up': return 'text-error';
      case 'down': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="TrendingUp" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Category Trends</h3>
            <p className="text-sm text-muted-foreground">
              Spending patterns over {timeRange === '3months' ? '3 months' : timeRange === '6months' ? '6 months' : '1 year'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e?.target?.value)}
            className="text-sm border border-border rounded-md px-3 py-1 bg-background text-foreground"
          >
            <option value="3months">3 Months</option>
            <option value="6months">6 Months</option>
            <option value="1year">1 Year</option>
          </select>
          
          <Button
            variant={viewMode === 'spending' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('spending')}
          >
            Spending
          </Button>
          <Button
            variant={viewMode === 'budget' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('budget')}
          >
            Budget
          </Button>
        </div>
      </div>
      {/* Category Selection */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {Object.keys(categoryColors)?.map((category) => {
            const isSelected = selectedCategories?.includes(category);
            const trend = calculateTrend(category);
            
            return (
              <button
                key={category}
                onClick={() => onCategoryToggle(category)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                  isSelected 
                    ? 'bg-primary text-primary-foreground shadow-elevation-1' 
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                }`}
              >
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: isSelected ? 'currentColor' : categoryColors?.[category] }}
                />
                <span>{category}</span>
                <Icon 
                  name={getTrendIcon(trend?.direction)} 
                  size={12} 
                  className={isSelected ? 'text-primary-foreground' : getTrendColor(trend?.direction)} 
                />
              </button>
            );
          })}
        </div>
      </div>
      {/* Trend Chart */}
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={getTimeRangeData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="month" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000)?.toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {selectedCategories?.map((category) => (
              <Line
                key={category}
                type="monotone"
                dataKey={category}
                stroke={categoryColors?.[category]}
                strokeWidth={2}
                dot={{ fill: categoryColors?.[category], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: categoryColors?.[category], strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Trend Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {selectedCategories?.slice(0, 4)?.map((category) => {
          const trend = calculateTrend(category);
          const latestData = getTimeRangeData()?.[getTimeRangeData()?.length - 1];
          const currentSpending = latestData ? latestData?.[category] : 0;
          
          return (
            <div key={category} className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: categoryColors?.[category] }}
                  />
                  <span className="text-sm font-medium text-foreground truncate">
                    {category}
                  </span>
                </div>
                <Icon 
                  name={getTrendIcon(trend?.direction)} 
                  size={14} 
                  className={getTrendColor(trend?.direction)} 
                />
              </div>
              <div className="space-y-1">
                <div className="text-lg font-semibold text-foreground">
                  ${currentSpending?.toLocaleString()}
                </div>
                <div className={`text-xs ${getTrendColor(trend?.direction)}`}>
                  {trend?.direction === 'stable' ? 'No change' : 
                   `${trend?.direction === 'up' ? '+' : '-'}${trend?.percentage?.toFixed(1)}%`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Insights */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="Lightbulb" size={16} className="text-accent" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-foreground mb-2">AI Insights</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Your Food & Dining spending has increased by 15% over the last 3 months, primarily due to weekend dining out.</p>
              <p>• Transportation costs are trending down (-8%) thanks to your increased use of public transit.</p>
              <p>• Consider setting a stricter budget for Entertainment category as it's showing consistent upward trend.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryTrendAnalysis;