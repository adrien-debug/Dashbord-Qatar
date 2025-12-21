import React, { useState, useEffect, useMemo } from 'react';

interface CandleData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

interface CandlestickChartProps {
  data: CandleData[];
  height?: number;
  showVolume?: boolean;
  showMA?: boolean;
  maPeriods?: number[];
  breakevenPrice?: number;
  unit?: string;
  formatValue?: (value: number) => string;
  theme?: 'light' | 'dark';
}

// Palette HEARST QATAR - Unifiée avec le thème principal
const THEMES = {
  dark: {
    background: '#0f172a',
    cardBg: '#1e293b',
    chartBg: '#1e293b',
    bullish: '#8AFD81',           // Hearst Green
    bullishGlow: '#8AFD8140',
    bearish: '#64748b',           // Slate Gray
    bearishGlow: '#64748b40',
    grid: '#334155',
    gridLight: '#475569',
    text: '#94a3b8',
    textBright: '#f1f5f9',
    ma7: '#94a3b8',               // Slate light
    ma20: '#64748b',              // Slate medium
    ma50: '#475569',              // Slate dark
    breakeven: '#64748b',         // Slate
  },
  light: {
    background: '#f8fafc',
    cardBg: '#ffffff',
    chartBg: '#ffffff',
    bullish: '#8AFD81',           // Hearst Green
    bullishGlow: '#8AFD8140',
    bearish: '#cbd5e1',           // Slate light
    bearishGlow: '#cbd5e140',
    grid: '#e2e8f0',
    gridLight: '#cbd5e1',
    text: '#64748b',
    textBright: '#1e293b',
    ma7: '#94a3b8',               // Slate light
    ma20: '#64748b',              // Slate medium
    ma50: '#475569',              // Slate dark
    breakeven: '#64748b',         // Slate
  },
};

