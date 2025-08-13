import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';

const BudgetCategoryChart = ({ categoryData, viewMode }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const getBarColor = (category) => {
    const utilizationRate = (category?.actual / category?.budget) * 100;
    if (utilizationRate > 100) return '#EF4444'; // red-500
    if (utilizationRate > 85) return '#F59E0B'; // amber-500
    return '#10B981'; // emerald-500
  };

  const getProjectedColor = (category) => {
    const projectedRate = (category?.projected / category?.budget) * 100;
    if (projectedRate > 100) return '#FCA5A5'; // red-300
    if (projectedRate > 85) return '#FCD34D'; // amber-300
    return '#6EE7B7'; // emerald-300
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation-3">
          <p className="font-medium text-popover-foreground mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Budget:</span>
              <span className="font-medium">${data?.budget?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Actual:</span>
              <span className="font-medium">${data?.actual?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Projected:</span>
              <span className="font-medium">${data?.projected?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-border">
              <span className="text-muted-foreground">Utilization:</span>
              <span className={`font-medium ${
                (data?.actual / data?.budget) > 1 ? 'text-error' : 
                (data?.actual / data?.budget) > 0.85 ? 'text-warning' : 'text-success'
              }`}>
                {((data?.actual / data?.budget) * 100)?.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(selectedCategory === category?.name ? null : category?.name);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="BarChart3" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Budget vs Actual Spending</h3>
            <p className="text-sm text-muted-foreground">
              {viewMode === 'budget' ? 'Budget allocation view' : 'Actual spending view'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full" />
            <span className="text-xs text-muted-foreground">Actual</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success/50 rounded-full" />
            <span className="text-xs text-muted-foreground">Projected</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 border-2 border-muted-foreground rounded-full" />
            <span className="text-xs text-muted-foreground">Budget</span>
          </div>
        </div>
      </div>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={categoryData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="name" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000)?.toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Budget line */}
            <Bar dataKey="budget" fill="transparent" stroke="var(--color-muted-foreground)" strokeWidth={2} />
            
            {/* Actual spending */}
            <Bar dataKey="actual" radius={[4, 4, 0, 0]}>
              {categoryData?.map((entry, index) => (
                <Cell key={`actual-${index}`} fill={getBarColor(entry)} />
              ))}
            </Bar>
            
            {/* Projected spending */}
            <Bar dataKey="projected" radius={[4, 4, 0, 0]} opacity={0.6}>
              {categoryData?.map((entry, index) => (
                <Cell key={`projected-${index}`} fill={getProjectedColor(entry)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Category Details */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoryData?.slice(0, 6)?.map((category) => (
          <div 
            key={category?.name}
            className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
              selectedCategory === category?.name 
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
            }`}
            onClick={() => handleCategoryClick(category)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">{category?.name}</span>
              <Icon 
                name={category?.icon} 
                size={16} 
                className="text-muted-foreground" 
              />
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  ${category?.actual?.toLocaleString()} / ${category?.budget?.toLocaleString()}
                </span>
                <span className={`font-medium ${
                  (category?.actual / category?.budget) > 1 ? 'text-error' : 
                  (category?.actual / category?.budget) > 0.85 ? 'text-warning' : 'text-success'
                }`}>
                  {((category?.actual / category?.budget) * 100)?.toFixed(0)}%
                </span>
              </div>
              
              <div className="w-full bg-muted rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    (category?.actual / category?.budget) > 1 ? 'bg-error' : 
                    (category?.actual / category?.budget) > 0.85 ? 'bg-warning' : 'bg-success'
                  }`}
                  style={{ width: `${Math.min((category?.actual / category?.budget) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetCategoryChart;