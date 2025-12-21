/**
 * Analytics Page - Advanced Data Visualizations
 * Hearst Qatar - Data Science Dashboard
 */

import Head from 'next/head';
import {
  RadarChart,
  SankeyDiagram,
  BulletChart,
} from '../components/charts';
import {
  BarChart3,
  Activity,
  Zap,
  TrendingUp,
  Target,
  GitBranch,
} from 'lucide-react';

// Mock data for RadarChart - Power Block Comparison
const radarData = [
  { subject: 'Hashrate', pb1: 95, pb2: 92, pb3: 78, pb4: 98, fullMark: 100 },
  { subject: 'Efficiency', pb1: 96.8, pb2: 97.2, pb3: 95.2, pb4: 98.0, fullMark: 100 },
  { subject: 'Uptime', pb1: 99.2, pb2: 99.5, pb3: 97.8, pb4: 99.8, fullMark: 100 },
  { subject: 'Temperature', pb1: 84, pb2: 82, pb3: 72, pb4: 86, fullMark: 100 }, // Inverted: lower is better
  { subject: 'Load', pb1: 96.8, pb2: 99.2, pb3: 92.4, pb4: 98.0, fullMark: 100 },
  { subject: 'Cooling', pb1: 94.5, pb2: 93.8, pb3: 89.2, pb4: 95.1, fullMark: 100 },
];

// Mock data for SankeyDiagram - Energy to Revenue Flow
const sankeyNodes = [
  { id: 'grid', name: 'Grid Power', value: 100, color: '#3b82f6' },
  { id: 'pb1', name: 'Power Block 1', value: 25, color: '#8AFD81' },
  { id: 'pb2', name: 'Power Block 2', value: 25, color: '#8AFD81' },
  { id: 'pb3', name: 'Power Block 3', value: 25, color: '#f59e0b' },
  { id: 'pb4', name: 'Power Block 4', value: 25, color: '#8AFD81' },
  { id: 'btc', name: 'BTC Mining', value: 72, color: '#f7931a' },
  { id: 'cooling', name: 'Cooling', value: 15, color: '#06b6d4' },
  { id: 'losses', name: 'Losses', value: 8, color: '#64748b' },
  { id: 'maintenance', name: 'Maintenance', value: 5, color: '#94a3b8' },
];

const sankeyLinks = [
  { source: 'grid', target: 'pb1', value: 25 },
  { source: 'grid', target: 'pb2', value: 25 },
  { source: 'grid', target: 'pb3', value: 25 },
  { source: 'grid', target: 'pb4', value: 25 },
  { source: 'pb1', target: 'btc', value: 20 },
  { source: 'pb2', target: 'btc', value: 21 },
  { source: 'pb3', target: 'btc', value: 15 },
  { source: 'pb4', target: 'btc', value: 21 },
  { source: 'pb1', target: 'cooling', value: 3.5 },
  { source: 'pb2', target: 'cooling', value: 3.5 },
  { source: 'pb3', target: 'cooling', value: 4 },
  { source: 'pb4', target: 'cooling', value: 4 },
  { source: 'pb3', target: 'losses', value: 4 },
  { source: 'pb1', target: 'losses', value: 1 },
  { source: 'pb2', target: 'losses', value: 0.5 },
  { source: 'pb4', target: 'maintenance', value: 0 },
];

// Mock data for BulletChart - KPIs vs Targets
const bulletData = [
  {
    label: 'Hashrate (PH/s)',
    value: 1020,
    target: 1000,
    ranges: [800, 950, 1200] as [number, number, number],
    unit: 'PH/s',
  },
  {
    label: 'Daily Production (BTC)',
    value: 2.45,
    target: 2.5,
    ranges: [1.5, 2.2, 3.0] as [number, number, number],
    unit: 'BTC',
  },
  {
    label: 'Operational MW',
    value: 72,
    target: 100,
    ranges: [50, 75, 100] as [number, number, number],
    unit: 'MW',
  },
  {
    label: 'Fleet Uptime (%)',
    value: 99.2,
    target: 99.5,
    ranges: [95, 98, 100] as [number, number, number],
    unit: '%',
  },
  {
    label: 'Energy Efficiency (J/TH)',
    value: 23.5,
    target: 24,
    ranges: [30, 26, 22] as [number, number, number],
    unit: 'J/TH',
  },
];

