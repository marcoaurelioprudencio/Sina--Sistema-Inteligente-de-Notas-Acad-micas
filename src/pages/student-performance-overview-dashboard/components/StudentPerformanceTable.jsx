import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const StudentPerformanceTable = () => {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudents, setSelectedStudents] = useState(new Set());

  // Mock student data
  const studentsData = [
    {
      id: 1,
      name: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616c6d4e6c8?w=150',
      currentGrade: 92,
      previousGrade: 88,
      attendance: 95,
      trend: 'up',
      subjects: {
        math: 94,
        english: 90,
        science: 92,
        socialStudies: 91
      },
      lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
      notes: 'Excellent progress in all subjects'
    },
    {
      id: 2,
      name: 'James Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      currentGrade: 78,
      previousGrade: 85,
      attendance: 88,
      trend: 'down',
      subjects: {
        math: 65,
        english: 82,
        science: 80,
        socialStudies: 85
      },
      lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000),
      notes: 'Needs attention in mathematics'
    },
    {
      id: 3,
      name: 'Sofia Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      currentGrade: 96,
      previousGrade: 94,
      attendance: 100,
      trend: 'up',
      subjects: {
        math: 98,
        english: 95,
        science: 96,
        socialStudies: 95
      },
      lastActivity: new Date(Date.now() - 30 * 60 * 1000),
      notes: 'Outstanding performance across all areas'
    },
    {
      id: 4,
      name: 'Alex Thompson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      currentGrade: 84,
      previousGrade: 79,
      attendance: 92,
      trend: 'up',
      subjects: {
        math: 86,
        english: 88,
        science: 82,
        socialStudies: 80
      },
      lastActivity: new Date(Date.now() - 4 * 60 * 60 * 1000),
      notes: 'Steady improvement noted'
    },
    {
      id: 5,
      name: 'Maya Patel',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      currentGrade: 89,
      previousGrade: 87,
      attendance: 96,
      trend: 'up',
      subjects: {
        math: 91,
        english: 87,
        science: 90,
        socialStudies: 88
      },
      lastActivity: new Date(Date.now() - 6 * 60 * 60 * 1000),
      notes: 'Consistent high performer'
    }
  ];

  const sortedAndFilteredStudents = useMemo(() => {
    let filtered = studentsData.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'name') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [searchTerm, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleStudentSelect = (studentId) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    setSelectedStudents(newSelected);
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? 'TrendingUp' : trend === 'down' ? 'TrendingDown' : 'Minus';
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-success' : trend === 'down' ? 'text-error' : 'text-text-secondary';
  };

  const getGradeColor = (grade) => {
    if (grade >= 90) return 'text-success';
    if (grade >= 80) return 'text-primary';
    if (grade >= 70) return 'text-warning';
    return 'text-error';
  };

  const formatLastActivity = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg educational-shadow-card">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-3">
            <Icon name="Users" size={20} color="var(--color-primary)" />
            <h3 className="text-lg font-semibold text-text-primary">Student Performance</h3>
            <span className="text-sm text-text-secondary">
              ({sortedAndFilteredStudents.length} students)
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Input
              type="search"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Button variant="outline" size="sm" iconName="Download">
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4">
                <input
                  type="checkbox"
                  className="rounded border-border"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedStudents(new Set(studentsData.map(s => s.id)));
                    } else {
                      setSelectedStudents(new Set());
                    }
                  }}
                />
              </th>
              <th className="text-left p-4">
                <button
                  className="flex items-center space-x-1 text-sm font-medium text-text-primary hover:text-primary educational-transition"
                  onClick={() => handleSort('name')}
                >
                  <span>Student</span>
                  <Icon 
                    name={sortField === 'name' && sortDirection === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  className="flex items-center space-x-1 text-sm font-medium text-text-primary hover:text-primary educational-transition"
                  onClick={() => handleSort('currentGrade')}
                >
                  <span>Current Grade</span>
                  <Icon 
                    name={sortField === 'currentGrade' && sortDirection === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  className="flex items-center space-x-1 text-sm font-medium text-text-primary hover:text-primary educational-transition"
                  onClick={() => handleSort('attendance')}
                >
                  <span>Attendance</span>
                  <Icon 
                    name={sortField === 'attendance' && sortDirection === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="text-left p-4">
                <span className="text-sm font-medium text-text-primary">Trend</span>
              </th>
              <th className="text-left p-4">
                <span className="text-sm font-medium text-text-primary">Last Activity</span>
              </th>
              <th className="text-right p-4">
                <span className="text-sm font-medium text-text-primary">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredStudents.map((student, index) => (
              <tr 
                key={student.id} 
                className={`border-b border-border hover:bg-muted/50 educational-transition ${
                  index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                }`}
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    className="rounded border-border"
                    checked={selectedStudents.has(student.id)}
                    onChange={() => handleStudentSelect(student.id)}
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/assets/images/no_image.png';
                        }}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">{student.name}</p>
                      <p className="text-sm text-text-secondary">ID: {student.id.toString().padStart(4, '0')}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <span className={`text-lg font-semibold ${getGradeColor(student.currentGrade)}`}>
                      {student.currentGrade}%
                    </span>
                    {student.previousGrade && (
                      <span className="text-sm text-text-secondary">
                        (was {student.previousGrade}%)
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <span className={`font-medium ${student.attendance >= 95 ? 'text-success' : student.attendance >= 85 ? 'text-warning' : 'text-error'}`}>
                      {student.attendance}%
                    </span>
                    <div className="w-16 bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${student.attendance >= 95 ? 'bg-success' : student.attendance >= 85 ? 'bg-warning' : 'bg-error'}`}
                        style={{ width: `${student.attendance}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className={`flex items-center space-x-1 ${getTrendColor(student.trend)}`}>
                    <Icon name={getTrendIcon(student.trend)} size={16} />
                    <span className="text-sm font-medium">
                      {student.trend === 'up' ? '+' : student.trend === 'down' ? '-' : ''}
                      {Math.abs(student.currentGrade - student.previousGrade)}%
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-text-secondary">
                    {formatLastActivity(student.lastActivity)}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Edit"
                      title="Add Grade"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="MessageSquare"
                      title="Add Note"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="ExternalLink"
                      title="View Details"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedStudents.size > 0 && (
        <div className="p-4 border-t border-border bg-muted/50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">
              {selectedStudents.size} student{selectedStudents.size !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" iconName="Mail">
                Send Message
              </Button>
              <Button variant="outline" size="sm" iconName="FileText">
                Generate Report
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPerformanceTable;