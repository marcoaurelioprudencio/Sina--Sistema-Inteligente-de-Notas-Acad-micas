import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Plus, 
  Users, 
  BookOpen, 
  BarChart3, 
  Calendar, 
  Download,
  Upload,
  Brain
} from 'lucide-react';

const QuickActions = ({ onAction }) => {
  const { theme } = useTheme();

  const actions = [
    {
      icon: Plus,
      label: 'Nova Avaliação',
      description: 'Registrar nota e frequência',
      color: 'blue',
      action: 'add-grade'
    },
    {
      icon: Brain,
      label: 'Assistente IA',
      description: 'Análise inteligente e sugestões',
      color: 'purple',
      action: 'ai-chat'
    },
    {
      icon: Users,
      label: 'Gerenciar Estudantes',
      description: 'Adicionar, editar ou remover',
      color: 'green',
      action: 'manage-students'
    },
    {
      icon: BookOpen,
      label: 'Relatórios',
      description: 'Gerar relatórios em PDF',
      color: 'indigo',
      action: 'reports'
    },
    {
      icon: BarChart3,
      label: 'Análises',
      description: 'Visualizar estatísticas',
      color: 'orange',
      action: 'analytics'
    },
    {
      icon: Calendar,
      label: 'Calendário',
      description: 'Agendar avaliações',
      color: 'red',
      action: 'calendar'
    },
    {
      icon: Download,
      label: 'Exportar Dados',
      description: 'Baixar em Excel/CSV',
      color: 'teal',
      action: 'export'
    },
    {
      icon: Upload,
      label: 'Importar Dados',
      description: 'Carregar planilhas',
      color: 'gray',
      action: 'import'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50',
        border: theme === 'dark' ? 'border-blue-800' : 'border-blue-200',
        icon: 'text-blue-500',
        hover: theme === 'dark' ? 'hover:bg-blue-800/30' : 'hover:bg-blue-100'
      },
      green: {
        bg: theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50',
        border: theme === 'dark' ? 'border-green-800' : 'border-green-200',
        icon: 'text-green-500',
        hover: theme === 'dark' ? 'hover:bg-green-800/30' : 'hover:bg-green-100'
      },
      purple: {
        bg: theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-50',
        border: theme === 'dark' ? 'border-purple-800' : 'border-purple-200',
        icon: 'text-purple-500',
        hover: theme === 'dark' ? 'hover:bg-purple-800/30' : 'hover:bg-purple-100'
      },
      orange: {
        bg: theme === 'dark' ? 'bg-orange-900/20' : 'bg-orange-50',
        border: theme === 'dark' ? 'border-orange-800' : 'border-orange-200',
        icon: 'text-orange-500',
        hover: theme === 'dark' ? 'hover:bg-orange-800/30' : 'hover:bg-orange-100'
      },
      red: {
        bg: theme === 'dark' ? 'bg-red-900/20' : 'bg-red-50',
        border: theme === 'dark' ? 'border-red-800' : 'border-red-200',
        icon: 'text-red-500',
        hover: theme === 'dark' ? 'hover:bg-red-800/30' : 'hover:bg-red-100'
      },
      indigo: {
        bg: theme === 'dark' ? 'bg-indigo-900/20' : 'bg-indigo-50',
        border: theme === 'dark' ? 'border-indigo-800' : 'border-indigo-200',
        icon: 'text-indigo-500',
        hover: theme === 'dark' ? 'hover:bg-indigo-800/30' : 'hover:bg-indigo-100'
      },
      teal: {
        bg: theme === 'dark' ? 'bg-teal-900/20' : 'bg-teal-50',
        border: theme === 'dark' ? 'border-teal-800' : 'border-teal-200',
        icon: 'text-teal-500',
        hover: theme === 'dark' ? 'hover:bg-teal-800/30' : 'hover:bg-teal-100'
      },
      gray: {
        bg: theme === 'dark' ? 'bg-gray-900/20' : 'bg-gray-50',
        border: theme === 'dark' ? 'border-gray-800' : 'border-gray-200',
        icon: 'text-gray-500',
        hover: theme === 'dark' ? 'hover:bg-gray-800/30' : 'hover:bg-gray-100'
      }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className={`text-2xl font-bold mb-2 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Ações Rápidas
        </h2>
        <p className={`text-lg ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Acesse rapidamente as funcionalidades mais utilizadas
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => {
          const colors = getColorClasses(action.color);
          const IconComponent = action.icon;
          
          return (
            <button
              key={index}
              onClick={() => onAction && onAction(action.action)}
              className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg transform hover:scale-105 ${
                theme === 'dark' 
                  ? `${colors.bg} ${colors.border} border-opacity-50 ${colors.hover}` 
                  : `${colors.bg} ${colors.border} ${colors.hover}`
              }`}
            >
              <div className="text-center">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-lg ${colors.bg} flex items-center justify-center`}>
                  <IconComponent className={`h-6 w-6 ${colors.icon}`} />
                </div>
                <h3 className={`font-semibold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {action.label}
                </h3>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {action.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
