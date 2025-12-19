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
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    total: d.hashrate,
  }));

  const productionChartData = filteredProduction.map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    btc: d.btc,
  }));

  const reserveChartData = mockReserveHistory.slice(-90).map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    btc: d.btc,
  }));

  // Group Heatmap Data by Power Block (6 Blocks of 8 Containers)
  // Assuming 48 containers total.
  // Block 1: 1-8, Block 2: 9-16, etc.
  const powerBlocks = Array.from({ length: 6 }, (_, i) => {
    const startIdx = i * 8;
    const endIdx = startIdx + 8;
    const blockContainers = mockContainerPerformance.slice(startIdx, endIdx);
    
    return {
      id: `PB-${i + 1}`,
      name: `Power Block ${String.fromCharCode(65 + i)}`, // A, B, C...
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

      <div className="min-h-screen bg-slate-50 p-4 lg:p-6">
        <div className="max-w-[1500px] mx-auto space-y-6">
          
          {/* 1. HEADER - COMPACT & CLEAN */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-4 pb-2">
             <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-[#8AFD81] text-slate-900 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                    Operations
                  </span>
                  <span className="text-slate-400 text-xs font-medium uppercase tracking-widest">
                    Real-time Analytics
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Mining Command Center</h1>
             </div>
             
             <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
                <TimeFilter selected={timeRange} onChange={setTimeRange} options={['7d', '30d', '90d']} />
                <ExportButton />
             </div>
          </div>

          {/* 2. FLEET HEALTH - HIGH LEVEL STATUS */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
             {/* Fleet Status Card */}
             <div className="lg:col-span-1 bg-slate-900 rounded-2xl p-6 border border-slate-800 flex flex-col justify-between shadow-xl">
                <div>
                   <h2 className="text-white font-bold text-lg mb-4">Fleet Status</h2>
                   <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-4xl font-bold text-[#8AFD81]">{((mockHardwareStatus.activeMiners / mockHardwareStatus.totalMiners) * 100).toFixed(1)}%</span>
                      <span className="text-slate-400 text-sm">Operational</span>
                   </div>
                   <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                      <div className="bg-[#8AFD81] h-full rounded-full" style={{ width: '99.2%' }}></div>
                   </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-8">
                   <div>
                      <div className="text-slate-500 text-[10px] uppercase mb-1">Active Miners</div>
                      <div className="text-xl font-bold text-white">{formatNumber(mockHardwareStatus.activeMiners)}</div>
                   </div>
                   <div>
                      <div className="text-slate-500 text-[10px] uppercase mb-1">Maintenance</div>
                      <div className="text-xl font-bold text-amber-500">{mockHardwareStatus.maintenanceMiners}</div>
                   </div>
                </div>
             </div>

             {/* KPIs Compact */}
             <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                   <div className="flex justify-between items-start mb-2">
                      <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Total Hashrate</div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">▲ Optimal</span>
                   </div>
                   <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-slate-900">{formatNumber(mockBitcoinKPIs.totalHashrate)}</span>
                      <span className="text-sm font-medium text-slate-500">PH/s</span>
                   </div>
                   <div className="mt-2 text-xs text-slate-400">Target: 1,000 PH/s</div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                   <div className="flex justify-between items-start mb-2">
                      <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Daily Production</div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">▲ Stable</span>
                   </div>
                   <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-slate-900">{mockBitcoinKPIs.dailyProduction}</span>
                      <span className="text-sm font-medium text-slate-500">BTC</span>
                   </div>
                   <div className="mt-2 text-xs text-slate-400">~${(mockBitcoinKPIs.dailyProduction * 98450 / 1000).toFixed(0)}k daily revenue</div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                   <div className="flex justify-between items-start mb-2">
                      <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Efficiency</div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">▼ Excellent</span>
                   </div>
                   <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-slate-900">{mockBitcoinKPIs.efficiency}</span>
                      <span className="text-sm font-medium text-slate-500">J/TH</span>
                   </div>
                   <div className="mt-2 text-xs text-slate-400">Industry avg: 28.5 J/TH</div>
                </div>
             </div>
          </div>

          {/* 3. HASHRATE EVOLUTION - MAIN CHART */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Hashrate Evolution</h2>
                <p className="text-sm text-slate-500 mt-0.5">Network performance analysis</p>
              </div>
            </div>
            <AdvancedLineChart
              data={hashrateChartData}
              lines={[
                { dataKey: 'total', name: 'Total Hashrate', color: '#8AFD81', strokeWidth: 3 },
              ]}
              xAxisKey="date"
              height={300}
              showGrid={true}
              showLegend={false}
              yAxisLabel="PH/s"
            />
          </div>

          {/* 4. PERFORMANCE & HEATMAP GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* Production Area Chart */}
             <div className="lg:col-span-1 flex flex-col gap-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg flex-1">
                   <div className="mb-4">
                      <h2 className="text-lg font-bold text-slate-900">Accumulation</h2>
                      <p className="text-xs text-slate-500">Reserve Growth</p>
                   </div>
                   <AdvancedAreaChart
                      data={reserveChartData}
                      areas={[{ dataKey: 'btc', name: 'BTC', color: '#8AFD81' }]}
                      xAxisKey="date"
                      height={200}
                      showGrid={true}
                      showLegend={false}
                   />
                </div>
                
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg flex-1">
                   <div className="mb-4">
                      <h2 className="text-lg font-bold text-slate-900">Daily Output</h2>
                      <p className="text-xs text-slate-500">BTC Mined</p>
                   </div>
                   <AdvancedAreaChart
                      data={productionChartData}
                      areas={[{ dataKey: 'btc', name: 'BTC', color: '#8AFD81' }]}
                      xAxisKey="date"
                      height={200}
                      showGrid={true}
                      showLegend={false}
                   />
                </div>
             </div>

             {/* Container Heatmap - Takes 2/3 */}
             <div className="lg:col-span-2 bg-white rounded-2xl p-8 border border-slate-200 shadow-lg">
                <div className="flex justify-between items-start mb-8">
                   <div>
                      <h2 className="text-xl font-bold text-slate-900">Infrastructure Heatmap</h2>
                      <p className="text-sm text-slate-500 mt-0.5">Real-time status of 48 Hydro Containers by Power Block</p>
                   </div>
                   <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Live Monitoring
                   </div>
                </div>
                
                {/* 6 Power Blocks Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {powerBlocks.map((block) => (
                    <div key={block.id} className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 hover:border-slate-200 transition-colors">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-[#8AFD81]"></div>
                           <span className="text-xs font-bold uppercase tracking-wider text-slate-600">{block.name}</span>
                        </div>
                        <span className="text-[10px] font-medium text-slate-400">8 Units</span>
                      </div>
                      
                      <Heatmap
                         data={block.containers}
                         rows={2}
                         cols={4}
                         cellSize={40}
                         showLabels={true}
                         onCellClick={(cell) => console.log('Container:', cell)}
                      />
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#8AFD81] shadow-sm" />
                      <span className="text-xs font-semibold text-slate-600">Optimal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#f59e0b] shadow-sm" />
                      <span className="text-xs font-semibold text-slate-600">Warning</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#ef4444] shadow-sm" />
                      <span className="text-xs font-semibold text-slate-600">Critical</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-slate-300 border border-slate-200" />
                      <span className="text-xs font-semibold text-slate-400">Offline</span>
                    </div>
                </div>
             </div>
          </div>
          
        </div>
      </div>
    </>
  );
}
