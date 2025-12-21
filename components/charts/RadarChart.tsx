import React from 'react';
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

interface RadarDataPoint {
  subject: string;
  fullMark: number;
  [key: string]: string | number;
}

interface RadarConfig {
  dataKey: string;
  name: string;
  color: string;
  fillOpacity?: number;
}

interface RadarChartProps {
  data: RadarDataPoint[];
  radars: RadarConfig[];
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  animationDuration?: number;
  unit?: string;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  data,
  radars,
  height = 400,
  showLegend = true,
  showGrid = true,
  animationDuration = 1000,
  unit = '',
}) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const subject = payload[0]?.payload?.subject;
      
      return (
        <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-4 min-w-[200px]">
          <div className="border-b border-slate-100 pb-2 mb-3">
            <p className="text-sm font-semibold text-slate-900">{subject}</p>
          </div>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-6 py-1.5">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-slate-600">{entry.name}</span>
              </div>
              <span className="text-sm font-bold text-slate-900 tabular-nums">
                {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
                {unit && <span className="text-xs text-slate-500 ml-1">{unit}</span>}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsRadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
        <defs>
          {radars.map((radar) => (
            <linearGradient key={radar.dataKey} id={`radar-gradient-${radar.dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={radar.color} stopOpacity={0.6} />
              <stop offset="100%" stopColor={radar.color} stopOpacity={0.1} />
            </linearGradient>
          ))}
        </defs>
        
        {showGrid && (
          <PolarGrid 
            stroke="#e2e8f0" 
            strokeDasharray="3 3"
          />
        )}
        
        <PolarAngleAxis 
          dataKey="subject" 
          tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
          tickLine={false}
        />
        
        <PolarRadiusAxis 
          angle={30} 
          domain={[0, 100]}
          tick={{ fill: '#94a3b8', fontSize: 10 }}
          tickCount={5}
          axisLine={false}
        />
        
        <Tooltip content={<CustomTooltip />} />
        
        {radars.map((radar) => (
          <Radar
            key={radar.dataKey}
            name={radar.name}
            dataKey={radar.dataKey}
            stroke={radar.color}
            strokeWidth={2}
            fill={`url(#radar-gradient-${radar.dataKey})`}
            fillOpacity={radar.fillOpacity ?? 0.6}
            animationDuration={animationDuration}
            animationEasing="ease-out"
            dot={{
              r: 4,
              fill: '#fff',
              stroke: radar.color,
              strokeWidth: 2,
            }}
            activeDot={{
              r: 6,
              fill: radar.color,
              stroke: '#fff',
              strokeWidth: 2,
            }}
          />
        ))}
        
        {showLegend && (
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
            iconSize={10}
            formatter={(value) => (
              <span className="text-sm font-medium text-slate-700 ml-2">{value}</span>
            )}
          />
        )}
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
};

