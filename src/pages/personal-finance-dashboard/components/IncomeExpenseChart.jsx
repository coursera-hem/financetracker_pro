import React, { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';
import { TrendingUp, Calendar } from 'lucide-react';

const IncomeExpenseChart = ({ transactions = [], darkMode = false }) => {
  const [timeRange, setTimeRange] = useState('6M');

  const chartData = useMemo(() => {
    const now = new Date();
    let startDate;

    switch (timeRange) {
      case '1M':
        startDate = subMonths(now, 1);
        break;
      case '3M':
        startDate = subMonths(now, 3);
        break;
      case '6M':
        startDate = subMonths(now, 6);
        break;
      case '1Y':
        startDate = subMonths(now, 12);
        break;
      default:
        startDate = subMonths(now, 6);
    }

    const months = eachMonthOfInterval({
      start: startOfMonth(startDate),
      end: endOfMonth(now)
    });

    return months?.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      const monthTransactions = transactions?.filter(transaction => {
        const transactionDate = new Date(transaction?.transaction_date);
        return transactionDate >= monthStart && transactionDate <= monthEnd;
      }) || [];

      const income = monthTransactions
        ?.filter(t => t?.transaction_type === 'income')
        ?.reduce((sum, t) => sum + (parseFloat(t?.amount) || 0), 0) || 0;

      const expenses = monthTransactions
        ?.filter(t => t?.transaction_type === 'expense')
        ?.reduce((sum, t) => sum + (parseFloat(t?.amount) || 0), 0) || 0;

      return {
        month: format(month, 'MMM yyyy'),
        income: Math.round(income),
        expenses: Math.round(expenses),
        net: Math.round(income - expenses)
      };
    }) || [];
  }, [transactions, timeRange]);

  const timeRangeOptions = [
    { value: '1M', label: '1M' },
    { value: '3M', label: '3M' },
    { value: '6M', label: '6M' },
    { value: '1Y', label: '1Y' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className={`${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } border rounded-lg p-4 shadow-lg`}>
          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {label}
          </p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 mt-1">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry?.color }}
              />
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {entry?.name}: ${entry?.value?.toLocaleString()}
              </span>
            </div>
          ))}
          <div className={`mt-2 pt-2 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
            <span className={`text-sm font-medium ${
              (payload?.[0]?.payload?.net || 0) >= 0 
                ? darkMode ? 'text-green-400' : 'text-green-600' : darkMode ?'text-red-400' : 'text-red-600'
            }`}>
              Net: ${(payload?.[0]?.payload?.net || 0)?.toLocaleString()}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const totalIncome = chartData?.reduce((sum, month) => sum + (month?.income || 0), 0) || 0;
  const totalExpenses = chartData?.reduce((sum, month) => sum + (month?.expenses || 0), 0) || 0;
  const netIncome = totalIncome - totalExpenses;

  return (
    <div className={`${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } border rounded-xl p-6 shadow-sm`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Income vs Expenses
          </h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Monthly financial overview
          </p>
        </div>
        <div className="flex items-center gap-2">
          {timeRangeOptions?.map(option => (
            <button
              key={option?.value}
              onClick={() => setTimeRange(option?.value)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                timeRange === option?.value
                  ? 'bg-blue-600 text-white'
                  : darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' :'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {option?.label}
            </button>
          ))}
        </div>
      </div>
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className={darkMode ? 'text-green-400' : 'text-green-600'} />
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Total Income
            </span>
          </div>
          <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            ${totalIncome?.toLocaleString()}
          </p>
        </div>
        
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className={darkMode ? 'text-red-400' : 'text-red-600'} style={{ transform: 'rotate(180deg)' }} />
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Total Expenses
            </span>
          </div>
          <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            ${totalExpenses?.toLocaleString()}
          </p>
        </div>
        
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={16} className={
              netIncome >= 0 
                ? darkMode ? 'text-green-400' : 'text-green-600' : darkMode ?'text-red-400' : 'text-red-600'
            } />
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Net Income
            </span>
          </div>
          <p className={`text-xl font-bold ${
            netIncome >= 0 
              ? darkMode ? 'text-green-400' : 'text-green-600' : darkMode ?'text-red-400' : 'text-red-600'
          }`}>
            ${netIncome?.toLocaleString()}
          </p>
        </div>
      </div>
      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={darkMode ? '#374151' : '#E5E7EB'} 
            />
            <XAxis 
              dataKey="month" 
              stroke={darkMode ? '#9CA3AF' : '#6B7280'}
              fontSize={12}
            />
            <YAxis 
              stroke={darkMode ? '#9CA3AF' : '#6B7280'}
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000)?.toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#10B981"
              strokeWidth={2}
              fill="url(#incomeGradient)"
              name="Income"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#EF4444"
              strokeWidth={2}
              fill="url(#expenseGradient)"
              name="Expenses"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncomeExpenseChart;