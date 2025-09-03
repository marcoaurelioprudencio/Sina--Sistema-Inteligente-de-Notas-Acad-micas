import React from 'react';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  BookOpen, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

const MetricsCards = () => {
  const { students, grades, getClassAverage, getAttendanceRate, getStudentsAtRisk } = useData();
  const { theme } = useTheme();

  const classAverage = getClassAverage();
  const attendanceRate = getAttendanceRate();
  const studentsAtRisk = getStudentsAtRisk();
  
  // Calcular métricas adicionais
  const totalStudents = students.length;
  const totalGrades = grades.length;
  const averageGradesPerStudent = totalGrades / totalStudents;
  
  // Calcular tendência (simulado)
  const previousAverage = classAverage - 0.3;
  const trend = classAverage > previousAverage ? 'up' : 'down';
  const trendPercentage = Math.abs(((classAverage - previousAverage) / previousAverage) * 100);

  const metrics = [
    {
      title: 'Média da Turma',
      value: classAverage.toFixed(1),
      unit: '/10',
      icon: Target,
      color: 'blue',
      trend: trend,
      trendValue: `${trendPercentage.toFixed(1)}%`,
      description: 'Média geral em todas as disciplinas',
      change: 'vs. período anterior'
    },
    {
      title: 'Taxa de Frequência',
      value: attendanceRate.toFixed(1),
      unit: '%',
      icon: Users,
      color: 'green',
      trend: 'up',
      trendValue: '+2.1%',
      description: 'Frequência média dos estudantes',
      change: 'vs. mês anterior'
    },
    {
      title: 'Estudantes em Risco',
      value: studentsAtRisk.length,
      unit: '',
      icon: AlertTriangle,
      color: 'red',
      trend: studentsAtRisk.length > 5 ? 'up' : 'down',
      trendValue: studentsAtRisk.length > 5 ? '+1' : '-2',
      description: 'Estudantes com média abaixo de 6.0',
      change: 'vs. semana anterior'
    },
    {
      title: 'Total de Avaliações',
      value: totalGrades,
      unit: '',
      icon: BookOpen,
      color: 'purple',
      trend: 'up',
      trendValue: '+12',
      description: 'Avaliações registradas no sistema',
      change: 'vs. mês anterior'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50',
        border: theme === 'dark' ? 'border-blue-800' : 'border-blue-200',
        icon: 'text-blue-500',
        value: 'text-blue-600',
        trend: 'text-blue-600'
      },
      green: {
        bg: theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50',
        border: theme === 'dark' ? 'border-green-800' : 'border-green-200',
        icon: 'text-green-500',
        value: 'text-green-600',
        trend: 'text-green-600'
      },
      red: {
        bg: theme === 'dark' ? 'bg-red-900/20' : 'bg-red-50',
        border: theme === 'dark' ? 'border-red-800' : 'border-red-200',
        icon: 'text-red-500',
        value: 'text-red-600',
        trend: 'text-red-600'
      },
      purple: {
        bg: theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-50',
        border: theme === 'dark' ? 'border-purple-800' : 'border-purple-200',
        icon: 'text-purple-500',
        value: 'text-purple-600',
        trend: 'text-purple-600'
      }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => {
        const colors = getColorClasses(metric.color);
        const IconComponent = metric.icon;
        
        return (
          <div
            key={index}
            className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg ${
              theme === 'dark' 
                ? `${colors.bg} ${colors.border} border-opacity-50` 
                : `${colors.bg} ${colors.border}`
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${colors.bg}`}>
                <IconComponent className={`h-5 w-5 ${colors.icon}`} />
              </div>
              <div className={`flex items-center space-x-1 text-sm ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span className="font-medium">{metric.trendValue}</span>
              </div>
            </div>

            {/* Value */}
            <div className="mb-2">
              <div className="flex items-baseline space-x-1">
                <span className={`text-3xl font-bold ${colors.value}`}>
                  {metric.value}
                </span>
                {metric.unit && (
                  <span className={`text-lg font-medium ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {metric.unit}
                  </span>
                )}
              </div>
            </div>

            {/* Title */}
            <h3 className={`text-lg font-semibold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {metric.title}
            </h3>

            {/* Description */}
            <p className={`text-sm mb-3 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {metric.description}
            </p>

            {/* Change */}
            <div className={`text-xs ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {metric.change}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MetricsCards;
