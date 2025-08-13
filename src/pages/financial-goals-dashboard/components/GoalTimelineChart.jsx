import React from 'react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import Icon from '../../../components/AppIcon';


const GoalTimelineChart = ({ selectedGoal, timelineData }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation-3">
          <p className="text-sm font-medium text-popover-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry?.color }}
              />
              <span className="text-sm text-popover-foreground">
                {entry?.name}: ${entry?.value?.toLocaleString()}
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Goal Progress Timeline</h3>
          <p className="text-sm text-muted-foreground">
            {selectedGoal ? selectedGoal?.name : 'Select a goal to view timeline'}
          </p>
        </div>
        {selectedGoal && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full" />
              <span className="text-sm text-muted-foreground">Actual Progress</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-secondary rounded-full" />
              <span className="text-sm text-muted-foreground">Projected Path</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-accent/50 rounded-full" />
              <span className="text-sm text-muted-foreground">Confidence Range</span>
            </div>
          </div>
        )}
      </div>
      <div className="h-80">
        {selectedGoal && timelineData?.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                className="text-muted-foreground"
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                className="text-muted-foreground"
                tickFormatter={(value) => `$${(value / 1000)?.toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Confidence Range */}
              <Area
                type="monotone"
                dataKey="confidenceHigh"
                stackId="1"
                stroke="none"
                fill="var(--color-accent)"
                fillOpacity={0.1}
              />
              <Area
                type="monotone"
                dataKey="confidenceLow"
                stackId="1"
                stroke="none"
                fill="var(--color-background)"
                fillOpacity={1}
              />
              
              {/* Projected Path */}
              <Line
                type="monotone"
                dataKey="projected"
                stroke="var(--color-secondary)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                activeDot={{ r: 4, fill: "var(--color-secondary)" }}
              />
              
              {/* Actual Progress */}
              <Line
                type="monotone"
                dataKey="actual"
                stroke="var(--color-primary)"
                strokeWidth={3}
                dot={{ fill: "var(--color-primary)", r: 4 }}
                activeDot={{ r: 6, fill: "var(--color-primary)" }}
              />
              
              {/* Target Line */}
              <Line
                type="monotone"
                dataKey="target"
                stroke="var(--color-muted-foreground)"
                strokeWidth={1}
                strokeDasharray="2 2"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Target" size={24} className="text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Select a goal to view progress timeline</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalTimelineChart;