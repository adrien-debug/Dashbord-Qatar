/**
 * Analytics Advanced Page - Data Science Visualizations
 * Hearst Qatar - Phase 2 Charts
 * Style cohérent avec le dashboard principal
 */

import Head from 'next/head';
import {
  WaterfallChart,
  TreemapChart,
  FunnelChart,
  CandlestickChart,
  BoxPlotChart,
  GaugeClusterChart,
} from '../components/charts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Layers,
  GitBranch,
  BarChart3,
  Activity,
  Zap,
  Thermometer,
  Cpu,
  Server,
  Target,
  PieChart,
} from 'lucide-react';

// Mock data for WaterfallChart - Revenue Analysis
const waterfallData = [
  { name: 'Revenus Bruts', value: 7200000, type: 'start' as const },
  { name: 'Électricité', value: 3500000, type: 'negative' as const },
  { name: 'Maintenance', value: 280000, type: 'negative' as const },
  { name: 'Refroidissement', value: 450000, type: 'negative' as const },
  { name: 'Personnel', value: 320000, type: 'negative' as const },
  { name: 'Infrastructure', value: 180000, type: 'negative' as const },
  { name: 'Profit Net', value: 2470000, type: 'total' as const },
];

// Mock data for TreemapChart - CAPEX/OPEX Distribution
const treemapData = {
  name: 'Budget Total',
  value: 45000000,
  children: [
    {
      name: 'CAPEX',
      value: 32000000,
      color: '#8AFD81',
      children: [
        { name: 'Miners S21', value: 18000000, color: '#4ade80' },
        { name: 'Infrastructure', value: 8000000, color: '#22c55e' },
        { name: 'Cooling System', value: 4000000, color: '#16a34a' },
        { name: 'Électrique', value: 2000000, color: '#15803d' },
      ],
    },
    {
      name: 'OPEX Annuel',
      value: 13000000,
      color: '#64748B',
      children: [
        { name: 'Électricité', value: 8500000, color: '#94A3B8' },
        { name: 'Maintenance', value: 2000000, color: '#64748B' },
        { name: 'Personnel', value: 1500000, color: '#475569' },
        { name: 'Autres', value: 1000000, color: '#334155' },
      ],
    },
  ],
};

// Mock data for FunnelChart - Ramp-Up Pipeline
const funnelData = [
  { name: 'Phase 1 - 10 MW', value: 10, target: 10, status: 'completed' as const, date: 'Jan 2024' },
  { name: 'Phase 2 - 25 MW', value: 25, target: 25, status: 'completed' as const, date: 'Avr 2024' },
  { name: 'Phase 3 - 50 MW', value: 42, target: 50, status: 'in_progress' as const, date: 'Sep 2024' },
  { name: 'Phase 4 - 75 MW', value: 0, target: 75, status: 'pending' as const, date: 'Jan 2025' },
  { name: 'Phase 5 - 100 MW', value: 0, target: 100, status: 'pending' as const, date: 'Juin 2025' },
];

// Mock data for CandlestickChart - BTC Price OHLC (Static to avoid hydration errors)
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

// Mock data for BoxPlotChart - Container Temperature Distribution
const boxPlotData = [
  {
    label: 'Container A1',
    min: 28,
    q1: 32,
    median: 35,
    q3: 38,
    max: 42,
    mean: 35.5,
    outliers: [26, 45],
    color: '#8AFD81',
  },
  {
    label: 'Container A2',
    min: 30,
    q1: 34,
    median: 37,
    q3: 40,
    max: 44,
    mean: 37.2,
    outliers: [48],
    color: '#64748B',
  },
  {
    label: 'Container B1',
    min: 27,
    q1: 31,
    median: 34,
    q3: 37,
    max: 41,
    mean: 34.1,
    color: '#94A3B8',
  },
  {
    label: 'Container B2',
    min: 29,
    q1: 33,
    median: 36,
    q3: 39,
    max: 43,
    mean: 36.0,
    outliers: [25, 47, 49],
    color: '#475569',
  },
  {
    label: 'Container C1',
    min: 26,
    q1: 30,
    median: 33,
    q3: 36,
    max: 40,
    mean: 33.2,
    color: '#8AFD81',
  },
  {
    label: 'Container C2',
    min: 31,
    q1: 35,
    median: 38,
    q3: 41,
    max: 45,
    mean: 38.1,
    outliers: [50],
    color: '#64748B',
  },
];

