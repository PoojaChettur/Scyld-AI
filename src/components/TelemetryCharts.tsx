import React from 'react';
import { Microservice, TelemetryPoint } from '../types';
import { LineChart, Activity, Clock, ShieldAlert, Cpu, HardDrive } from 'lucide-react';

interface TelemetryChartsProps {
  service: Microservice;
  anomalyThreshold: number;
}

export const TelemetryCharts: React.FC<TelemetryChartsProps> = ({
  service,
  anomalyThreshold,
}) => {
  const history = service.history || [];
  const latest = history[history.length - 1] || {
    rssMb: service.rssMb,
    maxRssMb: service.maxRssMb,
    cpuPct: service.cpuPct,
    zombieCount: service.zombies,
    mmapRate: service.mmapRate,
    anomalyScore: service.anomalyScore,
    timeToFailureSec: service.estimatedTimeToCrashSec,
  };

  // Helper to build SVG polyline points
  const makePoints = (
    getValue: (p: TelemetryPoint) => number,
    minVal: number,
    maxVal: number,
    chartWidth = 460,
    chartHeight = 100
  ) => {
    if (history.length < 2) return '';
    const span = Math.max(1, maxVal - minVal);
    const step = (chartWidth - 24) / (history.length - 1);

    return history
      .map((p, idx) => {
        const x = 12 + idx * step;
        const normalized = Math.min(1, Math.max(0, (getValue(p) - minVal) / span));
        const y = chartHeight - 12 - normalized * (chartHeight - 24);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  };

  const rssPoints = makePoints((p) => p.rssMb, 0, service.maxRssMb);
  const cpuPoints = makePoints((p) => p.cpuPct, 0, 100);
  const mmapPoints = makePoints((p) => p.mmapRate, 0, 350);
  const anomalyPoints = makePoints((p) => p.anomalyScore, 0, 1);

  return (
    <div className="bg-[#0b0d13] border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-2xl text-zinc-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <LineChart className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white font-mono">
                Deep Cgroup Telemetry: <span className="text-cyan-400">{service.name}</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                Ringbuf Sliding Window (30s)
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-sans">
              Autonomous IsolationForest & eBPF syscall time-series analysis with sub-second predictive trajectory.
            </p>
          </div>
        </div>

        {/* Prediction Status Pill */}
        {latest.timeToFailureSec !== null && latest.timeToFailureSec > 0 ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-mono animate-pulse">
            <Clock className="w-4 h-4" />
            <span>Predicted OOM/Crash in ~{latest.timeToFailureSec}s without Sentinel</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
            <Activity className="w-4 h-4" />
            <span>Telemetry trajectory nominal</span>
          </div>
        )}
      </div>

      {/* 4 Multi-Metric Charts Grid */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 1: Memory RSS vs Max Limit */}
        <div className="bg-[#06070a] border border-zinc-850 rounded-xl p-3 relative">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-zinc-400">cgroup.memory.current (RSS)</span>
            <span className="text-emerald-400 font-bold">
              {Math.round(latest.rssMb)} MB / {service.maxRssMb} MB
            </span>
          </div>

          <div className="h-28 relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 460 100" preserveAspectRatio="none">
              {/* Limit Line (Red dashed) */}
              <line x1="12" y1="14" x2="448" y2="14" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.7" />
              <text x="360" y="10" fill="#ef4444" fontSize="9" fontFamily="monospace">
                cgroup limit: {service.maxRssMb}MB
              </text>

              {/* Data line */}
              {rssPoints && (
                <polyline
                  fill="none"
                  stroke={latest.rssMb > service.maxRssMb * 0.8 ? '#f59e0b' : '#10b981'}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={rssPoints}
                />
              )}
            </svg>
          </div>
        </div>

        {/* Chart 2: CPU CFS Quota */}
        <div className="bg-[#06070a] border border-zinc-850 rounded-xl p-3 relative">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-zinc-400">cgroup.cpu.stat (CFS Quota)</span>
            <span className="text-orange-400 font-bold">{Math.round(latest.cpuPct)}% capacity</span>
          </div>

          <div className="h-28 relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 460 100" preserveAspectRatio="none">
              {/* 100% Limit line */}
              <line x1="12" y1="14" x2="448" y2="14" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
              <text x="390" y="10" fill="#ef4444" fontSize="9" fontFamily="monospace">
                100% quota
              </text>

              {cpuPoints && (
                <polyline
                  fill="none"
                  stroke={latest.cpuPct > 75 ? '#f97316' : '#38bdf8'}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={cpuPoints}
                />
              )}
            </svg>
          </div>
        </div>

        {/* Chart 3: eBPF sys_enter_mmap Rate */}
        <div className="bg-[#06070a] border border-zinc-850 rounded-xl p-3 relative">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-zinc-400">eBPF Probe: sys_enter_mmap</span>
            <span className="text-purple-400 font-bold">{Math.round(latest.mmapRate)} calls/sec</span>
          </div>

          <div className="h-28 relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 460 100" preserveAspectRatio="none">
              <line x1="12" y1="40" x2="448" y2="40" stroke="#a855f7" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
              <text x="360" y="36" fill="#a855f7" fontSize="9" fontFamily="monospace">
                nominal baseline: 25/s
              </text>

              {mmapPoints && (
                <polyline
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={mmapPoints}
                />
              )}
            </svg>
          </div>
        </div>

        {/* Chart 4: Anomaly Score & Trigger Threshold */}
        <div className="bg-[#06070a] border border-zinc-850 rounded-xl p-3 relative">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-zinc-400">IsolationForest Anomaly Index</span>
            <span
              className={`font-bold ${
                latest.anomalyScore >= anomalyThreshold ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {(latest.anomalyScore * 100).toFixed(1)}% (Threshold: {(anomalyThreshold * 100).toFixed(0)}%)
            </span>
          </div>

          <div className="h-28 relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 460 100" preserveAspectRatio="none">
              {/* Trigger Threshold line */}
              {(() => {
                const threshY = 88 - anomalyThreshold * 76;
                return (
                  <>
                    <line
                      x1="12"
                      y1={threshY}
                      x2="448"
                      y2={threshY}
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                    <text x="330" y={threshY - 4} fill="#f59e0b" fontSize="9" fontFamily="monospace">
                      autonomous trigger: {(anomalyThreshold * 100).toFixed(0)}%
                    </text>
                  </>
                );
              })()}

              {anomalyPoints && (
                <polyline
                  fill="none"
                  stroke={latest.anomalyScore >= anomalyThreshold ? '#f59e0b' : '#10b981'}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={anomalyPoints}
                />
              )}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
