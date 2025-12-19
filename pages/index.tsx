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

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  const productionData = mockProductionHistory.slice(-30).map(d => ({
    date: new Date(d.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
    btc: d.btc,
  }));

  return (
    <>
      <Head>
        <title>QATAR Bitcoin Strategic Reserve - Executive Dashboard</title>
      </Head>

      <div className="min-h-screen bg-slate-50 p-4 lg:p-5">
        <div className="max-w-[1500px] mx-auto space-y-5">
          
          {/* HERO HEADER */}
          <div className="relative w-full h-[280px] rounded-2xl overflow-hidden bg-slate-900">
            {/* Background */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/50 to-transparent z-10" />
              <div 
                className="absolute inset-0 bg-[url('/Image%2012-12-2025%20a%CC%80%206.58%E2%80%AFPM.JPG')] bg-cover opacity-60"
                style={{ backgroundPosition: '30% center' }}
              />
            </div>

            {/* Content */}
            <div className="absolute inset-0 z-20 flex flex-col justify-between p-6 lg:p-8">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-emerald-500 text-white rounded text-[10px] font-semibold uppercase tracking-wider">
                    Official Dashboard
                  </span>
                  <span className="px-2.5 py-1 bg-white/10 text-white/90 rounded text-[10px] font-medium backdrop-blur-sm border border-white/10 uppercase tracking-wider">
                    Hearst Corporation
                  </span>
                </div>
                
                <div className="flex items-center gap-2 bg-slate-900/60 backdrop-blur p-1 rounded-lg border border-white/10">
                  <TimeFilter selected={timeRange} onChange={setTimeRange} options={['7d', '30d', '90d']} />
                  <ExportButton />
                </div>
              </div>

              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight leading-tight">
                  Qatar Bitcoin<br/>
                  <span className="text-emerald-400">Strategic Reserve</span>
                </h1>
                <div className="flex items-center gap-4 text-slate-300">
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-slate-800/60 border border-slate-700/50">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-semibold uppercase text-emerald-400">Operational</span>
                  </div>
                  <p className="text-xs font-medium text-slate-400">
                    100MW Institutional Mining Facility
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* KEY METRICS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Total BTC Reserve */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex justify-between items-start mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                      <path d="M20 12V8H6a2 2 0 01-2-2 2 2 0 012-2h12v4" />
                      <path d="M4 6v12a2 2 0 002 2h14v-4" />
                      <path d="M18 12a2 2 0 000 4h4v-4h-4z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px] font-semibold uppercase tracking-wide">Total Bitcoin Held</div>
                    <div className="text-slate-500 text-[10px]">Cold Storage</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded text-[10px] font-semibold">
                  <span>+{mockStrategicReserve.reserveGrowth}%</span>
                  <span className="text-emerald-400/70">this month</span>
                </div>
              </div>
              
              <div className="flex items-baseline gap-3 mb-5">
                <div className="text-5xl font-bold text-white tracking-tight">
                  {mockStrategicReserve.totalBTC}
                </div>
                <div className="text-xl font-medium text-slate-500">BTC</div>
              </div>
              
              <div className="flex items-center gap-6 pt-5 border-t border-slate-700">
                <div>
                  <div className="text-slate-500 text-[10px] uppercase tracking-wide mb-0.5 font-medium">Monthly</div>
                  <div className="text-lg font-bold text-white">
                    +{mockStrategicReserve.monthlyAccumulation} <span className="text-sm text-slate-500">BTC</span>
                  </div>
                </div>
                <div className="w-px h-8 bg-slate-700"></div>
                <div>
                  <div className="text-slate-500 text-[10px] uppercase tracking-wide mb-0.5 font-medium">Year-End</div>
                  <div className="text-lg font-bold text-emerald-400">
                    {formatNumber(mockStrategicReserve.projectedYearEnd)} <span className="text-sm text-emerald-400/70">BTC</span>
                  </div>
                </div>
              </div>
            </div>

            {/* USD Value */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex justify-between items-start mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[10px] font-semibold uppercase tracking-wide">Portfolio Value</div>
                    <div className="text-slate-400 text-[10px]">Real-time USD</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-[10px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Live</span>
                </div>
              </div>
              
              <div className="flex items-baseline gap-3 mb-5">
                <div className="text-5xl font-bold text-slate-800 tracking-tight">
                  ${(mockStrategicReserve.currentValue / 1000000).toFixed(0)}
                </div>
                <div className="text-xl font-medium text-slate-400">M</div>
              </div>

              <div className="flex items-center gap-6 pt-5 border-t border-slate-100">
                <div>
                  <div className="text-slate-400 text-[10px] uppercase tracking-wide mb-0.5 font-medium">BTC Price</div>
                  <div className="text-lg font-bold text-slate-800">$98,450</div>
                </div>
                <div className="w-px h-8 bg-slate-200"></div>
                <div>
                  <div className="text-slate-400 text-[10px] uppercase tracking-wide mb-0.5 font-medium">24h</div>
                  <div className="text-lg font-bold text-emerald-500 flex items-center gap-1">
                    +4.2%
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 15l-6-6-6 6"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* KPIs ROW */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Hashrate', value: formatNumber(mockBitcoinKPIs.totalHashrate), unit: 'PH/s', sub: '1.02 EH/s capacity' },
              { label: 'Daily Production', value: mockBitcoinKPIs.dailyProduction, unit: 'BTC', sub: 'Last 24 hours' },
              { label: 'Efficiency', value: mockBitcoinKPIs.efficiency, unit: 'J/TH', sub: 'Industry: 28.5' },
              { label: 'Fleet Uptime', value: mockBitcoinKPIs.uptime, unit: '%', sub: 'Last 30 days' }
            ].map((kpi, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 border border-slate-200 hover:border-slate-300 transition-colors">
                <div className="text-slate-500 text-[10px] font-semibold uppercase tracking-wide mb-2">{kpi.label}</div>
                <div className="flex items-baseline gap-1.5 mb-1">
                  <div className="text-2xl font-bold text-slate-800">{kpi.value}</div>
                  <div className="text-xs font-medium text-slate-400">{kpi.unit}</div>
                </div>
                <div className="text-[10px] text-slate-400">{kpi.sub}</div>
              </div>
            ))}
          </div>

          {/* CHARTS ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Production Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">Production Trend</h2>
                  <p className="text-[10px] text-slate-400 mt-0.5">Daily Bitcoin accumulation</p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  Production
                </div>
              </div>
              <AdvancedAreaChart
                data={productionData}
                areas={[
                  { dataKey: 'btc', name: 'BTC Production', color: '#10B981' },
                ]}
                xAxisKey="date"
                height={260}
                showGrid={true}
                showLegend={false}
              />
            </div>

            {/* System Health */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 flex flex-col">
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">System Health</h2>
                <p className="text-[10px] text-slate-400 mt-0.5">Efficiency & uptime</p>
              </div>
              
              <div className="flex-1 flex flex-col justify-center items-center gap-5">
                <GaugeChart
                  value={mockBitcoinKPIs.efficiency}
                  max={30}
                  min={20}
                  label="Energy Efficiency"
                  unit=" J/TH"
                  size={140}
                  color="#10B981"
                />
                
                <div className="w-full pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide">Uptime</span>
                    <span className="text-xs font-bold text-slate-800">{mockBitcoinKPIs.uptime}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${mockBitcoinKPIs.uptime}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* NAVIGATION CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Link href="/infrastructure" className="group block">
              <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 hover:border-emerald-500/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-base font-semibold text-white mb-0.5 group-hover:text-emerald-400 transition-colors">Infrastructure</h3>
                    <p className="text-[10px] text-slate-400">100MW Facility Overview</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                    <svg className="w-4 h-4 text-slate-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-lg bg-slate-700/50 border border-slate-600">
                    <div className="text-slate-400 text-[9px] uppercase font-semibold tracking-wide mb-0.5">Containers</div>
                    <div className="text-base font-bold text-white">48/48</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-700/50 border border-slate-600">
                    <div className="text-slate-400 text-[9px] uppercase font-semibold tracking-wide mb-0.5">Power</div>
                    <div className="text-base font-bold text-emerald-400">102 MW</div>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/mining-dashboard" className="group block">
              <div className="bg-white rounded-xl p-5 border border-slate-200 hover:border-emerald-500/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-base font-semibold text-slate-800 mb-0.5 group-hover:text-emerald-600 transition-colors">Mining Fleet</h3>
                    <p className="text-[10px] text-slate-400">Hardware Performance</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                    <svg className="w-4 h-4 text-slate-500 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span className="text-[10px] font-semibold text-slate-600">S19 XP Hydro</span>
                    </div>
                    <span className="text-sm font-bold text-slate-800">5,760 Units</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                      <span className="text-[10px] font-semibold text-slate-600">Maintenance</span>
                    </div>
                    <span className="text-sm font-bold text-slate-800">12 Units</span>
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
