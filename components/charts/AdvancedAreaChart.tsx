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
        <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-lg shadow-xl p-4">
          <p className="text-sm font-semibold text-slate-200 mb-2">{label}</p>
          {payload.reverse().map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-3 text-sm">
              <div
                className="w-2 h-2 rounded-full "
                style={{ backgroundColor: entry.color, color: entry.color }}
              />
              <span className="text-slate-400">{entry.name}:</span>
              <span className="font-bold text-white tabular-nums">
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
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <defs>
          {areas.map((area) => (
            <linearGradient key={area.dataKey} id={`gradient-${area.dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={area.color} stopOpacity={0.4} />
              <stop offset="95%" stopColor={area.color} stopOpacity={0.0} />
            </linearGradient>
          ))}
        </defs>
        {showGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.1} vertical={false} />
        )}
        <XAxis
          dataKey={xAxisKey}
          stroke="#94a3b8"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tick={{ fill: '#94a3b8' }}
          dy={10}
        />
        <YAxis
          stroke="#94a3b8"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tick={{ fill: '#94a3b8' }}
          label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', fill: '#94a3b8' } : undefined}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }} />
        {showLegend && (
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
            formatter={(value) => <span className="text-sm font-medium text-slate-600">{value}</span>}
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
            strokeWidth={3}
            fill={`url(#gradient-${area.dataKey})`}
            fillOpacity={1}
            animationDuration={2000}
            animationEasing="ease-out"
            dot={false}
            activeDot={{ r: 6, strokeWidth: 0, fill: area.color }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};
