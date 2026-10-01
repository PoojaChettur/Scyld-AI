import {
  Microservice,
  ReliabilityProfile,
  MetricsState,
  ActionStreamLog,
  Incident,
  AuditRecord,
  ChaosRunResult,
  FaultType,
  UserRole,
  ExplainabilityFeature,
  ActionLevel,
  RemediationAction,
} from '../types';

export const INITIAL_SERVICES: Microservice[] = [
  {
    id: 'payment-svc',
    name: 'payment-service',
    role: 'Stripe/UPI Gateway & Ledger',
    category: 'core',
    isProtected: false,
    status: 'healthy',
    fault: 'none',
    faultStartTime: null,
    rssMb: 142,
    maxRssMb: 512,
    cpuPct: 14,
    zombies: 0,
    mmapRate: 18,
    anomalyScore: 0.04,
    history: [],
    restartsCount: 0,
    lastHealedTime: null,
    uptimeSec: 4120,
    predictiveFailure5mPct: 2.1,
    predictiveTrend: 'stable',
    estimatedTimeToCrashSec: null,
  },
  {
    id: 'auth-svc',
    name: 'auth-identity-service',
    role: 'OAuth2 & JWT Token Engine',
    category: 'core',
    isProtected: false,
    status: 'healthy',
    fault: 'none',
    faultStartTime: null,
    rssMb: 98,
    maxRssMb: 384,
    cpuPct: 9,
    zombies: 0,
    mmapRate: 12,
    anomalyScore: 0.03,
    history: [],
    restartsCount: 0,
    lastHealedTime: null,
    uptimeSec: 7890,
    predictiveFailure5mPct: 1.8,
    predictiveTrend: 'stable',
    estimatedTimeToCrashSec: null,
  },
  {
    id: 'db-proxy',
    name: 'db-connection-pooler',
    role: 'PostgreSQL PgBouncer Proxy',
    category: 'core',
    isProtected: true,
    status: 'healthy',
    fault: 'none',
    faultStartTime: null,
    rssMb: 245,
    maxRssMb: 768,
    cpuPct: 22,
    zombies: 0,
    mmapRate: 35,
    anomalyScore: 0.06,
    history: [],
    restartsCount: 0,
    lastHealedTime: null,
    uptimeSec: 18450,
    predictiveFailure5mPct: 3.4,
    predictiveTrend: 'stable',
    estimatedTimeToCrashSec: null,
  },
  {
    id: 'frontend-edge',
    name: 'edge-gateway-router',
    role: 'Ingress & Envoy Mesh Router',
    category: 'edge',
    isProtected: false,
    status: 'healthy',
    fault: 'none',
    faultStartTime: null,
    rssMb: 112,
    maxRssMb: 450,
    cpuPct: 11,
    zombies: 0,
    mmapRate: 24,
    anomalyScore: 0.02,
    history: [],
    restartsCount: 0,
    lastHealedTime: null,
    uptimeSec: 9200,
    predictiveFailure5mPct: 1.4,
    predictiveTrend: 'stable',
    estimatedTimeToCrashSec: null,
  },
  {
    id: 'cache-cluster',
    name: 'redis-cache-proxy',
    role: 'Session & Cache Sharding',
    category: 'support',
    isProtected: false,
    status: 'healthy',
    fault: 'none',
    faultStartTime: null,
    rssMb: 185,
    maxRssMb: 600,
    cpuPct: 8,
    zombies: 0,
    mmapRate: 16,
    anomalyScore: 0.03,
    history: [],
    restartsCount: 0,
    lastHealedTime: null,
    uptimeSec: 15300,
    predictiveFailure5mPct: 1.9,
    predictiveTrend: 'stable',
    estimatedTimeToCrashSec: null,
  },
];

