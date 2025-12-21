import Head from 'next/head';
import Link from 'next/link';
import { AdvancedAreaChart, CandlestickChart } from '../components/charts';
import { formatNumber } from '../utils/formatNumber';
import {
  mockBitcoinKPIs,
  mockStrategicReserve,
  mockProductionHistory,
} from '../lib/mock-mining';
import {
  Wallet,
  DollarSign,
  Zap,
  Activity,
  Server,
  BarChart3,
  ChevronUp,
  ArrowRight,
  TrendingUp,
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
  { date: '21 Mai', open: 49800, high: 51200, low: 48800, close: 50500, volume: 48000 },
  { date: '22 Mai', open: 50500, high: 52500, low: 50000, close: 52000, volume: 64000 },
  { date: '23 Mai', open: 52000, high: 53500, low: 51200, close: 52800, volume: 59000 },
  { date: '24 Mai', open: 52800, high: 54000, low: 51500, close: 51800, volume: 52000 },
  { date: '25 Mai', open: 51800, high: 53200, low: 50800, close: 52500, volume: 47000 },
  { date: '26 Jun', open: 52500, high: 54500, low: 52000, close: 54000, volume: 61000 },
  { date: '27 Jun', open: 54000, high: 55800, low: 53200, close: 55200, volume: 72000 },
  { date: '28 Jun', open: 55200, high: 56500, low: 54000, close: 54500, volume: 54000 },
  { date: '29 Jun', open: 54500, high: 55500, low: 53000, close: 53500, volume: 49000 },
  { date: '30 Jun', open: 53500, high: 55000, low: 52800, close: 54800, volume: 58000 },
  { date: '1 Jul', open: 54800, high: 56200, low: 54000, close: 55500, volume: 51000 },
  { date: '2 Jul', open: 55500, high: 57500, low: 55000, close: 57000, volume: 67000 },
  { date: '3 Jul', open: 57000, high: 58500, low: 56200, close: 58000, volume: 73000 },
  { date: '4 Jul', open: 58000, high: 59200, low: 56500, close: 57200, volume: 62000 },
  { date: '5 Jul', open: 57200, high: 58500, low: 56000, close: 58200, volume: 55000 },
  { date: '6 Aoû', open: 58200, high: 60000, low: 57500, close: 59500, volume: 69000 },
  { date: '7 Aoû', open: 59500, high: 61200, low: 58800, close: 60500, volume: 74000 },
  { date: '8 Aoû', open: 60500, high: 62000, low: 59500, close: 59800, volume: 58000 },
  { date: '9 Aoû', open: 59800, high: 61500, low: 58500, close: 61000, volume: 63000 },
  { date: '10 Aoû', open: 61000, high: 63000, low: 60200, close: 62500, volume: 71000 },
];

