'use client';

import React from 'react';
import { BarChart3, Users, GitPullRequest, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { AnalyticsData } from '../types/dashboard';

interface VisionChartsProps {
  analytics: AnalyticsData | null;
}

export const VisionCharts: React.FC<VisionChartsProps> = ({ analytics }) => {
  const burndown = analytics?.burndown || [
    { day: 'Day 1', ideal: 50, actual: 48 },
    { day: 'Day 3', ideal: 42, actual: 40 },
    { day: 'Day 5', ideal: 35, actual: 30 },
    { day: 'Day 7', ideal: 28, actual: 22 },
    { day: 'Day 9', ideal: 20, actual: 16 },
    { day: 'Day 11', ideal: 12, actual: 8 },
    { day: 'Day 14', ideal: 0, actual: 2 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Smooth Curved Dual-Line Velocity Chart (8 Cols) */}
      <div className="lg:col-span-8 vision-card p-6 flex flex-col justify-between shadow-xl">
        <div className="flex items-center justify-between pb-2">
          <div>
            <h3 className="text-sm font-bold text-white">Sprint Velocity &amp; Burn Trajectory</h3>
            <span className="text-[11px] font-bold text-emerald-400 font-mono">
              (+8% velocity) in current iteration
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1.5 text-cyan-400 font-semibold font-mono">
              <span className="w-2.5 h-1 bg-cyan-400 rounded-full" />
              <span>Velocity (Actual)</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-400 font-medium font-mono">
              <span className="w-2.5 h-1 bg-slate-600 rounded-full" />
              <span>Guideline Target</span>
            </span>
          </div>
        </div>

        {/* SVG Curved Area Chart with Vision UI Blue/Cyan Gradient */}
        <div className="w-full h-56 pt-2">
          <svg viewBox="0 0 700 200" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="velocityGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0075FF" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#0075FF" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#00E5FF" />
                <stop offset="100%" stopColor="#0075FF" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid Lines */}
            <line x1="0" y1="40" x2="700" y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
            <line x1="0" y1="90" x2="700" y2="90" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
            <line x1="0" y1="140" x2="700" y2="140" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
            <line x1="0" y1="190" x2="700" y2="190" stroke="rgba(255,255,255,0.05)" />

            {/* Target Guideline Dashed Curve */}
            <path
              d="M 20 40 Q 200 80, 350 110 T 680 180"
              fill="none"
              stroke="#64748B"
              strokeWidth="2"
              strokeDasharray="6 6"
              opacity="0.6"
            />

            {/* Actual Velocity Filled Smooth Area */}
            <path
              d="M 20 45 C 120 70, 220 50, 320 110 C 420 160, 520 140, 680 185 L 680 195 L 20 195 Z"
              fill="url(#velocityGrad)"
            />

            {/* Actual Velocity Vibrant Stroke */}
            <path
              d="M 20 45 C 120 70, 220 50, 320 110 C 420 160, 520 140, 680 185"
              fill="none"
              stroke="url(#lineGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
              className="drop-shadow-[0_0_12px_rgba(0,229,255,0.8)]"
            />

            {/* Data Points */}
            <circle cx="20" cy="45" r="4.5" fill="#00E5FF" stroke="#060B26" strokeWidth="2" />
            <circle cx="320" cy="110" r="4.5" fill="#0075FF" stroke="#060B26" strokeWidth="2" />
            <circle cx="680" cy="185" r="4.5" fill="#00E5FF" stroke="#060B26" strokeWidth="2" />
          </svg>

          {/* Month / Sprint Labels */}
          <div className="flex justify-between text-[11px] text-slate-400 font-mono pt-1">
            <span>Sprint Start</span>
            <span>Day 4</span>
            <span>Midpoint</span>
            <span>Day 10</span>
            <span>Sprint Delivery</span>
          </div>
        </div>
      </div>

      {/* Active Triage Pill Bar Chart (4 Cols) */}
      <div className="lg:col-span-4 vision-card p-6 flex flex-col justify-between shadow-xl">
        <div>
          {/* Vertical Bar Pillars matching Image 1 */}
          <div className="h-36 flex items-end justify-between gap-2 px-2 pb-2 border-b border-white/5">
            {[65, 30, 85, 45, 95, 70, 50, 40].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div
                  style={{ height: `${h}%` }}
                  className="w-2.5 rounded-full bg-white transition-all hover:bg-[#0075FF]"
                />
              </div>
            ))}
          </div>

          <div className="pt-3">
            <h4 className="text-sm font-bold text-white">Active Automated Agents</h4>
            <span className="text-[11px] font-bold text-emerald-400 font-mono block mt-0.5">
              (+5 agents) deployed in swarm
            </span>
          </div>
        </div>

        {/* 4 Bottom Metric Chips matching Image 1 */}
        <div className="grid grid-cols-4 gap-2 pt-3 text-center border-t border-white/5">
          <div>
            <span className="text-[10px] text-slate-400 block">Agents</span>
            <span className="text-xs font-bold text-white font-mono">5 Swarm</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Traces</span>
            <span className="text-xs font-bold text-cyan-300 font-mono">1.4k</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Fix PRs</span>
            <span className="text-xs font-bold text-white font-mono">12 Live</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">SLA</span>
            <span className="text-xs font-bold text-emerald-400 font-mono">99.8%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
