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
  unit?: string;
}

export const AdvancedLineChart: React.FC<AdvancedLineChartProps> = ({
  data,
  lines,
  xAxisKey,
  height = 400,
  showGrid = true,
  showLegend = true,
  showArea = false,
  referenceLine,
  yAxisLabel,
  xAxisLabel,
  tooltipFormatter,
  unit = '',
}) => {
  // Calculate stats for tooltip
  const calculateStats = (dataKey: string) => {
    const values = data.map(d => Number(d[dataKey]) || 0);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    return { avg, min, max };
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-4 min-w-[240px]">
          <div className="border-b border-slate-100 pb-2 mb-3">
            <p className="text-sm font-semibold text-slate-900">{label}</p>
          </div>
          {payload.map((entry: any, index: number) => {
            const stats = calculateStats(entry.dataKey);
            const isAboveAvg = entry.value > stats.avg;
            
            return (
              <div key={index} className="py-2 border-b border-slate-50 last:border-0">
                <div className="flex items-center justify-between gap-6 mb-2">
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
                        entry.value.toLocaleString('fr-FR') : 
                        entry.value
                    }
                    {unit && <span className="text-xs text-slate-500 ml-1">{unit}</span>}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className={`px-2 py-0.5 rounded ${isAboveAvg ? 'bg-green-50 text-green-700' : 'bg-slate-50 text-slate-600'}`}>
                    {isAboveAvg ? '↑ Au-dessus moy.' : '↓ Sous moy.'}
                  </span>
                  <span className="text-slate-400">
                    Min: {stats.min.toLocaleString('fr-FR')} | Max: {stats.max.toLocaleString('fr-FR')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  const CustomDot = (props: any) => {
    const { cx, cy, index } = props;
    // Show dots only at regular intervals for cleaner look
    if (index % Math.ceil(data.length / 15) !== 0) return null;
    
    return (
      <circle 
        cx={cx} 
        cy={cy} 
        r={3} 
        fill="#fff"
        stroke={props.stroke}
        strokeWidth={2}
      />
    );
  };

  const CustomActiveDot = (props: any) => {
    const { cx, cy, fill } = props;
    return (
      <g>
        <circle cx={cx} cy={cy} r={6} fill={fill} fillOpacity={0.2} />
        <circle cx={cx} cy={cy} r={4} fill={fill} stroke="#fff" strokeWidth={2} />
      </g>
    );
  };

  const Chart = showArea ? ComposedChart : LineChart;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <Chart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
        <defs>
          {lines.map((line) => (
            <linearGradient key={line.dataKey} id={`line-gradient-${line.dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={line.color} stopOpacity={0.25} />
              <stop offset="50%" stopColor={line.color} stopOpacity={0.1} />
              <stop offset="100%" stopColor={line.color} stopOpacity={0.02} />
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
          label={xAxisLabel ? { 
            value: xAxisLabel, 
            position: 'insideBottom', 
            offset: -10, 
            fill: '#64748b', 
            fontSize: 12, 
            fontWeight: 500 
          } : undefined}
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
            iconType="line"
            iconSize={20}
            formatter={(value) => (
              <span className="text-sm font-medium text-slate-700 ml-2">{value}</span>
            )}
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
              fontSize: 11,
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
                animationDuration={1000}
              />
            )}
            <Line
              type={line.type || 'monotone'}
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.color}
              strokeWidth={line.strokeWidth || 2}
              dot={line.dot !== undefined ? line.dot : <CustomDot stroke={line.color} />}
              activeDot={<CustomActiveDot fill={line.color} />}
              animationDuration={1000}
              animationEasing="ease-out"
            />
          </React.Fragment>
        ))}
      </Chart>
    </ResponsiveContainer>
  );
};
