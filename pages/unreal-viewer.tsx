/**
 * Page Unreal Viewer - Stream Pixel Streaming intégré
 * Avec design personnalisé Hearst Qatar
 * Route: /unreal-viewer
 */

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import {
  Monitor,
  Maximize,
  Settings,
  Camera,
  Wifi,
  WifiOff,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  Cpu,
  Gauge,
} from 'lucide-react';

// Configuration du serveur Pixel Streaming
const PIXEL_STREAMING_URL = 'ws://192.168.1.116:8888';
const PIXEL_STREAMING_SIGNALING = 'ws://192.168.1.116:8080';
const PIXEL_STREAMING_PLAYER = 'http://192.168.1.116:8080';

export default function UnrealViewer() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [selectedQuality, setSelectedQuality] = useState('4K Ultra');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Simuler le chargement
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsConnected(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleFullscreen = () => {
    if (iframeRef.current) {
      iframeRef.current.requestFullscreen();
    }
  };

  const cameraViews = [
    { name: 'Vue Aérienne', icon: '🚁' },
    { name: 'Vue Nord', icon: '⬆️' },
    { name: 'Vue Sud', icon: '⬇️' },
    { name: 'Vue Est', icon: '➡️' },
  ];

  return (
    <>
      <Head>
        <title>Unreal Viewer 3D - Qatar Strategic Reserve</title>
        <meta name="description" content="Visualisation 3D temps réel avec Unreal Engine 5 - Pixel Streaming" />
      </Head>

      <div className="min-h-screen bg-slate-900">
        {/* Hero Header - Style cohérent avec le Dashboard */}
        <div className="relative h-[140px] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 p-6">
          <div className="flex items-center justify-between h-full">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1.5 bg-[#8AFD81] text-slate-900 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  Unreal Engine 5
                </span>
                <span className="px-3 py-1.5 bg-cyan-500/20 text-cyan-400 rounded-full text-[10px] font-medium border border-cyan-500/30 uppercase tracking-widest">
                  Pixel Streaming
                </span>
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Visualisation 3D Temps Réel
              </h1>
              <p className="mt-1 text-slate-400">
                Mining Facility Qatar - Rendu Ultra HD 4K
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Status */}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                isConnected 
                  ? 'bg-[#8AFD81]/20 text-[#8AFD81] border border-[#8AFD81]/30' 
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {isConnected ? (
                  <Wifi className="w-4 h-4" />
                ) : (
                  <WifiOff className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">{isConnected ? 'Connecté' : 'Déconnecté'}</span>
              </div>
              
              <button
                onClick={handleFullscreen}
                className="flex items-center gap-2 px-4 py-2 bg-[#8AFD81] hover:bg-[#6FD96A] text-slate-900 rounded-xl font-semibold transition-all"
              >
                <Maximize className="w-4 h-4" />
                Plein écran
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex" style={{ height: 'calc(100vh - 140px - 48px)' }}>
          {/* Sidebar Controls */}
          {showControls && (
            <aside className="w-72 bg-slate-800/50 border-r border-slate-700/50 p-5 overflow-y-auto">
              <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#8AFD81]" />
                Contrôles
              </h2>
              
              <div className="space-y-6">
                {/* Camera Presets */}
                <div>
                  <h3 className="text-sm text-slate-400 mb-3 flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Vues caméra
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {cameraViews.map((view, i) => (
                      <button
                        key={i}
                        className="px-3 py-2.5 bg-slate-700/50 hover:bg-slate-700 hover:border-[#8AFD81]/50 border border-slate-600/50 rounded-xl text-sm text-white transition-all"
                      >
                        <span className="mr-1">{view.icon}</span> {view.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quality Settings */}
                <div>
                  <h3 className="text-sm text-slate-400 mb-3 flex items-center gap-2">
                    <Gauge className="w-4 h-4" />
                    Qualité de rendu
                  </h3>
                  <select 
                    value={selectedQuality}
                    onChange={(e) => setSelectedQuality(e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#8AFD81]/50"
                  >
                    <option>4K Ultra</option>
                    <option>1080p High</option>
                    <option>720p Medium</option>
                    <option>Auto</option>
                  </select>
                </div>

                {/* Info */}
                <div className="p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                  <h3 className="text-sm text-white font-medium mb-3 flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-[#8AFD81]" />
                    Informations serveur
                  </h3>
                  <div className="text-xs space-y-2 text-slate-400">
                    <div className="flex justify-between">
                      <span>Serveur:</span>
                      <span className="text-white">192.168.1.116</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Résolution:</span>
                      <span className="text-white">3840×2160</span>
                    </div>
                    <div className="flex justify-between">
                      <span>FPS:</span>
                      <span className="text-[#8AFD81]">60</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Latence:</span>
                      <span className="text-[#8AFD81]">~20ms</span>
                    </div>
                  </div>
                </div>

                {/* Keyboard Shortcuts */}
                <div className="p-4 bg-[#8AFD81]/10 border border-[#8AFD81]/30 rounded-xl">
                  <h3 className="text-sm text-[#8AFD81] font-medium mb-3 flex items-center gap-2">
                    <Gamepad2 className="w-4 h-4" />
                    Raccourcis clavier
                  </h3>
                  <div className="text-xs space-y-2 text-slate-300">
                    <div className="flex items-center gap-2">
                      <kbd className="bg-slate-700 px-2 py-0.5 rounded text-white">WASD</kbd>
                      <span>Déplacer</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <kbd className="bg-slate-700 px-2 py-0.5 rounded text-white">Souris</kbd>
                      <span>Regarder</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <kbd className="bg-slate-700 px-2 py-0.5 rounded text-white">F</kbd>
                      <span>Plein écran</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <kbd className="bg-slate-700 px-2 py-0.5 rounded text-white">Esc</kbd>
                      <span>Quitter</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* Stream Container */}
          <div className="flex-1 relative bg-black">
            {/* Toggle Sidebar */}
            <button
              onClick={() => setShowControls(!showControls)}
              className="absolute top-4 left-4 z-10 p-2 bg-slate-900/80 hover:bg-slate-800 rounded-xl border border-slate-700 text-white transition-all"
            >
              {showControls ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>

            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-slate-900 flex items-center justify-center z-20">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-[#8AFD81]/30 border-t-[#8AFD81] rounded-full animate-spin mb-4 mx-auto" />
                  <p className="text-[#8AFD81] font-medium">Connexion au serveur Unreal...</p>
                  <p className="text-slate-500 text-sm mt-2">192.168.1.116</p>
                </div>
              </div>
            )}

            {/* Pixel Streaming iframe */}
            <iframe
              ref={iframeRef}
              src={PIXEL_STREAMING_PLAYER}
              className="w-full h-full border-0"
              allow="autoplay; fullscreen; microphone"
              style={{ background: '#000' }}
            />
          </div>
        </div>

        {/* Footer Status Bar */}
        <footer className="h-12 bg-slate-800/80 border-t border-slate-700/50 px-6 flex items-center justify-between">
          <div className="flex items-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-[#8AFD81]" />
              <span>Pixel Streaming Active</span>
            </div>
            <div className="w-px h-4 bg-slate-700" />
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              <span>GPU: NVIDIA RTX</span>
            </div>
            <div className="w-px h-4 bg-slate-700" />
            <span>Unreal Engine 5.7</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 bg-[#8AFD81] rounded-full animate-pulse" />
            <span className="text-[#8AFD81]">Stream OK</span>
          </div>
        </footer>
      </div>
    </>
  );
}
