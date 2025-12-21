import React, { useState, useEffect, useMemo } from 'react';

interface PortfolioData {
  date: string;
  value: number;
  invested: number;
  roi?: number;
}

interface PortfolioChartProps {
  data: PortfolioData[];
  height?: number;
  showBollinger?: boolean;
  showROI?: boolean;
  showInvested?: boolean;
  bollingerPeriod?: number;
  bollingerStdDev?: number;
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
    accent: '#4ade80',
    invested: '#0EA5E9',
    investedGlow: '#0EA5E920',
    bollingerUpper: '#A855F7',
    bollingerLower: '#A855F7',
    bollingerFill: '#A855F720',
    profit: '#22C55E',
    loss: '#F43F5E',
    grid: '#334155',
    gridLight: '#475569',
    text: '#94a3b8',
    textBright: '#f1f5f9',
    sma: '#F97316',
  },
  light: {
    background: '#f8fafc',
    cardBg: '#ffffff',
    chartBg: '#f8fafc',
    primary: '#22C55E',
    primaryGlow: '#22C55E40',
    secondary: '#16a34a',
    accent: '#15803d',
    invested: '#0EA5E9',
    investedGlow: '#0EA5E920',
    bollingerUpper: '#A855F7',
    bollingerLower: '#A855F7',
    bollingerFill: '#A855F710',
    profit: '#22C55E',
    loss: '#F43F5E',
    grid: '#e2e8f0',
    gridLight: '#cbd5e1',
    text: '#64748b',
    textBright: '#1e293b',
    sma: '#F97316',
  },
};

