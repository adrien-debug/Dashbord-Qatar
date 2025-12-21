import React, { useState, useEffect, useMemo } from 'react';

interface AccumulationData {
  date: string;
  accumulated: number;
  added: number;
  target?: number;
}

interface AccumulationChartProps {
  data: AccumulationData[];
  height?: number;
  showBars?: boolean;
  showMA?: boolean;
  maPeriods?: number[];
  targetValue?: number;
  unit?: string;
  formatValue?: (value: number) => string;
  theme?: 'light' | 'dark';
}

// Palette LUCID - Moderne, Vive et Professionnelle
const THEMES = {
  dark: {
    background: '#0f172a',
    cardBg: '#1e293b',
    chartBg: '#1e293b',
    primary: '#8AFD81',
    primaryGlow: '#8AFD8140',
    secondary: '#22C55E',
    secondaryGlow: '#22C55E40',
    accent: '#4ade80',
    grid: '#334155',
    gridLight: '#475569',
    text: '#94a3b8',
    textBright: '#f1f5f9',
    ma7: '#F97316',
    ma30: '#0EA5E9',
    target: '#A855F7',
    barPositive: '#22C55E',
    barNegative: '#F43F5E',
  },
  light: {
    background: '#f8fafc',
    cardBg: '#ffffff',
    chartBg: '#f8fafc',
    primary: '#22C55E',
    primaryGlow: '#22C55E40',
    secondary: '#16a34a',
    secondaryGlow: '#16a34a40',
    accent: '#15803d',
    grid: '#e2e8f0',
    gridLight: '#cbd5e1',
    text: '#64748b',
    textBright: '#1e293b',
    ma7: '#F97316',
    ma30: '#0EA5E9',
    target: '#A855F7',
    barPositive: '#22C55E',
    barNegative: '#F43F5E',
  },
};

