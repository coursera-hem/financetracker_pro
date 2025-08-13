import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentTransactionsTable = ({ transactions }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const getCategoryIcon = (category) => {
    const iconMap = {
      'Food & Dining': 'Utensils',
      'Transportation': 'Car',
      'Shopping': 'ShoppingBag',
      'Entertainment': 'Film',
      'Bills & Utilities': 'Receipt',
      'Healthcare': 'Heart',
      'Income': 'TrendingUp',
      'Transfer': 'ArrowRightLeft'
    };
    return iconMap?.[category] || 'Circle';
  };

  const getCategoryColor = (category) => {
    const colorMap = {
      'Food & Dining': 'text-orange-600 bg-orange-100',
      'Transportation': 'text-blue-600 bg-blue-100',
      'Shopping': 'text-purple-600 bg-purple-100',
      'Entertainment': 'text-pink-600 bg-pink-100',
      'Bills & Utilities': 'text-red-600 bg-red-100',
      'Healthcare': 'text-green-600 bg-green-100',
      'Income': 'text-emerald-600 bg-emerald-100',
      'Transfer': 'text-gray-600 bg-gray-100'
    };
    return colorMap?.[category] || 'text-gray-600 bg-gray-100';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = today - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date?.toLocaleDateString();
  };

  const filteredTransactions = transactions?.filter(transaction => {
    if (filter === 'all') return true;
    if (filter === 'income') return transaction?.amount > 0;
    if (filter === 'expenses') return transaction?.amount < 0;
    return transaction?.category === filter;
  });

  const sortedTransactions = [...filteredTransactions]?.sort((a, b) => {
    if (sortBy === 'date') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'amount') return Math.abs(b?.amount) - Math.abs(a?.amount);
    return a?.description?.localeCompare(b?.description);
  });

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
            <p className="text-sm text-muted-foreground">Last 30 days activity</p>
          </div>
          <Button variant="ghost" size="sm" iconName="Download">
            Export
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Filter:</span>
            <select 
              value={filter}
              onChange={(e) => setFilter(e?.target?.value)}
              className="text-sm border border-border rounded px-2 py-1 bg-input text-foreground"
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expenses">Expenses</option>
              <option value="Food & Dining">Food & Dining</option>
              <option value="Transportation">Transportation</option>
              <option value="Shopping">Shopping</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e?.target?.value)}
              className="text-sm border border-border rounded px-2 py-1 bg-input text-foreground"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="description">Description</option>
            </select>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Transaction</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Category</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">Amount</th>
              <th className="text-center p-4 text-sm font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions?.slice(0, 10)?.map((transaction) => (
              <tr key={transaction?.id} className="border-t border-border hover:bg-muted/20 transition-smooth">
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryColor(transaction?.category)}`}>
                      <Icon name={getCategoryIcon(transaction?.category)} size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{transaction?.description}</p>
                      <p className="text-xs text-muted-foreground">{transaction?.account}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-muted-foreground">{transaction?.category}</span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-muted-foreground">{formatDate(transaction?.date)}</span>
                </td>
                <td className="p-4 text-right">
                  <span className={`text-sm font-semibold ${transaction?.amount > 0 ? 'text-success' : 'text-foreground'}`}>
                    {transaction?.amount > 0 ? '+' : ''}${Math.abs(transaction?.amount)?.toLocaleString()}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    transaction?.status === 'completed' ? 'bg-success/10 text-success' :
                    transaction?.status === 'pending'? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'
                  }`}>
                    {transaction?.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-border">
        <Button variant="ghost" size="sm" fullWidth>
          View All Transactions
        </Button>
      </div>
    </div>
  );
};

export default RecentTransactionsTable;