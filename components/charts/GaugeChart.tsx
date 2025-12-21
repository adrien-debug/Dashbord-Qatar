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
  const strokeWidth = Math.max(14, computedSize * 0.1);
  const radius = (computedSize / 2) - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = mounted ? circumference * (1 - clampedPercentage / 100) : circumference;

  // Generate unique ID for gradients
  const uniqueId = `gauge-${label.replace(/\s+/g, '-').toLowerCase()}-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center"
      style={{ width: '100%', height: '100%', minHeight: computedSize, minWidth: computedSize }}
    >
      {/* SVG Circle */}
      <svg width={computedSize} height={computedSize} className="transform -rotate-90">
        <defs>
          {/* Premium gradient with multiple stops */}
          <linearGradient id={`${uniqueId}-gradient`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8AFD81" stopOpacity={0.8} />
            <stop offset="50%" stopColor="#8AFD81" stopOpacity={1} />
            <stop offset="100%" stopColor="#b6ffb0" stopOpacity={1} />
          </linearGradient>
          
          {/* Glow effect */}
          <filter id={`${uniqueId}-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Drop shadow */}
          <filter id={`${uniqueId}-shadow`} x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#8AFD81" floodOpacity="0.5"/>
          </filter>
        </defs>
        
        {/* Background track */}
        <circle
          cx={computedSize / 2}
          cy={computedSize / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
          strokeOpacity={0.5}
        />
        
        {/* Animated progress arc */}
        <circle
          cx={computedSize / 2}
          cy={computedSize / 2}
          r={radius}
          fill="none"
          stroke={`url(#${uniqueId}-gradient)`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          filter={`url(#${uniqueId}-shadow)`}
          style={{
            transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </svg>
      
      {/* Center content */}
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            {/* Value with glow effect */}
            <div className="flex items-end justify-center gap-1 mb-2">
              <span 
                className="text-4xl font-black leading-none tabular-nums bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] bg-clip-text text-transparent"
                style={{ textShadow: '0 0 30px rgba(138, 253, 129, 0.3)' }}
              >
                {value.toFixed(1)}
              </span>
              <span className="text-lg text-[#8AFD81] font-bold pb-0.5">{unit}</span>
            </div>
            
            {/* Label */}
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-3">
              {label}
            </div>
            
            {/* Premium status badge */}
            <div 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#8AFD81]/10 to-[#8AFD81]/5 border border-[#8AFD81]/30 shadow-[0_0_20px_rgba(138,253,129,0.1)]"
            >
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-[#8AFD81] shadow-[0_0_8px_#8AFD81]" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-[#8AFD81] animate-ping opacity-50" />
              </div>
              <span 
                className="text-[10px] font-bold uppercase tracking-wider text-[#8AFD81]"
              >
                {clampedPercentage >= 80 ? 'Optimal' : clampedPercentage >= 50 ? 'Normal' : 'Low'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
