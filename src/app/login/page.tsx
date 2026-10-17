'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  AlertTriangle,
  Mail,
  Users,
  CheckCircle2,
} from 'lucide-react';

const GitHubIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [deniedUser, setDeniedUser] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('error') === 'unauthorized_not_owner') {
        setDeniedUser(params.get('user') || 'User');
      }
    }
  }, []);

  const handleOwnerLogin = async () => {
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
      console.error('Owner login failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubOAuthClick = () => {
    window.location.href = '/api/auth/github';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden select-none">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 mb-2 shadow-lg shadow-indigo-500/20">
            <Zap className="w-6 h-6 text-indigo-400" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">SprintOps AI</h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Autonomous Technical Product Manager Orchestrator
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono bg-slate-900/90 border border-slate-800 text-indigo-300 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Target Repo: bekizod/ai_target_repo_name</span>
          </div>
        </div>

        {/* Access Denied Warning Banner (if non-owner attempts to log in) */}
        {deniedUser && (
          <div className="bg-rose-950/80 border border-rose-500/40 rounded-xl p-3.5 space-y-1.5 text-xs text-rose-200">
            <div className="flex items-center gap-2 font-bold text-rose-300">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Access Denied: @{deniedUser}</span>
            </div>
            <p className="text-[11px] leading-relaxed text-rose-300/90">
              Only the repository owner (<strong>@bekizod</strong>) has authorization to access the automation dashboard. All team collaborators receive their assigned tickets, PRDs, and reports directly via email notifications.
            </p>
          </div>
        )}

        {/* Primary Auth Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-2xl space-y-5">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">Owner Authorization Gateway</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Single Owner Security
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Full orchestration authority over bug triages, sprint balancing, automated PRs, and release digests.
            </p>
          </div>

          {/* Owner Sign In Action */}
          <button
            type="button"
            onClick={handleOwnerLogin}
            disabled={loading}
            id="owner-signin-btn"
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer shadow-lg shadow-indigo-600/25 group"
          >
            <div className="flex items-center gap-3">
              <img
                src="https://avatars.githubusercontent.com/u/121251335?v=4"
                alt="bekizod"
                className="w-8 h-8 rounded-full border border-white/30 object-cover"
              />
              <div className="text-left">
                <div className="text-xs font-bold leading-tight">Sign in as @bekizod</div>
                <div className="text-[10px] text-indigo-200 font-normal">Repository Owner & Tech Lead</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition" />
          </button>

          {/* Optional GitHub OAuth Trigger */}
          <button
            type="button"
            onClick={handleGitHubOAuthClick}
            className="w-full flex items-center justify-center gap-2.5 py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-slate-300 font-semibold text-xs border border-slate-700/60 transition cursor-pointer"
          >
            <GitHubIcon className="w-4 h-4 text-slate-300" />
            <span>Authenticate via GitHub OAuth (@bekizod only)</span>
          </button>

          {/* Policy Explanation Banner */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 space-y-1.5 text-[11px] text-slate-400">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              Teammate Notification Policy:
            </span>
            <p className="leading-relaxed">
              Engineers and teammates added on the dashboard do not need login credentials. Whenever you assign them an issue, the agent automatically dispatches a formatted email with issue specs and links directly to their inbox.
            </p>
          </div>

          <div className="pt-1 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-indigo-400" />
              Owner-Only Dashboard
            </span>
            <button
              type="button"
              onClick={() => setShowConfigModal(true)}
              className="text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
            >
              OAuth Guide
            </button>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 text-center">
          <div className="p-2 rounded-lg bg-slate-900/40 border border-slate-800/50 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Autonomous P0 Triage</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-900/40 border border-slate-800/50 flex items-center justify-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-indigo-400" />
            <span>Real Email Dispatch</span>
          </div>
        </div>
      </div>

      {/* OAuth Setup Guide Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <GitHubIcon className="w-4 h-4 text-white" />
                <h3 className="font-bold text-white text-sm">GitHub OAuth App Registration</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-300 leading-relaxed">
              To bind your real GitHub OAuth credentials to the owner login:
            </p>

            <ol className="list-decimal list-inside space-y-2 text-slate-300">
              <li>
                Go to <a href="https://github.com/settings/developers" target="_blank" rel="noreferrer" className="text-indigo-400 underline">GitHub Developer Settings</a> → <strong>OAuth Apps</strong> → <strong>New OAuth App</strong>.
              </li>
              <li>
                Configure the OAuth application:
                <div className="mt-1.5 bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-1 font-mono text-[11px] text-slate-300">
                  <div><strong>Application name:</strong> SprintOps AI TPM</div>
                  <div><strong>Homepage URL:</strong> http://localhost:3000</div>
                  <div><strong>Authorization callback URL:</strong> http://localhost:3000/api/auth/callback/github</div>
                </div>
              </li>
              <li>
                Copy the <strong>Client ID</strong> and <strong>Client Secret</strong> into <code className="text-emerald-400 font-mono">frontend/.env.local</code>.
              </li>
            </ol>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
