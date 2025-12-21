/**
 * Bitcoin Command Center - 5 Professional Layouts
 * Hearst Qatar - Strategic Bitcoin Reserve Monitoring
 * Style cohérent avec le dashboard principal
 */

import Head from 'next/head';
import Link from 'next/link';
import { CandlestickChart, AccumulationChart, PortfolioChart } from '../components/charts';
import { 
  ArrowLeft, 
  BarChart3, 
  TrendingUp,
  Wallet,
  LineChart,
  LayoutGrid,
  Layers,
  Activity,
} from 'lucide-react';

// ============================================================================
// DATA - Bitcoin Price Action OHLC
// ============================================================================
const candlestickData = [
  { date: '1 Jan', open: 42000, high: 43250, low: 41500, close: 42800, volume: 45000 },
  { date: '2 Jan', open: 42800, high: 44100, low: 42200, close: 43500, volume: 52000 },
  { date: '3 Jan', open: 43500, high: 44800, low: 43000, close: 44200, volume: 48000 },
  { date: '4 Jan', open: 44200, high: 45500, low: 43800, close: 44800, volume: 55000 },
  { date: '5 Jan', open: 44800, high: 45200, low: 43500, close: 43800, volume: 42000 },
  { date: '6 Fév', open: 43800, high: 44500, low: 43200, close: 44100, volume: 38000 },
  { date: '7 Fév', open: 44100, high: 45800, low: 43900, close: 45500, volume: 61000 },
  { date: '8 Fév', open: 45500, high: 46200, low: 44800, close: 45200, volume: 47000 },
  { date: '9 Fév', open: 45200, high: 46500, low: 44500, close: 46000, volume: 53000 },
  { date: '10 Fév', open: 46000, high: 47200, low: 45200, close: 46800, volume: 58000 },
  { date: '11 Mar', open: 46800, high: 48000, low: 46000, close: 47500, volume: 62000 },
  { date: '12 Mar', open: 47500, high: 48500, low: 46800, close: 47200, volume: 45000 },
  { date: '13 Mar', open: 47200, high: 47800, low: 45500, close: 46000, volume: 51000 },
  { date: '14 Mar', open: 46000, high: 46800, low: 44800, close: 45200, volume: 44000 },
  { date: '15 Mar', open: 45200, high: 46500, low: 44500, close: 46200, volume: 49000 },
  { date: '16 Avr', open: 46200, high: 47800, low: 45800, close: 47500, volume: 56000 },
  { date: '17 Avr', open: 47500, high: 49000, low: 47000, close: 48500, volume: 63000 },
  { date: '18 Avr', open: 48500, high: 50200, low: 48000, close: 49800, volume: 71000 },
  { date: '19 Avr', open: 49800, high: 51500, low: 49200, close: 50800, volume: 68000 },
  { date: '20 Avr', open: 50800, high: 52000, low: 49500, close: 49800, volume: 55000 },
];

// ============================================================================
// DATA - BTC Accumulation
// ============================================================================
const accumulationData = [
  { date: 'Jan', accumulated: 125.5, added: 12.5 },
  { date: 'Fév', accumulated: 138.2, added: 12.7 },
  { date: 'Mar', accumulated: 145.8, added: 7.6 },
  { date: 'Avr', accumulated: 158.3, added: 12.5 },
  { date: 'Mai', accumulated: 165.9, added: 7.6 },
  { date: 'Juin', accumulated: 172.4, added: 6.5 },
  { date: 'Juil', accumulated: 180.1, added: 7.7 },
  { date: 'Août', accumulated: 188.5, added: 8.4 },
  { date: 'Sept', accumulated: 195.2, added: 6.7 },
  { date: 'Oct', accumulated: 205.8, added: 10.6 },
  { date: 'Nov', accumulated: 212.4, added: 6.6 },
  { date: 'Déc', accumulated: 220.5, added: 8.1 },
];

