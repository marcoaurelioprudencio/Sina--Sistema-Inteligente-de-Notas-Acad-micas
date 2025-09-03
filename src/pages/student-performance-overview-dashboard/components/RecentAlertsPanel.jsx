import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentAlertsPanel = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'attendance',
      severity: 'high',
      title: 'Attendance Alert',
      message: 'Emma Wilson absent for 3 consecutive days',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      student: 'Emma Wilson',
      actionRequired: true
    },
    {
      id: 2,
      type: 'performance',
      severity: 'critical',
      title: 'Grade Drop Alert',
      message: 'James Chen - Math grade dropped from B+ to D',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      student: 'James Chen',
      actionRequired: true
    },
    {
      id: 3,
      type: 'achievement',
      severity: 'low',
      title: 'Achievement Milestone',
      message: 'Sofia Rodriguez achieved perfect attendance',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      student: 'Sofia Rodriguez',
      actionRequired: false
    },
    {
      id: 4,
      type: 'assignment',
      severity: 'medium',
      title: 'Missing Assignment',
      message: '5 students have not submitted Science project',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      actionRequired: true
    },
    {
      id: 5,
      type: 'performance',
      severity: 'medium',
      title: 'Improvement Noted',
      message: 'Alex Thompson - English grade improved by 12%',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      student: 'Alex Thompson',
      actionRequired: false
    }
  ]);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'attendance':
        return 'Calendar';
      case 'performance':
        return 'TrendingDown';
      case 'achievement':
        return 'Award';
      case 'assignment':
        return 'FileText';
      default:
        return 'Bell';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'text-error';
      case 'high':
        return 'text-warning';
      case 'medium':
        return 'text-primary';
      case 'low':
        return 'text-success';
      default:
        return 'text-text-secondary';
    }
  };

  const getSeverityBg = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-error/10 border-l-error';
      case 'high':
        return 'bg-warning/10 border-l-warning';
      case 'medium':
        return 'bg-primary/10 border-l-primary';
      case 'low':
        return 'bg-success/10 border-l-success';
      default:
        return 'bg-muted border-l-border';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const dismissAlert = (alertId) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const markAsRead = (alertId) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
  };

  return (
    <div className="bg-card border border-border rounded-lg educational-shadow-card">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="Bell" size={20} color="var(--color-primary)" />
            <h3 className="text-lg font-semibold text-text-primary">Recent Alerts</h3>
          </div>
          <Button variant="ghost" size="sm" iconName="Settings">
            Settings
          </Button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="p-6 text-center">
            <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-3" />
            <p className="text-text-secondary">No recent alerts</p>
            <p className="text-sm text-text-secondary">All students are performing well</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`border-l-4 p-4 border-b border-border last:border-b-0 ${getSeverityBg(alert.severity)} ${
                alert.read ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <Icon 
                    name={getAlertIcon(alert.type)} 
                    size={18} 
                    className={getSeverityColor(alert.severity)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium text-text-primary">
                        {alert.title}
                      </h4>
                      <span className="text-xs text-text-secondary">
                        {formatTimestamp(alert.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary mb-2">
                      {alert.message}
                    </p>
                    {alert.student && (
                      <div className="flex items-center space-x-2">
                        <Icon name="User" size={14} className="text-text-secondary" />
                        <span className="text-xs text-text-secondary">
                          {alert.student}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 ml-2">
                  {alert.actionRequired && (
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="ExternalLink"
                      onClick={() => markAsRead(alert.id)}
                    />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="X"
                    onClick={() => dismissAlert(alert.id)}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {alerts.length > 0 && (
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            iconName="Eye"
          >
            View All Alerts
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecentAlertsPanel;