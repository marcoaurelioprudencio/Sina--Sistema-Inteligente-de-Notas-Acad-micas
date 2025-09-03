import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useFontSize } from '../contexts/FontSizeContext';
import { 
  Settings, 
  Palette, 
  Type, 
  Bell, 
  Download, 
  Upload, 
  Globe, 
  Shield, 
  Database,
  Save,
  RotateCcw,
  Monitor,
  Sun,
  Moon
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { fontSize, setFontSize, fontSizeOptions } = useFontSize();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Local settings state
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      browser: true,
      lowGrades: true,
      attendance: false,
      newStudents: true
    },
    display: {
      showAnimations: true,
      compactMode: false,
      showTooltips: true,
      autoRefresh: true
    },
    data: {
      autoBackup: false,
      exportFormat: 'csv',
      retentionDays: 365
    },
    privacy: {
      analytics: true,
      errorReporting: true,
      shareUsage: false
    }
  });

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const saveSettings = () => {
    localStorage.setItem('sina-settings', JSON.stringify(settings));
    // Show success message
    alert('Configurações salvas com sucesso!');
  };

  const resetSettings = () => {
    if (confirm('Tem certeza que deseja restaurar as configurações padrão?')) {
      setSettings({
        notifications: {
          email: true,
          browser: true,
          lowGrades: true,
          attendance: false,
          newStudents: true
        },
        display: {
          showAnimations: true,
          compactMode: false,
          showTooltips: true,
          autoRefresh: true
        },
        data: {
          autoBackup: false,
          exportFormat: 'csv',
          retentionDays: 365
        },
        privacy: {
          analytics: true,
          errorReporting: true,
          shareUsage: false
        }
      });
      setFontSize('medium');
    }
  };

  const SettingCard = ({ icon: Icon, title, children }) => (
    <div className={`rounded-xl shadow-sm overflow-hidden ${
      theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
    }`}>
      <div className={`px-6 py-4 border-b ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${
            theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'
          }`}>
            <Icon className="h-5 w-5 text-blue-500" />
          </div>
          <h3 className={`text-lg font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {title}
          </h3>
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );

  const ToggleSwitch = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <div className={`font-medium ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          {label}
        </div>
        {description && (
          <div className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {description}
          </div>
        )}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-blue-600' : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      
      {/* Header */}
      <Header 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        onQuickAdd={() => {}}
      />
      
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Main Content */}
      <div className="lg:ml-64 pt-16">
        {/* Main Content Area */}
        <main className="px-6">
          
          {/* Page Title */}
          <div className="mb-6">
            <h1 className={`text-2xl font-bold mb-1 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Configurações
            </h1>
            <p className={`text-base ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Personalize sua experiência no SINA
            </p>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            {/* Appearance Settings */}
            <SettingCard icon={Palette} title="Aparência">
              <div className="space-y-4">
                {/* Theme Selection */}
                <div>
                  <label className={`block text-sm font-medium mb-3 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Tema
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => theme === 'dark' && toggleTheme()}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        theme === 'light'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                      }`}
                    >
                      <Sun className="h-5 w-5 mx-auto mb-2" />
                      <div className="text-sm font-medium">Claro</div>
                    </button>
                    <button
                      onClick={() => theme === 'light' && toggleTheme()}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        theme === 'dark'
                          ? 'border-blue-500 bg-blue-900/20 text-blue-300'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Moon className="h-5 w-5 mx-auto mb-2" />
                      <div className="text-sm font-medium">Escuro</div>
                    </button>
                  </div>
                </div>

                {/* Font Size */}
                <div>
                  <label className={`block text-sm font-medium mb-3 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Tamanho da Fonte
                  </label>
                  <select
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    {fontSizeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Display Options */}
                <div className="space-y-2">
                  <ToggleSwitch
                    checked={settings.display.showAnimations}
                    onChange={(value) => handleSettingChange('display', 'showAnimations', value)}
                    label="Animações"
                    description="Mostrar animações e transições"
                  />
                  <ToggleSwitch
                    checked={settings.display.compactMode}
                    onChange={(value) => handleSettingChange('display', 'compactMode', value)}
                    label="Modo Compacto"
                    description="Interface mais densa"
                  />
                  <ToggleSwitch
                    checked={settings.display.showTooltips}
                    onChange={(value) => handleSettingChange('display', 'showTooltips', value)}
                    label="Dicas de Ferramentas"
                    description="Mostrar tooltips explicativos"
                  />
                </div>
              </div>
            </SettingCard>

            {/* Notification Settings */}
            <SettingCard icon={Bell} title="Notificações">
              <div className="space-y-2">
                <ToggleSwitch
                  checked={settings.notifications.email}
                  onChange={(value) => handleSettingChange('notifications', 'email', value)}
                  label="Notificações por Email"
                  description="Receber alertas por email"
                />
                <ToggleSwitch
                  checked={settings.notifications.browser}
                  onChange={(value) => handleSettingChange('notifications', 'browser', value)}
                  label="Notificações do Navegador"
                  description="Alertas no navegador"
                />
                <ToggleSwitch
                  checked={settings.notifications.lowGrades}
                  onChange={(value) => handleSettingChange('notifications', 'lowGrades', value)}
                  label="Notas Baixas"
                  description="Alertar sobre notas abaixo da média"
                />
                <ToggleSwitch
                  checked={settings.notifications.attendance}
                  onChange={(value) => handleSettingChange('notifications', 'attendance', value)}
                  label="Frequência"
                  description="Alertar sobre baixa frequência"
                />
                <ToggleSwitch
                  checked={settings.notifications.newStudents}
                  onChange={(value) => handleSettingChange('notifications', 'newStudents', value)}
                  label="Novos Estudantes"
                  description="Notificar sobre novos cadastros"
                />
              </div>
            </SettingCard>

            {/* Data Management */}
            <SettingCard icon={Database} title="Gerenciamento de Dados">
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Formato de Exportação
                  </label>
                  <select
                    value={settings.data.exportFormat}
                    onChange={(e) => handleSettingChange('data', 'exportFormat', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="csv">CSV</option>
                    <option value="xlsx">Excel (XLSX)</option>
                    <option value="pdf">PDF</option>
                    <option value="json">JSON</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Retenção de Dados (dias)
                  </label>
                  <input
                    type="number"
                    value={settings.data.retentionDays}
                    onChange={(e) => handleSettingChange('data', 'retentionDays', parseInt(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    min="30"
                    max="3650"
                  />
                </div>

                <ToggleSwitch
                  checked={settings.data.autoBackup}
                  onChange={(value) => handleSettingChange('data', 'autoBackup', value)}
                  label="Backup Automático"
                  description="Fazer backup dos dados automaticamente"
                />
              </div>
            </SettingCard>

            {/* Privacy Settings */}
            <SettingCard icon={Shield} title="Privacidade">
              <div className="space-y-2">
                <ToggleSwitch
                  checked={settings.privacy.analytics}
                  onChange={(value) => handleSettingChange('privacy', 'analytics', value)}
                  label="Analytics"
                  description="Permitir coleta de dados de uso"
                />
                <ToggleSwitch
                  checked={settings.privacy.errorReporting}
                  onChange={(value) => handleSettingChange('privacy', 'errorReporting', value)}
                  label="Relatório de Erros"
                  description="Enviar relatórios de erro automaticamente"
                />
                <ToggleSwitch
                  checked={settings.privacy.shareUsage}
                  onChange={(value) => handleSettingChange('privacy', 'shareUsage', value)}
                  label="Compartilhar Dados de Uso"
                  description="Ajudar a melhorar o SINA"
                />
              </div>
            </SettingCard>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={resetSettings}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <RotateCcw className="h-4 w-4" />
              <span>Restaurar Padrão</span>
            </button>

            <button
              onClick={saveSettings}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Salvar Configurações</span>
            </button>
          </div>

          {/* System Info */}
          <div className={`rounded-xl shadow-sm overflow-hidden ${
            theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className={`px-6 py-4 border-b ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Informações do Sistema
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Versão
                  </div>
                  <div className={`font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    SINA v1.0.0
                  </div>
                </div>
                <div>
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Última Atualização
                  </div>
                  <div className={`font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {new Date().toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <div>
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Navegador
                  </div>
                  <div className={`font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {navigator.userAgent.split(' ')[0]}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
