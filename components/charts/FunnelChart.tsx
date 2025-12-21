import React, { useState, useEffect } from 'react';

interface FunnelStage {
  name: string;
  value: number;
  target?: number;
  status: 'completed' | 'in_progress' | 'pending';
  date?: string;
  color?: string;
}

interface FunnelChartProps {
  data: FunnelStage[];
  height?: number;
  showLabels?: boolean;
  showValues?: boolean;
  showPercentage?: boolean;
  unit?: string;
  orientation?: 'vertical' | 'horizontal';
  formatValue?: (value: number) => string;
}

export const FunnelChart: React.FC<FunnelChartProps> = ({
  data,
  height = 400,
  showLabels = true,
  showValues = true,
  showPercentage = true,
  unit = 'MW',
  orientation = 'vertical',
  formatValue,
}) => {
  const [mounted, setMounted] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const width = 600;
  const padding = 40;
  const stageHeight = (height - padding * 2) / data.length;
  const maxValue = Math.max(...data.map(d => d.target || d.value));

  const defaultFormatValue = (value: number) => {
    return `${value} ${unit}`;
  };

  const formatter = formatValue || defaultFormatValue;

  const getStatusColor = (status: FunnelStage['status']) => {
    switch (status) {
      case 'completed':
        return '#8AFD81';
      case 'in_progress':
        return '#3b82f6';
      case 'pending':
        return '#94a3b8';
      default:
        return '#8AFD81';
    }
  };

  const getStatusLabel = (status: FunnelStage['status']) => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'in_progress':
        return 'En cours';
      case 'pending':
        return 'À venir';
      default:
        return '';
    }
  };

  const getStatusIcon = (status: FunnelStage['status']) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'in_progress':
        return '●';
      case 'pending':
        return '○';
      default:
        return '';
    }
  };

  // Calculate funnel shape points
  const getFunnelPath = (index: number, stageWidth: number) => {
    const y1 = padding + index * stageHeight;
    const y2 = y1 + stageHeight - 8; // Gap between stages

    // Calculate widths for top and bottom of this stage
    const topRatio = (data.length - index) / data.length;
    const bottomRatio = (data.length - index - 1) / data.length;
    
    const topWidth = Math.max(stageWidth * topRatio * 0.8 + stageWidth * 0.2, 100);
    const bottomWidth = Math.max(stageWidth * bottomRatio * 0.8 + stageWidth * 0.2, 80);

    const centerX = width / 2;
    const topLeft = centerX - topWidth / 2;
    const topRight = centerX + topWidth / 2;
    const bottomLeft = centerX - bottomWidth / 2;
    const bottomRight = centerX + bottomWidth / 2;

    return {
      path: `
        M ${topLeft} ${y1}
        L ${topRight} ${y1}
        Q ${topRight + 10} ${y1 + stageHeight / 2}, ${bottomRight} ${y2}
        L ${bottomLeft} ${y2}
        Q ${bottomLeft - 10} ${y1 + stageHeight / 2}, ${topLeft} ${y1}
        Z
      `,
      centerY: (y1 + y2) / 2,
      topWidth,
      bottomWidth,
      y1,
      y2,
    };
  };

  return (
    <div className="w-full relative" style={{ height }}>
      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Gradients for each status */}
          <linearGradient id="funnel-completed" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8AFD81" stopOpacity={0.9} />
            <stop offset="50%" stopColor="#8AFD81" stopOpacity={1} />
            <stop offset="100%" stopColor="#8AFD81" stopOpacity={0.9} />
          </linearGradient>
          <linearGradient id="funnel-in_progress" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity={1} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.9} />
          </linearGradient>
          <linearGradient id="funnel-pending" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.7} />
            <stop offset="50%" stopColor="#94a3b8" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#94a3b8" stopOpacity={0.7} />
          </linearGradient>
          
          {/* 3D effect gradients */}
          <linearGradient id="funnel-3d-overlay" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity={0.3} />
            <stop offset="50%" stopColor="white" stopOpacity={0} />
            <stop offset="100%" stopColor="black" stopOpacity={0.2} />
          </linearGradient>
          
          {/* Glow filter */}
          <filter id="funnel-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Shadow filter */}
          <filter id="funnel-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.15"/>
          </filter>
        </defs>

        {/* Funnel stages - Render in reverse order for proper layering */}
        {[...data].reverse().map((stage, reversedIndex) => {
          const index = data.length - 1 - reversedIndex;
          const { path, centerY, topWidth, y1, y2 } = getFunnelPath(index, width - padding * 4);
          const isHovered = hoveredIndex === index;
          const percentage = ((stage.value / maxValue) * 100).toFixed(0);
          const progress = stage.target ? (stage.value / stage.target) * 100 : 100;

          return (
            <g 
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="cursor-pointer"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.6s ease-out ${index * 0.1}s`,
              }}
            >
              {/* Main funnel shape */}
              <path
                d={path}
                fill={`url(#funnel-${stage.status})`}
                filter={isHovered ? 'url(#funnel-glow)' : 'url(#funnel-shadow)'}
                className="transition-all duration-300"
                style={{
                  transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                  transformOrigin: `${width / 2}px ${centerY}px`,
                }}
              />
              
              {/* 3D overlay */}
              <path
                d={path}
                fill="url(#funnel-3d-overlay)"
                className="pointer-events-none"
              />
              
              {/* Hover highlight */}
              {isHovered && (
                <path
                  d={path}
                  fill="white"
                  fillOpacity={0.15}
                  className="pointer-events-none"
                />
              )}

              {/* Status icon on the left */}
              <circle
                cx={width / 2 - topWidth / 2 - 25}
                cy={centerY}
                r={14}
                fill={getStatusColor(stage.status)}
                stroke="white"
                strokeWidth={2}
                filter="url(#funnel-shadow)"
              />
              <text
                x={width / 2 - topWidth / 2 - 25}
                y={centerY + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-sm font-bold fill-white"
              >
                {getStatusIcon(stage.status)}
              </text>

              {/* Stage name */}
              {showLabels && (
                <text
                  x={width / 2}
                  y={centerY - 10}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-sm font-bold fill-white pointer-events-none"
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
                >
                  {stage.name}
                </text>
              )}

              {/* Value and target */}
              {showValues && (
                <text
                  x={width / 2}
                  y={centerY + 10}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs fill-white/90 pointer-events-none"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
                >
                  {formatter(stage.value)}
                  {stage.target && stage.value < stage.target && ` / ${formatter(stage.target)}`}
                </text>
              )}

              {/* Progress bar for in_progress */}
              {stage.status === 'in_progress' && stage.target && (
                <g>
                  <rect
                    x={width / 2 - 50}
                    y={centerY + 22}
                    width={100}
                    height={6}
                    rx={3}
                    fill="rgba(255,255,255,0.3)"
                  />
                  <rect
                    x={width / 2 - 50}
                    y={centerY + 22}
                    width={progress}
                    height={6}
                    rx={3}
                    fill="white"
                    className="transition-all duration-1000"
                  />
                </g>
              )}

              {/* Date on the right */}
              {stage.date && (
                <text
                  x={width / 2 + topWidth / 2 + 15}
                  y={centerY}
                  textAnchor="start"
                  dominantBaseline="middle"
                  className="text-[10px] fill-slate-500"
                >
                  {stage.date}
                </text>
              )}

              {/* Percentage badge */}
              {showPercentage && (
                <g>
                  <rect
                    x={width / 2 + topWidth / 2 + 10}
                    y={centerY + 10}
                    width={35}
                    height={18}
                    rx={9}
                    fill={getStatusColor(stage.status)}
                    fillOpacity={0.2}
                  />
                  <text
                    x={width / 2 + topWidth / 2 + 27}
                    y={centerY + 19}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-[10px] font-bold"
                    fill={getStatusColor(stage.status)}
                  >
                    {percentage}%
                  </text>
                </g>
              )}

              {/* Connector arrow to next stage */}
              {index < data.length - 1 && (
                <path
                  d={`M ${width / 2} ${y2 + 2} L ${width / 2 - 8} ${y2 + 6} L ${width / 2} ${y2 + 10} L ${width / 2 + 8} ${y2 + 6} Z`}
                  fill={getStatusColor(data[index + 1]?.status || 'pending')}
                  fillOpacity={0.5}
                />
              )}
            </g>
          );
        })}

        {/* Target arrow at top */}
        <g className="pointer-events-none" style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.6s ease-out 0.5s' }}>
          <path
            d={`M ${width / 2} 5 L ${width / 2 - 10} 20 L ${width / 2 + 10} 20 Z`}
            fill="#8AFD81"
            filter="url(#funnel-shadow)"
          />
          <text
            x={width / 2}
            y={32}
            textAnchor="middle"
            className="text-[10px] font-bold fill-emerald-600 uppercase tracking-wider"
          >
            Target: {formatter(maxValue)}
          </text>
        </g>
      </svg>

      {/* Tooltip */}
      {hoveredIndex !== null && (
        <div 
          className="absolute bg-white border border-slate-200 rounded-lg shadow-xl p-4 min-w-[240px] pointer-events-none z-10"
          style={{
            right: 20,
            top: padding + hoveredIndex * stageHeight,
          }}
        >
          <div className="flex items-center gap-3 border-b border-slate-100 pb-2 mb-3">
            <div 
              className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
              style={{ backgroundColor: getStatusColor(data[hoveredIndex].status) }}
            >
              {getStatusIcon(data[hoveredIndex].status)}
            </div>
            <span className="text-sm font-semibold text-slate-900">
              {data[hoveredIndex].name}
            </span>
            <span 
              className="text-xs px-2 py-0.5 rounded-full font-medium ml-auto"
              style={{ 
                backgroundColor: `${getStatusColor(data[hoveredIndex].status)}20`,
                color: getStatusColor(data[hoveredIndex].status),
              }}
            >
              {getStatusLabel(data[hoveredIndex].status)}
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-6">
              <span className="text-sm text-slate-600">Valeur actuelle</span>
              <span className="text-sm font-bold text-slate-900 tabular-nums">
                {formatter(data[hoveredIndex].value)}
              </span>
            </div>
            {data[hoveredIndex].target && (
              <div className="flex items-center justify-between gap-6">
                <span className="text-sm text-slate-600">Objectif</span>
                <span className="text-sm font-bold text-slate-900 tabular-nums">
                  {formatter(data[hoveredIndex].target)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between gap-6">
              <span className="text-sm text-slate-600">Progression</span>
              <span className="text-sm font-bold text-slate-900 tabular-nums">
                {((data[hoveredIndex].value / maxValue) * 100).toFixed(0)}%
              </span>
            </div>
            {data[hoveredIndex].date && (
              <div className="flex items-center justify-between gap-6 pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-500">Date</span>
                <span className="text-xs font-medium text-slate-700">
                  {data[hoveredIndex].date}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#8AFD81]" />
          <span className="text-xs text-slate-600">Terminé</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#3b82f6]" />
          <span className="text-xs text-slate-600">En cours</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#94a3b8]" />
          <span className="text-xs text-slate-600">À venir</span>
        </div>
      </div>
    </div>
  );
};

