import React from 'react';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Plus, 
  Edit, 
  Trash2, 
  User, 
  BookOpen, 
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

const RecentActivity = () => {
  const { grades, students } = useData();
  const { theme } = useTheme();

  // Simular atividades recentes baseadas nos dados
  const recentActivities = [
    {
      id: 1,
      type: 'grade_added',
      icon: Plus,
      color: 'text-green-500',
      message: 'Nova nota adicionada para Ana Beatriz Silva em Matemática',
      time: '5 min atrás',
      student: 'Ana Beatriz Silva',
      subject: 'Matemática',
      grade: 8.5
    },
    {
      id: 2,
      type: 'grade_updated',
      icon: Edit,
      color: 'text-blue-500',
      message: 'Nota atualizada para João Pedro Almeida em História',
      time: '15 min atrás',
      student: 'João Pedro Almeida',
      subject: 'História',
      grade: 7.0
    },
    {
      id: 3,
      type: 'grade_added',
      icon: Plus,
      color: 'text-green-500',
      message: 'Nova nota adicionada para Larissa Santos Oliveira em Língua Portuguesa',
      time: '1 hora atrás',
      student: 'Larissa Santos Oliveira',
      subject: 'Língua Portuguesa',
      grade: 9.0
    },
    {
      id: 4,
      type: 'grade_added',
      icon: Plus,
      color: 'text-green-500',
      message: 'Nova nota adicionada para Rafael Gomes Ferreira em Física',
      time: '2 horas atrás',
      student: 'Rafael Gomes Ferreira',
      subject: 'Física',
      grade: 6.5
    },
    {
      id: 5,
      type: 'grade_updated',
      icon: Edit,
      color: 'text-blue-500',
      message: 'Nota atualizada para Vitória Costa Mendes em Química',
      time: '3 horas atrás',
      student: 'Vitória Costa Mendes',
      subject: 'Química',
      grade: 8.0
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'grade_added':
        return Plus;
      case 'grade_updated':
        return Edit;
      case 'grade_deleted':
        return Trash2;
      default:
        return Clock;
    }
  };

  const getGradeColor = (grade) => {
    if (grade >= 8) return 'text-green-600';
    if (grade >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`rounded-xl shadow-sm overflow-hidden ${
      theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
    }`}>
      
      {/* Header */}
      <div className={`px-6 py-4 border-b ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'
            }`}>
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Atividades Recentes
              </h3>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Últimas ações realizadas no sistema
              </p>
            </div>
          </div>
          
          <button className={`text-sm ${
            theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
          }`}>
            Ver todas
          </button>
        </div>
      </div>

      {/* Activities List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {recentActivities.map((activity) => {
          const IconComponent = getActivityIcon(activity.type);
          
          return (
            <div key={activity.id} className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors`}>
              <div className="flex items-start space-x-3">
                {/* Icon */}
                <div className={`p-2 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <IconComponent className={`h-4 w-4 ${activity.color}`} />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {activity.message}
                    </p>
                    <span className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {activity.time}
                    </span>
                  </div>
                  
                  <div className="mt-2 flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <User className={`h-3 w-3 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <span className={`text-xs ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {activity.student}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <BookOpen className={`h-3 w-3 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <span className={`text-xs ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {activity.subject}
                      </span>
                    </div>
                    
                    {activity.grade && (
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-medium ${getGradeColor(activity.grade)}`}>
                          Nota: {activity.grade}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {recentActivities.length === 0 && (
        <div className={`text-center py-12 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2">Nenhuma atividade recente</p>
          <p className="text-sm">As atividades aparecerão aqui quando você começar a usar o sistema</p>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
