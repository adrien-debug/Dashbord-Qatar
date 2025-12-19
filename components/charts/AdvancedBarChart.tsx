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
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl p-4 min-w-[140px]">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-700/50">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <p className="text-xs font-bold text-white uppercase tracking-wider">{label}</p>
          </div>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-sm"
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

  const getColorByValue = (value: number): string => {
    if (!colorThresholds) return bars[0]?.color || '#10B981';
    
    for (let i = colorThresholds.length - 1; i >= 0; i--) {
      if (value >= colorThresholds[i].value) {
        return colorThresholds[i].color;
      }
    }
    return colorThresholds[0]?.color || '#10B981';
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
            <linearGradient key={bar.dataKey} id={`bar-gradient-${bar.dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={bar.color} stopOpacity={1} />
              <stop offset="100%" stopColor={bar.color} stopOpacity={0.7} />
            </linearGradient>
          ))}
        </defs>
        
        {showGrid && (
          <CartesianGrid 
            strokeDasharray="0" 
            stroke="#e2e8f0" 
            strokeOpacity={0.5}
            vertical={false} 
            horizontal={true}
          />
        )}
        
        {horizontal ? (
          <>
            <XAxis 
              type="number" 
              stroke="transparent" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              tick={{ fill: '#64748b', fontWeight: 500 }} 
            />
            <YAxis
              type="category"
              dataKey={xAxisKey}
              stroke="transparent"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              width={100}
              tick={{ fill: '#64748b', fontWeight: 500 }}
            />
          </>
        ) : (
          <>
            <XAxis
              dataKey={xAxisKey}
              stroke="transparent"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0', strokeWidth: 1 }}
              tick={{ fill: '#64748b', fontWeight: 500 }}
              dy={8}
            />
            <YAxis
              stroke="transparent"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748b', fontWeight: 500 }}
              label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 } : undefined}
            />
          </>
        )}
        
        <Tooltip 
          content={<CustomTooltip />} 
          cursor={{ fill: '#f1f5f9', opacity: 0.6, radius: 4 }} 
        />
        
        {showLegend && (
          <Legend
            wrapperStyle={{ paddingTop: '16px' }}
            iconType="rect"
            iconSize={10}
            formatter={(value) => <span className="text-xs font-medium text-slate-600 ml-1">{value}</span>}
          />
        )}
        
        {bars.map((bar) => (
          <Bar
            key={bar.dataKey}
            dataKey={bar.dataKey}
            name={bar.name}
            fill={`url(#bar-gradient-${bar.dataKey})`}
            stackId={stacked ? 'stack' : bar.stackId}
            radius={horizontal ? [0, 6, 6, 0] : [6, 6, 0, 0]}
            animationDuration={1500}
            animationEasing="ease-out"
            barSize={horizontal ? 24 : undefined}
            maxBarSize={50}
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
