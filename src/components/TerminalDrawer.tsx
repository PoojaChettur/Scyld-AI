import React, { useState, useEffect, useRef } from 'react';
import { StreamLogItem } from '../types/scyld';
import { Terminal, Copy, Trash2, X, Check, ArrowDownCircle } from 'lucide-react';

interface TerminalDrawerProps {
  logs: StreamLogItem[];
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
}

export const TerminalDrawer: React.FC<TerminalDrawerProps> = ({
  logs,
  isOpen,
  onClose,
  onClear,
}) => {
  const [filter, setFilter] = useState<string>('ALL');
  const [copied, setCopied] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && isOpen && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [logs, autoScroll, isOpen]);

  if (!isOpen) return null;

  const filteredLogs = filter === 'ALL' ? logs : logs.filter(l => l.subsystem === filter);

  const handleCopyLogs = () => {
    const text = filteredLogs.map(l => `[${l.timestamp}] [${l.level.toUpperCase()}] [${l.subsystem}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-[#07080c] border-t border-zinc-800 shadow-2xl flex flex-col h-64 transition-all">
      {/* Drawer Header */}
      <div className="bg-[#0b0c12] border-b border-zinc-800 px-4 py-2 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-bold text-zinc-200">eBPF KERNEL TELEMETRY RING BUFFER</span>
          <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 text-[10px]">
            {filteredLogs.length} events
          </span>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1">
          {['ALL', 'eBPF', 'KERNEL', 'SECURITY', 'ORCHESTRATOR'].map(sub => (
            <button
              key={sub}
              onClick={() => setFilter(sub)}
              className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                filter === sub 
                  ? 'bg-amber-500 text-black font-semibold' 
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`p-1 rounded text-xs transition-colors ${autoScroll ? 'text-amber-400' : 'text-zinc-500'}`}
            title="Auto-scroll"
          >
            <ArrowDownCircle className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleCopyLogs}
            className="p-1 text-zinc-400 hover:text-zinc-200 rounded transition-colors"
            title="Copy logs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClear}
            className="p-1 text-zinc-400 hover:text-rose-400 rounded transition-colors"
            title="Clear logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-100 rounded transition-colors"
            title="Close drawer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Log Stream Output */}
      <div
        ref={scrollContainerRef}
        className="flex-1 p-3 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-1 bg-[#050608]"
      >
        {filteredLogs.map(log => {
          let levelColor = 'text-zinc-300';
          if (log.level === 'error') levelColor = 'text-rose-400 font-semibold';
          else if (log.level === 'warn') levelColor = 'text-amber-400';
          else if (log.level === 'success') levelColor = 'text-emerald-400';

          return (
            <div key={log.id} className="flex items-start gap-2 hover:bg-zinc-900/40 px-1 py-0.5 rounded">
              <span className="text-zinc-600 shrink-0">{log.timestamp}</span>
              <span className={`px-1 rounded text-[10px] shrink-0 ${
                log.subsystem === 'eBPF' ? 'bg-sky-950 text-sky-300' :
                log.subsystem === 'SECURITY' ? 'bg-amber-950 text-amber-300' :
                log.subsystem === 'KERNEL' ? 'bg-rose-950 text-rose-300' :
                'bg-zinc-800 text-zinc-400'
              }`}>
                [{log.subsystem}]
              </span>
              <span className={levelColor}>{log.message}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
