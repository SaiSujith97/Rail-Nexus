

import React, { useState } from 'react';
import { simulateScenario } from '../services/geminiService';
import { MOCK_TRAINS } from '../constants';
import { Train, OptimizedSchedule, ScenarioType, ScheduleEntry } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { LoadingSpinner } from './common/LoadingSpinner';
import { SettingsIcon } from '../constants';
import { useLocalization } from '../context/LocalizationContext';

const ScenarioResult: React.FC<{ result: OptimizedSchedule, t: any }> = ({ result, t }) => (
    <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className={`p-3 rounded-lg ${result.metrics.totalDelayReduced > 0 ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
                <p className="text-base text-gray-500 dark:text-gray-400">{t('delayImpact')}</p>
                <p className={`text-3xl font-bold ${result.metrics.totalDelayReduced > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {result.metrics.totalDelayReduced > 0 ? '-' : '+'}
                    {Math.abs(result.metrics.totalDelayReduced)} min
                </p>
            </div>
            <div className="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg">
                <p className="text-base text-gray-500 dark:text-gray-400">{t('newAvgSpeed')}</p>
                <p className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">{result.metrics.averageTrainSpeed} km/h</p>
            </div>
            <div className={`p-3 rounded-lg ${result.metrics.throughputIncrease > 0 ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
                <p className="text-base text-gray-500 dark:text-gray-400">{t('throughputImpact')}</p>
                <p className={`text-3xl font-bold ${result.metrics.throughputIncrease > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                   {result.metrics.throughputIncrease > 0 ? '+' : ''}{result.metrics.throughputIncrease}%
                </p>
            </div>
        </div>
        <div>
            <h4 className="font-semibold mb-2 text-lg text-gray-900 dark:text-white">{t('mitigationPlan')}</h4>
            <div className="overflow-x-auto">
                <table className="w-full text-base text-left text-gray-600 dark:text-gray-300">
                    <thead className="text-sm text-gray-500 dark:text-gray-400 uppercase bg-gray-200 dark:bg-gray-700">
                        <tr>
                            <th className="px-4 py-3">{t('scheduleTableTrainId')}</th>
                            <th className="px-4 py-3">{t('scheduleTableAction')}</th>
                            <th className="px-4 py-3">{t('scheduleTableStation')}</th>
                            <th className="px-4 py-3 text-center">{t('scheduleTableTrack')}</th>
                            <th className="px-4 py-3">{t('scheduleTableReason')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {result.entries.map((entry, index) => (
                            <tr key={index} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <td className="px-4 py-2 font-medium">{entry.trainId}</td>
                                <td className="px-4 py-2">{entry.action}</td>
                                <td className="px-4 py-2">{entry.stationId}</td>
                                <td className="px-4 py-2 text-center">
                                    {entry.recommendedTrack ? (
                                        <span className="font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-900/50 px-2 py-1 rounded-md text-sm">{entry.recommendedTrack}</span>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </td>
                                <td className="px-4 py-2 text-yellow-600 dark:text-yellow-300">{entry.reason}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);


export const ScenarioSimulatorView: React.FC = () => {
  const { t, language } = useLocalization();
  const [trains] = useState<Train[]>(MOCK_TRAINS);
  const [scenarioType, setScenarioType] = useState<ScenarioType>(ScenarioType.TrainDelay);
  const [details, setDetails] = useState<Record<string, any>>({ trainId: '12728', delay: 30 });
  const [simulationResult, setSimulationResult] = useState<OptimizedSchedule | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSimulate = async () => {
    setIsLoading(true);
    setSimulationResult(null);
    const result = await simulateScenario(trains, scenarioType, details, language);
    setSimulationResult(result);
    setIsLoading(false);
  };
  
  const getTranslatedScenarioType = (type: ScenarioType) => {
      const key = `scenarioType_${type.replace(/\s+/g, '')}`;
      return t(key as any);
  }

  const renderDetailsForm = () => {
    switch (scenarioType) {
      case ScenarioType.TrainDelay:
        return (
          <>
            <div className="col-span-1">
              <label htmlFor="trainId" className="block text-base font-medium text-gray-500 dark:text-gray-300">{t('scenarioTrain')}</label>
              <select id="trainId" value={details.trainId || trains[0].id} onChange={(e) => setDetails({ ...details, trainId: e.target.value })} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-base p-2">
                {trains.map(t => <option key={t.id} value={t.id}>{t.id} - {t.name}</option>)}
              </select>
            </div>
            <div className="col-span-1">
              <label htmlFor="delay" className="block text-base font-medium text-gray-500 dark:text-gray-300">{t('scenarioDelay')}</label>
              <input type="number" id="delay" value={details.delay || 30} onChange={(e) => setDetails({ ...details, delay: parseInt(e.target.value) })} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-base p-2" />
            </div>
          </>
        );
      case ScenarioType.SignalFailure:
        return (
             <div className="col-span-1 sm:col-span-2">
              <label htmlFor="location" className="block text-base font-medium text-gray-500 dark:text-gray-300">{t('scenarioLocation')}</label>
              <input type="text" id="location" value={details.location || ''} onChange={(e) => setDetails({ ...details, location: e.target.value })} placeholder="e.g., Signal DKDE-04" className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-base p-2" />
            </div>
        )
      default:
        return <p className="col-span-1 sm:col-span-2 text-gray-400">Configuration for this scenario is not yet implemented.</p>
    }
  }

  return (
    <div className="p-4 md:p-6 h-full flex flex-col gap-4 md:gap-6">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{t('simulatorTitle')}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 flex-grow">
        <Card title={t('defineScenario')}>
            <div className="space-y-4">
                <div>
                    <label htmlFor="scenarioType" className="block text-base font-medium text-gray-500 dark:text-gray-300">{t('scenarioType')}</label>
                    <select id="scenarioType" value={scenarioType} onChange={(e) => { setScenarioType(e.target.value as ScenarioType); setDetails(e.target.value === ScenarioType.TrainDelay ? { trainId: '12728', delay: 30 } : {}); }} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-base p-2">
                       {Object.values(ScenarioType).map(s => <option key={s} value={s}>{getTranslatedScenarioType(s)}</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {renderDetailsForm()}
                </div>
                 <Button onClick={handleSimulate} isLoading={isLoading} icon={<SettingsIcon className="h-5 w-5"/>}>
                    {isLoading ? t('simulating') : t('runSimulation')}
                </Button>
            </div>
        </Card>
        <Card title={t('simulationImpact')}>
            {isLoading && (
                <div className="flex items-center justify-center h-full">
                    <LoadingSpinner text={t('simulatingScenario')} />
                </div>
            )}
            {simulationResult && !isLoading && (
                <ScenarioResult result={simulationResult} t={t} />
            )}
            {!simulationResult && !isLoading && (
                <div className="flex items-center justify-center h-full text-center text-gray-500">
                    <p className="text-lg">{t('simulationPrompt')}</p>
                </div>
            )}
        </Card>
      </div>
    </div>
  );
};