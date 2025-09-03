import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AtRiskStudentsList = ({ onStudentSelect }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [sortBy, setSortBy] = useState('risk-level');

  // Mock at-risk students data
  const atRiskStudents = [
    {
      id: 1,
      name: "James Chen",
      rollNumber: "5A-002",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      attendanceRate: 78,
      consecutiveAbsences: 3,
      totalAbsences: 12,
      riskLevel: 'high',
      lastAbsence: '2025-07-25',
      interventionStatus: 'pending',
      parentContact: 'attempted',
      notes: "Family vacation extended. Parent communication needed.",
      trends: {
        thisWeek: 60,
        lastWeek: 80,
        thisMonth: 78
      }
    },
    {
      id: 2,
      name: "Maria Santos",
      rollNumber: "5A-008",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      attendanceRate: 82,
      consecutiveAbsences: 2,
      totalAbsences: 9,
      riskLevel: 'medium',
      lastAbsence: '2025-07-24',
      interventionStatus: 'in-progress',
      parentContact: 'contacted',
      notes: "Health issues reported. Medical documentation pending.",
      trends: {
        thisWeek: 80,
        lastWeek: 85,
        thisMonth: 82
      }
    },
    {
      id: 3,
      name: "David Kim",
      rollNumber: "5A-015",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      attendanceRate: 75,
      consecutiveAbsences: 1,
      totalAbsences: 15,
      riskLevel: 'high',
      lastAbsence: '2025-07-23',
      interventionStatus: 'scheduled',
      parentContact: 'scheduled',
      notes: "Transportation issues. Meeting with family scheduled.",
      trends: {
        thisWeek: 75,
        lastWeek: 70,
        thisMonth: 75
      }
    },
    {
      id: 4,
      name: "Lisa Johnson",
      rollNumber: "5A-021",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      attendanceRate: 85,
      consecutiveAbsences: 0,
      totalAbsences: 8,
      riskLevel: 'low',
      lastAbsence: '2025-07-20',
      interventionStatus: 'monitoring',
      parentContact: 'informed',
      notes: "Improvement shown after parent meeting. Continue monitoring.",
      trends: {
        thisWeek: 100,
        lastWeek: 80,
        thisMonth: 85
      }
    }
  ];

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'high':
        return 'text-error bg-error/10 border-error/20';
      case 'medium':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'low':
        return 'text-success bg-success/10 border-success/20';
      default:
        return 'text-text-secondary bg-muted border-border';
    }
  };

  const getInterventionStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-error bg-error/10';
      case 'in-progress':
        return 'text-warning bg-warning/10';
      case 'scheduled':
        return 'text-primary bg-primary/10';
      case 'monitoring':
        return 'text-success bg-success/10';
      default:
        return 'text-text-secondary bg-muted';
    }
  };

  const sortedStudents = [...atRiskStudents].sort((a, b) => {
    switch (sortBy) {
      case 'risk-level':
        const riskOrder = { high: 3, medium: 2, low: 1 };
        return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
      case 'attendance-rate':
        return a.attendanceRate - b.attendanceRate;
      case 'consecutive-absences':
        return b.consecutiveAbsences - a.consecutiveAbsences;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const handleStudentClick = (student) => {
    setSelectedStudent(selectedStudent?.id === student.id ? null : student);
    if (onStudentSelect) {
      onStudentSelect(student);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg educational-shadow-card">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Icon name="AlertTriangle" size={20} color="var(--color-warning)" />
            <h3 className="text-lg font-semibold text-text-primary">At-Risk Students</h3>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-border rounded-lg px-3 py-1 bg-background text-text-primary"
            >
              <option value="risk-level">Risk Level</option>
              <option value="attendance-rate">Attendance Rate</option>
              <option value="consecutive-absences">Consecutive Absences</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-xl font-bold text-error">
              {atRiskStudents.filter(s => s.riskLevel === 'high').length}
            </div>
            <div className="text-xs text-text-secondary">High Risk</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-warning">
              {atRiskStudents.filter(s => s.riskLevel === 'medium').length}
            </div>
            <div className="text-xs text-text-secondary">Medium Risk</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-success">
              {atRiskStudents.filter(s => s.riskLevel === 'low').length}
            </div>
            <div className="text-xs text-text-secondary">Improving</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {sortedStudents.map((student) => (
            <div
              key={student.id}
              className={`
                border rounded-lg p-4 educational-transition cursor-pointer
                ${selectedStudent?.id === student.id 
                  ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/50'
                }
              `}
              onClick={() => handleStudentClick(student)}
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-accent flex-shrink-0">
                  <img 
                    src={student.avatar} 
                    alt={student.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/assets/images/no_image.png';
                    }}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-medium text-text-primary truncate">
                        {student.name}
                      </h4>
                      <p className="text-xs text-text-secondary">
                        {student.rollNumber}
                      </p>
                    </div>
                    <div className={`
                      px-2 py-1 rounded text-xs font-medium border
                      ${getRiskLevelColor(student.riskLevel)}
                    `}>
                      {student.riskLevel.toUpperCase()}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <div className="text-lg font-bold text-text-primary">
                        {student.attendanceRate}%
                      </div>
                      <div className="text-xs text-text-secondary">Attendance Rate</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-error">
                        {student.consecutiveAbsences}
                      </div>
                      <div className="text-xs text-text-secondary">Consecutive</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className={`
                      px-2 py-1 rounded text-xs font-medium
                      ${getInterventionStatusColor(student.interventionStatus)}
                    `}>
                      {student.interventionStatus.replace('-', ' ').toUpperCase()}
                    </div>
                    <div className="text-xs text-text-secondary">
                      Last: {formatDate(student.lastAbsence)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedStudent?.id === student.id && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h5 className="text-sm font-medium text-text-primary mb-2">
                        Attendance Trends
                      </h5>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-text-secondary">This Week:</span>
                          <span className="font-medium text-text-primary">
                            {student.trends.thisWeek}%
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-text-secondary">Last Week:</span>
                          <span className="font-medium text-text-primary">
                            {student.trends.lastWeek}%
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-text-secondary">This Month:</span>
                          <span className="font-medium text-text-primary">
                            {student.trends.thisMonth}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-text-primary mb-2">
                        Intervention Details
                      </h5>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-text-secondary">Total Absences:</span>
                          <span className="font-medium text-text-primary">
                            {student.totalAbsences}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-text-secondary">Parent Contact:</span>
                          <span className="font-medium text-text-primary capitalize">
                            {student.parentContact}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-text-primary mb-2">Notes</h5>
                    <p className="text-sm text-text-secondary bg-surface p-3 rounded-lg">
                      {student.notes}
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" iconName="Phone">
                      Contact Parent
                    </Button>
                    <Button variant="outline" size="sm" iconName="Calendar">
                      Schedule Meeting
                    </Button>
                    <Button variant="outline" size="sm" iconName="FileText">
                      View Records
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AtRiskStudentsList;