import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const SpendingHeatmap = () => {
  const [selectedView, setSelectedView] = useState('daily'); // daily, hourly
  const [selectedMonth, setSelectedMonth] = useState('current');

  // Mock heatmap data for daily spending
  const dailyHeatmapData = [
    // Week 1
    [0, 45, 123, 89, 156, 234, 178],
    // Week 2  
    [67, 234, 156, 198, 267, 345, 289],
    // Week 3
    [123, 189, 234, 167, 298, 234, 198],
    // Week 4
    [89, 156, 198, 234, 189, 267, 156],
    // Week 5 (partial)
    [134, 198, 0, 0, 0, 0, 0]
  ];

  // Mock hourly heatmap data (24 hours x 7 days)
  const hourlyHeatmapData = Array.from({ length: 24 }, (_, hour) => 
    Array.from({ length: 7 }, (_, day) => {
      // Simulate spending patterns - higher during meal times and evenings
      let baseSpending = 0;
      if (hour >= 7 && hour <= 9) baseSpending = 15; // Breakfast
      else if (hour >= 11 && hour <= 14) baseSpending = 25; // Lunch
      else if (hour >= 17 && hour <= 21) baseSpending = 35; // Dinner/Evening
      else if (hour >= 22 || hour <= 6) baseSpending = 5; // Night/Early morning
      else baseSpending = 10; // Other times
      
      // Add some randomness and weekend variations
      const weekendMultiplier = (day === 0 || day === 6) ? 1.3 : 1;
      return Math.round(baseSpending * weekendMultiplier * (0.7 + Math.random() * 0.6));
    })
  );

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getIntensityColor = (value, maxValue) => {
    const intensity = value / maxValue;
    if (intensity === 0) return 'bg-muted';
    if (intensity <= 0.2) return 'bg-primary/20';
    if (intensity <= 0.4) return 'bg-primary/40';
    if (intensity <= 0.6) return 'bg-primary/60';
    if (intensity <= 0.8) return 'bg-primary/80';
    return 'bg-primary';
  };

  const getDailyMaxValue = () => Math.max(...dailyHeatmapData?.flat());
  const getHourlyMaxValue = () => Math.max(...hourlyHeatmapData?.flat());

  const renderDailyHeatmap = () => {
    const maxValue = getDailyMaxValue();
    
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-8 gap-1 text-xs text-muted-foreground mb-2">
          <div></div>
          {daysOfWeek?.map(day => (
            <div key={day} className="text-center font-medium">{day}</div>
          ))}
        </div>
        {dailyHeatmapData?.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-8 gap-1">
            <div className="text-xs text-muted-foreground font-medium py-1">
              W{weekIndex + 1}
            </div>
            {week?.map((value, dayIndex) => (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className={`h-8 rounded border border-border cursor-pointer transition-all hover:scale-110 hover:shadow-elevation-1 ${
                  getIntensityColor(value, maxValue)
                }`}
                title={`${daysOfWeek?.[dayIndex]}, Week ${weekIndex + 1}: $${value}`}
              >
                <div className="h-full flex items-center justify-center">
                  {value > 0 && (
                    <span className="text-xs font-medium text-white">
                      ${value}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const renderHourlyHeatmap = () => {
    const maxValue = getHourlyMaxValue();
    
    return (
      <div className="space-y-1">
        <div className="grid grid-cols-8 gap-1 text-xs text-muted-foreground mb-2">
          <div></div>
          {daysOfWeek?.map(day => (
            <div key={day} className="text-center font-medium">{day}</div>
          ))}
        </div>
        {hourlyHeatmapData?.map((hourData, hourIndex) => (
          <div key={hourIndex} className="grid grid-cols-8 gap-1">
            <div className="text-xs text-muted-foreground font-medium py-1 w-8">
              {hourIndex?.toString()?.padStart(2, '0')}:00
            </div>
            {hourData?.map((value, dayIndex) => (
              <div
                key={`${hourIndex}-${dayIndex}`}
                className={`h-4 rounded border border-border cursor-pointer transition-all hover:scale-110 hover:shadow-elevation-1 ${
                  getIntensityColor(value, maxValue)
                }`}
                title={`${daysOfWeek?.[dayIndex]} ${hourIndex}:00 - $${value}`}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  const getInsights = () => {
    if (selectedView === 'daily') {
      const flatData = dailyHeatmapData?.flat();
      const maxDay = Math.max(...flatData);
      const avgSpending = flatData?.reduce((sum, val) => sum + val, 0) / flatData?.filter(val => val > 0)?.length;
      
      return [
        `Highest spending day: $${maxDay}`,
        `Average daily spending: $${Math.round(avgSpending)}`,
        `Most active spending days: Weekends`
      ];
    } else {
      const maxHour = Math.max(...hourlyHeatmapData?.flat());
      const peakHours = hourlyHeatmapData?.map((hourData, index) => ({
        hour: index,
        total: hourData?.reduce((sum, val) => sum + val, 0)
      }))?.sort((a, b) => b?.total - a?.total)?.slice(0, 3);
      
      return [
        `Peak spending hour: ${peakHours?.[0]?.hour}:00`,
        `Highest single transaction: $${maxHour}`,
        `Most active periods: Evening hours (17-21)`
      ];
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <h3 className="text-lg font-semibold text-foreground">Spending Pattern Heatmap</h3>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSelectedView('daily')}
            className={`px-3 py-1 rounded text-sm transition-smooth ${
              selectedView === 'daily' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setSelectedView('hourly')}
            className={`px-3 py-1 rounded text-sm transition-smooth ${
              selectedView === 'hourly' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            Hourly
          </button>
        </div>
      </div>
      {/* Heatmap */}
      <div className="mb-6 overflow-x-auto">
        <div className="min-w-96">
          {selectedView === 'daily' ? renderDailyHeatmap() : renderHourlyHeatmap()}
        </div>
      </div>
      {/* Legend */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Less</span>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded bg-muted border border-border" />
            <div className="w-3 h-3 rounded bg-primary/20 border border-border" />
            <div className="w-3 h-3 rounded bg-primary/40 border border-border" />
            <div className="w-3 h-3 rounded bg-primary/60 border border-border" />
            <div className="w-3 h-3 rounded bg-primary/80 border border-border" />
            <div className="w-3 h-3 rounded bg-primary border border-border" />
          </div>
          <span className="text-sm text-muted-foreground">More</span>
        </div>
      </div>
      {/* Insights */}
      <div className="pt-6 border-t border-border">
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Pattern Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {getInsights()?.map((insight, index) => (
            <div key={index} className="flex items-start space-x-2">
              <Icon name="TrendingUp" size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm text-foreground">{insight}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpendingHeatmap;