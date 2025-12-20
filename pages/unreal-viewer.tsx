/**
 * Unreal Viewer Page - Integrated Pixel Streaming
 * Centered layout with video in the middle and controls around
 * Route: /unreal-viewer
 */

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Monitor,
  Maximize,
  Camera,
  WifiOff,
  Gamepad2,
  Cpu,
  ArrowLeft,
  Play,
  RefreshCw,
  Power,
  PowerOff,
  ExternalLink,
  Settings,
  Eye,
  Layers,
  Plane,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  PanelLeftClose,
  PanelRightClose,
  PanelLeft,
  PanelRight,
} from 'lucide-react';

// Pixel Streaming Server Configuration - Arcware Cloud
const PIXEL_STREAMING_PLAYER = 'https://share.arcware.cloud/v1/share-42dc0370-359f-47e0-98e8-0aa265062dea';

export default function UnrealViewer() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [streamActive, setStreamActive] = useState(true);
  const [selectedQuality, setSelectedQuality] = useState('4K Ultra');
  const [showLeftPanel, setShowLeftPanel] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
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

  const handleRefresh = () => {
    if (iframeRef.current && streamActive) {
      setIsLoading(true);
      iframeRef.current.src = iframeRef.current.src;
      setTimeout(() => setIsLoading(false), 2000);
    }
  };

  const handleDisconnect = () => {
    if (streamActive) {
      setStreamActive(false);
      setIsConnected(false);
      if (iframeRef.current) {
        iframeRef.current.src = 'about:blank';
      }
    } else {
      setStreamActive(true);
      setIsLoading(true);
      if (iframeRef.current) {
        iframeRef.current.src = PIXEL_STREAMING_PLAYER;
      }
      setTimeout(() => {
        setIsLoading(false);
        setIsConnected(true);
      }, 2000);
    }
  };

  const cameraViews = [
    { name: 'Aerial', Icon: Plane },
    { name: 'North', Icon: ArrowUp },
    { name: 'South', Icon: ArrowDown },
    { name: 'East', Icon: ArrowRight },
  ];

  return (
    <>
      <Head>
        <title>Unreal Viewer 3D - Qatar Strategic Reserve</title>
        <meta name="description" content="Real-time 3D visualization with Unreal Engine 5 - Pixel Streaming" />
      </Head>

      <div className="h-screen bg-slate-900 flex flex-col overflow-hidden">
        
        {/* TOP BAR */}
        <div className="bg-slate-800 border-b border-slate-700 px-4 py-2 flex items-center justify-between z-50">
          {/* Left - Navigation */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-medium transition-all">
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Link>
            <div className="w-px h-5 bg-slate-600" />
            <span className="px-2 py-1 bg-[#8AFD81] text-slate-900 rounded text-[10px] font-bold uppercase tracking-wider">
              UE5
            </span>
            <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-[10px] font-medium border border-cyan-500/30 uppercase">
              Arcware Cloud
            </span>
          </div>

          {/* Center - Title */}
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-[#8AFD81]" />
            <span className="text-white font-semibold text-sm">Mining Facility Qatar</span>
            <span className="text-slate-400 text-xs">- 3D Visualization</span>
          </div>

          {/* Right - Status & Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleDisconnect}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                streamActive 
                  ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30' 
                  : 'bg-[#8AFD81]/20 hover:bg-[#8AFD81]/30 text-[#8AFD81] border border-[#8AFD81]/30'
              }`}
            >
              {streamActive ? <PowerOff className="w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5" />}
              {streamActive ? 'Stop' : 'Start'}
            </button>
            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase ${
              streamActive && isConnected
                ? 'bg-[#8AFD81]/20 text-[#8AFD81]'
                : 'bg-red-500/20 text-red-400'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${streamActive && isConnected ? 'bg-[#8AFD81] animate-pulse' : 'bg-red-400'}`} />
              {streamActive && isConnected ? 'Live' : 'Offline'}
            </span>
          </div>
        </div>

        {/* MAIN CONTENT - 3 Columns */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* LEFT PANEL - Camera & Views */}
          {showLeftPanel && (
            <div className="w-48 bg-slate-800/50 border-r border-slate-700 p-3 flex flex-col gap-3 overflow-y-auto">
              {/* Camera Views */}
              <div className="bg-slate-800 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-3">
                  <Camera className="w-4 h-4 text-[#8AFD81]" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Cameras</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {cameraViews.map((view, i) => (
                    <button
                      key={i}
                      className="px-2 py-2 bg-slate-700 hover:bg-slate-600 hover:border-[#8AFD81]/50 border border-slate-600 rounded-lg text-xs text-white font-medium transition-all text-center flex flex-col items-center gap-1"
                    >
                      <view.Icon className="w-4 h-4 text-[#8AFD81]" />
                      {view.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* View Modes */}
              <div className="bg-slate-800 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="w-4 h-4 text-[#8AFD81]" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Mode</span>
                </div>
                <div className="space-y-1.5">
                  <button className="w-full px-3 py-2 bg-[#8AFD81]/20 border border-[#8AFD81]/30 text-[#8AFD81] rounded-lg text-xs font-medium">
                    Normal
                  </button>
                  <button className="w-full px-3 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white rounded-lg text-xs font-medium">
                    Wireframe
                  </button>
                  <button className="w-full px-3 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white rounded-lg text-xs font-medium">
                    Thermal
                  </button>
                </div>
              </div>

              {/* Layers */}
              <div className="bg-slate-800 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-3">
                  <Layers className="w-4 h-4 text-[#8AFD81]" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Layers</span>
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-[#8AFD81]" />
                    Containers
                  </label>
                  <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-[#8AFD81]" />
                    Power Blocks
                  </label>
                  <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-[#8AFD81]" />
                    Cooling
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                    <input type="checkbox" className="accent-[#8AFD81]" />
                    Grid Overlay
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* CENTER - VIDEO STREAM */}
          <div className="flex-1 relative bg-black">
            {/* Toggle Left Panel */}
            <button
              onClick={() => setShowLeftPanel(!showLeftPanel)}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-40 p-1.5 bg-slate-800/80 hover:bg-slate-700 text-white rounded-lg backdrop-blur-sm transition-all"
              title={showLeftPanel ? 'Hide panel' : 'Show panel'}
            >
              {showLeftPanel ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
            </button>

            {/* Toggle Right Panel */}
            <button
              onClick={() => setShowRightPanel(!showRightPanel)}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-40 p-1.5 bg-slate-800/80 hover:bg-slate-700 text-white rounded-lg backdrop-blur-sm transition-all"
              title={showRightPanel ? 'Hide panel' : 'Show panel'}
            >
              {showRightPanel ? <PanelRightClose className="w-4 h-4" /> : <PanelRight className="w-4 h-4" />}
            </button>

            {/* Loading Overlay */}
            {isLoading && streamActive && (
              <div className="absolute inset-0 flex items-center justify-center z-30 bg-slate-900">
                <div className="text-center">
                  <div className="w-10 h-10 border-3 border-[#8AFD81]/30 border-t-[#8AFD81] rounded-full animate-spin mb-3 mx-auto" />
                  <p className="text-slate-400 text-sm">Connecting to Arcware Cloud...</p>
                </div>
              </div>
            )}

            {/* Disconnected State */}
            {!streamActive && (
              <div className="absolute inset-0 flex items-center justify-center z-30 bg-slate-900">
                <div className="text-center">
                  <WifiOff className="w-10 h-10 text-slate-600 mb-3 mx-auto" />
                  <p className="text-slate-400 text-sm">Stream stopped</p>
                  <button
                    onClick={handleDisconnect}
                    className="mt-3 px-4 py-2 bg-[#8AFD81] hover:bg-[#6FD96A] text-slate-900 rounded-lg text-sm font-semibold transition-all"
                  >
                    Resume
                  </button>
                </div>
              </div>
            )}

            {/* Iframe Stream */}
            {streamActive && (
              <iframe
                ref={iframeRef}
                src={PIXEL_STREAMING_PLAYER}
                className="absolute inset-0 w-full h-full border-0"
                allow="autoplay; fullscreen; microphone; camera"
                allowFullScreen
              />
            )}

            {/* Bottom Toolbar */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-slate-800/90 backdrop-blur-sm rounded-xl px-3 py-2 border border-slate-700">
              <button
                onClick={handleRefresh}
                className="p-2 hover:bg-slate-700 text-white rounded-lg transition-all"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <div className="w-px h-5 bg-slate-600" />
              <button
                onClick={handleFullscreen}
                className="p-2 hover:bg-slate-700 text-white rounded-lg transition-all"
                title="Fullscreen"
              >
                <Maximize className="w-4 h-4" />
              </button>
              <div className="w-px h-5 bg-slate-600" />
              <a
                href={PIXEL_STREAMING_PLAYER}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-slate-700 text-white rounded-lg transition-all"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <div className="w-px h-5 bg-slate-600" />
              <select 
                value={selectedQuality}
                onChange={(e) => setSelectedQuality(e.target.value)}
                className="bg-slate-700 border-0 rounded-lg px-2 py-1.5 text-xs text-white font-medium focus:outline-none focus:ring-1 focus:ring-[#8AFD81]"
              >
                <option>4K Ultra</option>
                <option>1080p</option>
                <option>720p</option>
                <option>Auto</option>
              </select>
            </div>
          </div>

          {/* RIGHT PANEL - Info & Stats */}
          {showRightPanel && (
            <div className="w-48 bg-slate-800/50 border-l border-slate-700 p-3 flex flex-col gap-3 overflow-y-auto">
              {/* Server Info */}
              <div className="bg-slate-800 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-3">
                  <Monitor className="w-4 h-4 text-[#8AFD81]" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Server</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Host</span>
                    <span className="text-white font-medium">Arcware</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Resolution</span>
                    <span className="text-white font-medium">4K</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">FPS</span>
                    <span className="text-[#8AFD81] font-bold">60</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Latency</span>
                    <span className="text-[#8AFD81] font-bold">~20ms</span>
                  </div>
                </div>
              </div>

              {/* GPU Info */}
              <div className="bg-slate-800 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-3">
                  <Cpu className="w-4 h-4 text-[#8AFD81]" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">GPU</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Model</span>
                    <span className="text-white font-medium">RTX 4090</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Usage</span>
                    <span className="text-[#8AFD81] font-bold">45%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">VRAM</span>
                    <span className="text-white font-medium">12/24 GB</span>
                  </div>
                </div>
              </div>

              {/* Shortcuts */}
              <div className="bg-slate-800 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-3">
                  <Gamepad2 className="w-4 h-4 text-[#8AFD81]" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Controls</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <kbd className="bg-slate-700 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">WASD</kbd>
                    <span className="text-slate-400">Move</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="bg-slate-700 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">Mouse</kbd>
                    <span className="text-slate-400">Look</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="bg-slate-700 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">F</kbd>
                    <span className="text-slate-400">Fullscreen</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="bg-slate-700 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">Esc</kbd>
                    <span className="text-slate-400">Exit</span>
                  </div>
                </div>
              </div>

              {/* Scene Info */}
              <div className="bg-slate-800 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-3">
                  <Settings className="w-4 h-4 text-[#8AFD81]" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Scene</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Containers</span>
                    <span className="text-white font-medium">48</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Miners</span>
                    <span className="text-white font-medium">5,760</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Polygons</span>
                    <span className="text-white font-medium">2.4M</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM STATUS BAR */}
        <div className="bg-slate-800 border-t border-slate-700 px-4 py-1.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4 text-slate-400">
            <div className="flex items-center gap-1.5">
              <Gamepad2 className="w-3.5 h-3.5 text-[#8AFD81]" />
              <span>Pixel Streaming</span>
            </div>
            <div className="w-px h-3 bg-slate-600" />
            <span>Unreal Engine 5.4</span>
            <div className="w-px h-3 bg-slate-600" />
            <span>Lumen + Nanite</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-[#8AFD81] rounded-full animate-pulse" />
            <span className="text-[#8AFD81] font-semibold">Stream OK</span>
          </div>
        </div>
      </div>
    </>
  );
}

