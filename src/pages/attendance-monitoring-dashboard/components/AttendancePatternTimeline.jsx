import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from '../../../components/AppIcon';

const AttendancePatternTimeline = ({ selectedClass, timeRange }) => {
  const [activeView, setActiveView] = useState('timeline');

  // Mock timeline data
  const timelineData = [
    { date: '2025-07-01', attendance: 94, performance: 87, incidents: 2 },
    { date: '2025-07-02', attendance: 91, performance: 85, incidents: 3 },
    { date: '2025-07-03', attendance: 96, performance: 89, incidents: 1 },
    { date: '2025-07-04', attendance: 89, performance: 82, incidents: 4 },
    { date: '2025-07-05', attendance: 93, performance: 88, incidents: 2 },
    { date: '2025-07-08', attendance: 95, performance: 90, incidents: 1 },
    { date: '2025-07-09', attendance: 88, performance: 81, incidents: 5 },
    { date: '2025-07-10', attendance: 92, performance: 86, incidents: 3 },
    { date: '2025-07-11', attendance: 97, performance: 91, incidents: 0 },
    { date: '2025-07-12', attendance: 90, performance: 84, incidents: 2 },
    { date: '2025-07-15', attendance: 94, performance: 88, incidents: 1 },
    { date: '2025-07-16', attendance: 91, performance: 85, incidents: 3 },
    { date: '2025-07-17', attendance: 96, performance: 89, incidents: 1 },
    { date: '2025-07-18', attendance: 93, performance: 87, incidents: 2 },
    { date: '2025-07-19', attendance: 95, performance: 90, incidents: 1 },
    { date: '2025-07-22', attendance: 89, performance: 83, incidents: 4 },
    { date: '2025-07-23', attendance: 92, performance: 86, incidents: 2 },
    { date: '2025-07-24', attendance: 94, performance: 88, incidents: 1 },
    { date: '2025-07-25', attendance: 92, performance: 87, incidents: 2 }
  ];

  // Mock day-of-week pattern data
  const dayPatternData = [
    { day: 'Monday', attendance: 89, avgRate: 89 },
    { day: 'Tuesday', attendance: 94, avgRate: 94 },
    { day: 'Wednesday', attendance: 96, avgRate: 96 },
    { day: 'Thursday', attendance: 93, avgRate: 93 },
    { day: 'Friday', attendance: 87, avgRate: 87 }
  ];

  const viewOptions = [
    { id: 'timeline', label: 'Timeline View', icon: 'TrendingUp' },
    { id: 'patterns', label: 'Day Patterns', icon: 'BarChart3' }
  ];

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 educational-shadow-modal">
          <p className="text-sm font-medium text-text-primary mb-2">
            {activeView === 'timeline' ? formatDate(label) : label}
          </p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-text-secondary">{entry.name}:</span>
              <span className="font-medium text-text-primary">
                {entry.name === 'Incidents' ? entry.value : `${entry.value}%`}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg educational-shadow-card">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="Activity" size={20} color="var(--color-primary)" />
            <h3 className="text-lg font-semibold text-text-primary">Attendance Patterns</h3>
          </div>
          
          <div className="flex items-center space-x-2">
            {viewOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setActiveView(option.id)}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium educational-transition
                  ${activeView === option.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-text-secondary hover:text-text-primary hover:bg-muted'
                  }
                `}
              >
                <Icon name={option.icon} size={16} />
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        {activeView === 'timeline' && (
          <div>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-text-primary mb-2">
                Attendance vs Performance Correlation
              </h4>
              <p className="text-xs text-text-secondary">
                Track how attendance patterns correlate with academic performance and behavioral incidents
              </p>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    stroke="var(--color-text-secondary)"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="var(--color-text-secondary)"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="attendance" 
                    stroke="var(--color-primary)" 
                    strokeWidth={2}
                    name="Attendance Rate"
                    dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="performance" 
                    stroke="var(--color-success)" 
                    strokeWidth={2}
                    name="Performance Score"
                    dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="incidents" 
                    stroke="var(--color-error)" 
                    strokeWidth={2}
                    name="Incidents"
                    dot={{ fill: 'var(--color-error)', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Correlation Insights */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-success/5 border border-success/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="TrendingUp" size={16} className="text-success" />
                  <span className="text-sm font-medium text-success">Strong Correlation</span>
                </div>
                <p className="text-xs text-text-secondary">
                  85% correlation between attendance and performance scores
                </p>
              </div>
              
              <div className="bg-warning/5 border border-warning/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="AlertTriangle" size={16} className="text-warning" />
                  <span className="text-sm font-medium text-warning">Pattern Alert</span>
                </div>
                <p className="text-xs text-text-secondary">
                  Monday attendance 7% below weekly average
                </p>
              </div>
              
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Target" size={16} className="text-primary" />
                  <span className="text-sm font-medium text-primary">Goal Progress</span>
                </div>
                <p className="text-xs text-text-secondary">
                  92% toward 95% monthly attendance target
                </p>
              </div>
            </div>
          </div>
        )}

        {activeView === 'patterns' && (
          <div>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-text-primary mb-2">
                Day-of-Week Attendance Patterns
              </h4>
              <p className="text-xs text-text-secondary">
                Identify which days have consistently lower attendance rates
              </p>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dayPatternData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis 
                    dataKey="day" 
                    stroke="var(--color-text-secondary)"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="var(--color-text-secondary)"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="attendance" 
                    fill="var(--color-primary)"
                    name="Attendance Rate"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pattern Insights */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-error rounded-full"></div>
                  <span className="text-sm text-text-primary">Monday Blues Effect</span>
                </div>
                <span className="text-sm font-medium text-error">-7% vs average</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-sm text-text-primary">Mid-week Peak</span>
                </div>
                <span className="text-sm font-medium text-success">+4% vs average</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <span className="text-sm text-text-primary">Friday Decline</span>
                </div>
                <span className="text-sm font-medium text-warning">-5% vs average</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendancePatternTimeline;