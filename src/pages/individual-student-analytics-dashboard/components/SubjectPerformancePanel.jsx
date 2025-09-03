import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SubjectPerformancePanel = ({ studentData }) => {
  const [selectedView, setSelectedView] = useState('performance');
  const [expandedSubject, setExpandedSubject] = useState(null);

  // Mock subject performance data
  const subjectData = [
    {
      id: 'math',
      name: 'Mathematics',
      currentGrade: 88,
      previousGrade: 85,
      classAverage: 82,
      difficulty: 'Medium',
      trend: 'up',
      assignments: 12,
      completed: 11,
      teacherNotes: `Emma shows strong analytical skills in algebra. Recommend advanced problem sets for continued growth.`,
      recentScores: [85, 87, 89, 88, 91, 88],
      strengths: ['Problem solving', 'Algebraic thinking'],
      improvements: ['Geometry concepts', 'Word problems']
    },
    {
      id: 'english',
      name: 'English Language Arts',
      currentGrade: 92,
      previousGrade: 89,
      classAverage: 86,
      difficulty: 'Easy',
      trend: 'up',
      assignments: 15,
      completed: 14,
      teacherNotes: `Excellent writing skills and vocabulary. Creative expression in essays is outstanding.`,
      recentScores: [89, 91, 93, 92, 94, 92],
      strengths: ['Creative writing', 'Vocabulary', 'Reading comprehension'],
      improvements: ['Grammar mechanics']
    },
    {
      id: 'science',
      name: 'Science',
      currentGrade: 85,
      previousGrade: 88,
      classAverage: 83,
      difficulty: 'Hard',
      trend: 'down',
      assignments: 10,
      completed: 9,
      teacherNotes: `Good understanding of concepts but needs more practice with scientific method applications.`,
      recentScores: [88, 86, 84, 85, 87, 85],
      strengths: ['Observation skills', 'Hypothesis formation'],
      improvements: ['Lab procedures', 'Data analysis']
    },
    {
      id: 'history',
      name: 'Social Studies',
      currentGrade: 90,
      previousGrade: 87,
      classAverage: 84,
      difficulty: 'Medium',
      trend: 'up',
      assignments: 8,
      completed: 8,
      teacherNotes: `Strong critical thinking and excellent participation in discussions. Shows genuine interest in historical events.`,
      recentScores: [87, 89, 91, 90, 92, 90],
      strengths: ['Critical thinking', 'Research skills', 'Discussion participation'],
      improvements: ['Timeline memorization']
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-success bg-success/10';
      case 'Medium': return 'text-warning bg-warning/10';
      case 'Hard': return 'text-error bg-error/10';
      default: return 'text-text-secondary bg-muted';
    }
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? 'TrendingUp' : trend === 'down' ? 'TrendingDown' : 'Minus';
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-success' : trend === 'down' ? 'text-error' : 'text-text-secondary';
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 educational-shadow-modal">
          <p className="text-sm font-medium text-text-primary mb-1">{label}</p>
          <p className="text-sm text-text-secondary">
            Grade: <span className="font-medium text-text-primary">{payload[0].value}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-background border border-border rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="BookOpen" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-text-primary">Subject Performance</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={selectedView === 'performance' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedView('performance')}
          >
            Performance
          </Button>
          <Button
            variant={selectedView === 'notes' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedView('notes')}
          >
            Notes
          </Button>
        </div>
      </div>

      {selectedView === 'performance' && (
        <>
          {/* Performance Chart */}
          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--color-text-secondary)"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  domain={[0, 100]}
                  stroke="var(--color-text-secondary)"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="currentGrade" 
                  fill="var(--color-primary)" 
                  radius={[4, 4, 0, 0]}
                  name="Current Grade"
                />
                <Bar 
                  dataKey="classAverage" 
                  fill="var(--color-text-secondary)" 
                  radius={[4, 4, 0, 0]}
                  opacity={0.5}
                  name="Class Average"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Subject Details */}
          <div className="space-y-4">
            {subjectData.map((subject) => (
              <div key={subject.id} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-medium text-text-primary">{subject.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(subject.difficulty)}`}>
                      {subject.difficulty}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center space-x-1 ${getTrendColor(subject.trend)}`}>
                      <Icon name={getTrendIcon(subject.trend)} size={16} />
                      <span className="text-sm font-medium">{subject.currentGrade}%</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName={expandedSubject === subject.id ? 'ChevronUp' : 'ChevronDown'}
                      onClick={() => setExpandedSubject(
                        expandedSubject === subject.id ? null : subject.id
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-text-secondary">Current:</span>
                    <span className="ml-2 font-medium text-text-primary">{subject.currentGrade}%</span>
                  </div>
                  <div>
                    <span className="text-text-secondary">Previous:</span>
                    <span className="ml-2 font-medium text-text-primary">{subject.previousGrade}%</span>
                  </div>
                  <div>
                    <span className="text-text-secondary">Class Avg:</span>
                    <span className="ml-2 font-medium text-text-primary">{subject.classAverage}%</span>
                  </div>
                </div>

                {expandedSubject === subject.id && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium text-text-primary mb-2">Strengths</h5>
                        <ul className="text-sm text-text-secondary space-y-1">
                          {subject.strengths.map((strength, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <Icon name="CheckCircle" size={14} className="text-success" />
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-text-primary mb-2">Areas for Improvement</h5>
                        <ul className="text-sm text-text-secondary space-y-1">
                          {subject.improvements.map((improvement, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <Icon name="Target" size={14} className="text-warning" />
                              <span>{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {selectedView === 'notes' && (
        <div className="space-y-4">
          {subjectData.map((subject) => (
            <div key={subject.id} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-text-primary">{subject.name}</h4>
                <div className="flex items-center space-x-2 text-sm text-text-secondary">
                  <Icon name="User" size={14} />
                  <span>Teacher Notes</span>
                </div>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                {subject.teacherNotes}
              </p>
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">
                    Assignments: {subject.completed}/{subject.assignments} completed
                  </span>
                  <span className="text-text-secondary">
                    Last updated: 2 days ago
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubjectPerformancePanel;