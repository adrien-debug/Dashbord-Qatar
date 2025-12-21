/**
 * 🎯 CATALOGUE UNIFIÉ - Métadonnées des modèles 3D
 * 
 * Version enrichie avec support des primitives 3D et annotations.
 */

import { PrimitiveType } from './PrimitiveShapes';

/**
 * Type de catégorie d'équipement
 */
export type EquipmentCategory = 'transformer' | 'container' | 'cooling' | 'power' | 'distribution' | 'generator' | 'ground' | 'environment';

/**
 * Annotation pour un modèle 3D
 */
export interface ModelAnnotation {
  id: string;
  position: [number, number, number];
  label: string;
  description?: string;
}

/**
 * Interface pour un modèle 3D unifié
 */
export interface UnifiedModel {
  // Identification
  id: string;
  name: string;
  type: string;
  category: EquipmentCategory;
  
  // Métadonnées
  description: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  power?: string;
  thumbnail?: string;
  tags: string[];
  
  // Qualité et source
  quality: 'ultra-realistic' | 'high' | 'standard' | 'basic';
  source: 'photo-based' | 'sketchfab' | 'procedural';
  
  // Configuration 3D
  primitiveType: PrimitiveType;
  primitiveColor?: string;
  primitiveVariant?: string;
  modelUrl?: string;
  annotations?: ModelAnnotation[];
}

/**
 * 🏆 CATALOGUE UNIFIÉ - Tous les modèles 3D disponibles
 */
