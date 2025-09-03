import React, { useState, useEffect } from 'react';
import Select from './Select';
import Icon from '../AppIcon';
import { useLanguage } from '../../contexts/LanguageContext';

const StudentContextSelector = ({ onContextChange }) => {
  const { t } = useLanguage();
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('current-term');

  // Mock data - in real app, this would come from API
  const classOptions = [
    { value: 'class-5a', label: t('class-5a-28-students'), description: t('morning-session') },
    { value: 'class-5b', label: t('class-5b-26-students'), description: t('afternoon-session') },
    { value: 'class-5c', label: t('class-5c-24-students'), description: t('morning-session') },
    { value: 'all-classes', label: t('all-classes-78-students'), description: t('combined-view') }
  ];

  const studentOptions = [
    { value: 'all-students', label: t('all-students') },
    { value: 'at-risk', label: t('at-risk-students') },
    { value: 'high-performers', label: t('high-performers') },
    { value: 'needs-attention', label: t('needs-attention') }
  ];

  const timeRangeOptions = [
    { value: 'current-week', label: t('current-week') },
    { value: 'current-month', label: t('current-month') },
    { value: 'current-term', label: t('current-term') },
    { value: 'academic-year', label: t('academic-year') },
    { value: 'custom', label: t('custom-range') }
  ];

  useEffect(() => {
    // Initialize with default values
    setSelectedClass('class-5a');
    setSelectedStudent('all-students');
  }, []);

  useEffect(() => {
    // Notify parent component of context changes
    if (onContextChange) {
      onContextChange({
        class: selectedClass,
        student: selectedStudent,
        timeRange: selectedTimeRange
      });
    }
  }, [selectedClass, selectedStudent, selectedTimeRange, onContextChange]);

  const handleClassChange = (value) => {
    setSelectedClass(value);
    // Reset student selection when class changes
    setSelectedStudent('all-students');
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Filter" size={18} color="var(--color-primary)" />
        <h3 className="text-sm font-medium text-text-primary">{t('context-filters')}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Class Selection */}
        <div>
          <Select
            label={t('class')}
            options={classOptions}
            value={selectedClass}
            onChange={handleClassChange}
            placeholder={t('select-class')}
            searchable
            className="w-full"
          />
        </div>

        {/* Student Group Selection */}
        <div>
          <Select
            label={t('student-group')}
            options={studentOptions}
            value={selectedStudent}
            onChange={setSelectedStudent}
            placeholder={t('select-student-group')}
            className="w-full"
          />
        </div>

        {/* Time Range Selection */}
        <div>
          <Select
            label={t('time-range')}
            options={timeRangeOptions}
            value={selectedTimeRange}
            onChange={setSelectedTimeRange}
            placeholder={t('select-time-range')}
            className="w-full"
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-4 text-sm text-text-secondary">
          <span className="flex items-center space-x-1">
            <Icon name="Users" size={14} />
            <span>{t('active-students')}: 28</span>
          </span>
          <span className="flex items-center space-x-1">
            <Icon name="Calendar" size={14} />
            <span>{t('last-updated')}: 2 {t('min-ago')}</span>
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            className="text-xs text-primary hover:text-primary/80 educational-transition"
            onClick={() => {
              setSelectedClass('class-5a');
              setSelectedStudent('all-students');
              setSelectedTimeRange('current-term');
            }}
          >
            {t('reset-filters')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentContextSelector;