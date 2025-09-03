import React from 'react';
import Icon from '../../../components/AppIcon';

const KPIMetricsCard = ({ title, value, subtitle, trend, trendValue, icon, color = 'primary' }) => {
  const getTrendIcon = () => {
    if (trend === 'up') return 'TrendingUp';
    if (trend === 'down') return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-success';
    if (trend === 'down') return 'text-error';
    return 'text-text-secondary';
  };

  const getColorClasses = () => {
    switch (color) {
      case 'success':
        return 'bg-success/10 border-success/20';
      case 'warning':
        return 'bg-warning/10 border-warning/20';
      case 'error':
        return 'bg-error/10 border-error/20';
      default:
        return 'bg-primary/10 border-primary/20';
    }
  };

  const getIconColor = () => {
    switch (color) {
      case 'success':
        return 'var(--color-success)';
      case 'warning':
        return 'var(--color-warning)';
      case 'error':
        return 'var(--color-error)';
      default:
        return 'var(--color-primary)';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 educational-shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses()}`}>
          <Icon name={icon} size={24} color={getIconColor()} />
        </div>
        {trendValue && (
          <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
            <Icon name={getTrendIcon()} size={16} />
            <span className="text-sm font-medium">{trendValue}</span>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-2xl font-semibold text-text-primary mb-1">{value}</h3>
        <p className="text-sm text-text-secondary mb-2">{title}</p>
        {subtitle && (
          <p className="text-xs text-text-secondary">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default KPIMetricsCard;