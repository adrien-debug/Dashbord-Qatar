// ============================================================================
// PROJECT MONITORING - Master SOP Lifecycle Dashboard
// Bitcoin Mining Facility Governance Framework
// Color Palette: Grey, Green (#8AFD81), White only
// ============================================================================

import React, { useState } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Lightbulb, 
  PenTool, 
  Factory, 
  Rocket, 
  Zap, 
  RefreshCw,
  Briefcase,
  ClipboardList,
  Monitor,
  Settings,
  Lock,
  Unlock,
  FileText,
  CheckCircle,
  Circle,
  AlertTriangle,
  Clock,
  User,
  Info,
  HelpCircle,
  Activity,
  Layers,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { 
  Project, 
  Phase, 
  PhaseId, 
  DimensionId, 
  Status, 
  GateStatus,
} from '../types/sop';
import { mockSOPProject } from '../lib/mock-sop';

// ============================================================================
// COLOR PALETTE - Grey, Green, White only
// ============================================================================

const STATUS_COLORS_LOCAL: Record<Status, string> = {
  'not-started': '#94A3B8',
  'in-progress': '#64748B',
  'completed': '#8AFD81',
  'blocked': '#475569',
  'at-risk': '#64748B',
};

const GATE_STATUS_COLORS_LOCAL: Record<GateStatus, string> = {
  'passed': '#8AFD81',
  'pending': '#94A3B8',
  'blocked': '#475569',
  'not-applicable': '#CBD5E1',
};

// ============================================================================
// ICON MAPPINGS
// ============================================================================

const PhaseIcons: Record<PhaseId, React.ComponentType<any>> = {
  'strategic-intent': Target,
  'pre-conception': Lightbulb,
  'conception': PenTool,
  'industrialisation': Factory,
  'deployment': Rocket,
  'commissioning': Zap,
  'steady-state': RefreshCw,
};

const DimensionIcons: Record<DimensionId, React.ComponentType<any>> = {
  business: Briefcase,
  administrative: ClipboardList,
  technology: Monitor,
  engineering: Settings,
};

// ============================================================================
// TAB DEFINITIONS
// ============================================================================

type TabId = 'overview' | 'gates' | 'subsops';

