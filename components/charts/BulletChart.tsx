import React from 'react';

interface BulletChartData {
  label: string;
  value: number;
  target: number;
  ranges: [number, number, number]; // [poor, satisfactory, good]
  unit?: string;
}

interface BulletChartProps {
  data: BulletChartData[];
  height?: number;
  showLabels?: boolean;
  showValues?: boolean;
  primaryColor?: string;
  targetColor?: string;
}

export const BulletChart: React.FC<BulletChartProps> = ({
  data,
  height = 60,
  showLabels = true,
  showValues = true,
  primaryColor = '#8AFD81',
  targetColor = '#1e293b',
}) => {
  return (
    <div className="w-full space-y-6">
      {data.map((item, index) => {
        const maxRange = item.ranges[2];
        const valuePercentage = Math.min((item.value / maxRange) * 100, 100);
        const targetPercentage = Math.min((item.target / maxRange) * 100, 100);
        const isAboveTarget = item.value >= item.target;
        
        // Calculate range percentages
        const range1Percentage = (item.ranges[0] / maxRange) * 100;
        const range2Percentage = (item.ranges[1] / maxRange) * 100;
        
        return (
          <div key={index} className="w-full">
            {/* Label Row */}
            {showLabels && (
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                {showValues && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-900 tabular-nums">
                      {item.value.toLocaleString('fr-FR')}
                      {item.unit && <span className="text-xs text-slate-500 ml-1">{item.unit}</span>}
                    </span>
                    <span className="text-xs text-slate-400">/</span>
                    <span className="text-xs text-slate-500 tabular-nums">
                      Target: {item.target.toLocaleString('fr-FR')}
                    </span>
                    {isAboveTarget ? (
                      <span className="text-xs font-medium text-[#8AFD81] bg-[#8AFD81]/10 px-2 py-0.5 rounded-full">
                        ✓ Atteint
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                        {((item.target - item.value) / item.target * 100).toFixed(1)}% restant
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Bullet Chart */}
            <div 
              className="relative w-full rounded-lg overflow-hidden"
              style={{ height }}
            >
              {/* Background Ranges */}
              <div className="absolute inset-0 flex">
                {/* Poor Range */}
                <div 
                  className="h-full bg-slate-200"
                  style={{ width: `${range1Percentage}%` }}
                />
                {/* Satisfactory Range */}
                <div 
                  className="h-full bg-slate-300"
                  style={{ width: `${range2Percentage - range1Percentage}%` }}
                />
                {/* Good Range */}
                <div 
                  className="h-full bg-slate-400"
                  style={{ width: `${100 - range2Percentage}%` }}
                />
              </div>
              
              {/* Value Bar */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 h-2/5 rounded transition-all duration-1000 ease-out"
                style={{ 
                  width: `${valuePercentage}%`,
                  background: `linear-gradient(90deg, ${primaryColor}cc, ${primaryColor})`,
                  boxShadow: `0 0 20px ${primaryColor}40`,
                }}
              />
              
              {/* Target Line */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 transition-all duration-500"
                style={{ 
                  left: `${targetPercentage}%`,
                  backgroundColor: targetColor,
                }}
              >
                {/* Target Diamond */}
                <div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rotate-45"
                  style={{ backgroundColor: targetColor }}
                />
              </div>
              
              {/* Gradient Overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
            </div>
            
            {/* Range Labels */}
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-slate-400">0</span>
              <span className="text-[10px] text-slate-400">{item.ranges[0].toLocaleString('fr-FR')}</span>
              <span className="text-[10px] text-slate-400">{item.ranges[1].toLocaleString('fr-FR')}</span>
              <span className="text-[10px] text-slate-400">{maxRange.toLocaleString('fr-FR')}</span>
            </div>
          </div>
        );
      })}
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-6 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 rounded" style={{ background: `linear-gradient(90deg, ${primaryColor}cc, ${primaryColor})` }} />
          <span className="text-xs text-slate-600">Valeur actuelle</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rotate-45" style={{ backgroundColor: targetColor }} />
          <span className="text-xs text-slate-600">Objectif</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex">
            <div className="w-3 h-3 bg-slate-200 rounded-l" />
            <div className="w-3 h-3 bg-slate-300" />
            <div className="w-3 h-3 bg-slate-400 rounded-r" />
          </div>
          <span className="text-xs text-slate-600">Zones de performance</span>
        </div>
      </div>
    </div>
  );
};

