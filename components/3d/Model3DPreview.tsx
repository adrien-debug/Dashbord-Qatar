/**
 * Model3DPreview - Composant de prévisualisation 3D pour la galerie
 * Le Canvas 3D ne s'active QU'AU HOVER pour éviter les problèmes de contextes WebGL
 */

import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { PrimitiveSelector, PrimitiveType } from './PrimitiveShapes';
import * as THREE from 'three';
import { Box, Zap, Snowflake, Shield, Layers, Camera, Car, ArrowUpRight } from 'lucide-react';

interface Model3DPreviewProps {
  modelType: PrimitiveType;
  color?: string;
  variant?: string;
  autoRotate?: boolean;
  hovered?: boolean;
  className?: string;
  onClick?: () => void;
}

// Composant interne pour le modèle rotatif
function RotatingModel({ 
  modelType, 
  color, 
  variant, 
}: {
  modelType: PrimitiveType;
  color?: string;
  variant?: string;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group ref={groupRef}>
      <PrimitiveSelector 
        type={modelType} 
        color={color} 
        variant={variant}
        animate={true}
        scale={0.8}
      />
    </group>
  );
}

// Loader pendant le chargement
function Loader() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshBasicMaterial color="#8AFD81" wireframe />
    </mesh>
  );
}

// Icône selon le type de modèle
function getModelIcon(modelType: PrimitiveType) {
  switch (modelType) {
    case 'container':
      return <Box className="w-8 h-8" />;
    case 'transformer':
    case 'power-block':
      return <Zap className="w-8 h-8" />;
    case 'cooling':
      return <Snowflake className="w-8 h-8" />;
    case 'fence':
      return <Shield className="w-8 h-8" />;
    case 'camera':
      return <Camera className="w-8 h-8" />;
    case 'golf-car':
      return <Car className="w-8 h-8" />;
    case 'ground':
    case 'stairs':
    default:
      return <Layers className="w-8 h-8" />;
  }
}

// Couleur selon le type
function getModelColor(modelType: PrimitiveType, customColor?: string): string {
  if (customColor) return customColor;
  
  const colors: Record<string, string> = {
    container: '#8AFD81',
    transformer: '#f59e0b',
    'power-block': '#3b82f6',
    cooling: '#06b6d4',
    fence: '#a855f7',
    camera: '#64748b',
    'golf-car': '#ffffff',
    ground: '#78716c',
    stairs: '#fbbf24',
    placeholder: '#8AFD81',
  };
  
  return colors[modelType] || '#8AFD81';
}

// Placeholder statique avec animation CSS
function StaticPlaceholder({ 
  modelType, 
  color,
  isHovered,
}: { 
  modelType: PrimitiveType; 
  color?: string;
  isHovered: boolean;
}) {
  const modelColor = getModelColor(modelType, color);
  
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Grille de fond animée */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(${modelColor}20 1px, transparent 1px),
                           linear-gradient(90deg, ${modelColor}20 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />
      
      {/* Cercle lumineux au centre */}
      <div 
        className={`absolute w-32 h-32 rounded-full blur-3xl transition-all duration-500 ${
          isHovered ? 'opacity-30 scale-110' : 'opacity-10 scale-100'
        }`}
        style={{ backgroundColor: modelColor }}
      />
      
      {/* Icône centrale */}
      <div className={`relative z-10 flex flex-col items-center transition-all duration-300 ${
        isHovered ? 'scale-110' : 'scale-100'
      }`}>
        <div 
          className={`p-4 rounded-2xl backdrop-blur-sm border transition-all duration-300 ${
            isHovered 
              ? 'bg-white/10 border-white/20 shadow-lg' 
              : 'bg-slate-800/50 border-slate-700/50'
          }`}
          style={{ 
            boxShadow: isHovered ? `0 0 30px ${modelColor}40` : 'none',
          }}
        >
          <div style={{ color: modelColor }} className="transition-transform duration-300">
            {getModelIcon(modelType)}
          </div>
        </div>
        
        {/* Label */}
        <div className={`mt-3 flex items-center gap-1.5 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-1'
        }`}>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
            {isHovered ? 'Vue 3D Active' : 'Survoler pour 3D'}
          </span>
          {isHovered && (
            <ArrowUpRight className="w-3 h-3 text-slate-400 animate-pulse" />
          )}
        </div>
      </div>
      
      {/* Particules décoratives */}
      {isHovered && (
        <>
          <div 
            className="absolute w-1 h-1 rounded-full animate-ping"
            style={{ backgroundColor: modelColor, top: '20%', left: '30%', animationDelay: '0s' }}
          />
          <div 
            className="absolute w-1 h-1 rounded-full animate-ping"
            style={{ backgroundColor: modelColor, top: '60%', right: '25%', animationDelay: '0.5s' }}
          />
          <div 
            className="absolute w-1 h-1 rounded-full animate-ping"
            style={{ backgroundColor: modelColor, bottom: '30%', left: '20%', animationDelay: '1s' }}
          />
        </>
      )}
    </div>
  );
}

