import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GradeProgressionChart = ({ studentData, comparisonMode }) => {
  const [selectedSubjects, setSelectedSubjects] = useState(['math', 'english', 'science']);
  const [timeRange, setTimeRange] = useState('semester');

  // Mock grade progression data
  const gradeData = [
    {
      date: '2024-01-15',
      week: 'Week 1',
      math: 85,
      english: 88,
      science: 82,
      history: 90,
      peerAverage: 83,
      classAverage: 81
    },
    {
      date: '2024-01-22',
      week: 'Week 2',
      math: 87,
      english: 85,
      science: 84,
      history: 88,
      peerAverage: 84,
      classAverage: 82
    },
    {
      date: '2024-01-29',
      week: 'Week 3',
      math: 82,
      english: 90,
      science: 86,
      history: 92,
      peerAverage: 85,
      classAverage: 83
    },
    {
      date: '2024-02-05',
      week: 'Week 4',
      math: 89,
      english: 87,
      science: 88,
      history: 89,
      peerAverage: 86,
      classAverage: 84
    },
    {
      date: '2024-02-12',
      week: 'Week 5',
      math: 91,
      english: 92,
      science: 85,
      history: 94,
      peerAverage: 87,
      classAverage: 85
    },
    {
      date: '2024-02-19',
      week: 'Week 6',
      math: 88,
      english: 89,
      science: 90,
      history: 91,
      peerAverage: 88,
      classAverage: 86
    }
  ];

  const subjects = [
    { id: 'math', label: 'Mathematics', color: '#3B82F6' },
    { id: 'english', label: 'English', color: '#10B981' },
    { id: 'science', label: 'Science', color: '#F59E0B' },
    { id: 'history', label: 'History', color: '#8B5CF6' }
  ];

  const toggleSubject = (subjectId) => {
    setSelectedSubjects(prev => 
      prev.includes(subjectId) 
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 educational-shadow-modal">
          <p className="text-sm font-medium text-text-primary mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-text-secondary">{entry.name}:</span>
              <span className="font-medium text-text-primary">{entry.value}%</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-background border border-border rounded-lg p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="TrendingUp" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-text-primary">Grade Progression Over Time</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" iconName="Download">
            Export
          </Button>
          <Button variant="outline" size="sm" iconName="Maximize2">
            Fullscreen
          </Button>
        </div>
      </div>

      {/* Subject Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-sm text-text-secondary mr-2">Subjects:</span>
        {subjects.map((subject) => (
          <button
            key={subject.id}
            onClick={() => toggleSubject(subject.id)}
            className={`
              flex items-center space-x-2 px-3 py-1 rounded-full text-sm educational-transition
              ${selectedSubjects.includes(subject.id)
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-text-secondary hover:bg-muted/80'
              }
            `}
          >
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: subject.color }}
            />
            <span>{subject.label}</span>
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={gradeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="week" 
              stroke="var(--color-text-secondary)"
              fontSize={12}
            />
            <YAxis 
              domain={[0, 100]}
              stroke="var(--color-text-secondary)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {/* Reference line for passing grade */}
            <ReferenceLine y={70} stroke="var(--color-error)" strokeDasharray="5 5" />
            
            {/* Subject lines */}
            {subjects.map((subject) => 
              selectedSubjects.includes(subject.id) && (
                <Line
                  key={subject.id}
                  type="monotone"
                  dataKey={subject.id}
                  stroke={subject.color}
                  strokeWidth={2}
                  dot={{ fill: subject.color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: subject.color, strokeWidth: 2 }}
                  name={subject.label}
                />
              )
            )}
            
            {/* Comparison lines */}
            {comparisonMode === 'peer-average' && (
              <Line
                type="monotone"
                dataKey="peerAverage"
                stroke="var(--color-text-secondary)"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
                name="Peer Average"
              />
            )}
            
            {comparisonMode === 'class-benchmark' && (
              <Line
                type="monotone"
                dataKey="classAverage"
                stroke="var(--color-text-secondary)"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
                name="Class Average"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Insights */}
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Lightbulb" size={18} color="var(--color-warning)" />
          <div>
            <h4 className="text-sm font-medium text-text-primary mb-1">Key Insights</h4>
            <ul className="text-sm text-text-secondary space-y-1">
              <li>• Mathematics shows consistent improvement trend (+6 points over 6 weeks)</li>
              <li>• English performance peaked in Week 5 with 92% score</li>
              <li>• Science grades stabilized above class average in recent weeks</li>
              <li>• Overall trajectory indicates positive academic progress</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeProgressionChart;