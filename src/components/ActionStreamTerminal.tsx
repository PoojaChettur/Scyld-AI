import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Trash2, Filter, Radio, ChevronDown } from 'lucide-react';
import { ActionStreamLog, LogLevel } from '../types';

interface ActionStreamTerminalProps {
  logs: ActionStreamLog[];
  onClearLogs: () => void;
}

export const ActionStreamTerminal: React.FC<ActionStreamTerminalProps> = ({
  logs,
  onClearLogs,
}) => {
  const [filterLevel, setFilterLevel] = useState<LogLevel | 'all'>('all');
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filteredLogs = logs.filter((log) => {
    if (filterLevel === 'all') return true;
    return log.level === filterLevel;
  });

  useEffect(() => {
    if (autoScroll && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  return (
    <div className="bg-[#08090e] border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden font-mono text-xs text-zinc-100">
      {/* Terminal Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-800">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>

          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Kernel eBPF Action & Telemetry Ring Buffer Stream
            </span>
            <span className="flex items-center gap-1 px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              LIVE 0.12ms
            </span>
          </div>
        </div>

        {/* Filter Controls & Clear Button */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-zinc-900/90 p-0.5 rounded-lg border border-zinc-800 text-[10px]">
            {(['all', 'info', 'warn', 'action', 'success'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-2 py-1 rounded transition-all uppercase font-semibold ${
                  filterLevel === lvl
                    ? 'bg-zinc-800 text-emerald-400 border border-zinc-700 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`px-2 py-1 rounded-lg border text-[10px] transition-all ${
              autoScroll ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-transparent border-zinc-800 text-zinc-400'
            }`}
          >
            Auto-Scroll: {autoScroll ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={onClearLogs}
            title="Flush ring buffer stream"
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div
        ref={scrollContainerRef}
        className="mt-3 bg-[#050608] border border-zinc-900/90 rounded-xl p-3 h-52 sm:h-64 overflow-y-auto space-y-1.5 font-mono text-[11px] leading-relaxed selection:bg-emerald-500/30"
      >
        {filteredLogs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-zinc-400 text-xs">
            Awaiting kernel ring buffer events...
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isWarn = log.level === 'warn';
            const isSuccess = log.level === 'success';
            const isAction = log.level === 'action';
            const isError = log.level === 'error';

            return (
              <div
                key={log.id}
                className="flex items-start gap-2 hover:bg-zinc-900/40 px-1.5 py-0.5 rounded transition-colors group"
              >
                {/* Timestamp */}
                <span className="text-zinc-400 select-none shrink-0 font-mono text-[10px]">
                  [{log.timestamp}]
                </span>

                {/* Subsystem Tag */}
                <span
                  className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase shrink-0 border ${
                    log.subsystem === 'eBPF'
                      ? 'bg-purple-950/40 text-purple-300 border-purple-800/50'
                      : log.subsystem === 'SECURITY'
                      ? 'bg-amber-950/40 text-amber-300 border-amber-800/50'
                      : log.subsystem === 'ML_ENGINE'
                      ? 'bg-blue-950/40 text-blue-300 border-blue-800/50'
                      : log.subsystem === 'RECOVERY'
                      ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50'
                      : log.subsystem === 'ORCHESTRATOR'
                      ? 'bg-cyan-950/40 text-cyan-300 border-cyan-800/50'
                      : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                  }`}
                >
                  {log.subsystem}
                </span>

                {/* Service Tag if present */}
                {log.service && (
                  <span className="text-zinc-400 text-[10px] select-none shrink-0">
                    @{log.service}:
                  </span>
                )}

                {/* Message */}
                <span
                  className={`flex-1 break-words ${
                    isSuccess
                      ? 'text-emerald-400 font-semibold'
                      : isWarn
                      ? 'text-amber-300 font-semibold'
                      : isAction
                      ? 'text-cyan-300 font-semibold'
                      : isError
                      ? 'text-rose-400 font-bold'
                      : 'text-zinc-300'
                  }`}
                >
                  {log.message}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
