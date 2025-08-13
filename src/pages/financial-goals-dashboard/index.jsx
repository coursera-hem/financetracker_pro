import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import GlobalContextBar from '../../components/ui/GlobalContextBar';
import NavigationProgressIndicator from '../../components/ui/NavigationProgressIndicator';
import QuickActionsToolbar from '../../components/ui/QuickActionsToolbar';
import GoalFilters from './components/GoalFilters';
import GoalProgressCard from './components/GoalProgressCard';
import GoalTimelineChart from './components/GoalTimelineChart';
import AIRecommendationsPanel from './components/AIRecommendationsPanel';
import GoalComparisonMatrix from './components/GoalComparisonMatrix';
import ScenarioModelingPanel from './components/ScenarioModelingPanel';
import MilestoneTracker from './components/MilestoneTracker';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const FinancialGoalsDashboard = () => {
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [timeHorizon, setTimeHorizon] = useState('all');
  const [achievementThreshold, setAchievementThreshold] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock goals data
  const goalsData = [
    {
      id: 1,
      name: "Emergency Fund",
      category: "emergency",
      icon: "Shield",
      currentAmount: 12500,
      targetAmount: 25000,
      monthlyContribution: 800,
      targetDate: "Dec 2024",
      projectedDate: "Feb 2025",
      status: "behind",
      achievementProbability: 78,
      timeToCompletion: 16,
      priority: "high"
    },
    {
      id: 2,
      name: "House Down Payment",
      category: "purchase",
      icon: "Home",
      currentAmount: 35000,
      targetAmount: 80000,
      monthlyContribution: 1200,
      targetDate: "Jun 2026",
      projectedDate: "May 2026",
      status: "on-track",
      achievementProbability: 92,
      timeToCompletion: 38,
      priority: "high"
    },
    {
      id: 3,
      name: "Vacation Fund",
      category: "savings",
      icon: "Plane",
      currentAmount: 3200,
      targetAmount: 8000,
      monthlyContribution: 400,
      targetDate: "Jul 2024",
      projectedDate: "Sep 2024",
      status: "at-risk",
      achievementProbability: 65,
      timeToCompletion: 12,
      priority: "medium"
    }
  ];

  // Mock timeline data for selected goal
  const timelineData = [
    { month: 'Jan 2024', actual: 8500, projected: 8800, target: 25000, confidenceLow: 8200, confidenceHigh: 9200 },
    { month: 'Feb 2024', actual: 9300, projected: 9600, target: 25000, confidenceLow: 9000, confidenceHigh: 10000 },
    { month: 'Mar 2024', actual: 10100, projected: 10400, target: 25000, confidenceLow: 9800, confidenceHigh: 10800 },
    { month: 'Apr 2024', actual: 10900, projected: 11200, target: 25000, confidenceLow: 10600, confidenceHigh: 11600 },
    { month: 'May 2024', actual: 11700, projected: 12000, target: 25000, confidenceLow: 11400, confidenceHigh: 12400 },
    { month: 'Jun 2024', actual: 12500, projected: 12800, target: 25000, confidenceLow: 12200, confidenceHigh: 13200 },
    { month: 'Jul 2024', actual: null, projected: 13600, target: 25000, confidenceLow: 13000, confidenceHigh: 14000 },
    { month: 'Aug 2024', actual: null, projected: 14400, target: 25000, confidenceLow: 13800, confidenceHigh: 14800 },
    { month: 'Sep 2024', actual: null, projected: 15200, target: 25000, confidenceLow: 14600, confidenceHigh: 15600 },
    { month: 'Oct 2024', actual: null, projected: 16000, target: 25000, confidenceLow: 15400, confidenceHigh: 16400 },
    { month: 'Nov 2024', actual: null, projected: 16800, target: 25000, confidenceLow: 16200, confidenceHigh: 17200 },
    { month: 'Dec 2024', actual: null, projected: 17600, target: 25000, confidenceLow: 17000, confidenceHigh: 18000 }
  ];

  const filteredGoals = goalsData?.filter(goal => {
    if (selectedCategory !== 'all' && goal?.category !== selectedCategory) return false;
    if (achievementThreshold > 0 && goal?.achievementProbability < achievementThreshold) return false;
    if (timeHorizon !== 'all') {
      if (timeHorizon === 'short' && goal?.timeToCompletion > 12) return false;
      if (timeHorizon === 'medium' && (goal?.timeToCompletion <= 12 || goal?.timeToCompletion > 36)) return false;
      if (timeHorizon === 'long' && goal?.timeToCompletion <= 36) return false;
    }
    return true;
  });

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setTimeHorizon('all');
    setAchievementThreshold(0);
  };

  const handleScenarioChange = (scenario) => {
    // Handle scenario application
    console.log('Applying scenario:', scenario);
  };

  useEffect(() => {
    if (filteredGoals?.length > 0 && !selectedGoal) {
      setSelectedGoal(filteredGoals?.[0]);
    }
  }, [filteredGoals]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'timeline', label: 'Timeline', icon: 'TrendingUp' },
    { id: 'scenarios', label: 'Scenarios', icon: 'Calculator' },
    { id: 'milestones', label: 'Milestones', icon: 'Trophy' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <GlobalContextBar />
      <NavigationProgressIndicator />
      <main className="pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Financial Goals</h1>
              <p className="text-muted-foreground mt-2">
                Track progress and achieve your financial objectives with AI-powered insights
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <QuickActionsToolbar />
              <Button
                variant="primary"
                iconName="Plus"
                onClick={() => window.dispatchEvent(new CustomEvent('openModal', { detail: { type: 'createGoal' } }))}
              >
                New Goal
              </Button>
            </div>
          </div>

          {/* Filters */}
          <GoalFilters
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            timeHorizon={timeHorizon}
            setTimeHorizon={setTimeHorizon}
            achievementThreshold={achievementThreshold}
            setAchievementThreshold={setAchievementThreshold}
            onResetFilters={handleResetFilters}
          />

          {/* Goal Progress Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {filteredGoals?.map((goal) => (
              <div
                key={goal?.id}
                onClick={() => setSelectedGoal(goal)}
                className={`cursor-pointer transition-smooth ${
                  selectedGoal?.id === goal?.id ? 'ring-2 ring-primary' : ''
                }`}
              >
                <GoalProgressCard goal={goal} />
              </div>
            ))}
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center space-x-1 mb-6 border-b border-border">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-smooth ${
                  activeTab === tab?.id
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-8">
            {activeTab === 'overview' && (
              <>
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* Timeline Chart */}
                  <div className="xl:col-span-2">
                    <GoalTimelineChart selectedGoal={selectedGoal} timelineData={timelineData} />
                  </div>
                  
                  {/* AI Recommendations */}
                  <div>
                    <AIRecommendationsPanel selectedGoal={selectedGoal} />
                  </div>
                </div>

                {/* Goal Comparison Matrix */}
                <GoalComparisonMatrix goals={filteredGoals} />
              </>
            )}

            {activeTab === 'timeline' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2">
                  <GoalTimelineChart selectedGoal={selectedGoal} timelineData={timelineData} />
                </div>
                <div>
                  <MilestoneTracker selectedGoal={selectedGoal} />
                </div>
              </div>
            )}

            {activeTab === 'scenarios' && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <ScenarioModelingPanel 
                  selectedGoal={selectedGoal} 
                  onScenarioChange={handleScenarioChange}
                />
                <div className="space-y-6">
                  <GoalTimelineChart selectedGoal={selectedGoal} timelineData={timelineData} />
                  <AIRecommendationsPanel selectedGoal={selectedGoal} />
                </div>
              </div>
            )}

            {activeTab === 'milestones' && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <MilestoneTracker selectedGoal={selectedGoal} />
                <div className="space-y-6">
                  <GoalTimelineChart selectedGoal={selectedGoal} timelineData={timelineData} />
                  <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Achievement Summary</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-success/5 rounded-lg">
                        <div className="text-2xl font-bold text-success">3</div>
                        <div className="text-sm text-muted-foreground">Milestones Achieved</div>
                      </div>
                      <div className="text-center p-4 bg-primary/5 rounded-lg">
                        <div className="text-2xl font-bold text-primary">2</div>
                        <div className="text-sm text-muted-foreground">Goals On Track</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FinancialGoalsDashboard;