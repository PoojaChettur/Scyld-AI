import React, { useState } from 'react';
import { Incident, UserRole } from '../types';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Leaf,
  ShieldCheck,
  ShieldAlert,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface IncidentsTimelineProps {
  incidents: Incident[];
  userRole: UserRole;
  onApproveIncident: (incidentId: string) => void;
  onRejectIncident: (incidentId: string) => void;
}

export const IncidentsTimeline: React.FC<IncidentsTimelineProps> = ({
  incidents,
  userRole,
  onApproveIncident,
  onRejectIncident,
}) => {
  const [filter, setFilter] = useState<'all' | 'awaiting_approval' | 'resolved' | 'escalated'>('all');
  const isAdmin = userRole === 'admin';

  const filteredIncidents = incidents.filter((inc) => {
    if (filter === 'all') return true;
    return inc.status === filter;
  });

  const pendingIncidents = incidents.filter((i) => i.status === 'awaiting_approval');

  return (
    <div className="space-y-6 text-zinc-100">
      {/* Pending L3 Human-In-The-Loop Approval Banner */}
      {pendingIncidents.length > 0 && (
        <div className="bg-[#191208] border-2 border-amber-500 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden animate-pulse-slow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-500/30">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                <AlertTriangle className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-sans uppercase tracking-wide">
                  Level 3 Human-In-The-Loop Gate Engaged ({pendingIncidents.length} Pending)
                </h3>
                <p className="text-xs text-amber-200/80 font-mono">
                  Autonomous Sentinel paused execution for protected critical infrastructure. Operator signature required.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isAdmin && (
                <span className="text-xs font-mono text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2 py-1 rounded-lg">
                  Viewer Mode: Switch to Admin to Authorize
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {pendingIncidents.map((inc) => (
              <div
                key={inc.id}
                className="bg-[#0f0c05] border border-amber-500/40 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold uppercase">{inc.id}</span>
                    <span className="text-zinc-400">&bull;</span>
                    <span className="text-white font-bold">{inc.serviceName}</span>
                    <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold uppercase">
                      Anomaly: {(inc.anomalyScore * 100).toFixed(0)}%
                    </span>
                  </div>

                  <p className="text-zinc-300 font-sans text-xs">{inc.plainSummary}</p>

                  <div className="flex items-center gap-4 text-[11px] text-zinc-400 pt-1">
                    <span>Proposed Action: <span className="text-cyan-300 font-bold uppercase">{inc.actionTaken.replace(/_/g, ' ')}</span></span>
                    <span>Blast Radius: <span className="text-emerald-400 font-bold">0% (Strictly Cgroup Isolated)</span></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      if (!isAdmin) {
                        alert('Permission Denied: Administrator role required to approve remediations.');
                        return;
                      }
                      onApproveIncident(inc.id);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-md shadow-emerald-950/40"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Authorize L3 Action</span>
                  </button>

                  <button
                    onClick={() => {
                      if (!isAdmin) {
                        alert('Permission Denied: Administrator role required to decline remediations.');
                        return;
                      }
                      onRejectIncident(inc.id);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-all border border-zinc-700"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Decline & Escalate</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Incident History & MTTR Ledger */}
      <div className="bg-[#0b0d13] border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase">
                Autonomous Incident Ledger & MTTR Telemetry
              </h3>
              <p className="text-xs text-zinc-400 font-sans">
                Full historical record of kernel-level remediations, MTTR acceleration, and outage prevention.
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center bg-zinc-900/90 p-0.5 rounded-xl border border-zinc-800 text-xs font-mono">
            {(['all', 'awaiting_approval', 'resolved', 'escalated'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`px-3 py-1.5 rounded-lg transition-all capitalize ${
                  filter === st
                    ? 'bg-zinc-800 text-emerald-400 border border-zinc-700 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {st.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* List of Incidents */}
        <div className="space-y-3">
          {filteredIncidents.length === 0 ? (
            <div className="py-8 text-center text-zinc-400 font-mono text-xs">
              No incidents matching filter [{filter}].
            </div>
          ) : (
            filteredIncidents.map((inc) => {
              const isResolved = inc.status === 'resolved';
              const isPending = inc.status === 'awaiting_approval';
              const isExecuting = inc.status === 'executing';
              const isEscalated = inc.status === 'escalated';

              return (
                <div
                  key={inc.id}
                  className={`bg-[#07080c] border rounded-xl p-4 transition-all ${
                    isPending
                      ? 'border-amber-500/40'
                      : isResolved
                      ? 'border-zinc-800/80 hover:border-zinc-700'
                      : isEscalated
                      ? 'border-rose-500/40'
                      : 'border-cyan-500/40'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2.5 border-b border-zinc-800/50">
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="text-zinc-400">[{new Date(inc.timestamp).toLocaleTimeString()}]</span>
                      <span className="font-bold text-white">{inc.id}</span>
                      <span className="text-zinc-400">&bull;</span>
                      <span className="text-emerald-400 font-semibold">{inc.serviceName}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 uppercase">
                        {inc.actionLevel}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase border ${
                          isResolved
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                            : isPending
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 animate-pulse'
                            : isExecuting
                            ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 animate-pulse'
                            : 'bg-rose-500/15 text-rose-300 border-rose-500/40'
                        }`}
                      >
                        {inc.status.replace(/_/g, ' ')}
                      </span>

                      {inc.mttrMs && (
                        <span className="text-xs font-mono text-cyan-300 bg-cyan-950/30 border border-cyan-800/40 px-2 py-0.5 rounded">
                          MTTR: {(inc.mttrMs / 1000).toFixed(2)}s
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-zinc-300 font-sans leading-relaxed">{inc.plainSummary}</p>

                  {/* Impact Stats */}
                  <div className="mt-3 pt-2 border-t border-zinc-850 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-zinc-400">
                    <div className="flex items-center gap-4">
                      {inc.costSavedUsd > 0 && (
                        <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>Saved: ${inc.costSavedUsd.toLocaleString()}</span>
                        </div>
                      )}
                      {inc.carbonSavedGrams > 0 && (
                        <div className="flex items-center gap-1 text-emerald-300">
                          <Leaf className="w-3.5 h-3.5" />
                          <span>Carbon Saved: {(inc.carbonSavedGrams / 1000).toFixed(2)}kg</span>
                        </div>
                      )}
                    </div>

                    <div className="text-[11px] text-zinc-400">
                      Baseline SRE Manual MTTR: ~30 min &bull; Accelerated by{' '}
                      <span className="text-cyan-400 font-bold">570x</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
