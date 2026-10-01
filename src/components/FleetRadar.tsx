import React from 'react';
import {
  Server,
  Lock,
  Unlock,
  AlertTriangle,
  Zap,
  TrendingUp,
  Cpu,
  Database,
  BarChart3,
  Clock,
  Shield,
  Activity,
  Flame,
  Skull,
} from 'lucide-react';
import { Microservice, FaultType, UserRole } from '../types';

interface FleetRadarProps {
  services: Microservice[];
  anomalyThreshold: number;
  selectedServiceId: string;
  userRole: UserRole;
  onInjectFault: (serviceId: string, fault: FaultType) => void;
  onToggleProtect: (serviceId: string, isProtected: boolean) => void;
  onSelectServiceForTelemetry: (serviceId: string) => void;
}

export const FleetRadar: React.FC<FleetRadarProps> = ({
  services,
  anomalyThreshold,
  selectedServiceId,
  userRole,
  onInjectFault,
  onToggleProtect,
  onSelectServiceForTelemetry,
}) => {
  const isAdmin = userRole === 'admin';

  // Helper to generate SVG sparkline points
  const generateSparkline = (points: number[], maxVal: number, width = 120, height = 32) => {
    if (!points || points.length < 2) return null;
    const step = width / (points.length - 1);
    const coords = points.map((val, idx) => {
      const normalized = Math.min(1, Math.max(0, val / (maxVal || 1)));
      const x = idx * step;
      const y = height - normalized * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return coords.join(' ');
  };

  return (
    <div className="space-y-4 text-zinc-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold tracking-tight text-white font-sans uppercase">
            Microservice Fleet & eBPF Cgroup Radar
          </h3>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
            5 Active Nodes
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Healthy (&lt;{(anomalyThreshold * 100).toFixed(0)}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Degraded</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>Self-Healing</span>
          </div>
        </div>
      </div>

      {/* Grid of Microservice Container Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {services.map((svc) => {
          const isSelected = svc.id === selectedServiceId;
          const isFaulty = svc.fault !== 'none';
          const isAnomalous = svc.anomalyScore >= anomalyThreshold;
          const memoryPct = Math.min(100, Math.round((svc.rssMb / svc.maxRssMb) * 100));
          const rssHistory = svc.history.map((h) => h.rssMb);
          const sparklinePath = generateSparkline(rssHistory, svc.maxRssMb);

          return (
            <div
              key={svc.id}
              className={`rounded-2xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#12151e] border-emerald-500/60 shadow-xl shadow-emerald-950/20 ring-1 ring-emerald-500/30'
                  : svc.status === 'degraded'
                  ? 'bg-[#161212] border-amber-500/50 shadow-lg shadow-amber-950/20'
                  : svc.status === 'healing'
                  ? 'bg-[#0f171b] border-cyan-500/50 shadow-lg shadow-cyan-950/20'
                  : svc.status === 'crashed'
                  ? 'bg-[#1a0f0f] border-rose-500/60 shadow-lg shadow-rose-950/20'
                  : 'bg-[#0c0e14] border-zinc-800/80 hover:border-zinc-700/80'
              }`}
            >
              {/* Top Accent Strip */}
              <div
                className={`h-1 w-full ${
                  svc.status === 'healthy'
                    ? 'bg-emerald-500/50'
                    : svc.status === 'degraded'
                    ? 'bg-amber-500'
                    : svc.status === 'healing'
                    ? 'bg-cyan-500 animate-pulse'
                    : 'bg-rose-600'
                }`}
              />

              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                {/* Header: Name, Category, Protection Toggle */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-2 rounded-xl border ${
                          svc.category === 'core'
                            ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                            : svc.category === 'edge'
                            ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                            : 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                        }`}
                      >
                        <Server className="w-4 h-4" />
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-white font-mono">{svc.name}</h4>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 border border-zinc-700 uppercase">
                            {svc.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 font-sans mt-0.5">{svc.role}</p>
                      </div>
                    </div>

                    {/* Protect Toggle Button */}
                    <button
                      onClick={() => {
                        if (!isAdmin) {
                          alert('Administrator privileges required to toggle protected services.');
                          return;
                        }
                        onToggleProtect(svc.id, !svc.isProtected);
                      }}
                      title={
                        svc.isProtected
                          ? 'Protected Service: Requires L3 Human Approval before applying remediations'
                          : 'Standard Node: L1 Autonomous Micro-Recovery enabled'
                      }
                      className={`p-1.5 rounded-lg border text-xs transition-all ${
                        svc.isProtected
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {svc.isProtected ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Status & Sparkline row */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1 ${
                          svc.status === 'healthy'
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40'
                            : svc.status === 'degraded'
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 animate-pulse'
                            : svc.status === 'healing'
                            ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 animate-pulse'
                            : 'bg-rose-500/15 text-rose-300 border border-rose-500/40'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            svc.status === 'healthy'
                              ? 'bg-emerald-400'
                              : svc.status === 'degraded'
                              ? 'bg-amber-400'
                              : svc.status === 'healing'
                              ? 'bg-cyan-400'
                              : 'bg-rose-500'
                          }`}
                        />
                        {svc.status}
                      </span>

                      {isFaulty && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30">
                          {svc.fault.replace(/_/g, ' ')}
                        </span>
                      )}
                    </div>

                    {/* SVG Sparkline for live trajectory */}
                    {sparklinePath && (
                      <div className="w-24 h-6">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 120 32">
                          <polyline
                            fill="none"
                            stroke={isAnomalous ? '#f59e0b' : '#10b981'}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points={sparklinePath}
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Metrics 4-cell Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  {/* Memory Box */}
                  <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-xl p-2.5">
                    <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-1">
                      <span>cgroup RSS</span>
                      <span className={`${memoryPct > 80 ? 'text-rose-400 font-bold' : 'text-zinc-300'}`}>
                        {memoryPct}%
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white">
                      {Math.round(svc.rssMb)} <span className="text-[10px] text-zinc-400 font-normal">/ {svc.maxRssMb}MB</span>
                    </div>
                    {/* Mini bar */}
                    <div className="w-full bg-zinc-800 rounded-full h-1 mt-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          memoryPct > 85 ? 'bg-rose-500' : memoryPct > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${memoryPct}%` }}
                      />
                    </div>
                  </div>

                  {/* CPU Box */}
                  <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-xl p-2.5">
                    <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-1">
                      <span>CFS CPU</span>
                      <span className={`${svc.cpuPct > 80 ? 'text-orange-400 font-bold' : 'text-zinc-300'}`}>
                        {Math.round(svc.cpuPct)}%
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white">
                      {Math.round(svc.cpuPct)}% <span className="text-[10px] text-zinc-400 font-normal">Quota</span>
                    </div>
                    {/* Mini bar */}
                    <div className="w-full bg-zinc-800 rounded-full h-1 mt-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          svc.cpuPct > 85 ? 'bg-orange-500' : svc.cpuPct > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, svc.cpuPct)}%` }}
                      />
                    </div>
                  </div>

                  {/* Zombie PIDs */}
                  <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-xl p-2.5">
                    <div className="text-[10px] text-zinc-400 mb-0.5">Zombies (State Z)</div>
                    <div className="text-sm font-bold flex items-center justify-between">
                      <span className={svc.zombies > 0 ? 'text-rose-400' : 'text-zinc-300'}>{svc.zombies}</span>
                      <span className="text-[10px] text-zinc-400 font-normal">sched_exit</span>
                    </div>
                  </div>

                  {/* Syscall mmap rate */}
                  <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-xl p-2.5">
                    <div className="text-[10px] text-zinc-400 mb-0.5">eBPF mmap Rate</div>
                    <div className="text-sm font-bold flex items-center justify-between">
                      <span className={svc.mmapRate > 80 ? 'text-amber-400' : 'text-zinc-300'}>
                        {Math.round(svc.mmapRate)}/s
                      </span>
                      <span className="text-[10px] text-zinc-400 font-normal">ringbuf</span>
                    </div>
                  </div>
                </div>

                {/* Anomaly Gauge & Predictive TTF */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-400 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-zinc-400" />
                      Anomaly Score
                    </span>
                    <span
                      className={`font-bold ${
                        isAnomalous
                          ? 'text-amber-400'
                          : svc.anomalyScore > 0.3
                          ? 'text-yellow-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {(svc.anomalyScore * 100).toFixed(1)}%
                    </span>
                  </div>

                  <div className="w-full bg-zinc-800/80 rounded-full h-1.5 relative overflow-hidden">
                    {/* Anomaly Fill */}
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isAnomalous ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, svc.anomalyScore * 100)}%` }}
                    />
                    {/* Threshold Marker */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-rose-400 z-10"
                      style={{ left: `${anomalyThreshold * 100}%` }}
                    />
                  </div>

                  {/* Predictive TTF or Restarts Count */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pt-0.5">
                    {svc.estimatedTimeToCrashSec !== null && svc.estimatedTimeToCrashSec > 0 ? (
                      <span className="text-rose-400 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3 animate-spin" />
                        Predicted crash in ~{svc.estimatedTimeToCrashSec}s
                      </span>
                    ) : (
                      <span>Uptime: {Math.floor(svc.uptimeSec / 60)}m</span>
                    )}

                    <span>Restarts: {svc.restartsCount}</span>
                  </div>
                </div>

                {/* Bottom Actions Row */}
                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                  {/* Select for Telemetry Button */}
                  <button
                    onClick={() => onSelectServiceForTelemetry(svc.id)}
                    className={`flex-1 py-1.5 px-2.5 rounded-xl border text-xs font-mono transition-all flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 font-semibold'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{isSelected ? 'Inspecting' : 'Inspect Telemetry'}</span>
                  </button>

                  {/* Quick Chaos Mini Triggers */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onInjectFault(svc.id, 'memory_leak')}
                      title="Inject Memory Leak (mmap spike)"
                      className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 text-zinc-400 hover:text-amber-300 transition-all"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onInjectFault(svc.id, 'zombie_horde')}
                      title="Inject Zombie Horde (fork bomb)"
                      className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-rose-500/40 text-zinc-400 hover:text-rose-300 transition-all"
                    >
                      <Skull className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onInjectFault(svc.id, 'cpu_hog')}
                      title="Inject CPU Runaway (quota breach)"
                      className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-orange-500/40 text-zinc-400 hover:text-orange-300 transition-all"
                    >
                      <Flame className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
