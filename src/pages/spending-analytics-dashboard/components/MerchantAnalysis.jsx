import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const MerchantAnalysis = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('3m');
  const [sortBy, setSortBy] = useState('spending'); // spending, frequency, loyalty

  const merchantData = [
    {
      id: 1,
      name: 'Amazon',
      category: 'Shopping',
      totalSpending: 1247,
      transactionCount: 23,
      avgTransaction: 54.22,
      loyaltyScore: 8.5,
      lastTransaction: '2025-01-12',
      monthlyTrend: [890, 1023, 1156, 1247],
      loyaltyOpportunity: 'high',
      logo: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=40&h=40&fit=crop&crop=center'
    },
    {
      id: 2,
      name: 'Starbucks',
      category: 'Food & Dining',
      totalSpending: 456,
      transactionCount: 67,
      avgTransaction: 6.81,
      loyaltyScore: 9.2,
      lastTransaction: '2025-01-13',
      monthlyTrend: [423, 445, 467, 456],
      loyaltyOpportunity: 'medium',
      logo: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=40&h=40&fit=crop&crop=center'
    },
    {
      id: 3,
      name: 'Shell Gas Station',
      category: 'Transportation',
      totalSpending: 378,
      transactionCount: 12,
      avgTransaction: 31.50,
      loyaltyScore: 6.8,
      lastTransaction: '2025-01-11',
      monthlyTrend: [345, 356, 367, 378],
      loyaltyOpportunity: 'high',
      logo: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=40&h=40&fit=crop&crop=center'
    },
    {
      id: 4,
      name: 'Whole Foods',
      category: 'Food & Dining',
      totalSpending: 567,
      transactionCount: 18,
      avgTransaction: 31.50,
      loyaltyScore: 7.4,
      lastTransaction: '2025-01-10',
      monthlyTrend: [523, 534, 556, 567],
      loyaltyOpportunity: 'medium',
      logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=40&h=40&fit=crop&crop=center'
    },
    {
      id: 5,
      name: 'Netflix',
      category: 'Entertainment',
      totalSpending: 45,
      transactionCount: 3,
      avgTransaction: 15.00,
      loyaltyScore: 9.8,
      lastTransaction: '2025-01-01',
      monthlyTrend: [45, 45, 45, 45],
      loyaltyOpportunity: 'low',
      logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=40&h=40&fit=crop&crop=center'
    },
    {
      id: 6,
      name: 'Target',
      category: 'Shopping',
      totalSpending: 234,
      transactionCount: 8,
      avgTransaction: 29.25,
      loyaltyScore: 5.6,
      lastTransaction: '2025-01-08',
      monthlyTrend: [198, 212, 223, 234],
      loyaltyOpportunity: 'high',
      logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=40&h=40&fit=crop&crop=center'
    }
  ];

  const periodOptions = [
    { value: '1m', label: '1 Month' },
    { value: '3m', label: '3 Months' },
    { value: '6m', label: '6 Months' }
  ];

  const sortOptions = [
    { value: 'spending', label: 'Total Spending' },
    { value: 'frequency', label: 'Transaction Count' },
    { value: 'loyalty', label: 'Loyalty Score' }
  ];

  const getSortedMerchants = () => {
    return [...merchantData]?.sort((a, b) => {
      switch (sortBy) {
        case 'spending':
          return b?.totalSpending - a?.totalSpending;
        case 'frequency':
          return b?.transactionCount - a?.transactionCount;
        case 'loyalty':
          return b?.loyaltyScore - a?.loyaltyScore;
        default:
          return 0;
      }
    });
  };

  const getOpportunityColor = (opportunity) => {
    switch (opportunity) {
      case 'high': return 'text-success bg-success/10';
      case 'medium': return 'text-warning bg-warning/10';
      case 'low': return 'text-muted-foreground bg-muted';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const chartData = getSortedMerchants()?.slice(0, 6)?.map(merchant => ({
    name: merchant?.name?.length > 10 ? merchant?.name?.substring(0, 10) + '...' : merchant?.name,
    spending: merchant?.totalSpending,
    transactions: merchant?.transactionCount,
    loyalty: merchant?.loyaltyScore * 10 // Scale for visibility
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const merchant = merchantData?.find(m => 
        (m?.name?.length > 10 ? m?.name?.substring(0, 10) + '...' : m?.name) === label
      );
      
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation-3">
          <p className="font-medium text-popover-foreground mb-2">{merchant?.name}</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Spending:</span>
              <span className="font-medium">${merchant?.totalSpending}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transactions:</span>
              <span className="font-medium">{merchant?.transactionCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Loyalty Score:</span>
              <span className="font-medium">{merchant?.loyaltyScore}/10</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <h3 className="text-lg font-semibold text-foreground">Merchant Analysis</h3>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e?.target?.value)}
            className="px-3 py-1 border border-border rounded text-sm bg-background"
          >
            {periodOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e?.target?.value)}
            className="px-3 py-1 border border-border rounded text-sm bg-background"
          >
            {sortOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                Sort by {option?.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="h-80">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">Top Merchants Overview</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="name" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="spending" 
                fill="var(--color-primary)" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Merchant List */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">Detailed Breakdown</h4>
          <div className="max-h-80 overflow-y-auto space-y-3">
            {getSortedMerchants()?.map((merchant) => (
              <div
                key={merchant?.id}
                className="p-4 border border-border rounded-lg hover:border-primary/50 transition-smooth"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      <Icon name="Store" size={20} className="text-muted-foreground" />
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground">{merchant?.name}</h5>
                      <p className="text-xs text-muted-foreground">{merchant?.category}</p>
                    </div>
                  </div>
                  
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    getOpportunityColor(merchant?.loyaltyOpportunity)
                  }`}>
                    {merchant?.loyaltyOpportunity} opportunity
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Total Spending</span>
                    <div className="font-semibold text-foreground">
                      ${merchant?.totalSpending?.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Transactions</span>
                    <div className="font-semibold text-foreground">
                      {merchant?.transactionCount}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Avg Transaction</span>
                    <div className="font-semibold text-foreground">
                      ${merchant?.avgTransaction?.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Loyalty Score</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-foreground">
                        {merchant?.loyaltyScore}/10
                      </span>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary rounded-full h-2 transition-all"
                          style={{ width: `${merchant?.loyaltyScore * 10}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Last transaction: {merchant?.lastTransaction}</span>
                    <div className="flex items-center space-x-1">
                      <Icon name="TrendingUp" size={12} />
                      <span>
                        {((merchant?.monthlyTrend?.[3] - merchant?.monthlyTrend?.[0]) / merchant?.monthlyTrend?.[0] * 100)?.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-semibold text-foreground">
              {merchantData?.length}
            </div>
            <div className="text-sm text-muted-foreground">Active Merchants</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-foreground">
              {merchantData?.filter(m => m?.loyaltyOpportunity === 'high')?.length}
            </div>
            <div className="text-sm text-muted-foreground">High Opportunity</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-foreground">
              {(merchantData?.reduce((sum, m) => sum + m?.loyaltyScore, 0) / merchantData?.length)?.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">Avg Loyalty Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-foreground">
              ${merchantData?.reduce((sum, m) => sum + m?.totalSpending, 0)?.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Spending</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantAnalysis;