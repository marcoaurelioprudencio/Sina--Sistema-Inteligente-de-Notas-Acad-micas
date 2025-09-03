import React from 'react';
import Icon from '../../../components/AppIcon';

const SubjectKPIHeader = ({ selectedFilters }) => {
  // Mock KPI data based on selected filters
  const kpiData = {
    subjectAverage: {
      current: 82.4,
      previous: 79.8,
      benchmark: 85.0,
      trend: 'up'
    },
    gradeDistribution: {
      variance: 12.3,
      previous: 15.1,
      benchmark: 10.0,
      trend: 'down'
    },
    assignmentDifficulty: {
      index: 0.68,
      previous: 0.72,
      benchmark: 0.65,
      trend: 'down'
    },
    engagementScore: {
      current: 87.2,
      previous: 84.6,
      benchmark: 90.0,
      trend: 'up'
    }
  };

  const formatTrend = (current, previous) => {
    const change = ((current - previous) / previous * 100).toFixed(1);
    return {
      value: Math.abs(change),
      direction: current >= previous ? 'up' : 'down',
      isPositive: current >= previous
    };
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? 'TrendingUp' : 'TrendingDown';
  };

  const getTrendColor = (trend, isPositive) => {
    if (trend === 'up' && isPositive) return 'text-success';
    if (trend === 'down' && !isPositive) return 'text-error';
    if (trend === 'up' && !isPositive) return 'text-error';
    return 'text-success';
  };

  const kpiCards = [
    {
      id: 'average',
      title: 'Subject Average',
      value: `${kpiData.subjectAverage.current}%`,
      benchmark: `Target: ${kpiData.subjectAverage.benchmark}%`,
      trend: formatTrend(kpiData.subjectAverage.current, kpiData.subjectAverage.previous),
      icon: 'Target',
      description: 'Overall class performance'
    },
    {
      id: 'variance',
      title: 'Grade Distribution',
      value: `±${kpiData.gradeDistribution.variance}%`,
      benchmark: `Target: ±${kpiData.gradeDistribution.benchmark}%`,
      trend: formatTrend(kpiData.gradeDistribution.benchmark, kpiData.gradeDistribution.variance),
      icon: 'BarChart3',
      description: 'Performance consistency'
    },
    {
      id: 'difficulty',
      title: 'Assignment Difficulty',
      value: kpiData.assignmentDifficulty.index.toFixed(2),
      benchmark: `Target: ${kpiData.assignmentDifficulty.benchmark}`,
      trend: formatTrend(kpiData.assignmentDifficulty.benchmark, kpiData.assignmentDifficulty.index),
      icon: 'Brain',
      description: 'Content complexity index'
    },
    {
      id: 'engagement',
      title: 'Student Engagement',
      value: `${kpiData.engagementScore.current}%`,
      benchmark: `Target: ${kpiData.engagementScore.benchmark}%`,
      trend: formatTrend(kpiData.engagementScore.current, kpiData.engagementScore.previous),
      icon: 'Heart',
      description: 'Participation & interest'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {kpiCards.map((card) => (
        <div key={card.id} className="bg-background border border-border rounded-lg p-4 educational-shadow-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name={card.icon} size={16} color="var(--color-primary)" />
              </div>
              <h3 className="text-sm font-medium text-text-primary">{card.title}</h3>
            </div>
            <div className={`flex items-center space-x-1 ${getTrendColor(card.trend.direction, card.trend.isPositive)}`}>
              <Icon name={getTrendIcon(card.trend.direction)} size={14} />
              <span className="text-xs font-medium">{card.trend.value}%</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-semibold text-text-primary">{card.value}</span>
            </div>
            
            <div className="text-xs text-text-secondary">
              {card.benchmark}
            </div>
            
            <div className="text-xs text-text-secondary">
              {card.description}
            </div>
          </div>

          {/* Progress indicator */}
          <div className="mt-3">
            <div className="w-full bg-muted rounded-full h-1.5">
              <div 
                className="bg-primary h-1.5 rounded-full educational-transition"
                style={{ 
                  width: card.id === 'average' ? '82%' : 
                         card.id === 'variance' ? '65%' : 
                         card.id === 'difficulty' ? '68%' : '87%' 
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubjectKPIHeader;