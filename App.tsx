
import React, { useState, useCallback, useEffect } from 'react';
import { LiveMapView } from './components/LiveMapView';
import { ScheduleOptimizerView } from './components/ScheduleOptimizerView';
import { ScenarioSimulatorView } from './components/ScenarioSimulatorView';
import { PerformanceAnalyticsView } from './components/PerformanceAnalyticsView';
import { LoginView } from './components/LoginView';
import { TrainIcon, ChartBarIcon, SettingsIcon, MapIcon, BoltIcon, LogoutIcon, MenuIcon } from './constants';
import { ThemeToggle } from './components/common/ThemeToggle';
import { useLocalization } from './context/LocalizationContext';
import { NotificationSystem } from './components/common/NotificationSystem';

type View = 'LIVE_MAP' | 'OPTIMIZER' | 'SIMULATOR' | 'ANALYTICS';


// FIX: Replaced JSX.Element with React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
const NavItem: React.FC<{ icon: React.ReactElement; label: string; isActive: boolean; onClick: () => void }> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-base font-medium transition-colors duration-200 ${
      isActive
        ? 'bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white'
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
    }`}
  >
    {icon}
    <span className="ml-4">{label}</span>
  </button>
);

export default function App() {
  const { t, language, setLanguage, availableLanguages } = useLocalization();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState<View>('LIVE_MAP');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme');
      if (storedTheme === 'light' || storedTheme === 'dark') {
        return storedTheme;
      }
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  const viewConfig: Record<View, { label: string; icon: React.ReactElement }> = {
    'LIVE_MAP': { label: t('liveMap'), icon: <MapIcon className="h-6 w-6" /> },
    'OPTIMIZER': { label: t('optimizer'), icon: <TrainIcon className="h-6 w-6" /> },
    'SIMULATOR': { label: t('simulator'), icon: <SettingsIcon className="h-6 w-6" /> },
    'ANALYTICS': { label: t('analytics'), icon: <ChartBarIcon className="h-6 w-6" /> },
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const renderView = useCallback(() => {
    switch (activeView) {
      case 'LIVE_MAP':
        return <LiveMapView />;
      case 'OPTIMIZER':
        return <ScheduleOptimizerView />;
      case 'SIMULATOR':
        return <ScenarioSimulatorView />;
      case 'ANALYTICS':
        return <PerformanceAnalyticsView theme={theme} />;
      default:
        return <LiveMapView />;
    }
  }, [activeView, theme]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
  }

  const handleNavClick = (view: View) => {
    setActiveView(view);
    setIsSidebarOpen(false); // Close sidebar on mobile after navigation
  };


  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <>
    <NotificationSystem />
    <div className="relative min-h-screen md:flex bg-gray-100 dark:bg-gray-900 font-sans transition-colors duration-300">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside className={`w-64 bg-gray-200 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700 flex flex-col transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 fixed inset-y-0 left-0 z-30`}>
        <div className="h-16 flex items-center justify-center px-4 border-b border-gray-300 dark:border-gray-700 flex-shrink-0">
          <BoltIcon className="h-8 w-8 text-cyan-500 dark:text-cyan-400" />
          <h1 className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">🚈RailNexus</h1>
        </div>
        <nav className="flex-1 mt-6 overflow-y-auto">
          {Object.entries(viewConfig).map(([viewId, { label, icon }]) => (
            <NavItem
              key={viewId}
              icon={icon}
              label={label}
              isActive={activeView === viewId}
              onClick={() => handleNavClick(viewId as View)}
            />
          ))}
        </nav>
        <div className="py-2">
           <div className="p-4 border-t border-gray-300 dark:border-gray-700">
             <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                <p>{t('controller')}: S. K. Sharma</p>
                <p>{t('section')}: KMM - HYD</p>
             </div>
           </div>
           <div className="px-4 pb-4 border-t border-gray-300 dark:border-gray-700 pt-4">
              <div className="flex items-center justify-between gap-2">
                <label htmlFor="language-select" className="text-base font-medium text-gray-600 dark:text-gray-400">{t('language')}</label>
                <select
                  id="language-select"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-base p-1 focus:ring-cyan-500 focus:border-cyan-500 flex-1 min-w-0"
                >
                  {Object.entries(availableLanguages).map(([code, name]) => (
                    <option key={code} value={code}>{name}</option>
                  ))}
                </select>
              </div>
           </div>
          <div className="p-4 border-t border-gray-300 dark:border-gray-700">
             <div className="mb-4">
                <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
             </div>
             <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-base font-medium text-gray-600 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-800/50 hover:text-red-700 dark:hover:text-white rounded-md transition-colors duration-200"
              >
                <LogoutIcon className="h-6 w-6" />
                <span className="ml-4">{t('logout')}</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen">
        <header className="md:hidden sticky top-0 bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur-sm z-10 flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700">
          <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600 dark:text-gray-300" aria-label="Open sidebar">
            <MenuIcon className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate">
            {viewConfig[activeView].label}
          </h1>
          <div className="w-6"></div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {renderView()}
        </div>
      </main>
    </div>
    </>
  );
}