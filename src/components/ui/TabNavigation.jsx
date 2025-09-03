import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const TabNavigation = () => {
  const location = useLocation();

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      path: '/student-performance-overview-dashboard',
      icon: 'BarChart3',
      analyticalFocus: 'Class-wide performance monitoring',
      mobileLabel: 'Overview'
    },
    {
      id: 'subjects',
      label: 'Subjects',
      path: '/subject-performance-analytics-dashboard',
      icon: 'BookOpen',
      analyticalFocus: 'Subject-specific performance analysis',
      mobileLabel: 'Subjects'
    },
    {
      id: 'attendance',
      label: 'Attendance',
      path: '/attendance-monitoring-dashboard',
      icon: 'Calendar',
      analyticalFocus: 'Attendance patterns and tracking',
      mobileLabel: 'Attendance'
    },
    {
      id: 'students',
      label: 'Students',
      path: '/individual-student-analytics-dashboard',
      icon: 'Users',
      analyticalFocus: 'Individual student deep-dive analytics',
      mobileLabel: 'Students'
    }
  ];

  const isActiveTab = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Desktop Tab Navigation */}
      <div className="hidden md:block bg-background border-b border-border sticky top-16 z-90">
        <div className="px-6">
          <nav className="flex space-x-8" role="tablist">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                to={tab.path}
                role="tab"
                aria-selected={isActiveTab(tab.path)}
                title={tab.analyticalFocus}
                className={`
                  flex items-center space-x-2 py-4 border-b-2 educational-transition
                  ${isActiveTab(tab.path)
                    ? 'border-primary text-primary font-medium' :'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
                  }
                `}
              >
                <Icon name={tab.icon} size={18} />
                <span className="font-medium">{tab.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Bottom Tab Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-100">
        <nav className="flex" role="tablist">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              to={tab.path}
              role="tab"
              aria-selected={isActiveTab(tab.path)}
              className={`
                flex flex-col items-center justify-center py-2 px-1 flex-1 min-h-[60px] educational-transition
                ${isActiveTab(tab.path)
                  ? 'text-primary bg-primary/5' :'text-text-secondary hover:text-text-primary'
                }
              `}
            >
              <Icon name={tab.icon} size={20} />
              <span className="text-xs font-medium mt-1 truncate">
                {tab.mobileLabel}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default TabNavigation;