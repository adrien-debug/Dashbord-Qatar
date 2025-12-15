import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface DataPoint {
  [key: string]: string | number;
}

interface AreaConfig {
  dataKey: string;
  name: string;
  color: string;
  stackId?: string;
  fillOpacity?: number;
}

interface AdvancedAreaChartProps {
  data: DataPoint[];
  areas: AreaConfig[];
  xAxisKey: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  stacked?: boolean;
  yAxisLabel?: string;
  tooltipFormatter?: (value: number) => string;
}

export const AdvancedAreaChart: React.FC<AdvancedAreaChartProps> = ({
  data,
  areas,
  xAxisKey,
  height = 350,
  showGrid = true,
  showLegend = true,
  stacked = false,
  yAxisLabel,
  tooltipFormatter,
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3">
          <p className="text-sm font-semibold text-slate-800 mb-2">{label}</p>
          {payload.reverse().map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-slate-600">{entry.name}:</span>
              <span className="font-semibold text-slate-900">
                {tooltipFormatter ? tooltipFormatter(entry.value) : 
                  typeof entry.value === 'number' ? 
                    entry.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : 
                    entry.value
                }
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
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          {areas.map((area) => (
            <linearGradient key={area.dataKey} id={`gradient-${area.dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={area.color} stopOpacity={0.8} />
              <stop offset="95%" stopColor={area.color} stopOpacity={0.1} />
            </linearGradient>
          ))}
        </defs>
        {showGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
        )}
        <XAxis
          dataKey={xAxisKey}
          stroke="#64748b"
          fontSize={12}
          tickLine={false}
          tick={{ fill: '#64748b' }}
        />
        <YAxis
          stroke="#64748b"
          fontSize={12}
          tickLine={false}
          tick={{ fill: '#64748b' }}
          label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
        />
        <Tooltip content={<CustomTooltip />} />
        {showLegend && (
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="rect"
            formatter={(value) => <span className="text-sm text-gray-700">{value}</span>}
          />
        )}
        {areas.map((area) => (
          <Area
            key={area.dataKey}
            type="monotone"
            dataKey={area.dataKey}
            name={area.name}
            stackId={stacked ? 'stack' : area.stackId}
            stroke={area.color}
            strokeWidth={2}
            fill={`url(#gradient-${area.dataKey})`}
            fillOpacity={area.fillOpacity || 1}
            animationDuration={1000}
            animationEasing="ease-in-out"
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};