// ============================================================================
// DATA - Portfolio Value
// ============================================================================
const portfolioData = [
  { date: 'Jan', value: 5200000, invested: 4800000 },
  { date: 'Fév', value: 5800000, invested: 5100000 },
  { date: 'Mar', value: 6500000, invested: 5400000 },
  { date: 'Avr', value: 7200000, invested: 5800000 },
  { date: 'Mai', value: 7800000, invested: 6200000 },
  { date: 'Juin', value: 8200000, invested: 6600000 },
  { date: 'Juil', value: 9100000, invested: 7000000 },
  { date: 'Août', value: 10500000, invested: 7500000 },
  { date: 'Sept', value: 11200000, invested: 8000000 },
  { date: 'Oct', value: 13800000, invested: 8500000 },
  { date: 'Nov', value: 16200000, invested: 9000000 },
  { date: 'Déc', value: 22000000, invested: 12000000 },
];

// ============================================================================
// LAYOUT 1 : Classique (3 colonnes égales)
// ============================================================================
const Layout1 = () => (
  <div className="rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300">
    {/* Header */}
    <div className="bg-slate-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="px-3 py-1.5 bg-slate-600/50 rounded-full border border-slate-500/50">
          <span className="text-slate-300 text-xs font-bold">LAYOUT 1</span>
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Classique - 3 Colonnes Égales</h2>
          <p className="text-xs text-slate-400">BTC Reserve | Price Action | Portfolio USD</p>
        </div>
      </div>
    </div>
    
    {/* Body - 3 equal columns */}
    <div className="bg-white p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Accumulation Chart */}
        <div>
          <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">BTC Reserve</h3>
          <AccumulationChart 
            data={accumulationData}
            height={320}
            showBars={true}
            showMA={true}
            maPeriods={[3, 6]}
            targetValue={300}
            unit="BTC"
            theme="light"
          />
        </div>

        {/* Candlestick Chart */}
        <div>
          <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Price Action</h3>
          <CandlestickChart 
            data={candlestickData}
            height={320}
            showVolume={true}
            showMA={true}
            maPeriods={[7, 20]}
            breakevenPrice={38500}
            unit="$"
            theme="light"
          />
        </div>

        {/* Portfolio Chart */}
        <div>
          <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Portfolio USD</h3>
          <PortfolioChart 
            data={portfolioData}
            height={320}
            showBollinger={true}
            showROI={true}
            showInvested={true}
            bollingerPeriod={5}
            unit="$"
            theme="light"
          />
        </div>
      </div>
    </div>
  </div>
);

// ============================================================================
// LAYOUT 2 : Focus Centre (graphique principal large)
// ============================================================================
const Layout2 = () => (
  <div className="rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300">
    {/* Header */}
    <div className="bg-slate-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="px-3 py-1.5 bg-slate-600/50 rounded-full border border-slate-500/50">
          <span className="text-slate-300 text-xs font-bold">LAYOUT 2</span>
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Focus Centre - Prix Principal</h2>
          <p className="text-xs text-slate-400">Price Action au centre (60%), panneaux latéraux (20% chacun)</p>
        </div>
      </div>
    </div>
    
    {/* Body - Focus center */}
    <div className="bg-white p-6">
      <div className="grid grid-cols-12 gap-6">
        {/* Left - Accumulation (smaller) */}
        <div className="col-span-12 lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">BTC Reserve</h3>
          <AccumulationChart 
            data={accumulationData}
            height={400}
            showBars={false}
            showMA={true}
            maPeriods={[3]}
            targetValue={300}
            unit="BTC"
            theme="light"
          />
        </div>

        {/* Center - Candlestick (large) */}
        <div className="col-span-12 lg:col-span-8">
          <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Price Action</h3>
          <CandlestickChart 
            data={candlestickData}
            height={400}
            showVolume={true}
            showMA={true}
            maPeriods={[7, 20]}
            breakevenPrice={38500}
            unit="$"
            theme="light"
          />
        </div>

        {/* Right - Portfolio (smaller) */}
        <div className="col-span-12 lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Portfolio USD</h3>
          <PortfolioChart 
            data={portfolioData}
            height={400}
            showBollinger={false}
            showROI={false}
            showInvested={true}
            unit="$"
            theme="light"
          />
        </div>
      </div>
    </div>
  </div>
);

// ============================================================================
// LAYOUT 3 : Stack Vertical (2 lignes)
// ============================================================================
const Layout3 = () => (
  <div className="rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300">
    {/* Header */}
    <div className="bg-slate-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="px-3 py-1.5 bg-slate-600/50 rounded-full border border-slate-500/50">
          <span className="text-slate-300 text-xs font-bold">LAYOUT 3</span>
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Stack Vertical - 2 Lignes</h2>
          <p className="text-xs text-slate-400">Price Action en haut, BTC & Portfolio en bas</p>
        </div>
      </div>
    </div>
    
    {/* Body - Stacked */}
    <div className="bg-white p-6 space-y-6">
      {/* Top - Full width Candlestick */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Price Action</h3>
        <CandlestickChart 
          data={candlestickData}
          height={350}
          showVolume={true}
          showMA={true}
          maPeriods={[7, 20]}
          breakevenPrice={38500}
          unit="$"
          theme="light"
        />
      </div>

      {/* Bottom - Two charts side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">BTC Reserve</h3>
          <AccumulationChart 
            data={accumulationData}
            height={280}
            showBars={true}
            showMA={true}
            maPeriods={[3, 6]}
            targetValue={300}
            unit="BTC"
            theme="light"
          />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Portfolio USD</h3>
          <PortfolioChart 
            data={portfolioData}
            height={280}
            showBollinger={true}
            showROI={true}
            showInvested={true}
            bollingerPeriod={5}
            unit="$"
            theme="light"
          />
        </div>
      </div>
    </div>
  </div>
);

// ============================================================================
// LAYOUT 4 : Dashboard (grille asymétrique)
// ============================================================================
const Layout4 = () => (
  <div className="rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300">
    {/* Header */}
    <div className="bg-slate-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="px-3 py-1.5 bg-slate-600/50 rounded-full border border-slate-500/50">
          <span className="text-slate-300 text-xs font-bold">LAYOUT 4</span>
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Dashboard - Grille Asymétrique</h2>
          <p className="text-xs text-slate-400">Candlestick + Portfolio à gauche, BTC Reserve + Stats à droite</p>
        </div>
      </div>
    </div>
    
    {/* Body - Asymmetric grid */}
    <div className="bg-white p-6">
      <div className="grid grid-cols-12 gap-6">
        {/* Left side - 8 cols */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Price Action</h3>
            <CandlestickChart 
              data={candlestickData}
              height={280}
              showVolume={true}
              showMA={true}
              maPeriods={[7, 20]}
              breakevenPrice={38500}
              unit="$"
              theme="light"
            />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Portfolio USD</h3>
            <PortfolioChart 
              data={portfolioData}
              height={250}
              showBollinger={true}
              showROI={true}
              showInvested={true}
              bollingerPeriod={5}
              unit="$"
              theme="light"
            />
          </div>
        </div>

        {/* Right side - 4 cols */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">BTC Reserve</h3>
            <AccumulationChart 
              data={accumulationData}
              height={280}
              showBars={true}
              showMA={true}
              maPeriods={[3, 6]}
              targetValue={300}
              unit="BTC"
              theme="light"
            />
          </div>
          
          {/* Stats Panel */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
            <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Statistiques Clés</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Total BTC</span>
                <span className="text-lg font-bold text-[#8AFD81]">220.5 BTC</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Portfolio Value</span>
                <span className="text-lg font-bold text-slate-900">$22M</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">ROI Global</span>
                <span className="text-lg font-bold text-[#8AFD81]">+83.3%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Avg Cost Basis</span>
                <span className="text-lg font-bold text-slate-900">$42,850</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Current Price</span>
                <span className="text-lg font-bold text-slate-900">$49,800</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Unrealized P&L</span>
                <span className="text-lg font-bold text-[#8AFD81]">+$10M</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ============================================================================
// LAYOUT 5 : Terminal Pro (sidebar + main) - RECOMMANDÉ
// ============================================================================
const Layout5 = () => (
  <div className="rounded-2xl overflow-hidden border-2 border-[#8AFD81]/50 hover:shadow-xl hover:shadow-[#8AFD81]/10 transition-all duration-300">
    {/* Header */}
    <div className="bg-slate-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="px-3 py-1.5 bg-[#8AFD81]/20 rounded-full border border-[#8AFD81]/40 flex items-center gap-2">
          <span className="text-[#8AFD81] text-xs font-bold">LAYOUT 5</span>
          <span className="text-[8px] bg-[#8AFD81] text-slate-900 px-1.5 py-0.5 rounded font-bold">RECOMMANDÉ</span>
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Terminal Pro - Bloomberg Style</h2>
          <p className="text-xs text-slate-400">Stats sidebar + Candlestick main + Portfolio bottom</p>
        </div>
      </div>
    </div>
    
    {/* Body - Terminal layout */}
    <div className="bg-white p-6">
      <div className="grid grid-cols-12 gap-6">
        {/* Left sidebar - Stats + Mini charts */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          {/* Quick Stats */}
          <div className="bg-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-bold text-[#8AFD81] mb-3 uppercase tracking-wider">Quick Stats</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">BTC Holdings</span>
                  <span className="font-bold text-white">220.5</span>
                </div>
                <div className="mt-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-[#8AFD81] rounded-full" style={{ width: '73%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Portfolio</span>
                  <span className="font-bold text-white">$22M</span>
                </div>
                <div className="mt-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-400 rounded-full" style={{ width: '88%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">ROI</span>
                  <span className="font-bold text-[#8AFD81]">+83.3%</span>
                </div>
                <div className="mt-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-[#8AFD81] rounded-full" style={{ width: '83%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* BTC Reserve Chart */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">BTC Accumulation</h3>
            <AccumulationChart 
              data={accumulationData}
              height={200}
              showBars={false}
              showMA={true}
              maPeriods={[3]}
              targetValue={300}
              unit="BTC"
              theme="light"
            />
          </div>

          {/* Portfolio Mini Chart */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Portfolio Growth</h3>
            <PortfolioChart 
              data={portfolioData}
              height={180}
              showBollinger={false}
              showROI={false}
              showInvested={true}
              unit="$"
              theme="light"
            />
          </div>
        </div>

        {/* Main area - Candlestick + Full Portfolio */}
        <div className="col-span-12 lg:col-span-9 space-y-4">
          {/* Main Candlestick */}
          <div>
            <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Bitcoin Price Action</h3>
            <CandlestickChart 
              data={candlestickData}
              height={380}
              showVolume={true}
              showMA={true}
              maPeriods={[7, 20]}
              breakevenPrice={38500}
              unit="$"
              theme="light"
            />
          </div>

          {/* Bottom Portfolio */}
          <div>
            <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Portfolio Performance</h3>
            <PortfolioChart 
              data={portfolioData}
              height={280}
              showBollinger={true}
              showROI={true}
              showInvested={true}
              bollingerPeriod={5}
              unit="$"
              theme="light"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function BitcoinCommandCenter() {
  return (
    <>
      <Head>
        <title>Bitcoin Command Center - Hearst Qatar</title>
      </Head>

      <div className="min-h-screen bg-slate-50 bg-grid-slate-100 p-6 lg:p-8">
        <div className="max-w-[1600px] mx-auto">
          
          {/* BENTO GRID CONTAINER */}
          <div className="grid grid-cols-12 gap-4">
            
            {/* 1. HERO HEADER - Full Width */}
            <div className="col-span-12 relative h-[200px] rounded-2xl overflow-hidden bg-slate-900 animate-fade-in-up">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900" />
              <div className="absolute inset-0 bg-[url('/Image%2012-12-2025%20a%CC%80%206.58%E2%80%AFPM.JPG')] bg-cover opacity-20" style={{ backgroundPosition: '30% center' }} />

              {/* Content */}
              <div className="absolute inset-0 z-20">
                {/* Top Left - Badges */}
                <div className="absolute top-6 left-8 lg:left-10 flex items-center gap-3">
                  <span className="px-3 py-1.5 bg-[#8AFD81] text-slate-900 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    Command Center
                  </span>
                  <span className="px-3 py-1.5 bg-white/10 text-white/90 rounded-full text-[10px] font-medium backdrop-blur-md border border-white/10 uppercase tracking-widest">
                    5 Layouts Pro
                  </span>
                </div>

                {/* Bottom Left - Title */}
                <div className="absolute bottom-6 left-8 lg:left-10">
                  <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
                    Bitcoin <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80]">Command Center</span>
                  </h1>
                </div>

                {/* Bottom Right - Back Link */}
                <div className="absolute bottom-6 right-8 lg:right-10">
                  <Link 
                    href="/" 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-all duration-300 border border-slate-600"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Dashboard</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Section Title - Layout 1 */}
            <div className="col-span-12 flex items-center gap-4 mt-6 mb-2">
              <LayoutGrid className="w-6 h-6 text-[#8AFD81]" strokeWidth={1.5} />
              <h2 className="text-2xl font-bold text-slate-900">Layout 1 - Classique</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent" />
            </div>

            {/* Layout 1 */}
            <div className="col-span-12 animate-fade-in-up delay-100">
              <Layout1 />
            </div>

            {/* Section Title - Layout 2 */}
            <div className="col-span-12 flex items-center gap-4 mt-6 mb-2">
              <BarChart3 className="w-6 h-6 text-[#8AFD81]" strokeWidth={1.5} />
              <h2 className="text-2xl font-bold text-slate-900">Layout 2 - Focus Centre</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent" />
            </div>

            {/* Layout 2 */}
            <div className="col-span-12 animate-fade-in-up delay-100">
              <Layout2 />
            </div>

            {/* Section Title - Layout 3 */}
            <div className="col-span-12 flex items-center gap-4 mt-6 mb-2">
              <Layers className="w-6 h-6 text-[#8AFD81]" strokeWidth={1.5} />
              <h2 className="text-2xl font-bold text-slate-900">Layout 3 - Stack Vertical</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent" />
            </div>

            {/* Layout 3 */}
            <div className="col-span-12 animate-fade-in-up delay-100">
              <Layout3 />
            </div>

            {/* Section Title - Layout 4 */}
            <div className="col-span-12 flex items-center gap-4 mt-6 mb-2">
              <LineChart className="w-6 h-6 text-[#8AFD81]" strokeWidth={1.5} />
              <h2 className="text-2xl font-bold text-slate-900">Layout 4 - Dashboard</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent" />
            </div>

            {/* Layout 4 */}
            <div className="col-span-12 animate-fade-in-up delay-100">
              <Layout4 />
            </div>

            {/* Section Title - Layout 5 */}
            <div className="col-span-12 flex items-center gap-4 mt-6 mb-2">
              <Activity className="w-6 h-6 text-[#8AFD81]" strokeWidth={1.5} />
              <h2 className="text-2xl font-bold text-slate-900">Layout 5 - Terminal Pro</h2>
              <span className="px-2 py-1 bg-[#8AFD81]/20 text-[#8AFD81] text-xs font-bold rounded-full border border-[#8AFD81]/30">RECOMMANDÉ</span>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent" />
            </div>

            {/* Layout 5 */}
            <div className="col-span-12 animate-fade-in-up delay-100">
              <Layout5 />
            </div>

            {/* Summary Stats */}
            <div className="col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-[#8AFD81]/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8AFD81]/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#8AFD81]/20 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-[#8AFD81]" />
                  </div>
                </div>
                <p className="text-sm text-slate-500 mb-1">Total BTC</p>
                <p className="text-2xl font-bold text-slate-900">220.5 BTC</p>
                <p className="text-xs mt-1 text-[#8AFD81] font-medium">73% of target</p>
              </div>
              
              <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-[#8AFD81]/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8AFD81]/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-600/20 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-slate-600" />
                  </div>
                </div>
                <p className="text-sm text-slate-500 mb-1">Portfolio Value</p>
                <p className="text-2xl font-bold text-slate-900">$22M</p>
                <p className="text-xs mt-1 text-slate-500">Current valuation</p>
              </div>
              
              <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-[#8AFD81]/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8AFD81]/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#8AFD81]/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-[#8AFD81]" />
                  </div>
                </div>
                <p className="text-sm text-slate-500 mb-1">ROI Global</p>
                <p className="text-2xl font-bold text-slate-900">+83.3%</p>
                <p className="text-xs mt-1 text-[#8AFD81] font-medium">Since inception</p>
              </div>
              
              <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-[#8AFD81]/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8AFD81]/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-600/20 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-slate-600" />
                  </div>
                </div>
                <p className="text-sm text-slate-500 mb-1">Unrealized P&L</p>
                <p className="text-2xl font-bold text-slate-900">+$10M</p>
                <p className="text-xs mt-1 text-slate-500">vs invested</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
