import React from 'react';

export type TimeRange = '24h' | '7d' | '30d' | '90d' | '1y' | 'all';

interface TimeFilterProps {
  selected: TimeRange;
  onChange: (range: TimeRange) => void;
  options?: TimeRange[];
}

const DEFAULT_OPTIONS: TimeRange[] = ['24h', '7d', '30d', '90d', '1y', 'all'];

const LABELS: Record<TimeRange, string> = {
  '24h': '24 Hours',
  '7d': '7 Days',
  '30d': '30 Days',
  '90d': '90 Days',
  '1y': '1 Year',
  'all': 'All Time',
};

export const TimeFilter: React.FC<TimeFilterProps> = ({
  selected,
  onChange,
  options = DEFAULT_OPTIONS,
}) => {
  return (
    <div className="inline-flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`
            px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200
            ${
              selected === option
                ? 'bg-[#0a0b0d] text-[#10B981] shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
            }
          `}
        >
          {LABELS[option]}
        </button>
      ))}
    </div>
  );
};
