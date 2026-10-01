export type ServiceStatus = 'healthy' | 'degraded' | 'healing' | 'crashed';

export type FaultType = 
  | 'none' 
  | 'memory_leak' 
  | 'zombie_horde' 
  | 'cpu_hog' 
  | 'io_thrash' 
  | 'socket_leak';

export type ActionLevel = 'L1' | 'L2' | 'L3';

export type RemediationAction = 
  | 'restart_container' 
  | 'reap_zombies' 
  | 'apply_cgroup_limit' 
  | 'flush_cache' 
  | 'cgroup_throttle' 
  | 'drain_traffic';

export type SubsystemType = 
  | 'eBPF' 
  | 'SECURITY' 
  | 'ML_ENGINE' 
  | 'ORCHESTRATOR' 
  | 'RECOVERY' 
  | 'KERNEL' 
  | 'FIRESTORE';

export type LogLevel = 'info' | 'warn' | 'error' | 'action' | 'success';

export type UserRole = 'admin' | 'viewer';

export interface UserAccount {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
}

export interface TelemetryPoint {
  timestamp: number;
  rssMb: number;
  maxRssMb: number;
  cpuPct: number;
  cpuQuotaPct: number;
  zombieCount: number;
  mmapRate: number;
  ioWaitMs: number;
  anomalyScore: number;
  timeToFailureSec: number | null;
}

export interface Microservice {
  id: string;
  name: string;
  role: string;
  category: 'core' | 'edge' | 'support';
  isProtected: boolean;
  status: ServiceStatus;
  fault: FaultType;
  faultStartTime: number | null;
  rssMb: number;
  maxRssMb: number;
  cpuPct: number;
  zombies: number;
  mmapRate: number;
  anomalyScore: number;
  history: TelemetryPoint[];
  restartsCount: number;
  lastHealedTime: number | null;
  uptimeSec: number;
  predictiveFailure5mPct: number;
  predictiveTrend: 'stable' | 'rising' | 'declining' | 'critical';
  estimatedTimeToCrashSec: number | null;
}

export interface ExplainabilityFeature {
  featureName: string;
  value: string;
  weightPct: number;
  direction: 'critical' | 'elevated' | 'nominal';
  baseline: string;
}

export interface Incident {
  id: string;
  timestamp: number;
  serviceId: string;
  serviceName: string;
  faultType: FaultType;
  anomalyScore: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  actionLevel: ActionLevel;
  actionTaken: RemediationAction;
  status: 'detecting' | 'awaiting_approval' | 'executing' | 'verifying' | 'resolved' | 'escalated';
  mttrMs: number | null;
  explainability: ExplainabilityFeature[];
  plainSummary: string;
  costSavedUsd: number;
  carbonSavedGrams: number;
  humanApproved?: boolean;
}

export interface ActionStreamLog {
  id: string;
  timestamp: string;
  level: LogLevel;
  subsystem: SubsystemType;
  message: string;
  service?: string;
}

export interface ReliabilityProfile {
  id: string;
  title: string;
  tagline: string;
  complianceStandard: string;
  anomalyThreshold: number;
  defaultActionLevel: ActionLevel;
  maxRestartsPerHour: number;
  revenueLossPerHourUsd: number;
  description: string;
}

export interface MetricsState {
  sentinelEnabled: boolean;
  dryRunMode: boolean;
  collectorMode: 'ebpf_core' | 'proc_cgroup';
  agentCpuOverheadPct: number;
  agentRamOverheadMb: number;
  totalIncidentsResolved: number;
  averageMttrMs: number;
  manualBaselineMttrSec: number;
  preventedOutages: number;
  totalCostSavedUsd: number;
  totalCarbonSavedKg: number;
  activeProfile: string;
}

export interface AuditRecord {
  id: string;
  timestamp: number;
  actorEmail: string;
  actorRole: UserRole;
  action: string;
  targetService?: string;
  details: string;
  hash: string;
}

export interface ChaosRunResult {
  runId: number;
  service: string;
  fault: FaultType;
  detectedTimeMs: number;
  actionTaken: RemediationAction;
  healedTimeMs: number;
  sentinelMttrMs: number;
  manualBaselineSec: number;
  preCrashPrevented: boolean;
  falsePositive: boolean;
  timestamp?: number;
}
