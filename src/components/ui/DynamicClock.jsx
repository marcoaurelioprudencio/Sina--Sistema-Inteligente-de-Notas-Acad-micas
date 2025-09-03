import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Clock } from 'lucide-react';

const DynamicClock = ({ showSeconds = true, className = "" }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { theme } = useTheme();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      ...(showSeconds && { second: '2-digit' }),
      hour12: false
    };
    return date.toLocaleTimeString([], options);
  };

  const formatDate = (date) => {
    const options = {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    };
    return date.toLocaleDateString('pt-BR', options);
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Clock className={`h-4 w-4 ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }`} />
      <div className="flex flex-col">
        <span className={`text-sm font-medium ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          {formatTime(currentTime)}
        </span>
        <span className={`text-xs ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {formatDate(currentTime)}
        </span>
      </div>
    </div>
  );
};

export default DynamicClock;