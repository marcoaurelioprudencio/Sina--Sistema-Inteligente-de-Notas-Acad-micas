import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const AttendanceHeaderControls = ({ onDateChange, onClassChange, onFilterChange, onExport }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('class-5a');
  const [selectedPeriod, setSelectedPeriod] = useState('all-periods');
  const [attendanceFilter, setAttendanceFilter] = useState('all');
  const [showCalendar, setShowCalendar] = useState(false);

  // Mock data options
  const classOptions = [
    { value: 'class-5a', label: 'Class 5A (28 students)' },
    { value: 'class-5b', label: 'Class 5B (26 students)' },
    { value: 'class-5c', label: 'Class 5C (24 students)' },
    { value: 'all-classes', label: 'All Classes (78 students)' }
  ];

  const periodOptions = [
    { value: 'all-periods', label: 'All Periods' },
    { value: 'period-1', label: 'Period 1 (8:00-8:45)' },
    { value: 'period-2', label: 'Period 2 (8:50-9:35)' },
    { value: 'period-3', label: 'Period 3 (9:40-10:25)' },
    { value: 'period-4', label: 'Period 4 (10:30-11:15)' },
    { value: 'period-5', label: 'Period 5 (11:20-12:05)' }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Students' },
    { value: 'present', label: 'Present Only' },
    { value: 'absent', label: 'Absent Only' },
    { value: 'tardy', label: 'Tardy Only' },
    { value: 'excused', label: 'Excused Only' },
    { value: 'at-risk', label: 'At-Risk Students' }
  ];

  const exportOptions = [
    { value: 'daily-report', label: 'Daily Report', icon: 'FileText' },
    { value: 'weekly-summary', label: 'Weekly Summary', icon: 'Calendar' },
    { value: 'parent-notifications', label: 'Parent Notifications', icon: 'Mail' },
    { value: 'intervention-list', label: 'Intervention List', icon: 'AlertTriangle' }
  ];

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    if (onDateChange) {
      onDateChange(newDate);
    }
  };

  const handleClassChange = (value) => {
    setSelectedClass(value);
    if (onClassChange) {
      onClassChange(value);
    }
  };

  const handlePeriodChange = (value) => {
    setSelectedPeriod(value);
    // Notify parent component
  };

  const handleFilterChange = (value) => {
    setAttendanceFilter(value);
    if (onFilterChange) {
      onFilterChange(value);
    }
  };

  const handleExport = (type) => {
    if (onExport) {
      onExport(type, {
        date: selectedDate,
        class: selectedClass,
        period: selectedPeriod,
        filter: attendanceFilter
      });
    }
  };

  const navigateDate = (direction) => {
    const currentDate = new Date(selectedDate);
    const newDate = new Date(currentDate);
    
    if (direction === 'prev') {
      newDate.setDate(currentDate.getDate() - 1);
    } else {
      newDate.setDate(currentDate.getDate() + 1);
    }
    
    const newDateString = newDate.toISOString().split('T')[0];
    setSelectedDate(newDateString);
    if (onDateChange) {
      onDateChange(newDateString);
    }
  };

  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isToday = (dateString) => {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  };

  return (
    <div className="bg-card border border-border rounded-lg educational-shadow-card mb-6">
      <div className="p-6">
        {/* Top Row - Date Navigation and Quick Actions */}
        <div className="flex items-center justify-between mb-6">
          {/* Date Navigation */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="ChevronLeft"
                onClick={() => navigateDate('prev')}
              />
              
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="flex items-center space-x-2 px-4"
                >
                  <Icon name="Calendar" size={18} />
                  <span className="font-medium">
                    {formatDisplayDate(selectedDate)}
                  </span>
                  {isToday(selectedDate) && (
                    <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                      Today
                    </span>
                  )}
                </Button>
                
                {showCalendar && (
                  <>
                    <div 
                      className="fixed inset-0 z-90"
                      onClick={() => setShowCalendar(false)}
                    />
                    <div className="absolute top-full left-0 mt-2 bg-popover border border-border rounded-lg educational-shadow-modal z-100 p-4">
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="w-full p-2 border border-border rounded-lg bg-background text-text-primary"
                      />
                    </div>
                  </>
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                iconName="ChevronRight"
                onClick={() => navigateDate('next')}
              />
            </div>

            {/* Quick Date Shortcuts */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const today = new Date().toISOString().split('T')[0];
                  setSelectedDate(today);
                  if (onDateChange) onDateChange(today);
                }}
                className={isToday(selectedDate) ? 'bg-primary/10 text-primary' : ''}
              >
                Today
              </Button>
            </div>
          </div>

          {/* Export Actions */}
          <div className="flex items-center space-x-2">
            <div className="relative group">
              <Button variant="outline" iconName="Download">
                Export
              </Button>
              
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg educational-shadow-modal opacity-0 invisible group-hover:opacity-100 group-hover:visible educational-transition z-100">
                <div className="py-2">
                  {exportOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleExport(option.value)}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-muted educational-transition"
                    >
                      <Icon name={option.icon} size={16} />
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <Button variant="default" iconName="RefreshCw">
              Refresh
            </Button>
          </div>
        </div>

        {/* Bottom Row - Filters and Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Class Selection */}
          <div>
            <Select
              label="Class"
              options={classOptions}
              value={selectedClass}
              onChange={handleClassChange}
              className="w-full"
            />
          </div>

          {/* Period Selection */}
          <div>
            <Select
              label="Period"
              options={periodOptions}
              value={selectedPeriod}
              onChange={handlePeriodChange}
              className="w-full"
            />
          </div>

          {/* Attendance Filter */}
          <div>
            <Select
              label="Filter"
              options={filterOptions}
              value={attendanceFilter}
              onChange={handleFilterChange}
              className="w-full"
            />
          </div>

          {/* Quick Stats */}
          <div className="flex items-end">
            <div className="bg-surface border border-border rounded-lg p-3 w-full">
              <div className="text-xs text-text-secondary mb-1">Quick Stats</div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-text-primary">
                  26/28 Present
                </div>
                <div className="text-sm font-medium text-success">
                  92.3%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="text-sm text-text-secondary">Present: 26</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-error rounded-full"></div>
              <span className="text-sm text-text-secondary">Absent: 2</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-warning rounded-full"></div>
              <span className="text-sm text-text-secondary">Tardy: 3</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-secondary rounded-full"></div>
              <span className="text-sm text-text-secondary">Excused: 1</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-text-secondary">
            <Icon name="Clock" size={14} />
            <span>Last updated: 2 min ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceHeaderControls;