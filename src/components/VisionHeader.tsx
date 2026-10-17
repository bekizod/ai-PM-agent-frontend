'use client';

import React from 'react';
import { Search, GitBranch, RefreshCw, Calendar, Settings, Bell, ExternalLink, LogOut } from 'lucide-react';
import { CurrentUser } from '../types/dashboard';

interface VisionHeaderProps {
  pageTitle: string;
  repoContext: string;
  currentUser: CurrentUser | null;
  onRefresh: () => void;
  refreshing: boolean;
  onRunStandup: () => void;
  runningStandup: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onLogout?: () => void;
}

export const VisionHeader: React.FC<VisionHeaderProps> = ({
  pageTitle,
  repoContext,
  currentUser,
  onRefresh,
  refreshing,
  onRunStandup,
  runningStandup,
  searchQuery,
  setSearchQuery,
  onLogout,
}) => {
  return (
    <header className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 py-3 px-2 select-none">
      {/* Breadcrumbs & Title */}
      <div>
        <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
          <span>Pages</span>
          <span>/</span>
          <span className="text-white capitalize">{pageTitle}</span>
        </div>
        <h2 className="text-xl font-black text-white tracking-tight capitalize mt-0.5">
          {pageTitle}
        </h2>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type here..."
            className="w-40 sm:w-52 bg-[#0F1535]/80 border border-white/10 focus:border-[#0075FF] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 outline-none transition-all"
          />
        </div>

        {/* Target Repo Pill */}
        <a
          href={`https://github.com/${repoContext}`}
          target="_blank"
          rel="noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0F1535]/80 border border-white/10 hover:border-[#0075FF]/50 text-slate-300 hover:text-white text-xs font-mono transition-colors"
        >
          <GitBranch className="w-3.5 h-3.5 text-[#0075FF]" />
          <span>{repoContext}</span>
          <ExternalLink className="w-3 h-3 text-slate-500" />
        </a>

        {/* Standup Action Button */}
        <button
          type="button"
          onClick={onRunStandup}
          disabled={runningStandup}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl vision-btn-primary text-white text-xs font-bold disabled:opacity-50 transition-all active:scale-[0.98]"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{runningStandup ? 'Synthesizing...' : 'Run Standup'}</span>
        </button>

        {/* Refresh Button */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          title="Refresh Telemetry & Backlog"
          className="p-2 rounded-xl bg-[#0F1535]/80 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#0075FF]' : ''}`} />
        </button>

        {/* User Avatar & Logout */}
        {currentUser && (
          <div className="flex items-center gap-2 pl-2 border-l border-white/10">
            <img
              src={currentUser.avatarUrl || 'https://avatars.githubusercontent.com/u/121251335?v=4'}
              alt={currentUser.username}
              className="w-8 h-8 rounded-xl border border-[#0075FF] object-cover"
              title={`Logged in as @${currentUser.username}`}
            />
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                title="Sign Out"
                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
