import React from 'react';

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
  thresholds,
}) => {
  const percentage = ((value - min) / (max - min)) * 100;
  const angle = (percentage / 100) * 180 - 90;

  const getColor = (): string => {
    if (color) return color;
    
    if (thresholds) {
      for (let i = thresholds.length - 1; i >= 0; i--) {
        if (value >= thresholds[i].value) {
          return thresholds[i].color;
        }
      }
    }
    
    // Default color scheme - Premium palette
    if (percentage >= 90) return '#64748B'; // Slate 500
    if (percentage >= 75) return '#94A3B8'; // Slate 400
    if (percentage >= 50) return '#10B981'; // Emerald 500
    return '#10B981'; // Emerald 500
  };

  const gaugeColor = getColor();
  const radius = size / 2 - 10;
  const strokeWidth = 12;

  return (
    <div className="flex flex-col items-center justify-center" style={{ width: size, height: size * 0.7 }}>
      <svg width={size} height={size * 0.6} className="overflow-visible">
        {/* Background arc */}
        <path
          d={`M ${size / 2 - radius} ${size / 2} A ${radius} ${radius} 0 0 1 ${size / 2 + radius} ${size / 2}`}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        
        {/* Value arc */}
        <path
          d={`M ${size / 2 - radius} ${size / 2} A ${radius} ${radius} 0 0 1 ${size / 2 + radius} ${size / 2}`}
          fill="none"
          stroke={gaugeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${(percentage / 100) * Math.PI * radius} ${Math.PI * radius}`}
          style={{
            transition: 'stroke-dasharray 1s ease-in-out',
          }}
        />
        
        {/* Needle */}
        <line
          x1={size / 2}
          y1={size / 2}
          x2={size / 2 + radius * 0.7 * Math.cos((angle * Math.PI) / 180)}
          y2={size / 2 + radius * 0.7 * Math.sin((angle * Math.PI) / 180)}
          stroke={gaugeColor}
          strokeWidth={3}
          strokeLinecap="round"
          style={{
            transition: 'all 1s ease-in-out',
            transformOrigin: `${size / 2}px ${size / 2}px`,
          }}
        />
        
        {/* Center dot */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={6}
          fill={gaugeColor}
        />
      </svg>
      
      {showValue && (
        <div className="text-center mt-2">
          <div className="text-2xl font-bold" style={{ color: gaugeColor }}>
            {value.toFixed(1)}{unit}
          </div>
          <div className="text-xs text-slate-500 uppercase tracking-wider mt-1 font-medium">
            {label}
          </div>
        </div>
      )}
    </div>
  );
};
