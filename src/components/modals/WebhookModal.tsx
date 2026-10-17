'use client';

import React, { useState } from 'react';
import { X, Radio, Send, Sparkles, Activity, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface WebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulate: (preset?: string) => Promise<void>;
  simulating: boolean;
}

export const WebhookModal: React.FC<WebhookModalProps> = ({
  isOpen,
  onClose,
  onSimulate,
  simulating,
}) => {
  const [activePreset, setActivePreset] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTrigger = async (preset: string) => {
    setActivePreset(preset);
    try {
      await onSimulate(preset);
    } finally {
      setActivePreset(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 text-xs animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Radio className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Autonomous Webhook Incident Listener</h2>
              <p className="text-[10px] text-slate-400 font-mono">Zero-Touch Ingestion &bull; Multi-Agent Triage</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Operational Purpose Explainer */}
        <div className="p-3.5 rounded-xl bg-[#090d16] border border-slate-800 space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block font-mono flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            <span>How Webhook Ingestion Works</span>
          </span>
          <p className="text-slate-300 text-xs leading-relaxed">
            In modern microservices, observability platforms (Datadog, PagerDuty, Sentry) fire automated HTTP alerts.
            This listener demonstrates the AI TPM Agent immediately ingesting payloads, evaluating blast radius, creating GitHub tickets, and dispatching war rooms autonomously.
          </p>
        </div>

        {/* Live Simulation Presets */}
        <div className="space-y-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
            Simulate Inbound Telemetry Alerts
          </span>

          {/* Preset 1: Datadog Database Exhaustion */}
          <button
            type="button"
            onClick={() => handleTrigger('datadog_db_exhaustion')}
            disabled={simulating}
            className="w-full p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-red-500/50 hover:bg-red-950/20 text-left transition-all cursor-pointer group disabled:cursor-not-allowed disabled:opacity-60 shadow-xs"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-white group-hover:text-red-300 transition-colors text-xs">
                Datadog: Database Connection Pool Spike
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold font-mono bg-red-950 text-red-400 border border-red-500/40">
                P0 CRITICAL
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal mb-1.5">
              PostgreSQL pool utilization &gt; 98% on primary RDS cluster. 504 timeouts spiking on checkout.
            </p>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/60">
              <span>Source: Datadog Alert Webhook &bull; #ALERT-9921</span>
              {activePreset === 'datadog_db_exhaustion' ? (
                <span className="text-indigo-400 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 animate-spin" /> Ingesting...
                </span>
              ) : (
                <span className="text-slate-400 group-hover:text-red-400 font-medium transition-colors">
                  Trigger Ingestion &rarr;
                </span>
              )}
            </div>
          </button>

          {/* Preset 2: PagerDuty Auth Latency */}
          <button
            type="button"
            onClick={() => handleTrigger('pagerduty_auth_latency')}
            disabled={simulating}
            className="w-full p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 hover:bg-amber-950/20 text-left transition-all cursor-pointer group disabled:cursor-not-allowed disabled:opacity-60 shadow-xs"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-white group-hover:text-amber-300 transition-colors text-xs">
                PagerDuty: Auth Gateway 504 Timeout
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold font-mono bg-amber-950 text-amber-400 border border-amber-500/40">
                P1 HIGH
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal mb-1.5">
              p99 latency on auth-svc /oauth/token jumped to 980ms across EU-central clusters.
            </p>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/60">
              <span>Source: PagerDuty Incident &bull; Service: auth-svc</span>
              {activePreset === 'pagerduty_auth_latency' ? (
                <span className="text-indigo-400 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 animate-spin" /> Ingesting...
                </span>
              ) : (
                <span className="text-slate-400 group-hover:text-amber-400 font-medium transition-colors">
                  Trigger Ingestion &rarr;
                </span>
              )}
            </div>
          </button>

          {/* Preset 3: Sentry Worker OOM */}
          <button
            type="button"
            onClick={() => handleTrigger('sentry_runtime_oom')}
            disabled={simulating}
            className="w-full p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 hover:bg-indigo-950/20 text-left transition-all cursor-pointer group disabled:cursor-not-allowed disabled:opacity-60 shadow-xs"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-white group-hover:text-indigo-300 transition-colors text-xs">
                Sentry: Worker Heap Out-of-Memory Crash
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold font-mono bg-indigo-950 text-indigo-400 border border-indigo-500/40">
                P0 CRITICAL
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal mb-1.5">
              Export worker heap steady growth until SIGKILL was triggered by Kubernetes OOMKilled.
            </p>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/60">
              <span>Source: Sentry Inbound Webhook &bull; #SENTRY-4412</span>
              {activePreset === 'sentry_runtime_oom' ? (
                <span className="text-indigo-400 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 animate-spin" /> Ingesting...
                </span>
              ) : (
                <span className="text-slate-400 group-hover:text-indigo-400 font-medium transition-colors">
                  Trigger Ingestion &rarr;
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-[10px] text-slate-500 font-mono">
            Endpoint: <code className="text-indigo-400">/api/agent/webhook/incident</code>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
