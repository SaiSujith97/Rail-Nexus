
import React, { useState, useEffect } from 'react';
import { MOCK_STATIONS, BoltIcon, WarningSignIcon, InfoIcon, RobotIcon, UserIcon, SystemIcon, AuditLogIcon, ArrowRightIcon } from '../constants';
import { Train, TrainType, TrainStatus, Conflict, Station, LogEntry, LogType } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { resolveConflict, getExplanationForDecision } from '../services/geminiService';
import { Modal } from './common/Modal';
import { LoadingSpinner } from './common/LoadingSpinner';
import { useLocalization } from '../context/LocalizationContext';
import { useNotification, NotificationType } from '../../context/NotificationContext';

const LIVE_MAP_TRAINS: Train[] = [
  // Scenario 1: Rear-end collision risk on Track 1
  { id: '12759', name: 'Charminar Exp', type: TrainType.Express, priority: 1, speed: 90, position: 10, direction: 'DOWN', trackNumber: 1, status: TrainStatus.OnTime, delay: 0, nextStation: 'WL' },
  { id: 'FREIGHT-01', name: 'Container Goods', type: TrainType.Freight, priority: 5, speed: 45, position: 30, direction: 'DOWN', trackNumber: 1, status: TrainStatus.OnTime, delay: 0, nextStation: 'BG' },
  
  // Scenario 2: Head-on collision risk on Track 4 (Logically corrected)
  { id: '12806', name: 'Janmabhoomi Exp', type: TrainType.Express, priority: 2, speed: 80, position: 25, direction: 'DOWN', trackNumber: 4, status: TrainStatus.OnTime, delay: 0, nextStation: 'ZN' },
  { id: 'FREIGHT-02', name: 'Cement Wagon', type: TrainType.Freight, priority: 4, speed: 50, position: 80, direction: 'UP', trackNumber: 4, status: TrainStatus.OnTime, delay: 0, nextStation: 'BG' },

  // Other trains on different tracks
  { id: '07462', name: 'W-H MEMU', type: TrainType.Local, priority: 3, speed: 70, position: 40, direction: 'DOWN', trackNumber: 2, status: TrainStatus.OnTime, delay: 0, nextStation: 'ZN' },
  { id: '12728', name: 'Godavari Exp', type: TrainType.Express, priority: 2, speed: 85, position: 95, direction: 'UP', trackNumber: 6, status: TrainStatus.OnTime, delay: 0, nextStation: 'GK' },
  { id: '07758', name: 'SC-WL MEMU', type: TrainType.Local, priority: 3, speed: 75, position: 65, direction: 'UP', trackNumber: 5, status: TrainStatus.OnTime, delay: 0, nextStation: 'BG' },
];

const TRACK_CONFIG: Record<string, { label: string }> = {
    '1': { label: 'DOWN Main Line' },
    '2': { label: 'DOWN Slow Line' },
    '3': { label: 'DOWN Goods Line' },
    '4': { label: 'UP Goods Line' },
    '5': { label: 'UP Slow Line' },
    '6': { label: 'UP Main Line' },
};

// Extends the base Train type with simulation-specific properties
type SimTrain = Train & {
  isHalted: boolean;
  haltTimer: number;
};


// --- MAP COMPONENTS --- //

