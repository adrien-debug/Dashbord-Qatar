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

  return (
    <>
      <Head>
        <title>Infrastructure Monitoring</title>
      </Head>

      <div className="min-h-screen bg-[#f5f5f7] p-8">
        <div className="max-w-[1200px] mx-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-[32px] font-semibold text-[#1d1d1f] tracking-tight">Infrastructure</h1>
              <p className="text-[15px] text-[#86868b] mt-1">Power & Cooling Systems</p>
            </div>
            <div className="flex items-center gap-3">
              <TimeFilter selected={timeRange} onChange={setTimeRange} options={['24h', '7d', '30d']} />
              <ExportButton />
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-4 gap-4 mb-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[11px] text-[#86868b] uppercase tracking-wide mb-2">System Uptime</p>
              <div className="flex items-baseline gap-1">
                <span className="text-[28px] font-semibold text-[#1d1d1f] tracking-tight">{systemUptime}</span>
                <span className="text-[15px] text-[#86868b]">%</span>
              </div>
              <p className="text-[13px] text-[#86868b] mt-2">Last 30 days</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[11px] text-[#86868b] uppercase tracking-wide mb-2">Total Load</p>
              <div className="flex items-baseline gap-1">
                <span className="text-[28px] font-semibold text-[#1d1d1f] tracking-tight">{totalLoad.toFixed(1)}</span>
                <span className="text-[15px] text-[#86868b]">MW</span>
              </div>
              <p className="text-[13px] text-[#86868b] mt-2">of 100 MW capacity</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[11px] text-[#86868b] uppercase tracking-wide mb-2">Efficiency</p>
              <div className="flex items-baseline gap-1">
                <span className="text-[28px] font-semibold text-[#1d1d1f] tracking-tight">{avgEfficiency}</span>
                <span className="text-[15px] text-[#86868b]">%</span>
              </div>
              <p className="text-[13px] text-[#86868b] mt-2">Power systems</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-[11px] text-[#86868b] uppercase tracking-wide mb-2">Temperature</p>
              <div className="flex items-baseline gap-1">
                <span className="text-[28px] font-semibold text-[#1d1d1f] tracking-tight">{avgTemp}</span>
                <span className="text-[15px] text-[#86868b]">°C</span>
              </div>
              <p className="text-[13px] text-[#86868b] mt-2">Average</p>
            </div>
          </div>

          {/* Power Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-5">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-[17px] font-semibold text-[#1d1d1f]">Power Load</h3>
                <p className="text-[13px] text-[#86868b]">Real-time consumption</p>
              </div>
            </div>
            <AdvancedAreaChart
              data={powerData}
              areas={[{ dataKey: 'total', name: 'Total Load (MW)', color: '#10B981' }]}
              xAxisKey="time"
              height={240}
              showGrid={true}
              showLegend={false}
              yAxisLabel="MW"
            />
          </div>

          {/* Performance Charts */}
          <div className="grid grid-cols-2 gap-5 mb-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-[15px] font-semibold text-[#1d1d1f] mb-1">System Uptime</h3>
              <p className="text-[13px] text-[#86868b] mb-4">30-day trend</p>
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

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-[15px] font-semibold text-[#1d1d1f] mb-1">Operational Efficiency</h3>
              <p className="text-[13px] text-[#86868b] mb-4">30-day trend</p>
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

          {/* Systems Status */}
          <div className="grid grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-5">Power Systems</h3>
              <div className="space-y-3">
                {powerSystems.map(system => (
                  <div key={system.id} className="p-4 rounded-xl bg-[#f5f5f7]">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${system.status === 'optimal' ? 'bg-[#10B981]' : system.status === 'warning' ? 'bg-[#FBBF24]' : 'bg-[#F87171]'}`} />
                      <span className="text-[15px] font-medium text-[#1d1d1f]">{system.name}</span>
                    </div>
                    <div className="flex gap-6 text-[13px]">
                      <div>
                        <span className="text-[#86868b]">Load: </span>
                        <span className="text-[#1d1d1f] font-medium">{system.currentLoad} MW</span>
                      </div>
                      <div>
                        <span className="text-[#86868b]">Eff: </span>
                        <span className="text-[#1d1d1f] font-medium">{system.efficiency}%</span>
                      </div>
                      <div>
                        <span className="text-[#86868b]">Temp: </span>
                        <span className="text-[#1d1d1f] font-medium">{system.temperature}°C</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-5">Cooling Systems</h3>
              <div className="space-y-3">
                {coolingSystems.map(system => (
                  <div key={system.id} className="p-4 rounded-xl bg-[#f5f5f7]">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${system.status === 'optimal' ? 'bg-[#10B981]' : system.status === 'warning' ? 'bg-[#FBBF24]' : 'bg-[#F87171]'}`} />
                      <span className="text-[15px] font-medium text-[#1d1d1f]">{system.name}</span>
                    </div>
                    <div className="flex gap-6 text-[13px]">
                      <div>
                        <span className="text-[#86868b]">Flow: </span>
                        <span className="text-[#1d1d1f] font-medium">{system.flowRate} L/m</span>
                      </div>
                      <div>
                        <span className="text-[#86868b]">Delta: </span>
                        <span className="text-[#1d1d1f] font-medium">{system.temperature.input - system.temperature.output}°C</span>
                      </div>
                      <div>
                        <span className="text-[#86868b]">Eff: </span>
                        <span className="text-[#1d1d1f] font-medium">{system.efficiency}%</span>
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
