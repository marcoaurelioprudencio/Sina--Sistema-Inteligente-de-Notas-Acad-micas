import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const GradeDistributionSidebar = ({ selectedFilters }) => {
  const [selectedBin, setSelectedBin] = useState(null);

  // Mock grade distribution data
  const distributionData = [
    { range: '90-100', count: 8, percentage: 28.6, students: ['Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson', 'Emma Brown', 'Frank Miller', 'Grace Lee', 'Henry Taylor'] },
    { range: '80-89', count: 12, percentage: 42.9, students: ['Ian Clark', 'Julia White', 'Kevin Martinez', 'Lisa Garcia', 'Mike Rodriguez', 'Nina Patel', 'Oscar Kim', 'Paula Chen', 'Quinn Adams', 'Rita Singh', 'Sam Johnson', 'Tina Lopez'] },
    { range: '70-79', count: 6, percentage: 21.4, students: ['Uma Sharma', 'Victor Wong', 'Wendy Liu', 'Xavier Green', 'Yuki Tanaka', 'Zoe Anderson'] },
    { range: '60-69', count: 2, percentage: 7.1, students: ['Aaron Cooper', 'Betty Hall'] },
    { range: '50-59', count: 0, percentage: 0, students: [] },
    { range: '0-49', count: 0, percentage: 0, students: [] }
  ];

  // Statistical calculations
  const totalStudents = distributionData.reduce((sum, bin) => sum + bin.count, 0);
  const weightedSum = distributionData.reduce((sum, bin) => {
    const midpoint = (parseInt(bin.range.split('-')[0]) + parseInt(bin.range.split('-')[1])) / 2;
    return sum + (midpoint * bin.count);
  }, 0);
  
  const mean = (weightedSum / totalStudents).toFixed(1);
  const median = 84.5; // Mock median calculation
  const standardDeviation = 8.7; // Mock standard deviation

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 educational-shadow-modal">
          <h4 className="font-medium text-text-primary mb-2">Grade Range: {label}</h4>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Students:</span>
              <span className="text-sm font-medium text-text-primary">{data.count}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Percentage:</span>
              <span className="text-sm font-medium text-text-primary">{data.percentage}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const handleBarClick = (data) => {
    setSelectedBin(selectedBin === data.range ? null : data.range);
  };

  return (
    <div className="bg-background border border-border rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="BarChart3" size={18} color="var(--color-primary)" />
        <h3 className="text-lg font-semibold text-text-primary">Grade Distribution</h3>
      </div>

      {/* Statistical Summary */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-3 bg-muted rounded-lg">
          <div className="text-lg font-semibold text-text-primary">{mean}</div>
          <div className="text-xs text-text-secondary">Mean</div>
        </div>
        <div className="text-center p-3 bg-muted rounded-lg">
          <div className="text-lg font-semibold text-text-primary">{median}</div>
          <div className="text-xs text-text-secondary">Median</div>
        </div>
        <div className="text-center p-3 bg-muted rounded-lg">
          <div className="text-lg font-semibold text-text-primary">±{standardDeviation}</div>
          <div className="text-xs text-text-secondary">Std Dev</div>
        </div>
      </div>

      {/* Distribution Chart */}
      <div className="w-full h-64 mb-4" aria-label="Grade Distribution Histogram">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={distributionData} 
            margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
            onClick={handleBarClick}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="range" 
              stroke="var(--color-text-secondary)"
              fontSize={10}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              stroke="var(--color-text-secondary)"
              fontSize={10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="count" 
              fill="var(--color-primary)"
              radius={[2, 2, 0, 0]}
              cursor="pointer"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Breakdown */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-text-primary mb-2">Distribution Breakdown</h4>
        {distributionData.map((bin) => (
          <div 
            key={bin.range}
            className={`
              p-2 rounded-lg border educational-transition cursor-pointer
              ${selectedBin === bin.range 
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
              }
            `}
            onClick={() => handleBarClick(bin)}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text-primary">{bin.range}%</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-text-secondary">{bin.count} students</span>
                <span className="text-xs text-text-secondary">({bin.percentage}%)</span>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-1 w-full bg-muted rounded-full h-1.5">
              <div 
                className="bg-primary h-1.5 rounded-full educational-transition"
                style={{ width: `${bin.percentage}%` }}
              />
            </div>

            {/* Student list when selected */}
            {selectedBin === bin.range && bin.students.length > 0 && (
              <div className="mt-2 pt-2 border-t border-border">
                <div className="text-xs text-text-secondary mb-1">Students in this range:</div>
                <div className="grid grid-cols-1 gap-1 max-h-24 overflow-y-auto">
                  {bin.students.map((student, index) => (
                    <div key={index} className="text-xs text-text-primary">
                      • {student}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Performance Indicators */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <span className="flex items-center space-x-1">
            <Icon name="TrendingUp" size={12} />
            <span>Above Average: {distributionData.slice(0, 2).reduce((sum, bin) => sum + bin.count, 0)} students</span>
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-text-secondary mt-1">
          <span className="flex items-center space-x-1">
            <Icon name="AlertTriangle" size={12} />
            <span>Needs Support: {distributionData.slice(3).reduce((sum, bin) => sum + bin.count, 0)} students</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default GradeDistributionSidebar;