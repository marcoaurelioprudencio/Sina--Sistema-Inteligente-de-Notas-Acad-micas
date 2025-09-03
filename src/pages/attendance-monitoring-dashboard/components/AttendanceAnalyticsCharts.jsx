import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';

const AttendanceAnalyticsCharts = ({ selectedClass, timeRange }) => {
  const [activeChart, setActiveChart] = useState('seasonal');

  // Mock seasonal trends data
  const seasonalData = [
    { month: 'Sep', attendance: 94, target: 95 },
    { month: 'Oct', attendance: 92, target: 95 },
    { month: 'Nov', attendance: 89, target: 95 },
    { month: 'Dec', attendance: 87, target: 95 },
    { month: 'Jan', attendance: 91, target: 95 },
    { month: 'Feb', attendance: 93, target: 95 },
    { month: 'Mar', attendance: 95, target: 95 },
    { month: 'Apr', attendance: 96, target: 95 },
    { month: 'May', attendance: 94, target: 95 },
    { month: 'Jun', attendance: 92, target: 95 },
    { month: 'Jul', attendance: 93, target: 95 }
  ];

  // Mock grade correlation data
  const gradeCorrelationData = [
    { attendanceRange: '95-100%', avgGrade: 92, studentCount: 12 },
    { attendanceRange: '90-94%', avgGrade: 87, studentCount: 8 },
    { attendanceRange: '85-89%', avgGrade: 82, studentCount: 5 },
    { attendanceRange: '80-84%', avgGrade: 78, studentCount: 2 },
    { attendanceRange: '<80%', avgGrade: 71, studentCount: 1 }
  ];

  // Mock attendance distribution data
  const distributionData = [
    { name: 'Excellent (95-100%)', value: 43, color: '#059669' },
    { name: 'Good (90-94%)', value: 29, color: '#3B82F6' },
    { name: 'Fair (85-89%)', value: 18, color: '#D97706' },
    { name: 'Poor (80-84%)', value: 7, color: '#DC2626' },
    { name: 'Critical (<80%)', value: 3, color: '#7C2D12' }
  ];

  const chartOptions = [
    { id: 'seasonal', label: 'Seasonal Trends', icon: 'TrendingUp' },
    { id: 'correlation', label: 'Grade Correlation', icon: 'BarChart3' },
    { id: 'distribution', label: 'Distribution', icon: 'PieChart' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 educational-shadow-modal">
          <p className="text-sm font-medium text-text-primary mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-text-secondary">{entry.name}:</span>
              <span className="font-medium text-text-primary">
                {entry.name === 'Student Count' ? entry.value : `${entry.value}%`}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-popover border border-border rounded-lg p-3 educational-shadow-modal">
          <p className="text-sm font-medium text-text-primary">{data.name}</p>
          <p className="text-sm text-text-secondary">
            {data.value}% of students
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Main Chart */}
      <div className="lg:col-span-2 bg-card border border-border rounded-lg educational-shadow-card">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon name="BarChart3" size={20} color="var(--color-primary)" />
              <h3 className="text-lg font-semibold text-text-primary">Attendance Analytics</h3>
            </div>
            
            <div className="flex items-center space-x-2">
              {chartOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setActiveChart(option.id)}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium educational-transition
                    ${activeChart === option.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-text-secondary hover:text-text-primary hover:bg-muted'
                    }
                  `}
                >
                  <Icon name={option.icon} size={16} />
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6">
          {activeChart === 'seasonal' && (
            <div>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-text-primary mb-2">
                  Monthly Attendance Trends vs Target
                </h4>
                <p className="text-xs text-text-secondary">
                  Track seasonal patterns and identify months requiring intervention
                </p>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={seasonalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis 
                      dataKey="month" 
                      stroke="var(--color-text-secondary)"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="var(--color-text-secondary)"
                      fontSize={12}
                      domain={[80, 100]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="attendance" 
                      stroke="var(--color-primary)" 
                      strokeWidth={3}
                      name="Actual Attendance"
                      dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 5 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="target" 
                      stroke="var(--color-success)" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Target"
                      dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeChart === 'correlation' && (
            <div>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-text-primary mb-2">
                  Attendance vs Academic Performance
                </h4>
                <p className="text-xs text-text-secondary">
                  Correlation between attendance rates and average grades
                </p>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={gradeCorrelationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis 
                      dataKey="attendanceRange" 
                      stroke="var(--color-text-secondary)"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="var(--color-text-secondary)"
                      fontSize={12}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="avgGrade" 
                      fill="var(--color-primary)"
                      name="Average Grade"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="studentCount" 
                      fill="var(--color-success)"
                      name="Student Count"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeChart === 'distribution' && (
            <div>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-text-primary mb-2">
                  Attendance Rate Distribution
                </h4>
                <p className="text-xs text-text-secondary">
                  Distribution of students across attendance rate ranges
                </p>
              </div>
              
              <div className="flex items-center">
                <div className="h-80 flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={distributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<PieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="w-64 space-y-3">
                  {distributionData.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-text-primary">
                          {item.name}
                        </div>
                        <div className="text-xs text-text-secondary">
                          {item.value}% of students
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-card border border-border rounded-lg educational-shadow-card">
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <Icon name="Lightbulb" size={20} color="var(--color-warning)" />
            <h3 className="text-lg font-semibold text-text-primary">Key Insights</h3>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="bg-success/5 border border-success/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="TrendingUp" size={16} className="text-success" />
              <span className="text-sm font-medium text-success">Positive Trend</span>
            </div>
            <p className="text-xs text-text-secondary">
              Spring semester shows 3% improvement in overall attendance rates
            </p>
          </div>
          
          <div className="bg-warning/5 border border-warning/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="AlertTriangle" size={16} className="text-warning" />
              <span className="text-sm font-medium text-warning">Seasonal Pattern</span>
            </div>
            <p className="text-xs text-text-secondary">
              Winter months consistently show 5-8% lower attendance rates
            </p>
          </div>
          
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Target" size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">Strong Correlation</span>
            </div>
            <p className="text-xs text-text-secondary">
              Students with 95%+ attendance average 15 points higher grades
            </p>
          </div>
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-card border border-border rounded-lg educational-shadow-card">
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <Icon name="CheckSquare" size={20} color="var(--color-primary)" />
            <h3 className="text-lg font-semibold text-text-primary">Recommended Actions</h3>
          </div>
        </div>
        
        <div className="p-6 space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-surface rounded-lg">
            <div className="w-2 h-2 bg-error rounded-full mt-2"></div>
            <div>
              <div className="text-sm font-medium text-text-primary">
                Winter Intervention Plan
              </div>
              <div className="text-xs text-text-secondary">
                Develop strategies for November-January attendance dips
              </div>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-surface rounded-lg">
            <div className="w-2 h-2 bg-warning rounded-full mt-2"></div>
            <div>
              <div className="text-sm font-medium text-text-primary">
                Parent Engagement
              </div>
              <div className="text-xs text-text-secondary">
                Share attendance-grade correlation with families
              </div>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-surface rounded-lg">
            <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
            <div>
              <div className="text-sm font-medium text-text-primary">
                Recognition Program
              </div>
              <div className="text-xs text-text-secondary">
                Celebrate students maintaining 95%+ attendance
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceAnalyticsCharts;