import React, { useState } from 'react';

type ExportFormat = 'pdf' | 'excel' | 'csv' | 'print' | 'unreal-4k' | 'blender';

interface ExportButtonProps {
  onExport?: (format: ExportFormat, saveLocal: boolean) => void;
  formats?: ExportFormat[];
}

const DEFAULT_FORMATS: ExportFormat[] = ['pdf', 'excel', 'print', 'unreal-4k', 'blender'];

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
  'unreal-4k': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  blender: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
      // Default behavior
      console.log(`Exporting as ${format}...`, { saveLocal });
      
      if (format === 'print') {
        window.print();
      } else if (format === 'unreal-4k') {
        // Logique pour export Unreal Engine 4K
        console.log('Exporting to Unreal Engine 4K format...');
        if (saveLocal) {
          // Sauvegarder localement
          const data = JSON.stringify({ format: 'unreal-4k', timestamp: new Date().toISOString() });
          const blob = new Blob([data], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `unreal-export-4k-${Date.now()}.json`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      } else if (format === 'blender') {
        // Logique pour export Blender
        console.log('Exporting to Blender format...');
        if (saveLocal) {
          const data = JSON.stringify({ format: 'blender', timestamp: new Date().toISOString() });
          const blob = new Blob([data], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `blender-export-${Date.now()}.json`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1 bg-[#10B981] text-white rounded-lg hover:bg-[#0EA572] transition-colors text-[11px] font-medium"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <span>Export</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-[#1A1F2E] rounded-lg border border-[#2A3142] py-2 z-20">
            <div className="px-3 py-2 border-b border-[#2A3142]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveLocal}
                  onChange={(e) => setSaveLocal(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-slate-600 bg-[#2A3142] text-[#10B981] focus:ring-[#10B981] focus:ring-1"
                />
                <span className="text-[10px] text-slate-400 uppercase tracking-wide">Save locally</span>
              </label>
            </div>
            <div className="py-1">
              {formats.map((format) => (
                <button
                  key={format}
                  onClick={() => handleExport(format)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[11px] text-slate-300 hover:bg-[#2A3142] hover:text-white transition-colors"
                >
                  <span className="text-slate-500">{ICONS[format]}</span>
                  <span>{LABELS[format]}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