export const UNIFIED_MODEL_CATALOG: UnifiedModel[] = [
  // ==================== CONTAINER MINING (VEDETTE) ====================
  {
    id: 'container-plan-3d-viewer',
    name: 'Container Mining Bitmain',
    type: 'container-plan-3d-viewer',
    category: 'container',
    description: 'Container minier Bitmain/Antspace haute performance avec système de refroidissement intégré. Capacité de 120 ASIC miners.',
    dimensions: { length: 12.196, width: 2.438, height: 2.896 },
    power: '6 MW',
    thumbnail: '/download.jpg',
    tags: ['container', 'mining', 'bitmain', 'antspace', 'premium', 'ultra-réaliste'],
    quality: 'ultra-realistic',
    source: 'photo-based',
    primitiveType: 'container',
    primitiveColor: '#2d5a27',
    annotations: [
      { id: 'fans', position: [-1.8, 0.6, 0], label: 'Ventilateurs', description: 'Système de refroidissement 12 ventilateurs' },
      { id: 'doors', position: [1.9, 0.6, 0], label: 'Portes d\'accès', description: 'Double porte avec verrouillage sécurisé' },
      { id: 'power', position: [0, 1.2, 0.5], label: 'Alimentation', description: 'Raccordement 6 MW haute tension' },
    ],
  },

  // ==================== TRANSFORMATEURS ====================
  {
    id: 'transformer-5mw-variant-1',
    name: 'Transformateur 5 MW - Standard',
    type: 'transformer-5mw',
    category: 'transformer',
    description: 'Transformateur haute tension de 5 MW - Modèle standard optimisé pour les fermes de minage.',
    dimensions: { length: 3.5, width: 2.5, height: 3.0 },
    power: '5 MW',
    thumbnail: '/download.jpg',
    tags: ['transformateur', '5mw', 'haute-tension', 'électrique'],
    quality: 'high',
    source: 'sketchfab',
    primitiveType: 'transformer',
    primitiveColor: '#4a5568',
    annotations: [
      { id: 'isolators', position: [0, 1.8, 0], label: 'Isolateurs HT', description: 'Isolateurs céramique haute tension' },
      { id: 'radiators', position: [0.8, 0.9, 0], label: 'Radiateurs', description: 'Système de refroidissement passif' },
    ],
  },
  {
    id: 'transformer-5mw-variant-2',
    name: 'Transformateur 5 MW - Premium',
    type: 'transformer-5mw-hq',
    category: 'transformer',
    description: 'Transformateur haute tension 5 MW premium avec monitoring intégré et refroidissement optimisé.',
    dimensions: { length: 3.5, width: 2.5, height: 3.0 },
    power: '5 MW',
    thumbnail: '/download.jpg',
    tags: ['transformateur', '5mw', 'premium', 'ultra-réaliste'],
    quality: 'ultra-realistic',
    source: 'sketchfab',
    primitiveType: 'transformer',
    primitiveColor: '#374151',
    annotations: [
      { id: 'isolators', position: [0, 1.8, 0], label: 'Isolateurs HT', description: 'Isolateurs céramique haute tension' },
      { id: 'monitoring', position: [0.5, 1.2, 0.6], label: 'Monitoring', description: 'Système de surveillance IoT' },
    ],
  },

  // ==================== POWER BLOCKS ====================
  {
    id: 'power-block-25mw',
    name: 'Power Block 25 MW',
    type: 'power-block-25mw',
    category: 'power',
    description: 'Bloc d\'alimentation modulaire 25 MW avec distribution intelligente et monitoring en temps réel.',
    dimensions: { length: 4.0, width: 2.5, height: 2.4 },
    power: '25 MW',
    thumbnail: '/download.jpg',
    tags: ['power', 'block', '25mw', 'alimentation', 'industriel'],
    quality: 'high',
    source: 'procedural',
    primitiveType: 'power-block',
    primitiveColor: '#1e40af',
    annotations: [
      { id: 'leds', position: [-0.5, 0.85, 0.6], label: 'Status LEDs', description: 'Indicateurs de charge et status' },
      { id: 'ventilation', position: [0.5, 0.6, 0.6], label: 'Ventilation', description: 'Grille de refroidissement actif' },
    ],
  },

  // ==================== COOLING ====================
  {
    id: 'hd5-cooling-module',
    name: 'Module Cooling HD5',
    type: 'cooling-module',
    category: 'cooling',
    description: 'Module de refroidissement externe HD5 avec 12 ventilateurs haute performance et radiateurs en V.',
    dimensions: { length: 12.196, width: 2.438, height: 2.896 },
    power: 'Cooling',
    thumbnail: '/download.jpg',
    tags: ['refroidissement', 'ventilateur', 'cooling', 'hd5', 'bitmain'],
    quality: 'high',
    source: 'procedural',
    primitiveType: 'cooling',
    primitiveColor: '#0891b2',
    annotations: [
      { id: 'fans', position: [0, 0.75, 0.5], label: 'Ventilateurs', description: '12 ventilateurs industriels 120mm' },
      { id: 'radiator', position: [0, 0.75, -0.5], label: 'Radiateurs', description: 'Échangeurs thermiques haute capacité' },
    ],
  },

  // ==================== SÉCURITÉ & DISTRIBUTION ====================
  {
    id: 'security-fence-section',
    name: 'Barrière Sécurisée',
    type: 'security-fence-section',
    category: 'distribution',
    description: 'Section de clôture sécurisée avec grillage métallique renforcé et fil barbelé.',
    dimensions: { length: 5.0, width: 0.1, height: 2.5 },
    thumbnail: '/download.jpg',
    tags: ['barrière', 'sécurité', 'grillage', 'barbelé'],
    quality: 'standard',
    source: 'procedural',
    primitiveType: 'fence',
    primitiveColor: '#374151',
  },
  {
    id: 'barriere-standard',
    name: 'Barrière Standard',
    type: 'barriere-standard',
    category: 'distribution',
    description: 'Barrière standard avec poteaux métalliques et barres horizontales.',
    dimensions: { length: 5.0, width: 0.1, height: 1.2 },
    thumbnail: '/download.jpg',
    tags: ['barrière', 'standard', 'poteaux'],
    quality: 'standard',
    source: 'procedural',
    primitiveType: 'fence',
    primitiveColor: '#6b7280',
  },

  // ==================== CAMÉRAS DE SURVEILLANCE ====================
  {
    id: 'camera-securite',
    name: 'Caméra de Sécurité',
    type: 'camera-securite',
    category: 'distribution',
    description: 'Caméra de surveillance HD avec vision nocturne et détection de mouvement.',
    dimensions: { length: 0.2, width: 0.15, height: 2.5 },
    thumbnail: '/download.jpg',
    tags: ['caméra', 'sécurité', 'surveillance'],
    quality: 'standard',
    source: 'procedural',
    primitiveType: 'camera',
    primitiveColor: '#374151',
  },
  {
    id: 'big-camera-pole-fixed',
    name: 'Mât Caméra Fixe',
    type: 'camera-pole-fixed',
    category: 'distribution',
    description: 'Grand mât de surveillance avec caméra fixe type bullet haute définition.',
    dimensions: { length: 0.8, width: 0.8, height: 6.7 },
    thumbnail: '/download.jpg',
    tags: ['caméra', 'surveillance', 'poteau', 'mât'],
    quality: 'standard',
    source: 'procedural',
    primitiveType: 'camera',
    primitiveColor: '#1f2937',
  },
  {
    id: 'big-camera-pole-ptz',
    name: 'Mât Caméra PTZ',
    type: 'camera-pole-ptz',
    category: 'distribution',
    description: 'Grand mât avec caméra PTZ rotative - pan, tilt, zoom motorisés.',
    dimensions: { length: 0.8, width: 0.8, height: 6.7 },
    thumbnail: '/download.jpg',
    tags: ['caméra', 'surveillance', 'ptz', 'rotative'],
    quality: 'standard',
    source: 'procedural',
    primitiveType: 'camera',
    primitiveColor: '#1f2937',
  },

  // ==================== ACCESSOIRES ====================
  {
    id: 'metal-stairs-2-steps',
    name: 'Escalier Métal 2 Marches',
    type: 'metal-stairs-2-steps',
    category: 'distribution',
    description: 'Marchepied industriel 2 niveaux en caillebotis avec flasques latérales jaunes.',
    dimensions: { length: 0.9, width: 1.6, height: 0.55 },
    thumbnail: '/download.jpg',
    tags: ['escalier', 'marches', 'métal', 'accès'],
    quality: 'standard',
    source: 'procedural',
    primitiveType: 'stairs',
    primitiveColor: '#fbbf24',
  },
  {
    id: 'container-door-lock-bars',
    name: 'Barres de Verrouillage',
    type: 'container-door-lock-bars',
    category: 'distribution',
    description: 'Barres de verrouillage inox pour portes de container.',
    dimensions: { length: 0.25, width: 2.438, height: 2.6 },
    thumbnail: '/download.jpg',
    tags: ['container', 'porte', 'verrouillage'],
    quality: 'standard',
    source: 'procedural',
    primitiveType: 'placeholder',
  },
  {
    id: 'golf-car',
    name: 'Golf Car',
    type: 'golf-car',
    category: 'distribution',
    description: 'Voiturette électrique pour le transport sur site.',
    dimensions: { length: 1.8, width: 1.0, height: 0.9 },
    thumbnail: '/download.jpg',
    tags: ['golf', 'car', 'transport', 'électrique'],
    quality: 'standard',
    source: 'procedural',
    primitiveType: 'golf-car',
    primitiveColor: '#ffffff',
  },

  // ==================== SOLS ====================
  {
    id: 'ground-asphalt-dark',
    name: 'Asphalte Foncé',
    type: 'ground-patch',
    category: 'ground',
    description: 'Revêtement routier bitumineux sombre pour routes principales.',
    dimensions: { length: 10, width: 10, height: 0.1 },
    tags: ['route', 'asphalte', 'sol'],
    quality: 'standard',
    source: 'procedural',
    primitiveType: 'ground',
    primitiveVariant: 'asphalt',
  },
  {
    id: 'ground-asphalt-grey',
    name: 'Asphalte Gris',
    type: 'ground-patch',
    category: 'ground',
    description: 'Bitume gris clair aspect vieilli.',
    dimensions: { length: 10, width: 10, height: 0.1 },
    tags: ['route', 'asphalte', 'gris'],
    quality: 'standard',
    source: 'procedural',
    primitiveType: 'ground',
    primitiveVariant: 'asphalt',
  },
  {
    id: 'ground-concrete-slab',
    name: 'Dalle Béton',
    type: 'ground-patch',
    category: 'ground',
    description: 'Dalle de béton industrielle pour fondations.',
    dimensions: { length: 10, width: 10, height: 0.2 },
    tags: ['béton', 'dalle', 'fondation'],
    quality: 'standard',
    source: 'procedural',
    primitiveType: 'ground',
    primitiveVariant: 'concrete',
  },
  {
    id: 'ground-concrete-dark',
    name: 'Béton Armé Foncé',
    type: 'ground-patch',
    category: 'ground',
    description: 'Béton haute densité pour charges lourdes.',
    dimensions: { length: 10, width: 10, height: 0.2 },
    tags: ['béton', 'foncé', 'industriel'],
    quality: 'standard',
    source: 'procedural',
    primitiveType: 'ground',
    primitiveVariant: 'concrete',
  },
  {
    id: 'ground-gravel-grey',
    name: 'Gravier Concassé',
    type: 'ground-patch',
    category: 'ground',
    description: 'Lit de gravier gris pour drainage.',
    dimensions: { length: 10, width: 10, height: 0.1 },
    tags: ['gravier', 'pierre', 'drainage'],
    quality: 'standard',
    source: 'procedural',
    primitiveType: 'ground',
    primitiveVariant: 'gravel',
  },
  {
    id: 'ground-gravel-white',
    name: 'Gravier Blanc',
    type: 'ground-patch',
    category: 'ground',
    description: 'Gravier décoratif blanc pour allées.',
    dimensions: { length: 10, width: 10, height: 0.1 },
    tags: ['gravier', 'blanc', 'décoration'],
    quality: 'standard',
    source: 'procedural',
    primitiveType: 'ground',
    primitiveVariant: 'gravel',
  },

  // ==================== ENVIRONNEMENT ====================
  {
    id: 'ground-grass-fresh',
    name: 'Gazon Frais',
    type: 'ground-patch',
    category: 'environment',
    description: 'Pelouse verte entretenue pour zones paysagères.',
    dimensions: { length: 10, width: 10, height: 0.1 },
    tags: ['herbe', 'gazon', 'vert'],
    quality: 'standard',
    source: 'procedural',
    primitiveType: 'ground',
    primitiveVariant: 'grass',
  },
  {
    id: 'ground-grass-dry',
    name: 'Herbe Sèche',
    type: 'ground-patch',
    category: 'environment',
    description: 'Végétation clairsemée pour environnements arides.',
    dimensions: { length: 10, width: 10, height: 0.1 },
    tags: ['herbe', 'sec', 'aride'],
    quality: 'standard',
    source: 'procedural',
    primitiveType: 'ground',
    primitiveVariant: 'grass',
  },
  {
    id: 'ground-sand-desert',
    name: 'Sable du Désert',
    type: 'ground-patch',
    category: 'environment',
    description: 'Sable fin doré typique du Qatar.',
    dimensions: { length: 10, width: 10, height: 0.1 },
    tags: ['sable', 'désert', 'qatar'],
    quality: 'standard',
    source: 'procedural',
    primitiveType: 'ground',
    primitiveVariant: 'sand',
  },
  {
    id: 'ground-stones-river',
    name: 'Galets de Rivière',
    type: 'ground-patch',
    category: 'environment',
    description: 'Gros cailloux ronds décoratifs.',
    dimensions: { length: 10, width: 10, height: 0.2 },
    tags: ['cailloux', 'galets', 'décoration'],
    quality: 'standard',
    source: 'procedural',
    primitiveType: 'ground',
    primitiveVariant: 'gravel',
  },
  {
    id: 'ground-dirt-red',
    name: 'Terre Battue Rouge',
    type: 'ground-patch',
    category: 'ground',
    description: 'Sol en terre compactée rougeâtre.',
    dimensions: { length: 10, width: 10, height: 0.1 },
    tags: ['terre', 'rouge', 'chantier'],
    quality: 'standard',
    source: 'procedural',
    primitiveType: 'ground',
    primitiveVariant: 'sand',
  },
  {
    id: 'ground-water-pool',
    name: 'Bassin d\'Eau',
    type: 'ground-patch',
    category: 'environment',
    description: 'Surface d\'eau bleue calme.',
    dimensions: { length: 10, width: 5, height: 0.1 },
    tags: ['eau', 'bassin', 'piscine'],
    quality: 'standard',
    source: 'procedural',
    primitiveType: 'placeholder',
  },
  {
    id: 'ground-paving-tiles',
    name: 'Pavés Autobloquants',
    type: 'ground-patch',
    category: 'ground',
    description: 'Pavage pour trottoirs et zones piétonnes.',
    dimensions: { length: 10, width: 2, height: 0.1 },
    tags: ['pavé', 'trottoir', 'piéton'],
    quality: 'standard',
    source: 'procedural',
    primitiveType: 'ground',
    primitiveVariant: 'concrete',
  },
];

