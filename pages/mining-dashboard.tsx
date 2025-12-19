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

      <div className="min-h-screen bg-[#0F1419] p-4 lg:p-6">
        <div className="max-w-[1440px] mx-auto space-y-4">
          
          {/* HEADER */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-white tracking-tight">Mining Command Center</h1>
              <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#10B981]/10 border border-[#10B981]/20">
                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                <span className="text-[10px] font-medium text-[#10B981] uppercase tracking-wider">Operational</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TimeFilter selected={timeRange} onChange={setTimeRange} options={['7d', '30d', '90d']} />
              <ExportButton />
            </div>
          </div>

          {/* TOP ROW - 4 COLUMNS */}
          <div className="grid grid-cols-4 gap-4">
            {/* Fleet Status */}
            <div className="bg-[#1A1F2E] rounded-lg p-5 border border-[#2A3142]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Fleet Status</span>
                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-bold text-[#10B981]">{((mockHardwareStatus.activeMiners / mockHardwareStatus.totalMiners) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-[#2A3142] rounded-full h-1.5 mb-4">
                <div className="bg-[#10B981] h-1.5 rounded-full" style={{ width: '99.2%' }} />
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#2A3142]">
                <div>
                  <div className="text-[9px] text-slate-500 uppercase mb-0.5">Active</div>
                  <div className="text-sm font-semibold text-white">{formatNumber(mockHardwareStatus.activeMiners)}</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-500 uppercase mb-0.5">Maint.</div>
                  <div className="text-sm font-semibold text-slate-400">{mockHardwareStatus.maintenanceMiners}</div>
                </div>
              </div>
            </div>

            {/* Hashrate */}
            <div className="bg-[#1A1F2E] rounded-lg p-5 border border-[#2A3142]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Hashrate</span>
                <span className="text-[9px] font-medium text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded">Optimal</span>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold text-white">{formatNumber(mockBitcoinKPIs.totalHashrate)}</span>
                <span className="text-sm text-slate-500">PH/s</span>
              </div>
              <div className="text-[10px] text-slate-500">Target: 1,000 PH/s</div>
            </div>

            {/* Daily Production */}
            <div className="bg-[#1A1F2E] rounded-lg p-5 border border-[#2A3142]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Daily Output</span>
                <span className="text-[9px] font-medium text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded">Stable</span>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold text-white">{mockBitcoinKPIs.dailyProduction}</span>
                <span className="text-sm text-slate-500">BTC</span>
              </div>
              <div className="text-[10px] text-slate-500">~${(mockBitcoinKPIs.dailyProduction * 98450 / 1000).toFixed(0)}k revenue</div>
            </div>

            {/* Efficiency */}
            <div className="bg-[#1A1F2E] rounded-lg p-5 border border-[#2A3142]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Efficiency</span>
                <span className="text-[9px] font-medium text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded">Excellent</span>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold text-white">{mockBitcoinKPIs.efficiency}</span>
                <span className="text-sm text-slate-500">J/TH</span>
              </div>
              <div className="text-[10px] text-slate-500">Industry: 28.5 J/TH</div>
            </div>
          </div>

          {/* HASHRATE CHART */}
          <div className="bg-[#1A1F2E] rounded-lg p-5 border border-[#2A3142]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-medium text-white">Hashrate Evolution</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Network performance</p>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#2A3142] text-[10px] text-slate-400">
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                Total
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

          {/* BOTTOM ROW - 3 COLUMNS */}
          <div className="grid grid-cols-3 gap-4">
            {/* Charts Column */}
            <div className="space-y-4">
              <div className="bg-[#1A1F2E] rounded-lg p-5 border border-[#2A3142]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-medium text-white">Accumulation</h3>
                  <span className="text-[9px] text-slate-500">Reserve Growth</span>
                </div>
                <AdvancedAreaChart
                  data={reserveChartData}
                  areas={[{ dataKey: 'btc', name: 'BTC', color: '#10B981' }]}
                  xAxisKey="date"
                  height={140}
                  showGrid={true}
                  showLegend={false}
                />
              </div>
              
              <div className="bg-[#1A1F2E] rounded-lg p-5 border border-[#2A3142]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-medium text-white">Daily Output</h3>
                  <span className="text-[9px] text-slate-500">BTC Mined</span>
                </div>
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

            {/* Heatmap - 2 Columns */}
            <div className="col-span-2 bg-[#1A1F2E] rounded-lg p-5 border border-[#2A3142]">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-sm font-medium text-white">Infrastructure Heatmap</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">48 Containers / 6 Power Blocks</p>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#2A3142] text-[10px] text-slate-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  Live
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {powerBlocks.map((block) => (
                  <div key={block.id} className="bg-[#2A3142]/30 rounded-lg p-3 border border-[#2A3142]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">{block.name}</span>
                      </div>
                      <span className="text-[9px] text-slate-500">8 Units</span>
                    </div>
                    <Heatmap
                      data={block.containers}
                      rows={2}
                      cols={4}
                      cellSize={28}
                      showLabels={true}
                      onCellClick={(cell) => console.log('Container:', cell)}
                    />
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-5 pt-4 border-t border-[#2A3142]">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded bg-[#10B981]" />
                  <span className="text-[10px] text-slate-400">Optimal</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded bg-slate-500" />
                  <span className="text-[10px] text-slate-400">Warning</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded bg-slate-600" />
                  <span className="text-[10px] text-slate-400">Critical</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded bg-slate-700 border border-slate-600" />
                  <span className="text-[10px] text-slate-500">Offline</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
}
