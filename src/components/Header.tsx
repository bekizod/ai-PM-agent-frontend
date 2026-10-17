'use client';

import React from 'react';
import {
  RefreshCw,
  GitBranch,
  Terminal,
  LogOut,
  Calendar,
  Sparkles,
  GitMerge,
  BookOpen,
  Radio,
  ExternalLink
} from 'lucide-react';
import { CurrentUser } from '../types/dashboard';

interface HeaderProps {
  repoContext: string;
  currentUser: CurrentUser | null;
  onLogout: () => void;
  onRefresh: () => void;
  refreshing: boolean;
  onRunStandup: () => void;
  runningStandup: boolean;
  onOpenCopilot: () => void;
  onOpenDagTrace: () => void;
  onOpenReleaseNotes: () => void;
  onOpenWebhook: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  repoContext,
  currentUser,
  onLogout,
  onRefresh,
  refreshing,
  onRunStandup,
  runningStandup,
  onOpenCopilot,
  onOpenDagTrace,
  onOpenReleaseNotes,
  onOpenWebhook,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#090d16]/95 backdrop-blur-md border-b border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand & Repository Context */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-mono text-xs font-bold shadow-sm shadow-indigo-600/30">
            <span className="text-white mr-0.5">&gt;</span>_
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-white tracking-tight">SprintOps</span>
            <span className="text-slate-600">/</span>
            <a
              href={`https://github.com/${repoContext}`}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-white transition-colors font-mono text-[11px]"
            >
              <GitBranch className="w-3 h-3 text-indigo-400" />
              <span>{repoContext}</span>
              <ExternalLink className="w-2.5 h-2.5 text-slate-500 group-hover:text-indigo-400" />
            </a>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-2">
          {/* Ask Copilot */}
          <button
            type="button"
            onClick={onOpenCopilot}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-slate-800 bg-slate-900/80 hover:bg-slate-800/80 hover:border-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Copilot</span>
          </button>

          {/* Agent Traces */}
          <button
            type="button"
            onClick={onOpenDagTrace}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-slate-800 bg-slate-900/80 hover:bg-slate-800/80 hover:border-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            <GitMerge className="w-3.5 h-3.5 text-slate-400" />
            <span>Traces</span>
          </button>

          {/* Release Notes */}
          <button
            type="button"
            onClick={onOpenReleaseNotes}
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-slate-800 bg-slate-900/80 hover:bg-slate-800/80 hover:border-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span>Releases</span>
          </button>

          {/* Webhook Simulator */}
          <button
            type="button"
            onClick={onOpenWebhook}
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-slate-800 bg-slate-900/80 hover:bg-slate-800/80 hover:border-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            <Radio className="w-3.5 h-3.5 text-slate-400" />
            <span>Webhook</span>
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block" />

          {/* Standup Trigger - Secondary Precision Indigo Action */}
          <button
            type="button"
            onClick={onRunStandup}
            disabled={runningStandup}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-sm transition-all active:scale-[0.98]"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{runningStandup ? 'Generating...' : 'Daily Standup'}</span>
          </button>

          {/* Data Refresh */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            title="Refresh Backlog & Telemetry"
            className="p-1.5 rounded-md border border-slate-800 bg-slate-900/80 hover:bg-slate-800 hover:border-slate-700 text-slate-300 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-indigo-400' : ''}`} />
          </button>

          {/* Owner Profile & Logout */}
          {currentUser && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <img
                    src={currentUser.avatarUrl || 'https://avatars.githubusercontent.com/u/121251335?v=4'}
                    alt={currentUser.username}
                    className="w-6 h-6 rounded-full border border-slate-700 object-cover"
                  />
                  {/* Tertiary Accent Emerald Online Beacon */}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#090d16]" />
                </div>
                <span className="hidden lg:inline text-xs font-medium text-slate-200">
                  @{currentUser.username}
                </span>
              </div>
              <button
                type="button"
                onClick={onLogout}
                title="Log out"
                className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
