/**
 * PrimitiveShapes - Formes 3D procédurales pour les modèles
 * Génère des représentations 3D stylisées des équipements
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Cylinder, Box } from '@react-three/drei';
import * as THREE from 'three';

interface PrimitiveProps {
  animate?: boolean;
  color?: string;
  scale?: number;
}

// ==================== CONTAINER MINING ====================
export function ContainerMining({ animate = true, color = '#2d5a27', scale = 1 }: PrimitiveProps) {
  const groupRef = useRef<THREE.Group>(null);
  const fansRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (animate && fansRef.current) {
      fansRef.current.children.forEach((fan, i) => {
        fan.rotation.z = state.clock.elapsedTime * 8 + i * 0.5;
      });
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      {/* Corps principal du container */}
      <RoundedBox args={[4, 1.2, 1]} radius={0.05} position={[0, 0.6, 0]}>
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </RoundedBox>

      {/* Bandes horizontales décoratives */}
      {[-0.3, 0, 0.3].map((y, i) => (
        <Box key={i} args={[4.02, 0.02, 1.02]} position={[0, 0.6 + y, 0]}>
          <meshStandardMaterial color="#1a3d18" metalness={0.8} roughness={0.2} />
        </Box>
      ))}

      {/* Ventilateurs à l'arrière */}
      <group ref={fansRef} position={[-2, 0.6, 0]}>
        {[-0.3, 0, 0.3].map((z, i) => (
          <group key={i} position={[0, 0, z]}>
            <Cylinder args={[0.15, 0.15, 0.05, 16]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
            </Cylinder>
            {/* Pales */}
            {[0, 1, 2, 3].map((j) => (
              <Box
                key={j}
                args={[0.02, 0.12, 0.02]}
                position={[0, 0, 0]}
                rotation={[0, 0, (Math.PI / 2) * j]}
              >
                <meshStandardMaterial color="#333" metalness={0.7} roughness={0.3} />
              </Box>
            ))}
          </group>
        ))}
      </group>

      {/* Portes à l'avant */}
      <Box args={[0.02, 1, 0.9]} position={[2, 0.6, 0]}>
        <meshStandardMaterial color="#1f4a1a" metalness={0.7} roughness={0.2} />
      </Box>

      {/* Barres de verrouillage */}
      <Cylinder args={[0.02, 0.02, 1.1, 8]} position={[2.01, 0.6, 0.2]} rotation={[0, 0, 0]}>
        <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
      </Cylinder>
      <Cylinder args={[0.02, 0.02, 1.1, 8]} position={[2.01, 0.6, -0.2]} rotation={[0, 0, 0]}>
        <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
      </Cylinder>

      {/* Base/Support */}
      <Box args={[4.2, 0.1, 1.1]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#2a2a2a" metalness={0.5} roughness={0.5} />
      </Box>
    </group>
  );
}

