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
  '#10B981',
  '#3B82F6',
  '#F59E0B',
  '#EF4444',
  '#10B981',
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
        <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.payload.fill }}
            />
            <span className="text-sm font-semibold text-slate-800">{entry.name}</span>
          </div>
          <div className="text-xs text-slate-600">
            <div>Value: <span className="font-semibold text-slate-900">
              {tooltipFormatter ? tooltipFormatter(entry.value) : formattedValue}
            </span></div>
            <div>Percentage: <span className="font-semibold text-slate-900">{percentage}%</span></div>
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

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={showLabels}
          label={renderLabel}
          outerRadius={outerRadius}
          innerRadius={innerRadius}
          fill="#8884d8"
          dataKey="value"
          animationDuration={1000}
          animationEasing="ease-out"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color || colors[index % colors.length]}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        {showLegend && (
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value, entry: any) => {
              const percentage = ((entry.payload.value / total) * 100).toFixed(1);
              return (
                <span className="text-sm text-gray-700">
                  {value} ({percentage}%)
                </span>
              );
            }}
          />
        )}
      </PieChart>
    </ResponsiveContainer>
  );
};
