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
  unit?: string;
}

export const AdvancedAreaChart: React.FC<AdvancedAreaChartProps> = ({
  data,
  areas,
  xAxisKey,
  height = 400,
  showGrid = true,
  showLegend = true,
  stacked = false,
  yAxisLabel,
  tooltipFormatter,
  showReferenceLine = false,
  referenceValue,
  unit = 'BTC',
}) => {
  const avgValue = referenceValue ?? (data.length > 0 && areas.length > 0
    ? data.reduce((sum, d) => sum + (Number(d[areas[0].dataKey]) || 0), 0) / data.length
    : 0);

  // Calculate min/max for better Y-axis scaling
  const allValues = data.flatMap(d => areas.map(a => Number(d[a.dataKey]) || 0));
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const padding = (maxValue - minValue) * 0.1;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-4 min-w-[200px]">
          <div className="border-b border-slate-100 pb-2 mb-3">
            <p className="text-sm font-semibold text-slate-900">{label}</p>
          </div>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-6 py-1.5">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-slate-600">{entry.name}</span>
              </div>
              <span className="text-sm font-bold text-slate-900 tabular-nums">
                {tooltipFormatter ? tooltipFormatter(entry.value) : 
                  typeof entry.value === 'number' ? 
                    entry.value.toFixed(4) : 
                    entry.value
                }
                <span className="text-xs text-slate-500 ml-1 font-medium">{unit}</span>
              </span>
            </div>
          ))}
          {payload.length > 0 && avgValue > 0 && (
            <div className="border-t border-slate-100 mt-2 pt-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Moyenne période</span>
                <span className="font-semibold">{avgValue.toFixed(4)} {unit}</span>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const CustomDot = (props: any) => {
    const { cx, cy, payload, dataKey } = props;
    const value = payload[dataKey];
    const isAboveAvg = value > avgValue;
    
    return (
      <circle 
        cx={cx} 
        cy={cy} 
        r={4} 
        fill={isAboveAvg ? '#8AFD81' : '#94a3b8'}
        stroke="#fff"
        strokeWidth={2}
      />
    );
  };

  const CustomActiveDot = (props: any) => {
    const { cx, cy, fill } = props;
    return (
      <g>
        <circle cx={cx} cy={cy} r={8} fill={fill} fillOpacity={0.2} />
        <circle cx={cx} cy={cy} r={5} fill={fill} stroke="#fff" strokeWidth={2} />
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
        <defs>
          {areas.map((area) => (
            <linearGradient key={area.dataKey} id={`gradient-${area.dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={area.color} stopOpacity={0.3} />
              <stop offset="50%" stopColor={area.color} stopOpacity={0.1} />
              <stop offset="100%" stopColor={area.color} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        
        {showGrid && (
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#e2e8f0" 
            vertical={true} 
            horizontal={true}
          />
        )}
        
        <XAxis
          dataKey={xAxisKey}
          stroke="#cbd5e1"
          fontSize={11}
          tickLine={false}
          axisLine={{ stroke: '#e2e8f0', strokeWidth: 1 }}
          tick={{ fill: '#64748b', fontWeight: 500 }}
          dy={10}
          interval={Math.floor(data.length / 8)}
          tickMargin={10}
        />
        
        <YAxis
          stroke="#cbd5e1"
          fontSize={11}
          tickLine={false}
          axisLine={{ stroke: '#e2e8f0', strokeWidth: 1 }}
          tick={{ fill: '#64748b', fontWeight: 500 }}
          dx={-5}
          tickCount={8}
          domain={[minValue - padding, maxValue + padding]}
          tickFormatter={(value) => value.toFixed(3)}
          label={yAxisLabel ? { 
            value: yAxisLabel, 
            angle: -90, 
            position: 'insideLeft', 
            fill: '#64748b', 
            fontSize: 12, 
            fontWeight: 500,
            offset: 10
          } : undefined}
        />
        
        {showReferenceLine && avgValue > 0 && (
          <ReferenceLine 
            y={avgValue} 
            stroke="#64748b" 
            strokeDasharray="4 4"
            strokeWidth={1}
            label={{ 
              value: `Avg: ${avgValue.toFixed(3)} ${unit}`, 
              fill: '#64748b', 
              fontSize: 11,
              fontWeight: 500,
              position: 'right'
            }}
          />
        )}
        
        <Tooltip 
          content={<CustomTooltip />} 
          cursor={{ 
            stroke: '#94a3b8', 
            strokeWidth: 1,
            strokeDasharray: '4 4'
          }} 
        />
        
        {showLegend && (
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span className="text-sm font-medium text-slate-700 ml-2">{value}</span>
            )}
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
            animationDuration={1000}
            animationEasing="ease-out"
            dot={<CustomDot dataKey={area.dataKey} />}
            activeDot={<CustomActiveDot fill={area.color} />}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};
