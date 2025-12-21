/**
 * Model3DPreview - Composant de prévisualisation pour la galerie
 * Version statique sans WebGL - Le 3D est réservé au workspace
 */

import { useState } from 'react';
import { PrimitiveType } from './PrimitiveShapes';
import { 
  Box, 
  Zap, 
  Snowflake, 
  Shield, 
  Layers, 
  Camera, 
  Car, 
  ArrowUpRight,
  Cuboid,
  CircuitBoard,
  Fan,
  Fence,
  Footprints,
  Eye,
} from 'lucide-react';

interface Model3DPreviewProps {
  modelType: PrimitiveType;
  color?: string;
  variant?: string;
  autoRotate?: boolean;
  hovered?: boolean;
  className?: string;
  thumbnail?: string;
  onClick?: () => void;
}

// Configuration des icônes et couleurs par type
const MODEL_CONFIG: Record<string, { 
  icon: React.ElementType; 
  gradient: string;
  accentColor: string;
  pattern: 'grid' | 'dots' | 'lines' | 'circuit';
}> = {
  container: { 
    icon: Cuboid, 
    gradient: 'from-emerald-900 via-emerald-800 to-slate-900',
    accentColor: '#8AFD81',
    pattern: 'grid',
  },
  transformer: { 
    icon: Zap, 
    gradient: 'from-amber-900 via-orange-800 to-slate-900',
    accentColor: '#f59e0b',
    pattern: 'circuit',
  },
  'power-block': { 
    icon: CircuitBoard, 
    gradient: 'from-blue-900 via-blue-800 to-slate-900',
    accentColor: '#3b82f6',
    pattern: 'circuit',
  },
  cooling: { 
    icon: Fan, 
    gradient: 'from-cyan-900 via-teal-800 to-slate-900',
    accentColor: '#06b6d4',
    pattern: 'lines',
  },
  fence: { 
    icon: Fence, 
    gradient: 'from-purple-900 via-violet-800 to-slate-900',
    accentColor: '#a855f7',
    pattern: 'grid',
  },
  camera: { 
    icon: Camera, 
    gradient: 'from-slate-800 via-gray-700 to-slate-900',
    accentColor: '#64748b',
    pattern: 'dots',
  },
  'golf-car': { 
    icon: Car, 
    gradient: 'from-slate-700 via-gray-600 to-slate-900',
    accentColor: '#ffffff',
    pattern: 'dots',
  },
  ground: { 
    icon: Layers, 
    gradient: 'from-stone-800 via-stone-700 to-slate-900',
    accentColor: '#78716c',
    pattern: 'grid',
  },
  stairs: { 
    icon: Footprints, 
    gradient: 'from-yellow-900 via-amber-800 to-slate-900',
    accentColor: '#fbbf24',
    pattern: 'lines',
  },
  placeholder: { 
    icon: Box, 
    gradient: 'from-emerald-900 via-green-800 to-slate-900',
    accentColor: '#8AFD81',
    pattern: 'grid',
  },
};

// Patterns SVG
function PatternBackground({ pattern, color }: { pattern: string; color: string }) {
  switch (pattern) {
    case 'grid':
      return (
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke={color} strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      );
    case 'dots':
      return (
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill={color}/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      );
    case 'lines':
      return (
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="lines" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="40" stroke={color} strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#lines)" />
        </svg>
      );
    case 'circuit':
      return (
        <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 30 20 M 30 40 L 30 60 M 0 30 L 20 30 M 40 30 L 60 30" stroke={color} strokeWidth="0.5" fill="none"/>
              <circle cx="30" cy="30" r="3" fill={color}/>
              <circle cx="30" cy="20" r="2" fill={color}/>
              <circle cx="30" cy="40" r="2" fill={color}/>
              <circle cx="20" cy="30" r="2" fill={color}/>
              <circle cx="40" cy="30" r="2" fill={color}/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      );
    default:
      return null;
  }
}

