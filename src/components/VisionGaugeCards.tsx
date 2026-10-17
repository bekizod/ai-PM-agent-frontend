'use client';

import React from 'react';
import { Smile, ShieldCheck, Zap } from 'lucide-react';
import { AnalyticsData } from '../types/dashboard';

interface VisionGaugeCardsProps {
  analytics: AnalyticsData | null;
}

export const VisionGaugeCards: React.FC<VisionGaugeCardsProps> = ({ analytics }) => {
  const slaRate = analytics?.kpis.slaComplianceRate || 99.8;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Satisfaction / SLA Rate Arc Card */}
      <div className="vision-card p-5 flex flex-col justify-between shadow-xl">
        <div>
          <h3 className="text-sm font-bold text-white">SLA Reliability Rate</h3>
          <span className="text-[11px] text-slate-400">Target uptime &amp; breach protection</span>
        </div>

        {/* Semi-circular Radial Arc */}
        <div className="relative flex flex-col items-center justify-center my-3">
          <svg className="w-40 h-24 overflow-visible" viewBox="0 0 160 90">
            {/* Background Arc */}
            <path
              d="M 20 85 A 60 60 0 0 1 140 85"
              fill="none"
              stroke="#1A1F37"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Progress Arc */}
            <path
              d="M 20 85 A 60 60 0 0 1 140 85"
              fill="none"
              stroke="url(#arcGradient)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray="188.5"
              strokeDashoffset="10"
              className="drop-shadow-[0_0_12px_rgba(0,117,255,0.8)]"
            />
            <defs>
              <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0075FF" />
                <stop offset="100%" stopColor="#00E5FF" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Glow Icon */}
          <div className="absolute top-4 w-10 h-10 rounded-full bg-[#0075FF] flex items-center justify-center text-white shadow-lg shadow-[#0075FF]/60">
            <Smile className="w-5 h-5" />
          </div>

          <div className="text-center mt-1">
            <div className="text-2xl font-black text-white font-mono">{slaRate}%</div>
            <span className="text-[10px] text-slate-400 font-medium">Verified Operational</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2 border-t border-white/5">
          <span>0%</span>
          <span className="text-emerald-400 font-bold">&ge; 99.5% Target</span>
          <span>100%</span>
        </div>
      </div>

      {/* Referral Tracking / System Safety Score Card */}
      <div className="vision-card p-5 flex flex-col justify-between shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Blast Radius Containment</h3>
            <span className="text-[11px] text-slate-400">Architectural isolation index</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 my-2">
          {/* Metrics summary */}
          <div className="space-y-3">
            <div className="p-2.5 rounded-xl bg-[#060B26]/80 border border-white/5">
              <span className="text-[10px] text-slate-400 block">P0 Incidents</span>
              <span className="text-sm font-bold text-white font-mono">0 In Flight</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#060B26]/80 border border-white/5">
              <span className="text-[10px] text-slate-400 block">Active Isolations</span>
              <span className="text-sm font-bold text-cyan-300 font-mono">100% Clean</span>
            </div>
          </div>

          {/* Circular Radial Ring Gauge */}
          <div className="relative flex items-center justify-center">
            <svg className="w-28 h-28 transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="44"
                stroke="#1A1F37"
                strokeWidth="9"
                fill="none"
              />
              <circle
                cx="56"
                cy="56"
                r="44"
                stroke="url(#circleGauge)"
                strokeWidth="9"
                strokeDasharray="276"
                strokeDashoffset="25"
                strokeLinecap="round"
                fill="none"
                className="drop-shadow-[0_0_10px_rgba(0,229,255,0.7)]"
              />
              <defs>
                <linearGradient id="circleGauge" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0075FF" />
                  <stop offset="100%" stopColor="#00E5FF" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute text-center">
              <span className="text-[10px] text-slate-400 block leading-none">Safety</span>
              <span className="text-xl font-black text-white font-mono">9.8</span>
              <span className="text-[9px] text-slate-400 block leading-none">Total Score</span>
            </div>
          </div>
        </div>

        <div className="text-[10px] text-slate-400 flex items-center justify-between pt-2 border-t border-white/5 font-mono">
          <span className="text-emerald-400 flex items-center gap-1 font-bold">
            <ShieldCheck className="w-3 h-3" />
            Zero Breaches
          </span>
          <span>Max Score: 10.0</span>
        </div>
      </div>
    </div>
  );
};
