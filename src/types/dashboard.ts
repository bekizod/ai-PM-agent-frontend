export interface TriageResult {
  title: string;
  summary: string;
  reproductionSteps: string[];
  acceptanceCriteria: string[];
  severity: 'P0' | 'P1' | 'P2' | 'P3';
  labels: string[];
  requiresUrgentMeeting: boolean;
  suggestedMeetingTopic?: string;
}

export interface BlastRadiusAssessment {
  affectedServices: string[];
  blastRadiusScore: 'Low' | 'Medium' | 'High' | 'Critical';
  customerExposurePercentage: number;
  dataIntegrityRisk: boolean;
  architecturalComponents: string[];
}

export interface ReliabilityRiskMetrics {
  deploymentRiskScore: number;
  slaBreachProbability: 'Low (<10%)' | 'Moderate (10-40%)' | 'High (40-75%)' | 'Critical (>75%)';
  estimatedMttrHours: number;
  canaryRolloutRecommended: boolean;
  mitigationRunbook: string[];
}

export interface DeduplicationMatch {
  isDuplicate: boolean;
  similarityScore: number;
  matchedIssueNumber?: number;
  matchedIssueTitle?: string;
  rationale?: string;
}

export interface CodeFixAndTestScaffold {
  reproductionTestCode: string;
  testFramework: 'Jest' | 'Mocha' | 'PyTest' | 'GoTest';
  proposedFixDiff: string;
  filesToModify: string[];
  technicalTradeoffs: string;
  commitMessage: string;
}

export interface UserStory {
  asA: string;
  iWant: string;
  soThat: string;
  acceptanceCriteria: string[];
}

export interface PrdResult {
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
  id?: string;
  name: string;
  role: string;
  avatar: string;
  githubUsername?: string;
  assignedIssuesCount: number;
  storyPoints: number;
  maxCapacityPoints: number;
  capacityPercentage: number;
  isOverloaded: boolean;
  primaryComponent: string;
  email?: string;
  assignedIssues?: Array<{ number: number; title: string; points: number }>;
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

export interface ActivityItem {
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

export interface GitHubIssueSummary {
  number: number;
  title: string;
  labels: string[];
  url: string;
  state?: string;
}

export interface AnalyticsData {
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

export interface CurrentUser {
  username: string;
  name: string;
  avatarUrl: string;
  email: string;
  role: 'TPM_LEAD' | 'ENGINEER';
}
