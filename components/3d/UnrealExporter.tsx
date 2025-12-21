/**
 * UnrealExporter - Composant pour exporter vers Unreal Engine
 */

import { useState } from 'react';

interface UnrealExporterProps {
  onExport?: (data: any) => void;
}

export const UnrealExporter: React.FC<UnrealExporterProps> = ({ onExport }) => {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    
    try {
      // Logique d'export vers Unreal Engine
      const exportData = {
        format: 'unreal-4k',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      };

      if (onExport) {
        onExport(exportData);
      }

      // Simuler un export asynchrone
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert('✅ Export Unreal Engine réussi!');
    } catch (error) {
      // Gestion correcte des erreurs - ErrorEvent ou Error
      let errorMessage = 'Erreur inconnue';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message);
      } else if (error && typeof error === 'object' && 'type' in error) {
        // ErrorEvent
        errorMessage = 'Erreur lors de l\'export Unreal Engine';
      }
      
      console.error('❌ Erreur export Unreal:', error);
      alert('❌ Erreur lors de l\'export Unreal Engine\n\n' + errorMessage);
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="px-4 py-2 bg-[#8AFD81] text-slate-900 rounded-lg hover:bg-[#7aed6f] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {exporting ? 'Export en cours...' : 'Exporter vers Unreal Engine'}
    </button>
  );
};