const tabs: { id: TabId; label: string; icon: React.ComponentType<any> }[] = [
  { id: 'overview', label: 'Overview', icon: Layers },
  { id: 'gates', label: 'Validation Gates', icon: Lock },
  { id: 'subsops', label: 'Sub-SOPs', icon: FileText },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function Monitoring() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [selectedPhase, setSelectedPhase] = useState<PhaseId | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const project: Project = mockSOPProject;

  const currentPhaseData = project.phases.find(p => p.id === project.currentPhase);
  const displayPhase = selectedPhase 
    ? project.phases.find(p => p.id === selectedPhase)! 
    : currentPhaseData!;

  const completedPhases = project.phases.filter(p => p.status === 'completed').length;
  const passedGates = project.phases.filter(p => p.gate.status === 'passed').length;
  const pendingGates = project.phases.filter(p => p.gate.status === 'pending').length;
  const allSubSOPs = project.phases.flatMap(p => p.subSOPs);
  const completedSubSOPs = allSubSOPs.filter(s => s.status === 'completed').length;

  return (
    <>
      <Head>
        <title>Project Monitoring - Master SOP Lifecycle</title>
      </Head>

      <div className="min-h-screen bg-white">
        {/* Hero Header */}
        <div className="bg-slate-900 border-b border-slate-800">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-4 py-1.5 bg-[#8AFD81] text-slate-900 rounded-full text-[11px] font-bold uppercase tracking-widest">
                    Master SOP
                  </span>
                  <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">
                    Lifecycle Governance
                  </span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  {project.name}
                </h1>
                <p className="text-slate-400 text-sm flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-[#8AFD81]" />
                    {project.capacity}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span>{project.location}</span>
                  <span className="text-slate-600">•</span>
                  <span>Owner: {project.owner}</span>
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowHelp(!showHelp)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-700 transition-all text-sm font-medium"
                >
                  <HelpCircle className="w-4 h-4" />
                  Guide
                </button>
                <div className="px-6 py-3 bg-gradient-to-r from-[#8AFD81]/20 to-[#8AFD81]/5 border border-[#8AFD81]/30 rounded-xl">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-[#8AFD81]">{project.overallProgress}%</span>
                    <span className="text-slate-500 text-sm">Complete</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-2 mt-8">
              {tabs.map(tab => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      activeTab === tab.id
                        ? 'bg-[#8AFD81] text-slate-900 shadow-lg shadow-[#8AFD81]/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <TabIcon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-8">
          
          {/* Help Panel */}
          <AnimatePresence>
            {showHelp && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-gradient-to-r from-slate-50 to-white"
              >
                <div className="p-6 flex items-start gap-5">
                  <div className="p-3 bg-[#8AFD81]/20 rounded-xl">
                    <Info className="w-6 h-6 text-[#8AFD81]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">What is this dashboard?</h3>
                    <p className="text-slate-600 text-sm mb-5 leading-relaxed">
                      This dashboard tracks the lifecycle of your Bitcoin mining facility through 7 mandatory phases. 
                      Each phase must pass through a validation gate, and all 4 dimensions must be complete before proceeding.
                    </p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {(['business', 'administrative', 'technology', 'engineering'] as DimensionId[]).map(dim => {
                        const Icon = DimensionIcons[dim];
                        return (
                          <div key={dim} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
                            <Icon className="w-5 h-5 text-[#8AFD81]" />
                            <span className="text-slate-700 font-medium capitalize">{dim}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowHelp(false)}
                    className="text-slate-400 hover:text-slate-600 text-xl font-light"
                  >
                    ×
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Section: Lifecycle Progress */}
                <section>
                  <div className="flex items-center gap-4 mb-6">
                    <Activity className="w-6 h-6 text-[#8AFD81]" strokeWidth={1.5} />
                    <h2 className="text-2xl font-bold text-slate-900">Lifecycle Progress</h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
                  </div>

                  {/* Timeline Card */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-slate-800 px-8 py-4 flex items-center justify-between">
                      <span className="text-white font-semibold text-lg">7 Phases Timeline</span>
                      <span className="text-slate-400 text-sm">
                        {completedPhases} of {project.phases.length} phases completed
                      </span>
                    </div>
                    <div className="p-8 lg:p-10">
                      {/* Timeline */}
                      <div className="relative">
                        {/* Progress Line */}
                        <div className="absolute top-8 left-8 right-8 h-1 bg-slate-100 rounded-full" />
                        <div 
                          className="absolute top-8 left-8 h-1 rounded-full transition-all duration-700"
                          style={{ 
                            width: `calc(${(completedPhases / (project.phases.length - 1)) * 100}% - 64px)`,
                            background: 'linear-gradient(90deg, #8AFD81, #6ee667)'
                          }}
                        />
                        
                        {/* Phase Nodes */}
                        <div className="relative flex justify-between px-0">
                          {project.phases.map((phase, idx) => {
                            const PhaseIcon = PhaseIcons[phase.id];
                            const isActive = phase.id === project.currentPhase;
                            const isCompleted = phase.status === 'completed';
                            const isSelected = phase.id === selectedPhase;
                            
                            return (
                              <button
                                key={phase.id}
                                onClick={() => setSelectedPhase(phase.id === selectedPhase ? null : phase.id)}
                                className={`flex flex-col items-center group transition-all duration-300 ${
                                  isSelected ? 'scale-110' : 'hover:scale-105'
                                }`}
                              >
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 border-2 ${
                                  isCompleted 
                                    ? 'bg-[#8AFD81] border-[#8AFD81] text-slate-900 shadow-lg shadow-[#8AFD81]/30' 
                                    : isActive 
                                      ? 'bg-slate-800 border-slate-700 text-white shadow-lg' 
                                      : 'bg-white border-slate-200 text-slate-400 group-hover:border-slate-300 group-hover:shadow-md'
                                }`}>
                                  {isCompleted ? (
                                    <CheckCircle className="w-7 h-7" />
                                  ) : (
                                    <PhaseIcon className="w-6 h-6" />
                                  )}
                                </div>
                                <span className={`mt-4 text-sm font-medium text-center max-w-[90px] leading-tight ${
                                  isActive ? 'text-slate-900' : isCompleted ? 'text-[#22c55e]' : 'text-slate-500'
                                }`}>
                                  {phase.shortName}
                                </span>
                                <div className={`mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  isCompleted ? 'bg-[#8AFD81]/20 text-[#22c55e]' : 'bg-slate-100 text-slate-500'
                                }`}>
                                  {phase.completionPercent}%
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section: Current Phase Details */}
                <section>
                  <div className="flex items-center gap-4 mb-6">
                    <Layers className="w-6 h-6 text-[#8AFD81]" strokeWidth={1.5} />
                    <h2 className="text-2xl font-bold text-slate-900">Current Phase Details</h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
                  </div>

                  <div className="grid grid-cols-12 gap-6">
                    {/* Phase Details Card */}
                    <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="bg-slate-800 px-8 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {(() => {
                            const PhaseIcon = PhaseIcons[displayPhase.id];
                            return <PhaseIcon className="w-6 h-6 text-[#8AFD81]" />;
                          })()}
                          <div>
                            <span className="text-white font-semibold text-lg">{displayPhase.name}</span>
                            <p className="text-slate-400 text-sm">{displayPhase.description}</p>
                          </div>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                          displayPhase.status === 'completed' ? 'bg-[#8AFD81]/20 text-[#8AFD81]' :
                          'bg-slate-700 text-slate-300'
                        }`}>
                          {displayPhase.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="p-8">
                        {/* Dimensions Grid */}
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">4 Mandatory Dimensions</h3>
                        <div className="grid grid-cols-2 gap-5">
                          {(['business', 'administrative', 'technology', 'engineering'] as DimensionId[]).map(dimId => {
                            const dim = displayPhase.dimensions[dimId];
                            const DimIcon = DimensionIcons[dimId];
                            const isComplete = dim.completionPercent === 100;
                            return (
                              <div 
                                key={dimId}
                                className={`rounded-xl p-5 border-2 transition-all ${
                                  isComplete 
                                    ? 'bg-[#8AFD81]/5 border-[#8AFD81]/30' 
                                    : 'bg-slate-50 border-slate-100'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${isComplete ? 'bg-[#8AFD81]/20' : 'bg-white'}`}>
                                      <DimIcon className={`w-5 h-5 ${isComplete ? 'text-[#22c55e]' : 'text-slate-400'}`} />
                                    </div>
                                    <span className="text-slate-900 font-semibold capitalize">{dimId}</span>
                                  </div>
                                  <span className={`text-lg font-bold ${
                                    isComplete ? 'text-[#22c55e]' : 'text-slate-600'
                                  }`}>
                                    {dim.completionPercent}%
                                  </span>
                                </div>
                                <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full rounded-full transition-all duration-700"
                                    style={{ 
                                      width: `${dim.completionPercent}%`,
                                      background: isComplete 
                                        ? 'linear-gradient(90deg, #8AFD81, #6ee667)' 
                                        : 'linear-gradient(90deg, #64748B, #94A3B8)'
                                    }}
                                  />
                                </div>
                                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  <span>{dim.criteria.filter(c => c.completed).length} of {dim.criteria.length} criteria met</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Gate Status Card */}
                    <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="bg-slate-800 px-6 py-4 flex items-center gap-3">
                        {displayPhase.gate.status === 'passed' ? (
                          <Unlock className="w-6 h-6 text-[#8AFD81]" />
                        ) : (
                          <Lock className="w-6 h-6 text-slate-400" />
                        )}
                        <span className="text-white font-semibold text-lg">Validation Gate</span>
                      </div>
                      <div className="p-6">
                        <div className={`p-5 rounded-xl border-2 ${
                          displayPhase.gate.status === 'passed' 
                            ? 'bg-[#8AFD81]/5 border-[#8AFD81]/30' 
                            : 'bg-slate-50 border-slate-100'
                        }`}>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-slate-900 font-semibold">{displayPhase.gate.name}</span>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                              displayPhase.gate.status === 'passed' ? 'bg-[#8AFD81]/20 text-[#22c55e]' :
                              'bg-slate-200 text-slate-600'
                            }`}>
                              {displayPhase.gate.status}
                            </span>
                          </div>
                          <p className="text-slate-500 text-sm mb-5">{displayPhase.gate.description}</p>
                          
                          {/* Gate Criteria */}
                          <div className="space-y-2.5">
                            {displayPhase.gate.criteria.map((criterion) => (
                              <div key={criterion.id} className="flex items-center gap-3">
                                {criterion.completed ? (
                                  <CheckCircle className="w-5 h-5 text-[#8AFD81]" />
                                ) : (
                                  <Circle className="w-5 h-5 text-slate-300" />
                                )}
                                <span className={`text-sm ${criterion.completed ? 'text-slate-700' : 'text-slate-400'}`}>
                                  {criterion.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-4 mt-5">
                          <div className="bg-[#8AFD81]/10 rounded-xl p-4 text-center border border-[#8AFD81]/20">
                            <div className="text-3xl font-bold text-[#22c55e]">{passedGates}</div>
                            <div className="text-xs text-slate-600 uppercase font-medium mt-1">Passed</div>
                          </div>
                          <div className="bg-slate-100 rounded-xl p-4 text-center border border-slate-200">
                            <div className="text-3xl font-bold text-slate-600">{pendingGates}</div>
                            <div className="text-xs text-slate-500 uppercase font-medium mt-1">Pending</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section: Sub-SOPs */}
                <section>
                  <div className="flex items-center gap-4 mb-6">
                    <FileText className="w-6 h-6 text-[#8AFD81]" strokeWidth={1.5} />
                    <h2 className="text-2xl font-bold text-slate-900">Sub-SOPs for {displayPhase.shortName}</h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-slate-800 px-8 py-4">
                      <span className="text-white font-semibold text-lg">Required Documents</span>
                    </div>
                    <div className="p-8">
                      {displayPhase.subSOPs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                          {displayPhase.subSOPs.map((sop) => {
                            const SopIcon = DimensionIcons[sop.dimension];
                            const isComplete = sop.status === 'completed';
                            return (
                              <div 
                                key={sop.id}
                                className={`rounded-xl p-5 border-2 transition-all hover:shadow-md ${
                                  isComplete 
                                    ? 'bg-[#8AFD81]/5 border-[#8AFD81]/30' 
                                    : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <SopIcon className="w-4 h-4 text-slate-400" />
                                    <code className="text-xs text-[#22c55e] font-mono bg-[#8AFD81]/10 px-2 py-1 rounded">{sop.code}</code>
                                  </div>
                                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                    isComplete ? 'bg-[#8AFD81]/20 text-[#22c55e]' : 'bg-slate-200 text-slate-600'
                                  }`}>
                                    {sop.status.replace('-', ' ')}
                                  </span>
                                </div>
                                <h4 className="text-slate-900 font-semibold mb-2">{sop.name}</h4>
                                <p className="text-slate-500 text-sm mb-4 line-clamp-2">{sop.description}</p>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs text-slate-500">Progress</span>
                                  <span className={`text-sm font-bold ${isComplete ? 'text-[#22c55e]' : 'text-slate-600'}`}>
                                    {sop.completionPercent}%
                                  </span>
                                </div>
                                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full rounded-full"
                                    style={{ 
                                      width: `${sop.completionPercent}%`,
                                      background: isComplete 
                                        ? 'linear-gradient(90deg, #8AFD81, #6ee667)' 
                                        : 'linear-gradient(90deg, #64748B, #94A3B8)'
                                    }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-slate-400">
                          <FileText className="w-16 h-16 mx-auto mb-4 text-slate-200" />
                          <p className="text-lg">No sub-SOPs for this phase</p>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              </motion.div>
            )}

            {activeTab === 'gates' && (
              <motion.div
                key="gates"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Section: Gates Summary */}
                <section>
                  <div className="flex items-center gap-4 mb-6">
                    <Lock className="w-6 h-6 text-[#8AFD81]" strokeWidth={1.5} />
                    <h2 className="text-2xl font-bold text-slate-900">All Validation Gates</h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-slate-800 px-8 py-4">
                      <span className="text-white font-semibold text-lg">Gates Status Summary</span>
                    </div>
                    <div className="p-8">
                      <div className="grid grid-cols-4 gap-6">
                        {[
                          { label: 'Passed', value: passedGates, color: '#8AFD81', icon: Unlock },
                          { label: 'Pending', value: pendingGates, color: '#94A3B8', icon: Clock },
                          { label: 'Blocked', value: project.phases.filter(p => p.gate.status === 'blocked').length, color: '#475569', icon: AlertTriangle },
                          { label: 'N/A', value: project.phases.filter(p => p.gate.status === 'not-applicable').length, color: '#CBD5E1', icon: Circle },
                        ].map((stat) => {
                          const StatIcon = stat.icon;
                          return (
                            <div 
                              key={stat.label}
                              className="bg-slate-50 rounded-xl p-6 border border-slate-100 text-center"
                            >
                              <StatIcon className="w-8 h-8 mx-auto mb-3" style={{ color: stat.color }} />
                              <div className="text-4xl font-bold text-slate-900 mb-1">{stat.value}</div>
                              <div className="text-sm text-slate-500 uppercase tracking-wider font-medium">{stat.label}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section: Gates by Phase */}
                <section>
                  <div className="flex items-center gap-4 mb-6">
                    <Activity className="w-6 h-6 text-[#8AFD81]" strokeWidth={1.5} />
                    <h2 className="text-2xl font-bold text-slate-900">Gates by Phase</h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {project.phases.map((phase) => {
                      const PhaseIcon = PhaseIcons[phase.id];
                      const isPassed = phase.gate.status === 'passed';
                      return (
                        <div 
                          key={phase.gate.id}
                          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                        >
                          <div className="bg-slate-800 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <PhaseIcon className="w-6 h-6 text-[#8AFD81]" />
                              <div>
                                <div className="text-white font-semibold">{phase.gate.name}</div>
                                <div className="text-slate-400 text-sm">{phase.name}</div>
                              </div>
                            </div>
                            <span 
                              className="px-3 py-1.5 rounded-full text-xs font-bold uppercase"
                              style={{ 
                                backgroundColor: `${GATE_STATUS_COLORS_LOCAL[phase.gate.status]}20`,
                                color: GATE_STATUS_COLORS_LOCAL[phase.gate.status],
                              }}
                            >
                              {phase.gate.status}
                            </span>
                          </div>
                          
                          <div className="p-6">
                            <p className="text-slate-500 text-sm mb-5">{phase.gate.description}</p>
                            
                            <div className="space-y-2.5">
                              {phase.gate.criteria.map((criterion) => (
                                <div key={criterion.id} className="flex items-center gap-3">
                                  {criterion.completed ? (
                                    <CheckCircle className="w-5 h-5 text-[#8AFD81]" />
                                  ) : (
                                    <Circle className="w-5 h-5 text-slate-300" />
                                  )}
                                  <span className={`text-sm ${criterion.completed ? 'text-slate-700' : 'text-slate-400'}`}>
                                    {criterion.label}
                                  </span>
                                </div>
                              ))}
                            </div>
                            
                            <div className="mt-5 pt-5 border-t border-slate-100">
                              <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-slate-500">Progress</span>
                                <span className="text-slate-900 font-semibold">
                                  {phase.gate.criteria.filter(c => c.completed).length} of {phase.gate.criteria.length}
                                </span>
                              </div>
                              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full rounded-full"
                                  style={{ 
                                    width: `${(phase.gate.criteria.filter(c => c.completed).length / phase.gate.criteria.length) * 100}%`,
                                    backgroundColor: GATE_STATUS_COLORS_LOCAL[phase.gate.status],
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </motion.div>
            )}

            {activeTab === 'subsops' && (
              <motion.div
                key="subsops"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Section: All Sub-SOPs */}
                <section>
                  <div className="flex items-center gap-4 mb-6">
                    <FileText className="w-6 h-6 text-[#8AFD81]" strokeWidth={1.5} />
                    <h2 className="text-2xl font-bold text-slate-900">All Sub-SOP Documents</h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
                  </div>

                  {/* Summary Card */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
                    <div className="bg-slate-800 px-8 py-4 flex items-center justify-between">
                      <span className="text-white font-semibold text-lg">Document Status</span>
                      <span className="text-slate-400 text-sm">
                        <span className="text-[#8AFD81] font-bold text-lg">{completedSubSOPs}</span> of {allSubSOPs.length} completed
                      </span>
                    </div>
                    <div className="p-6">
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full"
                          style={{ 
                            width: `${(completedSubSOPs / allSubSOPs.length) * 100}%`,
                            background: 'linear-gradient(90deg, #8AFD81, #6ee667)'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sub-SOPs Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allSubSOPs.map((sop) => {
                      const SopIcon = DimensionIcons[sop.dimension];
                      const isComplete = sop.status === 'completed';
                      return (
                        <div 
                          key={sop.id}
                          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all"
                        >
                          <div className="bg-slate-800 px-5 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <SopIcon className="w-4 h-4 text-[#8AFD81]" />
                              <code className="text-xs text-[#8AFD81] font-mono">{sop.code}</code>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              isComplete ? 'bg-[#8AFD81]/20 text-[#8AFD81]' : 'bg-slate-700 text-slate-300'
                            }`}>
                              {sop.status.replace('-', ' ')}
                            </span>
                          </div>
                          
                          <div className="p-5">
                            <h4 className="text-slate-900 font-semibold mb-2">{sop.name}</h4>
                            <p className="text-slate-500 text-sm mb-5 line-clamp-2">{sop.description}</p>
                            
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-slate-500">Progress</span>
                              <span className={`text-sm font-bold ${isComplete ? 'text-[#22c55e]' : 'text-slate-600'}`}>
                                {sop.completionPercent}%
                              </span>
                            </div>
                            
                            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full transition-all"
                                style={{ 
                                  width: `${sop.completionPercent}%`,
                                  backgroundColor: STATUS_COLORS_LOCAL[sop.status],
                                }}
                              />
                            </div>
                            
                            {sop.owner && (
                              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-sm text-slate-500">
                                <User className="w-4 h-4" />
                                <span>{sop.owner}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
