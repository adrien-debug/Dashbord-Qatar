import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { TimeFilter, TimeRange, ExportButton } from '../components/dashboard';
import { AdvancedAreaChart, AdvancedBarChart, GaugeChart } from '../components/charts';
import { formatNumber } from '../utils/formatNumber';
import {
  mockBitcoinKPIs,
  mockStrategicReserve,
  mockProductionHistory,
  mockHashrateComparison,
} from '../lib/mock-mining';

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

      <div className="min-h-screen bg-slate-50 bg-grid-slate-100 p-4 lg:p-6">
        <div className="max-w-[1500px] mx-auto space-y-6">
          
          {/* 1. HERO HEADER - EXECUTIVE SUMMARY */}
          <div className="relative w-full h-[320px] rounded-[2rem] overflow-hidden shadow-2xl bg-slate-900 group animate-fade-in-up">
            {/* Background */}
            <div className="absolute inset-0">
               <div className="absolute inset-0 bg-gradient-to-r from-slate-900/30 via-slate-800/20 to-transparent z-10" />
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#8AFD81]/5 via-transparent to-transparent z-10"></div>
               <div 
                 className="absolute inset-0 bg-[url('/Image%2012-12-2025%20a%CC%80%206.58%E2%80%AFPM.JPG')] bg-cover opacity-100"
                 style={{ backgroundPosition: '30% center' }}
               />
            </div>

            {/* Content */}
            <div className="absolute inset-0 z-20 flex flex-col justify-between p-8 lg:p-10">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-[#8AFD81] text-slate-900 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(138,253,129,0.4)]">
                    Official Dashboard
                  </span>
                  <span className="px-3 py-1 bg-white/5 text-white/90 rounded-full text-[10px] font-medium backdrop-blur-md border border-white/10 uppercase tracking-widest hover:bg-white/10 transition-colors">
                    Hearst Corporation
                  </span>
                </div>
                
                <div className="flex items-center gap-2 bg-slate-950/40 backdrop-blur-xl p-1.5 rounded-xl border border-white/5 shadow-xl scale-90 origin-right hover:scale-95 transition-transform duration-300">
                  <TimeFilter selected={timeRange} onChange={setTimeRange} options={['7d', '30d', '90d']} />
                  <ExportButton />
                </div>
              </div>

              <div>
                <h1 className="text-5xl lg:text-7xl font-bold text-white mb-4 tracking-tight drop-shadow-2xl leading-none">
                  Qatar Bitcoin <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-glow filter drop-shadow-lg">
                    Strategic Reserve
                  </span>
                </h1>
                <div className="flex items-center gap-6 text-slate-300">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                    <div className="w-2 h-2 rounded-full bg-[#8AFD81] shadow-[0_0_10px_#8AFD81] animate-pulse" />
                    <span className="text-xs font-bold tracking-wide uppercase text-[#8AFD81]">System Operational</span>
                  </div>
                  <div className="h-4 w-px bg-slate-700/50" />
                  <p className="text-sm font-medium text-slate-400 tracking-wide">
                    100MW Institutional Mining Facility <span className="text-slate-600 mx-2">•</span> Real-time Monitoring
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. CRITICAL NUMBERS - "THE WOA EFFECT" */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up delay-100">
            {/* Total BTC Reserve */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 rounded-[2rem] p-8 border border-slate-800 shadow-2xl group hover:border-slate-700 transition-all duration-500 hover:shadow-[0_0_40px_rgba(15,23,42,0.6)]">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#8AFD81]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[#8AFD81]/10 transition-all duration-1000"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center border border-slate-700">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8AFD81" strokeWidth="2">
                        <path d="M20 12V8H6a2 2 0 01-2-2 2 2 0 012-2h12v4" />
                        <path d="M4 6v12a2 2 0 002 2h14v-4" />
                        <path d="M18 12a2 2 0 000 4h4v-4h-4z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Total Bitcoin Held</div>
                      <div className="text-slate-500 text-xs">Cold Storage & Custody</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[#8AFD81] bg-[#8AFD81]/10 px-3 py-1 rounded-full text-[10px] font-bold border border-[#8AFD81]/20 shadow-[0_0_10px_rgba(138,253,129,0.1)]">
                    <span>▲ {mockStrategicReserve.reserveGrowth}%</span>
                    <span className="opacity-75">this month</span>
                  </div>
                </div>
                
                <div className="flex items-baseline gap-4 mb-2">
                  <div className="text-7xl lg:text-8xl font-bold text-white tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                    {mockStrategicReserve.totalBTC}
                  </div>
                  <div className="text-3xl font-medium text-slate-600 mb-4">BTC</div>
                </div>
                
                <div className="flex items-center gap-8 mt-8 pt-8 border-t border-slate-800/50">
                  <div>
                    <div className="text-slate-500 text-[10px] uppercase tracking-wider mb-1 font-semibold">Monthly Accumulation</div>
                    <div className="text-2xl font-bold text-white flex items-center gap-2">
                      +{mockStrategicReserve.monthlyAccumulation} <span className="text-sm text-slate-500 font-medium">BTC</span>
                    </div>
                  </div>
                  <div className="w-px h-10 bg-slate-800"></div>
                  <div>
                    <div className="text-slate-500 text-[10px] uppercase tracking-wider mb-1 font-semibold">Year-End Projection</div>
                    <div className="text-2xl font-bold text-[#8AFD81] flex items-center gap-2">
                      {formatNumber(mockStrategicReserve.projectedYearEnd)} <span className="text-sm text-[#8AFD81]/70 font-medium">BTC</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Total USD Value */}
            <div className="relative overflow-hidden bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl group hover:border-[#8AFD81]/30 transition-all duration-500 hover:shadow-[0_0_40px_rgba(138,253,129,0.15)]">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[#8AFD81]/5 transition-all duration-1000"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                      <span className="text-xl">💰</span>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Portfolio Value (USD)</div>
                      <div className="text-slate-400 text-xs">Real-time Valuation</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-[10px] font-bold border border-emerald-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Live Market</span>
                  </div>
                </div>
                
                <div className="flex items-baseline gap-4 mb-2">
                  <div className="text-7xl lg:text-8xl font-bold text-slate-900 tracking-tighter">
                    ${(mockStrategicReserve.currentValue / 1000000).toFixed(0)}
                  </div>
                  <div className="text-3xl font-medium text-slate-400 mb-4">M</div>
                </div>

                <div className="flex items-center gap-8 mt-8 pt-8 border-t border-slate-100">
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-1 font-semibold">Current Price</div>
                    <div className="text-2xl font-bold text-slate-900">$98,450</div>
                  </div>
                  <div className="w-px h-10 bg-slate-200"></div>
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-1 font-semibold">24h Change</div>
                    <div className="text-2xl font-bold text-emerald-500 flex items-center gap-1">
                      +4.2%
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="mb-0.5">
                        <path d="M18 15l-6-6-6 6"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. OPERATIONAL EXCELLENCE - 4 COLUMN KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up delay-200">
            {[
              { label: 'Total Hashrate', value: formatNumber(mockBitcoinKPIs.totalHashrate), unit: 'PH/s', sub: 'Capacity: 1.02 EH/s', trend: '▲ Stable', icon: '⚡️' },
              { label: 'Daily Production', value: mockBitcoinKPIs.dailyProduction, unit: 'BTC', sub: 'Last 24 hours', trend: '▲ On Target', icon: '⛏️' },
              { label: 'Energy Efficiency', value: mockBitcoinKPIs.efficiency, unit: 'J/TH', sub: 'World Class Class', trend: '▼ Optimal', icon: '🌱' },
              { label: 'Fleet Uptime', value: mockBitcoinKPIs.uptime, unit: '%', sub: 'Last 30 Days', trend: '▲ High Availability', icon: '🟢' }
            ].map((kpi, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{kpi.icon}</span>
                    <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{kpi.label}</div>
                  </div>
                  <div className={`text-[9px] font-bold px-2 py-1 rounded-full ${kpi.trend.includes('▼') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'}`}>
                    {kpi.trend}
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <div className="text-3xl font-bold text-slate-900">{kpi.value}</div>
                  <div className="text-xs font-medium text-slate-400">{kpi.unit}</div>
                </div>
                <div className="text-[10px] text-slate-500 font-medium">{kpi.sub}</div>
              </div>
            ))}
          </div>

          {/* 4. PERFORMANCE ANALYTICS - SPLIT VIEW */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up delay-300">
            {/* Production Chart - Takes 2/3 */}
            <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    Production Trend
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wide">Live</span>
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">Daily Bitcoin accumulation performance over time</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-[#8AFD81] shadow-[0_0_8px_#8AFD81]"></div>
                    Actual Production
                  </div>
                </div>
              </div>
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
                />
              </div>
            </div>

            {/* Efficiency Metrics - Takes 1/3 */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl flex flex-col justify-between relative overflow-hidden">
               <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-slate-50 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="mb-6 relative z-10">
                <h2 className="text-2xl font-bold text-slate-900">System Health</h2>
                <p className="text-sm text-slate-500 mt-1">Operational efficiency score & uptime</p>
              </div>
              
              <div className="flex-1 flex flex-col justify-center items-center gap-8 relative z-10">
                 <div className="relative transform scale-110">
                    <GaugeChart
                      value={mockBitcoinKPIs.efficiency}
                      max={30}
                      min={20}
                      label="Energy Efficiency"
                      unit=" J/TH"
                      size={160}
                      color="#8AFD81"
                    />
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center w-full">
                      <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100">
                        Target: &lt;22 J/TH
                      </div>
                    </div>
                 </div>
                 
                 <div className="w-full h-px bg-slate-100"></div>
                 
                 <div className="w-full">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Uptime Score</span>
                      <span className="text-sm font-bold text-slate-900">{mockBitcoinKPIs.uptime}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-[#8AFD81] h-2 rounded-full shadow-[0_0_10px_#8AFD81]" style={{ width: `${mockBitcoinKPIs.uptime}%` }}></div>
                    </div>
                    <div className="mt-2 text-right">
                       <span className="text-[10px] text-slate-400">Last 30 days average</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* 5. INFRASTRUCTURE & NAVIGATION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up delay-300">
             <Link href="/infrastructure" className="group block h-full">
              <div className="bg-slate-900 rounded-[2rem] p-6 border border-slate-800 hover:border-[#8AFD81] transition-all duration-300 h-full relative overflow-hidden group-hover:shadow-[0_0_30px_rgba(138,253,129,0.1)]">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555664424-778a6902201b?q=80&w=2000&auto=format&fit=crop')] bg-cover opacity-10 group-hover:opacity-20 transition-opacity duration-500 mix-blend-overlay"></div>
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#8AFD81]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[#8AFD81]/10 transition-colors duration-500"></div>
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#8AFD81] transition-colors">Infrastructure Status</h3>
                      <p className="text-xs text-slate-400">100MW Facility Overview & Controls</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-[#8AFD81] group-hover:scale-110 transition-all duration-300 shadow-lg border border-slate-700">
                      <svg className="w-5 h-5 text-white group-hover:text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700 backdrop-blur-sm group-hover:bg-slate-800/80 transition-colors">
                      <div className="text-slate-400 text-[9px] uppercase font-bold tracking-widest mb-0.5">Active Containers</div>
                      <div className="text-lg font-bold text-white">48/48</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700 backdrop-blur-sm group-hover:bg-slate-800/80 transition-colors">
                      <div className="text-slate-400 text-[9px] uppercase font-bold tracking-widest mb-0.5">Total Power</div>
                      <div className="text-lg font-bold text-[#8AFD81]">102 MW</div>
                    </div>
                  </div>
                </div>
              </div>
             </Link>

             <Link href="/mining-dashboard" className="group block h-full">
              <div className="bg-white rounded-[2rem] p-6 border border-slate-200 hover:border-[#8AFD81] transition-all duration-300 h-full relative overflow-hidden hover:shadow-xl">
                 <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-slate-100 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[#8AFD81]/5 transition-colors duration-500"></div>

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-[#8AFD81] transition-colors">Mining Fleet</h3>
                      <p className="text-xs text-slate-500">Hardware Performance Analytics</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-[#8AFD81] group-hover:scale-110 transition-all duration-300 shadow-sm border border-slate-100">
                      <svg className="w-5 h-5 text-slate-600 group-hover:text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:shadow-md transition-all">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8AFD81] shadow-[0_0_8px_#8AFD81]"></span>
                        <span className="text-xs font-semibold text-slate-700">S19 XP Hydro</span>
                      </div>
                      <span className="text-base font-bold text-slate-900">5,760 Units</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:shadow-md transition-all">
                       <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        <span className="text-xs font-semibold text-slate-700">Maintenance</span>
                      </div>
                      <span className="text-base font-bold text-slate-900">12 Units</span>
                    </div>
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