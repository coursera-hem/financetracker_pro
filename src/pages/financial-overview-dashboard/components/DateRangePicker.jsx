import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DateRangePicker = ({ selectedRange, onRangeChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const dateRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '3m', label: 'Last 3 months' },
    { value: '6m', label: 'Last 6 months' },
    { value: '1y', label: 'Last year' },
    { value: 'custom', label: 'Custom range' }
  ];

  const handleRangeSelect = (range) => {
    onRangeChange(range);
    setIsOpen(false);
  };

  const getCurrentLabel = () => {
    const range = dateRanges?.find(r => r?.value === selectedRange);
    return range ? range?.label : 'Select range';
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        iconName="Calendar"
        onClick={() => setIsOpen(!isOpen)}
        className="text-muted-foreground hover:text-foreground"
      >
        {getCurrentLabel()}
      </Button>
      {isOpen && (
        <>
          <div className="absolute top-full left-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-elevation-3 z-1001">
            <div className="py-2">
              {dateRanges?.map((range) => (
                <button
                  key={range?.value}
                  onClick={() => handleRangeSelect(range?.value)}
                  className={`flex items-center justify-between w-full px-4 py-2 text-sm transition-hover ${
                    selectedRange === range?.value
                      ? 'bg-primary text-primary-foreground'
                      : 'text-popover-foreground hover:bg-muted'
                  }`}
                >
                  <span>{range?.label}</span>
                  {selectedRange === range?.value && (
                    <Icon name="Check" size={16} />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          <div
            className="fixed inset-0 z-1000"
            onClick={() => setIsOpen(false)}
          />
        </>
      )}
    </div>
  );
};

export default DateRangePicker;