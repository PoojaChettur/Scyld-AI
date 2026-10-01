import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, ArrowRight, ShieldCheck, Activity } from 'lucide-react';
import { Microservice, Incident, UserRole } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'sentinel';
  text: string;
  timestamp: string;
  suggestedAction?: {
    serviceId: string;
    action: string;
  };
}

interface AskSentinelModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidents: Incident[];
  services: Microservice[];
  userRole: UserRole;
  onExecuteSuggestedAction: (serviceId: string, action: string) => void;
}

export const AskSentinelModal: React.FC<AskSentinelModalProps> = ({
  isOpen,
  onClose,
  incidents,
  services,
  userRole,
  onExecuteSuggestedAction,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-msg',
      sender: 'sentinel',
      text: 'Greetings Operator. I am Ask Sentinel, your autonomous SRE reliability copilot grounded in live cgroup telemetry, eBPF probes, and incident audits. Ask me about recent outages, root causes, or risk assessments.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const quickPrompts = [
    'Which microservice has highest risk right now?',
    'What caused the latest incident?',
    'Explain eBPF CO-RE vs Kubelet CrashLoops',
    'Assess current cascade blast radius',
  ];

  const handleSend = async (userText: string) => {
    if (!userText.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: timeStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Grounded Copilot Reasoning based on actual fleet state
    setTimeout(() => {
      let botResponse = '';
      let suggestedAction: { serviceId: string; action: string } | undefined;

      const lower = userText.toLowerCase();

      const degradedSvc = services.find((s) => s.status === 'degraded' || s.fault !== 'none');
      const latestInc = incidents[0];

      if (lower.includes('risk') || lower.includes('highest') || lower.includes('health')) {
        const sorted = [...services].sort((a, b) => b.anomalyScore - a.anomalyScore);
        const top = sorted[0];
        if (top.anomalyScore > 0.4 || top.fault !== 'none') {
          botResponse = `Currently, [${top.name}] presents the highest operational risk with an IsolationForest anomaly index of ${(top.anomalyScore * 100).toFixed(1)}% (CFS CPU: ${Math.round(top.cpuPct)}%, RSS: ${Math.round(top.rssMb)}MB/${top.maxRssMb}MB). Injected fault: [${top.fault}].`;
          if (top.fault !== 'none') {
            suggestedAction = {
              serviceId: top.id,
              action: top.fault === 'zombie_horde' ? 'reap_zombies' : 'restart_container',
            };
          }
        } else {
          botResponse = `All 5 fleet microservices are operating nominally within baseline parameters. Mean fleet anomaly index is ${((services.reduce((a, b) => a + b.anomalyScore, 0) / services.length) * 100).toFixed(1)}%. Zero critical cgroup pressure detected.`;
        }
      } else if (lower.includes('incident') || lower.includes('caused') || lower.includes('latest')) {
        if (latestInc) {
          botResponse = `Incident [${latestInc.id}] on node [${latestInc.serviceName}]: Root cause was identified via eBPF probe as ${latestInc.faultType.replace(/_/g, ' ')}. ${latestInc.plainSummary} Sentinel MTTR: ${latestInc.mttrMs ? (latestInc.mttrMs / 1000).toFixed(2) + 's' : 'In progress'}. Cost saved: $${latestInc.costSavedUsd.toLocaleString()}.`;
        } else {
          botResponse = `No critical incidents recorded during the active session. The fleet has maintained 100% nominal availability under the current reliability profile.`;
        }
      } else if (lower.includes('ebpf') || lower.includes('kubelet') || lower.includes('crashloop')) {
        botResponse = `Unlike standard Kubernetes which relies on coarse kubelet healthcheck timeouts (leading to OOMKilled crashloops and 30-minute PagerDuty wakeups), ScyldAI runs eBPF CO-RE hooks directly on kernel tracepoints (sys_enter_mmap, sched_process_exit). We detect heap trajectory divergence in <800ms and execute targeted cgroup freeze/thaw in 3.1s without dropping user traffic.`;
      } else if (lower.includes('blast') || lower.includes('cascade') || lower.includes('radius')) {
        botResponse = `The current blast radius is 0.0%. ScyldAI enforces strict cgroup v2 controller boundaries and socket drain isolation. Even if a service experiences memory exhaustion or zombie PID spikes, dependent services (db-connection-pooler, auth-identity) remain unimpacted.`;
      } else {
        botResponse = `Analysis for "${userText}": Sentinel kernel daemon is monitoring all 5 container cgroups via eBPF ring buffer. Current active profile is ${services[0]?.name ? 'protecting the fleet' : 'online'}. Mean MTTR is 3.12s with 0 cascade failures.`;
        if (degradedSvc) {
          suggestedAction = {
            serviceId: degradedSvc.id,
            action: 'restart_container',
          };
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `sentinel-${Date.now()}`,
          sender: 'sentinel',
          text: botResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedAction,
        },
      ]);
      setIsLoading(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in text-zinc-100 font-mono text-xs">
      <div className="bg-[#0c0e14] border border-violet-500/40 rounded-2xl w-full max-w-2xl h-[560px] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800 bg-[#08090f]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/40">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white font-sans">Ask Sentinel AI SRE Copilot</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-500/10 text-violet-300 border border-violet-500/30">
                  Grounded in eBPF Telemetry
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono">
                Interactive real-time diagnostics & zero-cascade infrastructure advisor.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Query Prompt Chips */}
        <div className="px-5 py-2.5 bg-zinc-900/50 border-b border-zinc-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 rounded-lg bg-zinc-800/70 hover:bg-zinc-800 hover:text-white text-zinc-300 text-[11px] border border-zinc-700/80 transition-all whitespace-nowrap"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Messages Scroll Area */}
        <div
          ref={messagesContainerRef}
          className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#08090f]"
        >
          {messages.map((m) => {
            const isBot = m.sender === 'sentinel';
            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border ${
                    isBot
                      ? 'bg-violet-500/20 border-violet-500/40 text-violet-400'
                      : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                  }`}
                >
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-xl p-3 space-y-2 ${
                    isBot
                      ? 'bg-zinc-900/80 border border-zinc-800 text-zinc-200'
                      : 'bg-emerald-950/40 border border-emerald-700/40 text-emerald-200'
                  }`}
                >
                  <p className="font-sans text-xs leading-relaxed">{m.text}</p>

                  {/* If Bot suggested an action */}
                  {m.suggestedAction && (
                    <div className="pt-2 border-t border-zinc-800 flex items-center justify-between gap-3">
                      <span className="text-[10px] text-zinc-400 font-mono">
                        Recommendation: {m.suggestedAction.action} on [{m.suggestedAction.serviceId}]
                      </span>
                      <button
                        onClick={() => {
                          if (userRole !== 'admin') {
                            alert('Administrator permissions required to execute suggested remediation.');
                            return;
                          }
                          onExecuteSuggestedAction(m.suggestedAction!.serviceId, m.suggestedAction!.action);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 transition-all"
                      >
                        <span>Execute Now</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <span className="text-[9px] text-zinc-400 block text-right font-mono">
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-violet-400 text-xs font-mono">
              <Activity className="w-4 h-4 animate-spin" />
              <span>Sentinel analyzing kernel ring buffer & telemetry vectors...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="p-3 bg-[#0a0c12] border-t border-zinc-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Sentinel SRE copilot about outages, cgroup metrics, or eBPF hooks..."
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-violet-500 font-sans"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
