import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const NetWorthChart = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const netWorth = payload?.find(p => p?.dataKey === 'assets')?.value - payload?.find(p => p?.dataKey === 'liabilities')?.value;
      
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation-3">
          <p className="text-sm font-medium text-popover-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry?.color }}
                />
                <span className="text-sm text-muted-foreground capitalize">{entry?.dataKey}:</span>
              </div>
              <span className="text-sm font-medium text-popover-foreground">
                ${entry?.value?.toLocaleString()}
              </span>
            </div>
          ))}
          <div className="border-t border-border mt-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-popover-foreground">Net Worth:</span>
              <span className="text-sm font-semibold text-primary">
                ${netWorth?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Net Worth Timeline</h3>
          <p className="text-sm text-muted-foreground">Assets vs Liabilities over time</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full" />
            <span className="text-sm text-muted-foreground">Assets</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-accent rounded-full" />
            <span className="text-sm text-muted-foreground">Liabilities</span>
          </div>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="assetsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="liabilitiesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
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
            <Area
              type="monotone"
              dataKey="assets"
              stackId="1"
              stroke="var(--color-primary)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#assetsGradient)"
            />
            <Area
              type="monotone"
              dataKey="liabilities"
              stackId="2"
              stroke="var(--color-accent)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#liabilitiesGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default NetWorthChart;