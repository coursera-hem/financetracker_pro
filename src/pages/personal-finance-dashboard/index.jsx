import React, { useState, useEffect } from 'react';
import { Target, Plus, Settings, Moon, Sun, Bell, Search, Menu, X, CreditCard, PieChart, BarChart3, Home, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FinancialSummaryCards from './components/FinancialSummaryCards';
import IncomeExpenseChart from './components/IncomeExpenseChart';
import RecentTransactions from './components/RecentTransactions';
import AIInsights from './components/AIInsights';
import TransactionModal from './components/TransactionModal';
import AIChat from './components/AIChat';
import BudgetOverview from './components/BudgetOverview';
import QuickActions from './components/QuickActions';
import { financeService } from '../../services/financeService';
import { useAuth } from '../../contexts/AuthContext';

const PersonalFinanceDashboard = () => {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  
  // Financial data state
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [insights, setInsights] = useState([]);
  const [monthlyTotals, setMonthlyTotals] = useState({});

  useEffect(() => {
    if (user) {
      loadFinancialData();
    }
  }, [user]);

  const loadFinancialData = async () => {
    try {
      setLoading(true);
      const [
        accountsData,
        transactionsData,
        budgetsData,
        goalsData,
        insightsData,
        monthlyData
      ] = await Promise.all([
        financeService?.accounts?.getAll(),
        financeService?.transactions?.getAll(20),
        financeService?.budgets?.getAll(),
        financeService?.goals?.getAll(),
        financeService?.insights?.getAll(),
        financeService?.analytics?.calculateMonthlyTotals()
      ]);

      setAccounts(accountsData);
      setTransactions(transactionsData);
      setBudgets(budgetsData);
      setGoals(goalsData);
      setInsights(insightsData);
      setMonthlyTotals(monthlyData);
    } catch (error) {
      console.error('Error loading financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionAdded = (newTransaction) => {
    setTransactions(prev => [newTransaction, ...prev]);
    setShowTransactionModal(false);
    loadFinancialData(); // Refresh data to update balances
  };

  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Home, active: activeSection === 'dashboard' },
    { id: 'transactions', name: 'Transactions', icon: CreditCard, active: activeSection === 'transactions' },
    { id: 'analytics', name: 'Analytics', icon: BarChart3, active: activeSection === 'analytics' },
    { id: 'budgets', name: 'Budgets', icon: PieChart, active: activeSection === 'budgets' },
    { id: 'goals', name: 'Goals', icon: Target, active: activeSection === 'goals' },
    { id: 'settings', name: 'Settings', icon: Settings, active: activeSection === 'settings' },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h2>
          <p className="text-gray-600">You need to be signed in to access your financial dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-4 py-4 flex items-center justify-between`}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Finance Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={18} />
            <input
              type="text"
              placeholder="Search transactions..."
              className={`pl-10 pr-4 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' :'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
          </div>

          {/* Quick Actions */}
          <button
            onClick={() => setShowTransactionModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Transaction</span>
          </button>

          <button
            onClick={() => setShowAIChat(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Bot size={18} />
            <span className="hidden sm:inline">Ask Gemini</span>
          </button>

          {/* Notifications */}
          <button className={`p-2 rounded-lg relative ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}>
            <Bell size={20} />
            {insights?.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            )}
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* User Profile */}
          <div className={`w-8 h-8 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-300'} flex items-center justify-center`}>
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              {user?.email?.charAt(0)?.toUpperCase()}
            </span>
          </div>
        </div>
      </header>
      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.3 }}
              className={`fixed inset-y-0 left-0 z-50 w-64 ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } border-r shadow-lg md:relative md:translate-x-0`}
              style={{ top: '73px' }}
            >
              <nav className="p-4 space-y-2">
                {sidebarItems?.map((item) => (
                  <button
                    key={item?.id}
                    onClick={() => {
                      setActiveSection(item?.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      item?.active
                        ? darkMode
                          ? 'bg-blue-600 text-white' :'bg-blue-50 text-blue-600 border border-blue-200'
                        : darkMode
                        ? 'text-gray-300 hover:bg-gray-700' :'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon size={20} />
                    {item?.name}
                  </button>
                ))}
              </nav>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {activeSection === 'dashboard' && (
                <div className="space-y-6">
                  <FinancialSummaryCards 
                    accounts={accounts}
                    monthlyTotals={monthlyTotals}
                    darkMode={darkMode}
                  />
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <IncomeExpenseChart 
                      transactions={transactions}
                      darkMode={darkMode}
                    />
                    <BudgetOverview 
                      budgets={budgets}
                      darkMode={darkMode}
                    />
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2">
                      <RecentTransactions 
                        transactions={transactions?.slice(0, 10)}
                        darkMode={darkMode}
                        onTransactionUpdate={loadFinancialData}
                      />
                    </div>
                    <div>
                      <AIInsights 
                        insights={insights}
                        darkMode={darkMode}
                      />
                    </div>
                  </div>

                  <QuickActions 
                    onAddTransaction={() => setShowTransactionModal(true)}
                    onAskGemini={() => setShowAIChat(true)}
                    darkMode={darkMode}
                  />
                </div>
              )}

              {activeSection !== 'dashboard' && (
                <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <h3 className="text-xl font-semibold mb-2">
                    {sidebarItems?.find(item => item?.id === activeSection)?.name} Section
                  </h3>
                  <p>This section is under development and will be available soon.</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
      {/* Modals */}
      <TransactionModal
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        onTransactionAdded={handleTransactionAdded}
        accounts={accounts}
        darkMode={darkMode}
      />
      <AIChat
        isOpen={showAIChat}
        onClose={() => setShowAIChat(false)}
        financialData={{
          transactions,
          accounts,
          budgets,
          goals
        }}
        darkMode={darkMode}
      />
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default PersonalFinanceDashboard;