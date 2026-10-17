'use client';

import React, { useState } from 'react';
import { X, Code2, GitPullRequest, Copy, Check, ExternalLink, ArrowRight } from 'lucide-react';
import { ActivityItem, CodeFixAndTestScaffold } from '../../types/dashboard';

interface CodeFixModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ActivityItem | null;
  codeFix: CodeFixAndTestScaffold | null;
  generating: boolean;
  onPostDiff: () => Promise<void>;
  postingDiff: boolean;
  postedSuccess: boolean;
  onCreatePr: () => Promise<void>;
  creatingPr: boolean;
  prResult: any | null;
}

export const CodeFixModal: React.FC<CodeFixModalProps> = ({
  isOpen,
  onClose,
  item,
  codeFix,
  generating,
  onPostDiff,
  postingDiff,
  postedSuccess,
  onCreatePr,
  creatingPr,
  prResult,
}) => {
  const [activeTab, setActiveCodeTab] = useState<'diff' | 'test'>('diff');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !item) return null;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white">
              Autonomous Code Fix &amp; Verification Test Scaffold
            </h2>
            {item.githubIssue?.issueNumber && (
              <span className="text-indigo-400 font-mono font-bold">
                #{item.githubIssue.issueNumber}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* PR Banner if created */}
        {prResult && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center gap-2">
              <GitPullRequest className="w-4 h-4 text-emerald-400" />
              <span>
                Pull Request <strong>#{prResult.prNumber}</strong> opened autonomously on GitHub!
              </span>
            </div>
            <a
              href={prResult.prUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-bold underline hover:text-white"
            >
              <span>View PR</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* Main Body */}
        {generating ? (
          <div className="text-center py-20 text-slate-400 space-y-2">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p>Synthesizing minimal patch diff and reproduction test case...</p>
          </div>
        ) : codeFix ? (
          <div className="flex-1 flex flex-col min-h-0 space-y-3">
            {/* Tabs */}
            <div className="flex items-center justify-between shrink-0">
              <div className="inline-flex p-0.5 rounded-lg bg-slate-900 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveCodeTab('diff')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    activeTab === 'diff'
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Proposed Fix Diff
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCodeTab('test')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    activeTab === 'test'
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Reproduction Test ({codeFix.testFramework})
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(activeTab === 'diff' ? codeFix.proposedFixDiff : codeFix.reproductionTestCode)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            {/* Code Viewport */}
            <div className="flex-1 min-h-0 bg-[#090d16] border border-slate-800 rounded-lg p-3 font-mono text-[11px] overflow-auto text-slate-200">
              <pre className="whitespace-pre">
                {activeTab === 'diff' ? codeFix.proposedFixDiff : codeFix.reproductionTestCode}
              </pre>
            </div>

            {/* Commit Message & Tradeoffs */}
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] space-y-1 shrink-0 text-slate-300">
              <div className="font-semibold text-white">Commit Message:</div>
              <p className="font-mono text-indigo-300">{codeFix.commitMessage}</p>
              <div className="text-slate-400 mt-1">{codeFix.technicalTradeoffs}</div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-slate-500">
            No code scaffold available.
          </div>
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
              onClick={onPostDiff}
              disabled={postingDiff || postedSuccess}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-medium transition-colors disabled:opacity-50"
            >
              {postedSuccess ? 'Posted to GitHub Issue' : postingDiff ? 'Posting...' : 'Post Diff to Issue'}
            </button>

            <button
              type="button"
              onClick={onCreatePr}
              disabled={creatingPr || !!prResult}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              <GitPullRequest className="w-3.5 h-3.5" />
              <span>{creatingPr ? 'Creating PR...' : prResult ? 'PR Live' : 'Open Autonomous PR'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
