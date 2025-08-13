import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const SpendingHeatmapCalendar = ({ spendingData, selectedMonth }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);

  // Generate calendar days for the selected month
  const generateCalendarDays = () => {
    const year = new Date()?.getFullYear();
    const month = selectedMonth;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate?.setDate(startDate?.getDate() - firstDay?.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dayData = spendingData?.find(d => 
        new Date(d.date)?.toDateString() === currentDate?.toDateString()
      );
      
      days?.push({
        date: new Date(currentDate),
        spending: dayData ? dayData?.amount : 0,
        transactions: dayData ? dayData?.transactions : 0,
        isCurrentMonth: currentDate?.getMonth() === month,
        isToday: currentDate?.toDateString() === new Date()?.toDateString()
      });
      
      currentDate?.setDate(currentDate?.getDate() + 1);
    }
    
    return days;
  };

  const getIntensityClass = (spending) => {
    if (spending === 0) return 'bg-muted/30';
    if (spending < 50) return 'bg-success/20';
    if (spending < 100) return 'bg-success/40';
    if (spending < 200) return 'bg-warning/40';
    if (spending < 500) return 'bg-warning/60';
    return 'bg-error/60';
  };

  const getIntensityLabel = (spending) => {
    if (spending === 0) return 'No spending';
    if (spending < 50) return 'Low spending';
    if (spending < 100) return 'Moderate spending';
    if (spending < 200) return 'High spending';
    if (spending < 500) return 'Very high spending';
    return 'Extreme spending';
  };

  const handleDateClick = (day) => {
    if (day?.isCurrentMonth && day?.spending > 0) {
      setSelectedDate(day?.date);
      // Dispatch event to show transaction details
      window.dispatchEvent(new CustomEvent('showTransactionDetails', {
        detail: { date: day.date, spending: day.spending, transactions: day.transactions }
      }));
    }
  };

  const calendarDays = generateCalendarDays();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Calendar" size={20} className="text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Spending Heatmap</h3>
            <p className="text-sm text-muted-foreground">
              {monthNames?.[selectedMonth]} {new Date()?.getFullYear()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">Less</span>
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-muted/30 rounded-sm" />
              <div className="w-3 h-3 bg-success/20 rounded-sm" />
              <div className="w-3 h-3 bg-success/40 rounded-sm" />
              <div className="w-3 h-3 bg-warning/40 rounded-sm" />
              <div className="w-3 h-3 bg-warning/60 rounded-sm" />
              <div className="w-3 h-3 bg-error/60 rounded-sm" />
            </div>
            <span className="text-xs text-muted-foreground">More</span>
          </div>
        </div>
      </div>
      {/* Calendar Grid */}
      <div className="space-y-2">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames?.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays?.map((day, index) => (
            <div
              key={index}
              className={`
                relative aspect-square rounded-sm cursor-pointer transition-all duration-200
                ${getIntensityClass(day?.spending)}
                ${!day?.isCurrentMonth ? 'opacity-30' : ''}
                ${day?.isToday ? 'ring-2 ring-primary ring-offset-1' : ''}
                ${selectedDate?.toDateString() === day?.date?.toDateString() ? 'ring-2 ring-accent ring-offset-1' : ''}
                ${day?.spending > 0 && day?.isCurrentMonth ? 'hover:scale-110 hover:z-10' : ''}
              `}
              onClick={() => handleDateClick(day)}
              onMouseEnter={() => setHoveredDate(day)}
              onMouseLeave={() => setHoveredDate(null)}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-xs font-medium ${
                  day?.isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {day?.date?.getDate()}
                </span>
              </div>

              {/* Hover tooltip */}
              {hoveredDate?.date?.toDateString() === day?.date?.toDateString() && day?.isCurrentMonth && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-20">
                  <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation-3 min-w-48">
                    <div className="text-sm font-medium text-popover-foreground mb-1">
                      {day?.date?.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Spending:</span>
                        <span className="font-medium">${day?.spending?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Transactions:</span>
                        <span className="font-medium">{day?.transactions}</span>
                      </div>
                      <div className="pt-1 border-t border-border">
                        <span className="text-muted-foreground">{getIntensityLabel(day?.spending)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">
              ${spendingData?.reduce((sum, day) => sum + day?.amount, 0)?.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Total Spending</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">
              ${Math.round(spendingData?.reduce((sum, day) => sum + day?.amount, 0) / spendingData?.filter(d => d?.amount > 0)?.length || 0)?.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Daily Average</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">
              {Math.max(...spendingData?.map(d => d?.amount))?.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Highest Day</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">
              {spendingData?.filter(d => d?.amount > 0)?.length}
            </div>
            <div className="text-xs text-muted-foreground">Active Days</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpendingHeatmapCalendar;