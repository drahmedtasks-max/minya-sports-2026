import React, { useState, useMemo } from 'react';
import { UniversityMedal, UserRole } from '../types';
import { Trophy, Medal, Award, Filter, Printer, Plus, Sparkles, ArrowUpDown, TrendingUp } from 'lucide-react';

interface MedalTallySectionProps {
  medals: UniversityMedal[];
  onAwardMedal?: (universityId: string, type: 'gold' | 'silver' | 'bronze', sportName: string) => void;
  userRole?: UserRole;
}

type SortBy = 'gold' | 'silver' | 'bronze' | 'total' | 'points';

export const MedalTallySection: React.FC<MedalTallySectionProps> = ({
  medals,
  onAwardMedal,
  userRole = 'public_guest',
}) => {
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortBy>('gold');
  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);
  const [targetUnivId, setTargetUnivId] = useState(medals[0]?.id || '');
  const [targetMedalType, setTargetMedalType] = useState<'gold' | 'silver' | 'bronze'>('gold');
  const [targetSport, setTargetSport] = useState('خماسي كرة القدم');

  const sportsList = [
    'all',
    'خماسي كرة القدم',
    'الكرة الطائرة',
    'كرة السلة',
    'تنس الطاولة',
    'ألعاب القوى',
    'رياضة البادل',
  ];

  // Calculate medals and rank
  const processedMedals = useMemo(() => {
    return medals.map((u) => {
      if (selectedSport === 'all') {
        return {
          ...u,
          displayGold: u.gold,
          displaySilver: u.silver,
          displayBronze: u.bronze,
          displayTotal: u.total,
          displayPoints: u.points,
        };
      }
      const sportStats = u.sportsBreakdown?.[selectedSport] || { gold: 0, silver: 0, bronze: 0 };
      const total = sportStats.gold + sportStats.silver + sportStats.bronze;
      const points = sportStats.gold * 7 + sportStats.silver * 4 + sportStats.bronze * 2;
      return {
        ...u,
        displayGold: sportStats.gold,
        displaySilver: sportStats.silver,
        displayBronze: sportStats.bronze,
        displayTotal: total,
        displayPoints: points,
      };
    }).sort((a, b) => {
      if (sortBy === 'gold') {
        if (b.displayGold !== a.displayGold) return b.displayGold - a.displayGold;
        if (b.displaySilver !== a.displaySilver) return b.displaySilver - a.displaySilver;
        return b.displayBronze - a.displayBronze;
      }
      if (sortBy === 'silver') return b.displaySilver - a.displaySilver;
      if (sortBy === 'bronze') return b.displayBronze - a.displayBronze;
      if (sortBy === 'points') return b.displayPoints - a.displayPoints;
      return b.displayTotal - a.displayTotal;
    });
  }, [medals, selectedSport, sortBy]);

  const totalGoldAwarded = medals.reduce((sum, m) => sum + m.gold, 0);
  const totalSilverAwarded = medals.reduce((sum, m) => sum + m.silver, 0);
  const totalBronzeAwarded = medals.reduce((sum, m) => sum + m.bronze, 0);

  const canManage = userRole === 'top_management' || userRole === 'minia_leadership' || userRole === 'system_admin';

  return (
    <div id="medal-tally" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-950/30 p-6 rounded-3xl border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">جدول الترتيب والميداليات العام</h2>
                <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                  نظام النقاط الأولمبي
                </span>
              </div>
              <p className="text-xs text-slate-400">
                حصر وتتويج الجامعات المشاركة في أسبوع شباب الجامعات الـ 14 بجامعة المنيا (ذهب: 7، فضة: 4، برونز: 2)
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {canManage && (
            <button
              id="award-medal-btn"
              onClick={() => setIsAwardModalOpen(true)}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>منح ميدالية للجامعات</span>
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>طباعة كشف الترتيب</span>
          </button>
        </div>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 via-slate-900 to-slate-950 border border-amber-500/30 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-400">الميداليات الذهبية الممنوحة</span>
            <div className="text-2xl font-black text-white font-mono">{totalGoldAwarded} 🥇</div>
            <span className="text-[10px] text-slate-400 block">7 نقاط لكل ذهبية في المجموع العام</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-2xl">
            1st
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-300/15 via-slate-900 to-slate-950 border border-slate-400/30 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-300">الميداليات الفضية الممنوحة</span>
            <div className="text-2xl font-black text-white font-mono">{totalSilverAwarded} 🥈</div>
            <span className="text-[10px] text-slate-400 block">4 نقاط لكل فضية بالترتيب المعتمد</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-400/20 text-slate-300 flex items-center justify-center font-black text-2xl">
            2nd
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-700/15 via-slate-900 to-slate-950 border border-amber-700/30 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-600">الميداليات البرونزية الممنوحة</span>
            <div className="text-2xl font-black text-white font-mono">{totalBronzeAwarded} 🥉</div>
            <span className="text-[10px] text-slate-400 block">نقطتان لكل برونزية بالترتيب العام</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-700/20 text-amber-600 flex items-center justify-center font-black text-2xl">
            3rd
          </div>
        </div>
      </div>

      {/* Filter and Sorting Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
        {/* Sport Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-400 font-bold shrink-0">اللعبة:</span>
          {sportsList.map((sp) => (
            <button
              key={sp}
              onClick={() => setSelectedSport(sp)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                selectedSport === sp
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {sp === 'all' ? 'كافة الألعاب (الترتيب العام)' : sp}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 shrink-0">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400 font-bold">الترتيب حسب:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1 text-white font-bold"
          >
            <option value="gold">الذهب أولاً (الأولمبي الدولي)</option>
            <option value="total">إجمالي عدد الميداليات</option>
            <option value="points">مجموع النقاط (7-4-2)</option>
            <option value="silver">الفضيات</option>
            <option value="bronze">البرونزيات</option>
          </select>
        </div>
      </div>

      {/* Medal Table */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-800 font-bold">
                <th className="py-3 px-4 w-12 text-center"># الترتيب</th>
                <th className="py-3 px-4">الجامعة المشاركة</th>
                <th className="py-3 px-4 text-center font-bold text-amber-400">🥇 ذهب</th>
                <th className="py-3 px-4 text-center font-bold text-slate-300">🥈 فضة</th>
                <th className="py-3 px-4 text-center font-bold text-amber-600">🥉 برونز</th>
                <th className="py-3 px-4 text-center font-black text-white">المجموع</th>
                <th className="py-3 px-4 text-center font-black text-emerald-400">مجموع النقاط</th>
                <th className="py-3 px-4 text-center">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {processedMedals.map((item, idx) => {
                const rank = idx + 1;
                const isLeader = rank === 1;
                const isPodium = rank <= 3;
                const isHost = item.universityName.includes('المنيا');

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-900/60 transition ${
                      isLeader ? 'bg-amber-500/5 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-center">
                      {rank === 1 ? (
                        <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center mx-auto text-xs shadow-md">
                          1
                        </span>
                      ) : rank === 2 ? (
                        <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-950 font-black flex items-center justify-center mx-auto text-xs shadow-md">
                          2
                        </span>
                      ) : rank === 3 ? (
                        <span className="w-6 h-6 rounded-full bg-amber-700 text-white font-black flex items-center justify-center mx-auto text-xs shadow-md">
                          3
                        </span>
                      ) : (
                        <span className="text-slate-500 font-mono font-bold">{rank}</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{item.logoEmoji || '🏛️'}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-white text-sm">{item.universityName}</span>
                            {isHost && (
                              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded-full font-bold">
                                الجامعة المضيفة
                              </span>
                            )}
                          </div>
                          {item.shortName && (
                            <span className="text-[10px] text-slate-400">رمز الوفد: {item.shortName}</span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center font-mono font-bold text-amber-400 bg-amber-500/5">
                      {item.displayGold}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-300 bg-slate-400/5">
                      {item.displaySilver}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-amber-600 bg-amber-700/5">
                      {item.displayBronze}
                    </td>

                    <td className="py-3 px-4 text-center font-mono font-black text-white text-sm">
                      {item.displayTotal}
                    </td>

                    <td className="py-3 px-4 text-center font-mono font-black text-emerald-400 text-sm">
                      {item.displayPoints}
                    </td>

                    <td className="py-3 px-4 text-center">
                      {isPodium ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 inline-flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" /> منصة التتويج
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500">مشارك رسمي</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Award Medal Modal */}
      {isAwardModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 max-w-md w-full text-white shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Medal className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-sm text-white">منح ميدالية رسمية لجامعة</h3>
              </div>
              <button
                onClick={() => setIsAwardModalOpen(false)}
                className="text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded-lg"
              >
                إلغاء
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">الجامعة المتوجة:</label>
                <select
                  value={targetUnivId}
                  onChange={(e) => setTargetUnivId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                >
                  {medals.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.universityName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">نوع الميدالية:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTargetMedalType('gold')}
                    className={`p-2.5 rounded-xl border text-center font-bold ${
                      targetMedalType === 'gold'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    🥇 ذهبية (+7)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetMedalType('silver')}
                    className={`p-2.5 rounded-xl border text-center font-bold ${
                      targetMedalType === 'silver'
                        ? 'bg-slate-300/20 border-slate-300 text-slate-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    🥈 فضية (+4)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetMedalType('bronze')}
                    className={`p-2.5 rounded-xl border text-center font-bold ${
                      targetMedalType === 'bronze'
                        ? 'bg-amber-700/20 border-amber-700 text-amber-600'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    🥉 برونزية (+2)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">اللعبة / الفعالية:</label>
                <select
                  value={targetSport}
                  onChange={(e) => setTargetSport(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                >
                  {sportsList.filter((s) => s !== 'all').map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  if (onAwardMedal) {
                    onAwardMedal(targetUnivId, targetMedalType, targetSport);
                  }
                  setIsAwardModalOpen(false);
                }}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl shadow-lg transition"
              >
                اعتماد وتتويج الجامعة الآن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
