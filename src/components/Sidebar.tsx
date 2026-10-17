'use client';

import React from 'react';
import {
  Home,
  Table,
  Users,
  BarChart2,
  Sparkles,
  GitBranch,
  LogOut,
  HelpCircle,
  ShieldCheck,
  Radio,
  FileCode,
  BookOpen
} from 'lucide-react';
import { CurrentUser } from '../types/dashboard';

interface SidebarProps {
  activeTab: 'dashboard' | 'backlog' | 'capacity' | 'analytics';
  setActiveTab: (tab: 'dashboard' | 'backlog' | 'capacity' | 'analytics') => void;
  currentUser: CurrentUser | null;
  onLogout: () => void;
  onOpenCopilot: () => void;
  onOpenDagTrace: () => void;
  onOpenReleaseNotes: () => void;
  onOpenWebhook: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
  onOpenCopilot,
  onOpenDagTrace,
  onOpenReleaseNotes,
  onOpenWebhook,
}) => {
  const navItems = [
    {
      id: 'dashboard' as const,
      label: 'Dashboard',
      icon: Home,
    },
    {
      id: 'backlog' as const,
      label: 'Backlog & PRDs',
      icon: Table,
    },
    {
      id: 'capacity' as const,
      label: 'Team Capacity',
      icon: Users,
    },
    {
      id: 'analytics' as const,
      label: 'Sprint Velocity',
      icon: BarChart2,
    },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col h-screen sticky top-0 bg-[#060B26]/95 border-r border-white/5 z-30 select-none overflow-hidden p-4">
      {/* Top Header & Brand */}
      <div className="shrink-0 pb-3">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0075FF] to-[#00E5FF] flex items-center justify-center shadow-lg shadow-[#0075FF]/40 text-white font-mono font-bold text-sm">
            <span>&gt;_</span>
          </div>
          <div>
            <h1 className="text-xs font-bold uppercase tracking-widest text-white">
              VISION UI
            </h1>
            <span className="text-[10px] font-mono text-cyan-400 font-semibold tracking-wider">
              AI TPM AGENT
            </span>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mt-3" />
      </div>

      {/* Middle Scrollable Navigation Links */}
      <div className="flex-1 overflow-y-auto space-y-5 pr-1 py-2">
        {/* Main Navigation Links */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-1.5">
            AI Operations
          </span>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-2xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#1A1F37] text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-[#0075FF] text-white shadow-md shadow-[#0075FF]/50'
                      : 'bg-[#1A1F37] text-[#0075FF]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tooling Navigation */}
        <div className="space-y-1 pt-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-1.5">
            Agent Traces &amp; Releases
          </span>

          <button
            type="button"
            onClick={onOpenDagTrace}
            className="w-full flex items-center gap-3 px-3 py-1.5 rounded-2xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <div className="w-7 h-7 rounded-xl bg-[#1A1F37] text-[#0075FF] flex items-center justify-center">
              <GitBranch className="w-3.5 h-3.5" />
            </div>
            <span>Agent DAG Traces</span>
          </button>

          <button
            type="button"
            onClick={onOpenReleaseNotes}
            className="w-full flex items-center gap-3 px-3 py-1.5 rounded-2xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <div className="w-7 h-7 rounded-xl bg-[#1A1F37] text-[#0075FF] flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <span>Release Notes</span>
          </button>

          <button
            type="button"
            onClick={onOpenWebhook}
            className="w-full flex items-center gap-3 px-3 py-1.5 rounded-2xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <div className="w-7 h-7 rounded-xl bg-[#1A1F37] text-[#0075FF] flex items-center justify-center">
              <Radio className="w-3.5 h-3.5" />
            </div>
            <span>Webhook Simulator</span>
          </button>
        </div>

        {/* Glossy AI Copilot Wave Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#060B26] via-[#0F1535] to-[#121E53] border border-white/10 relative overflow-hidden shadow-xl mt-2">
          <div className="w-6 h-6 rounded-lg bg-[#0075FF] flex items-center justify-center text-white mb-2 shadow-sm shadow-[#0075FF]/60">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h4 className="text-xs font-bold text-white mb-0.5">Need Copilot?</h4>
          <p className="text-[10px] text-slate-400 mb-2 leading-snug">
            Autonomous multi-agent TPM with real-time sprint intelligence.
          </p>
          <button
            type="button"
            onClick={onOpenCopilot}
            className="w-full py-1.5 rounded-xl vision-btn-primary text-white text-[10px] font-bold uppercase tracking-wider text-center"
          >
            Launch Copilot
          </button>
        </div>
      </div>

      {/* Permanently Fixed Bottom Section: Maintainer Info & FIXED Logout Button */}
      <div className="shrink-0 pt-3 border-t border-white/10 mt-auto bg-[#060B26]">
        {currentUser ? (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0F1535] border border-white/10 shadow-lg">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={currentUser.avatarUrl || 'https://avatars.githubusercontent.com/u/121251335?v=4'}
                  alt={currentUser.username}
                  className="w-8 h-8 rounded-xl border border-[#0075FF] object-cover"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0F1535]" />
              </div>
              <div className="truncate">
                <div className="text-[11px] font-bold text-white truncate">
                  @{currentUser.username}
                </div>
                <div className="text-[9px] text-emerald-400 font-medium">Owner (Lead)</div>
              </div>
            </div>

            {/* Permanent High-Visibility Logout Button */}
            <button
              type="button"
              onClick={onLogout}
              id="sidebar-fixed-logout-btn"
              title="Sign Out from Dashboard"
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 transition-all ml-1 shrink-0 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </aside>
  );
};
