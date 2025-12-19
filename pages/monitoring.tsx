import Head from 'next/head';
import { useState } from 'react';
import { TimeFilter, TimeRange, ExportButton } from '../components/dashboard';
import {
  AdvancedAreaChart,
  AdvancedBarChart,
  GaugeChart,
} from '../components/charts';
import {
  mockProject,
  mockProjectKPIs,
  mockPhases,
  mockRampUpSteps,
  mockBlockers,
  mockActivityLog,
  mockPowerHistory,
  mockTickets,
} from '../lib/mock-project';
import { PhaseStatus, BlockerSeverity } from '../types/project';

type Tab = 'overview' | 'current' | 'tobe' | 'waiting';

const statusColors: Record<PhaseStatus, { bg: string; text: string; bar: string }> = {
  done: { bg: 'bg-[#10B981]/20', text: 'text-[#10B981]', bar: 'bg-[#10B981]' },
  in_progress: { bg: 'bg-slate-600/20', text: 'text-slate-300', bar: 'bg-slate-500' },
  at_risk: { bg: 'bg-slate-500/20', text: 'text-slate-400', bar: 'bg-slate-400' },
  blocked: { bg: 'bg-slate-700/30', text: 'text-slate-300', bar: 'bg-slate-600' },
  not_started: { bg: 'bg-slate-800/20', text: 'text-slate-500', bar: 'bg-slate-700' },
};

const severityColors: Record<BlockerSeverity, string> = {
  critical: 'bg-slate-200 text-slate-800',
  high: 'bg-slate-400 text-white',
  medium: 'bg-slate-500 text-white',
  low: 'bg-slate-600 text-slate-200',
};

const statusLabels: Record<PhaseStatus, string> = {
  done: 'Complete',
  in_progress: 'In Progress',
  at_risk: 'At Risk',
  blocked: 'Blocked',
  not_started: 'Pending',
};

