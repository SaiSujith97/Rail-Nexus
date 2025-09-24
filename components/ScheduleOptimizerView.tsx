

import React, { useState } from 'react';
import { getOptimizedSchedule, getExplanationForDecision } from '../services/geminiService';
import { MOCK_TRAINS } from '../constants';
import { Train, Conflict, OptimizedSchedule, ScheduleEntry } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { LoadingSpinner } from './common/LoadingSpinner';
import { BoltIcon, WarningSignIcon, InfoIcon } from '../constants';
import { Modal } from './common/Modal';
import { useLocalization } from '../context/LocalizationContext';


const initialConflicts: Conflict[] = [
    { id: 'C1', type: 'Crossing', involvedTrains: ['12604', '12728'], location: 'Near Jangaon', description: 'Two high-priority trains scheduled to cross on a single line section.', violatedRule: 'Violation: Minimum headway on single-line section.' },
    { id: 'C2', type: 'Platform', involvedTrains: ['FREIGHT-01', '07462'], location: 'Warangal Station', description: 'Freight train occupying platform needed for local MEMU.', violatedRule: 'Violation: Platform occupancy rules.'}
];

const ScheduleTable: React.FC<{ entries: ScheduleEntry[], onShowExplanation: (entry: ScheduleEntry) => void, t: any }> = ({ entries, onShowExplanation, t }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-base text-left text-gray-600 dark:text-gray-300">
            <thead className="text-sm text-gray-500 dark:text-gray-400 uppercase bg-gray-200 dark:bg-gray-700">
                <tr>
                    <th scope="col" className="px-4 py-3">{t('scheduleTableTrainId')}</th>
                    <th scope="col" className="px-4 py-3">{t('scheduleTableStation')}</th>
                    <th scope="col" className="px-4 py-3">{t('scheduleTableAction')}</th>
                    <th scope="col" className="px-4 py-3 text-center">{t('scheduleTableTrack')}</th>
                    <th scope="col" className="px-4 py-3">{t('scheduleTableTime')}</th>
                    <th scope="col" className="px-4 py-3">{t('scheduleTableReason')}</th>
                    <th scope="col" className="px-4 py-3"></th>
                </tr>
            </thead>
            <tbody>
                {entries.map((entry) => (
                    <tr key={`${entry.trainId}-${entry.stationId}`} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">{entry.trainId}</td>
                        <td className="px-4 py-2">{entry.stationId}</td>
                        <td className="px-4 py-2">
                            <span className={`px-2 py-1 text-sm rounded-full ${entry.action === 'HALT' ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300'}`}>
                                {entry.action}
                            </span>
                        </td>
                        <td className="px-4 py-2 text-center">
                            {entry.recommendedTrack ? (
                                <span className="font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-900/50 px-2 py-1 rounded-md text-sm">{entry.recommendedTrack}</span>
                            ) : (
                                <span className="text-gray-400">-</span>
                            )}
                        </td>
                        <td className="px-4 py-2">{new Date(entry.estimatedTime).toLocaleTimeString()}</td>
                        <td className="px-4 py-2">{entry.reason || t('standardProcedure')}</td>
                        <td className="px-4 py-2 text-center">
                            <button onClick={() => onShowExplanation(entry)} className="text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400" aria-label={t('showExplanation')}>
                                <InfoIcon className="h-5 w-5"/>
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export const ScheduleOptimizerView: React.FC = () => {
  const { t, language } = useLocalization();
  const [trains] = useState<Train[]>(MOCK_TRAINS);
  const [conflicts] = useState<Conflict[]>(initialConflicts);
  const [optimizedSchedule, setOptimizedSchedule] = useState<OptimizedSchedule | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);
  const [explanation, setExplanation] = useState<string>('');
  const [isExplanationLoading, setIsExplanationLoading] = useState(false);


  const handleOptimize = async () => {
    setIsLoading(true);
    setOptimizedSchedule(null);
    const result = await getOptimizedSchedule(trains, conflicts, language);
    setOptimizedSchedule(result);
    setIsLoading(false);
  };
  
  const handleShowExplanation = async (entry: ScheduleEntry) => {
      setIsExplanationLoading(true);
      setIsExplanationOpen(true);
      const context = `Schedule entry for ${entry.trainId} at ${entry.stationId} to ${entry.action}. Reason: ${entry.reason}`;
      const result = await getExplanationForDecision(context, language);
      setExplanation(result);
      setIsExplanationLoading(false);
  };

  return (
    <div className="p-4 md:p-6 h-full flex flex-col gap-4 md:gap-6">
      <Modal isOpen={isExplanationOpen} onClose={() => setIsExplanationOpen(false)} title={t('aiReasoning')}>
            {isExplanationLoading ? <div className="flex justify-center items-center h-24"><LoadingSpinner text={t('analyzing')}/></div> : <p className="text-base whitespace-pre-wrap">{explanation}</p>}
      </Modal>

      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{t('optimizerTitle')}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 flex-grow">
        <div className="lg:col-span-1 flex flex-col gap-6">
            <Card title={t('currentConflicts')}>
                {conflicts.length > 0 ? (
                    <ul className="space-y-3">
                        {conflicts.map(c => (
                            <li key={c.id} className="text-base p-3 bg-red-100 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-md">
                                <p className="font-semibold text-red-800 dark:text-red-100">{c.type} Conflict at {c.location}</p>
                                <p className="text-red-700 dark:text-gray-300">{c.description}</p>
                                <p className="text-sm text-red-600 dark:text-gray-400 mt-1">Involves: {c.involvedTrains.join(', ')}</p>
                                <div className="mt-2 pt-2 border-t border-red-200 dark:border-red-700/50 flex items-center text-yellow-600 dark:text-yellow-300">
                                    <WarningSignIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                                    <span className="text-sm font-medium">{c.violatedRule}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400">{t('noConflicts')}</p>
                )}
            </Card>
            <Card title={t('optimizationControl')}>
                <p className="text-base text-gray-400 dark:text-gray-300 mb-4">
                    {t('optimizationDesc')}
                </p>
                <Button onClick={handleOptimize} isLoading={isLoading} icon={<BoltIcon className="h-5 w-5"/>}>
                    {isLoading ? t('optimizing') : t('runOptimization')}
                </Button>
            </Card>
        </div>
        <div className="lg:col-span-2">
            <Card title={t('optimizedSchedule')} className="h-full flex flex-col">
                {isLoading && (
                    <div className="flex items-center justify-center h-full">
                        <LoadingSpinner text={t('optimizing')} />
                    </div>
                )}
                {optimizedSchedule && !isLoading && (
                    <div className="flex flex-col flex-grow space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                            <div className="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg">
                                <p className="text-base text-gray-500 dark:text-gray-400">{t('delayReduced')}</p>
                                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{optimizedSchedule.metrics.totalDelayReduced} min</p>
                            </div>
                            <div className="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg">
                                <p className="text-base text-gray-500 dark:text-gray-400">{t('avgSpeed')}</p>
                                <p className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">{optimizedSchedule.metrics.averageTrainSpeed} km/h</p>
                            </div>
                            <div className="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg">
                                <p className="text-base text-gray-500 dark:text-gray-400">{t('throughput')}</p>
                                <p className="text-3xl font-bold text-green-600 dark:text-green-400">+{optimizedSchedule.metrics.throughputIncrease}%</p>
                            </div>
                        </div>
                        <div className="flex-grow">
                           <ScheduleTable entries={optimizedSchedule.entries} onShowExplanation={handleShowExplanation} t={t} />
                        </div>
                        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                            <Button variant="secondary">{t('manualAdjustment')}</Button>
                            <Button variant="primary">{t('applyFullSchedule')}</Button>
                        </div>
                    </div>
                )}
                {!optimizedSchedule && !isLoading && (
                    <div className="flex items-center justify-center h-full text-center text-gray-400">
                        <p className="text-lg">{t('optimizerPrompt')}</p>
                    </div>
                )}
            </Card>
        </div>
      </div>
    </div>
  );
};