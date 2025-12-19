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
  colorScale = { min: '#8AFD81', mid: '#f59e0b', max: '#94a3b8' },
}) => {
  const getStatusColor = (status?: string): string => {
    switch (status) {
      case 'optimal':
        return '#8AFD81'; // Vert Hearst
      case 'warning':
        return '#f59e0b'; // Amber
      case 'critical':
        return '#ef4444'; // Red for critical warning
      case 'offline':
        return '#cbd5e1'; // Slate 300 for offline (neutral)
      default:
        return '#8AFD81'; // Vert Hearst par défaut
    }
  };

  const maxValue = Math.max(...data.map((cell) => cell.value));

  return (
    <div className="inline-block">
      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {data.map((cell, index) => {
          const color = getStatusColor(cell.status);
          const isOffline = cell.status === 'offline';

          return (
            <div
              key={cell.id}
              className={`
                aspect-square rounded-xl flex flex-col items-center justify-center 
                cursor-pointer transition-all duration-300 relative overflow-hidden group
                ${isOffline ? 'bg-slate-100 border border-slate-200' : 'shadow-sm hover:shadow-md hover:-translate-y-1'}
              `}
              style={{
                backgroundColor: isOffline ? undefined : color,
                opacity: isOffline ? 1 : 1,
              }}
              onClick={() => onCellClick && onCellClick(cell)}
              title={`${cell.label || cell.id}: ${cell.value}${cell.status ? ` (${cell.status})` : ''}`}
            >
              {/* Background gradient for depth on active cells */}
              {!isOffline && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-black/5" />
              )}
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center">
                {showLabels && (
                    <div className={`text-[10px] font-bold mb-1 ${isOffline ? 'text-slate-400' : 'text-slate-900/80'}`}>
                    {cell.label || cell.id}
                    </div>
                )}
                
                {/* Status Indicator Dot */}
                <div className={`w-2 h-2 rounded-full ${isOffline ? 'bg-slate-300' : 'bg-white/80 shadow-sm'}`} />
              </div>

              {/* Shine Effect on Hover */}
              {!isOffline && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transform" />
              )}
            </div>
          );
        })}
      </div>
      
      {/* Legend - Updated styling */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-6 pt-6 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#8AFD81] shadow-sm" />
          <span className="text-xs font-semibold text-slate-600">Optimal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#f59e0b] shadow-sm" />
          <span className="text-xs font-semibold text-slate-600">Warning</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ef4444] shadow-sm" />
          <span className="text-xs font-semibold text-slate-600">Critical</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-300 border border-slate-200" />
          <span className="text-xs font-semibold text-slate-400">Offline</span>
        </div>
      </div>
    </div>
  );
};
