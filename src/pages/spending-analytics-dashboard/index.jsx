import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import GlobalContextBar from '../../components/ui/GlobalContextBar';
import NavigationProgressIndicator from '../../components/ui/NavigationProgressIndicator';
import QuickActionsToolbar from '../../components/ui/QuickActionsToolbar';
import SpendingKPICards from './components/SpendingKPICards';
import CategoryBreakdownChart from './components/CategoryBreakdownChart';
import SpendingTrendAnalysis from './components/SpendingTrendAnalysis';
import SpendingHeatmap from './components/SpendingHeatmap';
import AnomalyDetection from './components/AnomalyDetection';
import MerchantAnalysis from './components/MerchantAnalysis';
import AdvancedFilters from './components/AdvancedFilters';
import Icon from '../../components/AppIcon';

const SpendingAnalyticsDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // Simulate data loading
    const loadData = async () => {
      setIsLoading(true);
      window.dispatchEvent(new CustomEvent('financialDataLoading', {
        detail: { type: 'analysis' }
      }));
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsLoading(false);
      window.dispatchEvent(new CustomEvent('financialDataLoaded'));
    };

    loadData();
  }, [refreshTrigger]);

  useEffect(() => {
    // Listen for refresh events
    const handleRefresh = () => {
      setRefreshTrigger(prev => prev + 1);
    };

    window.addEventListener('refreshFinancialData', handleRefresh);
    return () => window.removeEventListener('refreshFinancialData', handleRefresh);
  }, []);

  const handleFiltersChange = (filters) => {
    setActiveFilters(filters);
    // In a real app, this would trigger data refetch with new filters
    console.log('Filters changed:', filters);
  };

  const handleFiltersReset = (resetFilters) => {
    setActiveFilters(resetFilters);
    // In a real app, this would reset data to default state
    console.log('Filters reset');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <GlobalContextBar />
        <NavigationProgressIndicator />
        
        <main className="pt-32 pb-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Analyzing Your Spending Patterns
                </h2>
                <p className="text-muted-foreground">
                  Processing transactions and generating insights...
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <GlobalContextBar />
      <NavigationProgressIndicator />
      
      <main className="pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Spending Analytics
              </h1>
              <p className="text-muted-foreground">
                Deep insights into your spending patterns with AI-powered analysis
              </p>
            </div>
            <QuickActionsToolbar />
          </div>

          {/* Advanced Filters */}
          <div className="mb-8">
            <AdvancedFilters 
              onFiltersChange={handleFiltersChange}
              onReset={handleFiltersReset}
            />
          </div>

          {/* KPI Cards */}
          <SpendingKPICards />

          {/* Main Analytics Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            {/* Primary Visualization - Category Breakdown */}
            <div className="xl:col-span-2">
              <CategoryBreakdownChart />
            </div>
            
            {/* Spending Trends Sidebar */}
            <div className="xl:col-span-1">
              <SpendingTrendAnalysis />
            </div>
          </div>

          {/* Spending Pattern Analysis */}
          <div className="mb-8">
            <SpendingHeatmap />
          </div>

          {/* AI-Powered Insights */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
            <AnomalyDetection />
            <MerchantAnalysis />
          </div>

          {/* Insights Summary */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
            <div className="flex items-center space-x-3 mb-6">
              <Icon name="Lightbulb" size={20} className="text-primary" />
              <h3 className="text-lg font-semibold text-foreground">AI-Generated Insights</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Icon name="TrendingUp" size={16} className="text-primary mt-1" />
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Spending Velocity Increase</h4>
                    <p className="text-sm text-muted-foreground">
                      Your weekly spending has increased by 12.5% compared to last month, primarily driven by dining expenses.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Icon name="AlertTriangle" size={16} className="text-warning mt-1" />
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Unusual Transaction Detected</h4>
                    <p className="text-sm text-muted-foreground">
                      A $234 restaurant charge is 340% above your typical dining spending. Review for accuracy.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Icon name="Target" size={16} className="text-success mt-1" />
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Loyalty Opportunity</h4>
                    <p className="text-sm text-muted-foreground">
                      You could save $23/month by joining loyalty programs at your top 3 merchants.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SpendingAnalyticsDashboard;