import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import TabNavigation from '../../components/ui/TabNavigation';
import StudentContextSelector from '../../components/ui/StudentContextSelector';
import AlertNotificationBanner from '../../components/ui/AlertNotificationBanner';
import StudentSelector from './components/StudentSelector';
import MetricsStrip from './components/MetricsStrip';
import GradeProgressionChart from './components/GradeProgressionChart';
import InteractiveTimeline from './components/InteractiveTimeline';
import SubjectPerformancePanel from './components/SubjectPerformancePanel';
import ActivityFeed from './components/ActivityFeed';

const IndividualStudentAnalyticsDashboard = () => {
  const [selectedStudent, setSelectedStudent] = useState('student-001');
  const [comparisonMode, setComparisonMode] = useState('peer-average');
  const [contextFilters, setContextFilters] = useState({
    class: 'class-5a',
    student: 'all-students',
    timeRange: 'current-term'
  });
  const [isLoading, setIsLoading] = useState(true);

  // Mock student data
  const studentData = {
    id: selectedStudent,
    name: 'Emma Wilson',
    grade: '5A',
    currentGPA: 3.8,
    attendanceRate: 94,
    assignmentCompletion: 87,
    performanceTrajectory: 'Improving'
  };

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [selectedStudent]);

  const handleStudentChange = (studentId) => {
    setIsLoading(true);
    setSelectedStudent(studentId);
  };

  const handleComparisonModeChange = (mode) => {
    setComparisonMode(mode);
  };

  const handleContextChange = (filters) => {
    setContextFilters(filters);
  };

  const handleTimelineFilter = (filters) => {
    // Handle timeline filter changes
    console.log('Timeline filters changed:', filters);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <TabNavigation />
        
        <main className="pt-32 pb-20 md:pb-6">
          <div className="max-w-7xl mx-auto px-6">
            {/* Loading State */}
            <div className="flex items-center justify-center min-h-96">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-text-primary mb-2">Loading Student Analytics</h3>
                <p className="text-text-secondary">Fetching comprehensive performance data...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TabNavigation />
      
      <main className="pt-32 pb-20 md:pb-6">
        <div className="max-w-7xl mx-auto px-6">
          {/* Context Selector */}
          <StudentContextSelector onContextChange={handleContextChange} />
          
          {/* Alert Banner */}
          <AlertNotificationBanner />
          
          {/* Student Selector */}
          <StudentSelector
            selectedStudent={selectedStudent}
            onStudentChange={handleStudentChange}
            comparisonMode={comparisonMode}
            onComparisonModeChange={handleComparisonModeChange}
          />
          
          {/* Primary Metrics Strip */}
          <MetricsStrip
            studentData={studentData}
            comparisonMode={comparisonMode}
          />
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-16 gap-6 mb-6">
            {/* Grade Progression Chart - 10 columns */}
            <div className="lg:col-span-10">
              <GradeProgressionChart
                studentData={studentData}
                comparisonMode={comparisonMode}
              />
            </div>
            
            {/* Subject Performance Panel - 6 columns */}
            <div className="lg:col-span-6">
              <SubjectPerformancePanel
                studentData={studentData}
              />
            </div>
          </div>
          
          {/* Interactive Timeline */}
          <InteractiveTimeline
            onFilterChange={handleTimelineFilter}
          />
          
          {/* Activity Feed */}
          <ActivityFeed />
        </div>
      </main>
    </div>
  );
};

export default IndividualStudentAnalyticsDashboard;