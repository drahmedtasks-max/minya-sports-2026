export type UserRole =
  | 'top_management'
  | 'minia_leadership'
  | 'university_supervisor'
  | 'system_admin'
  | 'designer'
  | 'public_guest';

export type ColorThemeKey = 'gold' | 'navy' | 'emerald' | 'crimson' | 'purple' | 'custom';
export type HeaderStyleKey = 'gold_obsidian' | 'deep_navy' | 'gradient' | 'clean_slate';

export interface BrandingConfig {
  universityName: string;
  departmentName: string;
  editionTitle: string;
  sloganText: string;
  jubileeText: string;
  universityLogoUrl: string;
  tournamentLogoUrl: string;
  ministryLogoUrl: string;
  primaryColorTheme: ColorThemeKey;
  customAccentHex: string;
  headerStyle: HeaderStyleKey;
  cardRadius: 'medium' | 'large' | 'pill';
  showSecondaryEmblem: boolean;
  watermarkEnabled: boolean;
  lastUpdatedBy?: string;
  lastUpdatedAt?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  university: string;
  phone?: string;
  email?: string;
  avatarBg?: string;
}

export interface SportRule {
  id: string;
  name: string;
  category: 'team' | 'individual' | 'racket';
  gender: 'male_female' | 'male_only';
  genderLabel: string;
  icon: string;
  squadSize: {
    male: number;
    female: number;
    total: number;
    details: string;
  };
  matchDuration: string;
  pointsSystem: string;
  tieBreakerSteps: string[];
  finalStageFormat: string;
  jerseyRules: string;
  specialRules: string[];
  subEvents?: {
    id: number;
    name: string;
    male: boolean;
    female: boolean;
    notes?: string;
  }[];
}

export interface GeneralCondition {
  id: number;
  title: string;
  text: string;
  category: 'eligibility' | 'organization' | 'medical_safety' | 'regulations';
  highlight?: boolean;
}

export interface CrisisScenario {
  id: string;
  title: string;
  situation: string;
  officialResolution: string;
  referencePage: string;
  ruleCode: string;
  severity: 'high' | 'medium' | 'info';
}

export interface ContactPerson {
  name: string;
  role: string;
  phone: string;
  whatsapp: string;
  department: string;
  organization: string;
}

export interface MatchRecord {
  id: string;
  sportId: string;
  sportName: string;
  round: string;
  teamA: string;
  teamB: string;
  scoreA: number | null;
  scoreB: number | null;
  status: 'upcoming' | 'live' | 'finished';
  court: string;
  time: string;
  date: string;
  notes?: string;
}

export interface OfficialProtest {
  id: string;
  protestNumber: string;
  university: string;
  opponentUniversity: string;
  sport: string;
  supervisorName: string;
  supervisorPhone: string;
  feePaid: boolean;
  status: 'pending' | 'accepted' | 'rejected';
  submittedAt: string;
  details: string;
  decisionNotes?: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  university: string;
  requesterName: string;
  requesterPhone: string;
  sport: string;
  subject: string;
  description: string;
  priority: 'urgent' | 'high' | 'normal';
  status: 'under_review' | 'action_taken' | 'resolved';
  createdAt: string;
  assignedTo: string;
  resolutionNotes?: string;
}

export interface BroadcastAlert {
  id: string;
  title: string;
  content: string;
  type: 'urgent' | 'warning' | 'info';
  timestamp: string;
  author: string;
  active: boolean;
}

export interface DelegateBadge {
  id: string;
  fullName: string;
  university: string;
  role: 'player' | 'coach' | 'supervisor' | 'director';
  roleLabel: string;
  sport: string;
  number?: string;
  badgeCode: string;
  qrValue: string;
  nationalIdMasked: string;
}

export interface UniversityMedal {
  id: string;
  universityName: string;
  shortName?: string;
  logoEmoji?: string;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
  points: number;
  rank?: number;
  sportsBreakdown?: {
    [sportName: string]: { gold: number; silver: number; bronze: number };
  };
}

export interface AthleticsAthlete {
  id: string;
  bibNumber: number;
  name: string;
  university: string;
  event: string;
  heat: number;
  heatTime: number;
  reactionTime?: number;
  qualified: boolean;
  qualificationReason?: 'Q' | 'q'; // Q = by place, q = by fastest time
  lane?: number;
  finalTime?: number;
  finalRank?: number;
  status: 'active' | 'dns' | 'dq' | 'finished';
  medal?: 'gold' | 'silver' | 'bronze' | null;
}

export interface AuditCheckItem {
  id: string;
  name: string;
  category: 'links' | 'modals' | 'state' | 'pwa' | 'api' | 'perf';
  status: 'passed' | 'failed' | 'warning' | 'running';
  details: string;
  latencyMs?: number;
}
