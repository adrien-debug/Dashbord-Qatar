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
  const avgValue = referenceValue ?? (data.length > 0 && areas.length > 0
    ? data.reduce((sum, d) => sum + (Number(d[areas[0].dataKey]) || 0), 0) / data.length
    : 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="relative">
          {/* Ultra premium glassmorphism tooltip */}
          <div className="bg-black/80 backdrop-blur-2xl border border-[#8AFD81]/30 rounded-2xl shadow-[0_8px_32px_rgba(138,253,129,0.15)] p-5 min-w-[180px]">
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#8AFD81]/10 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#8AFD81]/20">
                <div className="w-2 h-2 rounded-full bg-[#8AFD81] shadow-[0_0_10px_#8AFD81] animate-pulse" />
                <p className="text-xs font-bold text-white uppercase tracking-[0.2em]">{label}</p>
              </div>
              {payload.map((entry: any, index: number) => (
                <div key={index} className="flex items-center justify-between gap-8 py-1">
                  <span className="text-xs text-slate-400 font-medium">{entry.name}</span>
                  <span className="text-lg font-bold text-white tabular-nums tracking-tight">
                    {tooltipFormatter ? tooltipFormatter(entry.value) : 
                      typeof entry.value === 'number' ? 
                        entry.value.toFixed(3) : 
                        entry.value
                    }
                    <span className="text-[10px] text-[#8AFD81] ml-1 font-semibold">BTC</span>
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
        <circle cx={cx} cy={cy} r={20} fill={fill} fillOpacity={0.1} />
        {/* Middle pulse ring */}
        <circle cx={cx} cy={cy} r={14} fill="none" stroke={fill} strokeWidth={1} strokeOpacity={0.3}>
          <animate attributeName="r" from="10" to="18" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />
        </circle>
        {/* Inner glow */}
        <circle cx={cx} cy={cy} r={8} fill={fill} fillOpacity={0.4} />
        {/* Core dot with white stroke */}
        <circle cx={cx} cy={cy} r={5} fill={fill} stroke="#fff" strokeWidth={2} />
        {/* Center highlight */}
        <circle cx={cx - 1} cy={cy - 1} r={2} fill="#fff" fillOpacity={0.6} />
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
        <defs>
          {areas.map((area) => (
            <React.Fragment key={area.dataKey}>
              {/* Premium multi-stop gradient */}
              <linearGradient id={`gradient-${area.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8AFD81" stopOpacity={0.6} />
                <stop offset="30%" stopColor="#8AFD81" stopOpacity={0.3} />
                <stop offset="60%" stopColor="#8AFD81" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#8AFD81" stopOpacity={0.02} />
              </linearGradient>
              {/* Stroke glow gradient */}
              <linearGradient id={`stroke-glow-${area.dataKey}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8AFD81" stopOpacity={0.4} />
                <stop offset="50%" stopColor="#8AFD81" stopOpacity={1} />
                <stop offset="100%" stopColor="#8AFD81" stopOpacity={0.4} />
              </linearGradient>
              {/* Glow filter */}
              <filter id={`glow-${area.dataKey}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
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
          interval="preserveStartEnd"
          tickMargin={8}
        />
        
        <YAxis
          stroke="transparent"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tick={{ fill: '#94a3b8', fontWeight: 600 }}
          dx={-5}
          tickCount={5}
          tickFormatter={(value) => value.toFixed(2)}
          label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11, fontWeight: 600 } : undefined}
        />
        
        {showReferenceLine && avgValue > 0 && (
          <ReferenceLine 
            y={avgValue} 
            stroke="#8AFD81" 
            strokeDasharray="6 6"
            strokeWidth={1.5}
            strokeOpacity={0.6}
            label={{ 
              value: `Avg: ${avgValue.toFixed(3)}`, 
              fill: '#8AFD81', 
              fontSize: 11,
              fontWeight: 600,
              position: 'right'
            }}
          />
        )}
        
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
        
        {areas.map((area) => (
          <Area
            key={area.dataKey}
            type="monotone"
            dataKey={area.dataKey}
            name={area.name}
            stackId={stacked ? 'stack' : area.stackId}
            stroke="#8AFD81"
            strokeWidth={3}
            fill={`url(#gradient-${area.dataKey})`}
            fillOpacity={1}
            animationDuration={2000}
            animationEasing="ease-out"
            dot={false}
            activeDot={<CustomActiveDot fill="#8AFD81" />}
            style={{ filter: `url(#glow-${area.dataKey})` }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};
