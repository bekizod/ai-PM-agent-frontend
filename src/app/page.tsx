'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Lock,
  GitBranch,
  CheckCircle2,
  X,
  Check,
  Sparkles,
} from 'lucide-react';

// Shared Types
import {
  TriageResult,
  BlastRadiusAssessment,
  ReliabilityRiskMetrics,
  CodeFixAndTestScaffold,
  PrdResult,
  PostMortemReport,
  SprintReleaseNotes,
  OutageCommunications,
  TeamCapacityPlan,
  SecurityComplianceReport,
  ActivityItem,
  GitHubIssueSummary,
  AnalyticsData,
  CurrentUser,
} from '../types/dashboard';

// Vision UI Modular Components
import { Sidebar } from '../components/Sidebar';
import { VisionHeader } from '../components/VisionHeader';
import { VisionStatCards } from '../components/VisionStatCards';
import { VisionHeroBanner } from '../components/VisionHeroBanner';
import { VisionGaugeCards } from '../components/VisionGaugeCards';
import { VisionCharts } from '../components/VisionCharts';
import { VisionProjectsTable } from '../components/VisionProjectsTable';
import { VisionTimeline } from '../components/VisionTimeline';
import { IntakeConsole } from '../components/IntakeConsole';
import { BacklogPanel } from '../components/BacklogPanel';
import { ActivityStreamTab } from '../components/ActivityStreamTab';
import { DailyStandupTab } from '../components/DailyStandupTab';
import { SprintAnalyticsTab } from '../components/SprintAnalyticsTab';
import { TeamCapacityTab } from '../components/TeamCapacityTab';

// Specialist Modals
import { AddTeammateModal } from '../components/modals/AddTeammateModal';
import { CodeFixModal } from '../components/modals/CodeFixModal';
import { PostMortemModal } from '../components/modals/PostMortemModal';
import { ReleaseNotesModal } from '../components/modals/ReleaseNotesModal';
import { DagTraceModal } from '../components/modals/DagTraceModal';
import { OutageCommsModal } from '../components/modals/OutageCommsModal';
import { ComplianceModal } from '../components/modals/ComplianceModal';
import { WebhookModal } from '../components/modals/WebhookModal';
import { CopilotDrawer } from '../components/modals/CopilotDrawer';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/agent';

