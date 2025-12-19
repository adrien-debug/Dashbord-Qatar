import Head from 'next/head';
import { useState } from 'react';
import { TimeFilter, TimeRange, ExportButton } from '../components/dashboard';
import { formatNumber } from '../utils/formatNumber';
import {
  AdvancedLineChart,
  AdvancedAreaChart,
  Heatmap,
} from '../components/charts';
import {
  mockBitcoinKPIs,
  mockHardwareStatus,
  mockHashrateHistory,
  mockProductionHistory,
  mockReserveHistory,
  mockContainerPerformance,
} from '../lib/mock-mining';

export default function MiningDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  const getDaysFromRange = (range: TimeRange): number => {
    switch (range) {
      case '7d': return 7;
      case '30d': return 30;
      case '90d': return 90;
      default: return 30;
    }
  };

  const days = getDaysFromRange(timeRange);
  const filteredHashrate = mockHashrateHistory.slice(-days);
  const filteredProduction = mockProductionHistory.slice(-days);

  const hashrateChartData = filteredHashrate.map(d => ({
    date: new Date(d.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
    total: d.hashrate,
  }));

  const productionChartData = filteredProduction.map(d => ({
    date: new Date(d.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
    btc: d.btc,
  }));

  const reserveChartData = mockReserveHistory.slice(-90).map(d => ({
    date: new Date(d.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
    btc: d.btc,
  }));

  const powerBlocks = Array.from({ length: 6 }, (_, i) => {
    const startIdx = i * 8;
    const endIdx = startIdx + 8;
    const blockContainers = mockContainerPerformance.slice(startIdx, endIdx);
    
    return {
      id: `PB-${i + 1}`,
      name: `Block ${String.fromCharCode(65 + i)}`,
      containers: blockContainers.map(c => ({
        id: c.id,
        value: c.performance,
        label: c.id.split('-')[1],
        status: c.status as 'optimal' | 'warning' | 'critical' | 'offline',
      }))
    };
  });

  return (
    <>
      <Head>
        <title>Mining Command Center</title>
      </Head>

      <div className="min-h-screen bg-[#f5f5f7] p-8">
        <div className="max-w-[1200px] mx-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-[32px] font-semibold text-[#1d1d1f] tracking-tight">Mining Command Center</h1>
              <p className="text-[15px] text-[#86868b] mt-1">Hardware Analytics</p>
            </div>
            <div className="flex items-center gap-3">
              <TimeFilter selected={timeRange} onChange={setTimeRange} options={['7d', '30d', '90d']} />
              <ExportButton />
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-4 gap-4 mb-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[11px] text-[#86868b] uppercase tracking-wide mb-2">Fleet Status</p>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-[28px] font-semibold text-[#10B981] tracking-tight">{((mockHardwareStatus.activeMiners / mockHardwareStatus.totalMiners) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-[#f5f5f7] rounded-full h-[6px] mb-4">
                <div className="bg-[#10B981] h-[6px] rounded-full" style={{ width: '99.2%' }} />
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[#86868b]">Active: <span className="text-[#1d1d1f] font-medium">{formatNumber(mockHardwareStatus.activeMiners)}</span></span>
                <span className="text-[#86868b]">Maint: <span className="text-[#1d1d1f] font-medium">{mockHardwareStatus.maintenanceMiners}</span></span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[11px] text-[#86868b] uppercase tracking-wide mb-2">Hashrate</p>
              <div className="flex items-baseline gap-1">
                <span className="text-[28px] font-semibold text-[#1d1d1f] tracking-tight">{formatNumber(mockBitcoinKPIs.totalHashrate)}</span>
                <span className="text-[15px] text-[#86868b]">PH/s</span>
              </div>
              <p className="text-[13px] text-[#86868b] mt-2">Target: 1,000 PH/s</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[11px] text-[#86868b] uppercase tracking-wide mb-2">Daily Output</p>
              <div className="flex items-baseline gap-1">
                <span className="text-[28px] font-semibold text-[#1d1d1f] tracking-tight">{mockBitcoinKPIs.dailyProduction}</span>
                <span className="text-[15px] text-[#86868b]">BTC</span>
              </div>
              <p className="text-[13px] text-[#10B981] mt-2">~${(mockBitcoinKPIs.dailyProduction * 98450 / 1000).toFixed(0)}k revenue</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[11px] text-[#86868b] uppercase tracking-wide mb-2">Efficiency</p>
              <div className="flex items-baseline gap-1">
                <span className="text-[28px] font-semibold text-[#1d1d1f] tracking-tight">{mockBitcoinKPIs.efficiency}</span>
                <span className="text-[15px] text-[#86868b]">J/TH</span>
              </div>
              <p className="text-[13px] text-[#86868b] mt-2">Industry: 28.5 J/TH</p>
            </div>
          </div>

          {/* Hashrate Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-5">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-[17px] font-semibold text-[#1d1d1f]">Hashrate Evolution</h3>
                <p className="text-[13px] text-[#86868b]">Network performance over time</p>
              </div>
            </div>
            <AdvancedLineChart
              data={hashrateChartData}
              lines={[{ dataKey: 'total', name: 'Hashrate', color: '#10B981', strokeWidth: 2 }]}
              xAxisKey="date"
              height={240}
              showGrid={true}
              showLegend={false}
              yAxisLabel="PH/s"
            />
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-3 gap-5">
            {/* Small Charts */}
            <div className="space-y-5">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-[15px] font-semibold text-[#1d1d1f] mb-1">Accumulation</h3>
                <p className="text-[13px] text-[#86868b] mb-4">Reserve growth</p>
                <AdvancedAreaChart
                  data={reserveChartData}
                  areas={[{ dataKey: 'btc', name: 'BTC', color: '#10B981' }]}
                  xAxisKey="date"
                  height={140}
                  showGrid={true}
                  showLegend={false}
                />
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-[15px] font-semibold text-[#1d1d1f] mb-1">Daily Output</h3>
                <p className="text-[13px] text-[#86868b] mb-4">BTC mined</p>
                <AdvancedAreaChart
                  data={productionChartData}
                  areas={[{ dataKey: 'btc', name: 'BTC', color: '#10B981' }]}
                  xAxisKey="date"
                  height={140}
                  showGrid={true}
                  showLegend={false}
                />
              </div>
            </div>

            {/* Heatmap */}
            <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-[17px] font-semibold text-[#1d1d1f]">Infrastructure Heatmap</h3>
                  <p className="text-[13px] text-[#86868b]">48 Containers / 6 Power Blocks</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f5f5f7]">
                  <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  <span className="text-[11px] font-medium text-[#1d1d1f]">Live</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {powerBlocks.map((block) => (
                  <div key={block.id} className="bg-[#f5f5f7] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-semibold text-[#1d1d1f] uppercase tracking-wide">{block.name}</span>
                      <span className="text-[11px] text-[#86868b]">8 Units</span>
                    </div>
                    <Heatmap
                      data={block.containers}
                      rows={2}
                      cols={4}
                      cellSize={30}
                      showLabels={true}
                      onCellClick={(cell) => console.log('Container:', cell)}
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-8 mt-6 pt-5 border-t border-[#d2d2d7]/50">
                {[
                  { color: 'bg-[#10B981]', label: 'Optimal' },
                  { color: 'bg-[#FBBF24]', label: 'Warning' },
                  { color: 'bg-[#F87171]', label: 'Critical' },
                  { color: 'bg-[#d2d2d7]', label: 'Offline' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded ${item.color}`} />
                    <span className="text-[11px] text-[#86868b]">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
}
