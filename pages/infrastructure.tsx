import Head from 'next/head';
import { useState } from 'react';
import { TimeFilter, TimeRange, ExportButton } from '../components/dashboard';
import {
  AdvancedLineChart,
  AdvancedAreaChart,
} from '../components/charts';
import {
  mockPowerSystems,
  mockCoolingSystems,
  mockPowerHistory,
  mockPowerHistory7Days,
  mockPowerHistory30Days,
  mockSystemUptime,
  mockEfficiencyHistory,
} from '../lib/mock-infrastructure';
import {
  Server,
  Zap,
  Activity,
  Thermometer,
  Gauge,
  ChevronUp,
  Cpu,
  Droplets,
} from 'lucide-react';

export default function Infrastructure() {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');

  const powerSystems = mockPowerSystems;
  const coolingSystems = mockCoolingSystems;

  const totalLoad = powerSystems.reduce((sum, sys) => sum + sys.currentLoad, 0);
  const avgEfficiency = (powerSystems.reduce((sum, sys) => sum + sys.efficiency, 0) / powerSystems.length).toFixed(1);
  const systemUptime = 99.8;
  const avgTemp = (powerSystems.reduce((sum, sys) => sum + sys.temperature, 0) / powerSystems.length).toFixed(1);

  const getPowerData = () => {
    switch (timeRange) {
      case '24h': return mockPowerHistory;
      case '7d': return mockPowerHistory7Days;
      case '30d': return mockPowerHistory30Days;
      default: return mockPowerHistory;
    }
  };

  const powerData = getPowerData().map(d => ({
    time: 'date' in d ? new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : d.hour,
    total: d.total,
  }));

  const uptimeData = mockSystemUptime.map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    overall: d.overall,
  }));

  const efficiencyData = mockEfficiencyHistory.map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    avg: (d.pb1 + d.pb2 + d.pb3 + d.pb4) / 4,
  }));

  return (
    <>
      <Head>
        <title>Infrastructure Monitoring - Hearst Qatar</title>
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
                    Infrastructure
                  </span>
                  <span className="px-3 py-1.5 bg-white/10 text-white/90 rounded-full text-[10px] font-medium backdrop-blur-md border border-white/10 uppercase tracking-widest">
                    100MW Facility
                  </span>
                </div>

                {/* Bottom Left - Title */}
                <div className="absolute bottom-6 left-8 lg:left-10">
                  <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
                    Infrastructure <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80]">Monitoring</span>
                  </h1>
                </div>

                {/* Bottom Right - Time Filter */}
                <div className="absolute bottom-6 right-8 lg:right-10 flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700 backdrop-blur-sm">
                  <TimeFilter selected={timeRange} onChange={setTimeRange} options={['24h', '7d', '30d']} />
                  <ExportButton />
                </div>
              </div>
            </div>

            {/* 2. SYSTEM UPTIME - 3 cols */}
            <div className="col-span-12 lg:col-span-3 rounded-2xl overflow-hidden border border-slate-200 hover:border-[#8AFD81]/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8AFD81]/10 animate-fade-in-up delay-100 flex flex-col">
              {/* Header - Dark */}
              <div className="bg-slate-800 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-white" strokeWidth={1.5} />
                  <div>
                    <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                      System Uptime
                    </div>
                    <div className="text-white text-xs">Last 30 days</div>
                  </div>
                </div>
              </div>
              
              {/* Body - White */}
              <div className="bg-white p-3 flex flex-col flex-1">
                <div className="flex items-end justify-center gap-3 mb-4">
                  <div className="text-3xl font-bold text-slate-900 tracking-tight tabular-nums">
                    {systemUptime}
                  </div>
                  <div className="text-lg font-medium text-slate-400 pb-1">%</div>
                  <div className="flex items-center gap-1 ml-2 pb-1">
                    <ChevronUp className="w-5 h-5 text-[#8AFD81]" />
                    <span className="text-sm font-bold text-[#8AFD81]">Optimal</span>
                  </div>
                </div>

                <div className="relative w-full h-4 rounded-full overflow-hidden mt-auto">
                  <div className="absolute inset-0 bg-slate-200 rounded-full" />
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] rounded-full" 
                    style={{ width: `${systemUptime}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 3. TOTAL LOAD - 3 cols */}
            <div className="col-span-12 lg:col-span-3 rounded-2xl overflow-hidden border border-slate-200 hover:border-[#8AFD81]/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8AFD81]/10 animate-fade-in-up delay-100 flex flex-col">
              {/* Header - Dark */}
              <div className="bg-slate-800 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-white" strokeWidth={1.5} />
                  <div>
                    <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                      Total Load
                    </div>
                    <div className="text-white text-xs">Power consumption</div>
                  </div>
                </div>
              </div>
              
              {/* Body - White */}
              <div className="bg-white p-3 flex flex-col flex-1">
                <div className="flex items-end justify-center gap-3 mb-4">
                  <div className="text-3xl font-bold text-slate-900 tracking-tight tabular-nums">
                    {totalLoad.toFixed(1)}
                  </div>
                  <div className="text-lg font-medium text-slate-400 pb-1">MW</div>
                </div>

                <div className="text-center text-sm text-slate-500 mb-4">of 100 MW capacity</div>

                <div className="relative w-full h-4 rounded-full overflow-hidden mt-auto">
                  <div className="absolute inset-0 bg-slate-200 rounded-full" />
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] rounded-full" 
                    style={{ width: `${totalLoad}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 4. EFFICIENCY - 3 cols */}
            <div className="col-span-12 lg:col-span-3 rounded-2xl overflow-hidden border border-slate-200 hover:border-[#8AFD81]/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8AFD81]/10 animate-fade-in-up delay-100 flex flex-col">
              {/* Header - Dark */}
              <div className="bg-slate-800 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Gauge className="w-5 h-5 text-white" strokeWidth={1.5} />
                  <div>
                    <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                      Efficiency
                    </div>
                    <div className="text-white text-xs">Power systems</div>
                  </div>
                </div>
              </div>
              
              {/* Body - White */}
              <div className="bg-white p-3 flex flex-col flex-1">
                <div className="flex items-end justify-center gap-3 mb-4">
                  <div className="text-3xl font-bold text-slate-900 tracking-tight tabular-nums">
                    {avgEfficiency}
                  </div>
                  <div className="text-lg font-medium text-slate-400 pb-1">%</div>
                  <div className="flex items-center gap-1 ml-2 pb-1">
                    <ChevronUp className="w-5 h-5 text-[#8AFD81]" />
                    <span className="text-sm font-bold text-[#8AFD81]">High</span>
                  </div>
                </div>

                <div className="relative w-full h-4 rounded-full overflow-hidden mt-auto">
                  <div className="absolute inset-0 bg-slate-200 rounded-full" />
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] rounded-full" 
                    style={{ width: `${avgEfficiency}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 5. TEMPERATURE - 3 cols */}
            <div className="col-span-12 lg:col-span-3 rounded-2xl overflow-hidden border border-slate-200 hover:border-[#8AFD81]/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8AFD81]/10 animate-fade-in-up delay-100 flex flex-col">
              {/* Header - Dark */}
              <div className="bg-slate-800 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Thermometer className="w-5 h-5 text-white" strokeWidth={1.5} />
                  <div>
                    <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                      Temperature
                    </div>
                    <div className="text-white text-xs">Average</div>
                  </div>
                </div>
              </div>
              
              {/* Body - White */}
              <div className="bg-white p-3 flex flex-col flex-1">
                <div className="flex items-end justify-center gap-3 mb-4">
                  <div className="text-3xl font-bold text-slate-900 tracking-tight tabular-nums">
                    {avgTemp}
                  </div>
                  <div className="text-lg font-medium text-slate-400 pb-1">°C</div>
                  <div className="flex items-center gap-1 ml-2 pb-1">
                    <ChevronUp className="w-5 h-5 text-[#8AFD81] rotate-180" />
                    <span className="text-sm font-bold text-[#8AFD81]">Normal</span>
                  </div>
                </div>

                <div className="relative w-full h-4 rounded-full overflow-hidden mt-auto">
                  <div className="absolute inset-0 bg-slate-200 rounded-full" />
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] rounded-full" 
                    style={{ width: `${(parseFloat(avgTemp) / 50) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Section Title - Power Monitoring */}
            <div className="col-span-12 flex items-center gap-4 mt-6 mb-2">
              <Zap className="w-10 h-10 text-[#8AFD81]" strokeWidth={1.5} />
              <h2 className="text-2xl font-bold text-slate-900">Power Monitoring</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent"></div>
            </div>

            {/* 6. POWER LOAD CHART - Full Width */}
            <div className="col-span-12 rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300 animate-fade-in-up delay-300">
              {/* Header - Dark */}
              <div className="bg-slate-800 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-white" strokeWidth={1.5} />
                    <div>
                      <div className="text-white text-base font-semibold">
                        Power Load Monitoring
                      </div>
                      <div className="text-slate-400 text-sm">Real-time power consumption across facility</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-slate-400 uppercase tracking-wider">Current Load</div>
                      <div className="text-lg font-bold text-white tabular-nums">{totalLoad.toFixed(1)} MW</div>
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
                <AdvancedAreaChart
                  data={powerData}
                  areas={[
                    { dataKey: 'total', name: 'Total Load', color: '#8AFD81' },
                  ]}
                  xAxisKey="time"
                  height={380}
                  showGrid={true}
                  showLegend={false}
                  showReferenceLine={true}
                  yAxisLabel="MW"
                  unit="MW"
                />
              </div>
            </div>

            {/* 7. UPTIME CHART - 6 cols */}
            <div className="col-span-12 lg:col-span-6 rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300 animate-fade-in-up delay-300">
              {/* Header - Dark */}
              <div className="bg-slate-800 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-white" strokeWidth={1.5} />
                    <div>
                      <div className="text-white text-base font-semibold">
                        System Uptime
                      </div>
                      <div className="text-slate-400 text-sm">Reliability trend (30 days)</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Average</div>
                    <div className="text-lg font-bold text-white">{systemUptime}%</div>
                  </div>
                </div>
              </div>
              
              {/* Body - White */}
              <div className="bg-white p-6">
                <AdvancedLineChart
                  data={uptimeData}
                  lines={[
                    { dataKey: 'overall', name: 'Uptime', color: '#8AFD81', strokeWidth: 2 },
                  ]}
                  xAxisKey="date"
                  height={320}
                  showGrid={true}
                  showLegend={false}
                  showArea={true}
                  yAxisLabel="%"
                  unit="%"
                />
              </div>
            </div>

            {/* 8. EFFICIENCY CHART - 6 cols */}
            <div className="col-span-12 lg:col-span-6 rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300 animate-fade-in-up delay-300">
              {/* Header - Dark */}
              <div className="bg-slate-800 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Gauge className="w-5 h-5 text-white" strokeWidth={1.5} />
                    <div>
                      <div className="text-white text-base font-semibold">
                        Operational Efficiency
                      </div>
                      <div className="text-slate-400 text-sm">Performance trend (30 days)</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Average</div>
                    <div className="text-lg font-bold text-white">{avgEfficiency}%</div>
                  </div>
                </div>
              </div>
              
              {/* Body - White */}
              <div className="bg-white p-6">
                <AdvancedLineChart
                  data={efficiencyData}
                  lines={[
                    { dataKey: 'avg', name: 'Efficiency', color: '#8AFD81', strokeWidth: 2 },
                  ]}
                  xAxisKey="date"
                  height={320}
                  showGrid={true}
                  showLegend={false}
                  showArea={true}
                  yAxisLabel="%"
                  unit="%"
                />
              </div>
            </div>

            {/* Section Title - System Status */}
            <div className="col-span-12 flex items-center gap-4 mt-6 mb-2">
              <Server className="w-10 h-10 text-[#8AFD81]" strokeWidth={1.5} />
              <h2 className="text-2xl font-bold text-slate-900">System Status</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent"></div>
            </div>

            {/* 9. POWER SYSTEMS - Full Width */}
            <div className="col-span-12 rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300 animate-fade-in-up delay-300">
              {/* Header - Dark */}
              <div className="bg-slate-800 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Cpu className="w-5 h-5 text-white" strokeWidth={1.5} />
                    <div>
                      <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                        Power Systems
                      </div>
                      <div className="text-slate-400 text-xs">4 Power Blocks Status</div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#8AFD81]/20 text-[#8AFD81] rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#8AFD81]/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8AFD81] animate-pulse" />
                    All Online
                  </span>
                </div>
              </div>
              
              {/* Body - White */}
              <div className="bg-white p-3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {powerSystems.map(system => (
                    <div key={system.id} className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-[#8AFD81]/30 transition-colors">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-[#8AFD81] animate-pulse"></div>
                        <span className="text-sm font-bold text-slate-900">{system.name}</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-500">Load</span>
                          <span className="text-sm font-bold text-slate-900">{system.currentLoad} MW</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-500">Efficiency</span>
                          <span className="text-sm font-bold text-slate-900">{system.efficiency}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-500">Temperature</span>
                          <span className="text-sm font-bold text-slate-900">{system.temperature}°C</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 10. COOLING SYSTEMS - Full Width */}
            <div className="col-span-12 rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300 animate-fade-in-up delay-300">
              {/* Header - Dark */}
              <div className="bg-slate-800 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Droplets className="w-5 h-5 text-white" strokeWidth={1.5} />
                    <div>
                      <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                        Cooling Systems
                      </div>
                      <div className="text-slate-400 text-xs">Hydro Cooling Status</div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#8AFD81]/20 text-[#8AFD81] rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#8AFD81]/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8AFD81] animate-pulse" />
                    Optimal
                  </span>
                </div>
              </div>
              
              {/* Body - White */}
              <div className="bg-white p-3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {coolingSystems.map(system => (
                    <div key={system.id} className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-[#8AFD81]/30 transition-colors">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-[#8AFD81] animate-pulse"></div>
                        <span className="text-sm font-bold text-slate-900">{system.name}</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-500">Flow Rate</span>
                          <span className="text-sm font-bold text-slate-900">{system.flowRate} L/min</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-500">ΔT</span>
                          <span className="text-sm font-bold text-slate-900">{system.temperature.input - system.temperature.output}°C</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-500">Efficiency</span>
                          <span className="text-sm font-bold text-slate-900">{system.efficiency}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
