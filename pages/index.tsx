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
        <title>QATAR Bitcoin Strategic Reserve - Dashboard</title>
      </Head>

      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-[1600px] mx-auto">
          {/* Header Simple */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-slate-200">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">QATAR Bitcoin Strategic Reserve</h1>
              <p className="text-sm text-slate-600">100MW Mining Facility • Hearst Corporation</p>
            </div>
            <div className="flex items-center gap-3">
              <TimeFilter selected={timeRange} onChange={setTimeRange} options={['7d', '30d', '90d']} />
              <ExportButton />
            </div>
          </div>

          {/* STRATEGIC RESERVE - Grande Box Foncée avec Vert Lisible */}
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-10 mb-8 border border-slate-700 shadow-xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#8AFD81]/5 rounded-full blur-3xl"></div>
            
            <div className="relative">
              <div className="mb-6">
                <div className="text-slate-400 text-sm uppercase tracking-wider mb-3">Strategic Bitcoin Reserve</div>
                <div className="flex items-baseline gap-4">
                  <div className="text-7xl font-bold text-[#8AFD81]">
                    {mockStrategicReserve.totalBTC}
                  </div>
                  <div className="text-4xl font-bold text-white">BTC</div>
                </div>
                <div className="text-2xl text-slate-300 mt-3">
                  ${(mockStrategicReserve.currentValue / 1000000).toFixed(2)}M USD
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-white/10">
                <div>
                  <div className="text-slate-400 text-xs uppercase tracking-wider mb-2">Monthly Growth</div>
                  <div className="text-3xl font-bold text-white">{mockStrategicReserve.monthlyAccumulation} BTC</div>
                </div>
                <div>
                  <div className="text-slate-400 text-xs uppercase tracking-wider mb-2">Year-End Target</div>
                  <div className="text-3xl font-bold text-[#8AFD81]">{formatNumber(mockStrategicReserve.projectedYearEnd)} BTC</div>
                </div>
                <div>
                  <div className="text-slate-400 text-xs uppercase tracking-wider mb-2">Growth Rate</div>
                  <div className="text-3xl font-bold text-[#8AFD81]">+{mockStrategicReserve.reserveGrowth}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* KPIs - Grande Box Blanche avec Texte Foncé */}
          <div className="bg-white rounded-2xl p-8 mb-8 border border-slate-200 shadow-lg">
            <div className="grid grid-cols-4 gap-8">
              <div>
                <div className="text-slate-500 text-xs uppercase tracking-wider mb-3 font-semibold">Total Hashrate</div>
                <div className="flex items-baseline gap-3">
                  <div className="text-5xl font-bold text-slate-900">{formatNumber(mockBitcoinKPIs.totalHashrate)}</div>
                  <div className="text-xl font-semibold text-slate-600">PH/s</div>
                </div>
                <div className="mt-2 text-sm text-slate-500">1.02 EH/s capacity</div>
              </div>
              <div>
                <div className="text-slate-500 text-xs uppercase tracking-wider mb-3 font-semibold">Daily Production</div>
                <div className="flex items-baseline gap-3">
                  <div className="text-5xl font-bold text-slate-900">{mockBitcoinKPIs.dailyProduction}</div>
                  <div className="text-xl font-semibold text-slate-600">BTC</div>
                </div>
                <div className="mt-2 text-sm text-slate-500">Per day average</div>
              </div>
              <div>
                <div className="text-slate-500 text-xs uppercase tracking-wider mb-3 font-semibold">Efficiency</div>
                <div className="flex items-baseline gap-3">
                  <div className="text-5xl font-bold text-slate-900">{mockBitcoinKPIs.efficiency}</div>
                  <div className="text-xl font-semibold text-slate-600">J/TH</div>
                </div>
                <div className="mt-2 text-sm text-slate-500">World-class</div>
              </div>
              <div>
                <div className="text-slate-500 text-xs uppercase tracking-wider mb-3 font-semibold">Uptime</div>
                <div className="flex items-baseline gap-3">
                  <div className="text-5xl font-bold text-slate-900">{mockBitcoinKPIs.uptime}</div>
                  <div className="text-xl font-semibold text-slate-600">%</div>
                </div>
                <div className="mt-2 text-sm text-slate-500">Last 30 days</div>
              </div>
            </div>
          </div>

          {/* Production Chart - Grande Box */}
          <div className="bg-white rounded-2xl p-8 mb-8 border border-slate-200 shadow-lg">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-2">BTC Production Trend</h2>
              <p className="text-sm text-slate-600">Daily Bitcoin production over last 30 days</p>
            </div>
            <AdvancedAreaChart
              data={productionData}
              areas={[
                { dataKey: 'btc', name: 'BTC Production', color: '#8AFD81' },
              ]}
              xAxisKey="date"
              height={280}
              showGrid={true}
              showLegend={false}
            />
          </div>

          {/* Performance Metrics - Grande Box avec Layout Clair */}
          <div className="bg-white rounded-2xl p-8 mb-8 border border-slate-200 shadow-lg">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Performance Metrics</h2>
              <p className="text-sm text-slate-600">Hashrate comparison & system efficiency</p>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              {/* Hashrate Benchmark */}
              <div>
                <div className="text-sm font-semibold text-slate-700 mb-4">Hashrate Benchmark</div>
                <AdvancedBarChart
                  data={mockHashrateComparison}
                  bars={[{ dataKey: 'hashrate', name: 'Hashrate (PH/s)', color: '#8AFD81' }]}
                  xAxisKey="name"
                  height={240}
                  showGrid={false}
                  showLegend={false}
                  horizontal={false}
                />
              </div>

              {/* Gauges */}
              <div className="flex flex-col justify-center gap-6">
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <div className="flex items-center justify-center">
                    <GaugeChart
                      value={mockBitcoinKPIs.efficiency}
                      max={30}
                      min={20}
                      label="Energy Efficiency"
                      unit=" J/TH"
                      size={140}
                      color="#8AFD81"
                    />
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <div className="flex items-center justify-center">
                    <GaugeChart
                      value={mockBitcoinKPIs.uptime}
                      max={100}
                      min={95}
                      label="System Uptime"
                      unit="%"
                      size={140}
                      color="#8AFD81"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation - Grandes Cards */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <Link href="/mining-dashboard" className="block group">
              <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-10 border border-slate-700 hover:border-[#8AFD81] hover:shadow-[0_0_40px_rgba(138,253,129,0.15)] transition-all duration-500 group-hover:scale-[1.02]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#8AFD81]/5 rounded-full blur-3xl"></div>
                <div className="relative">
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-[#8AFD81] mb-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                  <h3 className="text-3xl font-bold text-white mb-4">Mining Dashboard</h3>
                  <p className="text-slate-300 text-base leading-relaxed">Bitcoin production analytics, strategic reserve tracking, and hardware fleet monitoring</p>
                </div>
              </div>
            </Link>

            <Link href="/infrastructure" className="block group">
              <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-10 border border-slate-700 hover:border-[#8AFD81] hover:shadow-[0_0_40px_rgba(138,253,129,0.15)] transition-all duration-500 group-hover:scale-[1.02]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#8AFD81]/5 rounded-full blur-3xl"></div>
                <div className="relative">
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-[#8AFD81] mb-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <h3 className="text-3xl font-bold text-white mb-4">Infrastructure Monitoring</h3>
                  <p className="text-slate-300 text-base leading-relaxed">Real-time power systems, cooling performance, and facility operational status</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Facility Info - Simple et Lisible */}
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Facility Architecture</h2>
            <div className="grid grid-cols-3 gap-8">
              <div>
                <div className="text-slate-600 text-sm font-semibold mb-3">Power Distribution</div>
                <ul className="space-y-2 text-slate-700">
                  <li>• 4 Power Blocks (25 MW each)</li>
                  <li>• 24 Transformers</li>
                  <li>• 200 MW Main Substation</li>
                </ul>
              </div>
              <div>
                <div className="text-slate-600 text-sm font-semibold mb-3">Mining Infrastructure</div>
                <ul className="space-y-2 text-slate-700">
                  <li>• 48 HD5 Containers</li>
                  <li>• 5 760 S19 XP Hydro Miners</li>
                  <li>• 120 miners per container</li>
                </ul>
              </div>
              <div>
                <div className="text-slate-600 text-sm font-semibold mb-3">Cooling Systems</div>
                <ul className="space-y-2 text-slate-700">
                  <li>• 48 Hydro Cooling Modules</li>
                  <li>• Advanced liquid cooling</li>
                  <li>• Optimal thermal management</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