export const RELIABILITY_PROFILES: Record<string, ReliabilityProfile> = {
  hospital: {
    id: 'hospital',
    title: 'Hospital ICU & EHR Systems',
    tagline: 'Zero-tolerance medical telemetry and patient registry guarantee',
    complianceStandard: 'HIPAA Tier-1 EHR High Availability (99.999%)',
    anomalyThreshold: 0.62,
    defaultActionLevel: 'L2',
    maxRestartsPerHour: 2,
    revenueLossPerHourUsd: 85000,
    description: 'Guarantees continuous electronic health record availability. Micro-healing isolated to affected subsystem to prevent triage freezes.',
  },
  banking: {
    id: 'banking',
    title: 'Financial Core & Banking',
    tagline: 'High-frequency transaction consistency with strict blast-radius controls',
    complianceStandard: 'PCI-DSS Level 1 Real-Time Settlement & Ledger',
    anomalyThreshold: 0.65,
    defaultActionLevel: 'L3',
    maxRestartsPerHour: 2,
    revenueLossPerHourUsd: 145000,
    description: 'Mandates human-in-the-loop approval on core ledger nodes. Micro-throttles runaway cgroups prior to hard restarts.',
  },
  egov: {
    id: 'egov',
    title: 'National E-Governance Gateway',
    tagline: 'Public digital infrastructure reliability for millions of citizens',
    complianceStandard: 'FedRAMP High / Critical Citizen Infrastructure',
    anomalyThreshold: 0.70,
    defaultActionLevel: 'L1',
    maxRestartsPerHour: 4,
    revenueLossPerHourUsd: 40000,
    description: 'Autonomous recovery of citizen verification portals without requiring manual sysadmin waking hours.',
  },
  exam: {
    id: 'exam',
    title: 'High-Stakes Examination Engine',
    tagline: 'Anti-disconnect session resilience for simultaneous remote examinees',
    complianceStandard: 'SOC 2 High-Concurrency WebSocket Proctoring',
    anomalyThreshold: 0.68,
    defaultActionLevel: 'L1',
    maxRestartsPerHour: 3,
    revenueLossPerHourUsd: 32000,
    description: 'Detects socket leaks and zombie workers before candidate websocket connections are severed.',
  },
  standard: {
    id: 'standard',
    title: 'Standard Cloud SaaS Architecture',
    tagline: 'Balanced enterprise reliability and autonomous micro-recovery',
    complianceStandard: 'ISO 27001 / Cloud Microservice SLA 99.99%',
    anomalyThreshold: 0.75,
    defaultActionLevel: 'L1',
    maxRestartsPerHour: 5,
    revenueLossPerHourUsd: 22000,
    description: 'Fully autonomous L1 self-healing for microservices with automated notification digests.',
  },
};

export const INITIAL_CHAOS_RUNS: ChaosRunResult[] = [
  {
    runId: 101,
    service: 'payment-svc',
    fault: 'memory_leak',
    detectedTimeMs: 780,
    actionTaken: 'restart_container',
    healedTimeMs: 3180,
    sentinelMttrMs: 3180,
    manualBaselineSec: 1800,
    preCrashPrevented: true,
    falsePositive: false,
    timestamp: Date.now() - 3600000 * 2,
  },
  {
    runId: 102,
    service: 'auth-svc',
    fault: 'zombie_horde',
    detectedTimeMs: 620,
    actionTaken: 'reap_zombies',
    healedTimeMs: 1420,
    sentinelMttrMs: 1420,
    manualBaselineSec: 2400,
    preCrashPrevented: true,
    falsePositive: false,
    timestamp: Date.now() - 3600000 * 1.5,
  },
  {
    runId: 103,
    service: 'frontend-edge',
    fault: 'cpu_hog',
    detectedTimeMs: 440,
    actionTaken: 'apply_cgroup_limit',
    healedTimeMs: 980,
    sentinelMttrMs: 980,
    manualBaselineSec: 1200,
    preCrashPrevented: true,
    falsePositive: false,
    timestamp: Date.now() - 3600000,
  },
  {
    runId: 104,
    service: 'db-proxy',
    fault: 'memory_leak',
    detectedTimeMs: 820,
    actionTaken: 'restart_container',
    healedTimeMs: 3410,
    sentinelMttrMs: 3410,
    manualBaselineSec: 2100,
    preCrashPrevented: true,
    falsePositive: false,
    timestamp: Date.now() - 1800000,
  },
  {
    runId: 105,
    service: 'cache-cluster',
    fault: 'io_thrash',
    detectedTimeMs: 510,
    actionTaken: 'flush_cache',
    healedTimeMs: 1120,
    sentinelMttrMs: 1120,
    manualBaselineSec: 900,
    preCrashPrevented: true,
    falsePositive: false,
    timestamp: Date.now() - 600000,
  },
];

class SentinelStore {
  private subscribers: Array<() => void> = [];
  private services: Microservice[] = [];
  private incidents: Incident[] = [];
  private actionStreamLogs: ActionStreamLog[] = [];
  private auditRecords: AuditRecord[] = [];
  private chaosRuns: ChaosRunResult[] = [...INITIAL_CHAOS_RUNS];
  private timer: number | null = null;
  public pendingApprovalIncidentId: string | null = null;
  public tickCounter = 0;
  public userRole: UserRole = 'admin';

  public metrics: MetricsState = {
    sentinelEnabled: true,
    dryRunMode: false,
    collectorMode: 'ebpf_core',
    agentCpuOverheadPct: 2.8,
    agentRamOverheadMb: 94,
    totalIncidentsResolved: 3,
    averageMttrMs: 3120,
    manualBaselineMttrSec: 1800,
    preventedOutages: 3,
    totalCostSavedUsd: 142000,
    totalCarbonSavedKg: 14.8,
    activeProfile: 'standard',
  };