export const CandlestickChart: React.FC<CandlestickChartProps> = ({
  data,
  height = 450,
  showVolume = true,
  showMA = true,
  maPeriods = [7, 30],
  breakevenPrice,
  unit = '$',
  formatValue,
  theme = 'dark',
}) => {
  const [mounted, setMounted] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [crosshairPos, setCrosshairPos] = useState<{ x: number; y: number } | null>(null);

  const colors = THEMES[theme];

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const width = 800;
  const padding = { top: 20, right: 75, bottom: 60, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const mainChartHeight = showVolume ? (height - padding.top - padding.bottom) * 0.72 : height - padding.top - padding.bottom;
  const volumeChartHeight = showVolume ? (height - padding.top - padding.bottom) * 0.2 : 0;
  const gapBetweenCharts = 12;
  const candleWidth = Math.max(5, (chartWidth / data.length) * 0.6);
  const candleGap = (chartWidth / data.length) * 0.4;

  const defaultFormatValue = (value: number) => {
    if (value >= 1000) {
      return `${unit}${value.toLocaleString('fr-FR')}`;
    }
    return `${unit}${value.toFixed(0)}`;
  };

  const formatter = formatValue || defaultFormatValue;

  // Calculate price range
  const allPrices = data.flatMap(d => [d.high, d.low]);
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  const priceRange = maxPrice - minPrice;
  const pricePadding = priceRange * 0.08;

  // Calculate volume range
  const volumes = data.map(d => d.volume || 0);
  const maxVolume = Math.max(...volumes);

  // Scale functions
  const scaleY = (price: number) => {
    return padding.top + mainChartHeight - ((price - minPrice + pricePadding) / (priceRange + 2 * pricePadding)) * mainChartHeight;
  };

  const scaleVolumeY = (volume: number) => {
    const volumeTop = padding.top + mainChartHeight + gapBetweenCharts;
    return volumeTop + volumeChartHeight - (volume / maxVolume) * volumeChartHeight;
  };

  const scaleX = (index: number) => {
    return padding.left + index * (candleWidth + candleGap) + candleWidth / 2;
  };

  // Calculate Moving Averages
  const calculateMA = (period: number): number[] => {
    return data.map((_, index) => {
      if (index < period - 1) return NaN;
      const slice = data.slice(index - period + 1, index + 1);
      return slice.reduce((sum, d) => sum + d.close, 0) / period;
    });
  };

  // Mapping couleurs pour les moyennes mobiles (supporte jusqu'à 3 périodes)
  const getMAColor = (index: number, period: number) => {
    if (period <= 10) return colors.ma7;      // Court terme (7-10)
    if (period <= 25) return colors.ma20;     // Moyen terme (20-25)
    return colors.ma50;                        // Long terme (50+)
  };

  const maData = useMemo(() => {
    return maPeriods.map((period, i) => ({
      period,
      values: calculateMA(period),
      color: getMAColor(i, period),
      label: `MM${period}`,
    }));
  }, [data, maPeriods, colors]);

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
    
    const index = Math.floor((x - padding.left) / (candleWidth + candleGap));
    if (index >= 0 && index < data.length) {
      setHoveredIndex(index);
      setCrosshairPos({ x: scaleX(index), y });
    }
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setCrosshairPos(null);
  };

  // Calculate stats
  const lastCandle = data[data.length - 1];
  const firstCandle = data[0];
  const priceChange = lastCandle.close - firstCandle.open;
  const priceChangePercent = ((priceChange / firstCandle.open) * 100).toFixed(2);
  const isOverallBullish = priceChange >= 0;

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
          {/* Gradients Bullish */}
          <linearGradient id="candle-bull-body" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.bullish} stopOpacity={1} />
            <stop offset="100%" stopColor={colors.bullish} stopOpacity={0.8} />
          </linearGradient>
          <linearGradient id="volume-bull" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.bullish} stopOpacity={0.5} />
            <stop offset="100%" stopColor={colors.bullish} stopOpacity={0.1} />
          </linearGradient>
          
          {/* Gradients Bearish */}
          <linearGradient id="candle-bear-body" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.bearish} stopOpacity={1} />
            <stop offset="100%" stopColor={colors.bearish} stopOpacity={0.7} />
          </linearGradient>
          <linearGradient id="volume-bear" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.bearish} stopOpacity={0.4} />
            <stop offset="100%" stopColor={colors.bearish} stopOpacity={0.1} />
          </linearGradient>
          
          {/* Glow filters */}
          <filter id="glow-bull" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="glow-bear" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Grid lines horizontales */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const price = minPrice - pricePadding + (priceRange + 2 * pricePadding) * ratio;
          const y = scaleY(price);
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
              />
              <text
                x={width - padding.right + 8}
                y={y + 4}
                style={{ fontSize: 10, fontWeight: 500 }}
                fill={colors.text}
              >
                {formatter(price)}
              </text>
            </g>
          );
        })}

        {/* Breakeven / Seuil de rentabilité */}
        {breakevenPrice && breakevenPrice >= minPrice - pricePadding && breakevenPrice <= maxPrice + pricePadding && (
          <g>
            <line
              x1={padding.left}
              y1={scaleY(breakevenPrice)}
              x2={width - padding.right}
              y2={scaleY(breakevenPrice)}
              stroke={colors.breakeven}
              strokeWidth={2}
              strokeDasharray="8 4"
            />
            <rect
              x={padding.left}
              y={scaleY(breakevenPrice) - 12}
              width={95}
              height={24}
              rx={4}
              fill={colors.breakeven}
            />
            <text
              x={padding.left + 48}
              y={scaleY(breakevenPrice) + 4}
              textAnchor="middle"
              style={{ fontSize: 10, fontWeight: 700 }}
              fill="white"
            >
              Seuil Rentabilité
            </text>
          </g>
        )}

        {/* Moving Average lines */}
        {showMA && maData.map((ma) => (
          <path
            key={ma.period}
            d={generateMAPath(ma.values)}
            fill="none"
            stroke={ma.color}
            strokeWidth={2}
            strokeLinecap="round"
            style={{ opacity: mounted ? 0.9 : 0, transition: 'opacity 0.5s' }}
          />
        ))}

        {/* Volume bars */}
        {showVolume && (
          <g>
            <text
              x={padding.left}
              y={padding.top + mainChartHeight + gapBetweenCharts + 12}
              style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}
              fill={colors.text}
            >
              Volume
            </text>
            {data.map((candle, index) => {
              const isBullish = candle.close >= candle.open;
              const x = scaleX(index) - candleWidth / 2;
              const volHeight = ((candle.volume || 0) / maxVolume) * (volumeChartHeight - 15);
              const isHovered = hoveredIndex === index;

              return (
                <rect
                  key={`vol-${index}`}
                  x={x}
                  y={padding.top + mainChartHeight + gapBetweenCharts + volumeChartHeight - volHeight}
                  width={candleWidth}
                  height={volHeight}
                  fill={isBullish ? 'url(#volume-bull)' : 'url(#volume-bear)'}
                  rx={1}
                  style={{ 
                    opacity: mounted ? (isHovered ? 1 : 0.7) : 0,
                    transition: 'opacity 0.2s',
                  }}
                />
              );
            })}
          </g>
        )}

        {/* Candlesticks */}
        {data.map((candle, index) => {
          const isBullish = candle.close >= candle.open;
          const x = scaleX(index);
          const bodyTop = scaleY(Math.max(candle.open, candle.close));
          const bodyBottom = scaleY(Math.min(candle.open, candle.close));
          const bodyHeight = Math.max(bodyBottom - bodyTop, 2);
          const isHovered = hoveredIndex === index;
          const candleColor = isBullish ? colors.bullish : colors.bearish;

          return (
            <g 
              key={`candle-${index}`}
              className="cursor-crosshair"
              style={{
                opacity: mounted ? 1 : 0,
                transition: `opacity 0.4s ease-out ${index * 0.005}s`,
              }}
            >
              {/* Wick */}
              <line
                x1={x}
                y1={scaleY(candle.high)}
                x2={x}
                y2={scaleY(candle.low)}
                stroke={candleColor}
                strokeWidth={isHovered ? 2 : 1}
              />
              
              {/* Body */}
              <rect
                x={x - candleWidth / 2}
                y={bodyTop}
                width={candleWidth}
                height={bodyHeight}
                rx={1}
                fill={isBullish ? 'url(#candle-bull-body)' : 'url(#candle-bear-body)'}
                filter={isHovered ? (isBullish ? 'url(#glow-bull)' : 'url(#glow-bear)') : undefined}
                style={{
                  transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                  transformOrigin: `${x}px ${(bodyTop + bodyBottom) / 2}px`,
                  transition: 'transform 0.15s ease-out',
                }}
              />
            </g>
          );
        })}

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
              strokeOpacity={0.4}
            />
            <line
              x1={padding.left}
              y1={crosshairPos.y}
              x2={width - padding.right}
              y2={crosshairPos.y}
              stroke={colors.textBright}
              strokeWidth={1}
              strokeDasharray="4 4"
              strokeOpacity={0.4}
            />
            
            {/* Date label */}
            <g>
              <rect
                x={crosshairPos.x - 35}
                y={height - padding.bottom + 20}
                width={70}
                height={22}
                rx={4}
                fill={colors.bullish}
              />
              <text
                x={crosshairPos.x}
                y={height - padding.bottom + 35}
                textAnchor="middle"
                style={{ fontSize: 10, fontWeight: 700 }}
                fill={colors.background}
              >
                {data[hoveredIndex].date}
              </text>
            </g>

            {/* Price label */}
            <g>
              <rect
                x={width - padding.right + 4}
                y={crosshairPos.y - 11}
                width={68}
                height={22}
                rx={4}
                fill={colors.bullish}
              />
              <text
                x={width - padding.right + 38}
                y={crosshairPos.y + 4}
                textAnchor="middle"
                style={{ fontSize: 10, fontWeight: 700 }}
                fill={colors.background}
              >
                {formatter(minPrice - pricePadding + (priceRange + 2 * pricePadding) * (1 - (crosshairPos.y - padding.top) / mainChartHeight))}
              </text>
            </g>
          </>
        )}

        {/* X-axis labels */}
        {data.filter((_, i) => i % Math.ceil(data.length / 6) === 0).map((candle, i) => {
          const index = i * Math.ceil(data.length / 6);
          return (
            <text
              key={index}
              x={scaleX(index)}
              y={height - 12}
              textAnchor="middle"
              style={{ fontSize: 10, fontWeight: 500 }}
              fill={colors.text}
            >
              {candle.date}
            </text>
          );
        })}
      </svg>

      {/* Tooltip OHLC */}
      {hoveredIndex !== null && (
        <div 
          className="absolute rounded-xl p-4 min-w-[200px] pointer-events-none z-20 border"
          style={{
            left: scaleX(hoveredIndex) > width / 2 ? scaleX(hoveredIndex) - 220 : scaleX(hoveredIndex) + 30,
            top: 20,
            backgroundColor: colors.cardBg,
            borderColor: colors.grid,
            boxShadow: `0 20px 40px -10px ${colors.background}80`,
          }}
        >
          <div className="flex items-center justify-between pb-3 mb-3 border-b" style={{ borderColor: colors.grid }}>
            <div className="flex items-center gap-2">
              <div 
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: data[hoveredIndex].close >= data[hoveredIndex].open ? colors.bullish : colors.bearish }}
              />
              <span className="text-sm font-bold" style={{ color: colors.textBright }}>{data[hoveredIndex].date}</span>
            </div>
            <span 
              className="text-[10px] font-bold px-2 py-1 rounded-full"
              style={{ 
                backgroundColor: data[hoveredIndex].close >= data[hoveredIndex].open ? `${colors.bullish}20` : `${colors.bearish}20`,
                color: data[hoveredIndex].close >= data[hoveredIndex].open ? colors.bullish : colors.bearish,
              }}
            >
              {data[hoveredIndex].close >= data[hoveredIndex].open ? '▲ Haussier' : '▼ Baissier'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <span className="text-[9px] uppercase tracking-wider font-medium" style={{ color: colors.text }}>Ouverture</span>
              <p className="text-sm font-bold tabular-nums" style={{ color: colors.textBright }}>{formatter(data[hoveredIndex].open)}</p>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider font-medium" style={{ color: colors.text }}>Clôture</span>
              <p className="text-sm font-bold tabular-nums" style={{ color: colors.textBright }}>{formatter(data[hoveredIndex].close)}</p>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider font-medium" style={{ color: colors.text }}>Plus Haut</span>
              <p className="text-sm font-bold tabular-nums" style={{ color: colors.bullish }}>{formatter(data[hoveredIndex].high)}</p>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider font-medium" style={{ color: colors.text }}>Plus Bas</span>
              <p className="text-sm font-bold tabular-nums" style={{ color: colors.bearish }}>{formatter(data[hoveredIndex].low)}</p>
            </div>
          </div>
          {data[hoveredIndex].volume && (
            <div className="mt-3 pt-3 border-t" style={{ borderColor: colors.grid }}>
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase tracking-wider font-medium" style={{ color: colors.text }}>Volume</span>
                <span className="text-sm font-bold tabular-nums" style={{ color: colors.textBright }}>
                  {data[hoveredIndex].volume!.toLocaleString('fr-FR')}
                </span>
              </div>
            </div>
          )}
          <div className="mt-3 pt-3 border-t" style={{ borderColor: colors.grid }}>
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase tracking-wider font-medium" style={{ color: colors.text }}>Variation</span>
              <span 
                className="text-sm font-bold"
                style={{ color: data[hoveredIndex].close >= data[hoveredIndex].open ? colors.bullish : colors.bearish }}
              >
                {data[hoveredIndex].close >= data[hoveredIndex].open ? '+' : ''}
                {(((data[hoveredIndex].close - data[hoveredIndex].open) / data[hoveredIndex].open) * 100).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Legend - Enrichie */}
      <div 
        className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 rounded-xl border"
        style={{ 
          backgroundColor: `${colors.background}95`,
          borderColor: colors.grid,
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Chandeliers */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: colors.bullish }} />
            <span className="text-[10px] font-semibold" style={{ color: colors.text }}>Haussier</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: colors.bearish }} />
            <span className="text-[10px] font-semibold" style={{ color: colors.text }}>Baissier</span>
          </div>
        </div>

        {/* Séparateur */}
        <div className="w-px h-4" style={{ backgroundColor: colors.gridLight }} />

        {/* Moyennes Mobiles */}
        {showMA && (
          <div className="flex items-center gap-3">
            {maData.map((ma) => (
              <div key={ma.period} className="flex items-center gap-1.5">
                <div className="w-5 h-0.5 rounded-full" style={{ backgroundColor: ma.color }} />
                <span className="text-[10px] font-semibold" style={{ color: colors.text }}>{ma.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Séparateur */}
        {breakevenPrice && <div className="w-px h-4" style={{ backgroundColor: colors.gridLight }} />}

        {/* Seuil de Rentabilité */}
        {breakevenPrice && (
          <div className="flex items-center gap-1.5">
            <div 
              className="w-5 h-0.5" 
              style={{ 
                backgroundColor: colors.breakeven,
                backgroundImage: `repeating-linear-gradient(90deg, ${colors.breakeven}, ${colors.breakeven} 3px, transparent 3px, transparent 6px)`,
              }} 
            />
            <span className="text-[10px] font-semibold" style={{ color: colors.text }}>Seuil</span>
          </div>
        )}
      </div>
    </div>
  );
};