export function Model3DPreview({
  modelType,
  color,
  hovered = false,
  className = '',
  thumbnail,
  onClick,
}: Model3DPreviewProps) {
  const [imgError, setImgError] = useState(false);
  const config = MODEL_CONFIG[modelType] || MODEL_CONFIG.placeholder;
  const Icon = config.icon;
  const accentColor = color || config.accentColor;

  // Utiliser la thumbnail si disponible et pas d'erreur de chargement
  const showThumbnail = thumbnail && !imgError;

  return (
    <div 
      className={`relative overflow-hidden cursor-pointer group ${className}`}
      onClick={onClick}
    >
      {/* Thumbnail image si disponible */}
      {showThumbnail ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnail}
            alt="Preview"
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${
              hovered ? 'scale-110' : 'scale-100'
            }`}
            onError={() => setImgError(true)}
          />
          {/* Overlay sombre pour lisibilité */}
          <div 
            className={`absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent transition-opacity duration-300 ${
              hovered ? 'opacity-80' : 'opacity-60'
            }`}
          />
        </>
      ) : (
        <>
          {/* Background gradient (fallback) */}
          <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} transition-all duration-500`} />
          
          {/* Pattern overlay */}
          <PatternBackground pattern={config.pattern} color={accentColor} />
          
          {/* Animated glow effect on hover */}
          <div 
            className={`absolute inset-0 transition-opacity duration-500 ${
              hovered ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              background: `radial-gradient(circle at center, ${accentColor}15 0%, transparent 70%)`,
            }}
          />
          
          {/* Floating particles effect */}
          {hovered && (
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 rounded-full animate-float"
                  style={{
                    backgroundColor: accentColor,
                    left: `${15 + i * 15}%`,
                    top: `${20 + (i % 3) * 25}%`,
                    animationDelay: `${i * 0.2}s`,
                    opacity: 0.6,
                  }}
                />
              ))}
            </div>
          )}

          {/* Main content - Icon (seulement en mode fallback) */}
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4">
            {/* Icon container with glow */}
            <div 
              className={`relative p-5 rounded-2xl backdrop-blur-sm border transition-all duration-300 ${
                hovered 
                  ? 'bg-white/10 border-white/30 scale-110 shadow-2xl' 
                  : 'bg-black/20 border-white/10 scale-100'
              }`}
              style={{ 
                boxShadow: hovered ? `0 0 40px ${accentColor}50, 0 0 80px ${accentColor}20` : 'none',
              }}
            >
              {/* Rotating ring on hover */}
              {hovered && (
                <div 
                  className="absolute inset-0 rounded-2xl animate-spin-slow"
                  style={{
                    background: `conic-gradient(from 0deg, transparent, ${accentColor}40, transparent)`,
                  }}
                />
              )}
              
              <Icon 
                className={`relative z-10 transition-all duration-300 ${
                  hovered ? 'w-10 h-10' : 'w-8 h-8'
                }`}
                style={{ color: accentColor }}
                strokeWidth={1.5}
              />
            </div>
          </div>

          {/* Corner accent */}
          <div 
            className={`absolute top-0 right-0 w-20 h-20 transition-opacity duration-300 ${
              hovered ? 'opacity-100' : 'opacity-50'
            }`}
            style={{
              background: `linear-gradient(135deg, ${accentColor}20 0%, transparent 60%)`,
            }}
          />
        </>
      )}

      {/* 3D badge - toujours visible */}
      <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 transition-all duration-300 ${
        hovered ? 'opacity-100 translate-y-0' : 'opacity-70 translate-y-1'
      }`}>
        <div 
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md border"
          style={{ 
            backgroundColor: `${accentColor}20`,
            borderColor: `${accentColor}40`,
          }}
        >
          <Eye className="w-3 h-3" style={{ color: accentColor }} />
          <span 
            className="text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: accentColor }}
          >
            {hovered ? 'Ouvrir en 3D' : 'Voir en 3D'}
          </span>
          {hovered && (
            <ArrowUpRight className="w-3 h-3 animate-pulse" style={{ color: accentColor }} />
          )}
        </div>
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-900/90 to-transparent pointer-events-none z-20" />
    </div>
  );
}

export default Model3DPreview;
