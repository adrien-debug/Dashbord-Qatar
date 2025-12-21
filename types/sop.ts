// ============================================================================
// SOP LIFECYCLE TYPES - Master SOP Bitcoin Mining Facility
// ============================================================================

// Les 7 phases du cycle de vie
export type PhaseId = 
  | 'strategic-intent'
  | 'pre-conception'
  | 'conception'
  | 'industrialisation'
  | 'deployment'
  | 'commissioning'
  | 'steady-state';

// Les 4 dimensions obligatoires
export type DimensionId = 'business' | 'administrative' | 'technology' | 'engineering';

// Status possibles
export type Status = 'not-started' | 'in-progress' | 'completed' | 'blocked' | 'at-risk';

// Gate status
export type GateStatus = 'passed' | 'pending' | 'blocked' | 'not-applicable';

// ============================================================================
// INTERFACES
// ============================================================================

export interface Criterion {
  id: string;
  label: string;
  description?: string;
  completed: boolean;
  blockedBy?: string;
}

export interface Dimension {
  id: DimensionId;
  name: string;
  icon: string;
  description: string;
  criteria: Criterion[];
  status: Status;
  completionPercent: number;
}

export interface Gate {
  id: string;
  name: string;
  phase: PhaseId;
  description: string;
  status: GateStatus;
  criteria: Criterion[];
  approvedBy?: string;
  approvedAt?: string;
  blockers?: string[];
}

export interface SubSOP {
  id: string;
  code: string; // ex: SOP-BUS-FIN-001
  name: string;
  dimension: DimensionId;
  phase: PhaseId;
  status: Status;
  completionPercent: number;
  owner?: string;
  dueDate?: string;
  description: string;
}

export interface Phase {
  id: PhaseId;
  name: string;
  shortName: string;
  order: number;
  description: string;
  icon: string;
  status: Status;
  completionPercent: number;
  dimensions: Record<DimensionId, Dimension>;
  gate: Gate;
  subSOPs: SubSOP[];
  startDate?: string;
  endDate?: string;
  estimatedDuration?: string;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  capacity: string; // ex: "100 MW"
  currentPhase: PhaseId;
  overallProgress: number;
  phases: Phase[];
  startDate: string;
  targetDate: string;
  owner: string;
  status: Status;
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const PHASE_NAMES: Record<PhaseId, string> = {
  'strategic-intent': 'Strategic Intent',
  'pre-conception': 'Pre-Conception',
  'conception': 'Conception',
  'industrialisation': 'Industrialisation',
  'deployment': 'Deployment',
  'commissioning': 'Commissioning',
  'steady-state': 'Steady-State Operations',
};

export const DIMENSION_NAMES: Record<DimensionId, string> = {
  business: 'Business',
  administrative: 'Administrative',
  technology: 'Technology',
  engineering: 'Engineering',
};

export const STATUS_COLORS: Record<Status, string> = {
  'not-started': '#94A3B8',
  'in-progress': '#64748B',
  'completed': '#8AFD81',
  'blocked': '#475569',
  'at-risk': '#64748B',
};

export const GATE_STATUS_COLORS: Record<GateStatus, string> = {
  'passed': '#8AFD81',
  'pending': '#94A3B8',
  'blocked': '#475569',
  'not-applicable': '#CBD5E1',
};

// Icon names for Lucide React - use these with the Lucide component
export const DIMENSION_ICON_NAMES: Record<DimensionId, string> = {
  business: 'Briefcase',
  administrative: 'ClipboardList',
  technology: 'Monitor',
  engineering: 'Settings',
};

export const PHASE_ICON_NAMES: Record<PhaseId, string> = {
  'strategic-intent': 'Target',
  'pre-conception': 'Lightbulb',
  'conception': 'PenTool',
  'industrialisation': 'Factory',
  'deployment': 'Rocket',
  'commissioning': 'Zap',
  'steady-state': 'RefreshCw',
};

