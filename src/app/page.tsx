'use client';

const GitHubIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);


import React, { useState, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  ExternalLink,
  RefreshCw,
  Send,
  Calendar,
  AlertCircle,
  GitPullRequest,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Clock,
  Search,
  Mail,
  FileText,
  Copy,
  Sparkles,
  Filter,
  X,
  Radio,
  Wrench,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Terminal,
  BarChart3,
  Code2,
  ShieldAlert,
  TrendingDown,
  Layers,
  GitBranch,
  FileCode,
  AlertTriangle,
  ArrowRight,
  Zap,
  Target,
  Flame,
  GitMerge,
  BookOpen,
  Users,
  ShieldCheck,
  Lock,
  MessageCircle,
  LogOut,
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/agent';

interface TriageResult {
  title: string;
  summary: string;
  reproductionSteps: string[];
  acceptanceCriteria: string[];
  severity: 'P0' | 'P1' | 'P2' | 'P3';
  labels: string[];
  requiresUrgentMeeting: boolean;
  suggestedMeetingTopic?: string;
}

interface BlastRadiusAssessment {
  affectedServices: string[];
  blastRadiusScore: 'Low' | 'Medium' | 'High' | 'Critical';
  customerExposurePercentage: number;
  dataIntegrityRisk: boolean;
  architecturalComponents: string[];
}

interface ReliabilityRiskMetrics {
  deploymentRiskScore: number;
  slaBreachProbability: 'Low (<10%)' | 'Moderate (10-40%)' | 'High (40-75%)' | 'Critical (>75%)';
  estimatedMttrHours: number;
  canaryRolloutRecommended: boolean;
  mitigationRunbook: string[];
}

interface DeduplicationMatch {
  isDuplicate: boolean;
  similarityScore: number;
  matchedIssueNumber?: number;
  matchedIssueTitle?: string;
  rationale?: string;
}

interface CodeFixAndTestScaffold {
  reproductionTestCode: string;
  testFramework: 'Jest' | 'Mocha' | 'PyTest' | 'GoTest';
  proposedFixDiff: string;
  filesToModify: string[];
  technicalTradeoffs: string;
  commitMessage: string;
}

interface UserStory {
  asA: string;
  iWant: string;
  soThat: string;
  acceptanceCriteria: string[];
}

interface PrdResult {
  title: string;
  targetAudience: string;
  problemStatement: string;
  userStories: UserStory[];
  technicalArchitecture: string;
  nonFunctionalRequirements: string[];
  successMetrics: string[];
  estimatedEffort: 'Small (1-2 days)' | 'Medium (1 week)' | 'Large (2-3 weeks)' | 'X-Large (> 1 month)';
  recommendedLabels: string[];
  markdownPrd: string;
}

export interface IncidentTimelineEvent {
  time: string;
  phase: 'Detection' | 'Escalation' | 'Mitigation' | 'Resolution';
  description: string;
  actor: string;
}

export interface PostMortemReport {
  title: string;
  incidentSeverity: 'P0 - Critical Outage' | 'P1 - Major Impairment';
  status: 'Published' | 'Action Items In-Flight';
  executiveSummary: string;
  impact: {
    downtimeMinutes: number;
    affectedCustomers: string;
    financialExposure: string;
    dataLoss: string;
  };
  timeline: IncidentTimelineEvent[];
  fiveWhys: Array<{ level: number; why: string; finding: string }>;
  rootCause: string;
  triggerEvent: string;
  mitigationSteps: string[];
  actionItems: Array<{
    id: string;
    action: string;
    owner: string;
    priority: 'P0' | 'P1' | 'P2';
    dueDate: string;
  }>;
  markdownReport: string;
}

export interface SprintReleaseNotes {
  version: string;
  releaseDate: string;
  releaseTitle: string;
  executiveSummary: string;
  highlights: string[];
  categories: {
    features: Array<{ title: string; issueNumber?: number; summary: string }>;
    fixes: Array<{ title: string; issueNumber?: number; severity: string; summary: string }>;
    reliability: Array<{ title: string; summary: string }>;
    security: Array<{ title: string; summary: string }>;
  };
  markdownChangelog: string;
}


export interface OutageCommunications {
  executiveBriefing: string;
  customerEmail: {
    subject: string;
    body: string;
  };
  statusPageNotice: {
    title: string;
    status: 'Investigating' | 'Identified' | 'Monitoring' | 'Resolved';
    body: string;
  };
}

export interface TeamMemberCapacity {
  name: string;
  role: string;
  avatar: string;
  assignedIssuesCount: number;
  storyPoints: number;
  maxCapacityPoints: number;
  capacityPercentage: number;
  isOverloaded: boolean;
  primaryComponent: string;
}

export interface TeamCapacityPlan {
  totalSprintPoints: number;
  teamUtilizationPercentage: number;
  members: TeamMemberCapacity[];
  rebalanceRecommendations: string[];
}

export interface ComplianceAuditFinding {
  id: string;
  standard: 'SOC2' | 'GDPR' | 'OWASP' | 'Data Privacy';
  severity: 'Critical' | 'Warning' | 'Passed';
  description: string;
  remediation: string;
}

export interface SecurityComplianceReport {
  overallStatus: 'SOC2 Compliant' | 'Warning: Action Required' | 'High Risk';
  score: number;
  findings: ComplianceAuditFinding[];
  summary: string;
}

interface ActivityItem {
  id: number;
  timestamp: string;
  type?: 'REACTIVE_TRIAGE' | 'PROACTIVE_DIGEST' | 'FEATURE_PRD' | 'WEBHOOK_INCIDENT' | string;
  webhookSource?: string;
  state?: 'open' | 'closed';
  triage?: TriageResult;
  prd?: PrdResult;
  blastRadius?: BlastRadiusAssessment;
  reliabilityRisk?: ReliabilityRiskMetrics;
  deduplication?: DeduplicationMatch;
  codeScaffold?: CodeFixAndTestScaffold;
  pullRequest?: {
    prNumber: number;
    prUrl: string;
    branchName: string;
    state: string;
    issueNumber: number;
  };
  postMortem?: PostMortemReport;
  githubIssue?: {
    issueNumber: number;
    issueUrl: string;
    live?: boolean;
  };
  calendarEvent?: {
    scheduled: boolean;
    eventLink: string;
    startTime: string;
  };
  emailStatus?: {
    sent: boolean;
    recipient?: string;
    subject?: string;
  };
  digest?: string;
}

interface GitHubIssueSummary {
  number: number;
  title: string;
  labels: string[];
  url: string;
  state?: string;
}

interface AnalyticsData {
  kpis: {
    mttdMinutes: number;
    mttrHours: number;
    slaComplianceRate: number;
    criticalDefectRatio: number;
    totalTracked: number;
    p0Count: number;
    p1Count: number;
    prdCount: number;
    resolvedCount: number;
  };
  components: Array<{
    name: string;
    activeIssues: number;
    riskScore: number;
    riskLevel: string;
    mttr: string;
  }>;
  burndown: Array<{
    day: string;
    ideal: number;
    actual: number;
  }>;
}

function cleanMarkdown(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/\*\*\s*([^\*\n]+?)\s*\*\*/g, '**$1**')
    .replace(/(^|\s)\*\*(\s|$)/g, '$1$2')
    .replace(/\n{3,}/g, '\n\n');
}

function StandupMarkdown({ text }: { text: string }) {
  const cleaned = cleanMarkdown(text);

  return (
    <div className="prose prose-slate max-w-none text-xs text-slate-800 leading-relaxed font-sans">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <div className="text-sm font-bold text-slate-900 pb-1 mb-2 border-b border-slate-200 mt-1">
              {children}
            </div>
          ),
          h2: ({ children }) => (
            <div className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-2 border-b border-slate-200 mt-3 flex items-center gap-1.5">
              {children}
            </div>
          ),
          h3: ({ children }) => (
            <div className="text-xs font-bold text-slate-800 mt-2.5 mb-1 text-indigo-900">
              {children}
            </div>
          ),
          ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 mb-2 text-slate-700">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-4 space-y-1 mb-2 text-slate-700">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          p: ({ children }) => <p className="mb-2 leading-relaxed text-slate-700">{children}</p>,
          strong: ({ children }) => <span className="font-bold text-slate-900">{children}</span>,
          hr: () => <hr className="my-2.5 border-slate-200" />,
        }}
      >
        {cleaned}
      </ReactMarkdown>
    </div>
  );
}


const triageBoilerplates = [
  {
    label: '🚨 P0 Stripe Webhook 504 Timeout',
    description: 'Critical Outage • Multi-tenant billing downgraded to Free tier',
    text: 'Production Outage: Stripe payment renewal webhook returning 504 Gateway Timeout for enterprise customer accounts with >500 transactions. Customers are getting downgraded to Free tier erroneously, losing access to SSO and audit logs. Error logs: "TransactionTimeoutError: Knex: Timeout acquiring a connection from pool after 10000ms in BillingTenantWorker".',
  },
  {
    label: '🔥 P0 Redis Cluster Split-Brain',
    description: 'Fatal Cache Down • User auth session loops & 500s',
    text: 'Critical Incident: Redis cluster experiencing split-brain across us-east-1 and us-west-2 availability zones. Tenant cache reads failing with "CLUSTERDOWN The cluster is down". All active user sessions are encountering authentication loops and HTTP 500 on /api/v1/user/me.',
  },
  {
    label: '⚠️ P1 PostgreSQL Pool Exhaustion',
    description: 'Database connection pool leak under heavy batch tax jobs',
    text: 'Database connection pool exhaustion detected on production read-replicas. Telemetry shows active connections pegged at 100% capacity (pool_size=50) whenever background quarterly CSV tax reports run. Query latency spiked from 12ms to 4,800ms.',
  },
  {
    label: '⚡ P2 GraphQL N+1 Latency Spike',
    description: 'High latency on Org Members dashboard listing endpoint',
    text: 'Performance degradation on Organization Members dashboard. GraphQL query for listOrgMembers triggers N+1 database lookups for user permissions and role scopes, causing 3,200ms TTFB for teams with over 200 members.',
  },
];

const prdBoilerplates = [
  {
    label: '🔐 Enterprise SAML 2.0 & Okta SSO',
    description: 'Identity & Access Management • SCIM Provisioning & Audit',
    text: 'Build an Enterprise Single Sign-On (SSO) integration supporting SAML 2.0, Okta, Azure AD, and Google Workspace with automated SCIM 2.0 user provisioning and deprovisioning, role-based session enforcement, and SOC2 audit logging.',
  },
  {
    label: '📡 Webhook Delivery & Replay Engine',
    description: 'Reliable developer webhooks • HMAC signatures & 72h jitter replay',
    text: 'Design an Automated Webhook Delivery and Replay Engine for third-party developer integrations. Must support HMAC-SHA256 signature verification, exponential backoff retries with jitter up to 72 hours, and a self-service developer replay dashboard.',
  },
  {
    label: '🛡️ Distributed Token-Bucket Rate Limiter',
    description: 'High throughput traffic management • Multi-tier sliding window',
    text: 'Implement a multi-region distributed API rate limiter using Redis token bucket algorithm with sliding-window tiers for Free, Pro, and Enterprise tiers. Must handle 50,000 req/sec with sub-5ms overhead and graceful fallback under Redis degradation.',
  },
  {
    label: '📜 Immutable SOC2 Compliance Audit Vault',
    description: 'Tamper-proof compliance logging • SHA-256 evidence chain',
    text: 'Create an immutable audit log storage service for enterprise compliance (SOC2 Type II, HIPAA). All administrative mutations, permission changes, and data exports must be cryptographically hashed (SHA-256) and archived to write-once WORM cloud storage.',
  },
];

