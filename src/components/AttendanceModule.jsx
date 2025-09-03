import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';
import { useNotifications } from './NotificationSystem';
import { 
  QrCode, 
  Camera, 
  Users, 
  Calendar, 
  Clock,
  CheckCircle,
  XCircle,
  Download,
  Upload,
  Search,
  Filter,
  RefreshCw,
  Eye,
  EyeOff,
  X
} from 'lucide-react';

const AttendanceModule = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const { students, subjects } = useData();
  const { addNotification } = useNotifications();
  
  const [activeTab, setActiveTab] = useState('generate'); // generate, scan, records
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [qrCode, setQrCode] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, present, absent
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Mock attendance data
  const [mockAttendance, setMockAttendance] = useState([
    {
      id: 1,
      date: '2025-01-15',
      subjectId: 'math',
      subjectName: 'Matemática',
      totalStudents: 15,
      presentStudents: 13,
      absentStudents: 2,
      records: [
        { studentId: 'student_1', studentName: 'Ana Silva', status: 'present', timestamp: '08:15' },
        { studentId: 'student_2', studentName: 'Carlos Santos', status: 'present', timestamp: '08:12' },
        { studentId: 'student_3', studentName: 'Maria Oliveira', status: 'absent', timestamp: null },
        // ... more records
      ]
    }
  ]);

  useEffect(() => {
    // Generate mock attendance records for current date
    const today = new Date().toISOString().split('T')[0];
    const existingRecord = mockAttendance.find(record => 
      record.date === today && record.subjectId === selectedSubject
    );
    
    if (!existingRecord && selectedSubject) {
      generateMockAttendance();
    }
  }, [selectedSubject, selectedDate]);

  const generateMockAttendance = () => {
    const subject = subjects.find(s => s.id === selectedSubject);
    if (!subject) return;

    const records = students.map(student => ({
      studentId: student.id,
      studentName: student.name,
      status: Math.random() > 0.15 ? 'present' : 'absent', // 85% attendance rate
      timestamp: Math.random() > 0.15 ? 
        `08:${String(Math.floor(Math.random() * 30) + 10).padStart(2, '0')}` : 
        null
    }));

    const newRecord = {
      id: Date.now(),
      date: selectedDate,
      subjectId: selectedSubject,
      subjectName: subject.name,
      totalStudents: students.length,
      presentStudents: records.filter(r => r.status === 'present').length,
      absentStudents: records.filter(r => r.status === 'absent').length,
      records
    };

    setMockAttendance(prev => [newRecord, ...prev.filter(r => 
      !(r.date === selectedDate && r.subjectId === selectedSubject)
    )]);
  };

  const generateQRCode = () => {
    if (!selectedSubject || !selectedDate) {
      addNotification({
        type: 'warning',
        title: 'Campos obrigatórios',
        message: 'Selecione a disciplina e a data'
      });
      return;
    }

    const subject = subjects.find(s => s.id === selectedSubject);
    const qrData = {
      type: 'attendance',
      subjectId: selectedSubject,
      subjectName: subject.name,
      date: selectedDate,
      timestamp: new Date().toISOString(),
      sessionId: `${selectedSubject}_${selectedDate}_${Date.now()}`
    };

    // Generate QR code (in real implementation, would use a QR library like qrcode)
    const qrCodeSVG = generateQRCodeSVG(JSON.stringify(qrData));
    setQrCode({
      data: qrData,
      svg: qrCodeSVG,
      url: `data:image/svg+xml;base64,${btoa(qrCodeSVG)}`
    });

    addNotification({
      type: 'success',
      title: 'QR Code gerado',
      message: `QR Code criado para ${subject.name} - ${new Date(selectedDate).toLocaleDateString('pt-BR')}`
    });
  };

  const generateQRCodeSVG = (data) => {
    // Simplified QR code representation (in real app, use proper QR library)
    const size = 200;
    const cellSize = size / 25;
    let svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">`;
    
    // Generate random pattern for demo
    for (let i = 0; i < 25; i++) {
      for (let j = 0; j < 25; j++) {
        if (Math.random() > 0.5) {
          svg += `<rect x="${j * cellSize}" y="${i * cellSize}" width="${cellSize}" height="${cellSize}" fill="black"/>`;
        }
      }
    }
    
    svg += '</svg>';
    return svg;
  };

  const startScanning = async () => {
    setIsScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Erro na câmera',
        message: 'Não foi possível acessar a câmera'
      });
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const simulateQRScan = () => {
    // Simulate successful QR scan
    const mockScanData = {
      studentId: 'student_' + Math.floor(Math.random() * 15 + 1),
      studentName: students[Math.floor(Math.random() * students.length)].name,
      timestamp: new Date().toLocaleTimeString('pt-BR')
    };

    addNotification({
      type: 'success',
      title: 'Presença registrada',
      message: `${mockScanData.studentName} - ${mockScanData.timestamp}`
    });

    stopScanning();
  };

  const exportAttendance = (record) => {
    const csvContent = [
      'Nome,Status,Horário',
      ...record.records.map(r => 
        `${r.studentName},${r.status === 'present' ? 'Presente' : 'Ausente'},${r.timestamp || ''}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `presenca_${record.subjectName}_${record.date}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addNotification({
      type: 'success',
      title: 'Relatório exportado',
      message: 'Arquivo CSV baixado com sucesso'
    });
  };

  const filteredRecords = mockAttendance.filter(record => {
    const matchesSearch = record.subjectName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'present' && record.presentStudents > record.absentStudents) ||
      (filterStatus === 'absent' && record.absentStudents > record.presentStudents);
    return matchesSearch && matchesFilter;
  });

  if (!isOpen) return null;

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
            <QrCode className="h-6 w-6 text-blue-600" />
            <h2 className={`text-xl font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Controle de Presença
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

        {/* Tabs */}
        <div className={`flex border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          {[
            { key: 'generate', label: 'Gerar QR Code', icon: QrCode },
            { key: 'scan', label: 'Escanear', icon: Camera },
            { key: 'records', label: 'Registros', icon: Users }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center space-x-2 px-6 py-3 transition-colors ${
                activeTab === key
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'generate' && (
            <div className="max-w-2xl mx-auto">
              <div className="space-y-6">
                {/* Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Disciplina
                    </label>
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className={`w-full px-3 py-2 rounded-md border ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="">Selecione uma disciplina</option>
                      {subjects.map(subject => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Data
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className={`w-full px-3 py-2 rounded-md border ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </div>

                <button
                  onClick={generateQRCode}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <QrCode className="h-5 w-5" />
                  <span>Gerar QR Code</span>
                </button>

                {/* QR Code Display */}
                {qrCode && (
                  <div className={`p-6 rounded-lg border text-center ${
                    theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <h3 className={`text-lg font-semibold mb-4 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      QR Code Gerado
                    </h3>
                    
                    <div className="bg-white p-4 rounded-lg inline-block mb-4">
                      <img 
                        src={qrCode.url} 
                        alt="QR Code" 
                        className="w-48 h-48 mx-auto"
                      />
                    </div>
                    
                    <div className={`text-sm space-y-1 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <p><strong>Disciplina:</strong> {qrCode.data.subjectName}</p>
                      <p><strong>Data:</strong> {new Date(qrCode.data.date).toLocaleDateString('pt-BR')}</p>
                      <p><strong>Gerado em:</strong> {new Date(qrCode.data.timestamp).toLocaleString('pt-BR')}</p>
                    </div>

                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.download = `qr_presenca_${qrCode.data.subjectName}_${qrCode.data.date}.svg`;
                        link.href = qrCode.url;
                        link.click();
                      }}
                      className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
                    >
                      <Download className="h-4 w-4" />
                      <span>Baixar QR Code</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'scan' && (
            <div className="max-w-2xl mx-auto text-center">
              <div className="space-y-6">
                <div>
                  <h3 className={`text-lg font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Escaneamento de QR Code
                  </h3>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Use a câmera para escanear o QR Code dos estudantes
                  </p>
                </div>

                {!isScanning ? (
                  <div className={`p-8 rounded-lg border-2 border-dashed ${
                    theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
                  }`}>
                    <Camera className={`h-16 w-16 mx-auto mb-4 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <button
                      onClick={startScanning}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
                    >
                      <Camera className="h-5 w-5" />
                      <span>Iniciar Escaneamento</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative bg-black rounded-lg overflow-hidden">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-white rounded-lg"></div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-4 justify-center">
                      <button
                        onClick={simulateQRScan}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Simular Scan
                      </button>
                      <button
                        onClick={stopScanning}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Parar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'records' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="text"
                    placeholder="Buscar por disciplina..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className={`px-4 py-2 rounded-lg border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="all">Todos os registros</option>
                  <option value="present">Alta presença</option>
                  <option value="absent">Baixa presença</option>
                </select>
              </div>

              {/* Records List */}
              <div className="space-y-4">
                {filteredRecords.map(record => (
                  <div
                    key={record.id}
                    className={`p-4 rounded-lg border ${
                      theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className={`font-semibold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {record.subjectName}
                        </h3>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {new Date(record.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <button
                        onClick={() => exportAttendance(record)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1"
                      >
                        <Download className="h-3 w-3" />
                        <span>Exportar</span>
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className={`p-3 rounded-lg ${
                        theme === 'dark' ? 'bg-gray-600' : 'bg-gray-100'
                      }`}>
                        <div className={`text-2xl font-bold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {record.totalStudents}
                        </div>
                        <div className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Total
                        </div>
                      </div>
                      
                      <div className={`p-3 rounded-lg ${
                        theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100'
                      }`}>
                        <div className="text-2xl font-bold text-green-600">
                          {record.presentStudents}
                        </div>
                        <div className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Presentes
                        </div>
                      </div>
                      
                      <div className={`p-3 rounded-lg ${
                        theme === 'dark' ? 'bg-red-900/30' : 'bg-red-100'
                      }`}>
                        <div className="text-2xl font-bold text-red-600">
                          {record.absentStudents}
                        </div>
                        <div className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Ausentes
                        </div>
                      </div>
                    </div>
                    
                    <div className={`mt-3 text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Taxa de presença: {((record.presentStudents / record.totalStudents) * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
                
                {filteredRecords.length === 0 && (
                  <div className={`text-center py-8 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhum registro encontrado</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceModule;
