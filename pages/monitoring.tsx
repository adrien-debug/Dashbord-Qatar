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

// Status color mapping - unified grey/green palette
const statusColors: Record<PhaseStatus, { bg: string; text: string; border: string; bar: string }> = {
  done: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', bar: 'bg-emerald-500' },
  in_progress: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300', bar: 'bg-slate-500' },
  at_risk: { bg: 'bg-slate-200', text: 'text-slate-800', border: 'border-slate-400', bar: 'bg-slate-600' },
  blocked: { bg: 'bg-slate-300', text: 'text-slate-900', border: 'border-slate-500', bar: 'bg-slate-700' },
  not_started: { bg: 'bg-slate-50', text: 'text-slate-400', border: 'border-slate-200', bar: 'bg-slate-300' },
};

const severityColors: Record<BlockerSeverity, { bg: string; text: string }> = {
  critical: { bg: 'bg-slate-800', text: 'text-white' },
  high: { bg: 'bg-slate-600', text: 'text-white' },
  medium: { bg: 'bg-slate-400', text: 'text-white' },
  low: { bg: 'bg-slate-200', text: 'text-slate-700' },
};

const statusLabels: Record<PhaseStatus, string> = {
  done: 'Complete',
  in_progress: 'In Progress',
  at_risk: 'At Risk',
  blocked: 'Blocked',
  not_started: 'Not Started',
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

  // Calculate phase statistics
  const phaseStats = {
    total: mockPhases.length,
    done: mockPhases.filter(p => p.status === 'done').length,
    inProgress: mockPhases.filter(p => p.status === 'in_progress').length,
    atRisk: mockPhases.filter(p => p.status === 'at_risk').length,
    blocked: mockPhases.filter(p => p.status === 'blocked').length,
  };

  // Ramp-up chart data
  const rampUpData = mockRampUpSteps.map(step => ({
    name: `${step.targetMW} MW`,
    target: step.targetMW,
    actual: step.actualMW || 0,
    status: step.status,
  }));

  // Power history for area chart
  const powerChartData = mockPowerHistory.slice(-90).map(d => ({
    date: new Date(d.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
    mw: d.mw,
    target: d.target,
  }));

  // Phases not started or in progress (for To-Be tab)
  const pendingPhases = mockPhases.filter(
    p => p.status === 'not_started' || p.status === 'in_progress' || p.status === 'at_risk'
  );

  // Blockers for Waiting tab
  const activeBlockers = mockBlockers.filter(b => !b.resolvedAt);

  return (
    <>
      <Head>
        <title>Project Monitoring - Hearst Qatar 100MW</title>
      </Head>

      <div className="min-h-screen bg-slate-50 p-4 lg:p-5">
        <div className="max-w-[1600px] mx-auto space-y-5">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="px-2.5 py-0.5 bg-emerald-500 text-white rounded text-[10px] font-semibold uppercase tracking-wider">
                  Project
                </span>
                <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                  Industrial Monitoring
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-800">{mockProject.name}</h1>
              <p className="text-xs text-slate-400 mt-0.5">Target: {mockProject.targetMW} MW | {mockProject.location}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="bg-white p-1 rounded-lg border border-slate-200 flex items-center gap-1">
                <TimeFilter selected={timeRange} onChange={setTimeRange} options={['7d', '30d', '90d']} />
                <ExportButton />
              </div>
              <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-all text-xs font-medium">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 w-fit">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                {tab.label}
                {tab.id === 'waiting' && activeBlockers.length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 bg-slate-600 text-white text-[9px] font-bold rounded">
                    {activeBlockers.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* KPI Row */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {/* Progress Gauge */}
                <div className="bg-white rounded-xl p-5 border border-slate-200 flex flex-col items-center justify-center">
                  <GaugeChart
                    value={mockProjectKPIs.overallProgress}
                    max={100}
                    label="Overall Progress"
                    unit="%"
                    size={140}
                    color="#10B981"
                  />
                </div>

                {/* MW Stats */}
                <div className="bg-white rounded-xl p-5 border border-slate-200">
                  <div className="text-slate-500 text-[10px] uppercase tracking-wide mb-2 font-semibold">Power Capacity</div>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-3xl font-bold text-slate-800">{mockProjectKPIs.operationalMW}</span>
                    <span className="text-sm text-slate-400">/ {mockProjectKPIs.targetMW} MW</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div 
                      className="bg-emerald-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${(mockProjectKPIs.operationalMW / mockProjectKPIs.targetMW) * 100}%` }}
                    />
                  </div>
                  <div className="mt-1.5 text-[10px] text-slate-400">Installed: {mockProjectKPIs.installedMW} MW</div>
                </div>

                {/* CSA Progress */}
                <div className="bg-white rounded-xl p-5 border border-slate-200">
                  <div className="text-slate-500 text-[10px] uppercase tracking-wide mb-2 font-semibold">CSA Progress</div>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-3xl font-bold text-slate-800">{mockProjectKPIs.csaProgress}</span>
                    <span className="text-sm text-slate-400">%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div 
                      className="bg-slate-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${mockProjectKPIs.csaProgress}%` }}
                    />
                  </div>
                  <div className="mt-1.5 text-[10px] text-slate-400">Commissioning</div>
                </div>

                {/* Budget */}
                <div className="bg-white rounded-xl p-5 border border-slate-200">
                  <div className="text-slate-500 text-[10px] uppercase tracking-wide mb-2 font-semibold">Capex Spent</div>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-3xl font-bold text-slate-800">${(mockProjectKPIs.capexSpent / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div 
                      className="bg-slate-400 h-1.5 rounded-full transition-all"
                      style={{ width: `${(mockProjectKPIs.capexSpent / mockProjectKPIs.capexBudget) * 100}%` }}
                    />
                  </div>
                  <div className="mt-1.5 text-[10px] text-slate-400">Budget: ${(mockProjectKPIs.capexBudget / 1000000).toFixed(0)}M</div>
                </div>

                {/* Days to Target */}
                <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
                  <div className="text-slate-400 text-[10px] uppercase tracking-wide mb-2 font-semibold">Days to Target</div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-bold text-emerald-400">{mockProjectKPIs.daysToTarget}</span>
                    <span className="text-sm text-slate-400">days</span>
                  </div>
                  <div className="mt-2 text-[10px] text-slate-500">Target: {mockProject.targetDate}</div>
                </div>
              </div>

              {/* Phase Progress & Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Phase Summary */}
                <div className="bg-white rounded-xl p-5 border border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-800 mb-4 uppercase tracking-wide">Phase Status</h3>
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span className="text-xs text-slate-600">Completed</span>
                      </div>
                      <span className="text-xs font-bold text-slate-800">{phaseStats.done}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                        <span className="text-xs text-slate-600">In Progress</span>
                      </div>
                      <span className="text-xs font-bold text-slate-800">{phaseStats.inProgress}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                        <span className="text-xs text-slate-600">At Risk</span>
                      </div>
                      <span className="text-xs font-bold text-slate-800">{phaseStats.atRisk}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                        <span className="text-xs text-slate-600">Blocked</span>
                      </div>
                      <span className="text-xs font-bold text-slate-800">{phaseStats.blocked}</span>
                    </div>
                  </div>
                </div>

                {/* Ramp-Up Progress */}
                <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-800 mb-4 uppercase tracking-wide">Ramp-Up Progress</h3>
                  <AdvancedBarChart
                    data={rampUpData}
                    bars={[
                      { dataKey: 'target', name: 'Target', color: '#e2e8f0' },
                      { dataKey: 'actual', name: 'Actual', color: '#10B981' },
                    ]}
                    xAxisKey="name"
                    height={180}
                    showGrid={true}
                    showLegend={true}
                  />
                </div>
              </div>

              {/* All Phases Progress - Collapsible */}
              <div className="bg-white rounded-xl p-5 border border-slate-200">
                <h3 className="text-sm font-semibold text-slate-800 mb-5 uppercase tracking-wide">All Phases Progress</h3>
                <div className="space-y-3">
                  {mockPhases.map(phase => (
                    <div key={phase.id} className="border border-slate-100 rounded-lg overflow-hidden hover:border-slate-200 transition-colors">
                      {/* Phase Header - Clickable */}
                      <button
                        onClick={() => togglePhase(phase.id)}
                        className="w-full p-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <svg 
                            className={`w-4 h-4 text-slate-400 transition-transform ${expandedPhases.has(phase.id) ? 'rotate-90' : ''}`} 
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${statusColors[phase.status].bg} ${statusColors[phase.status].text}`}>
                            {statusLabels[phase.status]}
                          </span>
                          <span className="text-sm font-medium text-slate-800">{phase.title}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] text-slate-400">{phase.owner}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-slate-200 rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full transition-all ${statusColors[phase.status].bar}`}
                                style={{ width: `${phase.progress}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-slate-700 w-8 text-right">{phase.progress}%</span>
                          </div>
                        </div>
                      </button>

                      {/* Phase Details - Expandable */}
                      {expandedPhases.has(phase.id) && (
                        <div className="p-4 bg-white border-t border-slate-100">
                          <p className="text-xs text-slate-500 mb-4">{phase.description}</p>
                          
                          {/* Milestones */}
                          <div className="mb-4">
                            <div className="text-[10px] font-semibold text-slate-400 uppercase mb-2">Milestones</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                              {phase.milestones.map(ms => (
                                <div key={ms.id} className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-100">
                                  <div className={`w-2 h-2 rounded-full ${statusColors[ms.status].bar}`} />
                                  <span className="text-[11px] text-slate-600 flex-1 truncate">{ms.name}</span>
                                  <span className="text-[10px] font-bold text-slate-700">{ms.progress}%</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Dates & Docs */}
                          <div className="flex items-center gap-6 text-[10px] text-slate-400">
                            <span>Planned: {phase.plannedStartDate} - {phase.plannedEndDate}</span>
                            <span>{phase.docs.length} documents</span>
                            {phase.blockers.length > 0 && (
                              <span className="text-slate-600 font-medium">{phase.blockers.length} blocker(s)</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Blockers & Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Top Blockers */}
                <div className="bg-white rounded-xl p-5 border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">Active Blockers</h3>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded">
                      {activeBlockers.length} Open
                    </span>
                  </div>
                  <div className="space-y-2">
                    {activeBlockers.slice(0, 5).map(blocker => (
                      <div key={blocker.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <span className="text-xs font-medium text-slate-700">{blocker.title}</span>
                          <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${severityColors[blocker.severity].bg} ${severityColors[blocker.severity].text}`}>
                            {blocker.severity}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-slate-400">
                          <span>{blocker.owner}</span>
                          {blocker.eta && <span>ETA: {blocker.eta}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl p-5 border border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-800 mb-4 uppercase tracking-wide">Recent Activity</h3>
                  <div className="space-y-2">
                    {mockActivityLog.slice(0, 6).map(log => (
                      <div key={log.id} className="flex items-start gap-2.5 p-2 hover:bg-slate-50 rounded transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-slate-700">
                            <span className="font-medium">{log.actor}</span>
                            <span className="text-slate-400"> {log.action}</span>
                          </div>
                          {log.details && (
                            <p className="text-[10px] text-slate-400 truncate">{log.details}</p>
                          )}
                          <span className="text-[9px] text-slate-300">
                            {new Date(log.timestamp).toLocaleString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'current' && (
            <div className="space-y-5">
              {/* Current Operations KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-5 border border-slate-200">
                  <div className="text-slate-500 text-[10px] uppercase tracking-wide mb-2 font-semibold">Operational MW</div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-bold text-slate-800">{mockProjectKPIs.operationalMW}</span>
                    <span className="text-sm text-slate-400">MW</span>
                  </div>
                  <div className="mt-1.5 text-[10px] text-emerald-600 font-medium">
                    {((mockProjectKPIs.operationalMW / mockProjectKPIs.targetMW) * 100).toFixed(0)}% of target
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-slate-200">
                  <div className="text-slate-500 text-[10px] uppercase tracking-wide mb-2 font-semibold">Hashrate</div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-bold text-slate-800">{mockProjectKPIs.totalHashrate}</span>
                    <span className="text-sm text-slate-400">PH/s</span>
                  </div>
                  <div className="mt-1.5 text-[10px] text-emerald-600 font-medium">Excellent</div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-slate-200">
                  <div className="text-slate-500 text-[10px] uppercase tracking-wide mb-2 font-semibold">PUE</div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-bold text-slate-800">{mockProjectKPIs.pue}</span>
                  </div>
                  <div className="mt-1.5 text-[10px] text-emerald-600 font-medium">Industry-leading</div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-slate-200">
                  <div className="text-slate-500 text-[10px] uppercase tracking-wide mb-2 font-semibold">Open Tickets</div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-bold text-slate-800">{mockTickets.open}</span>
                    <span className="text-xs font-medium text-slate-400">({mockTickets.critical} critical)</span>
                  </div>
                  <div className="mt-1.5 text-[10px] text-slate-400">Avg: {mockTickets.avgResolutionHours}h</div>
                </div>
              </div>

              {/* Power History Chart */}
              <div className="bg-white rounded-xl p-5 border border-slate-200">
                <div className="mb-5">
                  <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">Power History</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">MW operational over time</p>
                </div>
                <AdvancedAreaChart
                  data={powerChartData}
                  areas={[
                    { dataKey: 'mw', name: 'Operational MW', color: '#10B981' },
                  ]}
                  xAxisKey="date"
                  height={260}
                  showGrid={true}
                  showLegend={false}
                  yAxisLabel="MW"
                />
              </div>

              {/* Current Phase Details */}
              <div className="bg-white rounded-xl p-5 border border-slate-200">
                <h3 className="text-sm font-semibold text-slate-800 mb-5 uppercase tracking-wide">Phases In Progress</h3>
                <div className="space-y-3">
                  {mockPhases.filter(p => p.status === 'in_progress').map(phase => (
                    <div key={phase.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-800">{phase.title}</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">{phase.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-slate-800">{phase.progress}%</div>
                          <div className="text-[10px] text-slate-400">{phase.owner}</div>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 mb-3">
                        <div 
                          className="bg-slate-500 h-1.5 rounded-full"
                          style={{ width: `${phase.progress}%` }}
                        />
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {phase.milestones.slice(0, 3).map(ms => (
                          <div key={ms.id} className="flex items-center gap-1.5 text-[10px] p-1.5 bg-white rounded border border-slate-100">
                            <div className={`w-1.5 h-1.5 rounded-full ${statusColors[ms.status].bar}`} />
                            <span className="truncate text-slate-600">{ms.name}</span>
                            <span className="ml-auto font-bold text-slate-700">{ms.progress}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Opex Stats */}
              <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
                <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">Monthly Operations</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase mb-1">Opex Monthly</div>
                    <div className="text-2xl font-bold text-emerald-400">${(mockProjectKPIs.opexMonthly / 1000000).toFixed(1)}M</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase mb-1">Tickets Resolved (7d)</div>
                    <div className="text-2xl font-bold text-white">{mockTickets.resolved7d}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase mb-1">Avg Resolution</div>
                    <div className="text-2xl font-bold text-white">{mockTickets.avgResolutionHours}h</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tobe' && (
            <div className="space-y-5">
              {/* Target Summary */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase tracking-wide mb-1">Target</div>
                    <div className="text-4xl font-bold text-emerald-400">{mockProject.targetMW} MW</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase tracking-wide mb-1">Current</div>
                    <div className="text-4xl font-bold text-white">{mockProjectKPIs.operationalMW} MW</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase tracking-wide mb-1">Remaining</div>
                    <div className="text-4xl font-bold text-slate-400">
                      {mockProject.targetMW - mockProjectKPIs.operationalMW} MW
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase tracking-wide mb-1">Target Date</div>
                    <div className="text-xl font-bold text-white">{mockProject.targetDate}</div>
                    <div className="text-xs text-emerald-400 mt-0.5">{mockProjectKPIs.daysToTarget} days</div>
                  </div>
                </div>
              </div>

              {/* Ramp-Up Milestones */}
              <div className="bg-white rounded-xl p-5 border border-slate-200">
                <h3 className="text-sm font-semibold text-slate-800 mb-5 uppercase tracking-wide">Ramp-Up Roadmap</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {mockRampUpSteps.map((step, idx) => (
                    <div 
                      key={step.id}
                      className={`p-4 rounded-lg border-2 ${
                        step.status === 'done' ? 'bg-emerald-50 border-emerald-200' :
                        step.status === 'in_progress' ? 'bg-slate-100 border-slate-300' :
                        'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="text-center mb-3">
                        <div className={`text-2xl font-bold ${
                          step.status === 'done' ? 'text-emerald-600' :
                          step.status === 'in_progress' ? 'text-slate-700' :
                          'text-slate-400'
                        }`}>
                          {step.targetMW} MW
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Step {idx + 1}</div>
                      </div>
                      <div className="space-y-1 text-[10px]">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Planned</span>
                          <span className="font-medium text-slate-600">{step.plannedDate}</span>
                        </div>
                        {step.actualDate && (
                          <div className="flex justify-between">
                            <span className="text-slate-400">Actual</span>
                            <span className="font-medium text-slate-600">{step.actualDate}</span>
                          </div>
                        )}
                        {step.actualMW && (
                          <div className="flex justify-between">
                            <span className="text-slate-400">Achieved</span>
                            <span className="font-bold text-emerald-600">{step.actualMW} MW</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${statusColors[step.status].bg} ${statusColors[step.status].text}`}>
                          {statusLabels[step.status]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Phases */}
              <div className="bg-white rounded-xl p-5 border border-slate-200">
                <h3 className="text-sm font-semibold text-slate-800 mb-5 uppercase tracking-wide">Pending Phases</h3>
                <div className="space-y-2">
                  {pendingPhases.map(phase => (
                    <div key={phase.id} className={`p-4 rounded-lg border-l-4 bg-slate-50 ${statusColors[phase.status].border}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${statusColors[phase.status].bg} ${statusColors[phase.status].text}`}>
                              {statusLabels[phase.status]}
                            </span>
                            <h4 className="text-sm font-semibold text-slate-800">{phase.title}</h4>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">{phase.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-slate-800">{phase.progress}%</div>
                          <div className="text-[10px] text-slate-400">{phase.owner}</div>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1 mt-2">
                        <div 
                          className={`h-1 rounded-full ${statusColors[phase.status].bar}`}
                          style={{ width: `${phase.progress}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-[10px] text-slate-400">
                        <span>{phase.plannedStartDate} - {phase.plannedEndDate}</span>
                        <span>{phase.milestones.length} milestones</span>
                        {phase.blockers.length > 0 && (
                          <span className="text-slate-600 font-medium">{phase.blockers.length} blocker(s)</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Budget & Materials */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-5 border border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-800 mb-4 uppercase tracking-wide">Budget Status</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-500">Capex Spent</span>
                        <span className="font-bold text-slate-800">${(mockProjectKPIs.capexSpent / 1000000).toFixed(1)}M</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div 
                          className="bg-emerald-500 h-2 rounded-full"
                          style={{ width: `${(mockProjectKPIs.capexSpent / mockProjectKPIs.capexBudget) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between text-xs pt-2 border-t border-slate-100">
                      <span className="text-slate-500">Total Budget</span>
                      <span className="font-bold text-slate-800">${(mockProjectKPIs.capexBudget / 1000000).toFixed(0)}M</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Remaining</span>
                      <span className="font-bold text-emerald-600">
                        ${((mockProjectKPIs.capexBudget - mockProjectKPIs.capexSpent) / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-800 mb-4 uppercase tracking-wide">Material Status</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-slate-100 rounded-lg border border-slate-200">
                      <span className="text-xs text-slate-700">Batch 4 Containers</span>
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded">Pending Customs</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-xs text-slate-700">Miners for Batch 4</span>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Warehouse</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                      <span className="text-xs text-slate-700">Cabling & Accessories</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">On Site</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'waiting' && (
            <div className="space-y-5">
              {/* Blockers Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
                  <div className="text-slate-400 text-[10px] uppercase tracking-wide mb-2 font-semibold">Critical</div>
                  <div className="text-3xl font-bold text-white">
                    {activeBlockers.filter(b => b.severity === 'critical').length}
                  </div>
                </div>
                <div className="bg-slate-600 rounded-xl p-5 border border-slate-500">
                  <div className="text-slate-300 text-[10px] uppercase tracking-wide mb-2 font-semibold">High</div>
                  <div className="text-3xl font-bold text-white">
                    {activeBlockers.filter(b => b.severity === 'high').length}
                  </div>
                </div>
                <div className="bg-slate-400 rounded-xl p-5">
                  <div className="text-white text-[10px] uppercase tracking-wide mb-2 font-semibold">Medium</div>
                  <div className="text-3xl font-bold text-white">
                    {activeBlockers.filter(b => b.severity === 'medium').length}
                  </div>
                </div>
                <div className="bg-slate-100 rounded-xl p-5 border border-slate-200">
                  <div className="text-slate-500 text-[10px] uppercase tracking-wide mb-2 font-semibold">Low</div>
                  <div className="text-3xl font-bold text-slate-600">
                    {activeBlockers.filter(b => b.severity === 'low').length}
                  </div>
                </div>
              </div>

              {/* Active Blockers List */}
              <div className="bg-white rounded-xl p-5 border border-slate-200">
                <h3 className="text-sm font-semibold text-slate-800 mb-5 uppercase tracking-wide">Active Blockers</h3>
                <div className="space-y-3">
                  {activeBlockers.map(blocker => (
                    <div key={blocker.id} className={`p-4 rounded-lg border-l-4 bg-slate-50 ${
                      blocker.severity === 'critical' ? 'border-slate-800' :
                      blocker.severity === 'high' ? 'border-slate-600' :
                      blocker.severity === 'medium' ? 'border-slate-400' :
                      'border-slate-300'
                    }`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${severityColors[blocker.severity].bg} ${severityColors[blocker.severity].text}`}>
                              {blocker.severity}
                            </span>
                            <h4 className="text-sm font-semibold text-slate-800">{blocker.title}</h4>
                          </div>
                          <p className="text-xs text-slate-500">{blocker.description}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mt-3 p-3 bg-white rounded border border-slate-100">
                        <div>
                          <div className="text-[10px] text-slate-400 mb-0.5">Owner</div>
                          <div className="text-xs font-medium text-slate-700">{blocker.owner}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 mb-0.5">ETA</div>
                          <div className="text-xs font-medium text-slate-700">{blocker.eta || 'TBD'}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 mb-0.5">Created</div>
                          <div className="text-xs font-medium text-slate-700">{blocker.createdAt}</div>
                        </div>
                      </div>

                      {blocker.mitigationPlan && (
                        <div className="mt-3 p-3 bg-slate-100 rounded border border-slate-200">
                          <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Mitigation</div>
                          <p className="text-xs text-slate-600">{blocker.mitigationPlan}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-3">
                        <button className="px-3 py-1.5 bg-slate-800 text-white text-[10px] font-bold rounded hover:bg-slate-700 transition-colors">
                          Update
                        </button>
                        <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-[10px] font-medium rounded hover:bg-slate-50 transition-colors">
                          Comment
                        </button>
                        <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-[10px] font-medium rounded hover:bg-slate-50 transition-colors">
                          Upload
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Phases At Risk */}
              <div className="bg-white rounded-xl p-5 border border-slate-200">
                <h3 className="text-sm font-semibold text-slate-800 mb-4 uppercase tracking-wide">Phases Requiring Attention</h3>
                <div className="space-y-2">
                  {mockPhases.filter(p => p.status === 'at_risk' || p.status === 'blocked').map(phase => (
                    <div key={phase.id} className={`flex items-center justify-between p-4 rounded-lg border ${
                      phase.status === 'blocked' ? 'bg-slate-100 border-slate-300' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex items-center gap-3">
                        <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${statusColors[phase.status].bg} ${statusColors[phase.status].text}`}>
                          {statusLabels[phase.status]}
                        </span>
                        <div>
                          <h4 className="text-sm font-semibold text-slate-800">{phase.title}</h4>
                          <p className="text-[10px] text-slate-400">{phase.owner}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-base font-bold text-slate-800">{phase.progress}%</div>
                          <div className="text-[10px] text-slate-400">{phase.blockers.length} blocker(s)</div>
                        </div>
                        <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-[10px] font-medium rounded hover:bg-slate-50 transition-colors">
                          Details
                        </button>
                      </div>
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
