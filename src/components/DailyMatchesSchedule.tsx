import React, { useState } from 'react';
import {
  MatchRecord,
  UserProfile,
  SportRule,
} from '../types';
import {
  Calendar,
  Radio,
  Clock,
  MapPin,
  Trophy,
  Filter,
  Plus,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Search,
  LayoutGrid,
  Table as TableIcon,
  Flame,
  ChevronRight,
  Sparkles,
  Award,
  Share2,
  Printer,
  Send,
} from 'lucide-react';

interface DailyMatchesScheduleProps {
  matches: MatchRecord[];
  sports: SportRule[];
  currentUser: UserProfile;
  onUpdateMatchScore: (match: MatchRecord) => void;
  onAddMatch: (match: MatchRecord) => void;
  onOpenAdminDashboard?: () => void;
}

export const DailyMatchesSchedule: React.FC<DailyMatchesScheduleProps> = ({
  matches,
  sports,
  currentUser,
  onUpdateMatchScore,
  onAddMatch,
  onOpenAdminDashboard,
}) => {
  const [selectedSportFilter, setSelectedSportFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'upcoming' | 'finished'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Supervisor Quick Update Modal State
  const [activeEditingMatch, setActiveEditingMatch] = useState<MatchRecord | null>(null);
  const [editScoreA, setEditScoreA] = useState<number>(0);
  const [editScoreB, setEditScoreB] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<'upcoming' | 'live' | 'finished'>('live');
  const [editNotes, setEditNotes] = useState<string>('');

  // Supervisor Add Match Modal State
  const [isAddMatchModalOpen, setIsAddMatchModalOpen] = useState<boolean>(false);
  const [newSportId, setNewSportId] = useState<string>('futsal');
  const [newTeamA, setNewTeamA] = useState<string>('');
  const [newTeamB, setNewTeamB] = useState<string>('');
  const [newRound, setNewRound] = useState<string>('دور المجموعات');
  const [newCourt, setNewCourt] = useState<string>('الصالة المغطاة الرئيسية');
  const [newTime, setNewTime] = useState<string>('12:00 م');
  const [newStatus, setNewStatus] = useState<'upcoming' | 'live' | 'finished'>('upcoming');

  // Permission check: Supervisors & Leadership
  const canManageMatches =
    currentUser.role === 'minia_leadership' ||
    currentUser.role === 'system_admin' ||
    currentUser.role === 'top_management';

  // Statistics
  const liveCount = matches.filter((m) => m.status === 'live').length;
  const upcomingCount = matches.filter((m) => m.status === 'upcoming').length;
  const finishedCount = matches.filter((m) => m.status === 'finished').length;

  // Filtered matches
  const filteredMatches = matches.filter((m) => {
    // Sport filter
    if (selectedSportFilter !== 'all' && m.sportId !== selectedSportFilter) {
      return false;
    }
    // Status filter
    if (statusFilter !== 'all' && m.status !== statusFilter) {
      return false;
    }
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = `${m.teamA} ${m.teamB} ${m.sportName} ${m.court} ${m.round}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }
    return true;
  });

  const openQuickScoreEditor = (match: MatchRecord) => {
    setActiveEditingMatch(match);
    setEditScoreA(match.scoreA !== null ? match.scoreA : 0);
    setEditScoreB(match.scoreB !== null ? match.scoreB : 0);
    setEditStatus(match.status);
    setEditNotes(match.notes || '');
  };

  const handleSaveScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEditingMatch) return;
    const updated: MatchRecord = {
      ...activeEditingMatch,
      scoreA: editScoreA,
      scoreB: editScoreB,
      status: editStatus,
      notes: editNotes,
    };
    onUpdateMatchScore(updated);
    setActiveEditingMatch(null);
  };

  const handleCreateNewMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamA.trim() || !newTeamB.trim()) return;

    const sportObj = sports.find((s) => s.id === newSportId);
    const newMatch: MatchRecord = {
      id: `m-${Date.now()}`,
      sportId: newSportId,
      sportName: sportObj?.name || 'رياضة عامة',
      round: newRound,
      teamA: newTeamA.trim(),
      teamB: newTeamB.trim(),
      scoreA: newStatus === 'upcoming' ? null : 0,
      scoreB: newStatus === 'upcoming' ? null : 0,
      status: newStatus,
      court: newCourt,
      time: newTime,
      date: 'اليوم',
      notes: 'تمت إضافتها بواسطة مشرف النشاط الرياضي',
    };

    onAddMatch(newMatch);
    setIsAddMatchModalOpen(false);
    // Reset inputs
    setNewTeamA('');
    setNewTeamB('');
  };

  const handleShareMatches = () => {
    const text = `🏆 *نتائج وتغطية مباريات أسبوع شباب الجامعات الـ 14 - جامعة المنيا*\n\n` +
      matches.slice(0, 6).map(m => `• ${m.sportName}: ${m.teamA} (${m.scoreA ?? '-'}) : (${m.scoreB ?? '-'}) ${m.teamB} [${m.status === 'live' ? '🔴 مباشر' : m.status === 'finished' ? '✅ انتهت' : '⏳ قادمة'}] - ${m.court}`).join('\n') +
      `\n\n📌 تابع التغطية الحية على المنصة الرسمية لجامعة المنيا:\nhttps://ais-dev-3zfjluhccsehecek5lydyt-329280017610.europe-west2.run.app`;

    if (navigator.share) {
      navigator.share({
        title: 'نتائج مباريات أسبوع شباب الجامعات الـ 14',
        text,
      }).catch(() => {});
    } else {
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank');
    }
  };

  const getSportBadgeColor = (sportId: string) => {
    switch (sportId) {
      case 'futsal':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'volleyball':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'basketball':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'table-tennis':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'padel':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'athletics':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="bg-slate-900 rounded-3xl p-4 sm:p-7 text-white shadow-2xl border border-slate-800 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="p-2 rounded-xl bg-amber-500 text-slate-950 font-black shadow-md">
              <Calendar className="w-5 h-5" />
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <span>جدول مباريات اليوم - المنافسات الرسمية</span>
            </h2>
            <span className="text-xs bg-amber-500/20 text-amber-300 font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
              أسبوع الـ 14 - جامعة المنيا
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300">
            تغطية حية ومباشرة لكافة اللقاءات الميدانية مع التحديث الفوري للنتائج المعتمدة
          </p>
        </div>

        {/* Action Controls & Supervisor Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          {canManageMatches && (
            <button
              onClick={() => setIsAddMatchModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl shadow-lg transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة مباراة جديدة</span>
            </button>
          )}

          {canManageMatches && onOpenAdminDashboard && (
            <button
              onClick={onOpenAdminDashboard}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>لوحة المشرف المركزية</span>
            </button>
          )}

          {/* WhatsApp / Quick Share Button */}
          <button
            onClick={handleShareMatches}
            title="مشاركة النتائج الحية عبر واتساب والوسائط"
            className="flex items-center gap-1 px-3 py-2 bg-emerald-600/90 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-200" />
            <span className="hidden sm:inline">مشاركة واتساب</span>
          </button>

          {/* Print Button */}
          <button
            onClick={() => window.print()}
            title="طباعة جدول مباريات اليوم بتنسيق رسمي"
            className="flex items-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">طباعة الكشف</span>
          </button>

          {/* View Mode Toggle */}
          <div className="bg-slate-800 p-1 rounded-xl border border-slate-700 flex items-center gap-1">
            <button
              onClick={() => setViewMode('cards')}
              title="عرض البطاقات التفاعلية"
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'cards'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              title="عرض الجدول الرسمي المنظم"
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'table'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Overview Stat Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => setStatusFilter('all')}
          className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
            statusFilter === 'all'
              ? 'bg-slate-800 border-amber-500 ring-2 ring-amber-500/20'
              : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80'
          }`}
        >
          <div>
            <span className="text-[11px] font-bold text-slate-400 block">إجمالي لقاءات اليوم</span>
            <span className="text-xl font-black text-white">{matches.length}</span>
          </div>
          <Trophy className="w-6 h-6 text-slate-500" />
        </div>

        <div
          onClick={() => setStatusFilter('live')}
          className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
            statusFilter === 'live'
              ? 'bg-red-950/40 border-red-500 ring-2 ring-red-500/20'
              : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80'
          }`}
        >
          <div>
            <span className="text-[11px] font-bold text-red-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              مباريات جارية الآن
            </span>
            <span className="text-xl font-black text-red-400">{liveCount}</span>
          </div>
          <Flame className="w-6 h-6 text-red-500/60" />
        </div>

        <div
          onClick={() => setStatusFilter('upcoming')}
          className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
            statusFilter === 'upcoming'
              ? 'bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/20'
              : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80'
          }`}
        >
          <div>
            <span className="text-[11px] font-bold text-blue-300 block">قادمة في الساعات المقبلة</span>
            <span className="text-xl font-black text-blue-400">{upcomingCount}</span>
          </div>
          <Clock className="w-6 h-6 text-blue-500/60" />
        </div>

        <div
          onClick={() => setStatusFilter('finished')}
          className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
            statusFilter === 'finished'
              ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20'
              : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80'
          }`}
        >
          <div>
            <span className="text-[11px] font-bold text-emerald-300 block">لقاءات حُسمت نتائجها</span>
            <span className="text-xl font-black text-emerald-400">{finishedCount}</span>
          </div>
          <CheckCircle2 className="w-6 h-6 text-emerald-500/60" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Quick Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن جامعة، صالة، ملعب، أو مسابقة معينة..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pr-9 pl-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Status Quick Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition ${
                statusFilter === 'all'
                  ? 'bg-amber-500 text-slate-950 font-black'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              كافة الحالات
            </button>
            <button
              onClick={() => setStatusFilter('live')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition flex items-center gap-1 ${
                statusFilter === 'live'
                  ? 'bg-red-600 text-white font-black'
                  : 'bg-slate-900 text-red-400 hover:bg-slate-800'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>
              <span>مباشر ({liveCount})</span>
            </button>
            <button
              onClick={() => setStatusFilter('upcoming')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition ${
                statusFilter === 'upcoming'
                  ? 'bg-blue-600 text-white font-black'
                  : 'bg-slate-900 text-blue-400 hover:bg-slate-800'
              }`}
            >
              قادمة ({upcomingCount})
            </button>
            <button
              onClick={() => setStatusFilter('finished')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition ${
                statusFilter === 'finished'
                  ? 'bg-emerald-600 text-white font-black'
                  : 'bg-slate-900 text-emerald-400 hover:bg-slate-800'
              }`}
            >
              انتهت ({finishedCount})
            </button>
          </div>
        </div>

        {/* Sports Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => setSelectedSportFilter('all')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-bold transition ${
              selectedSportFilter === 'all'
                ? 'bg-slate-200 text-slate-950 font-black'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            كافة الألعاب ({matches.length})
          </button>
          {sports.map((s) => {
            const count = matches.filter((m) => m.sportId === s.id).length;
            const isSelected = selectedSportFilter === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedSportFilter(s.id)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-bold transition flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{s.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Matches Display: CARDS VIEW */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredMatches.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 space-y-2 bg-slate-950/30 rounded-3xl border border-slate-800">
              <AlertCircle className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-sm font-bold text-slate-400">
                لا توجد مباريات مطابقة للبحث أو الفلتر المحدد حالياً.
              </p>
              <button
                onClick={() => {
                  setSelectedSportFilter('all');
                  setStatusFilter('all');
                  setSearchQuery('');
                }}
                className="text-xs text-amber-400 hover:underline font-bold"
              >
                إعادة ضبط الفلاتر
              </button>
            </div>
          ) : (
            filteredMatches.map((match) => {
              const isLive = match.status === 'live';
              const isFinished = match.status === 'finished';

              return (
                <div
                  key={match.id}
                  className={`relative rounded-3xl p-5 border transition-all duration-300 flex flex-col justify-between space-y-4 ${
                    isLive
                      ? 'bg-gradient-to-br from-slate-900 via-red-950/20 to-slate-900 border-red-500/50 shadow-lg shadow-red-950/20 ring-1 ring-red-500/30'
                      : isFinished
                      ? 'bg-slate-800/80 border-slate-700/80 hover:border-slate-600'
                      : 'bg-slate-800/60 border-slate-700/60 hover:border-slate-600'
                  }`}
                >
                  {/* Card Header: Sport, Stage, Status Pill */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-black px-3 py-1 rounded-full border ${getSportBadgeColor(
                          match.sportId
                        )}`}
                      >
                        {match.sportName}
                      </span>
                      <span className="text-[11px] text-slate-400 font-semibold">
                        {match.round}
                      </span>
                    </div>

                    {/* Status indicator */}
                    {isLive && (
                      <span className="flex items-center gap-1.5 bg-red-950/80 text-red-300 border border-red-800/80 px-2.5 py-1 rounded-full text-xs font-black">
                        <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
                        <span>مباشر الآن</span>
                      </span>
                    )}
                    {isFinished && (
                      <span className="flex items-center gap-1 bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 px-2.5 py-1 rounded-full text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>انتهت رسمياً</span>
                      </span>
                    )}
                    {match.status === 'upcoming' && (
                      <span className="flex items-center gap-1 bg-blue-950/80 text-blue-300 border border-blue-800/80 px-2.5 py-1 rounded-full text-xs font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>قادمة</span>
                      </span>
                    )}
                  </div>

                  {/* Competitors & Score Section */}
                  <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800/90 flex items-center justify-between gap-3">
                    {/* Team A */}
                    <div className="flex-1 text-center space-y-1.5">
                      <div className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-br from-amber-500/20 to-slate-800 border border-amber-500/30 flex items-center justify-center font-black text-xs text-amber-300">
                        {match.teamA.slice(0, 2)}
                      </div>
                      <h4 className="font-extrabold text-xs sm:text-sm text-white line-clamp-1">
                        {match.teamA}
                      </h4>
                    </div>

                    {/* Score / VS Display */}
                    <div className="shrink-0 px-3 py-1.5 text-center">
                      {match.scoreA !== null && match.scoreB !== null ? (
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-2xl sm:text-3xl font-mono font-black ${
                              isLive ? 'text-amber-400 animate-pulse' : 'text-white'
                            }`}
                          >
                            {match.scoreA}
                          </span>
                          <span className="text-slate-600 font-black text-lg">:</span>
                          <span
                            className={`text-2xl sm:text-3xl font-mono font-black ${
                              isLive ? 'text-amber-400 animate-pulse' : 'text-white'
                            }`}
                          >
                            {match.scoreB}
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-0.5">
                          <span className="text-sm font-black text-slate-500 px-2 py-1 bg-slate-900 rounded-lg border border-slate-800">
                            ضد
                          </span>
                          <span className="text-[10px] text-amber-400 block font-bold mt-1">
                            {match.time}
                          </span>
                        </div>
                      )}

                      {match.notes && (
                        <span className="text-[10px] text-slate-400 block mt-1 line-clamp-1 max-w-[140px]">
                          {match.notes}
                        </span>
                      )}
                    </div>

                    {/* Team B */}
                    <div className="flex-1 text-center space-y-1.5">
                      <div className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-br from-blue-500/20 to-slate-800 border border-blue-500/30 flex items-center justify-center font-black text-xs text-blue-300">
                        {match.teamB.slice(0, 2)}
                      </div>
                      <h4 className="font-extrabold text-xs sm:text-sm text-white line-clamp-1">
                        {match.teamB}
                      </h4>
                    </div>
                  </div>

                  {/* Card Footer: Venue, Time & Supervisor Quick Update Action */}
                  <div className="flex items-center justify-between gap-3 pt-2 text-xs text-slate-400 border-t border-slate-800/80">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1 text-[11px] text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="line-clamp-1">{match.court}</span>
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{match.time}</span>
                      </span>
                    </div>

                    {/* Supervisor Quick Edit Button */}
                    {canManageMatches && (
                      <button
                        onClick={() => openQuickScoreEditor(match)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 rounded-xl border border-slate-700 text-[11px] font-black transition cursor-pointer shrink-0"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>تحديث النتيجة فورياً</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Main Matches Display: OFFICIAL TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-slate-950/80 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold">
                  <th className="py-3 px-4">اللعبة والمسابقة</th>
                  <th className="py-3 px-4">المرحلة</th>
                  <th className="py-3 px-4">الفريقان المتنافسان</th>
                  <th className="py-3 px-4 text-center">النتيجة</th>
                  <th className="py-3 px-4">الحالة</th>
                  <th className="py-3 px-4">الملعب والموعد</th>
                  {canManageMatches && <th className="py-3 px-4 text-left">إجراء المشرف</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredMatches.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-900/50 transition">
                    <td className="py-3 px-4 font-extrabold text-amber-400">{m.sportName}</td>
                    <td className="py-3 px-4 text-slate-300 font-semibold">{m.round}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">
                        {m.teamA} <span className="text-slate-500 font-normal px-1">ضد</span> {m.teamB}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-black text-sm text-amber-300">
                      {m.scoreA !== null ? `${m.scoreA} - ${m.scoreB}` : 'لم تبدأ بعد'}
                    </td>
                    <td className="py-3 px-4">
                      {m.status === 'live' && (
                        <span className="bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>
                          جارية الآن
                        </span>
                      )}
                      {m.status === 'finished' && (
                        <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          انتهت
                        </span>
                      )}
                      {m.status === 'upcoming' && (
                        <span className="bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          قادمة
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      <div>{m.court}</div>
                      <div className="text-amber-500/80 font-bold">{m.time}</div>
                    </td>
                    {canManageMatches && (
                      <td className="py-3 px-4 text-left">
                        <button
                          onClick={() => openQuickScoreEditor(m)}
                          className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-lg text-[11px] transition inline-flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>تحديث</span>
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUPERVISOR MODAL: QUICK SCORE & STATUS UPDATER */}
      {activeEditingMatch && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/50 rounded-3xl p-6 max-w-md w-full text-white shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-white">
                    تحديث نتيجة اللقاء الميداني فورياً
                  </h4>
                  <p className="text-[11px] text-amber-400 font-bold">
                    {activeEditingMatch.sportName} — {activeEditingMatch.round}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveEditingMatch(null)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-slate-800 rounded-lg"
              >
                إلغاء
              </button>
            </div>

            <form onSubmit={handleSaveScore} className="space-y-4 text-xs">
              {/* Teams and Score inputs */}
              <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                <div className="space-y-1.5">
                  <label className="font-extrabold text-xs text-amber-300 block truncate">
                    {activeEditingMatch.teamA}
                  </label>
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditScoreA((prev) => Math.max(0, prev - 1))}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-black text-sm"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={editScoreA}
                      onChange={(e) => setEditScoreA(Number(e.target.value))}
                      className="w-14 text-center font-mono font-black text-xl bg-slate-900 border border-slate-700 rounded-xl py-1 text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setEditScoreA((prev) => prev + 1)}
                      className="w-7 h-7 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-extrabold text-xs text-blue-300 block truncate">
                    {activeEditingMatch.teamB}
                  </label>
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditScoreB((prev) => Math.max(0, prev - 1))}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-black text-sm"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={editScoreB}
                      onChange={(e) => setEditScoreB(Number(e.target.value))}
                      className="w-14 text-center font-mono font-black text-xl bg-slate-900 border border-slate-700 rounded-xl py-1 text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setEditScoreB((prev) => prev + 1)}
                      className="w-7 h-7 rounded-lg bg-blue-500 hover:bg-blue-600 text-slate-950 font-black text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Match Status Selector */}
              <div>
                <label className="block text-slate-300 mb-1.5 font-bold">
                  حالة المباراة الآن:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditStatus('live')}
                    className={`py-2 rounded-xl font-extrabold border transition text-center ${
                      editStatus === 'live'
                        ? 'bg-red-600 text-white border-red-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    🔴 جارية الآن
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditStatus('finished')}
                    className={`py-2 rounded-xl font-extrabold border transition text-center ${
                      editStatus === 'finished'
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    ✅ انتهت
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditStatus('upcoming')}
                    className={`py-2 rounded-xl font-extrabold border transition text-center ${
                      editStatus === 'upcoming'
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    ⏳ قادمة
                  </button>
                </div>
              </div>

              {/* Match Notes / Quarter */}
              <div>
                <label className="block text-slate-300 mb-1 font-bold">
                  ملاحظات أو زمن الشوط (مثال: الشوط الثاني - متبقي 3 دقائق):
                </label>
                <input
                  type="text"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="ملاحظات الحكام، الشوط الحاسم، فترة الراحة..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveEditingMatch(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl shadow-lg transition active:scale-95"
                >
                  حفظ وتعميم النتيجة فورياً
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUPERVISOR MODAL: ADD NEW MATCH FIXTURE */}
      {isAddMatchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full text-white shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-white">
                    إدراج مباراة جديدة بجدول اليوم
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    صلاحية المشرف الميداني المعتمد (Admin1)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddMatchModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-slate-800 rounded-lg"
              >
                إلغاء
              </button>
            </div>

            <form onSubmit={handleCreateNewMatch} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-bold">اللعبة الرياضية:</label>
                <select
                  value={newSportId}
                  onChange={(e) => setNewSportId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                >
                  {sports.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.genderLabel})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-bold">
                    الطرف الأول (فريق أ):
                  </label>
                  <input
                    type="text"
                    required
                    value={newTeamA}
                    onChange={(e) => setNewTeamA(e.target.value)}
                    placeholder="مثال: جامعة المنيا"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-bold">
                    الطرف الثاني (فريق ب):
                  </label>
                  <input
                    type="text"
                    required
                    value={newTeamB}
                    onChange={(e) => setNewTeamB(e.target.value)}
                    placeholder="مثال: جامعة القاهرة"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-bold">المرحلة / الدور:</label>
                  <input
                    type="text"
                    value={newRound}
                    onChange={(e) => setNewRound(e.target.value)}
                    placeholder="دور المجموعات / ربع النهائي"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-bold">الملعب والصالة:</label>
                  <input
                    type="text"
                    value={newCourt}
                    onChange={(e) => setNewCourt(e.target.value)}
                    placeholder="صالة المركز الأولمبي 1"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-bold">توقيت الانطلاق:</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="12:30 م"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-bold">الحالة الأولية للمباراة:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewStatus('upcoming')}
                    className={`py-2 rounded-xl font-bold border transition ${
                      newStatus === 'upcoming'
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    قادمة
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewStatus('live')}
                    className={`py-2 rounded-xl font-bold border transition ${
                      newStatus === 'live'
                        ? 'bg-red-600 text-white border-red-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    جارية الآن
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewStatus('finished')}
                    className={`py-2 rounded-xl font-bold border transition ${
                      newStatus === 'finished'
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    منتهية
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddMatchModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl shadow-lg transition active:scale-95 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>إدراج المباراة في الجدول</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
