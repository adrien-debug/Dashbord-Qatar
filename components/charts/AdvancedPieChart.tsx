import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

interface DataPoint {
  name: string;
  value: number;
  color?: string;
}

interface AdvancedPieChartProps {
  data: DataPoint[];
  height?: number;
  showLegend?: boolean;
  innerRadius?: number;
  outerRadius?: number;
  showLabels?: boolean;
  showPercentage?: boolean;
  colors?: string[];
  tooltipFormatter?: (value: number) => string;
}

const DEFAULT_COLORS = [
  '#8AFD81',
  '#3B82F6',
  '#F59E0B',
  '#EF4444',
  '#6bcc64',
  '#8B5CF6',
  '#EC4899',
  '#14B8A6',
];

export const AdvancedPieChart: React.FC<AdvancedPieChartProps> = ({
  data,
  height = 350,
  showLegend = true,
  innerRadius = 0,
  outerRadius = 100,
  showLabels = true,
  showPercentage = true,
  colors = DEFAULT_COLORS,
  tooltipFormatter,
}) => {
  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const entry = payload[0];
      const percentage = ((entry.value / total) * 100).toFixed(1);
      const formattedValue = typeof entry.value === 'number' ? 
        entry.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : 
        entry.value;
      return (
        <div className="relative">
          {/* Ultra premium glassmorphism tooltip */}
          <div className="bg-black/80 backdrop-blur-2xl border border-[#8AFD81]/30 rounded-2xl shadow-[0_8px_32px_rgba(138,253,129,0.15)] p-5 min-w-[160px]">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#8AFD81]/10 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#8AFD81]/20">
                <div
                  className="w-4 h-4 rounded-full shadow-lg"
                  style={{ backgroundColor: entry.payload.fill, boxShadow: `0 0 12px ${entry.payload.fill}` }}
                />
                <span className="text-sm font-bold text-white tracking-wide">{entry.name}</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Value</span>
                  <span className="text-lg font-bold text-white tabular-nums">
                    {tooltipFormatter ? tooltipFormatter(entry.value) : formattedValue}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Share</span>
                  <span className="text-lg font-bold text-[#8AFD81] tabular-nums">{percentage}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderLabel = (entry: any) => {
    if (!showLabels) return null;
    const percentage = ((entry.value / total) * 100).toFixed(1);
    return showPercentage ? `${percentage}%` : entry.name;
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    if (!showLabels) return null;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.3;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="#64748b" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {showPercentage ? `${(percent * 100).toFixed(0)}%` : name}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <defs>
          {data.map((entry, index) => {
            const baseColor = entry.color || colors[index % colors.length];
            return (
              <React.Fragment key={`defs-${index}`}>
                <linearGradient id={`pie-gradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={baseColor} stopOpacity={1} />
                  <stop offset="100%" stopColor={baseColor} stopOpacity={0.7} />
                </linearGradient>
                <filter id={`pie-shadow-${index}`} x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor={baseColor} floodOpacity="0.3"/>
                </filter>
              </React.Fragment>
            );
          })}
        </defs>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={showLabels ? { stroke: '#94a3b8', strokeWidth: 1 } : false}
          label={renderCustomizedLabel}
          outerRadius={outerRadius}
          innerRadius={innerRadius}
          fill="#8884d8"
          dataKey="value"
          animationDuration={1500}
          animationEasing="ease-out"
          paddingAngle={2}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={2}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={`url(#pie-gradient-${index})`}
              style={{ filter: `url(#pie-shadow-${index})` }}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        {showLegend && (
          <Legend
            verticalAlign="bottom"
            height={40}
            iconType="circle"
            iconSize={12}
            formatter={(value, entry: any) => {
              const percentage = ((entry.payload.value / total) * 100).toFixed(1);
              return (
                <span className="text-sm font-semibold text-slate-600 ml-2">
                  {value} <span className="text-[#8AFD81]">({percentage}%)</span>
                </span>
              );
            }}
          />
        )}
      </PieChart>
    </ResponsiveContainer>
  );
};
