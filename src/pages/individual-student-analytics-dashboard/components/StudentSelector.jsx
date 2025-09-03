import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const StudentSelector = ({ selectedStudent, onStudentChange, comparisonMode, onComparisonModeChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Mock student data
  const students = [
    {
      id: 'student-001',
      name: 'Emma Wilson',
      grade: '5A',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616c27b2e2d?w=150&h=150&fit=crop&crop=face',
      currentGPA: 3.8,
      attendanceRate: 94
    },
    {
      id: 'student-002',
      name: 'James Chen',
      grade: '5A',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      currentGPA: 3.2,
      attendanceRate: 87
    },
    {
      id: 'student-003',
      name: 'Sofia Rodriguez',
      grade: '5B',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      currentGPA: 3.9,
      attendanceRate: 96
    },
    {
      id: 'student-004',
      name: 'Marcus Johnson',
      grade: '5A',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      currentGPA: 3.5,
      attendanceRate: 91
    }
  ];

  const comparisonOptions = [
    { value: 'peer-average', label: 'Peer Average' },
    { value: 'class-benchmark', label: 'Class Benchmark' },
    { value: 'grade-level', label: 'Grade Level' },
    { value: 'none', label: 'No Comparison' }
  ];

  const studentOptions = students.map(student => ({
    value: student.id,
    label: student.name,
    description: `Grade ${student.grade} • GPA: ${student.currentGPA}`
  }));

  const currentStudent = students.find(s => s.id === selectedStudent) || students[0];

  return (
    <div className="bg-background border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text-primary">Student Analytics</h2>
        <Button
          variant="ghost"
          size="sm"
          iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </Button>
      </div>

      {/* Student Profile Header */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary">
            <Image
              src={currentStudent.photo}
              alt={currentStudent.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-background flex items-center justify-center">
            <Icon name="User" size={12} color="white" />
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-semibold text-text-primary">{currentStudent.name}</h3>
          <p className="text-text-secondary">Grade {currentStudent.grade} • Student ID: {currentStudent.id.toUpperCase()}</p>
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-sm text-text-secondary">
              GPA: <span className="font-medium text-text-primary">{currentStudent.currentGPA}</span>
            </span>
            <span className="text-sm text-text-secondary">
              Attendance: <span className="font-medium text-text-primary">{currentStudent.attendanceRate}%</span>
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isExpanded ? 'block' : 'hidden md:grid'}`}>
        <div>
          <Select
            label="Select Student"
            options={studentOptions}
            value={selectedStudent}
            onChange={onStudentChange}
            searchable
            className="w-full"
          />
        </div>

        <div>
          <Select
            label="Comparison Mode"
            options={comparisonOptions}
            value={comparisonMode}
            onChange={onComparisonModeChange}
            className="w-full"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" iconName="Download">
            Export Report
          </Button>
          <Button variant="outline" size="sm" iconName="Share">
            Share with Parent
          </Button>
        </div>

        <div className="flex items-center space-x-2 text-sm text-text-secondary">
          <Icon name="Clock" size={14} />
          <span>Last updated: 5 min ago</span>
        </div>
      </div>
    </div>
  );
};

export default StudentSelector;