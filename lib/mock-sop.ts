// ============================================================================
// MOCK DATA - Master SOP Bitcoin Mining Facility Lifecycle
// Based on the Master SOP document
// ============================================================================

import { 
  Project, 
  Phase, 
  Dimension, 
  Gate, 
  SubSOP, 
  PhaseId, 
  DimensionId,
  PHASE_ICON_NAMES,
  DIMENSION_ICON_NAMES
} from '../types/sop';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const createDimension = (
  id: DimensionId,
  name: string,
  criteria: { label: string; completed: boolean; description?: string }[]
): Dimension => {
  const completedCount = criteria.filter(c => c.completed).length;
  const completionPercent = Math.round((completedCount / criteria.length) * 100);
  
  let status: Dimension['status'] = 'not-started';
  if (completionPercent === 100) status = 'completed';
  else if (completionPercent > 0) status = 'in-progress';
  
  return {
    id,
    name,
    icon: DIMENSION_ICON_NAMES[id],
    description: `${name} requirements and deliverables`,
    criteria: criteria.map((c, i) => ({ id: `${id}-${i}`, ...c })),
    status,
    completionPercent,
  };
};

// ============================================================================
// PHASE 1: STRATEGIC INTENT (pas de gate - c'est le point de départ)
// ============================================================================

const strategicIntentPhase: Phase = {
  id: 'strategic-intent',
  name: 'Strategic Intent',
  shortName: 'Intent',
  order: 0,
  description: 'Define the strategic vision and initial project rationale',
  icon: PHASE_ICON_NAMES['strategic-intent'],
  status: 'completed',
  completionPercent: 100,
  startDate: '2024-01-15',
  endDate: '2024-02-01',
  estimatedDuration: '2 weeks',
  dimensions: {
    business: createDimension('business', 'Business', [
      { label: 'Strategic vision documented', completed: true },
      { label: 'Initial market assessment', completed: true },
      { label: 'Sponsor identified', completed: true },
    ]),
    administrative: createDimension('administrative', 'Administrative', [
      { label: 'Project charter drafted', completed: true },
      { label: 'Initial stakeholder mapping', completed: true },
    ]),
    technology: createDimension('technology', 'Technology', [
      { label: 'Technology landscape review', completed: true },
      { label: 'Initial tech requirements', completed: true },
    ]),
    engineering: createDimension('engineering', 'Engineering', [
      { label: 'Site criteria defined', completed: true },
      { label: 'Capacity targets set', completed: true },
    ]),
  },
  gate: {
    id: 'gate-0',
    name: 'Strategic Alignment',
    phase: 'strategic-intent',
    description: 'Confirm strategic alignment and proceed to Pre-Conception',
    status: 'passed',
    criteria: [
      { id: 'g0-1', label: 'Strategic rationale documented', completed: true },
      { id: 'g0-2', label: 'Sponsor approval obtained', completed: true },
    ],
    approvedBy: 'Board of Directors',
    approvedAt: '2024-02-01',
  },
  subSOPs: [],
};

// ============================================================================
// PHASE 2: PRE-CONCEPTION
// Gate: Strategic Validation
// ============================================================================

