'use client';

import React from 'react';
import { Bell, Code2, ShoppingCart, Mail, Radio, Flame, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ActivityItem } from '../types/dashboard';

interface VisionTimelineProps {
  items: ActivityItem[];
  onOpenCodeFix: (item: ActivityItem) => void;
  onOpenOutageComms: (item: ActivityItem) => void;
  onOpenWarRoom: (item: ActivityItem) => void;
}

export const VisionTimeline: React.FC<VisionTimelineProps> = ({
  items,
  onOpenCodeFix,
  onOpenOutageComms,
  onOpenWarRoom,
}) => {
  return (
    <div className="vision-card p-6 shadow-xl flex flex-col justify-between">
      {/* Header */}
      <div className="pb-3 border-b border-white/5 mb-4">
        <h3 className="text-sm font-bold text-white">AI Automation Stream</h3>
        <span className="text-[11px] font-bold text-emerald-400 font-mono block mt-0.5">
          (+100% automated) incident telemetry
        </span>
      </div>

      {/* Timeline List matching Image 1 Orders Overview */}
      <div className="space-y-4 flex-1">
        {items.slice(0, 5).map((item, idx) => {
          const isTriage = item.type === 'REACTIVE_TRIAGE' || !!item.triage;
          const isP0 = item.triage?.severity === 'P0';

          const title = item.triage?.title || item.prd?.title || 'Telemetry Stream Incident';
          const time = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          return (
            <div key={item.id} className="flex items-start gap-3">
              {/* Timeline Icon Node */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  isP0
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : isTriage
                    ? 'bg-[#0075FF]/20 text-[#0075FF] border border-[#0075FF]/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {isP0 ? <Flame className="w-4 h-4" /> : isTriage ? <Code2 className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
              </div>

              {/* Text & Actions */}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white truncate">{title}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">{time}</div>

                {/* Micro Action Buttons */}
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => onOpenCodeFix(item)}
                    className="text-[10px] px-2 py-0.5 rounded-lg bg-white/5 hover:bg-[#0075FF] text-white font-medium transition-colors"
                  >
                    Fix Diff
                  </button>
                  {isTriage && (
                    <button
                      type="button"
                      onClick={() => onOpenOutageComms(item)}
                      className="text-[10px] px-2 py-0.5 rounded-lg bg-white/5 hover:bg-[#0075FF] text-white font-medium transition-colors"
                    >
                      Comms
                    </button>
                  )}
                  {isTriage && (
                    <button
                      type="button"
                      onClick={() => onOpenWarRoom(item)}
                      className="text-[10px] px-2 py-0.5 rounded-lg bg-white/5 hover:bg-[#0075FF] text-white font-medium transition-colors"
                    >
                      War Room
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
