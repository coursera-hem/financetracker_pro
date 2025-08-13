import React from 'react';
import { Plus, Bot, CreditCard, Target, BarChart3, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const QuickActions = ({ onAddTransaction, onAskGemini, darkMode = false }) => {
  const quickActions = [
    {
      id: 'add-transaction',
      title: 'Add Transaction',
      description: 'Record income or expense',
      icon: Plus,
      color: 'blue',
      onClick: onAddTransaction
    },
    {
      id: 'ask-gemini',
      title: 'Ask Gemini',
      description: 'Get AI financial insights',
      icon: Bot,
      color: 'purple',
      onClick: onAskGemini
    },
    {
      id: 'connect-bank',
      title: 'Connect Bank',
      description: 'Link bank account',
      icon: CreditCard,
      color: 'green',
      onClick: () => alert('Bank connection coming soon!')
    },
    {
      id: 'set-budget',
      title: 'Set Budget',
      description: 'Create spending limits',
      icon: Target,
      color: 'yellow',
      onClick: () => alert('Budget setup coming soon!')
    },
    {
      id: 'view-reports',
      title: 'View Reports',
      description: 'Detailed analytics',
      icon: BarChart3,
      color: 'indigo',
      onClick: () => alert('Reports coming soon!')
    },
    {
      id: 'export-data',
      title: 'Export Data',
      description: 'Download CSV/PDF',
      icon: Download,
      color: 'gray',
      onClick: () => alert('Export feature coming soon!')
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: darkMode ? 'bg-blue-900/30 hover:bg-blue-900/50' : 'bg-blue-50 hover:bg-blue-100',
        text: darkMode ? 'text-blue-400' : 'text-blue-600',
        border: darkMode ? 'border-blue-800' : 'border-blue-200'
      },
      purple: {
        bg: darkMode ? 'bg-purple-900/30 hover:bg-purple-900/50' : 'bg-purple-50 hover:bg-purple-100',
        text: darkMode ? 'text-purple-400' : 'text-purple-600',
        border: darkMode ? 'border-purple-800' : 'border-purple-200'
      },
      green: {
        bg: darkMode ? 'bg-green-900/30 hover:bg-green-900/50' : 'bg-green-50 hover:bg-green-100',
        text: darkMode ? 'text-green-400' : 'text-green-600',
        border: darkMode ? 'border-green-800' : 'border-green-200'
      },
      yellow: {
        bg: darkMode ? 'bg-yellow-900/30 hover:bg-yellow-900/50' : 'bg-yellow-50 hover:bg-yellow-100',
        text: darkMode ? 'text-yellow-400' : 'text-yellow-600',
        border: darkMode ? 'border-yellow-800' : 'border-yellow-200'
      },
      indigo: {
        bg: darkMode ? 'bg-indigo-900/30 hover:bg-indigo-900/50' : 'bg-indigo-50 hover:bg-indigo-100',
        text: darkMode ? 'text-indigo-400' : 'text-indigo-600',
        border: darkMode ? 'border-indigo-800' : 'border-indigo-200'
      },
      gray: {
        bg: darkMode ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100',
        text: darkMode ? 'text-gray-400' : 'text-gray-600',
        border: darkMode ? 'border-gray-600' : 'border-gray-200'
      }
    };
    return colors?.[color] || colors?.gray;
  };

  return (
    <div className={`${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } border rounded-xl p-6 shadow-sm`}>
      {/* Header */}
      <div className="mb-6">
        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Quick Actions
        </h3>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Common tasks and shortcuts
        </p>
      </div>
      {/* Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {quickActions?.map((action, index) => {
          const colorClasses = getColorClasses(action?.color);
          const ActionIcon = action?.icon;
          
          return (
            <motion.button
              key={action?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={action?.onClick}
              className={`p-4 rounded-lg border transition-all duration-200 text-left ${colorClasses?.bg} ${colorClasses?.border} group`}
            >
              <div className="flex flex-col items-start gap-3">
                <div className={`p-2 rounded-lg ${colorClasses?.bg} ${colorClasses?.text} group-hover:scale-110 transition-transform duration-200`}>
                  <ActionIcon size={20} />
                </div>
                
                <div>
                  <h4 className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'} group-hover:${colorClasses?.text?.replace('text-', 'text-')} transition-colors`}>
                    {action?.title}
                  </h4>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                    {action?.description}
                  </p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
      {/* Additional Info */}
      <div className={`mt-6 p-4 rounded-lg ${
        darkMode ? 'bg-gray-700/30' : 'bg-gray-50'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${
            darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'
          }`}>
            <Bot size={18} />
          </div>
          <div>
            <h4 className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              AI-Powered Insights
            </h4>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
              Get personalized financial recommendations and spending analysis powered by Gemini AI. 
              Ask questions about your spending patterns, budget optimization, or savings goals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;