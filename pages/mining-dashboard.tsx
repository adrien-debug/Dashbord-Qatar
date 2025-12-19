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
        <title>Mining Analytics - Hearst Qatar</title>
      </Head>

      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-[1400px] mx-auto space-y-6">
          
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold text-slate-800">Mining Command Center</h1>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-emerald-700">Operational</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <TimeFilter selected={timeRange} onChange={setTimeRange} options={['7d', '30d', '90d']} />
              <ExportButton />
            </div>
          </div>

          {/* KPIs - 4 COLUMNS */}
          <div className="grid grid-cols-4 gap-4">
            {/* Fleet Status */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Fleet Status</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-bold text-emerald-600">{((mockHardwareStatus.activeMiners / mockHardwareStatus.totalMiners) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 mb-4">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '99.2%' }} />
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                <div>
                  <div className="text-xs text-slate-400 mb-0.5">Active</div>
                  <div className="text-sm font-semibold text-slate-700">{formatNumber(mockHardwareStatus.activeMiners)}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-0.5">Maint.</div>
                  <div className="text-sm font-semibold text-slate-500">{mockHardwareStatus.maintenanceMiners}</div>
                </div>
              </div>
            </div>

            {/* Hashrate */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Hashrate</span>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Optimal</span>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold text-slate-800">{formatNumber(mockBitcoinKPIs.totalHashrate)}</span>
                <span className="text-sm text-slate-400">PH/s</span>
              </div>
              <div className="text-xs text-slate-400">Target: 1,000 PH/s</div>
            </div>

            {/* Daily Production */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Daily Output</span>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Stable</span>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold text-slate-800">{mockBitcoinKPIs.dailyProduction}</span>
                <span className="text-sm text-slate-400">BTC</span>
              </div>
              <div className="text-xs text-slate-400">~${(mockBitcoinKPIs.dailyProduction * 98450 / 1000).toFixed(0)}k revenue</div>
            </div>

            {/* Efficiency */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Efficiency</span>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Excellent</span>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold text-slate-800">{mockBitcoinKPIs.efficiency}</span>
                <span className="text-sm text-slate-400">J/TH</span>
              </div>
              <div className="text-xs text-slate-400">Industry: 28.5 J/TH</div>
            </div>
          </div>

          {/* HASHRATE CHART */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Hashrate Evolution</h3>
                <p className="text-sm text-slate-400 mt-1">Network performance</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 text-xs text-slate-500">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                Total
              </div>
            </div>
            <AdvancedLineChart
              data={hashrateChartData}
              lines={[{ dataKey: 'total', name: 'Hashrate', color: '#10B981', strokeWidth: 2 }]}
              xAxisKey="date"
              height={260}
              showGrid={true}
              showLegend={false}
              yAxisLabel="PH/s"
            />
          </div>

          {/* BOTTOM - 3 COLUMNS */}
          <div className="grid grid-cols-3 gap-6">
            {/* Small Charts */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-700">Accumulation</h3>
                  <span className="text-xs text-slate-400">Reserve Growth</span>
                </div>
                <AdvancedAreaChart
                  data={reserveChartData}
                  areas={[{ dataKey: 'btc', name: 'BTC', color: '#10B981' }]}
                  xAxisKey="date"
                  height={150}
                  showGrid={true}
                  showLegend={false}
                />
              </div>
              
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-700">Daily Output</h3>
                  <span className="text-xs text-slate-400">BTC Mined</span>
                </div>
                <AdvancedAreaChart
                  data={productionChartData}
                  areas={[{ dataKey: 'btc', name: 'BTC', color: '#10B981' }]}
                  xAxisKey="date"
                  height={150}
                  showGrid={true}
                  showLegend={false}
                />
              </div>
            </div>

            {/* Heatmap - 2 Columns */}
            <div className="col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">Infrastructure Heatmap</h3>
                  <p className="text-sm text-slate-400 mt-1">48 Containers / 6 Power Blocks</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-xs text-emerald-600">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {powerBlocks.map((block) => (
                  <div key={block.id} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{block.name}</span>
                      </div>
                      <span className="text-xs text-slate-400">8 Units</span>
                    </div>
                    <Heatmap
                      data={block.containers}
                      rows={2}
                      cols={4}
                      cellSize={32}
                      showLabels={true}
                      onCellClick={(cell) => console.log('Container:', cell)}
                    />
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-8 mt-6 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-emerald-500" />
                  <span className="text-xs text-slate-500">Optimal</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-amber-400" />
                  <span className="text-xs text-slate-500">Warning</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-red-400" />
                  <span className="text-xs text-slate-500">Critical</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-slate-300" />
                  <span className="text-xs text-slate-500">Offline</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
}
