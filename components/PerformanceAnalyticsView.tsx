

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card } from './common/Card';
import { useLocalization } from '../context/LocalizationContext';
import { Button } from './common/Button';
import { LoadingSpinner } from './common/LoadingSpinner';
import { RobotIcon, BoltIcon } from '../constants';
import { getPerformanceSummary } from '../services/geminiService';

interface PerformanceAnalyticsViewProps {
  theme: 'light' | 'dark';
}

const averageDelayData = [
  { nameKey: 'trainType_Express', delay: 12 },
  { nameKey: 'trainType_Local', delay: 8 },
  { nameKey: 'trainType_Freight', delay: 35 },
  { nameKey: 'trainType_Special', delay: 5 },
];

const punctualityData = [
  { name: '08:00', Punctuality: 95 },
  { name: '10:00', Punctuality: 92 },
  { name: '12:00', Punctuality: 88 },
  { name: '14:00', Punctuality: 91 },
  { name: '16:00', Punctuality: 93 },
  { name: '18:00', Punctuality: 85 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2 rounded-md text-base shadow-lg">
        <p className="label font-bold text-gray-900 dark:text-white">{`${label}`}</p>
        <p className="intro text-cyan-600 dark:text-cyan-400">{`${payload[0].name} : ${payload[0].value}${payload[0].unit || ''}`}</p>
      </div>
    );
  }
  return null;
};

export const PerformanceAnalyticsView: React.FC<PerformanceAnalyticsViewProps> = ({ theme }) => {
  const { t, language } = useLocalization();
  const [report, setReport] = useState<string | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const isDarkMode = theme === 'dark';
  const axisColor = isDarkMode ? '#9CA3AF' : '#6B7280';
  const gridColor = isDarkMode ? '#4B5563' : '#E5E7EB';
  const barFill = isDarkMode ? '#06B6D4' : '#0891B2';
  const lineStroke = isDarkMode ? '#22D3EE' : '#0E7490';
  const labelColor = isDarkMode ? '#F9FAFB' : '#1F2937';
  
  const translatedAverageDelayData = averageDelayData.map(item => ({
      ...item,
      name: t(item.nameKey as any)
  }));

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    setReport(null);
    try {
        const summary = await getPerformanceSummary(averageDelayData, punctualityData, language);
        setReport(summary);
    } catch (error) {
        console.error("Failed to generate report:", error);
        setReport(t('summaryGenerationError' as any));
    } finally {
        setIsGeneratingReport(false);
    }
  };

  return (
    <div className="p-4 md:p-6 h-full flex flex-col gap-4 md:gap-6">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{t('analyticsTitle')}</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card title={t('avgDelayChartTitle')}>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={translatedAverageDelayData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="name" stroke={axisColor} tick={{ fontSize: 14 }} />
                    <YAxis stroke={axisColor} unit=" min" tick={{ fontSize: 14 }} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: isDarkMode ? 'rgba(107, 114, 128, 0.2)' : 'rgba(209, 213, 219, 0.4)' }} />
                    <Legend wrapperStyle={{ color: labelColor, fontSize: '14px' }}/>
                    <Bar dataKey="delay" name={t('metricAvgDelay' as any)} fill={barFill} />
                </BarChart>
            </ResponsiveContainer>
        </Card>
        <Card title={t('punctualityChartTitle')}>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={punctualityData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="name" stroke={axisColor} tick={{ fontSize: 14 }} />
                    <YAxis stroke={axisColor} unit="%" domain={[80, 100]} tick={{ fontSize: 14 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ color: labelColor, fontSize: '14px' }}/>
                    <Line type="monotone" dataKey="Punctuality" stroke={lineStroke} strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </Card>
      </div>

      <Card title={t('aiPerformanceSummary' as any)} icon={<RobotIcon className="h-5 w-5"/>}>
        <div className="flex flex-col gap-4">
            <div className="min-h-[200px] bg-gray-100 dark:bg-gray-900/50 p-4 rounded-lg flex items-center justify-center">
                {isGeneratingReport ? (
                    <LoadingSpinner text={t('generatingSummary' as any)} />
                ) : report ? (
                    <div className="text-base space-y-2 w-full">
                        {report.split('\n').map((line, i) => {
                            const parts = line.split('**');
                            return (
                                <p key={i}>
                                    {parts.map((part, j) => 
                                        j % 2 === 1 ? <strong key={j} className="text-gray-900 dark:text-white">{part}</strong> : part
                                    )}
                                </p>
                            )
                        })}
                    </div>
                ) : (
                    <p className="text-lg text-gray-500 text-center">{t('summaryPrompt' as any)}</p>
                )}
            </div>
            <div className="flex justify-end">
                <Button 
                    onClick={handleGenerateReport} 
                    isLoading={isGeneratingReport} 
                    icon={<BoltIcon className="h-5 w-5" />}
                >
                    {isGeneratingReport ? t('generatingSummary' as any) : t('generateAiSummary' as any)}
                </Button>
            </div>
        </div>
    </Card>

    </div>
  );
};
