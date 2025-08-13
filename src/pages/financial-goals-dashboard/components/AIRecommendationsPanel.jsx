import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AIRecommendationsPanel = ({ selectedGoal }) => {
  const [expandedRecommendation, setExpandedRecommendation] = useState(null);

  const recommendations = [
    {
      id: 1,
      type: 'spending-adjustment',
      title: 'Reduce Dining Out',
      impact: '+2 months faster',
      confidence: 85,
      description: `Based on your spending patterns, reducing dining expenses by $200/month could accelerate your ${selectedGoal?.name || 'goal'} by 2 months.`,
      details: `Current dining spend: $450/month\nRecommended: $250/month\nSavings: $200/month\n\nThis adjustment would increase your monthly goal contribution from $${selectedGoal?.monthlyContribution || 500} to $${(selectedGoal?.monthlyContribution || 500) + 200}.`,
      actionable: true,
      category: 'expense-reduction'
    },
    {
      id: 2,
      type: 'income-optimization',
      title: 'Side Income Opportunity',
      impact: '+$300/month',
      confidence: 72,
      description: `Consider freelance opportunities in your field to boost monthly contributions by $300.`,
      details: `Based on your skills and market rates:\n• Freelance consulting: $75/hour\n• 4 hours/week commitment\n• Potential monthly income: $300\n\nThis would reduce your goal timeline by approximately 4 months.`,
      actionable: true,
      category: 'income-boost'
    },
    {
      id: 3,
      type: 'investment-strategy',
      title: 'High-Yield Savings',
      impact: '+$45/month',
      confidence: 95,
      description: `Moving your goal savings to a high-yield account could earn an additional $45/month.`,
      details: `Current savings rate: 0.5% APY\nRecommended: 4.5% APY\nCurrent balance: $${selectedGoal?.currentAmount || 12000}\n\nAdditional monthly earnings: $45\nThis compounds over time, adding significant value to your goal.`,
      actionable: true,
      category: 'optimization'
    },
    {
      id: 4,
      type: 'behavioral-insight',
      title: 'Spending Pattern Alert',
      impact: 'Risk mitigation',
      confidence: 78,
      description: `Your spending increases 23% during holiday seasons. Plan ahead to maintain goal progress.`,
      details: `Historical analysis shows:\n• November spending: +18% above average\n• December spending: +28% above average\n• January recovery: -15% below average\n\nRecommendation: Set aside an extra $150 in October to buffer holiday spending without impacting your goal contributions.`,
      actionable: false,
      category: 'insight'
    }
  ];

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'expense-reduction':
        return 'TrendingDown';
      case 'income-boost':
        return 'TrendingUp';
      case 'optimization':
        return 'Zap';
      case 'insight':
        return 'Lightbulb';
      default:
        return 'Target';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'expense-reduction':
        return 'text-warning';
      case 'income-boost':
        return 'text-success';
      case 'optimization':
        return 'text-accent';
      case 'insight':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  const handleApplyRecommendation = (recommendation) => {
    // Trigger recommendation application
    window.dispatchEvent(new CustomEvent('applyRecommendation', {
      detail: { recommendation, goalId: selectedGoal?.id }
    }));
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">AI Recommendations</h3>
          <p className="text-sm text-muted-foreground">
            Personalized insights to accelerate your goals
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Sparkles" size={16} className="text-accent" />
          <span className="text-xs font-medium text-accent">Powered by AI</span>
        </div>
      </div>
      <div className="space-y-4">
        {recommendations?.map((rec) => (
          <div key={rec?.id} className="border border-border rounded-lg p-4 hover:shadow-elevation-1 transition-smooth">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-lg bg-muted flex items-center justify-center ${getCategoryColor(rec?.category)}`}>
                  <Icon name={getCategoryIcon(rec?.category)} size={16} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{rec?.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{rec?.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-success">{rec?.impact}</div>
                <div className="text-xs text-muted-foreground">{rec?.confidence}% confidence</div>
              </div>
            </div>

            {expandedRecommendation === rec?.id && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <pre className="text-sm text-foreground whitespace-pre-wrap font-sans">
                  {rec?.details}
                </pre>
              </div>
            )}

            <div className="flex items-center justify-between mt-4">
              <Button
                variant="ghost"
                size="sm"
                iconName={expandedRecommendation === rec?.id ? "ChevronUp" : "ChevronDown"}
                onClick={() => setExpandedRecommendation(
                  expandedRecommendation === rec?.id ? null : rec?.id
                )}
                className="text-muted-foreground hover:text-foreground"
              >
                {expandedRecommendation === rec?.id ? 'Less Details' : 'More Details'}
              </Button>
              
              {rec?.actionable && (
                <Button
                  variant="outline"
                  size="sm"
                  iconName="CheckCircle"
                  onClick={() => handleApplyRecommendation(rec)}
                >
                  Apply
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-accent/5 border border-accent/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={16} className="text-accent mt-0.5" />
          <div>
            <h5 className="text-sm font-medium text-foreground">AI Coaching Insight</h5>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedGoal ? 
                `Your ${selectedGoal?.name} is ${selectedGoal?.status === 'on-track' ? 'progressing well' : 'behind schedule'}. Consider implementing the top 2 recommendations to get back on track and achieve your goal ${selectedGoal?.status === 'on-track' ? 'even faster' : 'on time'}.` :
                'Select a goal to receive personalized AI coaching insights and recommendations.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendationsPanel;