import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Eye, EyeOff, User, Lock, Moon, Sun } from 'lucide-react';
import SinaLogo from '../components/ui/SinaLogo';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(username, password);
      if (result.success) {
        if (rememberMe) {
          localStorage.setItem('sina-remember-me', 'true');
        }
        navigate(from, { replace: true });
      } else {
        setError(result.error || t('login-error'));
      }
    } catch (err) {
      setError(t('login-error'));
    } finally {
      setIsLoading(false);
    }
  };

  const fillDefaultCredentials = () => {
    setUsername('professor');
    setPassword('professor');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-blue-100'
    }`}>
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 flex space-x-2">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg transition-all duration-200 ${
            theme === 'dark'
              ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400'
              : 'bg-white hover:bg-gray-50 text-gray-600 shadow-sm'
          }`}
          title={t('switch-theme')}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>

      <div className="max-w-md w-full space-y-8">
        <div>
          {/* Logo */}
          <div className="mx-auto flex items-center justify-center">
            <SinaLogo size="xlarge" />
          </div>
          
          <h2 className={`mt-6 text-center text-3xl font-extrabold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {t('login-title')}
          </h2>
          
          <p className={`mt-2 text-center text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {t('login-subtitle')}
          </p>
          
          {/* Default Credentials Helper */}
          <div className={`mt-4 p-3 rounded-lg text-center text-xs ${
            theme === 'dark'
              ? 'bg-gray-800 text-gray-400 border border-gray-700'
              : 'bg-blue-50 text-blue-600 border border-blue-200'
          }`}>
            <p className="mb-1">Credenciais padrão:</p>
            <button
              onClick={fillDefaultCredentials}
              className={`font-mono underline hover:no-underline ${
                theme === 'dark' ? 'hover:text-gray-300' : 'hover:text-blue-800'
              }`}
            >
              professor / professor
            </button>
          </div>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="sr-only">
                {t('username')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className={`h-5 w-5 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
                  }`} />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`appearance-none relative block w-full pl-10 pr-3 py-3 border rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white focus:bg-gray-700'
                      : 'bg-white border-gray-300 text-gray-900 focus:bg-gray-50'
                  }`}
                  placeholder={t('username')}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="sr-only">
                {t('password')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
                  }`} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`appearance-none relative block w-full pl-10 pr-10 py-3 border rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white focus:bg-gray-700'
                      : 'bg-white border-gray-300 text-gray-900 focus:bg-gray-50'
                  }`}
                  placeholder={t('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className={`h-5 w-5 ${
                      theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                    }`} />
                  ) : (
                    <Eye className={`h-5 w-5 ${
                      theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                    }`} />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className={`ml-2 block text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-900'
              }`}>
                {t('remember-me')}
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className={`font-medium hover:underline ${
                theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
              }`}>
                {t('forgot-password')}
              </a>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`p-3 rounded-lg text-sm ${
              theme === 'dark'
                ? 'bg-red-900/50 text-red-300 border border-red-800'
                : 'bg-red-50 text-red-600 border border-red-200'
            }`}>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('loading')}
                </div>
              ) : (
                t('login-button')
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className={`text-center text-xs ${
          theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
        }`}>
          <p>SINA - Sistema Inteligente de Notas Acadêmicas</p>
          <p className="mt-1">© 2024 - Todos os direitos reservados</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 