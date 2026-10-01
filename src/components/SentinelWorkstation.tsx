import React, { useState, useEffect } from 'react';
import { 
  ServiceNode, 
  ReliabilityProfile, 
  IncidentRecord, 
  AuditLogItem, 
  StreamLogItem 
} from '../types/scyld';
import { PROFILES } from '../data/scyldData';
import { 
  Activity, 
  AlertTriangle, 
  Shield, 
  CheckCircle2, 
  Zap, 
  RefreshCw, 
  Lock, 
  Server, 
  Cpu, 
  HardDrive, 
  GitCompare, 
  Sliders, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Leaf, 
  Terminal, 
  Check, 
  X,
  Play,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface SentinelWorkstationProps {
  services: ServiceNode[];
  setServices: React.Dispatch<React.SetStateAction<ServiceNode[]>>;
  incidents: IncidentRecord[];
  setIncidents: React.Dispatch<React.SetStateAction<IncidentRecord[]>>;
  auditLogs: AuditLogItem[];
  setAuditLogs: React.Dispatch<React.SetStateAction<AuditLogItem[]>>;
  addStreamLog: (level: StreamLogItem['level'], subsystem: StreamLogItem['subsystem'], message: string, service?: string) => void;
  activeProfileKey: string;
  setActiveProfileKey: (key: string) => void;
  onOpenCopilot: () => void;
}

export const SentinelWorkstation: React.FC<SentinelWorkstationProps> = ({
  services,
  setServices,
  incidents,
  setIncidents,
  auditLogs,
  setAuditLogs,
  addStreamLog,
  activeProfileKey,
  setActiveProfileKey,
  onOpenCopilot,
}) => {
  const [activeTab, setActiveTab] = useState<'fleet' | 'inject' | 'timeline' | 'compare' | 'matrix' | 'audit' | 'impact'>('fleet');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('payment-svc');
  const [chaosRunning, setChaosRunning] = useState(false);
  const [chaosResults, setChaosResults] = useState<{ id: string; service: string; fault: string; status: 'passed' | 'running' | 'failed'; mttr: string }[]>([
    { id: '1', service: 'payment-service', fault: 'Heap Malloc Leak', status: 'passed', mttr: '3.12s' },
    { id: '2', service: 'auth-identity-service', fault: 'Zombie Thread Horde', status: 'passed', mttr: '420ms' },
    { id: '3', service: 'edge-gateway-router', fault: 'Socket Descriptor Spike', status: 'passed', mttr: '1.85s' },
  ]);

  const currentProfile = PROFILES[activeProfileKey] || PROFILES.standard;

  // Real-time ticker for telemetry drift and auto-recovery simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setServices(prev => prev.map(s => {
        let { rssMb, cpuPct, anomalyScore, status, fault, predictiveFailure5mPct, restartsCount } = s;

        if (fault === 'memory_leak') {
          rssMb = Math.min(s.maxRssMb, rssMb + 18);
          anomalyScore = Math.min(0.99, Number((anomalyScore + 0.05).toFixed(2)));
          predictiveFailure5mPct = Math.min(99.4, Number((predictiveFailure5mPct + 6.5).toFixed(1)));
          status = anomalyScore > 0.7 ? 'critical' : 'warning';
        } else if (fault === 'cpu_hog') {
          cpuPct = Math.min(99, cpuPct + 15);
          anomalyScore = Math.min(0.95, Number((anomalyScore + 0.06).toFixed(2)));
          status = anomalyScore > 0.65 ? 'critical' : 'warning';
        } else if (fault === 'zombie_horde') {
          anomalyScore = Math.min(0.85, Number((anomalyScore + 0.04).toFixed(2)));
          status = 'warning';
        } else if (status === 'healing') {
          // transitioning back to healthy
          rssMb = Math.max(110, rssMb - 40);
          cpuPct = Math.max(12, cpuPct - 15);
          anomalyScore = Math.max(0.04, Number((anomalyScore - 0.15).toFixed(2)));
          predictiveFailure5mPct = Math.max(2.0, Number((predictiveFailure5mPct - 8).toFixed(1)));
          if (anomalyScore <= 0.08) {
            status = 'healthy';
            fault = 'none';
          }
        } else {
          // slight normal jitter
          cpuPct = Math.max(5, Math.min(35, cpuPct + (Math.random() * 4 - 2)));
          rssMb = Math.max(80, Math.min(s.maxRssMb * 0.7, rssMb + (Math.random() * 2 - 1)));
          anomalyScore = Math.max(0.02, Math.min(0.09, Number((anomalyScore + (Math.random() * 0.02 - 0.01)).toFixed(2))));
        }

        return {
          ...s,
          rssMb: Math.round(rssMb),
          cpuPct: Math.round(cpuPct),
          anomalyScore,
          predictiveFailure5mPct,
          status,
          fault,
        };
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [setServices]);

  // Fault Injection Handler
  const handleInjectFault = (svcId: string, faultType: ServiceNode['fault']) => {
    const svc = services.find(s => s.id === svcId);
    if (!svc) return;

    setServices(prev => prev.map(s => {
      if (s.id !== svcId) return s;
      return {
        ...s,
        fault: faultType,
        faultStartTime: Date.now(),
        status: 'critical',
        anomalyScore: 0.82,
        predictiveFailure5mPct: 88.5,
        rssMb: faultType === 'memory_leak' ? Math.round(s.maxRssMb * 0.88) : s.rssMb,
        cpuPct: faultType === 'cpu_hog' ? 94 : s.cpuPct,
        zombies: faultType === 'zombie_horde' ? 36 : s.zombies,
      };
    }));

    const incidentId = `INC-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Check if node is protected (e.g. db-proxy) -> Requires L3 approval
    const isProtectedNode = svc.isProtected;
    const level = isProtectedNode ? 'L3' : 'L1';
    const status = isProtectedNode ? 'awaiting_approval' : 'auto_remediated';

    const newIncident: IncidentRecord = {
      id: incidentId,
      timestamp: nowTime,
      serviceId: svc.id,
      serviceName: svc.name,
      faultType: faultType.replace('_', ' ').toUpperCase(),
      level,
      status,
      humanApproved: isProtectedNode ? null : true,
      blastRadius: isProtectedNode ? 'Core database proxy - Blast radius high' : 'Cgroup isolated - Zero mesh disruption',
      rootCause: `Synthetic ${faultType} injected via Sentinel Chaos deck.`,
      metricsObserved: `Anomaly: 0.82, Anomaly threshold exceeded (${currentProfile.anomalyThreshold})`,
      actionTaken: isProtectedNode ? 'Awaiting Human Operator Approval (L3 Gate)' : 'Sub-second cgroup micro-recovery (L1)',
      plainSummary: isProtectedNode 
        ? `L3 gate triggered for ${svc.name}. High blast radius requires operator signature before restart.` 
        : `Autonomous Sentinel L1 recovery applied to ${svc.name}. Restored in 3.1s.`,
      costSavedUsd: currentProfile.revenueLossPerHourUsd * 0.15,
      carbonSavedGrams: 420,
    };

    setIncidents(prev => [newIncident, ...prev]);

    addStreamLog('warn', 'eBPF', `[ANOMALY DETECTED] ${svc.name} score=0.82 exceeds profile threshold (${currentProfile.anomalyThreshold})`, svc.name);
    addStreamLog('error', 'KERNEL', `Fault injected: ${faultType.toUpperCase()} on cgroup /sys/fs/cgroup/${svc.name}`, svc.name);

    if (!isProtectedNode) {
      setTimeout(() => {
        // Auto-heal
        handleMicroHeal(svc.id, incidentId);
      }, 3500);
    }
  };

  // Micro heal action
  const handleMicroHeal = (svcId: string, incidentId?: string) => {
    const svc = services.find(s => s.id === svcId);
    if (!svc) return;

    setServices(prev => prev.map(s => {
      if (s.id !== svcId) return s;
      return {
        ...s,
        status: 'healing',
        restartsCount: s.restartsCount + 1,
        lastHealedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };
    }));

    setTimeout(() => {
      setServices(prev => prev.map(s => {
        if (s.id !== svcId) return s;
        return {
          ...s,
          status: 'healthy',
          fault: 'none',
          anomalyScore: 0.04,
          predictiveFailure5mPct: 2.1,
          rssMb: s.category === 'core' ? 142 : 112,
          cpuPct: 12,
          zombies: 0,
        };
      }));

      // Update incident if present
      if (incidentId) {
        setIncidents(prev => prev.map(inc => {
          if (inc.id === incidentId) {
            return {
              ...inc,
              status: 'resolved',
              actionTaken: 'Autonomous micro-recovery executed successfully (3.12s MTTR)',
            };
          }
          return inc;
        }));
      }

      // Add audit log
      const auditItem: AuditLogItem = {
        id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        actorEmail: 'sentinel.daemon@scyld.local',
        actorRole: 'sentinel_agent',
        action: 'L1_MICRO_RESTART',
        targetService: svc.name,
        details: `Autonomous sub-second micro-restart completed. Zero cascade to mesh.`,
        hash: `0x${Math.random().toString(16).substr(2, 14)}`,
      };
      setAuditLogs(prev => [auditItem, ...prev]);

      addStreamLog('success', 'ORCHESTRATOR', `Autonomous recovery completed for ${svc.name}. Zero packet loss.`, svc.name);
    }, 2500);
  };

  // Human approval for L3 gate
  const handleL3Approval = (incidentId: string, approved: boolean) => {
    const inc = incidents.find(i => i.id === incidentId);
    if (!inc) return;

    if (approved) {
      setIncidents(prev => prev.map(i => i.id === incidentId ? { ...i, status: 'resolved', humanApproved: true } : i));
      handleMicroHeal(inc.serviceId, incidentId);
      addStreamLog('success', 'SECURITY', `Operator APPROVED L3 remediation for ${inc.serviceName}. Executing micro-restart.`, inc.serviceName);
    } else {
      setIncidents(prev => prev.map(i => i.id === incidentId ? { ...i, status: 'escalated', humanApproved: false } : i));
      addStreamLog('warn', 'SECURITY', `Operator REJECTED L3 remediation for ${inc.serviceName}. Escalated to manual PagerDuty diagnostics.`, inc.serviceName);
    }
  };

  // Run chaos suite
  const runChaosSuite = () => {
    setChaosRunning(true);
    addStreamLog('warn', 'ORCHESTRATOR', 'Initiating automated chaos engineering sweep across 5 microservices...');
    
    setTimeout(() => {
      setChaosResults([
        { id: '1', service: 'payment-service', fault: 'Heap Malloc Leak', status: 'passed', mttr: '2.84s' },
        { id: '2', service: 'auth-identity-service', fault: 'Zombie Thread Horde', status: 'passed', mttr: '390ms' },
        { id: '3', service: 'db-connection-pooler', fault: 'Cgroup CPU Saturation', status: 'passed', mttr: '3.40s' },
        { id: '4', service: 'edge-gateway-router', fault: 'Socket Descriptor Spike', status: 'passed', mttr: '1.62s' },
        { id: '5', service: 'redis-cache-proxy', fault: 'Memory Fragmentation', status: 'passed', mttr: '2.10s' },
      ]);
      setChaosRunning(false);
      addStreamLog('success', 'ORCHESTRATOR', 'Chaos sweep completed: 5/5 resilient. 0 cascaded failures.');
    }, 3000);
  };

  const clearAllFaults = () => {
    setServices(prev => prev.map(s => ({
      ...s,
      fault: 'none',
      status: 'healthy',
      anomalyScore: 0.04,
      predictiveFailure5mPct: 2.1,
    })));
    addStreamLog('info', 'ORCHESTRATOR', 'Master command: All synthetic faults cleared.');
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#07080a] text-zinc-100 overflow-y-auto">
      {/* Profile Header & Summary */}
      <div className="bg-[#0b0d13] border-b border-zinc-800 px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">Active Reliability Policy Profile</span>
            <span className="text-zinc-600">•</span>
            <span className="text-xs font-mono text-zinc-400">{currentProfile.complianceStandard}</span>
          </div>
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2 mt-0.5">
            <span>{currentProfile.title}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-medium">
              Threshold: {currentProfile.anomalyThreshold}
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">{currentProfile.description}</p>
        </div>

        {/* Profile Switcher & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={activeProfileKey}
            onChange={(e) => setActiveProfileKey(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 hover:border-zinc-600 rounded-md px-3 py-1.5 text-xs font-medium text-zinc-200 focus:outline-none focus:border-amber-500"
          >
            {Object.entries(PROFILES).map(([k, p]) => (
              <option key={k} value={k}>{p.title}</option>
            ))}
          </select>

          <button
            onClick={clearAllFaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 transition-colors"
            title="Reset cluster metrics to healthy baseline"
          >
            <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
            <span>Reset Baseline</span>
          </button>

          <button
            onClick={onOpenCopilot}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-black transition-all shadow-md shadow-amber-500/10"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>SRE Copilot</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-[#090b10] border-b border-zinc-800 px-4 sm:px-6 flex items-center gap-1 sm:gap-2 overflow-x-auto">
        {[
          { id: 'fleet', label: 'Fleet & Radar', icon: Activity, count: services.length },
          { id: 'inject', label: '⚡ Inject Faults', icon: Zap, isHighlight: true },
          { id: 'timeline', label: 'Incidents & Gates', icon: AlertTriangle, count: incidents.filter(i => i.status === 'awaiting_approval').length || undefined },
          { id: 'compare', label: 'A/B Resilience', icon: GitCompare },
          { id: 'matrix', label: 'Chaos Matrix', icon: HardDrive },
          { id: 'audit', label: 'Audit Ledger', icon: Lock },
          { id: 'impact', label: 'ROI & SLA', icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-3 border-b-2 text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'border-amber-400 text-amber-300 font-semibold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-zinc-500'}`} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  tab.id === 'timeline' && tab.count > 0 
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                    : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full">
        {/* TAB 1: FLEET & RADAR */}
        {activeTab === 'fleet' && (
          <div className="space-y-6">
            {/* Top Cluster Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-[#0d0f17] border border-zinc-800/80 rounded-xl p-3.5 sm:p-4">
                <span className="text-[11px] font-mono text-zinc-400">HEALTHY SERVICES</span>
                <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-1 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>{services.filter(s => s.status === 'healthy').length} / {services.length}</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono mt-1 block">eBPF ring buffer synchronized</span>
              </div>

              <div className="bg-[#0d0f17] border border-zinc-800/80 rounded-xl p-3.5 sm:p-4">
                <span className="text-[11px] font-mono text-zinc-400">PROTECTED GATE NODES</span>
                <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400 mt-1 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-amber-400" />
                  <span>{services.filter(s => s.isProtected).length} Nodes</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono mt-1 block">L3 Human Gate Enforced</span>
              </div>

              <div className="bg-[#0d0f17] border border-zinc-800/80 rounded-xl p-3.5 sm:p-4">
                <span className="text-[11px] font-mono text-zinc-400">MICRO-HEALINGS</span>
                <div className="text-xl sm:text-2xl font-bold font-mono text-sky-400 mt-1 flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-sky-400" />
                  <span>{services.reduce((acc, s) => acc + s.restartsCount, 0)} Total</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono mt-1 block">Avg MTTR: 3.12s</span>
              </div>

              <div className="bg-[#0d0f17] border border-zinc-800/80 rounded-xl p-3.5 sm:p-4">
                <span className="text-[11px] font-mono text-zinc-400">UPTIME SLA</span>
                <div className="text-xl sm:text-2xl font-bold font-mono text-lime-400 mt-1 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-lime-400" />
                  <span>99.999%</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono mt-1 block">Zero cascade outage</span>
              </div>
            </div>

            {/* Microservice Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((svc) => {
                const isCritical = svc.status === 'critical';
                const isWarning = svc.status === 'warning';
                const isHealing = svc.status === 'healing';

                return (
                  <div
                    key={svc.id}
                    className={`rounded-xl border transition-all p-4 bg-[#0d0f16] flex flex-col justify-between ${
                      isCritical
                        ? 'border-rose-500/60 shadow-lg shadow-rose-950/30'
                        : isHealing
                        ? 'border-amber-500/60 shadow-lg shadow-amber-950/30 animate-pulse'
                        : isWarning
                        ? 'border-yellow-500/50'
                        : 'border-zinc-800/80 hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-zinc-100">{svc.name}</span>
                            {svc.isProtected && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center gap-1" title="Protected: Requires human approval">
                                <Lock className="w-2.5 h-2.5" />
                                <span>L3</span>
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-400 mt-0.5">{svc.role}</p>
                        </div>

                        {/* Status Badge */}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                          isCritical
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                            : isHealing
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : isWarning
                            ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {svc.status}
                        </span>
                      </div>

                      {/* Gauges & Telemetry */}
                      <div className="mt-4 space-y-2.5 font-mono text-xs">
                        {/* Memory */}
                        <div>
                          <div className="flex justify-between text-zinc-400 text-[11px] mb-1">
                            <span>RSS Memory</span>
                            <span className={svc.rssMb > svc.maxRssMb * 0.8 ? 'text-rose-400 font-bold' : 'text-zinc-300'}>
                              {svc.rssMb}MB / {svc.maxRssMb}MB
                            </span>
                          </div>
                          <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${
                                svc.rssMb > svc.maxRssMb * 0.8 ? 'bg-rose-500' : 'bg-amber-400'
                              }`}
                              style={{ width: `${Math.min(100, (svc.rssMb / svc.maxRssMb) * 100)}%` }}
                            />
                          </div>
                        </div>

                        {/* CPU */}
                        <div>
                          <div className="flex justify-between text-zinc-400 text-[11px] mb-1">
                            <span>CPU Cgroup</span>
                            <span className={svc.cpuPct > 75 ? 'text-rose-400 font-bold' : 'text-zinc-300'}>
                              {svc.cpuPct}%
                            </span>
                          </div>
                          <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${
                                svc.cpuPct > 75 ? 'bg-rose-500' : 'bg-sky-400'
                              }`}
                              style={{ width: `${Math.min(100, svc.cpuPct)}%` }}
                            />
                          </div>
                        </div>

                        {/* eBPF Anomaly Score & Failure Probability */}
                        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
                          <div>
                            <span className="text-zinc-500">Anomaly: </span>
                            <span className={`font-bold ${svc.anomalyScore > currentProfile.anomalyThreshold ? 'text-rose-400' : 'text-emerald-400'}`}>
                              {svc.anomalyScore.toFixed(2)}
                            </span>
                          </div>
                          <div>
                            <span className="text-zinc-500">5m Risk: </span>
                            <span className={svc.predictiveFailure5mPct > 50 ? 'text-rose-400 font-bold' : 'text-zinc-300'}>
                              {svc.predictiveFailure5mPct}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action buttons */}
                    <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center gap-2">
                      <button
                        onClick={() => handleMicroHeal(svc.id)}
                        disabled={svc.status === 'healing'}
                        className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono transition-colors disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3 h-3 text-amber-400 ${svc.status === 'healing' ? 'animate-spin' : ''}`} />
                        <span>Micro-Heal</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedServiceId(svc.id);
                          setActiveTab('inject');
                        }}
                        className="px-2.5 py-1.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono transition-colors"
                        title="Inject fault into this container"
                      >
                        ⚡ Fault
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: INJECT FAULTS */}
        {activeTab === 'inject' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-[#0d0f17] border border-zinc-800 rounded-xl p-5">
              <div className="flex items-center gap-2 text-amber-400 mb-1">
                <Zap className="w-5 h-5" />
                <h3 className="font-bold text-base text-zinc-100">Chaos Injection Engine</h3>
              </div>
              <p className="text-xs text-zinc-400 mb-4">
                Synthetically induce kernel-level degradation to observe sub-second eBPF anomaly detection and zero-cascade micro-recovery.
              </p>

              {/* Target Service Selection */}
              <div className="mb-4">
                <label className="block text-xs font-mono text-zinc-300 mb-1.5">Target Microservice</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {services.map(svc => (
                    <button
                      key={svc.id}
                      onClick={() => setSelectedServiceId(svc.id)}
                      className={`px-3 py-2 rounded-lg border text-left text-xs font-mono transition-all ${
                        selectedServiceId === svc.id
                          ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 font-semibold'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <div className="truncate">{svc.name}</div>
                      <div className="text-[10px] text-zinc-500 truncate">{svc.role}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Fault Types Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {[
                  {
                    id: 'memory_leak',
                    title: 'Heap Memory Leak (malloc bomb)',
                    desc: 'Spikes RSS allocation slope +14.2MB/s via eBPF mmap probe detection.',
                    badge: 'L1 Micro-restart',
                  },
                  {
                    id: 'cpu_hog',
                    title: 'Cgroup CPU Saturation',
                    desc: 'Runaway thread pool spins CPU to 99%, triggering cgroup throttling.',
                    badge: 'L1 Cgroup throttle',
                  },
                  {
                    id: 'zombie_horde',
                    title: 'Zombie Process Horde',
                    desc: 'Accumulates defunct child PIDs without parent waitpid() reaping.',
                    badge: 'L1 Kernel prctl reap',
                  },
                  {
                    id: 'socket_exhaustion',
                    title: 'TCP Socket Exhaustion',
                    desc: 'Saturates ephemeral port pool and envoy connection backlog.',
                    badge: 'L2 Socket recycle',
                  },
                ].map(fault => (
                  <div key={fault.id} className="p-3.5 rounded-lg bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-zinc-200">{fault.title}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
                          {fault.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1">{fault.desc}</p>
                    </div>

                    <button
                      onClick={() => handleInjectFault(selectedServiceId, fault.id as any)}
                      className="mt-3 w-full py-1.5 rounded bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 font-mono text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Inject Fault into {selectedServiceId}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: INCIDENTS & GATES */}
        {activeTab === 'timeline' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-zinc-100 flex items-center gap-2">
                <span>Autonomous Incident Stream & Human Approval Gates</span>
              </h3>
              <span className="text-xs font-mono text-zinc-500">{incidents.length} Records Logged</span>
            </div>

            {incidents.length === 0 ? (
              <div className="p-8 text-center bg-[#0d0f17] border border-zinc-800 rounded-xl text-zinc-400 text-xs">
                No incidents active. Cluster telemetry is operating within healthy parameters.
              </div>
            ) : (
              <div className="space-y-3">
                {incidents.map((inc) => {
                  const isAwaiting = inc.status === 'awaiting_approval';
                  return (
                    <div
                      key={inc.id}
                      className={`p-4 rounded-xl border bg-[#0d0f17] transition-all ${
                        isAwaiting
                          ? 'border-amber-500 shadow-xl shadow-amber-950/20 bg-gradient-to-r from-amber-950/20 to-transparent'
                          : 'border-zinc-800/80'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-amber-400 font-bold">{inc.id}</span>
                          <span className="text-zinc-600">•</span>
                          <span className="font-bold text-sm text-zinc-100">{inc.faultType}</span>
                          <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
                            {inc.serviceName}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-zinc-500">{inc.timestamp}</span>
                          <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold uppercase ${
                            isAwaiting 
                              ? 'bg-amber-500 text-black animate-pulse'
                              : inc.status === 'resolved'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-zinc-800 text-zinc-300'
                          }`}>
                            {inc.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-zinc-300 mt-2">{inc.plainSummary}</p>

                      <div className="mt-3 pt-3 border-t border-zinc-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-zinc-400">
                        <div>
                          <span className="text-zinc-500">Root Cause: </span>
                          <span>{inc.rootCause}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500">Observed: </span>
                          <span className="text-zinc-300">{inc.metricsObserved}</span>
                        </div>
                      </div>

                      {/* L3 Human Approval Gate Buttons */}
                      {isAwaiting && (
                        <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2 text-xs text-amber-300">
                            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                            <span><strong>L3 Gate Enforced:</strong> Core database node blast-radius requires human authorization to restart.</span>
                          </div>

                          <div className="flex items-center gap-2 ml-auto">
                            <button
                              onClick={() => handleL3Approval(inc.id, false)}
                              className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono transition-colors"
                            >
                              Reject & Escalate
                            </button>
                            <button
                              onClick={() => handleL3Approval(inc.id, true)}
                              className="px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs font-mono transition-colors flex items-center gap-1.5"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Authorize L3 Remediation</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: A/B RESILIENCE COMPARISON */}
        {activeTab === 'compare' && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto">
              <h3 className="text-lg font-bold text-zinc-100">A/B Resilience Benchmark</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Standard Kubernetes/Docker pod lifecycle vs. ScyldAI Sentinel-Node eBPF kernel self-healing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Unmanaged Baseline */}
              <div className="p-5 rounded-xl border border-rose-900/50 bg-[#100c0f] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-rose-400 font-bold mb-2">
                    <X className="w-5 h-5 text-rose-500" />
                    <span>Traditional Unmanaged Baseline</span>
                  </div>
                  <p className="text-xs text-zinc-400 mb-4">
                    Kubelet liveness probe failure with cascading socket freeze.
                  </p>

                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between py-1.5 border-b border-rose-950">
                      <span className="text-zinc-400">Mean Time to Recovery (MTTR)</span>
                      <span className="text-rose-400 font-bold">42 minutes (Manual On-Call)</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-rose-950">
                      <span className="text-zinc-400">Blast Radius</span>
                      <span className="text-rose-400">Cascaded to DB Pooler & Ingress</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-rose-950">
                      <span className="text-zinc-400">Downtime Revenue Loss</span>
                      <span className="text-rose-400 font-bold">$58,000 USD</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-rose-950">
                      <span className="text-zinc-400">Packet Loss / Dropped Trx</span>
                      <span className="text-rose-400">14,200 failed transactions</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-3 rounded bg-rose-950/40 text-[11px] text-rose-300 font-mono">
                  Result: Complete service outage requiring manual incident bridge and retrospective post-mortem.
                </div>
              </div>

              {/* ScyldAI Sentinel-Node */}
              <div className="p-5 rounded-xl border border-emerald-500/50 bg-[#0c120f] shadow-lg shadow-emerald-950/20 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>ScyldAI Sentinel-Node Agent</span>
                  </div>
                  <p className="text-xs text-zinc-400 mb-4">
                    Autonomous kernel eBPF probe + sub-second micro-recovery.
                  </p>

                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between py-1.5 border-b border-emerald-950">
                      <span className="text-zinc-400">Mean Time to Recovery (MTTR)</span>
                      <span className="text-emerald-400 font-bold">3.12 seconds (Autonomous)</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-emerald-950">
                      <span className="text-zinc-400">Blast Radius</span>
                      <span className="text-emerald-400">Zero Cascade (Cgroup Confined)</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-emerald-950">
                      <span className="text-zinc-400">Downtime Revenue Loss</span>
                      <span className="text-emerald-400 font-bold">$0.00 USD (99.999% SLA)</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-emerald-950">
                      <span className="text-zinc-400">Packet Loss / Dropped Trx</span>
                      <span className="text-emerald-400">0 packets dropped (Mesh buffered)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-3 rounded bg-emerald-950/40 text-[11px] text-emerald-300 font-mono">
                  Result: Invisible self-healing. Telemetry restored prior to user-facing latency breach.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CHAOS MATRIX */}
        {activeTab === 'matrix' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-zinc-100">Automated Chaos Engineering Matrix</h3>
                <p className="text-xs text-zinc-400">Continuous background resilience verification</p>
              </div>

              <button
                onClick={runChaosSuite}
                disabled={chaosRunning}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition-colors disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 ${chaosRunning ? 'animate-spin' : ''}`} />
                <span>{chaosRunning ? 'Running Sweep...' : 'Run Chaos Suite'}</span>
              </button>
            </div>

            <div className="border border-zinc-800 rounded-xl overflow-hidden bg-[#0d0f17]">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400">
                    <th className="p-3">TARGET SERVICE</th>
                    <th className="p-3">FAULT VECTOR</th>
                    <th className="p-3">STATUS</th>
                    <th className="p-3">MTTR</th>
                    <th className="p-3">RELIABILITY RESULT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80">
                  {chaosResults.map(r => (
                    <tr key={r.id} className="hover:bg-zinc-800/30">
                      <td className="p-3 font-semibold text-zinc-200">{r.service}</td>
                      <td className="p-3 text-zinc-300">{r.fault}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {r.status}
                        </span>
                      </td>
                      <td className="p-3 text-amber-300 font-bold">{r.mttr}</td>
                      <td className="p-3 text-zinc-400 text-[11px]">Zero cascade, 100% telemetry restored</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: AUDIT LEDGER */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-base text-zinc-100">Cryptographic Audit Ledger</h3>
              <p className="text-xs text-zinc-400">Immutable trace of all autonomous kernel interventions and operator approvals</p>
            </div>

            <div className="border border-zinc-800 rounded-xl overflow-hidden bg-[#0d0f17]">
              <div className="divide-y divide-zinc-800/80 font-mono text-xs">
                {auditLogs.map(log => (
                  <div key={log.id} className="p-3.5 hover:bg-zinc-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-400">{log.action}</span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-zinc-300">{log.targetService}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                          {log.actorRole}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1 font-sans">{log.details}</p>
                    </div>

                    <div className="sm:text-right shrink-0">
                      <div className="text-zinc-500 text-[11px]">{log.timestamp}</div>
                      <div className="text-[10px] text-zinc-600 font-mono mt-0.5">{log.hash}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: ROI & SLA */}
        {activeTab === 'impact' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-base text-zinc-100">Business Impact & Operational SLA</h3>
              <p className="text-xs text-zinc-400">Financial, infrastructure, and carbon savings achieved through autonomous healing</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl border border-zinc-800 bg-[#0d0f17]">
                <div className="flex items-center gap-2 text-emerald-400 mb-1">
                  <DollarSign className="w-5 h-5" />
                  <span className="font-mono text-xs uppercase text-zinc-400">DOWNTIME PRESERVED</span>
                </div>
                <div className="text-3xl font-bold font-mono text-emerald-400 mt-2">$248,500</div>
                <p className="text-xs text-zinc-500 mt-1">Calculated based on {currentProfile.title} hourly loss rate ($ {currentProfile.revenueLossPerHourUsd.toLocaleString()}/hr)</p>
              </div>

              <div className="p-5 rounded-xl border border-zinc-800 bg-[#0d0f17]">
                <div className="flex items-center gap-2 text-sky-400 mb-1">
                  <Clock className="w-5 h-5" />
                  <span className="font-mono text-xs uppercase text-zinc-400">HOURS SAVED</span>
                </div>
                <div className="text-3xl font-bold font-mono text-sky-400 mt-2">14.8 hrs</div>
                <p className="text-xs text-zinc-500 mt-1">Manual sysadmin waking hours and high-severity PagerDuty bridge time eliminated</p>
              </div>

              <div className="p-5 rounded-xl border border-zinc-800 bg-[#0d0f17]">
                <div className="flex items-center gap-2 text-lime-400 mb-1">
                  <Leaf className="w-5 h-5" />
                  <span className="font-mono text-xs uppercase text-zinc-400">CARBON OFFSET</span>
                </div>
                <div className="text-3xl font-bold font-mono text-lime-400 mt-2">18.4 kg</div>
                <p className="text-xs text-zinc-500 mt-1">Prevented redundant retry storms and cold container restart emissions</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
