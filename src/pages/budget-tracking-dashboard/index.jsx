import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import GlobalContextBar from '../../components/ui/GlobalContextBar';
import NavigationProgressIndicator from '../../components/ui/NavigationProgressIndicator';
import QuickActionsToolbar from '../../components/ui/QuickActionsToolbar';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';


// Import components
import BudgetMetricsStrip from './components/BudgetMetricsStrip';
import BudgetCategoryChart from './components/BudgetCategoryChart';
import OverspendingAlerts from './components/OverspendingAlerts';
import SpendingHeatmapCalendar from './components/SpendingHeatmapCalendar';
import BudgetAdjustmentSliders from './components/BudgetAdjustmentSliders';
import CategoryTrendAnalysis from './components/CategoryTrendAnalysis';

const BudgetTrackingDashboard = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedCategories, setSelectedCategories] = useState(['Food & Dining', 'Transportation', 'Shopping']);
  const [viewMode, setViewMode] = useState('budget');
  const [selectedMonth, setSelectedMonth] = useState(new Date()?.getMonth());
  const [isLoading, setIsLoading] = useState(true);

  // Mock data
  const budgetData = {
    utilizationPercentage: 78,
    remainingAmount: 2340,
    projectedVariance: -150,
    daysRemaining: 12
  };

  const categoryData = [
    {
      name: 'Food & Dining',
      budget: 800,
      actual: 650,
      projected: 780,
      icon: 'Utensils'
    },
    {
      name: 'Transportation',
      budget: 400,
      actual: 320,
      projected: 380,
      icon: 'Car'
    },
    {
      name: 'Shopping',
      budget: 600,
      actual: 720,
      projected: 850,
      icon: 'ShoppingBag'
    },
    {
      name: 'Entertainment',
      budget: 300,
      actual: 280,
      projected: 320,
      icon: 'Film'
    },
    {
      name: 'Bills & Utilities',
      budget: 500,
      actual: 485,
      projected: 500,
      icon: 'Zap'
    },
    {
      name: 'Healthcare',
      budget: 200,
      actual: 150,
      projected: 180,
      icon: 'Heart'
    },
    {
      name: 'Travel',
      budget: 400,
      actual: 0,
      projected: 200,
      icon: 'Plane'
    },
    {
      name: 'Education',
      budget: 250,
      actual: 200,
      projected: 240,
      icon: 'BookOpen'
    }
  ];

  const overspendingAlerts = [
    {
      id: 1,
      category: 'Shopping',
      severity: 'critical',
      message: 'You have exceeded your shopping budget by $120 this month.',
      budget: 600,
      spent: 720,
      overagePercentage: 20,
      recommendations: [
        'Consider postponing non-essential purchases until next month',
        'Review recent shopping transactions for unnecessary items',
        'Set up spending alerts for this category'
      ],
      actions: [
        { id: 'adjust-budget', label: 'Adjust Budget', type: 'adjustBudget' },
        { id: 'set-alert', label: 'Set Alert', type: 'setAlert' },
        { id: 'view-transactions', label: 'View Transactions', type: 'viewTransactions' }
      ]
    },
    {
      id: 2,
      category: 'Entertainment',
      severity: 'warning',
      message: 'You are approaching your entertainment budget limit.',
      budget: 300,
      spent: 280,
      overagePercentage: 93,
      recommendations: [
        'Consider free entertainment options for the rest of the month',
        'Look for discounts on upcoming entertainment expenses'
      ],
      actions: [
        { id: 'find-deals', label: 'Find Deals', type: 'findDeals' },
        { id: 'set-reminder', label: 'Set Reminder', type: 'setReminder' }
      ]
    }
  ];

  const spendingData = [
    { date: '2025-01-01', amount: 45, transactions: 3 },
    { date: '2025-01-02', amount: 120, transactions: 5 },
    { date: '2025-01-03', amount: 80, transactions: 2 },
    { date: '2025-01-04', amount: 200, transactions: 7 },
    { date: '2025-01-05', amount: 65, transactions: 4 },
    { date: '2025-01-06', amount: 150, transactions: 6 },
    { date: '2025-01-07', amount: 90, transactions: 3 },
    { date: '2025-01-08', amount: 110, transactions: 4 },
    { date: '2025-01-09', amount: 75, transactions: 2 },
    { date: '2025-01-10', amount: 180, transactions: 8 },
    { date: '2025-01-11', amount: 95, transactions: 3 },
    { date: '2025-01-12', amount: 130, transactions: 5 },
    { date: '2025-01-13', amount: 220, transactions: 9 }
  ];

  const trendData = [
    {
      month: 'Jul 2024',
      'Food & Dining': 750,
      'Transportation': 380,
      'Shopping': 520,
      'Entertainment': 280,
      'Bills & Utilities': 485,
      'Healthcare': 120,
      'Travel': 800,
      'Education': 200
    },
    {
      month: 'Aug 2024',
      'Food & Dining': 820,
      'Transportation': 360,
      'Shopping': 680,
      'Entertainment': 320,
      'Bills & Utilities': 490,
      'Healthcare': 180,
      'Travel': 200,
      'Education': 220
    },
    {
      month: 'Sep 2024',
      'Food & Dining': 780,
      'Transportation': 340,
      'Shopping': 590,
      'Entertainment': 290,
      'Bills & Utilities': 485,
      'Healthcare': 150,
      'Travel': 0,
      'Education': 240
    },
    {
      month: 'Oct 2024',
      'Food & Dining': 850,
      'Transportation': 320,
      'Shopping': 720,
      'Entertainment': 350,
      'Bills & Utilities': 500,
      'Healthcare': 200,
      'Travel': 150,
      'Education': 180
    },
    {
      month: 'Nov 2024',
      'Food & Dining': 790,
      'Transportation': 310,
      'Shopping': 650,
      'Entertainment': 280,
      'Bills & Utilities': 485,
      'Healthcare': 160,
      'Travel': 300,
      'Education': 220
    },
    {
      month: 'Dec 2024',
      'Food & Dining': 920,
      'Transportation': 290,
      'Shopping': 850,
      'Entertainment': 420,
      'Bills & Utilities': 490,
      'Healthcare': 140,
      'Travel': 600,
      'Education': 200
    },
    {
      month: 'Jan 2025',
      'Food & Dining': 650,
      'Transportation': 320,
      'Shopping': 720,
      'Entertainment': 280,
      'Bills & Utilities': 485,
      'Healthcare': 150,
      'Travel': 0,
      'Education': 200
    }
  ];

  const periodOptions = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  const categoryFilterOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'food', label: 'Food & Dining' },
    { value: 'transport', label: 'Transportation' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'bills', label: 'Bills & Utilities' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'travel', label: 'Travel' },
    { value: 'education', label: 'Education' }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Listen for budget-related events
    const handleBudgetAction = (event) => {
      console.log('Budget action:', event?.detail);
    };

    const handleApplyBudgetChanges = (event) => {
      console.log('Apply budget changes:', event?.detail);
    };

    const handleDismissAlert = (event) => {
      console.log('Dismiss alert:', event?.detail);
    };

    window.addEventListener('budgetAction', handleBudgetAction);
    window.addEventListener('applyBudgetChanges', handleApplyBudgetChanges);
    window.addEventListener('dismissAlert', handleDismissAlert);

    return () => {
      window.removeEventListener('budgetAction', handleBudgetAction);
      window.removeEventListener('applyBudgetChanges', handleApplyBudgetChanges);
      window.removeEventListener('dismissAlert', handleDismissAlert);
    };
  }, []);

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => 
      prev?.includes(category) 
        ? prev?.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleBudgetChange = (adjustments, totalBudget) => {
    console.log('Budget adjustments:', adjustments, totalBudget);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <GlobalContextBar />
        <NavigationProgressIndicator />
        <div className="pt-32 pb-8 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-muted-foreground">Loading budget data...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <GlobalContextBar />
      <NavigationProgressIndicator />
      
      <main className="pt-32 pb-8 px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-semibold text-foreground">Budget Tracking</h1>
              <p className="text-muted-foreground mt-1">
                Monitor spending against planned budgets with predictive insights and overspending alerts
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <QuickActionsToolbar />
              
              <div className="flex items-center space-x-3">
                <Select
                  options={periodOptions}
                  value={selectedPeriod}
                  onChange={setSelectedPeriod}
                  className="w-32"
                />
                
                <Select
                  options={categoryFilterOptions}
                  value="all"
                  onChange={() => {}}
                  multiple
                  className="w-48"
                />
                
                <Button
                  variant={viewMode === 'budget' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode(viewMode === 'budget' ? 'actual' : 'budget')}
                >
                  {viewMode === 'budget' ? 'Budget View' : 'Actual View'}
                </Button>
              </div>
            </div>
          </div>

          {/* Budget Metrics Strip */}
          <BudgetMetricsStrip 
            budgetData={budgetData} 
            selectedPeriod={selectedPeriod} 
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Budget Category Chart - Main Content */}
            <div className="lg:col-span-8">
              <BudgetCategoryChart 
                categoryData={categoryData} 
                viewMode={viewMode} 
              />
            </div>

            {/* Overspending Alerts - Right Panel */}
            <div className="lg:col-span-4">
              <OverspendingAlerts alerts={overspendingAlerts} />
            </div>
          </div>

          {/* Spending Heatmap Calendar */}
          <SpendingHeatmapCalendar 
            spendingData={spendingData} 
            selectedMonth={selectedMonth} 
          />

          {/* Budget Adjustment Sliders */}
          <BudgetAdjustmentSliders 
            categories={categoryData} 
            onBudgetChange={handleBudgetChange} 
          />

          {/* Category Trend Analysis */}
          <CategoryTrendAnalysis 
            trendData={trendData} 
            selectedCategories={selectedCategories}
            onCategoryToggle={handleCategoryToggle} 
          />
        </div>
      </main>
    </div>
  );
};

export default BudgetTrackingDashboard;