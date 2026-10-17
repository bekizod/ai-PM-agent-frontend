'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  GitBranch,
  Lock,
  AlertCircle,
  Sparkles,
  Layers,
  Radio,
  CheckCircle2,
  Mail,
  Loader2
} from 'lucide-react';

const GitHubIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
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
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const [deniedUser, setDeniedUser] = useState<string | null>(null);

  // Check if already authenticated: logged-in persons CANNOT see /login page
  useEffect(() => {
    let isMounted = true;
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.authenticated && data.user) {
          router.replace('/');
        } else {
          setCheckingAuth(false);
        }
      })
      .catch(() => {
        if (isMounted) setCheckingAuth(false);
      });

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

  const handleSignIn = async () => {
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

  // If verifying existing session, show sleek neon loading indicator instead of login card
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col justify-center items-center p-6 relative overflow-hidden select-none font-sans">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-gradient-to-tr from-cyan-500/30 via-teal-400/20 to-blue-600/25 rounded-full blur-[130px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-gradient-to-bl from-fuchsia-500/30 via-pink-600/20 to-purple-700/25 rounded-full blur-[130px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-fuchsia-500 p-[1.5px] shadow-[0_0_25px_rgba(34,211,238,0.5)]">
            <div className="w-full h-full bg-[#0a0f1d] rounded-[14px] flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
            </div>
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-white tracking-wide">
              Checking Authorization Session...
            </h2>
            <p className="text-xs text-slate-400">
              Verifying maintainer credentials for <span className="text-cyan-300 font-mono">@bekizod</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col justify-between items-center p-6 relative overflow-hidden select-none font-sans">
      {/* =========================================================================
          DYNAMIC NEON GRADIENT FOG ATMOSPHERE
         ========================================================================= */}
      {/* Deep Cyber Matrix Dotted Backdrop */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Primary Cyan Neon Fog Cloud (Top-Left) */}
      <div className="absolute top-[-12%] left-[-5%] w-[680px] h-[580px] bg-gradient-to-tr from-cyan-500/40 via-teal-400/25 to-blue-600/35 rounded-full blur-[130px] pointer-events-none animate-float-slow" />

      {/* Cyber Fuchsia & Hot Pink Neon Fog Cloud (Top-Right to Center) */}
      <div className="absolute top-[10%] right-[-10%] w-[650px] h-[650px] bg-gradient-to-bl from-fuchsia-500/35 via-pink-600/30 to-purple-700/30 rounded-full blur-[140px] pointer-events-none animate-float-reverse" />

      {/* Electric Ultra-Violet Deep Ambient Fog (Bottom-Center) */}
      <div className="absolute bottom-[-18%] left-[20%] w-[750px] h-[500px] bg-gradient-to-t from-violet-600/35 via-indigo-700/25 to-transparent rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />

      {/* Concentrated Neon Laser Sheen (Center Halo) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[320px] bg-gradient-to-r from-cyan-500/15 via-fuchsia-500/20 to-indigo-500/15 rounded-full blur-[110px] pointer-events-none" />

      {/* =========================================================================
          TOP NAVIGATION HEADER
         ========================================================================= */}
      <header className="w-full max-w-5xl flex items-center justify-between text-xs z-10">
        <div className="flex items-center gap-3">
          {/* Logo with Neon Glow */}
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-fuchsia-500 p-[1.5px] shadow-[0_0_20px_rgba(34,211,238,0.5)]">
            <div className="w-full h-full bg-[#0a0f1d] rounded-[10px] flex items-center justify-center font-mono text-xs font-bold text-white">
              <span className="text-cyan-400">&gt;</span>_
            </div>
          </div>
          <div>
            <div className="font-bold text-white tracking-tight text-sm flex items-center gap-2 drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
              <span>SprintOps</span>
              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono tracking-wider shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                AI TPM
              </span>
            </div>
          </div>
        </div>

        {/* Target Repository Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/35 text-[11px] font-mono text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.25)] backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)] animate-pulse" />
          <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
          <span>bekizod/ai_target_repo_name</span>
        </div>
      </header>

      {/* =========================================================================
          MAIN NEON GLASS CARD CONTAINER
         ========================================================================= */}
      <main className="w-full max-w-md my-auto space-y-6 z-10">
        {/* Error Alert if non-owner attempts to log in */}
        {deniedUser && (
          <div className="bg-rose-950/80 border border-rose-500/50 rounded-2xl p-4 flex items-start gap-3 text-xs text-rose-200 shadow-[0_0_35px_rgba(244,63,94,0.35)] backdrop-blur-xl animate-fade-in">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5 drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
            <div className="space-y-1">
              <span className="font-bold text-rose-300">Access Restricted: @{deniedUser}</span>
              <p className="text-[11px] text-rose-300/90 leading-relaxed">
                Only the repository maintainer (<strong>@bekizod</strong>) has dashboard access. Collaborator assignments &amp; tickets are dispatched directly to your registered email.
              </p>
            </div>
          </div>
        )}

        {/* Neon Gradient Fog Outer Glow Frame */}
        <div className="relative group">
          {/* Neon Gradient Aura Frame */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-indigo-500 via-fuchsia-500 to-cyan-400 rounded-3xl blur-lg opacity-70 group-hover:opacity-100 transition duration-700 animate-pulse-glow" />

          {/* Inner Frosted Glassmorphism Card */}
          <div className="relative bg-[#090d1a]/85 backdrop-blur-2xl border border-white/15 rounded-2xl p-7 shadow-[0_0_50px_rgba(0,0,0,0.8)] space-y-6">
            {/* Top Luminous Neon Horizon Line */}
            <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 via-fuchsia-400 to-transparent shadow-[0_0_15px_rgba(34,211,238,0.9)]" />

            {/* Header / Title */}
            <div className="space-y-2 text-center pt-1">
              <h1 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-slate-200 drop-shadow-[0_0_18px_rgba(34,211,238,0.35)]">
                Maintainer Authorization
              </h1>
              <p className="text-xs text-slate-300/80 leading-relaxed max-w-xs mx-auto">
                Sign in to manage sprint velocity, triage P0 incidents, and orchestrate automated GitHub workflows.
              </p>
            </div>

            {/* Glowing Neon Sign-In Action Button */}
            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={handleSignIn}
                disabled={loading}
                id="owner-neon-login-btn"
                className="w-full relative overflow-hidden rounded-xl p-[1.5px] cursor-pointer group disabled:opacity-50 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                {/* Button Outer Neon Gradient Ring */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-indigo-500 rounded-xl blur-xs group-hover:blur-sm transition-all" />

                {/* Button Inner Content */}
                <div className="relative flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-[#0b1222] to-[#131b32] group-hover:from-[#0e172c] group-hover:to-[#17213e] border border-cyan-400/40 transition-all shadow-[0_0_25px_rgba(6,182,212,0.35)]">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src="https://avatars.githubusercontent.com/u/121251335?v=4"
                        alt="bekizod"
                        className="w-10 h-10 rounded-full ring-2 ring-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.7)] object-cover"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-[#0b1222] shadow-[0_0_8px_rgba(52,211,153,0.9)] animate-pulse" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>Sign In as @bekizod</span>
                        <span className="text-[9px] font-bold bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 px-1.5 py-0.5 rounded shadow-[0_0_8px_rgba(6,182,212,0.4)]">
                          Owner
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-normal">
                        Launch TPM Automation Dashboard
                      </div>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center group-hover:bg-cyan-500/35 group-hover:border-cyan-300 transition-all shadow-[0_0_12px_rgba(34,211,238,0.35)]">
                    <ArrowRight className="w-4 h-4 text-cyan-300 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </button>
            </div>

            {/* Neon Feature Capabilities Matrix */}
            <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                <span>Automated Capabilities</span>
              </div>

              <div className="space-y-2 text-[11px] text-slate-300 font-medium">
                {/* Capability 1 */}
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/70 border border-cyan-500/20 hover:border-cyan-500/50 transition-all shadow-[0_0_15px_rgba(6,182,212,0.08)]">
                  <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
                    <Zap className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
                  </div>
                  <span>Autonomous P0 Triage &amp; Blast Radius Analysis</span>
                </div>

                {/* Capability 2 */}
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/70 border border-indigo-500/20 hover:border-indigo-500/50 transition-all shadow-[0_0_15px_rgba(99,102,241,0.08)]">
                  <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                    <Layers className="w-3.5 h-3.5 text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.9)]" />
                  </div>
                  <span>Team Workload Balancer &amp; GitHub Collaborator Invites</span>
                </div>

                {/* Capability 3 */}
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/70 border border-fuchsia-500/20 hover:border-fuchsia-500/50 transition-all shadow-[0_0_15px_rgba(217,70,239,0.08)]">
                  <div className="w-6 h-6 rounded-lg bg-fuchsia-500/20 border border-fuchsia-500/30 flex items-center justify-center shrink-0">
                    <Radio className="w-3.5 h-3.5 text-fuchsia-400 drop-shadow-[0_0_8px_rgba(232,121,249,0.9)]" />
                  </div>
                  <span>Nodemailer SMTP Real-Time Task Delivery &amp; GitHub Sync</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Access Badge */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
          <Lock className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]" />
          <span>Single-Owner Protected Console</span>
          <span className="text-slate-600">&bull;</span>
          <span className="text-slate-400">Team tasks routed via Email</span>
        </div>
      </main>

      {/* =========================================================================
          CLEAN NEON ACCENTED FOOTER
         ========================================================================= */}
      <footer className="w-full max-w-5xl flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400 z-10 pt-4 border-t border-slate-900/80">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)] animate-pulse" />
          <span className="text-slate-300">SprintOps AI &bull; Octokit GitHub REST API &amp; Gmail SMTP Active</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/bekizod/ai_target_repo_name"
            target="_blank"
            rel="noreferrer"
            className="hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
          >
            <GitHubIcon className="w-3 h-3 text-slate-400 hover:text-cyan-300" />
            <span>Repository Backlog</span>
          </a>
          <span>&bull;</span>
          <span className="text-cyan-400 font-mono">v1.2 Production</span>
        </div>
      </footer>
    </div>
  );
}
