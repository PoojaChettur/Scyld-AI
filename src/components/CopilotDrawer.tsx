import React, { useState } from 'react';
import { X, Send, Sparkles, Bot, User, Shield, HelpCircle } from 'lucide-react';
import { ServiceNode, IncidentRecord } from '../types/scyld';

interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  services: ServiceNode[];
  incidents: IncidentRecord[];
}

interface Message {
  id: string;
  sender: 'user' | 'sentinel';
  text: string;
  timestamp: string;
}

export const CopilotDrawer: React.FC<CopilotDrawerProps> = ({
  isOpen,
  onClose,
  services,
  incidents,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'sentinel',
      text: 'Greetings. I am Sentinel SRE Copilot. I analyze kernel-level eBPF telemetry, explain micro-recovery operations, and assess blast radius risk across your containerized mesh. What would you like to investigate?',
      timestamp: '14:15',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = (userText?: string) => {
    const textToSend = userText || input;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!userText) setInput('');
    setIsLoading(true);

    setTimeout(() => {
      let reply = '';
      const lower = textToSend.toLowerCase();

      if (lower.includes('anomaly') || lower.includes('health') || lower.includes('status')) {
        const degraded = services.filter(s => s.status !== 'healthy');
        if (degraded.length === 0) {
          reply = `Cluster telemetry is optimal. All ${services.length} microservices are operating with anomaly scores below 0.08. eBPF ring buffers show zero memory leaks or runaway cgroups.`;
        } else {
          reply = `Active anomaly alert: ${degraded.map(d => `${d.name} (${d.status.toUpperCase()}, score ${d.anomalyScore.toFixed(2)})`).join(', ')}. Autonomous micro-recovery is primed.`;
        }
      } else if (lower.includes('l3') || lower.includes('gate') || lower.includes('approval') || lower.includes('db-proxy')) {
        reply = `L3 Human Approval Gate is enforced on critical nodes such as 'db-connection-pooler'. Because restarting a connection proxy drops active client sockets, ScyldAI holds container action until an SRE operator verifies the blast radius in the Incidents & Gates tab.`;
      } else if (lower.includes('ebpf') || lower.includes('probe') || lower.includes('how it works')) {
        reply = `ScyldAI utilizes eBPF CO-RE (Compile Once - Run Everywhere) kernel probes attached directly to memory allocations (mmap/brk) and process lifecycle hooks. This enables anomaly detection in 0.12ms before user-facing HTTP 500 error cascades occur.`;
      } else if (lower.includes('recovery') || lower.includes('mttr') || lower.includes('sub-second')) {
        reply = `Sub-second micro-recovery freezes the runaway container cgroup, flushes corrupt PID allocations or caches, and performs a micro-restart in ~3.12 seconds without taking down downstream ingress or token engine nodes.`;
      } else {
        reply = `Acknowledged. Current cluster telemetry: 5 registered nodes, 1 protected L3 node (db-connection-pooler), and ${incidents.length} historical incidents logged in cryptographic ledger. All systems resilient.`;
      }

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'sentinel',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botMsg]);
      setIsLoading(false);
    }, 700);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-[#090b12] border-l border-zinc-800 shadow-2xl flex flex-col backdrop-blur-2xl">
      {/* Header */}
      <div className="p-4 bg-[#0d0f18] border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-zinc-100">Sentinel SRE Copilot</h3>
            <p className="text-[10px] text-zinc-500 font-mono">Kernel Grounding & Root-Cause AI</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested prompts */}
      <div className="px-4 py-2 bg-[#0b0d14] border-b border-zinc-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono">
        {[
          'Cluster Health Audit',
          'Why L3 on db-proxy?',
          'How does eBPF work?',
          'Sub-second recovery MTTR',
        ].map(prompt => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:border-zinc-700 whitespace-nowrap transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`p-1.5 rounded-lg shrink-0 ${
              msg.sender === 'user' ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-amber-400'
            }`}>
              {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div className={`p-3 rounded-xl max-w-[85%] ${
              msg.sender === 'user' 
                ? 'bg-amber-500 text-black font-medium' 
                : 'bg-zinc-900/90 border border-zinc-800 text-zinc-200 leading-relaxed'
            }`}>
              <p>{msg.text}</p>
              <span className={`text-[9px] font-mono block mt-1 ${
                msg.sender === 'user' ? 'text-black/70' : 'text-zinc-500'
              }`}>
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono p-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>Analyzing eBPF cluster telemetry...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 bg-[#0d0f18] border-t border-zinc-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Copilot about anomalies, eBPF, or remediation..."
            className="flex-1 bg-zinc-900 border border-zinc-700 focus:border-amber-500 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black rounded-lg transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
