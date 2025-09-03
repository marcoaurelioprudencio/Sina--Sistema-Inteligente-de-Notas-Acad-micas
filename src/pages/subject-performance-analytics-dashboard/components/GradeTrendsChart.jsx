import React, { useState } from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GradeTrendsChart = ({ selectedFilters }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('month');
  const [selectedView, setSelectedView] = useState('combined');

  // Mock data for grade trends with assignment timeline
  const trendData = [
    {
      date: '2024-07-01',
      dateLabel: 'Week 1',
      averageGrade: 78.5,
      assignmentCount: 3,
      difficulty: 0.6,
      participation: 85,
      assignments: ['Quiz 1', 'Homework 1', 'Discussion']
    },
    {
      date: '2024-07-08',
      dateLabel: 'Week 2',
      averageGrade: 81.2,
      assignmentCount: 4,
      difficulty: 0.65,
      participation: 88,
      assignments: ['Test 1', 'Project Start', 'Quiz 2', 'Homework 2']
    },
    {
      date: '2024-07-15',
      dateLabel: 'Week 3',
      averageGrade: 79.8,
      assignmentCount: 2,
      difficulty: 0.72,
      participation: 82,
      assignments: ['Midterm Prep', 'Group Work']
    },
    {
      date: '2024-07-22',
      dateLabel: 'Week 4',
      averageGrade: 84.1,
      assignmentCount: 5,
      difficulty: 0.58,
      participation: 91,
      assignments: ['Midterm', 'Quiz 3', 'Presentation', 'Homework 3', 'Review']
    },
    {
      date: '2024-07-29',
      dateLabel: 'Current',
      averageGrade: 82.4,
      assignmentCount: 3,
      difficulty: 0.68,
      participation: 87,
      assignments: ['Quiz 4', 'Project Due', 'Discussion 2']
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-4 educational-shadow-modal">
          <h4 className="font-medium text-text-primary mb-2">{label}</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Average Grade:</span>
              <span className="text-sm font-medium text-text-primary">{data.averageGrade}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Assignments:</span>
              <span className="text-sm font-medium text-text-primary">{data.assignmentCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Difficulty Index:</span>
              <span className="text-sm font-medium text-text-primary">{data.difficulty}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Participation:</span>
              <span className="text-sm font-medium text-text-primary">{data.participation}%</span>
            </div>
            {data.assignments && (
              <div className="mt-3 pt-2 border-t border-border">
                <span className="text-xs text-text-secondary">Assignments:</span>
                <div className="mt-1 space-y-1">
                  {data.assignments.map((assignment, index) => (
                    <div key={index} className="text-xs text-text-primary">• {assignment}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const timeRangeOptions = [
    { value: 'week', label: 'Week', icon: 'Calendar' },
    { value: 'month', label: 'Month', icon: 'CalendarDays' },
    { value: 'term', label: 'Term', icon: 'CalendarRange' }
  ];

  const viewOptions = [
    { value: 'combined', label: 'Combined View', icon: 'BarChart3' },
    { value: 'grades', label: 'Grades Only', icon: 'TrendingUp' },
    { value: 'assignments', label: 'Assignments Only', icon: 'FileText' }
  ];

  return (
    <div className="bg-background border border-border rounded-lg p-6">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="TrendingUp" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-text-primary">Grade Trends & Assignment Timeline</h3>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Time Range Selector */}
          <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
            {timeRangeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedTimeRange(option.value)}
                className={`
                  flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm educational-transition
                  ${selectedTimeRange === option.value
                    ? 'bg-background text-text-primary shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                  }
                `}
              >
                <Icon name={option.icon} size={14} />
                <span>{option.label}</span>
              </button>
            ))}
          </div>

          {/* View Selector */}
          <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
            {viewOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedView(option.value)}
                className={`
                  flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm educational-transition
                  ${selectedView === option.value
                    ? 'bg-background text-text-primary shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                  }
                `}
              >
                <Icon name={option.icon} size={14} />
                <span className="hidden sm:inline">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="w-full h-80" aria-label="Grade Trends and Assignment Timeline Chart">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="dateLabel" 
              stroke="var(--color-text-secondary)"
              fontSize={12}
            />
            <YAxis 
              yAxisId="grade"
              orientation="left"
              stroke="var(--color-text-secondary)"
              fontSize={12}
              domain={[0, 100]}
            />
            <YAxis 
              yAxisId="count"
              orientation="right"
              stroke="var(--color-text-secondary)"
              fontSize={12}
              domain={[0, 10]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {(selectedView === 'combined' || selectedView === 'assignments') && (
              <Bar 
                yAxisId="count"
                dataKey="assignmentCount" 
                fill="var(--color-accent)"
                name="Assignment Count"
                opacity={0.7}
              />
            )}
            
            {(selectedView === 'combined' || selectedView === 'grades') && (
              <Line 
                yAxisId="grade"
                type="monotone" 
                dataKey="averageGrade" 
                stroke="var(--color-primary)"
                strokeWidth={3}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                name="Average Grade (%)"
              />
            )}
            
            {selectedView === 'combined' && (
              <Line 
                yAxisId="grade"
                type="monotone" 
                dataKey="participation" 
                stroke="var(--color-warning)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: 'var(--color-warning)', strokeWidth: 2, r: 3 }}
                name="Participation (%)"
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Actions */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-4 text-sm text-text-secondary">
          <span className="flex items-center space-x-1">
            <Icon name="Calendar" size={14} />
            <span>Data Range: July 2024</span>
          </span>
          <span className="flex items-center space-x-1">
            <Icon name="RefreshCw" size={14} />
            <span>Updated: 2 min ago</span>
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" iconName="Download">
            Export Data
          </Button>
          <Button variant="ghost" size="sm" iconName="Maximize2">
            Full Screen
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GradeTrendsChart;