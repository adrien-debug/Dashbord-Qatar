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
}

export const AdvancedLineChart: React.FC<AdvancedLineChartProps> = ({
  data,
  lines,
  xAxisKey,
  height = 350,
  showGrid = true,
  showLegend = true,
  showArea = false,
  referenceLine,
  yAxisLabel,
  xAxisLabel,
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
                className="w-3 h-3 rounded-full"
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

  const Chart = showArea ? ComposedChart : LineChart;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <Chart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        {showGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
        )}
        <XAxis
          dataKey={xAxisKey}
          stroke="#64748b"
          fontSize={12}
          tickLine={false}
          tick={{ fill: '#64748b' }}
          label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5 } : undefined}
        />
        <YAxis
          stroke="#64748b"
          fontSize={12}
          tickLine={false}
          tick={{ fill: '#64748b' }}
          label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
        />
        <Tooltip content={<CustomTooltip />} />
        {showLegend && (
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
            formatter={(value) => <span className="text-sm text-gray-700">{value}</span>}
          />
        )}
        {referenceLine && (
          <ReferenceLine
            y={referenceLine.y}
            stroke={referenceLine.color}
            strokeDasharray="5 5"
            label={{
              value: referenceLine.label,
              fill: referenceLine.color,
              fontSize: 12,
              fontWeight: 600,
            }}
          />
        )}
        {lines.map((line, index) => (
          <React.Fragment key={line.dataKey}>
            {showArea && (
              <Area
                type={line.type || 'monotone'}
                dataKey={line.dataKey}
                fill={line.color}
                fillOpacity={0.1}
                stroke="none"
              />
            )}
            <Line
              type={line.type || 'monotone'}
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.color}
              strokeWidth={line.strokeWidth || 2}
              dot={line.dot !== undefined ? line.dot : false}
              activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
              animationDuration={1000}
              animationEasing="ease-in-out"
            />
          </React.Fragment>
        ))}
      </Chart>
    </ResponsiveContainer>
  );
};
