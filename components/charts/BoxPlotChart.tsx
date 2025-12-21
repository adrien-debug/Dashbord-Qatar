import React, { useState, useEffect } from 'react';

interface BoxPlotData {
  label: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  mean?: number;
  outliers?: number[];
  color?: string;
}

interface BoxPlotChartProps {
  data: BoxPlotData[];
  height?: number;
  showMean?: boolean;
  showOutliers?: boolean;
  showLabels?: boolean;
  showValues?: boolean;
  unit?: string;
  formatValue?: (value: number) => string;
  theme?: 'light' | 'dark';
}

// Palette Hearst Qatar
const THEMES = {
  dark: {
    background: '#0f172a',
    cardBg: '#1e293b',
    boxFill: '#334155',
    grid: '#334155',
    axis: '#475569',
    text: '#94a3b8',
    textBright: '#f1f5f9',
    accent: '#8AFD81',
    colors: ['#8AFD81', '#3b82f6', '#f59e0b', '#06b6d4', '#8b5cf6', '#ec4899'],
  },
  light: {
    background: '#ffffff',
    cardBg: '#f8fafc',
    boxFill: '#f1f5f9',
    grid: '#e2e8f0',
    axis: '#cbd5e1',
    text: '#64748b',
    textBright: '#1e293b',
    accent: '#8AFD81',
    colors: ['#8AFD81', '#3b82f6', '#f59e0b', '#06b6d4', '#8b5cf6', '#ec4899'],
  },
};

