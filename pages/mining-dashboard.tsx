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
  mockStrategicReserve,
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

  const heatmapData = mockContainerPerformance.map(c => ({
    id: c.id,
    value: c.performance,
    label: c.id.split('-')[1],
    status: c.status as 'optimal' | 'warning' | 'critical' | 'offline',
  }));

  return (
    <>
      <Head>
        <title>Mining Dashboard - Hearst Qatar</title>
      </Head>

      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-[1600px] mx-auto">
          {/* Header Simple */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-slate-200">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Mining & Reserve Dashboard</h1>
              <p className="text-sm text-slate-600">Bitcoin production analytics & hardware monitoring</p>
            </div>
            <div className="flex items-center gap-3">
              <TimeFilter selected={timeRange} onChange={setTimeRange} />
              <ExportButton />
            </div>
          </div>

          {/* KPIs - Grande Box Blanche avec Texte Foncé Lisible */}
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
                <div className="text-slate-500 text-xs uppercase tracking-wider mb-3 font-semibold">BTC Reserve</div>
                <div className="flex items-baseline gap-3">
                  <div className="text-5xl font-bold text-slate-900">{mockStrategicReserve.totalBTC}</div>
                  <div className="text-xl font-semibold text-slate-600">BTC</div>
                </div>
                <div className="mt-2 text-sm text-slate-500">Accumulated</div>
              </div>
              <div>
                <div className="text-slate-500 text-xs uppercase tracking-wider mb-3 font-semibold">Fleet Health</div>
                <div className="flex items-baseline gap-3">
                  <div className="text-5xl font-bold text-slate-900">{((mockHardwareStatus.activeMiners / mockHardwareStatus.totalMiners) * 100).toFixed(1)}</div>
                  <div className="text-xl font-semibold text-slate-600">%</div>
                </div>
                <div className="mt-2 text-sm text-slate-500">Operational rate</div>
              </div>
            </div>
          </div>

          {/* Hashrate Evolution - Grande Box */}
          <div className="bg-white rounded-2xl p-8 mb-8 border border-slate-200 shadow-lg">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Hashrate Evolution</h2>
              <p className="text-sm text-slate-600">Total hashrate performance over time</p>
            </div>
            <AdvancedLineChart
              data={hashrateChartData}
              lines={[
                { dataKey: 'total', name: 'Total Hashrate', color: '#8AFD81', strokeWidth: 3 },
              ]}
              xAxisKey="date"
              height={280}
              showGrid={true}
              showLegend={false}
              yAxisLabel="PH/s"
            />
          </div>

          {/* Production & Reserve - 2 Charts Côte à Côte */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 mb-2">BTC Production</h2>
                <p className="text-sm text-slate-600">Daily production trend</p>
              </div>
              <AdvancedAreaChart
                data={productionChartData}
                areas={[{ dataKey: 'btc', name: 'BTC', color: '#8AFD81' }]}
                xAxisKey="date"
                height={240}
                showGrid={true}
                showLegend={false}
                yAxisLabel="BTC"
              />
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 mb-2">Reserve Accumulation</h2>
                <p className="text-sm text-slate-600">Cumulative BTC (90 days)</p>
              </div>
              <AdvancedAreaChart
                data={reserveChartData}
                areas={[{ dataKey: 'btc', name: 'BTC', color: '#8AFD81' }]}
                xAxisKey="date"
                height={240}
                showGrid={true}
                showLegend={false}
                yAxisLabel="BTC"
              />
            </div>
          </div>

          {/* Hardware Fleet - Grande Box avec Info Claire */}
          <div className="bg-slate-50 rounded-2xl p-8 mb-8 border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Hardware Fleet Status</h2>
            <div className="grid grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="text-base font-bold text-slate-900 mb-4">Miners</div>
                <div className="space-y-3 text-base text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total:</span>
                    <span className="font-bold">{formatNumber(mockHardwareStatus.totalMiners)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Active:</span>
                    <span className="font-bold text-slate-900">{formatNumber(mockHardwareStatus.activeMiners)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Maintenance:</span>
                    <span className="font-bold text-amber-600">{formatNumber(mockHardwareStatus.maintenanceMiners)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Offline:</span>
                    <span className="font-bold text-slate-400">{formatNumber(mockHardwareStatus.offlineMiners)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="text-base font-bold text-slate-900 mb-4">Containers</div>
                <div className="space-y-3 text-base text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total:</span>
                    <span className="font-bold">{formatNumber(mockHardwareStatus.containers.total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Active:</span>
                    <span className="font-bold text-slate-900">{formatNumber(mockHardwareStatus.containers.active)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Maintenance:</span>
                    <span className="font-bold text-amber-600">{formatNumber(mockHardwareStatus.containers.maintenance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Per Container:</span>
                    <span className="font-bold text-slate-900">120 miners</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Container Heatmap - Grande Box */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Container Performance Map</h2>
              <p className="text-sm text-slate-600">Real-time status of all 48 containers</p>
            </div>
            <div className="flex justify-center">
              <Heatmap
                data={heatmapData}
                rows={4}
                cols={12}
                cellSize={60}
                showLabels={true}
                onCellClick={(cell) => console.log('Container:', cell)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

