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
      name: `Power Block ${String.fromCharCode(65 + i)}`,
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

      <div className="min-h-screen bg-slate-50 p-4 lg:p-5">
        <div className="max-w-[1500px] mx-auto space-y-5">
          
          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-4 pb-3 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="px-2.5 py-0.5 bg-emerald-500 text-white rounded text-[10px] font-semibold uppercase tracking-wider">
                  Operations
                </span>
                <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                  Real-time Analytics
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-800">Mining Command Center</h1>
            </div>
            
            <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200">
              <TimeFilter selected={timeRange} onChange={setTimeRange} options={['7d', '30d', '90d']} />
              <ExportButton />
            </div>
          </div>

          {/* FLEET STATUS & KPIs */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Fleet Status Card */}
            <div className="lg:col-span-1 bg-slate-800 rounded-xl p-5 border border-slate-700 flex flex-col justify-between">
              <div>
                <h2 className="text-white font-semibold text-sm mb-3 uppercase tracking-wide">Fleet Status</h2>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-emerald-400">{((mockHardwareStatus.activeMiners / mockHardwareStatus.totalMiners) * 100).toFixed(1)}%</span>
                  <span className="text-slate-400 text-xs">Operational</span>
                </div>
                <div className="w-full bg-slate-700 h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '99.2%' }}></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-slate-700">
                <div>
                  <div className="text-slate-500 text-[10px] uppercase mb-0.5">Active</div>
                  <div className="text-lg font-bold text-white">{formatNumber(mockHardwareStatus.activeMiners)}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[10px] uppercase mb-0.5">Maintenance</div>
                  <div className="text-lg font-bold text-slate-400">{mockHardwareStatus.maintenanceMiners}</div>
                </div>
              </div>
            </div>

            {/* KPIs */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-5 border border-slate-200 hover:border-slate-300 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-slate-500 text-[10px] font-semibold uppercase tracking-wide">Total Hashrate</div>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Optimal</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-800">{formatNumber(mockBitcoinKPIs.totalHashrate)}</span>
                  <span className="text-sm font-medium text-slate-400">PH/s</span>
                </div>
                <div className="mt-1.5 text-xs text-slate-400">Target: 1,000 PH/s</div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-slate-200 hover:border-slate-300 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-slate-500 text-[10px] font-semibold uppercase tracking-wide">Daily Production</div>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Stable</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-800">{mockBitcoinKPIs.dailyProduction}</span>
                  <span className="text-sm font-medium text-slate-400">BTC</span>
                </div>
                <div className="mt-1.5 text-xs text-slate-400">~${(mockBitcoinKPIs.dailyProduction * 98450 / 1000).toFixed(0)}k revenue</div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-slate-200 hover:border-slate-300 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-slate-500 text-[10px] font-semibold uppercase tracking-wide">Efficiency</div>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Excellent</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-800">{mockBitcoinKPIs.efficiency}</span>
                  <span className="text-sm font-medium text-slate-400">J/TH</span>
                </div>
                <div className="mt-1.5 text-xs text-slate-400">Industry avg: 28.5 J/TH</div>
              </div>
            </div>
          </div>

          {/* HASHRATE CHART */}
          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Hashrate Evolution</h2>
                <p className="text-xs text-slate-400 mt-0.5">Network performance analysis</p>
              </div>
            </div>
            <AdvancedLineChart
              data={hashrateChartData}
              lines={[
                { dataKey: 'total', name: 'Total Hashrate', color: '#22C55E', strokeWidth: 2 },
              ]}
              xAxisKey="date"
              height={260}
              showGrid={true}
              showLegend={false}
              yAxisLabel="PH/s"
            />
          </div>

          {/* CHARTS & HEATMAP */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Side Charts */}
            <div className="lg:col-span-1 flex flex-col gap-4">
              <div className="bg-white rounded-xl p-5 border border-slate-200 flex-1">
                <div className="mb-3">
                  <h2 className="text-sm font-semibold text-slate-800">Accumulation</h2>
                  <p className="text-[10px] text-slate-400">Reserve Growth</p>
                </div>
                <AdvancedAreaChart
                  data={reserveChartData}
                  areas={[{ dataKey: 'btc', name: 'BTC', color: '#22C55E' }]}
                  xAxisKey="date"
                  height={160}
                  showGrid={true}
                  showLegend={false}
                />
              </div>
              
              <div className="bg-white rounded-xl p-5 border border-slate-200 flex-1">
                <div className="mb-3">
                  <h2 className="text-sm font-semibold text-slate-800">Daily Output</h2>
                  <p className="text-[10px] text-slate-400">BTC Mined</p>
                </div>
                <AdvancedAreaChart
                  data={productionChartData}
                  areas={[{ dataKey: 'btc', name: 'BTC', color: '#22C55E' }]}
                  xAxisKey="date"
                  height={160}
                  showGrid={true}
                  showLegend={false}
                />
              </div>
            </div>

            {/* Heatmap */}
            <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200">
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">Infrastructure Heatmap</h2>
                  <p className="text-xs text-slate-400 mt-0.5">48 Hydro Containers by Power Block</p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live
                </div>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {powerBlocks.map((block) => (
                  <div key={block.id} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">{block.name}</span>
                      </div>
                      <span className="text-[9px] font-medium text-slate-400">8 Units</span>
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
              <div className="flex flex-wrap items-center justify-center gap-5 mt-5 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-medium text-slate-600">Optimal</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  <span className="text-[10px] font-medium text-slate-600">Warning</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                  <span className="text-[10px] font-medium text-slate-600">Critical</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200 border border-slate-300" />
                  <span className="text-[10px] font-medium text-slate-400">Offline</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
}
