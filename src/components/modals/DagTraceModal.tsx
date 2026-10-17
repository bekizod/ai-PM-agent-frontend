'use client';

import React from 'react';
import { X, GitMerge, CheckCircle2, Cpu } from 'lucide-react';

interface DagTraceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DagTraceModal: React.FC<DagTraceModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const agents = [
    { name: 'Telemetry Ingestion & Semantic Deduplication', model: 'Gemini 2.5 Pro', latency: '420ms', status: 'Completed' },
    { name: 'Blast Radius & Architectural Risk Analyzer', model: 'DeepSeek Reasoner', latency: '650ms', status: 'Completed' },
    { name: 'Reliability Risk & SLA Exposure Engine', model: 'Claude 3.7 Sonnet', latency: '510ms', status: 'Completed' },
    { name: 'Patch Scaffold & Reproduction Test Synthesizer', model: 'Gemini 2.5 Flash', latency: '890ms', status: 'Completed' },
    { name: 'Git Commit, Issue State Sync & SMTP Dispatcher', model: 'Node Orchestrator', latency: '320ms', status: 'Completed' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <GitMerge className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white">Multi-Agent Execution DAG Trace</h2>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-slate-400 text-xs">
          Chronological execution pipeline of autonomous specialist agents coordinating bug triage and issue synthesis.
        </p>

        <div className="space-y-2.5">
          {agents.map((ag, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#090d16] border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-mono font-bold text-[10px]">
                  0{i + 1}
                </div>
                <div>
                  <div className="font-semibold text-white text-xs">{ag.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">Model: {ag.model} &bull; Latency: {ag.latency}</div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {ag.status}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button type="button" onClick={onClose} className="px-4 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-white text-xs">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
