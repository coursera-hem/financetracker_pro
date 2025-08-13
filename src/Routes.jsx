import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import FinancialGoalsDashboard from './pages/financial-goals-dashboard';
import BudgetTrackingDashboard from './pages/budget-tracking-dashboard';
import FinancialOverviewDashboard from './pages/financial-overview-dashboard';
import SpendingAnalyticsDashboard from './pages/spending-analytics-dashboard';
import PersonalFinanceDashboard from './pages/personal-finance-dashboard';
import { AuthProvider } from './contexts/AuthContext';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <ScrollToTop />
          <RouterRoutes>
            {/* Define your route here */}
            <Route path="/" element={<PersonalFinanceDashboard />} />
            <Route path="/personal-finance-dashboard" element={<PersonalFinanceDashboard />} />
            <Route path="/financial-goals-dashboard" element={<FinancialGoalsDashboard />} />
            <Route path="/budget-tracking-dashboard" element={<BudgetTrackingDashboard />} />
            <Route path="/financial-overview-dashboard" element={<FinancialOverviewDashboard />} />
            <Route path="/spending-analytics-dashboard" element={<SpendingAnalyticsDashboard />} />
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;