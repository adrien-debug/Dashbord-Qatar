import React from 'react';

interface HeatmapCell {
  id: string;
  value: number;
  label?: string;
  status?: 'optimal' | 'warning' | 'critical' | 'offline';
}

interface HeatmapProps {
  data: HeatmapCell[];
  rows: number;
  cols: number;
  cellSize?: number;
  showLabels?: boolean;
  showValues?: boolean;
  onCellClick?: (cell: HeatmapCell) => void;
  colorScale?: { min: string; mid: string; max: string };
}

export const Heatmap: React.FC<HeatmapProps> = ({
  data,
  rows,
  cols,
  cellSize = 60,
  showLabels = false,
  showValues = false,
  onCellClick,
}) => {
  const getStatusColor = (status?: string): string => {
    switch (status) {
      case 'optimal':
        return '#22C55E'; // Emerald 500 - premium green
      case 'warning':
        return '#94A3B8'; // Slate 400
      case 'critical':
        return '#64748B'; // Slate 500
      case 'offline':
        return '#E2E8F0'; // Slate 200
      default:
        return '#22C55E';
    }
  };

  return (
    <div className="inline-block">
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {data.map((cell) => {
          const color = getStatusColor(cell.status);
          const isOffline = cell.status === 'offline';

          return (
            <div
              key={cell.id}
              className={`
                aspect-square rounded-lg flex flex-col items-center justify-center 
                cursor-pointer transition-all duration-200 relative overflow-hidden group
                ${isOffline ? 'bg-slate-100 border border-slate-200' : 'hover:scale-105'}
              `}
              style={{
                backgroundColor: isOffline ? undefined : color,
              }}
              onClick={() => onCellClick && onCellClick(cell)}
              title={`${cell.label || cell.id}: ${cell.value}${cell.status ? ` (${cell.status})` : ''}`}
            >
              {/* Background gradient for depth */}
              {!isOffline && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-black/10" />
              )}
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center">
                {showLabels && (
                  <div className={`text-[9px] font-semibold ${isOffline ? 'text-slate-400' : 'text-white/90'}`}>
                    {cell.label || cell.id}
                  </div>
                )}
                
                {/* Status Indicator */}
                <div className={`w-1.5 h-1.5 rounded-full ${isOffline ? 'bg-slate-300' : 'bg-white/70'}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
