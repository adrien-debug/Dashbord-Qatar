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
      case 'optimal': return 'bg-[#10B981]';
      case 'warning': return 'bg-slate-500';
      case 'critical': return 'bg-slate-600';
      default: return 'bg-slate-700';
    }
  };

  return (
    <>
      <Head>
        <title>Infrastructure - Hearst Qatar</title>
      </Head>

      <div className="min-h-screen bg-[#0F1419] p-4 lg:p-6">
        <div className="max-w-[1440px] mx-auto space-y-4">
          
          {/* HEADER */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-white tracking-tight">Infrastructure Monitoring</h1>
              <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#10B981]/10 border border-[#10B981]/20">
                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                <span className="text-[10px] font-medium text-[#10B981] uppercase tracking-wider">Online</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TimeFilter selected={timeRange} onChange={setTimeRange} options={['24h', '7d', '30d']} />
              <ExportButton />
            </div>
          </div>

          {/* KPIs ROW - 4 COLUMNS */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-[#1A1F2E] rounded-lg p-5 border border-[#2A3142]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">System Uptime</span>
                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">{systemUptime}</span>
                <span className="text-sm text-slate-500">%</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Last 30 days</div>
            </div>

            <div className="bg-[#1A1F2E] rounded-lg p-5 border border-[#2A3142]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Total Load</span>
                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">{totalLoad.toFixed(1)}</span>
                <span className="text-sm text-slate-500">MW</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">of 100 MW capacity</div>
            </div>

            <div className="bg-[#1A1F2E] rounded-lg p-5 border border-[#2A3142]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Efficiency</span>
                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">{avgEfficiency}</span>
                <span className="text-sm text-slate-500">%</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Power systems</div>
            </div>

            <div className="bg-[#1A1F2E] rounded-lg p-5 border border-[#2A3142]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Temperature</span>
                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">{avgTemp}</span>
                <span className="text-sm text-slate-500">°C</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Average</div>
            </div>
          </div>

          {/* POWER CHART */}
          <div className="bg-[#1A1F2E] rounded-lg p-5 border border-[#2A3142]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-medium text-white">Power Load</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Real-time consumption</p>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#2A3142] text-[10px] text-slate-400">
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                Total Load
              </div>
            </div>
            <AdvancedAreaChart
              data={powerData}
              areas={[{ dataKey: 'total', name: 'Total Load (MW)', color: '#10B981' }]}
              xAxisKey="time"
              height={220}
              showGrid={true}
              showLegend={false}
              yAxisLabel="MW"
            />
          </div>

          {/* PERFORMANCE CHARTS - 2 COLUMNS */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1A1F2E] rounded-lg p-5 border border-[#2A3142]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xs font-medium text-white">System Uptime</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">30-day trend</p>
                </div>
              </div>
              <AdvancedLineChart
                data={uptimeData}
                lines={[{ dataKey: 'overall', name: 'Uptime', color: '#10B981', strokeWidth: 2 }]}
                xAxisKey="date"
                height={180}
                showGrid={true}
                showLegend={false}
                yAxisLabel="%"
              />
            </div>

            <div className="bg-[#1A1F2E] rounded-lg p-5 border border-[#2A3142]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xs font-medium text-white">Operational Efficiency</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">30-day trend</p>
                </div>
              </div>
              <AdvancedLineChart
                data={efficiencyData}
                lines={[{ dataKey: 'avg', name: 'Efficiency', color: '#10B981', strokeWidth: 2 }]}
                xAxisKey="date"
                height={180}
                showGrid={true}
                showLegend={false}
                yAxisLabel="%"
              />
            </div>
          </div>

          {/* SYSTEMS STATUS - 2 ROWS */}
          <div className="grid grid-cols-2 gap-4">
            {/* Power Systems */}
            <div className="bg-[#1A1F2E] rounded-lg p-5 border border-[#2A3142]">
              <h3 className="text-xs font-medium text-white uppercase tracking-wide mb-4">Power Systems</h3>
              <div className="grid grid-cols-2 gap-3">
                {powerSystems.map(system => (
                  <div key={system.id} className="bg-[#2A3142]/30 rounded-lg p-3 border border-[#2A3142]">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(system.status)}`} />
                      <span className="text-[11px] font-medium text-white">{system.name}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[10px]">
                      <div>
                        <div className="text-slate-500 mb-0.5">Load</div>
                        <div className="font-medium text-white">{system.currentLoad} MW</div>
                      </div>
                      <div>
                        <div className="text-slate-500 mb-0.5">Eff.</div>
                        <div className="font-medium text-white">{system.efficiency}%</div>
                      </div>
                      <div>
                        <div className="text-slate-500 mb-0.5">Temp</div>
                        <div className="font-medium text-white">{system.temperature}°C</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cooling Systems */}
            <div className="bg-[#1A1F2E] rounded-lg p-5 border border-[#2A3142]">
              <h3 className="text-xs font-medium text-white uppercase tracking-wide mb-4">Cooling Systems</h3>
              <div className="grid grid-cols-2 gap-3">
                {coolingSystems.map(system => (
                  <div key={system.id} className="bg-[#2A3142]/30 rounded-lg p-3 border border-[#2A3142]">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(system.status)}`} />
                      <span className="text-[11px] font-medium text-white">{system.name}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[10px]">
                      <div>
                        <div className="text-slate-500 mb-0.5">Flow</div>
                        <div className="font-medium text-white">{system.flowRate} L/m</div>
                      </div>
                      <div>
                        <div className="text-slate-500 mb-0.5">Delta</div>
                        <div className="font-medium text-white">{system.temperature.input - system.temperature.output}°C</div>
                      </div>
                      <div>
                        <div className="text-slate-500 mb-0.5">Eff.</div>
                        <div className="font-medium text-white">{system.efficiency}%</div>
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
