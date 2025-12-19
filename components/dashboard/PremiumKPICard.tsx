import React from 'react';
import { Sparkline } from '../charts/Sparkline';

interface PremiumKPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  sparklineData?: number[];
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  status?: 'optimal' | 'warning' | 'critical';
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
}

export const PremiumKPICard: React.FC<PremiumKPICardProps> = ({
  title,
  value,
  unit,
  sparklineData,
  trend,
  status = 'optimal',
  subtitle,
  icon,
  color,
}) => {
  const getStatusColor = () => {
    if (color) return color;
    switch (status) {
      case 'optimal':
        return '#10B981'; // Vert Hearst
      case 'warning':
        return '#f59e0b'; // Amber
      case 'critical':
        return '#64748b'; // Gray - jamais de rouge
      default:
        return '#10B981'; // Vert Hearst par défaut
    }
  };

  const statusColor = getStatusColor();

  const getTrendColor = () => {
    if (trend?.isPositive === undefined) return '#64748b';
    return trend.isPositive ? '#10B981' : '#94a3b8';
  };

  const getTrendIcon = () => {
    if (trend?.isPositive === undefined) return '→';
    return trend.isPositive ? '↑' : '↓';
  };

  return (
    <div className="bg-white rounded-xl p-5 lg:p-6 border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon && <div className="text-gray-400">{icon}</div>}
          <div className="text-slate-500 text-[10px] sm:text-xs uppercase tracking-wider font-semibold">
            {title}
          </div>
        </div>
        <div
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: statusColor }}
        />
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-2 mb-3">
        <div
          className="text-3xl sm:text-4xl font-bold"
          style={{ color: statusColor }}
        >
          {value}
        </div>
        {unit && (
          <div className="text-base sm:text-lg text-slate-600 font-medium">
            {unit}
          </div>
        )}
      </div>

      {/* Sparkline */}
      {sparklineData && sparklineData.length > 0 && (
        <div className="mb-3 -mx-2">
          <Sparkline data={sparklineData} color={statusColor} height={40} />
        </div>
      )}

      {/* Trend & Subtitle */}
      <div className="flex items-center justify-between">
        {trend && (
          <div className="flex items-center gap-1 text-xs">
            <span
              className="font-semibold"
              style={{ color: getTrendColor() }}
            >
              {getTrendIcon()} {Math.abs(trend.value)}%
            </span>
            <span className="text-slate-500">{trend.label}</span>
          </div>
        )}
        {subtitle && !trend && (
          <div className="text-slate-500 text-[10px] sm:text-xs">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};
