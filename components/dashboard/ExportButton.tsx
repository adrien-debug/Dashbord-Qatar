import React, { useState } from 'react';

type ExportFormat = 'pdf' | 'excel' | 'csv' | 'print';

interface ExportButtonProps {
  onExport?: (format: ExportFormat) => void;
  formats?: ExportFormat[];
}

const DEFAULT_FORMATS: ExportFormat[] = ['pdf', 'excel', 'print'];

const ICONS: Record<ExportFormat, React.ReactNode> = {
  pdf: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  excel: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  csv: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  print: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
    </svg>
  ),
};

const LABELS: Record<ExportFormat, string> = {
  pdf: 'Export PDF',
  excel: 'Export Excel',
  csv: 'Export CSV',
  print: 'Print',
};

export const ExportButton: React.FC<ExportButtonProps> = ({
  onExport,
  formats = DEFAULT_FORMATS,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = (format: ExportFormat) => {
    if (onExport) {
      onExport(format);
    } else {
      // Default behavior
      console.log(`Exporting as ${format}...`);
      if (format === 'print') {
        window.print();
      }
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-[#0a0b0d] text-white rounded-lg hover:bg-[#1a1b1d] transition-all duration-200 text-sm font-medium"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <span>Export</span>
        <span className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
            {formats.map((format) => (
              <button
                key={format}
                onClick={() => handleExport(format)}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <span className="text-slate-700">{ICONS[format]}</span>
                <span>{LABELS[format]}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
