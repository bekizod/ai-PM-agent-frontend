'use client';

import React, { useState } from 'react';
import { X, UserPlus, Mail, ShieldCheck, GitBranch } from 'lucide-react';

interface AddTeammateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (data: {
    username: string;
    name: string;
    email: string;
    role: string;
    maxCapacityPoints: number;
    primaryComponent: string;
  }) => Promise<void>;
  repoContext: string;
}

export const AddTeammateModal: React.FC<AddTeammateModalProps> = ({
  isOpen,
  onClose,
  onAddMember,
  repoContext,
}) => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Fullstack Engineer');
  const [capacity, setCapacity] = useState(15);
  const [component, setComponent] = useState('Core Services');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim()) return;

    setSubmitting(true);
    try {
      await onAddMember({
        username: username.trim(),
        name: name.trim() || username.trim(),
        email: email.trim(),
        role,
        maxCapacityPoints: capacity,
        primaryComponent: component,
      });
      onClose();
    } catch (err) {
      console.error('Failed to add teammate:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-2xl relative animate-fade-in text-xs space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white">Add Repository Collaborator</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info Box */}
        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 space-y-1 text-[11px]">
          <div className="font-semibold text-white flex items-center gap-1.5">
            <GitBranch className="w-3 h-3 text-indigo-400" />
            <span>Target: {repoContext}</span>
          </div>
          <p className="text-slate-400">
            Invites the engineer via GitHub REST API and registers their email for automated task assignment dispatches.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[11px] font-medium text-slate-400 block mb-1">
              GitHub Username *
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. bereketwolde017"
              className="w-full bg-[#090d16] border border-slate-800 focus:border-indigo-500 rounded-lg p-2 text-xs text-white placeholder-slate-500 outline-none font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-400 block mb-1">
              Engineer Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Bereket Wolde"
              className="w-full bg-[#090d16] border border-slate-800 focus:border-indigo-500 rounded-lg p-2 text-xs text-white placeholder-slate-500 outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-400 block mb-1">
              Notification Email (For Sprint Ticket Delivery) *
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="bereketwolde017@gmail.com"
                className="w-full bg-[#090d16] border border-slate-800 focus:border-indigo-500 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-slate-400 block mb-1">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-[#090d16] border border-slate-800 focus:border-indigo-500 rounded-lg p-2 text-xs text-white outline-none"
              >
                <option value="Fullstack Engineer">Fullstack Engineer</option>
                <option value="Backend Specialist">Backend Specialist</option>
                <option value="Frontend Specialist">Frontend Specialist</option>
                <option value="SRE / DevOps">SRE / DevOps</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-400 block mb-1">
                Sprint Capacity (Story Pts)
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={capacity}
                onChange={(e) => setCapacity(parseInt(e.target.value) || 15)}
                className="w-full bg-[#090d16] border border-slate-800 focus:border-indigo-500 rounded-lg p-2 text-xs text-white outline-none font-mono"
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{submitting ? 'Inviting Collaborator...' : 'Send GitHub Invite'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
