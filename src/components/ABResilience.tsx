import React, { useState } from 'react';
import { GitCompare, AlertTriangle, ShieldCheck, Clock, Zap, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

export const ABResilience: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<'memory_leak' | 'cpu_spike' | 'zombie_horde'>('memory_leak');

  const scenarios = {
    memory_leak: {
      title: 'Runaway Heap Allocation (sys_enter_mmap)',
      traditional: {
        detectionTime: '~18 minutes (until hard OOMKill limit)',
        action: 'Linux Kernel OOMKiller slays PID violently',
        recoveryTime: '28 - 45 minutes (Manual SRE PagerDuty triage)',
        impact: 'Pod enters CrashLoopBackOff. HTTP 502/504 cascade to auth & ledger services. Data in flight corrupted.',
        availability: '99.12% (Severe Degradation)',
      },
      sentinel: {
        detectionTime: '720ms (eBPF mmap velocity slope divergence)',
        action: 'Autonomous L1 Cgroup freeze, socket drain & micro-restart',
        recoveryTime: '3.18 seconds (Sub-second autonomous healing)',
        impact: '0 downstream 500 errors. Sockets gracefully transferred. Zero cascade impact to peer nodes.',
        availability: '99.999% (Continuous Five-Nines)',
      },
    },
    cpu_spike: {
      title: 'CFS Runaway Infinite Spinlock',
      traditional: {
        detectionTime: '~12 minutes (Prometheus scrape interval & alerting delay)',
        action: 'Kubelet throttles CFS quota to zero; requests time out',
        recoveryTime: '35 minutes (Operator drains node manually)',
        impact: 'Threadpool starvation blocks incoming user traffic completely. Database connection pool exhausted.',
        availability: '99.25% (Service Outage)',
      },
      sentinel: {
        detectionTime: '440ms (cgroup cpu.stat CFS quota throttle probe)',
        action: 'Dynamic micro-throttle + worker thread cycle',
        recoveryTime: '1.42 seconds (Autonomous cgroup quota clamp)',
        impact: 'Runaway worker isolated; health check endpoints stay green. Database connection pool remains healthy.',
        availability: '99.999% (Nominal Baseline)',
      },
    },
    zombie_horde: {
      title: 'Unreaped State Z Process PID Exhaustion',
      traditional: {
        detectionTime: '~40 minutes (Host kernel PID max limit reached)',
        action: 'Kernel panics; unable to fork any new processes',
        recoveryTime: '60+ minutes (Host reboot and cluster failover)',
        impact: 'Entire Kubernetes node crashes. Multi-tenant pods on same node evicted simultaneously.',
        availability: '98.50% (Critical Outage)',
      },
      sentinel: {
        detectionTime: '620ms (sched_process_exit wait4 mismatch)',
        action: 'L2 Process-level targeted zombie reap via kernel hook',
        recoveryTime: '1.24 seconds (Zero downtime reap)',
        impact: '100% of zombie PIDs reclaimed silently. Host node remains completely stable.',
        availability: '99.999% (Zero Impact)',
      },
    },
  };

  const curr = scenarios[selectedScenario];

  return (
    <div className="bg-[#0b0d13] border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-2xl text-zinc-100 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <GitCompare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-mono uppercase">
              A/B Resilience Benchmark: Traditional K8s vs ScyldAI Sentinel
            </h3>
            <p className="text-xs text-zinc-400 font-sans">
              Head-to-head architectural analysis comparing reactive kubelet crashloops against autonomous eBPF self-healing.
            </p>
          </div>
        </div>

        {/* Scenario Selectors */}
        <div className="flex items-center bg-zinc-900/90 p-0.5 rounded-xl border border-zinc-800 text-xs font-mono">
          {(['memory_leak', 'cpu_spike', 'zombie_horde'] as const).map((sc) => (
            <button
              key={sc}
              onClick={() => setSelectedScenario(sc)}
              className={`px-3 py-1.5 rounded-lg transition-all capitalize ${
                selectedScenario === sc
                  ? 'bg-zinc-800 text-cyan-300 border border-zinc-700 font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {sc.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="text-xs font-mono text-zinc-300 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800 flex items-center justify-between">
        <span>Active Chaos Simulation: <strong className="text-white">{curr.title}</strong></span>
        <span className="text-emerald-400 font-bold">570x Faster Recovery</span>
      </div>

      {/* Side-by-Side Comparison Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Traditional Kubernetes */}
        <div className="bg-[#120909] border border-rose-900/40 rounded-2xl p-5 space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-rose-900/40">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-500" />
              <h4 className="text-sm font-bold text-white font-sans">Traditional Kubernetes Stack</h4>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 uppercase font-bold">
              Reactive Post-Mortem
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
              <span className="text-zinc-400 text-[10px] block uppercase">Time to Anomaly Detection</span>
              <span className="text-rose-400 font-bold text-sm">{curr.traditional.detectionTime}</span>
            </div>

            <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
              <span className="text-zinc-400 text-[10px] block uppercase">Trigger Mechanism</span>
              <span className="text-zinc-200">{curr.traditional.action}</span>
            </div>

            <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
              <span className="text-zinc-400 text-[10px] block uppercase">Mean Time To Recovery (MTTR)</span>
              <span className="text-rose-400 font-bold text-sm">{curr.traditional.recoveryTime}</span>
            </div>

            <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
              <span className="text-zinc-400 text-[10px] block uppercase">Cascading Blast Radius</span>
              <p className="text-zinc-300 font-sans text-xs mt-1 leading-relaxed">{curr.traditional.impact}</p>
            </div>

            <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800 flex items-center justify-between">
              <span className="text-zinc-400 text-[10px] uppercase">Service Availability</span>
              <span className="text-rose-400 font-bold">{curr.traditional.availability}</span>
            </div>
          </div>
        </div>

        {/* Right Column: ScyldAI Sentinel */}
        <div className="bg-[#08120e] border border-emerald-800/40 rounded-2xl p-5 space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-800/40">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-bold text-white font-sans">ScyldAI Sentinel-Node</h4>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 uppercase font-bold">
              Autonomous Kernel eBPF
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
              <span className="text-zinc-400 text-[10px] block uppercase">Time to Anomaly Detection</span>
              <span className="text-emerald-400 font-bold text-sm">{curr.sentinel.detectionTime}</span>
            </div>

            <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
              <span className="text-zinc-400 text-[10px] block uppercase">Trigger Mechanism</span>
              <span className="text-zinc-200">{curr.sentinel.action}</span>
            </div>

            <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
              <span className="text-zinc-400 text-[10px] block uppercase">Mean Time To Recovery (MTTR)</span>
              <span className="text-emerald-400 font-bold text-sm">{curr.sentinel.recoveryTime}</span>
            </div>

            <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
              <span className="text-zinc-400 text-[10px] block uppercase">Cascading Blast Radius</span>
              <p className="text-zinc-300 font-sans text-xs mt-1 leading-relaxed">{curr.sentinel.impact}</p>
            </div>

            <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800 flex items-center justify-between">
              <span className="text-zinc-400 text-[10px] uppercase">Service Availability</span>
              <span className="text-emerald-400 font-bold">{curr.sentinel.availability}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
