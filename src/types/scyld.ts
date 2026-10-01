export interface ServiceNode {
  id: string;
  name: string;
  role: string;
  category: 'core' | 'edge' | 'support';
  isProtected: boolean;
  status: 'healthy' | 'warning' | 'critical' | 'healing';
  fault: 'none' | 'memory_leak' | 'cpu_hog' | 'zombie_horde' | 'socket_exhaustion';
  faultStartTime: number | null;
  rssMb: number;
  maxRssMb: number;
  cpuPct: number;
  zombies: number;
  mmapRate: number;
  anomalyScore: number;
  restartsCount: number;
  lastHealedTime: string | null;
  uptimeSec: number;
  predictiveFailure5mPct: number;
}

export interface ReliabilityProfile {
  id: string;
  title: string;
  tagline: string;
  complianceStandard: string;
  anomalyThreshold: number;
  defaultActionLevel: 'L1' | 'L2' | 'L3';
  maxRestartsPerHour: number;
  revenueLossPerHourUsd: number;
  description: string;
}

export interface IncidentRecord {
  id: string;
  timestamp: string;
  serviceId: string;
  serviceName: string;
  faultType: string;
  level: 'L1' | 'L2' | 'L3';
  status: 'awaiting_approval' | 'resolved' | 'escalated' | 'auto_remediated';
  humanApproved: boolean | null;
  blastRadius: string;
  rootCause: string;
  metricsObserved: string;
  actionTaken: string;
  plainSummary: string;
  costSavedUsd: number;
  carbonSavedGrams: number;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actorEmail: string;
  actorRole: 'admin' | 'viewer' | 'sentinel_agent';
  action: string;
  targetService: string;
  details: string;
  hash: string;
}

export interface StreamLogItem {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  subsystem: 'eBPF' | 'KERNEL' | 'ORCHESTRATOR' | 'SECURITY' | 'CGROUP';
  message: string;
  service?: string;
}
