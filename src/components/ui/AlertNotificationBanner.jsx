import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const AlertNotificationBanner = () => {
  const [alerts, setAlerts] = useState([]);
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());
  const [isExpanded, setIsExpanded] = useState(false);

  // Mock alert data - in real app, this would come from API
  const mockAlerts = [
    {
      id: 'attendance-001',
      type: 'warning',
      priority: 'high',
      title: 'Attendance Alert',
      message: '3 students have been absent for 3+ consecutive days',
      timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      actionRequired: true,
      students: ['Emma Wilson', 'James Chen', 'Sofia Rodriguez']
    },
    {
      id: 'performance-001',
      type: 'error',
      priority: 'critical',
      title: 'Performance Alert',
      message: 'Math assessment scores dropped 15% below class average',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      actionRequired: true,
      subject: 'Mathematics'
    },
    {
      id: 'system-001',
      type: 'success',
      priority: 'low',
      title: 'Data Sync Complete',
      message: 'Student records successfully updated from school system',
      timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      actionRequired: false
    }
  ];

  useEffect(() => {
    // Filter out dismissed alerts and sort by priority
    const activeAlerts = mockAlerts
      .filter(alert => !dismissedAlerts.has(alert.id))
      .sort((a, b) => {
        const priorityOrder = { critical: 3, high: 2, medium: 1, low: 0 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    
    setAlerts(activeAlerts);
  }, [dismissedAlerts]);

  const dismissAlert = (alertId) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
  };

  const dismissAllAlerts = () => {
    const allAlertIds = alerts.map(alert => alert.id);
    setDismissedAlerts(prev => new Set([...prev, ...allAlertIds]));
    setIsExpanded(false);
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'error':
        return 'AlertCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'success':
        return 'CheckCircle';
      default:
        return 'Info';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'error':
        return 'text-error';
      case 'warning':
        return 'text-warning';
      case 'success':
        return 'text-success';
      default:
        return 'text-primary';
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

  if (alerts.length === 0) return null;

  const highPriorityAlerts = alerts.filter(alert => 
    alert.priority === 'critical' || alert.priority === 'high'
  );

  const primaryAlert = highPriorityAlerts[0] || alerts[0];

  return (
    <div className="sticky top-32 z-90 mb-6">
      {/* Primary Alert Banner */}
      <div className={`
        bg-background border-l-4 border-r border-t border-b rounded-r-lg educational-shadow-card
        ${primaryAlert.type === 'error' ? 'border-l-error bg-error/5' : ''}
        ${primaryAlert.type === 'warning' ? 'border-l-warning bg-warning/5' : ''}
        ${primaryAlert.type === 'success' ? 'border-l-success bg-success/5' : ''}
      `}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3 flex-1">
            <Icon 
              name={getAlertIcon(primaryAlert.type)} 
              size={20} 
              className={getAlertColor(primaryAlert.type)}
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-medium text-text-primary">
                  {primaryAlert.title}
                </h4>
                <span className="text-xs text-text-secondary">
                  {formatTimestamp(primaryAlert.timestamp)}
                </span>
              </div>
              <p className="text-sm text-text-secondary mt-1">
                {primaryAlert.message}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {alerts.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
                iconPosition="right"
              >
                {alerts.length - 1} more
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={() => dismissAlert(primaryAlert.id)}
            />
          </div>
        </div>
      </div>

      {/* Expanded Alerts */}
      {isExpanded && alerts.length > 1 && (
        <div className="mt-2 bg-background border border-border rounded-lg educational-shadow-card">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-text-primary">
                All Notifications ({alerts.length})
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={dismissAllAlerts}
              >
                Dismiss All
              </Button>
            </div>
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {alerts.slice(1).map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-4 border-b border-border last:border-b-0">
                <div className="flex items-center space-x-3 flex-1">
                  <Icon 
                    name={getAlertIcon(alert.type)} 
                    size={16} 
                    className={getAlertColor(alert.type)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-text-primary">
                        {alert.title}
                      </span>
                      <span className="text-xs text-text-secondary">
                        {formatTimestamp(alert.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary">
                      {alert.message}
                    </p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="X"
                  onClick={() => dismissAlert(alert.id)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertNotificationBanner;