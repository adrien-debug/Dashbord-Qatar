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
        <title>Qatar Strategic Reserve</title>
      </Head>

      <div className="min-h-screen bg-[#f5f5f7] p-8">
        <div className="max-w-[1200px] mx-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-[32px] font-semibold text-[#1d1d1f] tracking-tight">Qatar Strategic Reserve</h1>
              <p className="text-[15px] text-[#86868b] mt-1">Executive Dashboard</p>
            </div>
            <div className="flex items-center gap-3">
              <TimeFilter selected={timeRange} onChange={setTimeRange} options={['7d', '30d', '90d']} />
              <ExportButton />
            </div>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-2 gap-5 mb-5">
            {/* BTC Holdings */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                  </svg>
                </div>
                <div>
                  <p className="text-[13px] text-[#86868b]">Total Holdings</p>
                  <p className="text-[11px] text-[#86868b]">Cold Storage</p>
                </div>
              </div>
              
              <div className="mb-8">
                <span className="text-[56px] font-semibold text-[#1d1d1f] tracking-tight leading-none">{mockStrategicReserve.totalBTC}</span>
                <span className="text-[24px] font-medium text-[#86868b] ml-2">BTC</span>
              </div>
              
              <div className="flex gap-8 pt-6 border-t border-[#d2d2d7]/50">
                <div>
                  <p className="text-[11px] text-[#86868b] uppercase tracking-wide mb-1">Monthly</p>
                  <p className="text-[20px] font-medium text-[#1d1d1f]">+{mockStrategicReserve.monthlyAccumulation} BTC</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#86868b] uppercase tracking-wide mb-1">Projection</p>
                  <p className="text-[20px] font-medium text-[#10B981]">{formatNumber(mockStrategicReserve.projectedYearEnd)} BTC</p>
                </div>
              </div>
            </div>

            {/* Portfolio Value */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-full bg-[#f5f5f7] flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" strokeWidth="1.5">
                    <path d="M20 12V8H6a2 2 0 01-2-2 2 2 0 012-2h12v4M4 6v12a2 2 0 002 2h14v-4M18 12a2 2 0 000 4h4v-4h-4z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[13px] text-[#86868b]">Portfolio Value</p>
                  <p className="text-[11px] text-[#86868b]">USD Equivalent</p>
                </div>
              </div>
              
              <div className="mb-8">
                <span className="text-[56px] font-semibold text-[#1d1d1f] tracking-tight leading-none">${(mockStrategicReserve.currentValue / 1000000).toFixed(0)}</span>
                <span className="text-[24px] font-medium text-[#86868b] ml-2">M</span>
              </div>
              
              <div className="flex gap-8 pt-6 border-t border-[#d2d2d7]/50">
                <div>
                  <p className="text-[11px] text-[#86868b] uppercase tracking-wide mb-1">BTC Price</p>
                  <p className="text-[20px] font-medium text-[#1d1d1f]">$98,450</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#86868b] uppercase tracking-wide mb-1">24h Change</p>
                  <p className="text-[20px] font-medium text-[#10B981]">+4.2%</p>
                </div>
              </div>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-4 gap-4 mb-5">
            {[
              { label: 'Hashrate', value: formatNumber(mockBitcoinKPIs.totalHashrate), unit: 'PH/s' },
              { label: 'Daily Output', value: mockBitcoinKPIs.dailyProduction, unit: 'BTC' },
              { label: 'Efficiency', value: mockBitcoinKPIs.efficiency, unit: 'J/TH' },
              { label: 'Uptime', value: mockBitcoinKPIs.uptime, unit: '%' }
            ].map((kpi, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm">
                <p className="text-[11px] text-[#86868b] uppercase tracking-wide mb-2">{kpi.label}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-[28px] font-semibold text-[#1d1d1f] tracking-tight">{kpi.value}</span>
                  <span className="text-[15px] text-[#86868b]">{kpi.unit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-3 gap-5 mb-5">
            <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-[17px] font-semibold text-[#1d1d1f]">Production Trend</h3>
                  <p className="text-[13px] text-[#86868b]">Daily BTC accumulation</p>
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

            <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col">
              <div className="mb-4">
                <h3 className="text-[17px] font-semibold text-[#1d1d1f]">System Health</h3>
                <p className="text-[13px] text-[#86868b]">Efficiency metrics</p>
              </div>
              
              <div className="flex-1 flex items-center justify-center">
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
              
              <div className="pt-4 border-t border-[#d2d2d7]/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-[#86868b] uppercase">Uptime</span>
                  <span className="text-[13px] font-medium text-[#1d1d1f]">{mockBitcoinKPIs.uptime}%</span>
                </div>
                <div className="w-full bg-[#f5f5f7] rounded-full h-[6px]">
                  <div className="bg-[#10B981] h-[6px] rounded-full" style={{ width: `${mockBitcoinKPIs.uptime}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Cards */}
          <div className="grid grid-cols-2 gap-5">
            <Link href="/infrastructure" className="group">
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-[17px] font-semibold text-[#1d1d1f] group-hover:text-[#10B981] transition-colors">Infrastructure</h3>
                    <p className="text-[13px] text-[#86868b]">Power & Cooling Systems</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center group-hover:bg-[#10B981] transition-colors">
                    <svg className="w-5 h-5 text-[#86868b] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 p-4 rounded-xl bg-[#f5f5f7]">
                    <p className="text-[11px] text-[#86868b] uppercase mb-1">Containers</p>
                    <p className="text-[20px] font-semibold text-[#1d1d1f]">48/48</p>
                  </div>
                  <div className="flex-1 p-4 rounded-xl bg-[#f5f5f7]">
                    <p className="text-[11px] text-[#86868b] uppercase mb-1">Power</p>
                    <p className="text-[20px] font-semibold text-[#10B981]">102 MW</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/mining-dashboard" className="group">
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-[17px] font-semibold text-[#1d1d1f] group-hover:text-[#10B981] transition-colors">Mining Fleet</h3>
                    <p className="text-[13px] text-[#86868b]">Hardware Analytics</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center group-hover:bg-[#10B981] transition-colors">
                    <svg className="w-5 h-5 text-[#86868b] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 p-4 rounded-xl bg-[#f5f5f7]">
                    <p className="text-[11px] text-[#86868b] uppercase mb-1">Active Units</p>
                    <p className="text-[20px] font-semibold text-[#1d1d1f]">5,760</p>
                  </div>
                  <div className="flex-1 p-4 rounded-xl bg-[#f5f5f7]">
                    <p className="text-[11px] text-[#86868b] uppercase mb-1">Maintenance</p>
                    <p className="text-[20px] font-semibold text-[#86868b]">12</p>
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