  constructor() {
    this.services = JSON.parse(JSON.stringify(INITIAL_SERVICES));
    const now = Date.now();

    // Populate initial history for each service
    this.services.forEach((svc) => {
      svc.history = [];
      for (let n = 24; n >= 0; n--) {
        svc.history.push({
          timestamp: now - n * 1000,
          rssMb: Math.round(svc.rssMb + (Math.random() * 4 - 2)),
          maxRssMb: svc.maxRssMb,
          cpuPct: Math.round(svc.cpuPct + (Math.random() * 3 - 1.5)),
          cpuQuotaPct: 100,
          zombieCount: 0,
          mmapRate: Math.round(svc.mmapRate + (Math.random() * 4 - 2)),
          ioWaitMs: Number((1.2 + Math.random() * 0.5).toFixed(1)),
          anomalyScore: Number((0.02 + Math.random() * 0.03).toFixed(3)),
          timeToFailureSec: null,
        });
      }
    });

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    this.actionStreamLogs = [
      {
        id: '1',
        timestamp: timeStr,
        level: 'info',
        subsystem: 'eBPF',
        message: 'Loaded eBPF CO-RE probe: sys_enter_mmap, sys_enter_fork, sched_process_exit (ringbuf 0.12ms)',
      },
      {
        id: '2',
        timestamp: timeStr,
        level: 'info',
        subsystem: 'ML_ENGINE',
        message: 'IsolationForest sliding window baseline locked. Anomaly trigger threshold: 0.75',
      },
      {
        id: '3',
        timestamp: timeStr,
        level: 'success',
        subsystem: 'SECURITY',
        message: 'Sentinel daemon armed. Sub-second fail-open kernel protection active.',
      },
    ];

    // Seed initial resolved incident
    this.incidents.push({
      id: 'inc-demo-01',
      timestamp: now - 120000,
      serviceId: 'payment-svc',
      serviceName: 'payment-service',
      faultType: 'memory_leak',
      anomalyScore: 0.88,
      severity: 'high',
      actionLevel: 'L1',
      actionTaken: 'restart_container',
      status: 'resolved',
      mttrMs: 3240,
      explainability: [
        {
          featureName: 'RSS Memory Velocity',
          value: '+22.4 MB/min',
          weightPct: 48,
          direction: 'critical',
          baseline: '< 1.5 MB/min',
        },
        {
          featureName: 'sys_enter_mmap syscalls',
          value: '294/s',
          weightPct: 32,
          direction: 'critical',
          baseline: '18/s',
        },
        {
          featureName: 'cgroup RSS slope',
          value: '0.84 slope-index',
          weightPct: 20,
          direction: 'elevated',
          baseline: '0.04',
        },
      ],
      plainSummary:
        'Autonomous Sentinel L1 recovery: Detected high-velocity heap leak in payment-service via eBPF mmap probe. Micro-restart completed in 3.24s without cascading to dependent database or auth services.',
      costSavedUsd: 11000,
      carbonSavedGrams: 850,
      humanApproved: true,
    });

    // Seed initial audit log
    this.addAuditRecord('SYSTEM', 'admin', 'DAEMON_BOOTSTRAP', 'All Nodes', 'Sentinel Node initialized with eBPF CO-RE hooks');

    this.startSimulation();
  }

  public subscribe(fn: () => void): () => void {
    this.subscribers.push(fn);
    return () => {
      this.subscribers = this.subscribers.filter((s) => s !== fn);
    };
  }

  public notify(): void {
    this.subscribers.forEach((fn) => {
      try {
        fn();
      } catch (err) {
        console.error('Subscriber notify error:', err);
      }
    });
  }

  public getServices(): Microservice[] {
    return this.services;
  }

  public getIncidents(): Incident[] {
    return this.incidents;
  }

  public getMetrics(): MetricsState {
    return this.metrics;
  }

  public getActionStreamLogs(): ActionStreamLog[] {
    return this.actionStreamLogs;
  }

  public getAuditRecords(): AuditRecord[] {
    return this.auditRecords;
  }

  public getChaosRuns(): ChaosRunResult[] {
    return this.chaosRuns;
  }

  public clearActionStreamLogs(): void {
    this.actionStreamLogs = [];
    this.notify();
  }

