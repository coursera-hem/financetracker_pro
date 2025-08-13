import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import GlobalContextBar from '../../components/ui/GlobalContextBar';
import NavigationProgressIndicator from '../../components/ui/NavigationProgressIndicator';
import QuickActionsToolbar from '../../components/ui/QuickActionsToolbar';
import KPICard from './components/KPICard';
import IncomeExpenseChart from './components/IncomeExpenseChart';
import UpcomingBillsWidget from './components/UpcomingBillsWidget';
import NetWorthChart from './components/NetWorthChart';
import RecentTransactionsTable from './components/RecentTransactionsTable';
import DateRangePicker from './components/DateRangePicker';

const FinancialOverviewDashboard = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(true);

  // Mock KPI data
  const kpiData = [
    {
      title: "Total Balance",
      value: 45750,
      change: "+12.5%",
      changeType: "positive",
      icon: "Wallet"
    },
    {
      title: "Monthly Income",
      value: 8500,
      change: "+5.2%",
      changeType: "positive",
      icon: "TrendingUp"
    },
    {
      title: "Monthly Expenses",
      value: 6200,
      change: "-8.1%",
      changeType: "positive",
      icon: "TrendingDown"
    },
    {
      title: "Savings Rate",
      value: "27%",
      change: "+3.4%",
      changeType: "positive",
      icon: "Target"
    }
  ];

  // Mock income vs expense chart data
  const incomeExpenseData = [
    { month: 'Jan', income: 8200, expenses: 6800 },
    { month: 'Feb', income: 8500, expenses: 6200 },
    { month: 'Mar', income: 8100, expenses: 6500 },
    { month: 'Apr', income: 8800, expenses: 5900 },
    { month: 'May', income: 8600, expenses: 6100 },
    { month: 'Jun', income: 9200, expenses: 6400 },
    { month: 'Jul', income: 8900, expenses: 6300 },
    { month: 'Aug', income: 8500, expenses: 6200 }
  ];

  // Mock upcoming bills data
  const upcomingBills = [
    {
      id: 1,
      name: "Electricity Bill",
      amount: 145,
      dueDate: "2025-08-15",
      status: "due-soon"
    },
    {
      id: 2,
      name: "Internet & Cable",
      amount: 89,
      dueDate: "2025-08-18",
      status: "pending"
    },
    {
      id: 3,
      name: "Car Insurance",
      amount: 320,
      dueDate: "2025-08-20",
      status: "pending"
    },
    {
      id: 4,
      name: "Mortgage Payment",
      amount: 2150,
      dueDate: "2025-08-01",
      status: "paid"
    },
    {
      id: 5,
      name: "Credit Card",
      amount: 450,
      dueDate: "2025-08-10",
      status: "overdue"
    }
  ];

  // Mock net worth data
  const netWorthData = [
    { month: 'Jan', assets: 125000, liabilities: 85000 },
    { month: 'Feb', assets: 127500, liabilities: 84200 },
    { month: 'Mar', assets: 129800, liabilities: 83500 },
    { month: 'Apr', assets: 132100, liabilities: 82800 },
    { month: 'May', assets: 134500, liabilities: 82100 },
    { month: 'Jun', assets: 137200, liabilities: 81400 },
    { month: 'Jul', assets: 139800, liabilities: 80700 },
    { month: 'Aug', assets: 142500, liabilities: 80000 }
  ];

  // Mock recent transactions data
  const recentTransactions = [
    {
      id: 1,
      description: "Salary Deposit",
      amount: 8500,
      category: "Income",
      account: "Checking Account",
      date: "2025-08-13",
      status: "completed"
    },
    {
      id: 2,
      description: "Grocery Store",
      amount: -156.78,
      category: "Food & Dining",
      account: "Credit Card",
      date: "2025-08-12",
      status: "completed"
    },
    {
      id: 3,
      description: "Gas Station",
      amount: -45.20,
      category: "Transportation",
      account: "Debit Card",
      date: "2025-08-12",
      status: "completed"
    },
    {
      id: 4,
      description: "Netflix Subscription",
      amount: -15.99,
      category: "Entertainment",
      account: "Credit Card",
      date: "2025-08-11",
      status: "completed"
    },
    {
      id: 5,
      description: "Online Shopping",
      amount: -89.99,
      category: "Shopping",
      account: "Credit Card",
      date: "2025-08-11",
      status: "pending"
    },
    {
      id: 6,
      description: "Electricity Bill",
      amount: -145.00,
      category: "Bills & Utilities",
      account: "Checking Account",
      date: "2025-08-10",
      status: "completed"
    },
    {
      id: 7,
      description: "Restaurant Dinner",
      amount: -67.50,
      category: "Food & Dining",
      account: "Credit Card",
      date: "2025-08-09",
      status: "completed"
    },
    {
      id: 8,
      description: "Freelance Payment",
      amount: 1200,
      category: "Income",
      account: "Checking Account",
      date: "2025-08-08",
      status: "completed"
    },
    {
      id: 9,
      description: "Pharmacy",
      amount: -23.45,
      category: "Healthcare",
      account: "Debit Card",
      date: "2025-08-08",
      status: "completed"
    },
    {
      id: 10,
      description: "Coffee Shop",
      amount: -12.75,
      category: "Food & Dining",
      account: "Credit Card",
      date: "2025-08-07",
      status: "completed"
    }
  ];

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Handle data refresh
  useEffect(() => {
    const handleRefresh = () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        window.dispatchEvent(new CustomEvent('financialDataLoaded'));
      }, 1500);
    };

    window.addEventListener('refreshFinancialData', handleRefresh);
    return () => window.removeEventListener('refreshFinancialData', handleRefresh);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <NavigationProgressIndicator />
        <div className="pt-32 px-6">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-muted-foreground">Loading financial data...</span>
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
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Financial Overview</h1>
              <p className="text-muted-foreground mt-1">
                Complete view of your financial health and performance
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <DateRangePicker 
                selectedRange={dateRange}
                onRangeChange={setDateRange}
              />
              <QuickActionsToolbar />
            </div>
          </div>

          {/* KPI Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpiData?.map((kpi, index) => (
              <KPICard
                key={index}
                title={kpi?.title}
                value={kpi?.value}
                change={kpi?.change}
                changeType={kpi?.changeType}
                icon={kpi?.icon}
              />
            ))}
          </div>

          {/* Main Chart and Bills Widget */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <IncomeExpenseChart 
                data={incomeExpenseData}
                dateRange={dateRange}
              />
            </div>
            <div className="lg:col-span-1">
              <UpcomingBillsWidget bills={upcomingBills} />
            </div>
          </div>

          {/* Net Worth Chart */}
          <div className="mb-8">
            <NetWorthChart data={netWorthData} />
          </div>

          {/* Recent Transactions Table */}
          <div>
            <RecentTransactionsTable transactions={recentTransactions} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default FinancialOverviewDashboard;