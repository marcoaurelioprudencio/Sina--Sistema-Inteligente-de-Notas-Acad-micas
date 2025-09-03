import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import TabNavigation from '../../components/ui/TabNavigation';
import AlertNotificationBanner from '../../components/ui/AlertNotificationBanner';
import SubjectSelector from './components/SubjectSelector';
import SubjectKPIHeader from './components/SubjectKPIHeader';
import GradeTrendsChart from './components/GradeTrendsChart';
import GradeDistributionSidebar from './components/GradeDistributionSidebar';
import StudentAssignmentHeatMap from './components/StudentAssignmentHeatMap';
import Icon from '../../components/AppIcon';

const SubjectPerformanceAnalyticsDashboard = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    subjects: ['mathematics'],
    classes: ['class-5a'],
    assessmentTypes: ['all'],
    period: 'current-term'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate data loading when filters change
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedFilters]);

  const handleFilterChange = (newFilters) => {
    setSelectedFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <TabNavigation />
      
      <main className="pt-32 md:pt-24 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="BookOpen" size={20} color="white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-text-primary">Subject Performance Analytics</h1>
                <p className="text-sm text-text-secondary">
                  Analyze curriculum effectiveness and identify learning gaps across subjects
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="text-sm text-text-secondary">
                Academic Year 2024-25 • Term 1
              </div>
              {isLoading && (
                <div className="flex items-center space-x-2 text-primary">
                  <Icon name="RefreshCw" size={16} className="animate-spin" />
                  <span className="text-sm">Updating...</span>
                </div>
              )}
            </div>
          </div>

          {/* Alert Notifications */}
          <AlertNotificationBanner />

          {/* Subject Selector */}
          <SubjectSelector onSelectionChange={handleFilterChange} />

          {/* KPI Header */}
          <SubjectKPIHeader selectedFilters={selectedFilters} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Primary Visualization - Grade Trends Chart (16 cols equivalent) */}
            <div className="lg:col-span-2">
              <GradeTrendsChart selectedFilters={selectedFilters} />
            </div>

            {/* Sidebar - Grade Distribution (8 cols equivalent) */}
            <div className="lg:col-span-1">
              <GradeDistributionSidebar selectedFilters={selectedFilters} />
            </div>
          </div>

          {/* Heat Map Visualization */}
          <StudentAssignmentHeatMap selectedFilters={selectedFilters} />

          {/* Quick Actions Footer */}
          <div className="mt-8 p-4 bg-background border border-border rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h3 className="text-sm font-medium text-text-primary">Quick Actions</h3>
                <div className="flex items-center space-x-2">
                  <button className="text-sm text-primary hover:text-primary/80 educational-transition flex items-center space-x-1">
                    <Icon name="FileDown" size={14} />
                    <span>Export Report</span>
                  </button>
                  <span className="text-text-secondary">•</span>
                  <button className="text-sm text-primary hover:text-primary/80 educational-transition flex items-center space-x-1">
                    <Icon name="Share2" size={14} />
                    <span>Share Analysis</span>
                  </button>
                  <span className="text-text-secondary">•</span>
                  <button className="text-sm text-primary hover:text-primary/80 educational-transition flex items-center space-x-1">
                    <Icon name="Calendar" size={14} />
                    <span>Schedule Review</span>
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-xs text-text-secondary">
                <Icon name="Clock" size={12} />
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubjectPerformanceAnalyticsDashboard;