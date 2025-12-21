/**
 * 3D Workspace - Espace de travail 3D interactif
 * Route: /3d-workspace/[id]
 * Viewer complet avec contrôles, annotations et informations
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Model3DViewer } from '../../components/3d/Model3DViewer';
import { getModelById, UnifiedModel, ModelAnnotation } from '../../components/3d/UnifiedModelCatalog';
import {
  ArrowLeft,
  Box,
  Zap,
  Maximize,
  Grid3X3,
  Eye,
  Layers,
  Info,
  Download,
  Share2,
  Settings,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Move3D,
  Crosshair,
  Sun,
  Moon,
  Camera,
  Ruler,
  Tag,
  ExternalLink,
  Copy,
  Check,
  X,
  PanelLeftClose,
  PanelRightClose,
  PanelLeft,
  PanelRight,
  Sparkles,
} from 'lucide-react';

export default function WorkspacePage() {
  const router = useRouter();
  const { id } = router.query;
  
  const [mounted, setMounted] = useState(false);
  const [model, setModel] = useState<UnifiedModel | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showGizmo, setShowGizmo] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [activeAnnotation, setActiveAnnotation] = useState<ModelAnnotation | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (id && typeof id === 'string') {
      const foundModel = getModelById(id);
      setModel(foundModel || null);
    }
  }, [id]);

  const handleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleAnnotationClick = useCallback((annotation: ModelAnnotation) => {
    setActiveAnnotation(annotation);
    setShowRightPanel(true);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'f' || e.key === 'F') handleFullscreen();
      if (e.key === 'g' || e.key === 'G') setShowGrid(prev => !prev);
      if (e.key === 'w' || e.key === 'W') setWireframe(prev => !prev);
      if (e.key === 'Escape') setActiveAnnotation(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFullscreen]);

  if (!mounted) {
    return (
      <div className="h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-[#8AFD81]/30 border-t-[#8AFD81] rounded-full animate-spin mx-auto mb-4" />
          <div className="text-slate-400">Chargement du workspace...</div>
        </div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Box className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <h2 className="text-white text-xl font-semibold mb-2">Modèle non trouvé</h2>
          <p className="text-slate-500 mb-6">Le modèle demandé n&apos;existe pas dans le catalogue.</p>
          <Link 
            href="/gallery"
            className="px-6 py-3 bg-[#8AFD81] text-slate-900 rounded-xl font-semibold hover:bg-[#6FD96A] transition-all"
          >
            Retour à la galerie
          </Link>
        </div>
      </div>
    );
  }

  const categoryColors: Record<string, string> = {
    container: '#8AFD81',
    transformer: '#f59e0b',
    power: '#3b82f6',
    cooling: '#06b6d4',
    distribution: '#a855f7',
    ground: '#78716c',
    environment: '#22c55e',
  };

  return (
    <>
      <Head>
        <title>{model.name} - 3D Workspace | Qatar Strategic Reserve</title>
        <meta name="description" content={model.description} />
      </Head>

      <div className="h-screen bg-slate-900 flex flex-col overflow-hidden">
        {/* TOP BAR */}
        <motion.div 
          className="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 px-4 py-2.5 flex items-center justify-between z-50"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          {/* Left - Navigation */}
          <div className="flex items-center gap-3">
            <Link 
              href="/gallery" 
              className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Galerie
            </Link>
            <div className="w-px h-6 bg-slate-700" />
            <span 
              className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase"
              style={{ 
                backgroundColor: `${categoryColors[model.category]}20`,
                color: categoryColors[model.category],
              }}
            >
              {model.category}
            </span>
            <span className="px-2.5 py-1 bg-slate-700/50 text-slate-300 rounded-lg text-[10px] font-medium uppercase">
              {model.quality}
            </span>
          </div>

          {/* Center - Title */}
          <div className="flex items-center gap-3">
            <Box className="w-5 h-5 text-[#8AFD81]" />
            <span className="text-white font-semibold">{model.name}</span>
            {model.power && (
              <span className="flex items-center gap-1.5 px-2 py-1 bg-[#8AFD81]/20 text-[#8AFD81] rounded-lg text-xs font-medium">
                <Zap className="w-3.5 h-3.5" />
                {model.power}
              </span>
            )}
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#8AFD81]" /> : <Share2 className="w-3.5 h-3.5" />}
              {copied ? 'Copié!' : 'Partager'}
            </button>
            <button
              onClick={handleFullscreen}
              className="p-2 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg transition-all"
              title="Plein écran (F)"
            >
              <Maximize className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-slate-700" />
            <span className="flex items-center gap-1.5 px-2 py-1 bg-[#8AFD81]/20 text-[#8AFD81] rounded text-[10px] font-bold uppercase">
              <span className="w-2 h-2 bg-[#8AFD81] rounded-full animate-pulse" />
              3D Actif
            </span>
          </div>
        </motion.div>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT PANEL - Controls */}
          <AnimatePresence>
            {showLeftPanel && (
              <motion.div 
                className="w-56 bg-slate-800/50 backdrop-blur-sm border-r border-slate-700 p-4 flex flex-col gap-4 overflow-y-auto"
                initial={{ x: -224, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -224, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              >
                {/* View Modes */}
                <div className="bg-slate-800 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Eye className="w-4 h-4 text-[#8AFD81]" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Affichage</span>
                  </div>
                  <div className="space-y-2">
                    <button 
                      onClick={() => setShowGrid(!showGrid)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        showGrid ? 'bg-[#8AFD81]/20 text-[#8AFD81] border border-[#8AFD81]/30' : 'bg-slate-700 text-white hover:bg-slate-600'
                      }`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                      Grille
                      <kbd className="ml-auto bg-slate-600 px-1.5 py-0.5 rounded text-[9px]">G</kbd>
                    </button>
                    <button 
                      onClick={() => setWireframe(!wireframe)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        wireframe ? 'bg-[#8AFD81]/20 text-[#8AFD81] border border-[#8AFD81]/30' : 'bg-slate-700 text-white hover:bg-slate-600'
                      }`}
                    >
                      <Move3D className="w-4 h-4" />
                      Wireframe
                      <kbd className="ml-auto bg-slate-600 px-1.5 py-0.5 rounded text-[9px]">W</kbd>
                    </button>
                    <button 
                      onClick={() => setShowGizmo(!showGizmo)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        showGizmo ? 'bg-[#8AFD81]/20 text-[#8AFD81] border border-[#8AFD81]/30' : 'bg-slate-700 text-white hover:bg-slate-600'
                      }`}
                    >
                      <Crosshair className="w-4 h-4" />
                      Gizmo
                    </button>
                  </div>
                </div>

                {/* Annotations */}
                {model.annotations && model.annotations.length > 0 && (
                  <div className="bg-slate-800 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="w-4 h-4 text-[#8AFD81]" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Points d&apos;intérêt</span>
                    </div>
                    <div className="space-y-1.5">
                      {model.annotations.map((annotation) => (
                        <button
                          key={annotation.id}
                          onClick={() => handleAnnotationClick(annotation)}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                            activeAnnotation?.id === annotation.id
                              ? 'bg-[#8AFD81]/20 text-[#8AFD81] border border-[#8AFD81]/30'
                              : 'bg-slate-700 text-white hover:bg-slate-600'
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-[#8AFD81] flex-shrink-0" />
                          {annotation.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Keyboard Shortcuts */}
                <div className="bg-slate-800 rounded-xl p-3 mt-auto">
                  <div className="flex items-center gap-2 mb-3">
                    <Settings className="w-4 h-4 text-[#8AFD81]" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Raccourcis</span>
                  </div>
                  <div className="space-y-2 text-[10px]">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Orbiter</span>
                      <span className="text-white">Clic + Drag</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Zoom</span>
                      <span className="text-white">Molette</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Pan</span>
                      <span className="text-white">Shift + Drag</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Plein écran</span>
                      <kbd className="bg-slate-700 px-1.5 py-0.5 rounded text-white">F</kbd>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CENTER - 3D Viewer */}
          <div className="flex-1 relative">
            {/* Toggle Left Panel */}
            <button
              onClick={() => setShowLeftPanel(!showLeftPanel)}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-40 p-2 bg-slate-800/80 hover:bg-slate-700 text-white rounded-lg backdrop-blur-sm transition-all border border-slate-700"
            >
              {showLeftPanel ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
            </button>

            {/* Toggle Right Panel */}
            <button
              onClick={() => setShowRightPanel(!showRightPanel)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-40 p-2 bg-slate-800/80 hover:bg-slate-700 text-white rounded-lg backdrop-blur-sm transition-all border border-slate-700"
            >
              {showRightPanel ? <PanelRightClose className="w-4 h-4" /> : <PanelRight className="w-4 h-4" />}
            </button>

            {/* 3D Viewer */}
            <Model3DViewer
              modelType={model.primitiveType}
              modelName={model.name}
              color={model.primitiveColor}
              variant={model.primitiveVariant}
              annotations={model.annotations}
              showGrid={showGrid}
              showGizmo={showGizmo}
              wireframe={wireframe}
              onAnnotationClick={handleAnnotationClick}
            />
          </div>

          {/* RIGHT PANEL - Model Info */}
          <AnimatePresence>
            {showRightPanel && (
              <motion.div 
                className="w-72 bg-slate-800/50 backdrop-blur-sm border-l border-slate-700 p-4 flex flex-col gap-4 overflow-y-auto"
                initial={{ x: 288, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 288, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              >
                {/* Model Info */}
                <div className="bg-slate-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-4 h-4 text-[#8AFD81]" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Informations</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">{model.name}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed mb-4">{model.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Type</span>
                      <span className="text-white font-medium">{model.type}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Qualité</span>
                      <span className="text-[#8AFD81] font-medium capitalize">{model.quality}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Source</span>
                      <span className="text-white font-medium capitalize">{model.source}</span>
                    </div>
                  </div>
                </div>

                {/* Dimensions */}
                <div className="bg-slate-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Ruler className="w-4 h-4 text-[#8AFD81]" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Dimensions</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-2 bg-slate-700/50 rounded-lg">
                      <div className="text-[10px] text-slate-500 uppercase mb-1">Longueur</div>
                      <div className="text-white font-bold">{model.dimensions.length}m</div>
                    </div>
                    <div className="text-center p-2 bg-slate-700/50 rounded-lg">
                      <div className="text-[10px] text-slate-500 uppercase mb-1">Largeur</div>
                      <div className="text-white font-bold">{model.dimensions.width}m</div>
                    </div>
                    <div className="text-center p-2 bg-slate-700/50 rounded-lg">
                      <div className="text-[10px] text-slate-500 uppercase mb-1">Hauteur</div>
                      <div className="text-white font-bold">{model.dimensions.height}m</div>
                    </div>
                  </div>
                  {model.power && (
                    <div className="mt-3 p-3 bg-[#8AFD81]/10 border border-[#8AFD81]/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-[#8AFD81]" />
                          <span className="text-xs text-slate-400">Puissance</span>
                        </div>
                        <span className="text-[#8AFD81] font-bold">{model.power}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Active Annotation */}
                <AnimatePresence>
                  {activeAnnotation && (
                    <motion.div 
                      className="bg-slate-800 rounded-xl p-4 border border-[#8AFD81]/30"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-[#8AFD81]" />
                          <span className="text-xs font-bold text-[#8AFD81] uppercase tracking-wider">Point sélectionné</span>
                        </div>
                        <button 
                          onClick={() => setActiveAnnotation(null)}
                          className="p-1 hover:bg-slate-700 rounded transition-all"
                        >
                          <X className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                      </div>
                      <h4 className="text-white font-semibold mb-2">{activeAnnotation.label}</h4>
                      {activeAnnotation.description && (
                        <p className="text-slate-400 text-xs leading-relaxed">{activeAnnotation.description}</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Tags */}
                <div className="bg-slate-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-[#8AFD81]" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {model.tags.map((tag, i) => (
                      <span 
                        key={i} 
                        className="px-2.5 py-1 bg-slate-700/50 text-slate-300 rounded-lg text-[10px] hover:bg-slate-700 transition-all cursor-default"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-slate-800 rounded-xl p-4 mt-auto">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-[#8AFD81]" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Actions</span>
                  </div>
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#8AFD81] hover:bg-[#6FD96A] text-slate-900 rounded-lg text-sm font-semibold transition-all">
                      <Download className="w-4 h-4" />
                      Télécharger GLB
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-all">
                      <Camera className="w-4 h-4" />
                      Capture d&apos;écran
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* BOTTOM STATUS BAR */}
        <motion.div 
          className="bg-slate-800/95 backdrop-blur-sm border-t border-slate-700 px-4 py-2 flex items-center justify-between text-xs"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, delay: 0.1 }}
        >
          <div className="flex items-center gap-4 text-slate-400">
            <div className="flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5 text-[#8AFD81]" />
              <span>Three.js + React Three Fiber</span>
            </div>
            <div className="w-px h-4 bg-slate-700" />
            <span>Qualité: {model.quality}</span>
            <div className="w-px h-4 bg-slate-700" />
            <span>Source: {model.source}</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>
              Dimensions: {model.dimensions.length}m × {model.dimensions.width}m × {model.dimensions.height}m
            </span>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-[#8AFD81] rounded-full animate-pulse" />
              <span className="text-[#8AFD81] font-semibold">Rendu 3D Actif</span>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