export default function Dashboard() {
  // Authentication & Guard State
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Vision UI Active Tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'backlog' | 'capacity' | 'analytics'>('dashboard');
  const [globalSearch, setGlobalSearch] = useState('');

  // Core Dashboard State
  const [input, setInput] = useState('');
  const [intakeMode, setIntakeMode] = useState<'triage' | 'prd'>('triage');
  const [submitting, setSubmitting] = useState(false);
  const [lastSuccessResult, setLastSuccessResult] = useState<{
    mode: 'triage' | 'prd';
    type: string;
    title: string;
    issueNumber?: number;
    issueUrl?: string;
    timestamp: number;
  } | null>(null);

  // Global Toast Indicator for Finished / Successful Operations
  const [toast, setToast] = useState<{
    id: number;
    type: 'success' | 'info' | 'error';
    message: string;
    details?: string;
  } | null>(null);

  const showToast = (message: string, details?: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now();
    setToast({ id, type, message, details });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 6000);
  };
  const [runningStandup, setRunningStandup] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activityLog, setActivityLog] = useState<ActivityItem[]>([]);
  const [openIssues, setOpenIssues] = useState<GitHubIssueSummary[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  // Filtering
  const [backlogFilter, setBacklogFilter] = useState<'all' | 'open' | 'closed' | 'P0' | 'P1'>('all');
  const [backlogSearch, setBacklogSearch] = useState('');
  const [streamTypeFilter, setStreamTypeFilter] = useState<'all' | 'triage' | 'prd' | 'webhook' | 'standup'>('all');
  const [streamSeverityFilter, setStreamSeverityFilter] = useState<'all' | 'P0' | 'P1' | 'P2'>('all');

  // Planning & State Toggles
  const [planningIssueNum, setPlanningIssueNum] = useState<number | null>(null);
  const [plannedSuccessNum, setPlannedSuccessNum] = useState<number | null>(null);
  const [togglingStateNum, setTogglingStateNum] = useState<number | null>(null);

  // Capacity Plan State
  const [capacityPlan, setCapacityPlan] = useState<TeamCapacityPlan | null>(null);
  const [loadingCapacity, setLoadingCapacity] = useState(false);
  const [rebalancing, setRebalancing] = useState(false);
  const [assigningIssueNumber, setAssigningIssueNumber] = useState<number | null>(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  // Modals State
  const [codeFixModalItem, setCodeFixModalItem] = useState<ActivityItem | null>(null);
  const [generatingCodeFix, setGeneratingCodeFix] = useState(false);
  const [activeCodeFixScaffold, setActiveCodeFixScaffold] = useState<CodeFixAndTestScaffold | null>(null);
  const [postingDiffToGithub, setPostingDiffToGithub] = useState(false);
  const [postedDiffSuccess, setPostedDiffSuccess] = useState(false);
  const [creatingAutonomousPr, setCreatingAutonomousPr] = useState(false);
  const [createdPrResult, setCreatedPrResult] = useState<any | null>(null);

  const [warRoomModalItem, setWarRoomModalItem] = useState<ActivityItem | null>(null);
  const [generatingPostMortem, setGeneratingPostMortem] = useState(false);
  const [activePostMortem, setActivePostMortem] = useState<PostMortemReport | null>(null);
  const [publishingPostMortem, setPublishingPostMortem] = useState(false);
  const [publishedPostMortemSuccess, setPublishedPostMortemSuccess] = useState(false);

  const [showReleaseNotesModal, setShowReleaseNotesModal] = useState(false);
  const [generatingReleaseNotes, setGeneratingReleaseNotes] = useState(false);
  const [activeReleaseNotes, setActiveReleaseNotes] = useState<SprintReleaseNotes | null>(null);
  const [releaseVersionInput, setReleaseVersionInput] = useState('1.4.0');
  const [publishingReleaseDraft, setPublishingReleaseDraft] = useState(false);
  const [publishedReleaseDraftResult, setPublishedReleaseDraftResult] = useState<any | null>(null);

  const [outageCommsItem, setOutageCommsItem] = useState<ActivityItem | null>(null);
  const [generatingOutageComms, setGeneratingOutageComms] = useState(false);
  const [activeOutageComms, setActiveOutageComms] = useState<OutageCommunications | null>(null);
  const [dispatchingExecEmail, setDispatchingExecEmail] = useState(false);
  const [dispatchedExecEmailSuccess, setDispatchedExecEmailSuccess] = useState(false);

  const [complianceModalItem, setComplianceModalItem] = useState<ActivityItem | null>(null);
  const [generatingCompliance, setGeneratingCompliance] = useState(false);
  const [activeComplianceReport, setActiveComplianceReport] = useState<SecurityComplianceReport | null>(null);

  const [showDagTraceModal, setShowDagTraceModal] = useState(false);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [simulatingWebhook, setSimulatingWebhook] = useState(false);

  const [showCopilotDrawer, setShowCopilotDrawer] = useState(false);
  const [copilotInput, setCopilotInput] = useState('');
  const [askingCopilot, setAskingCopilot] = useState(false);
  const [copilotChatMessages, setCopilotChatMessages] = useState<
    Array<{ role: 'user' | 'assistant'; content: string; followUps?: string[] }>
  >([
    {
      role: 'assistant',
      content: 'Welcome to Vision UI AI TPM. I am your autonomous Technical Product Manager. Ask me about current blockers, P0 blast radius, or workload balance.',
      followUps: ['Who has highest story points?', 'List unassigned P0 bugs', 'Generate sprint release draft'],
    },
  ]);

  // Check Authentication Session on Mount (Instant Cookie Hydration + API Verification)
  useEffect(() => {
    let isMounted = true;
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/(^|;)\s*tpm_auth_session=([^;]+)/);
      if (match) {
        try {
          const user = JSON.parse(decodeURIComponent(match[2]));
          if (user && user.username) {
            setCurrentUser(user);
            setAuthLoading(false);
          }
        } catch {}
      }
    }

    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
          setAuthLoading(false);
        } else {
          window.location.href = '/login';
        }
      })
      .catch(() => {
        if (isMounted) window.location.href = '/login';
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      window.location.href = '/login';
    }
  };

  // Load Initial Telemetry & Backlog Data
  const loadData = async () => {
    try {
      const [streamRes, issuesRes, analyticsRes] = await Promise.all([
        fetch(`${API_BASE}/activity`).catch(() => null),
        fetch(`${API_BASE}/issues`).catch(() => null),
        fetch(`${API_BASE}/analytics`).catch(() => null),
      ]);

      if (streamRes && streamRes.ok) {
        const streamData = await streamRes.json();
        setActivityLog(streamData);
      }
      if (issuesRes && issuesRes.ok) {
        const issuesData = await issuesRes.json();
        setOpenIssues(issuesData);
      }
      if (analyticsRes && analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData);
      }
    } catch (e) {
      console.error('Failed to load dashboard data:', e);
    }
  };

  const loadCapacity = async () => {
    setLoadingCapacity(true);
    try {
      const res = await fetch(`${API_BASE}/team/capacity`);
      if (res.ok) {
        const data = await res.json();
        setCapacityPlan(data.capacityPlan || data);
      }
    } catch (e) {
      console.error('Failed to load team capacity:', e);
    } finally {
      setLoadingCapacity(false);
    }
  };

  useEffect(() => {
    loadData();
    loadCapacity();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadData(), loadCapacity()]);
    setRefreshing(false);
  };

  // Intake Submission (Multi-Agent Bug Triage & Enterprise PRD Specification)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    setSubmitting(true);
    try {
      const endpoint = intakeMode === 'triage' ? `${API_BASE}/triage` : `${API_BASE}/prd`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: trimmedInput,
          rawLog: trimmedInput,
          featureDescription: trimmedInput,
          text: trimmedInput,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (!data.error) {
          const title =
            data.triage?.title ||
            data.prd?.title ||
            data.githubIssue?.title ||
            (intakeMode === 'triage' ? 'Incident Triaged & Dispatched' : 'Enterprise PRD Generated');
          const issueNumber = data.githubIssue?.issueNumber || data.githubIssue?.number;
          const issueUrl = data.githubIssue?.issueUrl || data.githubIssue?.html_url;

          setLastSuccessResult({
            mode: intakeMode,
            type: data.type || (intakeMode === 'triage' ? 'REACTIVE_TRIAGE' : 'FEATURE_PRD'),
            title,
            issueNumber,
            issueUrl,
            timestamp: Date.now(),
          });

          showToast(
            intakeMode === 'triage' ? 'Incident Triaged & Dispatched' : 'Enterprise PRD Generated',
            `${title}${issueNumber ? ` (GitHub #${issueNumber})` : ''}`,
          );

          setInput('');
          await Promise.all([loadData(), loadCapacity()]);
        } else {
          console.error('Intake submission error:', data.error);
        }
      }
    } catch (err) {
      console.error('Intake failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Standup Generation
  const handleStandup = async () => {
    setRunningStandup(true);
    try {
      const res = await fetch(`${API_BASE}/standup`, { method: 'POST' });
      if (res.ok) {
        showToast('Daily Standup Generated', 'Autonomous TPM summarized sprint velocity, blockers, and PR reviews.');
        await loadData();
      }
    } catch (e) {
      console.error('Standup failed:', e);
    } finally {
      setRunningStandup(false);
    }
  };

  // Generate Implementation Plan
  const handleGeneratePlan = async (item: ActivityItem) => {
    if (!item.githubIssue?.issueNumber) return;
    const num = item.githubIssue.issueNumber;
    setPlanningIssueNum(num);

    try {
      const res = await fetch(`${API_BASE}/issues/${num}/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        setPlannedSuccessNum(num);
        await loadData();
      }
    } catch (e) {
      console.error('Failed to generate plan:', e);
    } finally {
      setPlanningIssueNum(null);
    }
  };

  // Code Fix Modal
  const handleOpenCodeFixModal = async (item: ActivityItem) => {
    setCodeFixModalItem(item);
    setCreatedPrResult(item.pullRequest || null);
    setPostedDiffSuccess(false);

    if (item.codeScaffold) {
      setActiveCodeFixScaffold(item.codeScaffold);
      return;
    }

    setGeneratingCodeFix(true);
    try {
      const res = await fetch(`${API_BASE}/fix-scaffold`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: item.triage?.title || 'Bug Fix Scaffold',
          summary: item.triage?.summary || '',
          issueNumber: item.githubIssue?.issueNumber,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setActiveCodeFixScaffold(data);
      }
    } catch (e) {
      console.error('Failed to fetch code scaffold:', e);
    } finally {
      setGeneratingCodeFix(false);
    }
  };

  const handlePostDiffToGitHub = async () => {
    if (!codeFixModalItem?.githubIssue?.issueNumber || !activeCodeFixScaffold) return;
    setPostingDiffToGithub(true);
    try {
      const res = await fetch(`${API_BASE}/issues/${codeFixModalItem.githubIssue.issueNumber}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          body:
            '### 🤖 Autonomous Fix Scaffold & Test\n\n```diff\n' +
            activeCodeFixScaffold.proposedFixDiff +
            '\n```\n\n```typescript\n' +
            activeCodeFixScaffold.reproductionTestCode +
            '\n```',
        }),
      });
      if (res.ok) setPostedDiffSuccess(true);
    } catch (e) {
      console.error('Failed to post diff:', e);
    } finally {
      setPostingDiffToGithub(false);
    }
  };

  const handleCreateAutonomousPr = async () => {
    if (!codeFixModalItem?.githubIssue?.issueNumber || !activeCodeFixScaffold) return;
    setCreatingAutonomousPr(true);
    try {
      const res = await fetch(`${API_BASE}/create-pr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issueNumber: codeFixModalItem.githubIssue.issueNumber,
          title: codeFixModalItem.triage?.title || 'Autonomous Bug Fix',
          branchName: `fix/issue-${codeFixModalItem.githubIssue.issueNumber}`,
          diff: activeCodeFixScaffold.proposedFixDiff,
          testCode: activeCodeFixScaffold.reproductionTestCode,
          commitMessage: activeCodeFixScaffold.commitMessage,
        }),
      });
      if (res.ok) {
        const pr = await res.json();
        setCreatedPrResult(pr);
        await loadData();
      }
    } catch (e) {
      console.error('Failed to create PR:', e);
    } finally {
      setCreatingAutonomousPr(false);
    }
  };

  // Toggle Issue State
  const handleToggleIssueState = async (item: ActivityItem) => {
    if (!item.githubIssue?.issueNumber) return;
    const num = item.githubIssue.issueNumber;
    setTogglingStateNum(num);
    const targetState = item.state === 'closed' ? 'open' : 'closed';

    try {
      const res = await fetch(`${API_BASE}/issues/${num}/state`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: targetState }),
      });
      if (res.ok) await loadData();
    } catch (e) {
      console.error('Failed to toggle issue state:', e);
    } finally {
      setTogglingStateNum(null);
    }
  };

  // War Room / Post-Mortem
  const handleOpenWarRoomModal = async (item: ActivityItem) => {
    setWarRoomModalItem(item);
    setPublishedPostMortemSuccess(false);

    if (item.postMortem) {
      setActivePostMortem(item.postMortem);
      return;
    }

    setGeneratingPostMortem(true);
    try {
      const res = await fetch(`${API_BASE}/post-mortem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incidentTitle: item.triage?.title || 'Critical Outage',
          severity: item.triage?.severity || 'P0',
          issueNumber: item.githubIssue?.issueNumber,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setActivePostMortem(data.postMortem || data);
      }
    } catch (e) {
      console.error('Failed to fetch post-mortem:', e);
    } finally {
      setGeneratingPostMortem(false);
    }
  };

  const handlePublishPostMortemToGitHub = async () => {
    if (!warRoomModalItem?.githubIssue?.issueNumber || !activePostMortem) return;
    setPublishingPostMortem(true);
    try {
      const res = await fetch(`${API_BASE}/issues/${warRoomModalItem.githubIssue.issueNumber}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: activePostMortem.markdownReport }),
      });
      if (res.ok) setPublishedPostMortemSuccess(true);
    } catch (e) {
      console.error('Failed to publish post-mortem:', e);
    } finally {
      setPublishingPostMortem(false);
    }
  };

  // Release Notes
  const handleOpenReleaseNotesModal = async () => {
    setShowReleaseNotesModal(true);
    setPublishedReleaseDraftResult(null);
    if (!activeReleaseNotes) {
      await fetchSprintReleaseNotes(releaseVersionInput);
    }
  };

  const fetchSprintReleaseNotes = async (ver: string) => {
    setGeneratingReleaseNotes(true);
    try {
      const res = await fetch(`${API_BASE}/release-notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ version: ver, versionTag: ver }),
      });
      if (res.ok) {
        const data = await res.json();
        const notes = data.releaseNotes || data;
        setActiveReleaseNotes(notes);
      }
    } catch (e) {
      console.error('Failed to fetch release notes:', e);
    } finally {
      setGeneratingReleaseNotes(false);
    }
  };

  const handlePublishReleaseDraft = async () => {
    if (!activeReleaseNotes) return;
    setPublishingReleaseDraft(true);
    try {
      const res = await fetch(`${API_BASE}/release-notes/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          version: activeReleaseNotes.version,
          versionTag: activeReleaseNotes.version,
          title: activeReleaseNotes.releaseTitle,
          notesMarkdown: activeReleaseNotes.markdownChangelog,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setPublishedReleaseDraftResult(data.gitHubRelease || data);
      }
    } catch (e) {
      console.error('Failed to publish release draft:', e);
    } finally {
      setPublishingReleaseDraft(false);
    }
  };

  // Add Real Teammate
  const handleAddRealMember = async (memberData: {
    username: string;
    name: string;
    email: string;
    role: string;
    maxCapacityPoints: number;
    primaryComponent: string;
  }) => {
    const res = await fetch(`${API_BASE}/team/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...memberData,
        avatar: `https://avatars.githubusercontent.com/${encodeURIComponent(memberData.username)}`,
      }),
    });
    if (res.ok) await loadCapacity();
  };

  const handleDeleteMember = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/team/members/${id}`, { method: 'DELETE' });
      if (res.ok) await loadCapacity();
    } catch (e) {
      console.error('Failed to delete member:', e);
    }
  };

  const handleAssignIssue = async (issueNumber: number, memberId: string) => {
    setAssigningIssueNumber(issueNumber);
    try {
      const res = await fetch(`${API_BASE}/team/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issueNumber, memberId }),
      });
      if (res.ok) await loadCapacity();
    } catch (e) {
      console.error('Failed to assign issue:', e);
    } finally {
      setAssigningIssueNumber(null);
    }
  };

  const handleAutoRebalance = async () => {
    setRebalancing(true);
    try {
      const res = await fetch(`${API_BASE}/team/rebalance`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        const plan = data.updatedCapacity?.capacityPlan || data.capacityPlan || data;
        setCapacityPlan(plan);
        showToast('Team Capacity Rebalanced', 'Engineering workload redistributed across active collaborators.');
      }
    } catch (e) {
      console.error('Failed to auto-rebalance:', e);
    } finally {
      setRebalancing(false);
    }
  };

  // Outage Communications
  const handleOpenOutageComms = async (item: ActivityItem) => {
    setOutageCommsItem(item);
    setDispatchedExecEmailSuccess(false);

    setGeneratingOutageComms(true);
    try {
      const res = await fetch(`${API_BASE}/outage-comms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incidentTitle: item.triage?.title || 'Critical Service Outage',
          severity: item.triage?.severity || 'P0',
          issueNumber: item.githubIssue?.issueNumber,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setActiveOutageComms(data.communications || data);
      }
    } catch (e) {
      console.error('Failed to fetch outage comms:', e);
    } finally {
      setGeneratingOutageComms(false);
    }
  };

  const handleDispatchExecEmail = async () => {
    if (!outageCommsItem || !activeOutageComms) return;
    setDispatchingExecEmail(true);
    try {
      const res = await fetch(`${API_BASE}/outage-comms/dispatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: 'bekizodcancer@gmail.com',
          subject: `[EXEC INCIDENT ESCALATION] ${outageCommsItem.triage?.title || 'P0 Outage'}`,
          body: activeOutageComms.executiveBriefing,
        }),
      });
      if (res.ok) setDispatchedExecEmailSuccess(true);
    } catch (e) {
      console.error('Failed to dispatch exec email:', e);
    } finally {
      setDispatchingExecEmail(false);
    }
  };

  // Compliance Modal
  const handleOpenComplianceModal = async (item: ActivityItem) => {
    setComplianceModalItem(item);
    setActiveComplianceReport(null);
    setGeneratingCompliance(true);
    try {
      const res = await fetch(`${API_BASE}/compliance-audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: item.triage?.title || item.prd?.title || 'Telemetry Inspection',
          rawSummary: item.triage?.summary || item.prd?.problemStatement || '',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setActiveComplianceReport(data.report || data);
      }
    } catch (e) {
      console.error('Failed to fetch compliance audit:', e);
    } finally {
      setGeneratingCompliance(false);
    }
  };

  // Copilot Assistant
  const handleSendCopilotMessage = async (overridePrompt?: string) => {
    const promptToSend = overridePrompt || copilotInput;
    if (!promptToSend.trim()) return;

    setCopilotChatMessages((prev) => [...prev, { role: 'user', content: promptToSend }]);
    if (!overridePrompt) setCopilotInput('');
    setAskingCopilot(true);

    try {
      const res = await fetch(`${API_BASE}/copilot/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptToSend }),
      });
      if (res.ok) {
        const data = await res.json();
        const replyContent = data.reply || data.answer || data.message || data.response || (typeof data === 'string' ? data : 'No response from assistant.');
        const followUps = data.suggestedFollowUps || data.followUps || [];
        setCopilotChatMessages((prev) => [
          ...prev,
          { role: 'assistant', content: replyContent, followUps },
        ]);
      }
    } catch (e) {
      console.error('Failed to query copilot:', e);
    } finally {
      setAskingCopilot(false);
    }
  };

  // Webhook Simulation (Autonomous Datadog, PagerDuty, and Sentry Ingestion)
  const handleSimulateWebhook = async (preset?: string) => {
    setSimulatingWebhook(true);
    try {
      const res = await fetch(`${API_BASE}/webhook/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preset: preset || 'datadog_db_exhaustion' }),
      });
      if (res.ok) {
        const data = await res.json();
        setShowWebhookModal(false);
        await Promise.all([loadData(), loadCapacity()]);
        const title =
          data.triage?.title ||
          (preset === 'datadog_db_exhaustion'
            ? '[P0] Datadog: PostgreSQL Database Connection Pool Spike'
            : preset === 'sentry_runtime_oom'
            ? '[P0] Sentry Alert: Worker Process Heap OOM Crash'
            : '[P1] PagerDuty: Auth Gateway 504 Timeout');
        const num = data.githubIssue?.issueNumber;
        showToast(
          'Autonomous Webhook Ingested & Triaged',
          `${title}${num ? ` (Created GitHub #${num})` : ''}`,
          'success'
        );
      }
    } catch (e) {
      console.error('Webhook simulation failed:', e);
      showToast('Webhook Ingestion Failed', 'Failed to dispatch simulated webhook incident.', 'error');
    } finally {
      setSimulatingWebhook(false);
    }
  };

  // Filter Backlog Issues
  const filteredIssues = useMemo(() => {
    return openIssues.filter((issue) => {
      if (backlogFilter === 'open' && issue.state === 'closed') return false;
      if (backlogFilter === 'closed' && issue.state !== 'closed') return false;
      if (backlogFilter === 'P0' && !issue.labels.some((l) => l.toLowerCase().includes('p0'))) return false;
      if (backlogFilter === 'P1' && !issue.labels.some((l) => l.toLowerCase().includes('p1'))) return false;

      const q = (globalSearch || backlogSearch).toLowerCase();
      if (q) {
        return (
          issue.title.toLowerCase().includes(q) ||
          issue.number.toString().includes(q) ||
          (issue.labels || []).some((l) => l.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [openIssues, backlogFilter, backlogSearch, globalSearch]);

  const latestStandup = activityLog.find((item) => item.type === 'PROACTIVE_DIGEST');

  // Guard Dashboard: Unauthenticated users CANNOT see dashboard UI
  if (authLoading || !currentUser) {
    return (
      <div className="min-h-screen bg-[#060B26] text-white flex flex-col items-center justify-center p-6 relative select-none font-sans">
        <div className="w-14 h-14 rounded-2xl bg-[#0075FF]/20 border border-[#0075FF]/40 flex items-center justify-center shadow-2xl shadow-[#0075FF]/40 mb-4 animate-pulse">
          <Lock className="w-6 h-6 text-[#00E5FF]" />
        </div>
        <h2 className="text-base font-bold text-white tracking-wide">
          Verifying Vision UI Authorization...
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Securing maintainer console for <span className="text-[#00E5FF] font-mono">@bekizod</span>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060B26] text-white flex antialiased font-sans selection:bg-[#0075FF] selection:text-white relative">
      {/* Floating Finished/Success Operation Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-start gap-3 p-4 rounded-xl bg-[#090d16]/95 border border-emerald-500/50 shadow-2xl shadow-emerald-950/40 text-xs backdrop-blur-md animate-fade-in max-w-md">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-xs">{toast.message}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                FINISHED
              </span>
            </div>
            {toast.details && (
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed truncate font-mono">
                {toast.details}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      {/* 1. Left Vision UI Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenCopilot={() => setShowCopilotDrawer(true)}
        onOpenDagTrace={() => setShowDagTraceModal(true)}
        onOpenReleaseNotes={handleOpenReleaseNotesModal}
        onOpenWebhook={() => setShowWebhookModal(true)}
      />

      {/* 2. Main Vision UI Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Top Header */}
        <VisionHeader
          pageTitle={
            activeTab === 'dashboard'
              ? 'Dashboard'
              : activeTab === 'backlog'
              ? 'Backlog & PRD Tables'
              : activeTab === 'capacity'
              ? 'Team Capacity Balancer'
              : 'Sprint Velocity Analytics'
          }
          repoContext="bekizod/ai_target_repo_name"
          currentUser={currentUser}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          onRunStandup={handleStandup}
          runningStandup={runningStandup}
          searchQuery={globalSearch}
          setSearchQuery={setGlobalSearch}
          onLogout={handleLogout}
        />

        {/* TAB 1: Main Vision UI Dashboard Cockpit */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Row 1: Top 4 Vision Stat Cards */}
            <VisionStatCards analytics={analytics} issuesCount={openIssues.length} />

            {/* Row 2: Hero Welcome Banner + Gauge Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-6 flex">
                <VisionHeroBanner
                  currentUser={currentUser}
                  onOpenCopilot={() => setShowCopilotDrawer(true)}
                  repoContext="bekizod/ai_target_repo_name"
                />
              </div>

              <div className="lg:col-span-6">
                <VisionGaugeCards analytics={analytics} />
              </div>
            </div>

            {/* Row 3: Autonomous Intake & Triage Console */}
            <IntakeConsole
              input={input}
              setInput={setInput}
              intakeMode={intakeMode}
              setIntakeMode={setIntakeMode}
              submitting={submitting}
              onSubmit={handleSubmit}
              lastSuccess={lastSuccessResult}
              onClearSuccess={() => setLastSuccessResult(null)}
            />

            {/* Row 4: Vision UI Velocity Area Chart & Incident Bar Chart */}
            <VisionCharts analytics={analytics} />

            {/* Row 5: Projects Table & Timeline Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <VisionProjectsTable
                  issues={filteredIssues}
                  capacityPlan={capacityPlan}
                  repoContext="bekizod/ai_target_repo_name"
                  onSelectIssue={(issue) => {
                    setInput(`[ISSUE #${issue.number}] ${issue.title}`);
                    setIntakeMode('triage');
                  }}
                />
              </div>

              <div className="lg:col-span-4">
                <VisionTimeline
                  items={activityLog}
                  onOpenCodeFix={handleOpenCodeFixModal}
                  onOpenOutageComms={handleOpenOutageComms}
                  onOpenWarRoom={handleOpenWarRoomModal}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Backlog & PRD Tables View (Matching Image 2) */}
        {activeTab === 'backlog' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5">
              <BacklogPanel
                issues={filteredIssues}
                loading={false}
                filter={backlogFilter}
                setFilter={setBacklogFilter}
                search={backlogSearch}
                setSearch={setBacklogSearch}
                repoContext="bekizod/ai_target_repo_name"
                onSelectIssue={(issue) => {
                  setInput(`[ISSUE #${issue.number}] ${issue.title}`);
                  setIntakeMode('triage');
                }}
              />
            </div>
            <div className="lg:col-span-7">
              <ActivityStreamTab
                items={activityLog}
                typeFilter={streamTypeFilter}
                setTypeFilter={setStreamTypeFilter}
                severityFilter={streamSeverityFilter}
                setSeverityFilter={setStreamSeverityFilter}
                search={globalSearch}
                setSearch={setGlobalSearch}
                onGeneratePlan={handleGeneratePlan}
                planningIssueNum={planningIssueNum}
                plannedSuccessNum={plannedSuccessNum}
                onOpenCodeFix={handleOpenCodeFixModal}
                onOpenOutageComms={handleOpenOutageComms}
                onOpenWarRoom={handleOpenWarRoomModal}
                onOpenCompliance={handleOpenComplianceModal}
                onToggleIssueState={handleToggleIssueState}
                togglingStateNum={togglingStateNum}
                repoContext="bekizod/ai_target_repo_name"
              />
            </div>
          </div>
        )}

        {/* TAB 3: Team Capacity View (Matching Image 2 Authors Table) */}
        {activeTab === 'capacity' && (
          <TeamCapacityTab
            capacityPlan={capacityPlan}
            loading={loadingCapacity}
            assigningIssueNumber={assigningIssueNumber}
            onOpenAddMember={() => setShowAddMemberModal(true)}
            onDeleteMember={handleDeleteMember}
            onAssignIssue={handleAssignIssue}
            onAutoRebalance={handleAutoRebalance}
            rebalancing={rebalancing}
          />
        )}

        {/* TAB 4: Sprint Analytics View */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <SprintAnalyticsTab analytics={analytics} />
            {latestStandup?.digest && (
              <DailyStandupTab
                digest={latestStandup.digest}
                timestamp={latestStandup.timestamp}
              />
            )}
          </div>
        )}
      </div>

      {/* 3. Modals */}
      <AddTeammateModal
        isOpen={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        onAddMember={handleAddRealMember}
        repoContext="bekizod/ai_target_repo_name"
      />

      <CodeFixModal
        isOpen={!!codeFixModalItem}
        onClose={() => setCodeFixModalItem(null)}
        item={codeFixModalItem}
        codeFix={activeCodeFixScaffold}
        generating={generatingCodeFix}
        onPostDiff={handlePostDiffToGitHub}
        postingDiff={postingDiffToGithub}
        postedSuccess={postedDiffSuccess}
        onCreatePr={handleCreateAutonomousPr}
        creatingPr={creatingAutonomousPr}
        prResult={createdPrResult}
      />

      <PostMortemModal
        isOpen={!!warRoomModalItem}
        onClose={() => setWarRoomModalItem(null)}
        item={warRoomModalItem}
        report={activePostMortem}
        generating={generatingPostMortem}
        onPublish={handlePublishPostMortemToGitHub}
        publishing={publishingPostMortem}
        publishedSuccess={publishedPostMortemSuccess}
      />

      <ReleaseNotesModal
        isOpen={showReleaseNotesModal}
        onClose={() => setShowReleaseNotesModal(false)}
        report={activeReleaseNotes}
        generating={generatingReleaseNotes}
        version={releaseVersionInput}
        setVersion={setReleaseVersionInput}
        onFetchVersion={fetchSprintReleaseNotes}
        onPublishDraft={handlePublishReleaseDraft}
        publishing={publishingReleaseDraft}
        publishedResult={publishedReleaseDraftResult}
      />

      <DagTraceModal
        isOpen={showDagTraceModal}
        onClose={() => setShowDagTraceModal(false)}
      />

      <OutageCommsModal
        isOpen={!!outageCommsItem}
        onClose={() => setOutageCommsItem(null)}
        item={outageCommsItem}
        comms={activeOutageComms}
        generating={generatingOutageComms}
        onDispatchExecEmail={handleDispatchExecEmail}
        dispatchingEmail={dispatchingExecEmail}
        emailSuccess={dispatchedExecEmailSuccess}
      />

      <ComplianceModal
        isOpen={!!complianceModalItem}
        onClose={() => setComplianceModalItem(null)}
        report={activeComplianceReport}
        generating={generatingCompliance}
      />

      <WebhookModal
        isOpen={showWebhookModal}
        onClose={() => setShowWebhookModal(false)}
        onSimulate={handleSimulateWebhook}
        simulating={simulatingWebhook}
      />

      <CopilotDrawer
        isOpen={showCopilotDrawer}
        onClose={() => setShowCopilotDrawer(false)}
        messages={copilotChatMessages}
        input={copilotInput}
        setInput={setCopilotInput}
        onSend={handleSendCopilotMessage}
        loading={askingCopilot}
      />
    </div>
  );
}
