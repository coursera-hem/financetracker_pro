import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const SpendingTrendAnalysis = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('3m');
  const [selectedCategories, setSelectedCategories] = useState(['Food & Dining', 'Transportation']);

  const trendData = {
    '1m': [
      { period: 'Week 1', 'Food & Dining': 312, 'Transportation': 156, 'Shopping': 234, 'Entertainment': 89 },
      { period: 'Week 2', 'Food & Dining': 287, 'Transportation': 198, 'Shopping': 156, 'Entertainment': 123 },
      { period: 'Week 3', 'Food & Dining': 345, 'Transportation': 234, 'Shopping': 289, 'Entertainment': 167 },
      { period: 'Week 4', 'Food & Dining': 303, 'Transportation': 268, 'Shopping': 198, 'Entertainment': 145 }
    ],
    '3m': [
      { period: 'Jan', 'Food & Dining': 1247, 'Transportation': 856, 'Shopping': 743, 'Entertainment': 534 },
      { period: 'Feb', 'Food & Dining': 1156, 'Transportation': 923, 'Shopping': 612, 'Entertainment': 487 },
      { period: 'Mar', 'Food & Dining': 1334, 'Transportation': 789, 'Shopping': 834, 'Entertainment': 623 },
      { period: 'Apr', 'Food & Dining': 1289, 'Transportation': 867, 'Shopping': 756, 'Entertainment': 578 },
      { period: 'May', 'Food & Dining': 1423, 'Transportation': 934, 'Shopping': 689, 'Entertainment': 612 },
      { period: 'Jun', 'Food & Dining': 1367, 'Transportation': 812, 'Shopping': 723, 'Entertainment': 589 }
    ],
    '6m': [
      { period: 'Jan', 'Food & Dining': 1247, 'Transportation': 856, 'Shopping': 743, 'Entertainment': 534 },
      { period: 'Feb', 'Food & Dining': 1156, 'Transportation': 923, 'Shopping': 612, 'Entertainment': 487 },
      { period: 'Mar', 'Food & Dining': 1334, 'Transportation': 789, 'Shopping': 834, 'Entertainment': 623 },
      { period: 'Apr', 'Food & Dining': 1289, 'Transportation': 867, 'Shopping': 756, 'Entertainment': 578 },
      { period: 'May', 'Food & Dining': 1423, 'Transportation': 934, 'Shopping': 689, 'Entertainment': 612 },
      { period: 'Jun', 'Food & Dining': 1367, 'Transportation': 812, 'Shopping': 723, 'Entertainment': 589 }
    ]
  };

  const categories = [
    { name: 'Food & Dining', color: '#1E40AF' },
    { name: 'Transportation', color: '#059669' },
    { name: 'Shopping', color: '#7C3AED' },
    { name: 'Entertainment', color: '#F59E0B' }
  ];

  const periodOptions = [
    { value: '1m', label: '1 Month' },
    { value: '3m', label: '3 Months' },
    { value: '6m', label: '6 Months' }
  ];

  const toggleCategory = (categoryName) => {
    setSelectedCategories(prev => 
      prev?.includes(categoryName)
        ? prev?.filter(cat => cat !== categoryName)
        : [...prev, categoryName]
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation-3">
          <p className="font-medium text-popover-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry?.color }}
              />
              <span className="text-muted-foreground">{entry?.dataKey}:</span>
              <span className="font-medium text-popover-foreground">
                ${entry?.value?.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <h3 className="text-lg font-semibold text-foreground">Spending Trends</h3>
        
        <div className="flex items-center space-x-4">
          {/* Period Selector */}
          <div className="flex items-center space-x-2">
            {periodOptions?.map((option) => (
              <button
                key={option?.value}
                onClick={() => setSelectedPeriod(option?.value)}
                className={`px-3 py-1 rounded text-sm transition-smooth ${
                  selectedPeriod === option?.value
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {option?.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Category Toggles */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories?.map((category) => (
          <button
            key={category?.name}
            onClick={() => toggleCategory(category?.name)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-smooth ${
              selectedCategories?.includes(category?.name)
                ? 'border-primary bg-primary/10 text-primary' :'border-border text-muted-foreground hover:border-primary/50'
            }`}
          >
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: category?.color }}
            />
            <span className="text-sm font-medium">{category?.name}</span>
            {selectedCategories?.includes(category?.name) && (
              <Icon name="Check" size={14} />
            )}
          </button>
        ))}
      </div>
      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData?.[selectedPeriod]} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="period" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {categories?.map((category) => (
              selectedCategories?.includes(category?.name) && (
                <Line
                  key={category?.name}
                  type="monotone"
                  dataKey={category?.name}
                  stroke={category?.color}
                  strokeWidth={2}
                  dot={{ fill: category?.color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: category?.color, strokeWidth: 2 }}
                />
              )
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {selectedCategories?.map((categoryName) => {
            const categoryData = trendData?.[selectedPeriod];
            const values = categoryData?.map(item => item?.[categoryName]);
            const average = values?.reduce((sum, val) => sum + val, 0) / values?.length;
            const trend = values?.[values?.length - 1] - values?.[0];
            const trendPercentage = ((trend / values?.[0]) * 100)?.toFixed(1);
            
            return (
              <div key={categoryName} className="text-center">
                <div className="text-sm text-muted-foreground mb-1">{categoryName}</div>
                <div className="text-lg font-semibold text-foreground">
                  ${Math.round(average)?.toLocaleString()}
                </div>
                <div className={`text-xs flex items-center justify-center space-x-1 ${
                  trend >= 0 ? 'text-success' : 'text-error'
                }`}>
                  <Icon name={trend >= 0 ? 'TrendingUp' : 'TrendingDown'} size={12} />
                  <span>{Math.abs(trendPercentage)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SpendingTrendAnalysis;