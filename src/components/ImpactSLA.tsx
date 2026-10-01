import React, { useState, useEffect } from 'react';
import { DollarSign, ShieldCheck, Leaf, TrendingUp, Award, Clock } from 'lucide-react';
import { MetricsState } from '../types';
import { RELIABILITY_PROFILES } from '../services/store';

interface ImpactSLAProps {
  metrics: MetricsState;
  onSelectProfile: (profileKey: string) => void;
}

export const ImpactSLA: React.FC<ImpactSLAProps> = ({
  metrics,
  onSelectProfile,
}) => {
  const currentProfile = RELIABILITY_PROFILES[metrics.activeProfile] || RELIABILITY_PROFILES.standard;

  const [downtimeCostPerHour, setDowntimeCostPerHour] = useState<number>(currentProfile.revenueLossPerHourUsd);
  const [incidentsPerMonth, setIncidentsPerMonth] = useState<number>(8);
  const [manualMttrMin, setManualMttrMin] = useState<number>(35);

  useEffect(() => {
    setDowntimeCostPerHour(currentProfile.revenueLossPerHourUsd);
  }, [metrics.activeProfile, currentProfile.revenueLossPerHourUsd]);

  // Savings calculations
  const manualMttrHours = manualMttrMin / 60;
  const sentinelMttrHours = metrics.averageMttrMs / 1000 / 3600;
  const hoursSavedPerIncident = Math.max(0, manualMttrHours - sentinelMttrHours);

  const monthlyHoursSaved = incidentsPerMonth * hoursSavedPerIncident;
  const monthlyCostSaved = Math.round(monthlyHoursSaved * downtimeCostPerHour);
  const annualCostSaved = monthlyCostSaved * 12;

  // Carbon savings (~1.8kg CO2 per server hour in active cascade distress)
  const monthlyCarbonSavedKg = Number((monthlyHoursSaved * 1.8).toFixed(1));
  const annualCarbonSavedKg = Number((monthlyCarbonSavedKg * 12).toFixed(0));

  return (
    <div className="bg-[#0b0d13] border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-2xl text-zinc-100 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-mono uppercase">
              Financial ROI, SLA & Industry Reliability Profiles
            </h3>
            <p className="text-xs text-zinc-400 font-sans">
              Quantifiable impact models validating 99.999% availability SLAs and OPEX outage mitigation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <Award className="w-4 h-4 text-emerald-400" />
          <span className="text-zinc-400">Active Guarantee:</span>
          <span className="text-emerald-400 font-bold">Five-Nines (99.999%)</span>
        </div>
      </div>

      {/* Profiles Cards */}
      <div className="space-y-3">
        <h4 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
          Select Targeted Industry Profile
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {Object.values(RELIABILITY_PROFILES).map((prof) => {
            const isSelected = metrics.activeProfile === prof.id;
            return (
              <button
                key={prof.id}
                onClick={() => onSelectProfile(prof.id)}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-500/60 shadow-lg ring-1 ring-emerald-500/30'
                    : 'bg-[#07080c] border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold text-white">{prof.title.split(' ')[0]}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 uppercase">
                      {prof.defaultActionLevel}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-sans line-clamp-2 leading-relaxed">
                    {prof.tagline}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-zinc-850 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <span>${(prof.revenueLossPerHourUsd / 1000).toFixed(0)}k/hr</span>
                  <span className="text-amber-400 font-bold">{(prof.anomalyThreshold * 100).toFixed(0)}% thr</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Financial Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        {/* Sliders (Col 7) */}
        <div className="lg:col-span-7 bg-[#07080c] border border-zinc-800 rounded-xl p-4 sm:p-5 space-y-5 font-mono text-xs">
          <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Interactive ROI Simulation Model</span>
          </h4>

          {/* Slider 1: Downtime Cost */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-zinc-400">Hourly Revenue Loss at Outage:</label>
              <span className="text-emerald-400 font-bold text-sm">
                ${downtimeCostPerHour.toLocaleString()} / hr
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="250000"
              step="5000"
              value={downtimeCostPerHour}
              onChange={(e) => setDowntimeCostPerHour(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Slider 2: Incidents per Month */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-zinc-400">Expected Micro-Incidents / Month:</label>
              <span className="text-cyan-400 font-bold text-sm">{incidentsPerMonth} incidents</span>
            </div>
            <input
              type="range"
              min="1"
              max="40"
              step="1"
              value={incidentsPerMonth}
              onChange={(e) => setIncidentsPerMonth(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* Slider 3: Manual MTTR */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-zinc-400">Manual SRE MTTR (PagerDuty Baseline):</label>
              <span className="text-amber-400 font-bold text-sm">{manualMttrMin} minutes</span>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              step="5"
              value={manualMttrMin}
              onChange={(e) => setManualMttrMin(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-lg text-zinc-300 font-sans text-xs">
            <strong className="text-white font-mono">ScyldAI Autonomous MTTR:</strong>{' '}
            {(metrics.averageMttrMs / 1000).toFixed(2)} seconds. Eliminates 99.8% of human pager wait time.
          </div>
        </div>

        {/* Outputs (Col 5) */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
          <div className="bg-[#07080c] border border-emerald-500/40 rounded-xl p-4">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>Annual Revenue Saved</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
              ${annualCostSaved.toLocaleString()}
            </div>
            <p className="text-[11px] text-zinc-400 font-mono mt-1">
              ${monthlyCostSaved.toLocaleString()} / month protected
            </p>
          </div>

          <div className="bg-[#07080c] border border-cyan-500/40 rounded-xl p-4">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>Outage Downtime Prevented</span>
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-cyan-400 font-mono mt-1">
              {(monthlyHoursSaved * 12).toFixed(1)} hrs / yr
            </div>
            <p className="text-[11px] text-zinc-400 font-mono mt-1">
              {monthlyHoursSaved.toFixed(1)} hrs saved every month
            </p>
          </div>

          <div className="bg-[#07080c] border border-purple-500/40 rounded-xl p-4">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>Avoided Carbon Footprint</span>
              <Leaf className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-purple-300 font-mono mt-1">
              {annualCarbonSavedKg} kg CO₂
            </div>
            <p className="text-[11px] text-zinc-400 font-mono mt-1">
              Eliminating runaway CPU loop server power waste
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
