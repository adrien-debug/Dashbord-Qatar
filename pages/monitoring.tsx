// ============================================================================
// PROJECT MONITORING - Master SOP Lifecycle Dashboard
// Bitcoin Mining Facility Governance Framework
// ============================================================================

import React, { useState, useMemo } from 'react';
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
  ChevronRight,
  Info,
  HelpCircle,
  Activity,
  Layers,
  BarChart3,
  TrendingUp,
} from 'lucide-react';
import { 
  Project, 
  Phase, 
  PhaseId, 
  DimensionId, 
  Status, 
  GateStatus,
  STATUS_COLORS, 
  GATE_STATUS_COLORS,
} from '../types/sop';
import { mockSOPProject } from '../lib/mock-sop';

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

  // Use mock data
  const project: Project = mockSOPProject;

  // Get current phase data
  const currentPhaseData = project.phases.find(p => p.id === project.currentPhase);
  const displayPhase = selectedPhase 
    ? project.phases.find(p => p.id === selectedPhase)! 
    : currentPhaseData!;

  // Calculate statistics
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

      <div className="min-h-screen bg-slate-50 p-4 lg:p-6">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-12 gap-4">

            {/* Header Card */}
            <div className="col-span-12 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
              <div className="bg-slate-800 px-6 py-4">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-[#8AFD81] text-slate-900 rounded-full text-[10px] font-bold uppercase tracking-widest">
                        Master SOP
                      </span>
                      <span className="text-slate-400 text-xs font-medium uppercase tracking-widest">
                        Lifecycle Governance
                      </span>
                    </div>
                    <h1 className="text-2xl font-bold text-white">
                      {project.name}
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                      {project.capacity} | {project.location} | Owner: {project.owner}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setShowHelp(!showHelp)}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-700 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-600 transition-all text-sm font-medium"
                    >
                      <HelpCircle className="w-4 h-4" />
                      Guide
                    </button>
                    <div className="px-4 py-2 bg-[#8AFD81]/20 border border-[#8AFD81]/30 rounded-lg">
                      <span className="text-[#8AFD81] text-sm font-bold">{project.overallProgress}%</span>
                      <span className="text-slate-400 text-xs ml-2">Complete</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4">
                {/* Tab Navigation */}
                <div className="flex items-center gap-2">
                  {tabs.map(tab => {
                    const TabIcon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          activeTab === tab.id
                            ? 'bg-slate-900 text-white shadow-md'
                            : 'text-slate-600 hover:bg-slate-100'
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

            {/* Help Panel */}
            <AnimatePresence>
              {showHelp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="col-span-12 rounded-2xl overflow-hidden border border-slate-200 shadow-sm"
                >
                  <div className="bg-slate-800 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Info className="w-5 h-5 text-[#8AFD81]" />
                      <span className="text-white font-semibold">What is this dashboard?</span>
                    </div>
                  </div>
                  <div className="bg-white p-6">
                    <p className="text-slate-600 text-sm mb-4">
                      This dashboard tracks the lifecycle of your Bitcoin mining facility through 7 mandatory phases. 
                      Each phase must pass through a validation gate, and all 4 dimensions (Business, Administrative, 
                      Technology, Engineering) must be complete before proceeding.
                    </p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {(['business', 'administrative', 'technology', 'engineering'] as DimensionId[]).map(dim => {
                        const Icon = DimensionIcons[dim];
                        return (
                          <div key={dim} className="flex items-center gap-2 text-sm">
                            <Icon className="w-4 h-4 text-[#8AFD81]" />
                            <span className="text-slate-700 capitalize">{dim}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  className="col-span-12 grid grid-cols-12 gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {/* Section Title - Lifecycle Progress */}
                  <div className="col-span-12 flex items-center gap-4 mt-4 mb-2">
                    <Activity className="w-6 h-6 text-[#8AFD81]" strokeWidth={1.5} />
                    <h2 className="text-2xl font-bold text-slate-900">Lifecycle Progress</h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent" />
                  </div>

                  {/* Phase Timeline Card */}
                  <div className="col-span-12 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                    <div className="bg-slate-800 px-6 py-3">
                      <span className="text-white font-semibold">7 Phases Timeline</span>
                    </div>
                    <div className="bg-white p-6">
                      {/* Timeline */}
                      <div className="relative">
                        {/* Progress Line */}
                        <div className="absolute top-6 left-0 right-0 h-1 bg-slate-200 rounded-full" />
                        <div 
                          className="absolute top-6 left-0 h-1 bg-[#8AFD81] rounded-full transition-all duration-500"
                          style={{ width: `${(completedPhases / project.phases.length) * 100}%` }}
                        />
                        
                        {/* Phase Nodes */}
                        <div className="relative flex justify-between">
                          {project.phases.map((phase, idx) => {
                            const PhaseIcon = PhaseIcons[phase.id];
                            const isActive = phase.id === project.currentPhase;
                            const isCompleted = phase.status === 'completed';
                            const isSelected = phase.id === selectedPhase;
                            
                            return (
                              <button
                                key={phase.id}
                                onClick={() => setSelectedPhase(phase.id === selectedPhase ? null : phase.id)}
                                className={`flex flex-col items-center group transition-all ${
                                  isSelected ? 'scale-110' : ''
                                }`}
                              >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all border-2 ${
                                  isCompleted 
                                    ? 'bg-[#8AFD81] border-[#8AFD81] text-slate-900' 
                                    : isActive 
                                      ? 'bg-blue-500 border-blue-500 text-white ring-4 ring-blue-100' 
                                      : 'bg-white border-slate-300 text-slate-400 group-hover:border-slate-400'
                                }`}>
                                  {isCompleted ? (
                                    <CheckCircle className="w-6 h-6" />
                                  ) : (
                                    <PhaseIcon className="w-5 h-5" />
                                  )}
                                </div>
                                <span className={`mt-3 text-xs font-medium text-center max-w-[80px] ${
                                  isActive ? 'text-blue-600' : isCompleted ? 'text-[#22c55e]' : 'text-slate-500'
                                }`}>
                                  {phase.shortName}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  {phase.completionPercent}%
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section Title - Current Phase */}
                  <div className="col-span-12 flex items-center gap-4 mt-6 mb-2">
                    <Layers className="w-6 h-6 text-[#8AFD81]" strokeWidth={1.5} />
                    <h2 className="text-2xl font-bold text-slate-900">Current Phase Details</h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent" />
                  </div>

                  {/* Current Phase Details Card */}
                  <div className="col-span-12 lg:col-span-8 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                    <div className="bg-slate-800 px-6 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {(() => {
                          const PhaseIcon = PhaseIcons[displayPhase.id];
                          return <PhaseIcon className="w-5 h-5 text-[#8AFD81]" />;
                        })()}
                        <span className="text-white font-semibold">{displayPhase.name}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        displayPhase.status === 'completed' ? 'bg-[#8AFD81]/20 text-[#8AFD81]' :
                        displayPhase.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                        displayPhase.status === 'at-risk' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-slate-600/50 text-slate-300'
                      }`}>
                        {displayPhase.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="bg-white p-6">
                      <p className="text-slate-500 text-sm mb-6">{displayPhase.description}</p>

                      {/* Dimensions Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        {(['business', 'administrative', 'technology', 'engineering'] as DimensionId[]).map(dimId => {
                          const dim = displayPhase.dimensions[dimId];
                          const DimIcon = DimensionIcons[dimId];
                          return (
                            <div 
                              key={dimId}
                              className="bg-slate-50 rounded-xl p-4 border border-slate-200"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <DimIcon className="w-4 h-4 text-[#8AFD81]" />
                                  <span className="text-slate-900 text-sm font-medium capitalize">{dimId}</span>
                                </div>
                                <span className={`text-xs font-bold ${
                                  dim.completionPercent === 100 ? 'text-[#22c55e]' : 
                                  dim.completionPercent > 50 ? 'text-blue-600' : 'text-slate-500'
                                }`}>
                                  {dim.completionPercent}%
                                </span>
                              </div>
                              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full rounded-full transition-all duration-500"
                                  style={{ 
                                    width: `${dim.completionPercent}%`,
                                    backgroundColor: dim.completionPercent === 100 ? '#8AFD81' : '#3B82F6'
                                  }}
                                />
                              </div>
                              <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-500">
                                <CheckCircle className="w-3 h-3" />
                                {dim.criteria.filter(c => c.completed).length}/{dim.criteria.length} criteria
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Gate Status Card */}
                  <div className="col-span-12 lg:col-span-4 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                    <div className="bg-slate-800 px-6 py-3 flex items-center gap-2">
                      {displayPhase.gate.status === 'passed' ? (
                        <Unlock className="w-5 h-5 text-[#8AFD81]" />
                      ) : (
                        <Lock className="w-5 h-5 text-orange-400" />
                      )}
                      <span className="text-white font-semibold">Validation Gate</span>
                    </div>
                    <div className="bg-white p-6">
                      <div className={`p-4 rounded-xl border ${
                        displayPhase.gate.status === 'passed' 
                          ? 'bg-[#8AFD81]/10 border-[#8AFD81]/30' 
                          : displayPhase.gate.status === 'pending'
                            ? 'bg-orange-50 border-orange-200'
                            : 'bg-slate-50 border-slate-200'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-slate-900 text-sm font-medium">{displayPhase.gate.name}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            displayPhase.gate.status === 'passed' ? 'bg-[#8AFD81]/20 text-[#22c55e]' :
                            displayPhase.gate.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                            'bg-slate-200 text-slate-600'
                          }`}>
                            {displayPhase.gate.status}
                          </span>
                        </div>
                        <p className="text-slate-500 text-xs mb-4">{displayPhase.gate.description}</p>
                        
                        {/* Gate Criteria */}
                        <div className="space-y-2">
                          {displayPhase.gate.criteria.map((criterion, idx) => (
                            <div key={criterion.id} className="flex items-center gap-2">
                              {criterion.completed ? (
                                <CheckCircle className="w-4 h-4 text-[#8AFD81]" />
                              ) : (
                                <Circle className="w-4 h-4 text-slate-300" />
                              )}
                              <span className={`text-xs ${criterion.completed ? 'text-slate-700' : 'text-slate-400'}`}>
                                {criterion.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="bg-slate-50 rounded-lg p-3 text-center border border-slate-200">
                          <div className="text-2xl font-bold text-[#22c55e]">{passedGates}</div>
                          <div className="text-[10px] text-slate-500 uppercase">Gates Passed</div>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3 text-center border border-slate-200">
                          <div className="text-2xl font-bold text-orange-500">{pendingGates}</div>
                          <div className="text-[10px] text-slate-500 uppercase">Pending</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section Title - Sub-SOPs */}
                  <div className="col-span-12 flex items-center gap-4 mt-6 mb-2">
                    <FileText className="w-6 h-6 text-[#8AFD81]" strokeWidth={1.5} />
                    <h2 className="text-2xl font-bold text-slate-900">Sub-SOPs for {displayPhase.shortName}</h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent" />
                  </div>

                  {/* Sub-SOPs Card */}
                  <div className="col-span-12 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                    <div className="bg-slate-800 px-6 py-3">
                      <span className="text-white font-semibold">Required Documents</span>
                    </div>
                    <div className="bg-white p-6">
                      {displayPhase.subSOPs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {displayPhase.subSOPs.map((sop, idx) => {
                            const SopIcon = DimensionIcons[sop.dimension];
                            return (
                              <div 
                                key={sop.id}
                                className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-[#8AFD81] transition-all"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <SopIcon className="w-4 h-4 text-slate-500" />
                                    <code className="text-[10px] text-[#22c55e] font-mono bg-[#8AFD81]/10 px-2 py-0.5 rounded">{sop.code}</code>
                                  </div>
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    sop.status === 'completed' ? 'bg-[#8AFD81]/20 text-[#22c55e]' :
                                    sop.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                                    'bg-slate-200 text-slate-500'
                                  }`}>
                                    {sop.status.replace('-', ' ')}
                                  </span>
                                </div>
                                <h4 className="text-slate-900 text-sm font-medium mb-1">{sop.name}</h4>
                                <p className="text-slate-500 text-xs mb-3 line-clamp-2">{sop.description}</p>
                                <div className="flex items-center justify-between">
                                  <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden mr-3">
                                    <div 
                                      className="h-full rounded-full"
                                      style={{ 
                                        width: `${sop.completionPercent}%`,
                                        backgroundColor: sop.status === 'completed' ? '#8AFD81' : '#3B82F6'
                                      }}
                                    />
                                  </div>
                                  <span className="text-xs text-slate-600 font-medium">{sop.completionPercent}%</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-slate-500">
                          <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                          <p className="text-sm">No sub-SOPs for this phase</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'gates' && (
                <motion.div
                  key="gates"
                  className="col-span-12 grid grid-cols-12 gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {/* Section Title - All Validation Gates */}
                  <div className="col-span-12 flex items-center gap-4 mt-4 mb-2">
                    <Lock className="w-6 h-6 text-[#8AFD81]" strokeWidth={1.5} />
                    <h2 className="text-2xl font-bold text-slate-900">All Validation Gates</h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent" />
                  </div>

                  {/* Gates Summary Card */}
                  <div className="col-span-12 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                    <div className="bg-slate-800 px-6 py-3">
                      <span className="text-white font-semibold">Gates Status Summary</span>
                    </div>
                    <div className="bg-white p-6">
                      <div className="grid grid-cols-4 gap-4">
                        {[
                          { label: 'Passed', value: passedGates, color: '#8AFD81', icon: Unlock },
                          { label: 'Pending', value: pendingGates, color: '#F59E0B', icon: Clock },
                          { label: 'Blocked', value: project.phases.filter(p => p.gate.status === 'blocked').length, color: '#EF4444', icon: AlertTriangle },
                          { label: 'N/A', value: project.phases.filter(p => p.gate.status === 'not-applicable').length, color: '#94A3B8', icon: Circle },
                        ].map((stat) => {
                          const StatIcon = stat.icon;
                          return (
                            <div 
                              key={stat.label}
                              className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-center"
                            >
                              <StatIcon className="w-6 h-6 mx-auto mb-2" style={{ color: stat.color }} />
                              <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                              <div className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Section Title - Gates by Phase */}
                  <div className="col-span-12 flex items-center gap-4 mt-6 mb-2">
                    <Activity className="w-6 h-6 text-[#8AFD81]" strokeWidth={1.5} />
                    <h2 className="text-2xl font-bold text-slate-900">Gates by Phase</h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent" />
                  </div>

                  {/* All Gates */}
                  {project.phases.map((phase, idx) => {
                    const PhaseIcon = PhaseIcons[phase.id];
                    return (
                      <div 
                        key={phase.gate.id}
                        className="col-span-12 lg:col-span-6 rounded-2xl overflow-hidden border border-slate-200 shadow-sm"
                      >
                        <div className="bg-slate-800 px-4 py-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <PhaseIcon className="w-5 h-5 text-[#8AFD81]" />
                            <div>
                              <div className="text-white text-sm font-semibold">{phase.gate.name}</div>
                              <div className="text-slate-400 text-xs">{phase.name}</div>
                            </div>
                          </div>
                          <span 
                            className="px-2 py-1 rounded text-[10px] font-bold uppercase"
                            style={{ 
                              backgroundColor: `${GATE_STATUS_COLORS[phase.gate.status]}20`,
                              color: GATE_STATUS_COLORS[phase.gate.status],
                            }}
                          >
                            {phase.gate.status}
                          </span>
                        </div>
                        
                        <div className="bg-white p-4">
                          <p className="text-slate-500 text-xs mb-4">{phase.gate.description}</p>
                          
                          <div className="space-y-2">
                            {phase.gate.criteria.map((criterion) => (
                              <div key={criterion.id} className="flex items-center gap-2">
                                {criterion.completed ? (
                                  <CheckCircle className="w-4 h-4 text-[#8AFD81]" />
                                ) : (
                                  <Circle className="w-4 h-4 text-slate-300" />
                                )}
                                <span className={`text-xs ${criterion.completed ? 'text-slate-700' : 'text-slate-400'}`}>
                                  {criterion.label}
                                </span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-slate-200">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-500">Progress</span>
                              <span className="text-slate-900 font-medium">
                                {phase.gate.criteria.filter(c => c.completed).length}/{phase.gate.criteria.length}
                              </span>
                            </div>
                            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mt-2">
                              <div 
                                className="h-full rounded-full"
                                style={{ 
                                  width: `${(phase.gate.criteria.filter(c => c.completed).length / phase.gate.criteria.length) * 100}%`,
                                  backgroundColor: GATE_STATUS_COLORS[phase.gate.status],
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}

              {activeTab === 'subsops' && (
                <motion.div
                  key="subsops"
                  className="col-span-12 grid grid-cols-12 gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {/* Section Title - All Sub-SOPs */}
                  <div className="col-span-12 flex items-center gap-4 mt-4 mb-2">
                    <FileText className="w-6 h-6 text-[#8AFD81]" strokeWidth={1.5} />
                    <h2 className="text-2xl font-bold text-slate-900">All Sub-SOP Documents</h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent" />
                  </div>

                  {/* Summary Card */}
                  <div className="col-span-12 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                    <div className="bg-slate-800 px-6 py-3 flex items-center justify-between">
                      <span className="text-white font-semibold">Document Status</span>
                      <span className="text-slate-400 text-sm">
                        <span className="text-[#8AFD81] font-bold">{completedSubSOPs}</span> / {allSubSOPs.length} completed
                      </span>
                    </div>
                    <div className="bg-white p-4">
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#8AFD81] rounded-full"
                          style={{ width: `${(completedSubSOPs / allSubSOPs.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sub-SOPs Grid */}
                  {allSubSOPs.length > 0 ? (
                    allSubSOPs.map((sop, idx) => {
                      const SopIcon = DimensionIcons[sop.dimension];
                      return (
                        <div 
                          key={sop.id}
                          className="col-span-12 md:col-span-6 lg:col-span-4 rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:border-[#8AFD81] transition-all"
                        >
                          <div className="bg-slate-800 px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <SopIcon className="w-4 h-4 text-[#8AFD81]" />
                              <code className="text-[10px] text-[#8AFD81] font-mono">{sop.code}</code>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              sop.status === 'completed' ? 'bg-[#8AFD81]/20 text-[#8AFD81]' :
                              sop.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                              sop.status === 'at-risk' ? 'bg-orange-500/20 text-orange-400' :
                              'bg-slate-600 text-slate-300'
                            }`}>
                              {sop.status.replace('-', ' ')}
                            </span>
                          </div>
                          
                          <div className="bg-white p-4">
                            <h4 className="text-slate-900 text-sm font-medium mb-1">{sop.name}</h4>
                            <p className="text-slate-500 text-xs mb-4 line-clamp-2">{sop.description}</p>
                            
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-slate-500">Progress</span>
                              <span className="text-sm font-bold" style={{ color: STATUS_COLORS[sop.status] }}>
                                {sop.completionPercent}%
                              </span>
                            </div>
                            
                            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full transition-all"
                                style={{ 
                                  width: `${sop.completionPercent}%`,
                                  backgroundColor: STATUS_COLORS[sop.status],
                                }}
                              />
                            </div>
                            
                            {sop.owner && (
                              <div className="mt-3 pt-3 border-t border-slate-200 flex items-center gap-2 text-xs text-slate-500">
                                <User className="w-3 h-3" />
                                <span>{sop.owner}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-12 text-center py-12 text-slate-500">
                      <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                      <p>No sub-SOPs available yet</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