export default function Monitoring() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());

  const togglePhase = (phaseId: string) => {
    const newExpanded = new Set(expandedPhases);
    if (newExpanded.has(phaseId)) {
      newExpanded.delete(phaseId);
    } else {
      newExpanded.add(phaseId);
    }
    setExpandedPhases(newExpanded);
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'current', label: 'Current' },
    { id: 'tobe', label: 'To-Be' },
    { id: 'waiting', label: 'Waiting' },
  ];

  const phaseStats = {
    done: mockPhases.filter(p => p.status === 'done').length,
    inProgress: mockPhases.filter(p => p.status === 'in_progress').length,
    atRisk: mockPhases.filter(p => p.status === 'at_risk').length,
    blocked: mockPhases.filter(p => p.status === 'blocked').length,
  };

  const rampUpData = mockRampUpSteps.map(step => ({
    name: `${step.targetMW}MW`,
    target: step.targetMW,
    actual: step.actualMW || 0,
  }));

  const powerChartData = mockPowerHistory.slice(-90).map(d => ({
    date: new Date(d.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
    mw: d.mw,
  }));

  const pendingPhases = mockPhases.filter(p => p.status !== 'done');
  const activeBlockers = mockBlockers.filter(b => !b.resolvedAt);

  return (
    <>
      <Head>
        <title>Project Monitoring - Hearst Qatar</title>
      </Head>

      <div className="min-h-screen bg-[#0F1419] p-4 lg:p-6">
        <div className="max-w-[1440px] mx-auto space-y-4">
          
          {/* HEADER */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-white tracking-tight">Project Monitoring</h1>
              <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#10B981]/10 border border-[#10B981]/20">
                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                <span className="text-[10px] font-medium text-[#10B981] uppercase tracking-wider">100 MW</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TimeFilter selected={timeRange} onChange={setTimeRange} options={['7d', '30d', '90d']} />
              <ExportButton />
            </div>
          </div>

          {/* TABS */}
          <div className="flex items-center gap-1 p-1 bg-[#1A1F2E] rounded-lg border border-[#2A3142] w-fit">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded text-[11px] font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#10B981] text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
                {tab.id === 'waiting' && activeBlockers.length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 bg-slate-600 text-white text-[9px] rounded">
                    {activeBlockers.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* TOP KPIs - 5 COLUMNS */}
              <div className="grid grid-cols-5 gap-4">
                <div className="bg-[#1A1F2E] rounded-lg p-5 border border-[#2A3142] flex flex-col items-center justify-center">
                  <GaugeChart
                    value={mockProjectKPIs.overallProgress}
                    max={100}
                    label="Progress"
                    unit="%"
                    size={120}
                    color="#10B981"
                  />
                </div>

                <div className="bg-[#1A1F2E] rounded-lg p-5 border border-[#2A3142]">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-2">Power Capacity</div>
                  <div className="flex items-baseline gap-1.5 mb-3">
                    <span className="text-2xl font-bold text-white">{mockProjectKPIs.operationalMW}</span>
                    <span className="text-sm text-slate-500">/ {mockProjectKPIs.targetMW} MW</span>
                  </div>
                  <div className="w-full bg-[#2A3142] rounded-full h-1.5">
                    <div className="bg-[#10B981] h-1.5 rounded-full" style={{ width: `${(mockProjectKPIs.operationalMW / mockProjectKPIs.targetMW) * 100}%` }} />
                  </div>
                </div>

                <div className="bg-[#1A1F2E] rounded-lg p-5 border border-[#2A3142]">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-2">CSA Progress</div>
                  <div className="flex items-baseline gap-1.5 mb-3">
                    <span className="text-2xl font-bold text-white">{mockProjectKPIs.csaProgress}</span>
                    <span className="text-sm text-slate-500">%</span>
                  </div>
                  <div className="w-full bg-[#2A3142] rounded-full h-1.5">
                    <div className="bg-slate-500 h-1.5 rounded-full" style={{ width: `${mockProjectKPIs.csaProgress}%` }} />
                  </div>
                </div>

                <div className="bg-[#1A1F2E] rounded-lg p-5 border border-[#2A3142]">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-2">Capex</div>
                  <div className="flex items-baseline gap-1.5 mb-3">
                    <span className="text-2xl font-bold text-white">${(mockProjectKPIs.capexSpent / 1000000).toFixed(0)}M</span>
                  </div>
                  <div className="w-full bg-[#2A3142] rounded-full h-1.5">
                    <div className="bg-slate-400 h-1.5 rounded-full" style={{ width: `${(mockProjectKPIs.capexSpent / mockProjectKPIs.capexBudget) * 100}%` }} />
                  </div>
                  <div className="text-[9px] text-slate-500 mt-1">of ${(mockProjectKPIs.capexBudget / 1000000).toFixed(0)}M</div>
                </div>

                <div className="bg-[#10B981]/10 rounded-lg p-5 border border-[#10B981]/20">
                  <div className="text-[10px] text-[#10B981]/70 uppercase tracking-wide mb-2">Days to Target</div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold text-[#10B981]">{mockProjectKPIs.daysToTarget}</span>
                    <span className="text-sm text-[#10B981]/70">days</span>
                  </div>
                  <div className="text-[9px] text-slate-500 mt-2">{mockProject.targetDate}</div>
                </div>
              </div>

              {/* MIDDLE ROW - 3 COLUMNS */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#1A1F2E] rounded-lg p-5 border border-[#2A3142]">
                  <h3 className="text-xs font-medium text-white uppercase tracking-wide mb-4">Phase Status</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Complete', count: phaseStats.done, color: 'bg-[#10B981]' },
                      { label: 'In Progress', count: phaseStats.inProgress, color: 'bg-slate-500' },
                      { label: 'At Risk', count: phaseStats.atRisk, color: 'bg-slate-400' },
                      { label: 'Blocked', count: phaseStats.blocked, color: 'bg-slate-600' },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${item.color}`} />
                          <span className="text-[11px] text-slate-400">{item.label}</span>
                        </div>
                        <span className="text-xs font-semibold text-white">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-span-2 bg-[#1A1F2E] rounded-lg p-5 border border-[#2A3142]">
                  <h3 className="text-xs font-medium text-white uppercase tracking-wide mb-4">Ramp-Up</h3>
                  <AdvancedBarChart
                    data={rampUpData}
                    bars={[
                      { dataKey: 'target', name: 'Target', color: '#2A3142' },
                      { dataKey: 'actual', name: 'Actual', color: '#10B981' },
                    ]}
                    xAxisKey="name"
                    height={160}
                    showGrid={true}
                    showLegend={true}
                  />
                </div>
              </div>

              {/* PHASES */}
              <div className="bg-[#1A1F2E] rounded-lg p-5 border border-[#2A3142]">
                <h3 className="text-xs font-medium text-white uppercase tracking-wide mb-4">All Phases</h3>
                <div className="space-y-2">
                  {mockPhases.map(phase => (
                    <div key={phase.id} className="bg-[#2A3142]/30 rounded-lg border border-[#2A3142] overflow-hidden">
                      <button
                        onClick={() => togglePhase(phase.id)}
                        className="w-full p-4 flex items-center justify-between hover:bg-[#2A3142]/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <svg className={`w-3 h-3 text-slate-500 transition-transform ${expandedPhases.has(phase.id) ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-medium ${statusColors[phase.status].bg} ${statusColors[phase.status].text}`}>
                            {statusLabels[phase.status]}
                          </span>
                          <span className="text-sm text-white">{phase.title}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] text-slate-500">{phase.owner}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-[#2A3142] rounded-full h-1">
                              <div className={`h-1 rounded-full ${statusColors[phase.status].bar}`} style={{ width: `${phase.progress}%` }} />
                            </div>
                            <span className="text-xs font-medium text-white w-8 text-right">{phase.progress}%</span>
                          </div>
                        </div>
                      </button>
                      {expandedPhases.has(phase.id) && (
                        <div className="px-4 pb-4 border-t border-[#2A3142]">
                          <p className="text-[10px] text-slate-500 py-3">{phase.description}</p>
                          <div className="grid grid-cols-4 gap-2">
                            {phase.milestones.slice(0, 4).map(ms => (
                              <div key={ms.id} className="flex items-center gap-2 p-2 bg-[#2A3142]/50 rounded">
                                <div className={`w-1.5 h-1.5 rounded-full ${statusColors[ms.status].bar}`} />
                                <span className="text-[10px] text-slate-400 truncate flex-1">{ms.name}</span>
                                <span className="text-[10px] font-medium text-white">{ms.progress}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* BOTTOM ROW - 2 COLUMNS */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1A1F2E] rounded-lg p-5 border border-[#2A3142]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-medium text-white uppercase tracking-wide">Active Blockers</h3>
                    <span className="px-2 py-0.5 bg-slate-700 text-slate-300 text-[10px] rounded">{activeBlockers.length}</span>
                  </div>
                  <div className="space-y-2">
                    {activeBlockers.slice(0, 4).map(blocker => (
                      <div key={blocker.id} className="p-3 bg-[#2A3142]/30 rounded border border-[#2A3142]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] text-white">{blocker.title}</span>
                          <span className={`px-1.5 py-0.5 text-[9px] rounded ${severityColors[blocker.severity]}`}>{blocker.severity}</span>
                        </div>
                        <div className="text-[10px] text-slate-500">{blocker.owner} | ETA: {blocker.eta || 'TBD'}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#1A1F2E] rounded-lg p-5 border border-[#2A3142]">
                  <h3 className="text-xs font-medium text-white uppercase tracking-wide mb-4">Recent Activity</h3>
                  <div className="space-y-2">
                    {mockActivityLog.slice(0, 5).map(log => (
                      <div key={log.id} className="flex items-start gap-2 p-2 hover:bg-[#2A3142]/30 rounded transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] mt-1.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] text-slate-300">
                            <span className="font-medium text-white">{log.actor}</span> {log.action}
                          </div>
                          <span className="text-[9px] text-slate-500">{new Date(log.timestamp).toLocaleString('fr-FR')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CURRENT TAB */}
          {activeTab === 'current' && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Operational', value: mockProjectKPIs.operationalMW, unit: 'MW' },
                  { label: 'Hashrate', value: mockProjectKPIs.totalHashrate, unit: 'PH/s' },
                  { label: 'PUE', value: mockProjectKPIs.pue, unit: '' },
                  { label: 'Tickets', value: mockTickets.open, unit: `(${mockTickets.critical} crit)` },
                ].map((kpi, i) => (
                  <div key={i} className="bg-[#1A1F2E] rounded-lg p-5 border border-[#2A3142]">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-2">{kpi.label}</div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold text-white">{kpi.value}</span>
                      <span className="text-sm text-slate-500">{kpi.unit}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#1A1F2E] rounded-lg p-5 border border-[#2A3142]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-medium text-white uppercase tracking-wide">Power History</h3>
                </div>
                <AdvancedAreaChart
                  data={powerChartData}
                  areas={[{ dataKey: 'mw', name: 'MW', color: '#10B981' }]}
                  xAxisKey="date"
                  height={240}
                  showGrid={true}
                  showLegend={false}
                  yAxisLabel="MW"
                />
              </div>

              <div className="bg-[#1A1F2E] rounded-lg p-5 border border-[#2A3142]">
                <h3 className="text-xs font-medium text-white uppercase tracking-wide mb-4">Phases In Progress</h3>
                <div className="grid grid-cols-2 gap-4">
                  {mockPhases.filter(p => p.status === 'in_progress').slice(0, 4).map(phase => (
                    <div key={phase.id} className="p-4 bg-[#2A3142]/30 rounded border border-[#2A3142]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">{phase.title}</span>
                        <span className="text-lg font-bold text-white">{phase.progress}%</span>
                      </div>
                      <div className="w-full bg-[#2A3142] rounded-full h-1.5 mb-2">
                        <div className="bg-slate-500 h-1.5 rounded-full" style={{ width: `${phase.progress}%` }} />
                      </div>
                      <div className="text-[10px] text-slate-500">{phase.owner}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TO-BE TAB */}
          {activeTab === 'tobe' && (
            <div className="space-y-4">
              <div className="bg-[#10B981]/10 rounded-lg p-6 border border-[#10B981]/20">
                <div className="grid grid-cols-4 gap-6">
                  <div>
                    <div className="text-[10px] text-[#10B981]/70 uppercase tracking-wide mb-1">Target</div>
                    <div className="text-3xl font-bold text-[#10B981]">{mockProject.targetMW} MW</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">Current</div>
                    <div className="text-3xl font-bold text-white">{mockProjectKPIs.operationalMW} MW</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">Remaining</div>
                    <div className="text-3xl font-bold text-slate-400">{mockProject.targetMW - mockProjectKPIs.operationalMW} MW</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">Target Date</div>
                    <div className="text-xl font-bold text-white">{mockProject.targetDate}</div>
                    <div className="text-[10px] text-[#10B981]">{mockProjectKPIs.daysToTarget} days</div>
                  </div>
                </div>
              </div>

              <div className="bg-[#1A1F2E] rounded-lg p-5 border border-[#2A3142]">
                <h3 className="text-xs font-medium text-white uppercase tracking-wide mb-4">Ramp-Up Roadmap</h3>
                <div className="grid grid-cols-5 gap-3">
                  {mockRampUpSteps.map((step, idx) => (
                    <div key={step.id} className={`p-4 rounded-lg border ${step.status === 'done' ? 'bg-[#10B981]/10 border-[#10B981]/30' : 'bg-[#2A3142]/30 border-[#2A3142]'}`}>
                      <div className={`text-2xl font-bold mb-1 ${step.status === 'done' ? 'text-[#10B981]' : 'text-white'}`}>{step.targetMW}MW</div>
                      <div className="text-[9px] text-slate-500 mb-3">Step {idx + 1}</div>
                      <div className="space-y-1 text-[10px]">
                        <div className="flex justify-between"><span className="text-slate-500">Plan</span><span className="text-white">{step.plannedDate}</span></div>
                        {step.actualDate && <div className="flex justify-between"><span className="text-slate-500">Actual</span><span className="text-[#10B981]">{step.actualDate}</span></div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#1A1F2E] rounded-lg p-5 border border-[#2A3142]">
                <h3 className="text-xs font-medium text-white uppercase tracking-wide mb-4">Pending Phases</h3>
                <div className="space-y-2">
                  {pendingPhases.slice(0, 6).map(phase => (
                    <div key={phase.id} className="flex items-center justify-between p-3 bg-[#2A3142]/30 rounded border border-[#2A3142]">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-medium ${statusColors[phase.status].bg} ${statusColors[phase.status].text}`}>{statusLabels[phase.status]}</span>
                        <span className="text-sm text-white">{phase.title}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-16 bg-[#2A3142] rounded-full h-1">
                          <div className={`h-1 rounded-full ${statusColors[phase.status].bar}`} style={{ width: `${phase.progress}%` }} />
                        </div>
                        <span className="text-xs font-medium text-white">{phase.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* WAITING TAB */}
          {activeTab === 'waiting' && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                {['critical', 'high', 'medium', 'low'].map(sev => (
                  <div key={sev} className={`rounded-lg p-5 border ${sev === 'critical' ? 'bg-slate-200 border-slate-300' : sev === 'high' ? 'bg-slate-500 border-slate-400' : sev === 'medium' ? 'bg-slate-600 border-slate-500' : 'bg-[#1A1F2E] border-[#2A3142]'}`}>
                    <div className={`text-[10px] uppercase tracking-wide mb-2 ${sev === 'critical' || sev === 'high' || sev === 'medium' ? 'text-white/70' : 'text-slate-500'}`}>{sev}</div>
                    <div className={`text-3xl font-bold ${sev === 'critical' ? 'text-slate-800' : 'text-white'}`}>{activeBlockers.filter(b => b.severity === sev).length}</div>
                  </div>
                ))}
              </div>

              <div className="bg-[#1A1F2E] rounded-lg p-5 border border-[#2A3142]">
                <h3 className="text-xs font-medium text-white uppercase tracking-wide mb-4">Active Blockers</h3>
                <div className="space-y-3">
                  {activeBlockers.map(blocker => (
                    <div key={blocker.id} className="p-4 bg-[#2A3142]/30 rounded-lg border border-[#2A3142]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 text-[9px] font-medium rounded ${severityColors[blocker.severity]}`}>{blocker.severity}</span>
                          <span className="text-sm font-medium text-white">{blocker.title}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 mb-3">{blocker.description}</p>
                      <div className="grid grid-cols-3 gap-4 p-3 bg-[#2A3142]/50 rounded">
                        <div><div className="text-[9px] text-slate-500 mb-0.5">Owner</div><div className="text-[11px] text-white">{blocker.owner}</div></div>
                        <div><div className="text-[9px] text-slate-500 mb-0.5">ETA</div><div className="text-[11px] text-white">{blocker.eta || 'TBD'}</div></div>
                        <div><div className="text-[9px] text-slate-500 mb-0.5">Created</div><div className="text-[11px] text-white">{blocker.createdAt}</div></div>
                      </div>
                      {blocker.mitigationPlan && (
                        <div className="mt-3 p-3 bg-slate-700/30 rounded">
                          <div className="text-[9px] text-slate-400 uppercase mb-1">Mitigation</div>
                          <p className="text-[11px] text-slate-300">{blocker.mitigationPlan}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
