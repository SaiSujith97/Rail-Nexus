import React from 'react';
import { Train, Station, TrainType, TrainStatus } from './types';

export const MOCK_STATIONS: Station[] = [
  { id: 'KMM', name: 'Khammam', position: 0, platforms: 4 },
  { id: 'WL', name: 'Warangal', position: 25, platforms: 3 },
  { id: 'ZN', name: 'Jangaon', position: 45, platforms: 2 },
  { id: 'BG', name: 'Bhongir', position: 65, platforms: 2 },
  { id: 'GK', name: 'Ghatkesar', position: 85, platforms: 2 },
  { id: 'SC', name: 'Secunderabad Jn', position: 100, platforms: 10 },
];

export const MOCK_TRAINS: Train[] = [
  { id: '12759', name: 'Charminar Exp', type: TrainType.Express, priority: 1, speed: 90, position: 10, direction: 'DOWN', trackNumber: 1, status: TrainStatus.OnTime, delay: 0, nextStation: 'WL' },
  { id: '07462', name: 'W-H MEMU', type: TrainType.Local, priority: 3, speed: 60, position: 5, direction: 'DOWN', trackNumber: 2, status: TrainStatus.OnTime, delay: 0, nextStation: 'WL' },
  { id: 'FREIGHT-01', name: 'Container Goods', type: TrainType.Freight, priority: 5, speed: 45, position: 25, direction: 'DOWN', trackNumber: 3, status: TrainStatus.Halted, delay: 15, nextStation: 'WL' },
  { id: '12728', name: 'Godavari Exp', type: TrainType.Express, priority: 2, speed: 85, position: 95, direction: 'UP', trackNumber: 6, status: TrainStatus.Delayed, delay: 10, nextStation: 'GK' },
  { id: '12604', name: 'Chennai Exp', type: TrainType.Express, priority: 1, speed: 95, position: 55, direction: 'DOWN', trackNumber: 1, status: TrainStatus.OnTime, delay: 0, nextStation: 'BG' },
  { id: 'FREIGHT-02', name: 'Cement Wagon', type: TrainType.Freight, priority: 4, speed: 50, position: 80, direction: 'UP', trackNumber: 4, status: TrainStatus.OnTime, delay: 0, nextStation: 'ZN' },
  { id: '07758', name: 'SC-WL MEMU', type: TrainType.Local, priority: 3, speed: 65, position: 75, direction: 'UP', trackNumber: 5, status: TrainStatus.OnTime, delay: 0, nextStation: 'BG' },
  { id: '12806', name: 'Janmabhoomi Exp', type: TrainType.Express, priority: 2, speed: 80, position: 35, direction: 'UP', trackNumber: 6, status: TrainStatus.OnTime, delay: 0, nextStation: 'ZN' },
  { id: 'MAINT-01', name: 'Track Machine', type: TrainType.Maintenance, priority: 5, speed: 20, position: 50, direction: 'DOWN', trackNumber: 3, status: TrainStatus.Halted, delay: 0, nextStation: 'BG' },
  { id: '12714', name: 'Satavahana Exp', type: TrainType.Express, priority: 1, speed: 100, position: 90, direction: 'DOWN', trackNumber: 1, status: TrainStatus.Approaching, delay: 0, nextStation: 'SC' },
  { id: 'FREIGHT-03', name: 'Coal Rake', type: TrainType.Freight, priority: 4, speed: 40, position: 15, direction: 'UP', trackNumber: 4, status: TrainStatus.Delayed, delay: 25, nextStation: 'WL' },
];

// SVG Icons

