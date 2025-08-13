import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const AnomalyDetection = () => {
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [showResolved, setShowResolved] = useState(false);

  const anomalies = [
    {
      id: 1,
      type: 'unusual_amount',
      severity: 'high',
      title: 'Unusually High Restaurant Spending',
      description: 'Spent $234 at The Gourmet Bistro - 340% above your typical restaurant spending',
      amount: 234,
      category: 'Food & Dining',
      merchant: 'The Gourmet Bistro',
      date: '2025-01-10',
      time: '19:30',
      confidence: 95,
      resolved: false,
      explanation: `This transaction is significantly higher than your average restaurant spending of $68. The amount suggests either a special occasion, group dining, or potential fraud.`,
      recommendations: [
        'Verify this was an intentional purchase',
        'Check if you were dining with others',
        'Consider setting spending alerts for amounts above $150'
      ]
    },
    {
      id: 2,
      type: 'unusual_location',
      severity: 'medium',
      title: 'Transaction in Unusual Location',
      description: 'Gas purchase in Portland, OR - 250 miles from your usual area',
      amount: 67,
      category: 'Transportation',
      merchant: 'Shell Gas Station',
      date: '2025-01-09',
      time: '14:22',
      confidence: 78,
      resolved: false,
      explanation: `This gas purchase was made in Portland, OR, which is outside your typical spending area. This could indicate travel or potential card misuse.`,
      recommendations: [
        'Confirm you were traveling to Portland',
        'Enable location-based alerts',
        'Review other transactions from this date'
      ]
    },
    {
      id: 3,
      type: 'unusual_time',
      severity: 'low',
      title: 'Late Night Online Purchase',
      description: 'Amazon purchase at 2:47 AM - outside your typical shopping hours',
      amount: 89,
      category: 'Shopping',
      merchant: 'Amazon',
      date: '2025-01-08',
      time: '02:47',
      confidence: 62,
      resolved: true,
      explanation: `This purchase was made at 2:47 AM, which is unusual for your shopping patterns. Late-night purchases can sometimes indicate impulse buying.`,
      recommendations: [
        'Review if this was a planned purchase',
        'Consider setting shopping time restrictions',
        'Enable purchase confirmation for late hours'
      ]
    },
    {
      id: 4,
      type: 'duplicate_transaction',
      severity: 'high',
      title: 'Potential Duplicate Charge',
      description: 'Two identical charges from Starbucks within 3 minutes',
      amount: 5.47,
      category: 'Food & Dining',
      merchant: 'Starbucks',
      date: '2025-01-07',
      time: '08:15',
      confidence: 88,
      resolved: false,
      explanation: `Two identical transactions of $5.47 were processed within 3 minutes at the same Starbucks location. This suggests a potential duplicate charge or system error.`,
      recommendations: [
        'Contact Starbucks to verify charges',
        'Check your receipt for duplicate items',
        'Dispute the duplicate charge if confirmed'
      ]
    },
    {
      id: 5,
      type: 'spending_spike',
      severity: 'medium',
      title: 'Category Spending Spike',
      description: 'Entertainment spending 180% above monthly average',
      amount: 456,
      category: 'Entertainment',
      merchant: 'Multiple Merchants',
      date: '2025-01-06',
      time: 'All Day',
      confidence: 71,
      resolved: false,
      explanation: `Your entertainment spending this month is significantly higher than usual. This includes movie tickets, streaming services, and event tickets.`,
      recommendations: [
        'Review entertainment budget allocation',
        'Track upcoming entertainment expenses',
        'Consider setting category spending limits'
      ]
    }
  ];

  const severityOptions = [
    { value: 'all', label: 'All Severities', count: anomalies?.length },
    { value: 'high', label: 'High', count: anomalies?.filter(a => a?.severity === 'high')?.length },
    { value: 'medium', label: 'Medium', count: anomalies?.filter(a => a?.severity === 'medium')?.length },
    { value: 'low', label: 'Low', count: anomalies?.filter(a => a?.severity === 'low')?.length }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return 'AlertTriangle';
      case 'medium': return 'AlertCircle';
      case 'low': return 'Info';
      default: return 'Bell';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'unusual_amount': return 'DollarSign';
      case 'unusual_location': return 'MapPin';
      case 'unusual_time': return 'Clock';
      case 'duplicate_transaction': return 'Copy';
      case 'spending_spike': return 'TrendingUp';
      default: return 'AlertCircle';
    }
  };

  const filteredAnomalies = anomalies?.filter(anomaly => {
    const severityMatch = selectedSeverity === 'all' || anomaly?.severity === selectedSeverity;
    const resolvedMatch = showResolved || !anomaly?.resolved;
    return severityMatch && resolvedMatch;
  });

  const handleResolve = (anomalyId) => {
    // In a real app, this would update the backend
    console.log(`Resolving anomaly ${anomalyId}`);
  };

  const handleDismiss = (anomalyId) => {
    // In a real app, this would update the backend
    console.log(`Dismissing anomaly ${anomalyId}`);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <Icon name="Shield" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">AI Anomaly Detection</h3>
        </div>
        
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showResolved}
              onChange={(e) => setShowResolved(e?.target?.checked)}
              className="rounded border-border"
            />
            <span className="text-sm text-muted-foreground">Show resolved</span>
          </label>
        </div>
      </div>
      {/* Severity Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {severityOptions?.map((option) => (
          <button
            key={option?.value}
            onClick={() => setSelectedSeverity(option?.value)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-smooth ${
              selectedSeverity === option?.value
                ? 'border-primary bg-primary/10 text-primary' :'border-border text-muted-foreground hover:border-primary/50'
            }`}
          >
            <span className="text-sm font-medium">{option?.label}</span>
            <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
              {option?.count}
            </span>
          </button>
        ))}
      </div>
      {/* Anomalies List */}
      <div className="space-y-4">
        {filteredAnomalies?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">No Anomalies Found</h4>
            <p className="text-muted-foreground">
              {showResolved ? 'No anomalies match your current filters.' : 'All anomalies have been resolved.'}
            </p>
          </div>
        ) : (
          filteredAnomalies?.map((anomaly) => (
            <div
              key={anomaly?.id}
              className={`border rounded-lg p-4 transition-smooth ${
                anomaly?.resolved 
                  ? 'border-border bg-muted/30' :'border-border hover:border-primary/50 bg-card'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    anomaly?.severity === 'high' ? 'bg-error/10' :
                    anomaly?.severity === 'medium' ? 'bg-warning/10' : 'bg-success/10'
                  }`}>
                    <Icon 
                      name={getTypeIcon(anomaly?.type)} 
                      size={16} 
                      className={getSeverityColor(anomaly?.severity)}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-foreground">{anomaly?.title}</h4>
                      <div className="flex items-center space-x-1">
                        <Icon 
                          name={getSeverityIcon(anomaly?.severity)} 
                          size={14} 
                          className={getSeverityColor(anomaly?.severity)}
                        />
                        <span className={`text-xs font-medium ${getSeverityColor(anomaly?.severity)}`}>
                          {anomaly?.severity?.toUpperCase()}
                        </span>
                      </div>
                      {anomaly?.resolved && (
                        <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full">
                          Resolved
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {anomaly?.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>${anomaly?.amount}</span>
                      <span>{anomaly?.merchant}</span>
                      <span>{anomaly?.date} at {anomaly?.time}</span>
                      <span>Confidence: {anomaly?.confidence}%</span>
                    </div>
                  </div>
                </div>
                
                {!anomaly?.resolved && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleResolve(anomaly?.id)}
                      className="text-xs text-success hover:text-success/80 transition-smooth"
                    >
                      Resolve
                    </button>
                    <button
                      onClick={() => handleDismiss(anomaly?.id)}
                      className="text-xs text-muted-foreground hover:text-foreground transition-smooth"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
              
              {/* Expandable Details */}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="mb-3">
                  <h5 className="text-sm font-medium text-foreground mb-2">AI Explanation</h5>
                  <p className="text-sm text-muted-foreground">{anomaly?.explanation}</p>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-foreground mb-2">Recommendations</h5>
                  <ul className="space-y-1">
                    {anomaly?.recommendations?.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm text-muted-foreground">
                        <Icon name="ArrowRight" size={12} className="mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AnomalyDetection;