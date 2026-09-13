/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  Trophy,
  FileText,
  Scale,
  Users,
  Clock,
  Headphones,
  Award,
  Sparkles,
  Check,
  Share2,
  Printer,
  QrCode,
  Radio,
  Settings,
  AlertTriangle,
  Bell,
  ShieldAlert,
  ShieldCheck,
  Medal,
  Zap,
  ExternalLink,
  Calendar,
} from 'lucide-react';
import { HeroHeader } from './components/HeroHeader';
import { KeyMetrics } from './components/KeyMetrics';
import { DailyMatchesSchedule } from './components/DailyMatchesSchedule';
import { SportsDirectory } from './components/SportsDirectory';
import { GeneralConditionsSection } from './components/GeneralConditionsSection';
import { DisciplineAndArbitration } from './components/DisciplineAndArbitration';
import { DelegationBuilder } from './components/DelegationBuilder';
import { InteractiveTools } from './components/InteractiveTools';
import { SupportContactSection } from './components/SupportContactSection';
import { SportDetailsModal } from './components/SportDetailsModal';
import { LiveMatchTicker } from './components/LiveMatchTicker';
import { RoleSwitcherModal } from './components/RoleSwitcherModal';
import { AdminDashboard } from './components/AdminDashboard';
import { RegulationAiChatbot } from './components/RegulationAiChatbot';
import { DigitalAccreditation } from './components/DigitalAccreditation';
import { DocumentsDownloadHub } from './components/DocumentsDownloadHub';
import { EmergencyReportModal } from './components/EmergencyReportModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { BrandCustomizerModal } from './components/BrandCustomizerModal';
import { MedalTallySection } from './components/MedalTallySection';
import { AthleticsEngineSection } from './components/AthleticsEngineSection';
import { CodeAuditorModal } from './components/CodeAuditorModal';

import {
  SportRule,
  GeneralCondition,
  MatchRecord,
  OfficialProtest,
  SupportTicket,
  BroadcastAlert,
  UserProfile,
  BrandingConfig,
  UniversityMedal,
  AthleticsAthlete,
} from './types';
import {
  OFFICIAL_INFO,
  SPORTS_LIST,
  GENERAL_CONDITIONS,
  INITIAL_MATCHES,
  INITIAL_PROTESTS,
  INITIAL_TICKETS,
  INITIAL_BROADCASTS,
  USER_ROLES_CATALOG,
  DEFAULT_BRANDING,
  INITIAL_MEDAL_TALLY,
  INITIAL_ATHLETICS_ATHLETES,
} from './data/sportsData';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState<SportRule | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Branding & Visual Identity State
  const [branding, setBranding] = useState<BrandingConfig>(() => {
    try {
      const saved = localStorage.getItem('minia_sports_branding');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return DEFAULT_BRANDING;
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isBrandCustomizerOpen, setIsBrandCustomizerOpen] = useState(false);
  const [adminDashboardInitialTab, setAdminDashboardInitialTab] = useState<
    'results' | 'protests' | 'tickets' | 'broadcasts' | 'rules' | 'branding' | 'sysadmin' | undefined
  >(undefined);

  // Active View Tab
  const [activeTabNav, setActiveTabNav] = useState<
    'all' | 'live' | 'matches' | 'medals' | 'athletics' | 'sports' | 'rules' | 'discipline' | 'delegation' | 'badges' | 'documents'
  >('all');

  // Role and User Profile State
  const [currentUser, setCurrentUser] = useState<UserProfile>(USER_ROLES_CATALOG[1]);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isAuditorModalOpen, setIsAuditorModalOpen] = useState(false);

  // Dynamic entities managed across the platform
  const [sports, setSports] = useState<SportRule[]>(SPORTS_LIST);
  const [conditions, setConditions] = useState<GeneralCondition[]>(GENERAL_CONDITIONS);
  const [matches, setMatches] = useState<MatchRecord[]>(INITIAL_MATCHES);
  const [medals, setMedals] = useState<UniversityMedal[]>(INITIAL_MEDAL_TALLY);
  const [athletes, setAthletes] = useState<AthleticsAthlete[]>(INITIAL_ATHLETICS_ATHLETES);
  const [protests, setProtests] = useState<OfficialProtest[]>(INITIAL_PROTESTS);
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [broadcasts, setBroadcasts] = useState<BroadcastAlert[]>(INITIAL_BROADCASTS);
  const [dismissedBroadcastIds, setDismissedBroadcastIds] = useState<string[]>([]);

  // Sync state from server on mount
  useEffect(() => {
    fetch('/api/system-state')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Failed to fetch state');
      })
      .then((data) => {
        if (data.matches) setMatches(data.matches);
        if (data.protests) setProtests(data.protests);
        if (data.tickets) setTickets(data.tickets);
        if (data.broadcasts) setBroadcasts(data.broadcasts);
      })
      .catch(() => {
        // use initial defaults safely
      });

    // Sync branding from server
    fetch('/api/branding')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Failed to fetch branding');
      })
      .then((data) => {
        if (data.branding) {
          setBranding(data.branding);
          try {
            localStorage.setItem('minia_sports_branding', JSON.stringify(data.branding));
          } catch (e) {}
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveBranding = (updatedBranding: BrandingConfig) => {
    setBranding(updatedBranding);
    try {
      localStorage.setItem('minia_sports_branding', JSON.stringify(updatedBranding));
    } catch (e) {}

    fetch('/api/branding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ branding: updatedBranding }),
    }).catch(() => {});

    showToast('تم حفظ وتطبيق هوية وألوان وشعارات المنصة بنجاح!');
  };

  const handleLoginSuccess = (
    user: UserProfile,
    targetAction?: 'admin_dashboard' | 'design_studio'
  ) => {
    setCurrentUser(user);
    showToast(`تم تسجيل الدخول بنجاح بصلاحية: ${user.name}`);

    if (targetAction === 'admin_dashboard') {
      setAdminDashboardInitialTab('results');
      setIsAdminDashboardOpen(true);
    } else if (targetAction === 'design_studio') {
      setIsBrandCustomizerOpen(true);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const shareData = {
      title: 'الدليل التشغيلي للنشاط الرياضي - أسبوع شباب الجامعات الـ 14 - جامعة المنيا',
      text: 'الدليل التشغيلي الميداني واللائحة المنظمة للنشاط الرياضي بأسبوع شباب الجامعات الـ 14 بجامعة المنيا',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast('تمت المشاركة بنجاح');
        return;
      } catch (err) {
        // user cancelled or fallback
      }
    }

    navigator.clipboard.writeText(window.location.href);
    showToast('تم نسخ رابط المنصة والدليل التشغيلي إلى الحافظة!');
  };

  const scrollToSection = (id: string) => {
    if (activeTabNav !== 'all') {
      setActiveTabNav('all');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Active Broadcast Alerts that haven't been dismissed
  const activeAlerts = broadcasts.filter(
    (bc) => bc.active && !dismissedBroadcastIds.includes(bc.id)
  );

  const handleDismissAlert = (id: string) => {
    setDismissedBroadcastIds((prev) => [...prev, id]);
  };

  const handleUpdateMatchScore = (updatedMatch: MatchRecord) => {
    setMatches((prev) => prev.map((m) => (m.id === updatedMatch.id ? updatedMatch : m)));
    fetch('/api/matches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedMatch),
    }).catch(() => {});
    showToast(`تم تحديث نتيجة مباراة: ${updatedMatch.sportName}`);
  };

  const handleAddMatch = (newMatch: MatchRecord) => {
    setMatches((prev) => [newMatch, ...prev]);
    fetch('/api/matches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMatch),
    }).catch(() => {});
    showToast(`تم إدراج مباراة جديدة بجدول اليوم: ${newMatch.sportName}`);
  };

  const handleAwardMedal = (universityId: string, type: 'gold' | 'silver' | 'bronze', sportName: string) => {
    setMedals((prev) =>
      prev.map((u) => {
        if (u.id !== universityId) return u;
        const g = u.gold + (type === 'gold' ? 1 : 0);
        const s = u.silver + (type === 'silver' ? 1 : 0);
        const b = u.bronze + (type === 'bronze' ? 1 : 0);
        const pts = g * 7 + s * 4 + b * 2;
        const sportStats = u.sportsBreakdown?.[sportName] || { gold: 0, silver: 0, bronze: 0 };
        return {
          ...u,
          gold: g,
          silver: s,
          bronze: b,
          total: g + s + b,
          points: pts,
          sportsBreakdown: {
            ...u.sportsBreakdown,
            [sportName]: {
              gold: sportStats.gold + (type === 'gold' ? 1 : 0),
              silver: sportStats.silver + (type === 'silver' ? 1 : 0),
              bronze: sportStats.bronze + (type === 'bronze' ? 1 : 0),
            },
          },
        };
      })
    );
    showToast(
      `تم تتويج الجامعة بالميدالية ${
        type === 'gold' ? 'الذهبية 🥇' : type === 'silver' ? 'الفضية 🥈' : 'البرونزية 🥉'
      } في منافسات ${sportName}!`
    );
  };

  const handleEmergencyReport = (report: any) => {
    const emergencyTicket: SupportTicket = {
      id: `t-${Date.now()}`,
      ticketNumber: `EMERG-${Math.floor(1000 + Math.random() * 9000)}`,
      university: report.university,
      requesterName: report.reporter,
      requesterPhone: 'ميداني',
      sport: report.sport,
      subject: `بلاغ طوارئ: ${report.court}`,
      description: report.details,
      priority: 'urgent',
      status: 'under_review',
      createdAt: 'الآن',
      assignedTo: 'د/ يسري خلاف عبد الباقي',
      resolutionNotes: 'تم الإشعار الفوري لغرفة العمليات.',
    };

    setTickets((prev) => [emergencyTicket, ...prev]);
    showToast('تم إرسال بلاغ الطوارئ إلى غرفة العمليات الرياضية بنجاح!');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 antialiased p-2 sm:p-5 lg:p-7 selection:bg-amber-500 selection:text-slate-950 font-sans">
      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-slate-950 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-6xl mx-auto space-y-5">
        {/* Urgent Broadcast Banner if any */}
        {activeAlerts.length > 0 && (
          <div className="space-y-2 no-print">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`rounded-2xl p-3.5 sm:p-4 border shadow-md flex items-center justify-between gap-3 text-xs animate-in fade-in duration-200 ${
                  alert.type === 'urgent'
                    ? 'bg-red-600 text-white border-red-500'
                    : alert.type === 'warning'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-medium'
                    : 'bg-blue-600 text-white border-blue-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-black/15 flex items-center justify-center shrink-0">
                    <Bell className="w-4 h-4 animate-bounce" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm">{alert.title}</span>
                      <span className="text-[10px] opacity-80">({alert.timestamp})</span>
                    </div>
                    <p className="mt-0.5 opacity-90 leading-snug">{alert.content}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setIsAdminDashboardOpen(true)}
                    className="bg-black/20 hover:bg-black/30 px-2.5 py-1 rounded-lg text-[11px] font-bold transition hidden sm:inline"
                  >
                    لوحة الإدارة
                  </button>
                  <button
                    onClick={() => handleDismissAlert(alert.id)}
                    className="p-1.5 hover:bg-black/20 rounded-lg text-white/90 hover:text-white transition"
                    title="إغلاق التنبيه"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Hero Header */}
        <HeroHeader
          onPrint={handlePrint}
          onShare={handleShare}
          activeQuickTool={null}
          setActiveQuickTool={() => {}}
          currentUser={currentUser}
          branding={branding}
          onOpenRoleSwitcher={() => setIsRoleModalOpen(true)}
          onOpenAdminDashboard={() => {
            setAdminDashboardInitialTab('results');
            setIsAdminDashboardOpen(true);
          }}
          onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
          onOpenBrandCustomizer={() => setIsBrandCustomizerOpen(true)}
        />

        {/* Live Match Ticker */}
        <LiveMatchTicker
          matches={matches}
          userRole={currentUser.role}
          onUpdateMatchScore={handleUpdateMatchScore}
        />

        {/* Search & Navigation Bar */}
        <div className="sticky top-2 z-30 space-y-2.5">
          {/* Quick Search */}
          <div className="relative shadow-md bg-white rounded-2xl border border-slate-200">
            <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              id="searchInput"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في نصوص اللائحة، مدة الأشواط، فض التعادل، قواعد الطعن والجزاءات، أو كوتة الوفد..."
              className="w-full pr-12 pl-12 py-3.5 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-800 placeholder:text-slate-400 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                title="مسح البحث"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Primary View Switcher Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-bold no-print bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/80 shadow-xs">
            <button
              onClick={() => setActiveTabNav('all')}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTabNav === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-xs font-extrabold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>الدليل التشغيلي الشامل</span>
            </button>

            <button
              onClick={() => setActiveTabNav('matches')}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTabNav === 'matches'
                  ? 'bg-amber-500 text-slate-950 shadow-xs font-extrabold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <span>جدول مباريات اليوم ({matches.length})</span>
              {matches.some((m) => m.status === 'live') && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTabNav('medals')}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTabNav === 'medals'
                  ? 'bg-amber-500 text-slate-950 shadow-xs font-extrabold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Medal className="w-3.5 h-3.5 text-amber-500" />
              <span>جدول الميداليات العام</span>
            </button>

            <button
              onClick={() => setActiveTabNav('athletics')}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTabNav === 'athletics'
                  ? 'bg-amber-500 text-slate-950 shadow-xs font-extrabold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-rose-500" />
              <span>محرك ألعاب القوى IAAF</span>
            </button>

            <button
              onClick={() => setActiveTabNav('sports')}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTabNav === 'sports'
                  ? 'bg-amber-500 text-slate-950 shadow-xs font-extrabold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span>الألعاب الـ 6 المعتمدة</span>
            </button>

            <button
              onClick={() => setActiveTabNav('rules')}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTabNav === 'rules'
                  ? 'bg-amber-500 text-slate-950 shadow-xs font-extrabold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-blue-600" />
              <span>الشروط الـ 16 العامة</span>
            </button>

            <button
              onClick={() => setActiveTabNav('discipline')}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTabNav === 'discipline'
                  ? 'bg-amber-500 text-slate-950 shadow-xs font-extrabold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-red-600" />
              <span>الجزاءات والطعون (1000 ج.م)</span>
            </button>

            <button
              onClick={() => setActiveTabNav('delegation')}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTabNav === 'delegation'
                  ? 'bg-amber-500 text-slate-950 shadow-xs font-extrabold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>قوام الوفد (61) والمحاكي</span>
            </button>

            <button
              onClick={() => setActiveTabNav('badges')}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTabNav === 'badges'
                  ? 'bg-amber-500 text-slate-950 shadow-xs font-extrabold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <QrCode className="w-3.5 h-3.5 text-purple-600" />
              <span>البطاقة الذكية والاعتماد (QR)</span>
            </button>

            <button
              onClick={() => setActiveTabNav('documents')}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTabNav === 'documents'
                  ? 'bg-amber-500 text-slate-950 shadow-xs font-extrabold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>الاستمارات الرسمية القابلة للطباعة</span>
            </button>

            <button
              onClick={() => setIsAdminDashboardOpen(true)}
              className="px-3 py-2 rounded-xl bg-slate-900 text-amber-400 hover:bg-slate-800 transition flex items-center gap-1.5 whitespace-nowrap font-extrabold"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>لوحة الإدارة</span>
            </button>

            <button
              onClick={() => setIsAuditorModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900 transition flex items-center gap-1.5 whitespace-nowrap mr-auto font-extrabold"
              title="فحص واختبار الروابط، الأكواد، والنظام البرمجي ذاتياً"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>فحص الأكواد والروابط (Auditor)</span>
            </button>
          </div>
        </div>

        {/* Dynamic Main Body based on Navigation Tab */}

        {/* Tab: All Sections */}
        {activeTabNav === 'all' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Key Metrics Dashboard */}
            <KeyMetrics
              onSelectMetric={(section) => {
                if (section === 'delegation') scrollToSection('delegation-table');
                if (section === 'conditions') scrollToSection('general-conditions');
                if (section === 'protest') scrollToSection('protest-tool');
                if (section === 'crisis') scrollToSection('discipline-arbitration');
              }}
            />

            {/* Daily Matches Schedule Section */}
            <div id="daily-matches-schedule">
              <DailyMatchesSchedule
                matches={matches}
                sports={sports}
                currentUser={currentUser}
                onUpdateMatchScore={handleUpdateMatchScore}
                onAddMatch={handleAddMatch}
                onOpenAdminDashboard={() => {
                  setAdminDashboardInitialTab('results');
                  setIsAdminDashboardOpen(true);
                }}
              />
            </div>

            {/* Olympic Medal Tally Dashboard */}
            <div id="medal-tally">
              <MedalTallySection
                medals={medals}
                onAwardMedal={handleAwardMedal}
                userRole={currentUser.role}
              />
            </div>

            {/* IAAF Athletics Engine */}
            <div id="athletics-engine">
              <AthleticsEngineSection initialAthletes={athletes} />
            </div>

            {/* Interactive Sports Directory */}
            <div id="sports-directory">
              <SportsDirectory
                searchQuery={searchQuery}
                onSelectSport={(sport) => setSelectedSport(sport)}
              />
            </div>

            {/* General Conditions (16 Articles) */}
            <div id="general-conditions">
              <GeneralConditionsSection searchQuery={searchQuery} />
            </div>

            {/* Discipline, Arbitration, Protests & Awards */}
            <div id="discipline-arbitration">
              <DisciplineAndArbitration />
            </div>

            {/* Delegation Quota Table & Interactive Simulator */}
            <div id="delegation-table">
              <DelegationBuilder />
            </div>

            {/* Digital Accreditation Badge Preview */}
            <div id="digital-accreditation">
              <DigitalAccreditation currentUser={currentUser} />
            </div>

            {/* Documents & Download Center */}
            <div id="documents-hub">
              <DocumentsDownloadHub />
            </div>

            {/* Interactive Field Tools: Protest Timer & Crisis Solver */}
            <div id="protest-tool">
              <InteractiveTools />
            </div>

            {/* Support & Contact Cards */}
            <div id="support-contacts">
              <SupportContactSection />
            </div>
          </div>
        )}

        {/* Tab: Daily Matches Schedule Only */}
        {activeTabNav === 'matches' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <DailyMatchesSchedule
              matches={matches}
              sports={sports}
              currentUser={currentUser}
              onUpdateMatchScore={handleUpdateMatchScore}
              onAddMatch={handleAddMatch}
              onOpenAdminDashboard={() => {
                setAdminDashboardInitialTab('results');
                setIsAdminDashboardOpen(true);
              }}
            />
          </div>
        )}

        {/* Tab: Olympic Medal Tally Only */}
        {activeTabNav === 'medals' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <MedalTallySection
              medals={medals}
              onAwardMedal={handleAwardMedal}
              userRole={currentUser.role}
            />
          </div>
        )}

        {/* Tab: IAAF Athletics Engine Only */}
        {activeTabNav === 'athletics' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <AthleticsEngineSection initialAthletes={athletes} />
          </div>
        )}

        {/* Tab: 6 Sports Only */}
        {activeTabNav === 'sports' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <SportsDirectory
              searchQuery={searchQuery}
              onSelectSport={(sport) => setSelectedSport(sport)}
            />
          </div>
        )}

        {/* Tab: 16 Conditions */}
        {activeTabNav === 'rules' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <GeneralConditionsSection searchQuery={searchQuery} />
          </div>
        )}

        {/* Tab: Discipline & Protests */}
        {activeTabNav === 'discipline' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <DisciplineAndArbitration />
            <InteractiveTools />
          </div>
        )}

        {/* Tab: Delegation 61 & Simulator */}
        {activeTabNav === 'delegation' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <DelegationBuilder />
          </div>
        )}

        {/* Tab: Digital Badges & QR Accreditation */}
        {activeTabNav === 'badges' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <DigitalAccreditation currentUser={currentUser} />
          </div>
        )}

        {/* Tab: Printable Official Documents */}
        {activeTabNav === 'documents' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <DocumentsDownloadHub />
          </div>
        )}

        {/* Official Footer */}
        <footer className="text-center text-xs text-slate-500 py-7 border-t border-slate-200/80 space-y-2">
          <div className="font-extrabold text-slate-800 flex items-center justify-center gap-1.5 flex-wrap">
            <span>{OFFICIAL_INFO.university}</span>
            <span>—</span>
            <span>{OFFICIAL_INFO.department}</span>
          </div>
          <p className="text-slate-500 font-medium">
            المنصة الإلكترونية المتكاملة للدليل التشغيلي للنشاط الرياضي بأسبوع شباب الجامعات الـ 14 &copy;{' '}
            {OFFICIAL_INFO.year}
          </p>
          <p className="text-[11px] text-amber-700 font-bold">
            {OFFICIAL_INFO.jubilee} — "{OFFICIAL_INFO.slogan}"
          </p>
        </footer>
      </div>

      {/* Sport Technical Specifications Modal */}
      <SportDetailsModal sport={selectedSport} onClose={() => setSelectedSport(null)} />

      {/* Role Switcher Modal */}
      <RoleSwitcherModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        currentUser={currentUser}
        onSelectUser={(profile) => {
          setCurrentUser(profile);
          showToast(`تم التبديل إلى حساب: ${profile.name}`);
        }}
      />

      {/* Admin Management Dashboard */}
      {isAdminDashboardOpen && (
        <AdminDashboard
          userRole={currentUser.role}
          sports={sports}
          onUpdateSports={setSports}
          conditions={conditions}
          onUpdateConditions={setConditions}
          matches={matches}
          onUpdateMatches={setMatches}
          protests={protests}
          onUpdateProtests={setProtests}
          tickets={tickets}
          onUpdateTickets={setTickets}
          broadcasts={broadcasts}
          onUpdateBroadcasts={setBroadcasts}
          branding={branding}
          onUpdateBranding={handleSaveBranding}
          initialTab={adminDashboardInitialTab}
          onClose={() => setIsAdminDashboardOpen(false)}
        />
      )}

      {/* Admin & Designer Dedicated Login Portal Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Designer Branding & Visual Identity Studio Modal */}
      <BrandCustomizerModal
        isOpen={isBrandCustomizerOpen}
        onClose={() => setIsBrandCustomizerOpen(false)}
        branding={branding}
        onSaveBranding={handleSaveBranding}
      />

      {/* Emergency Incident Report Modal */}
      <EmergencyReportModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        currentUser={currentUser}
        onSubmitReport={handleEmergencyReport}
      />

      {/* Regulation AI Assistant Floating Bot */}
      <RegulationAiChatbot
        currentUser={currentUser}
        onTicketCreated={() => {
          // refresh tickets
          fetch('/api/system-state')
            .then((r) => r.json())
            .then((d) => {
              if (d.tickets) setTickets(d.tickets);
            })
            .catch(() => {});
        }}
      />

      {/* Code & Deep Link Diagnostic Auditor Modal */}
      <CodeAuditorModal
        isOpen={isAuditorModalOpen}
        onClose={() => setIsAuditorModalOpen(false)}
      />
    </div>
  );
}