export default function Dashboard() {
  const [input, setInput] = useState('');
  const [intakeMode, setIntakeMode] = useState<'triage' | 'prd'>('triage');
  const [submitting, setSubmitting] = useState(false);
  const [runningStandup, setRunningStandup] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activityLog, setActivityLog] = useState<ActivityItem[]>([]);
  const [openIssues, setOpenIssues] = useState<GitHubIssueSummary[]>([]);
  const [activeTab, setActiveTab] = useState<'stream' | 'standup' | 'analytics' | 'capacity'>('stream');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [backlogSearch, setBacklogSearch] = useState('');
  const [backlogFilter, setBacklogFilter] = useState<'all' | 'bug' | 'prd'>('all');
  const [copiedPrdId, setCopiedPrdId] = useState<number | null>(null);

  // Analytics State
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  // 1. Team Capacity State
  const [teamCapacity, setTeamCapacity] = useState<any | null>(null);

  // Dynamic Team Management State
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [newMemberGithub, setNewMemberGithub] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberCapacity, setNewMemberCapacity] = useState(15);
  const [newMemberComponent, setNewMemberComponent] = useState('Core Services');
  const [savingMember, setSavingMember] = useState(false);
  const [rebalancingWorkload, setRebalancingWorkload] = useState(false);
  const [assigningIssueNum, setAssigningIssueNum] = useState<number | null>(null);
  const [assignmentFeedback, setAssignmentFeedback] = useState<string | null>(null);

  // Authenticated User State
  const [currentUser, setCurrentUser] = useState<{
    username: string;
    name: string;
    avatarUrl: string;
    email: string;
    role: 'TPM_LEAD' | 'ENGINEER';
  } | null>(null);

  // Check Authentication Session on Mount
  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
        } else {
          window.location.href = '/login';
        }
      })
      .catch(() => {
        window.location.href = '/login';
      });
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      window.location.href = '/login';
    }
  };

  const [loadingCapacity, setLoadingCapacity] = useState(false);

  // 2. Outage Comms Modal State
  const [outageCommsItem, setOutageCommsItem] = useState<ActivityItem | null>(null);
  const [generatingOutageComms, setGeneratingOutageComms] = useState(false);
  const [activeOutageComms, setActiveOutageComms] = useState<OutageCommunications | null>(null);
  const [activeCommsTab, setActiveCommsTab] = useState<'exec' | 'customer' | 'statuspage'>('exec');
  const [dispatchingExecEmail, setDispatchingExecEmail] = useState(false);
  const [dispatchedExecEmailSuccess, setDispatchedExecEmailSuccess] = useState(false);
  const [copiedCommsType, setCopiedCommsType] = useState<string | null>(null);

  // 3. Security & SOC2 Compliance Modal State
  const [complianceModalItem, setComplianceModalItem] = useState<ActivityItem | null>(null);
  const [generatingCompliance, setGeneratingCompliance] = useState(false);
  const [activeComplianceReport, setActiveComplianceReport] = useState<SecurityComplianceReport | null>(null);

  // 4. Copilot Chat Drawer State
  const [showCopilotDrawer, setShowCopilotDrawer] = useState(false);
  const [copilotInput, setCopilotInput] = useState('');
  const [copilotChatMessages, setCopilotChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; followUps?: string[] }>>([
    {
      role: 'assistant',
      content: '👋 Hi @bekizod! I am your Autonomous Technical Product Manager Copilot. I have live real-time visibility into your GitHub repository backlog, active P0 blockers, and sprint burndown. Ask me anything or click one of the quick prompts below.',
      followUps: [
        'What are our highest P0 risks today?',
        'Are we on track for sprint delivery?',
        'Draft an executive incident email to leadership',
      ],
    },
  ]);
  const [askingCopilot, setAskingCopilot] = useState(false);


  // Issue Action States
  const [planningIssueNum, setPlanningIssueNum] = useState<number | null>(null);
  const [plannedSuccessNum, setPlannedSuccessNum] = useState<number | null>(null);
  const [togglingStateNum, setTogglingStateNum] = useState<number | null>(null);

  // Code Fix & Test Modal State
  const [codeFixModalItem, setCodeFixModalItem] = useState<ActivityItem | null>(null);
  const [generatingCodeFix, setGeneratingCodeFix] = useState(false);
  const [activeCodeFixScaffold, setActiveCodeFixScaffold] = useState<CodeFixAndTestScaffold | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<'test' | 'diff'>('diff');
  const [postingDiffToGithub, setPostingDiffToGithub] = useState(false);
  const [postedDiffSuccess, setPostedDiffSuccess] = useState(false);
  const [copiedCodeType, setCopiedCodeType] = useState<string | null>(null);

  // Autonomous Git PR State
  const [creatingAutonomousPr, setCreatingAutonomousPr] = useState(false);
  const [createdPrResult, setCreatedPrResult] = useState<any | null>(null);

  // Incident War Room & Post-Mortem Modal State
  const [warRoomModalItem, setWarRoomModalItem] = useState<ActivityItem | null>(null);
  const [generatingPostMortem, setGeneratingPostMortem] = useState(false);
  const [activePostMortem, setActivePostMortem] = useState<PostMortemReport | null>(null);
  const [publishingPostMortem, setPublishingPostMortem] = useState(false);
  const [publishedPostMortemSuccess, setPublishedPostMortemSuccess] = useState(false);
  const [copiedPostMortem, setCopiedPostMortem] = useState(false);

  // Sprint Release Notes Modal State
  const [showReleaseNotesModal, setShowReleaseNotesModal] = useState(false);
  const [generatingReleaseNotes, setGeneratingReleaseNotes] = useState(false);
  const [activeReleaseNotes, setActiveReleaseNotes] = useState<SprintReleaseNotes | null>(null);
  const [releaseVersionInput, setReleaseVersionInput] = useState('1.4.0');
  const [publishingReleaseDraft, setPublishingReleaseDraft] = useState(false);
  const [publishedReleaseDraftResult, setPublishedReleaseDraftResult] = useState<any | null>(null);
  const [copiedReleaseNotes, setCopiedReleaseNotes] = useState(false);

  // Multi-Agent DAG Trace Modal State
  const [showDagTraceModal, setShowDagTraceModal] = useState(false);

  // Webhook Modal State
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [simulatingWebhook, setSimulatingWebhook] = useState(false);
  const [webhookTestMessage, setWebhookTestMessage] = useState('');

  // Filtering & Pagination
  const [streamTypeFilter, setStreamTypeFilter] = useState<'all' | 'triage' | 'prd' | 'webhook' | 'standup'>('all');
  const [streamSeverityFilter, setStreamSeverityFilter] = useState<'all' | 'P0' | 'P1' | 'P2'>('all');
  const [streamSearch, setStreamSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const loadData = async () => {
    setRefreshing(true);
    try {
      const [resStatus, resAnalytics, resCapacity] = await Promise.all([
        fetch(`${API_BASE}/status`),
        fetch(`${API_BASE}/analytics`),
        fetch(`${API_BASE}/team/capacity`),
      ]);

      if (resStatus.ok) {
        const data = await resStatus.json();
        setActivityLog(data.activityLog || []);
        setOpenIssues(data.openIssues || []);
        if (data.activityLog && data.activityLog.length > 0 && expandedId === null) {
          setExpandedId(data.activityLog[0].id);
        }
      }

      if (resAnalytics.ok) {
        const analyticsData = await resAnalytics.json();
        setAnalytics(analyticsData);
      }
      if (resCapacity && resCapacity.ok) {
        const capData = await resCapacity.json();
        setTeamCapacity(capData.capacityPlan);
      }
    } catch (err) {
      console.warn('Backend unavailable:', err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || submitting) return;
    setSubmitting(true);
    try {
      const endpoint = intakeMode === 'prd' ? `${API_BASE}/prd` : `${API_BASE}/triage`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });
      if (res.ok) {
        const item = await res.json();
        setActivityLog((prev) => [item, ...prev]);
        setExpandedId(item.id);
        setInput('');
        setActiveTab('stream');
        setCurrentPage(1);
        loadData();
      }
    } catch (err) {
      console.error('Failed to submit form:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStandup = async () => {
    if (runningStandup) return;
    setRunningStandup(true);
    try {
      const res = await fetch(`${API_BASE}/cron/daily-digest`, {
        method: 'POST',
      });
      if (res.ok) {
        const digestItem = await res.json();
        setActivityLog((prev) => [digestItem, ...prev]);
        setExpandedId(digestItem.id);
        setActiveTab('standup');
        loadData();
      }
    } catch (err) {
      console.error('Failed to run standup:', err);
    } finally {
      setRunningStandup(false);
    }
  };

  // Issue Action 1: Generate AI Plan & Post Comment on GitHub
  const handleGeneratePlan = async (item: ActivityItem) => {
    const issueNum = item.githubIssue?.issueNumber;
    if (!issueNum || planningIssueNum === issueNum) return;

    setPlanningIssueNum(issueNum);
    try {
      const title = item.triage?.title || item.prd?.title || `Issue #${issueNum}`;
      const body = item.triage?.summary || item.prd?.problemStatement || '';

      const res = await fetch(`${API_BASE}/issues/${issueNum}/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body }),
      });

      if (res.ok) {
        setPlannedSuccessNum(issueNum);
        setTimeout(() => setPlannedSuccessNum(null), 4000);
      }
    } catch (err) {
      console.error('Failed to post plan:', err);
    } finally {
      setPlanningIssueNum(null);
    }
  };

  // Issue Action 2: Open Code Fix & Test Modal
  const handleOpenCodeFixModal = async (item: ActivityItem) => {
    setCodeFixModalItem(item);
    setActiveCodeTab('diff');
    setPostedDiffSuccess(false);
    setCreatedPrResult(item.pullRequest || null);

    if (item.codeScaffold) {
      setActiveCodeFixScaffold(item.codeScaffold);
    } else {
      setGeneratingCodeFix(true);
      try {
        const issueNum = item.githubIssue?.issueNumber || item.id;
        const title = item.triage?.title || item.prd?.title || `Issue #${issueNum}`;
        const body = item.triage?.summary || item.prd?.problemStatement || '';

        const res = await fetch(`${API_BASE}/issues/${issueNum}/code-fix`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, body, postToGitHub: false }),
        });

        if (res.ok) {
          const data = await res.json();
          setActiveCodeFixScaffold(data.scaffold);
        }
      } catch (err) {
        console.error('Failed to generate code scaffold:', err);
      } finally {
        setGeneratingCodeFix(false);
      }
    }
  };

  // Issue Action 3: Post Diff to GitHub Comment
  const handlePostDiffToGitHub = async () => {
    if (!codeFixModalItem?.githubIssue?.issueNumber || postingDiffToGithub) return;
    const issueNum = codeFixModalItem.githubIssue.issueNumber;
    setPostingDiffToGithub(true);
    try {
      const title = codeFixModalItem.triage?.title || codeFixModalItem.prd?.title || `Issue #${issueNum}`;
      const body = codeFixModalItem.triage?.summary || codeFixModalItem.prd?.problemStatement || '';

      const res = await fetch(`${API_BASE}/issues/${issueNum}/code-fix`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body, postToGitHub: true }),
      });

      if (res.ok) {
        setPostedDiffSuccess(true);
      }
    } catch (err) {
      console.error('Failed to post diff to GitHub:', err);
    } finally {
      setPostingDiffToGithub(false);
    }
  };

  // Issue Action 3b: Autonomous Git Pull Request Creator via Octokit
  const handleCreateAutonomousPr = async () => {
    if (!codeFixModalItem?.githubIssue?.issueNumber || creatingAutonomousPr || !activeCodeFixScaffold) return;
    const issueNum = codeFixModalItem.githubIssue.issueNumber;
    setCreatingAutonomousPr(true);
    try {
      const title = codeFixModalItem.triage?.title || codeFixModalItem.prd?.title || `Issue #${issueNum}`;
      const body = codeFixModalItem.triage?.summary || codeFixModalItem.prd?.problemStatement || '';

      const res = await fetch(`${API_BASE}/issues/${issueNum}/pull-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          body,
          patchContent: activeCodeFixScaffold.proposedFixDiff,
          testScaffold: activeCodeFixScaffold.reproductionTestCode,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCreatedPrResult(data.pullRequest);
        // update item in activityLog
        setActivityLog((prev) =>
          prev.map((a) =>
            a.githubIssue?.issueNumber === issueNum ? { ...a, pullRequest: data.pullRequest } : a
          )
        );
      }
    } catch (err) {
      console.error('Failed to create autonomous pull request:', err);
    } finally {
      setCreatingAutonomousPr(false);
    }
  };

  // Issue Action 4: Close / Reopen Issue on GitHub
  const handleToggleIssueState = async (item: ActivityItem) => {
    const issueNum = item.githubIssue?.issueNumber;
    if (!issueNum || togglingStateNum === issueNum) return;

    const targetState = item.state === 'closed' ? 'open' : 'closed';
    setTogglingStateNum(issueNum);
    try {
      const res = await fetch(`${API_BASE}/issues/${issueNum}/state`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: targetState }),
      });

      if (res.ok) {
        setActivityLog((prev) =>
          prev.map((a) => (a.githubIssue?.issueNumber === issueNum ? { ...a, state: targetState } : a))
        );
        loadData();
      }
    } catch (err) {
      console.error('Failed to toggle state:', err);
    } finally {
      setTogglingStateNum(null);
    }
  };

  // Issue Action 5: Open Incident War Room & Blameless Post-Mortem Modal
  const handleOpenWarRoomModal = async (item: ActivityItem) => {
    setWarRoomModalItem(item);
    setPublishedPostMortemSuccess(false);

    if (item.postMortem) {
      setActivePostMortem(item.postMortem);
    } else {
      setGeneratingPostMortem(true);
      try {
        const issueNum = item.githubIssue?.issueNumber || item.id;
        const title = item.triage?.title || item.prd?.title || `Issue #${issueNum}`;
        const body = item.triage?.summary || item.prd?.problemStatement || '';
        const severity = item.triage?.severity || 'P0';

        const res = await fetch(`${API_BASE}/issues/${issueNum}/post-mortem`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, body, severity, publishToGitHub: false }),
        });

        if (res.ok) {
          const data = await res.json();
          setActivePostMortem(data.postMortem);
          setActivityLog((prev) =>
            prev.map((a) =>
              a.githubIssue?.issueNumber === issueNum ? { ...a, postMortem: data.postMortem } : a
            )
          );
        }
      } catch (err) {
        console.error('Failed to generate post-mortem:', err);
      } finally {
        setGeneratingPostMortem(false);
      }
    }
  };

  const handlePublishPostMortemToGitHub = async () => {
    if (!warRoomModalItem?.githubIssue?.issueNumber || publishingPostMortem || !activePostMortem) return;
    const issueNum = warRoomModalItem.githubIssue.issueNumber;
    setPublishingPostMortem(true);
    try {
      const title = warRoomModalItem.triage?.title || `Issue #${issueNum}`;
      const body = warRoomModalItem.triage?.summary || '';
      const severity = warRoomModalItem.triage?.severity || 'P0';

      const res = await fetch(`${API_BASE}/issues/${issueNum}/post-mortem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body, severity, publishToGitHub: true }),
      });

      if (res.ok) {
        setPublishedPostMortemSuccess(true);
      }
    } catch (err) {
      console.error('Failed to publish post-mortem to GitHub:', err);
    } finally {
      setPublishingPostMortem(false);
    }
  };

  // Issue Action 6: Open Sprint Release Notes Modal
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
        body: JSON.stringify({ version: ver, publishToGitHub: false }),
      });
      if (res.ok) {
        const data = await res.json();
        setActiveReleaseNotes(data.releaseNotes);
      }
    } catch (err) {
      console.error('Failed to generate release notes:', err);
    } finally {
      setGeneratingReleaseNotes(false);
    }
  };

  const handlePublishReleaseDraft = async () => {
    if (publishingReleaseDraft || !activeReleaseNotes) return;
    setPublishingReleaseDraft(true);
    try {
      const res = await fetch(`${API_BASE}/release-notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ version: activeReleaseNotes.version, publishToGitHub: true }),
      });
      if (res.ok) {
        const data = await res.json();
        setPublishedReleaseDraftResult(data.gitHubRelease);
      }
    } catch (err) {
      console.error('Failed to publish release draft:', err);
    } finally {
      setPublishingReleaseDraft(false);
    }
  };



  const loadCapacity = async () => {
    try {
      const res = await fetch(`${API_BASE}/team/capacity`);
      if (res.ok) {
        const data = await res.json();
        setTeamCapacity(data.capacityPlan);
      }
    } catch (err) {
      console.error('Failed to load capacity:', err);
    }
  };


  // Handler: Add Real Team Member
  const handleAddRealMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || savingMember) return;
    setSavingMember(true);
    try {
      const res = await fetch(`${API_BASE}/team/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newMemberName,
          role: newMemberRole || 'Software Engineer',
          githubUsername: newMemberGithub,
          email: newMemberEmail,
          maxCapacityPoints: Number(newMemberCapacity) || 15,
          primaryComponent: newMemberComponent,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const inviteText = data.gitHubInviteResult?.success
          ? ` 🚀 Official GitHub collaborator invite sent to @${newMemberGithub}!`
          : '';
        const emailText = data.emailResult?.sent
          ? ` 📧 Welcome email dispatched to ${data.emailResult.recipient}!`
          : '';
        setAssignmentFeedback(`✓ Added ${newMemberName} to sprint team!${inviteText}${emailText}`);
        setTimeout(() => setAssignmentFeedback(null), 8000);
        setShowAddMemberModal(false);
        setNewMemberName('');
        setNewMemberRole('');
        setNewMemberGithub('');
        setNewMemberEmail('');
        loadCapacity();
      }
    } catch (err) {
      console.error('Failed to add team member:', err);
    } finally {
      setSavingMember(false);
    }
  };

  // Handler: Delete Team Member
  const handleDeleteMember = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/team/members/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadCapacity();
      }
    } catch (err) {
      console.error('Failed to delete member:', err);
    }
  };

  // Handler: Assign Issue to Member
  const handleAssignIssue = async (issueNumber: number, memberId: string) => {
    setAssigningIssueNum(issueNumber);
    try {
      const res = await fetch(`${API_BASE}/issues/${issueNumber}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId, syncToGitHub: true }),
      });
      if (res.ok) {
        const data = await res.json();
        const emailMsg = data.emailResult?.sent
          ? ` 📧 Real email dispatched to ${data.emailResult.recipient}!`
          : '';
        setAssignmentFeedback(`✓ Issue #${issueNumber} assigned to ${data.assignedTo?.name || 'engineer'}.${emailMsg}`);
        setTimeout(() => setAssignmentFeedback(null), 7000);
        loadCapacity();
        loadData();
      }
    } catch (err) {
      console.error('Failed to assign issue:', err);
    } finally {
      setAssigningIssueNum(null);
    }
  };

  // Handler: Auto-Rebalance Workload
  const handleAutoRebalance = async () => {
    if (rebalancingWorkload) return;
    setRebalancingWorkload(true);
    try {
      const res = await fetch(`${API_BASE}/team/rebalance`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setTeamCapacity(data.updatedCapacity.capacityPlan);
        loadData();
      }
    } catch (err) {
      console.error('Failed to auto-rebalance:', err);
    } finally {
      setRebalancingWorkload(false);
    }
  };

  // Handler: Open Outage Comms Modal
  const handleOpenOutageComms = async (item: ActivityItem) => {
    setOutageCommsItem(item);
    setActiveCommsTab('exec');
    setDispatchedExecEmailSuccess(false);
    setGeneratingOutageComms(true);
    try {
      const issueNum = item.githubIssue?.issueNumber || item.id;
      const title = item.triage?.title || item.prd?.title || `Issue #${issueNum}`;
      const body = item.triage?.summary || item.prd?.problemStatement || '';
      const severity = item.triage?.severity || 'P0';

      const res = await fetch(`${API_BASE}/issues/${issueNum}/outage-comms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body, severity, dispatchEmail: false }),
      });
      if (res.ok) {
        const data = await res.json();
        setActiveOutageComms(data.communications);
      }
    } catch (err) {
      console.error('Failed to generate outage comms:', err);
    } finally {
      setGeneratingOutageComms(false);
    }
  };

  const handleDispatchExecEmail = async () => {
    if (!outageCommsItem || dispatchingExecEmail) return;
    setDispatchingExecEmail(true);
    try {
      const issueNum = outageCommsItem.githubIssue?.issueNumber || outageCommsItem.id;
      const title = outageCommsItem.triage?.title || outageCommsItem.prd?.title || `Issue #${issueNum}`;
      const body = outageCommsItem.triage?.summary || outageCommsItem.prd?.problemStatement || '';
      const severity = outageCommsItem.triage?.severity || 'P0';

      const res = await fetch(`${API_BASE}/issues/${issueNum}/outage-comms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body, severity, dispatchEmail: true }),
      });
      if (res.ok) {
        setDispatchedExecEmailSuccess(true);
      }
    } catch (err) {
      console.error('Failed to dispatch exec email:', err);
    } finally {
      setDispatchingExecEmail(false);
    }
  };

  // Handler: Open Security & Compliance Audit Modal
  const handleOpenComplianceModal = async (item: ActivityItem) => {
    setComplianceModalItem(item);
    setGeneratingCompliance(true);
    try {
      const issueNum = item.githubIssue?.issueNumber || item.id;
      const title = item.triage?.title || item.prd?.title || `Issue #${issueNum}`;
      const body = item.triage?.summary || item.prd?.problemStatement || item.prd?.markdownPrd || '';

      const res = await fetch(`${API_BASE}/issues/${issueNum}/compliance-audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body }),
      });
      if (res.ok) {
        const data = await res.json();
        setActiveComplianceReport(data.report);
      }
    } catch (err) {
      console.error('Failed to run compliance audit:', err);
    } finally {
      setGeneratingCompliance(false);
    }
  };

  // Handler: Ask Copilot
  const handleSendCopilotMessage = async (overridePrompt?: string) => {
    const promptToSend = overridePrompt || copilotInput;
    if (!promptToSend.trim() || askingCopilot) return;

    setCopilotChatMessages((prev) => [...prev, { role: 'user', content: promptToSend }]);
    setCopilotInput('');
    setAskingCopilot(true);

    try {
      const res = await fetch(`${API_BASE}/copilot/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptToSend }),
      });

      if (res.ok) {
        const data = await res.json();
        setCopilotChatMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.reply, followUps: data.suggestedFollowUps },
        ]);
      }
    } catch (err) {
      console.error('Failed to query copilot:', err);
      setCopilotChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Apologies, I encountered a connection issue querying the sprint copilot service.' },
      ]);
    } finally {
      setAskingCopilot(false);
    }
  };

  // Webhook Simulator
  const handleSimulateWebhook = async (preset?: string) => {
    setSimulatingWebhook(true);
    const payload =
      preset ||
      webhookTestMessage ||
      'Sentry Alert: Critical Database Deadlock on Transaction Commit in billing service.';
    try {
      const res = await fetch(`${API_BASE}/webhook/incident`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'Sentry Inbound Webhook',
          payload: { message: payload },
        }),
      });

      if (res.ok) {
        const item = await res.json();
        setActivityLog((prev) => [item, ...prev]);
        setExpandedId(item.id);
        setShowWebhookModal(false);
        setWebhookTestMessage('');
        setActiveTab('stream');
        loadData();
      }
    } catch (err) {
      console.error('Webhook simulation failed:', err);
    } finally {
      setSimulatingWebhook(false);
    }
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedPrdId(id);
    setTimeout(() => setCopiedPrdId(null), 2000);
  };

  const copyCodeScaffold = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeType(type);
    setTimeout(() => setCopiedCodeType(null), 2000);
  };

  // Filtered Activity Stream
  const filteredActivity = useMemo(() => {
    return activityLog.filter((item) => {
      // Type Filter
      if (streamTypeFilter === 'triage' && item.type !== 'REACTIVE_TRIAGE') return false;
      if (streamTypeFilter === 'prd' && item.type !== 'FEATURE_PRD') return false;
      if (streamTypeFilter === 'webhook' && item.type !== 'WEBHOOK_INCIDENT') return false;
      if (streamTypeFilter === 'standup' && item.type !== 'PROACTIVE_DIGEST') return false;

      // Severity Filter
      if (streamSeverityFilter !== 'all') {
        const sev = item.triage?.severity;
        if (sev !== streamSeverityFilter) return false;
      }

      // Keyword Search
      if (streamSearch.trim()) {
        const q = streamSearch.toLowerCase();
        const title = item.triage?.title || item.prd?.title || item.digest || '';
        const summary = item.triage?.summary || item.prd?.problemStatement || '';
        if (!title.toLowerCase().includes(q) && !summary.toLowerCase().includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [activityLog, streamTypeFilter, streamSeverityFilter, streamSearch]);

  const totalPages = Math.max(1, Math.ceil(filteredActivity.length / pageSize));
  const paginatedActivity = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredActivity.slice(start, start + pageSize);
  }, [filteredActivity, currentPage, pageSize]);

  // Backlog Filtering
  const filteredBacklog = useMemo(() => {
    return openIssues.filter((issue) => {
      const isPrd = issue.title.startsWith('[Feature Spec]') || (issue.labels || []).includes('feature-spec');
      if (backlogFilter === 'bug' && isPrd) return false;
      if (backlogFilter === 'prd' && !isPrd) return false;

      if (backlogSearch.trim()) {
        const q = backlogSearch.toLowerCase();
        return (
          issue.title.toLowerCase().includes(q) ||
          issue.number.toString().includes(q) ||
          (issue.labels || []).some((l) => l.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [openIssues, backlogFilter, backlogSearch]);

  const latestStandup = activityLog.find((item) => item.type === 'PROACTIVE_DIGEST');

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans antialiased flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Professional Engineering Header (Linear/Vercel Aesthetic) */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Brand & Repository Context */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-mono text-xs font-bold shadow-xs">
              <span className="text-indigo-400 mr-0.5">&gt;</span>_
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm tracking-tight">SprintOps</span>
              <span className="text-slate-300">/</span>
              <a
                href="https://github.com/bekizod/ai_target_repo_name"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 border border-slate-200/60 transition-colors"
                title="View target repository on GitHub"
              >
                <GitBranch className="w-3 h-3 text-slate-400" />
                <span>bekizod/ai_target_repo_name</span>
              </a>
            </div>
          </div>

          {/* Unified Tooling Actions */}
          <div className="flex items-center gap-2">
            {/* Ask Copilot */}
            <button
              type="button"
              onClick={() => setShowCopilotDrawer(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200/80 transition-colors cursor-pointer shadow-2xs"
              title="Open TPM Copilot assistant"
            >
              <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Copilot</span>
            </button>

            {/* Agent Traces */}
            <button
              type="button"
              onClick={() => setShowDagTraceModal(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200/80 transition-colors cursor-pointer shadow-2xs"
              title="Inspect multi-agent trace DAG"
            >
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Traces</span>
            </button>

            {/* Release Notes */}
            <button
              type="button"
              onClick={handleOpenReleaseNotesModal}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200/80 transition-colors cursor-pointer shadow-2xs"
              title="Generate sprint release notes"
            >
              <FileCode className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Release Notes</span>
            </button>

            {/* Webhook Simulator */}
            <button
              type="button"
              onClick={() => setShowWebhookModal(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200/80 transition-colors cursor-pointer shadow-2xs"
              title="Simulate incoming webhooks"
            >
              <Radio className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden lg:inline">Webhooks</span>
            </button>

            {/* Standup Trigger - Primary Action */}
            <button
              type="button"
              onClick={handleStandup}
              disabled={runningStandup}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white transition-all cursor-pointer shadow-xs"
              title="Run daily sprint standup digest"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${runningStandup ? 'animate-spin' : ''}`} />
              <span>{runningStandup ? 'Synthesizing...' : 'Run Standup'}</span>
            </button>

            {/* Data Refresh */}
            <button
              type="button"
              onClick={loadData}
              disabled={refreshing}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Refresh repository issues"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>

            {/* Authenticated Owner Profile */}
            {currentUser && (
              <div className="flex items-center gap-2 pl-2.5 ml-1 border-l border-slate-200">
                <div className="flex items-center gap-2">
                  <img
                    src={currentUser.avatarUrl || 'https://avatars.githubusercontent.com/u/121251335?v=4'}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full border border-slate-200 object-cover"
                  />
                  <div className="hidden lg:flex items-center gap-1.5">
                    <span className="text-xs font-medium text-slate-800 font-mono">@{currentUser.username}</span>
                    <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-1.5 py-0.2 rounded">
                      Owner
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Sign out of workspace"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MODAL 1: Autonomous Inbound Webhook Listener */}
      {showWebhookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Autonomous Inbound Webhook Listener</h3>
              </div>
              <button
                onClick={() => setShowWebhookModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Simulates production alert streams from <strong>Sentry</strong>, <strong>Datadog</strong>, or <strong>PagerDuty</strong>. The agent runs full multi-agent triage, checks blast radius, creates a GitHub issue, schedules emergency calendar triage, and emails on-call leadership.
            </p>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">1-Click Production Presets:</span>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => handleSimulateWebhook('Sentry Alert: Critical Database Deadlock on Transaction Commit in billing service.')}
                  disabled={simulatingWebhook}
                  className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-xs text-slate-800 transition cursor-pointer"
                >
                  <span className="font-semibold text-rose-700 block">🚨 Sentry: PostgreSQL Deadlock (P0)</span>
                  <span className="text-slate-500 text-[11px]">Concurrent transaction collision in billing service</span>
                </button>
                <button
                  onClick={() => handleSimulateWebhook('Datadog Alert: Redis cache eviction rate spiked 800% causing downstream database timeouts.')}
                  disabled={simulatingWebhook}
                  className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-xs text-slate-800 transition cursor-pointer"
                >
                  <span className="font-semibold text-amber-700 block">⚠️ Datadog: Redis Cache Eviction Spike (P1)</span>
                  <span className="text-slate-500 text-[11px]">Cascading latency degradation across tenant clusters</span>
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowWebhookModal(false)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Code Fix, Reproduction Test & AUTONOMOUS GIT PR MODAL */}
      {codeFixModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  AI Code Fix, Reproduction Test & Autonomous Octokit PR
                </h3>
              </div>
              <button
                onClick={() => {
                  setCodeFixModalItem(null);
                  setCreatedPrResult(null);
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 space-y-4 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Issue</span>
                <span className="font-semibold text-slate-900 text-sm">
                  #{codeFixModalItem.githubIssue?.issueNumber} — {codeFixModalItem.triage?.title || codeFixModalItem.prd?.title}
                </span>
              </div>

              {/* Live GitHub PR Banner if already opened */}
              {(createdPrResult || codeFixModalItem.pullRequest) && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      <GitPullRequest className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-emerald-900 text-xs">
                        Real GitHub Pull Request Opened: PR #{(createdPrResult || codeFixModalItem.pullRequest).prNumber}
                      </div>
                      <div className="text-[11px] text-emerald-700">
                        Committed reproduction test & patch to branch <code className="font-mono bg-emerald-100/80 px-1 py-0.2 rounded text-[10px]">{(createdPrResult || codeFixModalItem.pullRequest).branchName}</code>
                      </div>
                    </div>
                  </div>
                  <a
                    href={(createdPrResult || codeFixModalItem.pullRequest).prUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-xs"
                  >
                    View PR on GitHub <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {generatingCodeFix ? (
                <div className="p-8 text-center space-y-2">
                  <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin mx-auto" />
                  <p className="text-slate-600 font-medium">Synthesizing Jest unit reproduction suite and unified git diff patch...</p>
                </div>
              ) : activeCodeFixScaffold ? (
                <div className="space-y-3">
                  {/* Tabs */}
                  <div className="flex items-center justify-between border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveCodeTab('diff')}
                        className={`pb-2 px-1 text-xs font-semibold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${activeCodeTab === 'diff'
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-transparent text-slate-500 hover:text-slate-700'
                          }`}
                      >
                        <GitBranch className="w-3.5 h-3.5" />
                        <span>Unified Git Patch Diff</span>
                      </button>
                      <button
                        onClick={() => setActiveCodeTab('test')}
                        className={`pb-2 px-1 text-xs font-semibold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${activeCodeTab === 'test'
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-transparent text-slate-500 hover:text-slate-700'
                          }`}
                      >
                        <FileCode className="w-3.5 h-3.5" />
                        <span>Reproduction Test ({activeCodeFixScaffold.testFramework})</span>
                      </button>
                    </div>

                    <button
                      onClick={() =>
                        copyCodeScaffold(
                          activeCodeTab === 'diff'
                            ? activeCodeFixScaffold.proposedFixDiff
                            : activeCodeFixScaffold.reproductionTestCode,
                          activeCodeTab
                        )
                      }
                      className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 pb-2 cursor-pointer"
                    >
                      {copiedCodeType === activeCodeTab ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600 font-semibold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Snippet</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Code Viewport */}
                  {activeCodeTab === 'diff' ? (
                    <div className="space-y-2">
                      <div className="bg-slate-900 text-slate-100 p-3.5 rounded-lg font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
                        <pre>{activeCodeFixScaffold.proposedFixDiff}</pre>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                        <span className="font-semibold text-slate-700 block">Technical Rationale & Tradeoffs:</span>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          {activeCodeFixScaffold.technicalTradeoffs}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="bg-slate-900 text-slate-100 p-3.5 rounded-lg font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
                        <pre>{activeCodeFixScaffold.reproductionTestCode}</pre>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span>Commit Message:</span>
                        <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-semibold">
                          {activeCodeFixScaffold.commitMessage}
                        </code>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            <div className="p-3 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-2 text-xs">
              <button
                onClick={() => {
                  setCodeFixModalItem(null);
                  setCreatedPrResult(null);
                }}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePostDiffToGitHub}
                  disabled={postingDiffToGithub || postedDiffSuccess || !activeCodeFixScaffold}
                  className="bg-white hover:bg-slate-50 border border-slate-300 disabled:opacity-50 text-slate-700 font-semibold px-3 py-1.5 rounded-lg transition shadow-xs flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                  <span>
                    {postingDiffToGithub
                      ? 'Posting Comment...'
                      : postedDiffSuccess
                        ? '✓ Posted to GitHub'
                        : 'Post RFC Patch to Issue'}
                  </span>
                </button>

                {/* THE AUTONOMOUS OCTOKIT PR BUTTON */}
                <button
                  onClick={handleCreateAutonomousPr}
                  disabled={creatingAutonomousPr || !activeCodeFixScaffold}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold px-3.5 py-1.5 rounded-lg transition shadow-xs flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <GitPullRequest className={`w-3.5 h-3.5 ${creatingAutonomousPr ? 'animate-spin' : ''}`} />
                  <span>{creatingAutonomousPr ? 'Opening Git Branch & PR...' : '🚀 Autonomous Git PR (Octokit)'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: SRE Blameless Post-Mortem & Incident War Room */}
      {warRoomModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-rose-50/50">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    SRE Incident War Room & Blameless Post-Mortem (RCA)
                  </h3>
                  <span className="text-[11px] text-slate-500">Google / Amazon Site Reliability Engineering Standards</span>
                </div>
              </div>
              <button
                onClick={() => setWarRoomModalItem(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 space-y-5 text-xs">
              {generatingPostMortem ? (
                <div className="p-12 text-center space-y-3">
                  <RefreshCw className="w-7 h-7 text-rose-600 animate-spin mx-auto" />
                  <p className="text-slate-700 font-semibold">Synthesizing 5-Whys Root Cause Chain, Incident Timeline, and Preventive Action Items...</p>
                </div>
              ) : activePostMortem ? (
                <div className="space-y-5">
                  {/* Header Title & Severity */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Incident Record</span>
                      <h4 className="text-sm font-bold text-slate-900">{activePostMortem.title}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                        {activePostMortem.incidentSeverity}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {activePostMortem.status}
                      </span>
                    </div>
                  </div>

                  {/* Impact KPI Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Downtime</span>
                      <div className="text-base font-extrabold text-slate-900">{activePostMortem.impact.downtimeMinutes} min</div>
                      <span className="text-[10px] text-slate-500">MTTD + MTTR</span>
                    </div>
                    <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Affected Tenants</span>
                      <div className="text-xs font-bold text-slate-800 truncate">{activePostMortem.impact.affectedCustomers}</div>
                      <span className="text-[10px] text-slate-500">Blast radius exposure</span>
                    </div>
                    <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Financial Risk</span>
                      <div className="text-xs font-bold text-rose-700">{activePostMortem.impact.financialExposure}</div>
                      <span className="text-[10px] text-slate-500">SLA penalty exposure</span>
                    </div>
                    <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Data Integrity</span>
                      <div className="text-xs font-bold text-emerald-700 truncate">{activePostMortem.impact.dataLoss}</div>
                      <span className="text-[10px] text-slate-500">Transaction log status</span>
                    </div>
                  </div>

                  {/* Executive Summary */}
                  <div className="space-y-1">
                    <h5 className="font-bold text-slate-900 uppercase tracking-wide text-[11px]">Executive Summary</h5>
                    <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                      {activePostMortem.executiveSummary}
                    </p>
                  </div>

                  {/* 5-Whys Root Cause Chain */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-slate-900 font-bold uppercase tracking-wide text-[11px]">
                      <Target className="w-3.5 h-3.5 text-indigo-600" />
                      <span>5-Whys Root Cause Analysis Chain</span>
                    </div>
                    <div className="space-y-2">
                      {activePostMortem.fiveWhys.map((why) => (
                        <div key={why.level} className="p-2.5 bg-indigo-50/40 border border-indigo-100 rounded-lg flex items-start gap-3">
                          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                            {why.level}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-slate-900 text-xs">{why.why}</div>
                            <div className="text-slate-600 text-[11px] mt-0.5"><strong className="text-indigo-900">Finding:</strong> {why.finding}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chronological Incident Timeline */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-slate-900 font-bold uppercase tracking-wide text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Chronological Incident Timeline</span>
                    </div>
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden bg-white">
                      {activePostMortem.timeline.map((event, idx) => (
                        <div key={idx} className="p-2.5 flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                              {event.time}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.2 rounded ${event.phase === 'Detection' ? 'bg-amber-100 text-amber-800' :
                              event.phase === 'Escalation' ? 'bg-rose-100 text-rose-800' :
                                event.phase === 'Mitigation' ? 'bg-blue-100 text-blue-800' :
                                  'bg-emerald-100 text-emerald-800'
                              }`}>
                              {event.phase}
                            </span>
                            <span className="text-slate-800">{event.description}</span>
                          </div>
                          <span className="text-[11px] text-slate-400 italic flex-shrink-0">Actor: {event.actor}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Preventive Action Items */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-slate-900 font-bold uppercase tracking-wide text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Preventive Action Items & Hardening SLAs</span>
                    </div>
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full text-left text-xs divide-y divide-slate-200">
                        <thead className="bg-slate-50 text-[10px] text-slate-500 uppercase tracking-wider">
                          <tr>
                            <th className="p-2.5">ID</th>
                            <th className="p-2.5">Priority</th>
                            <th className="p-2.5">Action Item</th>
                            <th className="p-2.5">Owner</th>
                            <th className="p-2.5">Target SLA</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {activePostMortem.actionItems.map((act) => (
                            <tr key={act.id}>
                              <td className="p-2.5 font-mono text-[11px] font-bold text-slate-700">{act.id}</td>
                              <td className="p-2.5">
                                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${act.priority === 'P0' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                                  }`}>
                                  {act.priority}
                                </span>
                              </td>
                              <td className="p-2.5 font-medium text-slate-800">{act.action}</td>
                              <td className="p-2.5 text-slate-600">{act.owner}</td>
                              <td className="p-2.5 font-mono text-[11px] text-slate-500">{act.dueDate}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-2 text-xs">
              <button
                onClick={() => setWarRoomModalItem(null)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (activePostMortem) {
                      navigator.clipboard.writeText(activePostMortem.markdownReport);
                      setCopiedPostMortem(true);
                      setTimeout(() => setCopiedPostMortem(false), 2000);
                    }
                  }}
                  className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold px-3 py-1.5 rounded-lg transition shadow-xs flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedPostMortem ? 'Copied Markdown!' : 'Copy SRE Markdown'}</span>
                </button>

                <button
                  onClick={handlePublishPostMortemToGitHub}
                  disabled={publishingPostMortem || publishedPostMortemSuccess || !activePostMortem}
                  className="bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-semibold px-3.5 py-1.5 rounded-lg transition shadow-xs flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>
                    {publishingPostMortem
                      ? 'Publishing to Issue...'
                      : publishedPostMortemSuccess
                        ? '✓ Published to GitHub'
                        : 'Publish SRE RCA to GitHub Issue'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Sprint Release Notes & Semantic Changelog Engine */}
      {showReleaseNotesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-indigo-50/40">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Sprint Release Notes & KeepAChangelog Engine</h3>
                  <span className="text-[11px] text-slate-500">Autonomous synthesis across all triaged tickets, fixes, and specs</span>
                </div>
              </div>
              <button
                onClick={() => setShowReleaseNotesModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
              {/* Version Controls */}
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <span className="font-semibold text-slate-700">Target Version:</span>
                <input
                  type="text"
                  value={releaseVersionInput}
                  onChange={(e) => setReleaseVersionInput(e.target.value)}
                  className="px-2.5 py-1 border border-slate-200 rounded-lg text-xs font-mono font-bold w-24 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  onClick={() => fetchSprintReleaseNotes(releaseVersionInput)}
                  disabled={generatingReleaseNotes}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition cursor-pointer"
                >
                  {generatingReleaseNotes ? 'Synthesizing...' : 'Re-generate'}
                </button>
              </div>

              {/* Published GitHub Release Banner */}
              {publishedReleaseDraftResult && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <div>
                      <div className="font-bold text-emerald-900 text-xs">
                        Official GitHub Release Draft Created: {publishedReleaseDraftResult.tagName}
                      </div>
                      <div className="text-[11px] text-emerald-700">
                        Release draft published to {publishedReleaseDraftResult.name}
                      </div>
                    </div>
                  </div>
                  <a
                    href={publishedReleaseDraftResult.releaseUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-xs"
                  >
                    View Release on GitHub <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {generatingReleaseNotes ? (
                <div className="p-12 text-center space-y-2">
                  <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin mx-auto" />
                  <p className="text-slate-600 font-medium">Categorizing closed issues, bug fixes, reliability patches, and PRDs...</p>
                </div>
              ) : activeReleaseNotes ? (
                <div className="space-y-4">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      v{activeReleaseNotes.version} • {activeReleaseNotes.releaseDate}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{activeReleaseNotes.releaseTitle}</h4>
                    <p className="text-slate-600 text-xs leading-relaxed mt-1">
                      {activeReleaseNotes.executiveSummary}
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-1.5">
                    <span className="font-bold text-slate-900 uppercase tracking-wide text-[11px] block">
                      🌟 Release Highlights
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-700">
                      {activeReleaseNotes.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Categorized Changes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-2">
                      <span className="font-bold text-indigo-900 text-xs flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Features & Enhancements</span>
                      </span>
                      <div className="space-y-1">
                        {activeReleaseNotes.categories.features.map((f, i) => (
                          <div key={i} className="text-[11px] text-slate-700">
                            <strong>{f.title}</strong>: {f.summary}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-2">
                      <span className="font-bold text-rose-900 text-xs flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5 text-rose-600" />
                        <span>Critical Bug Fixes</span>
                      </span>
                      <div className="space-y-1">
                        {activeReleaseNotes.categories.fixes.map((fx, i) => (
                          <div key={i} className="text-[11px] text-slate-700">
                            <strong className="text-rose-700">[{fx.severity || 'Fix'}]</strong> <strong>{fx.title}</strong>: {fx.summary}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Raw Changelog Markdown */}
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 uppercase tracking-wide text-[11px] block">
                      KeepAChangelog Markdown Preview
                    </span>
                    <div className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-[11px] max-h-48 overflow-y-auto leading-relaxed border border-slate-800">
                      <pre>{activeReleaseNotes.markdownChangelog}</pre>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-2 text-xs">
              <button
                onClick={() => setShowReleaseNotesModal(false)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (activeReleaseNotes) {
                      navigator.clipboard.writeText(activeReleaseNotes.markdownChangelog);
                      setCopiedReleaseNotes(true);
                      setTimeout(() => setCopiedReleaseNotes(false), 2000);
                    }
                  }}
                  className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold px-3 py-1.5 rounded-lg transition shadow-xs flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedReleaseNotes ? 'Copied!' : 'Copy Changelog'}</span>
                </button>

                <button
                  onClick={handlePublishReleaseDraft}
                  disabled={publishingReleaseDraft || !activeReleaseNotes}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold px-3.5 py-1.5 rounded-lg transition shadow-xs flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>{publishingReleaseDraft ? 'Publishing Draft...' : '🚀 Create GitHub Release Draft'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: Multi-Agent Execution DAG Trace Modal */}
      {showDagTraceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-3xl w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Multi-Agent Execution Pipeline Trace</h3>
                  <span className="text-[11px] text-slate-500">Autonomous DAG of Specialist LLM Agents</span>
                </div>
              </div>
              <button
                onClick={() => setShowDagTraceModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Every incoming incident or feature request executes a sequential Directed Acyclic Graph (DAG) of specialized autonomous agents:
            </p>

            <div className="space-y-3">
              {/* Agent 1 */}
              <div className="p-3 bg-purple-50/50 border border-purple-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Triage & Priority Classifier Agent</div>
                    <div className="text-[11px] text-slate-500">Root-cause identification, reproduction steps, acceptance criteria</div>
                  </div>
                </div>
                <div className="text-right text-[11px] text-purple-700 font-mono font-semibold">
                  ~140ms • 99.4% conf
                </div>
              </div>

              {/* Agent 2 */}
              <div className="p-3 bg-indigo-50/50 border border-indigo-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Blast Radius & Dependency Architect</div>
                    <div className="text-[11px] text-slate-500">Service topology mapping, customer exposure %, data integrity risk</div>
                  </div>
                </div>
                <div className="text-right text-[11px] text-indigo-700 font-mono font-semibold">
                  ~85ms • 98.1% conf
                </div>
              </div>

              {/* Agent 3 */}
              <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Reliability & SRE Risk Estimator</div>
                    <div className="text-[11px] text-slate-500">Deployment risk score (0-100), SLA breach probability, MTTR estimation</div>
                  </div>
                </div>
                <div className="text-right text-amber-700 font-mono font-semibold text-[11px]">
                  ~92ms • 97.5% conf
                </div>
              </div>

              {/* Agent 4 */}
              <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    4
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Code Fix & Reproduction Test Synthesizer</div>
                    <div className="text-[11px] text-slate-500">Generates Jest unit regression suite + unified git diff patch</div>
                  </div>
                </div>
                <div className="text-right text-emerald-700 font-mono font-semibold text-[11px]">
                  ~210ms • 96.8% conf
                </div>
              </div>

              {/* Agent 5 */}
              <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    5
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Two-Way Octokit Git & GitHub Engine</div>
                    <div className="text-[11px] text-slate-500">Cuts git feature branch, commits test & patch, opens real Pull Request</div>
                  </div>
                </div>
                <div className="text-right text-blue-700 font-mono font-semibold text-[11px]">
                  ~180ms • Real API
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowDagTraceModal(false)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                Close Trace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: Outage Communication & Executive Briefing */}
      {outageCommsItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-amber-50/50">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-amber-600 animate-pulse" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Incident Outage Communications & StatusPage Dispatcher</h3>
                  <span className="text-[11px] text-slate-500">Executive briefings, enterprise calming notices, and public status broadcasts</span>
                </div>
              </div>
              <button onClick={() => setOutageCommsItem(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
              {generatingOutageComms ? (
                <div className="p-12 text-center space-y-2">
                  <RefreshCw className="w-6 h-6 text-amber-600 animate-spin mx-auto" />
                  <p className="text-slate-600 font-medium">Synthesizing executive brief, customer email, and public status notice...</p>
                </div>
              ) : activeOutageComms ? (
                <div className="space-y-4">
                  {/* Tabs */}
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                    <button
                      onClick={() => setActiveCommsTab('exec')}
                      className={`px-3 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${activeCommsTab === 'exec' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                      👔 Executive Briefing (CEO/VP)
                    </button>
                    <button
                      onClick={() => setActiveCommsTab('customer')}
                      className={`px-3 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${activeCommsTab === 'customer' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                      ✉️ Enterprise Customer Email
                    </button>
                    <button
                      onClick={() => setActiveCommsTab('statuspage')}
                      className={`px-3 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${activeCommsTab === 'statuspage' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                      🌐 Public StatusPage Broadcast
                    </button>
                  </div>

                  {dispatchedExecEmailSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 flex items-center gap-2 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Executive Incident Briefing dispatched live via Gmail SMTP to leadership!</span>
                    </div>
                  )}

                  {activeCommsTab === 'exec' && (
                    <div className="space-y-3">
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 leading-relaxed font-sans text-slate-800 whitespace-pre-line">
                        {activeOutageComms.executiveBriefing}
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={handleDispatchExecEmail}
                          disabled={dispatchingExecEmail || dispatchedExecEmailSuccess}
                          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-lg text-xs transition cursor-pointer flex items-center gap-1.5"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>{dispatchingExecEmail ? 'Dispatching...' : dispatchedExecEmailSuccess ? '✓ Dispatched to Leadership' : '🚀 Dispatch Email via Gmail SMTP'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {activeCommsTab === 'customer' && (
                    <div className="space-y-3">
                      <div className="p-3 bg-slate-100 border border-slate-200 rounded-lg font-mono text-[11px] text-slate-700">
                        <strong>Subject:</strong> {activeOutageComms.customerEmail.subject}
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-slate-200 leading-relaxed text-slate-800 whitespace-pre-line">
                        {activeOutageComms.customerEmail.body}
                      </div>
                    </div>
                  )}

                  {activeCommsTab === 'statuspage' && (
                    <div className="p-4 bg-slate-900 text-slate-100 rounded-lg border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
                          {activeOutageComms.statusPageNotice.status}
                        </span>
                        <span className="font-bold text-sm text-white">{activeOutageComms.statusPageNotice.title}</span>
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed">{activeOutageComms.statusPageNotice.body}</p>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button onClick={() => setOutageCommsItem(null)} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: Security & SOC2 Compliance Audit */}
      {complianceModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Security & SOC2 Type II Compliance Auditor</h3>
                  <span className="text-[11px] text-slate-500">Autonomous scan for PII leaks, credential exposure, and encryption standards</span>
                </div>
              </div>
              <button onClick={() => setComplianceModalItem(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
              {generatingCompliance ? (
                <div className="p-10 text-center space-y-2">
                  <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin mx-auto" />
                  <p className="text-slate-600 font-medium">Scanning ticket payload against SOC2, GDPR, and OWASP standards...</p>
                </div>
              ) : activeComplianceReport ? (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide block">Compliance Status</span>
                      <span className="text-sm font-bold text-emerald-950">{activeComplianceReport.overallStatus}</span>
                      <p className="text-[11px] text-emerald-800 mt-0.5">{activeComplianceReport.summary}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-emerald-700">{activeComplianceReport.score}/100</div>
                      <span className="text-[10px] text-emerald-600 font-medium">Audit Score</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="font-bold text-slate-900 uppercase tracking-wide text-[11px] block">Audit Findings</span>
                    <div className="space-y-2">
                      {activeComplianceReport.findings.map((finding) => (
                        <div key={finding.id} className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-[10px] text-slate-500 bg-slate-100 px-1 rounded">{finding.id}</span>
                              <span className="font-semibold text-slate-900">{finding.standard} Audit Check</span>
                            </div>
                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${finding.severity === 'Passed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                              {finding.severity}
                            </span>
                          </div>
                          <p className="text-slate-600 text-[11px] leading-relaxed">{finding.description}</p>
                          <div className="text-[10px] text-indigo-700 bg-indigo-50/50 p-1.5 rounded">
                            <strong>Remediation:</strong> {finding.remediation}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button onClick={() => setComplianceModalItem(null)} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer">
                Close
              </button>
            </div>
          </div>
        </div>
      )}


      {/* MODAL 9: Add Real Team Member */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Add Real Engineering Teammate</h3>
              </div>
              <button onClick={() => setShowAddMemberModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddRealMember} className="space-y-3 text-xs">
              <div className="bg-indigo-50/80 border border-indigo-200 rounded-lg p-2.5 text-[11px] text-indigo-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-indigo-950">
                  <Zap className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>Direct Dashboard Onboarding:</span>
                </div>
                <p className="leading-relaxed">
                  No need to open GitHub manually! Entering their GitHub username here sends an official GitHub Collaborator invite via API and notifies them via email.
                </p>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan or Engineer Name"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Role / Specialization</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Backend Engineer / SRE"
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">GitHub Username</label>
                  <input
                    type="text"
                    placeholder="e.g. bekizod"
                    value={newMemberGithub}
                    onChange={(e) => setNewMemberGithub(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Max Capacity (Pts)</label>
                  <input
                    type="number"
                    value={newMemberCapacity}
                    onChange={(e) => setNewMemberCapacity(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="colleague@enterprise.com"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Primary Architectural Component</label>
                <input
                  type="text"
                  placeholder="e.g. Stripe Billing & API Gateway"
                  value={newMemberComponent}
                  onChange={(e) => setNewMemberComponent(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingMember || !newMemberName.trim()}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
                >
                  {savingMember ? 'Saving...' : 'Add Team Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 8: Interactive AI TPM Copilot Chat Drawer */}
      {showCopilotDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white h-full max-w-md w-full shadow-2xl flex flex-col overflow-hidden border-l border-slate-200">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">AI Technical PM Copilot</h3>
                  <span className="text-[11px] text-slate-500">Live repository grounding • 24/7 proactive advisor</span>
                </div>
              </div>
              <button onClick={() => setShowCopilotDrawer(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs">
              {copilotChatMessages.map((msg, i) => (
                <div key={i} className={`flex flex-col space-y-1.5 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-3.5 rounded-2xl max-w-[88%] leading-relaxed ${msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-xs shadow-xs'
                      : 'bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200/80 shadow-2xs'
                      }`}
                  >
                    <StandupMarkdown text={msg.content} />
                  </div>

                  {msg.followUps && msg.followUps.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.followUps.map((fu, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendCopilotMessage(fu)}
                          className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition cursor-pointer shadow-2xs"
                        >
                          {fu}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {askingCopilot && (
                <div className="flex items-center gap-2 text-slate-500 text-xs p-2">
                  <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" />
                  <span>TPM Copilot is analyzing live sprint repository data...</span>
                </div>
              )}
            </div>

            {/* Input Footer */}
            <div className="p-3 border-t border-slate-200 bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendCopilotMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={copilotInput}
                  onChange={(e) => setCopilotInput(e.target.value)}
                  placeholder="Ask about sprint risks, debt, velocity, or blockers..."
                  className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={askingCopilot || !copilotInput.trim()}
                  className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg transition cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}


      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full flex flex-col gap-6">
        {/* Intake Card */}
        <section className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200/60">
                <button
                  type="button"
                  onClick={() => setIntakeMode('triage')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${intakeMode === 'triage'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                    }`}
                >
                  Bug Triage & Multi-Agent Analysis
                </button>
                <button
                  type="button"
                  onClick={() => setIntakeMode('prd')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${intakeMode === 'prd'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                    }`}
                >
                  Enterprise Feature PRD
                </button>
              </div>

              <span className="text-[11px] text-slate-400 hidden sm:inline">
                {intakeMode === 'triage'
                  ? 'Runs Multi-Agent Pipeline + Deduplication + Blast Radius'
                  : 'Synthesizes User Stories + Architecture + Success Metrics'}
              </span>
            </div>

            {/* Quick Boilerplate Templates for Fast Testing */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Quick Templates for Fast Testing (Click to pre-fill):</span>
                </span>
                {input && (
                  <button
                    type="button"
                    onClick={() => setInput('')}
                    className="text-[10px] text-slate-400 hover:text-slate-600 cursor-pointer underline"
                  >
                    Clear Input
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {intakeMode === 'triage' ? (
                  <>
                    {triageBoilerplates.map((t, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setInput(t.text)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-100/80 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200/80 hover:border-indigo-200 transition-colors cursor-pointer shadow-2xs"
                        title={t.description}
                      >
                        <span>{t.label}</span>
                      </button>
                    ))}
                  </>
                ) : (
                  <>
                    {prdBoilerplates.map((t, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setInput(t.text)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-100/80 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200/80 hover:border-indigo-200 transition-colors cursor-pointer shadow-2xs"
                        title={t.description}
                      >
                        <span>{t.label}</span>
                      </button>
                    ))}
                  </>
                )}
              </div>
            </div>

            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  intakeMode === 'triage'
                    ? 'Paste error trace, Slack customer complaint, or Sentry incident alert...'
                    : 'Describe product feature request (e.g., Enterprise SAML/Okta Single Sign-On)...'
                }
                rows={3}
                className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-slate-50/50 placeholder:text-slate-400 text-slate-900 leading-relaxed font-mono"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Live connected: GitHub Repository, Gmail SMTP, Google Calendar</span>
              </div>

              <button
                type="submit"
                disabled={submitting || !input.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white transition cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Running Pipeline...' : intakeMode === 'triage' ? 'Run Triage' : 'Generate PRD'}</span>
              </button>
            </div>
          </form>
        </section>

        {/* 2-Column Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
          {/* Left Column: Live GitHub Backlog */}
          <aside className="lg:col-span-4 bg-white border border-slate-200/90 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <GitBranch className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Live GitHub Backlog ({filteredBacklog.length})
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">bekizod/ai_target_repo_name</span>
            </div>

            {/* Backlog Search & Filter */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={backlogSearch}
                  onChange={(e) => setBacklogSearch(e.target.value)}
                  placeholder="Filter backlog issues..."
                  className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-1">
                {(['all', 'bug', 'prd'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setBacklogFilter(mode)}
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize transition cursor-pointer ${backlogFilter === mode
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'text-slate-500 hover:bg-slate-100'
                      }`}
                  >
                    {mode === 'all' ? 'All' : mode === 'bug' ? 'Bugs' : 'PRDs'}
                  </button>
                ))}
              </div>
            </div>

            {/* Issue List */}
            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
              {filteredBacklog.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">No issues found.</div>
              ) : (
                filteredBacklog.map((issue) => {
                  const isP0 = (issue.labels || []).includes('P0') || issue.title.includes('[P0]');
                  const isP1 = (issue.labels || []).includes('P1') || issue.title.includes('[P1]');
                  const isPrd = issue.title.startsWith('[Feature Spec]') || (issue.labels || []).includes('feature-spec');

                  return (
                    <div
                      key={issue.number}
                      className="p-2.5 rounded-lg border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/20 transition space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${isP0
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : isP1
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : isPrd
                                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                          >
                            {isP0 ? 'P0' : isP1 ? 'P1' : isPrd ? 'Epic' : 'P2'}
                          </span>
                          <span className="text-xs font-semibold text-slate-900 truncate">
                            #{issue.number} {issue.title.replace(/^\[(P0|P1|P2|Feature Spec)\]\s*/i, '')}
                          </span>
                        </div>
                        <a
                          href={issue.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-indigo-600 flex-shrink-0"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      <div className="flex flex-wrap items-center gap-1">
                        {(issue.labels || []).slice(0, 3).map((l, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] font-medium px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded"
                          >
                            {l}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </aside>

          {/* Right Column: 3-Tab Operational Center */}
          <div className="lg:col-span-8 space-y-4">
            {/* View Switcher Tabs */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('stream')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${activeTab === 'stream'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Activity Stream ({filteredActivity.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('standup')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${activeTab === 'standup'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Daily Standup Digest</span>
                </button>

                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${activeTab === 'analytics'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Sprint Analytics & Velocity</span>
                </button>

                <button
                  onClick={() => { setActiveTab('capacity'); if (!teamCapacity) { loadCapacity(); } }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${activeTab === 'capacity'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Team Capacity & Balancer</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-500 font-medium">
                {activeTab === 'stream' && <span>Page {currentPage} of {totalPages}</span>}
              </div>
            </div>

            {/* TAB 1: Activity Stream */}
            {activeTab === 'stream' && (
              <div className="space-y-3">
                {/* Filters & Search Toolbar */}
                <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                      <input
                        type="text"
                        value={streamSearch}
                        onChange={(e) => {
                          setStreamSearch(e.target.value);
                          setCurrentPage(1);
                        }}
                        placeholder="Search tickets & specs..."
                        className="pl-8 pr-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 w-44 sm:w-56"
                      />
                    </div>

                    {/* Type Filter */}
                    <select
                      value={streamTypeFilter}
                      onChange={(e) => {
                        setStreamTypeFilter(e.target.value as any);
                        setCurrentPage(1);
                      }}
                      className="px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-hidden"
                    >
                      <option value="all">All Types</option>
                      <option value="triage">Bugs Only</option>
                      <option value="prd">PRDs Only</option>
                      <option value="webhook">Webhooks Only</option>
                      <option value="standup">Standups Only</option>
                    </select>

                    {/* Severity Filter */}
                    <select
                      value={streamSeverityFilter}
                      onChange={(e) => {
                        setStreamSeverityFilter(e.target.value as any);
                        setCurrentPage(1);
                      }}
                      className="px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-hidden"
                    >
                      <option value="all">All Severities</option>
                      <option value="P0">P0 Only</option>
                      <option value="P1">P1 Only</option>
                      <option value="P2">P2 Only</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-400">Per page:</span>
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="px-1.5 py-0.5 text-xs bg-slate-50 border border-slate-200 rounded text-slate-700"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>
                  </div>
                </div>

                {/* Items */}
                {paginatedActivity.length === 0 ? (
                  <div className="bg-white border border-slate-200/90 rounded-xl p-8 text-center text-xs text-slate-500 space-y-2">
                    <Filter className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="font-medium">No activity items match the current filters.</p>
                    <button
                      onClick={() => {
                        setStreamTypeFilter('all');
                        setStreamSeverityFilter('all');
                        setStreamSearch('');
                      }}
                      className="text-indigo-600 font-semibold hover:underline cursor-pointer"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  paginatedActivity.map((item) => {
                    const isExpanded = expandedId === item.id;
                    const isStandup = item.type === 'PROACTIVE_DIGEST';
                    const isPrd = item.type === 'FEATURE_PRD';
                    const isWebhook = item.type === 'WEBHOOK_INCIDENT';
                    const isClosed = item.state === 'closed';

                    return (
                      <div
                        key={item.id}
                        className={`bg-white border rounded-xl overflow-hidden shadow-sm transition ${isClosed ? 'border-slate-200/50 opacity-80' : 'border-slate-200/90'
                          }`}
                      >
                        {/* Header Bar */}
                        <div
                          onClick={() => setExpandedId(isExpanded ? null : item.id)}
                          className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 transition select-none"
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            {isStandup ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex-shrink-0">
                                Standup
                              </span>
                            ) : isPrd ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 flex-shrink-0">
                                PRD Spec
                              </span>
                            ) : (
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${item.triage?.severity === 'P0'
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : item.triage?.severity === 'P1'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                                  }`}
                              >
                                {item.triage?.severity || 'P2'}
                              </span>
                            )}

                            {isClosed && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-200 text-slate-600 flex-shrink-0">
                                Closed
                              </span>
                            )}

                            <span className={`text-xs font-semibold truncate ${isClosed ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                              {isStandup
                                ? 'Daily Sprint Standup Digest'
                                : isPrd
                                  ? `[Feature Spec] ${item.prd?.title}`
                                  : item.triage?.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2.5 flex-shrink-0">
                            {item.pullRequest && (
                              <a
                                href={item.pullRequest.prUrl}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 hover:bg-emerald-100 transition"
                                title="View Live GitHub PR"
                              >
                                <GitPullRequest className="w-3 h-3 text-emerald-600" />
                                <span>PR #{item.pullRequest.prNumber}</span>
                              </a>
                            )}

                            {item.githubIssue && (
                              <a
                                href={item.githubIssue.issueUrl}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 hover:bg-indigo-100 transition"
                              >
                                <span>#{item.githubIssue.issueNumber}</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}

                            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                              {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>

                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                        </div>

                        {/* Collapsible Details */}
                        {isExpanded && (
                          <div className="p-4 border-t border-slate-100 bg-slate-50/40 space-y-4 text-xs">
                            {/* Semantic Deduplication Banner */}
                            {item.deduplication && item.deduplication.isDuplicate && (
                              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2.5 text-amber-900">
                                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                <div className="space-y-0.5">
                                  <div className="font-bold text-xs">
                                    Semantic Duplicate Detected ({item.deduplication.similarityScore}% Similarity Match)
                                  </div>
                                  <p className="text-[11px] text-amber-800">
                                    Matched against open issue #{item.deduplication.matchedIssueNumber} — &quot;{item.deduplication.matchedIssueTitle}&quot;.
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Specialist Multi-Agent Telemetry Badges */}
                            {item.blastRadius && item.reliabilityRisk && (
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-white border border-slate-200 rounded-lg">
                                <div>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Blast Radius</span>
                                  <span className={`text-xs font-bold ${item.blastRadius.blastRadiusScore === 'Critical' ? 'text-rose-700' : 'text-slate-800'
                                    }`}>
                                    {item.blastRadius.blastRadiusScore} Risk
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Customer Exposure</span>
                                  <span className="text-xs font-bold text-slate-800">
                                    {item.blastRadius.customerExposurePercentage}% of active sessions
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Deployment Risk</span>
                                  <span className="text-xs font-bold text-rose-700">
                                    {item.reliabilityRisk.deploymentRiskScore}/100 Score
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Est. MTTR</span>
                                  <span className="text-xs font-bold text-slate-800">
                                    ~{item.reliabilityRisk.estimatedMttrHours} hours
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Problem Summary */}
                            {item.triage?.summary && (
                              <div className="space-y-1">
                                <span className="font-bold text-slate-900 uppercase tracking-wide text-[10px]">Incident Summary</span>
                                <p className="text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                                  {item.triage.summary}
                                </p>
                              </div>
                            )}

                            {/* Acceptance Criteria */}
                            {item.triage?.acceptanceCriteria && (
                              <div className="space-y-1">
                                <span className="font-bold text-slate-900 uppercase tracking-wide text-[10px]">Acceptance Criteria</span>
                                <ul className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5 list-disc pl-4 text-slate-700">
                                  {item.triage.acceptanceCriteria.map((crit, idx) => (
                                    <li key={idx}>{crit}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* PRD Spec View */}
                            {item.prd && (
                              <div className="space-y-3">
                                <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                                  <span className="font-bold text-slate-900 uppercase tracking-wide text-[11px]">Feature PRD Specification</span>
                                  <button
                                    onClick={() => copyToClipboard(item.prd!.markdownPrd, item.id)}
                                    className="text-[11px] text-indigo-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                                  >
                                    <Copy className="w-3 h-3" />
                                    <span>{copiedPrdId === item.id ? 'Copied PRD!' : 'Copy Markdown PRD'}</span>
                                  </button>
                                </div>
                                <div className="bg-white p-3.5 rounded-lg border border-slate-200 max-h-60 overflow-y-auto">
                                  <StandupMarkdown text={item.prd.markdownPrd} />
                                </div>
                              </div>
                            )}

                            {/* Standup Digest View */}
                            {item.digest && (
                              <div className="bg-white p-3.5 rounded-lg border border-slate-200 max-h-80 overflow-y-auto">
                                <StandupMarkdown text={item.digest} />
                              </div>
                            )}

                            {/* Action Toolbar */}
                            <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
                              <div className="flex flex-wrap items-center gap-2">
                                {/* Button 1: AI Implementation Plan */}
                                <button
                                  type="button"
                                  onClick={() => handleGeneratePlan(item)}
                                  disabled={planningIssueNum === item.githubIssue?.issueNumber}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded font-semibold text-[11px] bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition cursor-pointer shadow-2xs"
                                >
                                  <Wrench className="w-3 h-3 text-indigo-600" />
                                  <span>
                                    {planningIssueNum === item.githubIssue?.issueNumber
                                      ? 'Posting to GitHub...'
                                      : plannedSuccessNum === item.githubIssue?.issueNumber
                                        ? '✓ Plan Posted!'
                                        : 'Generate AI Dev Plan'}
                                  </span>
                                </button>

                                {/* Button 2: AI Code Fix & Autonomous PR */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenCodeFixModal(item)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded font-semibold text-[11px] bg-slate-900 text-white hover:bg-slate-800 transition cursor-pointer shadow-xs"
                                >
                                  <GitPullRequest className="w-3 h-3 text-emerald-400" />
                                  <span>🚀 Code Fix & Autonomous PR</span>
                                </button>

                                {/* Outage Comms & StatusPage Button (P0/P1) */}
                                {(item.triage?.severity === 'P0' || item.triage?.severity === 'P1' || isWebhook) && (
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); handleOpenOutageComms(item); }}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded font-semibold text-[11px] bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition cursor-pointer shadow-2xs"
                                  >
                                    <Radio className="w-3 h-3 text-amber-600" />
                                    <span>📢 Outage Comms</span>
                                  </button>
                                )}

                                {/* SOC2 & Security Audit Button */}
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); handleOpenComplianceModal(item); }}
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded font-semibold text-[11px] bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition cursor-pointer shadow-2xs"
                                  title="Run Security & SOC2 Compliance Audit"
                                >
                                  <Lock className="w-3 h-3 text-indigo-600" />
                                  <span>SOC2 Audit</span>
                                </button>

                                {/* Button 3: Incident War Room & RCA (P0/P1) */}
                                {(item.triage?.severity === 'P0' || item.triage?.severity === 'P1' || isWebhook) && (
                                  <button
                                    type="button"
                                    onClick={() => handleOpenWarRoomModal(item)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded font-semibold text-[11px] bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition cursor-pointer shadow-2xs"
                                  >
                                    <ShieldAlert className="w-3 h-3 text-rose-600" />
                                    <span>🚨 Incident War Room & RCA</span>
                                  </button>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                {item.githubIssue && (
                                  <button
                                    type="button"
                                    onClick={() => handleToggleIssueState(item)}
                                    disabled={togglingStateNum === item.githubIssue.issueNumber}
                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded font-medium text-[11px] transition cursor-pointer border ${isClosed
                                      ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                                      : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                                      }`}
                                  >
                                    {isClosed ? (
                                      <>
                                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                        <span>Reopen Issue</span>
                                      </>
                                    ) : (
                                      <>
                                        <XCircle className="w-3 h-3 text-rose-600" />
                                        <span>Close Issue</span>
                                      </>
                                    )}
                                  </button>
                                )}

                                {item.githubIssue && (
                                  <a
                                    href={item.githubIssue.issueUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800"
                                  >
                                    <span>GitHub</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between text-xs">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 rounded border border-slate-200 font-medium transition cursor-pointer flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Previous</span>
                    </button>

                    <span className="text-slate-600 font-medium">
                      Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                    </span>

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 rounded border border-slate-200 font-medium transition cursor-pointer flex items-center gap-1"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Daily Standup Digest */}
            {activeTab === 'standup' && (
              <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                        Daily Engineering Standup Digest
                      </h3>
                      <span className="text-[11px] text-slate-400">
                        Synthesized autonomously across all active issues, blockers, and PRDs
                      </span>
                    </div>
                  </div>

                  {latestStandup && (
                    <button
                      onClick={() => copyToClipboard(latestStandup.digest || '', latestStandup.id)}
                      className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedPrdId === latestStandup.id ? 'Copied!' : 'Copy Digest'}</span>
                    </button>
                  )}
                </div>

                {latestStandup && latestStandup.digest ? (
                  <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/70">
                    <StandupMarkdown text={latestStandup.digest} />
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-slate-500 space-y-2">
                    <Calendar className="w-6 h-6 text-slate-300 mx-auto" />
                    <p>No standup digest generated yet for today.</p>
                    <button
                      onClick={handleStandup}
                      disabled={runningStandup}
                      className="text-indigo-600 font-bold hover:underline cursor-pointer"
                    >
                      Run Standup Synthesis Now
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Sprint Analytics & Velocity */}
            {activeTab === 'analytics' && analytics && (
              <div className="space-y-4">
                {/* 4 KPI Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-sm space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Mean Time to Detect (MTTD)
                    </span>
                    <div className="text-lg font-extrabold text-slate-900">
                      {analytics.kpis.mttdMinutes} min
                    </div>
                    <span className="text-[10px] text-emerald-600 font-medium block">
                      -72% vs manual triage
                    </span>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-sm space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Mean Time to Resolve (MTTR)
                    </span>
                    <div className="text-lg font-extrabold text-slate-900">
                      {analytics.kpis.mttrHours} hrs
                    </div>
                    <span className="text-[10px] text-indigo-600 font-medium block">
                      Automated code fix scaffold
                    </span>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-sm space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      SLA Compliance Rate
                    </span>
                    <div className="text-lg font-extrabold text-emerald-700">
                      {analytics.kpis.slaComplianceRate}%
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium block">
                      Across active sprint
                    </span>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-sm space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Critical Blocker Ratio
                    </span>
                    <div className="text-lg font-extrabold text-rose-700">
                      {analytics.kpis.criticalDefectRatio}%
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium block">
                      {analytics.kpis.p0Count} P0 / {analytics.kpis.p1Count} P1
                    </span>
                  </div>
                </div>

                {/* Sprint Burndown SVG Chart */}
                <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <TrendingDown className="w-4 h-4 text-indigo-600" />
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                        Sprint Burndown & Velocity Trajectory
                      </h4>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                      <div className="flex items-center gap-1">
                        <span className="w-3 h-0.5 bg-indigo-600 inline-block"></span>
                        <span>Actual</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-3 h-0.5 bg-slate-300 border-b border-dashed border-slate-400 inline-block"></span>
                        <span>Ideal</span>
                      </div>
                    </div>
                  </div>

                  {/* SVG Chart */}
                  <div className="h-44 w-full">
                    <svg className="w-full h-full" viewBox="0 0 500 150">
                      <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="40" y1="60" x2="480" y2="60" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="40" y1="100" x2="480" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="40" y1="130" x2="480" y2="130" stroke="#e2e8f0" strokeWidth="1" />

                      <line x1="50" y1="25" x2="470" y2="130" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />

                      <polyline
                        fill="none"
                        stroke="#4f46e5"
                        strokeWidth="2.5"
                        points={analytics.burndown
                          .map((b, idx) => {
                            const x = 50 + idx * 70;
                            const y = 130 - (b.actual / 12) * 105;
                            return `${x},${y}`;
                          })
                          .join(' ')}
                      />

                      {analytics.burndown.map((b, idx) => {
                        const x = 50 + idx * 70;
                        const y = 130 - (b.actual / 12) * 105;
                        return (
                          <g key={idx}>
                            <circle cx={x} cy={y} r="3.5" fill="#ffffff" stroke="#4f46e5" strokeWidth="2" />
                            <text x={x} y="145" textAnchor="middle" fontSize="9" fill="#64748b" fontFamily="sans-serif">
                              {b.day}
                            </text>
                            <text x={x} y={y - 7} textAnchor="middle" fontSize="8" fontWeight="bold" fill="#0f172a" fontFamily="sans-serif">
                              {b.actual}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>

                {/* Component Risk Heatmap */}
                <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                        Architecture & Component Risk Heatmap
                      </h4>
                    </div>
                    <span className="text-[11px] text-slate-500">Live Risk Weighting</span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {analytics.components.map((comp, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between gap-4 text-xs">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-slate-800">{comp.name}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.2 rounded ${comp.riskLevel === 'Critical'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : comp.riskLevel === 'High'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : comp.riskLevel === 'Medium'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'bg-slate-100 text-slate-600'
                              }`}>
                              {comp.riskLevel} Risk ({comp.riskScore}/100)
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${comp.riskLevel === 'Critical'
                                ? 'bg-rose-600'
                                : comp.riskLevel === 'High'
                                  ? 'bg-amber-500'
                                  : comp.riskLevel === 'Medium'
                                    ? 'bg-blue-500'
                                    : 'bg-emerald-500'
                                }`}
                              style={{ width: `${comp.riskScore}%` }}
                            />
                          </div>
                        </div>

                        <div className="text-right text-[11px] text-slate-500 flex-shrink-0 w-24">
                          <div>Active: <strong className="text-slate-800">{comp.activeIssues}</strong></div>
                          <div className="text-[10px] text-slate-400">MTTR: {comp.mttr}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Team Capacity & Engineering Workload Balancer */}
            {activeTab === 'capacity' && (
              !teamCapacity ? (
                <div className="bg-white border border-slate-200/90 rounded-xl p-8 text-center space-y-3">
                  <Users className="w-8 h-8 text-indigo-600 mx-auto animate-pulse" />
                  <h4 className="text-sm font-bold text-slate-900">Loading Sprint Team Capacity...</h4>
                  <p className="text-xs text-slate-500">Calculating workload points across live GitHub collaborators and engineers.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assignmentFeedback && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between shadow-2xs transition-all">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-medium">{assignmentFeedback}</span>
                      </div>
                      <button onClick={() => setAssignmentFeedback(null)} className="text-emerald-700 hover:text-emerald-950 cursor-pointer">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Top Action Header */}
                  <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-indigo-600" />
                        <h3 className="text-base font-bold text-slate-900">Sprint Team Capacity & Workload Balancer</h3>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Live GitHub Sync
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Autonomous backlog allocation across true repository collaborators on <code className="font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded text-[11px]">bekizod/ai_target_repo_name</code>.
                      </p>
                    </div>

                    {/* Primary Action Buttons: Add Real Teammate & Auto-Rebalance */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddMemberModal(true)}
                        id="add-real-teammate-btn"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>➕ Add Real Teammate</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleAutoRebalance}
                        disabled={rebalancingWorkload}
                        id="auto-rebalance-issues-btn"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition cursor-pointer disabled:opacity-50"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>{rebalancingWorkload ? 'Rebalancing Backlog...' : '⚡ Auto-Rebalance Issues'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => loadCapacity()}
                        className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                        title="Refresh Team Roster & GitHub Capacity"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Summary Bar: Points & True Collaborators Counter */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Sprint Backlog Points</span>
                      <div className="text-xl font-extrabold text-slate-900 mt-0.5">{teamCapacity.totalSprintPoints} pts</div>
                    </div>
                    <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Team Utilization Rate</span>
                      <div className="text-xl font-extrabold text-indigo-600 mt-0.5">{teamCapacity.teamUtilizationPercentage}%</div>
                    </div>
                    <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Engineering Members</span>
                      <div className="text-xl font-extrabold text-emerald-600 mt-0.5">{teamCapacity.members.length} Collaborator(s)</div>
                    </div>
                  </div>

                  {/* Autonomous Recommendations Banner */}
                  <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-3.5 space-y-1.5">
                    <span className="font-bold text-indigo-950 text-xs uppercase tracking-wide block flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-indigo-600" />
                      Autonomous Workload Rebalancing Advice:
                    </span>
                    {teamCapacity.rebalanceRecommendations.map((rec: string, i: number) => (
                      <div key={i} className="text-xs text-indigo-900 leading-relaxed font-medium">
                        {rec}
                      </div>
                    ))}
                  </div>

                  {/* True GitHub Collaborators & Teammate Cards */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {teamCapacity.members.map((member: any, idx: number) => (
                      <div key={member.id || idx} className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-sm space-y-3.5 flex flex-col justify-between">
                        {/* Member Header */}
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              {/* Real GitHub Avatar */}
                              <div className="relative">
                                {member.avatar && member.avatar.startsWith('http') ? (
                                  <img
                                    src={member.avatar}
                                    alt={member.name}
                                    className="w-11 h-11 rounded-full border-2 border-indigo-100 object-cover shadow-2xs"
                                  />
                                ) : (
                                  <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-xs text-white ${member.isOverloaded ? 'bg-rose-600' : 'bg-indigo-600'
                                    }`}>
                                    {(member.name || 'TM').slice(0, 2).toUpperCase()}
                                  </div>
                                )}
                              </div>

                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-900 text-sm">{member.name}</span>
                                  {member.githubUsername && (
                                    <a
                                      href={`https://github.com/${member.githubUsername}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1 text-[11px] font-mono text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100"
                                      title="Open GitHub Profile"
                                    >
                                      <span>@{member.githubUsername}</span>
                                      <ExternalLink className="w-2.5 h-2.5" />
                                    </a>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-500 font-medium">{member.role}</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${member.isOverloaded
                                ? 'bg-rose-100 text-rose-800 border-rose-200'
                                : member.capacityPercentage > 80
                                  ? 'bg-amber-100 text-amber-800 border-amber-200'
                                  : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                }`}>
                                {member.isOverloaded ? 'OVERLOADED' : 'HEALTHY'} ({member.capacityPercentage}%)
                              </span>

                              {/* Delete button (if not the primary repository owner) */}
                              {member.githubUsername !== 'bekizod' && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteMember(member.id)}
                                  className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                  title="Remove Teammate"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Workload Progress Bar */}
                          <div className="space-y-1 mt-3">
                            <div className="flex justify-between text-[11px] text-slate-600 font-medium">
                              <span>Sprint Allocation</span>
                              <span>{member.storyPoints} / {member.maxCapacityPoints} pts ({member.assignedIssuesCount} issues)</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${member.isOverloaded
                                  ? 'bg-rose-600'
                                  : member.capacityPercentage > 80
                                    ? 'bg-amber-500'
                                    : 'bg-emerald-500'
                                  }`}
                                style={{ width: `${Math.min(100, member.capacityPercentage)}%` }}
                              />
                            </div>
                          </div>

                          <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 mt-2.5">
                            Specialization: <strong className="text-slate-700">{member.primaryComponent}</strong>
                          </div>
                        </div>

                        {/* Interactive Update Interface: Assigned Tickets & Reassignment Control */}
                        <div className="pt-2 border-t border-slate-100 space-y-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Assigned Tickets & Reassignment ({member.assignedIssues?.length || 0})
                          </span>

                          {member.assignedIssues && member.assignedIssues.length > 0 ? (
                            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                              {member.assignedIssues.map((issue: any) => (
                                <div
                                  key={issue.number}
                                  className="flex items-center justify-between gap-2 p-1.5 bg-slate-50 rounded border border-slate-200/80 text-[11px]"
                                >
                                  <div className="truncate flex-1 min-w-0" title={issue.title}>
                                    <span className="font-mono font-bold text-indigo-700 mr-1.5">#{issue.number}</span>
                                    <span className="text-slate-800 font-medium">{issue.title}</span>
                                  </div>

                                  {/* Reassignment Dropdown Selector (Update Interface) */}
                                  <div className="flex items-center gap-1 shrink-0">
                                    <select
                                      value={member.id}
                                      onChange={(e) => handleAssignIssue(issue.number, e.target.value)}
                                      disabled={assigningIssueNum === issue.number}
                                      className="text-[10px] bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-700 font-medium cursor-pointer hover:border-indigo-400 focus:outline-hidden"
                                      title="Reassign this issue to another teammate"
                                    >
                                      {teamCapacity.members.map((m: any) => (
                                        <option key={m.id} value={m.id}>
                                          {m.id === member.id ? 'Assigned' : `Move to ${m.name}`}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-[11px] text-slate-400 italic py-1">
                              No issues currently allocated to this engineer.
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}

          </div>
        </div>
      </main>
    </div>
  );
}