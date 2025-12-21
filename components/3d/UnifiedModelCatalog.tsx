/**
 * 🎯 CATALOGUE UNIFIÉ - Métadonnées des modèles 3D
 * 
 * Version simplifiée pour l'affichage dans la galerie.
 * Contient uniquement les métadonnées nécessaires sans les composants 3D.
 */

/**
 * Type de catégorie d'équipement
 */
export type EquipmentCategory = 'transformer' | 'container' | 'cooling' | 'power' | 'distribution' | 'generator' | 'ground' | 'environment';

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
}

/**
 * 🏆 CATALOGUE UNIFIÉ - Tous les modèles 3D disponibles
 */
export const UNIFIED_MODEL_CATALOG: UnifiedModel[] = [
  // ==================== SOLS & ENVIRONNEMENT ====================
  {
    id: 'ground-asphalt-dark',
    name: 'Asphalte Foncé',
    type: 'ground-patch',
    category: 'ground',
    description: 'Revêtement routier bitumineux sombre, idéal pour les routes principales et zones de circulation lourde.',
    dimensions: { length: 10, width: 10, height: 0.1 },
    tags: ['route', 'bitume', 'asphalte', 'noir', 'sol'],
    quality: 'standard',
    source: 'procedural',
  },
  {
    id: 'ground-asphalt-grey',
    name: 'Asphalte Usé',
    type: 'ground-patch',
    category: 'ground',
    description: 'Bitume gris clair, aspect vieilli pour les zones de manœuvre secondaires.',
    dimensions: { length: 10, width: 10, height: 0.1 },
    tags: ['route', 'bitume', 'gris', 'sol'],
    quality: 'standard',
    source: 'procedural',
  },
  {
    id: 'ground-concrete-slab',
    name: 'Dalle Béton',
    type: 'ground-patch',
    category: 'ground',
    description: 'Dalle de béton industrielle lisse pour fondations et zones techniques.',
    dimensions: { length: 10, width: 10, height: 0.2 },
    tags: ['béton', 'dalle', 'fondation', 'gris', 'sol'],
    quality: 'standard',
    source: 'procedural',
  },
  {
    id: 'ground-concrete-dark',
    name: 'Béton Armé Foncé',
    type: 'ground-patch',
    category: 'ground',
    description: 'Béton haute densité sombre pour les zones de charge lourde.',
    dimensions: { length: 10, width: 10, height: 0.2 },
    tags: ['béton', 'foncé', 'sol'],
    quality: 'standard',
    source: 'procedural',
  },
  {
    id: 'ground-grass-fresh',
    name: 'Gazon Frais',
    type: 'ground-patch',
    category: 'environment',
    description: 'Pelouse verte entretenue pour les zones paysagères et bases vie.',
    dimensions: { length: 10, width: 10, height: 0.1 },
    tags: ['herbe', 'gazon', 'vert', 'nature', 'sol'],
    quality: 'standard',
    source: 'procedural',
  },
  {
    id: 'ground-grass-dry',
    name: 'Herbe Sèche',
    type: 'ground-patch',
    category: 'environment',
    description: 'Végétation clairsemée et sèche, adaptée aux environnements arides.',
    dimensions: { length: 10, width: 10, height: 0.1 },
    tags: ['herbe', 'jaune', 'nature', 'sol'],
    quality: 'standard',
    source: 'procedural',
  },
  {
    id: 'ground-gravel-grey',
    name: 'Gravier Concassé',
    type: 'ground-patch',
    category: 'ground',
    description: 'Lit de gravier gris pour drainage et zones de transformateurs.',
    dimensions: { length: 10, width: 10, height: 0.1 },
    tags: ['gravier', 'pierre', 'gris', 'drainage', 'sol'],
    quality: 'standard',
    source: 'procedural',
  },
  {
    id: 'ground-gravel-white',
    name: 'Gravier Blanc',
    type: 'ground-patch',
    category: 'ground',
    description: 'Gravier décoratif blanc pour les allées piétonnes.',
    dimensions: { length: 10, width: 10, height: 0.1 },
    tags: ['gravier', 'blanc', 'déco', 'sol'],
    quality: 'standard',
    source: 'procedural',
  },
  {
    id: 'ground-stones-river',
    name: 'Galets de Rivière',
    type: 'ground-patch',
    category: 'environment',
    description: 'Gros cailloux ronds pour l\'ornementation.',
    dimensions: { length: 10, width: 10, height: 0.2 },
    tags: ['cailloux', 'galets', 'pierre', 'sol'],
    quality: 'standard',
    source: 'procedural',
  },
  {
    id: 'ground-sand-desert',
    name: 'Sable du Désert',
    type: 'ground-patch',
    category: 'environment',
    description: 'Sable fin doré typique du Qatar.',
    dimensions: { length: 10, width: 10, height: 0.1 },
    tags: ['sable', 'désert', 'jaune', 'plage', 'sol'],
    quality: 'standard',
    source: 'procedural',
  },
  {
    id: 'ground-dirt-red',
    name: 'Terre Battue Rouge',
    type: 'ground-patch',
    category: 'ground',
    description: 'Sol en terre compactée rougeâtre.',
    dimensions: { length: 10, width: 10, height: 0.1 },
    tags: ['terre', 'rouge', 'sol', 'chantier'],
    quality: 'standard',
    source: 'procedural',
  },
  {
    id: 'ground-water-pool',
    name: 'Eau (Piscine/Bassin)',
    type: 'ground-patch',
    category: 'environment',
    description: 'Surface d\'eau bleue calme avec transparence.',
    dimensions: { length: 10, width: 5, height: 0.1 },
    tags: ['eau', 'bleu', 'piscine', 'liquide'],
    quality: 'standard',
    source: 'procedural',
  },
  {
    id: 'ground-paving-tiles',
    name: 'Pavés Autobloquants',
    type: 'ground-patch',
    category: 'ground',
    description: 'Pavage pour trottoirs et zones piétonnes.',
    dimensions: { length: 10, width: 2, height: 0.1 },
    tags: ['pavé', 'trottoir', 'sol'],
    quality: 'standard',
    source: 'procedural',
  },

  // ==================== CONTAINER PLAN 3D VIEWER ====================
  {
    id: 'container-plan-3d-viewer',
    name: 'Container Plan 3D Viewer',
    type: 'container-plan-3d-viewer',
    category: 'container',
    description: 'Viewer 3D premium pour conteneur Bitmain/Antspace avec interface interactive complète.',
    dimensions: { length: 12.196, width: 2.438, height: 2.896 },
    power: '6 MW',
    thumbnail: '/download.jpg',
    tags: ['container', 'viewer', '3d', 'interactif', 'bitmain', 'antspace', 'premium', 'ultra-réaliste'],
    quality: 'ultra-realistic',
    source: 'photo-based',
  },

  // ==================== ACCÈS CONTAINER (ESCALIER) ====================
  {
    id: 'metal-stairs-2-steps',
    name: 'Escalier Métal - 2 Marches',
    type: 'metal-stairs-2-steps',
    category: 'distribution',
    description: 'Marchepied industriel 2 niveaux en caillebotis avec flasques latérales jaunes (autoporté).',
    dimensions: { length: 0.9, width: 1.6, height: 0.55 },
    thumbnail: '/download.jpg',
    tags: ['escalier', 'marches', 'métal', 'container', 'accès', '2', 'stairs', 'steel'],
    quality: 'standard',
    source: 'procedural',
  },

  // ==================== ACCESSOIRES CONTAINER (BARRES INOX) ====================
  {
    id: 'container-door-lock-bars',
    name: 'Barres Inox (Portes Container)',
    type: 'container-door-lock-bars',
    category: 'distribution',
    description: '2 barres de verrouillage inox/argent (portes arrière de container) – asset séparé à placer manuellement.',
    dimensions: { length: 0.25, width: 2.438, height: 2.6 },
    thumbnail: '/download.jpg',
    tags: ['container', 'porte', 'barre', 'verrouillage', 'inox', 'argent', 'lock', 'bars'],
    quality: 'standard',
    source: 'procedural',
  },

  // ==================== MODULE DE REFROIDISSEMENT HD5 ====================
  {
    id: 'hd5-cooling-module',
    name: 'Module de Refroidissement HD5',
    type: 'cooling-module',
    category: 'cooling',
    description: 'Module de refroidissement externe avec 12 ventilateurs et radiateurs en V.',
    dimensions: { length: 12.196, width: 2.438, height: 2.896 },
    power: 'Cooling',
    thumbnail: '/download.jpg',
    tags: ['refroidissement', 'ventilateur', 'cooling', 'hd5', 'bitmain', '12-fans'],
    quality: 'high',
    source: 'procedural',
  },

  // ==================== SECURITY FENCE SECTION ====================
  {
    id: 'security-fence-section',
    name: 'Section de Barrière Sécurisée',
    type: 'security-fence-section',
    category: 'distribution',
    description: 'Section de barrière sécurisée avec grillage noir métallique et barbelé au-dessus.',
    dimensions: { length: 5.0, width: 0.1, height: 2.5 },
    thumbnail: '/download.jpg',
    tags: ['barrière', 'sécurité', 'grillage', 'barbelé', 'ultra-réaliste', '3d'],
    quality: 'ultra-realistic',
    source: 'procedural',
  },

  // ==================== TRANSFORMATEUR 5 MW - VARIANTE 1 ====================
  {
    id: 'transformer-5mw-variant-1',
    name: 'Transformateur 5 MW - Standard',
    type: 'transformer-5mw',
    category: 'transformer',
    description: 'Transformateur haute tension de 5 MW - Modèle standard optimisé pour la performance.',
    dimensions: { length: 3.5, width: 2.5, height: 3.0 },
    power: '5 MW',
    thumbnail: '/download.jpg',
    tags: ['transformateur', '5mw', 'haute-tension', 'électrique', 'standard', 'coloré', '3d', 'glb'],
    quality: 'high',
    source: 'sketchfab',
  },

  // ==================== TRANSFORMATEUR 5 MW - VARIANTE 2 ====================
  {
    id: 'transformer-5mw-variant-2',
    name: 'Transformateur 5 MW - Haute Qualité',
    type: 'transformer-5mw-hq',
    category: 'transformer',
    description: 'Transformateur haute tension de 5 MW - Modèle haute qualité avec détails ultra-réalistes.',
    dimensions: { length: 3.5, width: 2.5, height: 3.0 },
    power: '5 MW',
    thumbnail: '/download.jpg',
    tags: ['transformateur', '5mw', 'haute-tension', 'électrique', 'haute-qualité', 'ultra-réaliste', 'coloré', '3d', 'glb'],
    quality: 'ultra-realistic',
    source: 'sketchfab',
  },

  // ==================== BARRIÈRE STANDARD ====================
  {
    id: 'barriere-standard',
    name: 'Barrière Standard',
    type: 'barriere-standard',
    category: 'distribution',
    description: 'Barrière standard simple avec poteaux métalliques et barres horizontales.',
    dimensions: { length: 5.0, width: 0.1, height: 1.2 },
    thumbnail: '/download.jpg',
    tags: ['barrière', 'standard', 'poteaux', 'barres', 'métallique', 'simple', '3d'],
    quality: 'standard',
    source: 'procedural',
  },

  // ==================== CAMÉRA DE SÉCURITÉ ====================
  {
    id: 'camera-securite',
    name: 'Caméra de Sécurité',
    type: 'camera-securite',
    category: 'distribution',
    description: 'Caméra de surveillance avec support métallique et LED de statut.',
    dimensions: { length: 0.2, width: 0.15, height: 2.5 },
    thumbnail: '/download.jpg',
    tags: ['caméra', 'sécurité', 'surveillance', 'support', 'LED', '3d'],
    quality: 'standard',
    source: 'procedural',
  },

  // ==================== GRAND POTEAU + CAMÉRA FIXE ====================
  {
    id: 'big-camera-pole-fixed',
    name: 'Grand Poteau - Caméra Fixe',
    type: 'camera-pole-fixed',
    category: 'distribution',
    description: 'Grand mât de surveillance avec grosse caméra fixe (type bullet).',
    dimensions: { length: 0.8, width: 0.8, height: 6.7 },
    thumbnail: '/download.jpg',
    tags: ['caméra', 'surveillance', 'poteau', 'mât', 'fixe', 'security', 'cctv'],
    quality: 'standard',
    source: 'procedural',
  },

  // ==================== GRAND POTEAU + CAMÉRA ROTATIVE (PTZ) ====================
  {
    id: 'big-camera-pole-ptz',
    name: 'Grand Poteau - Caméra Rotative (PTZ)',
    type: 'camera-pole-ptz',
    category: 'distribution',
    description: 'Grand mât de surveillance avec grosse caméra rotative (PTZ) – rotation automatique.',
    dimensions: { length: 0.8, width: 0.8, height: 6.7 },
    thumbnail: '/download.jpg',
    tags: ['caméra', 'surveillance', 'poteau', 'mât', 'ptz', 'rotative', 'pan', 'tilt'],
    quality: 'standard',
    source: 'procedural',
  },

  // ==================== GOLF CAR ====================
  {
    id: 'golf-car',
    name: 'Golf Car',
    type: 'golf-car',
    category: 'distribution',
    description: 'Voiturette de golf colorée avec 4 roues, pare-brise et sièges.',
    dimensions: { length: 1.8, width: 1.0, height: 0.9 },
    thumbnail: '/download.jpg',
    tags: ['golf', 'car', 'voiturette', 'transport', 'roues', 'coloré', '3d'],
    quality: 'standard',
    source: 'procedural',
  },

  // ==================== POWER BLOCK 25 MW ====================
  {
    id: 'power-block-25mw',
    name: 'Power Block 25 MW',
    type: 'power-block-25mw',
    category: 'power',
    description: 'Bloc d\'alimentation de 25 MW avec ventilateurs de refroidissement, panneaux de contrôle et indicateurs LED.',
    dimensions: { length: 4.0, width: 2.5, height: 2.4 },
    power: '25 MW',
    thumbnail: '/download.jpg',
    tags: ['power', 'block', '25mw', 'alimentation', 'ventilateurs', 'LED', 'industriel', '3d'],
    quality: 'standard',
    source: 'procedural',
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
    { id: 'ground' as EquipmentCategory, label: 'Sols & Routes' },
    { id: 'environment' as EquipmentCategory, label: 'Environnement' },
    { id: 'transformer' as EquipmentCategory, label: 'Transformateurs' },
    { id: 'container' as EquipmentCategory, label: 'Conteneurs' },
    { id: 'cooling' as EquipmentCategory, label: 'Refroidissement' },
    { id: 'power' as EquipmentCategory, label: 'Énergie' },
    { id: 'distribution' as EquipmentCategory, label: 'Distribution' },
    { id: 'generator' as EquipmentCategory, label: 'Générateurs' },
  ];
  
  return categories.map(cat => ({
    ...cat,
    count: UNIFIED_MODEL_CATALOG.filter(model => model.category === cat.id).length,
  }));
}


