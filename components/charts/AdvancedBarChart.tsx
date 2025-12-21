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
  ReferenceLine,
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
  unit?: string;
  showAverage?: boolean;
}

export const AdvancedBarChart: React.FC<AdvancedBarChartProps> = ({
  data,
  bars,
  xAxisKey,
  height = 400,
  showGrid = true,
  showLegend = true,
  stacked = false,
  horizontal = false,
  colorByValue = false,
  colorThresholds,
  yAxisLabel,
  tooltipFormatter,
  unit = '',
  showAverage = false,
}) => {
  // Calculate average for reference line
  const avgValue = data.length > 0 && bars.length > 0
    ? data.reduce((sum, d) => sum + (Number(d[bars[0].dataKey]) || 0), 0) / data.length
    : 0;

  // Calculate total for percentage
  const total = data.reduce((sum, d) => {
    return sum + bars.reduce((barSum, bar) => barSum + (Number(d[bar.dataKey]) || 0), 0);
  }, 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const entryTotal = payload.reduce((sum: number, p: any) => sum + (p.value || 0), 0);
      const percentage = total > 0 ? ((entryTotal / total) * 100).toFixed(1) : 0;
      
      return (
        <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-4 min-w-[220px]">
          <div className="border-b border-slate-100 pb-2 mb-3">
            <p className="text-sm font-semibold text-slate-900">{label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{percentage}% du total</p>
          </div>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-6 py-1.5">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-slate-600">{entry.name}</span>
              </div>
              <span className="text-sm font-bold text-slate-900 tabular-nums">
                {tooltipFormatter ? tooltipFormatter(entry.value) : 
                  typeof entry.value === 'number' ? 
                    entry.value.toLocaleString('fr-FR') : 
                    entry.value
                }
                {unit && <span className="text-xs text-slate-500 ml-1 font-medium">{unit}</span>}
              </span>
            </div>
          ))}
          {showAverage && (
            <div className="border-t border-slate-100 mt-2 pt-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Moyenne</span>
                <span className="font-semibold">{avgValue.toLocaleString('fr-FR')} {unit}</span>
              </div>
            </div>
          )}
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
        margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
      >
        {showGrid && (
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#e2e8f0" 
            vertical={!horizontal} 
            horizontal={true}
          />
        )}
        
        {horizontal ? (
          <>
            <XAxis 
              type="number" 
              stroke="#cbd5e1"
              fontSize={11} 
              tickLine={false} 
              axisLine={{ stroke: '#e2e8f0', strokeWidth: 1 }}
              tick={{ fill: '#64748b', fontWeight: 500 }} 
              tickCount={8}
            />
            <YAxis
              type="category"
              dataKey={xAxisKey}
              stroke="#cbd5e1"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0', strokeWidth: 1 }}
              width={120}
              tick={{ fill: '#64748b', fontWeight: 500 }}
            />
          </>
        ) : (
          <>
            <XAxis
              dataKey={xAxisKey}
              stroke="#cbd5e1"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0', strokeWidth: 1 }}
              tick={{ fill: '#64748b', fontWeight: 500 }}
              dy={10}
              interval={Math.floor(data.length / 10)}
            />
            <YAxis
              stroke="#cbd5e1"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0', strokeWidth: 1 }}
              tick={{ fill: '#64748b', fontWeight: 500 }}
              tickCount={8}
              label={yAxisLabel ? { 
                value: yAxisLabel, 
                angle: -90, 
                position: 'insideLeft', 
                fill: '#64748b', 
                fontSize: 12, 
                fontWeight: 500 
              } : undefined}
            />
          </>
        )}

        {showAverage && avgValue > 0 && !horizontal && (
          <ReferenceLine 
            y={avgValue} 
            stroke="#64748b" 
            strokeDasharray="4 4"
            strokeWidth={1}
            label={{ 
              value: `Moy: ${avgValue.toFixed(0)}`, 
              fill: '#64748b', 
              fontSize: 11,
              fontWeight: 500,
              position: 'right'
            }}
          />
        )}
        
        <Tooltip 
          content={<CustomTooltip />} 
          cursor={{ fill: '#f1f5f9' }} 
        />
        
        {showLegend && (
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="rect"
            iconSize={10}
            formatter={(value) => (
              <span className="text-sm font-medium text-slate-700 ml-2">{value}</span>
            )}
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
            animationDuration={800}
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
