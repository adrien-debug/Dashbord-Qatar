import Head from 'next/head';
import Link from 'next/link';
import { CandlestickChart } from '../components/charts';
import { formatNumber } from '../utils/formatNumber';
import {
  mockStrategicReserve,
} from '../lib/mock-mining';
import {
  Wallet,
  DollarSign,
  Activity,
  BarChart3,
  ChevronUp,
  ArrowLeft,
  TrendingUp,
  Target,
  Zap,
} from 'lucide-react';

// Data for Bitcoin Price Action OHLC Chart
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

// Mini data for sparklines
const sparklineData = [42, 44, 43, 46, 48, 47, 50, 52, 51, 54, 56, 58, 57, 60, 62];
const portfolioSparkline = [18, 19, 18.5, 20, 21, 20.5, 22, 23, 22.5, 24, 25, 26, 25.5, 27, 28];

// ============================================================================
// PROPOSITION 1 : Sparklines Élégantes
// ============================================================================
const Proposition1 = () => (
  <div className="rounded-2xl overflow-hidden border border-slate-200 mb-8">
    {/* Header */}
    <div className="bg-slate-900 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 bg-amber-500/20 rounded-full border border-amber-500/40">
            <span className="text-amber-400 text-xs font-bold">PROPOSITION 1</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Sparklines Élégantes</h2>
            <p className="text-xs text-slate-400">Style minimaliste, épuré, professionnel</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-2 bg-[#8AFD81]/15 rounded-xl border border-[#8AFD81]/30">
            <TrendingUp className="w-4 h-4 text-[#8AFD81]" />
            <span className="text-sm font-bold text-[#8AFD81]">+38.5%</span>
          </div>
        </div>
      </div>
    </div>
    
    {/* Body */}
    <div className="bg-white p-6">
      <div className="grid grid-cols-12 gap-6">
        
        {/* LEFT - Sparkline BTC */}
        <div className="col-span-12 lg:col-span-3">
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="w-4 h-4 text-[#8AFD81]" />
            <span className="text-xs font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] to-[#4ade80]">
              BTC Reserve
            </span>
          </div>
          
          <div className="flex items-end gap-2 mb-1">
            <span className="text-3xl font-bold text-slate-900 tabular-nums">{mockStrategicReserve.totalBTC}</span>
            <span className="text-lg text-slate-400 pb-0.5">BTC</span>
          </div>
          <div className="flex items-center gap-1 mb-4">
            <ChevronUp className="w-4 h-4 text-[#8AFD81]" />
            <span className="text-sm font-semibold text-[#8AFD81]">+4.2%</span>
          </div>

          {/* Sparkline SVG */}
          <div className="h-16 mb-4">
            <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
              <defs>
                <linearGradient id="spark1" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8AFD81" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#8AFD81" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path 
                d={`M0,${60 - sparklineData[0]} ${sparklineData.map((v, i) => `L${i * (200 / (sparklineData.length - 1))},${60 - v}`).join(' ')} L200,60 L0,60 Z`}
                fill="url(#spark1)"
              />
              <path 
                d={`M0,${60 - sparklineData[0]} ${sparklineData.map((v, i) => `L${i * (200 / (sparklineData.length - 1))},${60 - v}`).join(' ')}`}
                fill="none"
                stroke="#8AFD81"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="200" cy={60 - sparklineData[sparklineData.length - 1]} r="4" fill="#8AFD81" />
            </svg>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Monthly</span><span className="font-semibold text-slate-900">+{mockStrategicReserve.monthlyAccumulation} BTC</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Target</span><span className="font-semibold text-slate-900">{formatNumber(mockStrategicReserve.projectedYearEnd)} BTC</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Avg Cost</span><span className="font-semibold text-slate-900">$42,850</span></div>
          </div>
        </div>

        {/* CENTER - Chart */}
        <div className="col-span-12 lg:col-span-6">
          <div className="rounded-xl border border-slate-200 overflow-hidden">
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
        </div>

        {/* RIGHT - Sparkline Portfolio */}
        <div className="col-span-12 lg:col-span-3">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-4 h-4 text-[#8AFD81]" />
            <span className="text-xs font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] to-[#4ade80]">
              Portfolio USD
            </span>
          </div>
          
          <div className="flex items-end gap-2 mb-1">
            <span className="text-3xl font-bold text-slate-900 tabular-nums">${(mockStrategicReserve.currentValue / 1000000).toFixed(0)}</span>
            <span className="text-lg text-slate-400 pb-0.5">M</span>
          </div>
          <div className="flex items-center gap-1 mb-4">
            <ChevronUp className="w-4 h-4 text-[#8AFD81]" />
            <span className="text-sm font-semibold text-[#8AFD81]">+4.2%</span>
          </div>

          {/* Sparkline SVG with dots */}
          <div className="h-16 mb-4">
            <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
              <defs>
                <linearGradient id="spark1b" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8AFD81" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#8AFD81" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path 
                d={`M0,${60 - portfolioSparkline[0] * 2} ${portfolioSparkline.map((v, i) => `L${i * (200 / (portfolioSparkline.length - 1))},${60 - v * 2}`).join(' ')} L200,60 L0,60 Z`}
                fill="url(#spark1b)"
              />
              <path 
                d={`M0,${60 - portfolioSparkline[0] * 2} ${portfolioSparkline.map((v, i) => `L${i * (200 / (portfolioSparkline.length - 1))},${60 - v * 2}`).join(' ')}`}
                fill="none"
                stroke="#8AFD81"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {portfolioSparkline.filter((_, i) => i % 3 === 0).map((v, i) => (
                <circle key={i} cx={i * 3 * (200 / (portfolioSparkline.length - 1))} cy={60 - v * 2} r="3" fill="#8AFD81" />
              ))}
            </svg>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">ROI</span><span className="font-semibold text-[#8AFD81]">+85%</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Growth</span><span className="font-semibold text-[#8AFD81]">+72%</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Target</span><span className="font-semibold text-slate-900">68%</span></div>
          </div>
        </div>

      </div>
    </div>
  </div>
);

// ============================================================================
// PROPOSITION 2 : Bar Charts Animés
// ============================================================================
const Proposition2 = () => (
  <div className="rounded-2xl overflow-hidden border border-slate-200 mb-8">
    {/* Header */}
    <div className="bg-slate-900 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 bg-blue-500/20 rounded-full border border-blue-500/40">
            <span className="text-blue-400 text-xs font-bold">PROPOSITION 2</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Bar Charts Animés</h2>
            <p className="text-xs text-slate-400">Style dynamique, interactif avec hover effects</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-2 bg-[#8AFD81]/15 rounded-xl border border-[#8AFD81]/30">
            <TrendingUp className="w-4 h-4 text-[#8AFD81]" />
            <span className="text-sm font-bold text-[#8AFD81]">+38.5%</span>
          </div>
        </div>
      </div>
    </div>
    
    {/* Body */}
    <div className="bg-white p-6">
      <div className="grid grid-cols-12 gap-6">
        
        {/* LEFT - Vertical Bar Chart */}
        <div className="col-span-12 lg:col-span-3">
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="w-4 h-4 text-[#8AFD81]" />
            <span className="text-xs font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] to-[#4ade80]">
              BTC Reserve
            </span>
          </div>
          
          <div className="flex items-end gap-2 mb-1">
            <span className="text-3xl font-bold text-slate-900 tabular-nums">{mockStrategicReserve.totalBTC}</span>
            <span className="text-lg text-slate-400 pb-0.5">BTC</span>
          </div>
          <div className="flex items-center gap-1 mb-4">
            <ChevronUp className="w-4 h-4 text-[#8AFD81]" />
            <span className="text-sm font-semibold text-[#8AFD81]">+4.2%</span>
          </div>

          {/* Animated Bar Chart */}
          <div className="flex items-end gap-1 h-20 mb-4 p-2 bg-slate-50 rounded-xl">
            {[35, 42, 38, 55, 48, 62, 58, 75, 68, 82, 78, 90].map((h, i) => (
              <div 
                key={i}
                className="flex-1 bg-gradient-to-t from-[#8AFD81]/40 to-[#8AFD81] rounded-t hover:from-[#4ade80] hover:to-[#22c55e] transition-all duration-300 cursor-pointer hover:scale-y-110 origin-bottom"
                style={{ height: `${h}%` }}
                title={`Month ${i + 1}: ${(h / 10).toFixed(1)} BTC`}
              />
            ))}
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Monthly</span><span className="font-semibold text-slate-900">+{mockStrategicReserve.monthlyAccumulation} BTC</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Target</span><span className="font-semibold text-slate-900">{formatNumber(mockStrategicReserve.projectedYearEnd)} BTC</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Avg Cost</span><span className="font-semibold text-slate-900">$42,850</span></div>
          </div>
        </div>

        {/* CENTER - Chart */}
        <div className="col-span-12 lg:col-span-6">
          <div className="rounded-xl border border-slate-200 overflow-hidden">
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
        </div>

        {/* RIGHT - Horizontal Bar Chart */}
        <div className="col-span-12 lg:col-span-3">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-4 h-4 text-[#8AFD81]" />
            <span className="text-xs font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] to-[#4ade80]">
              Portfolio USD
            </span>
          </div>
          
          <div className="flex items-end gap-2 mb-1">
            <span className="text-3xl font-bold text-slate-900 tabular-nums">${(mockStrategicReserve.currentValue / 1000000).toFixed(0)}</span>
            <span className="text-lg text-slate-400 pb-0.5">M</span>
          </div>
          <div className="flex items-center gap-1 mb-4">
            <ChevronUp className="w-4 h-4 text-[#8AFD81]" />
            <span className="text-sm font-semibold text-[#8AFD81]">+4.2%</span>
          </div>

          {/* Horizontal Bars */}
          <div className="space-y-3 mb-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-500">ROI</span>
                <span className="font-bold text-[#8AFD81]">+85%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#8AFD81] to-[#4ade80] rounded-full transition-all duration-500 hover:brightness-110" style={{ width: '85%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-500">Growth</span>
                <span className="font-bold text-[#8AFD81]">+72%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#8AFD81] to-[#4ade80] rounded-full transition-all duration-500 hover:brightness-110" style={{ width: '72%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-500">Target Progress</span>
                <span className="font-bold text-slate-700">68%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-slate-400 to-slate-500 rounded-full transition-all duration-500 hover:brightness-110" style={{ width: '68%' }} />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <div className="flex justify-between text-sm"><span className="text-slate-500">Valuation</span><span className="font-semibold text-slate-900">$22M</span></div>
          </div>
        </div>

      </div>
    </div>
  </div>
);

// ============================================================================
// PROPOSITION 3 : Gauges Circulaires
// ============================================================================
const Proposition3 = () => (
  <div className="rounded-2xl overflow-hidden border border-slate-200 mb-8">
    {/* Header */}
    <div className="bg-slate-900 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 bg-purple-500/20 rounded-full border border-purple-500/40">
            <span className="text-purple-400 text-xs font-bold">PROPOSITION 3</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Gauges Circulaires</h2>
            <p className="text-xs text-slate-400">Style dashboard exécutif, KPI-focused</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-2 bg-[#8AFD81]/15 rounded-xl border border-[#8AFD81]/30">
            <TrendingUp className="w-4 h-4 text-[#8AFD81]" />
            <span className="text-sm font-bold text-[#8AFD81]">+38.5%</span>
          </div>
        </div>
      </div>
    </div>
    
    {/* Body */}
    <div className="bg-white p-6">
      <div className="grid grid-cols-12 gap-6">
        
        {/* LEFT - Gauge BTC */}
        <div className="col-span-12 lg:col-span-3">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-[#8AFD81]" />
            <span className="text-xs font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] to-[#4ade80]">
              BTC Progress
            </span>
          </div>

          {/* Circular Gauge */}
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="8" />
              <circle 
                cx="50" cy="50" r="40" 
                fill="none" 
                stroke="url(#gaugeGradient1)" 
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(mockStrategicReserve.totalBTC / mockStrategicReserve.projectedYearEnd) * 251.2} 251.2`}
              />
              <defs>
                <linearGradient id="gaugeGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8AFD81" />
                  <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-slate-900">{mockStrategicReserve.totalBTC}</span>
              <span className="text-xs text-slate-500">of {mockStrategicReserve.projectedYearEnd}</span>
            </div>
          </div>

          <div className="text-center mb-4">
            <span className="text-sm text-slate-500">Year-End Target Progress</span>
            <div className="text-lg font-bold text-[#8AFD81]">{((mockStrategicReserve.totalBTC / mockStrategicReserve.projectedYearEnd) * 100).toFixed(1)}%</div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Monthly</span><span className="font-semibold text-slate-900">+{mockStrategicReserve.monthlyAccumulation} BTC</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Avg Cost</span><span className="font-semibold text-slate-900">$42,850</span></div>
          </div>
        </div>

        {/* CENTER - Chart */}
        <div className="col-span-12 lg:col-span-6">
          <div className="rounded-xl border border-slate-200 overflow-hidden">
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
        </div>

        {/* RIGHT - Gauge ROI */}
        <div className="col-span-12 lg:col-span-3">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-[#8AFD81]" />
            <span className="text-xs font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] to-[#4ade80]">
              ROI Performance
            </span>
          </div>

          {/* Circular Gauge ROI */}
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="8" />
              <circle 
                cx="50" cy="50" r="40" 
                fill="none" 
                stroke="url(#gaugeGradient2)" 
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${0.85 * 251.2} 251.2`}
              />
              <defs>
                <linearGradient id="gaugeGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8AFD81" />
                  <stop offset="100%" stopColor="#4ade80" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-[#8AFD81]">+85%</span>
              <span className="text-xs text-slate-500">ROI</span>
            </div>
          </div>

          <div className="text-center mb-4">
            <span className="text-sm text-slate-500">Portfolio Value</span>
            <div className="text-lg font-bold text-slate-900">${(mockStrategicReserve.currentValue / 1000000).toFixed(0)}M</div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Growth</span><span className="font-semibold text-[#8AFD81]">+72%</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Target</span><span className="font-semibold text-slate-900">68%</span></div>
          </div>
        </div>

      </div>
    </div>
  </div>
);

// ============================================================================
// PROPOSITION 4 : Area Charts Pro
// ============================================================================
const Proposition4 = () => (
  <div className="rounded-2xl overflow-hidden border border-slate-200 mb-8">
    {/* Header */}
    <div className="bg-slate-900 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 bg-teal-500/20 rounded-full border border-teal-500/40">
            <span className="text-teal-400 text-xs font-bold">PROPOSITION 4</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Area Charts Pro</h2>
            <p className="text-xs text-slate-400">Style analytique, data-driven avec grilles</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-2 bg-[#8AFD81]/15 rounded-xl border border-[#8AFD81]/30">
            <TrendingUp className="w-4 h-4 text-[#8AFD81]" />
            <span className="text-sm font-bold text-[#8AFD81]">+38.5%</span>
          </div>
        </div>
      </div>
    </div>
    
    {/* Body */}
    <div className="bg-white p-6">
      <div className="grid grid-cols-12 gap-6">
        
        {/* LEFT - Area Chart with Grid */}
        <div className="col-span-12 lg:col-span-3">
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="w-4 h-4 text-[#8AFD81]" />
            <span className="text-xs font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] to-[#4ade80]">
              BTC Accumulation
            </span>
          </div>
          
          <div className="flex items-end gap-2 mb-1">
            <span className="text-3xl font-bold text-slate-900 tabular-nums">{mockStrategicReserve.totalBTC}</span>
            <span className="text-lg text-slate-400 pb-0.5">BTC</span>
          </div>
          <div className="flex items-center gap-1 mb-4">
            <ChevronUp className="w-4 h-4 text-[#8AFD81]" />
            <span className="text-sm font-semibold text-[#8AFD81]">+4.2%</span>
          </div>

          {/* Area Chart with Grid */}
          <div className="h-24 mb-4 p-2 bg-slate-50 rounded-xl border border-slate-100 relative">
            {/* Grid lines */}
            <div className="absolute inset-2 flex flex-col justify-between pointer-events-none">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="border-t border-slate-200 border-dashed" />
              ))}
            </div>
            <svg className="w-full h-full relative z-10" viewBox="0 0 200 80" preserveAspectRatio="none">
              <defs>
                <linearGradient id="area4a" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8AFD81" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#8AFD81" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              <path 
                d="M0,70 L15,65 L30,60 L45,55 L60,58 L75,50 L90,45 L105,48 L120,40 L135,35 L150,38 L165,30 L180,25 L200,20 L200,80 L0,80 Z"
                fill="url(#area4a)"
              />
              <path 
                d="M0,70 L15,65 L30,60 L45,55 L60,58 L75,50 L90,45 L105,48 L120,40 L135,35 L150,38 L165,30 L180,25 L200,20"
                fill="none"
                stroke="#8AFD81"
                strokeWidth="2"
              />
              {/* MA line */}
              <path 
                d="M0,68 L30,62 L60,55 L90,47 L120,42 L150,35 L180,28 L200,22"
                fill="none"
                stroke="#F97316"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
            </svg>
          </div>

          <div className="flex items-center gap-4 text-[10px] mb-3">
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-[#8AFD81]" />
              <span className="text-slate-500">Actual</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-[#F97316]" style={{ borderStyle: 'dashed' }} />
              <span className="text-slate-500">MA7</span>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Monthly</span><span className="font-semibold text-slate-900">+{mockStrategicReserve.monthlyAccumulation} BTC</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Target</span><span className="font-semibold text-slate-900">{formatNumber(mockStrategicReserve.projectedYearEnd)} BTC</span></div>
          </div>
        </div>

        {/* CENTER - Chart */}
        <div className="col-span-12 lg:col-span-6">
          <div className="rounded-xl border border-slate-200 overflow-hidden">
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
        </div>

        {/* RIGHT - Area Chart with Reference Zones */}
        <div className="col-span-12 lg:col-span-3">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-4 h-4 text-[#8AFD81]" />
            <span className="text-xs font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] to-[#4ade80]">
              Portfolio Growth
            </span>
          </div>
          
          <div className="flex items-end gap-2 mb-1">
            <span className="text-3xl font-bold text-slate-900 tabular-nums">${(mockStrategicReserve.currentValue / 1000000).toFixed(0)}</span>
            <span className="text-lg text-slate-400 pb-0.5">M</span>
          </div>
          <div className="flex items-center gap-1 mb-4">
            <ChevronUp className="w-4 h-4 text-[#8AFD81]" />
            <span className="text-sm font-semibold text-[#8AFD81]">+4.2%</span>
          </div>

          {/* Area Chart with Reference Zone */}
          <div className="h-24 mb-4 p-2 bg-slate-50 rounded-xl border border-slate-100 relative">
            {/* Target zone */}
            <div className="absolute top-2 left-2 right-2 h-6 bg-[#8AFD81]/10 border-t border-b border-[#8AFD81]/30 border-dashed" />
            <svg className="w-full h-full relative z-10" viewBox="0 0 200 80" preserveAspectRatio="none">
              <defs>
                <linearGradient id="area4b" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8AFD81" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#8AFD81" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              <path 
                d="M0,75 L20,70 L40,68 L60,60 L80,55 L100,50 L120,45 L140,40 L160,32 L180,28 L200,20 L200,80 L0,80 Z"
                fill="url(#area4b)"
              />
              <path 
                d="M0,75 L20,70 L40,68 L60,60 L80,55 L100,50 L120,45 L140,40 L160,32 L180,28 L200,20"
                fill="none"
                stroke="#8AFD81"
                strokeWidth="2.5"
              />
            </svg>
            <div className="absolute top-1 right-2 text-[9px] text-[#8AFD81] font-medium">Target Zone</div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">ROI</span><span className="font-semibold text-[#8AFD81]">+85%</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Growth</span><span className="font-semibold text-[#8AFD81]">+72%</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Target</span><span className="font-semibold text-slate-900">68%</span></div>
          </div>
        </div>

      </div>
    </div>
  </div>
);

// ============================================================================
// PROPOSITION 5 : Mixed Pro (Recommandé)
// ============================================================================
const Proposition5 = () => (
  <div className="rounded-2xl overflow-hidden border-2 border-[#8AFD81]/50 mb-8 shadow-lg shadow-[#8AFD81]/10">
    {/* Header */}
    <div className="bg-slate-900 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 bg-[#8AFD81]/20 rounded-full border border-[#8AFD81]/40 flex items-center gap-2">
            <span className="text-[#8AFD81] text-xs font-bold">PROPOSITION 5</span>
            <span className="text-[8px] bg-[#8AFD81] text-slate-900 px-1.5 py-0.5 rounded font-bold">RECOMMANDÉ</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Mixed Pro - Bloomberg Style</h2>
            <p className="text-xs text-slate-400">Trading terminal professionnel avec mini OHLC</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-2 bg-[#8AFD81]/15 rounded-xl border border-[#8AFD81]/30">
            <TrendingUp className="w-4 h-4 text-[#8AFD81]" />
            <span className="text-sm font-bold text-[#8AFD81]">+38.5%</span>
          </div>
        </div>
      </div>
    </div>
    
    {/* Body */}
    <div className="bg-white p-6">
      <div className="grid grid-cols-12 gap-6">
        
        {/* LEFT - Mini OHLC */}
        <div className="col-span-12 lg:col-span-3">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-[#8AFD81]" />
            <span className="text-xs font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] to-[#4ade80]">
              BTC Reserve OHLC
            </span>
          </div>
          
          <div className="flex items-end gap-2 mb-1">
            <span className="text-3xl font-bold text-slate-900 tabular-nums">{mockStrategicReserve.totalBTC}</span>
            <span className="text-lg text-slate-400 pb-0.5">BTC</span>
          </div>
          <div className="flex items-center gap-1 mb-4">
            <ChevronUp className="w-4 h-4 text-[#8AFD81]" />
            <span className="text-sm font-semibold text-[#8AFD81]">+4.2%</span>
          </div>

          {/* Mini Candlestick */}
          <div className="h-24 mb-4 p-2 bg-slate-900 rounded-xl relative">
            <svg className="w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none">
              {/* Grid */}
              {[20, 40, 60].map(y => (
                <line key={y} x1="0" y1={y} x2="200" y2={y} stroke="#334155" strokeWidth="0.5" />
              ))}
              {/* Mini candles */}
              {[
                { x: 10, o: 55, h: 50, l: 60, c: 52 },
                { x: 25, o: 52, h: 45, l: 55, c: 48 },
                { x: 40, o: 48, h: 42, l: 52, c: 50 },
                { x: 55, o: 50, h: 44, l: 55, c: 45 },
                { x: 70, o: 45, h: 38, l: 48, c: 40 },
                { x: 85, o: 40, h: 35, l: 45, c: 42 },
                { x: 100, o: 42, h: 36, l: 46, c: 38 },
                { x: 115, o: 38, h: 32, l: 42, c: 34 },
                { x: 130, o: 34, h: 28, l: 38, c: 30 },
                { x: 145, o: 30, h: 25, l: 35, c: 32 },
                { x: 160, o: 32, h: 26, l: 36, c: 28 },
                { x: 175, o: 28, h: 22, l: 32, c: 24 },
                { x: 190, o: 24, h: 18, l: 28, c: 20 },
              ].map((c, i) => {
                const bullish = c.c < c.o;
                const color = bullish ? '#22C55E' : '#F43F5E';
                return (
                  <g key={i}>
                    <line x1={c.x} y1={c.h} x2={c.x} y2={c.l} stroke={color} strokeWidth="1" />
                    <rect x={c.x - 4} y={Math.min(c.o, c.c)} width="8" height={Math.abs(c.o - c.c) || 1} fill={color} />
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 rounded-lg p-2">
              <div className="text-slate-500">Open</div>
              <div className="font-bold text-slate-900">180.2</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-2">
              <div className="text-slate-500">Close</div>
              <div className="font-bold text-[#8AFD81]">220.5</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-2">
              <div className="text-slate-500">High</div>
              <div className="font-bold text-slate-900">225.8</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-2">
              <div className="text-slate-500">Low</div>
              <div className="font-bold text-slate-900">175.3</div>
            </div>
          </div>
        </div>

        {/* CENTER - Chart */}
        <div className="col-span-12 lg:col-span-6">
          <div className="rounded-xl border border-slate-200 overflow-hidden">
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
        </div>

        {/* RIGHT - Bollinger Style */}
        <div className="col-span-12 lg:col-span-3">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-[#8AFD81]" />
            <span className="text-xs font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] to-[#4ade80]">
              Portfolio Analysis
            </span>
          </div>
          
          <div className="flex items-end gap-2 mb-1">
            <span className="text-3xl font-bold text-slate-900 tabular-nums">${(mockStrategicReserve.currentValue / 1000000).toFixed(0)}</span>
            <span className="text-lg text-slate-400 pb-0.5">M</span>
          </div>
          <div className="flex items-center gap-1 mb-4">
            <ChevronUp className="w-4 h-4 text-[#8AFD81]" />
            <span className="text-sm font-semibold text-[#8AFD81]">+4.2%</span>
          </div>

          {/* Bollinger Style Chart */}
          <div className="h-24 mb-4 p-2 bg-slate-900 rounded-xl relative">
            <svg className="w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none">
              {/* Bollinger bands */}
              <path 
                d="M0,25 Q50,20 100,22 T200,18"
                fill="none"
                stroke="#8AFD81"
                strokeWidth="1"
                strokeOpacity="0.3"
              />
              <path 
                d="M0,55 Q50,60 100,58 T200,62"
                fill="none"
                stroke="#8AFD81"
                strokeWidth="1"
                strokeOpacity="0.3"
              />
              {/* Fill between */}
              <path 
                d="M0,25 Q50,20 100,22 T200,18 L200,62 Q150,58 100,58 T0,55 Z"
                fill="#8AFD81"
                fillOpacity="0.1"
              />
              {/* Center line */}
              <path 
                d="M0,40 L20,42 L40,38 L60,35 L80,38 L100,32 L120,35 L140,30 L160,28 L180,25 L200,22"
                fill="none"
                stroke="#8AFD81"
                strokeWidth="2"
              />
              {/* SMA */}
              <path 
                d="M0,42 L40,40 L80,36 L120,33 L160,28 L200,24"
                fill="none"
                stroke="#F97316"
                strokeWidth="1.5"
                strokeDasharray="3 2"
              />
            </svg>
          </div>

          <div className="flex items-center gap-3 text-[10px] mb-3">
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-[#8AFD81]" />
              <span className="text-slate-500">Price</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-2 bg-[#8AFD81]/20 border border-[#8AFD81]/30" />
              <span className="text-slate-500">Band</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-[#F97316]" />
              <span className="text-slate-500">SMA</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1 text-center">
            <div className="bg-[#8AFD81]/10 rounded-lg p-2">
              <div className="text-[10px] text-slate-500">ROI</div>
              <div className="text-sm font-bold text-[#8AFD81]">+85%</div>
            </div>
            <div className="bg-[#8AFD81]/10 rounded-lg p-2">
              <div className="text-[10px] text-slate-500">Vol</div>
              <div className="text-sm font-bold text-slate-700">12.3%</div>
            </div>
            <div className="bg-[#8AFD81]/10 rounded-lg p-2">
              <div className="text-[10px] text-slate-500">Sharpe</div>
              <div className="text-sm font-bold text-slate-700">2.4</div>
            </div>
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
        <title>Bitcoin Command Center - 5 Propositions</title>
      </Head>

      <div className="min-h-screen bg-slate-100 p-6 lg:p-8">
        <div className="max-w-[1800px] mx-auto">
          
          {/* Back Link */}
          <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#8AFD81] transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </Link>

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Bitcoin Command Center</h1>
            <p className="text-slate-600">5 propositions de design - Choisissez votre style préféré</p>
          </div>

          {/* All 5 Propositions */}
          <Proposition1 />
          <Proposition2 />
          <Proposition3 />
          <Proposition4 />
          <Proposition5 />

        </div>
      </div>
    </>
  );
}
