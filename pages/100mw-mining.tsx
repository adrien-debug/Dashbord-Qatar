/**
 * 100 Megawatt Mining Page
 * Dedicated view for the 100MW mining facility
 * Route: /100mw-mining
 */

import Head from 'next/head';
import { useState } from 'react';
import { TimeFilter, TimeRange, ExportButton } from '../components/dashboard';
import { AdvancedAreaChart } from '../components/charts';
import { formatNumber } from '../utils/formatNumber';
import {
  mockBitcoinKPIs,
  mockStrategicReserve,
  mockProductionHistory,
  mockHardwareStatus,
} from '../lib/mock-mining';
import {
  Zap,
  Server,
  Cpu,
  Activity,
  Thermometer,
  Gauge,
  TrendingUp,
  Battery,
  Wind,
  ChevronUp,
} from 'lucide-react';

export default function Mining100MW() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  const productionData = mockProductionHistory.slice(-30).map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    btc: d.btc,
  }));

  // Power distribution data
  const powerBlocks = [
    { id: 'A', name: 'Power Block A', load: 24.8, capacity: 25, status: 'optimal', temp: 42 },
    { id: 'B', name: 'Power Block B', load: 24.5, capacity: 25, status: 'optimal', temp: 41 },
    { id: 'C', name: 'Power Block C', load: 25.0, capacity: 25, status: 'optimal', temp: 43 },
    { id: 'D', name: 'Power Block D', load: 23.9, capacity: 25, status: 'warning', temp: 45 },
  ];

  const totalLoad = powerBlocks.reduce((sum, pb) => sum + pb.load, 0);
  const totalCapacity = powerBlocks.reduce((sum, pb) => sum + pb.capacity, 0);

  return (
    <>
      <Head>
        <title>100MW Mining Facility - Hearst Qatar</title>
        <meta name="description" content="100 Megawatt Bitcoin Mining Facility - Qatar Strategic Reserve" />
      </Head>

      <div className="min-h-screen bg-slate-50 bg-grid-slate-100 p-6 lg:p-8">
        <div className="max-w-[1600px] mx-auto">
          
          {/* BENTO GRID CONTAINER */}
          <div className="grid grid-cols-12 gap-4">
            
            {/* 1. HERO HEADER - Full Width */}
            <div className="col-span-12 relative h-[220px] rounded-2xl overflow-hidden bg-slate-900 animate-fade-in-up">
              {/* Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900" />
              <div className="absolute inset-0 bg-[url('/IMG_0700.JPG')] bg-cover opacity-30" style={{ backgroundPosition: 'center' }} />

              {/* Content */}
              <div className="absolute inset-0 z-20">
                {/* Top Left - Badges */}
                <div className="absolute top-6 left-8 lg:left-10 flex items-center gap-3">
                  <span className="px-3 py-1.5 bg-[#8AFD81] text-slate-900 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    100 MW Facility
                  </span>
                  <span className="px-3 py-1.5 bg-white/10 text-white/90 rounded-full text-[10px] font-medium backdrop-blur-md border border-white/10 uppercase tracking-widest">
                    Sovereign Mining
                  </span>
                  <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-500/30">
                    100% Green Energy
                  </span>
                </div>

                {/* Bottom Left - Title */}
                <div className="absolute bottom-6 left-8 lg:left-10">
                  <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
                    100 Megawatt <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80]">Mining Facility</span>
                  </h1>
                  <p className="text-slate-400 mt-2">Qatar Strategic Bitcoin Reserve - Industrial Scale Operations</p>
                </div>

                {/* Bottom Right - Time Filter */}
                <div className="absolute bottom-6 right-8 lg:right-10 flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700 backdrop-blur-sm">
                  <TimeFilter selected={timeRange} onChange={setTimeRange} options={['7d', '30d', '90d']} />
                  <ExportButton />
                </div>
              </div>
            </div>

            {/* 2. TOTAL POWER - 3 cols */}
            <div className="col-span-12 lg:col-span-3 rounded-2xl overflow-hidden border border-slate-200 hover:border-[#8AFD81]/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8AFD81]/10 animate-fade-in-up delay-100 flex flex-col">
              <div className="bg-slate-800 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-white" strokeWidth={1.5} />
                  <div>
                    <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                      Total Power
                    </div>
                    <div className="text-white text-xs">Active Load</div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 flex flex-col flex-1">
                <div className="flex items-end justify-center gap-2 mb-3">
                  <div className="text-4xl font-bold text-slate-900 tracking-tight tabular-nums">
                    {totalLoad.toFixed(1)}
                  </div>
                  <div className="text-xl font-medium text-slate-400 pb-1">MW</div>
                </div>
                <div className="text-center text-sm text-slate-500 mb-3">of {totalCapacity} MW capacity</div>
                <div className="relative w-full h-3 rounded-full overflow-hidden mt-auto">
                  <div className="absolute inset-0 bg-slate-200 rounded-full" />
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] rounded-full" 
                    style={{ width: `${(totalLoad / totalCapacity) * 100}%` }}
                  />
                </div>
                <div className="text-center text-xs text-[#8AFD81] font-semibold mt-2">
                  {((totalLoad / totalCapacity) * 100).toFixed(1)}% Utilization
                </div>
              </div>
            </div>

            {/* 3. HASHRATE - 3 cols */}
            <div className="col-span-12 lg:col-span-3 rounded-2xl overflow-hidden border border-slate-200 hover:border-[#8AFD81]/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8AFD81]/10 animate-fade-in-up delay-100 flex flex-col">
              <div className="bg-slate-800 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-white" strokeWidth={1.5} />
                  <div>
                    <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                      Total Hashrate
                    </div>
                    <div className="text-white text-xs">Network Power</div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 flex flex-col flex-1">
                <div className="flex items-end justify-center gap-2 mb-3">
                  <div className="text-4xl font-bold text-slate-900 tracking-tight tabular-nums">
                    {formatNumber(mockBitcoinKPIs.totalHashrate)}
                  </div>
                  <div className="text-xl font-medium text-slate-400 pb-1">PH/s</div>
                </div>
                <div className="flex items-center justify-center gap-1 mb-3">
                  <ChevronUp className="w-4 h-4 text-[#8AFD81]" />
                  <span className="text-sm font-bold text-[#8AFD81]">+3.2%</span>
                  <span className="text-xs text-slate-500">vs last week</span>
                </div>
                <div className="flex items-center justify-center gap-6 mt-auto pt-3 border-t border-slate-100">
                  <div className="text-center">
                    <div className="text-xs text-slate-500">Target</div>
                    <div className="text-sm font-bold text-slate-900">1,000 PH/s</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-slate-500">Efficiency</div>
                    <div className="text-sm font-bold text-slate-900">{mockBitcoinKPIs.efficiency} J/TH</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. DAILY BTC - 3 cols */}
            <div className="col-span-12 lg:col-span-3 rounded-2xl overflow-hidden border border-slate-200 hover:border-[#8AFD81]/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8AFD81]/10 animate-fade-in-up delay-100 flex flex-col">
              <div className="bg-slate-800 px-4 py-3">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-white" strokeWidth={1.5} />
                  <div>
                    <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                      Daily Production
                    </div>
                    <div className="text-white text-xs">BTC Mined</div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 flex flex-col flex-1">
                <div className="flex items-end justify-center gap-2 mb-3">
                  <div className="text-4xl font-bold text-slate-900 tracking-tight tabular-nums">
                    {mockBitcoinKPIs.dailyProduction}
                  </div>
                  <div className="text-xl font-medium text-slate-400 pb-1">BTC</div>
                </div>
                <div className="flex items-center justify-center gap-1 mb-3">
                  <ChevronUp className="w-4 h-4 text-[#8AFD81]" />
                  <span className="text-sm font-bold text-[#8AFD81]">+2.1%</span>
                </div>
                <div className="flex items-center justify-center gap-6 mt-auto pt-3 border-t border-slate-100">
                  <div className="text-center">
                    <div className="text-xs text-slate-500">Monthly</div>
                    <div className="text-sm font-bold text-slate-900">~{(mockBitcoinKPIs.dailyProduction * 30).toFixed(0)} BTC</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-slate-500">Value</div>
                    <div className="text-sm font-bold text-slate-900">${(mockBitcoinKPIs.dailyProduction * 98450 / 1000).toFixed(0)}k</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. MINERS - 3 cols */}
            <div className="col-span-12 lg:col-span-3 rounded-2xl overflow-hidden border border-slate-200 hover:border-[#8AFD81]/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8AFD81]/10 animate-fade-in-up delay-100 flex flex-col">
              <div className="bg-slate-800 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Cpu className="w-5 h-5 text-white" strokeWidth={1.5} />
                  <div>
                    <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                      Mining Fleet
                    </div>
                    <div className="text-white text-xs">S19 XP Hydro</div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 flex flex-col flex-1">
                <div className="flex items-end justify-center gap-2 mb-3">
                  <div className="text-4xl font-bold text-slate-900 tracking-tight tabular-nums">
                    {formatNumber(mockHardwareStatus.activeMiners)}
                  </div>
                  <div className="text-xl font-medium text-slate-400 pb-1">units</div>
                </div>
                <div className="text-center text-sm text-[#8AFD81] font-semibold mb-3">
                  {((mockHardwareStatus.activeMiners / mockHardwareStatus.totalMiners) * 100).toFixed(1)}% Online
                </div>
                <div className="flex items-center justify-center gap-6 mt-auto pt-3 border-t border-slate-100">
                  <div className="text-center">
                    <div className="text-xs text-slate-500">Maintenance</div>
                    <div className="text-sm font-bold text-amber-500">{mockHardwareStatus.maintenanceMiners}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-slate-500">Containers</div>
                    <div className="text-sm font-bold text-slate-900">48</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section Title - Power Blocks */}
            <div className="col-span-12 flex items-center gap-4 mt-6 mb-2">
              <Battery className="w-8 h-8 text-[#8AFD81]" strokeWidth={1.5} />
              <h2 className="text-2xl font-bold text-slate-900">Power Block Distribution</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent"></div>
            </div>

            {/* Power Blocks Grid */}
            {powerBlocks.map((block, idx) => (
              <div key={block.id} className={`col-span-12 lg:col-span-3 rounded-2xl overflow-hidden border border-slate-200 hover:border-[#8AFD81]/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8AFD81]/10 animate-fade-in-up delay-${(idx + 1) * 100}`}>
                <div className="bg-slate-800 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Server className="w-5 h-5 text-white" strokeWidth={1.5} />
                      <div>
                        <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                          {block.name}
                        </div>
                        <div className="text-white text-xs">25 MW Capacity</div>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      block.status === 'optimal' 
                        ? 'bg-[#8AFD81]/20 text-[#8AFD81] border-[#8AFD81]/30' 
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${block.status === 'optimal' ? 'bg-[#8AFD81] animate-pulse' : 'bg-amber-400'}`} />
                      {block.status}
                    </span>
                  </div>
                </div>
                <div className="bg-white p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-600">Load</span>
                    </div>
                    <span className="text-lg font-bold text-slate-900">{block.load} MW</span>
                  </div>
                  <div className="relative w-full h-2 rounded-full overflow-hidden mb-4">
                    <div className="absolute inset-0 bg-slate-200 rounded-full" />
                    <div 
                      className={`absolute inset-y-0 left-0 rounded-full ${block.status === 'optimal' ? 'bg-[#8AFD81]' : 'bg-amber-400'}`}
                      style={{ width: `${(block.load / block.capacity) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-600">Temp</span>
                    </div>
                    <span className={`text-sm font-bold ${block.temp > 44 ? 'text-amber-500' : 'text-slate-900'}`}>{block.temp}°C</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Section Title - Production */}
            <div className="col-span-12 flex items-center gap-4 mt-6 mb-2">
              <TrendingUp className="w-8 h-8 text-[#8AFD81]" strokeWidth={1.5} />
              <h2 className="text-2xl font-bold text-slate-900">Production Analytics</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent"></div>
            </div>

            {/* Production Chart */}
            <div className="col-span-12 rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300 animate-fade-in-up delay-300">
              <div className="bg-slate-800 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-white" strokeWidth={1.5} />
                    <div>
                      <div className="text-white text-base font-semibold">
                        BTC Production Trend
                      </div>
                      <div className="text-slate-400 text-sm">Daily output over the last 30 days</div>
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
              <div className="bg-white p-6">
                <div className="h-[380px] w-full">
                  <AdvancedAreaChart
                    data={productionData}
                    areas={[
                      { dataKey: 'btc', name: 'BTC Production', color: '#8AFD81' },
                    ]}
                    xAxisKey="date"
                    height={380}
                    showGrid={true}
                    showLegend={false}
                    showReferenceLine={true}
                    unit="BTC"
                  />
                </div>
              </div>
            </div>

            {/* Green Energy Section */}
            <div className="col-span-12 lg:col-span-6 rounded-2xl overflow-hidden border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white animate-fade-in-up delay-300">
              <div className="bg-emerald-600 px-6 py-4">
                <div className="flex items-center gap-3">
                  <Wind className="w-5 h-5 text-white" strokeWidth={1.5} />
                  <div>
                    <div className="text-white text-base font-semibold">
                      100% Renewable Energy
                    </div>
                    <div className="text-emerald-100 text-sm">Zero Carbon Footprint</div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600">0</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">CO₂ Emissions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600">100%</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Solar & Wind</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600">1.05</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">PUE Rating</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Strategic Reserve */}
            <div className="col-span-12 lg:col-span-6 rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 animate-fade-in-up delay-300">
              <div className="bg-slate-800 px-6 py-4">
                <div className="flex items-center gap-3">
                  <Gauge className="w-5 h-5 text-white" strokeWidth={1.5} />
                  <div>
                    <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-base font-semibold">
                      Strategic Reserve
                    </div>
                    <div className="text-slate-400 text-sm">Accumulated BTC Holdings</div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] to-[#4ade80]">
                      {mockStrategicReserve.totalBTC}
                    </div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Total BTC</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">
                      ${(mockStrategicReserve.currentValue / 1000000).toFixed(0)}M
                    </div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">USD Value</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">
                      +{mockStrategicReserve.monthlyAccumulation}
                    </div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Monthly BTC</div>
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

