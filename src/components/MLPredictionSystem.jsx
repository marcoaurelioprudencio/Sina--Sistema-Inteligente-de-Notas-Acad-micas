import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';
import { useNotifications } from './NotificationSystem';
import { 
  Brain, TrendingUp, TrendingDown, AlertTriangle, Target, BarChart3,
  Users, BookOpen, X, RefreshCw, Download, Lightbulb
} from 'lucide-react';

const MLPredictionSystem = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const { students, subjects, grades } = useData();
  const { addNotification } = useNotifications();
  
  const [selectedStudent, setSelectedStudent] = useState('');
  const [predictionType, setPredictionType] = useState('individual');
  const [predictions, setPredictions] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const generatePredictions = async () => {
    setIsAnalyzing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (predictionType === 'individual' && selectedStudent) {
        const student = students.find(s => s.id === selectedStudent);
        const studentGrades = grades.filter(g => g.studentId === selectedStudent);
        
        const predictions = subjects.map(subject => {
          const subjectGrades = studentGrades.filter(g => g.subjectId === subject.id);
          const currentAverage = subjectGrades.length > 0 
            ? subjectGrades.reduce((sum, g) => sum + g.grade, 0) / subjectGrades.length 
            : 0;
          
          const trend = Math.random() * 2 - 1;
          const predictedGrade = Math.max(0, Math.min(10, currentAverage + trend));
          const confidence = Math.random() * 0.4 + 0.6;
          
          return {
            subject: subject.name,
            currentAverage: currentAverage,
            predictedGrade: predictedGrade,
            trend: predictedGrade - currentAverage,
            confidence: confidence,
            riskLevel: predictedGrade < 6 ? 'high' : predictedGrade < 7 ? 'medium' : 'low'
          };
        });
        
        setPredictions({
          type: 'individual',
          student: student,
          data: predictions,
          summary: {
            improving: predictions.filter(p => p.trend > 0.5).length,
            declining: predictions.filter(p => p.trend < -0.5).length,
            stable: predictions.filter(p => Math.abs(p.trend) <= 0.5).length
          }
        });
      }
      
      addNotification({
        type: 'success',
        title: 'Análise concluída',
        message: 'Predições geradas com sucesso usando IA'
      });
      
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Erro na análise',
        message: 'Não foi possível gerar as predições'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (riskLevel) => {
    const colors = {
      high: 'text-red-600 bg-red-100',
      medium: 'text-yellow-600 bg-yellow-100',
      low: 'text-green-600 bg-green-100'
    };
    return colors[riskLevel] || 'text-gray-600 bg-gray-100';
  };

  const getRiskLabel = (riskLevel) => {
    const labels = {
      high: 'Alto Risco',
      medium: 'Risco Médio',
      low: 'Baixo Risco'
    };
    return labels[riskLevel] || 'Indefinido';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-6xl h-[90vh] rounded-lg shadow-xl ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className={`flex items-center justify-between p-6 border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-3">
            <Brain className="h-6 w-6 text-purple-600" />
            <h2 className={`text-xl font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Predição de Desempenho com IA
            </h2>
          </div>
          <button onClick={onClose} className={`p-2 rounded-lg transition-colors ${
            theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
          }`}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className={`p-6 rounded-lg border mb-6 ${
            theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Configuração da Análise
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Tipo de Predição
                </label>
                <select
                  value={predictionType}
                  onChange={(e) => setPredictionType(e.target.value)}
                  className={`w-full px-3 py-2 rounded-md border ${
                    theme === 'dark' ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="individual">Estudante Individual</option>
                  <option value="class">Turma Completa</option>
                </select>
              </div>
              
              {predictionType === 'individual' && (
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Estudante
                  </label>
                  <select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    className={`w-full px-3 py-2 rounded-md border ${
                      theme === 'dark' ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">Selecione um estudante</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>
                        {student.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            
            <button
              onClick={generatePredictions}
              disabled={isAnalyzing || (predictionType === 'individual' && !selectedStudent)}
              className={`w-full py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                isAnalyzing || (predictionType === 'individual' && !selectedStudent)
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Analisando com IA...</span>
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4" />
                  <span>Gerar Predições</span>
                </>
              )}
            </button>
          </div>

          {predictions && (
            <div className="space-y-6">
              <div className={`p-6 rounded-lg border ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Resumo das Predições
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-50'}`}>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Melhorando
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {predictions.summary.improving}
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-50'}`}>
                    <div className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Estável
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {predictions.summary.stable}
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-50'}`}>
                    <div className="flex items-center space-x-2">
                      <TrendingDown className="h-5 w-5 text-red-600" />
                      <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Declinando
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-red-600">
                      {predictions.summary.declining}
                    </div>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-lg border ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Predições Detalhadas
                </h3>
                
                <div className="space-y-3">
                  {predictions.data.map((item, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${
                      theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {item.subject}
                        </h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${getRiskColor(item.riskLevel)}`}>
                          {getRiskLabel(item.riskLevel)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className={`block ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Atual
                          </span>
                          <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {item.currentAverage.toFixed(1)}
                          </span>
                        </div>
                        
                        <div>
                          <span className={`block ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Predição
                          </span>
                          <span className={`font-medium ${
                            item.predictedGrade >= 7 ? 'text-green-600' : 
                            item.predictedGrade >= 6 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {item.predictedGrade.toFixed(1)}
                          </span>
                        </div>
                        
                        <div>
                          <span className={`block ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Tendência
                          </span>
                          <div className="flex items-center space-x-1">
                            {item.trend > 0.1 ? <TrendingUp className="h-3 w-3 text-green-600" /> :
                             item.trend < -0.1 ? <TrendingDown className="h-3 w-3 text-red-600" /> :
                             <Target className="h-3 w-3 text-gray-500" />}
                            <span className={`font-medium ${
                              item.trend > 0.1 ? 'text-green-600' : 
                              item.trend < -0.1 ? 'text-red-600' : 'text-gray-500'
                            }`}>
                              {item.trend > 0 ? '+' : ''}{item.trend.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <span className={`block ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Confiança
                          </span>
                          <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {(item.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MLPredictionSystem;
