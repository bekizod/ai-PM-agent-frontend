'use client';

import React from 'react';
import { BarChart3, Clock, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { AnalyticsData } from '../types/dashboard';

interface SprintAnalyticsTabProps {
  analytics: AnalyticsData | null;
}

export const SprintAnalyticsTab: React.FC<SprintAnalyticsTabProps> = ({ analytics }) => {
  if (!analytics) {
    return (
      <div className="text-center py-16 border border-dashed border-slate-800 rounded-xl p-8 bg-[#0f172a]">
        <BarChart3 className="w-8 h-8 text-slate-600 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-slate-300">Loading Telemetry &amp; Velocity</h3>
        <p className="text-xs text-slate-500 mt-1">
          Aggregating cycle times, incident frequency, and burndown trajectory...
        </p>
      </div>
    );
  }

  const { kpis, burndown, components } = analytics;

  return (
    <div className="space-y-4">
      {/* 4 Core KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* MTTD */}
        <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-medium">Mean Time to Detect</span>
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">{kpis.mttdMinutes}m</div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono">P0/P1 Alert Latency</div>
        </div>

        {/* MTTR */}
        <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-medium">Mean Time to Resolve</span>
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">{kpis.mttrHours}h</div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono">End-to-End Remediation</div>
        </div>

        {/* SLA Compliance */}
        <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-medium">SLA Compliance Rate</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono">
            {kpis.slaComplianceRate}%
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono">Target: &ge; 99.5%</div>
        </div>

        {/* Critical Defect Ratio */}
        <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-medium">Critical Defect Ratio</span>
            <AlertTriangle className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">
            {kpis.criticalDefectRatio}%
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono">P0/P1 vs Total Issues</div>
        </div>
      </div>

      {/* Sprint Burndown SVG Chart */}
      <div className="p-5 rounded-xl bg-[#0f172a] border border-slate-800 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            <span>Sprint Burndown Trajectory</span>
          </h3>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-400 font-medium">
              <span className="w-2.5 h-0.5 bg-slate-500 rounded" />
              <span>Ideal Guideline</span>
            </span>
            <span className="flex items-center gap-1.5 text-indigo-400 font-semibold">
              <span className="w-2.5 h-0.5 bg-indigo-500 rounded" />
              <span>Actual Burn</span>
            </span>
          </div>
        </div>

        {burndown && burndown.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <div className="min-w-[500px] h-48 flex items-end justify-between gap-4 pt-4 px-2">
              {burndown.map((point, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="text-[10px] font-mono text-indigo-300 font-bold">
                    {point.actual} pts
                  </div>
                  <div className="w-full flex items-end justify-center gap-1.5 h-32">
                    {/* Ideal Bar */}
                    <div
                      style={{ height: `${Math.min(100, (point.ideal / 50) * 100)}%` }}
                      className="w-3 rounded-t bg-slate-700/60 transition-all"
                      title={`Ideal: ${point.ideal}`}
                    />
                    {/* Actual Bar */}
                    <div
                      style={{ height: `${Math.min(100, (point.actual / 50) * 100)}%` }}
                      className="w-3.5 rounded-t bg-indigo-600 transition-all shadow-sm"
                      title={`Actual: ${point.actual}`}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{point.day}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-slate-500">
            No burndown data recorded for current sprint.
          </div>
        )}
      </div>

      {/* Component Risk Heatmap */}
      <div className="p-5 rounded-xl bg-[#0f172a] border border-slate-800 shadow-sm">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
          <span>Component Stability Matrix</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="pb-2 font-medium">Service Component</th>
                <th className="pb-2 font-medium">Active Incidents</th>
                <th className="pb-2 font-medium">Risk Score</th>
                <th className="pb-2 font-medium">Risk Level</th>
                <th className="pb-2 font-medium">Estimated MTTR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {components && components.length > 0 ? (
                components.map((comp, i) => (
                  <tr key={i} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-2.5 font-mono text-slate-200">{comp.name}</td>
                    <td className="py-2.5 text-slate-300 font-mono">{comp.activeIssues}</td>
                    <td className="py-2.5 text-slate-300 font-mono">{comp.riskScore} / 100</td>
                    <td className="py-2.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          comp.riskLevel === 'Critical'
                            ? 'bg-indigo-950/80 text-indigo-300 border-indigo-500/40'
                            : comp.riskLevel === 'High'
                            ? 'bg-slate-900 text-slate-200 border-slate-700'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}
                      >
                        {comp.riskLevel}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-400 font-mono">{comp.mttr}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-slate-500 text-xs">
                    All architectural components stable.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
