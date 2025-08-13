import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { financeService } from '../../../services/financeService';
import { useAuth } from '../../../contexts/AuthContext';

const TransactionModal = ({ 
  isOpen, 
  onClose, 
  onTransactionAdded, 
  accounts = [], 
  darkMode = false 
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    transaction_type: 'expense',
    amount: '',
    description: '',
    account_id: '',
    category_id: '',
    transaction_date: new Date()?.toISOString()?.split('T')?.[0],
    notes: '',
    merchant_name: '',
    is_recurring: false,
    recurring_frequency: 'none'
  });

  const [categories, setCategories] = useState([]);

  React.useEffect(() => {
    if (isOpen) {
      loadCategories();
      // Reset form when modal opens
      setFormData({
        transaction_type: 'expense',
        amount: '',
        description: '',
        account_id: accounts?.[0]?.id || '',
        category_id: '',
        transaction_date: new Date()?.toISOString()?.split('T')?.[0],
        notes: '',
        merchant_name: '',
        is_recurring: false,
        recurring_frequency: 'none'
      });
    }
  }, [isOpen, accounts]);

  const loadCategories = async () => {
    try {
      const categoriesData = await financeService?.categories?.getAll();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!user || !formData?.amount || !formData?.description || !formData?.account_id) {
      return;
    }

    try {
      setLoading(true);
      
      const transactionData = {
        ...formData,
        user_id: user?.id,
        amount: parseFloat(formData?.amount)
      };

      // Remove empty fields
      Object.keys(transactionData)?.forEach(key => {
        if (transactionData?.[key] === '' || transactionData?.[key] === null) {
          delete transactionData?.[key];
        }
      });

      const newTransaction = await financeService?.transactions?.create(transactionData);
      onTransactionAdded(newTransaction);
      onClose();
    } catch (error) {
      console.error('Error creating transaction:', error);
      alert('Failed to create transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const filteredCategories = categories?.filter(cat => 
    cat?.transaction_type === formData?.transaction_type
  ) || [];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`w-full max-w-lg ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border rounded-xl shadow-xl`}
        >
          {/* Header */}
          <div className={`flex items-center justify-between p-6 border-b ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Add Transaction
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${
                darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              } transition-colors`}
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Transaction Type */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Transaction Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                  formData?.transaction_type === 'income'
                    ? darkMode 
                      ? 'bg-green-900/30 border-green-600 text-green-400' :'bg-green-50 border-green-300 text-green-700'
                    : darkMode
                    ? 'bg-gray-700/50 border-gray-600 text-gray-400' :'bg-gray-50 border-gray-200 text-gray-600'
                }`}>
                  <input
                    type="radio"
                    name="transaction_type"
                    value="income"
                    checked={formData?.transaction_type === 'income'}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <span className="text-lg">💰</span>
                  <span className="font-medium">Income</span>
                </label>

                <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                  formData?.transaction_type === 'expense'
                    ? darkMode 
                      ? 'bg-red-900/30 border-red-600 text-red-400' :'bg-red-50 border-red-300 text-red-700'
                    : darkMode
                    ? 'bg-gray-700/50 border-gray-600 text-gray-400' :'bg-gray-50 border-gray-200 text-gray-600'
                }`}>
                  <input
                    type="radio"
                    name="transaction_type"
                    value="expense"
                    checked={formData?.transaction_type === 'expense'}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <span className="text-lg">💸</span>
                  <span className="font-medium">Expense</span>
                </label>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Amount
              </label>
              <div className="relative">
                <DollarSign className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} size={18} />
                <input
                  type="number"
                  name="amount"
                  value={formData?.amount}
                  onChange={handleInputChange}
                  step="0.01"
                  required
                  placeholder="0.00"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' :'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>
            </div>

            {/* Description & Merchant */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Description
                </label>
                <div className="relative">
                  <FileText className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} size={18} />
                  <input
                    type="text"
                    name="description"
                    value={formData?.description}
                    onChange={handleInputChange}
                    required
                    placeholder="Transaction description"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' :'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Merchant (Optional)
                </label>
                <input
                  type="text"
                  name="merchant_name"
                  value={formData?.merchant_name}
                  onChange={handleInputChange}
                  placeholder="Store or service name"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' :'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>
            </div>

            {/* Account & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Account
                </label>
                <select
                  name="account_id"
                  value={formData?.account_id}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' :'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  <option value="">Select Account</option>
                  {accounts?.map(account => (
                    <option key={account?.id} value={account?.id}>
                      {account?.name} (${account?.balance?.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Category
                </label>
                <select
                  name="category_id"
                  value={formData?.category_id}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' :'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  <option value="">Select Category</option>
                  {filteredCategories?.map(category => (
                    <option key={category?.id} value={category?.id}>
                      {category?.icon} {category?.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Date
              </label>
              <div className="relative">
                <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} size={18} />
                <input
                  type="date"
                  name="transaction_date"
                  value={formData?.transaction_date}
                  onChange={handleInputChange}
                  required
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' :'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData?.notes}
                onChange={handleInputChange}
                rows="3"
                placeholder="Additional notes..."
                className={`w-full px-4 py-3 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' :'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none`}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' :'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData?.amount || !formData?.description || !formData?.account_id}
                className={`px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Adding...
                  </>
                ) : (
                  'Add Transaction'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TransactionModal;