// Mock data for GaugeClusterChart - Real-time KPIs
const gaugeData = [
  {
    id: 'hashrate',
    label: 'Hashrate',
    value: 96.8,
    min: 0,
    max: 100,
    target: 95,
    unit: '%',
    thresholds: { warning: 85, danger: 70 },
    icon: <Cpu className="w-4 h-4" />,
  },
  {
    id: 'uptime',
    label: 'Uptime',
    value: 99.2,
    min: 0,
    max: 100,
    target: 99,
    unit: '%',
    thresholds: { warning: 95, danger: 90 },
    icon: <Activity className="w-4 h-4" />,
  },
  {
    id: 'efficiency',
    label: 'Efficacité',
    value: 94.5,
    min: 0,
    max: 100,
    target: 90,
    unit: '%',
    thresholds: { warning: 80, danger: 70 },
    icon: <Zap className="w-4 h-4" />,
  },
  {
    id: 'temperature',
    label: 'Température',
    value: 38,
    min: 0,
    max: 60,
    target: 35,
    unit: '°C',
    thresholds: { warning: 40, danger: 50 },
    icon: <Thermometer className="w-4 h-4" />,
  },
  {
    id: 'power-load',
    label: 'Charge',
    value: 97.2,
    min: 0,
    max: 100,
    target: 95,
    unit: '%',
    thresholds: { warning: 75, danger: 60 },
    icon: <Server className="w-4 h-4" />,
  },
  {
    id: 'cooling',
    label: 'Cooling',
    value: 92.1,
    min: 0,
    max: 100,
    target: 90,
    unit: '%',
    thresholds: { warning: 80, danger: 70 },
  },
];

