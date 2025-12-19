import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { TimeFilter, TimeRange, ExportButton } from '../components/dashboard';
import { AdvancedAreaChart, GaugeChart } from '../components/charts';
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
          <div className="grid grid-cols-12 gap-6">
            
            {/* 1. HERO HEADER - Full Width (12 cols) */}
            <div className="col-span-12 relative h-[300px] rounded-[2rem] overflow-hidden bg-slate-900 animate-fade-in-up">
              {/* Background */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 via-slate-900/20 to-transparent z-10" />
                <div 
                  className="absolute inset-0 bg-[url('/Image%2012-12-2025%20a%CC%80%206.58%E2%80%AFPM.JPG')] bg-cover opacity-100"
                  style={{ backgroundPosition: '30% center' }}
                />
              </div>

              {/* Content */}
              <div className="absolute inset-0 z-20 flex flex-col justify-center items-start p-8 lg:p-10">
                {/* Badges en haut à droite */}
                <div className="absolute top-8 right-8 lg:top-10 lg:right-10 flex items-center gap-3">
                  <span className="px-3 py-1.5 bg-[#8AFD81] text-slate-900 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    Official Dashboard
                  </span>
                  <span className="px-3 py-1.5 bg-white/10 text-white/90 rounded-full text-[10px] font-medium backdrop-blur-md border border-white/10 uppercase tracking-widest">
                    Hearst Corporation
                  </span>
                </div>

                {/* Titre centré verticalement, aligné à gauche */}
                <h1 className="text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight text-left">
                  Qatar Bitcoin<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80]">Strategic Reserve</span>
                </h1>

                {/* Info juste sous le titre */}
                <div className="mt-4">
                  <div className="flex items-center gap-4 text-white">
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

            {/* 2. TOTAL BTC RESERVE - 6 cols */}
            <div className="col-span-12 lg:col-span-6 rounded-[2rem] overflow-hidden border border-slate-200 hover:border-[#8AFD81]/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8AFD81]/10 animate-fade-in-up delay-100">
              {/* Header - Dark background */}
              <div className="bg-slate-800 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-6 h-6 text-white" strokeWidth={1.5} />
                    <div>
                      <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                        Total Bitcoin Held
                      </div>
                      <div className="text-white text-[11px]">Strategic Reserve</div>
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
              <div className="bg-white p-6">
                {/* Main Value */}
                <div className="flex items-end gap-3 mb-4">
                  <div className="text-5xl font-bold text-slate-900 tracking-tight tabular-nums">
                    {mockStrategicReserve.totalBTC}
                  </div>
                  <div className="text-2xl font-medium text-slate-400 pb-1">BTC</div>
                  <div className="flex items-center gap-1 ml-2 pb-1">
                    <ChevronUp className="w-5 h-5 text-[#8AFD81]" />
                    <span className="text-sm font-bold text-[#8AFD81]">+4.2%</span>
                  </div>
                </div>

                {/* Single Chart */}
                <div className="flex items-end gap-1.5 h-36 mb-3 pt-6 border-t border-slate-100">
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
                    <div className="text-slate-500 text-[11px] uppercase tracking-widest font-semibold mb-1">Monthly</div>
                    <div className="text-lg font-bold text-slate-900 tabular-nums tracking-tight">
                      +{mockStrategicReserve.monthlyAccumulation} <span className="text-slate-400 font-medium text-sm">BTC</span>
                    </div>
                  </div>
                  <div className="w-px h-10 bg-slate-200"></div>
                  <div className="text-center">
                    <div className="text-slate-500 text-[11px] uppercase tracking-widest font-semibold mb-1">Year-End Target</div>
                    <div className="text-lg font-bold text-hearst-primary tabular-nums tracking-tight">
                      {formatNumber(mockStrategicReserve.projectedYearEnd)} <span className="text-hearst-primary/60 font-medium text-sm">BTC</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. PORTFOLIO VALUE - 6 cols */}
            <div className="col-span-12 lg:col-span-6 rounded-[2rem] overflow-hidden border border-slate-200 hover:border-[#8AFD81]/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8AFD81]/10 animate-fade-in-up delay-100">
              {/* Header - Dark */}
              <div className="bg-slate-800 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-6 h-6 text-white" strokeWidth={1.5} />
                    <div>
                      <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                        Portfolio Value
                      </div>
                      <div className="text-white text-[11px]">USD Valuation</div>
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
              <div className="bg-white px-6 pt-6">
                {/* Main Value */}
                <div className="flex items-end gap-3 mb-4">
                  <div className="text-5xl font-bold text-slate-900 tracking-tight tabular-nums">
                    ${(mockStrategicReserve.currentValue / 1000000).toFixed(0)}
                  </div>
                  <div className="text-2xl font-medium text-slate-400 pb-1">M</div>
                  <div className="flex items-center gap-1 ml-2 pb-1">
                    <ChevronUp className="w-5 h-5 text-[#8AFD81]" />
                    <span className="text-sm font-bold text-[#8AFD81]">+4.2%</span>
                  </div>
                </div>

                {/* Circular Gauges */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-100 pb-6">
                  {[
                    { label: 'ROI', value: 85, id: 'gauge1' },
                    { label: 'Growth', value: 72, id: 'gauge2' },
                    { label: 'Target', value: 68, id: 'gauge3' }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center text-center">
                      <div className="relative w-24 h-24 mb-2">
                        <svg className="w-24 h-24 -rotate-90">
                          <defs>
                            <linearGradient id={item.id} x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#8AFD81" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#8AFD81" stopOpacity="1" />
                            </linearGradient>
                          </defs>
                          <circle cx="48" cy="48" r="38" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                          <circle 
                            cx="48" cy="48" r="38" fill="none" 
                            stroke={`url(#${item.id})`} strokeWidth="12" strokeLinecap="round"
                            strokeDasharray={`${item.value * 2.39} 239`}
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80]">{item.value}%</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. OPERATIONAL KPIs - Single line format */}
            <div className="col-span-12 bg-gradient-to-r from-[#8AFD81]/80 via-[#b6ffb0]/80 to-[#4ade80]/80 rounded-[2rem] px-8 py-4 border border-[#8AFD81]/30 hover:border-[#8AFD81]/50 transition-all duration-300 animate-fade-in-up delay-200">
              <div className="grid grid-cols-5 items-center">
                {[
                  { label: 'Hashrate', value: formatNumber(mockBitcoinKPIs.totalHashrate), unit: 'PH/s', trend: 'up' },
                  { label: 'Daily Output', value: '2.45', unit: 'BTC', trend: 'up' },
                  { label: 'Efficiency', value: mockBitcoinKPIs.efficiency, unit: 'J/TH', trend: 'down' },
                  { label: 'Uptime', value: mockBitcoinKPIs.uptime, unit: '%', trend: 'up' },
                  { label: 'Miners', value: '5,760', unit: '', trend: 'up' }
                ].map((kpi, idx, arr) => (
                  <div key={idx} className="flex items-center justify-center border-r border-slate-900/20 last:border-r-0">
                    <div className="flex flex-col items-center text-center py-1">
                      <div className="flex items-center gap-2 justify-center mb-1">
                        <span className="text-2xl font-bold text-slate-900 tabular-nums">{kpi.value}</span>
                        <span className="text-sm font-medium text-slate-900/70">{kpi.unit}</span>
                        {kpi.trend === 'up' && (
                          <ChevronUp className="w-4 h-4 text-slate-900" />
                        )}
                        {kpi.trend === 'down' && (
                          <ChevronUp className="w-4 h-4 text-slate-900 rotate-180" />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-900 font-semibold uppercase tracking-wider">{kpi.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. PRODUCTION CHART - 8 cols */}
            <div className="col-span-12 lg:col-span-8 rounded-[2rem] overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300 animate-fade-in-up delay-300">
              {/* Header - Dark */}
              <div className="bg-slate-800 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-[#8AFD81]" strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                        Production Trend
                      </div>
                      <div className="text-slate-400 text-[11px]">Daily BTC accumulation over the last 30 days</div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#8AFD81]/20 text-[#8AFD81] rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#8AFD81]/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8AFD81] animate-pulse" />
                    Live
                  </span>
                </div>
              </div>
              
              {/* Body - White */}
              <div className="bg-white p-6">
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
            <div className="col-span-12 lg:col-span-4 rounded-[2rem] overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300 flex flex-col animate-fade-in-up delay-300">
              {/* Header - Dark */}
              <div className="bg-slate-800 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-[#8AFD81]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                      System Health
                    </div>
                    <div className="text-slate-400 text-[11px]">Efficiency & uptime metrics</div>
                  </div>
                </div>
              </div>
              
              {/* Body - White */}
              <div className="bg-white p-6 flex-1 flex flex-col justify-center items-center gap-8">
                <GaugeChart
                  value={mockBitcoinKPIs.efficiency}
                  max={30}
                  min={20}
                  label="Energy Efficiency"
                  unit=" J/TH"
                  size={200}
                  color="#8AFD81"
                />
                 
                <div className="w-full">
                  <div className="flex justify-between items-baseline mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#8AFD81] animate-pulse" />
                      <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">Uptime</span>
                    </div>
                    <span className="text-3xl font-bold tabular-nums bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] bg-clip-text text-transparent">{mockBitcoinKPIs.uptime}%</span>
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
              <div className="h-full bg-slate-800 rounded-[2rem] p-6 border border-slate-700 hover:border-[#8AFD81]/40 transition-all duration-300 hover:-translate-y-0.5">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">Infrastructure</h3>
                    <p className="text-sm text-slate-400">100MW Facility Overview</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-slate-700 flex items-center justify-center group-hover:bg-[#8AFD81] transition-all">
                    <Server className="w-6 h-6 text-slate-400 group-hover:text-white" strokeWidth={1.5} />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-700/50 border border-slate-600">
                    <div className="text-slate-400 text-xs uppercase font-semibold tracking-wider mb-2">Containers</div>
                    <div className="text-2xl font-bold text-white tabular-nums">48/48</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-700/50 border border-slate-600">
                    <div className="text-slate-400 text-xs uppercase font-semibold tracking-wider mb-2">Power</div>
                    <div className="text-2xl font-bold text-emerald-400 tabular-nums">102 MW</div>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center gap-2 text-slate-400 group-hover:text-emerald-400 transition-colors">
                  <span className="text-sm font-medium">View details</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* 8. MINING FLEET LINK - 6 cols */}
            <Link href="/mining-dashboard" className="col-span-12 lg:col-span-6 group block animate-fade-in-up delay-300">
              <div className="h-full bg-white rounded-[2rem] p-6 border border-slate-200 hover:border-[#8AFD81]/40 transition-all duration-300 hover:-translate-y-0.5">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">Mining Fleet</h3>
                    <p className="text-sm text-slate-500">Hardware Performance</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center group-hover:bg-[#8AFD81] transition-all">
                    <BarChart3 className="w-6 h-6 text-slate-500 group-hover:text-white" strokeWidth={1.5} />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#8AFD81]"></div>
                      <span className="text-sm font-semibold text-slate-700">S19 XP Hydro</span>
                    </div>
                    <span className="text-xl font-bold text-slate-900 tabular-nums">5,760</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                      <span className="text-sm font-semibold text-slate-700">Maintenance</span>
                    </div>
                    <span className="text-xl font-bold text-slate-900 tabular-nums">12</span>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center gap-2 text-slate-500 group-hover:text-emerald-600 transition-colors">
                  <span className="text-sm font-medium">View details</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

          </div>
        </div>
      </div>
    </>
  );
}