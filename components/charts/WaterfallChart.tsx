import React, { useState, useEffect } from 'react';

interface WaterfallDataPoint {
  name: string;
  value: number;
  type: 'start' | 'positive' | 'negative' | 'total';
  color?: string;
}

interface WaterfallChartProps {
  data: WaterfallDataPoint[];
  height?: number;
  showConnectors?: boolean;
  showLabels?: boolean;
  showValues?: boolean;
  unit?: string;
  formatValue?: (value: number) => string;
  positiveColor?: string;
  negativeColor?: string;
  totalColor?: string;
}

export const WaterfallChart: React.FC<WaterfallChartProps> = ({
  data,
  height = 400,
  showConnectors = true,
  showLabels = true,
  showValues = true,
  unit = '$',
  formatValue,
  positiveColor = '#8AFD81',
  negativeColor = '#f59e0b',
  totalColor = '#3b82f6',
}) => {
  const [mounted, setMounted] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Calculate cumulative values and positions
  const processedData = data.reduce((acc, item, index) => {
    const prev = acc[index - 1];
    
    let start = 0;
    let end = 0;
    
    if (item.type === 'start') {
      start = 0;
      end = item.value;
    } else if (item.type === 'total') {
      start = 0;
      end = item.value;
    } else if (item.type === 'positive') {
      start = prev?.end || 0;
      end = start + item.value;
    } else if (item.type === 'negative') {
      start = prev?.end || 0;
      end = start - Math.abs(item.value);
    }
    
    acc.push({
      ...item,
      start,
      end,
      displayValue: item.type === 'negative' ? -Math.abs(item.value) : item.value,
    });
    
    return acc;
  }, [] as Array<WaterfallDataPoint & { start: number; end: number; displayValue: number }>);

  // Calculate scale
  const allValues = processedData.flatMap(d => [d.start, d.end]);
  const minValue = Math.min(0, ...allValues);
  const maxValue = Math.max(...allValues);
  const range = maxValue - minValue;
  const padding = range * 0.1;

  const chartHeight = height - 100; // Leave room for labels
  const chartWidth = 800;
  const barWidth = (chartWidth - 100) / data.length - 20;
  const startX = 60;

  const scaleY = (value: number) => {
    return chartHeight - ((value - minValue + padding) / (range + 2 * padding)) * chartHeight + 30;
  };

  const defaultFormatValue = (value: number) => {
    if (Math.abs(value) >= 1000000) {
      return `${unit}${(value / 1000000).toFixed(1)}M`;
    } else if (Math.abs(value) >= 1000) {
      return `${unit}${(value / 1000).toFixed(0)}K`;
    }
    return `${unit}${value.toFixed(0)}`;
  };

  const formatter = formatValue || defaultFormatValue;

  const getBarColor = (item: typeof processedData[0]) => {
    if (item.color) return item.color;
    switch (item.type) {
      case 'start':
      case 'positive':
        return positiveColor;
      case 'negative':
        return negativeColor;
      case 'total':
        return totalColor;
      default:
        return positiveColor;
    }
  };

  return (
    <div className="w-full relative" style={{ height }}>
      <svg 
        viewBox={`0 0 ${chartWidth} ${height}`} 
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Gradients for each bar type */}
          <linearGradient id="waterfall-positive-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={positiveColor} stopOpacity={1} />
            <stop offset="100%" stopColor={positiveColor} stopOpacity={0.7} />
          </linearGradient>
          <linearGradient id="waterfall-negative-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={negativeColor} stopOpacity={1} />
            <stop offset="100%" stopColor={negativeColor} stopOpacity={0.7} />
          </linearGradient>
          <linearGradient id="waterfall-total-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={totalColor} stopOpacity={1} />
            <stop offset="100%" stopColor={totalColor} stopOpacity={0.7} />
          </linearGradient>
          
          {/* Glow filters */}
          <filter id="waterfall-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Drop shadow */}
          <filter id="waterfall-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.1"/>
          </filter>
        </defs>

        {/* Y-Axis */}
        <line 
          x1={startX - 10} 
          y1={30} 
          x2={startX - 10} 
          y2={chartHeight + 30} 
          stroke="#e2e8f0" 
          strokeWidth={1}
        />
        
        {/* Y-Axis labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const value = minValue - padding + (range + 2 * padding) * ratio;
          const y = chartHeight - ratio * chartHeight + 30;
          return (
            <g key={i}>
              <line 
                x1={startX - 15} 
                y1={y} 
                x2={startX - 5} 
                y2={y} 
                stroke="#cbd5e1" 
                strokeWidth={1}
              />
              <text 
                x={startX - 20} 
                y={y + 4} 
                textAnchor="end" 
                className="text-[10px] fill-slate-500"
              >
                {formatter(value)}
              </text>
              {/* Grid line */}
              <line 
                x1={startX} 
                y1={y} 
                x2={chartWidth - 20} 
                y2={y} 
                stroke="#f1f5f9" 
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            </g>
          );
        })}

        {/* Zero line */}
        <line 
          x1={startX} 
          y1={scaleY(0)} 
          x2={chartWidth - 20} 
          y2={scaleY(0)} 
          stroke="#94a3b8" 
          strokeWidth={1}
          strokeDasharray="6 3"
        />

        {/* Connectors */}
        {showConnectors && processedData.map((item, index) => {
          if (index === 0) return null;
          const prev = processedData[index - 1];
          const prevX = startX + (index - 1) * (barWidth + 20) + barWidth;
          const currX = startX + index * (barWidth + 20);
          const y = scaleY(prev.end);
          
          return (
            <line
              key={`connector-${index}`}
              x1={prevX}
              y1={y}
              x2={currX}
              y2={y}
              stroke="#cbd5e1"
              strokeWidth={1}
              strokeDasharray="4 2"
              className="transition-opacity duration-300"
              style={{ opacity: mounted ? 1 : 0 }}
            />
          );
        })}

        {/* Bars */}
        {processedData.map((item, index) => {
          const x = startX + index * (barWidth + 20);
          const barTop = Math.min(scaleY(item.start), scaleY(item.end));
          const barBottom = Math.max(scaleY(item.start), scaleY(item.end));
          const barHeight = barBottom - barTop;
          const isHovered = hoveredIndex === index;
          
          const gradientId = item.type === 'negative' 
            ? 'waterfall-negative-gradient' 
            : item.type === 'total' 
              ? 'waterfall-total-gradient' 
              : 'waterfall-positive-gradient';

          return (
            <g 
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="cursor-pointer"
            >
              {/* Bar */}
              <rect
                x={x}
                y={mounted ? barTop : scaleY(0)}
                width={barWidth}
                height={mounted ? Math.max(barHeight, 2) : 0}
                rx={4}
                fill={`url(#${gradientId})`}
                filter={isHovered ? 'url(#waterfall-glow)' : 'url(#waterfall-shadow)'}
                className="transition-all duration-700 ease-out"
                style={{
                  transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                  transformOrigin: `${x + barWidth / 2}px ${barTop + barHeight / 2}px`,
                }}
              />
              
              {/* Highlight overlay on hover */}
              {isHovered && (
                <rect
                  x={x}
                  y={barTop}
                  width={barWidth}
                  height={barHeight}
                  rx={4}
                  fill="white"
                  fillOpacity={0.2}
                  className="pointer-events-none"
                />
              )}

              {/* Value label on bar */}
              {showValues && (
                <text
                  x={x + barWidth / 2}
                  y={item.type === 'negative' ? barBottom + 16 : barTop - 8}
                  textAnchor="middle"
                  className={`text-xs font-bold transition-all duration-500 ${
                    item.type === 'negative' ? 'fill-amber-600' : 
                    item.type === 'total' ? 'fill-blue-600' : 'fill-emerald-600'
                  }`}
                  style={{ 
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateY(0)' : 'translateY(10px)',
                  }}
                >
                  {item.type === 'negative' ? '-' : item.type === 'positive' ? '+' : ''}
                  {formatter(Math.abs(item.value))}
                </text>
              )}

              {/* X-axis label */}
              {showLabels && (
                <text
                  x={x + barWidth / 2}
                  y={height - 15}
                  textAnchor="middle"
                  className="text-[11px] font-medium fill-slate-600"
                  style={{
                    opacity: mounted ? 1 : 0,
                  }}
                >
                  {item.name}
                </text>
              )}

              {/* Arrow indicator for negative values */}
              {item.type === 'negative' && (
                <path
                  d={`M ${x + barWidth / 2 - 6} ${barTop - 15} L ${x + barWidth / 2} ${barTop - 5} L ${x + barWidth / 2 + 6} ${barTop - 15}`}
                  fill="none"
                  stroke={negativeColor}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-opacity duration-500"
                  style={{ opacity: mounted ? 0.7 : 0 }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hoveredIndex !== null && (
        <div 
          className="absolute bg-white border border-slate-200 rounded-lg shadow-xl p-4 min-w-[200px] pointer-events-none z-10"
          style={{
            left: `${((hoveredIndex + 0.5) / data.length) * 100}%`,
            top: '20%',
            transform: 'translateX(-50%)',
          }}
        >
          <div className="border-b border-slate-100 pb-2 mb-3">
            <p className="text-sm font-semibold text-slate-900">
              {processedData[hoveredIndex].name}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-slate-600">Valeur</span>
              <span className={`text-sm font-bold tabular-nums ${
                processedData[hoveredIndex].type === 'negative' ? 'text-amber-600' : 
                processedData[hoveredIndex].type === 'total' ? 'text-blue-600' : 'text-emerald-600'
              }`}>
                {processedData[hoveredIndex].type === 'negative' ? '-' : ''}
                {formatter(Math.abs(processedData[hoveredIndex].value))}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-slate-600">Cumul</span>
              <span className="text-sm font-bold text-slate-900 tabular-nums">
                {formatter(processedData[hoveredIndex].end)}
              </span>
            </div>
            {processedData[hoveredIndex].type !== 'start' && processedData[hoveredIndex].type !== 'total' && (
              <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-500">Impact</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  processedData[hoveredIndex].type === 'negative' 
                    ? 'bg-amber-50 text-amber-700' 
                    : 'bg-emerald-50 text-emerald-700'
                }`}>
                  {processedData[hoveredIndex].type === 'negative' ? '↓' : '↑'} 
                  {((Math.abs(processedData[hoveredIndex].value) / processedData[0].value) * 100).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 rounded" style={{ background: `linear-gradient(180deg, ${positiveColor}, ${positiveColor}cc)` }} />
          <span className="text-xs text-slate-600">Gains</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 rounded" style={{ background: `linear-gradient(180deg, ${negativeColor}, ${negativeColor}cc)` }} />
          <span className="text-xs text-slate-600">Déductions</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 rounded" style={{ background: `linear-gradient(180deg, ${totalColor}, ${totalColor}cc)` }} />
          <span className="text-xs text-slate-600">Total</span>
        </div>
      </div>
    </div>
  );
};

