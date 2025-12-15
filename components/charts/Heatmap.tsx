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
        return '#94a3b8'; // Gray - jamais de rouge
      case 'offline':
        return '#64748b'; // Slate foncé
      default:
        return '#8AFD81'; // Vert Hearst par défaut
    }
  };

  const getValueColor = (value: number, max: number): string => {
    const percentage = (value / max) * 100;
    if (percentage >= 90) return colorScale.max;
    if (percentage >= 70) return colorScale.mid;
    return colorScale.min;
  };

  const maxValue = Math.max(...data.map((cell) => cell.value));

  return (
    <div className="inline-block">
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
        }}
      >
        {data.map((cell, index) => {
          const color = cell.status
            ? getStatusColor(cell.status)
            : getValueColor(cell.value, maxValue);

          return (
            <div
              key={cell.id}
              className="rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border border-white/30"
              style={{
                backgroundColor: color,
                opacity: cell.status === 'offline' ? 0.5 : 1,
              }}
              onClick={() => onCellClick && onCellClick(cell)}
              title={`${cell.label || cell.id}: ${cell.value}${cell.status ? ` (${cell.status})` : ''}`}
            >
              {showLabels && (
                <div className="text-[10px] font-semibold text-white/90">
                  {cell.label || cell.id}
                </div>
              )}
              {showValues && (
                <div className="text-xs font-bold text-white">
                  {cell.value}
                </div>
              )}
              {cell.status && (
                <div className="w-2 h-2 rounded-full bg-white/80 mt-1" />
              )}
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-[#8AFD81]" />
          <span className="text-slate-600 font-medium">Optimal</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-[#f59e0b]" />
          <span className="text-slate-600 font-medium">Warning</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-[#94a3b8]" />
          <span className="text-slate-600 font-medium">Critical</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-[#64748b]" />
          <span className="text-slate-600 font-medium">Offline</span>
        </div>
      </div>
    </div>
  );
};