export default function AnalyticsAdvanced() {
  return (
    <>
      <Head>
        <title>Analytics Avancées | Hearst Qatar</title>
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
                    Phase 2 Charts
                  </span>
                </div>

                {/* Bottom Left - Title */}
                <div className="absolute bottom-6 left-8 lg:left-10">
                  <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
                    Analytics <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80]">Avancées</span>
                  </h1>
                </div>

                {/* Bottom Right - Stats */}
                <div className="absolute bottom-6 right-8 lg:right-10 flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white tabular-nums">6</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider">Graphiques</div>
                  </div>
                  <div className="w-px h-10 bg-slate-700" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#8AFD81] tabular-nums">Live</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider">Status</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section Title - Revenue Analysis */}
            <div className="col-span-12 flex items-center gap-4 mt-6 mb-2">
              <TrendingDown className="w-6 h-6 text-[#8AFD81]" strokeWidth={1.5} />
              <h2 className="text-2xl font-bold text-slate-900">Analyse des Revenus</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent" />
            </div>

            {/* WaterfallChart - Revenue Analysis */}
            <div className="col-span-12 lg:col-span-6 rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300 animate-fade-in-up delay-100">
              {/* Header - Dark */}
              <div className="bg-slate-800 px-6 py-4">
                <div className="flex items-center gap-3">
                  <TrendingDown className="w-5 h-5 text-white" strokeWidth={1.5} />
                  <div>
                    <div className="text-white text-base font-semibold">
                      Décomposition Waterfall
                    </div>
                    <div className="text-slate-400 text-sm">Du brut au net - Analyse des coûts</div>
                  </div>
                </div>
              </div>
              
              {/* Body - White */}
              <div className="bg-white p-6">
                <WaterfallChart 
                  data={waterfallData}
                  height={380}
                  showConnectors={true}
                  showLabels={true}
                  showValues={true}
                  unit="$"
                />
              </div>
            </div>

            {/* TreemapChart - Budget Distribution */}
            <div className="col-span-12 lg:col-span-6 rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300 animate-fade-in-up delay-100">
              {/* Header - Dark */}
              <div className="bg-slate-800 px-6 py-4">
                <div className="flex items-center gap-3">
                  <Layers className="w-5 h-5 text-white" strokeWidth={1.5} />
                  <div>
                    <div className="text-white text-base font-semibold">
                      Distribution Budget
                    </div>
                    <div className="text-slate-400 text-sm">CAPEX vs OPEX - Treemap Hiérarchique</div>
                  </div>
                </div>
              </div>
              
              {/* Body - White */}
              <div className="bg-white p-6">
                <TreemapChart 
                  data={treemapData}
                  height={400}
                  showLabels={true}
                  showValues={true}
                  unit="$"
                />
              </div>
            </div>

            {/* Section Title - Pipeline & KPIs */}
            <div className="col-span-12 flex items-center gap-4 mt-6 mb-2">
              <Target className="w-6 h-6 text-[#8AFD81]" strokeWidth={1.5} />
              <h2 className="text-2xl font-bold text-slate-900">Pipeline & KPIs Temps Réel</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent" />
            </div>

            {/* FunnelChart - Ramp-Up Pipeline */}
            <div className="col-span-12 lg:col-span-6 rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300 animate-fade-in-up delay-200">
              {/* Header - Dark */}
              <div className="bg-slate-800 px-6 py-4">
                <div className="flex items-center gap-3">
                  <GitBranch className="w-5 h-5 text-white" strokeWidth={1.5} />
                  <div>
                    <div className="text-white text-base font-semibold">
                      Pipeline Ramp-Up
                    </div>
                    <div className="text-slate-400 text-sm">Progression 10 → 100 MW</div>
                  </div>
                </div>
              </div>
              
              {/* Body - White */}
              <div className="bg-white p-6">
                <FunnelChart 
                  data={funnelData}
                  height={450}
                  showLabels={true}
                  showValues={true}
                  showPercentage={true}
                  unit="MW"
                />
              </div>
            </div>

            {/* GaugeClusterChart - Real-time KPIs */}
            <div className="col-span-12 lg:col-span-6 rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300 animate-fade-in-up delay-200">
              {/* Header - Dark */}
              <div className="bg-slate-800 px-6 py-4">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-white" strokeWidth={1.5} />
                  <div>
                    <div className="text-white text-base font-semibold">
                      KPIs Temps Réel
                    </div>
                    <div className="text-slate-400 text-sm">Cluster de Jauges - Monitoring Live</div>
                  </div>
                </div>
              </div>
              
              {/* Body - White */}
              <div className="bg-white p-6">
                <GaugeClusterChart 
                  data={gaugeData}
                  layout="grid"
                  size="md"
                  showLabels={true}
                  showValues={true}
                  showTarget={true}
                  animated={true}
                />
              </div>
            </div>

            {/* Section Title - Bitcoin Price Action */}
            <div className="col-span-12 flex items-center gap-4 mt-6 mb-2">
              <DollarSign className="w-6 h-6 text-[#8AFD81]" strokeWidth={1.5} />
              <h2 className="text-2xl font-bold text-slate-900">Bitcoin Price Action</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent" />
            </div>

            {/* CandlestickChart - BTC Price - Full Width */}
            <div className="col-span-12 rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300 animate-fade-in-up delay-300">
              {/* Header - Dark */}
              <div className="bg-slate-800 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-white" strokeWidth={1.5} />
                    <div>
                      <div className="text-white text-base font-semibold">
                        Bitcoin OHLC
                      </div>
                      <div className="text-slate-400 text-sm">Chandelier japonais • Volume • Moyennes Mobiles</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#8AFD81]/20 rounded-lg border border-[#8AFD81]/30">
                      <TrendingUp className="w-4 h-4 text-[#8AFD81]" />
                      <span className="text-sm font-bold text-[#8AFD81]">+38.5%</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 rounded-lg">
                      <span className="text-xs font-semibold text-slate-300">Seuil Mining</span>
                      <span className="text-sm font-bold text-white">$38,500</span>
                    </div>
                    <span className="text-xs px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg font-medium">
                      40 jours
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Body - White */}
              <div className="bg-white p-6">
                <CandlestickChart 
                  data={candlestickData}
                  height={420}
                  showVolume={true}
                  showMA={true}
                  maPeriods={[7, 20, 50]}
                  breakevenPrice={38500}
                  unit="$"
                  theme="light"
                />
              </div>
            </div>

            {/* Section Title - Temperature Analysis */}
            <div className="col-span-12 flex items-center gap-4 mt-6 mb-2">
              <Thermometer className="w-6 h-6 text-[#8AFD81]" strokeWidth={1.5} />
              <h2 className="text-2xl font-bold text-slate-900">Distribution Températures</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent" />
            </div>

            {/* BoxPlotChart - Temperature Distribution - Full Width */}
            <div className="col-span-12 rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300 animate-fade-in-up delay-300">
              {/* Header - Dark */}
              <div className="bg-slate-800 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Thermometer className="w-5 h-5 text-white" strokeWidth={1.5} />
                    <div>
                      <div className="text-white text-base font-semibold">
                        Box Plot par Container
                      </div>
                      <div className="text-slate-400 text-sm">Analyse statistique des températures</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-0.5 bg-slate-500" style={{ borderStyle: 'dashed' }} />
                      <span className="text-[10px] text-slate-300 font-medium">Whiskers</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 border-2 border-[#8AFD81] bg-[#8AFD81]/20 rounded" />
                      <span className="text-[10px] text-slate-300 font-medium">IQR</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Body - White */}
              <div className="bg-white p-6">
                <BoxPlotChart 
                  data={boxPlotData}
                  height={360}
                  showMean={true}
                  showOutliers={true}
                  showLabels={true}
                  showValues={true}
                  unit="°C"
                  theme="light"
                />
              </div>
            </div>

            {/* Summary Cards - 4 colonnes */}
            <div className="col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-[#8AFD81]/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8AFD81]/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#8AFD81]/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-[#8AFD81]" />
                  </div>
                </div>
                <p className="text-sm text-slate-500 mb-1">Profit Net Mensuel</p>
                <p className="text-2xl font-bold text-slate-900">$2.47M</p>
                <p className="text-xs mt-1 text-[#8AFD81] font-medium">+12.3% vs prev</p>
              </div>
              
              <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-[#8AFD81]/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8AFD81]/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-600/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-slate-600" />
                  </div>
                </div>
                <p className="text-sm text-slate-500 mb-1">Capacité Actuelle</p>
                <p className="text-2xl font-bold text-slate-900">42 MW</p>
                <p className="text-xs mt-1 text-slate-500">84% de Phase 3</p>
              </div>
              
              <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-[#8AFD81]/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8AFD81]/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#8AFD81]/20 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-[#8AFD81]" />
                  </div>
                </div>
                <p className="text-sm text-slate-500 mb-1">Uptime Global</p>
                <p className="text-2xl font-bold text-slate-900">99.2%</p>
                <p className="text-xs mt-1 text-[#8AFD81] font-medium">Objectif: 99%</p>
              </div>
              
              <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-[#8AFD81]/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8AFD81]/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-600/20 flex items-center justify-center">
                    <PieChart className="w-5 h-5 text-slate-600" />
                  </div>
                </div>
                <p className="text-sm text-slate-500 mb-1">BTC Miné (MTD)</p>
                <p className="text-2xl font-bold text-slate-900">18.4 BTC</p>
                <p className="text-xs mt-1 text-slate-500">≈ $784,000</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