/**
 * 🔍 Récupérer un modèle par son ID
 */
export function getModelById(id: string): UnifiedModel | undefined {
  return UNIFIED_MODEL_CATALOG.find(model => model.id === id);
}

/**
 * 🔍 Récupérer un modèle par son type
 */
export function getModelByType(type: string): UnifiedModel | undefined {
  return UNIFIED_MODEL_CATALOG.find(model => model.type === type);
}

/**
 * 🔍 Récupérer tous les modèles d'une catégorie
 */
export function getModelsByCategory(category: EquipmentCategory): UnifiedModel[] {
  return UNIFIED_MODEL_CATALOG.filter(model => model.category === category);
}

/**
 * 🔍 Récupérer tous les modèles ultra-réalistes
 */
export function getUltraRealisticModels(): UnifiedModel[] {
  return UNIFIED_MODEL_CATALOG.filter(model => model.quality === 'ultra-realistic');
}

/**
 * 🔍 Rechercher des modèles par texte
 */
export function searchModels(query: string): UnifiedModel[] {
  const lowerQuery = query.toLowerCase();
  return UNIFIED_MODEL_CATALOG.filter(model =>
    model.name.toLowerCase().includes(lowerQuery) ||
    model.description.toLowerCase().includes(lowerQuery) ||
    model.tags.some(tag => tag.includes(lowerQuery))
  );
}

