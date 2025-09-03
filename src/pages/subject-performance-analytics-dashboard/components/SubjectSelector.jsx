import React, { useState } from 'react';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const SubjectSelector = ({ onSelectionChange }) => {
  const [selectedSubjects, setSelectedSubjects] = useState(['mathematics']);
  const [selectedClasses, setSelectedClasses] = useState(['class-5a']);
  const [selectedAssessmentTypes, setSelectedAssessmentTypes] = useState(['all']);
  const [selectedPeriod, setSelectedPeriod] = useState('current-term');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const subjectOptions = [
    { value: 'mathematics', label: 'Mathematics', description: '28 students enrolled' },
    { value: 'english', label: 'English Language Arts', description: '28 students enrolled' },
    { value: 'science', label: 'Science', description: '28 students enrolled' },
    { value: 'social-studies', label: 'Social Studies', description: '28 students enrolled' },
    { value: 'art', label: 'Art & Creative', description: '28 students enrolled' },
    { value: 'physical-education', label: 'Physical Education', description: '28 students enrolled' }
  ];

  const classOptions = [
    { value: 'class-5a', label: 'Class 5A', description: '28 students' },
    { value: 'class-5b', label: 'Class 5B', description: '26 students' },
    { value: 'class-5c', label: 'Class 5C', description: '24 students' },
    { value: 'all-classes', label: 'All Classes', description: '78 students total' }
  ];

  const assessmentTypeOptions = [
    { value: 'all', label: 'All Assessments' },
    { value: 'quiz', label: 'Quizzes' },
    { value: 'test', label: 'Tests' },
    { value: 'homework', label: 'Homework' },
    { value: 'project', label: 'Projects' },
    { value: 'participation', label: 'Class Participation' }
  ];

  const periodOptions = [
    { value: 'current-week', label: 'Current Week' },
    { value: 'current-month', label: 'Current Month' },
    { value: 'current-term', label: 'Current Term' },
    { value: 'academic-year', label: 'Academic Year 2024-25' },
    { value: 'previous-term', label: 'Previous Term' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handleSubjectChange = (value) => {
    setSelectedSubjects(value);
    notifyChange({ subjects: value, classes: selectedClasses, assessmentTypes: selectedAssessmentTypes, period: selectedPeriod });
  };

  const handleClassChange = (value) => {
    setSelectedClasses(value);
    notifyChange({ subjects: selectedSubjects, classes: value, assessmentTypes: selectedAssessmentTypes, period: selectedPeriod });
  };

  const handleAssessmentTypeChange = (value) => {
    setSelectedAssessmentTypes(value);
    notifyChange({ subjects: selectedSubjects, classes: selectedClasses, assessmentTypes: value, period: selectedPeriod });
  };

  const handlePeriodChange = (value) => {
    setSelectedPeriod(value);
    notifyChange({ subjects: selectedSubjects, classes: selectedClasses, assessmentTypes: selectedAssessmentTypes, period: value });
  };

  const notifyChange = (filters) => {
    if (onSelectionChange) {
      onSelectionChange(filters);
    }
  };

  const resetFilters = () => {
    setSelectedSubjects(['mathematics']);
    setSelectedClasses(['class-5a']);
    setSelectedAssessmentTypes(['all']);
    setSelectedPeriod('current-term');
    notifyChange({ subjects: ['mathematics'], classes: ['class-5a'], assessmentTypes: ['all'], period: 'current-term' });
  };

  return (
    <div className="bg-background border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="BookOpen" size={20} color="var(--color-primary)" />
          <h2 className="text-lg font-semibold text-text-primary">Subject Performance Filters</h2>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="text-sm text-primary hover:text-primary/80 educational-transition flex items-center space-x-1"
          >
            <Icon name={showAdvancedFilters ? 'ChevronUp' : 'ChevronDown'} size={16} />
            <span>Advanced Filters</span>
          </button>
          <button
            onClick={resetFilters}
            className="text-sm text-text-secondary hover:text-text-primary educational-transition"
          >
            Reset All
          </button>
        </div>
      </div>

      {/* Primary Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Select
          label="Subject"
          options={subjectOptions}
          value={selectedSubjects}
          onChange={handleSubjectChange}
          multiple
          searchable
          placeholder="Select subjects..."
          className="w-full"
        />

        <Select
          label="Class Section"
          options={classOptions}
          value={selectedClasses}
          onChange={handleClassChange}
          multiple
          placeholder="Select classes..."
          className="w-full"
        />

        <Select
          label="Assessment Type"
          options={assessmentTypeOptions}
          value={selectedAssessmentTypes}
          onChange={handleAssessmentTypeChange}
          multiple
          placeholder="Select assessment types..."
          className="w-full"
        />

        <Select
          label="Time Period"
          options={periodOptions}
          value={selectedPeriod}
          onChange={handlePeriodChange}
          placeholder="Select period..."
          className="w-full"
        />
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="border-t border-border pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Learning Objectives</label>
              <div className="space-y-2">
                <Checkbox label="Problem Solving" checked onChange={() => {}} />
                <Checkbox label="Critical Thinking" onChange={() => {}} />
                <Checkbox label="Communication" checked onChange={() => {}} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Standards Alignment</label>
              <div className="space-y-2">
                <Checkbox label="Common Core" checked onChange={() => {}} />
                <Checkbox label="State Standards" onChange={() => {}} />
                <Checkbox label="District Curriculum" checked onChange={() => {}} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Performance Levels</label>
              <div className="space-y-2">
                <Checkbox label="Above Grade Level" onChange={() => {}} />
                <Checkbox label="At Grade Level" checked onChange={() => {}} />
                <Checkbox label="Below Grade Level" onChange={() => {}} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Summary */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-4 text-sm text-text-secondary">
          <span className="flex items-center space-x-1">
            <Icon name="BookOpen" size={14} />
            <span>Subjects: {selectedSubjects.length}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Icon name="Users" size={14} />
            <span>Classes: {selectedClasses.length}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Icon name="FileText" size={14} />
            <span>Assessment Types: {selectedAssessmentTypes.length}</span>
          </span>
        </div>
        
        <div className="text-xs text-text-secondary">
          Last updated: 5 min ago
        </div>
      </div>
    </div>
  );
};

export default SubjectSelector;