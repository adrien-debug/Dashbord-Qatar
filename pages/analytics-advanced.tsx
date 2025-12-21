/**
 * Analytics Advanced Page - Data Science Visualizations
 * Hearst Qatar - Phase 2 Charts
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
      color: '#3b82f6',
      children: [
        { name: 'Électricité', value: 8500000, color: '#60a5fa' },
        { name: 'Maintenance', value: 2000000, color: '#3b82f6' },
        { name: 'Personnel', value: 1500000, color: '#2563eb' },
        { name: 'Autres', value: 1000000, color: '#1d4ed8' },
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
    color: '#3b82f6',
  },
  {
    label: 'Container B1',
    min: 27,
    q1: 31,
    median: 34,
    q3: 37,
    max: 41,
    mean: 34.1,
    color: '#f59e0b',
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
    color: '#06b6d4',
  },
  {
    label: 'Container C1',
    min: 26,
    q1: 30,
    median: 33,
    q3: 36,
    max: 40,
    mean: 33.2,
    color: '#8b5cf6',
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
    color: '#ec4899',
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

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl shadow-lg shadow-emerald-500/20">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">
              Analytics Avancées
            </h1>
          </div>
          <p className="text-slate-500 ml-14">
            Visualisations Data Science - Phase 2
          </p>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* WaterfallChart - Revenue Analysis */}
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg">
                <TrendingDown className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Analyse des Revenus</h2>
                <p className="text-sm text-slate-500">Décomposition Waterfall - Du brut au net</p>
              </div>
            </div>
            <WaterfallChart 
              data={waterfallData}
              height={380}
              showConnectors={true}
              showLabels={true}
              showValues={true}
              unit="$"
            />
          </div>

          {/* TreemapChart - Budget Distribution */}
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Distribution Budget</h2>
                <p className="text-sm text-slate-500">CAPEX vs OPEX - Treemap Hiérarchique</p>
              </div>
            </div>
            <TreemapChart 
              data={treemapData}
              height={400}
              showLabels={true}
              showValues={true}
              unit="$"
            />
          </div>

          {/* FunnelChart - Ramp-Up Pipeline */}
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg">
                <GitBranch className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Pipeline Ramp-Up</h2>
                <p className="text-sm text-slate-500">Progression 10 → 100 MW</p>
              </div>
            </div>
            <FunnelChart 
              data={funnelData}
              height={450}
              showLabels={true}
              showValues={true}
              showPercentage={true}
              unit="MW"
            />
          </div>

          {/* GaugeClusterChart - Real-time KPIs */}
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">KPIs Temps Réel</h2>
                <p className="text-sm text-slate-500">Cluster de Jauges - Monitoring Live</p>
              </div>
            </div>
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

          {/* CandlestickChart - BTC Price - Optimisé Data Science */}
          <div className="bg-slate-900 rounded-2xl shadow-xl shadow-slate-900/30 border border-slate-800 p-6 xl:col-span-2">
            {/* Header Hiérarchisé */}
            <div className="flex items-start justify-between mb-6">
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

            <CandlestickChart 
              data={candlestickData}
              height={420}
              showVolume={true}
              showMA={true}
              maPeriods={[7, 20, 50]}
              breakevenPrice={38500}
              unit="$"
              theme="dark"
            />
          </div>

          {/* BoxPlotChart - Temperature Distribution */}
          <div className="bg-slate-900 rounded-2xl shadow-xl shadow-slate-900/30 border border-slate-800 p-6 xl:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-gradient-to-br from-rose-400 to-rose-600 rounded-xl shadow-lg shadow-rose-500/20">
                <Thermometer className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Distribution Températures</h2>
                <p className="text-sm text-slate-400">Box Plot par Container - Analyse Statistique</p>
              </div>
              <div className="ml-auto flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-0.5 bg-slate-500" style={{ borderStyle: 'dashed' }} />
                  <span className="text-[10px] text-slate-400 font-medium">Whiskers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 border-2 border-[#8AFD81] bg-[#8AFD81]/20 rounded" />
                  <span className="text-[10px] text-slate-400 font-medium">IQR</span>
                </div>
              </div>
            </div>
            <BoxPlotChart 
              data={boxPlotData}
              height={360}
              showMean={true}
              showOutliers={true}
              showLabels={true}
              showValues={true}
              unit="°C"
              theme="dark"
            />
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 text-white">
            <p className="text-sm opacity-80">Profit Net Mensuel</p>
            <p className="text-2xl font-bold">$2.47M</p>
            <p className="text-xs mt-1 opacity-70">+12.3% vs prev</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
            <p className="text-sm opacity-80">Capacité Actuelle</p>
            <p className="text-2xl font-bold">42 MW</p>
            <p className="text-xs mt-1 opacity-70">84% de Phase 3</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
            <p className="text-sm opacity-80">Uptime Global</p>
            <p className="text-2xl font-bold">99.2%</p>
            <p className="text-xs mt-1 opacity-70">Objectif: 99%</p>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-4 text-white">
            <p className="text-sm opacity-80">BTC Miné (MTD)</p>
            <p className="text-2xl font-bold">18.4 BTC</p>
            <p className="text-xs mt-1 opacity-70">≈ $784,000</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-400">
          <p>Hearst Qatar Mining Operations - Data Science Dashboard</p>
          <p className="text-xs mt-1">6 nouveaux graphiques • Phase 2 Complete</p>
        </div>
      </div>
    </>
  );
}

