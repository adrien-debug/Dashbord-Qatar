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

      <div className="min-h-screen bg-[#0F1419] p-4 lg:p-6">
        <div className="max-w-[1440px] mx-auto space-y-4">
          
          {/* HEADER BAR */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-white tracking-tight">Qatar Strategic Reserve</h1>
              <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#10B981]/10 border border-[#10B981]/20">
                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                <span className="text-[10px] font-medium text-[#10B981] uppercase tracking-wider">Live</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TimeFilter selected={timeRange} onChange={setTimeRange} options={['7d', '30d', '90d']} />
              <ExportButton />
            </div>
          </div>

          {/* HERO METRICS - 2 COLUMNS */}
          <div className="grid grid-cols-2 gap-4">
            {/* BTC Holdings */}
            <div className="bg-[#1A1F2E] rounded-lg p-6 border border-[#2A3142]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.5">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Total Holdings</div>
                    <div className="text-[10px] text-slate-500">Cold Storage</div>
                  </div>
                </div>
                <div className="px-2 py-1 rounded bg-[#10B981]/10 text-[10px] font-medium text-[#10B981]">
                  +{mockStrategicReserve.reserveGrowth}% MTD
                </div>
              </div>
              
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-bold text-white tracking-tight">{mockStrategicReserve.totalBTC}</span>
                <span className="text-xl font-medium text-slate-500">BTC</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#2A3142]">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Monthly Rate</div>
                  <div className="text-lg font-semibold text-white">+{mockStrategicReserve.monthlyAccumulation} <span className="text-sm text-slate-500">BTC</span></div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Year Projection</div>
                  <div className="text-lg font-semibold text-[#10B981]">{formatNumber(mockStrategicReserve.projectedYearEnd)} <span className="text-sm text-[#10B981]/70">BTC</span></div>
                </div>
              </div>
            </div>

            {/* USD Value */}
            <div className="bg-[#1A1F2E] rounded-lg p-6 border border-[#2A3142]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="1.5">
                      <path d="M20 12V8H6a2 2 0 01-2-2 2 2 0 012-2h12v4M4 6v12a2 2 0 002 2h14v-4M18 12a2 2 0 000 4h4v-4h-4z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Portfolio Value</div>
                    <div className="text-[10px] text-slate-500">USD Equivalent</div>
                  </div>
                </div>
                <div className="px-2 py-1 rounded bg-slate-700/50 text-[10px] font-medium text-slate-400">
                  Real-time
                </div>
              </div>
              
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-bold text-white tracking-tight">${(mockStrategicReserve.currentValue / 1000000).toFixed(0)}</span>
                <span className="text-xl font-medium text-slate-500">M</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#2A3142]">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">BTC Price</div>
                  <div className="text-lg font-semibold text-white">$98,450</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">24h Change</div>
                  <div className="text-lg font-semibold text-[#10B981] flex items-center gap-1">
                    +4.2%
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 15l-6-6-6 6"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* KPIs ROW - 4 COLUMNS SYMMETRIC */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Hashrate', value: formatNumber(mockBitcoinKPIs.totalHashrate), unit: 'PH/s', status: 'optimal' },
              { label: 'Daily Output', value: mockBitcoinKPIs.dailyProduction, unit: 'BTC', status: 'optimal' },
              { label: 'Efficiency', value: mockBitcoinKPIs.efficiency, unit: 'J/TH', status: 'optimal' },
              { label: 'Uptime', value: mockBitcoinKPIs.uptime, unit: '%', status: 'optimal' }
            ].map((kpi, idx) => (
              <div key={idx} className="bg-[#1A1F2E] rounded-lg p-4 border border-[#2A3142]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{kpi.label}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold text-white">{kpi.value}</span>
                  <span className="text-sm text-slate-500">{kpi.unit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* CHARTS ROW - 3 COLUMNS */}
          <div className="grid grid-cols-3 gap-4">
            {/* Production Chart - 2 cols */}
            <div className="col-span-2 bg-[#1A1F2E] rounded-lg p-5 border border-[#2A3142]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-medium text-white">Production Trend</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Daily BTC accumulation</p>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#2A3142] text-[10px] text-slate-400">
                  <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                  Production
                </div>
              </div>
              <AdvancedAreaChart
                data={productionData}
                areas={[{ dataKey: 'btc', name: 'BTC', color: '#10B981' }]}
                xAxisKey="date"
                height={220}
                showGrid={true}
                showLegend={false}
              />
            </div>

            {/* System Health - 1 col */}
            <div className="bg-[#1A1F2E] rounded-lg p-5 border border-[#2A3142] flex flex-col">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-white">System Health</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Efficiency metrics</p>
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center">
                <GaugeChart
                  value={mockBitcoinKPIs.efficiency}
                  max={30}
                  min={20}
                  label="Efficiency"
                  unit=" J/TH"
                  size={130}
                  color="#10B981"
                />
              </div>
              
              <div className="mt-4 pt-4 border-t border-[#2A3142]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-slate-500 uppercase">Uptime</span>
                  <span className="text-xs font-semibold text-white">{mockBitcoinKPIs.uptime}%</span>
                </div>
                <div className="w-full bg-[#2A3142] rounded-full h-1.5">
                  <div className="bg-[#10B981] h-1.5 rounded-full" style={{ width: `${mockBitcoinKPIs.uptime}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* NAVIGATION CARDS - 2 COLUMNS SYMMETRIC */}
          <div className="grid grid-cols-2 gap-4">
            <Link href="/infrastructure" className="group">
              <div className="bg-[#1A1F2E] rounded-lg p-5 border border-[#2A3142] hover:border-[#10B981]/30 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-medium text-white group-hover:text-[#10B981] transition-colors">Infrastructure</h3>
                    <p className="text-[10px] text-slate-500">Power & Cooling Systems</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-[#2A3142] flex items-center justify-center group-hover:bg-[#10B981] transition-colors">
                    <svg className="w-4 h-4 text-slate-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded bg-[#2A3142]/50">
                    <div className="text-[9px] text-slate-500 uppercase mb-0.5">Containers</div>
                    <div className="text-base font-semibold text-white">48/48</div>
                  </div>
                  <div className="p-3 rounded bg-[#2A3142]/50">
                    <div className="text-[9px] text-slate-500 uppercase mb-0.5">Power</div>
                    <div className="text-base font-semibold text-[#10B981]">102 MW</div>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/mining-dashboard" className="group">
              <div className="bg-[#1A1F2E] rounded-lg p-5 border border-[#2A3142] hover:border-[#10B981]/30 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-medium text-white group-hover:text-[#10B981] transition-colors">Mining Fleet</h3>
                    <p className="text-[10px] text-slate-500">Hardware Analytics</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-[#2A3142] flex items-center justify-center group-hover:bg-[#10B981] transition-colors">
                    <svg className="w-4 h-4 text-slate-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded bg-[#2A3142]/50">
                    <div className="text-[9px] text-slate-500 uppercase mb-0.5">Active Units</div>
                    <div className="text-base font-semibold text-white">5,760</div>
                  </div>
                  <div className="p-3 rounded bg-[#2A3142]/50">
                    <div className="text-[9px] text-slate-500 uppercase mb-0.5">Maintenance</div>
                    <div className="text-base font-semibold text-slate-400">12</div>
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
