import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import TabNavigation from '../../components/ui/TabNavigation';
import StudentContextSelector from '../../components/ui/StudentContextSelector';
import AlertNotificationBanner from '../../components/ui/AlertNotificationBanner';
import KPIMetricsCard from './components/KPIMetricsCard';
import GradeDistributionChart from './components/GradeDistributionChart';
import RecentAlertsPanel from './components/RecentAlertsPanel';
import StudentPerformanceTable from './components/StudentPerformanceTable';
import QuickActionPanel from './components/QuickActionPanel';
import AIChat from '../../components/ui/AIChat';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useLanguage } from '../../contexts/LanguageContext';

const StudentPerformanceOverviewDashboard = () => {
  const { t } = useLanguage();
  const [contextFilters, setContextFilters] = useState({
    class: 'class-5a',
    student: 'all-students',
    timeRange: 'current-term'
  });
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    if (!isAutoRefresh) return;

    const interval = setInterval(() => {
      setLastRefresh(new Date());
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isAutoRefresh]);

  const handleContextChange = (newContext) => {
    setContextFilters(newContext);
  };

  const handleManualRefresh = () => {
    setLastRefresh(new Date());
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  // Mock KPI data - would come from API based on context filters
  const kpiData = [
    {
      title: t('class-average-grade'),
      value: '87.2%',
      subtitle: t('across-all-subjects'),
      trend: 'up',
      trendValue: '+2.3%',
      icon: 'TrendingUp',
      color: 'success'
    },
    {
      title: t('attendance-rate'),
      value: '94.1%',
      subtitle: t('current-month'),
      trend: 'up',
      trendValue: '+1.2%',
      icon: 'Calendar',
      color: 'primary'
    },
    {
      title: t('students-at-risk'),
      value: '3',
      subtitle: t('need-attention'),
      trend: 'down',
      trendValue: '-2',
      icon: 'AlertTriangle',
      color: 'warning'
    },
    {
      title: t('grade-improvement'),
      value: '68%',
      subtitle: t('students-improving'),
      trend: 'up',
      trendValue: '+5%',
      icon: 'Award',
      color: 'success'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TabNavigation />
      
      <main className="pt-32 md:pt-24 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-text-primary mb-2">
                {t('student-performance-overview')}
              </h1>
              <p className="text-text-secondary">
                {t('monitor-academic-progress')}
              </p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <div className="flex items-center space-x-2 text-sm text-text-secondary">
                <Icon name="Clock" size={16} />
                <span>{t('last-updated')}: {lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                iconName="RefreshCw"
                onClick={handleManualRefresh}
              >
                {t('refresh')}
              </Button>
              
              <Button
                variant={isAutoRefresh ? 'default' : 'outline'}
                size="sm"
                iconName={isAutoRefresh ? 'Pause' : 'Play'}
                onClick={() => setIsAutoRefresh(!isAutoRefresh)}
              >
                {isAutoRefresh ? t('auto') : t('manual')}
              </Button>
            </div>
          </div>

          {/* Context Selector */}
          <StudentContextSelector onContextChange={handleContextChange} />

          {/* Alert Banner */}
          <AlertNotificationBanner />

          {/* KPI Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpiData.map((kpi, index) => (
              <KPIMetricsCard
                key={index}
                title={kpi.title}
                value={kpi.value}
                subtitle={kpi.subtitle}
                trend={kpi.trend}
                trendValue={kpi.trendValue}
                icon={kpi.icon}
                color={kpi.color}
              />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            {/* Grade Distribution Chart */}
            <div className="lg:col-span-8">
              <GradeDistributionChart />
            </div>

            {/* Recent Alerts Panel */}
            <div className="lg:col-span-4">
              <RecentAlertsPanel />
            </div>
          </div>

          {/* Secondary Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            {/* Student Performance Table */}
            <div className="lg:col-span-8">
              <StudentPerformanceTable />
            </div>

            {/* Quick Actions Panel */}
            <div className="lg:col-span-4">
              <QuickActionPanel />
            </div>
          </div>

          {/* Footer Stats */}
          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-semibold text-text-primary mb-1">28</div>
                <div className="text-sm text-text-secondary">{t('total-students')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-text-primary mb-1">5</div>
                <div className="text-sm text-text-secondary">{t('subjects-tracked')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-text-primary mb-1">156</div>
                <div className="text-sm text-text-secondary">{t('grades-entered')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-text-primary mb-1">98%</div>
                <div className="text-sm text-text-secondary">{t('data-accuracy')}</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* AI Chat Component */}
      <AIChat isOpen={isChatOpen} onToggle={toggleChat} />
    </div>
  );
};

export default StudentPerformanceOverviewDashboard;