const preConceptionPhase: Phase = {
  id: 'pre-conception',
  name: 'Pre-Conception',
  shortName: 'Pre-Con',
  order: 1,
  description: 'Confirm that the project is worth pursuing before any structural or financial commitment',
  icon: PHASE_ICON_NAMES['pre-conception'],
  status: 'completed',
  completionPercent: 100,
  startDate: '2024-02-05',
  endDate: '2024-03-15',
  estimatedDuration: '6 weeks',
  dimensions: {
    business: createDimension('business', 'Business', [
      { label: 'Statement of intent explaining why the project exists', completed: true, description: 'Clear articulation of project purpose' },
      { label: 'Preliminary view on stakeholders and shareholding logic', completed: true },
      { label: 'High-level assumptions on capital intensity', completed: true },
      { label: 'Operating margin assumptions documented', completed: true },
      { label: 'Bitcoin exposure analysis', completed: true },
      { label: 'Project sponsor identified and accountable', completed: true },
    ]),
    administrative: createDimension('administrative', 'Administrative', [
      { label: 'Bitcoin mining legality assessment (Qatar)', completed: true, description: 'Written assessment of legal status' },
      { label: 'Regulatory and political risk review', completed: true },
      { label: 'Licensing complexity and timelines assessed', completed: true },
      { label: 'No entity incorporated (by design)', completed: true },
    ]),
    technology: createDimension('technology', 'Technology', [
      { label: 'Statement of technological ambition', completed: true, description: 'Manual vs automated operations decision' },
      { label: 'High-level vision for monitoring and data', completed: true },
      { label: 'Control system concept defined', completed: true },
      { label: 'Known technological constraints identified', completed: true },
    ]),
    engineering: createDimension('engineering', 'Engineering', [
      { label: 'Power availability confirmation', completed: true, description: 'Theoretical support for industrial site' },
      { label: 'Land availability assessment', completed: true },
      { label: 'Climate and constructability assessment', completed: true },
      { label: 'Capacity treated as variable', completed: true },
    ]),
  },
  gate: {
    id: 'gate-1',
    name: 'Strategic Validation',
    phase: 'pre-conception',
    description: 'Approve only if strategic rationale is clear and no fatal constraints identified',
    status: 'passed',
    criteria: [
      { id: 'g1-1', label: 'Strategic rationale is clear', completed: true },
      { id: 'g1-2', label: 'No fatal legal constraints identified', completed: true },
      { id: 'g1-3', label: 'No fatal power constraints identified', completed: true },
      { id: 'g1-4', label: 'Sponsor confirms intent to proceed', completed: true },
      { id: 'g1-5', label: 'Financing of conception phase approved', completed: true },
    ],
    approvedBy: 'Executive Committee',
    approvedAt: '2024-03-15',
  },
  subSOPs: [],
};

// ============================================================================
// PHASE 3: CONCEPTION
// Gate: Investment Approval
// ============================================================================

const conceptionPhase: Phase = {
  id: 'conception',
  name: 'Conception',
  shortName: 'Concept',
  order: 2,
  description: 'Turn a viable idea into a fully defined, financed, and structured project',
  icon: PHASE_ICON_NAMES['conception'],
  status: 'completed',
  completionPercent: 100,
  startDate: '2024-03-20',
  endDate: '2024-06-30',
  estimatedDuration: '14 weeks',
  dimensions: {
    business: createDimension('business', 'Business', [
      { label: 'Financial model with NPV/IRR analysis', completed: true },
      { label: 'Shareholding structure finalized', completed: true },
      { label: 'Commercial agreements drafted', completed: true },
      { label: 'Risk register established', completed: true },
      { label: 'Treasury strategy defined', completed: true },
    ]),
    administrative: createDimension('administrative', 'Administrative', [
      { label: 'Legal entity incorporated', completed: true },
      { label: 'All permits and licenses secured', completed: true },
      { label: 'Regulatory approvals obtained', completed: true },
      { label: 'Tax structure optimized', completed: true },
    ]),
    technology: createDimension('technology', 'Technology', [
      { label: 'Technology architecture finalized', completed: true },
      { label: 'Vendor selection completed', completed: true },
      { label: 'SCADA/monitoring spec defined', completed: true },
      { label: 'Cybersecurity framework established', completed: true },
    ]),
    engineering: createDimension('engineering', 'Engineering', [
      { label: 'Detailed engineering design complete', completed: true },
      { label: 'Site plan approved', completed: true },
      { label: 'Power infrastructure designed', completed: true },
      { label: 'Cooling system designed', completed: true },
      { label: 'Civil works specification complete', completed: true },
    ]),
  },
  gate: {
    id: 'gate-2',
    name: 'Investment Approval',
    phase: 'conception',
    description: 'Full investment committee approval for project execution',
    status: 'passed',
    criteria: [
      { id: 'g2-1', label: 'Financial model approved', completed: true },
      { label: 'All legal entities established', id: 'g2-2', completed: true },
      { id: 'g2-3', label: 'Engineering design approved', completed: true },
      { id: 'g2-4', label: 'Technology stack approved', completed: true },
      { id: 'g2-5', label: 'Funding secured', completed: true },
    ],
    approvedBy: 'Investment Committee',
    approvedAt: '2024-06-30',
  },
  subSOPs: [
    {
      id: 'sop-bus-fin-001',
      code: 'SOP-BUS-FIN-001',
      name: 'Financial Modeling & Investment Analysis',
      dimension: 'business',
      phase: 'conception',
      status: 'completed',
      completionPercent: 100,
      owner: 'CFO',
      description: 'Complete financial model with NPV, IRR, sensitivity analysis',
    },
    {
      id: 'sop-adm-reg-001',
      code: 'SOP-ADM-REG-001',
      name: 'Licensing & Regulatory Compliance',
      dimension: 'administrative',
      phase: 'conception',
      status: 'completed',
      completionPercent: 100,
      owner: 'Legal Counsel',
      description: 'All permits, licenses, and regulatory approvals',
    },
    {
      id: 'sop-tech-arch-001',
      code: 'SOP-TECH-ARCH-001',
      name: 'Technology Architecture Design',
      dimension: 'technology',
      phase: 'conception',
      status: 'completed',
      completionPercent: 100,
      owner: 'CTO',
      description: 'Full technology stack and architecture specification',
    },
  ],
};

