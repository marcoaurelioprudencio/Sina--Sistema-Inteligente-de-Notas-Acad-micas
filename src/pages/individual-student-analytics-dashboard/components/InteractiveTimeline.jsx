import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InteractiveTimeline = ({ onFilterChange }) => {
  const [activeFilters, setActiveFilters] = useState(['assignments', 'attendance', 'grades']);
  const [selectedTimeRange, setSelectedTimeRange] = useState('month');

  // Mock timeline events
  const timelineEvents = [
    {
      id: 'event-001',
      type: 'assignment',
      title: 'Math Quiz #5',
      description: 'Algebra fundamentals assessment',
      score: 89,
      maxScore: 100,
      date: '2024-02-20',
      time: '10:30 AM',
      subject: 'Mathematics',
      status: 'completed'
    },
    {
      id: 'event-002',
      type: 'attendance',
      title: 'Present',
      description: 'Full day attendance',
      date: '2024-02-20',
      time: '8:00 AM',
      subject: 'General',
      status: 'present'
    },
    {
      id: 'event-003',
      type: 'grade',
      title: 'Science Project',
      description: 'Solar system model presentation',
      score: 94,
      maxScore: 100,
      date: '2024-02-19',
      time: '2:15 PM',
      subject: 'Science',
      status: 'graded'
    },
    {
      id: 'event-004',
      type: 'assignment',
      title: 'English Essay',
      description: 'Creative writing assignment',
      score: 87,
      maxScore: 100,
      date: '2024-02-18',
      time: '11:45 AM',
      subject: 'English',
      status: 'completed'
    },
    {
      id: 'event-005',
      type: 'attendance',
      title: 'Absent',
      description: 'Sick leave - parent notification sent',
      date: '2024-02-17',
      time: '8:00 AM',
      subject: 'General',
      status: 'absent'
    }
  ];

  const filterOptions = [
    { id: 'assignments', label: 'Assignments', icon: 'FileText', color: 'text-primary' },
    { id: 'grades', label: 'Grades', icon: 'Award', color: 'text-success' },
    { id: 'attendance', label: 'Attendance', icon: 'Calendar', color: 'text-warning' },
    { id: 'behavioral', label: 'Behavioral', icon: 'MessageCircle', color: 'text-secondary' }
  ];

  const timeRangeOptions = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'term', label: 'Current Term' },
    { id: 'year', label: 'Academic Year' }
  ];

  const toggleFilter = (filterId) => {
    setActiveFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const getEventIcon = (type, status) => {
    switch (type) {
      case 'assignment':
        return 'FileText';
      case 'grade':
        return 'Award';
      case 'attendance':
        return status === 'present' ? 'CheckCircle' : 'XCircle';
      default:
        return 'Circle';
    }
  };

  const getEventColor = (type, status, score) => {
    if (type === 'attendance') {
      return status === 'present' ? 'text-success' : 'text-error';
    }
    if (type === 'grade' || type === 'assignment') {
      if (score >= 90) return 'text-success';
      if (score >= 80) return 'text-primary';
      if (score >= 70) return 'text-warning';
      return 'text-error';
    }
    return 'text-text-secondary';
  };

  const filteredEvents = timelineEvents.filter(event => 
    activeFilters.includes(event.type) || 
    (event.type === 'behavioral' && activeFilters.includes('behavioral'))
  );

  return (
    <div className="bg-background border border-border rounded-lg p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="Clock" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-text-primary">Activity Timeline</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          {timeRangeOptions.map((option) => (
            <Button
              key={option.id}
              variant={selectedTimeRange === option.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedTimeRange(option.id)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-2 mb-6 p-4 bg-muted rounded-lg">
        <span className="text-sm text-text-secondary mr-2">Filter by:</span>
        {filterOptions.map((filter) => (
          <button
            key={filter.id}
            onClick={() => toggleFilter(filter.id)}
            className={`
              flex items-center space-x-2 px-3 py-2 rounded-lg text-sm educational-transition
              ${activeFilters.includes(filter.id)
                ? 'bg-primary text-primary-foreground'
                : 'bg-background text-text-secondary hover:text-text-primary hover:bg-background/80'
              }
            `}
          >
            <Icon name={filter.icon} size={16} />
            <span>{filter.label}</span>
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredEvents.map((event, index) => (
          <div key={event.id} className="flex items-start space-x-4">
            {/* Timeline Line */}
            <div className="flex flex-col items-center">
              <div className={`
                w-8 h-8 rounded-full border-2 border-border bg-background flex items-center justify-center
                ${getEventColor(event.type, event.status, event.score)}
              `}>
                <Icon 
                  name={getEventIcon(event.type, event.status)} 
                  size={16} 
                />
              </div>
              {index < filteredEvents.length - 1 && (
                <div className="w-0.5 h-12 bg-border mt-2" />
              )}
            </div>

            {/* Event Content */}
            <div className="flex-1 pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-medium text-text-primary">{event.title}</h4>
                  <span className="text-xs px-2 py-1 bg-muted rounded-full text-text-secondary">
                    {event.subject}
                  </span>
                </div>
                <div className="text-xs text-text-secondary">
                  {event.date} • {event.time}
                </div>
              </div>
              
              <p className="text-sm text-text-secondary mb-2">{event.description}</p>
              
              {event.score && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-text-secondary">Score:</span>
                  <span className={`text-sm font-medium ${getEventColor(event.type, event.status, event.score)}`}>
                    {event.score}/{event.maxScore} ({Math.round((event.score / event.maxScore) * 100)}%)
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Timeline Summary */}
      <div className="mt-6 p-4 bg-surface rounded-lg border border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-text-primary">12</div>
            <div className="text-xs text-text-secondary">Assignments</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-success">18</div>
            <div className="text-xs text-text-secondary">Present Days</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-error">2</div>
            <div className="text-xs text-text-secondary">Absent Days</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-primary">87%</div>
            <div className="text-xs text-text-secondary">Avg Score</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveTimeline;