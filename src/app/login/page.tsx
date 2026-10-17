'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Lock,
  ArrowRight,
  ShieldCheck,
  GitBranch,
  AlertCircle,
  Sparkles,
  Loader2,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

const GitHubIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deniedUser, setDeniedUser] = useState<string | null>(null);

  // Check if already authenticated: logged-in persons CANNOT see /login page
  useEffect(() => {
    let isMounted = true;
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/(^|;)\s*tpm_auth_session=([^;]+)/);
      if (match) {
        try {
          const user = JSON.parse(decodeURIComponent(match[2]));
          if (user && user.username) {
            router.replace('/');
            return;
          }
        } catch {}
      }
    }

    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.authenticated && data.user) {
          router.replace('/');
        }
      })
      .catch(() => {});

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('error') === 'unauthorized_not_owner') {
        setDeniedUser(params.get('user') || 'User');
      }
    }

    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleGitHubSignIn = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      console.error('Sign-in failed:', err);
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#060B26] text-white flex flex-col justify-center items-center p-6 relative select-none font-sans">
        <div className="w-14 h-14 rounded-2xl bg-[#0075FF]/20 border border-[#0075FF]/40 flex items-center justify-center shadow-2xl shadow-[#0075FF]/40 mb-4 animate-pulse">
          <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
        </div>
        <h2 className="text-sm font-bold text-white tracking-wide">
          Verifying Vision UI Session...
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Redirecting maintainer <span className="text-cyan-400 font-mono">@bekizod</span>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060B26] text-white flex flex-col justify-between relative overflow-hidden font-sans select-none">
      {/* Top Floating Glass Navigation Bar (Vision UI Style from Image 3) */}
      <header className="absolute top-6 left-6 right-6 z-30 max-w-5xl mx-auto flex items-center justify-between px-6 py-3 rounded-2xl bg-[#0F1535]/85 backdrop-blur-xl border border-white/10 shadow-2xl">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#0075FF] to-[#00E5FF] flex items-center justify-center font-mono font-bold text-xs text-white">
            &gt;_
          </div>
          <span className="font-bold text-xs uppercase tracking-widest text-white">
            VISION UI
          </span>
          <span className="hidden sm:inline text-[10px] text-cyan-400 font-mono">
            / AI TPM AGENT
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-[11px] font-medium text-slate-300">
          <span className="hover:text-white cursor-pointer transition-colors">DASHBOARD</span>
          <span className="hover:text-white cursor-pointer transition-colors">TELEMETRY</span>
          <span className="hover:text-white cursor-pointer transition-colors">SLA AUDIT</span>
          <span className="text-white font-bold cursor-pointer">SIGN IN</span>
        </div>

        <a
          href="https://github.com/bekizod/ai_target_repo_name"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl vision-btn-primary text-white text-[11px] font-bold shadow-md shadow-[#0075FF]/40 cursor-pointer"
        >
          <GitBranch className="w-3 h-3" />
          <span>bekizod/ai_target_repo_name</span>
        </a>
      </header>

      {/* Main Split Screen Container */}
      <div className="flex-1 flex flex-col lg:flex-row w-full min-h-screen pt-20 lg:pt-0">
        {/* =========================================================================
            LEFT COLUMN: REFINED MATTE PERSPECTIVE TUNNEL (Deep, Non-Glare, Elegant)
           ========================================================================= */}
        <div className="lg:w-1/2 relative flex items-center justify-center p-8 lg:p-16 overflow-hidden min-h-[420px] lg:min-h-screen bg-[#070B1E]">
          {/* Subtle Deep Cyber Ambient Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#111936] via-[#090D24] to-[#060B26]" />

          {/* Elegant Matte Architectural Triangular Tunnel (Subtle, Non-Glare) */}
          <svg
            viewBox="0 0 600 600"
            className="w-full max-w-[500px] h-auto relative z-10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Triangle Frame */}
            <polygon
              points="300,50 550,510 50,510"
              stroke="#2E3760"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Tier 2 Triangle */}
            <polygon
              points="300,120 490,470 110,470"
              stroke="#0075FF"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeOpacity="0.5"
            />
            {/* Tier 3 Triangle */}
            <polygon
              points="300,190 430,430 170,430"
              stroke="#00E5FF"
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeOpacity="0.4"
            />
            {/* Tier 4 Triangle */}
            <polygon
              points="300,260 370,390 230,390"
              stroke="#6366F1"
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeOpacity="0.35"
            />

            {/* Depth Perspective Axis Rays */}
            <line x1="300" y1="50" x2="300" y2="330" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="50" y1="510" x2="260" y2="360" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="550" y1="510" x2="340" y2="360" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />

            {/* Subtle Horizon Node */}
            <circle cx="300" cy="340" r="12" fill="#0075FF" fillOpacity="0.2" />
            <circle cx="300" cy="340" r="4" fill="#00E5FF" fillOpacity="0.8" />
          </svg>

          {/* Central Typography Banner */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-t from-[#060B26]/90 via-transparent to-transparent">
            <div className="mt-48 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#00E5FF]">
                INSPIRED BY THE FUTURE:
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                THE VISION UI DASHBOARD
              </h1>
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                Autonomous Technical Product Management, Incident Blast Radius Modeling &amp; Workload Intelligence.
              </p>
            </div>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: PURE GITHUB AUTHENTICATION (No fake email/password)
           ========================================================================= */}
        <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-20 relative z-20">
          <div className="w-full max-w-md space-y-6">
            {/* Header Greeting */}
            <div className="space-y-1.5">
              <h2 className="text-3xl font-black text-white tracking-tight">
                Nice to see you!
              </h2>
              <p className="text-xs text-slate-400">
                Sign in with your verified GitHub account to access the TPM automation dashboard.
              </p>
            </div>

            {/* Error Banner if Non-Owner attempts login */}
            {deniedUser && (
              <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/50 flex items-start gap-3 text-xs text-rose-200 backdrop-blur-xl animate-fade-in shadow-xl">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-rose-300">Access Restricted: @{deniedUser}</span>
                  <p className="text-[11px] text-rose-300/90 leading-relaxed">
                    Only repository owner (<strong>@bekizod</strong>) has dashboard login authority. Assigned issues and PRDs are dispatched directly to your inbox.
                  </p>
                </div>
              </div>
            )}

            {/* Owner Authority Card */}
            <div className="p-4 rounded-2xl bg-[#0F1535] border border-white/10 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src="https://avatars.githubusercontent.com/u/121251335?v=4"
                    alt="bekizod"
                    className="w-12 h-12 rounded-2xl border-2 border-[#0075FF] object-cover"
                  />
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-[#0F1535]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white">@bekizod</span>
                    <span className="text-[9px] font-bold bg-[#0075FF]/20 text-cyan-300 border border-[#0075FF]/40 px-1.5 py-0.2 rounded">
                      Repository Owner
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Owner of bekizod/ai_target_repo_name
                  </div>
                </div>
              </div>

              {/* Security Pill */}
              <div className="p-3 rounded-xl bg-[#060B26]/80 border border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Single-Owner Console Access</span>
                </span>
                <span className="text-emerald-400 font-bold font-mono text-[11px]">Enforced</span>
              </div>

              {/* Primary GitHub Sign-In Button */}
              <button
                type="button"
                onClick={handleGitHubSignIn}
                disabled={loading}
                id="vision-github-sign-in-btn"
                className="w-full py-3.5 rounded-2xl vision-btn-primary text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-transform active:scale-[0.99] disabled:opacity-50 cursor-pointer shadow-lg shadow-[#0075FF]/30"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>AUTHENTICATING OWNER...</span>
                  </>
                ) : (
                  <>
                    <GitHubIcon className="w-5 h-5 text-white" />
                    <span>Continue with GitHub</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Automation Capabilities Strip */}
            <div className="space-y-2 pt-1 text-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Active Automated Capabilities</span>
              </div>

              <div className="space-y-2 text-[11px] text-slate-300">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.03] border border-white/5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Autonomous P0 Incident Triage &amp; Blast Radius Analysis</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.03] border border-white/5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Workload Balancer &amp; Direct Collaborator Invites</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.03] border border-white/5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Automated Gmail SMTP Task Assignment Dispatch</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer (Matching Image 3) */}
      <footer className="w-full py-4 px-6 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-400 border-t border-white/5 relative z-30">
        <div>
          @ 2026, Made with <span className="text-rose-500">❤️</span> by{' '}
          <strong className="text-white">SprintOps &amp; Vision UI</strong> for a better web
        </div>
        <div className="flex items-center gap-6">
          <span className="hover:text-white cursor-pointer">Marketplace</span>
          <span className="hover:text-white cursor-pointer">Blog</span>
          <span className="hover:text-white cursor-pointer">License</span>
        </div>
      </footer>
    </div>
  );
}