export const IndianRailwaysTrainIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 540 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: 'rgb(230,230,230)', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'rgb(255,255,255)', stopOpacity:1}} />
            </linearGradient>
        </defs>
        <g id="train">
            <path d="M0 78 H535" stroke="#444" strokeWidth="2" />
            <g id="locomotive">
                <path d="M10 74 L 18 60 H 135 L 140 74 H 10 Z" fill="#4a4a4a" />
                <path d="M12 60 H133 L 138 25 H 115 L 110 15 H 35 L 28 25 L 18 25 L 12 60 Z" fill="url(#grad1)" stroke="#333" strokeWidth="0.5"/>
                <path d="M18 25 H138 V28 H18 Z" fill="#d9534f" />
                <path d="M15 58 L140 58" stroke="#d9534f" strokeWidth="3" />
                <rect x="20" y="29" width="18" height="12" fill="#555" stroke="#333" strokeWidth="0.5" />
                <rect x="40" y="29" width="18" height="12" fill="#555" stroke="#333" strokeWidth="0.5" />
                <rect x="90" y="29" width="18" height="12" fill="#555" stroke="#333" strokeWidth="0.5" />
                <path d="M50 15 L 60 8 L 95 8 L 105 15" stroke="#d9534f" strokeWidth="3" fill="none" />
                <text x="38" y="48" fontFamily="Arial, sans-serif" fontSize="8" fill="#333" fontWeight="bold">INDIAN RAILWAYS</text>
                <text x="105" y="52" fontFamily="Arial, sans-serif" fontSize="7" fill="#333" fontWeight="bold">30315</text>
                <rect x="117" y="32" width="12" height="18" fill="#444" stroke="#222" strokeWidth="0.5" />
                <path d="M0 60 H10 L 15 55 V40 L 10 35 H 0 V 60 Z" fill="#eee" stroke="#333" strokeWidth="0.5" />
                <circle cx="28" cy="74" r="5" fill="#666" stroke="#333" strokeWidth="1" />
                <circle cx="53" cy="74" r="5" fill="#666" stroke="#333" strokeWidth="1" />
                <circle cx="98" cy="74" r="5" fill="#666" stroke="#333" strokeWidth="1" />
                <circle cx="123" cy="74" r="5" fill="#666" stroke="#333" strokeWidth="1" />
            </g>
            <g id="coach1">
                <rect x="150" y="22" width="180" height="40" fill="#75c6d3" stroke="#333" strokeWidth="0.5" />
                <rect x="150" y="18" width="180" height="4" fill="#eee" stroke="#333" strokeWidth="0.5"/>
                <rect x="150" y="62" width="180" height="12" fill="#4a4a4a" />
                <rect x="165" y="28" width="25" height="15" fill="#3e6a72" stroke="#333" strokeWidth="0.5" />
                <rect x="200" y="28" width="25" height="15" fill="#3e6a72" stroke="#333" strokeWidth="0.5" />
                <rect x="235" y="28" width="25" height="15" fill="#3e6a72" stroke="#333" strokeWidth="0.5" />
                <rect x="270" y="28" width="25" height="15" fill="#3e6a72" stroke="#333" strokeWidth="0.5" />
                <rect x="155" y="25" width="8" height="35" fill="#5a9aa6" stroke="#333" strokeWidth="0.5"/>
                <rect x="317" y="25" width="8" height="35" fill="#5a9aa6" stroke="#333" strokeWidth="0.5"/>
                <circle cx="175" cy="74" r="5" fill="#666" stroke="#333" strokeWidth="1" />
                <circle cx="305" cy="74" r="5" fill="#666" stroke="#333" strokeWidth="1" />
            </g>
            <g id="coach2">
                <rect x="340" y="22" width="180" height="40" fill="#75c6d3" stroke="#333" strokeWidth="0.5" />
                <rect x="340" y="18" width="180" height="4" fill="#eee" stroke="#333" strokeWidth="0.5"/>
                <rect x="340" y="62" width="180" height="12" fill="#4a4a4a" />
                <rect x="355" y="28" width="25" height="15" fill="#3e6a72" stroke="#333" strokeWidth="0.5" />
                <rect x="390" y="28" width="25" height="15" fill="#3e6a72" stroke="#333" strokeWidth="0.5" />
                <rect x="425" y="28" width="25" height="15" fill="#3e6a72" stroke="#333" strokeWidth="0.5" />
                <rect x="460" y="28" width="25" height="15" fill="#3e6a72" stroke="#333" strokeWidth="0.5" />
                <rect x="345" y="25" width="8" height="35" fill="#5a9aa6" stroke="#333" strokeWidth="0.5"/>
                <rect x="507" y="25" width="8" height="35" fill="#5a9aa6" stroke="#333" strokeWidth="0.5"/>
                <circle cx="365" cy="74" r="5" fill="#666" stroke="#333" strokeWidth="1" />
                <circle cx="495" cy="74" r="5" fill="#666" stroke="#333" strokeWidth="1" />
            </g>
        </g>
    </svg>
);

export const TrainIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const ChartBarIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

export const SettingsIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const MapIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m0 10V7" />
    </svg>
);


export const BoltIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

export const LogoutIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

export const MenuIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

export const LogoTrainIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2c-4.42 0-8 1.79-8 4v5.5c0 .83.67 1.5 1.5 1.5h.5v3.5c0 .83.67 1.5 1.5 1.5h10c.83 0 1.5-.67 1.5-1.5V13h.5c.83 0 1.5-.67 1.5-1.5V6c0-2.21-3.58-4-8-4zM6 6h12v3H6V6zm10.5 9.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM12 20c-1.66 0-3-1.34-3-3h6c0 1.66-1.34 3-3 3z"/>
  </svg>
);

export const WarningSignIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

export const AccessIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0v4m-5 9V14a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1zm-6 0V14a1 1 0 00-1-1H4a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1z" />
    </svg>
);

export const InfoIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const RobotIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 0v6m0-6L9 13" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-4.03 9-9s-4.03-9-9-9-9 4.03-9 9 4.03 9 9 9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 13.5c-.375 0-.75.375-.75.75s.375.75.75.75.75-.375.75-.75-.375-.75-.75-.75zm9 0c-.375 0-.75.375-.75.75s.375.75.75.75.75-.375.75-.75-.375-.75-.75-.75zM12 16.5a1.5 1.5 0 00-1.5 1.5h3a1.5 1.5 0 00-1.5-1.5z" />
    </svg>
);


export const UserIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

export const SystemIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);

export const AuditLogIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

export const CheckCircleIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const ExclamationIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const ArrowRightIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
);