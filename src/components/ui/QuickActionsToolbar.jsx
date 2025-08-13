import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Button from './Button';
import Icon from '../AppIcon';

const QuickActionsToolbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [contextActions, setContextActions] = useState([]);

  // Define context-specific actions based on current route
  useEffect(() => {
    const getContextActions = () => {
      switch (location?.pathname) {
        case '/financial-overview-dashboard':
          return [
            { id: 'export-overview', label: 'Export Overview', icon: 'Download', action: 'exportOverview' },
            { id: 'share-snapshot', label: 'Share Snapshot', icon: 'Share2', action: 'shareSnapshot' },
            { id: 'print-summary', label: 'Print Summary', icon: 'Printer', action: 'printSummary' }
          ];
        case '/budget-tracking-dashboard':
          return [
            { id: 'export-budget', label: 'Export Budget', icon: 'Download', action: 'exportBudget' },
            { id: 'create-budget', label: 'New Budget', icon: 'Plus', action: 'createBudget' },
            { id: 'budget-alerts', label: 'Set Alerts', icon: 'Bell', action: 'setBudgetAlerts' }
          ];
        case '/spending-analytics-dashboard':
          return [
            { id: 'export-analytics', label: 'Export Report', icon: 'Download', action: 'exportAnalytics' },
            { id: 'share-insights', label: 'Share Insights', icon: 'Share2', action: 'shareInsights' },
            { id: 'schedule-report', label: 'Schedule Report', icon: 'Calendar', action: 'scheduleReport' }
          ];
        case '/financial-goals-dashboard':
          return [
            { id: 'export-goals', label: 'Export Goals', icon: 'Download', action: 'exportGoals' },
            { id: 'create-goal', label: 'New Goal', icon: 'Target', action: 'createGoal' },
            { id: 'share-progress', label: 'Share Progress', icon: 'Share2', action: 'shareProgress' }
          ];
        default:
          return [
            { id: 'export-data', label: 'Export Data', icon: 'Download', action: 'exportData' },
            { id: 'refresh-data', label: 'Refresh', icon: 'RefreshCw', action: 'refreshData' }
          ];
      }
    };

    setContextActions(getContextActions());
  }, [location?.pathname]);

  const handleAction = (actionType) => {
    setIsMobileMenuOpen(false);
    
    // Dispatch custom events for different actions
    switch (actionType) {
      case 'exportOverview':
        window.dispatchEvent(new CustomEvent('exportFinancialData', {
          detail: { type: 'overview', format: 'pdf' }
        }));
        break;
      case 'exportBudget':
        window.dispatchEvent(new CustomEvent('exportFinancialData', {
          detail: { type: 'budget', format: 'excel' }
        }));
        break;
      case 'exportAnalytics':
        window.dispatchEvent(new CustomEvent('exportFinancialData', {
          detail: { type: 'analytics', format: 'pdf' }
        }));
        break;
      case 'exportGoals':
        window.dispatchEvent(new CustomEvent('exportFinancialData', {
          detail: { type: 'goals', format: 'pdf' }
        }));
        break;
      case 'shareSnapshot': case'shareInsights': case'shareProgress':
        window.dispatchEvent(new CustomEvent('shareFinancialData', {
          detail: { type: actionType }
        }));
        break;
      case 'createBudget':
        window.dispatchEvent(new CustomEvent('openModal', {
          detail: { type: 'createBudget' }
        }));
        break;
      case 'createGoal':
        window.dispatchEvent(new CustomEvent('openModal', {
          detail: { type: 'createGoal' }
        }));
        break;
      case 'setBudgetAlerts':
        window.dispatchEvent(new CustomEvent('openModal', {
          detail: { type: 'budgetAlerts' }
        }));
        break;
      case 'scheduleReport':
        window.dispatchEvent(new CustomEvent('openModal', {
          detail: { type: 'scheduleReport' }
        }));
        break;
      case 'refreshData':
        window.dispatchEvent(new CustomEvent('refreshFinancialData'));
        break;
      default:
        console.log(`Action ${actionType} triggered`);
    }
  };

  return (
    <>
      {/* Desktop Toolbar */}
      <div className="hidden md:flex items-center space-x-2">
        {contextActions?.slice(0, 3)?.map((action) => (
          <Button
            key={action?.id}
            variant="ghost"
            size="sm"
            iconName={action?.icon}
            onClick={() => handleAction(action?.action)}
            className="text-muted-foreground hover:text-foreground"
          >
            {action?.label}
          </Button>
        ))}
      </div>
      {/* Mobile Floating Action Button */}
      <div className="md:hidden">
        <Button
          variant="primary"
          size="icon"
          iconName="Plus"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="fixed bottom-6 right-6 z-1000 w-14 h-14 rounded-full shadow-elevation-3"
        />

        {/* Mobile Actions Menu */}
        {isMobileMenuOpen && (
          <div className="fixed bottom-24 right-6 z-1001">
            <div className="bg-popover border border-border rounded-lg shadow-elevation-4 py-2 min-w-48">
              {contextActions?.map((action) => (
                <button
                  key={action?.id}
                  onClick={() => handleAction(action?.action)}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-popover-foreground hover:bg-muted transition-hover"
                >
                  <Icon name={action?.icon} size={16} />
                  <span>{action?.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-999 bg-black/20"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </div>
    </>
  );
};

export default QuickActionsToolbar;