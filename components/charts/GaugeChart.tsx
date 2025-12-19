import React, { useEffect, useRef, useState } from 'react';

interface GaugeChartProps {
  value: number;
  max?: number;
  min?: number;
  label: string;
  unit?: string;
  size?: number;
  showValue?: boolean;
  color?: string;
  thresholds?: { value: number; color: string }[];
}

export const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  max = 100,
  min = 0,
  label,
  unit = '%',
  size = 200,
  showValue = true,
  color,
}) => {
  const [mounted, setMounted] = useState(false);
  const [containerSize, setContainerSize] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || typeof ResizeObserver === 'undefined') return;

    const updateSize = () => {
      const rect = element.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const nextSize = height > 0 ? Math.min(width, height) : width;
      setContainerSize(nextSize > 0 ? nextSize : null);
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(element);

    return () => observer.disconnect();
  }, [size]);

  const computedSize = containerSize ?? size;

  const percentage = ((value - min) / (max - min)) * 100;
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  
  // Circle calculations
  const strokeWidth = Math.max(12, computedSize * 0.08);
  const radius = (computedSize / 2) - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  // Generate unique ID for gradients
  const uniqueId = `gauge-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center"
      style={{ width: '100%', height: '100%', minHeight: computedSize, minWidth: computedSize }}
    >
      {/* SVG Circle */}
      <svg width={computedSize} height={computedSize} className="transform -rotate-90">
        <defs>
          {/* Full green gradient */}
          <linearGradient id={`${uniqueId}-gradient`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8AFD81" stopOpacity={1} />
            <stop offset="50%" stopColor="#b6ffb0" stopOpacity={1} />
            <stop offset="100%" stopColor="#4ade80" stopOpacity={1} />
          </linearGradient>
          
          {/* Drop shadow */}
          <filter id={`${uniqueId}-shadow`}>
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#8AFD81" floodOpacity="0.3"/>
          </filter>
        </defs>
        
        {/* Full green circle - all around */}
        <circle
          cx={computedSize / 2}
          cy={computedSize / 2}
          r={radius}
          fill="none"
          stroke={`url(#${uniqueId}-gradient)`}
          strokeWidth={strokeWidth}
          filter={`url(#${uniqueId}-shadow)`}
        />
      </svg>
      
      {/* Center content */}
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            {/* Value - Green */}
            <div className="flex items-end justify-center gap-1 mb-1">
              <span 
                className="text-4xl font-bold leading-none tabular-nums text-[#8AFD81]"
              >
                {value.toFixed(1)}
              </span>
              <span className="text-base text-[#8AFD81] font-medium pb-0.5">{unit}</span>
            </div>
            
            {/* Label */}
            <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mb-2.5">
              {label}
            </div>
            
            {/* Status badge - Green */}
            <div 
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#8AFD81]/10 border border-[#8AFD81]/30"
            >
              <div 
                className="w-1.5 h-1.5 rounded-full bg-[#8AFD81]"
              />
              <span 
                className="text-[9px] font-bold uppercase tracking-wide text-[#8AFD81]"
              >
                {clampedPercentage >= 80 ? 'Optimal' : 'Normal'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
