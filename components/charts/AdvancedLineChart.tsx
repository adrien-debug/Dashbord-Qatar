import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
} from 'recharts';

interface DataPoint {
  [key: string]: string | number;
}

interface LineConfig {
  dataKey: string;
  name: string;
  color: string;
  strokeWidth?: number;
  type?: 'monotone' | 'linear' | 'step';
  dot?: boolean;
}

interface AdvancedLineChartProps {
  data: DataPoint[];
  lines: LineConfig[];
  xAxisKey: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  showArea?: boolean;
  referenceLine?: { y: number; label: string; color: string };
  yAxisLabel?: string;
  xAxisLabel?: string;
  tooltipFormatter?: (value: number) => string;
}

export const AdvancedLineChart: React.FC<AdvancedLineChartProps> = ({
  data,
  lines,
  xAxisKey,
  height = 350,
  showGrid = true,
  showLegend = true,
  showArea = false,
  referenceLine,
  yAxisLabel,
  xAxisLabel,
  tooltipFormatter,
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-xl border border-[#d2d2d7]/50 rounded-xl shadow-lg p-3">
          <p className="text-[12px] font-medium text-[#86868b] mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-[13px]">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-[#86868b]">{entry.name}:</span>
              <span className="font-semibold text-[#1d1d1f]">
                {tooltipFormatter ? tooltipFormatter(entry.value) : 
                  typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value
                }
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const Chart = showArea ? ComposedChart : LineChart;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <Chart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <defs>
          {lines.map((line) => (
             <linearGradient key={line.dataKey} id={`gradient-${line.dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={line.color} stopOpacity={0.4} />
              <stop offset="95%" stopColor={line.color} stopOpacity={0.0} />
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
          label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5, fill: '#94a3b8' } : undefined}
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
            iconType="line"
            formatter={(value) => <span className="text-sm font-medium text-slate-600">{value}</span>}
          />
        )}
        {referenceLine && (
          <ReferenceLine
            y={referenceLine.y}
            stroke={referenceLine.color}
            strokeDasharray="5 5"
            label={{
              value: referenceLine.label,
              fill: referenceLine.color,
              fontSize: 12,
              fontWeight: 600,
            }}
          />
        )}
        {lines.map((line, index) => (
          <React.Fragment key={line.dataKey}>
            {showArea && (
              <Area
                type={line.type || 'monotone'}
                dataKey={line.dataKey}
                fill={`url(#gradient-${line.dataKey})`}
                fillOpacity={1}
                stroke="none"
              />
            )}
            <Line
              type={line.type || 'monotone'}
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.color}
              strokeWidth={line.strokeWidth || 3}
              dot={line.dot !== undefined ? line.dot : false}
              activeDot={{ r: 6, strokeWidth: 0, fill: line.color }}
              animationDuration={2000}
              animationEasing="ease-out"
            />
          </React.Fragment>
        ))}
      </Chart>
    </ResponsiveContainer>
  );
};
