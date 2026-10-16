'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  ExternalLink,
  RefreshCw,
  Send,
  Calendar,
  AlertCircle,
  GitPullRequest,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Search,
  Mail,
  FileText,
  Copy,
  Sparkles
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/agent';

interface TriageResult {
  title: string;
  summary: string;
  reproductionSteps: string[];
  acceptanceCriteria: string[];
  severity: 'P0' | 'P1' | 'P2' | 'P3';
  labels: string[];
  requiresUrgentMeeting: boolean;
  suggestedMeetingTopic?: string;
}

interface UserStory {
  asA: string;
  iWant: string;
  soThat: string;
  acceptanceCriteria: string[];
}

interface PrdResult {
  title: string;
  targetAudience: string;
  problemStatement: string;
  userStories: UserStory[];
  technicalArchitecture: string;
  nonFunctionalRequirements: string[];
  successMetrics: string[];
  estimatedEffort: 'Small (1-2 days)' | 'Medium (1 week)' | 'Large (2-3 weeks)' | 'X-Large (> 1 month)';
  recommendedLabels: string[];
  markdownPrd: string;
}

interface ActivityItem {
  id: number;
  timestamp: string;
  type?: 'REACTIVE_TRIAGE' | 'PROACTIVE_DIGEST' | 'FEATURE_PRD' | string;
  triage?: TriageResult;
  prd?: PrdResult;
  githubIssue?: {
    issueNumber: number;
    issueUrl: string;
    live?: boolean;
  };
  calendarEvent?: {
    scheduled: boolean;
    eventLink: string;
    startTime: string;
  };
  emailStatus?: {
    sent: boolean;
    recipient?: string;
    subject?: string;
  };
  digest?: string;
}

interface GitHubIssueSummary {
  number: number;
  title: string;
  labels: string[];
  url: string;
}

function cleanMarkdown(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/\*\*\s*([^\*\n]+?)\s*\*\*/g, '**$1**')
    .replace(/(^|\s)\*\*(\s|$)/g, '$1$2')
    .replace(/\n{3,}/g, '\n\n');
}

function StandupMarkdown({ text }: { text: string }) {
  const cleaned = cleanMarkdown(text);

  return (
    <div className="prose prose-slate max-w-none text-xs text-slate-800 leading-relaxed font-sans">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <div className="text-sm font-bold text-slate-900 pb-1 mb-2 border-b border-slate-200 mt-1">
              {children}
            </div>
          ),
          h2: ({ children }) => (
            <div className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-2 border-b border-slate-200 mt-3 flex items-center gap-1.5">
              {children}
            </div>
          ),
          h3: ({ children }) => (
            <div className="text-xs font-bold text-slate-800 mt-2.5 mb-1 text-indigo-900">
              {children}
            </div>
          ),
          ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 mb-2 text-slate-700">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-4 space-y-1 mb-2 text-slate-700">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          p: ({ children }) => <p className="mb-2 leading-relaxed text-slate-700">{children}</p>,
          strong: ({ children }) => <span className="font-bold text-slate-900">{children}</span>,
          hr: () => <hr className="my-2.5 border-slate-200" />,
        }}
      >
        {cleaned}
      </ReactMarkdown>
    </div>
  );
}

export default function Dashboard() {
  const [input, setInput] = useState('');
  const [intakeMode, setIntakeMode] = useState<'triage' | 'prd'>('triage');
  const [submitting, setSubmitting] = useState(false);
  const [runningStandup, setRunningStandup] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activityLog, setActivityLog] = useState<ActivityItem[]>([]);
  const [openIssues, setOpenIssues] = useState<GitHubIssueSummary[]>([]);
  const [activeTab, setActiveTab] = useState<'stream' | 'standup'>('stream');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [backlogSearch, setBacklogSearch] = useState('');
  const [copiedPrdId, setCopiedPrdId] = useState<number | null>(null);

  const loadData = async () => {
    setRefreshing(true);
    try {
      const res = await fetch(`${API_BASE}/status`);
      if (res.ok) {
        const data = await res.json();
        setActivityLog(data.activityLog || []);
        setOpenIssues(data.openIssues || []);
        if (data.activityLog && data.activityLog.length > 0 && expandedId === null) {
          setExpandedId(data.activityLog[0].id);
        }
      }
    } catch (err) {
      console.warn('Backend unavailable:', err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || submitting) return;
    setSubmitting(true);
    try {
      const endpoint = intakeMode === 'prd' ? `${API_BASE}/prd` : `${API_BASE}/triage`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });
      if (res.ok) {
        const item = await res.json();
        setActivityLog((prev) => [item, ...prev]);
        setExpandedId(item.id);
        setInput('');
        setActiveTab('stream');
        loadData();
      }
    } catch (err) {
      console.error('Failed to submit form:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStandup = async () => {
    if (runningStandup) return;
    setRunningStandup(true);
    try {
      const res = await fetch(`${API_BASE}/cron/daily-digest`, {
        method: 'POST',
      });
      if (res.ok) {
        const digestItem = await res.json();
        setActivityLog((prev) => [digestItem, ...prev]);
        setExpandedId(digestItem.id);
        setActiveTab('standup');
        loadData();
      }
    } catch (err) {
      console.error('Failed to run standup:', err);
    } finally {
      setRunningStandup(false);
    }
  };

  const handleCopyPrd = (item: ActivityItem) => {
    if (!item.prd) return;
    const prdText = item.prd.markdownPrd || `# PRD: ${item.prd.title}\n\n## Problem Statement\n${item.prd.problemStatement}\n\n## Target Audience\n${item.prd.targetAudience}\n\n## Estimated Effort\n${item.prd.estimatedEffort}`;
    navigator.clipboard.writeText(prdText);
    setCopiedPrdId(item.id);
    setTimeout(() => setCopiedPrdId(null), 2000);
  };

  const triagePresets = [
    {
      title: 'Stripe 504 Timeout',
      text: 'Production Outage: Stripe payment webhook returning 504 Gateway Timeout on enterprise renewals. Paying customers are being falsely downgraded to Free tier and losing access.',
    },
    {
      title: 'CSV Heap Overflow',
      text: 'Customer Incident: When generating the quarterly CSV tax billing report for accounts with more than 10,000 transactions, the backend Node worker crashes with JavaScript heap out of memory error 500.',
    },
    {
      title: 'Timezone Toggle',
      text: 'Feature Request: The global EMEA operations team requested that analytics and reporting charts allow toggling between UTC and local tenant timezones.',
    },
  ];

  const prdPresets = [
    {
      title: 'Enterprise SAML/Okta SSO',
      text: 'Enterprise single sign-on (SSO) via SAML 2.0 and Okta integration with automated user provisioning via SCIM and SOC2 audit logging.',
    },
    {
      title: 'Webhook Replay Engine',
      text: 'Automated webhook delivery replay engine with exponential backoff, dead-letter queuing, and customer self-service debugging dashboard.',
    },
    {
      title: 'Granular Team RBAC',
      text: 'Custom team role-based access control (RBAC) matrix allowing workspace admins to define granular read/write permissions per project and billing module.',
    },
  ];

  const filteredIssues = openIssues.filter((i) =>
    i.title.toLowerCase().includes(backlogSearch.toLowerCase()) ||
    `#${i.number}`.includes(backlogSearch)
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-xs tracking-tight shadow-sm">
              TPM
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900 tracking-tight">SprintOps Console</span>
              <span className="text-slate-300">/</span>
              <span className="text-xs text-slate-500 font-medium">B2B SaaS</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium border border-slate-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              bekizod/ai_target_repo_name
            </div>

            <button
              onClick={handleStandup}
              disabled={runningStandup}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition disabled:opacity-50 cursor-pointer shadow-sm"
            >
              <Clock className={`w-3.5 h-3.5 ${runningStandup ? 'animate-spin' : ''}`} />
              {runningStandup ? 'Generating...' : 'Daily Standup'}
            </button>

            <button
              onClick={loadData}
              title="Refresh"
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition border border-slate-200 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-slate-800' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Intake & Backlog */}
          <div className="lg:col-span-5 space-y-5">
            {/* Intake Box */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-sm space-y-3">
              {/* Mode Switcher */}
              <div className="flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200/80 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => { setIntakeMode('triage'); setInput(''); }}
                  className={`flex-1 py-1.5 px-3 rounded-md transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    intakeMode === 'triage'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Incident Triage</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setIntakeMode('prd'); setInput(''); }}
                  className={`flex-1 py-1.5 px-3 rounded-md transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    intakeMode === 'prd'
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Feature PRD</span>
                </button>
              </div>

              {/* Sub-header */}
              <div className="flex items-center justify-between pt-0.5">
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1">
                  {intakeMode === 'triage' ? 'Submit Bug or Outage' : 'Draft Feature Specification'}
                </h2>
                <span className="text-[11px] text-slate-400 font-medium">Gemini 2.5 Flash</span>
              </div>

              {/* Template chips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {(intakeMode === 'triage' ? triagePresets : prdPresets).map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInput(p.text)}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition font-medium border border-slate-200/70 cursor-pointer"
                  >
                    {p.title}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 pt-1">
                <textarea
                  rows={4}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    intakeMode === 'triage'
                      ? 'Paste error logs, customer incident report, or bug description...'
                      : 'Describe the feature request, customer problem, or executive proposal...'
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition leading-relaxed resize-none font-sans"
                />

                <button
                  type="submit"
                  disabled={submitting || !input.trim()}
                  className={`w-full text-white text-xs font-semibold py-2.5 rounded-lg transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                    intakeMode === 'triage'
                      ? 'bg-slate-900 hover:bg-slate-800'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {intakeMode === 'triage' ? (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      {submitting ? 'Triaging with Gemini...' : 'Triage & Create Issue'}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      {submitting ? 'Drafting PRD Spec...' : 'Draft PRD & Create GitHub Epic'}
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Backlog Box */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <GitPullRequest className="w-3.5 h-3.5 text-slate-600" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Repository Backlog</h3>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {openIssues.length}
                </span>
              </div>

              {openIssues.length > 3 && (
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={backlogSearch}
                    onChange={(e) => setBacklogSearch(e.target.value)}
                    placeholder="Search issues..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto overflow-x-hidden">
                {filteredIssues.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    No matching issues in repository.
                  </div>
                ) : (
                  filteredIssues.map((issue) => (
                    <a
                      key={issue.number}
                      href={issue.url}
                      target="_blank"
                      rel="noreferrer"
                      className="py-2.5 px-1.5 flex items-center justify-between gap-2 hover:bg-slate-50 rounded-md transition group text-xs overflow-hidden"
                    >
                      <div className="min-w-0 flex items-center gap-2 flex-1">
                        <span className="font-mono text-slate-400 text-[11px] flex-shrink-0">
                          #{issue.number}
                        </span>
                        <span className="font-medium text-slate-800 group-hover:text-indigo-600 transition truncate">
                          {issue.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {issue.labels?.includes('feature-spec') && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-200">
                            PRD
                          </span>
                        )}
                        {issue.labels?.includes('P0') && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200">
                            P0
                          </span>
                        )}
                        {issue.labels?.includes('P1') && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200">
                            P1
                          </span>
                        )}
                        <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-indigo-600" />
                      </div>
                    </a>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Work Area with Focused Stream & Standup */}
          <div className="lg:col-span-7 space-y-4">
            {/* View Switcher Tabs (Only Stream & Standup) */}
            <div className="flex items-center gap-6 border-b border-slate-200 text-xs font-medium text-slate-500">
              <button
                onClick={() => setActiveTab('stream')}
                className={`pb-2.5 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'stream'
                    ? 'border-indigo-600 text-indigo-600 font-semibold'
                    : 'border-transparent hover:text-slate-800'
                }`}
              >
                <span>Activity Stream</span>
                <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 text-[10px]">
                  {activityLog.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('standup')}
                className={`pb-2.5 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'standup'
                    ? 'border-indigo-600 text-indigo-600 font-semibold'
                    : 'border-transparent hover:text-slate-800'
                }`}
              >
                <span>Daily Standup</span>
              </button>
            </div>

            {/* TAB 1: Collapsible Activity Stream */}
            {activeTab === 'stream' && (
              <div className="space-y-3">
                {activityLog.length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-slate-400 text-xs">
                    No activity records yet. Submit a bug or draft a PRD on the left to begin.
                  </div>
                ) : (
                  activityLog.map((item) => {
                    const isExpanded = expandedId === item.id;
                    const isStandup = item.type === 'PROACTIVE_DIGEST';
                    const isPrd = item.type === 'FEATURE_PRD';

                    return (
                      <div
                        key={item.id}
                        className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-sm transition"
                      >
                        {/* Header Bar */}
                        <div
                          onClick={() => setExpandedId(isExpanded ? null : item.id)}
                          className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 transition select-none"
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            {isStandup ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex-shrink-0">
                                Standup
                              </span>
                            ) : isPrd ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 flex-shrink-0 flex items-center gap-1">
                                <FileText className="w-2.5 h-2.5" />
                                PRD Spec
                              </span>
                            ) : (
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                                  item.triage?.severity === 'P0'
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                    : item.triage?.severity === 'P1'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                                }`}
                              >
                                {item.triage?.severity || 'P2'}
                              </span>
                            )}

                            <span className="text-xs font-semibold text-slate-900 truncate">
                              {isStandup
                                ? 'Daily Sprint Standup Digest'
                                : isPrd
                                ? `[Feature Spec] ${item.prd?.title}`
                                : item.triage?.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2.5 flex-shrink-0">
                            {item.githubIssue && (
                              <a
                                href={item.githubIssue.issueUrl}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-[11px] font-mono text-indigo-600 hover:underline flex items-center gap-1"
                              >
                                #{item.githubIssue.issueNumber}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}

                            <span className="text-[11px] text-slate-400 font-mono">
                              {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>

                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                        </div>

                        {/* Collapsible Content */}
                        {isExpanded && (
                          <div className="px-4 pb-4 pt-2 border-t border-slate-100 space-y-3 bg-white">
                            {isStandup ? (
                              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/70 max-h-80 overflow-y-auto">
                                <StandupMarkdown text={item.digest || ''} />
                              </div>
                            ) : isPrd && item.prd ? (
                              <div className="space-y-3 pt-0.5">
                                {/* Metadata pills */}
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                                    Audience: <strong className="text-slate-900">{item.prd.targetAudience}</strong>
                                  </span>
                                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                                    Effort: <strong className="text-indigo-900">{item.prd.estimatedEffort}</strong>
                                  </span>
                                </div>

                                {/* Problem Statement */}
                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/70 text-xs">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
                                    Problem Statement
                                  </span>
                                  <p className="text-slate-800 leading-relaxed">{item.prd.problemStatement}</p>
                                </div>

                                {/* User Stories */}
                                <div className="space-y-2">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">
                                    User Stories & Acceptance Criteria
                                  </span>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                    {item.prd.userStories?.map((story, idx) => (
                                      <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200/70 text-xs space-y-1.5">
                                        <div className="font-semibold text-slate-900 text-[11px]">
                                          Story {idx + 1}: As a {story.asA}
                                        </div>
                                        <p className="text-slate-700 text-[11px] leading-snug">
                                          <strong>I want:</strong> {story.iWant}
                                        </p>
                                        <p className="text-slate-700 text-[11px] leading-snug">
                                          <strong>So that:</strong> {story.soThat}
                                        </p>
                                        <div className="pt-1 border-t border-slate-200/60">
                                          <span className="text-[10px] font-semibold text-slate-500 block mb-1">Criteria:</span>
                                          <ul className="space-y-0.5 text-[11px] text-slate-600">
                                            {story.acceptanceCriteria?.map((ac, acIdx) => (
                                              <li key={acIdx} className="flex items-start gap-1">
                                                <Check className="w-3 h-3 text-emerald-600 flex-shrink-0 mt-0.5" />
                                                <span>{ac}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Architecture & Non-Functional Requirements */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/60 text-xs">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
                                      Technical Architecture
                                    </span>
                                    <p className="text-slate-700 leading-relaxed text-[11px]">{item.prd.technicalArchitecture}</p>
                                  </div>

                                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/60 text-xs">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
                                      Success Metrics (KPIs)
                                    </span>
                                    <ul className="space-y-1 text-[11px] text-slate-700">
                                      {item.prd.successMetrics?.map((metric, idx) => (
                                        <li key={idx} className="flex items-start gap-1">
                                          <span className="text-indigo-600 font-bold">•</span>
                                          <span>{metric}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>

                                {/* Actions Footer */}
                                <div className="flex items-center justify-between pt-1 text-xs">
                                  <button
                                    type="button"
                                    onClick={() => handleCopyPrd(item)}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition cursor-pointer text-[11px] border border-slate-200"
                                  >
                                    {copiedPrdId === item.id ? (
                                      <>
                                        <Check className="w-3 h-3 text-emerald-600" />
                                        <span className="text-emerald-700 font-semibold">PRD Copied!</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3 h-3 text-slate-500" />
                                        <span>Copy PRD Markdown</span>
                                      </>
                                    )}
                                  </button>

                                  {item.githubIssue && (
                                    <a
                                      href={item.githubIssue.issueUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                                    >
                                      <span>View GitHub Epic Issue</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <>
                                <p className="text-xs text-slate-700 leading-relaxed pt-0.5">
                                  {item.triage?.summary}
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/60">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                                      Reproduction Steps
                                    </span>
                                    <ol className="list-decimal list-inside space-y-1 text-xs text-slate-700">
                                      {item.triage?.reproductionSteps?.map((step, idx) => (
                                        <li key={idx} className="leading-snug">{step}</li>
                                      ))}
                                    </ol>
                                  </div>

                                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/60">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                                      Acceptance Criteria
                                    </span>
                                    <ul className="space-y-1 text-xs text-slate-700">
                                      {item.triage?.acceptanceCriteria?.map((criteria, idx) => (
                                        <li key={idx} className="flex items-start gap-1.5 leading-snug">
                                          <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                          <span>{criteria}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>

                                {item.calendarEvent && (
                                  <div className="bg-rose-50/70 border border-rose-200 rounded-lg p-2.5 flex items-center justify-between text-xs">
                                    <span className="text-rose-800 text-[11px]">
                                      <strong>🚨 P0 Protocol:</strong> Emergency meeting scheduled & on-call lead alerted.
                                    </span>
                                    <a
                                      href={item.calendarEvent.eventLink}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-rose-700 hover:text-rose-900 font-bold underline text-[11px] flex items-center gap-0.5"
                                    >
                                      Calendar ↗
                                    </a>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB 2: Scannable Daily Standup */}
            {activeTab === 'standup' && (
              <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      Daily Sprint Standup Digest
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Autonomous synthesis of active blockers, sprint velocity, and priority queues
                    </p>
                  </div>
                  <button
                    onClick={handleStandup}
                    disabled={runningStandup}
                    className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                  >
                    {runningStandup ? 'Refreshing...' : 'Re-run Standup'}
                  </button>
                </div>

                {activityLog.find((a) => a.type === 'PROACTIVE_DIGEST') ? (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/70">
                      <StandupMarkdown text={activityLog.find((a) => a.type === 'PROACTIVE_DIGEST')?.digest || ''} />
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                      <span>Live dispatch via Gmail SMTP to bekizodcancer@gmail.com</span>
                      <span className="text-emerald-700 font-semibold">✓ Standup Dispatched</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    No standup generated yet. Click "Daily Standup" in the top bar to run now.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
