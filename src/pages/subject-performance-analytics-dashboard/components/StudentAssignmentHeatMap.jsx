import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StudentAssignmentHeatMap = ({ selectedFilters }) => {
  const [selectedCell, setSelectedCell] = useState(null);
  const [viewMode, setViewMode] = useState('performance'); // 'performance' or 'difficulty'

  // Mock data for student-assignment performance matrix
  const students = [
    'Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson', 'Emma Brown',
    'Frank Miller', 'Grace Lee', 'Henry Taylor', 'Ian Clark', 'Julia White',
    'Kevin Martinez', 'Lisa Garcia', 'Mike Rodriguez', 'Nina Patel', 'Oscar Kim',
    'Paula Chen', 'Quinn Adams', 'Rita Singh', 'Sam Johnson', 'Tina Lopez',
    'Uma Sharma', 'Victor Wong', 'Wendy Liu', 'Xavier Green', 'Yuki Tanaka',
    'Zoe Anderson', 'Aaron Cooper', 'Betty Hall'
  ];

  const assignments = [
    { id: 'quiz1', name: 'Quiz 1', type: 'quiz', difficulty: 0.6, date: '2024-07-01' },
    { id: 'hw1', name: 'Homework 1', type: 'homework', difficulty: 0.4, date: '2024-07-03' },
    { id: 'test1', name: 'Test 1', type: 'test', difficulty: 0.8, date: '2024-07-08' },
    { id: 'project1', name: 'Project 1', type: 'project', difficulty: 0.7, date: '2024-07-10' },
    { id: 'quiz2', name: 'Quiz 2', type: 'quiz', difficulty: 0.65, date: '2024-07-15' },
    { id: 'hw2', name: 'Homework 2', type: 'homework', difficulty: 0.5, date: '2024-07-17' },
    { id: 'midterm', name: 'Midterm', type: 'test', difficulty: 0.85, date: '2024-07-22' },
    { id: 'quiz3', name: 'Quiz 3', type: 'quiz', difficulty: 0.55, date: '2024-07-24' }
  ];

  // Generate mock performance data
  const generatePerformanceMatrix = () => {
    const matrix = {};
    students.forEach((student, studentIndex) => {
      matrix[student] = {};
      assignments.forEach((assignment, assignmentIndex) => {
        // Generate realistic scores based on student ability and assignment difficulty
        const baseAbility = 0.6 + (studentIndex / students.length) * 0.4; // Student ability from 0.6 to 1.0
        const difficultyFactor = 1 - assignment.difficulty;
        const randomFactor = 0.8 + Math.random() * 0.4; // Random variation
        
        let score = (baseAbility * difficultyFactor * randomFactor) * 100;
        score = Math.max(45, Math.min(100, score)); // Clamp between 45-100
        
        matrix[student][assignment.id] = {
          score: Math.round(score),
          submitted: Math.random() > 0.05, // 95% submission rate
          late: Math.random() > 0.85 // 15% late submission rate
        };
      });
    });
    return matrix;
  };

  const performanceMatrix = generatePerformanceMatrix();

  const getScoreColor = (score, difficulty = 0) => {
    if (viewMode === 'difficulty') {
      // Color based on difficulty
      if (difficulty >= 0.8) return 'bg-error/20 text-error';
      if (difficulty >= 0.7) return 'bg-warning/20 text-warning';
      if (difficulty >= 0.6) return 'bg-accent/20 text-accent';
      return 'bg-success/20 text-success';
    } else {
      // Color based on performance
      if (score >= 90) return 'bg-success text-success-foreground';
      if (score >= 80) return 'bg-success/70 text-success-foreground';
      if (score >= 70) return 'bg-warning/70 text-warning-foreground';
      if (score >= 60) return 'bg-warning text-warning-foreground';
      return 'bg-error text-error-foreground';
    }
  };

  const handleCellClick = (student, assignment) => {
    const cellKey = `${student}-${assignment.id}`;
    setSelectedCell(selectedCell === cellKey ? null : cellKey);
  };

  const getAssignmentTypeIcon = (type) => {
    switch (type) {
      case 'quiz': return 'HelpCircle';
      case 'test': return 'FileText';
      case 'homework': return 'BookOpen';
      case 'project': return 'Briefcase';
      default: return 'File';
    }
  };

  return (
    <div className="bg-background border border-border rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="Grid3X3" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-text-primary">Student-Assignment Performance Matrix</h3>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode('performance')}
              className={`
                px-3 py-1.5 rounded-md text-sm educational-transition
                ${viewMode === 'performance'
                  ? 'bg-background text-text-primary shadow-sm' :'text-text-secondary hover:text-text-primary'
                }
              `}
            >
              Performance
            </button>
            <button
              onClick={() => setViewMode('difficulty')}
              className={`
                px-3 py-1.5 rounded-md text-sm educational-transition
                ${viewMode === 'difficulty'
                  ? 'bg-background text-text-primary shadow-sm' :'text-text-secondary hover:text-text-primary'
                }
              `}
            >
              Difficulty
            </button>
          </div>

          <Button variant="outline" size="sm" iconName="Download">
            Export Matrix
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center space-x-6 mb-4 p-3 bg-muted rounded-lg">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-text-primary">Legend:</span>
        </div>
        {viewMode === 'performance' ? (
          <>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-success rounded"></div>
              <span className="text-xs text-text-secondary">90-100%</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-success/70 rounded"></div>
              <span className="text-xs text-text-secondary">80-89%</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-warning/70 rounded"></div>
              <span className="text-xs text-text-secondary">70-79%</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-warning rounded"></div>
              <span className="text-xs text-text-secondary">60-69%</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-error rounded"></div>
              <span className="text-xs text-text-secondary">&lt;60%</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-error/20 rounded"></div>
              <span className="text-xs text-text-secondary">Very Hard</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-warning/20 rounded"></div>
              <span className="text-xs text-text-secondary">Hard</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-accent/20 rounded"></div>
              <span className="text-xs text-text-secondary">Medium</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-success/20 rounded"></div>
              <span className="text-xs text-text-secondary">Easy</span>
            </div>
          </>
        )}
      </div>

      {/* Heat Map Container */}
      <div className="overflow-auto max-h-96 border border-border rounded-lg">
        <table className="w-full">
          <thead className="bg-muted sticky top-0">
            <tr>
              <th className="p-2 text-left text-sm font-medium text-text-primary border-r border-border min-w-32">
                Student
              </th>
              {assignments.map((assignment) => (
                <th key={assignment.id} className="p-2 text-center text-xs font-medium text-text-primary border-r border-border min-w-16">
                  <div className="flex flex-col items-center space-y-1">
                    <Icon name={getAssignmentTypeIcon(assignment.type)} size={14} />
                    <span className="truncate">{assignment.name}</span>
                    <span className="text-xs text-text-secondary">
                      {new Date(assignment.date).toLocaleDateString()}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student, studentIndex) => (
              <tr key={student} className={studentIndex % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                <td className="p-2 text-sm font-medium text-text-primary border-r border-border sticky left-0 bg-inherit">
                  {student}
                </td>
                {assignments.map((assignment) => {
                  const performance = performanceMatrix[student][assignment.id];
                  const cellKey = `${student}-${assignment.id}`;
                  const isSelected = selectedCell === cellKey;
                  
                  return (
                    <td key={assignment.id} className="p-1 border-r border-border">
                      <div
                        className={`
                          w-12 h-12 rounded-md flex items-center justify-center cursor-pointer educational-transition
                          ${getScoreColor(performance.score, assignment.difficulty)}
                          ${isSelected ? 'ring-2 ring-primary' : ''}
                          ${!performance.submitted ? 'opacity-50' : ''}
                        `}
                        onClick={() => handleCellClick(student, assignment)}
                        title={`${student} - ${assignment.name}: ${performance.score}%${!performance.submitted ? ' (Not Submitted)' : performance.late ? ' (Late)' : ''}`}
                      >
                        <span className="text-xs font-medium">
                          {viewMode === 'performance' 
                            ? (performance.submitted ? performance.score : '-')
                            : (assignment.difficulty * 100).toFixed(0)
                          }
                        </span>
                        {performance.late && (
                          <Icon name="Clock" size={8} className="absolute top-0 right-0 text-warning" />
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Selected Cell Details */}
      {selectedCell && (
        <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <h4 className="text-sm font-medium text-text-primary mb-2">Selection Details</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-text-secondary">Student:</span>
              <div className="font-medium text-text-primary">{selectedCell.split('-')[0]}</div>
            </div>
            <div>
              <span className="text-text-secondary">Assignment:</span>
              <div className="font-medium text-text-primary">
                {assignments.find(a => selectedCell.includes(a.id))?.name}
              </div>
            </div>
            <div>
              <span className="text-text-secondary">Score:</span>
              <div className="font-medium text-text-primary">
                {performanceMatrix[selectedCell.split('-')[0]][selectedCell.split('-')[1]]?.score}%
              </div>
            </div>
            <div>
              <span className="text-text-secondary">Status:</span>
              <div className="font-medium text-text-primary">
                {performanceMatrix[selectedCell.split('-')[0]][selectedCell.split('-')[1]]?.submitted 
                  ? (performanceMatrix[selectedCell.split('-')[0]][selectedCell.split('-')[1]]?.late ? 'Late' : 'On Time')
                  : 'Not Submitted'
                }
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Statistics */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-4 text-sm text-text-secondary">
          <span className="flex items-center space-x-1">
            <Icon name="Users" size={14} />
            <span>Students: {students.length}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Icon name="FileText" size={14} />
            <span>Assignments: {assignments.length}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Icon name="Target" size={14} />
            <span>Avg Score: 82.4%</span>
          </span>
        </div>
        
        <div className="text-xs text-text-secondary">
          Click cells for details • Updated: 5 min ago
        </div>
      </div>
    </div>
  );
};

export default StudentAssignmentHeatMap;