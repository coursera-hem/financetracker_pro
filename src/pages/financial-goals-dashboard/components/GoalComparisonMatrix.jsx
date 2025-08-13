import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const GoalComparisonMatrix = ({ goals }) => {
  const matrixData = goals?.map(goal => ({
    id: goal?.id,
    name: goal?.name,
    achievementProbability: goal?.achievementProbability,
    timeToCompletion: goal?.timeToCompletion,
    priority: goal?.priority,
    category: goal?.category,
    currentAmount: goal?.currentAmount,
    targetAmount: goal?.targetAmount
  }));

  const getColorByPriority = (priority) => {
    switch (priority) {
      case 'high':
        return '#EF4444'; // red-500
      case 'medium':
        return '#F59E0B'; // amber-500
      case 'low':
        return '#10B981'; // emerald-500
      default:
        return '#6B7280'; // gray-500
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-4 shadow-elevation-3">
          <h4 className="font-medium text-popover-foreground mb-2">{data?.name}</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Achievement Probability:</span>
              <span className="font-medium">{data?.achievementProbability}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time to Completion:</span>
              <span className="font-medium">{data?.timeToCompletion} months</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Priority:</span>
              <span className={`font-medium capitalize ${
                data?.priority === 'high' ? 'text-error' :
                data?.priority === 'medium' ? 'text-warning' : 'text-success'
              }`}>
                {data?.priority}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Progress:</span>
              <span className="font-medium">
                ${data?.currentAmount?.toLocaleString()} / ${data?.targetAmount?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={8}
        fill={getColorByPriority(payload?.priority)}
        stroke="#ffffff"
        strokeWidth={2}
        className="hover:r-10 transition-all cursor-pointer"
      />
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Goal Comparison Matrix</h3>
          <p className="text-sm text-muted-foreground">
            Achievement probability vs time to completion analysis
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-error rounded-full" />
            <span className="text-xs text-muted-foreground">High Priority</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning rounded-full" />
            <span className="text-xs text-muted-foreground">Medium Priority</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full" />
            <span className="text-xs text-muted-foreground">Low Priority</span>
          </div>
        </div>
      </div>
      <div className="h-80">
        {matrixData?.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart data={matrixData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                type="number"
                dataKey="timeToCompletion"
                name="Time to Completion"
                unit=" months"
                axisLine={false}
                tickLine={false}
                className="text-muted-foreground"
                domain={[0, 'dataMax + 6']}
              />
              <YAxis
                type="number"
                dataKey="achievementProbability"
                name="Achievement Probability"
                unit="%"
                axisLine={false}
                tickLine={false}
                className="text-muted-foreground"
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Scatter
                name="Goals"
                data={matrixData}
                shape={<CustomDot />}
              />
            </ScatterChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="BarChart3" size={24} className="text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No goals available for comparison</p>
            </div>
          </div>
        )}
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Target" size={16} className="text-success" />
            <span className="text-sm font-medium text-success">Optimal Zone</span>
          </div>
          <p className="text-xs text-muted-foreground">
            High probability (&gt;80%) with reasonable timeline (&lt;24 months)
          </p>
        </div>
        
        <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Clock" size={16} className="text-warning" />
            <span className="text-sm font-medium text-warning">Review Zone</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Moderate probability (60-80%) or extended timeline (&gt;24 months)
          </p>
        </div>
        
        <div className="p-4 bg-error/5 border border-error/20 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="AlertTriangle" size={16} className="text-error" />
            <span className="text-sm font-medium text-error">Risk Zone</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Low probability (&lt;60%) requiring strategy adjustment
          </p>
        </div>
      </div>
    </div>
  );
};

export default GoalComparisonMatrix;