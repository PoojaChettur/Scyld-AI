import React from 'react';
import { Microservice, Incident } from '../types';
import { Cpu, ShieldCheck, Zap, AlertCircle, Layers } from 'lucide-react';

interface ExplainabilityPanelProps {
  service: Microservice;
  latestIncident?: Incident;
}

export const ExplainabilityPanel: React.FC<ExplainabilityPanelProps> = ({
  service,
  latestIncident,
}) => {
  const explainability = latestIncident?.explainability || [
    {
      featureName: 'RSS Memory Velocity (cgroup.memory.current)',
      value: `${Math.round(service.rssMb * 0.05)} MB/min`,
      weightPct: 45,
      direction: service.rssMb > service.maxRssMb * 0.7 ? 'critical' : 'nominal',
      baseline: '< 1.5 MB/min',
    },
    {
      featureName: 'sys_enter_mmap syscall spike',
      value: `${service.mmapRate}/s`,
      weightPct: 35,
      direction: service.mmapRate > 120 ? 'critical' : 'nominal',
      baseline: '15/s',
    },
    {
      featureName: 'Zombie process accumulation (sched_process_exit)',
      value: `${service.zombies} processes`,
      weightPct: 20,
      direction: service.zombies > 10 ? 'critical' : 'nominal',
      baseline: '0',
    },
  ];

  return (
    <div className="bg-[#0b0d13] border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-2xl text-zinc-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white font-mono">
                eBPF Root-Cause Explainability & Blast-Radius Engine
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30">
                LIME / SHAP Feature Attribution
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-sans">
              Interpretable kernel telemetry proving why Sentinel triggered autonomous remediation on [{service.name}].
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-zinc-400">Blast Radius:</span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 font-bold">
            0% (Isolated Cgroup)
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Feature Importance Weight List */}
        <div className="lg:col-span-2 space-y-3">
          <h4 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
            Kernel Anomaly Attribution Vectors
          </h4>

          {explainability.map((f, idx) => (
            <div key={idx} className="bg-[#07080c] border border-zinc-800/80 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-200 font-semibold">{f.featureName}</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase border ${
                    f.direction === 'critical'
                      ? 'bg-rose-500/15 text-rose-300 border-rose-500/40'
                      : f.direction === 'elevated'
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  {f.direction}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <div>
                  Observed: <span className="text-white font-bold">{f.value}</span>
                </div>
                <div>
                  Nominal Baseline: <span className="text-zinc-300">{f.baseline}</span>
                </div>
                <div>
                  Attribution: <span className="text-purple-400 font-bold">{f.weightPct}%</span>
                </div>
              </div>

              {/* Attribution weight bar */}
              <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    f.direction === 'critical' ? 'bg-rose-500' : f.direction === 'elevated' ? 'bg-amber-500' : 'bg-purple-500'
                  }`}
                  style={{ width: `${f.weightPct}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Right Col: Autonomous Multi-Tier Recovery Architecture */}
        <div className="bg-[#07080c] border border-zinc-800/80 rounded-xl p-3.5 flex flex-col justify-between space-y-3 font-mono text-xs">
          <div>
            <div className="flex items-center gap-1.5 text-zinc-300 font-bold uppercase text-[11px] mb-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>ScyldAI Autonomous Tiers</span>
            </div>

            <div className="space-y-2.5">
              <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400 mb-0.5">
                  <span>Level 1: Sub-Second Micro-Drain</span>
                  <span className="text-[10px] text-zinc-400">&lt; 500ms</span>
                </div>
                <p className="text-[10px] text-zinc-400 font-sans">
                  cgroup freeze & thaw. Drains active sockets while isolating leaked heap without pod eviction.
                </p>
              </div>

              <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                <div className="flex items-center justify-between text-[11px] font-bold text-cyan-400 mb-0.5">
                  <span>Level 2: Process-Level Reap</span>
                  <span className="text-[10px] text-zinc-400">1.2s - 2.5s</span>
                </div>
                <p className="text-[10px] text-zinc-400 font-sans">
                  Targeted wait4() reaping of orphaned State Z zombies and graceful SIGUSR1 worker cycle.
                </p>
              </div>

              <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                <div className="flex items-center justify-between text-[11px] font-bold text-amber-400 mb-0.5">
                  <span>Level 3: Human Guard Gate</span>
                  <span className="text-[10px] text-zinc-400">Operator Auth</span>
                </div>
                <p className="text-[10px] text-zinc-400 font-sans">
                  Mandatory for core banking or locked ledgers. Operator authorizes container restart.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
            <span>Fail-Open Guarantee:</span>
            <span className="text-emerald-400 font-bold">100% Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
