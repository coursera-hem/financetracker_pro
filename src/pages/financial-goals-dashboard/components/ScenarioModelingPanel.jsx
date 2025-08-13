import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ScenarioModelingPanel = ({ selectedGoal, onScenarioChange }) => {
  const [monthlyContribution, setMonthlyContribution] = useState(selectedGoal?.monthlyContribution || 500);
  const [oneTimeContribution, setOneTimeContribution] = useState(0);
  const [targetAdjustment, setTargetAdjustment] = useState(selectedGoal?.targetAmount || 25000);
  const [scenarios, setScenarios] = useState([]);

  useEffect(() => {
    if (selectedGoal) {
      setMonthlyContribution(selectedGoal?.monthlyContribution);
      setTargetAdjustment(selectedGoal?.targetAmount);
      calculateScenarios();
    }
  }, [selectedGoal]);

  const calculateScenarios = () => {
    if (!selectedGoal) return;

    const currentAmount = selectedGoal?.currentAmount;
    const baseMonthly = selectedGoal?.monthlyContribution;
    
    const newScenarios = [
      {
        id: 'current',
        name: 'Current Plan',
        monthlyContribution: baseMonthly,
        oneTime: 0,
        targetAmount: selectedGoal?.targetAmount,
        timeToCompletion: Math.ceil((selectedGoal?.targetAmount - currentAmount) / baseMonthly),
        totalContributions: (selectedGoal?.targetAmount - currentAmount),
        status: 'current'
      },
      {
        id: 'increased',
        name: 'Increased Monthly (+$200)',
        monthlyContribution: baseMonthly + 200,
        oneTime: 0,
        targetAmount: selectedGoal?.targetAmount,
        timeToCompletion: Math.ceil((selectedGoal?.targetAmount - currentAmount) / (baseMonthly + 200)),
        totalContributions: (selectedGoal?.targetAmount - currentAmount),
        status: 'improvement'
      },
      {
        id: 'onetime',
        name: 'One-time Boost ($2,000)',
        monthlyContribution: baseMonthly,
        oneTime: 2000,
        targetAmount: selectedGoal?.targetAmount,
        timeToCompletion: Math.ceil((selectedGoal?.targetAmount - currentAmount - 2000) / baseMonthly),
        totalContributions: (selectedGoal?.targetAmount - currentAmount),
        status: 'improvement'
      },
      {
        id: 'reduced-target',
        name: 'Reduced Target (-$5,000)',
        monthlyContribution: baseMonthly,
        oneTime: 0,
        targetAmount: selectedGoal?.targetAmount - 5000,
        timeToCompletion: Math.ceil((selectedGoal?.targetAmount - 5000 - currentAmount) / baseMonthly),
        totalContributions: (selectedGoal?.targetAmount - 5000 - currentAmount),
        status: 'alternative'
      }
    ];

    setScenarios(newScenarios);
  };

  const calculateCustomScenario = () => {
    if (!selectedGoal) return null;

    const remaining = targetAdjustment - selectedGoal?.currentAmount - oneTimeContribution;
    const timeToCompletion = remaining > 0 ? Math.ceil(remaining / monthlyContribution) : 0;
    
    return {
      timeToCompletion,
      totalContributions: remaining + oneTimeContribution,
      monthsSaved: Math.ceil((selectedGoal?.targetAmount - selectedGoal?.currentAmount) / selectedGoal?.monthlyContribution) - timeToCompletion
    };
  };

  const customScenario = calculateCustomScenario();

  const getStatusColor = (status) => {
    switch (status) {
      case 'current':
        return 'border-muted text-muted-foreground';
      case 'improvement':
        return 'border-success text-success';
      case 'alternative':
        return 'border-accent text-accent';
      default:
        return 'border-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'current':
        return 'Clock';
      case 'improvement':
        return 'TrendingUp';
      case 'alternative':
        return 'Shuffle';
      default:
        return 'Target';
    }
  };

  const handleApplyScenario = (scenario) => {
    if (onScenarioChange) {
      onScenarioChange(scenario);
    }
    
    window.dispatchEvent(new CustomEvent('applyScenario', {
      detail: { scenario, goalId: selectedGoal?.id }
    }));
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Scenario Modeling</h3>
          <p className="text-sm text-muted-foreground">
            Adjust parameters to see impact on goal completion
          </p>
        </div>
        <Icon name="Calculator" size={20} className="text-muted-foreground" />
      </div>
      {selectedGoal ? (
        <>
          {/* Custom Scenario Builder */}
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <h4 className="font-medium text-foreground mb-4">Custom Scenario</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Input
                label="Monthly Contribution"
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e?.target?.value))}
                placeholder="500"
              />
              <Input
                label="One-time Contribution"
                type="number"
                value={oneTimeContribution}
                onChange={(e) => setOneTimeContribution(Number(e?.target?.value))}
                placeholder="0"
              />
              <Input
                label="Target Amount"
                type="number"
                value={targetAdjustment}
                onChange={(e) => setTargetAdjustment(Number(e?.target?.value))}
                placeholder="25000"
              />
            </div>
            
            {customScenario && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-card rounded-lg border border-border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{customScenario?.timeToCompletion}</div>
                  <div className="text-sm text-muted-foreground">Months to Complete</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">
                    {customScenario?.monthsSaved > 0 ? customScenario?.monthsSaved : 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Months Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    ${customScenario?.totalContributions?.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Needed</div>
                </div>
              </div>
            )}
          </div>

          {/* Predefined Scenarios */}
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Quick Scenarios</h4>
            {scenarios?.map((scenario) => (
              <div key={scenario?.id} className={`p-4 rounded-lg border-2 ${getStatusColor(scenario?.status)}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Icon name={getStatusIcon(scenario?.status)} size={16} />
                    <span className="font-medium">{scenario?.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Play"
                    onClick={() => handleApplyScenario(scenario)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Apply
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Monthly</div>
                    <div className="font-medium">${scenario?.monthlyContribution}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">One-time</div>
                    <div className="font-medium">${scenario?.oneTime}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Target</div>
                    <div className="font-medium">${scenario?.targetAmount?.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Completion</div>
                    <div className="font-medium">{scenario?.timeToCompletion} months</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-accent/5 border border-accent/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="Lightbulb" size={16} className="text-accent mt-0.5" />
              <div>
                <h5 className="text-sm font-medium text-foreground">Optimization Tip</h5>
                <p className="text-sm text-muted-foreground mt-1">
                  Increasing your monthly contribution by just $100 could reduce your timeline by 3-4 months. 
                  Consider automating transfers to make consistent contributions easier.
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-40">
          <div className="text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Calculator" size={24} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Select a goal to model scenarios</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScenarioModelingPanel;