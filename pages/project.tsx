/**
 * Project Page - Cinematic Trailer Style
 * Qatar Strategic Bitcoin Reserve
 * Route: /project
 */

import Head from 'next/head';
import Link from 'next/link';
import {
  Leaf,
  ArrowRight,
  Play,
  BarChart3,
} from 'lucide-react';

export default function ProjectPage() {
  return (
    <>
      <Head>
        <title>Qatar Strategic Bitcoin Reserve</title>
        <meta name="description" content="Qatar Strategic Bitcoin Reserve - 100% Green Energy" />
      </Head>

      {/* Full Screen - Single Page */}
      <div className="h-screen w-screen overflow-hidden relative bg-slate-900">
        
        {/* Background Video */}
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster="/IMG_0700.JPG"
          >
            <source src="/video/facility.mp4" type="video/mp4" />
          </video>
          <div 
            className="absolute inset-0 bg-[url('/IMG_0700.JPG')] bg-cover bg-center"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-slate-900/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/30" />
        </div>

        {/* Content - Centered */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
          
          {/* Top Badge */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2">
            <span className="px-5 py-2.5 bg-black/30 text-white/80 rounded-full text-[11px] font-medium uppercase tracking-[0.3em] border border-white/10 backdrop-blur-md">
              Qatar Vision 2030
            </span>
          </div>

          {/* Main Title */}
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-8xl font-bold tracking-tight leading-[1.1] mb-6">
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, #ffffff, #e8d0d4, #d4a8b0, #b8707c, #8A1538)' }}>
                Qatar Bitcoin
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80]">
                Strategic Reserve
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-slate-400 max-w-xl mx-auto">
              100MW Sovereign Mining Facility
            </p>
          </div>

          {/* 3 Key Points - Horizontal */}
          <div className="flex items-center justify-center gap-12 lg:gap-20 mb-16">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-white mb-1">48</div>
              <div className="text-xs text-slate-500 uppercase tracking-widest">Containers</div>
            </div>
            <div className="w-px h-12 bg-slate-700" />
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] to-[#4ade80] mb-1">100%</div>
              <div className="text-xs text-slate-500 uppercase tracking-widest">Green Energy</div>
            </div>
            <div className="w-px h-12 bg-slate-700" />
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-white mb-1">2025</div>
              <div className="text-xs text-slate-500 uppercase tracking-widest">Launch</div>
            </div>
          </div>

          {/* CTA Links */}
          <div className="flex items-center gap-6">
            <Link 
              href="/"
              className="group flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#8AFD81]/30 rounded-full backdrop-blur-sm transition-all duration-300"
            >
              <BarChart3 className="w-4 h-4 text-[#8AFD81]" />
              <span className="text-sm text-white font-medium">Dashboard</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#8AFD81] group-hover:translate-x-1 transition-all" />
            </Link>

            <Link 
              href="/unreal-viewer"
              className="group flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 rounded-full backdrop-blur-sm transition-all duration-300"
            >
              <Play className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-white font-medium">3D Tour</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>

          {/* Bottom - Zero Emissions */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[#8AFD81]/60">
            <Leaf className="w-4 h-4" />
            <span className="text-xs uppercase tracking-[0.2em]">Zero CO₂ Emissions</span>
          </div>

        </div>

        {/* Bottom Right - Hearst Logo */}
        <div className="absolute bottom-8 right-8 text-xs text-slate-600 uppercase tracking-[0.2em]">
          Hearst Corporation
        </div>

      </div>
    </>
  );
}

