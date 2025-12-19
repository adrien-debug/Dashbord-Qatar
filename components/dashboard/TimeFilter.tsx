import React from 'react';

export type TimeRange = '24h' | '7d' | '30d' | '90d' | '1y' | 'all';

interface TimeFilterProps {
  selected: TimeRange;
  onChange: (range: TimeRange) => void;
  options?: TimeRange[];
}

const DEFAULT_OPTIONS: TimeRange[] = ['24h', '7d', '30d', '90d', '1y', 'all'];

const LABELS: Record<TimeRange, string> = {
  '24h': '24H',
  '7d': '7D',
  '30d': '30D',
  '90d': '90D',
  '1y': '1Y',
  'all': 'All',
};

export const TimeFilter: React.FC<TimeFilterProps> = ({
  selected,
  onChange,
  options = DEFAULT_OPTIONS,
}) => {
  return (
    <div className="inline-flex items-center gap-0.5 bg-[#f5f5f7] rounded-xl p-1">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`
            px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all
            ${
              selected === option
                ? 'bg-white text-[#1d1d1f] shadow-sm'
                : 'text-[#86868b] hover:text-[#1d1d1f]'
            }
          `}
        >
          {LABELS[option]}
        </button>
      ))}
    </div>
  );
};
