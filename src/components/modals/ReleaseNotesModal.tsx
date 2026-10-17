'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  X,
  BookOpen,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  GitPullRequest,
  ShieldCheck,
  Bug,
  Cpu,
  Layers,
  Tag,
  FileCode,
  List
} from 'lucide-react';
import { SprintReleaseNotes } from '../../types/dashboard';

interface ReleaseNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: SprintReleaseNotes | null;
  generating: boolean;
  version: string;
  setVersion: (v: string) => void;
  onFetchVersion: (v: string) => Promise<void>;
  onPublishDraft: () => Promise<void>;
  publishing: boolean;
  publishedResult: any | null;
}

export const ReleaseNotesModal: React.FC<ReleaseNotesModalProps> = ({
  isOpen,
  onClose,
  report,
  generating,
  version,
  setVersion,
  onFetchVersion,
  onPublishDraft,
  publishing,
  publishedResult,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'categorized' | 'markdown'>('categorized');

  if (!isOpen) return null;

  // Unpack safely in case report is { success: true, releaseNotes: { ... } } or raw SprintReleaseNotes
  const data: SprintReleaseNotes | null = (report as any)?.releaseNotes || report;

  const handleCopy = () => {
    if (!data?.markdownChangelog) return;
    navigator.clipboard.writeText(data.markdownChangelog);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quickVersions = ['1.4.0', '1.4.1', '1.5.0', '2.0.0'];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-[#0B1437]/95 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col text-xs text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0075FF]/20 border border-[#0075FF]/40 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-[#0075FF]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Sprint Release Notes &amp; Semantic Changelog</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#0075FF]/20 border border-[#0075FF]/30 text-[#0075FF] font-mono">
                  v{version.replace(/^v/, '')}
                </span>
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Autonomous KeepAChangelog synthesis &bull; Synced with GitHub Releases API
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Version Selector Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#060B26]/80 border border-white/5 shrink-0">
          <div className="flex items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-[#0075FF]" />
            <span className="text-slate-300 font-medium">Release Version:</span>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">v</span>
              <input
                type="text"
                value={version.replace(/^v/, '')}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="1.4.0"
                className="w-24 bg-slate-900 border border-slate-700 focus:border-[#0075FF] rounded pl-6 pr-2 py-1 text-white font-mono text-xs outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => onFetchVersion(version)}
              disabled={generating}
              className="cursor-pointer px-3 py-1 rounded bg-[#0075FF] hover:bg-[#0060df] text-white font-semibold text-xs disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className={`w-3.5 h-3.5 ${generating ? 'animate-spin' : ''}`} />
              <span>{generating ? 'Synthesizing...' : 'Generate Notes'}</span>
            </button>
          </div>

          {/* Quick Version Chips */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-mono">Quick Tags:</span>
            {quickVersions.map((qv) => (
              <button
                key={qv}
                type="button"
                onClick={() => {
                  setVersion(qv);
                  onFetchVersion(qv);
                }}
                className={`cursor-pointer px-2 py-0.5 rounded border text-[11px] font-mono transition-colors ${
                  version.replace(/^v/, '') === qv
                    ? 'bg-[#0075FF]/20 border-[#0075FF] text-white font-bold'
                    : 'bg-white/5 border-white/5 hover:border-[#0075FF]/40 text-slate-300'
                }`}
              >
                v{qv}
              </button>
            ))}
          </div>
        </div>

        {/* GitHub Publish Banner if drafted */}
        {publishedResult && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>
                GitHub Release draft <strong>v{publishedResult.releaseTag || publishedResult.tagName || version}</strong> successfully created in target repository!
              </span>
            </div>
            {(publishedResult.releaseUrl || publishedResult.html_url) && (
              <a
                href={publishedResult.releaseUrl || publishedResult.html_url}
                target="_blank"
                rel="noreferrer"
                className="cursor-pointer underline font-bold flex items-center gap-1 text-emerald-300 hover:text-white transition-colors"
              >
                <span>View Release on GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}

        {/* View Mode Tabs (Categorized vs Raw Markdown) */}
        {data && !generating && (
          <div className="flex items-center justify-between border-b border-white/5 pb-2 shrink-0">
            <div className="inline-flex p-0.5 rounded-lg bg-slate-900 border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('categorized')}
                className={`cursor-pointer px-3 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-all ${
                  activeTab === 'categorized'
                    ? 'bg-[#0075FF] text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Structured Changelog</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('markdown')}
                className={`cursor-pointer px-3 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-all ${
                  activeTab === 'markdown'
                    ? 'bg-[#0075FF] text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Full Markdown</span>
              </button>
            </div>

            <span className="text-[11px] text-slate-400 font-mono">
              Release Date: {data.releaseDate || new Date().toLocaleDateString()}
            </span>
          </div>
        )}

        {/* Content Body */}
        {generating ? (
          <div className="text-center py-24 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0075FF]/20 border border-[#0075FF]/40 flex items-center justify-center mx-auto animate-pulse">
              <Sparkles className="w-5 h-5 text-[#0075FF] animate-spin" />
            </div>
            <h3 className="text-sm font-bold text-white">Synthesizing Sprint Release Notes...</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Analyzing repository commit history, merged pull requests, closed bugs, and verified PRDs.
            </p>
          </div>
        ) : data ? (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {activeTab === 'categorized' ? (
              <div className="space-y-4">
                {/* Title & Executive Summary */}
                <div className="p-4 rounded-xl bg-[#060B26] border border-white/5 space-y-1.5">
                  <h3 className="font-bold text-white text-sm">{data.releaseTitle}</h3>
                  <p className="text-slate-300 text-xs leading-relaxed">{data.executiveSummary}</p>
                </div>

                {/* Release Highlights */}
                {data.highlights && data.highlights.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0075FF] flex items-center gap-1.5 font-mono">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Release Highlights</span>
                    </span>
                    <div className="grid grid-cols-1 gap-2">
                      {data.highlights.map((h, i) => (
                        <div key={i} className="p-2.5 rounded-lg bg-[#060B26] border border-white/5 flex items-start gap-2 text-xs text-slate-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0075FF] mt-1.5 shrink-0" />
                          <span className="leading-relaxed">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Features */}
                {data.categories?.features && data.categories.features.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 font-mono">
                      <GitPullRequest className="w-3.5 h-3.5" />
                      <span>Features &amp; Enhancements ({data.categories.features.length})</span>
                    </span>
                    <div className="space-y-2">
                      {data.categories.features.map((feat, i) => (
                        <div key={i} className="p-3 rounded-lg bg-[#060B26] border border-white/5 flex items-start justify-between gap-3">
                          <div className="space-y-0.5">
                            <h4 className="text-xs font-bold text-white">{feat.title}</h4>
                            <p className="text-[11px] text-slate-400">{feat.summary}</p>
                          </div>
                          {feat.issueNumber && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0 font-bold">
                              #{feat.issueNumber}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bug Fixes */}
                {data.categories?.fixes && data.categories.fixes.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5 font-mono">
                      <Bug className="w-3.5 h-3.5" />
                      <span>Bug Fixes &amp; Mitigations ({data.categories.fixes.length})</span>
                    </span>
                    <div className="space-y-2">
                      {data.categories.fixes.map((fix, i) => (
                        <div key={i} className="p-3 rounded-lg bg-[#060B26] border border-white/5 flex items-start justify-between gap-3">
                          <div className="space-y-0.5">
                            <h4 className="text-xs font-bold text-white">{fix.title}</h4>
                            <p className="text-[11px] text-slate-400">{fix.summary}</p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {fix.severity && (
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                                {fix.severity}
                              </span>
                            )}
                            {fix.issueNumber && (
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                                #{fix.issueNumber}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reliability & Security */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.categories?.reliability && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#0075FF] flex items-center gap-1.5 font-mono">
                        <Cpu className="w-3.5 h-3.5" />
                        <span>Reliability Hardening</span>
                      </span>
                      <div className="space-y-1.5">
                        {data.categories.reliability.map((rel, i) => (
                          <div key={i} className="p-2.5 rounded-lg bg-[#060B26] border border-white/5">
                            <h5 className="font-bold text-xs text-white">{rel.title}</h5>
                            <p className="text-[11px] text-slate-400 mt-0.5">{rel.summary}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {data.categories?.security && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 font-mono">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Security &amp; SOC2 Audit</span>
                      </span>
                      <div className="space-y-1.5">
                        {data.categories.security.map((sec, i) => (
                          <div key={i} className="p-2.5 rounded-lg bg-[#060B26] border border-white/5">
                            <h5 className="font-bold text-xs text-white">{sec.title}</h5>
                            <p className="text-[11px] text-slate-400 mt-0.5">{sec.summary}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="bg-[#050814] border border-white/10 rounded-xl p-4 font-mono text-[11px] text-slate-200 leading-relaxed overflow-auto max-h-96">
                  <pre className="whitespace-pre-wrap">{data.markdownChangelog}</pre>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500">
            Click "Generate Notes" above to compile release notes.
          </div>
        )}

        {/* Footer Toolbar */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer px-4 py-1.5 rounded-lg border border-slate-700 hover:bg-white/5 text-slate-300 text-xs transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!data?.markdownChangelog}
              className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs transition-colors disabled:opacity-50"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Markdown'}</span>
            </button>

            <button
              type="button"
              onClick={onPublishDraft}
              disabled={publishing || !data}
              className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#0075FF] hover:bg-[#0060df] text-white font-semibold text-xs disabled:opacity-50 transition-all shadow-sm"
            >
              <GitPullRequest className={`w-3.5 h-3.5 ${publishing ? 'animate-spin' : ''}`} />
              <span>{publishing ? 'Drafting on GitHub...' : 'Publish Release Draft'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