export const AccumulationChart: React.FC<AccumulationChartProps> = ({
  data,
  height = 350,
  showBars = true,
  showMA = true,
  maPeriods = [7, 30],
  targetValue,
  unit = 'BTC',
  formatValue,
  theme = 'light',
}) => {
  const [mounted, setMounted] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [crosshairPos, setCrosshairPos] = useState<{ x: number; y: number } | null>(null);
  const [visibleLayers, setVisibleLayers] = useState({
    area: true,
    bars: true,
    ma7: true,
    ma30: true,
    target: true,
  });

  const colors = THEMES[theme];

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const width = 800;
  const padding = { top: 25, right: 80, bottom: 55, left: 65 };
  const chartWidth = width - padding.left - padding.right;
  const mainChartHeight = showBars ? (height - padding.top - padding.bottom) * 0.72 : height - padding.top - padding.bottom;
  const barsChartHeight = showBars ? (height - padding.top - padding.bottom) * 0.22 : 0;
  const gapBetweenCharts = 8;
  const pointSpacing = chartWidth / (data.length - 1 || 1);

  const defaultFormatValue = (value: number) => {
    if (value >= 1000) {
      return `${value.toLocaleString('fr-FR')} ${unit}`;
    }
    return `${value.toFixed(2)} ${unit}`;
  };

  const formatter = formatValue || defaultFormatValue;

  // Calculate accumulated value range
  const accumulatedValues = data.map(d => d.accumulated);
  const minAccumulated = Math.min(...accumulatedValues);
  const maxAccumulated = Math.max(...accumulatedValues, targetValue || 0);
  const accRange = maxAccumulated - minAccumulated;
  const accPadding = accRange * 0.12;

  // Calculate added values range (for bars)
  const addedValues = data.map(d => d.added);
  const maxAdded = Math.max(...addedValues.map(Math.abs));

  // Scale functions
  const scaleY = (value: number) => {
    return padding.top + mainChartHeight - ((value - minAccumulated + accPadding) / (accRange + 2 * accPadding)) * mainChartHeight;
  };

  const scaleBarY = (value: number) => {
    const barTop = padding.top + mainChartHeight + gapBetweenCharts;
    const barMid = barTop + barsChartHeight / 2;
    return barMid - (value / maxAdded) * (barsChartHeight / 2 - 5);
  };

  const scaleX = (index: number) => {
    return padding.left + index * pointSpacing;
  };

  // Calculate Moving Averages
  const calculateMA = (period: number): number[] => {
    return data.map((_, index) => {
      if (index < period - 1) return NaN;
      const slice = data.slice(index - period + 1, index + 1);
      return slice.reduce((sum, d) => sum + d.accumulated, 0) / period;
    });
  };

  const maData = useMemo(() => {
    return maPeriods.map((period) => ({
      period,
      values: calculateMA(period),
      color: period <= 10 ? colors.ma7 : colors.ma30,
      label: `MA${period}`,
    }));
  }, [data, maPeriods, colors]);

  // Generate area path
  const generateAreaPath = () => {
    if (!visibleLayers.area) return '';
    const points = data.map((d, i) => `${scaleX(i)},${scaleY(d.accumulated)}`).join(' L ');
    const bottomLine = `L ${scaleX(data.length - 1)},${scaleY(minAccumulated - accPadding)} L ${scaleX(0)},${scaleY(minAccumulated - accPadding)}`;
    return `M ${points} ${bottomLine} Z`;
  };

  // Generate line path
  const generateLinePath = () => {
    if (!visibleLayers.area) return '';
    return data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(i)},${scaleY(d.accumulated)}`).join(' ');
  };

  // Generate MA line paths
  const generateMAPath = (values: number[]) => {
    const points = values
      .map((value, index) => {
        if (isNaN(value)) return null;
        return `${scaleX(index)},${scaleY(value)}`;
      })
      .filter(Boolean);
    
    if (points.length < 2) return '';
    return `M ${points.join(' L ')}`;
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * width;
    const y = ((e.clientY - rect.top) / rect.height) * height;
    
    const index = Math.round((x - padding.left) / pointSpacing);
    if (index >= 0 && index < data.length) {
      setHoveredIndex(index);
      setCrosshairPos({ x: scaleX(index), y });
    }
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setCrosshairPos(null);
  };

  const toggleLayer = (layer: keyof typeof visibleLayers) => {
    setVisibleLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  // Calculate statistics
  const lastPoint = data[data.length - 1];
  const firstPoint = data[0];
  const totalGrowth = lastPoint.accumulated - firstPoint.accumulated;
  const growthPercent = ((totalGrowth / firstPoint.accumulated) * 100).toFixed(1);
  const avgAddition = data.reduce((sum, d) => sum + d.added, 0) / data.length;

  return (
    <div className="w-full relative rounded-xl overflow-hidden border" style={{ height, backgroundColor: colors.cardBg, borderColor: colors.grid }}>
      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          {/* Area gradient */}
          <linearGradient id="acc-area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.primary} stopOpacity={0.4} />
            <stop offset="50%" stopColor={colors.primary} stopOpacity={0.15} />
            <stop offset="100%" stopColor={colors.primary} stopOpacity={0.02} />
          </linearGradient>
          
          {/* Line gradient */}
          <linearGradient id="acc-line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.secondary} />
            <stop offset="50%" stopColor={colors.primary} />
            <stop offset="100%" stopColor={colors.accent} />
          </linearGradient>

          {/* Bar gradients */}
          <linearGradient id="acc-bar-positive" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.barPositive} stopOpacity={0.8} />
            <stop offset="100%" stopColor={colors.barPositive} stopOpacity={0.3} />
          </linearGradient>
          <linearGradient id="acc-bar-negative" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={colors.barNegative} stopOpacity={0.8} />
            <stop offset="100%" stopColor={colors.barNegative} stopOpacity={0.3} />
          </linearGradient>

          {/* Glow filter */}
          <filter id="acc-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Point glow */}
          <filter id="acc-point-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Grid lines horizontales */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const value = minAccumulated - accPadding + (accRange + 2 * accPadding) * ratio;
          const y = scaleY(value);
          return (
            <g key={i}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke={colors.grid}
                strokeWidth={1}
                strokeOpacity={0.5}
                strokeDasharray={i === 2 ? "none" : "4 4"}
              />
              <text
                x={width - padding.right + 10}
                y={y + 4}
                style={{ fontSize: 10, fontWeight: 600 }}
                fill={colors.text}
              >
                {formatter(value)}
              </text>
            </g>
          );
        })}

        {/* Target line */}
        {targetValue && visibleLayers.target && targetValue >= minAccumulated - accPadding && targetValue <= maxAccumulated + accPadding && (
          <g style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.5s' }}>
            <line
              x1={padding.left}
              y1={scaleY(targetValue)}
              x2={width - padding.right}
              y2={scaleY(targetValue)}
              stroke={colors.target}
              strokeWidth={2}
              strokeDasharray="10 5"
            />
            <rect
              x={padding.left}
              y={scaleY(targetValue) - 12}
              width={90}
              height={24}
              rx={6}
              fill={colors.target}
            />
            <text
              x={padding.left + 45}
              y={scaleY(targetValue) + 4}
              textAnchor="middle"
              style={{ fontSize: 10, fontWeight: 700 }}
              fill="white"
            >
              Target Annuel
            </text>
          </g>
        )}

        {/* Area fill */}
        <path
          d={generateAreaPath()}
          fill="url(#acc-area-gradient)"
          style={{
            opacity: mounted && visibleLayers.area ? 1 : 0,
            transition: 'opacity 0.8s ease-out',
          }}
        />

        {/* Main line */}
        <path
          d={generateLinePath()}
          fill="none"
          stroke="url(#acc-line-gradient)"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            opacity: mounted && visibleLayers.area ? 1 : 0,
            transition: 'opacity 0.5s ease-out',
            filter: 'drop-shadow(0 0 6px rgba(138, 253, 129, 0.4))',
          }}
        />

        {/* Moving Average lines */}
        {showMA && maData.map((ma, idx) => {
          const isVisible = idx === 0 ? visibleLayers.ma7 : visibleLayers.ma30;
          return (
            <path
              key={ma.period}
              d={generateMAPath(ma.values)}
              fill="none"
              stroke={ma.color}
              strokeWidth={2}
              strokeLinecap="round"
              strokeDasharray={idx === 1 ? "6 3" : "none"}
              style={{ 
                opacity: mounted && isVisible ? 0.85 : 0, 
                transition: 'opacity 0.5s' 
              }}
            />
          );
        })}

        {/* Data points */}
        {data.map((point, index) => {
          const isHovered = hoveredIndex === index;
          const x = scaleX(index);
          const y = scaleY(point.accumulated);

          return (
            <g key={`point-${index}`}>
              {/* Point outer glow */}
              {isHovered && (
                <circle
                  cx={x}
                  cy={y}
                  r={12}
                  fill={colors.primary}
                  fillOpacity={0.2}
                  style={{ transition: 'all 0.2s' }}
                />
              )}
              {/* Point */}
              <circle
                cx={x}
                cy={y}
                r={isHovered ? 6 : (index === data.length - 1 ? 5 : 3)}
                fill={isHovered ? colors.primary : (index === data.length - 1 ? colors.primary : colors.secondary)}
                stroke={colors.cardBg}
                strokeWidth={2}
                filter={isHovered ? 'url(#acc-point-glow)' : undefined}
                style={{
                  opacity: mounted ? 1 : 0,
                  transition: `opacity 0.4s ease-out ${index * 0.02}s, r 0.15s ease-out`,
                }}
              />
            </g>
          );
        })}

        {/* Addition bars */}
        {showBars && visibleLayers.bars && (
          <g>
            <text
              x={padding.left}
              y={padding.top + mainChartHeight + gapBetweenCharts + 12}
              style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}
              fill={colors.text}
            >
              Additions Mensuelles
            </text>
            {/* Zero line */}
            <line
              x1={padding.left}
              y1={scaleBarY(0)}
              x2={width - padding.right}
              y2={scaleBarY(0)}
              stroke={colors.gridLight}
              strokeWidth={1}
            />
            {data.map((point, index) => {
              const barWidth = Math.max(8, pointSpacing * 0.5);
              const x = scaleX(index) - barWidth / 2;
              const isPositive = point.added >= 0;
              const barHeight = Math.abs((point.added / maxAdded) * (barsChartHeight / 2 - 10));
              const y = isPositive ? scaleBarY(point.added) : scaleBarY(0);
              const isHovered = hoveredIndex === index;

              return (
                <rect
                  key={`bar-${index}`}
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight || 1}
                  rx={2}
                  fill={isPositive ? 'url(#acc-bar-positive)' : 'url(#acc-bar-negative)'}
                  style={{
                    opacity: mounted ? (isHovered ? 1 : 0.7) : 0,
                    transition: `opacity 0.3s ease-out ${index * 0.02}s`,
                    transform: isHovered ? 'scaleY(1.1)' : 'scaleY(1)',
                    transformOrigin: `${x + barWidth / 2}px ${scaleBarY(0)}px`,
                  }}
                />
              );
            })}
          </g>
        )}

        {/* Crosshair */}
        {crosshairPos && hoveredIndex !== null && (
          <>
            <line
              x1={crosshairPos.x}
              y1={padding.top}
              x2={crosshairPos.x}
              y2={padding.top + mainChartHeight}
              stroke={colors.textBright}
              strokeWidth={1}
              strokeDasharray="4 4"
              strokeOpacity={0.5}
            />
            <line
              x1={padding.left}
              y1={scaleY(data[hoveredIndex].accumulated)}
              x2={width - padding.right}
              y2={scaleY(data[hoveredIndex].accumulated)}
              stroke={colors.textBright}
              strokeWidth={1}
              strokeDasharray="4 4"
              strokeOpacity={0.5}
            />
            
            {/* Date label */}
            <g>
              <rect
                x={crosshairPos.x - 40}
                y={height - padding.bottom + 18}
                width={80}
                height={24}
                rx={6}
                fill={colors.primary}
              />
              <text
                x={crosshairPos.x}
                y={height - padding.bottom + 34}
                textAnchor="middle"
                style={{ fontSize: 10, fontWeight: 700 }}
                fill={colors.background}
              >
                {data[hoveredIndex].date}
              </text>
            </g>

            {/* Value label */}
            <g>
              <rect
                x={width - padding.right + 4}
                y={scaleY(data[hoveredIndex].accumulated) - 12}
                width={72}
                height={24}
                rx={6}
                fill={colors.primary}
              />
              <text
                x={width - padding.right + 40}
                y={scaleY(data[hoveredIndex].accumulated) + 4}
                textAnchor="middle"
                style={{ fontSize: 10, fontWeight: 700 }}
                fill={colors.background}
              >
                {data[hoveredIndex].accumulated.toFixed(1)} {unit}
              </text>
            </g>
          </>
        )}

        {/* X-axis labels */}
        {data.filter((_, i) => i % Math.ceil(data.length / 6) === 0 || i === data.length - 1).map((point, idx, arr) => {
          const originalIndex = data.indexOf(point);
          return (
            <text
              key={originalIndex}
              x={scaleX(originalIndex)}
              y={height - 10}
              textAnchor="middle"
              style={{ fontSize: 10, fontWeight: 500 }}
              fill={colors.text}
            >
              {point.date}
            </text>
          );
        })}
      </svg>

      {/* Tooltip détaillé */}
      {hoveredIndex !== null && (
        <div 
          className="absolute rounded-xl p-4 min-w-[220px] pointer-events-none z-20 border"
          style={{
            left: scaleX(hoveredIndex) > width / 2 ? scaleX(hoveredIndex) - 240 : scaleX(hoveredIndex) + 20,
            top: 25,
            backgroundColor: colors.cardBg,
            borderColor: colors.grid,
            boxShadow: `0 20px 40px -10px ${colors.background}80`,
          }}
        >
          <div className="flex items-center justify-between pb-3 mb-3 border-b" style={{ borderColor: colors.grid }}>
            <div className="flex items-center gap-2">
              <div 
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: colors.primary }}
              />
              <span className="text-sm font-bold" style={{ color: colors.textBright }}>{data[hoveredIndex].date}</span>
            </div>
            <span 
              className="text-[10px] font-bold px-2 py-1 rounded-full"
              style={{ 
                backgroundColor: data[hoveredIndex].added >= 0 ? `${colors.barPositive}20` : `${colors.barNegative}20`,
                color: data[hoveredIndex].added >= 0 ? colors.barPositive : colors.barNegative,
              }}
            >
              {data[hoveredIndex].added >= 0 ? '▲' : '▼'} {data[hoveredIndex].added >= 0 ? '+' : ''}{data[hoveredIndex].added.toFixed(2)} {unit}
            </span>
          </div>
          
          <div className="space-y-3">
            <div>
              <span className="text-[9px] uppercase tracking-wider font-medium" style={{ color: colors.text }}>Total Accumulé</span>
              <p className="text-xl font-bold tabular-nums" style={{ color: colors.primary }}>{formatter(data[hoveredIndex].accumulated)}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[9px] uppercase tracking-wider font-medium" style={{ color: colors.text }}>Addition</span>
                <p className="text-sm font-bold tabular-nums" style={{ color: data[hoveredIndex].added >= 0 ? colors.barPositive : colors.barNegative }}>
                  {data[hoveredIndex].added >= 0 ? '+' : ''}{data[hoveredIndex].added.toFixed(2)} {unit}
                </p>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider font-medium" style={{ color: colors.text }}>Progression</span>
                <p className="text-sm font-bold tabular-nums" style={{ color: colors.textBright }}>
                  {((data[hoveredIndex].accumulated / (targetValue || maxAccumulated)) * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            {/* MA Values */}
            {showMA && maData.some(ma => !isNaN(ma.values[hoveredIndex])) && (
              <div className="pt-3 border-t" style={{ borderColor: colors.grid }}>
                <div className="grid grid-cols-2 gap-2">
                  {maData.map((ma) => {
                    const maValue = ma.values[hoveredIndex];
                    if (isNaN(maValue)) return null;
                    return (
                      <div key={ma.period}>
                        <span className="text-[9px] uppercase tracking-wider font-medium" style={{ color: colors.text }}>{ma.label}</span>
                        <p className="text-sm font-bold tabular-nums" style={{ color: ma.color }}>{maValue.toFixed(2)} {unit}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Legend interactive */}
      <div 
        className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-xl border"
        style={{ 
          backgroundColor: `${colors.background}95`,
          borderColor: colors.grid,
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Area toggle */}
        <button 
          onClick={() => toggleLayer('area')}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all ${visibleLayers.area ? 'opacity-100' : 'opacity-40'}`}
          style={{ backgroundColor: visibleLayers.area ? `${colors.primary}15` : 'transparent' }}
        >
          <div className="w-4 h-2 rounded-sm" style={{ background: `linear-gradient(to right, ${colors.secondary}, ${colors.primary})` }} />
          <span className="text-[10px] font-semibold" style={{ color: colors.text }}>Accumulation</span>
        </button>

        <div className="w-px h-4" style={{ backgroundColor: colors.gridLight }} />

        {/* Bars toggle */}
        {showBars && (
          <button 
            onClick={() => toggleLayer('bars')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all ${visibleLayers.bars ? 'opacity-100' : 'opacity-40'}`}
            style={{ backgroundColor: visibleLayers.bars ? `${colors.barPositive}15` : 'transparent' }}
          >
            <div className="flex gap-0.5">
              <div className="w-1 h-3 rounded-sm" style={{ backgroundColor: colors.barPositive }} />
              <div className="w-1 h-2 rounded-sm" style={{ backgroundColor: colors.barNegative }} />
            </div>
            <span className="text-[10px] font-semibold" style={{ color: colors.text }}>Additions</span>
          </button>
        )}

        <div className="w-px h-4" style={{ backgroundColor: colors.gridLight }} />

        {/* MA toggles */}
        {showMA && maData.map((ma, idx) => {
          const layerKey = idx === 0 ? 'ma7' : 'ma30';
          const isVisible = visibleLayers[layerKey as keyof typeof visibleLayers];
          return (
            <button 
              key={ma.period}
              onClick={() => toggleLayer(layerKey as keyof typeof visibleLayers)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all ${isVisible ? 'opacity-100' : 'opacity-40'}`}
              style={{ backgroundColor: isVisible ? `${ma.color}15` : 'transparent' }}
            >
              <div className="w-4 h-0.5 rounded-full" style={{ backgroundColor: ma.color, opacity: isVisible ? 1 : 0.4 }} />
              <span className="text-[10px] font-semibold" style={{ color: colors.text }}>{ma.label}</span>
            </button>
          );
        })}

        {/* Target toggle */}
        {targetValue && (
          <>
            <div className="w-px h-4" style={{ backgroundColor: colors.gridLight }} />
            <button 
              onClick={() => toggleLayer('target')}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all ${visibleLayers.target ? 'opacity-100' : 'opacity-40'}`}
              style={{ backgroundColor: visibleLayers.target ? `${colors.target}15` : 'transparent' }}
            >
              <div 
                className="w-4 h-0.5" 
                style={{ 
                  backgroundColor: colors.target,
                  backgroundImage: `repeating-linear-gradient(90deg, ${colors.target}, ${colors.target} 2px, transparent 2px, transparent 4px)`,
                }} 
              />
              <span className="text-[10px] font-semibold" style={{ color: colors.text }}>Target</span>
            </button>
          </>
        )}
      </div>

      {/* Stats badge top-right */}
      <div 
        className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-lg border"
        style={{ 
          backgroundColor: `${colors.primary}10`,
          borderColor: `${colors.primary}30`,
        }}
      >
        <span className="text-[10px] font-medium" style={{ color: colors.text }}>Croissance</span>
        <span className="text-sm font-bold" style={{ color: colors.primary }}>+{growthPercent}%</span>
      </div>
    </div>
  );
};

