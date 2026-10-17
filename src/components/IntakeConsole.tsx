'use client';

import React, { useState, useEffect } from 'react';
import { Send, ShieldAlert, FileText, Zap, Sparkles, CheckCircle2, ExternalLink, X, Check } from 'lucide-react';

export interface IntakeSuccessResult {
  mode: 'triage' | 'prd';
  type: string;
  title: string;
  issueNumber?: number;
  issueUrl?: string;
  timestamp: number;
}

interface IntakeConsoleProps {
  input: string;
  setInput: (value: string) => void;
  intakeMode: 'triage' | 'prd';
  setIntakeMode: (mode: 'triage' | 'prd') => void;
  submitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  lastSuccess?: IntakeSuccessResult | null;
  onClearSuccess?: () => void;
}

export const IntakeConsole: React.FC<IntakeConsoleProps> = ({
  input,
  setInput,
  intakeMode,
  setIntakeMode,
  submitting,
  onSubmit,
  lastSuccess,
  onClearSuccess,
}) => {
  const [showSuccessBadge, setShowSuccessBadge] = useState(false);

  useEffect(() => {
    if (lastSuccess) {
      setShowSuccessBadge(true);
      const timer = setTimeout(() => {
        setShowSuccessBadge(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [lastSuccess]);

  const triageTemplates = [
    {
      label: 'P0 Checkout Deadlock',
      text: 'CRITICAL: Database connection pool exhausted on /api/v1/checkout. Multiple users experiencing 504 Gateway Timeout during payment authorization. Customer impact > 15%, immediate rollback or pool expansion required.',
    },
    {
      label: 'P1 Redis Cache Eviction',
      text: 'HIGH: Redis cache eviction causing severe latency spikes on user session authentication. Latency jumped from 45ms to 980ms across EU clusters.',
    },
    {
      label: 'Sentry DB Deadlock Ingest',
      text: '{"source":"Sentry Inbound Webhook","payload":{"message":"Sentry Alert: Critical Database Deadlock on Transaction Commit in billing service. Concurrent transactions competing for lock on customer_invoices table. Deadlock detected by PostgreSQL engine."}}',
    },
    {
      label: 'Node.js Heap OOM Crash',
      text: 'CRITICAL: Worker process heap out-of-memory crash on background report export worker. Memory usage steadily grows by 150MB/hour until SIGKILL is triggered by Kubernetes OOMKilled controller.',
    },
  ];

  const prdTemplates = [
    {
      label: 'Multi-Tenant Billing & Invoicing',
      text: 'Design an automated Multi-Tenant Usage-Based Metering & Billing Engine. Ingest real-time API call events, calculate tiered volume pricing, synchronize invoices with Stripe Billing API, and enforce automated spending quotas and grace-period alerts.',
    },
    {
      label: 'Real-Time Webhook Dispatcher',
      text: 'Build a fault-tolerant Webhook Dispatch Engine with automatic exponential backoff retry, dead-letter queue, cryptographic signature verification (HMAC-SHA256), and self-serve developer webhook delivery logs.',
    },
    {
      label: 'Autonomous AI Copilot Engine',
      text: 'Architect an autonomous AI TPM Copilot plugin system that ingests sprint burndown telemetry, GitHub pull request diffs, and Sentry runtime errors to autonomously draft sprint retrospectives, identify blockers, and rebalance engineering capacity.',
    },
  ];

  const activeTemplates = intakeMode === 'triage' ? triageTemplates : prdTemplates;

  return (
    <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 shadow-sm transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        {/* Mode Selector */}
        <div className="inline-flex p-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium">
          <button
            type="button"
            onClick={() => setIntakeMode('triage')}
            className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              intakeMode === 'triage'
                ? 'bg-[#0075FF] text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Bug Triage &amp; Incident Analysis</span>
          </button>
          <button
            type="button"
            onClick={() => setIntakeMode('prd')}
            className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              intakeMode === 'prd'
                ? 'bg-[#0075FF] text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Enterprise Feature PRD</span>
          </button>
        </div>

        {/* Dynamic Mode-Aware Boilerplate Templates */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-medium text-slate-400 mr-1 flex items-center gap-1 font-mono">
            <Zap className="w-3 h-3 text-[#0075FF]" />
            <span>{intakeMode === 'prd' ? 'PRD Templates:' : 'Triage Templates:'}</span>
          </span>
          {activeTemplates.map((tpl, i) => {
            const isSelected = input === tpl.text;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setInput(tpl.text)}
                className={`cursor-pointer px-2.5 py-1 rounded border text-[11px] font-medium transition-all ${
                  isSelected
                    ? 'bg-[#0075FF]/20 border-[#0075FF] text-white font-semibold'
                    : 'bg-slate-900 border-slate-800 hover:border-[#0075FF]/50 text-slate-300 hover:text-white'
                }`}
                title="Click to load template into console"
              >
                {tpl.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Finished / Success Operation Indicator Banner */}
      {lastSuccess && (
        <div className="mb-4 p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-indigo-950/40 border border-emerald-500/50 shadow-lg shadow-emerald-950/30 flex items-start justify-between gap-3 animate-fade-in">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-white tracking-wide">
                  {lastSuccess.mode === 'triage'
                    ? 'Incident Triaged & Dispatched'
                    : 'Enterprise PRD Generated & Published'}
                </span>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" />
                  OPERATION FINISHED
                </span>
                {lastSuccess.issueNumber && (
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700">
                    GitHub Issue #{lastSuccess.issueNumber}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-mono truncate max-w-xl">
                {lastSuccess.title}
              </p>
              <div className="flex items-center gap-3 pt-1 text-[11px]">
                {lastSuccess.issueUrl ? (
                  <a
                    href={lastSuccess.issueUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2 transition-colors cursor-pointer"
                  >
                    <span>View on GitHub Repository</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-slate-400 flex items-center gap-1 font-mono">
                    <Check className="w-3 h-3 text-emerald-400" />
                    Activity Stream &amp; Backlog Synchronized
                  </span>
                )}
                <span className="text-[10px] text-slate-500 font-mono">
                  &bull; {new Date(lastSuccess.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
          {onClearSuccess && (
            <button
              type="button"
              onClick={onClearSuccess}
              className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800/80 transition-colors cursor-pointer shrink-0"
              title="Dismiss indicator"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={onSubmit} className="space-y-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            intakeMode === 'triage'
              ? 'Paste error trace, incident alert, or reproduction log...'
              : 'Describe the feature problem statement, user workflow, and target goals...'
          }
          rows={3}
          className="w-full bg-[#090d16] border border-slate-800 focus:border-[#0075FF] focus:ring-1 focus:ring-[#0075FF] rounded-lg p-3 text-xs text-slate-100 placeholder-slate-500 outline-none resize-none transition-all font-mono leading-relaxed"
        />

        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-[11px] text-slate-500 flex items-center gap-1.5 font-mono">
            <Sparkles className="w-3 h-3 text-[#0075FF]" />
            <span>Autonomous multi-agent synthesis &bull; Synced with GitHub REST API</span>
          </span>

          <div className="flex items-center gap-2">
            {showSuccessBadge && !submitting && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2.5 py-1 rounded-md animate-fade-in">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Finished Successfully!</span>
              </span>
            )}

            <button
              type="submit"
              disabled={submitting || !input.trim()}
              className={`cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-[0.98] ${
                showSuccessBadge && !submitting
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                  : 'bg-[#0075FF] hover:bg-[#0060df] disabled:opacity-50 text-white'
              }`}
            >
              {submitting ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Analyzing Telemetry...</span>
                </>
              ) : showSuccessBadge ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Operation Finished!</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Analyze &amp; Dispatch</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
