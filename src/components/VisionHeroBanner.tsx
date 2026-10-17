'use client';

import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { CurrentUser } from '../types/dashboard';

interface VisionHeroBannerProps {
  currentUser: CurrentUser | null;
  onOpenCopilot: () => void;
  repoContext: string;
}

export const VisionHeroBanner: React.FC<VisionHeroBannerProps> = ({
  currentUser,
  onOpenCopilot,
  repoContext,
}) => {
  return (
    <div className="vision-card p-6 relative overflow-hidden flex flex-col justify-between min-h-[220px] shadow-xl">
      {/* Background Glowing Cyber Neural / Deep Sea Jellyfish Mesh */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none opacity-40 sm:opacity-75 flex items-center justify-end pr-4">
        <div className="w-56 h-56 rounded-full bg-gradient-to-tr from-[#0075FF]/40 via-[#00E5FF]/30 to-purple-600/30 blur-2xl animate-pulse" />
        <svg
          viewBox="0 0 200 200"
          className="w-52 h-52 absolute right-4 text-[#00E5FF] drop-shadow-[0_0_25px_rgba(0,229,255,0.7)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 20 C60 20 40 60 40 100 C40 120 50 140 70 145 C60 160 55 180 50 190 M100 20 C140 20 160 60 160 100 C160 120 150 140 130 145 C140 160 145 180 150 190"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M70 100 C70 130 80 170 85 190 M130 100 C130 130 120 170 115 190 M100 90 C100 130 100 170 100 190"
            stroke="#0075FF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="4 4"
          />
          <circle cx="100" cy="80" r="30" fill="url(#jellyGlow)" fillOpacity="0.3" />
          <defs>
            <radialGradient id="jellyGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="100%" stopColor="#0075FF" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-sm space-y-2">
        <span className="text-[11px] font-medium text-slate-400">Welcome back,</span>
        <h2 className="text-2xl font-black text-white tracking-tight">
          {currentUser ? currentUser.name : '@bekizod'}
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          SprintOps AI orchestrator is live on <strong className="text-cyan-300 font-mono">{repoContext}</strong>. Autonomous bug triage and workload balancing active.
        </p>
      </div>

      <div className="relative z-10 pt-4">
        <button
          type="button"
          onClick={onOpenCopilot}
          className="inline-flex items-center gap-2 text-xs font-bold text-white hover:text-cyan-300 transition-colors group cursor-pointer"
        >
          <span>Ask AI TPM Copilot</span>
          <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
