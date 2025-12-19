/**
 * Types pour le suivi de projet industriel 100 MW
 */

export type PhaseStatus = 'not_started' | 'in_progress' | 'at_risk' | 'blocked' | 'done';

export type DocStatus = 'draft' | 'pending_review' | 'approved' | 'rejected';

export type DocType = 
  | 'permit' 
  | 'ppa' 
  | 'csa' 
  | 'fat_sat' 
  | 'hse' 
  | 'contract' 
  | 'technical' 
  | 'financial' 
  | 'other';

export type BlockerSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ProjectDoc {
  id: string;
  name: string;
  url: string;
  type: DocType;
  status: DocStatus;
  uploadedAt: string;
  uploadedBy: string;
  phaseId?: string;
  milestoneId?: string;
}

export interface Blocker {
  id: string;
  title: string;
  description: string;
  severity: BlockerSeverity;
  eta?: string;
  owner: string;
  phaseId?: string;
  milestoneId?: string;
  createdAt: string;
  resolvedAt?: string;
  mitigationPlan?: string;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  phaseId?: string;
  milestoneId?: string;
}

export interface Milestone {
  id: string;
  name: string;
  description?: string;
  plannedDate: string;
  actualDate?: string;
  progress: number;
  status: PhaseStatus;
  owner: string;
  comments: Comment[];
  docs: ProjectDoc[];
  blockers: Blocker[];
}

export interface Phase {
  id: string;
  title: string;
  description?: string;
  weight: number; // Contribution au % global (ex. MW)
  progress: number; // 0-100
  status: PhaseStatus;
  startDate?: string;
  endDate?: string;
  plannedStartDate: string;
  plannedEndDate: string;
  owner: string;
  milestones: Milestone[];
  docs: ProjectDoc[];
  blockers: Blocker[];
  comments: Comment[];
}

export interface RampUpStep {
  id: string;
  targetMW: number;
  plannedDate: string;
  actualDate?: string;
  actualMW?: number;
  status: PhaseStatus;
  availability72h?: number; // % availability over 72h
  wPerTH?: number;
  criticalIncidents?: number;
}

export interface ProjectKPIs {
  targetMW: number;
  installedMW: number;
  operationalMW: number;
  totalHashrate: number; // PH/s
  pue: number;
  csaProgress: number; // 0-100
  capexBudget: number;
  capexSpent: number;
  opexMonthly: number;
  daysToTarget: number;
  overallProgress: number; // 0-100
}

export interface Project {
  id: string;
  name: string;
  description: string;
  targetMW: number;
  location: string;
  startDate: string;
  targetDate: string;
  kpis: ProjectKPIs;
  phases: Phase[];
  rampUp: RampUpStep[];
  docs: ProjectDoc[];
  blockers: Blocker[];
  comments: Comment[];
}

export interface ActivityLog {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  details?: string;
  phaseId?: string;
  milestoneId?: string;
}
