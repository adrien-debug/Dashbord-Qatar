import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { TimeFilter, TimeRange, ExportButton } from '../components/dashboard';
import { AdvancedAreaChart } from '../components/charts';
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
  Pickaxe,
  Leaf,
  Activity,
  Server,
  BarChart3,
  ChevronUp,
  ArrowRight,
} from 'lucide-react';

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

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

            {/* 5. PRODUCTION CHART - 8 cols */}
            <div className="col-span-12 lg:col-span-8 rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300 animate-fade-in-up delay-300">
              {/* Header - Dark */}
              <div className="bg-slate-800 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-white" strokeWidth={1.5} />
                    <div>
                      <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                        Production Trend
                      </div>
                      <div className="text-slate-400 text-xs">Daily BTC accumulation over the last 30 days</div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#8AFD81]/20 text-[#8AFD81] rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#8AFD81]/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8AFD81] animate-pulse" />
                    Live
                  </span>
                </div>
              </div>
              
              {/* Body - White */}
              <div className="bg-white p-3">
                <div className="h-[300px] w-full">
                  <AdvancedAreaChart
                    data={productionData}
                    areas={[
                      { dataKey: 'btc', name: 'BTC Production', color: '#8AFD81' },
                    ]}
                    xAxisKey="date"
                    height={300}
                    showGrid={true}
                    showLegend={false}
                    showReferenceLine={true}
                  />
                </div>
              </div>
            </div>

            {/* 6. SYSTEM HEALTH - 4 cols */}
            <div className="col-span-12 lg:col-span-4 rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300 flex flex-col animate-fade-in-up delay-300">
              {/* Header - Dark */}
              <div className="bg-slate-800 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-white" strokeWidth={1.5} />
                  <div>
                    <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                      System Health
                    </div>
                    <div className="text-slate-400 text-xs">Efficiency & uptime metrics</div>
                  </div>
                </div>
              </div>
              
              {/* Body - White */}
              <div className="bg-white p-3 flex-1 flex flex-col justify-center gap-6">
                {/* Energy Efficiency */}
                <div className="w-full">
                  <div className="flex justify-between items-baseline mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#8AFD81] animate-pulse" />
                      <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">Energy Efficiency</span>
                    </div>
                    <span className="text-xl font-bold tabular-nums bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] bg-clip-text text-transparent">{mockBitcoinKPIs.efficiency} <span className="text-lg">J/TH</span></span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="relative w-full h-5 rounded-full overflow-hidden">
                    <div className="absolute inset-0 bg-slate-200/80 rounded-full" />
                    <div 
                      className="absolute inset-y-0 left-0 bg-[#8AFD81]/20 rounded-full blur-sm transition-all duration-1000 ease-out" 
                      style={{ width: `${((30 - mockBitcoinKPIs.efficiency) / 10) * 100}%` }}
                    />
                    <div 
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] rounded-full transition-all duration-1000 ease-out shadow-lg" 
                      style={{ 
                        width: `${((30 - mockBitcoinKPIs.efficiency) / 10) * 100}%`,
                        boxShadow: '0 0 20px rgba(138, 253, 129, 0.4)'
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/10 rounded-full" />
                      <div className="absolute inset-0 overflow-hidden rounded-full">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2.5">
                    <span className="text-[10px] text-slate-400 font-medium">30 J/TH</span>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#8AFD81]/10 border border-[#8AFD81]/30">
                      <span className="text-[9px] font-bold uppercase tracking-wide text-[#8AFD81]">Optimal</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">20 J/TH</span>
                  </div>
                </div>
                 
                {/* Uptime */}
                <div className="w-full">
                  <div className="flex justify-between items-baseline mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#8AFD81] animate-pulse" />
                      <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">Uptime</span>
                    </div>
                    <span className="text-xl font-bold tabular-nums bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] bg-clip-text text-transparent">{mockBitcoinKPIs.uptime}%</span>
                  </div>
                  
                  {/* Enhanced progress bar with matching gradient */}
                  <div className="relative w-full h-5 rounded-full overflow-hidden">
                    {/* Track background */}
                    <div className="absolute inset-0 bg-slate-200/80 rounded-full" />
                    
                    {/* Glow effect behind the bar */}
                    <div 
                      className="absolute inset-y-0 left-0 bg-[#8AFD81]/20 rounded-full blur-sm transition-all duration-1000 ease-out" 
                      style={{ width: `${mockBitcoinKPIs.uptime}%` }}
                    />
                    
                    {/* Progress bar with gradient */}
                    <div 
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] rounded-full transition-all duration-1000 ease-out shadow-lg" 
                      style={{ 
                        width: `${mockBitcoinKPIs.uptime}%`,
                        boxShadow: '0 0 20px rgba(138, 253, 129, 0.4)'
                      }}
                    >
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/10 rounded-full" />
                      
                      {/* Animated shine */}
                      <div className="absolute inset-0 overflow-hidden rounded-full">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2.5">
                    <span className="text-[10px] text-slate-400 font-medium">0%</span>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#8AFD81]/10 border border-[#8AFD81]/30">
                      <span className="text-[9px] font-bold uppercase tracking-wide text-[#8AFD81]">30 days average</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">100%</span>
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