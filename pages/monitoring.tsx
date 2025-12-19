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

// Status color mapping
const statusColors: Record<PhaseStatus, { bg: string; text: string; border: string }> = {
  done: { bg: 'bg-[#8AFD81]/20', text: 'text-emerald-700', border: 'border-[#8AFD81]' },
  in_progress: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-400' },
  at_risk: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-400' },
  blocked: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-400' },
  not_started: { bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-300' },
};

const severityColors: Record<BlockerSeverity, { bg: string; text: string }> = {
  critical: { bg: 'bg-red-100', text: 'text-red-700' },
  high: { bg: 'bg-orange-100', text: 'text-orange-700' },
  medium: { bg: 'bg-amber-100', text: 'text-amber-700' },
  low: { bg: 'bg-slate-100', text: 'text-slate-600' },
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

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      id: 'current',
      label: 'Current',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      id: 'tobe',
      label: 'To-Be',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      id: 'waiting',
      label: 'Waiting',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
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
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
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

      <div className="min-h-screen bg-slate-50 p-4 lg:p-6">
        <div className="max-w-[1600px] mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-[#8AFD81] text-slate-900 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                  Project
                </span>
                <span className="text-slate-400 text-xs font-medium uppercase tracking-widest">
                  Industrial Monitoring
                </span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900">{mockProject.name}</h1>
              <p className="text-sm text-slate-500 mt-1">Target: {mockProject.targetMW} MW | Location: {mockProject.location}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <TimeFilter selected={timeRange} onChange={setTimeRange} options={['7d', '30d', '90d']} />
              <ExportButton />
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-all text-sm font-medium shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload Doc
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm w-fit">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.id === 'waiting' && activeBlockers.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                    {activeBlockers.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* KPI Row */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {/* Progress Gauge */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                  <GaugeChart
                    value={mockProjectKPIs.overallProgress}
                    max={100}
                    label="Overall Progress"
                    unit="%"
                    size={160}
                    color="#8AFD81"
                  />
                </div>

                {/* MW Stats */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <div className="text-slate-500 text-xs uppercase tracking-wider mb-2 font-semibold">Power Capacity</div>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-4xl font-bold text-slate-900">{mockProjectKPIs.operationalMW}</span>
                    <span className="text-lg text-slate-500">/ {mockProjectKPIs.targetMW} MW</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div 
                      className="bg-[#8AFD81] h-2.5 rounded-full transition-all duration-1000"
                      style={{ width: `${(mockProjectKPIs.operationalMW / mockProjectKPIs.targetMW) * 100}%` }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    Installed: {mockProjectKPIs.installedMW} MW
                  </div>
                </div>

                {/* CSA Progress */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <div className="text-slate-500 text-xs uppercase tracking-wider mb-2 font-semibold">CSA Progress</div>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-4xl font-bold text-slate-900">{mockProjectKPIs.csaProgress}</span>
                    <span className="text-lg text-slate-500">%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-500 h-2.5 rounded-full transition-all duration-1000"
                      style={{ width: `${mockProjectKPIs.csaProgress}%` }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    Commissioning
                  </div>
                </div>

                {/* Budget */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <div className="text-slate-500 text-xs uppercase tracking-wider mb-2 font-semibold">Capex Spent</div>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-4xl font-bold text-slate-900">${(mockProjectKPIs.capexSpent / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div 
                      className="bg-amber-500 h-2.5 rounded-full transition-all duration-1000"
                      style={{ width: `${(mockProjectKPIs.capexSpent / mockProjectKPIs.capexBudget) * 100}%` }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    Budget: ${(mockProjectKPIs.capexBudget / 1000000).toFixed(0)}M
                  </div>
                </div>

                {/* Days to Target */}
                <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl">
                  <div className="text-slate-400 text-xs uppercase tracking-wider mb-2 font-semibold">Days to Target</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-[#8AFD81]">{mockProjectKPIs.daysToTarget}</span>
                    <span className="text-lg text-slate-400">days</span>
                  </div>
                  <div className="mt-3 text-xs text-slate-500">
                    Target: {mockProject.targetDate}
                  </div>
                </div>
              </div>

              {/* Phase Progress & Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Phase Summary */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Phase Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#8AFD81]" />
                        <span className="text-sm text-slate-700">Completed</span>
                      </div>
                      <span className="text-sm font-bold text-slate-900">{phaseStats.done}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="text-sm text-slate-700">In Progress</span>
                      </div>
                      <span className="text-sm font-bold text-slate-900">{phaseStats.inProgress}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                        <span className="text-sm text-slate-700">At Risk</span>
                      </div>
                      <span className="text-sm font-bold text-slate-900">{phaseStats.atRisk}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="text-sm text-slate-700">Blocked</span>
                      </div>
                      <span className="text-sm font-bold text-slate-900">{phaseStats.blocked}</span>
                    </div>
                  </div>
                </div>

                {/* Ramp-Up Progress */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Ramp-Up Progress</h3>
                  <AdvancedBarChart
                    data={rampUpData}
                    bars={[
                      { dataKey: 'target', name: 'Target', color: '#e2e8f0' },
                      { dataKey: 'actual', name: 'Actual', color: '#8AFD81' },
                    ]}
                    xAxisKey="name"
                    height={200}
                    showGrid={true}
                    showLegend={true}
                  />
                </div>
              </div>

              {/* All Phases Progress */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
                <h3 className="text-lg font-bold text-slate-900 mb-6">All Phases Progress</h3>
                <div className="space-y-4">
                  {mockPhases.map(phase => (
                    <div key={phase.id} className="group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${statusColors[phase.status].bg} ${statusColors[phase.status].text}`}>
                            {statusLabels[phase.status]}
                          </span>
                          <span className="text-sm font-medium text-slate-900">{phase.title}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-500">{phase.owner}</span>
                          <span className="text-sm font-bold text-slate-900">{phase.progress}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            phase.status === 'done' ? 'bg-[#8AFD81]' :
                            phase.status === 'in_progress' ? 'bg-blue-500' :
                            phase.status === 'at_risk' ? 'bg-amber-500' :
                            phase.status === 'blocked' ? 'bg-red-500' :
                            'bg-slate-300'
                          }`}
                          style={{ width: `${phase.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Blockers & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Blockers */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900">Active Blockers</h3>
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                      {activeBlockers.length} Open
                    </span>
                  </div>
                  <div className="space-y-3">
                    {activeBlockers.slice(0, 5).map(blocker => (
                      <div key={blocker.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="text-sm font-medium text-slate-900">{blocker.title}</span>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${severityColors[blocker.severity].bg} ${severityColors[blocker.severity].text}`}>
                            {blocker.severity}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>Owner: {blocker.owner}</span>
                          {blocker.eta && <span>ETA: {blocker.eta}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {mockActivityLog.slice(0, 6).map(log => (
                      <div key={log.id} className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                        <div className="w-2 h-2 rounded-full bg-[#8AFD81] mt-1.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-slate-900">
                            <span className="font-medium">{log.actor}</span>
                            <span className="text-slate-500"> {log.action}</span>
                          </div>
                          {log.details && (
                            <p className="text-xs text-slate-500 truncate">{log.details}</p>
                          )}
                          <span className="text-[10px] text-slate-400">
                            {new Date(log.timestamp).toLocaleString()}
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
            <div className="space-y-6">
              {/* Current Operations KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <div className="text-slate-500 text-xs uppercase tracking-wider mb-2 font-semibold">Operational MW</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-slate-900">{mockProjectKPIs.operationalMW}</span>
                    <span className="text-lg text-slate-500">MW</span>
                  </div>
                  <div className="mt-2 text-xs text-emerald-600 font-medium">
                    {((mockProjectKPIs.operationalMW / mockProjectKPIs.targetMW) * 100).toFixed(0)}% of target
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <div className="text-slate-500 text-xs uppercase tracking-wider mb-2 font-semibold">Hashrate</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-slate-900">{mockProjectKPIs.totalHashrate}</span>
                    <span className="text-lg text-slate-500">PH/s</span>
                  </div>
                  <div className="mt-2 text-xs text-emerald-600 font-medium">
                    Excellent performance
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <div className="text-slate-500 text-xs uppercase tracking-wider mb-2 font-semibold">PUE</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-slate-900">{mockProjectKPIs.pue}</span>
                  </div>
                  <div className="mt-2 text-xs text-emerald-600 font-medium">
                    Industry-leading efficiency
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <div className="text-slate-500 text-xs uppercase tracking-wider mb-2 font-semibold">Open Tickets</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-slate-900">{mockTickets.open}</span>
                    <span className={`text-sm font-bold ${mockTickets.critical > 0 ? 'text-red-500' : 'text-slate-400'}`}>
                      ({mockTickets.critical} critical)
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    Avg resolution: {mockTickets.avgResolutionHours}h
                  </div>
                </div>
              </div>

              {/* Power History Chart */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Power Consumption History</h3>
                    <p className="text-sm text-slate-500">MW operational over time</p>
                  </div>
                </div>
                <AdvancedAreaChart
                  data={powerChartData}
                  areas={[
                    { dataKey: 'mw', name: 'Operational MW', color: '#8AFD81' },
                  ]}
                  xAxisKey="date"
                  height={300}
                  showGrid={true}
                  showLegend={false}
                  yAxisLabel="MW"
                />
              </div>

              {/* Current Phase Details */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Phases In Progress</h3>
                <div className="space-y-4">
                  {mockPhases.filter(p => p.status === 'in_progress').map(phase => (
                    <div key={phase.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-slate-900">{phase.title}</h4>
                          <p className="text-xs text-slate-500 mt-1">{phase.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-slate-900">{phase.progress}%</div>
                          <div className="text-xs text-slate-500">Owner: {phase.owner}</div>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 mb-3">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${phase.progress}%` }}
                        />
                      </div>
                      {/* Milestones */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-4">
                        {phase.milestones.slice(0, 3).map(ms => (
                          <div key={ms.id} className="flex items-center gap-2 text-xs p-2 bg-white rounded border border-slate-100">
                            <div className={`w-2 h-2 rounded-full ${
                              ms.status === 'done' ? 'bg-[#8AFD81]' :
                              ms.status === 'in_progress' ? 'bg-blue-500' :
                              ms.status === 'at_risk' ? 'bg-amber-500' :
                              'bg-slate-300'
                            }`} />
                            <span className="truncate text-slate-700">{ms.name}</span>
                            <span className="ml-auto font-bold text-slate-900">{ms.progress}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Opex Stats */}
              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl">
                <h3 className="text-lg font-bold text-white mb-4">Monthly Operations</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-slate-400 text-xs uppercase mb-2">Opex Monthly</div>
                    <div className="text-3xl font-bold text-[#8AFD81]">
                      ${(mockProjectKPIs.opexMonthly / 1000000).toFixed(1)}M
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs uppercase mb-2">Tickets Resolved (7d)</div>
                    <div className="text-3xl font-bold text-white">{mockTickets.resolved7d}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs uppercase mb-2">Avg Resolution</div>
                    <div className="text-3xl font-bold text-white">{mockTickets.avgResolutionHours}h</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tobe' && (
            <div className="space-y-6">
              {/* Target Summary */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <div className="text-slate-400 text-xs uppercase tracking-wider mb-2">Target Capacity</div>
                    <div className="text-5xl font-bold text-[#8AFD81]">{mockProject.targetMW} MW</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs uppercase tracking-wider mb-2">Current</div>
                    <div className="text-5xl font-bold text-white">{mockProjectKPIs.operationalMW} MW</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs uppercase tracking-wider mb-2">Remaining</div>
                    <div className="text-5xl font-bold text-amber-400">
                      {mockProject.targetMW - mockProjectKPIs.operationalMW} MW
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs uppercase tracking-wider mb-2">Target Date</div>
                    <div className="text-2xl font-bold text-white">{mockProject.targetDate}</div>
                    <div className="text-sm text-[#8AFD81] mt-1">{mockProjectKPIs.daysToTarget} days remaining</div>
                  </div>
                </div>
              </div>

              {/* Ramp-Up Milestones */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Ramp-Up Roadmap</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {mockRampUpSteps.map((step, idx) => (
                    <div 
                      key={step.id}
                      className={`p-4 rounded-xl border-2 ${
                        step.status === 'done' ? 'bg-[#8AFD81]/10 border-[#8AFD81]' :
                        step.status === 'in_progress' ? 'bg-blue-50 border-blue-400' :
                        'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="text-center mb-3">
                        <div className={`text-3xl font-bold ${
                          step.status === 'done' ? 'text-[#8AFD81]' :
                          step.status === 'in_progress' ? 'text-blue-600' :
                          'text-slate-400'
                        }`}>
                          {step.targetMW} MW
                        </div>
                        <div className="text-xs text-slate-500 mt-1">Step {idx + 1}</div>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Planned:</span>
                          <span className="font-medium text-slate-700">{step.plannedDate}</span>
                        </div>
                        {step.actualDate && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">Actual:</span>
                            <span className="font-medium text-slate-700">{step.actualDate}</span>
                          </div>
                        )}
                        {step.actualMW && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">Achieved:</span>
                            <span className="font-bold text-emerald-600">{step.actualMW} MW</span>
                          </div>
                        )}
                        {step.availability72h && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">Availability:</span>
                            <span className="font-medium text-slate-700">{step.availability72h}%</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-3 text-center">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${statusColors[step.status].bg} ${statusColors[step.status].text}`}>
                          {statusLabels[step.status]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Phases */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Pending & At-Risk Phases</h3>
                <div className="space-y-4">
                  {pendingPhases.map(phase => (
                    <div key={phase.id} className={`p-4 rounded-xl border-l-4 bg-slate-50 ${statusColors[phase.status].border}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${statusColors[phase.status].bg} ${statusColors[phase.status].text}`}>
                              {statusLabels[phase.status]}
                            </span>
                            <h4 className="font-bold text-slate-900">{phase.title}</h4>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{phase.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-slate-900">{phase.progress}%</div>
                          <div className="text-xs text-slate-500">{phase.owner}</div>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                        <div 
                          className={`h-1.5 rounded-full ${
                            phase.status === 'in_progress' ? 'bg-blue-500' :
                            phase.status === 'at_risk' ? 'bg-amber-500' :
                            'bg-slate-300'
                          }`}
                          style={{ width: `${phase.progress}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                        <span>Planned: {phase.plannedStartDate} - {phase.plannedEndDate}</span>
                        <span>{phase.milestones.length} milestones</span>
                        {phase.blockers.length > 0 && (
                          <span className="text-red-600 font-medium">{phase.blockers.length} blocker(s)</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Budget Remaining */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Budget Status</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600">Capex Spent</span>
                        <span className="font-bold text-slate-900">${(mockProjectKPIs.capexSpent / 1000000).toFixed(1)}M</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div 
                          className="bg-[#8AFD81] h-3 rounded-full"
                          style={{ width: `${(mockProjectKPIs.capexSpent / mockProjectKPIs.capexBudget) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-slate-100">
                      <span className="text-slate-600">Total Budget</span>
                      <span className="font-bold text-slate-900">${(mockProjectKPIs.capexBudget / 1000000).toFixed(0)}M</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Remaining</span>
                      <span className="font-bold text-emerald-600">
                        ${((mockProjectKPIs.capexBudget - mockProjectKPIs.capexSpent) / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Material Requirements</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
                      <span className="text-sm text-slate-700">Batch 4 Containers</span>
                      <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded">Pending Customs</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-sm text-slate-700">Miners for Batch 4</span>
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">Ready at Warehouse</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#8AFD81]/10 rounded-lg border border-[#8AFD81]/30">
                      <span className="text-sm text-slate-700">Cabling & Accessories</span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded">On Site</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'waiting' && (
            <div className="space-y-6">
              {/* Blockers Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
                  <div className="text-red-600 text-xs uppercase tracking-wider mb-2 font-semibold">Critical</div>
                  <div className="text-4xl font-bold text-red-700">
                    {activeBlockers.filter(b => b.severity === 'critical').length}
                  </div>
                </div>
                <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                  <div className="text-orange-600 text-xs uppercase tracking-wider mb-2 font-semibold">High</div>
                  <div className="text-4xl font-bold text-orange-700">
                    {activeBlockers.filter(b => b.severity === 'high').length}
                  </div>
                </div>
                <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                  <div className="text-amber-600 text-xs uppercase tracking-wider mb-2 font-semibold">Medium</div>
                  <div className="text-4xl font-bold text-amber-700">
                    {activeBlockers.filter(b => b.severity === 'medium').length}
                  </div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                  <div className="text-slate-500 text-xs uppercase tracking-wider mb-2 font-semibold">Low</div>
                  <div className="text-4xl font-bold text-slate-600">
                    {activeBlockers.filter(b => b.severity === 'low').length}
                  </div>
                </div>
              </div>

              {/* Active Blockers List */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Active Blockers</h3>
                <div className="space-y-4">
                  {activeBlockers.map(blocker => (
                    <div key={blocker.id} className={`p-5 rounded-xl border-l-4 bg-slate-50 ${
                      blocker.severity === 'critical' ? 'border-red-500' :
                      blocker.severity === 'high' ? 'border-orange-500' :
                      blocker.severity === 'medium' ? 'border-amber-500' :
                      'border-slate-300'
                    }`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${severityColors[blocker.severity].bg} ${severityColors[blocker.severity].text}`}>
                              {blocker.severity}
                            </span>
                            <h4 className="font-bold text-slate-900">{blocker.title}</h4>
                          </div>
                          <p className="text-sm text-slate-600">{blocker.description}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-3 bg-white rounded-lg border border-slate-100">
                        <div>
                          <div className="text-xs text-slate-500 mb-1">Owner</div>
                          <div className="text-sm font-medium text-slate-900">{blocker.owner}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 mb-1">ETA Resolution</div>
                          <div className="text-sm font-medium text-slate-900">{blocker.eta || 'TBD'}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 mb-1">Created</div>
                          <div className="text-sm font-medium text-slate-900">{blocker.createdAt}</div>
                        </div>
                      </div>

                      {blocker.mitigationPlan && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <div className="text-xs text-blue-600 font-bold uppercase mb-1">Mitigation Plan</div>
                          <p className="text-sm text-blue-800">{blocker.mitigationPlan}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-4">
                        <button className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors">
                          Update Status
                        </button>
                        <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors">
                          Add Comment
                        </button>
                        <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors">
                          Upload Document
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Documents */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Pending Documents</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 font-semibold text-slate-600">Document</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-600">Type</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-600">Phase</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-600">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-600">Uploaded By</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockPhases.flatMap(phase => 
                        phase.docs.filter(doc => doc.status === 'pending_review' || doc.status === 'draft')
                      ).map(doc => (
                        <tr key={doc.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4 font-medium text-slate-900">{doc.name}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded uppercase">
                              {doc.type}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600">-</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 text-xs rounded font-medium ${
                              doc.status === 'pending_review' ? 'bg-amber-100 text-amber-700' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                              {doc.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600">{doc.uploadedBy}</td>
                          <td className="py-3 px-4">
                            <button className="text-blue-600 hover:text-blue-800 font-medium text-xs">
                              Review
                            </button>
                          </td>
                        </tr>
                      ))}
                      {mockPhases.flatMap(phase => 
                        phase.docs.filter(doc => doc.status === 'pending_review' || doc.status === 'draft')
                      ).length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-500">
                            No pending documents
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Phases At Risk or Blocked */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Phases Requiring Attention</h3>
                <div className="space-y-3">
                  {mockPhases.filter(p => p.status === 'at_risk' || p.status === 'blocked').map(phase => (
                    <div key={phase.id} className={`flex items-center justify-between p-4 rounded-xl border ${
                      phase.status === 'blocked' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
                    }`}>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${statusColors[phase.status].bg} ${statusColors[phase.status].text}`}>
                          {statusLabels[phase.status]}
                        </span>
                        <div>
                          <h4 className="font-bold text-slate-900">{phase.title}</h4>
                          <p className="text-xs text-slate-500">{phase.owner}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-lg font-bold text-slate-900">{phase.progress}%</div>
                          <div className="text-xs text-slate-500">{phase.blockers.length} blocker(s)</div>
                        </div>
                        <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors">
                          View Details
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