  public addStreamLog(level: ActionStreamLog['level'], subsystem: ActionStreamLog['subsystem'], message: string, service?: string): void {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const log: ActionStreamLog = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: timeStr,
      level,
      subsystem,
      message,
      service,
    };
    this.actionStreamLogs.push(log);
    if (this.actionStreamLogs.length > 120) {
      this.actionStreamLogs.shift();
    }
    this.notify();
  }

  public addAuditRecord(actorEmail: string, actorRole: UserRole, action: string, targetService: string, details: string): void {
    const prevHash = this.auditRecords.length > 0 ? this.auditRecords[0].hash : '0000000000000000';
    const raw = `${Date.now()}:${actorEmail}:${action}:${targetService}:${prevHash}`;
    // Simple deterministic hash simulation
    let hashNum = 0;
    for (let i = 0; i < raw.length; i++) {
      hashNum = (hashNum << 5) - hashNum + raw.charCodeAt(i);
      hashNum |= 0;
    }
    const hash = '0x' + Math.abs(hashNum).toString(16).padStart(16, 'a') + Math.random().toString(16).substring(2, 8);

    const record: AuditRecord = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: Date.now(),
      actorEmail,
      actorRole,
      action,
      targetService,
      details,
      hash,
    };
    this.auditRecords.unshift(record);
    if (this.auditRecords.length > 200) {
      this.auditRecords.pop();
    }
    this.notify();
  }

  public setSentinelEnabled(enabled: boolean): void {
    this.metrics.sentinelEnabled = enabled;
    this.addStreamLog(
      enabled ? 'success' : 'warn',
      'SECURITY',
      enabled ? 'Sentinel agent armed. Autonomous micro-recovery enabled.' : 'Sentinel agent disarmed. Running in unmanaged baseline mode.'
    );
    this.addAuditRecord('Operator', this.userRole, enabled ? 'ARM_SENTINEL' : 'DISARM_SENTINEL', 'Cluster', `Sentinel autonomous healing switched to ${enabled}`);
    this.notify();
  }

  public setDryRunMode(enabled: boolean): void {
    this.metrics.dryRunMode = enabled;
    this.addStreamLog(
      'info',
      'ORCHESTRATOR',
      enabled ? 'Dry-Run mode enabled. Actions will be logged without restarting containers.' : 'Dry-Run mode disabled. Live kernel actions active.'
    );
    this.addAuditRecord('Operator', this.userRole, enabled ? 'ENABLE_DRY_RUN' : 'DISABLE_DRY_RUN', 'Cluster', `Dry run mode switched to ${enabled}`);
    this.notify();
  }

  public setCollectorMode(mode: 'ebpf_core' | 'proc_cgroup'): void {
    this.metrics.collectorMode = mode;
    this.metrics.agentCpuOverheadPct = mode === 'ebpf_core' ? 2.8 : 4.4;
    this.metrics.agentRamOverheadMb = mode === 'ebpf_core' ? 94 : 128;
    this.addStreamLog(
      'info',
      'eBPF',
      mode === 'ebpf_core'
        ? 'Switched to eBPF CO-RE probe mode (0.12ms ring buffer overhead).'
        : 'Switched to userspace /proc cgroup collector fallback.'
    );
    this.notify();
  }

  public setActiveProfile(profileKey: string): void {
    if (!RELIABILITY_PROFILES[profileKey]) return;
    this.metrics.activeProfile = profileKey;
    const prof = RELIABILITY_PROFILES[profileKey];
    this.addStreamLog(
      'info',
      'SECURITY',
      `Active reliability profile switched to [${prof.title}]. Anomaly trigger: ${(prof.anomalyThreshold * 100).toFixed(0)}%`
    );
    this.addAuditRecord('Operator', this.userRole, 'SWITCH_PROFILE', 'Cluster', `Switched active profile to ${prof.title}`);
    this.notify();
  }

  public setServiceProtected(serviceId: string, protectedVal: boolean): void {
    const svc = this.services.find((s) => s.id === serviceId);
    if (svc) {
      svc.isProtected = protectedVal;
      this.addStreamLog(
        protectedVal ? 'warn' : 'info',
        'SECURITY',
        protectedVal
          ? `Target [${svc.name}] locked as Protected Service (Strict L3 Human Approval required).`
          : `Target [${svc.name}] set to autonomous L1 recovery.`
      );
      this.addAuditRecord('Operator', this.userRole, 'TOGGLE_PROTECT', svc.name, `Service protection set to ${protectedVal}`);
      this.notify();
    }
  }

  public setUserRole(role: UserRole): void {
    this.userRole = role;
    this.addStreamLog('info', 'SECURITY', `Operator role switched to [${role.toUpperCase()}]. ${role === 'admin' ? 'Full RBAC Remediation Authority granted.' : 'View-Only Observer mode enabled.'}`);
    this.notify();
  }

  public injectFault(serviceId: string, fault: FaultType): void {
    const svc = this.services.find((s) => s.id === serviceId);
    if (!svc) return;

    svc.fault = fault;
    svc.faultStartTime = Date.now();
    svc.status = 'degraded';

    this.addStreamLog(
      'warn',
      'eBPF',
      `Synthetic fault [${fault.replace(/_/g, ' ')}] injected into cgroup [${svc.name}]. Telemetry trajectory diverging from baseline.`,
      svc.name
    );
    this.addAuditRecord('Operator', this.userRole, 'INJECT_FAULT', svc.name, `Synthetic fault [${fault}] injected into cgroup`);
    this.notify();
  }

  public clearAllFaults(): void {
    this.services.forEach((svc) => {
      svc.fault = 'none';
      svc.faultStartTime = null;
      svc.status = 'healthy';
      svc.zombies = 0;
      svc.anomalyScore = 0.03;
      const initial = INITIAL_SERVICES.find((i) => i.id === svc.id);
      if (initial) {
        svc.rssMb = initial.rssMb;
        svc.cpuPct = initial.cpuPct;
        svc.mmapRate = initial.mmapRate;
      }
    });
    this.addStreamLog('success', 'ORCHESTRATOR', 'Fleet cgroups reset to nominal baseline state.');
    this.addAuditRecord('Operator', this.userRole, 'RESET_FLEET', 'All Nodes', 'Cleared all synthetic faults and restored nominal cgroup states');
    this.notify();
  }

  public approveIncident(incidentId: string): void {
    const inc = this.incidents.find((i) => i.id === incidentId);
    if (!inc || inc.status !== 'awaiting_approval') return;

    inc.humanApproved = true;
    inc.status = 'executing';

    this.addStreamLog(
      'action',
      'SECURITY',
      `L3 Human Approval GRANTED for incident ${inc.id} on [${inc.serviceName}]. Authorizing micro-action: ${inc.actionTaken}`,
      inc.serviceName
    );
    this.addAuditRecord('Operator', this.userRole, 'APPROVE_L3_ACTION', inc.serviceName, `Operator authorized L3 remediation [${inc.actionTaken}] for incident ${inc.id}`);

    const svc = this.services.find((s) => s.id === inc.serviceId);
    if (svc) {
      svc.status = 'healing';
      setTimeout(() => {
        this.executeRemediation(svc, inc);
      }, 1200);
    }
    this.notify();
  }

  public rejectIncident(incidentId: string): void {
    const inc = this.incidents.find((i) => i.id === incidentId);
    if (!inc || inc.status !== 'awaiting_approval') return;

    inc.humanApproved = false;
    inc.status = 'escalated';
    inc.plainSummary = `L3 Remediation declined by human operator for ${inc.serviceName}. Manual diagnostic escalation initiated.`;

    this.addStreamLog(
      'warn',
      'SECURITY',
      `L3 Human Approval REJECTED for incident ${inc.id} on [${inc.serviceName}]. Escalating to SRE PagerDuty on-call.`,
      inc.serviceName
    );
    this.addAuditRecord('Operator', this.userRole, 'REJECT_L3_ACTION', inc.serviceName, `Operator declined L3 remediation for incident ${inc.id}. Escalated to manual diagnostics.`);
    this.notify();
  }

  public executeRemediation(svc: Microservice, incident: Incident): void {
    const profile = RELIABILITY_PROFILES[this.metrics.activeProfile] || RELIABILITY_PROFILES.standard;
    const initial = INITIAL_SERVICES.find((i) => i.id === svc.id) || svc;

    if (this.metrics.dryRunMode) {
      incident.status = 'resolved';
      incident.plainSummary = `[DRY-RUN] Simulating ${incident.actionTaken} for ${svc.name}. No container modification occurred. Telemetry unhealed.`;
      this.notify();
      return;
    }

    svc.status = 'healing';

    setTimeout(() => {
      svc.fault = 'none';
      svc.faultStartTime = null;
      svc.status = 'healthy';
      svc.rssMb = initial.rssMb + Math.random() * 8;
      svc.cpuPct = initial.cpuPct;
      svc.zombies = 0;
      svc.mmapRate = initial.mmapRate;
      svc.anomalyScore = 0.04;
      svc.predictiveFailure5mPct = 1.8;
      svc.predictiveTrend = 'stable';
      svc.estimatedTimeToCrashSec = null;
      svc.restartsCount += incident.actionTaken === 'restart_container' ? 1 : 0;
      svc.lastHealedTime = Date.now();

      const elapsed = Math.max(1400, Date.now() - incident.timestamp);
      incident.status = 'resolved';
      incident.mttrMs = elapsed;

      // MTTR savings vs 30 min (1800s) manual SRE baseline
      const hoursSaved = (1800 - elapsed / 1000) / 3600;
      const dollarsSaved = Math.round(hoursSaved * profile.revenueLossPerHourUsd);
      const gramsCarbonSaved = Math.round(hoursSaved * 1250);

      incident.costSavedUsd = dollarsSaved;
      incident.carbonSavedGrams = gramsCarbonSaved;

      this.metrics.totalIncidentsResolved += 1;
      this.metrics.preventedOutages += 1;
      this.metrics.totalCostSavedUsd += dollarsSaved;
      this.metrics.totalCarbonSavedKg += gramsCarbonSaved / 1000;
      this.metrics.averageMttrMs = Math.round(
        (this.metrics.averageMttrMs * (this.metrics.totalIncidentsResolved - 1) + elapsed) / this.metrics.totalIncidentsResolved
      );

      this.addStreamLog(
        'success',
        'ORCHESTRATOR',
        `Container [${svc.name}] micro-healed via ${incident.actionTaken}. Telemetry normalized (RSS: ${Math.round(
          svc.rssMb
        )}MB, CPU: ${Math.round(svc.cpuPct)}%). MTTR: ${(elapsed / 1000).toFixed(2)}s.`,
        svc.name
      );

      this.addAuditRecord('Sentinel-Agent', 'admin', 'RESOLVED_REMEDIATION', svc.name, `Autonomous micro-recovery completed in ${(elapsed / 1000).toFixed(2)}s. Cost saved: $${dollarsSaved.toLocaleString()}`);

      this.notify();
    }, 1400);
  }

  public runChaosSuite(onProgress: (done: number, total: number) => void): Promise<ChaosRunResult[]> {
    return new Promise((resolve) => {
      const services = ['payment-svc', 'auth-svc', 'db-proxy', 'frontend-edge', 'cache-cluster'];
      const faults: FaultType[] = ['memory_leak', 'zombie_horde', 'cpu_hog'];
      const total = 15;
      let count = 0;
      const newRuns: ChaosRunResult[] = [];

      const interval = setInterval(() => {
        if (count >= total) {
          clearInterval(interval);
          this.chaosRuns = [...newRuns, ...this.chaosRuns].slice(0, 50);
          this.notify();
          resolve(this.chaosRuns);
          return;
        }

        const svcId = services[count % services.length];
        const fault = faults[Math.floor(count / services.length)];
        const detected = Math.round(380 + Math.random() * 400);
        const healed = Math.round(1200 + Math.random() * 2200);

        let action: RemediationAction = 'restart_container';
        if (fault === 'zombie_horde') action = 'reap_zombies';
        if (fault === 'cpu_hog') action = 'apply_cgroup_limit';

        const run: ChaosRunResult = {
          runId: 200 + count,
          service: svcId,
          fault,
          detectedTimeMs: detected,
          actionTaken: action,
          healedTimeMs: healed,
          sentinelMttrMs: healed,
          manualBaselineSec: 1800,
          preCrashPrevented: true,
          falsePositive: false,
          timestamp: Date.now(),
        };

        newRuns.unshift(run);
        count++;
        onProgress(count, total);
      }, 250);
    });
  }

  public tick(): void {
    this.tickCounter++;
    const now = Date.now();
    const profile = RELIABILITY_PROFILES[this.metrics.activeProfile] || RELIABILITY_PROFILES.standard;

    this.services.forEach((svc) => {
      const initial = INITIAL_SERVICES.find((i) => i.id === svc.id) || svc;

      if (svc.status === 'crashed' || svc.status === 'healing') {
        return;
      }

      if (svc.fault === 'none') {
        svc.cpuPct = Math.max(2, Math.min(45, initial.cpuPct + (Math.random() * 4 - 2)));
        svc.rssMb = Math.max(20, initial.rssMb + (Math.random() * 6 - 3));
        svc.zombies = 0;
        svc.mmapRate = Math.max(5, initial.mmapRate + (Math.random() * 4 - 2));
        svc.anomalyScore = Math.max(0.01, 0.03 + Math.random() * 0.04);
        svc.predictiveFailure5mPct = Math.max(0.4, Math.min(4.8, Number((svc.anomalyScore * 30 + Math.random()).toFixed(1))));
        svc.predictiveTrend = 'stable';
        svc.estimatedTimeToCrashSec = null;
        svc.uptimeSec += 1;
      } else {
        const elapsedSec = svc.faultStartTime ? (now - svc.faultStartTime) / 1000 : 1;

        if (svc.fault === 'memory_leak') {
          const delta = 16 + Math.random() * 8;
          svc.rssMb = Math.min(svc.maxRssMb + 20, svc.rssMb + delta);
          svc.mmapRate = Math.min(500, 180 + Math.random() * 140);
          svc.cpuPct = Math.min(65, svc.cpuPct + 2.5);
          const ratio = svc.rssMb / svc.maxRssMb;
          svc.anomalyScore = Math.min(0.99, Math.max(0.2, ratio * 0.85 + (svc.mmapRate / 500) * 0.25));

          if (svc.rssMb >= svc.maxRssMb && !this.metrics.sentinelEnabled) {
            svc.status = 'crashed';
            svc.anomalyScore = 1.0;
            svc.predictiveFailure5mPct = 100;
            svc.predictiveTrend = 'critical';
            svc.estimatedTimeToCrashSec = 0;
            this.addStreamLog(
              'warn',
              'eBPF',
              `CRASH! [${svc.name}] OOMKilled (${Math.round(svc.rssMb)}MB / ${svc.maxRssMb}MB). Sentinel is DISARMED. PagerDuty alert fired.`,
              svc.name
            );
            return;
          }
        } else if (svc.fault === 'zombie_horde') {
          svc.zombies = Math.min(180, svc.zombies + Math.floor(3 + Math.random() * 5));
          svc.mmapRate = Math.max(10, initial.mmapRate + Math.random() * 6);
          svc.cpuPct = Math.min(75, svc.cpuPct + 3);
          const ratio = svc.zombies / 100;
          svc.anomalyScore = Math.min(0.99, Math.max(0.2, ratio * 0.75 + 0.2));

          if (svc.zombies >= 120 && !this.metrics.sentinelEnabled) {
            svc.status = 'crashed';
            svc.predictiveFailure5mPct = 100;
            svc.predictiveTrend = 'critical';
            svc.estimatedTimeToCrashSec = 0;
            this.addStreamLog('warn', 'eBPF', `CRASH! [${svc.name}] PID table exhaustion (${svc.zombies} unreaped zombies). Sentinel is DISARMED.`, svc.name);
            return;
          }
        } else if (svc.fault === 'cpu_hog') {
          svc.cpuPct = Math.min(100, svc.cpuPct + 18 + Math.random() * 5);
          svc.mmapRate = initial.mmapRate + Math.random() * 10;
          const ratio = svc.cpuPct / 100;
          svc.anomalyScore = Math.min(0.99, Math.max(0.3, ratio * 0.88));

          if (svc.cpuPct >= 99 && elapsedSec > 8 && !this.metrics.sentinelEnabled) {
            svc.status = 'crashed';
            svc.predictiveFailure5mPct = 100;
            svc.predictiveTrend = 'critical';
            svc.estimatedTimeToCrashSec = 0;
            this.addStreamLog('warn', 'eBPF', `CRASH! [${svc.name}] CPU lockup / thread deadlock (100% quota). Sentinel is DISARMED.`, svc.name);
            return;
          }
        } else if (svc.fault === 'io_thrash') {
          svc.cpuPct = Math.min(85, svc.cpuPct + 10);
          svc.mmapRate = Math.min(400, svc.mmapRate + 35);
          svc.anomalyScore = Math.min(0.95, Math.max(0.25, 0.4 + (svc.mmapRate / 400) * 0.5));
        } else if (svc.fault === 'socket_leak') {
          svc.cpuPct = Math.min(70, svc.cpuPct + 6);
          svc.anomalyScore = Math.min(0.92, Math.max(0.3, 0.45 + Math.random() * 0.3));
        }

        const ttf = this.calculateTimeToFailure(svc);
        svc.estimatedTimeToCrashSec = ttf;
        let trend: 'stable' | 'rising' | 'declining' | 'critical' = 'rising';
        if (svc.history && svc.history.length >= 2) {
          const prevScore = svc.history[svc.history.length - 1].anomalyScore;
          const deltaScore = svc.anomalyScore - prevScore;
          trend = svc.anomalyScore >= 0.7 || (ttf !== null && ttf <= 45) ? 'critical' : deltaScore > 0.01 ? 'rising' : deltaScore < -0.01 ? 'declining' : 'stable';
        }
        svc.predictiveTrend = trend;

        if (ttf !== null && ttf <= 300) {
          const factor = 1 - ttf / 300;
          const prob = Math.min(99.6, Math.max(28, factor * 62 + svc.anomalyScore * 34 + (trend === 'critical' ? 8 : 0)));
          svc.predictiveFailure5mPct = Number(prob.toFixed(1));
        } else {
          const prob = Math.min(62, Math.max(10, svc.anomalyScore * 58));
          svc.predictiveFailure5mPct = Number(prob.toFixed(1));
        }

        // Anomaly trigger check
        if (
          this.metrics.sentinelEnabled &&
          svc.anomalyScore >= profile.anomalyThreshold &&
          !this.incidents.find(
            (e) =>
              e.serviceId === svc.id &&
              (e.status === 'detecting' || e.status === 'awaiting_approval' || e.status === 'executing' || e.status === 'verifying')
          )
        ) {
          const incidentId = `inc-${Date.now().toString().slice(-6)}`;
          let action: RemediationAction = 'restart_container';
          if (svc.fault === 'zombie_horde') action = 'reap_zombies';
          else if (svc.fault === 'cpu_hog') action = 'apply_cgroup_limit';
          else if (svc.id === 'cache-cluster') action = 'flush_cache';

          let level: ActionLevel = profile.defaultActionLevel;
          if (svc.isProtected) {
            level = 'L3';
          }

          const explainability = this.computeExplainability(svc);
          const summary = this.generateSummary(svc, action, level);

          const newIncident: Incident = {
            id: incidentId,
            timestamp: now,
            serviceId: svc.id,
            serviceName: svc.name,
            faultType: svc.fault,
            anomalyScore: svc.anomalyScore,
            severity: svc.anomalyScore > 0.85 ? 'critical' : 'high',
            actionLevel: level,
            actionTaken: action,
            status: level === 'L3' ? 'awaiting_approval' : 'executing',
            mttrMs: null,
            explainability,
            plainSummary: summary,
            costSavedUsd: 0,
            carbonSavedGrams: 0,
          };

          this.incidents.unshift(newIncident);
          this.addStreamLog(
            'warn',
            'ML_ENGINE',
            `Anomaly flagged on [${svc.name}]: score ${(svc.anomalyScore * 100).toFixed(0)}% (threshold: ${(
              profile.anomalyThreshold * 100
            ).toFixed(0)}%). Level: ${level}. Action: ${action}`,
            svc.name
          );

          if (level === 'L3') {
            this.pendingApprovalIncidentId = incidentId;
            this.addStreamLog(
              'action',
              'SECURITY',
              `Level 3 Human-in-the-Loop Gate engaged for [${svc.name}]. Awaiting Operator approval before touching cgroup.`,
              svc.name
            );
          } else {
            this.addStreamLog('action', 'ORCHESTRATOR', `Initiated autonomous ${level} micro-action [${action}] on [${svc.name}].`, svc.name);
            svc.status = 'healing';
            setTimeout(() => {
              this.executeRemediation(svc, newIncident);
            }, 1400);
          }
        }
      }

      const ttfVal = this.calculateTimeToFailure(svc);
      svc.history.push({
        timestamp: now,
        rssMb: Math.round(svc.rssMb),
        maxRssMb: svc.maxRssMb,
        cpuPct: Math.round(svc.cpuPct),
        cpuQuotaPct: 100,
        zombieCount: svc.zombies,
        mmapRate: Math.round(svc.mmapRate),
        ioWaitMs: Number((1.2 + (svc.cpuPct > 70 ? 4.5 : 0.4)).toFixed(1)),
        anomalyScore: Number(svc.anomalyScore.toFixed(3)),
        timeToFailureSec: ttfVal,
      });

      if (svc.history.length > 30) {
        svc.history.shift();
      }
    });

    this.notify();
  }

  public calculateTimeToFailure(svc: Microservice): number | null {
    if (svc.fault === 'memory_leak') {
      const remaining = svc.maxRssMb - svc.rssMb;
      return remaining <= 0 ? 0 : Math.max(1, Math.round(remaining / 18));
    }
    if (svc.fault === 'zombie_horde') {
      const remaining = 120 - svc.zombies;
      return remaining <= 0 ? 0 : Math.max(1, Math.round(remaining / 4));
    }
    if (svc.fault === 'cpu_hog') {
      const remaining = 100 - svc.cpuPct;
      return remaining <= 0 ? 0 : Math.max(1, Math.round(remaining / 3));
    }
    return null;
  }

  public computeExplainability(svc: Microservice): ExplainabilityFeature[] {
    if (svc.fault === 'memory_leak') {
      return [
        {
          featureName: 'RSS Memory Velocity (cgroup.memory.current)',
          value: `+${Math.round(svc.rssMb * 0.14)} MB/min`,
          weightPct: 52,
          direction: 'critical',
          baseline: '< 1.5 MB/min',
        },
        {
          featureName: 'sys_enter_mmap syscall spike',
          value: `${Math.round(svc.mmapRate)}/s`,
          weightPct: 31,
          direction: 'critical',
          baseline: '15/s',
        },
        {
          featureName: 'Page fault anomaly index',
          value: '4.8x normal',
          weightPct: 17,
          direction: 'elevated',
          baseline: '1.0x',
        },
      ];
    }
    if (svc.fault === 'zombie_horde') {
      return [
        {
          featureName: 'Unreaped State Z processes (sched_process_exit)',
          value: `${svc.zombies} zombies`,
          weightPct: 58,
          direction: 'critical',
          baseline: '0',
        },
        {
          featureName: 'PID namespace exhaustion vector',
          value: `${Math.round((svc.zombies / 200) * 100)}% cap`,
          weightPct: 28,
          direction: 'critical',
          baseline: '< 2%',
        },
        {
          featureName: 'wait4() syscall imbalance',
          value: '0 / 140 forks',
          weightPct: 14,
          direction: 'elevated',
          baseline: '1:1 ratio',
        },
      ];
    }
    if (svc.fault === 'cpu_hog') {
      return [
        {
          featureName: 'cgroup cpu.stat runaway quota',
          value: `${Math.round(svc.cpuPct)}% capacity`,
          weightPct: 54,
          direction: 'critical',
          baseline: '12-25%',
        },
        {
          featureName: 'Thread context switch storm',
          value: '18,400/s',
          weightPct: 29,
          direction: 'critical',
          baseline: '< 2,500/s',
        },
        {
          featureName: 'Kernel runqueue latency (perf)',
          value: '14.2 ms',
          weightPct: 17,
          direction: 'elevated',
          baseline: '< 0.8 ms',
        },
      ];
    }
    return [
      {
        featureName: 'General telemetry entropy',
        value: 'Nominal',
        weightPct: 100,
        direction: 'nominal',
        baseline: 'Nominal',
      },
    ];
  }

  public generateSummary(svc: Microservice, action: RemediationAction, level: ActionLevel): string {
    const actionClean = action.replace(/_/g, ' ');
    if (level === 'L3') {
      return `L3 Human Approval Gate required for protected node [${svc.name}]. Detected abnormal ${svc.fault.replace(
        /_/g,
        ' '
      )} with anomaly score ${(svc.anomalyScore * 100).toFixed(0)}%. Action proposed: ${actionClean}.`;
    }
    return `Autonomous Sentinel ${level} recovery: Detected ${svc.fault.replace(/_/g, ' ')} on [${
      svc.name
    }]. Initiated micro-action [${actionClean}]. Surrounding peer containers remain 100% nominal with 0 cascade impact.`;
  }

  public startSimulation(): void {
    if (this.timer) return;
    this.timer = window.setInterval(() => {
      this.tick();
    }, 1200);
  }

  public stopSimulation(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  public isSimulationRunning(): boolean {
    return this.timer !== null;
  }
}

export const sentinelStore = new SentinelStore();