// ============================================================================
// PHASE 4: INDUSTRIALISATION
// Gate: Build Authorization
// ============================================================================

const industrialisationPhase: Phase = {
  id: 'industrialisation',
  name: 'Industrialisation',
  shortName: 'Indust',
  order: 3,
  description: 'Prepare all elements for deployment - procurement, contracts, and logistics',
  icon: PHASE_ICON_NAMES['industrialisation'],
  status: 'completed',
  completionPercent: 100,
  startDate: '2024-07-01',
  endDate: '2024-09-30',
  estimatedDuration: '13 weeks',
  dimensions: {
    business: createDimension('business', 'Business', [
      { label: 'Procurement contracts signed', completed: true },
      { label: 'Supply chain secured', completed: true },
      { label: 'Insurance policies in place', completed: true },
      { label: 'Working capital arranged', completed: true },
    ]),
    administrative: createDimension('administrative', 'Administrative', [
      { label: 'Construction permits obtained', completed: true },
      { label: 'Environmental clearances', completed: true },
      { label: 'Labor compliance ready', completed: true },
    ]),
    technology: createDimension('technology', 'Technology', [
      { label: 'Hardware orders placed', completed: true },
      { label: 'Software licenses acquired', completed: true },
      { label: 'Network infrastructure ready', completed: true },
    ]),
    engineering: createDimension('engineering', 'Engineering', [
      { label: 'Fabrication started', completed: true },
      { label: 'Modular units manufactured', completed: true },
      { label: 'QA/QC protocols active', completed: true },
      { label: 'Logistics plan finalized', completed: true },
    ]),
  },
  gate: {
    id: 'gate-3',
    name: 'Build Authorization',
    phase: 'industrialisation',
    description: 'Authorization to commence physical deployment',
    status: 'passed',
    criteria: [
      { id: 'g3-1', label: 'All procurement complete', completed: true },
      { id: 'g3-2', label: 'Site ready for construction', completed: true },
      { id: 'g3-3', label: 'Deployment team assembled', completed: true },
      { id: 'g3-4', label: 'Logistics validated', completed: true },
    ],
    approvedBy: 'Project Director',
    approvedAt: '2024-09-30',
  },
  subSOPs: [
    {
      id: 'sop-eng-proc-001',
      code: 'SOP-ENG-PROC-001',
      name: 'Procurement & Supply Chain',
      dimension: 'engineering',
      phase: 'industrialisation',
      status: 'completed',
      completionPercent: 100,
      owner: 'Procurement Manager',
      description: 'Hardware procurement, vendor management, supply chain',
    },
  ],
};

// ============================================================================
// PHASE 5: DEPLOYMENT
// Gate: Energisation Approval
// ============================================================================