export default function Dashboard() {

  const productionData = mockProductionHistory.slice(-30).map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    btc: d.btc,
  }));

  return (
    <>
      <Head>
        <title>QATAR Bitcoin Strategic Reserve - Executive Dashboard</title>
      </Head>

      <div className="min-h-screen bg-slate-50 bg-grid-slate-100 p-6 lg:p-8">
        <div className="max-w-[1600px] mx-auto">
          
          {/* BENTO GRID CONTAINER */}
          <div className="grid grid-cols-12 gap-4">
            
            {/* 1. HERO HEADER - Full Width (12 cols) */}
            <div className="col-span-12 relative h-[300px] rounded-2xl overflow-hidden bg-slate-900 animate-fade-in-up">
              {/* Background */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 via-slate-900/20 to-transparent z-10" />
                <div 
                  className="absolute inset-0 bg-[url('/Image%2012-12-2025%20a%CC%80%206.58%E2%80%AFPM.JPG')] bg-cover opacity-100"
                  style={{ backgroundPosition: '30% center' }}
                />
              </div>

              {/* Content */}
              <div className="absolute inset-0 z-20">
                {/* Top Left - Badges */}
                <div className="absolute top-6 left-8 lg:left-10 flex items-center gap-3">
                  <span className="px-3 py-1.5 bg-[#8AFD81] text-slate-900 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    Official Dashboard
                  </span>
                  <span className="px-3 py-1.5 bg-white/10 text-white/90 rounded-full text-[10px] font-medium backdrop-blur-md border border-white/10 uppercase tracking-widest">
                    Hearst Corporation
                  </span>
                </div>

                {/* Bottom Left - Title and info */}
                <div className="absolute bottom-4 left-8 lg:left-10">
                  <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight text-left">
                    Qatar Bitcoin<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80]">Strategic Reserve</span>
                  </h1>

                  <div className="mt-4">
                    <div className="flex items-center justify-start gap-4 text-white">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/50 backdrop-blur-sm">
                        <div className="w-2 h-2 rounded-full bg-[#8AFD81] animate-pulse" />
                        <span className="text-xs font-semibold tracking-wide uppercase text-[#8AFD81]">System Operational</span>
                      </div>
                      <div className="h-4 w-px bg-slate-600" />
                      <p className="text-sm font-medium text-white tracking-wide">
                        100MW Institutional Mining Facility
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 1.5 BITCOIN PRICE ACTION - Full Width - TOP POSITION */}
            <div className="col-span-12 rounded-2xl overflow-hidden border border-slate-200 hover:border-amber-500/30 transition-all duration-300 animate-fade-in-up delay-100">
              {/* Header - Dark */}
              <div className="bg-slate-900 px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 rounded-xl shadow-lg shadow-amber-500/30">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white tracking-tight">
                        Bitcoin Price Action
                        <span className="text-amber-400 ml-2">OHLC</span>
                      </h2>
                      <p className="text-sm text-slate-400 mt-1">
                        Chandelier japonais • Volume • Moyennes Mobiles (7, 20, 50)
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Période: Jan - Août 2024
                      </p>
                    </div>
                  </div>
                  
                  {/* Badges Informatifs - Palette Lucid */}
                  <div className="flex items-center gap-2">
                    {/* Variation sur période - Lucid Green */}
                    <div className="flex items-center gap-1.5 px-3 py-2 bg-green-500/15 rounded-xl border border-green-500/30">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-bold text-green-400">+38.5%</span>
                    </div>
                    
                    {/* Seuil de Rentabilité - Lucid Teal */}
                    <div className="flex items-center gap-1.5 px-3 py-2 bg-teal-500/15 rounded-xl border border-teal-500/30">
                      <Activity className="w-4 h-4 text-teal-400" />
                      <span className="text-xs font-semibold text-teal-400">Seuil Mining</span>
                      <span className="text-sm font-bold text-teal-300">$38,500</span>
                    </div>
                    
                    {/* Période - Lucid Purple */}
                    <span className="text-xs px-3 py-2 bg-purple-500/15 text-purple-300 rounded-xl font-medium border border-purple-500/30">
                      40 jours
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Body - Chart */}
              <div className="bg-slate-900 px-6 pb-6">
                <CandlestickChart 
                  data={candlestickData}
                  height={380}
                  showVolume={true}
                  showMA={true}
                  maPeriods={[7, 20, 50]}
                  breakevenPrice={38500}
                  unit="$"
                  theme="dark"
                />
              </div>
            </div>

            {/* 2. TOTAL BTC RESERVE - 6 cols */}
            <div className="col-span-12 lg:col-span-6 rounded-2xl overflow-hidden border border-slate-200 hover:border-[#8AFD81]/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8AFD81]/10 animate-fade-in-up delay-100">
              {/* Header - Dark background */}
              <div className="bg-slate-800 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-5 h-5 text-white" strokeWidth={1.5} />
                    <div>
                      <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                        Total Bitcoin Held
                      </div>
                      <div className="text-white text-xs">Strategic Reserve</div>
                    </div>
                  </div>
                  {/* Filter buttons */}
                  <div className="flex items-center gap-1 bg-slate-700 rounded-lg p-1">
                    <button className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors rounded">
                      Day
                    </button>
                    <button className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#8AFD81] text-slate-900 rounded">
                      Month
                    </button>
                    <button className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors rounded">
                      All
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Body - White */}
              <div className="bg-white p-3">
                {/* Main Value */}
                <div className="flex items-end gap-3 mb-4">
                  <div className="text-3xl font-bold text-slate-900 tracking-tight tabular-nums">
                    {mockStrategicReserve.totalBTC}
                  </div>
                  <div className="text-2xl font-medium text-slate-400 pb-1">BTC</div>
                  <div className="flex items-center gap-1 ml-2 pb-1">
                    <ChevronUp className="w-5 h-5 text-[#8AFD81]" />
                    <span className="text-sm font-bold text-[#8AFD81]">+4.2%</span>
                  </div>
                </div>

                {/* Single Chart */}
                <div className="flex items-end gap-1.5 h-28 mb-3 pt-6 border-t border-slate-100">
                  {[25, 40, 35, 50, 45, 60, 55, 70, 65, 80, 75, 90, 85, 95, 88].map((h, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-gradient-to-t from-[#8AFD81]/30 to-[#8AFD81] rounded-t-sm hover:from-[#8AFD81]/50 hover:to-[#b6ffb0] transition-all cursor-pointer" 
                      style={{ height: `${h}%` }} 
                    />
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-center gap-10 pt-4">
                  <div className="text-center">
                    <div className="text-slate-500 text-xs uppercase tracking-widest font-semibold mb-1">Monthly</div>
                    <div className="text-sm font-bold text-slate-900 tabular-nums tracking-tight">
                      +{mockStrategicReserve.monthlyAccumulation} <span className="text-slate-400 font-medium text-sm">BTC</span>
                    </div>
                  </div>
                  <div className="w-px h-10 bg-slate-200"></div>
                  <div className="text-center">
                    <div className="text-slate-500 text-xs uppercase tracking-widest font-semibold mb-1">Year-End Target</div>
                    <div className="text-sm font-bold text-slate-900 tabular-nums tracking-tight">
                      {formatNumber(mockStrategicReserve.projectedYearEnd)} <span className="text-slate-400 font-medium text-sm">BTC</span>
                    </div>
                  </div>
                  <div className="w-px h-10 bg-slate-200"></div>
                  <div className="text-center">
                    <div className="text-slate-500 text-xs uppercase tracking-widest font-semibold mb-1">Avg. Cost</div>
                    <div className="text-sm font-bold text-slate-900 tabular-nums tracking-tight">
                      $42,850 <span className="text-slate-400 font-medium text-sm">/BTC</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. PORTFOLIO VALUE - 6 cols */}
            <div className="col-span-12 lg:col-span-6 rounded-2xl overflow-hidden border border-slate-200 hover:border-[#8AFD81]/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8AFD81]/10 animate-fade-in-up delay-100">
              {/* Header - Dark */}
              <div className="bg-slate-800 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-white" strokeWidth={1.5} />
                    <div>
                      <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                        Portfolio Value
                      </div>
                      <div className="text-white text-xs">USD Valuation</div>
                    </div>
                  </div>
                  {/* Filter buttons */}
                  <div className="flex items-center gap-1 bg-slate-700 rounded-lg p-1">
                    <button className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors rounded">
                      Day
                    </button>
                    <button className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#8AFD81] text-slate-900 rounded">
                      Month
                    </button>
                    <button className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors rounded">
                      All
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Body - White */}
              <div className="bg-white p-3">
                {/* Main Value */}
                <div className="flex items-end gap-3 mb-4">
                  <div className="text-3xl font-bold text-slate-900 tracking-tight tabular-nums">
                    ${(mockStrategicReserve.currentValue / 1000000).toFixed(0)}
                  </div>
                  <div className="text-2xl font-medium text-slate-400 pb-1">M</div>
                  <div className="flex items-center gap-1 ml-2 pb-1">
                    <ChevronUp className="w-5 h-5 text-[#8AFD81]" />
                    <span className="text-sm font-bold text-[#8AFD81]">+4.2%</span>
                  </div>
                </div>

                {/* Area/Line Chart */}
                <div className="relative h-28 pt-6 border-t border-slate-100">
                  <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#8AFD81" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#8AFD81" stopOpacity="0.05" />
                      </linearGradient>
                    </defs>
                    {/* Area fill */}
                    <path 
                      d="M0,80 Q30,70 60,65 T120,50 T180,35 T240,25 T300,15 L300,100 L0,100 Z" 
                      fill="url(#areaGradient)"
                    />
                    {/* Line */}
                    <path 
                      d="M0,80 Q30,70 60,65 T120,50 T180,35 T240,25 T300,15" 
                      fill="none" 
                      stroke="#8AFD81" 
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* Dots */}
                    <circle cx="0" cy="80" r="4" fill="#8AFD81" />
                    <circle cx="60" cy="65" r="4" fill="#8AFD81" />
                    <circle cx="120" cy="50" r="4" fill="#8AFD81" />
                    <circle cx="180" cy="35" r="4" fill="#8AFD81" />
                    <circle cx="240" cy="25" r="4" fill="#8AFD81" />
                    <circle cx="300" cy="15" r="4" fill="#8AFD81" />
                  </svg>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-center gap-10 pt-4">
                  <div className="text-center">
                    <div className="text-slate-500 text-xs uppercase tracking-widest font-semibold mb-1">ROI</div>
                    <div className="text-sm font-bold text-slate-900 tabular-nums tracking-tight">
                      +85%
                    </div>
                  </div>
                  <div className="w-px h-10 bg-slate-200"></div>
                  <div className="text-center">
                    <div className="text-slate-500 text-xs uppercase tracking-widest font-semibold mb-1">Growth</div>
                    <div className="text-sm font-bold text-slate-900 tabular-nums tracking-tight">
                      +72%
                    </div>
                  </div>
                  <div className="w-px h-10 bg-slate-200"></div>
                  <div className="text-center">
                    <div className="text-slate-500 text-xs uppercase tracking-widest font-semibold mb-1">Target</div>
                    <div className="text-sm font-bold text-slate-900 tabular-nums tracking-tight">
                      68%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. OPERATIONAL KPIs - Single line format with header/body style */}
            <div className="col-span-12 rounded-2xl overflow-hidden border border-slate-200 hover:border-[#8AFD81]/40 transition-all duration-300 animate-fade-in-up delay-200">
              {/* Header - Dark with titles */}
              <div className="bg-slate-800 grid grid-cols-5">
                {[
                  { label: 'Hashrate', value: formatNumber(mockBitcoinKPIs.totalHashrate), unit: 'PH/s', trend: 'up' },
                  { label: 'Daily Output', value: '2.45', unit: 'BTC', trend: 'up' },
                  { label: 'Efficiency', value: mockBitcoinKPIs.efficiency, unit: 'J/TH', trend: 'down' },
                  { label: 'Uptime', value: mockBitcoinKPIs.uptime, unit: '%', trend: 'up' },
                  { label: 'Miners', value: '5,760', unit: '', trend: 'up' }
                ].map((kpi, idx) => (
                  <div key={idx} className="flex items-center justify-center border-r border-slate-700 last:border-r-0 py-3">
                    <div className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] font-bold uppercase tracking-wider">{kpi.label}</div>
                  </div>
                ))}
              </div>
              {/* Body - White with values */}
              <div className="bg-white grid grid-cols-5">
                {[
                  { label: 'Hashrate', value: formatNumber(mockBitcoinKPIs.totalHashrate), unit: 'PH/s' },
                  { label: 'Daily Output', value: '2.45', unit: 'BTC' },
                  { label: 'Efficiency', value: mockBitcoinKPIs.efficiency, unit: 'J/TH' },
                  { label: 'Uptime', value: mockBitcoinKPIs.uptime, unit: '%' },
                  { label: 'Miners', value: '5,760', unit: '' }
                ].map((kpi, idx) => (
                  <div key={idx} className="flex items-center justify-center border-r border-slate-200 last:border-r-0 py-4">
                    <div className="flex items-center gap-1.5 justify-center">
                      <span className="text-xl font-bold text-slate-900 tabular-nums">{kpi.value}</span>
                      <span className="text-sm font-medium text-slate-500">{kpi.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section Title - Analytics */}
            <div className="col-span-12 flex items-center gap-4 mt-6 mb-2">
              <Activity className="w-6 h-6 text-[#8AFD81]" strokeWidth={1.5} />
              <h2 className="text-2xl font-bold text-slate-900">Analytics & Monitoring</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent"></div>
            </div>

            {/* 5. PRODUCTION CHART - Full Width */}
            <div className="col-span-12 rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300 animate-fade-in-up delay-300">
              {/* Header - Dark */}
              <div className="bg-slate-800 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-white" strokeWidth={1.5} />
                    <div>
                      <div className="text-white text-base font-semibold">
                        Production Trend
                      </div>
                      <div className="text-slate-400 text-sm">Daily BTC accumulation over the last 30 days</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-slate-400 uppercase tracking-wider">Total Period</div>
                      <div className="text-lg font-bold text-white tabular-nums">
                        {productionData.reduce((sum, d) => sum + d.btc, 0).toFixed(2)} BTC
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg text-xs font-medium">
                      <span className="w-2 h-2 rounded-full bg-[#8AFD81]" />
                      Live Data
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Body - White */}
              <div className="bg-white p-6">
                <div className="h-[420px] w-full">
                  <AdvancedAreaChart
                    data={productionData}
                    areas={[
                      { dataKey: 'btc', name: 'BTC Production', color: '#8AFD81' },
                    ]}
                    xAxisKey="date"
                    height={420}
                    showGrid={true}
                    showLegend={false}
                    showReferenceLine={true}
                    unit="BTC"
                  />
                </div>
              </div>
            </div>

            {/* 6. SYSTEM HEALTH - 6 cols */}
            <div className="col-span-12 lg:col-span-6 rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300 flex flex-col animate-fade-in-up delay-300">
              {/* Header - Dark */}
              <div className="bg-slate-800 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-white" strokeWidth={1.5} />
                    <div>
                      <div className="text-white text-base font-semibold">
                        System Health
                      </div>
                      <div className="text-slate-400 text-sm">Efficiency & uptime metrics</div>
                    </div>
                  </div>
                  <span className="text-sm text-slate-400">Last 30 days</span>
                </div>
              </div>
              
              {/* Body - White */}
              <div className="bg-white p-6 flex-1 flex flex-col justify-center gap-8">
                {/* Energy Efficiency */}
                <div className="w-full">
                  <div className="flex justify-between items-baseline mb-4">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-semibold text-slate-700">Energy Efficiency</span>
                    </div>
                    <span className="text-2xl font-bold tabular-nums text-slate-900">{mockBitcoinKPIs.efficiency} <span className="text-base text-slate-500 font-medium">J/TH</span></span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="relative w-full h-3 rounded-full overflow-hidden bg-slate-100">
                    <div 
                      className="absolute inset-y-0 left-0 bg-[#8AFD81] rounded-full transition-all duration-500 ease-out" 
                      style={{ width: `${((30 - mockBitcoinKPIs.efficiency) / 10) * 100}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-slate-400">30 J/TH</span>
                    <span className="text-xs font-medium text-[#8AFD81]">Optimal Range</span>
                    <span className="text-xs text-slate-400">20 J/TH</span>
                  </div>
                </div>
                 
                {/* Uptime */}
                <div className="w-full">
                  <div className="flex justify-between items-baseline mb-4">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-semibold text-slate-700">System Uptime</span>
                    </div>
                    <span className="text-2xl font-bold tabular-nums text-slate-900">{mockBitcoinKPIs.uptime}<span className="text-base text-slate-500 font-medium">%</span></span>
                  </div>
                  
                  <div className="relative w-full h-3 rounded-full overflow-hidden bg-slate-100">
                    <div 
                      className="absolute inset-y-0 left-0 bg-[#8AFD81] rounded-full transition-all duration-500 ease-out" 
                      style={{ width: `${mockBitcoinKPIs.uptime}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-slate-400">0%</span>
                    <span className="text-xs font-medium text-slate-500">30-day average</span>
                    <span className="text-xs text-slate-400">100%</span>
                  </div>
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                  <div className="text-center">
                    <div className="text-xs text-slate-500 mb-1">Downtime</div>
                    <div className="text-lg font-bold text-slate-900 tabular-nums">2.4h</div>
                  </div>
                  <div className="text-center border-x border-slate-100">
                    <div className="text-xs text-slate-500 mb-1">Incidents</div>
                    <div className="text-lg font-bold text-slate-900 tabular-nums">3</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-slate-500 mb-1">MTBF</div>
                    <div className="text-lg font-bold text-slate-900 tabular-nums">720h</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 7. INFRASTRUCTURE LINK - 6 cols */}
            <Link href="/infrastructure" className="col-span-12 lg:col-span-6 group block animate-fade-in-up delay-300">
              <div className="h-full rounded-2xl overflow-hidden border border-slate-200 hover:border-[#8AFD81]/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8AFD81]/10">
                {/* Header - Dark background */}
                <div className="bg-slate-800 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Server className="w-5 h-5 text-white" strokeWidth={1.5} />
                      <div>
                        <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                          Infrastructure
                        </div>
                        <div className="text-white text-xs">100MW Facility Overview</div>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#8AFD81]/20 text-[#8AFD81] rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#8AFD81]/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8AFD81] animate-pulse" />
                      Active
                    </span>
                  </div>
                </div>
                
                {/* Body - White */}
                <div className="bg-white p-3">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-4 rounded-2xl bg-white border border-slate-200">
                      <div className="text-slate-500 text-xs uppercase font-semibold tracking-widest mb-2">Containers</div>
                      <div className="text-xl font-bold text-slate-900 tabular-nums">48/48</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-slate-200">
                      <div className="text-slate-500 text-xs uppercase font-semibold tracking-widest mb-2">Power</div>
                      <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] tabular-nums">102 MW</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-slate-500 group-hover:text-[#8AFD81] transition-colors">
                    <span className="text-sm font-medium">View details</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>

            {/* 8. MINING FLEET LINK - 6 cols */}
            <Link href="/mining-dashboard" className="col-span-12 lg:col-span-6 group block animate-fade-in-up delay-300">
              <div className="h-full rounded-2xl overflow-hidden border border-slate-200 hover:border-[#8AFD81]/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8AFD81]/10">
                {/* Header - Dark background */}
                <div className="bg-slate-800 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-5 h-5 text-white" strokeWidth={1.5} />
                      <div>
                        <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                          Mining Fleet
                        </div>
                        <div className="text-white text-xs">Hardware Performance</div>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#8AFD81]/20 text-[#8AFD81] rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#8AFD81]/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8AFD81] animate-pulse" />
                      Online
                    </span>
                  </div>
                </div>
                
                {/* Body - White */}
                <div className="bg-white p-3">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#8AFD81]"></div>
                        <span className="text-sm font-semibold text-slate-700">S19 XP Hydro</span>
                      </div>
                      <span className="text-xl font-bold text-slate-900 tabular-nums">5,760</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                        <span className="text-sm font-semibold text-slate-700">Maintenance</span>
                      </div>
                      <span className="text-xl font-bold text-slate-900 tabular-nums">12</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-slate-500 group-hover:text-[#8AFD81] transition-colors">
                    <span className="text-sm font-medium">View details</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>

          </div>
        </div>
      </div>
    </>
  );
}