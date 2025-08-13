import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, MoreVertical, Filter, Eye, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const RecentTransactions = ({ transactions = [], darkMode = false, onTransactionUpdate }) => {
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const displayTransactions = showAllTransactions ? transactions : transactions?.slice(0, 5);

  const formatAmount = (amount, type) => {
    const formattedAmount = parseFloat(amount)?.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return type === 'income' ? `+$${formattedAmount}` : `-$${formattedAmount}`;
  };

  const getTransactionIcon = (type) => {
    return type === 'income' ? ArrowDownLeft : ArrowUpRight;
  };

  const getTransactionColor = (type) => {
    if (type === 'income') {
      return darkMode ? 'text-green-400' : 'text-green-600';
    }
    return darkMode ? 'text-red-400' : 'text-red-600';
  };

  const getTransactionBg = (type) => {
    if (type === 'income') {
      return darkMode ? 'bg-green-400/10' : 'bg-green-50';
    }
    return darkMode ? 'bg-red-400/10' : 'bg-red-50';
  };

  const handleTransactionAction = (action, transaction) => {
    setSelectedTransaction(null);
    if (action === 'view') {
      // Handle view transaction
      console.log('View transaction:', transaction);
    } else if (action === 'edit') {
      // Handle edit transaction
      console.log('Edit transaction:', transaction);
    } else if (action === 'delete') {
      // Handle delete transaction
      console.log('Delete transaction:', transaction);
      // Call update function to refresh data
      onTransactionUpdate?.();
    }
  };

  return (
    <div className={`${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } border rounded-xl p-6 shadow-sm`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Recent Transactions
          </h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Your latest financial activity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className={`p-2 rounded-lg ${
            darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
          } transition-colors`}>
            <Filter size={18} />
          </button>
          <button
            onClick={() => setShowAllTransactions(!showAllTransactions)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {showAllTransactions ? 'Show Less' : 'View All'}
          </button>
        </div>
      </div>
      {/* Transactions List */}
      {displayTransactions?.length === 0 ? (
        <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <p>No transactions found</p>
          <p className="text-sm mt-1">Add your first transaction to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {displayTransactions?.map((transaction, index) => {
              const TransactionIcon = getTransactionIcon(transaction?.transaction_type);
              
              return (
                <motion.div
                  key={transaction?.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-100'
                  } hover:shadow-sm transition-shadow`}
                >
                  <div className="flex items-center gap-4">
                    {/* Transaction Icon */}
                    <div className={`p-2 rounded-lg ${getTransactionBg(transaction?.transaction_type)}`}>
                      <TransactionIcon 
                        size={20} 
                        className={getTransactionColor(transaction?.transaction_type)}
                      />
                    </div>

                    {/* Transaction Details */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {transaction?.description || 'Unknown Transaction'}
                        </h4>
                        {transaction?.category && (
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs ${
                            darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                          }`}>
                            {transaction?.category?.icon}
                            {transaction?.category?.name}
                          </span>
                        )}
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                        <span>{transaction?.merchant_name || transaction?.account?.name}</span>
                        {transaction?.transaction_date && (
                          <>
                            <span className="mx-1">•</span>
                            <span>{format(new Date(transaction?.transaction_date), 'MMM dd, yyyy')}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Amount and Actions */}
                  <div className="flex items-center gap-3">
                    <span className={`font-semibold ${getTransactionColor(transaction?.transaction_type)}`}>
                      {formatAmount(transaction?.amount || 0, transaction?.transaction_type)}
                    </span>

                    {/* Actions Menu */}
                    <div className="relative">
                      <button
                        onClick={() => setSelectedTransaction(
                          selectedTransaction?.id === transaction?.id ? null : transaction
                        )}
                        className={`p-1 rounded-lg ${
                          darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                        } transition-colors`}
                      >
                        <MoreVertical size={16} />
                      </button>

                      {/* Action Menu */}
                      <AnimatePresence>
                        {selectedTransaction?.id === transaction?.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.1 }}
                            className={`absolute right-0 mt-2 w-36 ${
                              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                            } border rounded-lg shadow-lg z-10`}
                          >
                            <button
                              onClick={() => handleTransactionAction('view', transaction)}
                              className={`w-full flex items-center gap-2 px-3 py-2 text-sm ${
                                darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-50'
                              } rounded-t-lg`}
                            >
                              <Eye size={14} />
                              View Details
                            </button>
                            <button
                              onClick={() => handleTransactionAction('edit', transaction)}
                              className={`w-full flex items-center gap-2 px-3 py-2 text-sm ${
                                darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <Edit2 size={14} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleTransactionAction('delete', transaction)}
                              className={`w-full flex items-center gap-2 px-3 py-2 text-sm ${
                                darkMode ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'
                              } rounded-b-lg`}
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
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
      {/* Show More Button */}
      {!showAllTransactions && transactions?.length > 5 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAllTransactions(true)}
            className={`text-sm font-medium ${
              darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
            } transition-colors`}
          >
            Show {transactions?.length - 5} more transactions
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;