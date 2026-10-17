'use client';

import React from 'react';
import { ShieldAlert, GitPullRequest, Clock, Zap, Globe, FileText, ShoppingCart, Wallet } from 'lucide-react';
import { AnalyticsData, GitHubIssueSummary } from '../types/dashboard';

interface VisionStatCardsProps {
  analytics: AnalyticsData | null;
  issuesCount: number;
}

export const VisionStatCards: React.FC<VisionStatCardsProps> = ({ analytics, issuesCount }) => {
  const kpis = analytics?.kpis || {
    mttdMinutes: 12,
    mttrHours: 1.8,
    slaComplianceRate: 99.8,
    criticalDefectRatio: 4.2,
    totalTracked: 36,
  };

  const cards = [
    {
      title: "Today's Incidents",
      value: `${kpis.criticalDefectRatio}% Defect`,
      change: '-14%',
      isPositive: true,
      icon: ShieldAlert,
    },
    {
      title: 'Active Backlog Issues',
      value: `${issuesCount} Tracked`,
      change: '+5%',
      isPositive: true,
      icon: Globe,
    },
    {
      title: 'Mean Time to Resolve',
      value: `${kpis.mttrHours}h MTTR`,
      change: '+24%',
      isPositive: true,
      icon: FileText,
    },
    {
      title: 'Sprint Point Velocity',
      value: '48 / 52 pts',
      change: '+8%',
      isPositive: true,
      icon: Zap,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="vision-card p-4.5 flex items-center justify-between shadow-lg transition-transform hover:-translate-y-0.5"
          >
            <div>
              <span className="text-[11px] font-medium text-slate-400 block mb-1">
                {card.title}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white font-mono">{card.value}</span>
                <span
                  className={`text-[11px] font-bold font-mono ${
                    card.isPositive ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {card.change}
                </span>
              </div>
            </div>

            <div className="w-11 h-11 rounded-2xl bg-[#0075FF] flex items-center justify-center text-white shadow-md shadow-[#0075FF]/50 shrink-0">
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
