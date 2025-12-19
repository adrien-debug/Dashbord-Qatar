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
  done: { bg: 'bg-emerald-50', text: 'text-emerald-700', bar: 'bg-emerald-500' },
  in_progress: { bg: 'bg-blue-50', text: 'text-blue-700', bar: 'bg-blue-500' },
  at_risk: { bg: 'bg-amber-50', text: 'text-amber-700', bar: 'bg-amber-500' },
  blocked: { bg: 'bg-red-50', text: 'text-red-700', bar: 'bg-red-500' },
  not_started: { bg: 'bg-slate-100', text: 'text-slate-500', bar: 'bg-slate-300' },
};

const severityColors: Record<BlockerSeverity, string> = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-amber-100 text-amber-700',
  medium: 'bg-slate-200 text-slate-600',
  low: 'bg-slate-100 text-slate-500',
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

      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-[1400px] mx-auto space-y-6">
          
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold text-slate-800">Project Monitoring</h1>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-emerald-700">100 MW Target</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <TimeFilter selected={timeRange} onChange={setTimeRange} options={['7d', '30d', '90d']} />
              <ExportButton />
            </div>
          </div>

          {/* TABS */}
          <div className="flex items-center gap-1 p-1.5 bg-white rounded-xl border border-slate-200 shadow-sm w-fit">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-emerald-500 text-white'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                {tab.label}
                {tab.id === 'waiting' && activeBlockers.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                    {activeBlockers.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* TOP KPIs - 5 COLUMNS */}
              <div className="grid grid-cols-5 gap-4">
                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                  <GaugeChart
                    value={mockProjectKPIs.overallProgress}
                    max={100}
                    label="Progress"
                    unit="%"
                    size={110}
                    color="#10B981"
                  />
                </div>

                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                  <div className="text-xs text-slate-400 uppercase tracking-wide mb-2">Power Capacity</div>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-2xl font-bold text-slate-800">{mockProjectKPIs.operationalMW}</span>
                    <span className="text-sm text-slate-400">/ {mockProjectKPIs.targetMW} MW</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${(mockProjectKPIs.operationalMW / mockProjectKPIs.targetMW) * 100}%` }} />
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                  <div className="text-xs text-slate-400 uppercase tracking-wide mb-2">CSA Progress</div>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-2xl font-bold text-slate-800">{mockProjectKPIs.csaProgress}</span>
                    <span className="text-sm text-slate-400">%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${mockProjectKPIs.csaProgress}%` }} />
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                  <div className="text-xs text-slate-400 uppercase tracking-wide mb-2">Capex</div>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-2xl font-bold text-slate-800">${(mockProjectKPIs.capexSpent / 1000000).toFixed(0)}M</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-slate-400 h-2 rounded-full" style={{ width: `${(mockProjectKPIs.capexSpent / mockProjectKPIs.capexBudget) * 100}%` }} />
                  </div>
                  <div className="text-xs text-slate-400 mt-2">of ${(mockProjectKPIs.capexBudget / 1000000).toFixed(0)}M</div>
                </div>

                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
                  <div className="text-xs text-emerald-600 uppercase tracking-wide mb-2">Days to Target</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-emerald-600">{mockProjectKPIs.daysToTarget}</span>
                    <span className="text-sm text-emerald-500">days</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-2">{mockProject.targetDate}</div>
                </div>
              </div>

              {/* MIDDLE - 3 COLUMNS */}
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="text-base font-semibold text-slate-700 mb-5">Phase Status</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Complete', count: phaseStats.done, color: 'bg-emerald-500' },
                      { label: 'In Progress', count: phaseStats.inProgress, color: 'bg-blue-500' },
                      { label: 'At Risk', count: phaseStats.atRisk, color: 'bg-amber-500' },
                      { label: 'Blocked', count: phaseStats.blocked, color: 'bg-red-500' },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${item.color}`} />
                          <span className="text-sm text-slate-600">{item.label}</span>
                        </div>
                        <span className="text-lg font-bold text-slate-800">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-span-2 bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="text-base font-semibold text-slate-700 mb-5">Ramp-Up Progress</h3>
                  <AdvancedBarChart
                    data={rampUpData}
                    bars={[
                      { dataKey: 'target', name: 'Target', color: '#E2E8F0' },
                      { dataKey: 'actual', name: 'Actual', color: '#10B981' },
                    ]}
                    xAxisKey="name"
                    height={180}
                    showGrid={true}
                    showLegend={true}
                  />
                </div>
              </div>

              {/* PHASES */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-base font-semibold text-slate-700 mb-5">All Phases</h3>
                <div className="space-y-3">
                  {mockPhases.map(phase => (
                    <div key={phase.id} className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
                      <button
                        onClick={() => togglePhase(phase.id)}
                        className="w-full p-4 flex items-center justify-between hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <svg className={`w-4 h-4 text-slate-400 transition-transform ${expandedPhases.has(phase.id) ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[phase.status].bg} ${statusColors[phase.status].text}`}>
                            {statusLabels[phase.status]}
                          </span>
                          <span className="font-medium text-slate-700">{phase.title}</span>
                        </div>
                        <div className="flex items-center gap-6">
                          <span className="text-sm text-slate-400">{phase.owner}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-24 bg-slate-200 rounded-full h-2">
                              <div className={`h-2 rounded-full ${statusColors[phase.status].bar}`} style={{ width: `${phase.progress}%` }} />
                            </div>
                            <span className="text-sm font-semibold text-slate-700 w-10 text-right">{phase.progress}%</span>
                          </div>
                        </div>
                      </button>
                      {expandedPhases.has(phase.id) && (
                        <div className="px-5 pb-5 border-t border-slate-200">
                          <p className="text-sm text-slate-500 py-4">{phase.description}</p>
                          <div className="grid grid-cols-4 gap-3">
                            {phase.milestones.slice(0, 4).map(ms => (
                              <div key={ms.id} className="flex items-center gap-2 p-3 bg-white rounded-lg border border-slate-100">
                                <div className={`w-2 h-2 rounded-full ${statusColors[ms.status].bar}`} />
                                <span className="text-sm text-slate-600 truncate flex-1">{ms.name}</span>
                                <span className="text-sm font-semibold text-slate-700">{ms.progress}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* BOTTOM - 2 COLUMNS */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base font-semibold text-slate-700">Active Blockers</h3>
                    <span className="px-2.5 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full">{activeBlockers.length}</span>
                  </div>
                  <div className="space-y-3">
                    {activeBlockers.slice(0, 4).map(blocker => (
                      <div key={blocker.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-slate-700">{blocker.title}</span>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${severityColors[blocker.severity]}`}>{blocker.severity}</span>
                        </div>
                        <div className="text-sm text-slate-400">{blocker.owner} · ETA: {blocker.eta || 'TBD'}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="text-base font-semibold text-slate-700 mb-5">Recent Activity</h3>
                  <div className="space-y-3">
                    {mockActivityLog.slice(0, 5).map(log => (
                      <div key={log.id} className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-sm text-slate-600">
                            <span className="font-medium text-slate-700">{log.actor}</span> {log.action}
                          </div>
                          <span className="text-xs text-slate-400">{new Date(log.timestamp).toLocaleString('fr-FR')}</span>
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
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Operational', value: mockProjectKPIs.operationalMW, unit: 'MW' },
                  { label: 'Hashrate', value: mockProjectKPIs.totalHashrate, unit: 'PH/s' },
                  { label: 'PUE', value: mockProjectKPIs.pue, unit: '' },
                  { label: 'Open Tickets', value: mockTickets.open, unit: `(${mockTickets.critical} crit)` },
                ].map((kpi, i) => (
                  <div key={i} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                    <div className="text-xs text-slate-400 uppercase tracking-wide mb-2">{kpi.label}</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-slate-800">{kpi.value}</span>
                      <span className="text-sm text-slate-400">{kpi.unit}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-800">Power History</h3>
                </div>
                <AdvancedAreaChart
                  data={powerChartData}
                  areas={[{ dataKey: 'mw', name: 'MW', color: '#10B981' }]}
                  xAxisKey="date"
                  height={280}
                  showGrid={true}
                  showLegend={false}
                  yAxisLabel="MW"
                />
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-base font-semibold text-slate-700 mb-5">Phases In Progress</h3>
                <div className="grid grid-cols-2 gap-4">
                  {mockPhases.filter(p => p.status === 'in_progress').slice(0, 4).map(phase => (
                    <div key={phase.id} className="p-5 bg-blue-50 rounded-xl border border-blue-100">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium text-slate-700">{phase.title}</span>
                        <span className="text-2xl font-bold text-blue-600">{phase.progress}%</span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${phase.progress}%` }} />
                      </div>
                      <div className="text-sm text-slate-500">{phase.owner}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TO-BE TAB */}
          {activeTab === 'tobe' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200">
                <div className="grid grid-cols-4 gap-6">
                  <div>
                    <div className="text-xs text-emerald-600 uppercase tracking-wide mb-1">Target</div>
                    <div className="text-4xl font-bold text-emerald-600">{mockProject.targetMW} MW</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Current</div>
                    <div className="text-4xl font-bold text-slate-700">{mockProjectKPIs.operationalMW} MW</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Remaining</div>
                    <div className="text-4xl font-bold text-slate-500">{mockProject.targetMW - mockProjectKPIs.operationalMW} MW</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Target Date</div>
                    <div className="text-2xl font-bold text-slate-700">{mockProject.targetDate}</div>
                    <div className="text-sm text-emerald-600 font-medium mt-1">{mockProjectKPIs.daysToTarget} days</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-base font-semibold text-slate-700 mb-5">Ramp-Up Roadmap</h3>
                <div className="grid grid-cols-5 gap-4">
                  {mockRampUpSteps.map((step, idx) => (
                    <div key={step.id} className={`p-5 rounded-xl border ${step.status === 'done' ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                      <div className={`text-3xl font-bold mb-2 ${step.status === 'done' ? 'text-emerald-600' : 'text-slate-700'}`}>{step.targetMW}MW</div>
                      <div className="text-xs text-slate-400 mb-4">Step {idx + 1}</div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-slate-400">Plan</span><span className="text-slate-600">{step.plannedDate}</span></div>
                        {step.actualDate && <div className="flex justify-between"><span className="text-slate-400">Actual</span><span className="text-emerald-600 font-medium">{step.actualDate}</span></div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-base font-semibold text-slate-700 mb-5">Pending Phases</h3>
                <div className="space-y-3">
                  {pendingPhases.slice(0, 6).map(phase => (
                    <div key={phase.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[phase.status].bg} ${statusColors[phase.status].text}`}>{statusLabels[phase.status]}</span>
                        <span className="font-medium text-slate-700">{phase.title}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-20 bg-slate-200 rounded-full h-2">
                          <div className={`h-2 rounded-full ${statusColors[phase.status].bar}`} style={{ width: `${phase.progress}%` }} />
                        </div>
                        <span className="text-sm font-semibold text-slate-700">{phase.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* WAITING TAB */}
          {activeTab === 'waiting' && (
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                {[
                  { sev: 'critical', label: 'Critical', bg: 'bg-red-50 border-red-200', text: 'text-red-600' },
                  { sev: 'high', label: 'High', bg: 'bg-amber-50 border-amber-200', text: 'text-amber-600' },
                  { sev: 'medium', label: 'Medium', bg: 'bg-slate-100 border-slate-200', text: 'text-slate-600' },
                  { sev: 'low', label: 'Low', bg: 'bg-white border-slate-200', text: 'text-slate-500' },
                ].map(item => (
                  <div key={item.sev} className={`rounded-xl p-5 border ${item.bg}`}>
                    <div className={`text-xs uppercase tracking-wide mb-2 ${item.text}`}>{item.label}</div>
                    <div className={`text-4xl font-bold ${item.text}`}>{activeBlockers.filter(b => b.severity === item.sev).length}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-base font-semibold text-slate-700 mb-5">Active Blockers</h3>
                <div className="space-y-4">
                  {activeBlockers.map(blocker => (
                    <div key={blocker.id} className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${severityColors[blocker.severity]}`}>{blocker.severity}</span>
                          <span className="font-semibold text-slate-700">{blocker.title}</span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 mb-4">{blocker.description}</p>
                      <div className="grid grid-cols-3 gap-4 p-4 bg-white rounded-lg border border-slate-100">
                        <div><div className="text-xs text-slate-400 mb-1">Owner</div><div className="text-sm font-medium text-slate-700">{blocker.owner}</div></div>
                        <div><div className="text-xs text-slate-400 mb-1">ETA</div><div className="text-sm font-medium text-slate-700">{blocker.eta || 'TBD'}</div></div>
                        <div><div className="text-xs text-slate-400 mb-1">Created</div><div className="text-sm font-medium text-slate-700">{blocker.createdAt}</div></div>
                      </div>
                      {blocker.mitigationPlan && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                          <div className="text-xs text-blue-600 uppercase mb-1">Mitigation Plan</div>
                          <p className="text-sm text-slate-600">{blocker.mitigationPlan}</p>
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
