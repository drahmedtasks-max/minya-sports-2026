import React, { useState } from 'react';
import { MatchRecord, UserRole } from '../types';
import { Radio, MapPin, Clock, Edit3, Check, Filter } from 'lucide-react';

interface LiveMatchTickerProps {
  matches: MatchRecord[];
  userRole: UserRole;
  onUpdateMatchScore?: (match: MatchRecord) => void;
}

export const LiveMatchTicker: React.FC<LiveMatchTickerProps> = ({
  matches,
  userRole,
  onUpdateMatchScore,
}) => {
  const [selectedSportFilter, setSelectedSportFilter] = useState<string>('all');
  const [editingMatch, setEditingMatch] = useState<MatchRecord | null>(null);
  const [editScoreA, setEditScoreA] = useState<string>('');
  const [editScoreB, setEditScoreB] = useState<string>('');
  const [editStatus, setEditStatus] = useState<'upcoming' | 'live' | 'finished'>('live');

  const canEdit =
    userRole === 'minia_leadership' ||
    userRole === 'system_admin' ||
    userRole === 'top_management';

  const sportsFilterOptions = [
    { id: 'all', label: 'كافة الملاعب' },
    { id: 'futsal', label: 'خماسي القدم' },
    { id: 'volleyball', label: 'الطائرة' },
    { id: 'basketball', label: 'السلة' },
    { id: 'table-tennis', label: 'تنس الطاولة' },
    { id: 'padel', label: 'البادل' },
    { id: 'athletics', label: 'ألعاب القوى' },
  ];

  const filteredMatches = matches.filter((m) => {
    if (selectedSportFilter === 'all') return true;
    return m.sportId === selectedSportFilter;
  });

  const openEditModal = (match: MatchRecord) => {
    setEditingMatch(match);
    setEditScoreA(match.scoreA !== null ? String(match.scoreA) : '');
    setEditScoreB(match.scoreB !== null ? String(match.scoreB) : '');
    setEditStatus(match.status);
  };

  const handleSaveScore = () => {
    if (!editingMatch || !onUpdateMatchScore) return;
    const updated: MatchRecord = {
      ...editingMatch,
      scoreA: editScoreA === '' ? null : Number(editScoreA),
      scoreB: editScoreB === '' ? null : Number(editScoreB),
      status: editStatus,
    };
    onUpdateMatchScore(updated);
    setEditingMatch(null);
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-5 shadow-xl border border-slate-800 space-y-3.5">
      {/* Ticker Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400" />
            <span>مُتابِع المباريات الحي والملاعب (Live Sports Ticker)</span>
          </h3>
          <span className="text-[11px] bg-emerald-950 text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-800">
            تحديث لحظي
          </span>
        </div>

        {/* Quick Sport Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
          {sportsFilterOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedSportFilter(opt.id)}
              className={`px-2.5 py-1 rounded-xl whitespace-nowrap font-medium transition ${
                selectedSportFilter === opt.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Horizontal Match Cards Scroll */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredMatches.map((m) => (
          <div
            key={m.id}
            className="bg-slate-800/80 hover:bg-slate-800 rounded-2xl p-3.5 border border-slate-700/70 transition space-y-2 relative"
          >
            {/* Match Meta */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-800/50">
                {m.sportName}
              </span>
              <div className="flex items-center gap-1.5">
                {m.status === 'live' && (
                  <span className="bg-red-500/20 text-red-400 border border-red-500/40 text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                    مباشر الآن
                  </span>
                )}
                {m.status === 'finished' && (
                  <span className="bg-slate-700 text-slate-300 text-[10px] font-medium px-1.5 py-0.5 rounded-full">
                    انتهت
                  </span>
                )}
                {m.status === 'upcoming' && (
                  <span className="bg-blue-900/60 text-blue-300 text-[10px] font-medium px-1.5 py-0.5 rounded-full">
                    قريباً
                  </span>
                )}
                <span className="text-[11px] text-slate-300 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {m.time}
                </span>
              </div>
            </div>

            {/* Teams & Score */}
            <div className="space-y-1.5 py-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-slate-100 truncate max-w-[190px]">{m.teamA}</span>
                <span className="font-mono font-extrabold text-base bg-slate-900 px-2.5 py-0.5 rounded-lg border border-slate-700 min-w-[32px] text-center text-amber-300">
                  {m.scoreA !== null ? m.scoreA : '-'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-slate-100 truncate max-w-[190px]">{m.teamB}</span>
                <span className="font-mono font-extrabold text-base bg-slate-900 px-2.5 py-0.5 rounded-lg border border-slate-700 min-w-[32px] text-center text-amber-300">
                  {m.scoreB !== null ? m.scoreB : '-'}
                </span>
              </div>
            </div>

            {/* Court Venue & Notes */}
            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-300">
              <span className="flex items-center gap-1 truncate max-w-[210px] text-slate-400">
                <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="truncate">{m.court}</span>
              </span>

              {canEdit && (
                <button
                  onClick={() => openEditModal(m)}
                  className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-bold bg-amber-500/10 hover:bg-amber-500/20 px-2 py-0.5 rounded-lg border border-amber-500/30 transition"
                  title="تعديل النتيجة أو الحالة"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>تحديث</span>
                </button>
              )}
            </div>

            {m.notes && (
              <p className="text-[10px] text-slate-400 bg-slate-900/60 px-2 py-1 rounded-md">
                {m.notes}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Edit Match Score Modal */}
      {editingMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-5 max-w-md w-full shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-bold text-sm text-amber-400">
                تحديث نتيجة: {editingMatch.sportName}
              </h4>
              <button
                onClick={() => setEditingMatch(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">
                  أهداف / نقاط ({editingMatch.teamA}):
                </label>
                <input
                  type="number"
                  value={editScoreA}
                  onChange={(e) => setEditScoreA(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white font-mono text-center text-lg focus:outline-none focus:border-amber-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">
                  أهداف / نقاط ({editingMatch.teamB}):
                </label>
                <input
                  type="number"
                  value={editScoreB}
                  onChange={(e) => setEditScoreB(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white font-mono text-center text-lg focus:outline-none focus:border-amber-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">حالة المباراة:</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="upcoming">قريباً (لم تبدأ)</option>
                  <option value="live">مباشر الآن (جارية)</option>
                  <option value="finished">انتهت رسمياً</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setEditingMatch(null)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                إلغاء
              </button>
              <button
                onClick={handleSaveScore}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition"
              >
                <Check className="w-4 h-4" />
                <span>حفظ وتحديث النتيجة</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