const TrainMarker: React.FC<{ train: SimTrain; onClick: (train: Train) => void; isConflicting: boolean; isSelected: boolean; t: any }> = ({ train, onClick, isConflicting, isSelected, t }) => {
  const getTrainColorClasses = () => {
    switch (train.type) {
      case TrainType.Express: return 'bg-red-500';
      case TrainType.Local: return 'bg-blue-500';
      case TrainType.Freight: return 'bg-slate-500';
      case TrainType.Maintenance: return 'bg-yellow-500';
      default: return 'bg-purple-500';
    }
  };

  return (
    <div
      className="absolute top-1/2 -translate-y-1/2 h-6 w-24 cursor-pointer group"
      style={{
        left: `${train.position}%`,
        transform: `translateX(-50%)`,
        transition: 'left 150ms linear',
      }}
      onClick={() => onClick(train)}
    >
       {train.isHalted && (
        <div 
          className="absolute -top-5 left-1/2 -translate-x-1/2 bg-yellow-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-md"
        >
          H
        </div>
      )}
      <div className={`relative w-full h-full rounded-full flex items-center justify-center text-white text-xs shadow-md transition-all duration-300 ${getTrainColorClasses()} ${isSelected ? 'ring-2 ring-offset-2 ring-cyan-400 dark:ring-offset-gray-900' : ''}`}>
        <div className={`flex items-center ${train.direction === 'UP' ? 'flex-row-reverse' : ''}`}>
            <span className="mx-1 font-semibold">{train.id}</span>
            <ArrowRightIcon className={`h-3 w-3 transition-transform ${train.direction === 'UP' ? 'rotate-180' : ''}`} />
        </div>
        {isConflicting && <div className="absolute -inset-1 rounded-full border-2 border-red-500 animate-pulse"></div>}
      </div>
      
      <div role="tooltip"
        style={{ transform: `translateX(-50%)` }}
        className="absolute -top-7 left-1/2 bg-gray-900/80 backdrop-blur-sm text-white dark:bg-gray-800/80 dark:text-gray-100 text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 text-left whitespace-nowrap"
      >
        <p className="font-bold">{train.id} - {train.name}</p>
        <p>{t('tooltipStatus')}: {train.status} ({train.delay > 0 ? t('tooltipDelay', { delay: train.delay }) : t('tooltipOnTime')})</p>
        {isConflicting && <p className="text-red-400 font-bold mt-1">{t('tooltipConflict')}</p>}
      </div>
    </div>
  );
};

const Track: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => {
  return (
    <div className="relative h-12">
      <div className="absolute top-1/2 -translate-y-1/2 w-full h-8 ">
        <div className="absolute top-[calc(50%-1px)] left-0 w-full h-[2px] bg-slate-400/30 dark:bg-slate-600/50 rounded-full" />
      </div>
      <div className="absolute left-4 text-sm font-mono text-slate-500 dark:text-gray-400 uppercase top-[-8px]">{label}</div>
      {children}
    </div>
  );
};

const StationMarker: React.FC<{ station: Station }> = ({ station }) => (
    <div className="absolute top-0 bottom-0 z-0 flex flex-col items-center pointer-events-none" style={{ left: `${station.position}%`, transform: 'translateX(-50%)' }}>
      <div className="absolute top-0 bottom-0 w-20 bg-slate-200/50 dark:bg-gray-700/40 rounded-lg"></div>
      <div className="w-px h-full bg-slate-400/50 dark:bg-gray-600/50"></div>
      <div className="absolute -top-1 bg-white dark:bg-gray-900 px-3 py-1 rounded-md shadow-lg border border-gray-300 dark:border-gray-700 z-10">
        <p className="text-sm font-bold text-gray-800 dark:text-white whitespace-nowrap">{station.name}</p>
      </div>
    </div>
);


const LogIcon: React.FC<{type: LogType}> = ({ type }) => {
    switch (type) {
        case LogType.AI: return <RobotIcon className="h-5 w-5 text-cyan-500" />;
        case LogType.Manual:
        case LogType.Override: return <UserIcon className="h-5 w-5 text-yellow-500" />;
        case LogType.System: return <SystemIcon className="h-5 w-5 text-gray-500" />;
        default: return null;
    }
}

