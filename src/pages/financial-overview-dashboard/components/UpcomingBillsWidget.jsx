import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UpcomingBillsWidget = ({ bills }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'overdue': return 'text-error bg-error/10';
      case 'due-soon': return 'text-warning bg-warning/10';
      case 'paid': return 'text-success bg-success/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'overdue': return 'AlertCircle';
      case 'due-soon': return 'Clock';
      case 'paid': return 'CheckCircle';
      default: return 'Circle';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    return `${diffDays} days`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Upcoming Bills</h3>
          <p className="text-sm text-muted-foreground">Next 30 days</p>
        </div>
        <Button variant="ghost" size="sm" iconName="Plus">
          Add Bill
        </Button>
      </div>
      <div className="space-y-4">
        {bills?.map((bill) => (
          <div key={bill?.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(bill?.status)}`}>
                <Icon name={getStatusIcon(bill?.status)} size={16} />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground">{bill?.name}</h4>
                <p className="text-xs text-muted-foreground">{formatDate(bill?.dueDate)}</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">
                ${bill?.amount?.toLocaleString()}
              </p>
              {bill?.status !== 'paid' && (
                <Button variant="ghost" size="xs" className="text-xs text-primary hover:text-primary-foreground hover:bg-primary">
                  Pay Now
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total upcoming</span>
          <span className="font-semibold text-foreground">
            ${bills?.reduce((sum, bill) => bill?.status !== 'paid' ? sum + bill?.amount : sum, 0)?.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UpcomingBillsWidget;