/**
 * Bitcoin Command Center - Terminal Bloomberg Unifié
 * Hearst Qatar - Strategic Bitcoin Reserve Monitoring
 * Une seule grande boîte intégrant tous les éléments
 */

import Head from 'next/head';
import Link from 'next/link';
import { CandlestickChart, AccumulationChart, PortfolioChart } from '../components/charts';
import { 
  ArrowLeft, 
  Wallet,
  TrendingUp,
  DollarSign,
  Target,
  Zap,
  BarChart2,
  Activity,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

// ============================================================================
// DATA - Bitcoin Price Action OHLC
// ============================================================================
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
];

// ============================================================================
// DATA - BTC Accumulation
// ============================================================================
const accumulationData = [
  { date: 'Jan', accumulated: 125.5, added: 12.5 },
  { date: 'Fév', accumulated: 138.2, added: 12.7 },
  { date: 'Mar', accumulated: 145.8, added: 7.6 },
  { date: 'Avr', accumulated: 158.3, added: 12.5 },
  { date: 'Mai', accumulated: 165.9, added: 7.6 },
  { date: 'Juin', accumulated: 172.4, added: 6.5 },
  { date: 'Juil', accumulated: 180.1, added: 7.7 },
  { date: 'Août', accumulated: 188.5, added: 8.4 },
  { date: 'Sept', accumulated: 195.2, added: 6.7 },
  { date: 'Oct', accumulated: 205.8, added: 10.6 },
  { date: 'Nov', accumulated: 212.4, added: 6.6 },
  { date: 'Déc', accumulated: 220.5, added: 8.1 },
];

// ============================================================================
// DATA - Portfolio Value
// ============================================================================
const portfolioData = [
  { date: 'Jan', value: 5200000, invested: 4800000 },
  { date: 'Fév', value: 5800000, invested: 5100000 },
  { date: 'Mar', value: 6500000, invested: 5400000 },
  { date: 'Avr', value: 7200000, invested: 5800000 },
  { date: 'Mai', value: 7800000, invested: 6200000 },
  { date: 'Juin', value: 8200000, invested: 6600000 },
  { date: 'Juil', value: 9100000, invested: 7000000 },
  { date: 'Août', value: 10500000, invested: 7500000 },
  { date: 'Sept', value: 11200000, invested: 8000000 },
  { date: 'Oct', value: 13800000, invested: 8500000 },
  { date: 'Nov', value: 16200000, invested: 9000000 },
  { date: 'Déc', value: 22000000, invested: 12000000 },
];

// Mini sparkline data
const btcSparkline = [125, 138, 146, 158, 166, 172, 180, 189, 195, 206, 212, 221];
const usdSparkline = [5.2, 5.8, 6.5, 7.2, 7.8, 8.2, 9.1, 10.5, 11.2, 13.8, 16.2, 22];

