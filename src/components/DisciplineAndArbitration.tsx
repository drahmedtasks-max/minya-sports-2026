import React, { useState } from 'react';
import { Scale, ShieldAlert, FileText, Award, AlertTriangle, CheckCircle2, ChevronDown, Clock, HelpCircle } from 'lucide-react';
import { AWARDS_INFO } from '../data/sportsData';

export const DisciplineAndArbitration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'discipline' | 'arbitration' | 'protests' | 'registration_awards'>('discipline');

  return (
    <section id="discipline-arbitration" className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-5 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
              <Scale className="w-5 h-5 text-amber-600" />
            </div>
            دليل الانضباط، التحكيم، والطعون والجوائز الرسمية
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            البنود 2 و 3 و 4 و 5 و 6 المعتمدة من اللائحة التنفيذية لجامعة المنيا
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab('discipline')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'discipline'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            شجرة الجزاءات
          </button>
          <button
            onClick={() => setActiveTab('protests')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'protests'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            الطعون والاحتجاجات
          </button>
          <button
            onClick={() => setActiveTab('arbitration')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'arbitration'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            قواعد التحكيم
          </button>
          <button
            onClick={() => setActiveTab('registration_awards')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'registration_awards'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            الاشتراك والجوائز
          </button>
        </div>
      </div>

      {/* Tab 1: Sanctions Tree */}
      {activeTab === 'discipline' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          <div className="bg-rose-50/70 border border-rose-200/80 p-4 rounded-2xl text-xs text-rose-950 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <span className="font-bold">تنبيه انضباطي حازم: </span>
              تطبق العقوبات الميدانية فوراً دون تهاون لضمان نزاهة التنافس والروح الرياضية الجامعية.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-800 font-black text-xs flex items-center justify-center">1</span>
                <h4 className="font-extrabold text-slate-900 text-sm">الطرد لسوء السلوك وحالات التكرار</h4>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                اللاعب الذي يطرد من المباراة أو المسابقة لسوء السلوك يُحرم من استكمال المباراة ويُحرم من المباراة التالية، وفي حالة تكرار المخالفة يُشطب نهائياً.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-800 font-black text-xs flex items-center justify-center">2</span>
                <h4 className="font-extrabold text-slate-900 text-sm">السلوك غير الرياضي (مشرف / مدرب / لاعب)</h4>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                المشرف أو المدرب أو اللاعب الذي يقوم بسلوك غير رياضي قبل أو أثناء أو بعد المسابقات يُشطب من الأسبوع نهائياً ويُعرض على اللجنة العليا للأسبوع.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-800 font-black text-xs flex items-center justify-center">3</span>
                <h4 className="font-extrabold text-slate-900 text-sm">التأخر 15 دقيقة (شرط الانسحاب الفوري)</h4>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                الفريق الذي يحضر متأخراً عن الموعد المحدد لبدء المباراة أو المسابقة بربع ساعة (15 دقيقة) يعتبر منسحباً ويخسر نقاط اللقاء.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-800 font-black text-xs flex items-center justify-center">4</span>
                <h4 className="font-extrabold text-slate-900 text-sm">الانسحاب من مباراتين</h4>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                الفريق الذي ينسحب من مباراتين أو لا يحضرهما تُلغى نتائجه بالكامل في تلك اللعبة.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 md:col-span-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-800 font-black text-xs flex items-center justify-center">5</span>
                <h4 className="font-extrabold text-slate-900 text-sm">إدراج لاعب مخالف لشروط اللائحة</h4>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                إذا أدرجت الجامعة لاعباً ضمن فرقها مخالفاً لشروط اللائحة التنظيمية للأسبوع يُشطب الفريق وتُلغى نتائج اللعبة الجماعية، وتُلغى نتائج اللاعب فقط في اللعبة الفردية.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Protests & Appeals */}
      {activeTab === 'protests' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50/80 p-5 rounded-2xl border border-blue-200/90 space-y-3">
              <div className="flex items-center gap-2 text-blue-950 font-black text-base">
                <Clock className="w-5 h-5 text-blue-700" />
                آلية تقديم الطعن الميداني
              </div>
              <ul className="text-xs text-blue-900 space-y-2.5 font-medium leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-blue-700 font-bold">•</span>
                  <span><strong>عن طريق مشرف الفريق:</strong> يُقدم الطعن حصراً عبر مشرف الفريق المعتمد وذلك لمشرف المباراة.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-700 font-bold">•</span>
                  <span><strong>مهلة الـ 60 دقيقة:</strong> يجب تقديم الطعن خلال ساعة واحدة فقط (60 دقيقة) من إطلاق صافرة نهاية المباراة.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-700 font-bold">•</span>
                  <span><strong>رسم الطعن:</strong> سداد رسم مالي قدره <strong>(1000) ألف جنيه مصري</strong> لا تُرد إلا في حالة صحة الاعتراض وقبوله شكلاً وموضوعاً.</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-black text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                شروط استيفاء وقبول الطعن
              </div>
              <ul className="text-xs text-slate-700 space-y-2.5 font-medium leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 font-bold">•</span>
                  <span><strong>استيفاء المستندات:</strong> الجامعة التي تتقدم بالطعن عليها أن تستوفي كافة البيانات والمستندات الخاصة بمضمون الطعن حتى تتمكن لجنة الطعون من البت في الأمر.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">•</span>
                  <span><strong>الرفض التلقائي:</strong> لا يلتفت نهائياً إلى الطعون المقدمة بعد الموعد (بعد 60 دقيقة)، أو غير مستوفاة للشروط، أو غير مصحوبة برسم الاحتجاج (1000 جنيه).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 font-bold">•</span>
                  <span><strong>جهة الفصل:</strong> يتم البت النهائي في كافة الطعون المقدمة من قبل <strong>اللجنة الرياضية العليا</strong> وقراراتها غير قابلة للنقض.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Arbitration Rules */}
      {activeTab === 'arbitration' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 font-black flex items-center justify-center text-xs">
                1
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">حكام معتمدون رسمياً</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                يتولى إدارة المباريات حكام معتمدون ومقيدون من اتحادات ومناطق اللعبة المتخصصة طبقاً للقوانين الرياضية.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 font-black flex items-center justify-center text-xs">
                2
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">بروتوكول غياب الحكام</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                في حالة تخلف أحد الحكام يقوم مندوب الجامعة المنظمة بتدبير حكم يشارك في إدارة اللقاء على أن يتم الاتفاق عليه من مشرفي الفريقين بعد التوقيع على محضر رسمي.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-900 font-black flex items-center justify-center text-xs">
                3
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">حظر الاعتراض التحكيمي</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                لا يجوز الاعتراض على قرارات الحكام مهما كانت الأسباب سواء من اللاعبين أو المدربين أو الإشراف أثناء المباريات.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Registration & Awards */}
      {activeTab === 'registration_awards' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Registration cards */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-black text-base">
                <FileText className="w-5 h-5 text-amber-600" />
                خامساً: نظام الاشتراك واستخراج البطاقات
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                1. يتم تجهيز استمارات للمشاركين (لاعب - إداري - مدرب) من قبل إدارة الأسبوع ويتم تسليمها للهيئات المشاركة على أن تسلم لتستبدل ببطاقة الاشتراك المعتمدة.
              </p>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                2. يتم تقديم بطاقات الاشتراك في المباريات أو المسابقات من خلال مشرف اللعبة بصورة إلزامية قبل بدء أي منافسة.
              </p>
            </div>

            {/* Awards */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-3">
              <div className="flex items-center gap-2 text-amber-950 font-black text-base">
                <Award className="w-5 h-5 text-amber-600" />
                سادساً: الجوائز والتكريم المعتمد
              </div>
              <div className="space-y-2 text-xs font-bold">
                <div className="flex items-center justify-between p-2 rounded-lg bg-amber-100/70 text-amber-900 border border-amber-200">
                  <span>المركز الأول:</span>
                  <span className="font-extrabold text-amber-800">الميدالية الذهبية 🥇</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-200/80 text-slate-800 border border-slate-300">
                  <span>المركز الثاني:</span>
                  <span className="font-extrabold text-slate-700">الميدالية الفضية 🥈</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-amber-800/10 text-amber-950 border border-amber-700/20">
                  <span>المركز الثالث:</span>
                  <span className="font-extrabold text-amber-900">الميدالية البرونزية 🥉</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white text-slate-800 border border-amber-300 text-center font-black">
                  كأس عام لكل لعبة: مركز أول — ثاني — ثالث 🏆
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
