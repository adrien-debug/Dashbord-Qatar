import React, { useState, useEffect } from 'react';

interface GaugeData {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  target?: number;
  unit?: string;
  thresholds?: {
    warning: number;
    danger: number;
  };
  icon?: React.ReactNode;
}

interface GaugeClusterChartProps {
  data: GaugeData[];
  layout?: 'grid' | 'row' | 'hexagon';
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  showValues?: boolean;
  showTarget?: boolean;
  animated?: boolean;
}

// Hearst color palette
const COLORS = {
  optimal: '#8AFD81',      // Hearst Green
  optimalDark: '#4ade80',
  warning: '#f59e0b',      // Amber
  warningLight: '#fef3c7',
  danger: '#ef4444',       // Red
  dangerLight: '#fecaca',
  neutral: '#64748b',      // Slate
  background: '#e2e8f0',
  text: '#1e293b',
};

const SingleGauge: React.FC<{
  gauge: GaugeData;
  size: number;
  showLabel: boolean;
  showValue: boolean;
  showTarget: boolean;
  animated: boolean;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
}> = ({
  gauge,
  size,
  showLabel,
  showValue,
  showTarget,
  animated,
  isHovered,
  onHover,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setMounted(true), 100);
      return () => clearTimeout(timer);
    } else {
      setMounted(true);
    }
  }, [animated]);

  const strokeWidth = size * 0.1;
  const radius = (size - strokeWidth) / 2 - 15;
  const center = size / 2;
  
  // Arc parameters (240 degrees total, starting from -210 degrees)
  const startAngle = -210;
  const endAngle = 30;
  const totalAngle = endAngle - startAngle;
  
  const percentage = ((gauge.value - gauge.min) / (gauge.max - gauge.min)) * 100;
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  const currentAngle = startAngle + (totalAngle * (mounted ? clampedPercentage : 0)) / 100;
  
  const targetAngle = gauge.target 
    ? startAngle + (totalAngle * ((gauge.target - gauge.min) / (gauge.max - gauge.min)))
    : null;

  // Calculate arc path
  const polarToCartesian = (angle: number, r: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: center + r * Math.cos(rad),
      y: center + r * Math.sin(rad),
    };
  };

  const describeArc = (startAng: number, endAng: number, r: number) => {
    if (endAng <= startAng) return '';
    const start = polarToCartesian(endAng, r);
    const end = polarToCartesian(startAng, r);
    const largeArcFlag = endAng - startAng <= 180 ? '0' : '1';
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  };

  // Smart color detection based on thresholds
  // If danger < warning, it means "higher is better" (like hashrate, uptime)
  // If danger > warning, it means "lower is better" (like temperature)
  const getColor = (): { main: string; status: string } => {
    if (!gauge.thresholds) {
      // No thresholds - use percentage-based coloring
      if (clampedPercentage >= 90) return { main: COLORS.optimal, status: 'Excellent' };
      if (clampedPercentage >= 70) return { main: COLORS.optimal, status: 'Bon' };
      if (clampedPercentage >= 50) return { main: COLORS.warning, status: 'Moyen' };
      return { main: COLORS.danger, status: 'Faible' };
    }

    const { warning, danger } = gauge.thresholds;
    const value = gauge.value;

    // Higher is better (e.g., hashrate: warning=85, danger=70)
    if (danger < warning) {
      if (value >= warning) return { main: COLORS.optimal, status: 'Optimal' };
      if (value >= danger) return { main: COLORS.warning, status: 'Attention' };
      return { main: COLORS.danger, status: 'Critique' };
    }
    
    // Lower is better (e.g., temperature: warning=40, danger=50)
    if (value <= warning) return { main: COLORS.optimal, status: 'Optimal' };
    if (value <= danger) return { main: COLORS.warning, status: 'Attention' };
    return { main: COLORS.danger, status: 'Critique' };
  };

  const { main: color, status: statusLabel } = getColor();

  // Calculate zone positions for background arcs
  const getZoneArcs = () => {
    if (!gauge.thresholds) return null;
    
    const { warning, danger } = gauge.thresholds;
    const range = gauge.max - gauge.min;
    
    const warningPct = ((warning - gauge.min) / range) * 100;
    const dangerPct = ((danger - gauge.min) / range) * 100;
    
    // Higher is better
    if (danger < warning) {
      return {
        danger: { start: 0, end: dangerPct },
        warning: { start: dangerPct, end: warningPct },
        optimal: { start: warningPct, end: 100 },
      };
    }
    
    // Lower is better
    return {
      optimal: { start: 0, end: warningPct },
      warning: { start: warningPct, end: dangerPct },
      danger: { start: dangerPct, end: 100 },
    };
  };

  const zones = getZoneArcs();

  return (
    <div 
      className="relative group cursor-pointer transition-transform duration-200 hover:scale-105"
      style={{ width: size, height: size }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          {/* Gradient for the value arc */}
          <linearGradient id={`gauge-gradient-${gauge.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity={0.9} />
            <stop offset="100%" stopColor={color} stopOpacity={1} />
          </linearGradient>
          
          {/* Glow filter */}
          <filter id={`gauge-glow-${gauge.id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Inner shadow for depth */}
          <filter id={`gauge-inner-shadow-${gauge.id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000" floodOpacity="0.1"/>
          </filter>
        </defs>

        {/* Background circle for depth */}
        <circle
          cx={center}
          cy={center}
          r={radius + strokeWidth / 2 + 2}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={2}
        />

        {/* Zone arcs (background) */}
        {zones ? (
          <>
            <path
              d={describeArc(
                startAngle + (totalAngle * zones.optimal.start) / 100,
                startAngle + (totalAngle * zones.optimal.end) / 100,
                radius
              )}
              fill="none"
              stroke="#dcfce7"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <path
              d={describeArc(
                startAngle + (totalAngle * zones.warning.start) / 100,
                startAngle + (totalAngle * zones.warning.end) / 100,
                radius
              )}
              fill="none"
              stroke={COLORS.warningLight}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <path
              d={describeArc(
                startAngle + (totalAngle * zones.danger.start) / 100,
                startAngle + (totalAngle * zones.danger.end) / 100,
                radius
              )}
              fill="none"
              stroke={COLORS.dangerLight}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </>
        ) : (
          <path
            d={describeArc(startAngle, endAngle, radius)}
            fill="none"
            stroke={COLORS.background}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        )}

        {/* Value arc */}
        <path
          d={describeArc(startAngle, currentAngle, radius)}
          fill="none"
          stroke={`url(#gauge-gradient-${gauge.id})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          filter={isHovered ? `url(#gauge-glow-${gauge.id})` : `url(#gauge-inner-shadow-${gauge.id})`}
          className="transition-all duration-1000 ease-out"
        />

        {/* Needle indicator */}
        <g 
          style={{
            transform: `rotate(${currentAngle + 90}deg)`,
            transformOrigin: `${center}px ${center}px`,
            transition: 'transform 1s ease-out',
          }}
        >
          <circle
            cx={center}
            cy={center}
            r={8}
            fill={color}
            stroke="white"
            strokeWidth={2}
          />
          <line
            x1={center}
            y1={center}
            x2={center}
            y2={center - radius + strokeWidth}
            stroke={color}
            strokeWidth={3}
            strokeLinecap="round"
          />
        </g>

        {/* Target marker */}
        {showTarget && targetAngle !== null && (
          <g>
            {/* Target line */}
            <line
              x1={polarToCartesian(targetAngle, radius - strokeWidth / 2 - 5).x}
              y1={polarToCartesian(targetAngle, radius - strokeWidth / 2 - 5).y}
              x2={polarToCartesian(targetAngle, radius + strokeWidth / 2 + 5).x}
              y2={polarToCartesian(targetAngle, radius + strokeWidth / 2 + 5).y}
              stroke={COLORS.text}
              strokeWidth={2}
              strokeLinecap="round"
            />
            {/* Target diamond */}
            <circle
              cx={polarToCartesian(targetAngle, radius + strokeWidth / 2 + 8).x}
              cy={polarToCartesian(targetAngle, radius + strokeWidth / 2 + 8).y}
              r={4}
              fill="white"
              stroke={COLORS.text}
              strokeWidth={1.5}
            />
          </g>
        )}

        {/* Center content */}
        <g>
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius - strokeWidth - 8}
            fill="white"
            stroke="#f1f5f9"
            strokeWidth={1}
          />
          
          {/* Icon */}
          {gauge.icon && (
            <foreignObject x={center - 12} y={center - 28} width={24} height={24}>
              <div className="w-full h-full flex items-center justify-center" style={{ color }}>
                {gauge.icon}
              </div>
            </foreignObject>
          )}
          
          {/* Value */}
          {showValue && (
            <>
              <text
                x={center}
                y={center + (gauge.icon ? 8 : 0)}
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-bold"
                style={{ fontSize: size * 0.16, fill: COLORS.text }}
              >
                {gauge.value.toFixed(gauge.value < 10 ? 1 : 0)}
              </text>
              <text
                x={center}
                y={center + size * 0.13 + (gauge.icon ? 4 : 0)}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: size * 0.065, fill: COLORS.neutral }}
              >
                {gauge.unit || '%'}
              </text>
            </>
          )}
        </g>

        {/* Min/Max labels */}
        <text
          x={polarToCartesian(startAngle, radius + 18).x}
          y={polarToCartesian(startAngle, radius + 18).y + 4}
          textAnchor="middle"
          style={{ fontSize: 9, fill: COLORS.neutral }}
        >
          {gauge.min}
        </text>
        <text
          x={polarToCartesian(endAngle, radius + 18).x}
          y={polarToCartesian(endAngle, radius + 18).y + 4}
          textAnchor="middle"
          style={{ fontSize: 9, fill: COLORS.neutral }}
        >
          {gauge.max}
        </text>
      </svg>

      {/* Label below */}
      {showLabel && (
        <div className="absolute -bottom-1 left-0 right-0 text-center">
          <p className="text-xs font-semibold text-slate-800 truncate px-2">{gauge.label}</p>
          <div 
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold mt-0.5"
            style={{ 
              backgroundColor: `${color}20`,
              color: color,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
            {statusLabel}
          </div>
        </div>
      )}

      {/* Hover tooltip */}
      {isHovered && (
        <div 
          className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full bg-white border border-slate-200 rounded-xl shadow-2xl p-4 min-w-[180px] z-20"
          style={{ boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${color}20`, color }}
            >
              {gauge.icon}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{gauge.label}</p>
              <p className="text-[10px]" style={{ color }}>{statusLabel}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Valeur actuelle</span>
              <span className="text-sm font-bold text-slate-900">
                {gauge.value.toFixed(1)} {gauge.unit || '%'}
              </span>
            </div>
            {gauge.target && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Objectif</span>
                <span className="text-sm font-bold text-slate-700">
                  {gauge.target} {gauge.unit || '%'}
                </span>
              </div>
            )}
            <div className="h-px bg-slate-100 my-2" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Performance</span>
              <div className="flex items-center gap-1">
                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${clampedPercentage}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
                <span 
                  className="text-xs font-bold tabular-nums"
                  style={{ color }}
                >
                  {clampedPercentage.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const GaugeClusterChart: React.FC<GaugeClusterChartProps> = ({
  data,
  layout = 'grid',
  size = 'md',
  showLabels = true,
  showValues = true,
  showTarget = true,
  animated = true,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const sizeMap = {
    sm: 130,
    md: 170,
    lg: 210,
  };

  const gaugeSize = sizeMap[size];

  // Calculate status counts with smart threshold logic
  const getStatusCounts = () => {
    let optimal = 0;
    let warning = 0;
    let danger = 0;

    data.forEach(g => {
      if (!g.thresholds) {
        const pct = ((g.value - g.min) / (g.max - g.min)) * 100;
        if (pct >= 70) optimal++;
        else if (pct >= 40) warning++;
        else danger++;
        return;
      }

      const { warning: warnThresh, danger: dangerThresh } = g.thresholds;
      
      // Higher is better
      if (dangerThresh < warnThresh) {
        if (g.value >= warnThresh) optimal++;
        else if (g.value >= dangerThresh) warning++;
        else danger++;
      } else {
        // Lower is better
        if (g.value <= warnThresh) optimal++;
        else if (g.value <= dangerThresh) warning++;
        else danger++;
      }
    });

    return { optimal, warning, danger };
  };

  const statusCounts = getStatusCounts();

  const getLayoutStyles = () => {
    switch (layout) {
      case 'row':
        return 'flex flex-wrap justify-center gap-6';
      case 'hexagon':
        return 'relative';
      case 'grid':
      default:
        return 'grid gap-6';
    }
  };

  const getGridCols = () => {
    const count = data.length;
    if (count <= 2) return 'grid-cols-2';
    if (count <= 3) return 'grid-cols-3';
    if (count <= 4) return 'grid-cols-2 sm:grid-cols-4';
    if (count <= 6) return 'grid-cols-2 sm:grid-cols-3';
    return 'grid-cols-2 sm:grid-cols-4';
  };

  // Calculate overall health score
  const calculateHealthScore = () => {
    let totalScore = 0;
    
    data.forEach(g => {
      const pct = ((g.value - g.min) / (g.max - g.min)) * 100;
      
      if (!g.thresholds) {
        totalScore += Math.max(0, Math.min(100, pct));
        return;
      }

      const { warning, danger } = g.thresholds;
      
      // Higher is better - score based on being above thresholds
      if (danger < warning) {
        if (g.value >= warning) totalScore += 100;
        else if (g.value >= danger) totalScore += 60;
        else totalScore += 20;
      } else {
        // Lower is better - score based on being below thresholds
        if (g.value <= warning) totalScore += 100;
        else if (g.value <= danger) totalScore += 60;
        else totalScore += 20;
      }
    });

    return Math.round(totalScore / data.length);
  };

  const healthScore = calculateHealthScore();
  const healthColor = healthScore >= 80 ? COLORS.optimal : healthScore >= 50 ? COLORS.warning : COLORS.danger;

  return (
    <div className="w-full">
      {/* Summary bar at top */}
      <div className="flex items-center justify-center gap-8 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.optimal }} />
          <span className="text-xs text-slate-600 font-medium">Optimal</span>
          <span className="text-sm font-bold text-slate-900 bg-emerald-50 px-2 py-0.5 rounded-full">
            {statusCounts.optimal}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.warning }} />
          <span className="text-xs text-slate-600 font-medium">Attention</span>
          <span className="text-sm font-bold text-slate-900 bg-amber-50 px-2 py-0.5 rounded-full">
            {statusCounts.warning}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.danger }} />
          <span className="text-xs text-slate-600 font-medium">Critique</span>
          <span className="text-sm font-bold text-slate-900 bg-red-50 px-2 py-0.5 rounded-full">
            {statusCounts.danger}
          </span>
        </div>
      </div>

      {/* Gauges */}
      <div 
        className={layout === 'grid' ? `${getLayoutStyles()} ${getGridCols()}` : getLayoutStyles()}
        style={layout === 'hexagon' ? { 
          height: gaugeSize * 2.5,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 24,
        } : undefined}
      >
        {data.map((gauge) => (
          <div 
            key={gauge.id}
            className="flex justify-center"
          >
            <SingleGauge
              gauge={gauge}
              size={gaugeSize}
              showLabel={showLabels}
              showValue={showValues}
              showTarget={showTarget}
              animated={animated}
              isHovered={hoveredId === gauge.id}
              onHover={(hovered) => setHoveredId(hovered ? gauge.id : null)}
            />
          </div>
        ))}
      </div>

      {/* Overall health score at bottom */}
      <div className="mt-8 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-center gap-6">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Santé Globale</p>
            <div 
              className="text-4xl font-bold tabular-nums"
              style={{ color: healthColor }}
            >
              {healthScore}
              <span className="text-lg text-slate-400">%</span>
            </div>
          </div>
          <div className="w-px h-12 bg-slate-200" />
          <div className="flex-1 max-w-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-slate-500">Performance</span>
              <span className="text-xs font-bold" style={{ color: healthColor }}>
                {healthScore >= 80 ? 'Excellent' : healthScore >= 50 ? 'Correct' : 'À améliorer'}
              </span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${healthScore}%`,
                  background: `linear-gradient(90deg, ${healthColor}cc, ${healthColor})`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
