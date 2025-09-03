import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const QuickActionPanel = () => {
  const [activeAction, setActiveAction] = useState(null);
  const [formData, setFormData] = useState({
    student: '',
    subject: '',
    grade: '',
    note: ''
  });

  const studentOptions = [
    { value: 'emma-wilson', label: 'Emma Wilson' },
    { value: 'james-chen', label: 'James Chen' },
    { value: 'sofia-rodriguez', label: 'Sofia Rodriguez' },
    { value: 'alex-thompson', label: 'Alex Thompson' },
    { value: 'maya-patel', label: 'Maya Patel' }
  ];

  const subjectOptions = [
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'english', label: 'English Language Arts' },
    { value: 'science', label: 'Science' },
    { value: 'social-studies', label: 'Social Studies' },
    { value: 'art', label: 'Art & Music' }
  ];

  const quickActions = [
    {
      id: 'add-grade',
      title: 'Add Grade',
      description: 'Quick grade entry',
      icon: 'Plus',
      color: 'primary'
    },
    {
      id: 'mark-attendance',
      title: 'Mark Attendance',
      description: 'Update attendance',
      icon: 'Calendar',
      color: 'success'
    },
    {
      id: 'send-alert',
      title: 'Send Alert',
      description: 'Parent notification',
      icon: 'Bell',
      color: 'warning'
    },
    {
      id: 'add-note',
      title: 'Add Note',
      description: 'Student observation',
      icon: 'FileText',
      color: 'secondary'
    }
  ];

  const handleActionClick = (actionId) => {
    setActiveAction(activeAction === actionId ? null : actionId);
    setFormData({ student: '', subject: '', grade: '', note: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission based on activeAction
    console.log('Submitting:', activeAction, formData);
    setActiveAction(null);
    setFormData({ student: '', subject: '', grade: '', note: '' });
  };

  const getActionColor = (color) => {
    switch (color) {
      case 'success':
        return 'bg-success/10 border-success/20 text-success';
      case 'warning':
        return 'bg-warning/10 border-warning/20 text-warning';
      case 'secondary':
        return 'bg-secondary/10 border-secondary/20 text-secondary';
      default:
        return 'bg-primary/10 border-primary/20 text-primary';
    }
  };

  const renderActionForm = () => {
    switch (activeAction) {
      case 'add-grade':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              label="Student"
              options={studentOptions}
              value={formData.student}
              onChange={(value) => setFormData({ ...formData, student: value })}
              required
            />
            <Select
              label="Subject"
              options={subjectOptions}
              value={formData.subject}
              onChange={(value) => setFormData({ ...formData, subject: value })}
              required
            />
            <Input
              label="Grade"
              type="number"
              min="0"
              max="100"
              placeholder="Enter grade (0-100)"
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              required
            />
            <div className="flex space-x-2">
              <Button type="submit" size="sm">Save Grade</Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setActiveAction(null)}>
                Cancel
              </Button>
            </div>
          </form>
        );

      case 'add-note':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              label="Student"
              options={studentOptions}
              value={formData.student}
              onChange={(value) => setFormData({ ...formData, student: value })}
              required
            />
            <Input
              label="Note"
              type="text"
              placeholder="Enter observation or note"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              required
            />
            <div className="flex space-x-2">
              <Button type="submit" size="sm">Save Note</Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setActiveAction(null)}>
                Cancel
              </Button>
            </div>
          </form>
        );

      default:
        return (
          <div className="text-center py-4">
            <p className="text-sm text-text-secondary">
              {activeAction === 'mark-attendance' && 'Attendance marking interface would appear here'}
              {activeAction === 'send-alert' && 'Parent notification interface would appear here'}
            </p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setActiveAction(null)}
              className="mt-2"
            >
              Close
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 educational-shadow-card">
      <div className="flex items-center space-x-3 mb-6">
        <Icon name="Zap" size={20} color="var(--color-primary)" />
        <h3 className="text-lg font-semibold text-text-primary">Quick Actions</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleActionClick(action.id)}
            className={`
              p-4 rounded-lg border-2 educational-transition text-left
              ${activeAction === action.id 
                ? getActionColor(action.color) 
                : 'border-border hover:border-primary/30 hover:bg-muted/50'
              }
            `}
          >
            <div className="flex items-center space-x-3">
              <Icon 
                name={action.icon} 
                size={18} 
                className={activeAction === action.id ? '' : 'text-text-secondary'}
              />
              <div>
                <p className={`text-sm font-medium ${
                  activeAction === action.id ? '' : 'text-text-primary'
                }`}>
                  {action.title}
                </p>
                <p className={`text-xs ${
                  activeAction === action.id ? 'opacity-80' : 'text-text-secondary'
                }`}>
                  {action.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {activeAction && (
        <div className="border-t border-border pt-6">
          <h4 className="text-sm font-medium text-text-primary mb-4">
            {quickActions.find(a => a.id === activeAction)?.title}
          </h4>
          {renderActionForm()}
        </div>
      )}

      <div className="border-t border-border pt-4 mt-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Last updated</span>
          <span className="text-text-primary font-medium">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-text-secondary">Auto-refresh</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-success text-xs">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionPanel;