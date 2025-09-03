import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import DynamicClock from './DynamicClock';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { currentLanguage, switchLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();

  // Don't render header on login page
  if (location.pathname === '/login') {
    return null;
  }

  // Don't render header if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const primaryNavItems = [
    {
      id: 'overview',
      label: t('overview'),
      path: '/student-performance-overview-dashboard',
      icon: 'BarChart3',
      description: t('class-wide-performance-metrics')
    },
    {
      id: 'subjects',
      label: t('subjects'),
      path: '/subject-performance-analytics-dashboard',
      icon: 'BookOpen',
      description: t('subject-specific-analytics')
    },
    {
      id: 'attendance',
      label: t('attendance'),
      path: '/attendance-monitoring-dashboard',
      icon: 'Calendar',
      description: t('attendance-tracking-patterns')
    },
    {
      id: 'students',
      label: t('students'),
      path: '/individual-student-analytics-dashboard',
      icon: 'Users',
      description: t('individual-student-analytics')
    }
  ];

  const secondaryNavItems = [
    { 
      id: 'student-management', 
      label: t('student-management'), 
      icon: 'UserPlus', 
      path: '/student-management' 
    },
    { 
      id: 'grade-management', 
      label: t('grade-management'), 
      icon: 'BookOpen', 
      path: '/grade-management' 
    },
    { id: 'settings', label: t('settings'), icon: 'Settings', path: '/settings' },
    { id: 'help', label: t('help'), icon: 'HelpCircle', path: '/help' },
    { id: 'reports', label: t('reports'), icon: 'FileText', path: '/reports' }
  ];

  const isActiveTab = (path) => {
    return location.pathname === path;
  };

  const handleMoreMenuToggle = () => {
    setIsMoreMenuOpen(!isMoreMenuOpen);
  };

  const handleMoreMenuClose = () => {
    setIsMoreMenuOpen(false);
  };

  const handleUserMenuToggle = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleUserMenuClose = () => {
    setIsUserMenuOpen(false);
  };

  const handleLanguageToggle = () => {
    switchLanguage(currentLanguage === 'pt' ? 'en' : 'pt');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleUserMenuClose();
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-background border-b border-border z-100">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="GraduationCap" size={20} color="white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-text-primary">SINA</span>
                <span className="text-xs text-text-secondary -mt-1">{t('dashboard')}</span>
              </div>
            </Link>

            {/* Dynamic Clock */}
            <div className="hidden lg:block border-l border-border pl-6">
              <DynamicClock />
            </div>
          </div>

          {/* Primary Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {primaryNavItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg educational-transition
                  ${isActiveTab(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-text-secondary hover:text-text-primary hover:bg-muted'
                  }
                `}
                title={item.description}
              >
                <Icon name={item.icon} size={18} />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLanguageToggle}
              iconName="Globe"
              className="hidden sm:flex"
            >
              {currentLanguage.toUpperCase()}
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              iconName={theme === 'dark' ? 'Sun' : 'Moon'}
              className="hidden sm:flex"
            />

            {/* More Menu */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMoreMenuToggle}
                iconName="MoreHorizontal"
                className="hidden md:flex"
              >
                {t('more')}
              </Button>

              {/* More Dropdown */}
              {isMoreMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-90"
                    onClick={handleMoreMenuClose}
                  />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg educational-shadow-modal z-100">
                    <div className="py-2">
                      {secondaryNavItems.map((item) => (
                        <Link
                          key={item.id}
                          to={item.path}
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-muted educational-transition"
                          onClick={handleMoreMenuClose}
                        >
                          <Icon name={item.icon} size={16} />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              iconName="Menu"
              className="md:hidden"
              onClick={() => {/* Mobile menu handler */}}
            />

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <button
                  onClick={handleUserMenuToggle}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-muted educational-transition"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user?.name?.charAt(0) || 'P'}
                    </span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium text-text-primary">
                      {user?.name || 'Professor'}
                    </div>
                    <div className="text-xs text-text-secondary">
                      {t('grade-5-teacher')}
                    </div>
                  </div>
                  <Icon name="ChevronDown" size={16} className="text-text-secondary" />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-90"
                      onClick={handleUserMenuClose}
                    />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg educational-shadow-modal z-100">
                      <div className="py-2">
                        <div className="px-4 py-2 border-b border-border">
                          <div className="text-sm font-medium text-text-primary">
                            {user?.name || 'Professor'}
                          </div>
                          <div className="text-xs text-text-secondary">
                            {user?.email || 'professor@escola.edu.br'}
                          </div>
                        </div>
                        <Link
                          to="/profile"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-muted educational-transition"
                          onClick={handleUserMenuClose}
                        >
                          <Icon name="User" size={16} />
                          <span>Perfil</span>
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-muted educational-transition"
                          onClick={handleUserMenuClose}
                        >
                          <Icon name="Settings" size={16} />
                          <span>{t('settings')}</span>
                        </Link>
                        <div className="border-t border-border my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 educational-transition"
                        >
                          <Icon name="LogOut" size={16} />
                          <span>{t('logout')}</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;