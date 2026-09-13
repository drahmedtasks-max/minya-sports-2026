import React, { useState } from 'react';
import {
  UserRole,
  SportRule,
  GeneralCondition,
  MatchRecord,
  OfficialProtest,
  SupportTicket,
  BroadcastAlert,
} from '../types';
import {
  Settings,
  Shield,
  FileEdit,
  Trophy,
  Scale,
  Bell,
  Headphones,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Plus,
  Edit2,
  Edit3,
  Trash2,
  MessageSquare,
  ArrowUpRight,
  ExternalLink,
  Code2,
  Check,
  Radio,
  Send,
  Sparkles,
  Palette,
  Upload,
  Image as ImageIcon,
  Building2,
  RefreshCcw,
} from 'lucide-react';
import { DEFAULT_BRANDING } from '../data/sportsData';
import { BrandingConfig } from '../types';
import { THEME_PALETTES, HEADER_STYLES } from './BrandCustomizerModal';

interface AdminDashboardProps {
  userRole: UserRole;
  sports: SportRule[];
  onUpdateSports: (sports: SportRule[]) => void;
  conditions: GeneralCondition[];
  onUpdateConditions: (conditions: GeneralCondition[]) => void;
  matches: MatchRecord[];
  onUpdateMatches: (matches: MatchRecord[]) => void;
  protests: OfficialProtest[];
  onUpdateProtests: (protests: OfficialProtest[]) => void;
  tickets: SupportTicket[];
  onUpdateTickets: (tickets: SupportTicket[]) => void;
  broadcasts: BroadcastAlert[];
  onUpdateBroadcasts: (broadcasts: BroadcastAlert[]) => void;
  branding?: BrandingConfig;
  onUpdateBranding?: (branding: BrandingConfig) => void;
  initialTab?: 'results' | 'protests' | 'tickets' | 'broadcasts' | 'rules' | 'branding' | 'sysadmin';
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  userRole,
  sports,
  onUpdateSports,
  conditions,
  onUpdateConditions,
  matches,
  onUpdateMatches,
  protests,
  onUpdateProtests,
  tickets,
  onUpdateTickets,
  broadcasts,
  onUpdateBroadcasts,
  branding,
  onUpdateBranding,
  initialTab,
  onClose,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<
    'results' | 'protests' | 'tickets' | 'broadcasts' | 'rules' | 'branding' | 'sysadmin'
  >(initialTab || (userRole === 'designer' ? 'branding' : 'results'));

  // Designer Branding Local State
  const [localBranding, setLocalBranding] = useState<BrandingConfig>(
    branding || DEFAULT_BRANDING
  );
  const [brandingSavedNotice, setBrandingSavedNotice] = useState(false);
  const logoFileRef = React.useRef<HTMLInputElement>(null);
  const emblemFileRef = React.useRef<HTMLInputElement>(null);

  // Match score quick form
  const [newMatchSport, setNewMatchSport] = useState('futsal');
  const [newMatchTeamA, setNewMatchTeamA] = useState('');
  const [newMatchTeamB, setNewMatchTeamB] = useState('');
  const [newMatchCourt, setNewMatchCourt] = useState('الصالة المغطاة الرئيسية');
  const [newMatchTime, setNewMatchTime] = useState('12:00 م');

