import React from 'react';

interface ComparisonItem {
  label: string;
  value: number;
  unit?: string;
  color?: string;
}

interface ComparisonCardProps {
  title: string;
  current: ComparisonItem;
  comparison: ComparisonItem;
  showDifference?: boolean;
}

export const ComparisonCard: React.FC<ComparisonCardProps> = ({
  title,
  current,
  comparison,
  showDifference = true,
}) => {
  const difference = current.value - comparison.value;
  const percentageDiff = ((difference / comparison.value) * 100).toFixed(1);
  const isPositive = difference > 0;

  return (
    <div className="bg-white rounded-xl p-5 lg:p-6 border border-gray-200 hover:border-[#10B981]/50 transition-all duration-300 hover:shadow-lg">
      {/* Title */}
      <h3 className="text-sm font-semibold text-[#0b1120] mb-4 uppercase tracking-wide">
        {title}
      </h3>

      {/* Comparison Bars */}
      <div className="space-y-4">
        {/* Current */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">{current.label}</span>
            <span className="text-sm font-bold text-[#0b1120]">
              {current.value}{current.unit || ''}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="h-2.5 rounded-full transition-all duration-1000"
              style={{
                width: '100%',
                backgroundColor: current.color || '#10B981',
              }}
            />
          </div>
        </div>

        {/* Comparison */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">{comparison.label}</span>
            <span className="text-sm font-bold text-gray-700">
              {comparison.value}{comparison.unit || ''}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="h-2.5 rounded-full transition-all duration-1000"
              style={{
                width: `${(comparison.value / current.value) * 100}%`,
                backgroundColor: comparison.color || '#6B7280',
              }}
            />
          </div>
        </div>
      </div>

      {/* Difference */}
      {showDifference && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Difference</span>
            <div className="flex items-center gap-1">
              <span
                className={`text-sm font-bold ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {isPositive ? '+' : ''}{difference.toFixed(1)}
                {current.unit || ''}
              </span>
              <span
                className={`text-xs font-semibold ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                ({isPositive ? '+' : ''}{percentageDiff}%)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
