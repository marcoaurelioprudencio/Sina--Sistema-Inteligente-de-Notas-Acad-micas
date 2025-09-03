import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';

const GradeDistributionChart = () => {
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('current-quarter');

  const subjectOptions = [
    { value: 'all', label: 'All Subjects' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'english', label: 'English Language Arts' },
    { value: 'science', label: 'Science' },
    { value: 'social-studies', label: 'Social Studies' },
    { value: 'art', label: 'Art & Music' }
  ];

  const periodOptions = [
    { value: 'current-quarter', label: 'Current Quarter' },
    { value: 'previous-quarter', label: 'Previous Quarter' },
    { value: 'semester', label: 'Full Semester' },
    { value: 'academic-year', label: 'Academic Year' }
  ];

  // Mock data for grade distribution
  const gradeDistributionData = [
    { grade: 'A (90-100)', count: 8, percentage: 28.6, color: '#059669' },
    { grade: 'B (80-89)', count: 12, percentage: 42.9, color: '#10B981' },
    { grade: 'C (70-79)', count: 6, percentage: 21.4, color: '#F59E0B' },
    { grade: 'D (60-69)', count: 2, percentage: 7.1, color: '#EF4444' },
    { grade: 'F (0-59)', count: 0, percentage: 0, color: '#DC2626' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 educational-shadow-modal">
          <p className="font-medium text-text-primary">{label}</p>
          <p className="text-sm text-text-secondary">
            Students: {data.count} ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 educational-shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="BarChart3" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-text-primary">Grade Distribution</h3>
        </div>
        
        <div className="flex items-center space-x-3">
          <Select
            options={subjectOptions}
            value={selectedSubject}
            onChange={setSelectedSubject}
            className="w-48"
          />
          <Select
            options={periodOptions}
            value={selectedPeriod}
            onChange={setSelectedPeriod}
            className="w-40"
          />
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={gradeDistributionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="grade" 
              tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }}
              axisLine={{ stroke: 'var(--color-border)' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }}
              axisLine={{ stroke: 'var(--color-border)' }}
              label={{ value: 'Number of Students', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {gradeDistributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
        {gradeDistributionData.map((item, index) => (
          <div key={index} className="text-center">
            <div 
              className="w-4 h-4 rounded mx-auto mb-1"
              style={{ backgroundColor: item.color }}
            />
            <p className="text-xs text-text-secondary">{item.grade.split(' ')[0]}</p>
            <p className="text-sm font-medium text-text-primary">{item.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GradeDistributionChart;