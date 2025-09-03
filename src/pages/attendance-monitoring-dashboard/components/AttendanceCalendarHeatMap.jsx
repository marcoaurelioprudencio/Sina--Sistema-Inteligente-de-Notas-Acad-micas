import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const AttendanceCalendarHeatMap = ({ selectedDate, selectedClass, onStudentClick }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Mock attendance data
  const attendanceData = [
    {
      id: 1,
      name: "Emma Wilson",
      rollNumber: "5A-001",
      attendanceRecord: {
        "2025-07-21": "present",
        "2025-07-22": "absent",
        "2025-07-23": "present",
        "2025-07-24": "tardy",
        "2025-07-25": "present"
      },
      attendanceRate: 85,
      consecutiveAbsences: 0
    },
    {
      id: 2,
      name: "James Chen",
      rollNumber: "5A-002",
      attendanceRecord: {
        "2025-07-21": "present",
        "2025-07-22": "present",
        "2025-07-23": "absent",
        "2025-07-24": "absent",
        "2025-07-25": "excused"
      },
      attendanceRate: 78,
      consecutiveAbsences: 2
    },
    {
      id: 3,
      name: "Sofia Rodriguez",
      rollNumber: "5A-003",
      attendanceRecord: {
        "2025-07-21": "present",
        "2025-07-22": "present",
        "2025-07-23": "present",
        "2025-07-24": "present",
        "2025-07-25": "present"
      },
      attendanceRate: 98,
      consecutiveAbsences: 0
    },
    {
      id: 4,
      name: "Michael Johnson",
      rollNumber: "5A-004",
      attendanceRecord: {
        "2025-07-21": "tardy",
        "2025-07-22": "present",
        "2025-07-23": "present",
        "2025-07-24": "absent",
        "2025-07-25": "present"
      },
      attendanceRate: 82,
      consecutiveAbsences: 0
    },
    {
      id: 5,
      name: "Aisha Patel",
      rollNumber: "5A-005",
      attendanceRecord: {
        "2025-07-21": "present",
        "2025-07-22": "present",
        "2025-07-23": "tardy",
        "2025-07-24": "present",
        "2025-07-25": "present"
      },
      attendanceRate: 92,
      consecutiveAbsences: 0
    }
  ];

  const dates = ["2025-07-21", "2025-07-22", "2025-07-23", "2025-07-24", "2025-07-25"];
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-success text-success-foreground';
      case 'absent':
        return 'bg-error text-error-foreground';
      case 'tardy':
        return 'bg-warning text-warning-foreground';
      case 'excused':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return 'Check';
      case 'absent':
        return 'X';
      case 'tardy':
        return 'Clock';
      case 'excused':
        return 'FileText';
      default:
        return 'Minus';
    }
  };

  const handleStudentRowClick = (student) => {
    setSelectedStudent(selectedStudent?.id === student.id ? null : student);
    if (onStudentClick) {
      onStudentClick(student);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg educational-shadow-card">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="Calendar" size={20} color="var(--color-primary)" />
            <h3 className="text-lg font-semibold text-text-primary">Attendance Heat Map</h3>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-text-secondary">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-success rounded"></div>
                <span>Present</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-error rounded"></div>
                <span>Absent</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-warning rounded"></div>
                <span>Tardy</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-secondary rounded"></div>
                <span>Excused</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Header Row */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              <div className="text-sm font-medium text-text-secondary p-2">Student</div>
              {dates.map((date, index) => (
                <div key={date} className="text-center">
                  <div className="text-xs text-text-secondary">{dayNames[index]}</div>
                  <div className="text-sm font-medium text-text-primary">
                    {new Date(date).getDate()}
                  </div>
                </div>
              ))}
              <div className="text-sm font-medium text-text-secondary p-2 text-center">Rate</div>
            </div>

            {/* Student Rows */}
            <div className="space-y-2">
              {attendanceData.map((student) => (
                <div
                  key={student.id}
                  className={`
                    grid grid-cols-7 gap-2 p-2 rounded-lg border educational-transition cursor-pointer
                    ${selectedStudent?.id === student.id 
                      ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/50'
                    }
                  `}
                  onClick={() => handleStudentRowClick(student)}
                >
                  {/* Student Info */}
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-accent-foreground">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-text-primary truncate">
                        {student.name}
                      </div>
                      <div className="text-xs text-text-secondary">
                        {student.rollNumber}
                      </div>
                    </div>
                  </div>

                  {/* Attendance Status Cells */}
                  {dates.map((date) => {
                    const status = student.attendanceRecord[date] || 'unknown';
                    return (
                      <div key={date} className="flex justify-center">
                        <div
                          className={`
                            w-8 h-8 rounded-lg flex items-center justify-center educational-transition
                            ${getStatusColor(status)}
                          `}
                          title={`${date}: ${status}`}
                        >
                          <Icon name={getStatusIcon(status)} size={14} />
                        </div>
                      </div>
                    );
                  })}

                  {/* Attendance Rate */}
                  <div className="flex items-center justify-center">
                    <div className={`
                      px-2 py-1 rounded text-xs font-medium
                      ${student.attendanceRate >= 95 ? 'bg-success/10 text-success' : ''}
                      ${student.attendanceRate >= 85 && student.attendanceRate < 95 ? 'bg-warning/10 text-warning' : ''}
                      ${student.attendanceRate < 85 ? 'bg-error/10 text-error' : ''}
                    `}>
                      {student.attendanceRate}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Student Details */}
        {selectedStudent && (
          <div className="mt-6 p-4 bg-surface border border-border rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-text-primary">
                {selectedStudent.name} - Detailed View
              </h4>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-text-secondary hover:text-text-primary educational-transition"
              >
                <Icon name="X" size={16} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-text-primary">
                  {selectedStudent.attendanceRate}%
                </div>
                <div className="text-sm text-text-secondary">Overall Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-error">
                  {selectedStudent.consecutiveAbsences}
                </div>
                <div className="text-sm text-text-secondary">Consecutive Absences</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">
                  {Object.values(selectedStudent.attendanceRecord).filter(s => s === 'present').length}
                </div>
                <div className="text-sm text-text-secondary">Days Present</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceCalendarHeatMap;