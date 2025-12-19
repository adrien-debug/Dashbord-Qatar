import React, { useState } from 'react';

type ExportFormat = 'pdf' | 'excel' | 'csv' | 'print' | 'unreal-4k' | 'blender';

interface ExportButtonProps {
  onExport?: (format: ExportFormat, saveLocal: boolean) => void;
  formats?: ExportFormat[];
}

const DEFAULT_FORMATS: ExportFormat[] = ['pdf', 'excel', 'print', 'unreal-4k', 'blender'];

const ICONS: Record<ExportFormat, React.ReactNode> = {
  pdf: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  excel: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  csv: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  print: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
    </svg>
  ),
  'unreal-4k': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  blender: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
};

const LABELS: Record<ExportFormat, string> = {
  pdf: 'Export PDF',
  excel: 'Export Excel',
  csv: 'Export CSV',
  print: 'Print',
  'unreal-4k': 'Unreal Engine 4K',
  blender: 'Blender Export',
};

export const ExportButton: React.FC<ExportButtonProps> = ({
  onExport,
  formats = DEFAULT_FORMATS,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [saveLocal, setSaveLocal] = useState(false);

  const handleExport = (format: ExportFormat) => {
    if (onExport) {
      onExport(format, saveLocal);
    } else {
      console.log(`Exporting as ${format}...`, { saveLocal });
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
        className="flex items-center gap-2 px-4 py-2 bg-[#10B981] text-white rounded-xl hover:bg-[#059669] transition-colors text-[13px] font-medium"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <span>Export</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-52 bg-white/95 backdrop-blur-xl rounded-xl border border-[#d2d2d7]/50 shadow-xl py-2 z-20">
            <div className="px-3 py-2 border-b border-[#d2d2d7]/50">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveLocal}
                  onChange={(e) => setSaveLocal(e.target.checked)}
                  className="w-4 h-4 rounded border-[#d2d2d7] text-[#10B981] focus:ring-[#10B981]"
                />
                <span className="text-[12px] text-[#86868b]">Save locally</span>
              </label>
            </div>
            <div className="py-1">
              {formats.map((format) => (
                <button
                  key={format}
                  onClick={() => handleExport(format)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors"
                >
                  <span className="text-[#86868b]">{ICONS[format]}</span>
                  <span>{LABELS[format]}</span>
                  {(format === 'unreal-4k' || format === 'blender') && (
                    <span className="ml-auto px-1.5 py-0.5 bg-[#10B981]/10 text-[#10B981] text-[10px] font-medium rounded">
                      Pro
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