// ==================== TRANSFORMATEUR ====================
export function Transformer({ animate = true, color = '#4a5568', scale = 1 }: PrimitiveProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (animate && groupRef.current) {
      // Légère pulsation pour simuler le fonctionnement
      groupRef.current.scale.setScalar(scale * (1 + Math.sin(state.clock.elapsedTime * 2) * 0.01));
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      {/* Corps principal */}
      <RoundedBox args={[1.5, 1.8, 1.2]} radius={0.05} position={[0, 0.9, 0]}>
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </RoundedBox>

      {/* Radiateurs latéraux */}
      {[-0.8, 0.8].map((x, i) => (
        <group key={i} position={[x, 0.9, 0]}>
          {[0, 1, 2, 3, 4].map((j) => (
            <Box key={j} args={[0.1, 1.4, 0.08]} position={[0, 0, -0.4 + j * 0.2]}>
              <meshStandardMaterial color="#3d4852" metalness={0.8} roughness={0.2} />
            </Box>
          ))}
        </group>
      ))}

      {/* Isolateurs haute tension (top) */}
      {[-0.4, 0, 0.4].map((x, i) => (
        <group key={i} position={[x, 1.9, 0]}>
          <Cylinder args={[0.08, 0.1, 0.3, 16]} position={[0, 0.15, 0]}>
            <meshStandardMaterial color="#8B4513" metalness={0.3} roughness={0.7} />
          </Cylinder>
          <Cylinder args={[0.03, 0.03, 0.4, 8]} position={[0, 0.4, 0]}>
            <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
          </Cylinder>
        </group>
      ))}

      {/* Plaque de base */}
      <Box args={[1.8, 0.1, 1.4]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#2a2a2a" metalness={0.5} roughness={0.5} />
      </Box>

      {/* LED status */}
      <Box args={[0.05, 0.05, 0.02]} position={[0.6, 1.5, 0.61]}>
        <meshStandardMaterial color="#8AFD81" emissive="#8AFD81" emissiveIntensity={2} />
      </Box>
    </group>
  );
}

// ==================== POWER BLOCK ====================
export function PowerBlock({ animate = true, color = '#1e40af', scale = 1 }: PrimitiveProps) {
  const ledsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (animate && ledsRef.current) {
      ledsRef.current.children.forEach((led, i) => {
        const material = (led as THREE.Mesh).material as THREE.MeshStandardMaterial;
        material.emissiveIntensity = 1 + Math.sin(state.clock.elapsedTime * 3 + i) * 0.5;
      });
    }
  });

  return (
    <group scale={scale}>
      {/* Corps principal */}
      <RoundedBox args={[2, 1.2, 1.2]} radius={0.03} position={[0, 0.6, 0]}>
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
      </RoundedBox>

      {/* Grille de ventilation */}
      <Box args={[0.5, 0.8, 0.02]} position={[0.5, 0.6, 0.61]}>
        <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
      </Box>

      {/* Panneau de contrôle */}
      <Box args={[0.4, 0.5, 0.02]} position={[-0.5, 0.7, 0.61]}>
        <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.5} />
      </Box>

      {/* LEDs */}
      <group ref={ledsRef} position={[-0.5, 0.85, 0.62]}>
        {[-0.1, 0, 0.1].map((x, i) => (
          <Box key={i} args={[0.03, 0.03, 0.01]} position={[x, 0, 0]}>
            <meshStandardMaterial 
              color={i === 0 ? '#22c55e' : i === 1 ? '#eab308' : '#ef4444'} 
              emissive={i === 0 ? '#22c55e' : i === 1 ? '#eab308' : '#ef4444'}
              emissiveIntensity={1.5}
            />
          </Box>
        ))}
      </group>

      {/* Câbles */}
      <Cylinder args={[0.03, 0.03, 0.5, 8]} position={[-0.8, 1.4, 0]} rotation={[0, 0, Math.PI / 4]}>
        <meshStandardMaterial color="#111" metalness={0.3} roughness={0.8} />
      </Cylinder>

      {/* Base */}
      <Box args={[2.2, 0.1, 1.3]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.5} />
      </Box>
    </group>
  );
}

// ==================== MODULE COOLING ====================
export function CoolingModule({ animate = true, color = '#0891b2', scale = 1 }: PrimitiveProps) {
  const fansRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (animate && fansRef.current) {
      fansRef.current.children.forEach((fan, i) => {
        fan.rotation.x = state.clock.elapsedTime * 10 + i * 0.3;
      });
    }
  });

  return (
    <group scale={scale}>
      {/* Structure principale */}
      <RoundedBox args={[3, 1.5, 1]} radius={0.05} position={[0, 0.75, 0]}>
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
      </RoundedBox>

      {/* Ventilateurs (6x) */}
      <group ref={fansRef}>
        {[-1, 0, 1].map((x, xi) => (
          [-0.3, 0.3].map((y, yi) => (
            <group key={`${xi}-${yi}`} position={[x, 0.75 + y, 0.51]}>
              <Cylinder args={[0.2, 0.2, 0.05, 24]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial color="#064e3b" metalness={0.7} roughness={0.3} />
              </Cylinder>
              {/* Pales */}
              {[0, 1, 2, 3, 4, 5].map((j) => (
                <Box
                  key={j}
                  args={[0.15, 0.03, 0.02]}
                  position={[0, 0, 0.03]}
                  rotation={[0, 0, (Math.PI / 3) * j]}
                >
                  <meshStandardMaterial color="#0d9488" metalness={0.6} roughness={0.4} />
                </Box>
              ))}
            </group>
          ))
        )).flat()}
      </group>

      {/* Grille arrière */}
      <Box args={[2.8, 1.3, 0.02]} position={[0, 0.75, -0.51]}>
        <meshStandardMaterial color="#134e4a" metalness={0.6} roughness={0.3} />
      </Box>

      {/* Base */}
      <Box args={[3.2, 0.1, 1.1]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.5} />
      </Box>
    </group>
  );
}

