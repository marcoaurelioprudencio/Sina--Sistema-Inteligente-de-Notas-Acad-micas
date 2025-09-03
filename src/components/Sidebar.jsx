import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Home, 
  Users, 
  BookOpen, 
  BarChart3, 
  Calendar, 
  Settings, 
  LogOut, 
  Plus,
  Search,
  Bell,
  Menu,
  X
} from 'lucide-react';
import SinaLogo from './ui/SinaLogo';

const Sidebar = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { theme } = useTheme();
  
  const [searchTerm, setSearchTerm] = useState('');

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/', color: 'text-blue-500' },
    { icon: Users, label: 'Estudantes', path: '/student-management', color: 'text-green-500' },
    { icon: BookOpen, label: 'Disciplinas', path: '/disciplinas', color: 'text-purple-500' },
    { icon: Settings, label: 'Configurações', path: '/settings', color: 'text-gray-500' },
  ];

  const quickActions = [
    { icon: Plus, label: 'Nova Nota', action: () => navigate('/') },
    { icon: Users, label: 'Novo Estudante', action: () => navigate('/student-management') },
    { icon: BookOpen, label: 'Nova Disciplina', action: () => navigate('/subject-performance-analytics-dashboard') },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-16 h-[calc(100vh-4rem)] z-40 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        
        <div className={`h-full w-64 flex flex-col ${
          theme === 'dark' 
            ? 'bg-gray-900 border-r border-gray-700' 
            : 'bg-white border-r border-gray-200'
        }`}>
          
          {/* Header */}
          <div className={`p-6 border-b ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center space-x-3">
              <SinaLogo size="medium" />
              <div>
                <h1 className={`font-bold text-lg ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  SINA
                </h1>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Sistema Inteligente
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-4">
            <div className={`relative ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
            } rounded-lg`}>
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 bg-transparent border-none outline-none text-sm ${
                  theme === 'dark' ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="px-4 mb-4">
            <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Ações Rápidas
            </h3>
            <div className="space-y-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <action.icon className="h-4 w-4" />
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4">
            <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Navegação
            </h3>
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                      isActive(item.path)
                        ? `${theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'} shadow-sm`
                        : `${theme === 'dark' ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
                    }`}
                  >
                    <item.icon className={`h-4 w-4 ${item.color}`} />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Section */}
          <div className={`p-4 border-t ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">P</span>
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Professor
                </p>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Sistema SINA
                </p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                theme === 'dark'
                  ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300'
                  : 'text-red-600 hover:bg-red-50 hover:text-red-700'
              }`}
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Toggle Button */}
      <button
        onClick={onToggle}
        className={`fixed top-4 left-4 z-50 p-2 rounded-lg lg:hidden ${
          theme === 'dark'
            ? 'bg-gray-800 text-white hover:bg-gray-700'
            : 'bg-white text-gray-900 hover:bg-gray-50'
        } shadow-lg`}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
    </>
  );
};

export default Sidebar;
