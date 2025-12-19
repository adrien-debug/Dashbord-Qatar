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
        <div className="relative">
          {/* Ultra premium glassmorphism tooltip */}
          <div className="bg-black/80 backdrop-blur-2xl border border-[#8AFD81]/30 rounded-2xl shadow-[0_8px_32px_rgba(138,253,129,0.15)] p-5 min-w-[180px]">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#8AFD81]/10 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#8AFD81]/20">
                <div className="w-2 h-2 rounded-full bg-[#8AFD81] shadow-[0_0_10px_#8AFD81] animate-pulse" />
                <p className="text-xs font-bold text-white uppercase tracking-[0.2em]">{label}</p>
              </div>
              {payload.map((entry: any, index: number) => (
                <div key={index} className="flex items-center justify-between gap-8 py-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full shadow-lg"
                      style={{ backgroundColor: entry.color, boxShadow: `0 0 8px ${entry.color}` }}
                    />
                    <span className="text-xs text-slate-400 font-medium">{entry.name}</span>
                  </div>
                  <span className="text-lg font-bold text-white tabular-nums tracking-tight">
                    {tooltipFormatter ? tooltipFormatter(entry.value) : 
                      typeof entry.value === 'number' ? 
                        entry.value.toLocaleString() : 
                        entry.value
                    }
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomActiveDot = (props: any) => {
    const { cx, cy, fill } = props;
    return (
      <g>
        {/* Outer glow */}
        <circle cx={cx} cy={cy} r={18} fill={fill} fillOpacity={0.1} />
        {/* Pulse animation */}
        <circle cx={cx} cy={cy} r={12} fill="none" stroke={fill} strokeWidth={1.5} strokeOpacity={0.4}>
          <animate attributeName="r" from="8" to="16" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
        </circle>
        {/* Inner glow */}
        <circle cx={cx} cy={cy} r={7} fill={fill} fillOpacity={0.5} />
        {/* Core */}
        <circle cx={cx} cy={cy} r={5} fill={fill} stroke="#fff" strokeWidth={2.5} />
        {/* Highlight */}
        <circle cx={cx - 1} cy={cy - 1} r={2} fill="#fff" fillOpacity={0.7} />
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
                <stop offset="0%" stopColor={line.color} stopOpacity={0.5} />
                <stop offset="40%" stopColor={line.color} stopOpacity={0.2} />
                <stop offset="100%" stopColor={line.color} stopOpacity={0.02} />
              </linearGradient>
              <filter id={`line-glow-${line.dataKey}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </React.Fragment>
          ))}
        </defs>
        
        {showGrid && (
          <CartesianGrid 
            strokeDasharray="1 1" 
            stroke="#e2e8f0" 
            strokeOpacity={0.3}
            vertical={false} 
            horizontal={true}
          />
        )}
        
        <XAxis
          dataKey={xAxisKey}
          stroke="transparent"
          fontSize={11}
          tickLine={false}
          axisLine={{ stroke: '#e2e8f0', strokeWidth: 1 }}
          tick={{ fill: '#94a3b8', fontWeight: 600 }}
          dy={10}
          label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 11, fontWeight: 600 } : undefined}
        />
        
        <YAxis
          stroke="transparent"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tick={{ fill: '#94a3b8', fontWeight: 600 }}
          label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11, fontWeight: 600 } : undefined}
        />
        
        <Tooltip 
          content={<CustomTooltip />} 
          cursor={{ 
            stroke: '#8AFD81', 
            strokeWidth: 2,
            strokeDasharray: '8 4',
            strokeOpacity: 0.4
          }} 
        />
        
        {showLegend && (
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
            iconSize={10}
            formatter={(value) => <span className="text-xs font-semibold text-slate-600 ml-2 tracking-wide">{value}</span>}
          />
        )}
        
        {referenceLine && (
          <ReferenceLine
            y={referenceLine.y}
            stroke={referenceLine.color}
            strokeDasharray="6 6"
            strokeWidth={1.5}
            label={{
              value: referenceLine.label,
              fill: referenceLine.color,
              fontSize: 11,
              fontWeight: 600,
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
                animationDuration={2000}
              />
            )}
            <Line
              type={line.type || 'monotone'}
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.color}
              strokeWidth={line.strokeWidth || 3}
              dot={line.dot !== undefined ? line.dot : false}
              activeDot={<CustomActiveDot fill={line.color} />}
              animationDuration={2000}
              animationEasing="ease-out"
              style={{ filter: `url(#line-glow-${line.dataKey})` }}
            />
          </React.Fragment>
        ))}
      </Chart>
    </ResponsiveContainer>
  );
};