export function Model3DPreview({
  modelType,
  color,
  variant,
  autoRotate = true,
  hovered = false,
  className = '',
  onClick,
}: Model3DPreviewProps) {
  const [isClient, setIsClient] = useState(false);
  const [render3D, setRender3D] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Active le 3D uniquement au hover
  useEffect(() => {
    if (hovered && !hasError) {
      // Petit délai pour éviter les activations accidentelles
      const timer = setTimeout(() => {
        setRender3D(true);
      }, 150);
      return () => clearTimeout(timer);
    } else {
      // Désactive après un délai pour éviter le flickering
      const timer = setTimeout(() => {
        setRender3D(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [hovered, hasError]);

  if (!isClient) {
    return (
      <div className={`bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center ${className}`}>
        <div className="w-8 h-8 border-2 border-[#8AFD81]/30 border-t-[#8AFD81] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden cursor-pointer ${className}`}
      onClick={onClick}
    >
      {/* Placeholder statique (toujours visible en arrière-plan) */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${
        render3D ? 'opacity-0' : 'opacity-100'
      }`}>
        <StaticPlaceholder 
          modelType={modelType} 
          color={color} 
          isHovered={hovered}
        />
      </div>

      {/* Canvas 3D (uniquement quand hovered) */}
      {render3D && !hasError && (
        <div className="absolute inset-0 animate-fadeIn">
          <Canvas
            shadows={false}
            dpr={[1, 1.5]}
            gl={{ 
              antialias: true,
              alpha: true,
              powerPreference: 'high-performance',
              preserveDrawingBuffer: false,
            }}
            onError={() => setHasError(true)}
            style={{ background: 'transparent' }}
          >
            <PerspectiveCamera makeDefault position={[3, 2, 3]} fov={35} />
            
            {/* Éclairage simplifié */}
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <directionalLight position={[-5, 3, -5]} intensity={0.3} color="#8AFD81" />
            
            <Suspense fallback={<Loader />}>
              <RotatingModel 
                modelType={modelType}
                color={color}
                variant={variant}
              />
            </Suspense>

            {/* Sol */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
              <planeGeometry args={[10, 10]} />
              <meshBasicMaterial color="#0f172a" transparent opacity={0.5} />
            </mesh>
          </Canvas>
        </div>
      )}

      {/* Overlay gradient en bas */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-900/80 to-transparent pointer-events-none z-10" />
      
      {/* Indicateur 3D actif */}
      {render3D && (
        <div className="absolute top-2 right-2 px-2 py-1 bg-[#8AFD81]/20 backdrop-blur-sm border border-[#8AFD81]/30 rounded-lg z-10">
          <span className="text-[9px] text-[#8AFD81] font-bold uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#8AFD81] rounded-full animate-pulse" />
            3D
          </span>
        </div>
      )}
    </div>
  );
}

export default Model3DPreview;
