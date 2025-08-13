import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const BudgetOverview = ({ budgets = [], darkMode = false }) => {
  const budgetData = budgets?.map(budget => ({
    name: budget?.category?.name || budget?.name,
    budgeted: parseFloat(budget?.amount) || 0,
    spent: parseFloat(budget?.spent_amount) || 0,
    remaining: Math.max(0, (parseFloat(budget?.amount) || 0) - (parseFloat(budget?.spent_amount) || 0)),
    percentage: ((parseFloat(budget?.spent_amount) || 0) / (parseFloat(budget?.amount) || 1)) * 100,
    color: budget?.category?.color || '#3B82F6',
    icon: budget?.category?.icon || '📊'
  })) || [];

  const totalBudgeted = budgetData?.reduce((sum, item) => sum + item?.budgeted, 0) || 0;
  const totalSpent = budgetData?.reduce((sum, item) => sum + item?.spent, 0) || 0;
  const totalRemaining = totalBudgeted - totalSpent;

  const overBudgetCategories = budgetData?.filter(item => item?.percentage > 100) || [];
  const warningCategories = budgetData?.filter(item => item?.percentage > 80 && item?.percentage <= 100) || [];
  const onTrackCategories = budgetData?.filter(item => item?.percentage <= 80) || [];

  const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className={`${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } border rounded-lg p-4 shadow-lg`}>
          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {data?.icon} {data?.name}
          </p>
          <div className={`text-sm mt-2 space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <p>Budgeted: ${data?.budgeted?.toLocaleString()}</p>
            <p>Spent: ${data?.spent?.toLocaleString()}</p>
            <p>Remaining: ${data?.remaining?.toLocaleString()}</p>
            <p className={`font-medium ${
              data?.percentage > 100 
                ? 'text-red-500' 
                : data?.percentage > 80 
                ? 'text-yellow-500' :'text-green-500'
            }`}>
              {data?.percentage?.toFixed(1)}% used
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (budgets?.length === 0) {
    return (
      <div className={`${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border rounded-xl p-6 shadow-sm`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Budget Overview
        </h3>
        <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <p>No budgets set up yet</p>
          <p className="text-sm mt-1">Create budgets to track your spending</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } border rounded-xl p-6 shadow-sm`}>
      {/* Header */}
      <div className="mb-6">
        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Budget Overview
        </h3>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Monthly budget performance
        </p>
      </div>
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Budgeted
            </span>
          </div>
          <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            ${totalBudgeted?.toLocaleString()}
          </p>
        </div>
        
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className={darkMode ? 'text-red-400' : 'text-red-600'} style={{ transform: 'rotate(180deg)' }} />
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Spent
            </span>
          </div>
          <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            ${totalSpent?.toLocaleString()}
          </p>
        </div>
        
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle size={16} className={
              totalRemaining >= 0 
                ? darkMode ? 'text-green-400' : 'text-green-600' : darkMode ?'text-red-400' : 'text-red-600'
            } />
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Remaining
            </span>
          </div>
          <p className={`text-lg font-bold ${
            totalRemaining >= 0 
              ? darkMode ? 'text-green-400' : 'text-green-600' : darkMode ?'text-red-400' : 'text-red-600'
          }`}>
            ${Math.abs(totalRemaining)?.toLocaleString()}
          </p>
        </div>
      </div>
      {/* Pie Chart */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={budgetData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="spent"
            >
              {budgetData?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry?.color || COLORS?.[index % COLORS?.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Budget Status List */}
      <div className="space-y-3">
        {/* Over Budget */}
        {overBudgetCategories?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={16} className={darkMode ? 'text-red-400' : 'text-red-600'} />
              <h4 className={`text-sm font-medium ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                Over Budget ({overBudgetCategories?.length})
              </h4>
            </div>
            {overBudgetCategories?.map((item, index) => (
              <motion.div
                key={`over-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  darkMode ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item?.icon}</span>
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {item?.name}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      ${item?.spent?.toLocaleString()} / ${item?.budgeted?.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                    {item?.percentage?.toFixed(1)}%
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-red-300' : 'text-red-500'}`}>
                    ${(item?.spent - item?.budgeted)?.toLocaleString()} over
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Warning Categories */}
        {warningCategories?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock size={16} className={darkMode ? 'text-yellow-400' : 'text-yellow-600'} />
              <h4 className={`text-sm font-medium ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                Approaching Limit ({warningCategories?.length})
              </h4>
            </div>
            {warningCategories?.map((item, index) => (
              <motion.div
                key={`warning-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (overBudgetCategories?.length + index) * 0.1 }}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  darkMode ? 'bg-yellow-900/20 border border-yellow-800' : 'bg-yellow-50 border border-yellow-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item?.icon}</span>
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {item?.name}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      ${item?.spent?.toLocaleString()} / ${item?.budgeted?.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                    {item?.percentage?.toFixed(1)}%
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-yellow-300' : 'text-yellow-500'}`}>
                    ${item?.remaining?.toLocaleString()} left
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* On Track Categories */}
        {onTrackCategories?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={16} className={darkMode ? 'text-green-400' : 'text-green-600'} />
              <h4 className={`text-sm font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                On Track ({onTrackCategories?.length})
              </h4>
            </div>
            {onTrackCategories?.slice(0, 3)?.map((item, index) => (
              <motion.div
                key={`track-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (overBudgetCategories?.length + warningCategories?.length + index) * 0.1 }}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  darkMode ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item?.icon}</span>
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {item?.name}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      ${item?.spent?.toLocaleString()} / ${item?.budgeted?.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                    {item?.percentage?.toFixed(1)}%
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-green-300' : 'text-green-500'}`}>
                    ${item?.remaining?.toLocaleString()} left
                  </p>
                </div>
              </motion.div>
            ))}
            {onTrackCategories?.length > 3 && (
              <p className={`text-sm text-center mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                And {onTrackCategories?.length - 3} more on track
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetOverview;