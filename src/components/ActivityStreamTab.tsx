'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  ShieldAlert,
  FileText,
  Radio,
  Calendar,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Search,
  ExternalLink,
  Code2,
  Mail,
  Flame,
  ShieldCheck,
  Zap,
  Target,
  CheckCircle2,
  ListOrdered,
  FileCode,
  Copy,
  Check,
} from 'lucide-react';
import { ActivityItem } from '../types/dashboard';

interface ActivityStreamTabProps {
  items: ActivityItem[];
  typeFilter: 'all' | 'triage' | 'prd' | 'webhook' | 'standup';
  setTypeFilter: (filter: 'all' | 'triage' | 'prd' | 'webhook' | 'standup') => void;
  severityFilter: 'all' | 'P0' | 'P1' | 'P2';
  setSeverityFilter: (filter: 'all' | 'P0' | 'P1' | 'P2') => void;
  search: string;
  setSearch: (search: string) => void;
  onGeneratePlan: (item: ActivityItem) => void;
  planningIssueNum: number | null;
  plannedSuccessNum: number | null;
  onOpenCodeFix: (item: ActivityItem) => void;
  onOpenOutageComms: (item: ActivityItem) => void;
  onOpenWarRoom: (item: ActivityItem) => void;
  onOpenCompliance: (item: ActivityItem) => void;
  onToggleIssueState: (item: ActivityItem) => void;
  togglingStateNum: number | null;
  repoContext: string;
}

function cleanMarkdown(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/\*\*\s*([^\*\n]+?)\s*\*\*/g, '**$1**')
    .replace(/(^|\s)\*\*(\s|$)/g, '$1$2')
    .replace(/\n{3,}/g, '\n\n');
}

export const ActivityStreamTab: React.FC<ActivityStreamTabProps> = ({
  items,
  typeFilter,
  setTypeFilter,
  severityFilter,
  setSeverityFilter,
  search,
  setSearch,
  onGeneratePlan,
  planningIssueNum,
  plannedSuccessNum,
  onOpenCodeFix,
  onOpenOutageComms,
  onOpenWarRoom,
  onOpenCompliance,
  onToggleIssueState,
  togglingStateNum,
  repoContext,
}) => {
  const [expandedId, setExpandedId] = useState<number | null>(items[0]?.id || null);
  const [showRawMarkdownId, setShowRawMarkdownId] = useState<number | null>(null);
  const [copiedRawId, setCopiedRawId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const handleCopyRaw = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRawId(id);
    setTimeout(() => setCopiedRawId(null), 2000);
  };

  // Filter items
  const filtered = items.filter((item) => {
    if (typeFilter === 'triage' && item.type !== 'REACTIVE_TRIAGE') return false;
    if (typeFilter === 'prd' && item.type !== 'FEATURE_PRD') return false;
    if (typeFilter === 'webhook' && item.type !== 'WEBHOOK_INCIDENT') return false;
    if (typeFilter === 'standup' && item.type !== 'PROACTIVE_DIGEST') return false;

    if (severityFilter !== 'all') {
      const sev = item.triage?.severity;
      if (sev !== severityFilter) return false;
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      const title = (item.triage?.title || item.prd?.title || item.digest || '').toLowerCase();
      const num = item.githubIssue?.issueNumber?.toString() || '';
      return title.includes(q) || num.includes(q);
    }

    return true;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-4">
      {/* Search & Filters Toolbar */}
      <div className="p-3.5 rounded-xl bg-[#0f172a] border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Filter telemetry, incident titles, or issue numbers..."
            className="w-full bg-[#090d16] border border-slate-800 focus:border-[#0075FF] rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Type Filter */}
          <div className="inline-flex p-0.5 rounded-lg bg-slate-900 border border-slate-800">
            {(['all', 'triage', 'prd', 'webhook'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTypeFilter(t);
                  setCurrentPage(1);
                }}
                className={`cursor-pointer px-2.5 py-1 rounded-md text-[11px] font-medium capitalize transition-colors ${
                  typeFilter === t
                    ? 'bg-[#0075FF] text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Severity Filter */}
          <div className="inline-flex p-0.5 rounded-lg bg-slate-900 border border-slate-800">
            {(['all', 'P0', 'P1', 'P2'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setSeverityFilter(s);
                  setCurrentPage(1);
                }}
                className={`cursor-pointer px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  severityFilter === s
                    ? 'bg-[#0075FF] text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Items Feed */}
      <div className="space-y-3">
        {paginated.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-800 rounded-xl p-8 bg-[#0f172a]">
            <ShieldCheck className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-300">No Incidents Found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Adjust filters or submit a new telemetry report from the console above.
            </p>
          </div>
        ) : (
          paginated.map((item) => {
            const isExpanded = expandedId === item.id;
            const isTriage = item.type === 'REACTIVE_TRIAGE' || !!item.triage;
            const isPrd = item.type === 'FEATURE_PRD' || !!item.prd;
            const severity = item.triage?.severity;
            const isP0 = severity === 'P0';

            const title =
              item.triage?.title ||
              item.prd?.title ||
              (item.type === 'PROACTIVE_DIGEST' ? 'Daily Sprint Standup Digest' : 'Incident Telemetry Event');

            const rawBody = (item as any).rawBody || (item.triage as any)?.rawBody || item.prd?.markdownPrd || '';
            const isRawOpen = showRawMarkdownId === item.id;

            return (
              <div
                key={item.id}
                className="rounded-xl bg-[#0f172a] border border-slate-800 overflow-hidden shadow-sm transition-all"
              >
                {/* Header Row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="cursor-pointer p-4 flex items-start justify-between gap-3 hover:bg-slate-900/40 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="mt-0.5">
                      {isTriage ? (
                        <div className="w-7 h-7 rounded-lg bg-[#0075FF]/20 border border-[#0075FF]/40 flex items-center justify-center">
                          <ShieldAlert className="w-3.5 h-3.5 text-[#0075FF]" />
                        </div>
                      ) : isPrd ? (
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                          <FileText className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
                          <Radio className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        {severity && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                              isP0
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                : 'bg-[#0075FF]/20 text-[#0075FF] border-[#0075FF]/30'
                            }`}
                          >
                            {severity}
                          </span>
                        )}

                        {item.githubIssue?.issueNumber && (
                          <a
                            href={item.githubIssue.issueUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="font-mono text-[11px] font-bold text-[#0075FF] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span>#{item.githubIssue.issueNumber}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}

                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>

                        {item.state === 'closed' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Resolved
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs font-bold text-white truncate">{title}</h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-slate-800/80 space-y-4 text-xs">
                    {/* Deduplication Banner */}
                    {item.deduplication?.isDuplicate && (
                      <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-[11px] text-indigo-200 flex items-center justify-between">
                        <span>
                          Duplicate detected of <strong>#{item.deduplication.matchedIssueNumber}</strong> ({item.deduplication.similarityScore}% match).
                        </span>
                      </div>
                    )}

                    {/* Problem Summary / Incident Analysis (Rendered with ReactMarkdown to handle bold **, code blocks, lists) */}
                    {item.triage?.summary && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-mono">
                            <ShieldAlert className="w-3 h-3 text-[#0075FF]" />
                            <span>Incident Analysis &amp; Problem Statement</span>
                          </span>
                          {rawBody && (
                            <button
                              type="button"
                              onClick={() => setShowRawMarkdownId(isRawOpen ? null : item.id)}
                              className="cursor-pointer text-[10px] font-mono text-[#0075FF] hover:underline flex items-center gap-1"
                            >
                              <FileCode className="w-3 h-3" />
                              <span>{isRawOpen ? 'Hide Full Markdown' : 'View Full GitHub Payload'}</span>
                            </button>
                          )}
                        </div>

                        <div className="text-slate-200 leading-relaxed bg-[#090d16] p-3.5 rounded-lg border border-slate-800 prose prose-invert prose-xs max-w-none">
                          <ReactMarkdown>{cleanMarkdown(item.triage.summary)}</ReactMarkdown>
                        </div>
                      </div>
                    )}

                    {/* Reproduction Steps (Numbered Step Badges) */}
                    {item.triage?.reproductionSteps && item.triage.reproductionSteps.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-mono">
                          <ListOrdered className="w-3 h-3 text-[#0075FF]" />
                          <span>Steps to Reproduce ({item.triage.reproductionSteps.length})</span>
                        </span>
                        <div className="space-y-2 bg-[#090d16] p-3 rounded-lg border border-slate-800">
                          {item.triage.reproductionSteps.map((step, idx) => (
                            <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                              <span className="w-4 h-4 rounded bg-[#0075FF]/20 text-[#0075FF] font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span className="flex-1 leading-relaxed">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Acceptance Criteria (Checklist Badges) */}
                    {item.triage?.acceptanceCriteria && item.triage.acceptanceCriteria.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-mono">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Acceptance Criteria</span>
                        </span>
                        <div className="space-y-1.5 bg-[#090d16] p-3 rounded-lg border border-slate-800">
                          {item.triage.acceptanceCriteria.map((crit, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                              <span className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                                &#10003;
                              </span>
                              <span className="flex-1 leading-relaxed">{crit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Autonomous Actions Executed */}
                    {(((item.triage as any)?.actionsTaken?.length > 0) || item.calendarEvent || item.emailStatus) && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-mono">
                          <Zap className="w-3 h-3 text-[#0075FF]" />
                          <span>Autonomous Actions Executed</span>
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {item.calendarEvent && (
                            <a
                              href={item.calendarEvent.eventLink || 'https://calendar.google.com'}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 rounded bg-[#090d16] border border-[#0075FF]/40 hover:border-[#0075FF] text-[11px] text-[#0075FF] hover:text-cyan-300 flex items-center gap-1.5 font-mono transition-colors cursor-pointer group"
                              title="Open scheduled Google Calendar event"
                            >
                              <Calendar className="w-3 h-3 text-[#0075FF] group-hover:scale-110 transition-transform" />
                              <span>Emergency Incident War Room Scheduled</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                            </a>
                          )}
                          {item.emailStatus && (
                            <div className="px-2.5 py-1 rounded bg-[#090d16] border border-emerald-500/30 text-[11px] text-emerald-400 flex items-center gap-1.5 font-mono">
                              <Mail className="w-3 h-3" />
                              <span>Incident Alert Dispatched to Lead</span>
                            </div>
                          )}
                          {((item.triage as any)?.actionsTaken || []).map((action: string, idx: number) => (
                            <div key={idx} className="px-2.5 py-1 rounded bg-[#090d16] border border-slate-800 text-[11px] text-slate-300 flex items-center gap-1.5 font-mono">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>{action}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Blast Radius & Risk Scores */}
                    {item.blastRadius && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <div className="p-2.5 rounded-lg bg-[#090d16] border border-slate-800">
                          <span className="text-[10px] text-slate-400 block font-mono">Blast Radius</span>
                          <span className="text-xs font-bold text-[#0075FF] font-mono mt-0.5 block">
                            {item.blastRadius.blastRadiusScore} Exposure ({item.blastRadius.customerExposurePercentage}%)
                          </span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-[#090d16] border border-slate-800">
                          <span className="text-[10px] text-slate-400 block font-mono">Affected Services</span>
                          <span className="text-xs font-medium text-slate-300 truncate block mt-0.5 font-mono">
                            {item.blastRadius.affectedServices.join(', ') || 'Core API'}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-[#090d16] border border-slate-800 col-span-2 sm:col-span-1">
                          <span className="text-[10px] text-slate-400 block font-mono">Deployment Risk</span>
                          <span className="text-xs font-bold text-white font-mono mt-0.5 block">
                            Score: {item.reliabilityRisk?.deploymentRiskScore || 25} / 100
                          </span>
                        </div>
                      </div>
                    )}

                    {/* PRD Spec View */}
                    {item.prd && (
                      <div className="space-y-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                          Feature Specification &amp; Problem Statement
                        </span>
                        <div className="text-slate-200 bg-[#090d16] p-3.5 rounded-lg border border-slate-800 leading-relaxed prose prose-invert prose-xs max-w-none">
                          <ReactMarkdown>{cleanMarkdown(item.prd.problemStatement)}</ReactMarkdown>
                        </div>

                        {item.prd.userStories && item.prd.userStories.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                              User Stories ({item.prd.userStories.length})
                            </span>
                            <div className="space-y-2">
                              {item.prd.userStories.map((story, sIdx) => (
                                <div key={sIdx} className="bg-[#090d16] p-3 rounded-lg border border-slate-800 space-y-1.5">
                                  <div className="text-xs text-white">
                                    <span className="text-slate-400">As a </span>
                                    <strong className="text-[#0075FF]">{story.asA}</strong>
                                    <span className="text-slate-400">, I want </span>
                                    <strong>{story.iWant}</strong>
                                    <span className="text-slate-400">, so that </span>
                                    <span>{story.soThat}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Full Raw Markdown Viewer (Expandable) */}
                    {isRawOpen && rawBody && (
                      <div className="space-y-2 pt-2 border-t border-slate-800">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
                            <FileCode className="w-3.5 h-3.5 text-[#0075FF]" />
                            <span>Complete GitHub Issue Content (Full Markdown)</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyRaw(item.id, rawBody)}
                            className="cursor-pointer text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1 font-mono transition-colors"
                          >
                            {copiedRawId === item.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedRawId === item.id ? 'Copied!' : 'Copy Markdown'}</span>
                          </button>
                        </div>
                        <div className="bg-[#050814] p-4 rounded-lg border border-slate-800 text-slate-200 prose prose-invert prose-xs max-w-none max-h-96 overflow-y-auto leading-relaxed">
                          <ReactMarkdown>{cleanMarkdown(rawBody)}</ReactMarkdown>
                        </div>
                      </div>
                    )}

                    {/* Action Toolbar */}
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Plan Button */}
                        <button
                          type="button"
                          onClick={() => onGeneratePlan(item)}
                          disabled={planningIssueNum === item.githubIssue?.issueNumber}
                          className="cursor-pointer px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-medium transition-colors"
                        >
                          {planningIssueNum === item.githubIssue?.issueNumber ? 'Generating Plan...' : 'Implementation Plan'}
                        </button>

                        {/* Code Fix Button */}
                        <button
                          type="button"
                          onClick={() => onOpenCodeFix(item)}
                          className="cursor-pointer px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1"
                        >
                          <Code2 className="w-3 h-3 text-[#0075FF]" />
                          <span>Code Fix &amp; PR</span>
                        </button>

                        {/* Outage Comms Button */}
                        {isTriage && (
                          <button
                            type="button"
                            onClick={() => onOpenOutageComms(item)}
                            className="cursor-pointer px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1"
                          >
                            <Mail className="w-3 h-3 text-[#0075FF]" />
                            <span>Outage Comms</span>
                          </button>
                        )}

                        {/* War Room Button */}
                        {isTriage && (
                          <button
                            type="button"
                            onClick={() => onOpenWarRoom(item)}
                            className="cursor-pointer px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1"
                          >
                            <Flame className="w-3 h-3 text-[#0075FF]" />
                            <span>War Room RCA</span>
                          </button>
                        )}

                        {/* Compliance Button */}
                        <button
                          type="button"
                          onClick={() => onOpenCompliance(item)}
                          className="cursor-pointer px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1"
                        >
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          <span>SOC2 Audit</span>
                        </button>

                        {/* Calendar Meeting Button */}
                        <a
                          href={
                            item.calendarEvent?.eventLink ||
                            `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                              `[P0 Incident War Room] ${item.triage?.title || item.prd?.title || 'Incident Triage Call'}`
                            )}&details=${encodeURIComponent(
                              `Automated emergency triage sync scheduled by AI TPM Agent.\n\nContext:\n${item.triage?.summary || 'P0 Incident investigation'}\n\nGitHub: ${item.githubIssue?.issueUrl || 'bekizod/ai_target_repo_name'}`
                            )}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="cursor-pointer px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-[#0075FF] text-slate-200 hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5"
                          title="Open or schedule Google Calendar Triage Call"
                        >
                          <Calendar className="w-3 h-3 text-[#0075FF]" />
                          <span>Calendar Sync</span>
                          <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                        </a>
                      </div>

                      {/* State Toggle Button (Open/Closed) */}
                      {item.githubIssue?.issueNumber && (
                        <button
                          type="button"
                          onClick={() => onToggleIssueState(item)}
                          disabled={togglingStateNum === item.githubIssue.issueNumber}
                          className="cursor-pointer px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-medium transition-colors"
                        >
                          {togglingStateNum === item.githubIssue.issueNumber
                            ? 'Updating...'
                            : item.state === 'closed'
                            ? 'Re-open Issue'
                            : 'Close Issue'}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
          <span>
            Page {currentPage} of {totalPages} ({filtered.length} total events)
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="cursor-pointer p-1.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 disabled:opacity-40"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="cursor-pointer p-1.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 disabled:opacity-40"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