const deploymentPhase: Phase = {
  id: 'deployment',
  name: 'Deployment',
  shortName: 'Deploy',
  order: 4,
  description: 'Physical installation of all infrastructure and equipment on site',
  icon: PHASE_ICON_NAMES['deployment'],
  status: 'in-progress',
  completionPercent: 75,
  startDate: '2024-10-01',
  endDate: undefined,
  estimatedDuration: '16 weeks',
  dimensions: {
    business: createDimension('business', 'Business', [
      { label: 'Site operations team deployed', completed: true },
      { label: 'Security protocols active', completed: true },
      { label: 'Progress reporting established', completed: true },
    ]),
    administrative: createDimension('administrative', 'Administrative', [
      { label: 'Site access controls implemented', completed: true },
      { label: 'Safety certifications obtained', completed: true },
      { label: 'Inspection schedule active', completed: false, description: 'Waiting for utility inspection' },
    ]),
    technology: createDimension('technology', 'Technology', [
      { label: 'Network infrastructure installed', completed: true },
      { label: 'Monitoring systems online', completed: true },
      { label: 'SCADA integration complete', completed: false, description: 'In progress - 80% complete' },
    ]),
    engineering: createDimension('engineering', 'Engineering', [
      { label: 'Civil works complete', completed: true },
      { label: 'Power distribution installed', completed: true },
      { label: 'Cooling systems installed', completed: true },
      { label: 'Mining containers deployed', completed: true },
      { label: 'Final connections pending', completed: false, description: 'Awaiting utility connection' },
    ]),
  },
  gate: {
    id: 'gate-4',
    name: 'Energisation Approval',
    phase: 'deployment',
    description: 'Approval to connect to power grid and energise facility',
    status: 'pending',
    criteria: [
      { id: 'g4-1', label: 'All physical installation complete', completed: true },
      { id: 'g4-2', label: 'Safety inspections passed', completed: false },
      { id: 'g4-3', label: 'Utility connection approved', completed: false },
      { id: 'g4-4', label: 'Emergency protocols tested', completed: true },
    ],
    blockers: ['Utility inspection scheduled for next week', 'SCADA integration to be completed'],
  },
  subSOPs: [
    {
      id: 'sop-eng-dep-001',
      code: 'SOP-ENG-DEP-001',
      name: 'Physical Deployment',
      dimension: 'engineering',
      phase: 'deployment',
      status: 'in-progress',
      completionPercent: 85,
      owner: 'Site Manager',
      description: 'Physical installation and construction on site',
    },
    {
      id: 'sop-tech-dep-001',
      code: 'SOP-TECH-DEP-001',
      name: 'Technology Deployment',
      dimension: 'technology',
      phase: 'deployment',
      status: 'in-progress',
      completionPercent: 80,
      owner: 'IT Director',
      description: 'Network, monitoring, and control systems deployment',
    },
  ],
};

// ============================================================================
// PHASE 6: COMMISSIONING
// Gate: Operations Handover
// ============================================================================

const commissioningPhase: Phase = {
  id: 'commissioning',
  name: 'Commissioning',
  shortName: 'Commis',
  order: 5,
  description: 'Systematic testing, verification, and ramp-up of facility operations',
  icon: PHASE_ICON_NAMES['commissioning'],
  status: 'not-started',
  completionPercent: 0,
  startDate: undefined,
  endDate: undefined,
  estimatedDuration: '8 weeks',
  dimensions: {
    business: createDimension('business', 'Business', [
      { label: 'Operations team fully trained', completed: false },
      { label: 'Mining pool connected', completed: false },
      { label: 'Revenue generation started', completed: false },
    ]),
    administrative: createDimension('administrative', 'Administrative', [
      { label: 'Final operating licenses', completed: false },
      { label: 'Compliance documentation complete', completed: false },
    ]),
    technology: createDimension('technology', 'Technology', [
      { label: 'All systems integration tested', completed: false },
      { label: 'Performance benchmarks met', completed: false },
      { label: 'Automation fully operational', completed: false },
    ]),
    engineering: createDimension('engineering', 'Engineering', [
      { label: 'Load testing complete', completed: false },
      { label: 'Thermal performance verified', completed: false },
      { label: 'Redundancy systems tested', completed: false },
      { label: 'Full capacity reached', completed: false },
    ]),
  },
  gate: {
    id: 'gate-5',
    name: 'Operations Handover',
    phase: 'commissioning',
    description: 'Handover from project team to operations team',
    status: 'not-applicable',
    criteria: [
      { id: 'g5-1', label: 'All systems operational', completed: false },
      { id: 'g5-2', label: 'Performance targets met', completed: false },
      { id: 'g5-3', label: 'Documentation complete', completed: false },
      { id: 'g5-4', label: 'Operations team certified', completed: false },
    ],
  },
  subSOPs: [
    {
      id: 'sop-eng-comm-001',
      code: 'SOP-ENG-COMM-001',
      name: 'Commissioning Procedures',
      dimension: 'engineering',
      phase: 'commissioning',
      status: 'not-started',
      completionPercent: 0,
      owner: 'Commissioning Lead',
      description: 'Systematic testing and verification procedures',
    },
  ],
};

