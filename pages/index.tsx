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

      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-[1400px] mx-auto space-y-6">
          
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold text-slate-800">Qatar Strategic Reserve</h1>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-emerald-700">Live</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <TimeFilter selected={timeRange} onChange={setTimeRange} options={['7d', '30d', '90d']} />
              <ExportButton />
            </div>
          </div>

          {/* HERO CARDS - 2 COLUMNS */}
          <div className="grid grid-cols-2 gap-6">
            {/* BTC Holdings */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-500">Total Holdings</div>
                    <div className="text-xs text-slate-400">Cold Storage</div>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-50 text-xs font-semibold text-emerald-600">
                  +{mockStrategicReserve.reserveGrowth}% MTD
                </div>
              </div>
              
              <div className="flex items-baseline gap-3 mb-8">
                <span className="text-5xl font-bold text-slate-800">{mockStrategicReserve.totalBTC}</span>
                <span className="text-2xl font-medium text-slate-400">BTC</span>
              </div>
              
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">Monthly Rate</div>
                  <div className="text-xl font-semibold text-slate-700">+{mockStrategicReserve.monthlyAccumulation} <span className="text-sm text-slate-400">BTC</span></div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">Year Projection</div>
                  <div className="text-xl font-semibold text-emerald-600">{formatNumber(mockStrategicReserve.projectedYearEnd)} <span className="text-sm text-emerald-500">BTC</span></div>
                </div>
              </div>
            </div>

            {/* USD Value */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2">
                      <path d="M20 12V8H6a2 2 0 01-2-2 2 2 0 012-2h12v4M4 6v12a2 2 0 002 2h14v-4M18 12a2 2 0 000 4h4v-4h-4z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-500">Portfolio Value</div>
                    <div className="text-xs text-slate-400">USD Equivalent</div>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
                  Real-time
                </div>
              </div>
              
              <div className="flex items-baseline gap-3 mb-8">
                <span className="text-5xl font-bold text-slate-800">${(mockStrategicReserve.currentValue / 1000000).toFixed(0)}</span>
                <span className="text-2xl font-medium text-slate-400">M</span>
              </div>
              
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">BTC Price</div>
                  <div className="text-xl font-semibold text-slate-700">$98,450</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">24h Change</div>
                  <div className="text-xl font-semibold text-emerald-600 flex items-center gap-1">
                    +4.2%
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 15l-6-6-6 6"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* KPIs - 4 COLUMNS */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Hashrate', value: formatNumber(mockBitcoinKPIs.totalHashrate), unit: 'PH/s', color: 'emerald' },
              { label: 'Daily Output', value: mockBitcoinKPIs.dailyProduction, unit: 'BTC', color: 'emerald' },
              { label: 'Efficiency', value: mockBitcoinKPIs.efficiency, unit: 'J/TH', color: 'slate' },
              { label: 'Uptime', value: mockBitcoinKPIs.uptime, unit: '%', color: 'emerald' }
            ].map((kpi, idx) => (
              <div key={idx} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">{kpi.label}</span>
                  <div className={`w-2 h-2 rounded-full ${kpi.color === 'emerald' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-800">{kpi.value}</span>
                  <span className="text-sm text-slate-400">{kpi.unit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* CHARTS - 3 COLUMNS */}
          <div className="grid grid-cols-3 gap-6">
            {/* Production Chart */}
            <div className="col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">Production Trend</h3>
                  <p className="text-sm text-slate-400 mt-1">Daily BTC accumulation</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 text-xs text-slate-500">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  Production
                </div>
              </div>
              <AdvancedAreaChart
                data={productionData}
                areas={[{ dataKey: 'btc', name: 'BTC', color: '#10B981' }]}
                xAxisKey="date"
                height={240}
                showGrid={true}
                showLegend={false}
              />
            </div>

            {/* System Health */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-800">System Health</h3>
                <p className="text-sm text-slate-400 mt-1">Efficiency metrics</p>
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center">
                <GaugeChart
                  value={mockBitcoinKPIs.efficiency}
                  max={30}
                  min={20}
                  label="Efficiency"
                  unit=" J/TH"
                  size={140}
                  color="#10B981"
                />
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 uppercase">Uptime</span>
                  <span className="text-sm font-semibold text-slate-700">{mockBitcoinKPIs.uptime}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${mockBitcoinKPIs.uptime}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* NAVIGATION - 2 COLUMNS */}
          <div className="grid grid-cols-2 gap-6">
            <Link href="/infrastructure" className="group">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors">Infrastructure</h3>
                    <p className="text-sm text-slate-400">Power & Cooling Systems</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                    <svg className="w-5 h-5 text-slate-500 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50">
                    <div className="text-xs text-slate-400 uppercase mb-1">Containers</div>
                    <div className="text-xl font-bold text-slate-700">48/48</div>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-50">
                    <div className="text-xs text-emerald-600 uppercase mb-1">Power</div>
                    <div className="text-xl font-bold text-emerald-600">102 MW</div>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/mining-dashboard" className="group">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors">Mining Fleet</h3>
                    <p className="text-sm text-slate-400">Hardware Analytics</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                    <svg className="w-5 h-5 text-slate-500 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50">
                    <div className="text-xs text-slate-400 uppercase mb-1">Active Units</div>
                    <div className="text-xl font-bold text-slate-700">5,760</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50">
                    <div className="text-xs text-slate-400 uppercase mb-1">Maintenance</div>
                    <div className="text-xl font-bold text-slate-500">12</div>
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