// ==================== SECURITY FENCE ====================
export function SecurityFence({ animate = false, color = '#374151', scale = 1 }: PrimitiveProps) {
  return (
    <group scale={scale}>
      {/* Poteaux */}
      {[-1.5, 0, 1.5].map((x, i) => (
        <Cylinder key={i} args={[0.03, 0.03, 1.5, 8]} position={[x, 0.75, 0]}>
          <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.2} />
        </Cylinder>
      ))}

      {/* Grillage */}
      <Box args={[3, 1.2, 0.02]} position={[0, 0.7, 0]}>
        <meshStandardMaterial 
          color={color} 
          metalness={0.7} 
          roughness={0.3}
          transparent
          opacity={0.8}
        />
      </Box>

      {/* Barbelé */}
      <group position={[0, 1.4, 0]}>
        {Array.from({ length: 20 }).map((_, i) => (
          <Box 
            key={i} 
            args={[0.02, 0.05, 0.02]} 
            position={[-1.5 + i * 0.16, Math.sin(i * 0.8) * 0.03, 0]}
            rotation={[0, 0, Math.sin(i) * 0.3]}
          >
            <meshStandardMaterial color="#6b7280" metalness={0.9} roughness={0.1} />
          </Box>
        ))}
      </group>
    </group>
  );
}

// ==================== GROUND PATCH ====================
export function GroundPatch({ 
  animate = false, 
  color = '#4b5563', 
  scale = 1,
  variant = 'concrete' 
}: PrimitiveProps & { variant?: 'concrete' | 'asphalt' | 'grass' | 'gravel' | 'sand' }) {
  const colors = {
    concrete: '#6b7280',
    asphalt: '#1f2937',
    grass: '#22c55e',
    gravel: '#9ca3af',
    sand: '#fbbf24',
  };

  return (
    <group scale={scale}>
      <Box args={[3, 0.1, 3]} position={[0, -0.05, 0]}>
        <meshStandardMaterial 
          color={colors[variant] || color} 
          metalness={variant === 'asphalt' ? 0.3 : 0.1} 
          roughness={variant === 'grass' ? 0.9 : 0.7}
        />
      </Box>
    </group>
  );
}

// ==================== CAMERA POLE ====================
export function CameraPole({ animate = true, color = '#374151', scale = 1 }: PrimitiveProps) {
  const cameraRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (animate && cameraRef.current) {
      cameraRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
    }
  });

  return (
    <group scale={scale}>
      {/* Poteau principal */}
      <Cylinder args={[0.05, 0.08, 2.5, 8]} position={[0, 1.25, 0]}>
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </Cylinder>

      {/* Bras de support */}
      <Box args={[0.4, 0.03, 0.03]} position={[0.2, 2.4, 0]}>
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </Box>

      {/* Caméra */}
      <group ref={cameraRef} position={[0.4, 2.35, 0]}>
        <RoundedBox args={[0.15, 0.1, 0.1]} radius={0.02}>
          <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
        </RoundedBox>
        {/* Objectif */}
        <Cylinder args={[0.03, 0.04, 0.08, 16]} position={[0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
        </Cylinder>
        {/* LED IR */}
        <Box args={[0.02, 0.02, 0.01]} position={[0.08, 0.03, 0]}>
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2} />
        </Box>
      </group>

      {/* Base */}
      <Cylinder args={[0.15, 0.15, 0.1, 8]} position={[0, 0.05, 0]}>
        <meshStandardMaterial color="#1f2937" metalness={0.6} roughness={0.4} />
      </Cylinder>
    </group>
  );
}

