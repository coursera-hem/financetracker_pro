import genAI from '../utils/geminiClient';

/**
 * Gemini AI Service for Personal Finance Insights
 */
export const geminiService = {
  /**
   * Generates financial insights based on transaction data
   * @param {Array} transactions - User's transaction data
   * @param {Array} budgets - User's budget data
   * @returns {Promise<string>} AI-generated insights
   */
  generateFinancialInsights: async (transactions = [], budgets = []) => {
    try {
      const model = genAI?.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `
        As a personal finance advisor, analyze the following financial data and provide actionable insights:
        
        Recent Transactions:
        ${transactions?.map(t => `- ${t?.description}: $${t?.amount} (${t?.transaction_type}) on ${t?.transaction_date}`)?.join('\n') || 'No transactions available'}
        
        Current Budgets:
        ${budgets?.map(b => `- ${b?.name}: $${b?.spent_amount}/$${b?.amount} spent`)?.join('\n') || 'No budgets available'}
        
        Please provide:
        1. Spending pattern analysis
        2. Budget performance insights
        3. Savings opportunities
        4. Financial recommendations
        
        Keep responses practical and actionable. Limit to 4-5 key insights.
      `;

      const result = await model?.generateContent(prompt);
      const response = await result?.response;
      return response?.text();
    } catch (error) {
      console.error('Error generating financial insights:', error);
      return 'Unable to generate insights at this time. Please try again later.';
    }
  },

  /**
   * Analyzes spending patterns and provides categorized insights
   * @param {Array} transactions - User's transaction data
   * @returns {Promise<string>} AI analysis of spending patterns
   */
  analyzeSpendingPatterns: async (transactions = []) => {
    try {
      const model = genAI?.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `
        Analyze these spending transactions and identify patterns:
        
        ${transactions?.map(t => `${t?.description}: $${t?.amount} (${t?.merchant_name || 'Unknown'}) - ${t?.transaction_date}`)?.join('\n') || 'No spending data available'}
        
        Provide insights on:
        1. Spending trends by category
        2. Frequent merchants/services
        3. Unusual or high-value purchases
        4. Recommendations for optimization
        
        Be specific and actionable in your recommendations.
      `;

      const result = await model?.generateContent(prompt);
      const response = await result?.response;
      return response?.text();
    } catch (error) {
      console.error('Error analyzing spending patterns:', error);
      return 'Unable to analyze spending patterns at this time.';
    }
  },

  /**
   * Provides budget optimization suggestions
   * @param {Array} budgets - User's budget data with spending
   * @param {number} totalIncome - User's monthly income
   * @returns {Promise<string>} AI-generated budget optimization advice
   */
  optimizeBudgets: async (budgets = [], totalIncome = 0) => {
    try {
      const model = genAI?.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `
        Help optimize this monthly budget based on spending data:
        
        Monthly Income: $${totalIncome}
        
        Current Budgets:
        ${budgets?.map(b => `- ${b?.name}: $${b?.amount} budgeted, $${b?.spent_amount} spent (${Math.round((b?.spent_amount / b?.amount) * 100)}% used)`)?.join('\n') || 'No budget data available'}
        
        Please suggest:
        1. Budget adjustments for over/under-performing categories
        2. Optimal budget allocation percentages
        3. Areas where spending can be reduced
        4. Opportunities to increase savings
        
        Provide specific dollar amounts and percentages where possible.
      `;

      const result = await model?.generateContent(prompt);
      const response = await result?.response;
      return response?.text();
    } catch (error) {
      console.error('Error optimizing budgets:', error);
      return 'Unable to provide budget optimization at this time.';
    }
  },

  /**
   * Answers natural language questions about finances
   * @param {string} question - User's question
   * @param {Object} financialData - User's complete financial data
   * @returns {Promise<string>} AI-generated answer
   */
  askFinancialQuestion: async (question, financialData = {}) => {
    try {
      const model = genAI?.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const { transactions = [], budgets = [], accounts = [], goals = [] } = financialData;
      
      const prompt = `
        Answer this financial question based on the user's data:
        
        Question: "${question}"
        
        Financial Context:
        - Accounts: ${accounts?.length || 0} accounts with total balance: $${accounts?.reduce((sum, acc) => sum + (acc?.balance || 0), 0) || 0}
        - Recent Transactions: ${transactions?.length || 0} transactions
        - Active Budgets: ${budgets?.length || 0} budgets
        - Financial Goals: ${goals?.length || 0} goals
        
        Recent Transaction Summary:
        ${transactions?.slice(0, 10)?.map(t => `- ${t?.description}: $${t?.amount} (${t?.transaction_type})`)?.join('\n') || 'No recent transactions'}
        
        Provide a helpful, specific answer based on their actual financial data.
        If you need more specific data to answer accurately, ask for clarification.
      `;

      const result = await model?.generateContent(prompt);
      const response = await result?.response;
      return response?.text();
    } catch (error) {
      console.error('Error answering financial question:', error);
      return 'Sorry, I could not process your question at this time. Please try rephrasing it.';
    }
  },

  /**
   * Generates savings recommendations based on financial goals
   * @param {Array} goals - User's financial goals
   * @param {number} currentSavings - Current monthly savings amount
   * @param {number} income - Monthly income
   * @returns {Promise<string>} AI-generated savings plan
   */
  generateSavingsPlan: async (goals = [], currentSavings = 0, income = 0) => {
    try {
      const model = genAI?.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `
        Create a savings plan to achieve these financial goals:
        
        Monthly Income: $${income}
        Current Monthly Savings: $${currentSavings}
        
        Goals:
        ${goals?.map(g => `- ${g?.name}: $${g?.current_amount}/$${g?.target_amount} (Target: ${g?.target_date || 'No deadline'})`)?.join('\n') || 'No active goals'}
        
        Provide:
        1. Monthly savings targets for each goal
        2. Timeline adjustments if needed
        3. Strategies to increase savings capacity
        4. Priority ranking of goals
        
        Be realistic and consider their current income and savings rate.
      `;

      const result = await model?.generateContent(prompt);
      const response = await result?.response;
      return response?.text();
    } catch (error) {
      console.error('Error generating savings plan:', error);
      return 'Unable to generate savings plan at this time.';
    }
  },

  /**
   * Detects unusual spending patterns or anomalies
   * @param {Array} transactions - Recent transaction data
   * @param {Array} historicalData - Historical spending averages
   * @returns {Promise<string>} AI-detected spending anomalies
   */
  detectSpendingAnomalies: async (transactions = [], historicalData = {}) => {
    try {
      const model = genAI?.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `
        Analyze recent transactions for unusual spending patterns:
        
        Recent Transactions:
        ${transactions?.map(t => `${t?.description}: $${t?.amount} at ${t?.merchant_name || 'Unknown'} (${t?.transaction_date})`)?.join('\n') || 'No recent transactions'}
        
        Historical Averages:
        ${Object.entries(historicalData)?.map(([category, avg]) => `- ${category}: $${avg}/month average`)?.join('\n') || 'No historical data available'}
        
        Look for:
        1. Unusually high transaction amounts
        2. Spending spikes in certain categories
        3. New merchants or unusual purchase patterns
        4. Frequency changes in spending habits
        
        Alert me to anything that seems out of the ordinary and suggest if further review is needed.
      `;

      const result = await model?.generateContent(prompt);
      const response = await result?.response;
      return response?.text();
    } catch (error) {
      console.error('Error detecting spending anomalies:', error);
      return 'Unable to analyze spending patterns for anomalies at this time.';
    }
  }
};