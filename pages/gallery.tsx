/**
 * Galerie de Modèles 3D - Bibliothèque d'assets
 * Route: /gallery
 * Affiche tous les modèles 3D disponibles avec aperçu
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { UNIFIED_MODEL_CATALOG, UnifiedModel } from '../components/3d/UnifiedModelCatalog';
import {
  Search,
  Grid3X3,
  List,
  Box,
  Zap,
  Snowflake,
  Building2,
  Shield,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface CategoryInfo {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  count: number;
}

export default function GalleryPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
      id: 'building',
      name: 'Bâtiments',
      icon: <Building2 className="w-5 h-5" />,
      color: '#a855f7',
      count: categoryCounts['building'] || 0,
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
      color: '#64748b',
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
      model.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500">Chargement...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Galerie de Modèles 3D - Qatar Strategic Reserve</title>
        <meta name="description" content="Bibliothèque complète de modèles 3D pour l'infrastructure mining" />
      </Head>

      <div className="min-h-screen bg-slate-50 p-6 lg:p-6">
        {/* Hero Header - Style cohérent avec le Dashboard */}
        <div className="relative h-[160px] rounded-2xl overflow-hidden bg-slate-900 mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-slate-900/40" />
          <div className="absolute inset-0 z-10 p-6 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1.5 bg-[#8AFD81] text-slate-900 rounded-full text-[10px] font-bold uppercase tracking-widest">
                Galerie 3D
              </span>
              <span className="px-3 py-1.5 bg-white/10 text-white/90 rounded-full text-[10px] font-medium backdrop-blur-md border border-white/10 uppercase tracking-widest">
                {UNIFIED_MODEL_CATALOG.length} Modèles
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Galerie de Modèles 3D
            </h1>
            <p className="mt-2 text-slate-400 text-sm">
              Bibliothèque d&apos;assets ultra-réalistes 4K pour l&apos;infrastructure mining
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher un modèle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#8AFD81] focus:ring-2 focus:ring-[#8AFD81]/20 transition-all shadow-sm"
              />
            </div>

            {/* View Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-[#8AFD81] text-slate-900 shadow-sm' 
                    : 'bg-white text-slate-400 hover:text-slate-900 border border-slate-200'
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-all ${
                  viewMode === 'list' 
                    ? 'bg-[#8AFD81] text-slate-900 shadow-sm' 
                    : 'bg-white text-slate-400 hover:text-slate-900 border border-slate-200'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-3 overflow-x-auto pb-4 mb-6">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                !selectedCategory 
                  ? 'bg-[#8AFD81] text-slate-900 shadow-sm' 
                  : 'bg-white text-slate-500 hover:text-slate-900 border border-slate-200'
              }`}
            >
              Tous
              <span className="px-2 py-0.5 bg-black/10 rounded-full text-xs">
                {UNIFIED_MODEL_CATALOG.length}
              </span>
            </button>
            {categories.filter(cat => cat.count > 0).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all shadow-sm ${
                  selectedCategory === cat.id 
                    ? 'text-slate-900' 
                    : 'bg-white text-slate-500 hover:text-slate-900 border border-slate-200'
                }`}
                style={{
                  backgroundColor: selectedCategory === cat.id ? cat.color : undefined
                }}
              >
                <span style={{ color: selectedCategory === cat.id ? 'black' : cat.color }}>
                  {cat.icon}
                </span>
                {cat.name}
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  selectedCategory === cat.id ? 'bg-black/20' : 'bg-slate-100'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Models Grid */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredModels.map((model) => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredModels.map((model) => (
                <ModelListItem key={model.id} model={model} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredModels.length === 0 && (
            <div className="text-center py-20">
              <Box className="w-16 h-16 mx-auto text-slate-300 mb-4" />
              <h3 className="text-slate-900 text-sm font-semibold mb-2">Aucun modèle trouvé</h3>
              <p className="text-slate-500 text-sm">Essayez de modifier vos filtres de recherche</p>
            </div>
          )}

          {/* Stats Footer */}
          <div className="flex items-center justify-between pt-8 mt-8 border-t border-slate-200">
            <div className="text-slate-500 text-sm">
              {filteredModels.length} modèle{filteredModels.length > 1 ? 's' : ''} affiché{filteredModels.length > 1 ? 's' : ''}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-slate-500 text-sm">Formats: GLB, GLTF, FBX</span>
              <span className="text-slate-500 text-sm">Qualité: 4K Ultra</span>
            </div>
          </div>
      </div>
    </>
  );
}

// Model Card Component
function ModelCard({ model }: { model: UnifiedModel }) {
  const categoryColors: Record<string, string> = {
    container: '#8AFD81',
    transformer: '#f59e0b',
    power: '#3b82f6',
    building: '#a855f7',
    cooling: '#06b6d4',
    distribution: '#64748b',
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
    <div className="group bg-white rounded-2xl border border-slate-200 hover:border-[#8AFD81]/50 overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5">
      {/* Preview Image */}
      <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <Box className="w-16 h-16 text-slate-200" />
        </div>
        
        {/* Category Badge */}
        <div 
          className="absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-semibold"
          style={{ 
            backgroundColor: `${categoryColors[model.category] || '#8AFD81'}20`,
            color: categoryColors[model.category] || '#8AFD81'
          }}
        >
          {model.category}
        </div>

        {/* Quality Badge */}
        <div 
          className="absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-semibold"
          style={{ 
            backgroundColor: `${quality.color}20`,
            color: quality.color
          }}
        >
          {quality.label}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button className="px-4 py-2 bg-[#8AFD81] text-slate-900 rounded-xl text-sm font-semibold hover:bg-[#6FD96A] transition-all">
            Voir les détails
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-slate-900 font-semibold text-sm mb-1">{model.name}</h3>
        <p className="text-slate-500 text-xs line-clamp-2">{model.description}</p>
        
        {/* Dimensions & Power */}
        <div className="flex items-center justify-between mt-3 text-slate-400 text-xs">
          <span>{model.dimensions.length}m × {model.dimensions.width}m × {model.dimensions.height}m</span>
          {model.power && (
            <span className="flex items-center gap-1 text-[#8AFD81] font-medium">
              <Zap className="w-3 h-3" />
              {model.power}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Model List Item Component
function ModelListItem({ model }: { model: UnifiedModel }) {
  const categoryColors: Record<string, string> = {
    container: '#8AFD81',
    transformer: '#f59e0b',
    power: '#3b82f6',
    building: '#a855f7',
    cooling: '#06b6d4',
    distribution: '#64748b',
    ground: '#78716c',
    environment: '#22c55e',
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200 hover:border-[#8AFD81]/50 transition-all shadow-sm hover:shadow-md">
      {/* Icon */}
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${categoryColors[model.category] || '#8AFD81'}20` }}
      >
        <Box className="w-6 h-6" style={{ color: categoryColors[model.category] || '#8AFD81' }} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-slate-900 font-semibold text-sm">{model.name}</h3>
        <p className="text-slate-500 text-xs truncate">{model.description}</p>
      </div>

      {/* Category */}
      <div 
        className="px-3 py-1 rounded-lg text-xs font-semibold hidden md:block"
        style={{ 
          backgroundColor: `${categoryColors[model.category] || '#8AFD81'}20`,
          color: categoryColors[model.category] || '#8AFD81'
        }}
      >
        {model.category}
      </div>

      {/* Dimensions */}
      <div className="text-slate-400 text-xs whitespace-nowrap hidden lg:block">
        {model.dimensions.length} × {model.dimensions.width} × {model.dimensions.height}m
      </div>

      {/* Power */}
      {model.power && (
        <div className="flex items-center gap-1 text-[#8AFD81] text-xs font-medium">
          <Zap className="w-3 h-3" />
          {model.power}
        </div>
      )}

      {/* Action */}
      <ChevronRight className="w-5 h-5 text-slate-300" />
    </div>
  );
}
