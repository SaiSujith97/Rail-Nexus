export enum TrainType {
  Express = 'Express',
  Local = 'Local',
  Freight = 'Freight',
  Maintenance = 'Maintenance',
  Special = 'Special'
}

export enum TrainStatus {
    OnTime = 'On Time',
    Delayed = 'Delayed',
    Halted = 'Halted',
    Approaching = 'Approaching',
    Departed = 'Departed'
}

export interface Train {
  id: string;
  name: string;
  type: TrainType;
  priority: number; // 1 (highest) to 5 (lowest)
  speed: number; // in km/h
  position: number; // 0 to 100, percentage of track completed
  direction: 'UP' | 'DOWN';
  trackNumber: number; // e.g., 1, 2, 3, 4
  status: TrainStatus;
  delay: number; // in minutes
  nextStation: string;
}

export interface Station {
    id: string;
    name: string;
    position: number; // 0 to 100, percentage on the track
    platforms: number;
}

export interface ScheduleEntry {
    trainId: string;
    stationId: string;
    action: 'HALT' | 'PASS' | 'OVERTAKE';
    platform?: number;
    estimatedTime: string; // ISO 8601 format
    reason?: string;
    recommendedTrack?: number;
}

export interface OptimizedSchedule {
    scheduleId: string;
    createdAt: string;
    entries: ScheduleEntry[];
    metrics: {
        totalDelayReduced: number; // in minutes
        averageTrainSpeed: number; // in km/h
        throughputIncrease: number; // percentage
    };
}

export interface Conflict {
    id: string;
    // FIX: Added 'Collision Risk' to the allowed types for a conflict to handle proximity alerts.
    type: 'Head-on' | 'Crossing' | 'Platform' | 'Collision Risk';
    involvedTrains: string[];
    location: string;
    description: string;
    violatedRule: string; // e.g., "Minimum headway violation", "Platform occupancy conflict"
}

export enum ScenarioType {
    SignalFailure = 'Signal Failure',
    TrainDelay = 'Train Delay',
    TrackMaintenance = 'Track Maintenance',
    AddSpecialTrain = 'Add Special Train',
}

export enum LogType {
    System = 'System',
    AI = 'AI',
    Manual = 'Manual',
    Override = 'Override',
}

export interface LogEntry {
    id: string;
    timestamp: string;
    type: LogType;
    actor: string; // e.g., 'System', 'AI Optimizer', 'S. K. Sharma'
    message: string;
}