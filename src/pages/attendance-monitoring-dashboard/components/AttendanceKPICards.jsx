import React from 'react';
import Icon from '../../../components/AppIcon';

const AttendanceKPICards = ({ selectedDate, selectedClass }) => {
  // Mock KPI data
  const kpiData = [
    {
      id: 'daily-rate',
      title: 'Daily Attendance Rate',
      value: '92.3%',
      change: '+2.1%',
      trend: 'up',
      icon: 'Users',
      color: 'success',
      description: '26 of 28 students present',
      sparklineData: [88, 90, 89, 91, 92.3]
    },
    {
      id: 'chronic-absenteeism',
      title: 'Chronic Absenteeism',
      value: '3',
      change: '-1',
      trend: 'down',
      icon: 'AlertTriangle',
      color: 'warning',
      description: 'Students with 10+ absences',
      sparklineData: [5, 4, 4, 3, 3]
    },
    {
      id: 'tardiness-trend',
      title: 'Tardiness Rate',
      value: '8.5%',
      change: '+1.2%',
      trend: 'up',
      icon: 'Clock',
      color: 'error',
      description: '2.4 avg tardies per day',
      sparklineData: [6.2, 7.1, 7.8, 8.1, 8.5]
    },
    {
      id: 'perfect-attendance',
      title: 'Perfect Attendance',
      value: '12',
      change: '+2',
      trend: 'up',
      icon: 'Award',
      color: 'primary',
      description: 'Students with 100% rate',
      sparklineData: [8, 9, 10, 11, 12]
    }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'success':
        return {
          bg: 'bg-success/10',
          text: 'text-success',
          icon: 'text-success'
        };
      case 'warning':
        return {
          bg: 'bg-warning/10',
          text: 'text-warning',
          icon: 'text-warning'
        };
      case 'error':
        return {
          bg: 'bg-error/10',
          text: 'text-error',
          icon: 'text-error'
        };
      case 'primary':
        return {
          bg: 'bg-primary/10',
          text: 'text-primary',
          icon: 'text-primary'
        };
      default:
        return {
          bg: 'bg-muted',
          text: 'text-text-primary',
          icon: 'text-text-secondary'
        };
    }
  };

  const renderSparkline = (data, color) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    return (
      <div className="flex items-end space-x-1 h-8">
        {data.map((value, index) => {
          const height = ((value - min) / range) * 100;
          return (
            <div
              key={index}
              className={`w-1 rounded-t ${getColorClasses(color).bg} opacity-60`}
              style={{ height: `${Math.max(height, 10)}%` }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {kpiData.map((kpi) => {
        const colorClasses = getColorClasses(kpi.color);
        
        return (
          <div
            key={kpi.id}
            className="bg-card border border-border rounded-lg p-6 educational-shadow-card educational-transition hover:educational-shadow-modal"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg ${colorClasses.bg} flex items-center justify-center`}>
                <Icon name={kpi.icon} size={20} className={colorClasses.icon} />
              </div>
              <div className="flex items-center space-x-1">
                <Icon 
                  name={kpi.trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                  size={16} 
                  className={kpi.trend === 'up' ? 'text-success' : 'text-error'}
                />
                <span className={`text-sm font-medium ${kpi.trend === 'up' ? 'text-success' : 'text-error'}`}>
                  {kpi.change}
                </span>
              </div>
            </div>

            {/* Value */}
            <div className="mb-2">
              <div className="text-2xl font-bold text-text-primary mb-1">
                {kpi.value}
              </div>
              <div className="text-sm text-text-secondary">
                {kpi.title}
              </div>
            </div>

            {/* Description */}
            <div className="text-xs text-text-secondary mb-4">
              {kpi.description}
            </div>

            {/* Sparkline */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                {renderSparkline(kpi.sparklineData, kpi.color)}
              </div>
              <div className="text-xs text-text-secondary ml-2">
                7 days
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AttendanceKPICards;