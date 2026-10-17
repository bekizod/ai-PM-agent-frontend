'use client';

import React, { useState } from 'react';
import { X, Mail, Send, Copy, Check } from 'lucide-react';
import { ActivityItem, OutageCommunications } from '../../types/dashboard';

interface OutageCommsModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ActivityItem | null;
  comms: OutageCommunications | null;
  generating: boolean;
  onDispatchExecEmail: () => Promise<void>;
  dispatchingEmail: boolean;
  emailSuccess: boolean;
}

export const OutageCommsModal: React.FC<OutageCommsModalProps> = ({
  isOpen,
  onClose,
  item,
  comms,
  generating,
  onDispatchExecEmail,
  dispatchingEmail,
  emailSuccess,
}) => {
  const [tab, setTab] = useState<'exec' | 'customer' | 'statuspage'>('exec');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !item) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white">Outage Communication &amp; Executive Briefing</h2>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {generating ? (
          <div className="text-center py-20 text-slate-400">Synthesizing executive briefing and stakeholder updates...</div>
        ) : comms ? (
          <div className="flex-1 flex flex-col min-h-0 space-y-3">
            <div className="inline-flex p-0.5 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => setTab('exec')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${tab === 'exec' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400'}`}
              >
                Executive Briefing
              </button>
              <button
                type="button"
                onClick={() => setTab('customer')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${tab === 'customer' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400'}`}
              >
                Customer Notification
              </button>
              <button
                type="button"
                onClick={() => setTab('statuspage')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${tab === 'statuspage' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400'}`}
              >
                StatusPage Notice
              </button>
            </div>

            <div className="flex-1 overflow-auto bg-[#090d16] border border-slate-800 rounded-lg p-3 text-slate-200 font-mono text-[11px] leading-relaxed">
              {tab === 'exec' && <pre className="whitespace-pre-wrap">{comms.executiveBriefing}</pre>}
              {tab === 'customer' && (
                <div className="space-y-2">
                  <div className="font-bold text-indigo-300">Subject: {comms.customerEmail.subject}</div>
                  <pre className="whitespace-pre-wrap font-sans text-slate-300">{comms.customerEmail.body}</pre>
                </div>
              )}
              {tab === 'statuspage' && (
                <div className="space-y-2">
                  <div className="font-bold text-emerald-400">[{comms.statusPageNotice.status}] {comms.statusPageNotice.title}</div>
                  <p className="font-sans text-slate-300">{comms.statusPageNotice.body}</p>
                </div>
              )}
            </div>
          </div>
        ) : null}

        <div className="pt-3 border-t border-slate-800 flex items-center justify-between shrink-0">
          <button type="button" onClick={onClose} className="px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs">
            Close
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const text = tab === 'exec' ? comms?.executiveBriefing : tab === 'customer' ? comms?.customerEmail.body : comms?.statusPageNotice.body;
                if (text) handleCopy(text);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
            <button
              type="button"
              onClick={onDispatchExecEmail}
              disabled={dispatchingEmail || emailSuccess}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{emailSuccess ? 'Dispatched to Exec Team' : dispatchingEmail ? 'Sending...' : 'Dispatch via Gmail SMTP'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
