import Head from 'next/head';
import { useState } from 'react';
import { TimeFilter, TimeRange, ExportButton } from '../components/dashboard';
import {
  AdvancedLineChart,
  AdvancedAreaChart,
  GaugeChart,
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
    time: 'date' in d ? new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : d.hour,
    total: d.total,
  }));

  const uptimeData = mockSystemUptime.map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    overall: d.overall,
  }));

  const efficiencyData = mockEfficiencyHistory.map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    avg: (d.pb1 + d.pb2 + d.pb3 + d.pb4) / 4,
  }));

  return (
    <>
      <Head>
        <title>Infrastructure Monitoring - Hearst Qatar</title>
      </Head>

      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-[1600px] mx-auto">
          {/* Header Simple */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-slate-200">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Infrastructure Monitoring</h1>
              <p className="text-sm text-slate-600">Real-time power systems & cooling performance</p>
            </div>
            <div className="flex items-center gap-3">
              <TimeFilter selected={timeRange} onChange={setTimeRange} options={['24h', '7d', '30d']} />
              <ExportButton />
            </div>
          </div>

          {/* KPIs - Grande Box Blanche avec Texte Foncé Lisible */}
          <div className="bg-white rounded-2xl p-8 mb-8 border border-slate-200 shadow-lg">
            <div className="grid grid-cols-4 gap-8">
              <div>
                <div className="text-slate-500 text-xs uppercase tracking-wider mb-3 font-semibold">System Uptime</div>
                <div className="flex items-baseline gap-3">
                  <div className="text-5xl font-bold text-slate-900">{systemUptime}</div>
                  <div className="text-xl font-semibold text-slate-600">%</div>
                </div>
                <div className="mt-2 text-sm text-slate-500">Last 30 days</div>
              </div>
              <div>
                <div className="text-slate-500 text-xs uppercase tracking-wider mb-3 font-semibold">Total Load</div>
                <div className="flex items-baseline gap-3">
                  <div className="text-5xl font-bold text-slate-900">{totalLoad.toFixed(1)}</div>
                  <div className="text-xl font-semibold text-slate-600">MW</div>
                </div>
                <div className="mt-2 text-sm text-slate-500">of 100 MW capacity</div>
              </div>
              <div>
                <div className="text-slate-500 text-xs uppercase tracking-wider mb-3 font-semibold">Efficiency</div>
                <div className="flex items-baseline gap-3">
                  <div className="text-5xl font-bold text-slate-900">{avgEfficiency}</div>
                  <div className="text-xl font-semibold text-slate-600">%</div>
                </div>
                <div className="mt-2 text-sm text-slate-500">Power systems</div>
              </div>
              <div>
                <div className="text-slate-500 text-xs uppercase tracking-wider mb-3 font-semibold">Temperature</div>
                <div className="flex items-baseline gap-3">
                  <div className="text-5xl font-bold text-slate-900">{avgTemp}</div>
                  <div className="text-xl font-semibold text-slate-600">°C</div>
                </div>
                <div className="mt-2 text-sm text-slate-500">Average</div>
              </div>
            </div>
          </div>

          {/* Power Monitoring - Grande Box */}
          <div className="bg-white rounded-2xl p-8 mb-8 border border-slate-200 shadow-lg">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Power Load Monitoring</h2>
              <p className="text-sm text-slate-600">Real-time power consumption across facility</p>
            </div>
            <AdvancedAreaChart
              data={powerData}
              areas={[
                { dataKey: 'total', name: 'Total Load (MW)', color: '#8AFD81' },
              ]}
              xAxisKey="time"
              height={280}
              showGrid={true}
              showLegend={false}
              yAxisLabel="MW"
            />
          </div>

          {/* System Performance - 2 Charts Côte à Côte */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 mb-2">System Uptime</h2>
                <p className="text-sm text-slate-600">Reliability trend (30 days)</p>
              </div>
              <AdvancedLineChart
                data={uptimeData}
                lines={[
                  { dataKey: 'overall', name: 'Uptime', color: '#8AFD81', strokeWidth: 3 },
                ]}
                xAxisKey="date"
                height={240}
                showGrid={true}
                showLegend={false}
                yAxisLabel="%"
              />
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 mb-2">Operational Efficiency</h2>
                <p className="text-sm text-slate-600">Performance trend (30 days)</p>
              </div>
              <AdvancedLineChart
                data={efficiencyData}
                lines={[
                  { dataKey: 'avg', name: 'Efficiency', color: '#8AFD81', strokeWidth: 3 },
                ]}
                xAxisKey="date"
                height={240}
                showGrid={true}
                showLegend={false}
                yAxisLabel="%"
              />
            </div>
          </div>

          {/* System Status - Liste Simple et Lisible */}
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-6">System Status Overview</h2>
            
            <div className="mb-6">
              <div className="text-sm font-semibold text-slate-700 mb-4">Power Systems</div>
              <div className="grid grid-cols-4 gap-4">
                {powerSystems.map(system => (
                  <div key={system.id} className="bg-white rounded-xl p-5 border border-slate-200">
                    <div className="text-sm font-bold text-slate-900 mb-3">{system.name}</div>
                    <div className="space-y-2 text-sm text-slate-700">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Load:</span>
                        <span className="font-semibold">{system.currentLoad} MW</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Efficiency:</span>
                        <span className="font-semibold">{system.efficiency}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Temp:</span>
                        <span className="font-semibold">{system.temperature}°C</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold text-slate-700 mb-4">Cooling Systems</div>
              <div className="grid grid-cols-4 gap-4">
                {coolingSystems.map(system => (
                  <div key={system.id} className="bg-white rounded-xl p-5 border border-slate-200">
                    <div className="text-sm font-bold text-slate-900 mb-3">{system.name}</div>
                    <div className="space-y-2 text-sm text-slate-700">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Flow:</span>
                        <span className="font-semibold">{system.flowRate} L/min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">ΔT:</span>
                        <span className="font-semibold">{system.temperature.input - system.temperature.output}°C</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Efficiency:</span>
                        <span className="font-semibold">{system.efficiency}%</span>
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