export default function AnalyticsPage() {
  return (
    <>
      <Head>
        <title>Advanced Analytics - Hearst Qatar</title>
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
                    Data Science
                  </span>
                  <span className="px-3 py-1.5 bg-white/10 text-white/90 rounded-full text-[10px] font-medium backdrop-blur-md border border-white/10 uppercase tracking-widest">
                    Advanced Charts
                  </span>
                </div>

                {/* Bottom Left - Title */}
                <div className="absolute bottom-6 left-8 lg:left-10">
                  <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
                    Advanced <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80]">Analytics</span>
                  </h1>
                </div>

                {/* Bottom Right - Stats */}
                <div className="absolute bottom-6 right-8 lg:right-10 flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white tabular-nums">3</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider">New Charts</div>
                  </div>
                  <div className="w-px h-10 bg-slate-700" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#8AFD81] tabular-nums">Live</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider">Status</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section Title - Performance Radar */}
            <div className="col-span-12 flex items-center gap-4 mt-6 mb-2">
              <Activity className="w-10 h-10 text-[#8AFD81]" strokeWidth={1.5} />
              <h2 className="text-2xl font-bold text-slate-900">Power Block Performance Radar</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent"></div>
            </div>

            {/* 2. RADAR CHART - Full Width */}
            <div className="col-span-12 rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300 animate-fade-in-up delay-100">
              {/* Header - Dark */}
              <div className="bg-slate-800 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-white" strokeWidth={1.5} />
                    <div>
                      <div className="text-white text-base font-semibold">
                        Multi-Dimensional Performance Analysis
                      </div>
                      <div className="text-slate-400 text-sm">Compare all 4 Power Blocks across 6 key metrics</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#8AFD81]" />
                      <span className="text-xs text-slate-300">PB1</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#3b82f6]" />
                      <span className="text-xs text-slate-300">PB2</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                      <span className="text-xs text-slate-300">PB3</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#06b6d4]" />
                      <span className="text-xs text-slate-300">PB4</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Body - White */}
              <div className="bg-white p-6">
                <RadarChart
                  data={radarData}
                  radars={[
                    { dataKey: 'pb1', name: 'Power Block 1', color: '#8AFD81', fillOpacity: 0.3 },
                    { dataKey: 'pb2', name: 'Power Block 2', color: '#3b82f6', fillOpacity: 0.3 },
                    { dataKey: 'pb3', name: 'Power Block 3', color: '#f59e0b', fillOpacity: 0.3 },
                    { dataKey: 'pb4', name: 'Power Block 4', color: '#06b6d4', fillOpacity: 0.3 },
                  ]}
                  height={450}
                  showLegend={true}
                  unit="%"
                />
              </div>
            </div>

            {/* Section Title - Energy Flow */}
            <div className="col-span-12 flex items-center gap-4 mt-6 mb-2">
              <GitBranch className="w-10 h-10 text-[#8AFD81]" strokeWidth={1.5} />
              <h2 className="text-2xl font-bold text-slate-900">Energy Flow Diagram</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent"></div>
            </div>

            {/* 3. SANKEY DIAGRAM - Full Width */}
            <div className="col-span-12 rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300 animate-fade-in-up delay-200">
              {/* Header - Dark */}
              <div className="bg-slate-800 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-white" strokeWidth={1.5} />
                    <div>
                      <div className="text-white text-base font-semibold">
                        Power Distribution & Utilization
                      </div>
                      <div className="text-slate-400 text-sm">100MW Grid Power → Power Blocks → BTC Mining / Cooling / Losses</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg text-xs font-medium">
                      <span className="w-2 h-2 rounded-full bg-[#8AFD81]" />
                      72 MW → BTC
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Body - White */}
              <div className="bg-white p-6">
                <SankeyDiagram
                  nodes={sankeyNodes}
                  links={sankeyLinks}
                  height={400}
                  unit="MW"
                />
              </div>
            </div>

            {/* Section Title - KPIs */}
            <div className="col-span-12 flex items-center gap-4 mt-6 mb-2">
              <Target className="w-10 h-10 text-[#8AFD81]" strokeWidth={1.5} />
              <h2 className="text-2xl font-bold text-slate-900">KPI Performance vs Targets</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent"></div>
            </div>

            {/* 4. BULLET CHART - Full Width */}
            <div className="col-span-12 rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300 animate-fade-in-up delay-300">
              {/* Header - Dark */}
              <div className="bg-slate-800 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-white" strokeWidth={1.5} />
                    <div>
                      <div className="text-white text-base font-semibold">
                        Bullet Chart - Actual vs Target
                      </div>
                      <div className="text-slate-400 text-sm">Track 5 key performance indicators against strategic targets</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-slate-400 uppercase tracking-wider">On Target</div>
                      <div className="text-lg font-bold text-[#8AFD81] tabular-nums">3/5 KPIs</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Body - White */}
              <div className="bg-white p-8">
                <BulletChart
                  data={bulletData}
                  height={40}
                  showLabels={true}
                  showValues={true}
                />
              </div>
            </div>

            {/* Summary Cards */}
            <div className="col-span-12 grid grid-cols-3 gap-4 mt-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-[#8AFD81]/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8AFD81]/10">
                <div className="flex items-center gap-3 mb-4">
                  <Activity className="w-8 h-8 text-[#8AFD81]" />
                  <div>
                    <div className="text-sm font-bold text-slate-900">RadarChart</div>
                    <div className="text-xs text-slate-500">Multi-dimensional analysis</div>
                  </div>
                </div>
                <p className="text-sm text-slate-600">
                  Compare multiple metrics across entities simultaneously. Perfect for Power Block benchmarking.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-[#8AFD81]/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8AFD81]/10">
                <div className="flex items-center gap-3 mb-4">
                  <GitBranch className="w-8 h-8 text-[#3b82f6]" />
                  <div>
                    <div className="text-sm font-bold text-slate-900">SankeyDiagram</div>
                    <div className="text-xs text-slate-500">Flow visualization</div>
                  </div>
                </div>
                <p className="text-sm text-slate-600">
                  Visualize energy flow from grid to BTC production. Shows distribution and losses.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-[#8AFD81]/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8AFD81]/10">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-8 h-8 text-[#f59e0b]" />
                  <div>
                    <div className="text-sm font-bold text-slate-900">BulletChart</div>
                    <div className="text-xs text-slate-500">KPI tracking</div>
                  </div>
                </div>
                <p className="text-sm text-slate-600">
                  Compare actual performance vs targets with performance zones. Executive summary view.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