export const PortfolioChart: React.FC<PortfolioChartProps> = ({
  data,
  height = 350,
  showBollinger = true,
  showROI = true,
  showInvested = true,
  bollingerPeriod = 20,
  bollingerStdDev = 2,
  unit = '$',
  formatValue,
  theme = 'light',
}) => {
  const [mounted, setMounted] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [crosshairPos, setCrosshairPos] = useState<{ x: number; y: number } | null>(null);
  const [visibleLayers, setVisibleLayers] = useState({
    value: true,
    invested: true,
    bollinger: true,
    sma: true,
  });

  const colors = THEMES[theme];

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const width = 800;
  const padding = { top: 25, right: 85, bottom: 55, left: 70 };
  const chartWidth = width - padding.left - padding.right;
  const mainChartHeight = showROI ? (height - padding.top - padding.bottom) * 0.72 : height - padding.top - padding.bottom;
  const roiChartHeight = showROI ? (height - padding.top - padding.bottom) * 0.22 : 0;
  const gapBetweenCharts = 8;
  const pointSpacing = chartWidth / (data.length - 1 || 1);

  const defaultFormatValue = (value: number) => {
    if (value >= 1000000) {
      return `${unit}${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${unit}${(value / 1000).toFixed(0)}K`;
    }
    return `${unit}${value.toFixed(0)}`;
  };

  const formatter = formatValue || defaultFormatValue;

  // Calculate Bollinger Bands
  const bollingerData = useMemo(() => {
    return data.map((_, index) => {
      if (index < bollingerPeriod - 1) return { sma: NaN, upper: NaN, lower: NaN };
      
      const slice = data.slice(index - bollingerPeriod + 1, index + 1);
      const sma = slice.reduce((sum, d) => sum + d.value, 0) / bollingerPeriod;
      
      const variance = slice.reduce((sum, d) => sum + Math.pow(d.value - sma, 2), 0) / bollingerPeriod;
      const stdDev = Math.sqrt(variance);
      
      return {
        sma,
        upper: sma + bollingerStdDev * stdDev,
        lower: sma - bollingerStdDev * stdDev,
      };
    });
  }, [data, bollingerPeriod, bollingerStdDev]);

  // Calculate value ranges
  const allValues = [
    ...data.map(d => d.value),
    ...data.map(d => d.invested),
    ...bollingerData.filter(b => !isNaN(b.upper)).map(b => b.upper),
    ...bollingerData.filter(b => !isNaN(b.lower)).map(b => b.lower),
  ];
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const valueRange = maxValue - minValue;
  const valuePadding = valueRange * 0.12;

  // ROI range
  const roiValues = data.map(d => d.roi || ((d.value - d.invested) / d.invested) * 100);
  const maxRoi = Math.max(...roiValues.map(Math.abs));

  // Scale functions
  const scaleY = (value: number) => {
    return padding.top + mainChartHeight - ((value - minValue + valuePadding) / (valueRange + 2 * valuePadding)) * mainChartHeight;
  };

  const scaleRoiY = (roi: number) => {
    const roiTop = padding.top + mainChartHeight + gapBetweenCharts;
    const roiMid = roiTop + roiChartHeight / 2;
    return roiMid - (roi / maxRoi) * (roiChartHeight / 2 - 8);
  };

  const scaleX = (index: number) => {
    return padding.left + index * pointSpacing;
  };

  // Generate paths
  const generateLinePath = (values: number[], skipNaN = false) => {
    let started = false;
    return values.map((value, i) => {
      if (skipNaN && isNaN(value)) return '';
      if (!started) {
        started = true;
        return `M ${scaleX(i)},${scaleY(value)}`;
      }
      return `L ${scaleX(i)},${scaleY(value)}`;
    }).join(' ');
  };

  const generateAreaPath = (values: number[]) => {
    const linePath = generateLinePath(values);
    if (!linePath) return '';
    return `${linePath} L ${scaleX(values.length - 1)},${scaleY(minValue - valuePadding)} L ${scaleX(0)},${scaleY(minValue - valuePadding)} Z`;
  };

  const generateBollingerPath = () => {
    const validPoints = bollingerData
      .map((b, i) => ({ ...b, index: i }))
      .filter(b => !isNaN(b.upper));
    
    if (validPoints.length < 2) return '';

    const upperPath = validPoints.map((b, i) => 
      `${i === 0 ? 'M' : 'L'} ${scaleX(b.index)},${scaleY(b.upper)}`
    ).join(' ');
    
    const lowerPath = [...validPoints].reverse().map((b) => 
      `L ${scaleX(b.index)},${scaleY(b.lower)}`
    ).join(' ');
    
    return `${upperPath} ${lowerPath} Z`;
  };

  const generateSMAPath = () => {
    const points = bollingerData
      .map((b, i) => {
        if (isNaN(b.sma)) return null;
        return `${scaleX(i)},${scaleY(b.sma)}`;
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
  const totalROI = ((lastPoint.value - lastPoint.invested) / lastPoint.invested) * 100;
  const totalProfit = lastPoint.value - lastPoint.invested;
  const isProfit = totalProfit >= 0;

  // Calculate Sharpe Ratio (simplified)
  const returns = data.slice(1).map((d, i) => (d.value - data[i].value) / data[i].value);
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const returnStdDev = Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length);
  const sharpeRatio = returnStdDev > 0 ? (avgReturn / returnStdDev) * Math.sqrt(252) : 0;

  // Volatility (annualized)
  const volatility = returnStdDev * Math.sqrt(252) * 100;

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
          {/* Value area gradient */}
          <linearGradient id="port-value-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.primary} stopOpacity={0.35} />
            <stop offset="50%" stopColor={colors.primary} stopOpacity={0.12} />
            <stop offset="100%" stopColor={colors.primary} stopOpacity={0.02} />
          </linearGradient>
          
          {/* Value line gradient */}
          <linearGradient id="port-line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.secondary} />
            <stop offset="50%" stopColor={colors.primary} />
            <stop offset="100%" stopColor={colors.accent} />
          </linearGradient>

          {/* Invested line gradient */}
          <linearGradient id="port-invested-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.invested} stopOpacity={0.7} />
            <stop offset="100%" stopColor={colors.invested} stopOpacity={1} />
          </linearGradient>

          {/* Bollinger fill */}
          <linearGradient id="port-bollinger-fill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.bollingerUpper} stopOpacity={0.15} />
            <stop offset="50%" stopColor={colors.bollingerUpper} stopOpacity={0.05} />
            <stop offset="100%" stopColor={colors.bollingerLower} stopOpacity={0.15} />
          </linearGradient>

          {/* ROI bar gradients */}
          <linearGradient id="port-roi-positive" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.profit} stopOpacity={0.8} />
            <stop offset="100%" stopColor={colors.profit} stopOpacity={0.3} />
          </linearGradient>
          <linearGradient id="port-roi-negative" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={colors.loss} stopOpacity={0.8} />
            <stop offset="100%" stopColor={colors.loss} stopOpacity={0.3} />
          </linearGradient>

          {/* Glow filters */}
          <filter id="port-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="port-point-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Grid lines horizontales */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const value = minValue - valuePadding + (valueRange + 2 * valuePadding) * ratio;
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

        {/* Bollinger Bands fill */}
        {showBollinger && visibleLayers.bollinger && (
          <path
            d={generateBollingerPath()}
            fill="url(#port-bollinger-fill)"
            style={{
              opacity: mounted ? 1 : 0,
              transition: 'opacity 0.8s ease-out',
            }}
          />
        )}

        {/* Bollinger upper band */}
        {showBollinger && visibleLayers.bollinger && (
          <>
            <path
              d={bollingerData.map((b, i) => {
                if (isNaN(b.upper)) return '';
                const first = bollingerData.findIndex(x => !isNaN(x.upper));
                return `${i === first ? 'M' : 'L'} ${scaleX(i)},${scaleY(b.upper)}`;
              }).join('')}
              fill="none"
              stroke={colors.bollingerUpper}
              strokeWidth={1.5}
              strokeOpacity={0.6}
              strokeDasharray="6 3"
              style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.6s' }}
            />
            <path
              d={bollingerData.map((b, i) => {
                if (isNaN(b.lower)) return '';
                const first = bollingerData.findIndex(x => !isNaN(x.lower));
                return `${i === first ? 'M' : 'L'} ${scaleX(i)},${scaleY(b.lower)}`;
              }).join('')}
              fill="none"
              stroke={colors.bollingerLower}
              strokeWidth={1.5}
              strokeOpacity={0.6}
              strokeDasharray="6 3"
              style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.6s' }}
            />
          </>
        )}

        {/* SMA line */}
        {showBollinger && visibleLayers.sma && (
          <path
            d={generateSMAPath()}
            fill="none"
            stroke={colors.sma}
            strokeWidth={2}
            strokeLinecap="round"
            style={{ opacity: mounted ? 0.8 : 0, transition: 'opacity 0.5s' }}
          />
        )}

        {/* Invested line */}
        {showInvested && visibleLayers.invested && (
          <path
            d={generateLinePath(data.map(d => d.invested))}
            fill="none"
            stroke="url(#port-invested-gradient)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray="8 4"
            style={{
              opacity: mounted ? 0.8 : 0,
              transition: 'opacity 0.5s ease-out',
            }}
          />
        )}

        {/* Value area */}
        {visibleLayers.value && (
          <path
            d={generateAreaPath(data.map(d => d.value))}
            fill="url(#port-value-gradient)"
            style={{
              opacity: mounted ? 1 : 0,
              transition: 'opacity 0.8s ease-out',
            }}
          />
        )}

        {/* Value line */}
        {visibleLayers.value && (
          <path
            d={generateLinePath(data.map(d => d.value))}
            fill="none"
            stroke="url(#port-line-gradient)"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              opacity: mounted ? 1 : 0,
              transition: 'opacity 0.5s ease-out',
              filter: 'drop-shadow(0 0 8px rgba(138, 253, 129, 0.5))',
            }}
          />
        )}

        {/* Data points */}
        {visibleLayers.value && data.map((point, index) => {
          const isHovered = hoveredIndex === index;
          const x = scaleX(index);
          const y = scaleY(point.value);
          const isLast = index === data.length - 1;

          return (
            <g key={`point-${index}`}>
              {isHovered && (
                <circle
                  cx={x}
                  cy={y}
                  r={14}
                  fill={colors.primary}
                  fillOpacity={0.15}
                  style={{ transition: 'all 0.2s' }}
                />
              )}
              <circle
                cx={x}
                cy={y}
                r={isHovered ? 7 : (isLast ? 6 : 3)}
                fill={isHovered || isLast ? colors.primary : colors.secondary}
                stroke={colors.cardBg}
                strokeWidth={2}
                filter={isHovered ? 'url(#port-point-glow)' : undefined}
                style={{
                  opacity: mounted ? 1 : 0,
                  transition: `opacity 0.4s ease-out ${index * 0.02}s, r 0.15s ease-out`,
                }}
              />
            </g>
          );
        })}

        {/* ROI bars */}
        {showROI && (
          <g>
            <text
              x={padding.left}
              y={padding.top + mainChartHeight + gapBetweenCharts + 12}
              style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}
              fill={colors.text}
            >
              ROI %
            </text>
            {/* Zero line */}
            <line
              x1={padding.left}
              y1={scaleRoiY(0)}
              x2={width - padding.right}
              y2={scaleRoiY(0)}
              stroke={colors.gridLight}
              strokeWidth={1}
            />
            {data.map((point, index) => {
              const roi = point.roi || ((point.value - point.invested) / point.invested) * 100;
              const barWidth = Math.max(6, pointSpacing * 0.4);
              const x = scaleX(index) - barWidth / 2;
              const isPositive = roi >= 0;
              const barHeight = Math.abs((roi / maxRoi) * (roiChartHeight / 2 - 10));
              const y = isPositive ? scaleRoiY(roi) : scaleRoiY(0);
              const isHovered = hoveredIndex === index;

              return (
                <rect
                  key={`roi-${index}`}
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight || 1}
                  rx={2}
                  fill={isPositive ? 'url(#port-roi-positive)' : 'url(#port-roi-negative)'}
                  style={{
                    opacity: mounted ? (isHovered ? 1 : 0.65) : 0,
                    transition: `opacity 0.3s ease-out ${index * 0.015}s`,
                    transform: isHovered ? 'scaleY(1.15)' : 'scaleY(1)',
                    transformOrigin: `${x + barWidth / 2}px ${scaleRoiY(0)}px`,
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
              y1={scaleY(data[hoveredIndex].value)}
              x2={width - padding.right}
              y2={scaleY(data[hoveredIndex].value)}
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
                y={scaleY(data[hoveredIndex].value) - 12}
                width={78}
                height={24}
                rx={6}
                fill={colors.primary}
              />
              <text
                x={width - padding.right + 43}
                y={scaleY(data[hoveredIndex].value) + 4}
                textAnchor="middle"
                style={{ fontSize: 10, fontWeight: 700 }}
                fill={colors.background}
              >
                {formatter(data[hoveredIndex].value)}
              </text>
            </g>
          </>
        )}

        {/* X-axis labels */}
        {data.filter((_, i) => i % Math.ceil(data.length / 6) === 0 || i === data.length - 1).map((point) => {
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
          className="absolute rounded-xl p-4 min-w-[250px] pointer-events-none z-20 border"
          style={{
            left: scaleX(hoveredIndex) > width / 2 ? scaleX(hoveredIndex) - 270 : scaleX(hoveredIndex) + 20,
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
                backgroundColor: (data[hoveredIndex].value >= data[hoveredIndex].invested) ? `${colors.profit}20` : `${colors.loss}20`,
                color: (data[hoveredIndex].value >= data[hoveredIndex].invested) ? colors.profit : colors.loss,
              }}
            >
              {(data[hoveredIndex].value >= data[hoveredIndex].invested) ? '▲ Profit' : '▼ Perte'}
            </span>
          </div>
          
          <div className="space-y-3">
            <div>
              <span className="text-[9px] uppercase tracking-wider font-medium" style={{ color: colors.text }}>Valeur Portfolio</span>
              <p className="text-xl font-bold tabular-nums" style={{ color: colors.primary }}>{formatter(data[hoveredIndex].value)}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[9px] uppercase tracking-wider font-medium" style={{ color: colors.text }}>Investi</span>
                <p className="text-sm font-bold tabular-nums" style={{ color: colors.invested }}>{formatter(data[hoveredIndex].invested)}</p>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider font-medium" style={{ color: colors.text }}>P&L</span>
                <p className="text-sm font-bold tabular-nums" style={{ 
                  color: (data[hoveredIndex].value >= data[hoveredIndex].invested) ? colors.profit : colors.loss 
                }}>
                  {(data[hoveredIndex].value >= data[hoveredIndex].invested) ? '+' : ''}
                  {formatter(data[hoveredIndex].value - data[hoveredIndex].invested)}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t" style={{ borderColor: colors.grid }}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[9px] uppercase tracking-wider font-medium" style={{ color: colors.text }}>ROI</span>
                  <p className="text-sm font-bold tabular-nums" style={{ 
                    color: (data[hoveredIndex].value >= data[hoveredIndex].invested) ? colors.profit : colors.loss 
                  }}>
                    {((data[hoveredIndex].value - data[hoveredIndex].invested) / data[hoveredIndex].invested * 100) >= 0 ? '+' : ''}
                    {((data[hoveredIndex].value - data[hoveredIndex].invested) / data[hoveredIndex].invested * 100).toFixed(1)}%
                  </p>
                </div>
                {showBollinger && !isNaN(bollingerData[hoveredIndex]?.sma) && (
                  <div>
                    <span className="text-[9px] uppercase tracking-wider font-medium" style={{ color: colors.text }}>SMA{bollingerPeriod}</span>
                    <p className="text-sm font-bold tabular-nums" style={{ color: colors.sma }}>
                      {formatter(bollingerData[hoveredIndex].sma)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {showBollinger && !isNaN(bollingerData[hoveredIndex]?.upper) && (
              <div className="pt-3 border-t" style={{ borderColor: colors.grid }}>
                <span className="text-[9px] uppercase tracking-wider font-medium block mb-2" style={{ color: colors.text }}>Bollinger Bands</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[9px] text-slate-400">Upper</span>
                    <p className="text-xs font-bold tabular-nums" style={{ color: colors.bollingerUpper }}>
                      {formatter(bollingerData[hoveredIndex].upper)}
                    </p>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400">Lower</span>
                    <p className="text-xs font-bold tabular-nums" style={{ color: colors.bollingerLower }}>
                      {formatter(bollingerData[hoveredIndex].lower)}
                    </p>
                  </div>
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
        {/* Value toggle */}
        <button 
          onClick={() => toggleLayer('value')}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all ${visibleLayers.value ? 'opacity-100' : 'opacity-40'}`}
          style={{ backgroundColor: visibleLayers.value ? `${colors.primary}15` : 'transparent' }}
        >
          <div className="w-4 h-2 rounded-sm" style={{ background: `linear-gradient(to right, ${colors.secondary}, ${colors.primary})` }} />
          <span className="text-[10px] font-semibold" style={{ color: colors.text }}>Valeur</span>
        </button>

        <div className="w-px h-4" style={{ backgroundColor: colors.gridLight }} />

        {/* Invested toggle */}
        {showInvested && (
          <button 
            onClick={() => toggleLayer('invested')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all ${visibleLayers.invested ? 'opacity-100' : 'opacity-40'}`}
            style={{ backgroundColor: visibleLayers.invested ? `${colors.invested}15` : 'transparent' }}
          >
            <div className="w-4 h-0.5" style={{ backgroundColor: colors.invested, backgroundImage: `repeating-linear-gradient(90deg, ${colors.invested}, ${colors.invested} 3px, transparent 3px, transparent 5px)` }} />
            <span className="text-[10px] font-semibold" style={{ color: colors.text }}>Investi</span>
          </button>
        )}

        <div className="w-px h-4" style={{ backgroundColor: colors.gridLight }} />

        {/* Bollinger toggle */}
        {showBollinger && (
          <button 
            onClick={() => toggleLayer('bollinger')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all ${visibleLayers.bollinger ? 'opacity-100' : 'opacity-40'}`}
            style={{ backgroundColor: visibleLayers.bollinger ? `${colors.bollingerUpper}15` : 'transparent' }}
          >
            <div className="w-4 h-3 rounded-sm border" style={{ borderColor: colors.bollingerUpper, backgroundColor: `${colors.bollingerUpper}10` }} />
            <span className="text-[10px] font-semibold" style={{ color: colors.text }}>Bollinger</span>
          </button>
        )}

        {/* SMA toggle */}
        {showBollinger && (
          <button 
            onClick={() => toggleLayer('sma')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all ${visibleLayers.sma ? 'opacity-100' : 'opacity-40'}`}
            style={{ backgroundColor: visibleLayers.sma ? `${colors.sma}15` : 'transparent' }}
          >
            <div className="w-4 h-0.5 rounded-full" style={{ backgroundColor: colors.sma }} />
            <span className="text-[10px] font-semibold" style={{ color: colors.text }}>SMA</span>
          </button>
        )}
      </div>

      {/* Stats badges top-right */}
      <div className="absolute top-3 right-3 flex flex-col gap-1.5">
        <div 
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border"
          style={{ 
            backgroundColor: isProfit ? `${colors.profit}10` : `${colors.loss}10`,
            borderColor: isProfit ? `${colors.profit}30` : `${colors.loss}30`,
          }}
        >
          <span className="text-[10px] font-medium" style={{ color: colors.text }}>ROI</span>
          <span className="text-sm font-bold" style={{ color: isProfit ? colors.profit : colors.loss }}>
            {isProfit ? '+' : ''}{totalROI.toFixed(1)}%
          </span>
        </div>
        <div 
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border"
          style={{ 
            backgroundColor: `${colors.sma}10`,
            borderColor: `${colors.sma}30`,
          }}
        >
          <span className="text-[10px] font-medium" style={{ color: colors.text }}>Sharpe</span>
          <span className="text-sm font-bold" style={{ color: colors.sma }}>{sharpeRatio.toFixed(2)}</span>
        </div>
        <div 
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border"
          style={{ 
            backgroundColor: `${colors.bollingerUpper}10`,
            borderColor: `${colors.bollingerUpper}30`,
          }}
        >
          <span className="text-[10px] font-medium" style={{ color: colors.text }}>Vol</span>
          <span className="text-sm font-bold" style={{ color: colors.bollingerUpper }}>{volatility.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};

