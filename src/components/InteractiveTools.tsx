import React, { useState, useEffect } from 'react';
import { Clock, ShieldAlert, AlertTriangle, CheckSquare, Square, Copy, Check, Sparkles, RefreshCw, ChevronRight } from 'lucide-react';
import { CRISIS_SCENARIOS, OFFICIAL_INFO } from '../data/sportsData';
import { CrisisScenario } from '../types';

export const InteractiveTools: React.FC = () => {
  // Timer state
  const [matchEndTime, setMatchEndTime] = useState<string>(() => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  });
  const [remainingSeconds, setRemainingSeconds] = useState<number>(3600); // 60 min = 3600 sec
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [protestChecklist, setProtestChecklist] = useState({
    supervisorOnly: true,
    matchSupervisorDirect: true,
    feePaid: true,
    documentsAttached: false,
  });
  const [copiedForm, setCopiedForm] = useState<boolean>(false);

  // Crisis Scenarios filter
  const [selectedScenario, setSelectedScenario] = useState<CrisisScenario | null>(CRISIS_SCENARIOS[0]);
  const [scenarioSearch, setScenarioSearch] = useState<string>('');

  // Timer logic
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds((prev) => Math.max(0, prev - 1));
      }, 1000);
    } else if (remainingSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, remainingSeconds]);

  const startTimerNow = () => {
    const now = new Date();
    setMatchEndTime(now.toTimeString().slice(0, 5));
    setRemainingSeconds(3600);
    setIsTimerRunning(true);
  };

  const handleCustomTimeStart = () => {
    const [hours, mins] = matchEndTime.split(':').map(Number);
    const end = new Date();
    end.setHours(hours, mins, 0, 0);

    const deadline = new Date(end.getTime() + 60 * 60 * 1000);
    const now = new Date();

    const diffSec = Math.floor((deadline.getTime() - now.getTime()) / 1000);
    setRemainingSeconds(Math.max(0, Math.min(3600, diffSec)));
    setIsTimerRunning(true);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const copyProtestTemplate = () => {
    const template = `نموذج تقديم طعن رسمي — أسبوع شباب الجامعات الـ 14 - جامعة المنيا
-----------------------------------------------------
إلى: رئيس اللجنة الفنية ومشرف اللعبة
الجامعة الطاعنة: .........................
المسابقة / اللعبة: .........................
تاريخ وموعد المباراة: .........................
المباراة بين: جامعة (.................) ضد جامعة (.................)
اسم مشرف الفريق مقدم الطعن: .........................
رقم هاتف المشرف: .........................
قيمة رسم الطعن المسدد: 1000 جنيه مصري (مرفق إيصال السداد)
وقت انتهاء المباراة: ${matchEndTime}
وقت تقديم الطعن: .........................

موضوع وأسباب الطعن:
..................................................................
..................................................................

المستندات الثبوتية المرفقة:
1. ................................................................
2. ................................................................

توقيع مشرف الفريق: ......................
توقيع مستلم الطعن (مشرف المباراة): ......................`;

    navigator.clipboard.writeText(template);
    setCopiedForm(true);
    setTimeout(() => setCopiedForm(false), 3000);
  };

  const filteredScenarios = CRISIS_SCENARIOS.filter(
    (s) =>
      s.title.toLowerCase().includes(scenarioSearch.toLowerCase()) ||
      s.situation.toLowerCase().includes(scenarioSearch.toLowerCase()) ||
      s.officialResolution.toLowerCase().includes(scenarioSearch.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Tool 1: 60-Minute Protest Timer & Checklist */}
      <section id="protest-tool" className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-5 sm:p-6 flex flex-col justify-between space-y-5">
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              مؤقت مهلة الطعن الرسمي الميداني (60 دقيقة)
            </h2>
            <span className="text-[11px] bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full">
              المادة رابعاً / 1
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            يجب تقديم الطعن المعتمد وسداد رسم {OFFICIAL_INFO.protestFeeEGP} ج.م خلال 60 دقيقة من صافرة نهاية المباراة
          </p>

          {/* Timer Display */}
          <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white text-center shadow-md relative overflow-hidden">
            <div className="text-[11px] text-slate-300 font-bold mb-1">الوقت المتبقي لتقديم الطعن</div>
            <div className={`text-4xl sm:text-5xl font-mono font-black tracking-wider ${
              remainingSeconds === 0 ? 'text-rose-500 animate-pulse' : remainingSeconds < 600 ? 'text-amber-400' : 'text-blue-400'
            }`}>
              {formatTimer(remainingSeconds)}
            </div>

            <div className="mt-2 text-xs font-semibold">
              {remainingSeconds === 0 ? (
                <span className="text-rose-400">انتهت المهلة القانونية — يُرفض الطعن تلقائياً طبقاً للائحة!</span>
              ) : remainingSeconds < 600 ? (
                <span className="text-amber-300">تنبيه: متبقي أقل من 10 دقائق على إغلاق باب قبول الطعن!</span>
              ) : (
                <span className="text-slate-300">المهلة القانونية سارية ومفتوحة لاستلام الطعن</span>
              )}
            </div>
          </div>

          {/* Time Controller */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
              <label className="text-slate-600 font-bold">وقت نهاية اللقاء:</label>
              <input
                type="time"
                value={matchEndTime}
                onChange={(e) => setMatchEndTime(e.target.value)}
                className="bg-white px-2 py-1 rounded-lg border border-slate-300 font-mono font-bold text-slate-800"
              />
              <button
                onClick={handleCustomTimeStart}
                className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-lg font-bold transition"
              >
                تحديث
              </button>
            </div>

            <button
              onClick={startTimerNow}
              className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-xl font-bold transition flex items-center gap-1 shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              بدء الـ 60 دقيقة من الآن
            </button>
          </div>

          {/* Official Checklist */}
          <div className="mt-4 space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
            <div className="font-bold text-slate-900 mb-1 flex items-center justify-between">
              <span>قائمة التحقق الإلزامية لقبول الطعن شكلاً:</span>
              <span className="text-[10px] text-slate-500">لائحة جامعة المنيا</span>
            </div>

            <div
              onClick={() => setProtestChecklist({ ...protestChecklist, supervisorOnly: !protestChecklist.supervisorOnly })}
              className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-950 font-medium"
            >
              {protestChecklist.supervisorOnly ? (
                <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-400 shrink-0" />
              )}
              <span>مقدم الطعن هو مشرف الفريق المعتمد رسمياً (يحظر تقديمه من غيره).</span>
            </div>

            <div
              onClick={() => setProtestChecklist({ ...protestChecklist, matchSupervisorDirect: !protestChecklist.matchSupervisorDirect })}
              className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-950 font-medium"
            >
              {protestChecklist.matchSupervisorDirect ? (
                <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-400 shrink-0" />
              )}
              <span>تسليم الطعن خطياً لمشرف المباراة المعتمد.</span>
            </div>

            <div
              onClick={() => setProtestChecklist({ ...protestChecklist, feePaid: !protestChecklist.feePaid })}
              className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-950 font-medium"
            >
              {protestChecklist.feePaid ? (
                <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-400 shrink-0" />
              )}
              <span>سداد رسم الطعن المالي (1000 جنيه مصري) والحصول على إيصال رسمي.</span>
            </div>

            <div
              onClick={() => setProtestChecklist({ ...protestChecklist, documentsAttached: !protestChecklist.documentsAttached })}
              className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-950 font-medium"
            >
              {protestChecklist.documentsAttached ? (
                <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-400 shrink-0" />
              )}
              <span>استيفاء وتضمين كافة البيانات والمستندات الثبوتية المؤيدة للطعن.</span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={copyProtestTemplate}
          className="w-full py-2.5 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 font-bold text-xs flex items-center justify-center gap-2 transition active:scale-98"
        >
          {copiedForm ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span>تم نسخ نموذج استمارة الطعن بنجاح!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-blue-700" />
              <span>نسخ نموذج استمارة الطعن الرسمية جاهزة للتعبئة</span>
            </>
          )}
        </button>
      </section>

      {/* Tool 2: Field Quick Decision Resolver */}
      <section id="crisis-tool" className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-5 sm:p-6 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              موجّه فض الأزمات والتعارضات الميدانية الفوري
            </h2>
            <span className="text-[11px] bg-rose-100 text-rose-800 font-bold px-2.5 py-0.5 rounded-full">
              حلول قانونية فورية
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-2">
            دليل المشرفين ورؤساء اللجان للتعامل الفوري مع أي طارئ ميداني طبقاً لنص اللائحة
          </p>

          {/* Quick Filter Search */}
          <div className="mt-3">
            <input
              type="text"
              placeholder="ابحث في سيناريوهات الأزمات (تأخر، زي، حكم، طرد...)"
              value={scenarioSearch}
              onChange={(e) => setScenarioSearch(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Scenarios pills */}
          <div className="mt-3 flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
            {filteredScenarios.map((sc) => (
              <button
                key={sc.id}
                onClick={() => setSelectedScenario(sc)}
                className={`text-[11px] px-2.5 py-1 rounded-lg font-bold transition text-right ${
                  selectedScenario?.id === sc.id
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {sc.title}
              </button>
            ))}
          </div>

          {/* Selected Scenario Resolution Box */}
          {selectedScenario && (
            <div className="mt-4 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-md bg-amber-500 text-slate-950">
                  {selectedScenario.ruleCode}
                </span>
                <span className="text-[10px] text-slate-500 font-semibold">
                  مرجع الكتيب: {selectedScenario.referencePage}
                </span>
              </div>

              <h3 className="font-extrabold text-slate-900 text-sm">{selectedScenario.title}</h3>

              <div className="text-xs text-slate-700 bg-white/80 p-2.5 rounded-xl border border-amber-100">
                <span className="font-bold text-slate-900">الواقعة الميدانية: </span>
                {selectedScenario.situation}
              </div>

              <div className="text-xs text-slate-900 font-medium bg-white p-3 rounded-xl border border-amber-200/80 space-y-1">
                <div className="font-black text-rose-700 flex items-center gap-1 text-xs">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  الحل والقرار التنفيذي الإلزامي:
                </div>
                <p className="leading-relaxed">{selectedScenario.officialResolution}</p>
              </div>
            </div>
          )}
        </div>

        <div className="text-[11px] text-slate-500 font-medium text-center bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          في حال حدوث نزاع لم يرد به نص قاطع، يُعرض الأمر فوراً على <strong>اللجنة العليا للأسبوع</strong>
        </div>
      </section>
    </div>
  );
};