// ==================== GOLF CAR ====================
export function GolfCar({ animate = true, color = '#ffffff', scale = 1 }: PrimitiveProps) {
  const wheelsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (animate && wheelsRef.current) {
      wheelsRef.current.children.forEach((wheel) => {
        wheel.rotation.x = state.clock.elapsedTime * 2;
      });
    }
  });

  return (
    <group scale={scale}>
      {/* Châssis */}
      <RoundedBox args={[1.2, 0.3, 0.7]} radius={0.05} position={[0, 0.25, 0]}>
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.5} />
      </RoundedBox>

      {/* Toit */}
      <Box args={[0.8, 0.02, 0.65]} position={[0, 0.8, 0]}>
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.5} />
      </Box>

      {/* Poteaux du toit */}
      {[[-0.35, 0.25], [-0.35, -0.25], [0.35, 0.25], [0.35, -0.25]].map(([x, z], i) => (
        <Cylinder key={i} args={[0.02, 0.02, 0.4, 8]} position={[x, 0.6, z]}>
          <meshStandardMaterial color="#1f2937" metalness={0.7} roughness={0.3} />
        </Cylinder>
      ))}

      {/* Roues */}
      <group ref={wheelsRef}>
        {[[-0.45, 0.3], [-0.45, -0.3], [0.45, 0.3], [0.45, -0.3]].map(([x, z], i) => (
          <Cylinder key={i} args={[0.12, 0.12, 0.08, 16]} position={[x, 0.12, z]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.8} />
          </Cylinder>
        ))}
      </group>

      {/* Siège */}
      <Box args={[0.5, 0.15, 0.5]} position={[-0.1, 0.45, 0]}>
        <meshStandardMaterial color="#1f2937" metalness={0.2} roughness={0.9} />
      </Box>

      {/* Volant */}
      <Cylinder args={[0.08, 0.08, 0.02, 16]} position={[0.35, 0.5, 0]} rotation={[0.3, 0, 0]}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.5} />
      </Cylinder>
    </group>
  );
}

// ==================== STAIRS ====================
export function MetalStairs({ animate = false, color = '#fbbf24', scale = 1 }: PrimitiveProps) {
  return (
    <group scale={scale}>
      {/* Marches */}
      {[0, 1].map((i) => (
        <Box key={i} args={[0.6, 0.05, 0.3]} position={[0, 0.15 + i * 0.25, -0.15 + i * 0.3]}>
          <meshStandardMaterial color="#4b5563" metalness={0.7} roughness={0.3} />
        </Box>
      ))}

      {/* Montants latéraux */}
      {[-0.35, 0.35].map((x, i) => (
        <Box key={i} args={[0.05, 0.5, 0.7]} position={[x, 0.25, 0.1]} rotation={[0.3, 0, 0]}>
          <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
        </Box>
      ))}

      {/* Base */}
      <Box args={[0.7, 0.05, 0.35]} position={[0, 0.025, -0.15]}>
        <meshStandardMaterial color="#374151" metalness={0.6} roughness={0.4} />
      </Box>
    </group>
  );
}

// ==================== SÉLECTEUR DE PRIMITIVE ====================
export type PrimitiveType = 
  | 'container' 
  | 'transformer' 
  | 'power-block' 
  | 'cooling' 
  | 'fence' 
  | 'ground' 
  | 'camera' 
  | 'golf-car' 
  | 'stairs'
  | 'placeholder';

interface PrimitiveSelectorProps extends PrimitiveProps {
  type: PrimitiveType;
  variant?: string;
}

export function PrimitiveSelector({ type, variant, ...props }: PrimitiveSelectorProps) {
  switch (type) {
    case 'container':
      return <ContainerMining {...props} />;
    case 'transformer':
      return <Transformer {...props} />;
    case 'power-block':
      return <PowerBlock {...props} />;
    case 'cooling':
      return <CoolingModule {...props} />;
    case 'fence':
      return <SecurityFence {...props} />;
    case 'ground':
      return <GroundPatch {...props} variant={variant as any} />;
    case 'camera':
      return <CameraPole {...props} />;
    case 'golf-car':
      return <GolfCar {...props} />;
    case 'stairs':
      return <MetalStairs {...props} />;
    case 'placeholder':
    default:
      return (
        <RoundedBox args={[1, 1, 1]} radius={0.1}>
          <meshStandardMaterial color="#8AFD81" metalness={0.3} roughness={0.7} wireframe />
        </RoundedBox>
      );
  }
}

