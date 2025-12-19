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
    <div className="inline-flex items-center gap-1 bg-white rounded-xl p-1.5 border border-slate-200 shadow-sm">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`
            px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
            ${
              selected === option
                ? 'bg-emerald-500 text-white'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }
          `}
        >
          {LABELS[option]}
        </button>
      ))}
    </div>
  );
};
