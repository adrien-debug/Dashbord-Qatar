/**
 * Model3DViewer - Viewer 3D complet pour le workspace
 * Interface interactive avec contrôles complets
 */

import { Suspense, useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Environment, 
  Grid,
  GizmoHelper,
  GizmoViewport,
  Html,
  ContactShadows,
  Bounds,
  useBounds,
} from '@react-three/drei';
import { PrimitiveSelector, PrimitiveType } from './PrimitiveShapes';
import * as THREE from 'three';

interface Annotation {
  id: string;
  position: [number, number, number];
  label: string;
  description?: string;
}

interface Model3DViewerProps {
  modelType: PrimitiveType;
  modelName: string;
  color?: string;
  variant?: string;
  annotations?: Annotation[];
  showGrid?: boolean;
  showGizmo?: boolean;
  wireframe?: boolean;
  onAnnotationClick?: (annotation: Annotation) => void;
}

// Composant pour les annotations 3D
function AnnotationPoint({ 
  annotation, 
  onClick,
  isActive 
}: { 
  annotation: Annotation; 
  onClick?: () => void;
  isActive?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={annotation.position}>
      {/* Point de l'annotation */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial 
          color={isActive ? '#8AFD81' : hovered ? '#ffffff' : '#8AFD81'} 
          emissive={isActive ? '#8AFD81' : '#8AFD81'}
          emissiveIntensity={hovered || isActive ? 1 : 0.5}
        />
      </mesh>

      {/* Ligne vers le haut */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.3, 8]} />
        <meshStandardMaterial color="#8AFD81" transparent opacity={0.5} />
      </mesh>

      {/* Label HTML */}
      {(hovered || isActive) && (
        <Html
          position={[0, 0.4, 0]}
          center
          style={{
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          <div className="bg-slate-900/95 backdrop-blur-sm border border-[#8AFD81]/30 rounded-lg px-3 py-2 shadow-xl">
            <div className="text-[#8AFD81] text-xs font-bold">{annotation.label}</div>
            {annotation.description && (
              <div className="text-slate-400 text-[10px] mt-1 max-w-[150px]">
                {annotation.description}
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

// Composant pour centrer le modèle
function BoundsContent({ children }: { children: React.ReactNode }) {
  const bounds = useBounds();
  
  useEffect(() => {
    bounds.refresh().fit();
  }, [bounds]);

  return <>{children}</>;
}

// Composant principal du modèle avec wireframe toggle
function ModelContent({ 
  modelType, 
  color, 
  variant, 
  wireframe,
  annotations,
  activeAnnotation,
  onAnnotationClick,
}: {
  modelType: PrimitiveType;
  color?: string;
  variant?: string;
  wireframe: boolean;
  annotations?: Annotation[];
  activeAnnotation?: string;
  onAnnotationClick?: (annotation: Annotation) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef}>
      <PrimitiveSelector 
        type={modelType} 
        color={color} 
        variant={variant}
        animate={true}
        scale={1}
      />
      
      {/* Annotations */}
      {annotations?.map((annotation) => (
        <AnnotationPoint
          key={annotation.id}
          annotation={annotation}
          isActive={activeAnnotation === annotation.id}
          onClick={() => onAnnotationClick?.(annotation)}
        />
      ))}
    </group>
  );
}

// Loader
function Loader() {
  const [progress, setProgress] = useState(0);

  useFrame(() => {
    setProgress((prev) => (prev + 1) % 100);
  });

  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-3 border-[#8AFD81]/20 border-t-[#8AFD81] rounded-full animate-spin" />
        <span className="text-slate-400 text-sm">Chargement du modèle...</span>
      </div>
    </Html>
  );
}

// Dimensions helper
function DimensionsDisplay({ dimensions }: { dimensions: { length: number; width: number; height: number } }) {
  return (
    <group>
      {/* Ligne X (longueur) */}
      <group position={[0, 0, dimensions.width / 2 + 0.3]}>
        <mesh>
          <boxGeometry args={[dimensions.length, 0.01, 0.01]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <Html position={[0, 0.1, 0]} center>
          <span className="text-red-400 text-[10px] font-mono bg-slate-900/80 px-1 rounded">
            {dimensions.length}m
          </span>
        </Html>
      </group>

      {/* Ligne Z (largeur) */}
      <group position={[dimensions.length / 2 + 0.3, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.01, 0.01, dimensions.width]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
        <Html position={[0.1, 0, 0]} center>
          <span className="text-green-400 text-[10px] font-mono bg-slate-900/80 px-1 rounded">
            {dimensions.width}m
          </span>
        </Html>
      </group>

      {/* Ligne Y (hauteur) */}
      <group position={[dimensions.length / 2 + 0.3, dimensions.height / 2, dimensions.width / 2 + 0.3]}>
        <mesh>
          <boxGeometry args={[0.01, dimensions.height, 0.01]} />
          <meshBasicMaterial color="#3b82f6" />
        </mesh>
        <Html position={[0.15, 0, 0]} center>
          <span className="text-blue-400 text-[10px] font-mono bg-slate-900/80 px-1 rounded">
            {dimensions.height}m
          </span>
        </Html>
      </group>
    </group>
  );
}

export function Model3DViewer({
  modelType,
  modelName,
  color,
  variant,
  annotations,
  showGrid = true,
  showGizmo = true,
  wireframe = false,
  onAnnotationClick,
}: Model3DViewerProps) {
  const [isClient, setIsClient] = useState(false);
  const [activeAnnotation, setActiveAnnotation] = useState<string | undefined>();
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAnnotationClick = useCallback((annotation: Annotation) => {
    setActiveAnnotation(annotation.id);
    onAnnotationClick?.(annotation);
  }, [onAnnotationClick]);

  const resetCamera = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-full bg-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-3 border-[#8AFD81]/20 border-t-[#8AFD81] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ 
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        style={{ background: '#0f172a' }}
      >
        <PerspectiveCamera makeDefault position={[5, 3, 5]} fov={45} />
        
        {/* Éclairage professionnel */}
        <ambientLight intensity={0.3} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1.2} 
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <directionalLight position={[-5, 5, -5]} intensity={0.4} color="#8AFD81" />
        <spotLight 
          position={[0, 10, 0]} 
          intensity={0.5} 
          angle={0.3} 
          penumbra={1} 
          castShadow
        />

        {/* Environnement HDR */}
        <Environment preset="city" />

        <Suspense fallback={<Loader />}>
          <Bounds fit clip observe margin={1.5}>
            <BoundsContent>
              <ModelContent
                modelType={modelType}
                color={color}
                variant={variant}
                wireframe={wireframe}
                annotations={annotations}
                activeAnnotation={activeAnnotation}
                onAnnotationClick={handleAnnotationClick}
              />
            </BoundsContent>
          </Bounds>
        </Suspense>

        {/* Ombres au sol */}
        <ContactShadows 
          position={[0, -0.01, 0]} 
          opacity={0.5} 
          scale={20} 
          blur={2} 
          far={10}
        />

        {/* Grille */}
        {showGrid && (
          <Grid 
            args={[20, 20]}
            cellSize={0.5}
            cellThickness={0.5}
            cellColor="#1e293b"
            sectionSize={2}
            sectionThickness={1}
            sectionColor="#334155"
            fadeDistance={30}
            fadeStrength={1}
            position={[0, -0.02, 0]}
          />
        )}

        {/* Contrôles orbitaux */}
        <OrbitControls 
          ref={controlsRef}
          makeDefault
          enableDamping
          dampingFactor={0.05}
          minDistance={1}
          maxDistance={50}
          maxPolarAngle={Math.PI / 2 + 0.1}
        />

        {/* Gizmo de navigation */}
        {showGizmo && (
          <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
            <GizmoViewport 
              axisColors={['#ef4444', '#22c55e', '#3b82f6']} 
              labelColor="white"
            />
          </GizmoHelper>
        )}
      </Canvas>

      {/* Overlay avec nom du modèle */}
      <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-xl px-4 py-2">
        <div className="text-white font-semibold text-sm">{modelName}</div>
        <div className="text-slate-400 text-xs mt-0.5">Mode interactif</div>
      </div>

      {/* Instructions de contrôle */}
      <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-lg px-3 py-2">
        <div className="flex items-center gap-4 text-[10px] text-slate-400">
          <span><kbd className="bg-slate-700 px-1.5 py-0.5 rounded text-white">Drag</kbd> Orbiter</span>
          <span><kbd className="bg-slate-700 px-1.5 py-0.5 rounded text-white">Scroll</kbd> Zoom</span>
          <span><kbd className="bg-slate-700 px-1.5 py-0.5 rounded text-white">Shift+Drag</kbd> Pan</span>
        </div>
      </div>

      {/* Bouton reset caméra */}
      <button
        onClick={resetCamera}
        className="absolute bottom-4 right-4 bg-slate-800/90 hover:bg-slate-700 backdrop-blur-sm border border-slate-600 rounded-lg px-3 py-2 text-white text-xs font-medium transition-all"
      >
        Reset Vue
      </button>
    </div>
  );
}

export default Model3DViewer;

