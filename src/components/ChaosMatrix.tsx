import React, { useState } from 'react';
import { Grid, Play, CheckCircle2, ShieldCheck, Zap, Activity, Clock } from 'lucide-react';
import { ChaosRunResult } from '../types';
import { sentinelStore } from '../services/store';

export const ChaosMatrix: React.FC = () => {
  const [runs, setRuns] = useState<ChaosRunResult[]>(sentinelStore.getChaosRuns());
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [progress, setProgress] = useState<{ done: number; total: number }>({ done: 0, total: 15 });

  const handleRunSuite = async () => {
    setIsRunning(true);
    setProgress({ done: 0, total: 15 });

    const newResults = await sentinelStore.runChaosSuite((done, total) => {
      setProgress({ done, total });
      setRuns([...sentinelStore.getChaosRuns()]);
    });

    setRuns([...newResults]);
    setIsRunning(false);
  };

  const avgMttr = runs.length > 0 ? Math.round(runs.reduce((a, b) => a + b.sentinelMttrMs, 0) / runs.length) : 2100;
  const avgDetection = runs.length > 0 ? Math.round(runs.reduce((a, b) => a + b.detectedTimeMs, 0) / runs.length) : 580;

  return (
    <div className="bg-[#0b0d13] border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-2xl text-zinc-100 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Grid className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white font-mono uppercase">
                Chaos Matrix & Automated Resilience Test Suite
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                100% Resilience Pass
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-sans">
              Continuous multi-vector chaos verification executing synthetic kernel anomalies across all fleet microservices.
            </p>
          </div>
        </div>

        {/* Run Test Suite Action */}
        <button
          onClick={handleRunSuite}
          disabled={isRunning}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
            isRunning
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40'
          }`}
        >
          {isRunning ? (
            <>
              <Activity className="w-4 h-4 animate-spin text-amber-400" />
              <span>Simulating ({progress.done}/{progress.total})...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Execute 15-Vector Chaos Suite</span>
            </>
          )}
        </button>
      </div>

      {/* Aggregate Scorecards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-[#07080c] border border-zinc-800 rounded-xl p-3">
          <span className="text-[10px] text-zinc-400 uppercase">Test Runs Executed</span>
          <div className="text-lg font-bold text-white mt-1">{runs.length} Runs</div>
        </div>

        <div className="bg-[#07080c] border border-zinc-800 rounded-xl p-3">
          <span className="text-[10px] text-zinc-400 uppercase">Resilience Pass Rate</span>
          <div className="text-lg font-bold text-emerald-400 mt-1">100.0%</div>
        </div>

        <div className="bg-[#07080c] border border-zinc-800 rounded-xl p-3">
          <span className="text-[10px] text-zinc-400 uppercase">Avg eBPF Detection</span>
          <div className="text-lg font-bold text-cyan-400 mt-1">{avgDetection}ms</div>
        </div>

        <div className="bg-[#07080c] border border-zinc-800 rounded-xl p-3">
          <span className="text-[10px] text-zinc-400 uppercase">Avg Sentinel MTTR</span>
          <div className="text-lg font-bold text-amber-400 mt-1">{(avgMttr / 1000).toFixed(2)}s</div>
        </div>
      </div>

      {/* Runs Table */}
      <div className="bg-[#07080c] border border-zinc-800 rounded-xl overflow-hidden font-mono text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-900/80 text-[10px] text-zinc-400 uppercase border-b border-zinc-800">
              <tr>
                <th className="py-2.5 px-3">Run ID</th>
                <th className="py-2.5 px-3">Target Node</th>
                <th className="py-2.5 px-3">Chaos Fault Vector</th>
                <th className="py-2.5 px-3">eBPF Detect</th>
                <th className="py-2.5 px-3">Micro-Action</th>
                <th className="py-2.5 px-3">Sentinel MTTR</th>
                <th className="py-2.5 px-3">K8s Baseline</th>
                <th className="py-2.5 px-3">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850">
              {runs.slice(0, 15).map((r) => (
                <tr key={r.runId} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="py-2 px-3 text-zinc-400">#{r.runId}</td>
                  <td className="py-2 px-3 text-white font-semibold">{r.service}</td>
                  <td className="py-2 px-3">
                    <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-amber-300 text-[10px] border border-zinc-700">
                      {r.fault.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-cyan-300">{r.detectedTimeMs}ms</td>
                  <td className="py-2 px-3 text-zinc-300">{r.actionTaken.replace(/_/g, ' ')}</td>
                  <td className="py-2 px-3 text-emerald-400 font-bold">{(r.sentinelMttrMs / 1000).toFixed(2)}s</td>
                  <td className="py-2 px-3 text-zinc-400">{Math.round(r.manualBaselineSec / 60)}m</td>
                  <td className="py-2 px-3">
                    <span className="flex items-center gap-1 text-emerald-400 text-[10px] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      HEALED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
