'use client';

import React from 'react';
import { Search, GitPullRequest, ExternalLink, Filter, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import { GitHubIssueSummary } from '../types/dashboard';

interface BacklogPanelProps {
  issues: GitHubIssueSummary[];
  loading: boolean;
  filter: 'all' | 'open' | 'closed' | 'P0' | 'P1';
  setFilter: (filter: 'all' | 'open' | 'closed' | 'P0' | 'P1') => void;
  search: string;
  setSearch: (search: string) => void;
  onSelectIssue?: (issue: GitHubIssueSummary) => void;
  repoContext: string;
}

export const BacklogPanel: React.FC<BacklogPanelProps> = ({
  issues,
  loading,
  filter,
  setFilter,
  search,
  setSearch,
  onSelectIssue,
  repoContext,
}) => {
  return (
    <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div className="flex items-center gap-2">
          <GitPullRequest className="w-4 h-4 text-indigo-400" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            Live GitHub Backlog
          </h2>
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
            {issues.length}
          </span>
        </div>
        <a
          href={`https://github.com/${repoContext}/issues`}
          target="_blank"
          rel="noreferrer"
          className="text-[11px] text-slate-400 hover:text-indigo-400 flex items-center gap-1 transition-colors"
        >
          <span>GitHub</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="space-y-2 mb-3">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search issues, labels, or numbers..."
            className="w-full bg-[#090d16] border border-slate-800 focus:border-indigo-500 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 flex-wrap text-[10px]">
          {(['all', 'open', 'closed', 'P0', 'P1'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-2 py-0.5 rounded-md font-medium capitalize transition-colors ${
                filter === f
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Issue List */}
      <div className="flex-1 overflow-y-auto space-y-2 max-h-[580px] pr-1">
        {loading ? (
          <div className="text-center py-10 text-xs text-slate-500">
            Loading repository backlog...
          </div>
        ) : issues.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-500 border border-dashed border-slate-800 rounded-lg p-6">
            No matching issues found in {repoContext}.
          </div>
        ) : (
          issues.map((issue) => {
            const isP0 = issue.labels.some((l) => l.toLowerCase().includes('p0'));
            const isP1 = issue.labels.some((l) => l.toLowerCase().includes('p1'));

            return (
              <div
                key={issue.number}
                onClick={() => onSelectIssue && onSelectIssue(issue)}
                className="group p-3 rounded-lg bg-[#090d16] border border-slate-800/80 hover:border-indigo-500/50 hover:bg-slate-900/40 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono">
                    <span className="text-indigo-400 font-bold">#{issue.number}</span>
                    {issue.state === 'closed' ? (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Closed
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                        Open
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <a
                      href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                        `[Triage Sync #${issue.number}] ${issue.title}`
                      )}&details=${encodeURIComponent(
                        `Issue: ${issue.url}\nStatus: ${issue.state}\nLabels: ${issue.labels.join(', ')}\n\nScheduled autonomously by AI TPM Agent.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-500 hover:text-[#0075FF] transition-colors p-0.5 rounded hover:bg-slate-800 cursor-pointer"
                      title="Schedule Triage Meeting in Google Calendar"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#0075FF]" />
                    </a>
                    <a
                      href={issue.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-500 hover:text-indigo-400 transition-colors p-0.5 rounded hover:bg-slate-800 cursor-pointer"
                      title="Open in GitHub"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <h3 className="text-xs font-semibold text-slate-200 group-hover:text-white line-clamp-2 leading-relaxed">
                  {issue.title}
                </h3>

                {issue.labels.length > 0 && (
                  <div className="flex items-center gap-1 flex-wrap mt-2">
                    {issue.labels.slice(0, 3).map((lbl, idx) => (
                      <span
                        key={idx}
                        className={`text-[9px] font-medium px-1.5 py-0.2 rounded border ${
                          lbl.toLowerCase().includes('p0')
                            ? 'bg-indigo-950/60 text-indigo-300 border-indigo-500/30 font-bold'
                            : lbl.toLowerCase().includes('p1')
                            ? 'bg-slate-800 text-slate-200 border-slate-700'
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        {lbl}
                      </span>
                    ))}
                    {issue.labels.length > 3 && (
                      <span className="text-[9px] text-slate-500">
                        +{issue.labels.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
