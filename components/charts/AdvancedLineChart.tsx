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
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl p-4 min-w-[160px]">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-700/50">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-xs font-bold text-white uppercase tracking-wider">{label}</p>
          </div>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs text-slate-400">{entry.name}</span>
              </div>
              <span className="text-sm font-bold text-white tabular-nums">
                {tooltipFormatter ? tooltipFormatter(entry.value) : 
                  typeof entry.value === 'number' ? 
                    entry.value.toLocaleString() : 
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

  // Custom dot component for active state
  const CustomActiveDot = (props: any) => {
    const { cx, cy, fill } = props;
    return (
      <g>
        <circle cx={cx} cy={cy} r={10} fill={fill} fillOpacity={0.15} />
        <circle cx={cx} cy={cy} r={6} fill={fill} fillOpacity={0.3} />
        <circle cx={cx} cy={cy} r={4} fill={fill} stroke="#fff" strokeWidth={2} />
      </g>
    );
  };

  const Chart = showArea ? ComposedChart : LineChart;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <Chart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
        <defs>
          {lines.map((line) => (
            <React.Fragment key={line.dataKey}>
              <linearGradient id={`line-gradient-${line.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={line.color} stopOpacity={0.4} />
                <stop offset="50%" stopColor={line.color} stopOpacity={0.15} />
                <stop offset="100%" stopColor={line.color} stopOpacity={0.02} />
              </linearGradient>
            </React.Fragment>
          ))}
        </defs>
        
        {showGrid && (
          <CartesianGrid 
            strokeDasharray="0" 
            stroke="#e2e8f0" 
            strokeOpacity={0.4}
            vertical={false} 
            horizontal={true}
          />
        )}
        
        <XAxis
          dataKey={xAxisKey}
          stroke="transparent"
          fontSize={10}
          tickLine={false}
          axisLine={{ stroke: '#e2e8f0', strokeWidth: 1 }}
          tick={{ fill: '#64748b', fontWeight: 500 }}
          dy={8}
          label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 11 } : undefined}
        />
        
        <YAxis
          stroke="transparent"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          tick={{ fill: '#64748b', fontWeight: 500 }}
          label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 } : undefined}
        />
        
        <Tooltip 
          content={<CustomTooltip />} 
          cursor={{ 
            stroke: '#10B981', 
            strokeWidth: 1,
            strokeDasharray: '4 4',
            strokeOpacity: 0.5
          }} 
        />
        
        {showLegend && (
          <Legend
            wrapperStyle={{ paddingTop: '16px' }}
            iconType="line"
            iconSize={12}
            formatter={(value) => <span className="text-xs font-medium text-slate-600 ml-1">{value}</span>}
          />
        )}
        
        {referenceLine && (
          <ReferenceLine
            y={referenceLine.y}
            stroke={referenceLine.color}
            strokeDasharray="4 4"
            strokeWidth={1}
            label={{
              value: referenceLine.label,
              fill: referenceLine.color,
              fontSize: 10,
              fontWeight: 500,
              position: 'right',
            }}
          />
        )}
        
        {lines.map((line) => (
          <React.Fragment key={line.dataKey}>
            {showArea && (
              <Area
                type={line.type || 'monotone'}
                dataKey={line.dataKey}
                fill={`url(#line-gradient-${line.dataKey})`}
                fillOpacity={1}
                stroke="none"
                animationDuration={1800}
              />
            )}
            <Line
              type={line.type || 'monotone'}
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.color}
              strokeWidth={line.strokeWidth || 2}
              dot={line.dot !== undefined ? line.dot : false}
              activeDot={<CustomActiveDot fill={line.color} />}
              animationDuration={1800}
              animationEasing="ease-out"
            />
          </React.Fragment>
        ))}
      </Chart>
    </ResponsiveContainer>
  );
};
