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
  ReferenceLine,
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
  showReferenceLine?: boolean;
  referenceValue?: number;
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
  showReferenceLine = false,
  referenceValue,
}) => {
  // Calculate average for reference line
  const avgValue = referenceValue ?? (data.length > 0 && areas.length > 0
    ? data.reduce((sum, d) => sum + (Number(d[areas[0].dataKey]) || 0), 0) / data.length
    : 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="relative">
          {/* Glassmorphism tooltip */}
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl p-4 min-w-[160px]">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-700/50">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs font-bold text-white uppercase tracking-wider">{label}</p>
            </div>
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-6">
                <span className="text-xs text-slate-400">{entry.name}</span>
                <span className="text-base font-bold text-white tabular-nums">
                  {tooltipFormatter ? tooltipFormatter(entry.value) : 
                    typeof entry.value === 'number' ? 
                      entry.value.toFixed(3) : 
                      entry.value
                  }
                  <span className="text-xs text-slate-500 ml-1">BTC</span>
                </span>
              </div>
            ))}
          </div>
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
        {/* Outer ring */}
        <circle cx={cx} cy={cy} r={12} fill={fill} fillOpacity={0.15} />
        {/* Middle ring */}
        <circle cx={cx} cy={cy} r={8} fill={fill} fillOpacity={0.3} />
        {/* Inner dot */}
        <circle cx={cx} cy={cy} r={4} fill={fill} stroke="#fff" strokeWidth={2} />
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
        <defs>
          {areas.map((area) => (
            <React.Fragment key={area.dataKey}>
              {/* Main gradient */}
              <linearGradient id={`gradient-${area.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={area.color} stopOpacity={0.4} />
                <stop offset="50%" stopColor={area.color} stopOpacity={0.15} />
                <stop offset="100%" stopColor={area.color} stopOpacity={0.02} />
              </linearGradient>
              {/* Stroke gradient for premium effect */}
              <linearGradient id={`stroke-gradient-${area.dataKey}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={area.color} stopOpacity={0.6} />
                <stop offset="50%" stopColor={area.color} stopOpacity={1} />
                <stop offset="100%" stopColor={area.color} stopOpacity={0.6} />
              </linearGradient>
            </React.Fragment>
          ))}
          {/* Grid pattern */}
          <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.5" opacity="0.5"/>
          </pattern>
        </defs>
        
        {showGrid && (
          <CartesianGrid 
            strokeDasharray="0" 
            stroke="#cbd5e1" 
            strokeOpacity={0.6}
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
          interval="preserveStartEnd"
          tickMargin={8}
        />
        
        <YAxis
          stroke="transparent"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          tick={{ fill: '#64748b', fontWeight: 500 }}
          dx={-5}
          tickCount={5}
          tickFormatter={(value) => value.toFixed(2)}
          label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 } : undefined}
        />
        
        {/* Average reference line */}
        {showReferenceLine && avgValue > 0 && (
          <ReferenceLine 
            y={avgValue} 
            stroke="#94a3b8" 
            strokeDasharray="4 4"
            strokeWidth={1}
            label={{ 
              value: `Avg: ${avgValue.toFixed(3)}`, 
              fill: '#64748b', 
              fontSize: 10,
              position: 'right'
            }}
          />
        )}
        
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
            iconType="circle"
            iconSize={8}
            formatter={(value) => <span className="text-xs font-medium text-slate-600 ml-1">{value}</span>}
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
            fillOpacity={1}
            animationDuration={1800}
            animationEasing="ease-out"
            dot={false}
            activeDot={<CustomActiveDot fill={area.color} />}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};