  // Broadcast quick form
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastContent, setBroadcastContent] = useState('');
  const [broadcastType, setBroadcastType] = useState<'urgent' | 'warning' | 'info'>('urgent');

  // Embedded snippet copy state
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  // New Protest Form
  const [showAddProtest, setShowAddProtest] = useState(false);
  const [newProtestUniv, setNewProtestUniv] = useState('جامعة القاهرة');
  const [newProtestOpponent, setNewProtestOpponent] = useState('جامعة المنيا');
  const [newProtestSport, setNewProtestSport] = useState('خماسي كرة القدم');
  const [newProtestSupervisor, setNewProtestSupervisor] = useState('');
  const [newProtestPhone, setNewProtestPhone] = useState('');
  const [newProtestDetails, setNewProtestDetails] = useState('');

  // Editing rule modal
  const [editingSport, setEditingSport] = useState<SportRule | null>(null);

  // Supervisor Match Score & Status Editor Modal State
  const [editingMatchModal, setEditingMatchModal] = useState<MatchRecord | null>(null);
  const [modalScoreA, setModalScoreA] = useState<number>(0);
  const [modalScoreB, setModalScoreB] = useState<number>(0);
  const [modalStatus, setModalStatus] = useState<'upcoming' | 'live' | 'finished'>('live');
  const [modalNotes, setModalNotes] = useState<string>('');

  const handleSaveModalScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMatchModal) return;
    const updated = matches.map((m) =>
      m.id === editingMatchModal.id
        ? {
            ...m,
            scoreA: modalScoreA,
            scoreB: modalScoreB,
            status: modalStatus,
            notes: modalNotes,
          }
        : m
    );
    onUpdateMatches(updated);
    setEditingMatchModal(null);
  };

  const canManageAll =
    userRole === 'minia_leadership' ||
    userRole === 'top_management' ||
    userRole === 'system_admin';

  // Standings calculator for futsal as an example
  const calculateStandings = () => {
    const table: Record<
      string,
      { played: number; won: number; drawn: number; lost: number; gf: number; ga: number; pts: number }
    > = {};

    matches
      .filter((m) => m.sportId === 'futsal' && m.status === 'finished')
      .forEach((m) => {
        if (!table[m.teamA]) {
          table[m.teamA] = { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0 };
        }
        if (!table[m.teamB]) {
          table[m.teamB] = { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0 };
        }

        const scA = m.scoreA || 0;
        const scB = m.scoreB || 0;

        table[m.teamA].played += 1;
        table[m.teamB].played += 1;
        table[m.teamA].gf += scA;
        table[m.teamA].ga += scB;
        table[m.teamB].gf += scB;
        table[m.teamB].ga += scA;

        if (scA > scB) {
          table[m.teamA].won += 1;
          table[m.teamA].pts += 3;
          table[m.teamB].lost += 1;
        } else if (scA === scB) {
          table[m.teamA].drawn += 1;
          table[m.teamA].pts += 1;
          table[m.teamB].drawn += 1;
          table[m.teamB].pts += 1;
        } else {
          table[m.teamB].won += 1;
          table[m.teamB].pts += 3;
          table[m.teamA].lost += 1;
        }
      });

    return Object.entries(table).sort((a, b) => {
      if (b[1].pts !== a[1].pts) return b[1].pts - a[1].pts;
      const diffB = b[1].gf - b[1].ga;
      const diffA = a[1].gf - a[1].ga;
      if (diffB !== diffA) return diffB - diffA;
      return b[1].gf - a[1].gf;
    });
  };

  const handleAddMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatchTeamA || !newMatchTeamB) return;

    const sportObj = sports.find((s) => s.id === newMatchSport);
    const newM: MatchRecord = {
      id: `m-${Date.now()}`,
      sportId: newMatchSport,
      sportName: sportObj ? sportObj.name : 'مسابقة رياضية',
      round: 'دور المجموعات',
      teamA: newMatchTeamA,
      teamB: newMatchTeamB,
      scoreA: null,
      scoreB: null,
      status: 'upcoming',
      court: newMatchCourt,
      time: newMatchTime,
      date: 'اليوم',
    };

    onUpdateMatches([newM, ...matches]);
    setNewMatchTeamA('');
    setNewMatchTeamB('');
  };

  const handleCreateBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastContent) return;

    const newBc: BroadcastAlert = {
      id: `bc-${Date.now()}`,
      title: broadcastTitle,
      content: broadcastContent,
      type: broadcastType,
      timestamp: 'الآن',
      author:
        userRole === 'minia_leadership'
          ? 'د/ أحمد بسيوني - إدارة النشاط الرياضي'
          : 'اللجنة المنظمة العليا',
      active: true,
    };

    onUpdateBroadcasts([newBc, ...broadcasts]);
    setBroadcastTitle('');
    setBroadcastContent('');
  };

  const handleUpdateProtestStatus = (
    protestId: string,
    status: 'accepted' | 'rejected' | 'pending',
    notes: string
  ) => {
    const updated = protests.map((p) => {
      if (p.id === protestId) {
        return { ...p, status, decisionNotes: notes };
      }
      return p;
    });
    onUpdateProtests(updated);
  };

  const handleUpdateTicketStatus = (
    ticketId: string,
    status: 'under_review' | 'action_taken' | 'resolved',
    resolutionNotes: string
  ) => {
    const updated = tickets.map((t) => {
      if (t.id === ticketId) {
        return { ...t, status, resolutionNotes };
      }
      return t;
    });
    onUpdateTickets(updated);
  };

  const handleAddProtestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProtestDetails || !newProtestSupervisor) return;

    const newPr: OfficialProtest = {
      id: `pr-${Date.now()}`,
      protestNumber: `PROTEST-2026-${String(protests.length + 1).padStart(3, '0')}`,
      university: newProtestUniv,
      opponentUniversity: newProtestOpponent,
      sport: newProtestSport,
      supervisorName: newProtestSupervisor,
      supervisorPhone: newProtestPhone || '010XXXXXXXX',
      feePaid: true,
      status: 'pending',
      submittedAt: 'الآن (خلال مهلة الـ 60 دقيقة القانونية)',
      details: newProtestDetails,
      decisionNotes: 'قيد الفحص والدراسة بمعرفة اللجنة الفنية والتحكيمية المنظمة.',
    };

    onUpdateProtests([newPr, ...protests]);
    setShowAddProtest(false);
    setNewProtestDetails('');
    setNewProtestSupervisor('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-900 text-white rounded-3xl shadow-2xl max-w-5xl w-full h-[92vh] flex flex-col overflow-hidden border border-slate-700">
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg">
                  لوحة الإدارة والتحكم الميداني واللوائح
                </h3>
                <span className="text-[11px] bg-amber-500 text-slate-950 font-extrabold px-2.5 py-0.5 rounded-full">
                  Admin Console
                </span>
              </div>
              <p className="text-xs text-slate-400">
                إدارة أسبوع شباب الجامعات الـ 14 - جامعة المنيا (من قلب الصعيد .. نبدع)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition"
          >
            إغلاق اللوحة ✕
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-4 flex items-center gap-1.5 overflow-x-auto text-xs py-2">
          <button
            onClick={() => setActiveAdminTab('results')}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeAdminTab === 'results'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>المباريات والنتائج والترتيب</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('protests')}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeAdminTab === 'protests'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>سجل الطعون والاحتجاجات ({protests.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('tickets')}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeAdminTab === 'tickets'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Headphones className="w-4 h-4" />
            <span>تذاكر الدعم والتحويل الذكي ({tickets.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('broadcasts')}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeAdminTab === 'broadcasts'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>التنبيهات الفورية العاجلة</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('rules')}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeAdminTab === 'rules'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileEdit className="w-4 h-4" />
            <span>محرر اللوائح والقواعد</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('branding')}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeAdminTab === 'branding'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>استوديو الهوية وتخصيص التصميم (المصمم)</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('sysadmin')}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeAdminTab === 'sysadmin'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>تضمين النظام والربط (Google Sites)</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: RESULTS & STANDINGS */}
          {activeAdminTab === 'results' && (
            <div className="space-y-6">
              {/* Schedule New Match Form */}
              {canManageAll && (
                <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700">
                  <h4 className="font-bold text-sm text-amber-400 mb-3 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>جدولة مباراة جديدة في جدول المنافسات</span>
                  </h4>

                  <form
                    onSubmit={handleAddMatch}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs"
                  >
                    <div>
                      <label className="block text-slate-300 mb-1">اللعبة:</label>
                      <select
                        value={newMatchSport}
                        onChange={(e) => setNewMatchSport(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white"
                      >
                        {sports.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1">الفريق الأول (طرف أ):</label>
                      <input
                        type="text"
                        required
                        value={newMatchTeamA}
                        onChange={(e) => setNewMatchTeamA(e.target.value)}
                        placeholder="مثال: جامعة المنيا"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1">الفريق الثاني (طرف ب):</label>
                      <input
                        type="text"
                        required
                        value={newMatchTeamB}
                        onChange={(e) => setNewMatchTeamB(e.target.value)}
                        placeholder="مثال: جامعة القاهرة"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1">الملعب / الصالة:</label>
                      <input
                        type="text"
                        value={newMatchCourt}
                        onChange={(e) => setNewMatchCourt(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white"
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>إضافة للمباريات</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Current Matches Table */}
              <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700">
                <h4 className="font-bold text-sm text-slate-200 mb-3 flex items-center justify-between">
                  <span>جدول كافة المباريات والنتائج الميدانية</span>
                  <span className="text-xs text-amber-400 font-medium">
                    إجمالي المباريات: {matches.length}
                  </span>
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-400 pb-2">
                        <th className="py-2">المسابقة</th>
                        <th>الفريقان</th>
                        <th className="text-center">النتيجة</th>
                        <th>الحالة</th>
                        <th>الملعب والموعد</th>
                        {canManageAll && <th className="text-left">إجراءات</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      {matches.map((m) => (
                        <tr key={m.id} className="hover:bg-slate-750">
                          <td className="py-3 font-semibold text-amber-400">{m.sportName}</td>
                          <td>
                            <div className="font-bold text-slate-200">
                              {m.teamA} <span className="text-slate-500 font-normal">ضد</span>{' '}
                              {m.teamB}
                            </div>
                            <span className="text-[10px] text-slate-400">{m.round}</span>
                          </td>
                          <td className="text-center font-mono font-extrabold text-sm text-amber-300">
                            {m.scoreA !== null ? `${m.scoreA} - ${m.scoreB}` : 'لم تبدأ'}
                          </td>
                          <td>
                            {m.status === 'live' && (
                              <span className="bg-red-950 text-red-400 border border-red-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                جارية الآن
                              </span>
                            )}
                            {m.status === 'finished' && (
                              <span className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full text-[10px]">
                                انتهت
                              </span>
                            )}
                            {m.status === 'upcoming' && (
                              <span className="bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded-full text-[10px]">
                                قادمة
                              </span>
                            )}
                          </td>
                          <td className="text-slate-300 text-[11px]">
                            <div>{m.court}</div>
                            <div className="text-slate-500">{m.time}</div>
                          </td>
                          {canManageAll && (
                            <td className="text-left">
                              <div className="flex items-center gap-1.5 justify-end">
                                <button
                                  onClick={() => {
                                    setEditingMatchModal(m);
                                    setModalScoreA(m.scoreA !== null ? m.scoreA : 0);
                                    setModalScoreB(m.scoreB !== null ? m.scoreB : 0);
                                    setModalStatus(m.status);
                                    setModalNotes(m.notes || '');
                                  }}
                                  className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold rounded-lg text-[11px] transition flex items-center gap-1 border border-amber-500/40"
                                  title="تحديث النتيجة فورياً"
                                >
                                  <Edit3 className="w-3 h-3" />
                                  <span>تحديث</span>
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm(`حذف مباراة ${m.teamA} ضد ${m.teamB}؟`)) {
                                      const updated = matches.filter((x) => x.id !== m.id);
                                      onUpdateMatches(updated);
                                    }
                                  }}
                                  className="text-red-400 hover:text-red-300 p-1 rounded-lg hover:bg-red-500/10 transition"
                                  title="حذف المباراة"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Supervisor Quick Edit Modal in Admin Dashboard */}
                {editingMatchModal && (
                  <div className="mt-4 p-4 bg-slate-900 rounded-2xl border border-amber-500/40 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <Edit3 className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold text-white">
                          تحديث النتيجة فورياً: {editingMatchModal.teamA} ضد {editingMatchModal.teamB} ({editingMatchModal.sportName})
                        </span>
                      </div>
                      <button
                        onClick={() => setEditingMatchModal(null)}
                        className="text-xs text-slate-400 hover:text-white"
                      >
                        إلغاء
                      </button>
                    </div>
                    <form onSubmit={handleSaveModalScore} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-400 mb-1">أهداف/نقاط {editingMatchModal.teamA}:</label>
                        <input
                          type="number"
                          min="0"
                          value={modalScoreA}
                          onChange={(e) => setModalScoreA(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">أهداف/نقاط {editingMatchModal.teamB}:</label>
                        <input
                          type="number"
                          min="0"
                          value={modalScoreB}
                          onChange={(e) => setModalScoreB(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">حالة اللقاء:</label>
                        <select
                          value={modalStatus}
                          onChange={(e) => setModalStatus(e.target.value as any)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-bold"
                        >
                          <option value="upcoming">قادمة (لم تبدأ)</option>
                          <option value="live">جارية الآن (مباشر)</option>
                          <option value="finished">انتهت رسمياً</option>
                        </select>
                      </div>
                      <div className="flex items-end">
                        <button
                          type="submit"
                          className="w-full py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl shadow transition"
                        >
                          حفظ النتيجة
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>

              {/* Automatic Standings Table */}
              <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700">
                <h4 className="font-bold text-sm text-slate-200 mb-2">
                  جدول الترتيب المحسوب آلياً (خماسي كرة القدم)
                </h4>
                <p className="text-xs text-slate-400 mb-3">
                  يتم الترتيب وفقاً للبند رابعاً: النقاط (3/1/0) ثم فارق الأهداف (له - عليه) ثم
                  الأهداف المسجلة
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-400">
                        <th className="py-2">الترتيب</th>
                        <th>الجامعة</th>
                        <th className="text-center">لعب</th>
                        <th className="text-center">فاز</th>
                        <th className="text-center">تعادل</th>
                        <th className="text-center">خسر</th>
                        <th className="text-center">له</th>
                        <th className="text-center">عليه</th>
                        <th className="text-center">فارق</th>
                        <th className="text-center font-bold text-amber-400">النقاط</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      {calculateStandings().map(([team, stats], index) => (
                        <tr key={team} className="hover:bg-slate-750">
                          <td className="py-2.5 font-bold text-amber-400">#{index + 1}</td>
                          <td className="font-bold text-slate-200">{team}</td>
                          <td className="text-center font-mono">{stats.played}</td>
                          <td className="text-center font-mono text-emerald-400">{stats.won}</td>
                          <td className="text-center font-mono text-slate-400">{stats.drawn}</td>
                          <td className="text-center font-mono text-red-400">{stats.lost}</td>
                          <td className="text-center font-mono">{stats.gf}</td>
                          <td className="text-center font-mono">{stats.ga}</td>
                          <td className="text-center font-mono text-blue-300">
                            {stats.gf - stats.ga > 0 ? `+${stats.gf - stats.ga}` : stats.gf - stats.ga}
                          </td>
                          <td className="text-center font-mono font-extrabold text-sm text-amber-400">
                            {stats.pts}
                          </td>
                        </tr>
                      ))}
                      {calculateStandings().length === 0 && (
                        <tr>
                          <td colSpan={10} className="py-4 text-center text-slate-500">
                            لا توجد مباريات منتهية حتى الآن لاحتساب الترتيب
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROTESTS & APPEALS */}
          {activeAdminTab === 'protests' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800 p-4 rounded-2xl border border-slate-700">
                <div>
                  <h4 className="font-bold text-sm text-white">
                    سجل الطعون والاحتجاجات الرسمية الميدانية
                  </h4>
                  <p className="text-xs text-slate-400">
                    رسم الطعن: 1000 جنيه مصري | المهلة القانونية: 60 دقيقة فقط من صافرة النهاية
                  </p>
                </div>

                <button
                  onClick={() => setShowAddProtest(true)}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>تسجيل طعن رسمي جديد</span>
                </button>
              </div>

              {/* Protests Cards */}
              <div className="grid gap-3">
                {protests.map((pr) => (
                  <div
                    key={pr.id}
                    className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-3"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-700 pb-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-400 text-sm">
                            {pr.protestNumber}
                          </span>
                          <span className="text-xs font-bold text-slate-300">
                            {pr.university} ضد {pr.opponentUniversity}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          المسابقة: <strong className="text-slate-200">{pr.sport}</strong> |
                          المشرف المعتمد: {pr.supervisorName} ({pr.supervisorPhone})
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {pr.feePaid && (
                          <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            ✓ تم سداد الـ 1000 ج.م
                          </span>
                        )}

                        {pr.status === 'pending' && (
                          <span className="bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            قيد المراجعة الفنية
                          </span>
                        )}
                        {pr.status === 'accepted' && (
                          <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            تم قبول الطعن (استرداد الرسم)
                          </span>
                        )}
                        {pr.status === 'rejected' && (
                          <span className="bg-red-950 text-red-300 border border-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            تم رفض الطعن (مصادرة الرسم)
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-750">
                      <p className="font-bold text-slate-400 text-[11px] mb-1">نص وموضوع الطعن:</p>
                      <p>{pr.details}</p>
                      <span className="text-[10px] text-slate-500 block mt-1">
                        توقيت التقديم: {pr.submittedAt}
                      </span>
                    </div>

                    {pr.decisionNotes && (
                      <div className="text-xs text-amber-200/90 bg-amber-950/40 p-3 rounded-xl border border-amber-800/40">
                        <p className="font-bold text-amber-400 text-[11px] mb-0.5">
                          قرار اللجنة المنظمة العليا:
                        </p>
                        <p>{pr.decisionNotes}</p>
                      </div>
                    )}

                    {/* Committee Actions */}
                    {canManageAll && (
                      <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-700/60">
                        <button
                          onClick={() =>
                            handleUpdateProtestStatus(
                              pr.id,
                              'accepted',
                              'تم قبول الطعن شكلاً وموضوعاً بعد التحقق، مع رد رسم الـ 1000 جنيه للجامعة وتعديل النتيجة.'
                            )
                          }
                          className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>قبول الطعن رسمياً</span>
                        </button>

                        <button
                          onClick={() =>
                            handleUpdateProtestStatus(
                              pr.id,
                              'rejected',
                              'تم رفض الطعن استناداً لعدم كفاية الأدلة أو حظر الاعتراض على قرارات الحكام، وتؤول الرسوم للجنة المنظمة.'
                            )
                          }
                          className="px-3 py-1.5 rounded-xl bg-red-700 hover:bg-red-600 text-white text-xs font-bold transition flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>رفض الطعن</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TICKETS & ESCALATIONS */}
          {activeAdminTab === 'tickets' && (
            <div className="space-y-4">
              <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">
                    تذاكر الدعم الميداني المحالة عبر الذكاء الاصطناعي والمشرفين
                  </h4>
                  <p className="text-xs text-slate-400">
                    متابعة مباشرة ومربوطة بالواتساب مع د/ أحمد بسيوني ود/ يسري خلاف
                  </p>
                </div>
                <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-400 px-3 py-1 rounded-xl border border-amber-500/30">
                  {tickets.filter((t) => t.status !== 'resolved').length} تذاكر مفتوحة
                </span>
              </div>

              <div className="grid gap-3">
                {tickets.map((t) => (
                  <div
                    key={t.id}
                    className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-3"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-700 pb-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-400 text-sm">
                            {t.ticketNumber}
                          </span>
                          <span className="text-xs font-bold text-white">{t.subject}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          الجامعة: <strong className="text-slate-200">{t.university}</strong> |
                          المقدم: {t.requesterName} ({t.requesterPhone})
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {t.status === 'under_review' && (
                          <span className="bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            قيد المراجعة
                          </span>
                        )}
                        {t.status === 'action_taken' && (
                          <span className="bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            تم اتخاذ إجراء
                          </span>
                        )}
                        {t.status === 'resolved' && (
                          <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            تم الحل والإغلاق
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-750">
                      <p className="font-bold text-slate-400 text-[11px] mb-1">تفاصيل البلاغ:</p>
                      <p>{t.description}</p>
                      <span className="text-[10px] text-slate-500 block mt-1">
                        وقت الإنشاء: {t.createdAt} | المحال إليه: {t.assignedTo}
                      </span>
                    </div>

                    {t.resolutionNotes && (
                      <div className="text-xs text-emerald-200 bg-emerald-950/40 p-3 rounded-xl border border-emerald-800/40">
                        <p className="font-bold text-emerald-400 text-[11px] mb-0.5">
                          إجراء وملاحظات اللجنة المنظمة:
                        </p>
                        <p>{t.resolutionNotes}</p>
                      </div>
                    )}

                    {/* Quick WhatsApp Reply & Status Change */}
                    <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-700/60 flex-wrap">
                      <a
                        href={`https://wa.me/201007232345?text=${encodeURIComponent(
                          `رد بخصوص تذكرة (${t.ticketNumber}) - ${t.university}: `
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>رد فوري عبر الواتساب للمشرف</span>
                      </a>

                      {canManageAll && (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() =>
                              handleUpdateTicketStatus(
                                t.id,
                                'action_taken',
                                'تم التدخل الميداني والتنسيق مع المشرفين والحكام لحل المشكلة.'
                              )
                            }
                            className="px-2.5 py-1 rounded-lg bg-blue-600/80 hover:bg-blue-600 text-white text-[11px] font-medium"
                          >
                            تأكيد الإجراء
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateTicketStatus(
                                t.id,
                                'resolved',
                                'تم حل الشكوى وإغلاق التذكرة بصورة نهائية.'
                              )
                            }
                            className="px-2.5 py-1 rounded-lg bg-emerald-600/80 hover:bg-emerald-600 text-white text-[11px] font-medium"
                          >
                            إغلاق التذكرة
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: BROADCASTS */}
          {activeAdminTab === 'broadcasts' && (
            <div className="space-y-4">
              {/* Broadcast Send Form */}
              {canManageAll && (
                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-3">
                  <h4 className="font-bold text-sm text-amber-400 flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    <span>إرسال إشعار فوري عاجل يظهر لكافة مستخدمي المنصة</span>
                  </h4>

                  <form onSubmit={handleCreateBroadcast} className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-slate-300 mb-1">عنوان التنبيه:</label>
                        <input
                          type="text"
                          required
                          value={broadcastTitle}
                          onChange={(e) => setBroadcastTitle(e.target.value)}
                          placeholder="مثال: تعديل موعد مباراة / نقل ملعب / تنبيه جوي"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 mb-1">مستوى الأهمية:</label>
                        <select
                          value={broadcastType}
                          onChange={(e) => setBroadcastType(e.target.value as any)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                        >
                          <option value="urgent">🚨 عاجل وهام جداً (أحمر)</option>
                          <option value="warning">⚠️ تنبيه إداري (برتقالي)</option>
                          <option value="info">ℹ️ إشعار عام (أزرق)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1">نص التنبيه:</label>
                      <textarea
                        rows={2}
                        required
                        value={broadcastContent}
                        onChange={(e) => setBroadcastContent(e.target.value)}
                        placeholder="اكتب التوجيهات والتفاصيل الواجب إبلاغها للوفود..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition flex items-center gap-2"
                    >
                      <Radio className="w-4 h-4 text-slate-950" />
                      <span>بث الإشعار فوراً في شريط التنبيهات</span>
                    </button>
                  </form>
                </div>
              )}

              {/* Active Broadcasts */}
              <div className="space-y-2.5">
                <h4 className="font-bold text-sm text-slate-200">الإشعارات النشطة الحالية:</h4>
                {broadcasts.map((bc) => (
                  <div
                    key={bc.id}
                    className={`p-3.5 rounded-2xl border flex items-start justify-between gap-3 ${
                      bc.type === 'urgent'
                        ? 'bg-red-950/40 border-red-800/60 text-red-200'
                        : bc.type === 'warning'
                        ? 'bg-amber-950/40 border-amber-800/60 text-amber-200'
                        : 'bg-blue-950/40 border-blue-800/60 text-blue-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{bc.title}</span>
                        <span className="text-[10px] text-slate-400">({bc.timestamp})</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{bc.content}</p>
                      <span className="text-[10px] text-slate-400 block mt-1">المرسل: {bc.author}</span>
                    </div>

                    {canManageAll && (
                      <button
                        onClick={() => {
                          const updated = broadcasts.filter((x) => x.id !== bc.id);
                          onUpdateBroadcasts(updated);
                        }}
                        className="text-slate-400 hover:text-red-400 p-1"
                        title="إلغاء التنبيه"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: RULES EDITOR */}
          {activeAdminTab === 'rules' && (
            <div className="space-y-4">
              <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                <h4 className="font-bold text-sm text-white mb-1">
                  محرر القواعد واللوائح الرياضية المعتمدة
                </h4>
                <p className="text-xs text-slate-400">
                  يمكن تعديل أزمنة المباريات، أنظمة النقاط، وفض التعادل مع انعكاس فوري في واجهة
                  المستخدم ومستشار الذكاء الاصطناعي
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sports.map((sport) => (
                  <div
                    key={sport.id}
                    className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-2.5"
                  >
                    <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                      <h5 className="font-bold text-sm text-amber-400">{sport.name}</h5>
                      <span className="text-xs text-slate-400 font-mono">
                        قوام الفريق: {sport.squadSize.total}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-300">
                      <p>
                        <strong className="text-slate-400">زمن المباراة:</strong>{' '}
                        {sport.matchDuration}
                      </p>
                      <p>
                        <strong className="text-slate-400">نظام النقاط:</strong>{' '}
                        {sport.pointsSystem}
                      </p>
                      <p>
                        <strong className="text-slate-400">فض التعادل:</strong>{' '}
                        {sport.tieBreakerSteps[0]}
                      </p>
                    </div>

                    {canManageAll && (
                      <button
                        onClick={() => setEditingSport(sport)}
                        className="w-full mt-2 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold text-white transition flex items-center justify-center gap-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>تعديل بنود اللعبة</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SYSADMIN & INTEGRATION */}
          {activeAdminTab === 'sysadmin' && (
            <div className="space-y-4">
              <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-3">
                <h4 className="font-bold text-sm text-amber-400 flex items-center gap-2">
                  <Code2 className="w-4 h-4" />
                  <span>كود التضمين التفاعلي لبوابة جامعة المنيا و Google Sites</span>
                </h4>
                <p className="text-xs text-slate-300">
                  انسخ هذا الكود الجاهز لوضع المنصة والدليل التفاعلي كاملاً داخل موقع جامعة المنيا أو
                  صفحة رعاية الطلاب في Google Sites بكل سلاسة:
                </p>

                <div className="relative">
                  <pre className="bg-slate-950 p-4 rounded-xl text-[11px] text-emerald-400 font-mono overflow-x-auto border border-slate-800 leading-relaxed">
                    {`<!-- كود تضمين الدليل التشغيلي الرياضي - أسبوع شباب الجامعات 14 -->
<iframe 
  src="${window.location.origin}" 
  width="100%" 
  height="900px" 
  frameborder="0" 
  style="border:0; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.15);" 
  allowfullscreen>
</iframe>`}
                  </pre>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`<iframe src="${window.location.origin}" width="100%" height="900px" frameborder="0" style="border:0; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.15);" allowfullscreen></iframe>`);
                      setCopiedEmbed(true);
                      setTimeout(() => setCopiedEmbed(false), 2500);
                    }}
                    className="absolute top-3 left-3 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 border border-slate-700"
                  >
                    {copiedEmbed ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
                    <span>{copiedEmbed ? 'تم النسخ!' : 'نسخ الكود'}</span>
                  </button>
                </div>
              </div>

              {/* System Diagnostics */}
              <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-3">
                <h4 className="font-bold text-sm text-slate-200">حالة الربط والذكاء الاصطناعي:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-750">
                    <span className="text-slate-400 block text-[11px]">محرك الذكاء الاصطناعي</span>
                    <strong className="text-emerald-400 font-bold">Gemini 3.8 Flash (Active)</strong>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-750">
                    <span className="text-slate-400 block text-[11px]">البنية التحتية</span>
                    <strong className="text-white font-bold">Express + Vite Server</strong>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-750">
                    <span className="text-slate-400 block text-[11px]">صلاحية المستخدم الحالي</span>
                    <strong className="text-amber-400 font-bold">{userRole}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: BRANDING & DESIGN STUDIO FOR DESIGNER & SPORTS DIRECTOR */}
          {activeAdminTab === 'branding' && (
            <div className="space-y-6">
              {/* Studio Header Banner */}
              <div className="bg-gradient-to-r from-amber-500/20 via-slate-800 to-slate-800 p-5 rounded-3xl border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-lg">
                    <Palette className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-base text-white">
                        استوديو الهوية البصرية وتخصيص التصميم
                      </h4>
                      <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full">
                        صلاحية المصمم
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      تحكم فوري وشامل في لوجو جامعة المنيا، شعارات البطولة، درجات الألوان، ونمط الهيدر
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <button
                    onClick={() => {
                      if (window.confirm('استعادة التصميم والشعارات الافتراضية؟')) {
                        setLocalBranding(DEFAULT_BRANDING);
                        onUpdateBranding?.(DEFAULT_BRANDING);
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 transition"
                  >
                    <RefreshCcw className="w-3.5 h-3.5" />
                    <span>استعادة الافتراضي</span>
                  </button>

                  <button
                    onClick={() => {
                      onUpdateBranding?.(localBranding);
                      setBrandingSavedNotice(true);
                      setTimeout(() => setBrandingSavedNotice(false), 2500);
                    }}
                    className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-xl shadow-md transition active:scale-95"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{brandingSavedNotice ? 'تم الحفظ وتطبيق التصميم!' : 'حفظ وتطبيق التصميم'}</span>
                  </button>
                </div>
              </div>

              {/* Real-Time Mini Header Preview */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-400 block">
                  معاينة حية للمظهر الجديد:
                </span>
                <div
                  className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r ${
                    localBranding.headerStyle === 'deep_navy'
                      ? 'from-slate-950 via-slate-900 to-blue-950 border-blue-500/40'
                      : localBranding.headerStyle === 'clean_slate'
                      ? 'from-slate-900 via-slate-800 to-slate-900 border-slate-700'
                      : localBranding.headerStyle === 'gradient'
                      ? 'from-slate-950 via-amber-950/80 to-slate-900 border-amber-500/40'
                      : 'from-slate-950 via-slate-900 to-amber-950 border-amber-500/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {localBranding.universityLogoUrl ? (
                      <img
                        src={localBranding.universityLogoUrl}
                        alt="Logo"
                        className="w-12 h-12 object-contain rounded-xl bg-white/10 p-1 border border-white/20"
                      />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center border font-bold"
                        style={{
                          backgroundColor: `${
                            localBranding.primaryColorTheme === 'custom'
                              ? localBranding.customAccentHex || '#f59e0b'
                              : THEME_PALETTES.find((p) => p.key === localBranding.primaryColorTheme)?.hex || '#f59e0b'
                          }33`,
                          borderColor:
                            localBranding.primaryColorTheme === 'custom'
                              ? localBranding.customAccentHex || '#f59e0b'
                              : THEME_PALETTES.find((p) => p.key === localBranding.primaryColorTheme)?.hex || '#f59e0b',
                          color:
                            localBranding.primaryColorTheme === 'custom'
                              ? localBranding.customAccentHex || '#f59e0b'
                              : THEME_PALETTES.find((p) => p.key === localBranding.primaryColorTheme)?.hex || '#f59e0b',
                        }}
                      >
                        <Building2 className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                          style={{
                            backgroundColor: `${
                              localBranding.primaryColorTheme === 'custom'
                                ? localBranding.customAccentHex || '#f59e0b'
                                : THEME_PALETTES.find((p) => p.key === localBranding.primaryColorTheme)?.hex || '#f59e0b'
                            }22`,
                            color:
                              localBranding.primaryColorTheme === 'custom'
                                ? localBranding.customAccentHex || '#f59e0b'
                                : THEME_PALETTES.find((p) => p.key === localBranding.primaryColorTheme)?.hex || '#f59e0b',
                            borderColor: `${
                              localBranding.primaryColorTheme === 'custom'
                                ? localBranding.customAccentHex || '#f59e0b'
                                : THEME_PALETTES.find((p) => p.key === localBranding.primaryColorTheme)?.hex || '#f59e0b'
                            }50`,
                          }}
                        >
                          {localBranding.jubileeText}
                        </span>
                        {localBranding.showSecondaryEmblem && (
                          <span className="text-[10px] bg-blue-500/20 text-blue-200 px-2 py-0.5 rounded-full border border-blue-400/30">
                            شعار البطولة
                          </span>
                        )}
                      </div>
                      <h5 className="font-extrabold text-sm text-white mt-1">
                        {localBranding.editionTitle}
                      </h5>
                      <p
                        className="text-xs"
                        style={{
                          color:
                            localBranding.primaryColorTheme === 'custom'
                              ? localBranding.customAccentHex || '#f59e0b'
                              : THEME_PALETTES.find((p) => p.key === localBranding.primaryColorTheme)?.hex || '#f59e0b',
                        }}
                      >
                        {localBranding.universityName} — "{localBranding.sloganText}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {localBranding.tournamentLogoUrl && (
                      <img
                        src={localBranding.tournamentLogoUrl}
                        alt="Emblem"
                        className="w-10 h-10 object-contain rounded-xl bg-white/10 p-1 border border-white/20"
                      />
                    )}
                    <button
                      type="button"
                      className="px-3.5 py-1.5 rounded-xl font-bold text-xs text-slate-950"
                      style={{
                        backgroundColor:
                          localBranding.primaryColorTheme === 'custom'
                            ? localBranding.customAccentHex || '#f59e0b'
                            : THEME_PALETTES.find((p) => p.key === localBranding.primaryColorTheme)?.hex || '#f59e0b',
                      }}
                    >
                      زر نشط
                    </button>
                  </div>
                </div>
              </div>

              {/* Logos & Emblems Control */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* University Logo Upload */}
                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-amber-400 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4" />
                      لوجو جامعة المنيا (الرسمي)
                    </span>
                    {localBranding.universityLogoUrl && (
                      <button
                        onClick={() =>
                          setLocalBranding((prev) => ({ ...prev, universityLogoUrl: '' }))
                        }
                        className="text-[11px] text-red-400 hover:text-red-300 font-bold"
                      >
                        إزالة اللوجو
                      </button>
                    )}
                  </div>

                  <input
                    ref={logoFileRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        if (typeof reader.result === 'string') {
                          setLocalBranding((prev) => ({
                            ...prev,
                            universityLogoUrl: reader.result as string,
                          }));
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="hidden"
                  />

                  <div
                    onClick={() => logoFileRef.current?.click()}
                    className="border-2 border-dashed border-slate-600 hover:border-amber-400 rounded-xl p-3 text-center cursor-pointer transition bg-slate-900/60 hover:bg-slate-900 flex items-center justify-center gap-2 text-xs text-slate-300"
                  >
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>رفع صورة اللوجو من جهازك (PNG, JPG, SVG)</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 block">أو أدخل رابط اللوجو مباشرة:</label>
                    <input
                      type="url"
                      value={localBranding.universityLogoUrl}
                      onChange={(e) =>
                        setLocalBranding((prev) => ({ ...prev, universityLogoUrl: e.target.value }))
                      }
                      placeholder="https://..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                {/* Tournament Emblem */}
                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-blue-400 flex items-center gap-1.5">
                      <Trophy className="w-4 h-4" />
                      شعار الأسبوع الـ 14 / راية البطولة
                    </span>
                    <label className="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localBranding.showSecondaryEmblem}
                        onChange={(e) =>
                          setLocalBranding((prev) => ({
                            ...prev,
                            showSecondaryEmblem: e.target.checked,
                          }))
                        }
                        className="rounded border-slate-700"
                      />
                      <span>تفعيل في الهيدر</span>
                    </label>
                  </div>

                  <input
                    ref={emblemFileRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        if (typeof reader.result === 'string') {
                          setLocalBranding((prev) => ({
                            ...prev,
                            tournamentLogoUrl: reader.result as string,
                          }));
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="hidden"
                  />

                  <div
                    onClick={() => emblemFileRef.current?.click()}
                    className="border-2 border-dashed border-slate-600 hover:border-blue-400 rounded-xl p-3 text-center cursor-pointer transition bg-slate-900/60 hover:bg-slate-900 flex items-center justify-center gap-2 text-xs text-slate-300"
                  >
                    <Upload className="w-4 h-4 text-blue-400" />
                    <span>رفع شعار البطولة الإضافي من جهازك</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 block">أو أدخل رابط الشعار الإضافي:</label>
                    <input
                      type="url"
                      value={localBranding.tournamentLogoUrl}
                      onChange={(e) =>
                        setLocalBranding((prev) => ({ ...prev, tournamentLogoUrl: e.target.value }))
                      }
                      placeholder="https://..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Color Palettes Selection */}
              <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-3">
                <span className="font-bold text-xs text-amber-400 flex items-center gap-1.5">
                  <Palette className="w-4 h-4" />
                  باليتات الألوان المعتمدة للمنصة:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {THEME_PALETTES.map((p) => {
                    const isSelected =
                      localBranding.primaryColorTheme === p.key &&
                      localBranding.primaryColorTheme !== 'custom';
                    return (
                      <div
                        key={p.key}
                        onClick={() =>
                          setLocalBranding((prev) => ({ ...prev, primaryColorTheme: p.key }))
                        }
                        className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-slate-900 border-amber-400 ring-2 ring-amber-400/20'
                            : 'bg-slate-900/60 hover:bg-slate-900 border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-4 h-4 rounded-full border border-white/20"
                            style={{ backgroundColor: p.hex }}
                          />
                          <span className="text-xs font-bold text-white">{p.name}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                      </div>
                    );
                  })}

                  {/* Custom color option */}
                  <div
                    onClick={() =>
                      setLocalBranding((prev) => ({ ...prev, primaryColorTheme: 'custom' }))
                    }
                    className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                      localBranding.primaryColorTheme === 'custom'
                        ? 'bg-slate-900 border-amber-400 ring-2 ring-amber-400/20'
                        : 'bg-slate-900/60 hover:bg-slate-900 border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={localBranding.customAccentHex || '#f59e0b'}
                        onChange={(e) =>
                          setLocalBranding((prev) => ({
                            ...prev,
                            primaryColorTheme: 'custom',
                            customAccentHex: e.target.value,
                          }))
                        }
                        className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span className="text-xs font-bold text-white">لون مخصص (Hex)</span>
                    </div>
                    {localBranding.primaryColorTheme === 'custom' && (
                      <Check className="w-4 h-4 text-amber-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Header Styles */}
              <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-3">
                <span className="font-bold text-xs text-slate-300">نمط خلفية الهيدر:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {HEADER_STYLES.map((style) => (
                    <div
                      key={style.key}
                      onClick={() =>
                        setLocalBranding((prev) => ({ ...prev, headerStyle: style.key }))
                      }
                      className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                        localBranding.headerStyle === style.key
                          ? 'bg-slate-900 border-amber-400 ring-2 ring-amber-400/20'
                          : 'bg-slate-900/60 hover:bg-slate-900 border-slate-700'
                      }`}
                    >
                      <span className="text-xs font-bold text-white">{style.name}</span>
                      {localBranding.headerStyle === style.key && (
                        <Check className="w-4 h-4 text-amber-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Text Slogans */}
              <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-3">
                <span className="font-bold text-xs text-slate-300">العناوين والشعارات اللفظية:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">الجامعة المضيفة:</label>
                    <input
                      type="text"
                      value={localBranding.universityName}
                      onChange={(e) =>
                        setLocalBranding((prev) => ({ ...prev, universityName: e.target.value }))
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">الشعار اللفظي:</label>
                    <input
                      type="text"
                      value={localBranding.sloganText}
                      onChange={(e) =>
                        setLocalBranding((prev) => ({ ...prev, sloganText: e.target.value }))
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">عنوان الأسبوع:</label>
                    <input
                      type="text"
                      value={localBranding.editionTitle}
                      onChange={(e) =>
                        setLocalBranding((prev) => ({ ...prev, editionTitle: e.target.value }))
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">عبارة اليوبيل الذهبي:</label>
                    <input
                      type="text"
                      value={localBranding.jubileeText}
                      onChange={(e) =>
                        setLocalBranding((prev) => ({ ...prev, jubileeText: e.target.value }))
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal: Add Official Protest */}
        {showAddProtest && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-5 max-w-lg w-full text-white space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="font-bold text-sm text-amber-400">
                  تسجيل طعن رسمي على مباراة (رسم 1000 ج.م)
                </h4>
                <button
                  onClick={() => setShowAddProtest(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddProtestSubmit} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1">الجامعة الطاعنة:</label>
                    <input
                      type="text"
                      required
                      value={newProtestUniv}
                      onChange={(e) => setNewProtestUniv(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">الجامعة المطعون ضدها:</label>
                    <input
                      type="text"
                      required
                      value={newProtestOpponent}
                      onChange={(e) => setNewProtestOpponent(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1">اسم المشرف المعتمد:</label>
                    <input
                      type="text"
                      required
                      value={newProtestSupervisor}
                      onChange={(e) => setNewProtestSupervisor(e.target.value)}
                      placeholder="اسم المشرف الثلاثي"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">رقم هاتف المشرف:</label>
                    <input
                      type="text"
                      value={newProtestPhone}
                      onChange={(e) => setNewProtestPhone(e.target.value)}
                      placeholder="010XXXXXXXX"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">اللعبة الرياضية:</label>
                  <select
                    value={newProtestSport}
                    onChange={(e) => setNewProtestSport(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  >
                    {sports.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">
                    أسباب الطعن والمخالفة اللائحية:
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={newProtestDetails}
                    onChange={(e) => setNewProtestDetails(e.target.value)}
                    placeholder="بيان الواقعة المخالفة للائحة وأسماء اللاعبين أو الأحداث..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>

                <div className="p-2.5 bg-amber-950/40 border border-amber-800/40 rounded-xl text-[11px] text-amber-200">
                  ⚠️ تنبيه: يُشترط تقديم الطعن خلال 60 دقيقة من نهاية المباراة، وسداد رسم الـ 1000
                  جنيه مصري ولا يُرد إلا في حالة قبول الطعن.
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowAddProtest(false)}
                    className="px-3 py-1.5 text-slate-400 hover:text-white"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs"
                  >
                    تأكيد وتسجيل الطعن
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Edit Sport Rule */}
        {editingSport && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-5 max-w-lg w-full text-white space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="font-bold text-sm text-amber-400">تعديل بنود: {editingSport.name}</h4>
                <button
                  onClick={() => setEditingSport(null)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">مدة وتوقيتات المباراة:</label>
                  <input
                    type="text"
                    value={editingSport.matchDuration}
                    onChange={(e) =>
                      setEditingSport({ ...editingSport, matchDuration: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">نظام احتساب النقاط:</label>
                  <input
                    type="text"
                    value={editingSport.pointsSystem}
                    onChange={(e) =>
                      setEditingSport({ ...editingSport, pointsSystem: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">قواعد الزي والأرقام:</label>
                  <input
                    type="text"
                    value={editingSport.jerseyRules}
                    onChange={(e) =>
                      setEditingSport({ ...editingSport, jerseyRules: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => setEditingSport(null)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => {
                    const updated = sports.map((s) => (s.id === editingSport.id ? editingSport : s));
                    onUpdateSports(updated);
                    setEditingSport(null);
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs"
                >
                  حفظ التعديلات
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