export const LiveMapView: React.FC = () => {
  const { t, language } = useLocalization();
  const { addNotification } = useNotification();
  const [trains, setTrains] = useState<SimTrain[]>(
    LIVE_MAP_TRAINS.map(t => ({ ...t, isHalted: false, haltTimer: 0 }))
  );
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(trains[0]);
  const [time, setTime] = useState(new Date());
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [selectedConflict, setSelectedConflict] = useState<Conflict | null>(null);
  const [isResolvingConflict, setIsResolvingConflict] = useState(false);
  const [resolutionSuggestion, setResolutionSuggestion] = useState<string | null>(null);
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);
  const [explanation, setExplanation] = useState<string>('');
  const [isExplanationLoading, setIsExplanationLoading] = useState(false);
  
  const MOCK_LOGS: LogEntry[] = [
    { id: 'L1', timestamp: new Date(Date.now() - 2 * 60000).toISOString(), type: LogType.System, actor: 'System', message: t('logSystemInit') },
    { id: 'L2', timestamp: new Date(Date.now() - 1 * 60000).toISOString(), type: LogType.AI, actor: 'Conflict Detector', message: t('logNoConflicts') },
    { id: 'L3', timestamp: new Date().toISOString(), type: LogType.Manual, actor: 'S. K. Sharma', message: t('logViewedTrain', {id: '12759'}) }
  ];
  
  const [auditLog, setAuditLog] = useState<LogEntry[]>(MOCK_LOGS);

  // --- TRAIN MOVEMENT AND COLLISION PREDICTION --- //
  useEffect(() => {
    const SIMULATION_INTERVAL = 150; // ms per update
    const HALT_DURATION_TICKS = 60; // 60 ticks * 150ms = 9 seconds halt time
    const SIMULATION_SPEED_FACTOR = 0.035;
    const PREDICTION_HORIZON_SECONDS = 90; // Predict conflicts up to 90 seconds in the future
    const PREDICTION_TICKS = (PREDICTION_HORIZON_SECONDS * 1000) / SIMULATION_INTERVAL;

    const getTickDistance = (train: SimTrain) => {
        if (train.isHalted) return 0;
        return (train.speed * SIMULATION_SPEED_FACTOR) * (SIMULATION_INTERVAL / 1000);
    }

    const intervalId = setInterval(() => {
      setTrains(currentTrains => {
        // 1. Calculate new train states (position, direction, halting)
        const nextTrains = currentTrains.map(train => {
          if (train.isHalted) {
            const newHaltTimer = train.haltTimer - 1;
            return newHaltTimer <= 0 ? { ...train, isHalted: false, haltTimer: 0 } : { ...train, haltTimer: newHaltTimer };
          }

          let shouldHalt = false;
          if (train.type === TrainType.Local) {
            for (const station of MOCK_STATIONS) {
              if (Math.abs(train.position - station.position) < 1) {
                shouldHalt = true;
                break;
              }
            }
          }
          if (shouldHalt) return { ...train, isHalted: true, haltTimer: HALT_DURATION_TICKS };

          const distance = getTickDistance(train);
          let newPosition = train.position;
          let newDirection = train.direction;

          if (train.direction === 'DOWN') {
            newPosition += distance;
            if (newPosition >= 100) { newPosition = 100; newDirection = 'UP'; }
          } else {
            newPosition -= distance;
            if (newPosition <= 0) { newPosition = 0; newDirection = 'DOWN'; }
          }
          return { ...train, position: newPosition, direction: newDirection };
        });

        // 2. Predict collisions based on current trajectories
        const newConflicts: Conflict[] = [];
        for (let i = 0; i < nextTrains.length; i++) {
          for (let j = i + 1; j < nextTrains.length; j++) {
            const trainA = nextTrains[i];
            const trainB = nextTrains[j];

            if (trainA.trackNumber !== trainB.trackNumber) continue;

            let ticksToCollision = Infinity;
            let conflictType: 'Head-on' | 'Rear-end' = 'Head-on';

            if (trainA.direction !== trainB.direction) {
              const distanceBetween = Math.abs(trainA.position - trainB.position);
              const closingSpeedPerTick = getTickDistance(trainA) + getTickDistance(trainB);
              if (closingSpeedPerTick > 0) {
                ticksToCollision = distanceBetween / closingSpeedPerTick;
                conflictType = 'Head-on';
              }
            } else {
              let chaser: SimTrain, leader: SimTrain;
              if (trainA.direction === 'DOWN') {
                [leader, chaser] = trainA.position > trainB.position ? [trainA, trainB] : [trainB, trainA];
              } else {
                [leader, chaser] = trainA.position < trainB.position ? [trainA, trainB] : [trainB, trainA];
              }
              const chaserSpeed = getTickDistance(chaser);
              const leaderSpeed = getTickDistance(leader);
              if (chaserSpeed > leaderSpeed) {
                const distanceBetween = Math.abs(leader.position - chaser.position);
                const closingSpeedPerTick = chaserSpeed - leaderSpeed;
                if (closingSpeedPerTick > 0) {
                  ticksToCollision = distanceBetween / closingSpeedPerTick;
                  conflictType = 'Rear-end';
                }
              }
            }

            if (ticksToCollision < PREDICTION_TICKS) {
              const timeToConflictSeconds = Math.round((ticksToCollision * SIMULATION_INTERVAL) / 1000);
              const conflictId = `CR-${[trainA.id, trainB.id].sort().join('-')}`;
              if (!newConflicts.some(c => c.id === conflictId)) {
                newConflicts.push({
                  id: conflictId, type: 'Collision Risk', involvedTrains: [trainA.id, trainB.id].sort(),
                  location: `Track ${trainA.trackNumber}`,
                  description: `Predicted ${conflictType.toLowerCase()} collision in approx. ${timeToConflictSeconds}s.`,
                  violatedRule: 'Predicted minimum safe distance violation.'
                });
              }
            }
          }
        }
        setConflicts(newConflicts);
        return nextTrains;
      });
    }, SIMULATION_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);


  // --- DEMO: Smart Alerts --- //
  useEffect(() => {
    const alertTypes: { key: string; params: any; type: NotificationType }[] = [
      { key: 'alert_delay', params: { trainId: '12723', minutes: 25, location: 'Vijayawada' }, type: 'warning' },
      { key: 'alert_platform_change', params: { trainId: '17210', platform: 3 }, type: 'info' },
      { key: 'alert_reroute', params: { trainId: '12025', location: 'Guntur' }, type: 'error' },
    ];

    const interval = setInterval(() => {
      const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
      addNotification(randomAlert.key, randomAlert.params, randomAlert.type);
    }, 15000);

    return () => clearInterval(interval);
  }, [addNotification]);
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const addLog = (entry: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const newLog: LogEntry = { ...entry, id: `L${auditLog.length + 1}`, timestamp: new Date().toISOString() };
    setAuditLog(prev => [newLog, ...prev]);
  };
  
  const handleTrainClick = (train: Train) => {
    setSelectedTrain(train);
    addLog({ type: LogType.Manual, actor: 'S. K. Sharma', message: t('logViewedTrain', {id: train.id}) });
  };

  const handleResolveConflict = async () => {
    if (!selectedConflict) return;
    setIsResolvingConflict(true);
    const suggestion = await resolveConflict(selectedConflict, trains, language);
    setResolutionSuggestion(suggestion);
    setIsResolvingConflict(false);
    addLog({ type: LogType.AI, actor: 'AI Assistant', message: t('logGeneratedResolution', {id: selectedConflict.id}) });
  };
  
  const handleShowExplanation = async () => {
      if (!selectedConflict) return;
      setIsExplanationLoading(true);
      setIsExplanationOpen(true);
      const result = await getExplanationForDecision(`Resolution for conflict ${selectedConflict.id} between ${selectedConflict.involvedTrains.join(' & ')}`, language);
      setExplanation(result);
      setIsExplanationLoading(false);
  }

  const handleSelectConflict = (conflict: Conflict) => {
    setSelectedConflict(conflict);
    const trainToSelect = trains.find(t => t.id === conflict.involvedTrains[0]);
    if (trainToSelect) {
      setSelectedTrain(trainToSelect);
    }
  };
  
  const handleCloseConflictModal = () => {
      setSelectedConflict(null);
      setResolutionSuggestion(null);
  }

  return (
    <div className="p-4 md:p-6 h-full flex flex-col gap-4 md:gap-6">
      <Modal isOpen={isExplanationOpen} onClose={() => setIsExplanationOpen(false)} title={t('aiReasoning')}>
            {isExplanationLoading ? <div className="flex justify-center items-center h-24"><LoadingSpinner text={t('analyzing')}/></div> : <p className="text-base whitespace-pre-wrap">{explanation}</p>}
      </Modal>

      <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2'>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center sm:text-left">{t('liveMapTitle')}</h2>
        <div className="text-lg md:text-xl font-mono bg-gray-200 dark:bg-gray-800 px-4 py-2 rounded-md text-cyan-600 dark:text-cyan-400 self-center sm:self-auto">{time.toLocaleTimeString()}</div>
      </div>
      
       <Card className="flex-grow flex flex-col relative overflow-hidden">
        <div className="relative flex-grow bg-slate-100 dark:bg-gray-900 p-4 pt-8">
            <div className="absolute inset-x-0 top-0 bottom-0">
                {MOCK_STATIONS.map(station => <StationMarker key={station.id} station={station} />)}
            </div>
            
            <div className="h-full flex flex-col justify-around z-10 relative">
                {Object.entries(TRACK_CONFIG).map(([trackNum, config]) => (
                    <Track key={trackNum} label={config.label}>
                        {trains.filter(t => t.trackNumber === parseInt(trackNum)).map(train => (
                            <TrainMarker 
                              key={train.id} 
                              train={train} 
                              onClick={handleTrainClick} 
                              isConflicting={conflicts.some(c => c.involvedTrains.includes(train.id))}
                              isSelected={selectedTrain?.id === train.id}
                              t={t}
                            />
                        ))}
                    </Track>
                ))}
            </div>
        </div>

        {selectedConflict && (
            <div className="absolute inset-0 bg-black/60 z-40 flex items-center justify-center p-4" onClick={handleCloseConflictModal}>
                <Card title={t('conflictAlertTitle', {type: selectedConflict.type})} className="w-full max-w-md shadow-2xl border-2 border-red-500" icon={<WarningSignIcon className="w-6 h-6" />} onClick={(e) => e.stopPropagation()}>
                    <div className="space-y-3 text-base">
                        <p><strong>{t('conflictDescription')}:</strong> {selectedConflict.description}</p>
                        <p><strong>{t('conflictLocation')}:</strong> {selectedConflict.location}</p>
                        <p><strong>{t('conflictInvolvedTrains')}:</strong> {selectedConflict.involvedTrains.join(', ')}</p>
                        <p className="mt-2 text-yellow-500 dark:text-yellow-400"><strong>{t('conflictViolatedRule')}:</strong> {selectedConflict.violatedRule}</p>
                    </div>
                    {(isResolvingConflict || resolutionSuggestion) ? (
                        <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                            <div className="flex justify-between items-center">
                                <h4 className="font-semibold text-base text-cyan-600 dark:text-cyan-400">{t('aiSuggestion')}</h4>
                                {!isResolvingConflict && resolutionSuggestion && (
                                    <button onClick={handleShowExplanation} className="text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400" aria-label={t('showExplanation')}><InfoIcon className="h-5 w-5"/></button>
                                )}
                            </div>
                            <div className="mt-2">
                               {isResolvingConflict && <p className="text-base text-gray-500 dark:text-gray-400">{t('analyzingConflict')}</p>}
                               {resolutionSuggestion && <p className="text-base text-gray-900 dark:text-gray-100">{resolutionSuggestion}</p>}
                            </div>
                        </div>
                    ) : (
                         <div className="mt-4 flex justify-end">
                            <Button variant="primary" onClick={handleResolveConflict} isLoading={isResolvingConflict} icon={<BoltIcon className="h-5 w-5" />}>{t('resolveWithAi')}</Button>
                         </div>
                    )}
                    {resolutionSuggestion && (
                        <div className="mt-4 flex items-center justify-end gap-3">
                            <Button variant="secondary" onClick={() => { addLog({type: LogType.Override, actor: 'S. K. Sharma', message: t('logManualOverride', {id: selectedConflict.id})}); handleCloseConflictModal();}}>{t('manualOverride')}</Button>
                            <Button variant="primary" onClick={() => { addLog({type: LogType.Manual, actor: 'S. K. Sharma', message: `Applied AI fix for conflict ${selectedConflict.id}.`}); handleCloseConflictModal();}}>{t('applyAiSuggestion')}</Button>
                        </div>
                    )}
                </Card>
            </div>
        )}
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <Card title={t('selectedTrainDetails')}>
          {selectedTrain ? (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base">
                <div><strong>{t('trainNo')}:</strong> {selectedTrain.id}</div>
                <div className="flex items-center"><strong className="mr-2">{t('trainType')}:</strong><span className={`px-2 py-0.5 text-sm rounded-full text-white ${'bg-' + {Express:'red-500',Local:'blue-500',Freight:'slate-500',Maintenance:'yellow-500',Special:'purple-500'}[selectedTrain.type]}`}>{t(`trainType_${selectedTrain.type}` as any)}</span></div>
                <div className="col-span-1 sm:col-span-2"><strong>{t('trainName')}:</strong> {selectedTrain.name}</div>
                <div><strong>{t('trainSpeed')}:</strong> {selectedTrain.speed} km/h</div>
                <div><strong>{t('trackLine')}:</strong> {selectedTrain.trackNumber} ({selectedTrain.direction})</div>
                <div><strong>{t('trainStatus')}:</strong> <span className={selectedTrain.status === TrainStatus.Delayed ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}>{t(`trainStatus_${selectedTrain.status.replace(/\s+/g, '')}` as any)}</span></div>
                <div><strong>{t('trainDelay')}:</strong> <span className={selectedTrain.delay > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}>{selectedTrain.delay} min</span></div>
                <div><strong>{t('nextStation')}:</strong> {selectedTrain.nextStation}</div>
                <div><strong>{t('priority')}:</strong> {selectedTrain.priority}</div>
              </div>
            </div>
          ) : (<p className="text-gray-400">{t('selectTrainPrompt')}</p>)}
        </Card>
        <Card title={t('conflictAlerts')} icon={<WarningSignIcon className="h-5 w-5"/>}>
          <div className="space-y-2 h-48 overflow-y-auto pr-2">
            {conflicts.length > 0 ? (
                conflicts.map(conflict => (
                    <button 
                        key={conflict.id}
                        onClick={() => handleSelectConflict(conflict)}
                        className="w-full text-left p-2 rounded-md bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-800/60 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        <p className="font-bold text-red-800 dark:text-red-200">{conflict.type}: {conflict.involvedTrains.join(' & ')}</p>
                        <p className="text-sm text-red-700 dark:text-red-400">{conflict.description}</p>
                    </button>
                ))
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400 dark:text-gray-500 text-center">{t('noActiveConflicts')}</p>
              </div>
            )}
          </div>
        </Card>
        <Card title={t('auditLog')} icon={<AuditLogIcon className="h-5 w-5"/>}>
            <ul className="space-y-3 h-48 overflow-y-auto text-base pr-2">
                {auditLog.map(log => (
                    <li key={log.id} className="flex items-start">
                        <div className="mr-3 pt-1"><LogIcon type={log.type} /></div>
                        <div>
                            <p className="text-gray-800 dark:text-gray-100 leading-tight">{log.message}</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500">{new Date(log.timestamp).toLocaleTimeString()} - {log.actor}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </Card>
      </div>
    </div>
  );
};
