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

const statusColors: Record<PhaseStatus, { bg: string; text: string; dot: string }> = {
  done: { bg: 'bg-[#10B981]/10', text: 'text-[#10B981]', dot: 'bg-[#10B981]' },
  in_progress: { bg: 'bg-[#3B82F6]/10', text: 'text-[#3B82F6]', dot: 'bg-[#3B82F6]' },
  at_risk: { bg: 'bg-[#F59E0B]/10', text: 'text-[#F59E0B]', dot: 'bg-[#F59E0B]' },
  blocked: { bg: 'bg-[#EF4444]/10', text: 'text-[#EF4444]', dot: 'bg-[#EF4444]' },
  not_started: { bg: 'bg-[#86868b]/10', text: 'text-[#86868b]', dot: 'bg-[#86868b]' },
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
        <title>Project Monitoring</title>
      </Head>

      <div className="min-h-screen bg-[#f5f5f7] p-8">
        <div className="max-w-[1200px] mx-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-[32px] font-semibold text-[#1d1d1f] tracking-tight">Project Monitoring</h1>
              <p className="text-[15px] text-[#86868b] mt-1">100 MW Deployment</p>
            </div>
            <div className="flex items-center gap-3">
              <TimeFilter selected={timeRange} onChange={setTimeRange} options={['7d', '30d', '90d']} />
              <ExportButton />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 bg-white rounded-xl shadow-sm w-fit mb-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2 rounded-lg text-[13px] font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#10B981] text-white'
                    : 'text-[#86868b] hover:text-[#1d1d1f]'
                }`}
              >
                {tab.label}
                {tab.id === 'waiting' && activeBlockers.length > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 bg-[#EF4444] text-white text-[10px] rounded-full">
                    {activeBlockers.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* KPIs */}
              <div className="grid grid-cols-5 gap-4">
                <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center justify-center">
                  <GaugeChart
                    value={mockProjectKPIs.overallProgress}
                    max={100}
                    label="Progress"
                    unit="%"
                    size={100}
                    color="#10B981"
                  />
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <p className="text-[11px] text-[#86868b] uppercase tracking-wide mb-2">Power</p>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-[24px] font-semibold text-[#1d1d1f]">{mockProjectKPIs.operationalMW}</span>
                    <span className="text-[13px] text-[#86868b]">/ {mockProjectKPIs.targetMW} MW</span>
                  </div>
                  <div className="w-full bg-[#f5f5f7] rounded-full h-[5px]">
                    <div className="bg-[#10B981] h-[5px] rounded-full" style={{ width: `${(mockProjectKPIs.operationalMW / mockProjectKPIs.targetMW) * 100}%` }} />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <p className="text-[11px] text-[#86868b] uppercase tracking-wide mb-2">CSA</p>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-[24px] font-semibold text-[#1d1d1f]">{mockProjectKPIs.csaProgress}</span>
                    <span className="text-[13px] text-[#86868b]">%</span>
                  </div>
                  <div className="w-full bg-[#f5f5f7] rounded-full h-[5px]">
                    <div className="bg-[#3B82F6] h-[5px] rounded-full" style={{ width: `${mockProjectKPIs.csaProgress}%` }} />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <p className="text-[11px] text-[#86868b] uppercase tracking-wide mb-2">Capex</p>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-[24px] font-semibold text-[#1d1d1f]">${(mockProjectKPIs.capexSpent / 1000000).toFixed(0)}M</span>
                  </div>
                  <div className="w-full bg-[#f5f5f7] rounded-full h-[5px]">
                    <div className="bg-[#86868b] h-[5px] rounded-full" style={{ width: `${(mockProjectKPIs.capexSpent / mockProjectKPIs.capexBudget) * 100}%` }} />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl p-5 shadow-sm text-white">
                  <p className="text-[11px] uppercase tracking-wide mb-2 opacity-80">Days to Target</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[24px] font-semibold">{mockProjectKPIs.daysToTarget}</span>
                    <span className="text-[13px] opacity-80">days</span>
                  </div>
                  <p className="text-[11px] mt-2 opacity-70">{mockProject.targetDate}</p>
                </div>
              </div>

              {/* Middle Section */}
              <div className="grid grid-cols-3 gap-5">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-5">Phase Status</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Complete', count: phaseStats.done, color: '#10B981' },
                      { label: 'In Progress', count: phaseStats.inProgress, color: '#3B82F6' },
                      { label: 'At Risk', count: phaseStats.atRisk, color: '#F59E0B' },
                      { label: 'Blocked', count: phaseStats.blocked, color: '#EF4444' },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-[14px] text-[#1d1d1f]">{item.label}</span>
                        </div>
                        <span className="text-[20px] font-semibold text-[#1d1d1f]">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-5">Ramp-Up Progress</h3>
                  <AdvancedBarChart
                    data={rampUpData}
                    bars={[
                      { dataKey: 'target', name: 'Target', color: '#E5E5E5' },
                      { dataKey: 'actual', name: 'Actual', color: '#10B981' },
                    ]}
                    xAxisKey="name"
                    height={170}
                    showGrid={true}
                    showLegend={true}
                  />
                </div>
              </div>

              {/* Phases */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-5">All Phases</h3>
                <div className="space-y-2">
                  {mockPhases.map(phase => (
                    <div key={phase.id} className="rounded-xl bg-[#f5f5f7] overflow-hidden">
                      <button
                        onClick={() => togglePhase(phase.id)}
                        className="w-full p-4 flex items-center justify-between hover:bg-[#ebebed] transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <svg className={`w-3.5 h-3.5 text-[#86868b] transition-transform ${expandedPhases.has(phase.id) ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${statusColors[phase.status].bg} ${statusColors[phase.status].text}`}>
                            {statusLabels[phase.status]}
                          </span>
                          <span className="text-[14px] font-medium text-[#1d1d1f]">{phase.title}</span>
                        </div>
                        <div className="flex items-center gap-5">
                          <span className="text-[13px] text-[#86868b]">{phase.owner}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-20 bg-[#d2d2d7] rounded-full h-[5px]">
                              <div className={`h-[5px] rounded-full ${statusColors[phase.status].dot}`} style={{ width: `${phase.progress}%` }} />
                            </div>
                            <span className="text-[13px] font-semibold text-[#1d1d1f] w-9 text-right">{phase.progress}%</span>
                          </div>
                        </div>
                      </button>
                      {expandedPhases.has(phase.id) && (
                        <div className="px-5 pb-5 border-t border-[#d2d2d7]/50">
                          <p className="text-[13px] text-[#86868b] py-4">{phase.description}</p>
                          <div className="grid grid-cols-4 gap-2">
                            {phase.milestones.slice(0, 4).map(ms => (
                              <div key={ms.id} className="flex items-center gap-2 p-3 bg-white rounded-lg">
                                <div className={`w-2 h-2 rounded-full ${statusColors[ms.status].dot}`} />
                                <span className="text-[12px] text-[#1d1d1f] truncate flex-1">{ms.name}</span>
                                <span className="text-[12px] font-medium text-[#86868b]">{ms.progress}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom */}
              <div className="grid grid-cols-2 gap-5">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-[17px] font-semibold text-[#1d1d1f]">Active Blockers</h3>
                    <span className="px-2 py-0.5 bg-[#EF4444] text-white text-[11px] font-medium rounded-full">{activeBlockers.length}</span>
                  </div>
                  <div className="space-y-3">
                    {activeBlockers.slice(0, 4).map(blocker => (
                      <div key={blocker.id} className="p-4 rounded-xl bg-[#f5f5f7]">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[14px] font-medium text-[#1d1d1f]">{blocker.title}</span>
                          <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${blocker.severity === 'critical' ? 'bg-[#EF4444]/10 text-[#EF4444]' : blocker.severity === 'high' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' : 'bg-[#86868b]/10 text-[#86868b]'}`}>{blocker.severity}</span>
                        </div>
                        <p className="text-[12px] text-[#86868b]">{blocker.owner} · ETA: {blocker.eta || 'TBD'}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-5">Recent Activity</h3>
                  <div className="space-y-2">
                    {mockActivityLog.slice(0, 5).map(log => (
                      <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#f5f5f7] transition-colors">
                        <div className="w-2 h-2 rounded-full bg-[#10B981] mt-1.5 flex-shrink-0" />
                        <div>
                          <p className="text-[13px] text-[#1d1d1f]"><span className="font-medium">{log.actor}</span> {log.action}</p>
                          <p className="text-[11px] text-[#86868b]">{new Date(log.timestamp).toLocaleString('fr-FR')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CURRENT */}
          {activeTab === 'current' && (
            <div className="space-y-5">
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Operational', value: mockProjectKPIs.operationalMW, unit: 'MW' },
                  { label: 'Hashrate', value: mockProjectKPIs.totalHashrate, unit: 'PH/s' },
                  { label: 'PUE', value: mockProjectKPIs.pue, unit: '' },
                  { label: 'Open Tickets', value: mockTickets.open, unit: '' },
                ].map((kpi, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                    <p className="text-[11px] text-[#86868b] uppercase tracking-wide mb-2">{kpi.label}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[28px] font-semibold text-[#1d1d1f]">{kpi.value}</span>
                      {kpi.unit && <span className="text-[15px] text-[#86868b]">{kpi.unit}</span>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-6">Power History</h3>
                <AdvancedAreaChart
                  data={powerChartData}
                  areas={[{ dataKey: 'mw', name: 'MW', color: '#10B981' }]}
                  xAxisKey="date"
                  height={260}
                  showGrid={true}
                  showLegend={false}
                  yAxisLabel="MW"
                />
              </div>
            </div>
          )}

          {/* TO-BE */}
          {activeTab === 'tobe' && (
            <div className="space-y-5">
              <div className="bg-gradient-to-r from-[#10B981] to-[#059669] rounded-2xl p-8 text-white">
                <div className="grid grid-cols-4 gap-8">
                  <div>
                    <p className="text-[11px] uppercase tracking-wide mb-1 opacity-80">Target</p>
                    <p className="text-[40px] font-semibold">{mockProject.targetMW} MW</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide mb-1 opacity-80">Current</p>
                    <p className="text-[40px] font-semibold">{mockProjectKPIs.operationalMW} MW</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide mb-1 opacity-80">Remaining</p>
                    <p className="text-[40px] font-semibold">{mockProject.targetMW - mockProjectKPIs.operationalMW} MW</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide mb-1 opacity-80">Target Date</p>
                    <p className="text-[24px] font-semibold">{mockProject.targetDate}</p>
                    <p className="text-[13px] opacity-80">{mockProjectKPIs.daysToTarget} days</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-5">Ramp-Up Roadmap</h3>
                <div className="grid grid-cols-5 gap-4">
                  {mockRampUpSteps.map((step, idx) => (
                    <div key={step.id} className={`p-5 rounded-xl ${step.status === 'done' ? 'bg-[#10B981]/10' : 'bg-[#f5f5f7]'}`}>
                      <p className={`text-[28px] font-semibold mb-1 ${step.status === 'done' ? 'text-[#10B981]' : 'text-[#1d1d1f]'}`}>{step.targetMW}MW</p>
                      <p className="text-[11px] text-[#86868b] mb-3">Step {idx + 1}</p>
                      <div className="space-y-1 text-[12px]">
                        <div className="flex justify-between"><span className="text-[#86868b]">Plan</span><span className="text-[#1d1d1f]">{step.plannedDate}</span></div>
                        {step.actualDate && <div className="flex justify-between"><span className="text-[#86868b]">Actual</span><span className="text-[#10B981] font-medium">{step.actualDate}</span></div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-5">Pending Phases</h3>
                <div className="space-y-2">
                  {pendingPhases.slice(0, 6).map(phase => (
                    <div key={phase.id} className="flex items-center justify-between p-4 rounded-xl bg-[#f5f5f7]">
                      <div className="flex items-center gap-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${statusColors[phase.status].bg} ${statusColors[phase.status].text}`}>{statusLabels[phase.status]}</span>
                        <span className="text-[14px] font-medium text-[#1d1d1f]">{phase.title}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-16 bg-[#d2d2d7] rounded-full h-[5px]">
                          <div className={`h-[5px] rounded-full ${statusColors[phase.status].dot}`} style={{ width: `${phase.progress}%` }} />
                        </div>
                        <span className="text-[13px] font-semibold text-[#1d1d1f]">{phase.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* WAITING */}
          {activeTab === 'waiting' && (
            <div className="space-y-5">
              <div className="grid grid-cols-4 gap-4">
                {[
                  { sev: 'critical', label: 'Critical', color: '#EF4444' },
                  { sev: 'high', label: 'High', color: '#F59E0B' },
                  { sev: 'medium', label: 'Medium', color: '#86868b' },
                  { sev: 'low', label: 'Low', color: '#d2d2d7' },
                ].map(item => (
                  <div key={item.sev} className="bg-white rounded-2xl p-6 shadow-sm">
                    <p className="text-[11px] uppercase tracking-wide mb-2" style={{ color: item.color }}>{item.label}</p>
                    <p className="text-[36px] font-semibold text-[#1d1d1f]">{activeBlockers.filter(b => b.severity === item.sev).length}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-5">Active Blockers</h3>
                <div className="space-y-4">
                  {activeBlockers.map(blocker => (
                    <div key={blocker.id} className="p-5 rounded-xl bg-[#f5f5f7]">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-2.5 py-1 text-[11px] font-medium rounded-full ${blocker.severity === 'critical' ? 'bg-[#EF4444]/10 text-[#EF4444]' : blocker.severity === 'high' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' : 'bg-[#86868b]/10 text-[#86868b]'}`}>{blocker.severity}</span>
                        <span className="text-[15px] font-semibold text-[#1d1d1f]">{blocker.title}</span>
                      </div>
                      <p className="text-[13px] text-[#86868b] mb-4">{blocker.description}</p>
                      <div className="grid grid-cols-3 gap-4 p-4 bg-white rounded-lg">
                        <div><p className="text-[11px] text-[#86868b] mb-0.5">Owner</p><p className="text-[13px] font-medium text-[#1d1d1f]">{blocker.owner}</p></div>
                        <div><p className="text-[11px] text-[#86868b] mb-0.5">ETA</p><p className="text-[13px] font-medium text-[#1d1d1f]">{blocker.eta || 'TBD'}</p></div>
                        <div><p className="text-[11px] text-[#86868b] mb-0.5">Created</p><p className="text-[13px] font-medium text-[#1d1d1f]">{blocker.createdAt}</p></div>
                      </div>
                      {blocker.mitigationPlan && (
                        <div className="mt-4 p-4 bg-[#10B981]/5 rounded-lg border border-[#10B981]/20">
                          <p className="text-[11px] text-[#10B981] uppercase mb-1">Mitigation Plan</p>
                          <p className="text-[13px] text-[#1d1d1f]">{blocker.mitigationPlan}</p>
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
