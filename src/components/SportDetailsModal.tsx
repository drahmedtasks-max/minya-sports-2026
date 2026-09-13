import React from 'react';
import { X, Trophy, Users, Clock, Hash, AlertCircle, CheckCircle2, ChevronLeft, Printer } from 'lucide-react';
import { SportRule } from '../types';

interface SportDetailsModalProps {
  sport: SportRule | null;
  onClose: () => void;
}

export const SportDetailsModal: React.FC<SportDetailsModalProps> = ({ sport, onClose }) => {
  if (!sport) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-3xl max-h-[92vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 sm:p-6 flex items-start justify-between border-b-2 border-amber-500 relative">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-md border border-amber-500/30">
                {sport.genderLabel}
              </span>
              <span className="bg-slate-700/60 text-slate-300 text-xs font-semibold px-2.5 py-0.5 rounded-md">
                {sport.category === 'team' ? 'لعبة جماعية' : sport.category === 'racket' ? 'ألعاب مضارب' : 'ألعاب قوى وميدان'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-400 shrink-0" />
              {sport.name} — اللائحة الفنية والتنظيمية
            </h2>
            <p className="text-xs text-slate-300">
              الدليل التشغيلي المعتمد بأسبوع شباب الجامعات الـ 14 - جامعة المنيا
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-xl transition shrink-0"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          {/* Key Specs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 font-bold flex items-center gap-1.5 mb-1">
                <Users className="w-4 h-4 text-amber-600" />
                قوام الفريق / الوفد
              </div>
              <div className="font-extrabold text-slate-900 text-sm">{sport.squadSize.details}</div>
              <div className="text-[11px] text-slate-500 mt-1">
                {sport.squadSize.female > 0
                  ? `${sport.squadSize.male} طلبة + ${sport.squadSize.female} طالبات`
                  : `${sport.squadSize.male} طلبة`}
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 font-bold flex items-center gap-1.5 mb-1">
                <Clock className="w-4 h-4 text-blue-600" />
                توقيت ونظام المباراة
              </div>
              <div className="font-extrabold text-slate-900 text-xs leading-relaxed">{sport.matchDuration}</div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 font-bold flex items-center gap-1.5 mb-1">
                <Hash className="w-4 h-4 text-emerald-600" />
                أرقام القمصان والزي
              </div>
              <div className="font-extrabold text-slate-900 text-xs leading-relaxed">{sport.jerseyRules}</div>
            </div>
          </div>

          {/* Points System */}
          <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200/80">
            <h3 className="font-bold text-amber-900 text-sm flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
              نظام احتساب النقاط الرسمية
            </h3>
            <p className="text-xs sm:text-sm text-amber-950 font-semibold leading-relaxed">
              {sport.pointsSystem}
            </p>
          </div>

          {/* Tie Breaker Steps */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              قواعد حسم وكسر التعادل (بالترتيب الإلزامي)
            </h3>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
              {sport.tieBreakerSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed font-medium">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Final Stage Format */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              نظام الأدوار النهائية (دور الثمانية)
            </h3>
            <p className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-200/80 text-xs text-blue-950 leading-relaxed font-medium">
              {sport.finalStageFormat}
            </p>
          </div>

          {/* Athletic Events Table if Athletics */}
          {sport.subEvents && (
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                جدول مسابقات ألعاب القوى المعتمدة رسمياً (7 مسابقات)
              </h3>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-xs text-right">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5 w-12 text-center">م</th>
                      <th className="p-2.5">المسابقة</th>
                      <th className="p-2.5 text-center">طلبة</th>
                      <th className="p-2.5 text-center">طالبات</th>
                      <th className="p-2.5">ملاحظات والتأهل</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {sport.subEvents.map((evt) => (
                      <tr key={evt.id} className="hover:bg-slate-50/80">
                        <td className="p-2.5 text-center font-bold text-slate-500">{evt.id}</td>
                        <td className="p-2.5 font-bold text-slate-900">{evt.name}</td>
                        <td className="p-2.5 text-center">
                          <span className="inline-block w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-black text-xs leading-5">✓</span>
                        </td>
                        <td className="p-2.5 text-center">
                          <span className="inline-block w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-black text-xs leading-5">✓</span>
                        </td>
                        <td className="p-2.5 text-slate-600 text-[11px]">{evt.notes || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Special Rules */}
          {sport.specialRules && sport.specialRules.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                شروط وأحكام خاصة بهذه اللعبة
              </h3>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                {sport.specialRules.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            طباعة هذه اللائحة
          </button>
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-sm"
          >
            تم الاطلاع والعودة
          </button>
        </div>
      </div>
    </div>
  );
};
