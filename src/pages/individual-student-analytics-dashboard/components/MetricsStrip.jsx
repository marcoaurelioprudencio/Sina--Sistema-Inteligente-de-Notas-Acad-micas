import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsStrip = ({ studentData, comparisonMode }) => {
  // Mock metrics data
  const metrics = [
    {
      id: 'gpa',
      label: 'Current GPA',
      value: '3.8',
      previousValue: '3.6',
      trend: 'up',
      trendPercentage: '+5.6%',
      icon: 'TrendingUp',
      color: 'text-success',
      bgColor: 'bg-success/10',
      comparison: comparisonMode === 'peer-average' ? '3.5' : '3.4'
    },
    {
      id: 'attendance',
      label: 'Attendance Rate',
      value: '94%',
      previousValue: '91%',
      trend: 'up',
      trendPercentage: '+3.3%',
      icon: 'Calendar',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      comparison: comparisonMode === 'peer-average' ? '89%' : '92%'
    },
    {
      id: 'completion',
      label: 'Assignment Completion',
      value: '87%',
      previousValue: '92%',
      trend: 'down',
      trendPercentage: '-5.4%',
      icon: 'CheckCircle',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      comparison: comparisonMode === 'peer-average' ? '85%' : '88%'
    },
    {
      id: 'trajectory',
      label: 'Performance Trajectory',
      value: 'Improving',
      previousValue: 'Stable',
      trend: 'up',
      trendPercentage: '+12%',
      icon: 'Activity',
      color: 'text-success',
      bgColor: 'bg-success/10',
      comparison: comparisonMode === 'peer-average' ? 'Stable' : 'Improving'
    }
  ];

  const getTrendIcon = (trend) => {
    return trend === 'up' ? 'TrendingUp' : trend === 'down' ? 'TrendingDown' : 'Minus';
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-success' : trend === 'down' ? 'text-error' : 'text-text-secondary';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric) => (
        <div key={metric.id} className="bg-background border border-border rounded-lg p-6 educational-shadow-card">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className={`w-10 h-10 rounded-lg ${metric.bgColor} flex items-center justify-center`}>
              <Icon name={metric.icon} size={20} className={metric.color} />
            </div>
            <div className={`flex items-center space-x-1 ${getTrendColor(metric.trend)}`}>
              <Icon name={getTrendIcon(metric.trend)} size={16} />
              <span className="text-sm font-medium">{metric.trendPercentage}</span>
            </div>
          </div>

          {/* Main Value */}
          <div className="mb-2">
            <div className="text-2xl font-bold text-text-primary mb-1">
              {metric.value}
            </div>
            <div className="text-sm text-text-secondary">
              {metric.label}
            </div>
          </div>

          {/* Comparison & Previous */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Previous:</span>
              <span className="text-text-primary font-medium">{metric.previousValue}</span>
            </div>
            
            {comparisonMode !== 'none' && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">
                  {comparisonMode === 'peer-average' ? 'Peer Avg:' : 
                   comparisonMode === 'class-benchmark' ? 'Class:' : 'Grade:'}
                </span>
                <span className="text-text-primary font-medium">{metric.comparison}</span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  metric.trend === 'up' ? 'bg-success' : 
                  metric.trend === 'down' ? 'bg-error' : 'bg-text-secondary'
                }`}
                style={{ 
                  width: metric.id === 'trajectory' ? '75%' : metric.value.replace('%', '') + '%' 
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsStrip;