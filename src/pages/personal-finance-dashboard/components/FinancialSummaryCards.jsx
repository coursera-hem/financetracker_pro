import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, Calendar, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const FinancialSummaryCards = ({ accounts = [], monthlyTotals = {}, darkMode = false }) => {
  const financialSummary = useMemo(() => {
    const totalBalance = accounts?.reduce((sum, account) => {
      return sum + (parseFloat(account?.balance) || 0);
    }, 0) || 0;

    const assets = accounts?.filter(acc => 
      ['checking', 'savings', 'investment', 'cash']?.includes(acc?.account_type) && 
      (acc?.balance || 0) > 0
    )?.reduce((sum, acc) => sum + (parseFloat(acc?.balance) || 0), 0) || 0;

    const liabilities = accounts?.filter(acc => 
      acc?.account_type === 'credit_card' || (acc?.balance || 0) < 0
    )?.reduce((sum, acc) => sum + Math.abs(parseFloat(acc?.balance) || 0), 0) || 0;

    const netWorth = assets - liabilities;

    const monthlyIncome = monthlyTotals?.monthly_income || 0;
    const monthlyExpenses = monthlyTotals?.monthly_expenses || 0;
    const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;

    return {
      totalBalance,
      netWorth,
      monthlyIncome,
      monthlyExpenses,
      savingsRate: Math.max(0, savingsRate)
    };
  }, [accounts, monthlyTotals]);

  const cards = [
    {
      title: 'Total Balance',
      value: `$${financialSummary?.totalBalance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: '+$240.50',
      changeType: 'positive',
      icon: DollarSign,
      description: 'Across all accounts'
    },
    {
      title: 'Monthly Income',
      value: `$${financialSummary?.monthlyIncome?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: '+12.5%',
      changeType: 'positive',
      icon: TrendingUp,
      description: 'This month'
    },
    {
      title: 'Monthly Expenses',
      value: `$${financialSummary?.monthlyExpenses?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: '-8.3%',
      changeType: 'negative',
      icon: TrendingDown,
      description: 'This month'
    },
    {
      title: 'Savings Rate',
      value: `${financialSummary?.savingsRate?.toFixed(1)}%`,
      change: '+2.1%',
      changeType: 'positive',
      icon: Target,
      description: 'Of monthly income'
    },
    {
      title: 'Net Worth',
      value: `$${financialSummary?.netWorth?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: '+$1,240.00',
      changeType: 'positive',
      icon: TrendingUp,
      description: 'Assets minus liabilities'
    },
    {
      title: 'Upcoming Bills',
      value: '$320.50',
      change: '3 due soon',
      changeType: 'warning',
      icon: Calendar,
      description: 'Next 7 days'
    }
  ];

  const getChangeColor = (changeType) => {
    if (changeType === 'positive') return darkMode ? 'text-green-400' : 'text-green-600';
    if (changeType === 'negative') return darkMode ? 'text-red-400' : 'text-red-600';
    return darkMode ? 'text-yellow-400' : 'text-yellow-600';
  };

  const getChangeBg = (changeType) => {
    if (changeType === 'positive') return darkMode ? 'bg-green-400/10' : 'bg-green-50';
    if (changeType === 'negative') return darkMode ? 'bg-red-400/10' : 'bg-red-50';
    return darkMode ? 'bg-yellow-400/10' : 'bg-yellow-50';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards?.map((card, index) => (
        <motion.div
          key={card?.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${
              card?.changeType === 'positive' ?'bg-blue-50 text-blue-600' 
                : card?.changeType === 'negative' ? darkMode ?'bg-red-900/30 text-red-400': 'bg-red-50 text-red-600' : darkMode ?'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-50 text-yellow-600'
            }`}>
              <card.icon size={24} />
            </div>
            {card?.changeType === 'warning' && (
              <AlertCircle size={18} className={darkMode ? 'text-yellow-400' : 'text-yellow-500'} />
            )}
          </div>

          <div className="space-y-2">
            <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {card?.title}
            </h3>
            <div className="flex items-baseline justify-between">
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {card?.value}
              </p>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${getChangeBg(card?.changeType)} ${getChangeColor(card?.changeType)}`}>
                {card?.changeType === 'positive' && <TrendingUp size={12} />}
                {card?.changeType === 'negative' && <TrendingDown size={12} />}
                {card?.changeType === 'warning' && <Calendar size={12} />}
                {card?.change}
              </div>
            </div>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              {card?.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default FinancialSummaryCards;