import Head from 'next/head';
import { useState } from 'react';
import { TimeFilter, TimeRange, ExportButton } from '../components/dashboard';
import {
  AdvancedLineChart,
  AdvancedAreaChart,
} from '../components/charts';
import {
  mockPowerSystems,
  mockCoolingSystems,
  mockPowerHistory,
  mockPowerHistory7Days,
  mockPowerHistory30Days,
  mockSystemUptime,
  mockEfficiencyHistory,
} from '../lib/mock-infrastructure';

export default function Infrastructure() {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');

  const powerSystems = mockPowerSystems;
  const coolingSystems = mockCoolingSystems;

  const totalLoad = powerSystems.reduce((sum, sys) => sum + sys.currentLoad, 0);
  const avgEfficiency = (powerSystems.reduce((sum, sys) => sum + sys.efficiency, 0) / powerSystems.length).toFixed(1);
  const systemUptime = 99.8;
  const avgTemp = (powerSystems.reduce((sum, sys) => sum + sys.temperature, 0) / powerSystems.length).toFixed(1);

  const getPowerData = () => {
    switch (timeRange) {
      case '24h': return mockPowerHistory;
      case '7d': return mockPowerHistory7Days;
      case '30d': return mockPowerHistory30Days;
      default: return mockPowerHistory;
    }
  };

  const powerData = getPowerData().map(d => ({
    time: 'date' in d ? new Date(d.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : d.hour,
    total: d.total,
  }));

  const uptimeData = mockSystemUptime.map(d => ({
    date: new Date(d.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
    overall: d.overall,
  }));

  const efficiencyData = mockEfficiencyHistory.map(d => ({
    date: new Date(d.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
    avg: (d.pb1 + d.pb2 + d.pb3 + d.pb4) / 4,
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-emerald-500';
      case 'warning': return 'bg-amber-400';
      case 'critical': return 'bg-red-400';
      default: return 'bg-slate-300';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-emerald-50 border-emerald-100';
      case 'warning': return 'bg-amber-50 border-amber-100';
      case 'critical': return 'bg-red-50 border-red-100';
      default: return 'bg-slate-50 border-slate-100';
    }
  };

  return (
    <>
      <Head>
        <title>Infrastructure - Hearst Qatar</title>
      </Head>

      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-[1400px] mx-auto space-y-6">
          
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold text-slate-800">Infrastructure Monitoring</h1>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-emerald-700">Online</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <TimeFilter selected={timeRange} onChange={setTimeRange} options={['24h', '7d', '30d']} />
              <ExportButton />
            </div>
          </div>

          {/* KPIs - 4 COLUMNS */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">System Uptime</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-800">{systemUptime}</span>
                <span className="text-sm text-slate-400">%</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">Last 30 days</div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Total Load</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-800">{totalLoad.toFixed(1)}</span>
                <span className="text-sm text-slate-400">MW</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">of 100 MW capacity</div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Efficiency</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-800">{avgEfficiency}</span>
                <span className="text-sm text-slate-400">%</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">Power systems</div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Temperature</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-800">{avgTemp}</span>
                <span className="text-sm text-slate-400">°C</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">Average</div>
            </div>
          </div>

          {/* POWER CHART */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Power Load</h3>
                <p className="text-sm text-slate-400 mt-1">Real-time consumption</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 text-xs text-slate-500">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                Total Load
              </div>
            </div>
            <AdvancedAreaChart
              data={powerData}
              areas={[{ dataKey: 'total', name: 'Total Load (MW)', color: '#10B981' }]}
              xAxisKey="time"
              height={260}
              showGrid={true}
              showLegend={false}
              yAxisLabel="MW"
            />
          </div>

          {/* PERFORMANCE CHARTS - 2 COLUMNS */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-semibold text-slate-700">System Uptime</h3>
                  <p className="text-sm text-slate-400 mt-1">30-day trend</p>
                </div>
              </div>
              <AdvancedLineChart
                data={uptimeData}
                lines={[{ dataKey: 'overall', name: 'Uptime', color: '#10B981', strokeWidth: 2 }]}
                xAxisKey="date"
                height={200}
                showGrid={true}
                showLegend={false}
                yAxisLabel="%"
              />
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-semibold text-slate-700">Operational Efficiency</h3>
                  <p className="text-sm text-slate-400 mt-1">30-day trend</p>
                </div>
              </div>
              <AdvancedLineChart
                data={efficiencyData}
                lines={[{ dataKey: 'avg', name: 'Efficiency', color: '#10B981', strokeWidth: 2 }]}
                xAxisKey="date"
                height={200}
                showGrid={true}
                showLegend={false}
                yAxisLabel="%"
              />
            </div>
          </div>

          {/* SYSTEMS STATUS - 2 COLUMNS */}
          <div className="grid grid-cols-2 gap-6">
            {/* Power Systems */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-base font-semibold text-slate-700 mb-5">Power Systems</h3>
              <div className="grid grid-cols-2 gap-4">
                {powerSystems.map(system => (
                  <div key={system.id} className={`rounded-xl p-4 border ${getStatusBg(system.status)}`}>
                    <div className="flex items-center gap-2 mb-4">
                      <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(system.status)}`} />
                      <span className="text-sm font-semibold text-slate-700">{system.name}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <div className="text-xs text-slate-400 mb-1">Load</div>
                        <div className="text-sm font-semibold text-slate-700">{system.currentLoad} MW</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 mb-1">Eff.</div>
                        <div className="text-sm font-semibold text-slate-700">{system.efficiency}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 mb-1">Temp</div>
                        <div className="text-sm font-semibold text-slate-700">{system.temperature}°C</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cooling Systems */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-base font-semibold text-slate-700 mb-5">Cooling Systems</h3>
              <div className="grid grid-cols-2 gap-4">
                {coolingSystems.map(system => (
                  <div key={system.id} className={`rounded-xl p-4 border ${getStatusBg(system.status)}`}>
                    <div className="flex items-center gap-2 mb-4">
                      <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(system.status)}`} />
                      <span className="text-sm font-semibold text-slate-700">{system.name}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <div className="text-xs text-slate-400 mb-1">Flow</div>
                        <div className="text-sm font-semibold text-slate-700">{system.flowRate} L/m</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 mb-1">Delta</div>
                        <div className="text-sm font-semibold text-slate-700">{system.temperature.input - system.temperature.output}°C</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 mb-1">Eff.</div>
                        <div className="text-sm font-semibold text-slate-700">{system.efficiency}%</div>
                      </div>
                    </div>
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
