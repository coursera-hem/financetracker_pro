import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { geminiService } from '../../../services/geminiService';

const AIChat = ({ isOpen, onClose, financialData, darkMode = false }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Hi! I\'m your AI financial assistant powered by Gemini. I can help you analyze your spending, optimize budgets, answer questions about your finances, and provide personalized recommendations. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef?.current) {
      inputRef?.current?.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    
    if (!inputMessage?.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage?.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      let aiResponse;
      const question = inputMessage?.toLowerCase();

      // Route to appropriate Gemini service based on question type
      if (question?.includes('spending') || question?.includes('expense')) {
        aiResponse = await geminiService?.analyzeSpendingPatterns(
          financialData?.transactions || []
        );
      } else if (question?.includes('budget') || question?.includes('optimize')) {
        const monthlyIncome = financialData?.transactions
          ?.filter(t => t?.transaction_type === 'income')
          ?.reduce((sum, t) => sum + (parseFloat(t?.amount) || 0), 0) || 0;
        
        aiResponse = await geminiService?.optimizeBudgets(
          financialData?.budgets || [],
          monthlyIncome
        );
      } else if (question?.includes('goal') || question?.includes('save')) {
        const currentSavings = 500; // Default or calculate from data
        const income = 4500; // Default or calculate from data
        
        aiResponse = await geminiService?.generateSavingsPlan(
          financialData?.goals || [],
          currentSavings,
          income
        );
      } else {
        // General financial question
        aiResponse = await geminiService?.askFinancialQuestion(
          inputMessage,
          financialData
        );
      }

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    'What\'s my biggest expense category?',
    'How can I save more money?',
    'Show me my spending trends',
    'How am I doing with my budget?',
    'What should I focus on financially?'
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
    inputRef?.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`w-full max-w-2xl h-[80vh] ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border rounded-xl shadow-xl flex flex-col`}
        >
          {/* Header */}
          <div className={`flex items-center justify-between p-6 border-b ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
                <Bot size={24} />
              </div>
              <div>
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  AI Financial Assistant
                </h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Powered by Gemini AI
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${
                darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              } transition-colors`}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages?.map((message) => (
              <motion.div
                key={message?.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${message?.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message?.type === 'ai' && (
                  <div className={`p-2 rounded-lg ${darkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
                    <Bot size={20} />
                  </div>
                )}
                
                <div className={`max-w-[80%] p-4 rounded-lg ${
                  message?.type === 'user' ?'bg-blue-600 text-white'
                    : darkMode
                    ? 'bg-gray-700 text-gray-100' :'bg-gray-100 text-gray-900'
                }`}>
                  <div className="whitespace-pre-wrap text-sm">
                    {message?.content}
                  </div>
                  <div className={`text-xs mt-2 opacity-70`}>
                    {message?.timestamp?.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>

                {message?.type === 'user' && (
                  <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                    <User size={20} />
                  </div>
                )}
              </motion.div>
            ))}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3 justify-start"
              >
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
                  <Bot size={20} />
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="flex items-center gap-2">
                    <Loader className="animate-spin" size={16} />
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      AI is thinking...
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages?.length === 1 && (
            <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Quick questions:
              </p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions?.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      darkMode 
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700' :'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSendMessage} className={`p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e?.target?.value)}
                placeholder="Ask me anything about your finances..."
                disabled={isLoading}
                className={`flex-1 px-4 py-3 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' :'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50`}
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage?.trim()}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AIChat;