/**
 * 📊 Obtenir les catégories disponibles avec compteurs
 */
export function getCategories(): Array<{ id: EquipmentCategory; label: string; count: number }> {
  const categories = [
    { id: 'container' as EquipmentCategory, label: 'Conteneurs' },
    { id: 'transformer' as EquipmentCategory, label: 'Transformateurs' },
    { id: 'power' as EquipmentCategory, label: 'Énergie' },
    { id: 'cooling' as EquipmentCategory, label: 'Refroidissement' },
    { id: 'distribution' as EquipmentCategory, label: 'Distribution' },
    { id: 'ground' as EquipmentCategory, label: 'Sols' },
    { id: 'environment' as EquipmentCategory, label: 'Environnement' },
    { id: 'generator' as EquipmentCategory, label: 'Générateurs' },
  ];
  
  return categories.map(cat => ({
    ...cat,
    count: UNIFIED_MODEL_CATALOG.filter(model => model.category === cat.id).length,
  }));
}

/**
 * 🎯 Obtenir les modèles "featured" (mis en avant)
 */
export function getFeaturedModels(): UnifiedModel[] {
  const featuredIds = [
    'container-plan-3d-viewer',
    'transformer-5mw-variant-2',
    'power-block-25mw',
    'hd5-cooling-module',
  ];
  return featuredIds
    .map(id => getModelById(id))
    .filter((model): model is UnifiedModel => model !== undefined);
}

