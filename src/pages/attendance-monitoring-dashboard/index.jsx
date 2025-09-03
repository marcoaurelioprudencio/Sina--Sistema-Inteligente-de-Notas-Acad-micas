import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import TabNavigation from '../../components/ui/TabNavigation';
import StudentContextSelector from '../../components/ui/StudentContextSelector';
import AlertNotificationBanner from '../../components/ui/AlertNotificationBanner';
import AttendanceHeaderControls from './components/AttendanceHeaderControls';
import AttendanceKPICards from './components/AttendanceKPICards';
import AttendanceCalendarHeatMap from './components/AttendanceCalendarHeatMap';
import AttendancePatternTimeline from './components/AttendancePatternTimeline';
import AtRiskStudentsList from './components/AtRiskStudentsList';
import AttendanceAnalyticsCharts from './components/AttendanceAnalyticsCharts';

const AttendanceMonitoringDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('class-5a');
  const [attendanceFilter, setAttendanceFilter] = useState('all');
  const [contextFilters, setContextFilters] = useState({
    class: 'class-5a',
    student: 'all-students',
    timeRange: 'current-term'
  });
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Handle context changes from StudentContextSelector
  const handleContextChange = (newContext) => {
    setContextFilters(newContext);
    setSelectedClass(newContext.class);
  };

  // Handle date changes from header controls
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  // Handle class changes from header controls
  const handleClassChange = (newClass) => {
    setSelectedClass(newClass);
    setContextFilters(prev => ({ ...prev, class: newClass }));
  };

  // Handle filter changes from header controls
  const handleFilterChange = (newFilter) => {
    setAttendanceFilter(newFilter);
  };

  // Handle student selection from various components
  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
  };

  // Handle export functionality
  const handleExport = (type, filters) => {
    console.log('Exporting:', type, 'with filters:', filters);
    // In a real app, this would trigger the export process
  };

  // Set page title
  useEffect(() => {
    document.title = 'Attendance Monitoring Dashboard - SINA';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TabNavigation />
      
      <main className="pt-32 md:pt-24 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              Attendance Monitoring Dashboard
            </h1>
            <p className="text-text-secondary">
              Real-time attendance tracking with early intervention alerts and pattern analysis for proactive student support.
            </p>
          </div>

          {/* Context Selector */}
          <StudentContextSelector onContextChange={handleContextChange} />

          {/* Alert Banner */}
          <AlertNotificationBanner />

          {/* Header Controls */}
          <AttendanceHeaderControls
            onDateChange={handleDateChange}
            onClassChange={handleClassChange}
            onFilterChange={handleFilterChange}
            onExport={handleExport}
          />

          {/* KPI Cards */}
          <AttendanceKPICards
            selectedDate={selectedDate}
            selectedClass={selectedClass}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            {/* Main Visualization Area (9 cols equivalent) */}
            <div className="lg:col-span-3 space-y-6">
              {/* Attendance Calendar Heat Map */}
              <AttendanceCalendarHeatMap
                selectedDate={selectedDate}
                selectedClass={selectedClass}
                onStudentClick={handleStudentSelect}
              />

              {/* Attendance Pattern Timeline */}
              <AttendancePatternTimeline
                selectedClass={selectedClass}
                timeRange={contextFilters.timeRange}
              />
            </div>

            {/* Right Panel (3 cols equivalent) */}
            <div className="lg:col-span-1">
              <AtRiskStudentsList
                onStudentSelect={handleStudentSelect}
              />
            </div>
          </div>

          {/* Bottom Analytics Section */}
          <AttendanceAnalyticsCharts
            selectedClass={selectedClass}
            timeRange={contextFilters.timeRange}
          />
        </div>
      </main>
    </div>
  );
};

export default AttendanceMonitoringDashboard;