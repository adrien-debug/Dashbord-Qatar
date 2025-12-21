/**
 * Galerie de Modèles 3D - Bibliothèque d'assets immersive
 * Route: /gallery
 * Prévisualisations 3D animées avec navigation vers le workspace
 */

import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { UNIFIED_MODEL_CATALOG, UnifiedModel, getFeaturedModels } from '../components/3d/UnifiedModelCatalog';
import { Model3DPreview } from '../components/3d/Model3DPreview';
import {
  Search,
  Grid3X3,
  LayoutGrid,
  Box,
  Zap,
  Snowflake,
  Building2,
  Shield,
  Layers,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Eye,
  Download,
  Star,
  Filter,
  X,
} from 'lucide-react';

interface CategoryInfo {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  count: number;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function GalleryPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'large'>('grid');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Grouper les modèles par catégorie
  const categoryCounts = UNIFIED_MODEL_CATALOG.reduce((acc, model) => {
    acc[model.category] = (acc[model.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categories: CategoryInfo[] = [
    {
      id: 'container',
      name: 'Containers',
      icon: <Box className="w-5 h-5" />,
      color: '#8AFD81',
      count: categoryCounts['container'] || 0,
    },
    {
      id: 'transformer',
      name: 'Transformateurs',
      icon: <Zap className="w-5 h-5" />,
      color: '#f59e0b',
      count: categoryCounts['transformer'] || 0,
    },
    {
      id: 'power',
      name: 'Power Blocks',
      icon: <Zap className="w-5 h-5" />,
      color: '#3b82f6',
      count: categoryCounts['power'] || 0,
    },
    {
      id: 'cooling',
      name: 'Refroidissement',
      icon: <Snowflake className="w-5 h-5" />,
      color: '#06b6d4',
      count: categoryCounts['cooling'] || 0,
    },
    {
      id: 'distribution',
      name: 'Distribution',
      icon: <Shield className="w-5 h-5" />,
      color: '#a855f7',
      count: categoryCounts['distribution'] || 0,
    },
    {
      id: 'ground',
      name: 'Sols',
      icon: <Layers className="w-5 h-5" />,
      color: '#78716c',
      count: categoryCounts['ground'] || 0,
    },
    {
      id: 'environment',
      name: 'Environnement',
      icon: <Layers className="w-5 h-5" />,
      color: '#22c55e',
      count: categoryCounts['environment'] || 0,
    },
  ];

  // Filtrer les modèles
  const filteredModels = UNIFIED_MODEL_CATALOG.filter(model => {
    const matchesCategory = !selectedCategory || model.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Modèles mis en avant
  const featuredModels = getFeaturedModels();

  const handleOpenWorkspace = useCallback((modelId: string) => {
    router.push(`/3d-workspace/${modelId}`);
  }, [router]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-[#8AFD81]/30 border-t-[#8AFD81] rounded-full animate-spin mx-auto mb-4" />
          <div className="text-slate-400">Chargement de la galerie 3D...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Galerie 3D Immersive - Qatar Strategic Reserve</title>
        <meta name="description" content="Bibliothèque de modèles 3D interactifs pour l'infrastructure mining" />
      </Head>

      <div className="min-h-screen bg-slate-900">
        {/* Hero Header avec gradient animé */}
        <div className="relative h-[220px] overflow-hidden">
          {/* Fond animé */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#8AFD81]/10 via-transparent to-transparent" />
          
          {/* Grille de fond */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(rgba(138, 253, 129, 0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(138, 253, 129, 0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
          />

          {/* Contenu */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 h-full flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1.5 bg-[#8AFD81] text-slate-900 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  Galerie 3D
                </span>
                <span className="px-3 py-1.5 bg-white/10 text-white/90 rounded-full text-[10px] font-medium backdrop-blur-md border border-white/10 uppercase tracking-widest">
                  {UNIFIED_MODEL_CATALOG.length} Modèles
                </span>
                <Link 
                  href="/"
                  className="ml-auto px-3 py-1.5 bg-slate-800/50 hover:bg-slate-700/50 text-white/80 hover:text-white rounded-lg text-xs font-medium transition-all border border-slate-700"
                >
                  ← Dashboard
                </Link>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
                Galerie de Modèles <span className="text-[#8AFD81]">3D</span>
              </h1>
              <p className="mt-3 text-slate-400 text-base max-w-2xl">
                Explorez notre bibliothèque d&apos;assets ultra-réalistes. Cliquez sur un modèle pour l&apos;ouvrir dans le workspace 3D interactif.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Featured Section */}
          {!selectedCategory && !searchQuery && (
            <motion.section 
              className="mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <Star className="w-5 h-5 text-yellow-400" />
                <h2 className="text-xl font-bold text-white">Modèles en vedette</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {featuredModels.map((model, index) => (
                  <motion.div
                    key={model.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <FeaturedCard 
                      model={model} 
                      onOpen={() => handleOpenWorkspace(model.id)}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Rechercher un modèle, tag, catégorie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#8AFD81] focus:ring-2 focus:ring-[#8AFD81]/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* View Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3.5 rounded-xl transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-[#8AFD81] text-slate-900' 
                    : 'bg-slate-800/50 text-slate-400 hover:text-white border border-slate-700'
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('large')}
                className={`p-3.5 rounded-xl transition-all ${
                  viewMode === 'large' 
                    ? 'bg-[#8AFD81] text-slate-900' 
                    : 'bg-slate-800/50 text-slate-400 hover:text-white border border-slate-700'
                }`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                !selectedCategory 
                  ? 'bg-[#8AFD81] text-slate-900' 
                  : 'bg-slate-800/50 text-slate-400 hover:text-white border border-slate-700 hover:border-slate-600'
              }`}
            >
              <Filter className="w-4 h-4" />
              Tous
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                !selectedCategory ? 'bg-black/20' : 'bg-slate-700'
              }`}>
                {UNIFIED_MODEL_CATALOG.length}
              </span>
            </button>
            {categories.filter(cat => cat.count > 0).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.id 
                    ? 'text-slate-900' 
                    : 'bg-slate-800/50 text-slate-400 hover:text-white border border-slate-700 hover:border-slate-600'
                }`}
                style={{
                  backgroundColor: selectedCategory === cat.id ? cat.color : undefined
                }}
              >
                <span style={{ color: selectedCategory === cat.id ? 'inherit' : cat.color }}>
                  {cat.icon}
                </span>
                {cat.name}
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  selectedCategory === cat.id ? 'bg-black/20' : 'bg-slate-700'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Models Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedCategory}-${searchQuery}-${viewMode}`}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className={`grid gap-5 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              }`}
            >
              {filteredModels.map((model) => (
                <motion.div key={model.id} variants={itemVariants}>
                  <ModelCard 
                    model={model} 
                    isLarge={viewMode === 'large'}
                    isHovered={hoveredCard === model.id}
                    onHover={() => setHoveredCard(model.id)}
                    onLeave={() => setHoveredCard(null)}
                    onOpen={() => handleOpenWorkspace(model.id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Empty State */}
          {filteredModels.length === 0 && (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Box className="w-16 h-16 mx-auto text-slate-700 mb-4" />
              <h3 className="text-white text-lg font-semibold mb-2">Aucun modèle trouvé</h3>
              <p className="text-slate-500 text-sm mb-4">Essayez de modifier vos filtres de recherche</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-all"
              >
                Réinitialiser les filtres
              </button>
            </motion.div>
          )}

          {/* Stats Footer */}
          <div className="flex items-center justify-between pt-8 mt-8 border-t border-slate-800">
            <div className="text-slate-500 text-sm">
              {filteredModels.length} modèle{filteredModels.length > 1 ? 's' : ''} affiché{filteredModels.length > 1 ? 's' : ''}
            </div>
            <div className="flex items-center gap-6">
              <span className="text-slate-500 text-sm flex items-center gap-2">
                <Box className="w-4 h-4" />
                Formats: GLB, GLTF
              </span>
              <span className="text-slate-500 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#8AFD81]" />
                Qualité 4K Ultra
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Featured Card Component
function FeaturedCard({ model, onOpen }: { model: UnifiedModel; onOpen: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700 hover:border-[#8AFD81]/50 transition-all cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onOpen}
    >
      {/* Preview 3D */}
      <div className="aspect-[4/3] relative">
        <Model3DPreview
          modelType={model.primitiveType}
          color={model.primitiveColor}
          variant={model.primitiveVariant}
          thumbnail={model.thumbnail}
          hovered={hovered}
          className="w-full h-full"
        />
        
        {/* Badge Featured */}
        <div className="absolute top-3 left-3 px-2 py-1 bg-yellow-500/90 backdrop-blur-sm text-slate-900 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1">
          <Star className="w-3 h-3" />
          Featured
        </div>

        {/* Hover overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent transition-opacity ${hovered ? 'opacity-100' : 'opacity-60'}`} />
      </div>

      {/* Info */}
      <div className="p-4 relative">
        <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-[#8AFD81] transition-colors">
          {model.name}
        </h3>
        <p className="text-slate-500 text-xs line-clamp-1">{model.description}</p>
        
        <div className="flex items-center justify-between mt-3">
          {model.power && (
            <span className="flex items-center gap-1 text-[#8AFD81] text-xs font-medium">
              <Zap className="w-3 h-3" />
              {model.power}
            </span>
          )}
          <span className="flex items-center gap-1 text-slate-400 text-xs group-hover:text-[#8AFD81] transition-colors">
            Ouvrir
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
}

// Model Card Component
function ModelCard({ 
  model, 
  isLarge,
  isHovered,
  onHover,
  onLeave,
  onOpen,
}: { 
  model: UnifiedModel; 
  isLarge: boolean;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onOpen: () => void;
}) {
  const categoryColors: Record<string, string> = {
    container: '#8AFD81',
    transformer: '#f59e0b',
    power: '#3b82f6',
    building: '#a855f7',
    cooling: '#06b6d4',
    distribution: '#a855f7',
    ground: '#78716c',
    environment: '#22c55e',
  };

  const qualityBadges: Record<string, { label: string; color: string }> = {
    'ultra-realistic': { label: 'Ultra HD', color: '#8AFD81' },
    'high': { label: 'High', color: '#3b82f6' },
    'standard': { label: 'Standard', color: '#64748b' },
    'basic': { label: 'Basic', color: '#94a3b8' },
  };

  const quality = qualityBadges[model.quality] || qualityBadges['standard'];

  return (
    <motion.div 
      className={`group bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden transition-all cursor-pointer ${
        isHovered ? 'border-[#8AFD81]/50 shadow-lg shadow-[#8AFD81]/10' : 'hover:border-slate-600'
      }`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onOpen}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Preview 3D */}
      <div className={`relative overflow-hidden ${isLarge ? 'aspect-[16/10]' : 'aspect-video'}`}>
        <Model3DPreview
          modelType={model.primitiveType}
          color={model.primitiveColor}
          variant={model.primitiveVariant}
          hovered={isHovered}
          className="w-full h-full"
        />
        
        {/* Category Badge */}
        <div 
          className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase backdrop-blur-sm"
          style={{ 
            backgroundColor: `${categoryColors[model.category] || '#8AFD81'}20`,
            color: categoryColors[model.category] || '#8AFD81',
            border: `1px solid ${categoryColors[model.category] || '#8AFD81'}40`,
          }}
        >
          {model.category}
        </div>

        {/* Quality Badge */}
        <div 
          className="absolute top-3 right-3 px-2 py-1 rounded-lg text-[10px] font-semibold backdrop-blur-sm"
          style={{ 
            backgroundColor: `${quality.color}20`,
            color: quality.color,
            border: `1px solid ${quality.color}40`,
          }}
        >
          {quality.label}
        </div>

        {/* Hover Actions */}
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.button 
                className="px-4 py-2.5 bg-[#8AFD81] text-slate-900 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-[#6FD96A] transition-all"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Eye className="w-4 h-4" />
                Ouvrir le Workspace
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-[#8AFD81] transition-colors">
          {model.name}
        </h3>
        <p className="text-slate-500 text-xs line-clamp-2 mb-3">{model.description}</p>
        
        {/* Dimensions & Power */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">
            {model.dimensions.length}m × {model.dimensions.width}m × {model.dimensions.height}m
          </span>
          {model.power && (
            <span className="flex items-center gap-1 text-[#8AFD81] font-medium">
              <Zap className="w-3 h-3" />
              {model.power}
            </span>
          )}
        </div>

        {/* Tags preview */}
        {isLarge && model.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {model.tags.slice(0, 4).map((tag, i) => (
              <span key={i} className="px-2 py-0.5 bg-slate-700/50 text-slate-400 rounded text-[10px]">
                {tag}
              </span>
            ))}
            {model.tags.length > 4 && (
              <span className="px-2 py-0.5 bg-slate-700/50 text-slate-500 rounded text-[10px]">
                +{model.tags.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
