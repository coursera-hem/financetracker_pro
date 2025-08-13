import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Sparkles, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { geminiService } from '../../../services/geminiService';
import { financeService } from '../../../services/financeService';

const AIInsights = ({ insights = [], darkMode = false }) => {
  const [expandedInsight, setExpandedInsight] = useState(null);
  const [generatingInsights, setGeneratingInsights] = useState(false);
  const [aiGeneratedInsights, setAiGeneratedInsights] = useState('');

  const generateNewInsights = async () => {
    try {
      setGeneratingInsights(true);
      
      // Get recent financial data
      const [transactions, budgets] = await Promise.all([
        financeService?.transactions?.getAll(50),
        financeService?.budgets?.getAll()
      ]);

      // Generate AI insights
      const generatedInsights = await geminiService?.generateFinancialInsights(
        transactions, 
        budgets
      );
      
      setAiGeneratedInsights(generatedInsights);
    } catch (error) {
      console.error('Error generating insights:', error);
      setAiGeneratedInsights('Unable to generate insights at this time. Please try again later.');
    } finally {
      setGeneratingInsights(false);
    }
  };

  useEffect(() => {
    // Auto-generate insights on component mount if no existing insights
    if (insights?.length === 0) {
      generateNewInsights();
    }
  }, []);

  const getInsightIcon = (type) => {
    switch (type) {
      case 'spending_pattern':
        return TrendingUp;
      case 'budget_alert':
        return AlertTriangle;
      case 'savings_opportunity':
        return Lightbulb;
      default:
        return Brain;
    }
  };

  const getInsightColor = (priority) => {
    switch (priority) {
      case 'high':
        return darkMode ? 'text-red-400' : 'text-red-600';
      case 'medium':
        return darkMode ? 'text-yellow-400' : 'text-yellow-600';
      case 'low':
        return darkMode ? 'text-green-400' : 'text-green-600';
      default:
        return darkMode ? 'text-blue-400' : 'text-blue-600';
    }
  };

  const getInsightBg = (priority) => {
    switch (priority) {
      case 'high':
        return darkMode ? 'bg-red-400/10' : 'bg-red-50';
      case 'medium':
        return darkMode ? 'bg-yellow-400/10' : 'bg-yellow-50';
      case 'low':
        return darkMode ? 'bg-green-400/10' : 'bg-green-50';
      default:
        return darkMode ? 'bg-blue-400/10' : 'bg-blue-50';
    }
  };

  return (
    <div className={`${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } border rounded-xl p-6 shadow-sm`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${darkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              AI Insights
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Powered by Gemini AI
            </p>
          </div>
        </div>
        <button
          onClick={generateNewInsights}
          disabled={generatingInsights}
          className={`p-2 rounded-lg ${
            darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
          } transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <RefreshCw size={18} className={generatingInsights ? 'animate-spin' : ''} />
        </button>
      </div>
      {/* AI Generated Insights */}
      {aiGeneratedInsights && (
        <div className={`mb-6 p-4 rounded-lg ${
          darkMode ? 'bg-gray-700/50 border border-gray-600' : 'bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
              <Brain size={18} />
            </div>
            <div className="flex-1">
              <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                AI Analysis
              </h4>
              <div className={`text-sm whitespace-pre-wrap ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {generatingInsights ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                    <span>Analyzing your financial data...</span>
                  </div>
                ) : (
                  aiGeneratedInsights
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Database Insights */}
      {insights?.length === 0 && !aiGeneratedInsights && !generatingInsights ? (
        <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <Brain size={32} className="mx-auto mb-3 opacity-50" />
          <p>No insights available yet</p>
          <p className="text-sm mt-1">AI will analyze your transactions and provide insights</p>
          <button
            onClick={generateNewInsights}
            className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
          >
            Generate Insights
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {insights?.map((insight, index) => {
              const InsightIcon = getInsightIcon(insight?.insight_type);
              
              return (
                <motion.div
                  key={insight?.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border ${
                    darkMode ? 'bg-gray-700/30 border-gray-600' : 'border-gray-100'
                  } ${getInsightBg(insight?.priority)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${getInsightBg(insight?.priority)}`}>
                      <InsightIcon 
                        size={18} 
                        className={getInsightColor(insight?.priority)}
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {insight?.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-md ${
                            insight?.priority === 'high' ? darkMode ?'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'
                              : insight?.priority === 'medium' ? darkMode ?'bg-yellow-900/30 text-yellow-400': 'bg-yellow-100 text-yellow-700' : darkMode ?'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
                          }`}>
                            {insight?.priority?.toUpperCase()}
                          </span>
                          <button
                            onClick={() => setExpandedInsight(
                              expandedInsight === insight?.id ? null : insight?.id
                            )}
                            className={`text-sm ${
                              darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                            }`}
                          >
                            {expandedInsight === insight?.id ? 'Less' : 'More'}
                          </button>
                        </div>
                      </div>
                      
                      <p className={`text-sm mt-1 ${
                        expandedInsight === insight?.id ? '' : 'line-clamp-2'
                      } ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {insight?.description}
                      </p>

                      <AnimatePresence>
                        {expandedInsight === insight?.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3"
                          >
                            {insight?.data && (
                              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                <strong>Data:</strong> {JSON.stringify(insight?.data)}
                              </div>
                            )}
                            <div className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              Generated on {new Date(insight?.created_at)?.toLocaleDateString()}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default AIInsights;