// ============================================================================
// PHASE 7: STEADY-STATE OPERATIONS
// Gate: Continuous Improvement
// ============================================================================

const steadyStatePhase: Phase = {
  id: 'steady-state',
  name: 'Steady-State Operations',
  shortName: 'Ops',
  order: 6,
  description: 'Ongoing operations, maintenance, and optimization of the facility',
  icon: PHASE_ICON_NAMES['steady-state'],
  status: 'not-started',
  completionPercent: 0,
  startDate: undefined,
  endDate: undefined,
  estimatedDuration: 'Ongoing',
  dimensions: {
    business: createDimension('business', 'Business', [
      { label: 'Revenue optimization ongoing', completed: false },
      { label: 'Cost control measures active', completed: false },
      { label: 'Stakeholder reporting active', completed: false },
    ]),
    administrative: createDimension('administrative', 'Administrative', [
      { label: 'Compliance maintenance', completed: false },
      { label: 'License renewals tracked', completed: false },
    ]),
    technology: createDimension('technology', 'Technology', [
      { label: 'Continuous monitoring active', completed: false },
      { label: 'Software updates managed', completed: false },
      { label: 'Security protocols maintained', completed: false },
    ]),
    engineering: createDimension('engineering', 'Engineering', [
      { label: 'Preventive maintenance active', completed: false },
      { label: 'Equipment lifecycle management', completed: false },
      { label: 'Capacity optimization', completed: false },
    ]),
  },
  gate: {
    id: 'gate-6',
    name: 'Continuous Improvement',
    phase: 'steady-state',
    description: 'Ongoing review and optimization cycles',
    status: 'not-applicable',
    criteria: [
      { id: 'g6-1', label: 'KPIs meeting targets', completed: false },
      { id: 'g6-2', label: 'Efficiency improvements identified', completed: false },
      { id: 'g6-3', label: 'Risk management active', completed: false },
    ],
  },
  subSOPs: [
    {
      id: 'sop-ops-maint-001',
      code: 'SOP-OPS-MAINT-001',
      name: 'Maintenance Operations',
      dimension: 'engineering',
      phase: 'steady-state',
      status: 'not-started',
      completionPercent: 0,
      owner: 'Operations Manager',
      description: 'Preventive and corrective maintenance procedures',
    },
  ],
};

// ============================================================================
// COMPLETE PROJECT
// ============================================================================

export const mockSOPProject: Project = {
  id: 'qatar-100mw',
  name: 'Qatar Bitcoin Mining Facility',
  location: 'Qatar Industrial Zone',
  capacity: '100 MW',
  currentPhase: 'deployment',
  overallProgress: 68,
  startDate: '2024-01-15',
  targetDate: '2025-03-01',
  owner: 'Hearst Investments',
  status: 'in-progress',
  phases: [
    strategicIntentPhase,
    preConceptionPhase,
    conceptionPhase,
    industrialisationPhase,
    deploymentPhase,
    commissioningPhase,
    steadyStatePhase,
  ],
};

// ============================================================================
// HELPER EXPORTS
// ============================================================================

export const getAllSubSOPs = (): SubSOP[] => {
  return mockSOPProject.phases.flatMap(phase => phase.subSOPs);
};

export const getPhaseByStatus = (status: Phase['status']): Phase[] => {
  return mockSOPProject.phases.filter(phase => phase.status === status);
};

export const getCurrentPhase = (): Phase | undefined => {
  return mockSOPProject.phases.find(phase => phase.id === mockSOPProject.currentPhase);
};

export const getBlockedGates = (): Gate[] => {
  return mockSOPProject.phases
    .map(phase => phase.gate)
    .filter(gate => gate.status === 'blocked' || gate.status === 'pending');
};

