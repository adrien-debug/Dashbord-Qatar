import Head from 'next/head';
import { useState } from 'react';
import { TimeFilter, TimeRange, ExportButton } from '../components/dashboard';
import {
  AdvancedAreaChart,
  AdvancedBarChart,
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
import {
  Target,
  Zap,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileText,
  Activity,
  ChevronUp,
  BarChart3,
  Layers,
  Settings,
} from 'lucide-react';

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
    { id: 'overview', label: 'Overview', icon: <Layers className="w-4 h-4" /> },
    { id: 'current', label: 'Current', icon: <Zap className="w-4 h-4" /> },
    { id: 'tobe', label: 'To-Be', icon: <Target className="w-4 h-4" /> },
    { id: 'waiting', label: 'Waiting', icon: <Clock className="w-4 h-4" /> },
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

      <div className="min-h-screen bg-slate-50 bg-grid-slate-100 p-6 lg:p-8">
        <div className="max-w-[1600px] mx-auto">
          
          {/* BENTO GRID CONTAINER */}
          <div className="grid grid-cols-12 gap-4">
            
            {/* 1. HERO HEADER - Full Width */}
            <div className="col-span-12 relative h-[200px] rounded-2xl overflow-hidden bg-slate-900 animate-fade-in-up">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900" />
              <div className="absolute inset-0 bg-[url('/Image%2012-12-2025%20a%CC%80%206.58%E2%80%AFPM.JPG')] bg-cover opacity-20" style={{ backgroundPosition: '30% center' }} />

              {/* Content */}
              <div className="absolute inset-0 z-20">
                {/* Top Left - Badges */}
                <div className="absolute top-6 left-8 lg:left-10 flex items-center gap-3">
                  <span className="px-3 py-1.5 bg-[#8AFD81] text-slate-900 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    Project
                  </span>
                  <span className="px-3 py-1.5 bg-white/10 text-white/90 rounded-full text-[10px] font-medium backdrop-blur-md border border-white/10 uppercase tracking-widest">
                    Industrial Monitoring
                  </span>
                </div>

                {/* Bottom Left - Title */}
                <div className="absolute bottom-6 left-8 lg:left-10">
                  <h1 className="text-4xl lg:text-3xl font-bold text-white tracking-tight leading-tight">
                    {mockProject.name.split(' ')[0]} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80]">{mockProject.name.split(' ').slice(1).join(' ')}</span>
                  </h1>
                  <p className="text-sm text-slate-400 mt-2">Target: {mockProject.targetMW} MW | Location: {mockProject.location}</p>
                </div>

                {/* Bottom Right - Time Filter */}
                <div className="absolute bottom-6 right-8 lg:right-10 flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700 backdrop-blur-sm">
                  <TimeFilter selected={timeRange} onChange={setTimeRange} options={['7d', '30d', '90d']} />
                  <ExportButton />
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="col-span-12 flex items-center justify-between animate-fade-in-up delay-100">
              <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
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
            </div>

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <>
                {/* KPI Cards - 4 cols each */}
                <div className="col-span-12 lg:col-span-3 rounded-2xl overflow-hidden border border-slate-200 hover:border-[#8AFD81]/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8AFD81]/10 animate-fade-in-up delay-100 flex flex-col">
                  <div className="bg-slate-800 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-white" strokeWidth={1.5} />
                      <div>
                        <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                          Overall Progress
                        </div>
                        <div className="text-white text-xs">Project completion</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-3 flex flex-col flex-1">
                    <div className="flex items-end justify-center gap-3 mb-4">
                      <div className="text-3xl font-bold text-slate-900 tracking-tight tabular-nums">
                        {mockProjectKPIs.overallProgress}
                      </div>
                      <div className="text-lg font-medium text-slate-400 pb-1">%</div>
                    </div>
                    <div className="relative w-full h-4 rounded-full overflow-hidden mt-auto">
                      <div className="absolute inset-0 bg-slate-200 rounded-full" />
                      <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] rounded-full" style={{ width: `${mockProjectKPIs.overallProgress}%` }} />
                    </div>
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-3 rounded-2xl overflow-hidden border border-slate-200 hover:border-[#8AFD81]/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8AFD81]/10 animate-fade-in-up delay-100 flex flex-col">
                  <div className="bg-slate-800 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-white" strokeWidth={1.5} />
                      <div>
                        <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                          Power Capacity
                        </div>
                        <div className="text-white text-xs">Operational MW</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-3 flex flex-col flex-1">
                    <div className="flex items-end justify-center gap-3 mb-2">
                      <div className="text-3xl font-bold text-slate-900 tracking-tight tabular-nums">
                        {mockProjectKPIs.operationalMW}
                      </div>
                      <div className="text-lg font-medium text-slate-400 pb-1">/ {mockProjectKPIs.targetMW} MW</div>
                    </div>
                    <div className="text-center text-sm text-slate-500 mb-2">Installed: {mockProjectKPIs.installedMW} MW</div>
                    <div className="relative w-full h-4 rounded-full overflow-hidden mt-auto">
                      <div className="absolute inset-0 bg-slate-200 rounded-full" />
                      <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] rounded-full" style={{ width: `${(mockProjectKPIs.operationalMW / mockProjectKPIs.targetMW) * 100}%` }} />
                    </div>
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-3 rounded-2xl overflow-hidden border border-slate-200 hover:border-[#8AFD81]/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8AFD81]/10 animate-fade-in-up delay-100 flex flex-col">
                  <div className="bg-slate-800 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-white" strokeWidth={1.5} />
                      <div>
                        <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                          Capex Spent
                        </div>
                        <div className="text-white text-xs">Budget utilization</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-3 flex flex-col flex-1">
                    <div className="flex items-end justify-center gap-3 mb-2">
                      <div className="text-3xl font-bold text-slate-900 tracking-tight tabular-nums">
                        ${(mockProjectKPIs.capexSpent / 1000000).toFixed(1)}M
                      </div>
                    </div>
                    <div className="text-center text-sm text-slate-500 mb-2">Budget: ${(mockProjectKPIs.capexBudget / 1000000).toFixed(0)}M</div>
                    <div className="relative w-full h-4 rounded-full overflow-hidden mt-auto">
                      <div className="absolute inset-0 bg-slate-200 rounded-full" />
                      <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" style={{ width: `${(mockProjectKPIs.capexSpent / mockProjectKPIs.capexBudget) * 100}%` }} />
                    </div>
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-3 rounded-2xl overflow-hidden border border-slate-700 hover:border-[#8AFD81]/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8AFD81]/10 animate-fade-in-up delay-100 flex flex-col bg-slate-900">
                  <div className="bg-slate-800 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-white" strokeWidth={1.5} />
                      <div>
                        <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                          Days to Target
                        </div>
                        <div className="text-slate-400 text-xs">{mockProject.targetDate}</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-end justify-center gap-3">
                      <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] tracking-tight tabular-nums">
                        {mockProjectKPIs.daysToTarget}
                      </div>
                      <div className="text-lg font-medium text-slate-400 pb-1">days</div>
                    </div>
                  </div>
                </div>

                {/* Section Title */}
                <div className="col-span-12 flex items-center gap-4 mt-4 mb-2">
                  <BarChart3 className="w-10 h-10 text-[#8AFD81]" strokeWidth={1.5} />
                  <h2 className="text-xl font-bold text-slate-900">Progress & Performance</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent"></div>
                </div>

                {/* Phase Status & Ramp-Up */}
                <div className="col-span-12 lg:col-span-4 rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300 animate-fade-in-up delay-300">
                  <div className="bg-slate-800 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-white" strokeWidth={1.5} />
                      <div>
                        <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                          Phase Status
                        </div>
                        <div className="text-slate-400 text-xs">{phaseStats.total} total phases</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-3">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-[#8AFD81]" />
                          <span className="text-sm font-medium text-slate-700">Completed</span>
                        </div>
                        <span className="text-lg font-bold text-slate-900">{phaseStats.done}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-blue-500" />
                          <span className="text-sm font-medium text-slate-700">In Progress</span>
                        </div>
                        <span className="text-lg font-bold text-slate-900">{phaseStats.inProgress}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-amber-500" />
                          <span className="text-sm font-medium text-slate-700">At Risk</span>
                        </div>
                        <span className="text-lg font-bold text-slate-900">{phaseStats.atRisk}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-red-500" />
                          <span className="text-sm font-medium text-slate-700">Blocked</span>
                        </div>
                        <span className="text-lg font-bold text-slate-900">{phaseStats.blocked}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-8 rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300 animate-fade-in-up delay-300">
                  <div className="bg-slate-800 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-white" strokeWidth={1.5} />
                        <div>
                          <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                            Ramp-Up Progress
                          </div>
                          <div className="text-slate-400 text-xs">Target vs Actual MW</div>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#8AFD81]/20 text-[#8AFD81] rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#8AFD81]/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8AFD81] animate-pulse" />
                        On Track
                      </span>
                    </div>
                  </div>
                  <div className="bg-white p-3">
                    <AdvancedBarChart
                      data={rampUpData}
                      bars={[
                        { dataKey: 'target', name: 'Target', color: '#e2e8f0' },
                        { dataKey: 'actual', name: 'Actual', color: '#8AFD81' },
                      ]}
                      xAxisKey="name"
                      height={220}
                      showGrid={true}
                      showLegend={true}
                    />
                  </div>
                </div>

                {/* All Phases Progress */}
                <div className="col-span-12 rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300 animate-fade-in-up delay-300">
                  <div className="bg-slate-800 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Layers className="w-5 h-5 text-white" strokeWidth={1.5} />
                      <div>
                        <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                          All Phases Progress
                        </div>
                        <div className="text-slate-400 text-xs">Detailed breakdown</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-3">
                    <div className="space-y-4">
                      {mockPhases.map(phase => (
                        <div key={phase.id}>
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
                </div>

                {/* Blockers & Activity */}
                <div className="col-span-12 lg:col-span-6 rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300 animate-fade-in-up delay-300">
                  <div className="bg-slate-800 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-white" strokeWidth={1.5} />
                        <div>
                          <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                            Active Blockers
                          </div>
                          <div className="text-slate-400 text-xs">Issues requiring attention</div>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-full border border-red-500/30">
                        {activeBlockers.length} Open
                      </span>
                    </div>
                  </div>
                  <div className="bg-white p-3">
                    <div className="space-y-3">
                      {activeBlockers.slice(0, 5).map(blocker => (
                        <div key={blocker.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
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
                </div>

                <div className="col-span-12 lg:col-span-6 rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300 animate-fade-in-up delay-300">
                  <div className="bg-slate-800 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Activity className="w-5 h-5 text-white" strokeWidth={1.5} />
                      <div>
                        <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                          Recent Activity
                        </div>
                        <div className="text-slate-400 text-xs">Latest updates</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-3">
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
                              {new Date(log.timestamp).toLocaleDateString('en-GB')} {new Date(log.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* CURRENT TAB */}
            {activeTab === 'current' && (
              <>
                {/* Current KPIs */}
                <div className="col-span-12 lg:col-span-3 rounded-2xl overflow-hidden border border-slate-200 hover:border-[#8AFD81]/50 transition-all duration-300 animate-fade-in-up delay-100 flex flex-col">
                  <div className="bg-slate-800 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-white" strokeWidth={1.5} />
                      <div>
                        <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                          Operational MW
                        </div>
                        <div className="text-white text-xs">Current capacity</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-3 flex flex-col flex-1">
                    <div className="flex items-end justify-center gap-3">
                      <div className="text-3xl font-bold text-slate-900 tracking-tight tabular-nums">{mockProjectKPIs.operationalMW}</div>
                      <div className="text-lg font-medium text-slate-400 pb-1">MW</div>
                    </div>
                    <div className="text-center text-sm text-[#8AFD81] font-medium mt-2">
                      {((mockProjectKPIs.operationalMW / mockProjectKPIs.targetMW) * 100).toFixed(0)}% of target
                    </div>
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-3 rounded-2xl overflow-hidden border border-slate-200 hover:border-[#8AFD81]/50 transition-all duration-300 animate-fade-in-up delay-100 flex flex-col">
                  <div className="bg-slate-800 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Activity className="w-5 h-5 text-white" strokeWidth={1.5} />
                      <div>
                        <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                          Hashrate
                        </div>
                        <div className="text-white text-xs">Network power</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-3 flex flex-col flex-1">
                    <div className="flex items-end justify-center gap-3">
                      <div className="text-3xl font-bold text-slate-900 tracking-tight tabular-nums">{mockProjectKPIs.totalHashrate}</div>
                      <div className="text-lg font-medium text-slate-400 pb-1">PH/s</div>
                    </div>
                    <div className="text-center text-sm text-[#8AFD81] font-medium mt-2">Excellent</div>
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-3 rounded-2xl overflow-hidden border border-slate-200 hover:border-[#8AFD81]/50 transition-all duration-300 animate-fade-in-up delay-100 flex flex-col">
                  <div className="bg-slate-800 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Settings className="w-5 h-5 text-white" strokeWidth={1.5} />
                      <div>
                        <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                          PUE
                        </div>
                        <div className="text-white text-xs">Efficiency ratio</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-3 flex flex-col flex-1">
                    <div className="flex items-end justify-center gap-3">
                      <div className="text-3xl font-bold text-slate-900 tracking-tight tabular-nums">{mockProjectKPIs.pue}</div>
                    </div>
                    <div className="text-center text-sm text-[#8AFD81] font-medium mt-2">Industry-leading</div>
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-3 rounded-2xl overflow-hidden border border-slate-200 hover:border-[#8AFD81]/50 transition-all duration-300 animate-fade-in-up delay-100 flex flex-col">
                  <div className="bg-slate-800 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-white" strokeWidth={1.5} />
                      <div>
                        <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                          Open Tickets
                        </div>
                        <div className="text-white text-xs">Support queue</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-3 flex flex-col flex-1">
                    <div className="flex items-end justify-center gap-3">
                      <div className="text-3xl font-bold text-slate-900 tracking-tight tabular-nums">{mockTickets.open}</div>
                      <div className="text-lg font-medium text-red-500 pb-1">({mockTickets.critical} critical)</div>
                    </div>
                    <div className="text-center text-sm text-slate-500 mt-2">Avg: {mockTickets.avgResolutionHours}h resolution</div>
                  </div>
                </div>

                {/* Power History Chart */}
                <div className="col-span-12 rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300 animate-fade-in-up delay-300">
                  <div className="bg-slate-800 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-white" strokeWidth={1.5} />
                        <div>
                          <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                            Power Consumption History
                          </div>
                          <div className="text-slate-400 text-xs">MW operational over time</div>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#8AFD81]/20 text-[#8AFD81] rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#8AFD81]/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8AFD81] animate-pulse" />
                        Live
                      </span>
                    </div>
                  </div>
                  <div className="bg-white p-3">
                    <AdvancedAreaChart
                      data={powerChartData}
                      areas={[{ dataKey: 'mw', name: 'Operational MW', color: '#8AFD81' }]}
                      xAxisKey="date"
                      height={300}
                      showGrid={true}
                      showLegend={false}
                      yAxisLabel="MW"
                    />
                  </div>
                </div>

                {/* Phases In Progress */}
                <div className="col-span-12 rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300 animate-fade-in-up delay-300">
                  <div className="bg-slate-800 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Layers className="w-5 h-5 text-white" strokeWidth={1.5} />
                      <div>
                        <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                          Phases In Progress
                        </div>
                        <div className="text-slate-400 text-xs">Active work streams</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-3">
                    <div className="space-y-4">
                      {mockPhases.filter(p => p.status === 'in_progress').map(phase => (
                        <div key={phase.id} className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-bold text-slate-900">{phase.title}</h4>
                              <p className="text-xs text-slate-500 mt-1">{phase.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-slate-900">{phase.progress}%</div>
                              <div className="text-xs text-slate-500">Owner: {phase.owner}</div>
                            </div>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${phase.progress}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Monthly Operations */}
                <div className="col-span-12 rounded-2xl overflow-hidden border border-slate-700 animate-fade-in-up delay-300 bg-slate-900">
                  <div className="bg-slate-800 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-white" strokeWidth={1.5} />
                      <div>
                        <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                          Monthly Operations
                        </div>
                        <div className="text-slate-400 text-xs">Financial overview</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-slate-400 text-xs uppercase mb-2">Opex Monthly</div>
                        <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80]">
                          ${(mockProjectKPIs.opexMonthly / 1000000).toFixed(1)}M
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-slate-400 text-xs uppercase mb-2">Tickets Resolved (7d)</div>
                        <div className="text-3xl font-bold text-white">{mockTickets.resolved7d}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-slate-400 text-xs uppercase mb-2">Avg Resolution</div>
                        <div className="text-3xl font-bold text-white">{mockTickets.avgResolutionHours}h</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* TO-BE TAB */}
            {activeTab === 'tobe' && (
              <>
                {/* Target Summary */}
                <div className="col-span-12 rounded-2xl overflow-hidden border border-slate-700 animate-fade-in-up delay-100 bg-slate-900">
                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-slate-400 text-xs uppercase tracking-wider mb-2">Target Capacity</div>
                        <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80]">{mockProject.targetMW} MW</div>
                      </div>
                      <div className="text-center">
                        <div className="text-slate-400 text-xs uppercase tracking-wider mb-2">Current</div>
                        <div className="text-3xl font-bold text-white">{mockProjectKPIs.operationalMW} MW</div>
                      </div>
                      <div className="text-center">
                        <div className="text-slate-400 text-xs uppercase tracking-wider mb-2">Remaining</div>
                        <div className="text-3xl font-bold text-amber-400">{mockProject.targetMW - mockProjectKPIs.operationalMW} MW</div>
                      </div>
                      <div className="text-center">
                        <div className="text-slate-400 text-xs uppercase tracking-wider mb-2">Target Date</div>
                        <div className="text-xl font-bold text-white">{mockProject.targetDate}</div>
                        <div className="text-sm text-[#8AFD81] mt-1">{mockProjectKPIs.daysToTarget} days remaining</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ramp-Up Roadmap */}
                <div className="col-span-12 rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300 animate-fade-in-up delay-300">
                  <div className="bg-slate-800 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-white" strokeWidth={1.5} />
                      <div>
                        <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                          Ramp-Up Roadmap
                        </div>
                        <div className="text-slate-400 text-xs">Milestone tracking</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-3">
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
                            {step.actualMW && (
                              <div className="flex justify-between">
                                <span className="text-slate-500">Achieved:</span>
                                <span className="font-bold text-emerald-600">{step.actualMW} MW</span>
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
                </div>

                {/* Pending Phases */}
                <div className="col-span-12 rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300 animate-fade-in-up delay-300">
                  <div className="bg-slate-800 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Layers className="w-5 h-5 text-white" strokeWidth={1.5} />
                      <div>
                        <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                          Pending & At-Risk Phases
                        </div>
                        <div className="text-slate-400 text-xs">Work remaining</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-3">
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
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* WAITING TAB */}
            {activeTab === 'waiting' && (
              <>
                {/* Blockers Summary */}
                <div className="col-span-12 lg:col-span-3 rounded-2xl overflow-hidden border border-red-200 bg-red-50 animate-fade-in-up delay-100">
                  <div className="p-6 text-center">
                    <div className="text-red-600 text-xs uppercase tracking-wider mb-2 font-semibold">Critical</div>
                    <div className="text-3xl font-bold text-red-700">{activeBlockers.filter(b => b.severity === 'critical').length}</div>
                  </div>
                </div>
                <div className="col-span-12 lg:col-span-3 rounded-2xl overflow-hidden border border-orange-200 bg-orange-50 animate-fade-in-up delay-100">
                  <div className="p-6 text-center">
                    <div className="text-orange-600 text-xs uppercase tracking-wider mb-2 font-semibold">High</div>
                    <div className="text-3xl font-bold text-orange-700">{activeBlockers.filter(b => b.severity === 'high').length}</div>
                  </div>
                </div>
                <div className="col-span-12 lg:col-span-3 rounded-2xl overflow-hidden border border-amber-200 bg-amber-50 animate-fade-in-up delay-100">
                  <div className="p-6 text-center">
                    <div className="text-amber-600 text-xs uppercase tracking-wider mb-2 font-semibold">Medium</div>
                    <div className="text-3xl font-bold text-amber-700">{activeBlockers.filter(b => b.severity === 'medium').length}</div>
                  </div>
                </div>
                <div className="col-span-12 lg:col-span-3 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 animate-fade-in-up delay-100">
                  <div className="p-6 text-center">
                    <div className="text-slate-500 text-xs uppercase tracking-wider mb-2 font-semibold">Low</div>
                    <div className="text-3xl font-bold text-slate-600">{activeBlockers.filter(b => b.severity === 'low').length}</div>
                  </div>
                </div>

                {/* Active Blockers List */}
                <div className="col-span-12 rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300 animate-fade-in-up delay-300">
                  <div className="bg-slate-800 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-white" strokeWidth={1.5} />
                      <div>
                        <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                          Active Blockers
                        </div>
                        <div className="text-slate-400 text-xs">Issues requiring resolution</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-3">
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
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Phases Requiring Attention */}
                <div className="col-span-12 rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300 animate-fade-in-up delay-300">
                  <div className="bg-slate-800 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-white" strokeWidth={1.5} />
                      <div>
                        <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AFD81] via-[#b6ffb0] to-[#4ade80] text-sm font-bold uppercase tracking-wider">
                          Phases Requiring Attention
                        </div>
                        <div className="text-slate-400 text-xs">At risk or blocked</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-3">
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
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