export const BoxPlotChart: React.FC<BoxPlotChartProps> = ({
  data,
  height = 380,
  showMean = true,
  showOutliers = true,
  showLabels = true,
  showValues = true,
  unit = '',
  formatValue,
  theme = 'dark',
}) => {
  const [mounted, setMounted] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const colors = THEMES[theme];

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const width = 750;
  const padding = { top: 30, right: 50, bottom: 55, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  const boxWidth = Math.min(50, (chartWidth / data.length) * 0.55);
  const boxGap = (chartWidth / data.length) - boxWidth;

  const defaultFormatValue = (value: number) => {
    return `${value.toFixed(1)}${unit}`;
  };

  const formatter = formatValue || defaultFormatValue;

  // Calculate value range
  const allValues = data.flatMap(d => [d.min, d.max, ...(d.outliers || [])]);
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const valueRange = maxValue - minValue;
  const valuePadding = valueRange * 0.12;

  const scaleY = (value: number) => {
    return padding.top + chartHeight - ((value - minValue + valuePadding) / (valueRange + 2 * valuePadding)) * chartHeight;
  };

  const scaleX = (index: number) => {
    return padding.left + index * (boxWidth + boxGap) + boxWidth / 2 + boxGap / 2;
  };

  const generateTicks = () => {
    const tickCount = 5;
    const ticks = [];
    for (let i = 0; i < tickCount; i++) {
      const value = minValue - valuePadding + (valueRange + 2 * valuePadding) * (i / (tickCount - 1));
      ticks.push(value);
    }
    return ticks;
  };

  const yTicks = generateTicks();

  return (
    <div className="w-full relative rounded-xl overflow-hidden" style={{ height, backgroundColor: colors.cardBg }}>
      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Gradients for boxes */}
          {colors.colors.map((color, i) => (
            <linearGradient key={i} id={`box-grad-${theme}-${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity={0.4} />
              <stop offset="100%" stopColor={color} stopOpacity={0.15} />
            </linearGradient>
          ))}
          
          {/* Glow filter */}
          <filter id={`box-glow-${theme}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Y-axis grid lines and labels */}
        {yTicks.map((tick, i) => (
          <g key={i}>
            <line
              x1={padding.left}
              y1={scaleY(tick)}
              x2={width - padding.right}
              y2={scaleY(tick)}
              stroke={colors.grid}
              strokeWidth={1}
              strokeOpacity={0.5}
            />
            <text
              x={padding.left - 10}
              y={scaleY(tick) + 4}
              textAnchor="end"
              style={{ fontSize: 10, fontWeight: 500 }}
              fill={colors.text}
            >
              {formatter(tick)}
            </text>
          </g>
        ))}

        {/* Box plots */}
        {data.map((item, index) => {
          const x = scaleX(index);
          const itemColor = item.color || colors.colors[index % colors.colors.length];
          const isHovered = hoveredIndex === index;
          
          const q1Y = scaleY(item.q1);
          const q3Y = scaleY(item.q3);
          const medianY = scaleY(item.median);
          const minY = scaleY(item.min);
          const maxY = scaleY(item.max);
          const meanY = item.mean !== undefined ? scaleY(item.mean) : null;
          
          const boxHeight = Math.abs(q1Y - q3Y);

          return (
            <g 
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="cursor-pointer"
              style={{
                opacity: mounted ? 1 : 0,
                transition: `opacity 0.5s ease-out ${index * 0.08}s`,
              }}
            >
              {/* Whisker: min to Q1 */}
              <line
                x1={x}
                y1={minY}
                x2={x}
                y2={q1Y}
                stroke={itemColor}
                strokeWidth={2}
                strokeDasharray="4 3"
                strokeOpacity={0.7}
              />
              
              {/* Whisker: Q3 to max */}
              <line
                x1={x}
                y1={q3Y}
                x2={x}
                y2={maxY}
                stroke={itemColor}
                strokeWidth={2}
                strokeDasharray="4 3"
                strokeOpacity={0.7}
              />

              {/* Min cap */}
              <line
                x1={x - boxWidth * 0.35}
                y1={minY}
                x2={x + boxWidth * 0.35}
                y2={minY}
                stroke={itemColor}
                strokeWidth={2.5}
                strokeLinecap="round"
              />

              {/* Max cap */}
              <line
                x1={x - boxWidth * 0.35}
                y1={maxY}
                x2={x + boxWidth * 0.35}
                y2={maxY}
                stroke={itemColor}
                strokeWidth={2.5}
                strokeLinecap="round"
              />

              {/* Box (IQR) */}
              <rect
                x={x - boxWidth / 2}
                y={q3Y}
                width={boxWidth}
                height={boxHeight}
                fill={`url(#box-grad-${theme}-${index % colors.colors.length})`}
                stroke={itemColor}
                strokeWidth={isHovered ? 3 : 2}
                rx={6}
                filter={isHovered ? `url(#box-glow-${theme})` : undefined}
                style={{
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                  transformOrigin: `${x}px ${(q1Y + q3Y) / 2}px`,
                  transition: 'transform 0.2s ease-out, stroke-width 0.2s',
                }}
              />

              {/* Median line */}
              <line
                x1={x - boxWidth / 2 + 4}
                y1={medianY}
                x2={x + boxWidth / 2 - 4}
                y2={medianY}
                stroke={colors.textBright}
                strokeWidth={3}
                strokeLinecap="round"
              />

              {/* Mean marker (diamond) */}
              {showMean && meanY !== null && (
                <g>
                  <path
                    d={`M ${x} ${meanY - 7} L ${x + 6} ${meanY} L ${x} ${meanY + 7} L ${x - 6} ${meanY} Z`}
                    fill={colors.cardBg}
                    stroke={itemColor}
                    strokeWidth={2}
                  />
                  <circle cx={x} cy={meanY} r={2.5} fill={itemColor} />
                </g>
              )}

              {/* Outliers */}
              {showOutliers && item.outliers?.map((outlier, oi) => (
                <g key={oi}>
                  <circle
                    cx={x + ((oi % 3) - 1) * boxWidth * 0.2}
                    cy={scaleY(outlier)}
                    r={isHovered ? 6 : 5}
                    fill={colors.cardBg}
                    stroke={itemColor}
                    strokeWidth={2}
                    style={{ transition: 'r 0.2s' }}
                  />
                  <circle
                    cx={x + ((oi % 3) - 1) * boxWidth * 0.2}
                    cy={scaleY(outlier)}
                    r={2}
                    fill={itemColor}
                  />
                </g>
              ))}

              {/* X-axis label */}
              {showLabels && (
                <text
                  x={x}
                  y={height - padding.bottom + 22}
                  textAnchor="middle"
                  style={{ fontSize: 11, fontWeight: 600 }}
                  fill={isHovered ? colors.textBright : colors.text}
                >
                  {item.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Legend */}
        <g transform={`translate(${padding.left}, ${padding.top - 10})`}>
          <line x1={0} y1={0} x2={18} y2={0} stroke={colors.textBright} strokeWidth={3} strokeLinecap="round" />
          <text x={24} y={4} style={{ fontSize: 10, fontWeight: 500 }} fill={colors.text}>Médiane</text>
          
          {showMean && (
            <g transform="translate(85, 0)">
              <path d="M 8 -5 L 13 0 L 8 5 L 3 0 Z" fill={colors.cardBg} stroke={colors.accent} strokeWidth={1.5} />
              <text x={22} y={4} style={{ fontSize: 10, fontWeight: 500 }} fill={colors.text}>Moyenne</text>
            </g>
          )}
          
          {showOutliers && (
            <g transform="translate(175, 0)">
              <circle cx={6} cy={0} r={5} fill={colors.cardBg} stroke={colors.accent} strokeWidth={1.5} />
              <circle cx={6} cy={0} r={2} fill={colors.accent} />
              <text x={18} y={4} style={{ fontSize: 10, fontWeight: 500 }} fill={colors.text}>Outlier</text>
            </g>
          )}
        </g>
      </svg>

      {/* Tooltip */}
      {hoveredIndex !== null && (
        <div 
          className="absolute rounded-xl p-4 min-w-[220px] pointer-events-none z-10 border"
          style={{
            left: `${((hoveredIndex + 0.5) / data.length) * 100}%`,
            top: '25%',
            transform: 'translateX(-50%)',
            backgroundColor: colors.cardBg,
            borderColor: colors.grid,
            boxShadow: `0 20px 40px -10px ${colors.background}80`,
          }}
        >
          <div className="flex items-center gap-3 pb-3 mb-3 border-b" style={{ borderColor: colors.grid }}>
            <div 
              className="w-4 h-4 rounded"
              style={{ backgroundColor: data[hoveredIndex].color || colors.colors[hoveredIndex % colors.colors.length] }}
            />
            <span className="text-sm font-bold" style={{ color: colors.textBright }}>{data[hoveredIndex].label}</span>
          </div>
          
          <div className="space-y-2">
            {/* Five-number summary */}
            <div className="grid grid-cols-5 gap-1 text-center">
              {[
                { label: 'Min', value: data[hoveredIndex].min },
                { label: 'Q1', value: data[hoveredIndex].q1 },
                { label: 'Méd', value: data[hoveredIndex].median, highlight: true },
                { label: 'Q3', value: data[hoveredIndex].q3 },
                { label: 'Max', value: data[hoveredIndex].max },
              ].map((item, i) => (
                <div key={i} className={`rounded py-1 ${item.highlight ? '' : ''}`} style={{ backgroundColor: item.highlight ? colors.grid : 'transparent' }}>
                  <div className="text-[8px] uppercase tracking-wider" style={{ color: colors.text }}>{item.label}</div>
                  <div className="text-[10px] font-bold tabular-nums" style={{ color: item.highlight ? colors.accent : colors.textBright }}>
                    {formatter(item.value)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-2 mt-2 border-t space-y-1.5" style={{ borderColor: colors.grid }}>
              <div className="flex items-center justify-between">
                <span className="text-[10px]" style={{ color: colors.text }}>Écart interquartile</span>
                <span className="text-[11px] font-bold tabular-nums" style={{ color: colors.textBright }}>
                  {formatter(data[hoveredIndex].q3 - data[hoveredIndex].q1)}
                </span>
              </div>
              
              {data[hoveredIndex].mean !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-[10px]" style={{ color: colors.text }}>Moyenne</span>
                  <span className="text-[11px] font-bold tabular-nums" style={{ color: colors.textBright }}>
                    {formatter(data[hoveredIndex].mean)}
                  </span>
                </div>
              )}
              
              {data[hoveredIndex].outliers && data[hoveredIndex].outliers.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-[10px]" style={{ color: colors.text }}>Valeurs aberrantes</span>
                  <span className="text-[11px] font-bold" style={{ color: '#f59e0b' }}>
                    {data[hoveredIndex].outliers.length}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
