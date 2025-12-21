import Head from 'next/head';
import { useState } from 'react';
import { TimeFilter, TimeRange, ExportButton } from '../components/dashboard';
import { formatNumber } from '../utils/formatNumber';
import {
  AdvancedLineChart,
  AdvancedAreaChart,
  Heatmap,
} from '../components/charts';
import {
  mockBitcoinKPIs,
  mockHardwareStatus,
  mockHashrateHistory,
  mockProductionHistory,
  mockReserveHistory,
  mockContainerPerformance,
} from '../lib/mock-mining';
import {
  Cpu,
  Activity,
  Zap,
  BarChart3,
  Server,
  ChevronUp,
  TrendingUp,
} from 'lucide-react';

export default function MiningDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  const getDaysFromRange = (range: TimeRange): number => {
    switch (range) {
      case '7d': return 7;
      case '30d': return 30;
      case '90d': return 90;
      default: return 30;
    }
  };

  const days = getDaysFromRange(timeRange);
  const filteredHashrate = mockHashrateHistory.slice(-days);
  const filteredProduction = mockProductionHistory.slice(-days);

  const hashrateChartData = filteredHashrate.map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    total: d.hashrate,
  }));

  const productionChartData = filteredProduction.map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    btc: d.btc,
  }));

  const reserveChartData = mockReserveHistory.slice(-90).map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    btc: d.btc,
  }));

  // Group Heatmap Data by Power Block (6 Blocks of 8 Containers)
  const powerBlocks = Array.from({ length: 6 }, (_, i) => {
    const startIdx = i * 8;
    const endIdx = startIdx + 8;
    const blockContainers = mockContainerPerformance.slice(startIdx, endIdx);
    
    return {
      id: `PB-${i + 1}`,
      name: `Power Block ${String.fromCharCode(65 + i)}`,
      containers: blockContainers.map(c => ({
        id: c.id,
        value: c.performance,
        label: c.id.split('-')[1],
        status: c.status as 'optimal' | 'warning' | 'critical' | 'offline',
      }))
    };
  });

  return (
    <>
      <Head>
        <title>Mining Analytics - Hearst Qatar</title>
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
                    Operations
                  </span>
                  <span className="px-3 py-1.5 bg-white/10 text-white/90 rounded-full text-[10px] font-medium backdrop-blur-md border border-white/10 uppercase tracking-widest">
                    Real-time Analytics
                  </span>
                </div>

                {/* Bottom Left - Title */}
                <div className="absolute bottom-6 left-8 lg:left-10">
                  <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
                    Mining <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80]">Command Center</span>
                  </h1>
                </div>

                {/* Bottom Right - Time Filter */}
                <div className="absolute bottom-6 right-8 lg:right-10 flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700 backdrop-blur-sm">
                  <TimeFilter selected={timeRange} onChange={setTimeRange} options={['7d', '30d', '90d']} />
                  <ExportButton />
                </div>
              </div>
            </div>

            {/* 2. FLEET STATUS - 4 cols */}
            <div className="col-span-12 lg:col-span-4 rounded-2xl overflow-hidden border border-slate-200 hover:border-[#8AFD81]/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8AFD81]/10 animate-fade-in-up delay-100 flex flex-col">
              {/* Header - Dark */}
              <div className="bg-slate-800 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Cpu className="w-5 h-5 text-white" strokeWidth={1.5} />
                    <div>
                      <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                        Fleet Status
                      </div>
                      <div className="text-white text-xs">Miner Operations</div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#8AFD81]/20 text-[#8AFD81] rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#8AFD81]/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8AFD81] animate-pulse" />
                    Live
                  </span>
                </div>
              </div>
              
              {/* Body - White */}
              <div className="bg-white p-3 flex flex-col flex-1">
                {/* Main Value - Centered */}
                <div className="flex items-end justify-center gap-3 mb-4">
                  <div className="text-3xl font-bold text-slate-900 tracking-tight tabular-nums">
                    {((mockHardwareStatus.activeMiners / mockHardwareStatus.totalMiners) * 100).toFixed(1)}
                  </div>
                  <div className="text-lg font-medium text-slate-400 pb-1">%</div>
                  <div className="flex items-center gap-1 ml-2 pb-1">
                    <ChevronUp className="w-5 h-5 text-[#8AFD81]" />
                    <span className="text-sm font-bold text-[#8AFD81]">Operational</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative w-full h-4 rounded-full overflow-hidden mb-6">
                  <div className="absolute inset-0 bg-slate-200 rounded-full" />
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] rounded-full" 
                    style={{ width: '99.2%' }}
                  />
                </div>

                {/* Stats */}
                <div className="flex items-center justify-center gap-10 pt-4 border-t border-slate-100 mt-auto">
                  <div className="text-center flex-1">
                    <div className="text-slate-500 text-xs uppercase tracking-widest font-semibold mb-1">Active</div>
                    <div className="text-sm font-bold text-slate-900 tabular-nums tracking-tight">
                      {formatNumber(mockHardwareStatus.activeMiners)}
                    </div>
                  </div>
                  <div className="w-px h-10 bg-slate-200"></div>
                  <div className="text-center flex-1">
                    <div className="text-slate-500 text-xs uppercase tracking-widest font-semibold mb-1">Maintenance</div>
                    <div className="text-sm font-bold text-slate-900 tabular-nums tracking-tight">
                      {mockHardwareStatus.maintenanceMiners}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. HASHRATE - 4 cols */}
            <div className="col-span-12 lg:col-span-4 rounded-2xl overflow-hidden border border-slate-200 hover:border-[#8AFD81]/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8AFD81]/10 animate-fade-in-up delay-100 flex flex-col">
              {/* Header - Dark */}
              <div className="bg-slate-800 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-white" strokeWidth={1.5} />
                    <div>
                      <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                        Total Hashrate
                      </div>
                      <div className="text-white text-xs">Network Power</div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#8AFD81]/20 text-[#8AFD81] rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#8AFD81]/30">
                    Optimal
                  </span>
                </div>
              </div>
              
              {/* Body - White */}
              <div className="bg-white p-3 flex flex-col flex-1">
                {/* Main Value - Centered */}
                <div className="flex items-end justify-center gap-3 mb-4">
                  <div className="text-3xl font-bold text-slate-900 tracking-tight tabular-nums">
                    {formatNumber(mockBitcoinKPIs.totalHashrate)}
                  </div>
                  <div className="text-lg font-medium text-slate-400 pb-1">PH/s</div>
                </div>

                {/* Mini Chart */}
                <div className="flex items-end gap-1.5 h-24 mb-3 pt-4 border-t border-slate-100">
                  {[45, 52, 48, 55, 60, 58, 65, 70, 68, 75, 72, 80, 78, 85, 82].map((h, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-gradient-to-t from-[#8AFD81]/30 to-[#8AFD81] rounded-t-sm hover:from-[#8AFD81]/50 hover:to-[#b6ffb0] transition-all cursor-pointer" 
                      style={{ height: `${h}%` }} 
                    />
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-center gap-10 pt-4 border-t border-slate-100 mt-auto">
                  <div className="text-center flex-1">
                    <div className="text-slate-500 text-xs uppercase tracking-widest font-semibold mb-1">Target</div>
                    <div className="text-sm font-bold text-slate-900 tabular-nums tracking-tight">
                      1,000 <span className="text-slate-400 font-medium text-sm">PH/s</span>
                    </div>
                  </div>
                  <div className="w-px h-10 bg-slate-200"></div>
                  <div className="text-center flex-1">
                    <div className="text-slate-500 text-xs uppercase tracking-widest font-semibold mb-1">Efficiency</div>
                    <div className="text-sm font-bold text-slate-900 tabular-nums tracking-tight">
                      {mockBitcoinKPIs.efficiency} <span className="text-slate-400 font-medium text-sm">J/TH</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. DAILY PRODUCTION - 4 cols */}
            <div className="col-span-12 lg:col-span-4 rounded-2xl overflow-hidden border border-slate-200 hover:border-[#8AFD81]/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8AFD81]/10 animate-fade-in-up delay-100 flex flex-col">
              {/* Header - Dark */}
              <div className="bg-slate-800 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-white" strokeWidth={1.5} />
                    <div>
                      <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                        Daily Production
                      </div>
                      <div className="text-white text-xs">BTC Mined</div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#8AFD81]/20 text-[#8AFD81] rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#8AFD81]/30">
                    Stable
                  </span>
                </div>
              </div>
              
              {/* Body - White */}
              <div className="bg-white p-3 flex flex-col flex-1">
                {/* Main Value - Centered */}
                <div className="flex items-end justify-center gap-3 mb-4">
                  <div className="text-3xl font-bold text-slate-900 tracking-tight tabular-nums">
                    {mockBitcoinKPIs.dailyProduction}
                  </div>
                  <div className="text-lg font-medium text-slate-400 pb-1">BTC</div>
                  <div className="flex items-center gap-1 ml-2 pb-1">
                    <ChevronUp className="w-5 h-5 text-[#8AFD81]" />
                    <span className="text-sm font-bold text-[#8AFD81]">+2.1%</span>
                  </div>
                </div>

                {/* Area Chart */}
                <div className="relative h-24 pt-4 border-t border-slate-100">
                  <svg className="w-full h-full" viewBox="0 0 300 80" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="prodGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#8AFD81" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#8AFD81" stopOpacity="0.05" />
                      </linearGradient>
                    </defs>
                    <path d="M0,60 Q50,50 100,45 T200,35 T300,20 L300,80 L0,80 Z" fill="url(#prodGradient)" />
                    <path d="M0,60 Q50,50 100,45 T200,35 T300,20" fill="none" stroke="#8AFD81" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-center gap-10 pt-4 border-t border-slate-100 mt-auto">
                  <div className="text-center flex-1">
                    <div className="text-slate-500 text-xs uppercase tracking-widest font-semibold mb-1">Revenue</div>
                    <div className="text-sm font-bold text-slate-900 tabular-nums tracking-tight">
                      ${(mockBitcoinKPIs.dailyProduction * 98450 / 1000).toFixed(0)}k
                    </div>
                  </div>
                  <div className="w-px h-10 bg-slate-200"></div>
                  <div className="text-center flex-1">
                    <div className="text-slate-500 text-xs uppercase tracking-widest font-semibold mb-1">Monthly</div>
                    <div className="text-sm font-bold text-slate-900 tabular-nums tracking-tight">
                      ~{(mockBitcoinKPIs.dailyProduction * 30).toFixed(0)} <span className="text-slate-400 font-medium text-sm">BTC</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section Title - Performance */}
            <div className="col-span-12 flex items-center gap-4 mt-6 mb-2">
              <BarChart3 className="w-10 h-10 text-[#8AFD81]" strokeWidth={1.5} />
              <h2 className="text-4xl font-bold text-slate-900">Performance Analytics</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent"></div>
            </div>

            {/* 5. HASHRATE EVOLUTION - Full Width */}
            <div className="col-span-12 rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300 animate-fade-in-up delay-300">
              {/* Header - Dark */}
              <div className="bg-slate-800 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-white" strokeWidth={1.5} />
                    <div>
                      <div className="text-white text-base font-semibold">
                        Hashrate Evolution
                      </div>
                      <div className="text-slate-400 text-sm">Network performance analysis over time</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-slate-400 uppercase tracking-wider">Current</div>
                      <div className="text-lg font-bold text-white tabular-nums">
                        {formatNumber(mockBitcoinKPIs.totalHashrate)} PH/s
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg text-xs font-medium">
                      <span className="w-2 h-2 rounded-full bg-[#8AFD81]" />
                      Live
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Body - White */}
              <div className="bg-white p-6">
                <AdvancedLineChart
                  data={hashrateChartData}
                  lines={[
                    { dataKey: 'total', name: 'Total Hashrate', color: '#8AFD81', strokeWidth: 2 },
                  ]}
                  xAxisKey="date"
                  height={380}
                  showGrid={true}
                  showLegend={false}
                  showArea={true}
                  yAxisLabel="PH/s"
                  unit="PH/s"
                />
              </div>
            </div>

            {/* 6. ACCUMULATION - 6 cols */}
            <div className="col-span-12 lg:col-span-6 rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300 animate-fade-in-up delay-300">
              <div className="bg-slate-800 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-white" strokeWidth={1.5} />
                    <div>
                      <div className="text-white text-base font-semibold">
                        BTC Accumulation
                      </div>
                      <div className="text-slate-400 text-sm">Strategic reserve growth (90 days)</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400 uppercase tracking-wider">Total</div>
                    <div className="text-lg font-bold text-white tabular-nums">
                      {reserveChartData[reserveChartData.length - 1]?.btc.toFixed(0)} BTC
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6">
                <AdvancedAreaChart
                  data={reserveChartData}
                  areas={[{ dataKey: 'btc', name: 'BTC Reserve', color: '#8AFD81' }]}
                  xAxisKey="date"
                  height={320}
                  showGrid={true}
                  showLegend={false}
                  showReferenceLine={true}
                  unit="BTC"
                />
              </div>
            </div>

            {/* 7. DAILY OUTPUT - 6 cols */}
            <div className="col-span-12 lg:col-span-6 rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300 animate-fade-in-up delay-300">
              <div className="bg-slate-800 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-white" strokeWidth={1.5} />
                    <div>
                      <div className="text-white text-base font-semibold">
                        Daily Production
                      </div>
                      <div className="text-slate-400 text-sm">BTC mined per day</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400 uppercase tracking-wider">Average</div>
                    <div className="text-lg font-bold text-white tabular-nums">
                      {(productionChartData.reduce((sum, d) => sum + d.btc, 0) / productionChartData.length).toFixed(3)} BTC
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6">
                <AdvancedAreaChart
                  data={productionChartData}
                  areas={[{ dataKey: 'btc', name: 'Daily BTC', color: '#8AFD81' }]}
                  xAxisKey="date"
                  height={320}
                  showGrid={true}
                  showLegend={false}
                  showReferenceLine={true}
                  unit="BTC"
                />
              </div>
            </div>

            {/* Section Title - Infrastructure */}
            <div className="col-span-12 flex items-center gap-4 mt-6 mb-2">
              <Server className="w-10 h-10 text-[#8AFD81]" strokeWidth={1.5} />
              <h2 className="text-4xl font-bold text-slate-900">Infrastructure Heatmap</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent"></div>
            </div>

            {/* 7. INFRASTRUCTURE HEATMAP - Full Width */}
            <div className="col-span-12 rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300 animate-fade-in-up delay-300">
              {/* Header - Dark */}
              <div className="bg-slate-800 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Server className="w-5 h-5 text-white" strokeWidth={1.5} />
                    <div>
                      <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                        Container Status
                      </div>
                      <div className="text-slate-400 text-xs">Real-time status of 48 Hydro Containers by Power Block</div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#8AFD81]/20 text-[#8AFD81] rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#8AFD81]/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8AFD81] animate-pulse" />
                    Live Monitoring
                  </span>
                </div>
              </div>
              
              {/* Body - White */}
              <div className="bg-white p-8">
                {/* 6 Power Blocks Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {powerBlocks.map((block) => (
                    <div key={block.id} className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 hover:border-slate-200 transition-colors">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#8AFD81]"></div>
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">{block.name}</span>
                        </div>
                        <span className="text-[10px] font-medium text-slate-400">8 Units</span>
                      </div>
                      
                      <Heatmap
                        data={block.containers}
                        rows={2}
                        cols={4}
                        cellSize={40}
                        showLabels={true}
                        onCellClick={() => {}}
                      />
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center justify-center gap-4 mt-8 pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#8AFD81] shadow-sm" />
                    <span className="text-xs font-semibold text-slate-600">Optimal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#f59e0b] shadow-sm" />
                    <span className="text-xs font-semibold text-slate-600">Warning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ef4444] shadow-sm" />
                    <span className="text-xs font-semibold text-slate-600">Critical</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-300 border border-slate-200" />
                    <span className="text-xs font-semibold text-slate-400">Offline</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
