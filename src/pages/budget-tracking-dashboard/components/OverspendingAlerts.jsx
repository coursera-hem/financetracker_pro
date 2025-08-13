import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OverspendingAlerts = ({ alerts }) => {
  const [expandedAlert, setExpandedAlert] = useState(null);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-error/10',
          border: 'border-error/20',
          text: 'text-error',
          icon: 'AlertTriangle'
        };
      case 'warning':
        return {
          bg: 'bg-warning/10',
          border: 'border-warning/20',
          text: 'text-warning',
          icon: 'AlertCircle'
        };
      case 'info':
        return {
          bg: 'bg-primary/10',
          border: 'border-primary/20',
          text: 'text-primary',
          icon: 'Info'
        };
      default:
        return {
          bg: 'bg-muted/10',
          border: 'border-border',
          text: 'text-muted-foreground',
          icon: 'Bell'
        };
    }
  };

  const handleDismissAlert = (alertId) => {
    // Dispatch event to parent component
    window.dispatchEvent(new CustomEvent('dismissAlert', {
      detail: { alertId }
    }));
  };

  const handleTakeAction = (action, alertId) => {
    // Dispatch event for specific actions
    window.dispatchEvent(new CustomEvent('budgetAction', {
      detail: { action, alertId }
    }));
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
            <Icon name="AlertTriangle" size={20} className="text-warning" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Spending Alerts</h3>
            <p className="text-sm text-muted-foreground">
              {alerts?.length} active alert{alerts?.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          iconName="Settings"
          className="text-muted-foreground hover:text-foreground"
        >
          Settings
        </Button>
      </div>
      <div className="space-y-4">
        {alerts?.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="CheckCircle" size={24} className="text-success" />
            </div>
            <h4 className="text-lg font-medium text-foreground mb-2">All Good!</h4>
            <p className="text-sm text-muted-foreground">
              No overspending alerts at the moment. Keep up the great work!
            </p>
          </div>
        ) : (
          alerts?.map((alert) => {
            const severity = getSeverityColor(alert?.severity);
            const isExpanded = expandedAlert === alert?.id;
            
            return (
              <div 
                key={alert?.id}
                className={`${severity?.bg} ${severity?.border} border rounded-lg p-4 transition-all duration-200`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`w-8 h-8 ${severity?.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon name={severity?.icon} size={16} className={severity?.text} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-medium text-foreground truncate">
                          {alert?.category}
                        </h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${severity?.bg} ${severity?.text} font-medium`}>
                          {alert?.severity?.toUpperCase()}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {alert?.message}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>Budget: ${alert?.budget?.toLocaleString()}</span>
                        <span>Spent: ${alert?.spent?.toLocaleString()}</span>
                        <span className={severity?.text}>
                          {alert?.overagePercentage}% over
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
                      onClick={() => setExpandedAlert(isExpanded ? null : alert?.id)}
                      className="text-muted-foreground hover:text-foreground"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="X"
                      onClick={() => handleDismissAlert(alert?.id)}
                      className="text-muted-foreground hover:text-foreground"
                    />
                  </div>
                </div>
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-foreground mb-2">AI Recommendations:</h5>
                      <ul className="space-y-1">
                        {alert?.recommendations?.map((rec, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start space-x-2">
                            <Icon name="ArrowRight" size={12} className="mt-1 flex-shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {alert?.actions?.map((action) => (
                        <Button
                          key={action?.id}
                          variant="outline"
                          size="sm"
                          onClick={() => handleTakeAction(action?.type, alert?.id)}
                          className="text-xs"
                        >
                          {action?.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      {alerts?.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Last updated: {new Date()?.toLocaleTimeString()}
            </span>
            <Button
              variant="ghost"
              size="sm"
              iconName="RefreshCw"
              className="text-muted-foreground hover:text-foreground"
            >
              Refresh
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverspendingAlerts;