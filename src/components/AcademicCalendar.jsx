import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Edit, 
  Trash2, 
  X,
  Clock,
  MapPin,
  Users,
  BookOpen,
  AlertCircle
} from 'lucide-react';

const AcademicCalendar = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Prova de Matemática',
      date: '2025-01-15',
      time: '08:00',
      type: 'exam',
      description: 'Avaliação do 1º bimestre',
      location: 'Sala 201',
      subject: 'Matemática'
    },
    {
      id: 2,
      title: 'Entrega de Trabalho - História',
      date: '2025-01-20',
      time: '23:59',
      type: 'assignment',
      description: 'Trabalho sobre Segunda Guerra Mundial',
      subject: 'História'
    },
    {
      id: 3,
      title: 'Reunião de Pais',
      date: '2025-01-25',
      time: '19:00',
      type: 'meeting',
      description: 'Reunião bimestral com responsáveis',
      location: 'Auditório Principal'
    },
    {
      id: 4,
      title: 'Feira de Ciências',
      date: '2025-02-10',
      time: '09:00',
      type: 'event',
      description: 'Apresentação de projetos científicos',
      location: 'Pátio da escola'
    },
    {
      id: 5,
      title: 'Início do 2º Bimestre',
      date: '2025-02-15',
      time: '07:30',
      type: 'academic',
      description: 'Início das atividades do segundo bimestre'
    }
  ]);

  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    type: 'exam',
    description: '',
    location: '',
    subject: ''
  });

  if (!isOpen) return null;

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

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
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  const getEventTypeColor = (type) => {
    const colors = {
      exam: 'bg-red-500',
      assignment: 'bg-blue-500',
      meeting: 'bg-green-500',
      event: 'bg-purple-500',
      academic: 'bg-yellow-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  const getEventTypeIcon = (type) => {
    const icons = {
      exam: AlertCircle,
      assignment: BookOpen,
      meeting: Users,
      event: Calendar,
      academic: Clock
    };
    return icons[type] || Calendar;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    setNewEvent({
      title: '',
      date: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
      time: '',
      type: 'exam',
      description: '',
      location: '',
      subject: ''
    });
    setShowEventModal(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setNewEvent({ ...event });
    setShowEventModal(true);
  };

  const handleSaveEvent = () => {
    if (editingEvent) {
      setEvents(events.map(e => e.id === editingEvent.id ? { ...newEvent, id: editingEvent.id } : e));
    } else {
      setEvents([...events, { ...newEvent, id: Date.now() }]);
    }
    setShowEventModal(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(e => e.id !== eventId));
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-6xl h-[90vh] rounded-lg shadow-xl ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6 text-blue-600" />
            <h2 className={`text-xl font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Calendário Acadêmico
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex h-full">
          {/* Calendar */}
          <div className="flex-1 p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigateMonth(-1)}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'hover:bg-gray-700 text-gray-300'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                <h3 className={`text-xl font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                
                <button
                  onClick={() => navigateMonth(1)}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'hover:bg-gray-700 text-gray-300'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              
              <button
                onClick={handleAddEvent}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Novo Evento</span>
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Week days header */}
              {weekDays.map(day => (
                <div
                  key={day}
                  className={`p-3 text-center text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {days.map((date, index) => {
                const dayEvents = date ? getEventsForDate(date) : [];
                const isToday = date && date.getTime() === today.getTime();
                const isSelected = selectedDate && date && date.getTime() === selectedDate.getTime();
                
                return (
                  <div
                    key={index}
                    onClick={() => date && handleDateClick(date)}
                    className={`min-h-[100px] p-2 border cursor-pointer transition-colors ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                    } ${
                      date ? (
                        isSelected ? 'bg-blue-100 dark:bg-blue-900/30' :
                        isToday ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                        theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                      ) : ''
                    }`}
                  >
                    {date && (
                      <>
                        <div className={`text-sm font-medium mb-1 ${
                          isToday ? 'text-yellow-600 dark:text-yellow-400' :
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {date.getDate()}
                        </div>
                        
                        {/* Events */}
                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map(event => (
                            <div
                              key={event.id}
                              className={`text-xs p-1 rounded text-white truncate ${getEventTypeColor(event.type)}`}
                              title={event.title}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className={`text-xs ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
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
          <div className={`w-80 border-l p-6 overflow-y-auto ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            {selectedDate ? (
              <>
                <h3 className={`text-lg font-semibold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {selectedDate.toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                
                <div className="space-y-3">
                  {getEventsForDate(selectedDate).map(event => {
                    const Icon = getEventTypeIcon(event.type);
                    return (
                      <div
                        key={event.id}
                        className={`p-3 rounded-lg border ${
                          theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Icon className={`h-4 w-4 ${getEventTypeColor(event.type).replace('bg-', 'text-')}`} />
                            <h4 className={`font-medium ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                              {event.title}
                            </h4>
                          </div>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleEditEvent(event)}
                              className={`p-1 rounded transition-colors ${
                                theme === 'dark'
                                  ? 'hover:bg-gray-600 text-gray-400'
                                  : 'hover:bg-gray-200 text-gray-600'
                              }`}
                            >
                              <Edit className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(event.id)}
                              className={`p-1 rounded transition-colors ${
                                theme === 'dark'
                                  ? 'hover:bg-gray-600 text-red-400'
                                  : 'hover:bg-gray-200 text-red-600'
                              }`}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        
                        {event.time && (
                          <div className={`flex items-center space-x-2 text-sm mb-1 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            <Clock className="h-3 w-3" />
                            <span>{event.time}</span>
                          </div>
                        )}
                        
                        {event.location && (
                          <div className={`flex items-center space-x-2 text-sm mb-1 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            <MapPin className="h-3 w-3" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        
                        {event.subject && (
                          <div className={`flex items-center space-x-2 text-sm mb-1 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            <BookOpen className="h-3 w-3" />
                            <span>{event.subject}</span>
                          </div>
                        )}
                        
                        {event.description && (
                          <p className={`text-sm mt-2 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {event.description}
                          </p>
                        )}
                      </div>
                    );
                  })}
                  
                  {getEventsForDate(selectedDate).length === 0 && (
                    <div className={`text-center py-8 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Nenhum evento nesta data</p>
                      <button
                        onClick={handleAddEvent}
                        className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                      >
                        Adicionar evento
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className={`text-center py-8 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Selecione uma data para ver os eventos</p>
              </div>
            )}
          </div>
        </div>

        {/* Event Modal */}
        {showEventModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className={`w-full max-w-md rounded-lg shadow-xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className={`flex items-center justify-between p-4 border-b ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <h3 className={`text-lg font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {editingEvent ? 'Editar Evento' : 'Novo Evento'}
                </h3>
                <button
                  onClick={() => setShowEventModal(false)}
                  className={`p-1 rounded transition-colors ${
                    theme === 'dark'
                      ? 'hover:bg-gray-700 text-gray-400'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="p-4 space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Título
                  </label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className={`w-full px-3 py-2 rounded-md border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Data
                    </label>
                    <input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className={`w-full px-3 py-2 rounded-md border ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Horário
                    </label>
                    <input
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      className={`w-full px-3 py-2 rounded-md border ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Tipo
                  </label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                    className={`w-full px-3 py-2 rounded-md border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="exam">Prova</option>
                    <option value="assignment">Trabalho</option>
                    <option value="meeting">Reunião</option>
                    <option value="event">Evento</option>
                    <option value="academic">Acadêmico</option>
                  </select>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Local
                  </label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    className={`w-full px-3 py-2 rounded-md border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Disciplina
                  </label>
                  <input
                    type="text"
                    value={newEvent.subject}
                    onChange={(e) => setNewEvent({ ...newEvent, subject: e.target.value })}
                    className={`w-full px-3 py-2 rounded-md border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Descrição
                  </label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    rows={3}
                    className={`w-full px-3 py-2 rounded-md border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>
              
              <div className={`flex items-center justify-end space-x-3 p-4 border-t ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <button
                  onClick={() => setShowEventModal(false)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveEvent}
                  disabled={!newEvent.title || !newEvent.date}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    !newEvent.title || !newEvent.date
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {editingEvent ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcademicCalendar;
