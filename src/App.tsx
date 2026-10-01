import React, { useState, useEffect } from 'react';
import { sentinelStore, RELIABILITY_PROFILES } from './services/store';
import { Microservice, Incident, MetricsState, ActionStreamLog, UserRole, FaultType, UserAccount } from './types';

// Components
import { Header } from './components/Header';
import { FaultInjectorBar } from './components/FaultInjectorBar';
import { FleetRadar } from './components/FleetRadar';
import { ActionStreamTerminal } from './components/ActionStreamTerminal';
import { TelemetryCharts } from './components/TelemetryCharts';
import { ExplainabilityPanel } from './components/ExplainabilityPanel';
import { IncidentsTimeline } from './components/IncidentsTimeline';
import { ABResilience } from './components/ABResilience';
import { ChaosMatrix } from './components/ChaosMatrix';
import { AuditLedger } from './components/AuditLedger';
import { ImpactSLA } from './components/ImpactSLA';
import { AskSentinelModal } from './components/AskSentinelModal';
import { SignInModal } from './components/SignInModal';

export default function App() {
  const [services, setServices] = useState<Microservice[]>(sentinelStore.getServices());
  const [incidents, setIncidents] = useState<Incident[]>(sentinelStore.getIncidents());
  const [metrics, setMetrics] = useState<MetricsState>(sentinelStore.getMetrics());
  const [logs, setLogs] = useState<ActionStreamLog[]>(sentinelStore.getActionStreamLogs());
  const [userRole, setUserRole] = useState<UserRole>(sentinelStore.userRole);
  const [isSimulating, setIsSimulating] = useState<boolean>(sentinelStore.isSimulationRunning());

  // Authentication State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('scyld_operator_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      uid: 'u-sairam-01',
      email: 'sit24sc025@sairamtap.edu.in',
      displayName: 'Sairam SRE Lead',
      role: 'admin',
    };
  });
  const [isSignInModalOpen, setIsSignInModalOpen] = useState<boolean>(false);

  // Tabs & Services
  const [currentTab, setCurrentTab] = useState<string>('fleet');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('payment-svc');
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);

  // Subscribe to store updates
  useEffect(() => {
    const unsubscribe = sentinelStore.subscribe(() => {
      setServices([...sentinelStore.getServices()]);
      setIncidents([...sentinelStore.getIncidents()]);
      setMetrics({ ...sentinelStore.getMetrics() });
      setLogs([...sentinelStore.getActionStreamLogs()]);
      setUserRole(sentinelStore.userRole);
      setIsSimulating(sentinelStore.isSimulationRunning());
    });
    return () => unsubscribe();
  }, []);

  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0];
  const pendingIncidents = incidents.filter((i) => i.status === 'awaiting_approval');
  const currentProfile = RELIABILITY_PROFILES[metrics.activeProfile] || RELIABILITY_PROFILES.standard;

  // Handlers
  const handleToggleSimulation = () => {
    if (sentinelStore.isSimulationRunning()) {
      sentinelStore.stopSimulation();
      setIsSimulating(false);
    } else {
      sentinelStore.startSimulation();
      setIsSimulating(true);
    }
  };

  const handleToggleSentinel = () => {
    sentinelStore.setSentinelEnabled(!metrics.sentinelEnabled);
  };

  const handleToggleDryRun = () => {
    sentinelStore.setDryRunMode(!metrics.dryRunMode);
  };

  const handleToggleCollectorMode = () => {
    sentinelStore.setCollectorMode(metrics.collectorMode === 'ebpf_core' ? 'proc_cgroup' : 'ebpf_core');
  };

  const handleSelectProfile = (profileKey: string) => {
    sentinelStore.setActiveProfile(profileKey);
  };

  const handleToggleUserRole = () => {
    const nextRole: UserRole = userRole === 'admin' ? 'viewer' : 'admin';
    sentinelStore.setUserRole(nextRole);
    if (currentUser) {
      const updated = { ...currentUser, role: nextRole };
      setCurrentUser(updated);
      try {
        localStorage.setItem('scyld_operator_user', JSON.stringify(updated));
      } catch {}
    }
  };

  const handleSignIn = (user: UserAccount) => {
    setCurrentUser(user);
    sentinelStore.setUserRole(user.role);
    try {
      localStorage.setItem('scyld_operator_user', JSON.stringify(user));
    } catch {}

    sentinelStore.addStreamLog(
      'success',
      'SECURITY',
      `Authenticated operator [${user.email}] via SSO. RBAC role: [${user.role.toUpperCase()}].`
    );
    sentinelStore.addAuditRecord(
      user.email,
      user.role,
      'USER_SIGN_IN',
      'Auth Gate',
      `User authenticated as ${user.displayName} with role ${user.role}`
    );
  };

  const handleSignOut = () => {
    const email = currentUser?.email || 'operator';
    setCurrentUser(null);
    sentinelStore.setUserRole('viewer');
    try {
      localStorage.removeItem('scyld_operator_user');
    } catch {}

    sentinelStore.addStreamLog(
      'info',
      'SECURITY',
      `Operator [${email}] signed out. Active mode: Viewer (Read-Only).`
    );
    sentinelStore.addAuditRecord(
      email,
      'viewer',
      'USER_SIGN_OUT',
      'Auth Gate',
      'User logged out from Sentinel workstation'
    );
  };

  const handleInjectFault = (serviceId: string, fault: FaultType) => {
    sentinelStore.injectFault(serviceId, fault);
  };

  const handleClearAll = () => {
    sentinelStore.clearAllFaults();
  };

  const handleToggleProtect = (serviceId: string, isProtected: boolean) => {
    sentinelStore.setServiceProtected(serviceId, isProtected);
  };

  const handleApproveIncident = (incidentId: string) => {
    sentinelStore.approveIncident(incidentId);
  };

  const handleRejectIncident = (incidentId: string) => {
    sentinelStore.rejectIncident(incidentId);
  };

  const handleExecuteSuggestedAction = (serviceId: string, action: string) => {
    const svc = services.find((s) => s.id === serviceId);
    if (!svc) return;

    sentinelStore.addStreamLog(
      'action',
      'SECURITY',
      `Operator authorized Copilot suggestion: [${action}] on container [${svc.name}]`,
      svc.name
    );

    if (action === 'restart_container' || action === 'reap_zombies' || action === 'apply_cgroup_limit') {
      svc.status = 'healing';
      setTimeout(() => {
        sentinelStore.clearAllFaults();
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080a] text-zinc-100 flex flex-col selection:bg-emerald-500/30 selection:text-white font-sans antialiased">
      {/* Top Header Navigation */}
      <Header
        metrics={metrics}
        userRole={userRole}
        currentUser={currentUser}
        currentTab={currentTab}
        isSimulating={isSimulating}
        pendingApprovalCount={pendingIncidents.length}
        onSelectTab={setCurrentTab}
        onToggleSimulation={handleToggleSimulation}
        onToggleSentinel={handleToggleSentinel}
        onToggleDryRun={handleToggleDryRun}
        onToggleCollectorMode={handleToggleCollectorMode}
        onSelectProfile={handleSelectProfile}
        onToggleUserRole={handleToggleUserRole}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        onOpenSignIn={() => setIsSignInModalOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
          {/* TAB 1: Fleet & Radar */}
          {currentTab === 'fleet' && (
            <div className="space-y-6">
              <FaultInjectorBar
                services={services}
                userRole={userRole}
                onInjectFault={handleInjectFault}
                onClearAll={handleClearAll}
                onToggleRole={handleToggleUserRole}
              />

              <FleetRadar
                services={services}
                anomalyThreshold={currentProfile.anomalyThreshold}
                selectedServiceId={selectedServiceId}
                userRole={userRole}
                onInjectFault={handleInjectFault}
                onToggleProtect={handleToggleProtect}
                onSelectServiceForTelemetry={setSelectedServiceId}
              />

              <ActionStreamTerminal
                logs={logs}
                onClearLogs={() => sentinelStore.clearActionStreamLogs()}
              />

              <TelemetryCharts
                service={selectedService}
                anomalyThreshold={currentProfile.anomalyThreshold}
              />

              <ExplainabilityPanel
                service={selectedService}
                latestIncident={incidents[0]}
              />
            </div>
          )}

          {/* TAB 2: Inject Synthetic Faults */}
          {currentTab === 'inject' && (
            <div className="space-y-6">
              <FaultInjectorBar
                services={services}
                userRole={userRole}
                onInjectFault={handleInjectFault}
                onClearAll={handleClearAll}
                onToggleRole={handleToggleUserRole}
              />

              <FleetRadar
                services={services}
                anomalyThreshold={currentProfile.anomalyThreshold}
                selectedServiceId={selectedServiceId}
                userRole={userRole}
                onInjectFault={handleInjectFault}
                onToggleProtect={handleToggleProtect}
                onSelectServiceForTelemetry={setSelectedServiceId}
              />

              <ActionStreamTerminal
                logs={logs}
                onClearLogs={() => sentinelStore.clearActionStreamLogs()}
              />
            </div>
          )}

          {/* TAB 3: Incidents & Gates */}
          {currentTab === 'timeline' && (
            <IncidentsTimeline
              incidents={incidents}
              userRole={userRole}
              onApproveIncident={handleApproveIncident}
              onRejectIncident={handleRejectIncident}
            />
          )}

          {/* TAB 4: A/B Resilience */}
          {currentTab === 'compare' && <ABResilience />}

          {/* TAB 5: Chaos Matrix */}
          {currentTab === 'matrix' && <ChaosMatrix />}

          {/* TAB 6: Audit Ledger */}
          {currentTab === 'audit' && <AuditLedger />}

          {/* TAB 7: ROI & SLA */}
          {currentTab === 'impact' && (
            <ImpactSLA
              metrics={metrics}
              onSelectProfile={handleSelectProfile}
            />
          )}
        </main>

      {/* Ask Sentinel AI Copilot Modal */}
      <AskSentinelModal
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        incidents={incidents}
        services={services}
        userRole={userRole}
        onExecuteSuggestedAction={handleExecuteSuggestedAction}
      />

      {/* Operator Authentication Modal */}
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        onSignIn={handleSignIn}
        currentUser={currentUser}
      />
    </div>
  );
}
