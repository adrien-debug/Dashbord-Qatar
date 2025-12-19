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
      case 'warning': return 'bg-slate-400';
      case 'critical': return 'bg-slate-600';
      default: return 'bg-slate-300';
    }
  };

  return (
    <>
      <Head>
        <title>Infrastructure Monitoring - Hearst Qatar</title>
      </Head>

      <div className="min-h-screen bg-slate-50 p-4 lg:p-5">
        <div className="max-w-[1600px] mx-auto space-y-5">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="px-2.5 py-0.5 bg-emerald-500 text-white rounded text-[10px] font-semibold uppercase tracking-wider">
                  Infrastructure
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-800">Infrastructure Monitoring</h1>
              <p className="text-xs text-slate-400 mt-0.5">Power systems & cooling performance</p>
            </div>
            <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200">
              <TimeFilter selected={timeRange} onChange={setTimeRange} options={['24h', '7d', '30d']} />
              <ExportButton />
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 border border-slate-200">
              <div className="text-slate-500 text-[10px] uppercase tracking-wide mb-2 font-semibold">System Uptime</div>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold text-slate-800">{systemUptime}</div>
                <div className="text-lg font-medium text-slate-400">%</div>
              </div>
              <div className="mt-1.5 text-xs text-slate-400">Last 30 days</div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-slate-200">
              <div className="text-slate-500 text-[10px] uppercase tracking-wide mb-2 font-semibold">Total Load</div>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold text-slate-800">{totalLoad.toFixed(1)}</div>
                <div className="text-lg font-medium text-slate-400">MW</div>
              </div>
              <div className="mt-1.5 text-xs text-slate-400">of 100 MW capacity</div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-slate-200">
              <div className="text-slate-500 text-[10px] uppercase tracking-wide mb-2 font-semibold">Efficiency</div>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold text-slate-800">{avgEfficiency}</div>
                <div className="text-lg font-medium text-slate-400">%</div>
              </div>
              <div className="mt-1.5 text-xs text-slate-400">Power systems</div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-slate-200">
              <div className="text-slate-500 text-[10px] uppercase tracking-wide mb-2 font-semibold">Temperature</div>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold text-slate-800">{avgTemp}</div>
                <div className="text-lg font-medium text-slate-400">°C</div>
              </div>
              <div className="mt-1.5 text-xs text-slate-400">Average</div>
            </div>
          </div>

          {/* Power Chart */}
          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-slate-800">Power Load Monitoring</h2>
              <p className="text-xs text-slate-400 mt-0.5">Real-time power consumption</p>
            </div>
            <AdvancedAreaChart
              data={powerData}
              areas={[
                { dataKey: 'total', name: 'Total Load (MW)', color: '#10B981' },
              ]}
              xAxisKey="time"
              height={240}
              showGrid={true}
              showLegend={false}
              yAxisLabel="MW"
            />
          </div>

          {/* Performance Charts */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5 border border-slate-200">
              <div className="mb-5">
                <h2 className="text-sm font-semibold text-slate-800">System Uptime</h2>
                <p className="text-[10px] text-slate-400 mt-0.5">Reliability trend (30 days)</p>
              </div>
              <AdvancedLineChart
                data={uptimeData}
                lines={[
                  { dataKey: 'overall', name: 'Uptime', color: '#10B981', strokeWidth: 2 },
                ]}
                xAxisKey="date"
                height={200}
                showGrid={true}
                showLegend={false}
                yAxisLabel="%"
              />
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200">
              <div className="mb-5">
                <h2 className="text-sm font-semibold text-slate-800">Operational Efficiency</h2>
                <p className="text-[10px] text-slate-400 mt-0.5">Performance trend (30 days)</p>
              </div>
              <AdvancedLineChart
                data={efficiencyData}
                lines={[
                  { dataKey: 'avg', name: 'Efficiency', color: '#10B981', strokeWidth: 2 },
                ]}
                xAxisKey="date"
                height={200}
                showGrid={true}
                showLegend={false}
                yAxisLabel="%"
              />
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <h2 className="text-sm font-semibold text-slate-800 mb-4 uppercase tracking-wide">System Status</h2>
            
            <div className="mb-5">
              <div className="text-[10px] font-semibold text-slate-500 mb-3 uppercase tracking-wide">Power Systems</div>
              <div className="grid grid-cols-4 gap-3">
                {powerSystems.map(system => (
                  <div key={system.id} className="bg-slate-50 rounded-lg p-4 border border-slate-100 hover:border-slate-200 transition-colors">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(system.status)}`}></div>
                      <div className="text-xs font-semibold text-slate-800">{system.name}</div>
                    </div>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Load</span>
                        <span className="font-medium text-slate-700">{system.currentLoad} MW</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Efficiency</span>
                        <span className="font-medium text-slate-700">{system.efficiency}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Temp</span>
                        <span className="font-medium text-slate-700">{system.temperature}°C</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-semibold text-slate-500 mb-3 uppercase tracking-wide">Cooling Systems</div>
              <div className="grid grid-cols-4 gap-3">
                {coolingSystems.map(system => (
                  <div key={system.id} className="bg-slate-50 rounded-lg p-4 border border-slate-100 hover:border-slate-200 transition-colors">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(system.status)}`}></div>
                      <div className="text-xs font-semibold text-slate-800">{system.name}</div>
                    </div>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Flow</span>
                        <span className="font-medium text-slate-700">{system.flowRate} L/min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Delta T</span>
                        <span className="font-medium text-slate-700">{system.temperature.input - system.temperature.output}°C</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Efficiency</span>
                        <span className="font-medium text-slate-700">{system.efficiency}%</span>
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
