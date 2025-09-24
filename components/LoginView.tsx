
import React, { useState } from 'react';
import { Button } from './common/Button';
import { LogoTrainIcon, ChartBarIcon, BoltIcon, WarningSignIcon, SettingsIcon, AccessIcon } from '../constants';
import { useLocalization } from '../context/LocalizationContext';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

// FIX: Replaced JSX.Element with React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
const FeatureCard: React.FC<{ icon: React.ReactElement; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-white/10">
        <div className="flex items-center mb-2">
            <div className="text-blue-400">{icon}</div>
            <h3 className="ml-3 font-bold text-white text-lg">{title}</h3>
        </div>
        <p className="text-base text-gray-400">{children}</p>
    </div>
);

const MetricItem: React.FC<{ value: string; label: string; valueColor: string }> = ({ value, label, valueColor }) => (
    <div>
        <p className={`text-4xl font-bold ${valueColor}`}>{value}</p>
        <p className="text-base text-gray-400">{label}</p>
    </div>
);


const AnimatedTrain = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 50" className="w-full h-auto" fill="currentColor">
        <path d="M195,20 H185 V10 H160 V20 H40 L30,10 H10 V40 H190 V30 H195 Z" />
        <rect x="10" y="40" width="180" height="5" />
        <circle cx="40" cy="45" r="5" />
        <circle cx="70" cy="45" r="5" />
        <circle cx="130" cy="45" r="5" />
        <circle cx="160" cy="45" r="5" />
    </svg>
);


export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const { t } = useLocalization();
  const [controllerId, setControllerId] = useState('spartans@gmail.com');
  const [password, setPassword] = useState('········');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    await new Promise(resolve => setTimeout(resolve, 1500));

    // For demonstration, login is always successful
    onLoginSuccess();
    
    setIsLoading(false);
  };

  return (
    <div className="login-background flex items-center justify-center min-h-screen font-sans p-4 text-white overflow-hidden">
        
        <div className="absolute bottom-[10%] right-0 w-[300px] h-auto z-0 opacity-10 text-white" style={{ animation: 'move-train 25s linear infinite' }}>
            <AnimatedTrain />
        </div>

        <main className="w-full max-w-7xl mx-auto z-10" style={{ animation: 'fade-in-scale 1s ease-out forwards' }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Left Side: Info */}
                <div className="space-y-8">
                    <div className="flex items-center">
                        <div className="bg-blue-600 p-2 rounded-lg">
                           <LogoTrainIcon className="h-10 w-10 text-white" />
                        </div>
                        <div className="ml-4">
                            <h1 className="text-5xl font-bold">{t('loginTitle')}</h1>
                            <p className="text-lg text-gray-300">{t('loginSubtitle')}</p>
                        </div>
                    </div>

                    <p className="text-xl text-gray-300 max-w-lg">
                        {t('loginDescription')}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FeatureCard icon={<ChartBarIcon className="h-5 w-5" />} title={t('featureLiveAnalytics')}>
                            {t('featureLiveAnalyticsDesc')}
                        </FeatureCard>
                        <FeatureCard icon={<BoltIcon className="h-5 w-5" />} title={t('featureAiOptimization')}>
                            {t('featureAiOptimizationDesc')}
                        </FeatureCard>
                        <FeatureCard icon={<WarningSignIcon className="h-5 w-5" />} title={t('featureDisruptionControl')}>
                            {t('featureDisruptionControlDesc')}
                        </FeatureCard>
                        <FeatureCard icon={<SettingsIcon className="h-5 w-5" />} title={t('featureSimulationTools')}>
                            {t('featureSimulationToolsDesc')}
                        </FeatureCard>
                    </div>

                    <div className="flex justify-between items-center bg-gray-900/50 p-4 rounded-lg border border-white/10 max-w-lg">
                       <MetricItem value="99.7%" label={t('metricUptime')} valueColor="text-green-400" />
                       <MetricItem value="847" label={t('metricActiveTrains')} valueColor="text-white" />
                       <MetricItem value="12.5" label={t('metricAvgDelay')} valueColor="text-yellow-400" />
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="w-full max-w-md mx-auto">
                    <div className="bg-white/95 backdrop-blur-sm text-gray-800 rounded-xl shadow-2xl p-8">
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold text-gray-900">{t('loginFormTitle')}</h2>
                                <p className="text-base text-gray-500 mt-1">{t('loginFormSubtitle')}</p>
                            </div>
                            
                            <div className="flex items-center justify-center text-base">
                                <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                                {t('systemOnline')}
                            </div>

                            <div>
                                <label htmlFor="controllerId" className="block text-base font-medium text-gray-600">{t('controllerId')}</label>
                                <input
                                    type="text"
                                    id="controllerId"
                                    value={controllerId}
                                    onChange={(e) => setControllerId(e.target.value)}
                                    className="mt-1 w-full p-3 bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                    disabled={isLoading}
                                />
                            </div>
                             <div>
                                <label htmlFor="password_code" className="block text-base font-medium text-gray-600">{t('authCode')}</label>
                                <input
                                    type="password"
                                    id="password_code"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 w-full p-3 bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                    disabled={isLoading}
                                />
                            </div>
                            {error && (
                                <p role="alert" className="text-base text-red-600 text-center">{error}</p>
                            )}
                            <Button type="submit" isLoading={isLoading} className="w-full !py-3 !text-lg !bg-blue-600 hover:!bg-blue-700 !focus:ring-blue-500" icon={<AccessIcon className="w-5 h-5"/>}>
                                {isLoading ? t('authenticating') : t('loginButton')}
                            </Button>
                        </form>
                    </div>
                </div>

            </div>
        </main>
    </div>
  );
};
