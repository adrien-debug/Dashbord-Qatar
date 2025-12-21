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
  unit?: string;
}

const DEFAULT_COLORS = [
  '#8AFD81',
  '#3B82F6',
  '#64748b',
  '#f59e0b',
  '#6366f1',
  '#ec4899',
  '#14b8a6',
  '#f43f5e',
];

export const AdvancedPieChart: React.FC<AdvancedPieChartProps> = ({
  data,
  height = 400,
  showLegend = true,
  innerRadius = 60,
  outerRadius = 120,
  showLabels = true,
  showPercentage = true,
  colors = DEFAULT_COLORS,
  tooltipFormatter,
  unit = '',
}) => {
  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const entry = payload[0];
      const percentage = ((entry.value / total) * 100).toFixed(1);
      const formattedValue = typeof entry.value === 'number' ? 
        entry.value.toLocaleString('fr-FR') : 
        entry.value;
      
      // Calculate rank
      const sortedData = [...data].sort((a, b) => b.value - a.value);
      const rank = sortedData.findIndex(d => d.name === entry.name) + 1;
      
      return (
        <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-4 min-w-[200px]">
          <div className="flex items-center gap-3 mb-3 pb-2 border-b border-slate-100">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: entry.payload.fill }}
            />
            <span className="text-sm font-semibold text-slate-900">{entry.name}</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Valeur</span>
              <span className="text-sm font-bold text-slate-900 tabular-nums">
                {tooltipFormatter ? tooltipFormatter(entry.value) : formattedValue}
                {unit && <span className="text-xs text-slate-500 ml-1">{unit}</span>}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Part</span>
              <span className="text-sm font-bold text-slate-900 tabular-nums">{percentage}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Classement</span>
              <span className="text-sm font-bold text-slate-900">#{rank} sur {data.length}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    if (!showLabels || percent < 0.05) return null; // Don't show labels for small slices
    
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="#fff" 
        textAnchor="middle" 
        dominantBaseline="central"
        className="text-xs font-semibold"
        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
      >
        {showPercentage ? `${(percent * 100).toFixed(0)}%` : name}
      </text>
    );
  };

  // External labels for segment names
  const renderOuterLabel = ({ cx, cy, midAngle, outerRadius, name, percent }: any) => {
    if (percent < 0.05) return null;
    
    const radius = outerRadius + 25;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="#64748b" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {name}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={showLabels ? { stroke: '#cbd5e1', strokeWidth: 1 } : false}
          label={renderOuterLabel}
          outerRadius={outerRadius}
          innerRadius={innerRadius}
          fill="#8884d8"
          dataKey="value"
          animationDuration={800}
          animationEasing="ease-out"
          paddingAngle={1}
          stroke="#fff"
          strokeWidth={2}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color || colors[index % colors.length]}
            />
          ))}
        </Pie>
        
        {/* Inner percentage labels */}
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={outerRadius}
          innerRadius={innerRadius}
          fill="transparent"
          dataKey="value"
          animationDuration={0}
          paddingAngle={1}
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-inner-${index}`} fill="transparent" />
          ))}
        </Pie>
        
        {/* Center label for donut charts */}
        {innerRadius > 0 && (
          <text 
            x="50%" 
            y="50%" 
            textAnchor="middle" 
            dominantBaseline="middle"
            className="text-2xl font-bold fill-slate-900"
          >
            {total.toLocaleString('fr-FR')}
            {unit && <tspan className="text-sm font-medium fill-slate-500"> {unit}</tspan>}
          </text>
        )}
        
        <Tooltip content={<CustomTooltip />} />
        
        {showLegend && (
          <Legend
            verticalAlign="bottom"
            height={60}
            iconType="circle"
            iconSize={10}
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value, entry: any) => {
              const percentage = ((entry.payload.value / total) * 100).toFixed(1);
              return (
                <span className="text-sm text-slate-700 ml-2">
                  {value} <span className="text-slate-500 font-medium">({percentage}%)</span>
                </span>
              );
            }}
          />
        )}
      </PieChart>
    </ResponsiveContainer>
  );
};
