import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Users, 
  X, 
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const CalendarModal = ({ isOpen, onClose }) => {
  const { students, subjects } = useData();
  const { theme } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Prova de Matemática',
      date: new Date(2025, 8, 5),
      subject: 'Matemática',
      type: 'Prova',
      class: '5A'
    },
    {
      id: 2,
      title: 'Trabalho de História',
      date: new Date(2025, 8, 10),
      subject: 'História',
      type: 'Trabalho',
      class: '5A'
    }
  ]);
  
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    subject: '',
    type: 'Prova',
    class: '5A',
    time: '08:00'
  });

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setNewEvent({ ...newEvent, date: date.toISOString().split('T')[0] });
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.subject) return;
    
    const event = {
      id: Date.now(),
      title: newEvent.title,
      date: new Date(newEvent.date),
      subject: newEvent.subject,
      type: newEvent.type,
      class: newEvent.class,
      time: newEvent.time
    };
    
    setEvents([...events, event]);
    setNewEvent({
      title: '',
      date: '',
      subject: '',
      type: 'Prova',
      class: '5A',
      time: '08:00'
    });
    setShowEventForm(false);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-4xl h-[80vh] rounded-2xl shadow-2xl flex ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
      }`}>
        
        {/* Calendar Section */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'
              }`}>
                <Calendar className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Calendário de Avaliações
                </h2>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Agende e gerencie suas avaliações
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth(-1)}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <h3 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            
            <button
              onClick={() => navigateMonth(1)}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className={`p-2 text-center text-sm font-medium ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentDate).map((date, index) => {
              const dayEvents = date ? getEventsForDate(date) : [];
              const isToday = date && date.toDateString() === new Date().toDateString();
              const isSelected = date && selectedDate && date.toDateString() === selectedDate.toDateString();
              
              return (
                <div
                  key={index}
                  onClick={() => date && handleDateClick(date)}
                  className={`h-20 p-1 border rounded-lg cursor-pointer transition-colors ${
                    !date ? 'cursor-default' :
                    isSelected ? 'bg-blue-100 border-blue-300 dark:bg-blue-900/20 dark:border-blue-600' :
                    isToday ? 'bg-green-100 border-green-300 dark:bg-green-900/20 dark:border-green-600' :
                    theme === 'dark' ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {date && (
                    <>
                      <div className={`text-sm font-medium ${
                        isToday ? 'text-green-600' :
                        isSelected ? 'text-blue-600' :
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {date.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map(event => (
                          <div
                            key={event.id}
                            className="text-xs px-1 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 truncate"
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{dayEvents.length - 2} mais
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className={`w-80 border-l p-6 ${
          theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
        }`}>
          
          {/* Add Event Button */}
          <button
            onClick={() => setShowEventForm(true)}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mb-6"
          >
            <Plus className="h-4 w-4" />
            <span>Nova Avaliação</span>
          </button>

          {/* Event Form */}
          {showEventForm && (
            <div className={`p-4 rounded-lg border mb-6 ${
              theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'
            }`}>
              <h4 className={`font-semibold mb-3 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Agendar Avaliação
              </h4>
              
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Título da avaliação"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark'
                      ? 'bg-gray-600 border-gray-500 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark'
                      ? 'bg-gray-600 border-gray-500 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                
                <select
                  value={newEvent.subject}
                  onChange={(e) => setNewEvent({ ...newEvent, subject: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark'
                      ? 'bg-gray-600 border-gray-500 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">Selecionar disciplina</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.name}>
                      {subject.name}
                    </option>
                  ))}
                </select>
                
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark'
                      ? 'bg-gray-600 border-gray-500 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="Prova">Prova</option>
                  <option value="Trabalho">Trabalho</option>
                  <option value="Teste">Teste</option>
                  <option value="Projeto">Projeto</option>
                  <option value="Apresentação">Apresentação</option>
                </select>
                
                <div className="flex space-x-2">
                  <button
                    onClick={handleAddEvent}
                    className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Agendar
                  </button>
                  <button
                    onClick={() => setShowEventForm(false)}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'bg-gray-600 hover:bg-gray-500 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Events List */}
          <div>
            <h4 className={`font-semibold mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Próximas Avaliações
            </h4>
            
            <div className="space-y-3">
              {events
                .filter(event => event.date >= new Date())
                .sort((a, b) => a.date - b.date)
                .slice(0, 5)
                .map(event => (
                  <div
                    key={event.id}
                    className={`p-3 rounded-lg border ${
                      theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className={`font-medium text-sm ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {event.title}
                    </div>
                    <div className={`text-xs mt-1 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {event.date.toLocaleDateString('pt-BR')} • {event.subject}
                    </div>
                    <div className="flex items-center mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        event.type === 'Prova' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                        event.type === 'Trabalho' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' :
                        'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                      }`}>
                        {event.type}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;