// ============================================================================
// MINI SPARKLINE COMPONENT
// ============================================================================
const MiniSparkline = ({ data, color, height = 30 }: { data: number[], color: string, height?: number }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = height - ((v - min) / range) * (height - 4);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg className="w-full" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`spark-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${points} 100,${height}`}
        fill={`url(#spark-${color})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// ============================================================================
// MAIN PAGE - UNIFIED COMMAND CENTER
// ============================================================================
export default function BitcoinCommandCenter() {
  const currentPrice = 49800;
  const priceChange = +18.6;
  const totalBTC = 220.5;
  const targetBTC = 300;
  const portfolioValue = 22000000;
  const invested = 12000000;
  const roi = ((portfolioValue - invested) / invested) * 100;
  const pnl = portfolioValue - invested;

  return (
    <>
      <Head>
        <title>Bitcoin Command Center - Hearst Qatar</title>
      </Head>

      <div className="min-h-screen bg-slate-100 p-4 lg:p-6">
        <div className="max-w-[1800px] mx-auto">
          
          {/* Back Link */}
          <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#8AFD81] transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Dashboard</span>
          </Link>

          {/* ================================================================ */}
          {/* UNIFIED COMMAND CENTER BOX */}
          {/* ================================================================ */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xl shadow-slate-200/50">
            
            {/* ============================================================ */}
            {/* HEADER - Dark */}
            {/* ============================================================ */}
            <div className="bg-slate-800 px-6 py-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                
                {/* Left - Logo + Title */}
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-[#8AFD81] via-[#4ade80] to-[#22c55e] rounded-xl shadow-lg shadow-[#8AFD81]/30">
                    <Wallet className="w-7 h-7 text-slate-900" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                      Bitcoin Command Center
                    </h1>
                    <p className="text-sm text-slate-400">
                      Strategic Reserve • Price Action • Portfolio Performance
                    </p>
                  </div>
                </div>

                {/* Center - Time Filters */}
                <div className="flex items-center gap-1 bg-slate-700/50 rounded-xl p-1">
                  <button className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors rounded-lg">
                    Day
                  </button>
                  <button className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors rounded-lg">
                    Week
                  </button>
                  <button className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#8AFD81] text-slate-900 rounded-lg">
                    Month
                  </button>
                  <button className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors rounded-lg">
                    Year
                  </button>
                  <button className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors rounded-lg">
                    All
                  </button>
                </div>

                {/* Right - KPI Badges */}
                <div className="flex items-center gap-3">
                  {/* Price Badge */}
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-700/50 rounded-xl border border-slate-600">
                    <BarChart2 className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400">BTC Price</p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg font-bold text-white">${currentPrice.toLocaleString('en-US')}</span>
                        <span className="text-xs font-bold text-[#8AFD81] flex items-center">
                          <ChevronUp className="w-3 h-3" />
                          {priceChange}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* BTC Badge */}
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-[#8AFD81]/10 rounded-xl border border-[#8AFD81]/30">
                    <Wallet className="w-4 h-4 text-[#8AFD81]" />
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#8AFD81]/70">Reserve</p>
                      <span className="text-lg font-bold text-[#8AFD81]">{totalBTC} BTC</span>
                    </div>
                  </div>

                  {/* ROI Badge */}
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-[#8AFD81]/10 rounded-xl border border-[#8AFD81]/30">
                    <TrendingUp className="w-4 h-4 text-[#8AFD81]" />
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#8AFD81]/70">ROI</p>
                      <span className="text-lg font-bold text-[#8AFD81]">+{roi.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ============================================================ */}
            {/* BODY - White */}
            {/* ============================================================ */}
            <div className="bg-white">
              <div className="flex">
                
                {/* ======================================================== */}
                {/* SIDEBAR - Stats Panel */}
                {/* ======================================================== */}
                <div className="w-72 border-r border-slate-100 p-4 space-y-4 bg-slate-50/50">
                  
                  {/* BTC Reserve Stats */}
                  <div className="bg-white rounded-xl p-3.5 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2.5 mb-4 pb-2 border-b border-slate-100">
                      <div className="p-2 bg-[#8AFD81]/20 rounded-lg">
                        <Wallet className="w-4 h-4 text-[#8AFD81]" />
                      </div>
                      <span className="text-sm font-bold uppercase tracking-wide text-slate-700">BTC Reserve</span>
                    </div>
                    
                    <div className="flex items-baseline gap-1.5 mb-2">
                      <span className="text-2xl font-bold text-slate-900 tabular-nums">{totalBTC}</span>
                      <span className="text-base text-slate-400">BTC</span>
                    </div>
                    
                    <MiniSparkline data={btcSparkline} color="#8AFD81" height={35} />
                    
                    <div className="mt-2.5 space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Monthly Add</span>
                        <span className="font-semibold text-[#8AFD81]">+8.1 BTC</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Avg Cost</span>
                        <span className="font-semibold text-slate-700">$42,850</span>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-500">Target</span>
                          <span className="font-semibold text-slate-700">{targetBTC} BTC</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#8AFD81] to-[#4ade80] rounded-full transition-all duration-500"
                            style={{ width: `${(totalBTC / targetBTC) * 100}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 text-right">{((totalBTC / targetBTC) * 100).toFixed(1)}% complete</p>
                      </div>
                    </div>
                  </div>

                  {/* Portfolio USD Stats */}
                  <div className="bg-white rounded-xl p-3.5 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2.5 mb-4 pb-2 border-b border-slate-100">
                      <div className="p-2 bg-slate-600/10 rounded-lg">
                        <DollarSign className="w-4 h-4 text-slate-600" />
                      </div>
                      <span className="text-sm font-bold uppercase tracking-wide text-slate-700">Portfolio USD</span>
                    </div>
                    
                    <div className="flex items-baseline gap-1.5 mb-2">
                      <span className="text-2xl font-bold text-slate-900 tabular-nums">${(portfolioValue / 1000000).toFixed(0)}</span>
                      <span className="text-base text-slate-400">M</span>
                    </div>
                    
                    <MiniSparkline data={usdSparkline} color="#64748b" height={35} />
                    
                    <div className="mt-2.5 space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Invested</span>
                        <span className="font-semibold text-slate-700">${(invested / 1000000).toFixed(0)}M</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">P&L</span>
                        <span className="font-semibold text-[#8AFD81]">+${(pnl / 1000000).toFixed(0)}M</span>
                      </div>
                    </div>
                  </div>

                  {/* Performance Indicators */}
                  <div className="bg-white rounded-xl p-3.5 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2.5 mb-4 pb-2 border-b border-slate-100">
                      <div className="p-2 bg-[#8AFD81]/20 rounded-lg">
                        <Zap className="w-4 h-4 text-[#8AFD81]" />
                      </div>
                      <span className="text-sm font-bold uppercase tracking-wide text-slate-700">Performance</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-slate-50 rounded-lg p-2.5 text-center">
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">ROI</p>
                        <p className="text-xl font-bold text-[#8AFD81]">+{roi.toFixed(1)}%</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-2.5 text-center">
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Sharpe</p>
                        <p className="text-xl font-bold text-slate-700">2.4</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-2.5 text-center">
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Volatility</p>
                        <p className="text-xl font-bold text-slate-700">12.5%</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-2.5 text-center">
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Max DD</p>
                        <p className="text-xl font-bold text-slate-500">-8.2%</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 px-4 py-3 bg-[#8AFD81]/10 rounded-xl border border-[#8AFD81]/30 cursor-pointer hover:bg-[#8AFD81]/20 transition-colors">
                      <Target className="w-4 h-4 text-[#8AFD81]" />
                      <span className="text-sm font-medium text-[#8AFD81]">Breakeven: $38,500</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 rounded-xl cursor-pointer hover:bg-slate-200 transition-colors">
                      <Activity className="w-4 h-4 text-slate-600" />
                      <span className="text-sm font-medium text-slate-600">Streak: 8 months profit</span>
                    </div>
                  </div>
                </div>

                {/* ======================================================== */}
                {/* MAIN CONTENT AREA */}
                {/* ======================================================== */}
                <div className="flex-1 p-6 space-y-6">
                  
                  {/* Main Candlestick Chart */}
                  <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
                      <h2 className="text-base font-bold uppercase tracking-wide text-slate-800">Bitcoin Price Action</h2>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400">Last updated: Just now</span>
                        <div className="w-2 h-2 rounded-full bg-[#8AFD81] animate-pulse"></div>
                      </div>
                    </div>
                    <CandlestickChart 
                      data={candlestickData}
                      height={340}
                      showVolume={true}
                      showMA={true}
                      maPeriods={[7, 20]}
                      breakevenPrice={38500}
                      unit="$"
                      theme="light"
                    />
                  </div>

                  {/* Bottom Row - Two Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Accumulation Chart */}
                    <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
                      <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
                        <h2 className="text-base font-bold uppercase tracking-wide text-slate-800">BTC Accumulation</h2>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#8AFD81]/10 rounded-lg border border-[#8AFD81]/20">
                          <ChevronUp className="w-3.5 h-3.5 text-[#8AFD81]" />
                          <span className="text-xs font-bold text-[#8AFD81]">+75.7% YTD</span>
                        </div>
                      </div>
                      <AccumulationChart 
                        data={accumulationData}
                        height={300}
                        showBars={true}
                        showMA={true}
                        maPeriods={[3, 6]}
                        targetValue={300}
                        unit="BTC"
                        theme="light"
                      />
                    </div>

                    {/* Portfolio Chart */}
                    <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
                      <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
                        <h2 className="text-base font-bold uppercase tracking-wide text-slate-800">Portfolio Performance</h2>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#8AFD81]/10 rounded-lg border border-[#8AFD81]/20">
                          <ChevronUp className="w-3.5 h-3.5 text-[#8AFD81]" />
                          <span className="text-xs font-bold text-[#8AFD81]">+{roi.toFixed(1)}% ROI</span>
                        </div>
                      </div>
                      <PortfolioChart 
                        data={portfolioData}
                        height={300}
                        showBollinger={true}
                        showROI={true}
                        showInvested={true}
                        bollingerPeriod={5}
                        unit="$"
                        theme="light"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ============================================================ */}
            {/* FOOTER - Summary Bar */}
            {/* ============================================================ */}
            <div className="bg-slate-50 border-t border-slate-100 px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">24h Volume:</span>
                    <span className="font-semibold text-slate-700">$55K</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">24h High:</span>
                    <span className="font-semibold text-[#8AFD81]">$52,000</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">24h Low:</span>
                    <span className="font-semibold text-slate-500">$49,500</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-slate-400">Hearst Qatar • Strategic Reserve</span>
                  <span className="px-2 py-1 bg-[#8AFD81]/20 text-[#8AFD81] text-xs font-bold rounded">LIVE</span>
                </div>
              </div>
            </div>

          </div>
          {/* END UNIFIED COMMAND CENTER BOX */}

        </div>
      </div>
    </>
  );
}
