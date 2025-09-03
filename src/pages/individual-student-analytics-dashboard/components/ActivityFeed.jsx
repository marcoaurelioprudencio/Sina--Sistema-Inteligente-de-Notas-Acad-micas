import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActivityFeed = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isExpanded, setIsExpanded] = useState(false);

  // Mock activity feed data
  const activities = [
    {
      id: 'activity-001',
      type: 'grade',
      title: 'Math Quiz #5 Graded',
      description: 'Scored 89/100 on Algebra fundamentals quiz',
      timestamp: '2024-02-20T10:30:00Z',
      subject: 'Mathematics',
      score: 89,
      maxScore: 100,
      teacher: 'Ms. Johnson',
      priority: 'normal',
      category: 'academic'
    },
    {
      id: 'activity-002',
      type: 'attendance',
      title: 'Perfect Attendance Week',
      description: 'Completed full week with 100% attendance',
      timestamp: '2024-02-19T16:00:00Z',
      subject: 'General',
      teacher: 'System',
      priority: 'positive',
      category: 'attendance'
    },
    {
      id: 'activity-003',
      type: 'behavioral',
      title: 'Excellent Class Participation',
      description: 'Actively participated in science discussion about solar system',
      timestamp: '2024-02-19T14:15:00Z',
      subject: 'Science',
      teacher: 'Mr. Davis',
      priority: 'positive',
      category: 'behavioral'
    },
    {
      id: 'activity-004',
      type: 'assignment',
      title: 'English Essay Submitted',
      description: 'Creative writing assignment on "My Future Dreams" submitted on time',
      timestamp: '2024-02-18T11:45:00Z',
      subject: 'English',
      teacher: 'Mrs. Smith',
      priority: 'normal',
      category: 'academic'
    },
    {
      id: 'activity-005',
      type: 'attendance',
      title: 'Absence Recorded',
      description: 'Absent due to illness - parent notification sent',
      timestamp: '2024-02-17T08:00:00Z',
      subject: 'General',
      teacher: 'System',
      priority: 'attention',
      category: 'attendance'
    },
    {
      id: 'activity-006',
      type: 'grade',
      title: 'Science Project Graded',
      description: 'Solar system model presentation received excellent rating',
      timestamp: '2024-02-16T14:30:00Z',
      subject: 'Science',
      score: 94,
      maxScore: 100,
      teacher: 'Mr. Davis',
      priority: 'positive',
      category: 'academic'
    }
  ];

  const filterOptions = [
    { id: 'all', label: 'All Activities', icon: 'List' },
    { id: 'academic', label: 'Academic', icon: 'BookOpen' },
    { id: 'attendance', label: 'Attendance', icon: 'Calendar' },
    { id: 'behavioral', label: 'Behavioral', icon: 'MessageCircle' }
  ];

  const getActivityIcon = (type, priority) => {
    switch (type) {
      case 'grade':
        return priority === 'positive' ? 'Award' : 'FileText';
      case 'assignment':
        return 'Edit3';
      case 'attendance':
        return priority === 'attention' ? 'XCircle' : 'CheckCircle';
      case 'behavioral':
        return priority === 'positive' ? 'Star' : 'MessageCircle';
      default:
        return 'Circle';
    }
  };

  const getActivityColor = (type, priority) => {
    if (priority === 'positive') return 'text-success bg-success/10';
    if (priority === 'attention') return 'text-error bg-error/10';
    
    switch (type) {
      case 'grade':
        return 'text-primary bg-primary/10';
      case 'assignment':
        return 'text-warning bg-warning/10';
      case 'attendance':
        return 'text-secondary bg-secondary/10';
      case 'behavioral':
        return 'text-accent bg-accent/10';
      default:
        return 'text-text-secondary bg-muted';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const filteredActivities = selectedFilter === 'all' 
    ? activities 
    : activities.filter(activity => activity.category === selectedFilter);

  const displayedActivities = isExpanded ? filteredActivities : filteredActivities.slice(0, 5);

  return (
    <div className="bg-background border border-border rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="Activity" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-text-primary">Activity Feed</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" iconName="Filter">
            Filter
          </Button>
          <Button variant="outline" size="sm" iconName="Download">
            Export
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {filterOptions.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setSelectedFilter(filter.id)}
            className={`
              flex items-center space-x-2 px-3 py-2 rounded-lg text-sm educational-transition
              ${selectedFilter === filter.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-text-secondary hover:text-text-primary hover:bg-muted/80'
              }
            `}
          >
            <Icon name={filter.icon} size={16} />
            <span>{filter.label}</span>
          </button>
        ))}
      </div>

      {/* Activity List */}
      <div className="space-y-4">
        {displayedActivities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-muted/50 educational-transition">
            {/* Activity Icon */}
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
              ${getActivityColor(activity.type, activity.priority)}
            `}>
              <Icon 
                name={getActivityIcon(activity.type, activity.priority)} 
                size={18} 
              />
            </div>

            {/* Activity Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-medium text-text-primary truncate">
                  {activity.title}
                </h4>
                <div className="flex items-center space-x-2 text-xs text-text-secondary">
                  <span>{activity.subject}</span>
                  <span>•</span>
                  <span>{formatTimestamp(activity.timestamp)}</span>
                </div>
              </div>
              
              <p className="text-sm text-text-secondary mb-2">
                {activity.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-text-secondary">
                  <span className="flex items-center space-x-1">
                    <Icon name="User" size={12} />
                    <span>{activity.teacher}</span>
                  </span>
                  {activity.score && (
                    <span className="flex items-center space-x-1">
                      <Icon name="Target" size={12} />
                      <span>{activity.score}/{activity.maxScore}</span>
                    </span>
                  )}
                </div>
                
                {activity.priority === 'positive' && (
                  <div className="flex items-center space-x-1 text-xs text-success">
                    <Icon name="TrendingUp" size={12} />
                    <span>Positive</span>
                  </div>
                )}
                
                {activity.priority === 'attention' && (
                  <div className="flex items-center space-x-1 text-xs text-error">
                    <Icon name="AlertTriangle" size={12} />
                    <span>Needs Attention</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More / Show Less */}
      {filteredActivities.length > 5 && (
        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
            iconPosition="right"
          >
            {isExpanded 
              ? 'Show Less' 
              : `Show ${filteredActivities.length - 5} More Activities`
            }
          </Button>
        </div>
      )}

      {/* Activity Summary */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-text-primary">24</div>
            <div className="text-xs text-text-secondary">Total Activities</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-success">18</div>
            <div className="text-xs text-text-secondary">Positive Events</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-warning">4</div>
            <div className="text-xs text-text-secondary">Need Attention</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-primary">2</div>
            <div className="text-xs text-text-secondary">This Week</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;