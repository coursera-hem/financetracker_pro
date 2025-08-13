import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';


const CategoryBreakdownChart = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [viewMode, setViewMode] = useState('donut'); // donut, pie

  const categoryData = [
    { name: 'Food & Dining', value: 1247, percentage: 28.5, color: '#1E40AF', subcategories: [
      { name: 'Restaurants', value: 687, transactions: 23 },
      { name: 'Groceries', value: 423, transactions: 12 },
      { name: 'Coffee Shops', value: 137, transactions: 18 }
    ]},
    { name: 'Transportation', value: 856, percentage: 19.6, color: '#059669', subcategories: [
      { name: 'Gas', value: 456, transactions: 8 },
      { name: 'Public Transit', value: 234, transactions: 15 },
      { name: 'Rideshare', value: 166, transactions: 12 }
    ]},
    { name: 'Shopping', value: 743, percentage: 17.0, color: '#7C3AED', subcategories: [
      { name: 'Clothing', value: 423, transactions: 7 },
      { name: 'Electronics', value: 234, transactions: 3 },
      { name: 'Home & Garden', value: 86, transactions: 5 }
    ]},
    { name: 'Entertainment', value: 534, percentage: 12.2, color: '#F59E0B', subcategories: [
      { name: 'Movies', value: 234, transactions: 8 },
      { name: 'Streaming', value: 156, transactions: 4 },
      { name: 'Games', value: 144, transactions: 6 }
    ]},
    { name: 'Bills & Utilities', value: 487, percentage: 11.1, color: '#EF4444', subcategories: [
      { name: 'Electricity', value: 234, transactions: 1 },
      { name: 'Internet', value: 89, transactions: 1 },
      { name: 'Phone', value: 164, transactions: 1 }
    ]},
    { name: 'Healthcare', value: 298, percentage: 6.8, color: '#10B981', subcategories: [
      { name: 'Doctor Visits', value: 156, transactions: 2 },
      { name: 'Pharmacy', value: 87, transactions: 4 },
      { name: 'Insurance', value: 55, transactions: 1 }
    ]},
    { name: 'Other', value: 205, percentage: 4.8, color: '#6B7280', subcategories: [
      { name: 'Miscellaneous', value: 205, transactions: 8 }
    ]}
  ];

  const totalSpending = categoryData?.reduce((sum, item) => sum + item?.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation-3">
          <p className="font-medium text-popover-foreground">{data?.name}</p>
          <p className="text-sm text-muted-foreground">
            ${data?.value?.toLocaleString()} ({data?.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(selectedCategory?.name === category?.name ? null : category);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Category Breakdown</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('donut')}
            className={`px-3 py-1 rounded text-sm transition-smooth ${
              viewMode === 'donut' 
                ? 'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            Donut
          </button>
          <button
            onClick={() => setViewMode('pie')}
            className={`px-3 py-1 rounded text-sm transition-smooth ${
              viewMode === 'pie' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            Pie
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={viewMode === 'donut' ? 60 : 0}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
                onClick={handleCategoryClick}
                className="cursor-pointer"
              >
                {categoryData?.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry?.color}
                    stroke={selectedCategory?.name === entry?.name ? '#1F2937' : 'none'}
                    strokeWidth={selectedCategory?.name === entry?.name ? 2 : 0}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          
          {viewMode === 'donut' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-2xl font-semibold text-foreground">
                  ${totalSpending?.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Spending</div>
              </div>
            </div>
          )}
        </div>

        {/* Category List */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">Categories</h4>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {categoryData?.map((category) => (
              <div
                key={category?.name}
                onClick={() => handleCategoryClick(category)}
                className={`p-3 rounded-lg border cursor-pointer transition-smooth ${
                  selectedCategory?.name === category?.name
                    ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category?.color }}
                    />
                    <span className="text-sm font-medium text-foreground">
                      {category?.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">
                      ${category?.value?.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {category?.percentage}%
                    </div>
                  </div>
                </div>
                
                {selectedCategory?.name === category?.name && (
                  <div className="mt-3 pt-3 border-t border-border space-y-2">
                    {category?.subcategories?.map((sub) => (
                      <div key={sub?.name} className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{sub?.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-foreground">${sub?.value}</span>
                          <span className="text-muted-foreground">({sub?.transactions})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryBreakdownChart;