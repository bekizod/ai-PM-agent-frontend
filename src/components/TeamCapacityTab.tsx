'use client';

import React from 'react';
import {
  Users,
  UserPlus,
  RefreshCw,
  Sparkles,
  AlertTriangle,
  Mail,
  Trash2,
  CheckCircle2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { TeamCapacityPlan } from '../types/dashboard';

interface TeamCapacityTabProps {
  capacityPlan: any;
  loading?: boolean;
  assigningIssueNumber?: number | null;
  onOpenAddMember: () => void;
  onAutoRebalance: () => void;
  rebalancing: boolean;
  onDeleteMember: (id: string) => void;
  onAssignIssue: (issueNumber: number, memberId: string) => void;
}

export const TeamCapacityTab: React.FC<TeamCapacityTabProps> = ({
  capacityPlan,
  loading,
  assigningIssueNumber,
  onOpenAddMember,
  onAutoRebalance,
  rebalancing,
  onDeleteMember,
  onAssignIssue,
}) => {
  // Safely unwrap capacityPlan from any response nesting structure (direct plan, capacityPlan wrapper, or autoRebalance updatedCapacity wrapper)
  const plan: TeamCapacityPlan =
    capacityPlan?.updatedCapacity?.capacityPlan ||
    capacityPlan?.capacityPlan ||
    capacityPlan ||
    {};

  const members = plan?.members || [];
  const totalSprintPoints = plan?.totalSprintPoints || 0;
  const teamUtilization = plan?.teamUtilizationPercentage || 0;
  const recommendations = plan?.rebalanceRecommendations || [];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#0075FF]" />
            <h2 className="text-sm font-bold text-white">Team Capacity &amp; Dynamic Workload Balancer</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real GitHub repository collaborators with automatic task assignment &amp; email delivery.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onAutoRebalance}
            disabled={rebalancing}
            className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-[#0075FF] text-slate-200 text-xs font-semibold shadow-xs disabled:opacity-50 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#0075FF] ${rebalancing ? 'animate-spin' : ''}`} />
            <span>{rebalancing ? 'Rebalancing...' : 'Auto-Rebalance'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddMember}
            className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0075FF] hover:bg-[#0060df] text-white text-xs font-semibold shadow-xs transition-all active:scale-[0.98]"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Teammate</span>
          </button>
        </div>
      </div>

      {/* Rebalancing Active Notice */}
      {rebalancing && (
        <div className="p-3 rounded-xl bg-[#0075FF]/10 border border-[#0075FF]/30 text-white text-xs flex items-center gap-2 animate-pulse font-mono">
          <RefreshCw className="w-4 h-4 text-[#0075FF] animate-spin" />
          <span>Autonomous AI Workload Balancer is analyzing sprint points and leveling distribution...</span>
        </div>
      )}

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#0f172a] border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium">Active Engineers</span>
          <div className="text-lg font-bold text-white font-mono mt-0.5">{members.length}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-[#0f172a] border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium">Sprint Committed Points</span>
          <div className="text-lg font-bold text-white font-mono mt-0.5">{totalSprintPoints} pts</div>
        </div>
        <div className="p-3.5 rounded-xl bg-[#0f172a] border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium">Team Utilization</span>
          <div
            className={`text-lg font-bold font-mono mt-0.5 ${
              teamUtilization > 90
                ? 'text-rose-400'
                : teamUtilization > 75
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}
          >
            {teamUtilization}%
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-[#0f172a] border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium">Overloaded Members</span>
          <div className="text-lg font-bold text-white font-mono mt-0.5">
            {members.filter((m) => m.isOverloaded).length}
          </div>
        </div>
      </div>

      {/* Dynamic AI Rebalance Recommendations */}
      {recommendations.length > 0 && (
        <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#0075FF]" />
            <span>AI Capacity Recommendations</span>
          </div>
          <div className="space-y-1.5">
            {recommendations.map((rec, i) => (
              <div
                key={i}
                className="text-xs text-slate-300 flex items-start gap-2 bg-[#090d16] p-2.5 rounded-lg border border-slate-800"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#0075FF] mt-1.5 shrink-0" />
                <span className="leading-relaxed">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Teammates Workload Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => {
          const isOverloaded = member.isOverloaded;
          // Only bekizod repo owner is protected from deletion; all other members can be deleted
          const isOwner =
            member.githubUsername?.toLowerCase() === 'bekizod' ||
            member.id === 'member-bekizod' ||
            member.name?.toLowerCase().includes('(repo owner)');

          return (
            <div
              key={member.id || member.name}
              className={`rounded-xl bg-[#0f172a] border p-4 space-y-3 shadow-sm transition-all ${
                isOverloaded
                  ? 'border-rose-500/40'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Member Card Header */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        member.avatar ||
                        (member.githubUsername
                          ? `https://avatars.githubusercontent.com/${member.githubUsername}`
                          : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(member.name)}`)
                      }
                      alt={member.name}
                      className="w-10 h-10 rounded-full bg-slate-800 object-cover border border-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">{member.name}</span>
                        {isOwner && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                            Owner
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 block">{member.role}</span>
                      {member.email && (
                        <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                          <Mail className="w-2.5 h-2.5" />
                          <span>{member.email}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {!isOwner && member.id && (
                    <button
                      type="button"
                      onClick={() => onDeleteMember(member.id!)}
                      title="Remove Collaborator"
                      className="cursor-pointer p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Workload Progress Bar */}
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-400">
                      Workload: {member.storyPoints || 0} / {member.maxCapacityPoints || 15} pts
                    </span>
                    <span
                      className={`font-bold ${
                        isOverloaded ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {member.capacityPercentage || 0}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, member.capacityPercentage || 0)}%` }}
                      className={`h-full rounded-full transition-all ${
                        isOverloaded ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Assigned Tickets & Reassignment Dropdown */}
              {member.assignedIssues && member.assignedIssues.length > 0 && (
                <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                    Assigned Sprint Tickets ({member.assignedIssues.length})
                  </span>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {member.assignedIssues.map((issue) => {
                      // Filter out current member so they never appear in their own reassignment dropdown
                      const otherMembers = members.filter(
                        (m) => (m.id || m.name) !== (member.id || member.name)
                      );
                      const isThisIssueAssigning = assigningIssueNumber === issue.number;

                      return (
                        <div
                          key={issue.number}
                          className="flex items-center justify-between gap-2 p-1.5 rounded bg-[#090d16] border border-slate-800 text-[11px]"
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="font-mono text-[#0075FF] font-bold">#{issue.number}</span>
                            <span className="truncate text-slate-300">{issue.title}</span>
                          </div>

                          {/* Reassign Selector: Only lists other members + loading state */}
                          {isThisIssueAssigning ? (
                            <span className="inline-flex items-center gap-1 text-[10px] text-[#0075FF] font-mono shrink-0">
                              <RefreshCw className="w-3 h-3 animate-spin" />
                              <span>Assigning...</span>
                            </span>
                          ) : otherMembers.length === 0 ? (
                            <span className="text-[10px] text-slate-500 font-mono italic shrink-0">
                              Solo
                            </span>
                          ) : (
                            <select
                              value=""
                              disabled={assigningIssueNumber !== null}
                              onChange={(e) => {
                                const targetMemberId = e.target.value;
                                if (targetMemberId) {
                                  onAssignIssue(issue.number, targetMemberId);
                                }
                              }}
                              className="cursor-pointer bg-slate-900 border border-slate-700 hover:border-[#0075FF] rounded px-1.5 py-0.5 text-[10px] text-slate-300 outline-none shrink-0 transition-colors disabled:opacity-50"
                            >
                              <option value="" disabled>
                                Reassign to...
                              </option>
                              {otherMembers.map((m) => (
                                <option key={m.id || m.name} value={m.id || m.name}>
                                  {m.name} ({m.capacityPercentage || 0}%)
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
