import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface DataPoint {
  [key: string]: string | number;
}

interface BarConfig {
  dataKey: string;
  name: string;
  color: string;
  stackId?: string;
}

interface AdvancedBarChartProps {
  data: DataPoint[];
  bars: BarConfig[];
  xAxisKey: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  stacked?: boolean;
  horizontal?: boolean;
  colorByValue?: boolean;
  colorThresholds?: { value: number; color: string }[];
  yAxisLabel?: string;
  tooltipFormatter?: (value: number) => string;
}

export const AdvancedBarChart: React.FC<AdvancedBarChartProps> = ({
  data,
  bars,
  xAxisKey,
  height = 350,
  showGrid = true,
  showLegend = true,
  stacked = false,
  horizontal = false,
  colorByValue = false,
  colorThresholds,
  yAxisLabel,
  tooltipFormatter,
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="relative">
          {/* Ultra premium glassmorphism tooltip */}
          <div className="bg-black/80 backdrop-blur-2xl border border-[#8AFD81]/30 rounded-2xl shadow-[0_8px_32px_rgba(138,253,129,0.15)] p-5 min-w-[160px]">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#8AFD81]/10 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#8AFD81]/20">
                <div className="w-2 h-2 rounded-full bg-[#8AFD81] shadow-[0_0_10px_#8AFD81]" />
                <p className="text-xs font-bold text-white uppercase tracking-[0.2em]">{label}</p>
              </div>
              {payload.map((entry: any, index: number) => (
                <div key={index} className="flex items-center justify-between gap-6 py-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-md shadow-lg"
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

  const getColorByValue = (value: number): string => {
    if (!colorThresholds) return bars[0]?.color || '#8AFD81';
    
    for (let i = colorThresholds.length - 1; i >= 0; i--) {
      if (value >= colorThresholds[i].value) {
        return colorThresholds[i].color;
      }
    }
    return colorThresholds[0]?.color || '#8AFD81';
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout={horizontal ? 'vertical' : 'horizontal'}
        margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
      >
        <defs>
          {bars.map((bar) => (
            <React.Fragment key={bar.dataKey}>
              {/* Premium 3D-like gradient */}
              <linearGradient id={`bar-gradient-${bar.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8AFD81" stopOpacity={1} />
                <stop offset="50%" stopColor="#8AFD81" stopOpacity={0.85} />
                <stop offset="100%" stopColor="#6bcc64" stopOpacity={0.7} />
              </linearGradient>
              {/* Shine effect */}
              <linearGradient id={`bar-shine-${bar.dataKey}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#fff" stopOpacity={0} />
                <stop offset="50%" stopColor="#fff" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#fff" stopOpacity={0} />
              </linearGradient>
              <filter id={`bar-shadow-${bar.dataKey}`} x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#8AFD81" floodOpacity="0.25"/>
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
        
        {horizontal ? (
          <>
            <XAxis 
              type="number" 
              stroke="transparent" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false} 
              tick={{ fill: '#94a3b8', fontWeight: 600 }} 
            />
            <YAxis
              type="category"
              dataKey={xAxisKey}
              stroke="transparent"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={100}
              tick={{ fill: '#94a3b8', fontWeight: 600 }}
            />
          </>
        ) : (
          <>
            <XAxis
              dataKey={xAxisKey}
              stroke="transparent"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0', strokeWidth: 1 }}
              tick={{ fill: '#94a3b8', fontWeight: 600 }}
              dy={10}
            />
            <YAxis
              stroke="transparent"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94a3b8', fontWeight: 600 }}
              label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11, fontWeight: 600 } : undefined}
            />
          </>
        )}
        
        <Tooltip 
          content={<CustomTooltip />} 
          cursor={{ fill: '#8AFD81', opacity: 0.08, radius: 8 }} 
        />
        
        {showLegend && (
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="rect"
            iconSize={12}
            formatter={(value) => <span className="text-xs font-semibold text-slate-600 ml-2 tracking-wide">{value}</span>}
          />
        )}
        
        {bars.map((bar) => (
          <Bar
            key={bar.dataKey}
            dataKey={bar.dataKey}
            name={bar.name}
            fill={`url(#bar-gradient-${bar.dataKey})`}
            stackId={stacked ? 'stack' : bar.stackId}
            radius={horizontal ? [0, 8, 8, 0] : [8, 8, 0, 0]}
            animationDuration={1800}
            animationEasing="ease-out"
            barSize={horizontal ? 28 : undefined}
            maxBarSize={55}
            style={{ filter: `url(#bar-shadow-${bar.dataKey})` }}
          >
            {colorByValue &&
              data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColorByValue(entry[bar.dataKey] as number)} />
              ))}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};
