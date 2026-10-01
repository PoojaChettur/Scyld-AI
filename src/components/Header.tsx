import React from 'react';
import {
  Shield,
  Activity,
  Play,
  Pause,
  Cpu,
  Sparkles,
  ExternalLink,
  Layers,
  AlertTriangle,
  Zap,
  Clock,
  GitCompare,
  Grid,
  FileCheck2,
  DollarSign,
  User,
  Radio,
  LogIn,
  LogOut,
  UserCheck,
} from 'lucide-react';
import { MetricsState, UserRole, UserAccount } from '../types';
import { RELIABILITY_PROFILES } from '../services/store';

interface HeaderProps {
  metrics: MetricsState;
  userRole: UserRole;
  currentUser: UserAccount | null;
  currentTab: string;
  isSimulating: boolean;
  pendingApprovalCount: number;
  onSelectTab: (tab: string) => void;
  onToggleSimulation: () => void;
  onToggleSentinel: () => void;
  onToggleDryRun: () => void;
  onToggleCollectorMode: () => void;
  onSelectProfile: (profile: string) => void;
  onToggleUserRole: () => void;
  onOpenCopilot: () => void;
  onOpenSignIn: () => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  metrics,
  userRole,
  currentUser,
  currentTab,
  isSimulating,
  pendingApprovalCount,
  onSelectTab,
  onToggleSimulation,
  onToggleSentinel,
  onToggleDryRun,
  onToggleCollectorMode,
  onSelectProfile,
  onToggleUserRole,
  onOpenCopilot,
  onOpenSignIn,
  onSignOut,
}) => {
  const currentProfile = RELIABILITY_PROFILES[metrics.activeProfile] || RELIABILITY_PROFILES.standard;

  const tabs = [
    { id: 'fleet', label: 'Fleet & Radar', icon: Activity, count: '5' },
    { id: 'inject', label: '⚡ Inject Faults', icon: Zap, isHighlight: true },
    { id: 'timeline', label: 'Incidents & Gates', icon: Clock, badge: pendingApprovalCount > 0 ? pendingApprovalCount : undefined },
    { id: 'compare', label: 'A/B Resilience', icon: GitCompare },
    { id: 'matrix', label: 'Chaos Matrix', icon: Grid },
    { id: 'audit', label: 'Audit Ledger', icon: FileCheck2 },
    { id: 'impact', label: 'ROI & SLA', icon: DollarSign },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0c0d12]/95 backdrop-blur-2xl border-b border-zinc-800/80 transition-all text-zinc-100">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3 pb-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/50">
        {/* Logo & Branding */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 via-zinc-900 to-black border border-emerald-500/40 shadow-lg shadow-emerald-500/10">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white font-sans">ScyldAI</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider font-semibold">
                SENTINEL-NODE v2.4
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono hidden sm:block">
              Autonomous Kernel eBPF Self-Healing Agent &bull; 0-Cascade Micro-Recovery
            </p>
          </div>
        </div>

        {/* Production Cluster Telemetry Indicator */}
        <div className="hidden md:flex items-center gap-3 bg-zinc-900/90 py-1.5 px-3.5 rounded-xl border border-zinc-800 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-500">CLUSTER:</span>
            <span className="text-zinc-200 font-semibold">k8s-prod-us-east1</span>
          </div>
          <span className="text-zinc-700">|</span>
          <div className="flex items-center gap-1.5 text-zinc-400">
            <span className="text-zinc-500">KERNEL:</span>
            <span className="text-cyan-400 font-semibold">eBPF v6.8-generic</span>
          </div>
          <span className="text-zinc-700">|</span>
          <div className="flex items-center gap-1.5 text-zinc-400">
            <span className="text-zinc-500">HEALTH:</span>
            <span className="text-emerald-400 font-bold">99.999% SLA</span>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Ask Sentinel Copilot Trigger */}
          <button
            onClick={onOpenCopilot}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600/30 via-indigo-600/30 to-fuchsia-600/30 border border-violet-500/40 text-violet-300 hover:text-white hover:border-violet-400 transition-all shadow-sm text-xs font-mono group"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400 group-hover:rotate-12 transition-transform" />
            <span className="font-semibold">Ask Sentinel AI</span>
          </button>

          {/* Sentinel Armed Toggle */}
          <button
            onClick={onToggleSentinel}
            title={metrics.sentinelEnabled ? 'Click to Disarm Sentinel (Test unhealed crashloops)' : 'Click to Arm Sentinel (Autonomous recovery)'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
              metrics.sentinelEnabled
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                : 'bg-rose-500/15 border-rose-500/40 text-rose-300 hover:bg-rose-500/25'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${metrics.sentinelEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
            <span>{metrics.sentinelEnabled ? 'ARMED' : 'DISARMED'}</span>
          </button>

          {/* Dry Run Toggle */}
          <button
            onClick={onToggleDryRun}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-all ${
              metrics.dryRunMode
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>{metrics.dryRunMode ? 'DRY-RUN ON' : 'LIVE ACTIONS'}</span>
          </button>

          {/* Collector Mode Toggle */}
          <button
            onClick={onToggleCollectorMode}
            title={`Probe: ${metrics.collectorMode === 'ebpf_core' ? 'eBPF CO-RE ringbuf' : '/proc user fallback'}`}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-mono text-zinc-300 transition-all"
          >
            <Cpu className="w-3.5 h-3.5 text-zinc-400" />
            <span>{metrics.collectorMode === 'ebpf_core' ? 'eBPF CO-RE' : '/proc Fallback'}</span>
          </button>

          {/* Profile Switcher */}
          <div className="relative">
            <select
              value={metrics.activeProfile}
              onChange={(e) => onSelectProfile(e.target.value)}
              className="bg-zinc-900/90 border border-zinc-700 hover:border-zinc-600 rounded-xl px-2.5 py-1.5 text-xs font-mono text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              {Object.values(RELIABILITY_PROFILES).map((prof) => (
                <option key={prof.id} value={prof.id} className="bg-zinc-900 text-zinc-200">
                  {prof.title.split(' ')[0]} ({prof.defaultActionLevel})
                </option>
              ))}
            </select>
          </div>

          {/* Authentication & Operator Profile */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-700/80 rounded-xl p-1 text-xs font-mono">
              <div className="flex items-center gap-2 px-2 py-0.5">
                <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center font-bold text-[10px]">
                  {currentUser.displayName.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-white text-[11px] font-semibold leading-tight truncate max-w-[120px]">
                    {currentUser.displayName}
                  </div>
                  <div className="text-zinc-500 text-[9px] truncate max-w-[120px]">
                    {currentUser.email}
                  </div>
                </div>
              </div>

              {/* Role Badge (Clickable to switch between Admin & Viewer) */}
              <button
                onClick={onToggleUserRole}
                title={`Active Role: ${userRole.toUpperCase()}. Click to switch between Admin (authorized) and Viewer (read-only).`}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                  userRole === 'admin'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                }`}
              >
                {userRole}
              </button>

              {/* Sign Out Button */}
              <button
                onClick={onSignOut}
                title={`Signed in as ${currentUser.email}. Click to sign out.`}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenSignIn}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs font-mono transition-all shadow-md shadow-amber-500/10 active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>

              {/* Fallback Role Toggle if not signed in */}
              <button
                onClick={onToggleUserRole}
                title={`Current RBAC Role: ${userRole.toUpperCase()}. Click to toggle.`}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-xl border text-[11px] font-mono transition-all ${
                  userRole === 'admin'
                    ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-300'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span className="capitalize">{userRole}</span>
              </button>
            </div>
          )}

          {/* Live Simulation Play/Pause */}
          <button
            onClick={onToggleSimulation}
            title={isSimulating ? 'Pause Telemetry Simulation' : 'Resume Telemetry Simulation'}
            className="flex items-center justify-center w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all"
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between overflow-x-auto no-scrollbar py-1">
        <nav className="flex items-center gap-1 sm:gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono transition-all whitespace-nowrap relative ${
                  isActive
                    ? 'bg-zinc-800 text-emerald-400 border border-zinc-700/80 shadow-md font-semibold'
                    : tab.isHighlight
                    ? 'text-amber-300 hover:bg-amber-500/10 hover:text-amber-200 border border-amber-500/20'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : ''}`} />
                <span>{tab.label}</span>

                {tab.count && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                    {tab.count}
                  </span>
                )}

                {tab.badge && (
                  <span className="flex items-center justify-center px-1.5 py-0.2 text-[10px] rounded-full bg-rose-500 text-white font-bold animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Profile Tag */}
        <div className="hidden xl:flex items-center gap-2 text-[11px] font-mono text-zinc-400 pl-4">
          <span className="text-zinc-400">Profile:</span>
          <span className="text-emerald-400 font-semibold">{currentProfile.title}</span>
          <span className="text-zinc-400">&bull; Threshold:</span>
          <span className="text-amber-400 font-bold">{(currentProfile.anomalyThreshold * 100).toFixed(0)}%</span>
        </div>
      </div>
    </header>
  );
};
