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
        <div className="bg-white/95 backdrop-blur-xl border border-[#d2d2d7]/50 rounded-xl shadow-lg p-3">
          <p className="text-[12px] font-medium text-[#86868b] mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-[13px]">
              <div className="w-2 h-2 rounded" style={{ backgroundColor: entry.color }} />
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
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        {showGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.1} vertical={false} />
        )}
        {horizontal ? (
          <>
            <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
            <YAxis
              type="category"
              dataKey={xAxisKey}
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={120}
              tick={{ fill: '#94a3b8' }}
            />
          </>
        ) : (
          <>
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
          </>
        )}
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9', opacity: 0.4 }} />
        {showLegend && (
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="rect"
            formatter={(value) => <span className="text-sm font-medium text-slate-600">{value}</span>}
          />
        )}
        {bars.map((bar) => (
          <Bar
            key={bar.dataKey}
            dataKey={bar.dataKey}
            name={bar.name}
            fill={bar.color}
            stackId={stacked ? 'stack' : bar.stackId}
            radius={horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]}
            animationDuration={2000}
            animationEasing="ease-out"
            barSize={horizontal ? 20 : undefined}
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
