'use client';

import React, { useState } from 'react';
import { X, Flame, ShieldAlert, Copy, Check, GitPullRequest } from 'lucide-react';
import { ActivityItem, PostMortemReport } from '../../types/dashboard';

interface PostMortemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ActivityItem | null;
  report: PostMortemReport | null;
  generating: boolean;
  onPublish: () => Promise<void>;
  publishing: boolean;
  publishedSuccess: boolean;
}

export const PostMortemModal: React.FC<PostMortemModalProps> = ({
  isOpen,
  onClose,
  item,
  report,
  generating,
  onPublish,
  publishing,
  publishedSuccess,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !item) return null;

  const handleCopy = () => {
    if (!report) return;
    navigator.clipboard.writeText(report.markdownReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white">
              SRE Blameless Post-Mortem &amp; Incident War Room
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {generating ? (
          <div className="text-center py-20 text-slate-400 space-y-2">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p>Synthesizing 5-Whys root cause analysis, timeline, and preventive actions...</p>
          </div>
        ) : report ? (
          (() => {
            const actualReport: any = (report as any)?.postMortem || report;
            const fiveWhys: any[] = Array.isArray(actualReport?.fiveWhys) ? actualReport.fiveWhys : [];
            const actionItems: any[] = Array.isArray(actualReport?.actionItems) ? actualReport.actionItems : [];
            const impact = actualReport?.impact || {};

            return (
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {/* Title & Severity */}
                <div className="p-3.5 rounded-xl bg-[#090d16] border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/40">
                      {actualReport.incidentSeverity || 'P0'}
                    </span>
                    <span className="text-slate-400 text-[11px] font-mono">Status: {actualReport.status || 'Active'}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{actualReport.title || 'Incident RCA'}</h3>
                  <p className="text-slate-300 text-xs leading-relaxed">{actualReport.executiveSummary}</p>
                </div>

                {/* Impact Cards */}
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2.5 rounded-lg bg-[#090d16] border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Downtime</span>
                    <span className="text-xs font-bold text-white font-mono">{impact.downtimeMinutes ?? 45} min</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#090d16] border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Customers</span>
                    <span className="text-xs font-bold text-white font-mono">{impact.affectedCustomers ?? '1,200+'}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#090d16] border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Financial</span>
                    <span className="text-xs font-bold text-white font-mono">{impact.financialExposure ?? '$14,500'}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#090d16] border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Data Loss</span>
                    <span className="text-xs font-bold text-white font-mono">{impact.dataLoss ?? 'None'}</span>
                  </div>
                </div>

                {/* 5-Whys */}
                <div className="p-3.5 rounded-xl bg-[#090d16] border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                    5-Whys Root Cause Chain ({fiveWhys.length})
                  </span>
                  <div className="space-y-1.5">
                    {fiveWhys.map((why: any, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-[11px]">
                        <span className="font-mono text-indigo-400 font-bold shrink-0">W{why.level || (i + 1)}:</span>
                        <span className="text-slate-300">{why.finding}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Items */}
                <div className="p-3.5 rounded-xl bg-[#090d16] border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                    Preventive Action Items ({actionItems.length})
                  </span>
                  <div className="space-y-1.5">
                    {actionItems.map((act: any, i: number) => (
                      <div
                        key={act.id || i}
                        className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800 text-[11px]"
                      >
                        <span className="text-slate-200">{act.action}</span>
                        <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
                          <span>Owner: {act.owner || 'SRE Team'}</span>
                          <span className="font-bold text-indigo-400">Due: {act.dueDate || 'Sprint 25'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()
        ) : (
          <div className="text-center py-10 text-slate-500">No report generated.</div>
        )}

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-medium transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Markdown'}</span>
            </button>

            <button
              type="button"
              onClick={onPublish}
              disabled={publishing || publishedSuccess}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              <span>{publishedSuccess ? 'Published to GitHub' : publishing ? 'Publishing...' : 'Publish Post-Mortem'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
