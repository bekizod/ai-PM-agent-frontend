'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, Calendar, Sparkles } from 'lucide-react';

interface DailyStandupTabProps {
  digest: string;
  timestamp?: string;
}

function cleanMarkdown(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/\*\*\s*([^\*\n]+?)\s*\*\*/g, '**$1**')
    .replace(/(^|\s)\*\*(\s|$)/g, '$1$2')
    .replace(/\n{3,}/g, '\n\n');
}

export const DailyStandupTab: React.FC<DailyStandupTabProps> = ({ digest, timestamp }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(digest);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!digest) {
    return (
      <div className="text-center py-16 border border-dashed border-slate-800 rounded-xl p-8 bg-[#0f172a]">
        <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-slate-300">No Standup Digest Generated</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Click "Daily Standup" in the top header to synthesize sprint progress, blockers, and incident velocity.
        </p>
      </div>
    );
  }

  const cleaned = cleanMarkdown(digest);

  return (
    <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-400" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            Executive Daily Standup Digest
          </h2>
          {timestamp && (
            <span className="text-[10px] text-slate-500 font-mono">
              {new Date(timestamp).toLocaleDateString()}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-medium transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy Digest</span>
            </>
          )}
        </button>
      </div>

      <div className="prose prose-invert max-w-none text-xs text-slate-300 leading-relaxed font-sans bg-[#090d16] p-4 rounded-lg border border-slate-800/80">
        <ReactMarkdown>{cleaned}</ReactMarkdown>
      </div>
    </div>
  );
};
