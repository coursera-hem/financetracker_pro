import { supabase } from '../utils/supabase';

/**
 * Service for handling all financial data operations
 */
export const financeService = {
  // Account operations
  accounts: {
    getAll: async () => {
      const { data, error } = await supabase?.from('accounts')?.select('*')?.eq('is_active', true)?.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },

    create: async (accountData) => {
      const { data, error } = await supabase?.from('accounts')?.insert([accountData])?.select()?.single();
      
      if (error) throw error;
      return data;
    },

    update: async (id, updates) => {
      const { data, error } = await supabase?.from('accounts')?.update(updates)?.eq('id', id)?.select()?.single();
      
      if (error) throw error;
      return data;
    },

    delete: async (id) => {
      const { error } = await supabase?.from('accounts')?.update({ is_active: false })?.eq('id', id);
      
      if (error) throw error;
    }
  },

  // Transaction operations
  transactions: {
    getAll: async (limit = 100, offset = 0) => {
      const { data, error } = await supabase?.from('transactions')?.select(`
          *,
          account:accounts(name, account_type),
          category:categories(name, icon, color)
        `)?.order('transaction_date', { ascending: false })?.order('created_at', { ascending: false })?.limit(limit)?.range(offset, offset + limit - 1);
      
      if (error) throw error;
      return data || [];
    },

    getByDateRange: async (startDate, endDate) => {
      const { data, error } = await supabase?.from('transactions')?.select(`
          *,
          account:accounts(name, account_type),
          category:categories(name, icon, color)
        `)?.gte('transaction_date', startDate)?.lte('transaction_date', endDate)?.order('transaction_date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },

    create: async (transactionData) => {
      const { data, error } = await supabase?.from('transactions')?.insert([transactionData])?.select(`
          *,
          account:accounts(name, account_type),
          category:categories(name, icon, color)
        `)?.single();
      
      if (error) throw error;
      return data;
    },

    update: async (id, updates) => {
      const { data, error } = await supabase?.from('transactions')?.update(updates)?.eq('id', id)?.select(`
          *,
          account:accounts(name, account_type),
          category:categories(name, icon, color)
        `)?.single();
      
      if (error) throw error;
      return data;
    },

    delete: async (id) => {
      const { error } = await supabase?.from('transactions')?.delete()?.eq('id', id);
      
      if (error) throw error;
    }
  },

  // Category operations
  categories: {
    getAll: async () => {
      const { data, error } = await supabase?.from('categories')?.select('*')?.order('name');
      
      if (error) throw error;
      return data || [];
    },

    create: async (categoryData) => {
      const { data, error } = await supabase?.from('categories')?.insert([categoryData])?.select()?.single();
      
      if (error) throw error;
      return data;
    }
  },

  // Budget operations
  budgets: {
    getAll: async () => {
      const { data, error } = await supabase?.from('budgets')?.select(`
          *,
          category:categories(name, icon, color)
        `)?.eq('is_active', true)?.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },

    create: async (budgetData) => {
      const { data, error } = await supabase?.from('budgets')?.insert([budgetData])?.select(`
          *,
          category:categories(name, icon, color)
        `)?.single();
      
      if (error) throw error;
      return data;
    },

    update: async (id, updates) => {
      const { data, error } = await supabase?.from('budgets')?.update(updates)?.eq('id', id)?.select(`
          *,
          category:categories(name, icon, color)
        `)?.single();
      
      if (error) throw error;
      return data;
    }
  },

  // Financial goals operations
  goals: {
    getAll: async () => {
      const { data, error } = await supabase?.from('financial_goals')?.select('*')?.eq('is_active', true)?.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },

    create: async (goalData) => {
      const { data, error } = await supabase?.from('financial_goals')?.insert([goalData])?.select()?.single();
      
      if (error) throw error;
      return data;
    },

    update: async (id, updates) => {
      const { data, error } = await supabase?.from('financial_goals')?.update(updates)?.eq('id', id)?.select()?.single();
      
      if (error) throw error;
      return data;
    }
  },

  // AI insights operations
  insights: {
    getAll: async () => {
      const { data, error } = await supabase?.from('ai_insights')?.select('*')?.order('created_at', { ascending: false })?.limit(10);
      
      if (error) throw error;
      return data || [];
    },

    create: async (insightData) => {
      const { data, error } = await supabase?.from('ai_insights')?.insert([insightData])?.select()?.single();
      
      if (error) throw error;
      return data;
    },

    markAsRead: async (id) => {
      const { error } = await supabase?.from('ai_insights')?.update({ is_read: true })?.eq('id', id);
      
      if (error) throw error;
    }
  },

  // Analytics operations
  analytics: {
    getMonthlyTotals: async () => {
      const { data, error } = await supabase?.rpc('get_monthly_totals')?.single();
      
      if (error) {
        // Fallback calculation if RPC doesn't exist
        return this.calculateMonthlyTotals();
      }
      return data;
    },

    calculateMonthlyTotals: async () => {
      const currentDate = new Date();
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const transactions = await financeService?.transactions?.getByDateRange(
        startOfMonth?.toISOString()?.split('T')?.[0],
        endOfMonth?.toISOString()?.split('T')?.[0]
      );

      const income = transactions
        ?.filter(t => t?.transaction_type === 'income')
        ?.reduce((sum, t) => sum + (parseFloat(t?.amount) || 0), 0) || 0;

      const expenses = transactions
        ?.filter(t => t?.transaction_type === 'expense')
        ?.reduce((sum, t) => sum + (parseFloat(t?.amount) || 0), 0) || 0;

      return {
        monthly_income: income,
        monthly_expenses: expenses,
        net_income: income - expenses
      };
    },

    getNetWorth: async () => {
      const accounts = await financeService?.accounts?.getAll();
      
      const assets = accounts
        ?.filter(acc => ['checking', 'savings', 'investment', 'cash']?.includes(acc?.account_type) && (acc?.balance || 0) > 0)
        ?.reduce((sum, acc) => sum + (parseFloat(acc?.balance) || 0), 0) || 0;

      const liabilities = accounts
        ?.filter(acc => acc?.account_type === 'credit_card' || (acc?.balance || 0) < 0)
        ?.reduce((sum, acc) => sum + Math.abs(parseFloat(acc?.balance) || 0), 0) || 0;

      return {
        assets,
        liabilities,
        net_worth: assets - liabilities
      };
    }
  }
};