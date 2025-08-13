import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MilestoneTracker = ({ selectedGoal }) => {
  const [celebrationVisible, setCelebrationVisible] = useState(false);

  const milestones = [
    {
      id: 1,
      title: '10% Complete',
      description: 'Great start! You\'ve taken the first step.',
      targetAmount: 2500,
      achieved: true,
      achievedDate: '2024-01-15',
      reward: 'Treat yourself to a nice dinner'
    },
    {
      id: 2,
      title: '25% Complete',
      description: 'Quarter way there! Momentum is building.',
      targetAmount: 6250,
      achieved: true,
      achievedDate: '2024-03-20',
      reward: 'Weekend getaway'
    },
    {
      id: 3,
      title: '50% Complete',
      description: 'Halfway milestone! You\'re doing amazing.',
      targetAmount: 12500,
      achieved: true,
      achievedDate: '2024-07-10',
      reward: 'New gadget or hobby equipment'
    },
    {
      id: 4,
      title: '75% Complete',
      description: 'Three-quarters done! The finish line is in sight.',
      targetAmount: 18750,
      achieved: false,
      projectedDate: '2024-11-15',
      reward: 'Spa day or special experience'
    },
    {
      id: 5,
      title: '100% Complete',
      description: 'Goal achieved! Time to celebrate your success.',
      targetAmount: 25000,
      achieved: false,
      projectedDate: '2025-02-28',
      reward: 'Major celebration - you earned it!'
    }
  ];

  const achievements = [
    {
      id: 1,
      title: 'Consistency Champion',
      description: 'Made contributions for 6 consecutive months',
      icon: 'Award',
      earnedDate: '2024-06-30',
      category: 'consistency'
    },
    {
      id: 2,
      title: 'Early Bird',
      description: 'Made contribution before the 5th of the month',
      icon: 'Clock',
      earnedDate: '2024-07-03',
      category: 'timing'
    },
    {
      id: 3,
      title: 'Bonus Booster',
      description: 'Added extra $500 from bonus money',
      icon: 'TrendingUp',
      earnedDate: '2024-05-15',
      category: 'extra'
    },
    {
      id: 4,
      title: 'Milestone Master',
      description: 'Reached 3 major milestones',
      icon: 'Target',
      earnedDate: '2024-07-10',
      category: 'milestone'
    }
  ];

  const getCategoryColor = (category) => {
    switch (category) {
      case 'consistency':
        return 'text-success bg-success/10';
      case 'timing':
        return 'text-primary bg-primary/10';
      case 'extra':
        return 'text-accent bg-accent/10';
      case 'milestone':
        return 'text-warning bg-warning/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const handleCelebrateMilestone = (milestone) => {
    setCelebrationVisible(true);
    setTimeout(() => setCelebrationVisible(false), 3000);
    
    window.dispatchEvent(new CustomEvent('celebrateMilestone', {
      detail: { milestone, goalId: selectedGoal?.id }
    }));
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Milestone Tracker</h3>
          <p className="text-sm text-muted-foreground">
            Celebrate your progress and achievements
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Trophy" size={16} className="text-warning" />
          <span className="text-sm font-medium text-warning">
            {achievements?.length} Achievements
          </span>
        </div>
      </div>
      {selectedGoal ? (
        <div className="space-y-6">
          {/* Milestone Progress */}
          <div>
            <h4 className="font-medium text-foreground mb-4">Goal Milestones</h4>
            <div className="space-y-4">
              {milestones?.map((milestone, index) => (
                <div key={milestone?.id} className="flex items-start space-x-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      milestone?.achieved 
                        ? 'bg-success text-white' 
                        : selectedGoal?.currentAmount >= milestone?.targetAmount
                        ? 'bg-primary text-white' :'bg-muted text-muted-foreground'
                    }`}>
                      {milestone?.achieved ? (
                        <Icon name="Check" size={16} />
                      ) : (
                        <span className="text-xs font-medium">{index + 1}</span>
                      )}
                    </div>
                    {index < milestones?.length - 1 && (
                      <div className={`w-0.5 h-8 mt-2 ${
                        milestone?.achieved ? 'bg-success' : 'bg-muted'
                      }`} />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-medium text-foreground">{milestone?.title}</h5>
                      <span className="text-sm text-muted-foreground">
                        ${milestone?.targetAmount?.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{milestone?.description}</p>
                    
                    {milestone?.achieved ? (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-success">
                          Achieved on {milestone?.achievedDate}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="Gift"
                          onClick={() => handleCelebrateMilestone(milestone)}
                          className="text-warning hover:text-warning"
                        >
                          Reward: {milestone?.reward}
                        </Button>
                      </div>
                    ) : selectedGoal?.currentAmount >= milestone?.targetAmount ? (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-primary font-medium">
                          Ready to celebrate! 🎉
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          iconName="PartyPopper"
                          onClick={() => handleCelebrateMilestone(milestone)}
                        >
                          Celebrate
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Projected: {milestone?.projectedDate}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievement Badges */}
          <div>
            <h4 className="font-medium text-foreground mb-4">Achievement Badges</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements?.map((achievement) => (
                <div key={achievement?.id} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryColor(achievement?.category)}`}>
                    <Icon name={achievement?.icon} size={18} />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-foreground">{achievement?.title}</h5>
                    <p className="text-sm text-muted-foreground">{achievement?.description}</p>
                    <span className="text-xs text-muted-foreground">
                      Earned on {achievement?.earnedDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Milestone Preview */}
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="Target" size={16} className="text-primary mt-0.5" />
              <div>
                <h5 className="text-sm font-medium text-foreground">Next Milestone</h5>
                <p className="text-sm text-muted-foreground mt-1">
                  You're ${(18750 - selectedGoal?.currentAmount)?.toLocaleString()} away from your 75% milestone. 
                  At your current pace, you'll reach it by November 15th!
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-40">
          <div className="text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Trophy" size={24} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Select a goal to view milestones</p>
          </div>
        </div>
      )}
      {/* Celebration Animation */}
      {celebrationVisible && (
        <div className="fixed inset-0 z-1000 flex items-center justify-center pointer-events-none">
          <div className="text-6xl animate-bounce">🎉</div>
        </div>
      )}
    </div>
  );
};

export default MilestoneTracker;