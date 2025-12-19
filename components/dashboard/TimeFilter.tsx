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
    <div className="inline-flex items-center gap-0.5 bg-[#1A1F2E] rounded-lg p-0.5 border border-[#2A3142]">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`
            px-2.5 py-1 rounded text-[11px] font-medium transition-colors
            ${
              selected === option
                ? 'bg-[#10B981] text-white'
                : 'text-slate-400 hover:text-white'
            }
          `}
        >
          {LABELS[option]}
        </button>
      ))}
    </div>
  );
};
