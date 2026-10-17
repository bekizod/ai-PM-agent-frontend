'use client';

import React from 'react';
import { CheckCircle2, MoreVertical, GitPullRequest, ExternalLink, Zap, Calendar } from 'lucide-react';
import { GitHubIssueSummary, TeamCapacityPlan } from '../types/dashboard';

interface VisionProjectsTableProps {
  issues: GitHubIssueSummary[];
  capacityPlan: any;
  onSelectIssue: (issue: GitHubIssueSummary) => void;
  repoContext: string;
}

export const VisionProjectsTable: React.FC<VisionProjectsTableProps> = ({
  issues,
  capacityPlan,
  onSelectIssue,
  repoContext,
}) => {
  const plan = capacityPlan?.capacityPlan || capacityPlan;
  const members = plan?.members || [];

  return (
    <div className="vision-card p-6 shadow-xl flex flex-col justify-between">
      {/* Table Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
        <div>
          <h3 className="text-sm font-bold text-white">Active Sprint Backlog &amp; Tasks</h3>
          <span className="text-[11px] font-bold text-emerald-400 font-mono flex items-center gap-1.5 mt-0.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{issues.length} synchronized with GitHub REST API</span>
          </span>
        </div>

        <a
          href={`https://github.com/${repoContext}/issues`}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-slate-400 hover:text-[#0075FF] flex items-center gap-1 font-mono transition-colors"
        >
          <span>View Repo</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Projects Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-white/5 pb-2">
              <th className="pb-3 font-semibold">ISSUE / TASK</th>
              <th className="pb-3 font-semibold">COLLABORATORS</th>
              <th className="pb-3 font-semibold">POINTS</th>
              <th className="pb-3 font-semibold">COMPLETION</th>
              <th className="pb-3 font-semibold text-right">SYNC / ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {issues.slice(0, 6).map((issue, idx) => {
              const isClosed = issue.state === 'closed';
              const isP0 = issue.labels.some((l) => l.toLowerCase().includes('p0'));
              const pct = isClosed ? 100 : isP0 ? 40 : 65;
              const points = isP0 ? '13 pts' : '5 pts';

              return (
                <tr
                  key={issue.number}
                  onClick={() => onSelectIssue(issue)}
                  className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                >
                  {/* Title & Badge */}
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          isP0
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm shadow-rose-500/20'
                            : 'bg-[#0075FF]/20 text-cyan-300 border border-[#0075FF]/30'
                        }`}
                      >
                        #{issue.number}
                      </div>
                      <div className="truncate max-w-[220px] sm:max-w-[280px]">
                        <span className="font-semibold text-white group-hover:text-cyan-300 transition-colors truncate block">
                          {issue.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {issue.labels.join(', ') || 'Backlog'}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Collaborator Avatar Stack */}
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center -space-x-2 overflow-hidden">
                      {members.slice(0, 3).map((m: any, i: number) => (
                        <img
                          key={i}
                          src={m.avatar || 'https://avatars.githubusercontent.com/u/121251335?v=4'}
                          alt={m.name}
                          className="w-6 h-6 rounded-full border-2 border-[#060B26] object-cover"
                          title={m.name}
                        />
                      ))}
                      {members.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-[#1A1F37] border-2 border-[#060B26] text-[9px] font-bold text-slate-300 flex items-center justify-center">
                          +{members.length - 3}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Story Points */}
                  <td className="py-3.5 pr-4 font-mono font-bold text-white text-xs">
                    {points}
                  </td>

                  {/* Progress Bar */}
                  <td className="py-3.5">
                    <div className="w-28 sm:w-36 space-y-1">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-white font-bold">{pct}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#1A1F37] overflow-hidden">
                        <div
                          style={{ width: `${pct}%` }}
                          className={`h-full rounded-full transition-all ${
                            isClosed ? 'bg-emerald-400' : isP0 ? 'bg-cyan-400' : 'bg-[#0075FF]'
                          }`}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Calendar & Action Buttons */}
                  <td className="py-3.5 text-right">
                    <div className="inline-flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <a
                        href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                          `[P0 Triage Sync #${issue.number}] ${issue.title}`
                        )}&details=${encodeURIComponent(
                          `Issue: https://github.com/${repoContext}/issues/${issue.number}\nLabels: ${issue.labels.join(', ')}\nState: ${issue.state}\n\nScheduled autonomously by AI TPM Agent.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-[#0075FF] text-slate-300 hover:text-white text-[11px] font-medium font-mono inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Schedule Triage Meeting in Google Calendar"
                      >
                        <Calendar className="w-3 h-3 text-[#0075FF]" />
                        <span className="hidden sm:inline">Calendar</span>
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
