import React, { useState } from 'react';
import {
  Zap,
  RotateCcw,
  AlertTriangle,
  Skull,
  Flame,
  HardDrive,
  Network,
  ShieldAlert,
  HelpCircle,
} from 'lucide-react';
import { Microservice, FaultType, UserRole } from '../types';

interface FaultInjectorBarProps {
  services: Microservice[];
  userRole: UserRole;
  onInjectFault: (serviceId: string, fault: FaultType) => void;
  onClearAll: () => void;
  onToggleRole: () => void;
}

export const FaultInjectorBar: React.FC<FaultInjectorBarProps> = ({
  services,
  userRole,
  onInjectFault,
  onClearAll,
  onToggleRole,
}) => {
  const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0]?.id || 'payment-svc');
  const [activeChaosFault, setActiveChaosFault] = useState<FaultType | null>(null);

  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0];
  const isAdmin = userRole === 'admin';

  const handleInject = (fault: FaultType) => {
    if (!isAdmin) {
      alert('Permission Denied: Administrator role required to inject synthetic chaos faults.');
      onToggleRole();
      return;
    }
    setActiveChaosFault(fault);
    onInjectFault(selectedServiceId, fault);
  };

  const faults: Array<{
    type: FaultType;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    borderHover: string;
  }> = [
    {
      type: 'memory_leak',
      label: 'Memory Leak',
      description: 'Rapid heap allocation via sys_enter_mmap. Simulates runaway cache or buffer leak.',
      icon: AlertTriangle,
      accentColor: 'text-amber-400',
      borderHover: 'hover:border-amber-500/60 hover:bg-amber-500/10',
    },
    {
      type: 'zombie_horde',
      label: 'Zombie Horde',
      description: 'Unreaped State Z processes (sched_process_exit). Exhausts kernel PID namespace.',
      icon: Skull,
      accentColor: 'text-rose-400',
      borderHover: 'hover:border-rose-500/60 hover:bg-rose-500/10',
    },
    {
      type: 'cpu_hog',
      label: 'CPU Runaway',
      description: 'Tight spinlock infinite loop. Breaches CFS quota (100% capacity deadlock).',
      icon: Flame,
      accentColor: 'text-orange-400',
      borderHover: 'hover:border-orange-500/60 hover:bg-orange-500/10',
    },
    {
      type: 'io_thrash',
      label: 'I/O Thrashing',
      description: 'Massive synchronous page faults & direct disk sync. Spikes kernel iowait latency.',
      icon: HardDrive,
      accentColor: 'text-purple-400',
      borderHover: 'hover:border-purple-500/60 hover:bg-purple-500/10',
    },
    {
      type: 'socket_leak',
      label: 'Socket Exhaustion',
      description: 'Orphaned TCP half-open sockets. Saturates netfilter connection tracking table.',
      icon: Network,
      accentColor: 'text-cyan-400',
      borderHover: 'hover:border-cyan-500/60 hover:bg-cyan-500/10',
    },
  ];

  return (
    <div className="bg-[#0e1017] border-2 border-amber-500/30 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden text-zinc-100">
      {/* Background Subtle Grid Effect */}
      <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-amber-500/5 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white font-sans">Synthetic Chaos & Fault Injection Deck</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 uppercase font-semibold">
                Kernel Stress Suite
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono">
              Trigger real-time cgroup divergences to observe sub-second eBPF anomaly detection & autonomous self-healing.
            </p>
          </div>
        </div>

        {/* Clear All / Fleet Reset Button */}
        <div className="flex items-center gap-2">
          {!isAdmin && (
            <span className="text-xs font-mono text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              Viewer Mode (Read-Only)
            </span>
          )}

          <button
            onClick={onClearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 text-xs font-mono transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
            <span>Reset All Cgroups</span>
          </button>
        </div>
      </div>

      {/* Controls Area */}
      <div className="pt-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Target Service Selector */}
        <div className="lg:col-span-4 bg-zinc-900/80 border border-zinc-800 rounded-xl p-3">
          <label className="block text-xs font-mono text-zinc-400 mb-1.5 flex items-center justify-between">
            <span>TARGET MICROSERVICE CGROUP</span>
            <span className="text-[11px] text-emerald-400 font-bold">{selectedService?.name}</span>
          </label>

          <select
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
            className="w-full bg-[#13161f] border border-zinc-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            {services.map((svc) => (
              <option key={svc.id} value={svc.id} className="bg-zinc-900 text-zinc-200">
                {svc.name} ({svc.role})
              </option>
            ))}
          </select>

          {/* Current Selected Service Quick Summary */}
          {selectedService && (
            <div className="mt-2.5 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="text-zinc-400">Status:</span>
                <span
                  className={`font-semibold uppercase ${
                    selectedService.status === 'healthy'
                      ? 'text-emerald-400'
                      : selectedService.status === 'degraded'
                      ? 'text-amber-400'
                      : selectedService.status === 'healing'
                      ? 'text-cyan-400'
                      : 'text-rose-400'
                  }`}
                >
                  {selectedService.status}
                </span>
              </div>
              <div>
                <span className="text-zinc-400">Fault: </span>
                <span className="text-amber-300 font-bold">{selectedService.fault.replace(/_/g, ' ')}</span>
              </div>
            </div>
          )}
        </div>

        {/* Fault Buttons */}
        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {faults.map((f) => {
            const Icon = f.icon;
            const isCurrentlyActive = selectedService?.fault === f.type;
            return (
              <button
                key={f.type}
                onClick={() => handleInject(f.type)}
                title={f.description}
                className={`p-2.5 rounded-xl border text-left transition-all relative group flex flex-col justify-between ${
                  isCurrentlyActive
                    ? 'bg-amber-500/20 border-amber-500/80 shadow-md ring-1 ring-amber-500/50'
                    : `bg-zinc-900/60 border-zinc-800 ${f.borderHover}`
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Icon className={`w-4 h-4 ${f.accentColor} group-hover:scale-110 transition-transform`} />
                  {isCurrentlyActive && (
                    <span className="flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                  )}
                </div>

                <div>
                  <div className="text-xs font-mono font-bold text-zinc-200 group-hover:text-white">
                    {f.label}
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400 truncate mt-0.5">
                    {f.type === 'memory_leak'
                      ? 'sys_mmap spike'
                      : f.type === 'zombie_horde'
                      ? 'PID leak'
                      : f.type === 'cpu_hog'
                      ? 'CFS quota'
                      : f.type === 'io_thrash'
                      ? 'iowait surge'
                      : 'TCP hang'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
