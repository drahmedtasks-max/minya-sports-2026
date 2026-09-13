import React, { useState } from 'react';
import { AthleticsAthlete } from '../types';
import { Timer, Zap, Flag, Gauge, Play, RotateCcw, Printer, Info, CheckCircle, AlertTriangle } from 'lucide-react';

interface AthleticsEngineSectionProps {
  initialAthletes: AthleticsAthlete[];
}

export const AthleticsEngineSection: React.FC<AthleticsEngineSectionProps> = ({ initialAthletes }) => {
  const [selectedEvent, setSelectedEvent] = useState<string>('100م عدو - طلبة');
  const [athletes, setAthletes] = useState<AthleticsAthlete[]>(initialAthletes);
  const [windGauge, setWindGauge] = useState<number>(0.8);
  const [activeStage, setActiveStage] = useState<'heats' | 'finals'>('finals');
  const [isSimulating, setIsSimulating] = useState(false);

  // IAAF Central Lane Allocation algorithm (Rule 166.4)
  // Seeds 1-4 get lanes 3, 4, 5, 6
  // Seeds 5-6 get lanes 7, 8
  // Seeds 7-8 get lanes 1, 2
  const runIAAFSeeding = () => {
    setIsSimulating(true);

    setTimeout(() => {
      // Sort athletes by heat time (fastest first)
      const sorted = [...athletes].sort((a, b) => a.heatTime - b.heatTime);

      // Top 8 qualify
      const qualified = sorted.slice(0, 8);

      // Lane mapping according to IAAF standard
      const laneAssignment: { [rankIndex: number]: number } = {
        0: 4, // 1st fastest -> Lane 4
        1: 5, // 2nd fastest -> Lane 5
        2: 3, // 3rd fastest -> Lane 3
        3: 6, // 4th fastest -> Lane 6
        4: 7, // 5th fastest -> Lane 7
        5: 8, // 6th fastest -> Lane 8
        6: 2, // 7th fastest -> Lane 2
        7: 1, // 8th fastest -> Lane 1
      };

      const updated = qualified.map((athlete, idx) => {
        const lane = laneAssignment[idx] || (idx + 1);
        // Simulate a close, realistic final time within ±0.15s of their heat time
        const randomDelta = (Math.random() * 0.2 - 0.1);
        const finalTime = Number((athlete.heatTime + randomDelta).toFixed(2));
        const reaction = Number((0.130 + Math.random() * 0.050).toFixed(3));

        return {
          ...athlete,
          qualified: true,
          qualificationReason: (idx < 3 ? 'Q' : 'q') as 'Q' | 'q',
          lane,
          reactionTime: reaction,
          finalTime,
          status: 'finished' as const,
        };
      });

      // Sort finals by finalTime
      const finalRanked = [...updated].sort((a, b) => (a.finalTime || 99) - (b.finalTime || 99));
      const withMedals = finalRanked.map((ath, i) => ({
        ...ath,
        finalRank: i + 1,
        medal: i === 0 ? ('gold' as const) : i === 1 ? ('silver' as const) : i === 2 ? ('bronze' as const) : null,
      }));

      setAthletes(withMedals);
      setActiveStage('finals');
      setIsSimulating(false);
    }, 600);
  };

  const resetHeats = () => {
    setAthletes(initialAthletes);
    setActiveStage('finals');
  };

  // Sort by lane for visual track rendering
  const trackAthletes = [...athletes].sort((a, b) => (a.lane || 0) - (b.lane || 0));

  return (
    <div id="athletics-engine" className="space-y-6">
      {/* Engine Banner */}
      <div className="bg-gradient-to-r from-blue-950/40 via-slate-900 to-amber-950/30 p-6 rounded-3xl border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">محرك ألعاب القوى الدولي (IAAF Athletics Engine)</h2>
                <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full font-bold">
                  Rule 166.4 Mapped
                </span>
              </div>
              <p className="text-xs text-slate-400">
                حساب أزمنة التصفيات، التأهيل الأوتوماتيكي (Q/q)، والتوزيع المركزي للحارات القياسية (3، 4، 5، 6)
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={runIAAFSeeding}
            disabled={isSimulating}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl shadow transition flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isSimulating ? 'جاري المحاكاة وتوزيع الحارات...' : 'تشغيل خوارزمية التأهيل والتوزيع'}</span>
          </button>

          <button
            onClick={resetHeats}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة ضبط</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-blue-400" />
            <span>طباعة كشف الحارات</span>
          </button>
        </div>
      </div>

      {/* Technical Instrumentation Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Gauge className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-slate-400 block text-[11px]">مقياس سرعة الرياح (Wind Gauge):</span>
              <span className="font-mono font-black text-white text-sm">+{windGauge} m/s (قانوني)</span>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
            &le; +2.0 m/s
          </span>
        </div>

        <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Timer className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-slate-400 block text-[11px]">نظام زمن الاستجابة (Reaction Time):</span>
              <span className="font-mono font-black text-white text-sm">0.138s - 0.170s</span>
            </div>
          </div>
          <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
            حد البداية الخاطئة &lt; 0.100s
          </span>
        </div>

        <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Flag className="w-4 h-4 text-purple-400" />
            <div>
              <span className="text-slate-400 block text-[11px]">قاعدة توزيع الحارات الدولية:</span>
              <span className="font-bold text-white text-xs">حارات 3, 4, 5, 6 للأسرع</span>
            </div>
          </div>
          <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-bold">
            IAAF 166.4
          </span>
        </div>
      </div>

      {/* Visual 8-Lane Synthetic Track */}
      <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <span>🏟️</span>
            <span>مضمار استاد جامعة المنيا - التوزيع المعتمد لنهائي 100م عدو (8 حارات)</span>
          </h3>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
              الحارات المركزية الذهبية (3 - 4 - 5 - 6)
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              الحارات الجانبية (1 - 2 - 7 - 8)
            </span>
          </div>
        </div>

        <div className="space-y-1.5 font-mono text-xs">
          {trackAthletes.map((athlete) => {
            const lane = athlete.lane || 1;
            const isCentral = lane >= 3 && lane <= 6;
            const isWinner = athlete.finalRank === 1;

            return (
              <div
                key={athlete.id}
                className={`p-2.5 rounded-xl border flex items-center justify-between transition ${
                  isWinner
                    ? 'bg-amber-500/15 border-amber-500/50 shadow-md'
                    : isCentral
                    ? 'bg-blue-950/20 border-blue-500/30'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center ${
                      isCentral
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    ح {lane}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white text-xs">{athlete.name}</span>
                      <span className="text-[10px] text-slate-400">({athlete.university})</span>
                      <span className="text-[10px] text-slate-500">رقم الصدر: #{athlete.bibNumber}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-left">
                  <div className="text-[11px] text-slate-400">
                    استجابة: <span className="text-white font-bold">{athlete.reactionTime}s</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    التصفية: <span className="text-slate-300 font-bold">{athlete.heatTime}s</span>
                  </div>
                  <div className="font-black text-sm text-white font-mono bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                    {athlete.finalTime ? `${athlete.finalTime} ث` : '--'}
                  </div>
                  <div className="w-16 text-center">
                    {athlete.medal === 'gold' && (
                      <span className="text-xs font-black text-amber-400">🥇 ذهبية</span>
                    )}
                    {athlete.medal === 'silver' && (
                      <span className="text-xs font-black text-slate-300">🥈 فضية</span>
                    )}
                    {athlete.medal === 'bronze' && (
                      <span className="text-xs font-black text-amber-600">🥉 برونزية</span>
                    )}
                    {!athlete.medal && athlete.finalRank && (
                      <span className="text-[10px] text-slate-500">المركز {athlete.finalRank}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* IAAF Regulation Notes */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1.5 leading-relaxed">
        <div className="flex items-center gap-2 font-bold text-amber-400">
          <Info className="w-4 h-4" />
          <span>ضوابط اللائحة المعتمدة لألعاب القوى بأسبوع شباب الجامعات الـ 14:</span>
        </div>
        <p className="text-[11px] text-slate-400">
          • تنص اللائحة على أحقية كل طالب بالمشاركة في سباقين فرديين وتتابع كحد أقصى.
        </p>
        <p className="text-[11px] text-slate-400">
          • يتأهل للنهائي أول متسابقين من كل تصفية (Q) ويكتمل قوام النهائي الـ 8 متسابقين بأسرع زمنين تاليين (q).
        </p>
        <p className="text-[11px] text-slate-400">
          • الحارات المركزية 3 و 4 و 5 و 6 توزع بالقرعة بين المتأهلين الأربعة الأوائل وفقاً لنتائج التصفيات، بينما توزع الحارات 7 و 8 للمركزين 5 و 6، والحارات 1 و 2 للمركزين 7 و 8.
        </p>
      </div>
    </div>
  );
};
