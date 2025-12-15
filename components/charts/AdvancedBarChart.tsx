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
        <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3">
          <p className="text-sm font-semibold text-slate-800 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
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
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        {showGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
        )}
        {horizontal ? (
          <>
            <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} tick={{ fill: '#64748b' }} />
            <YAxis
              type="category"
              dataKey={xAxisKey}
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              width={120}
              tick={{ fill: '#64748b' }}
            />
          </>
        ) : (
          <>
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
          </>
        )}
        <Tooltip content={<CustomTooltip />} />
        {showLegend && (
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="rect"
            formatter={(value) => <span className="text-sm text-gray-700">{value}</span>}
          />
        )}
        {bars.map((bar) => (
          <Bar
            key={bar.dataKey}
            dataKey={bar.dataKey}
            name={bar.name}
            fill={bar.color}
            stackId={stacked ? 'stack' : bar.stackId}
            radius={[4, 4, 0, 0]}
            animationDuration={1000}
            animationEasing="ease-in-out"
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
