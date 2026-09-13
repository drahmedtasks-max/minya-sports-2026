import React, { useState } from 'react';
import { FileText, Download, Printer, ExternalLink, ShieldCheck, MapPin, Scale, Check } from 'lucide-react';
import { OFFICIAL_INFO } from '../data/sportsData';

export const DocumentsDownloadHub: React.FC = () => {
  const [activeDocPreview, setActiveDocPreview] = useState<'roster' | 'protest' | 'venues' | null>(
    null
  );

  const handlePrintDoc = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xl border border-slate-200 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center border border-blue-500/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900">
              مكتبة المستندات والاستمارات الرسمية القابلة للتحميل والطباعة
            </h3>
            <p className="text-xs text-slate-500">
              النماذج المعتمدة من الإدارة العامة لرعاية الطلاب بجامعة المنيا
            </p>
          </div>
        </div>

        <button
          onClick={handlePrintDoc}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition"
        >
          <Printer className="w-4 h-4" />
          <span>طباعة الدليل والنماذج</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Document 1: Official Delegation Roster */}
        <div className="bg-slate-50 hover:bg-slate-100/80 rounded-2xl p-4 border border-slate-200 space-y-3 transition flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">
              استمارة تفريغ قوام وفد الجامعة المعتمد (61 مشاركاً)
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              النموذج الرسمي لحصر المشاركين وتوزيعهم طبقاً لجدول الأعداد (35 طلبة + 16 طالبات + 10
              جهاز فني وإداري).
            </p>
          </div>

          <button
            onClick={() => setActiveDocPreview('roster')}
            className="w-full mt-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>عرض واستخراج الاستمارة</span>
          </button>
        </div>

        {/* Document 2: Official Protest Form */}
        <div className="bg-slate-50 hover:bg-slate-100/80 rounded-2xl p-4 border border-slate-200 space-y-3 transition flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-600 flex items-center justify-center font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">
              استمارة تقديم طعن رسمي على مباراة (رسم 1000 ج.م)
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              نموذج تقديم الاحتجاج للجنة المنظمة خلال 60 دقيقة من نهاية المباراة، متضمناً خانة إيصال
              سداد الرسوم وتوقيع المشرف.
            </p>
          </div>

          <button
            onClick={() => setActiveDocPreview('protest')}
            className="w-full mt-3 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>عرض واستخراج الاستمارة</span>
          </button>
        </div>

        {/* Document 3: Campus Venues Guide */}
        <div className="bg-slate-50 hover:bg-slate-100/80 rounded-2xl p-4 border border-slate-200 space-y-3 transition flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">
              مخطط وتوزيع ملاعب ومجمعات جامعة المنيا
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              خريطة الصالات المغطاة، استاد الجامعة ومضمار ألعاب القوى، مجمع ملاعب البادل، وملاعب
              التنس الأرضي وتنس الطاولة.
            </p>
          </div>

          <button
            onClick={() => setActiveDocPreview('venues')}
            className="w-full mt-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>عرض دليل الملاعب</span>
          </button>
        </div>

        {/* Document 4: Standalone Single-File Offline Code */}
        <div className="bg-amber-500/10 hover:bg-amber-500/15 rounded-2xl p-4 border border-amber-500/30 space-y-3 transition flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              ⚡
            </div>
            <h4 className="font-bold text-sm text-slate-900">
              الكود المدمج المستقل (Single-File Offline Portal)
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              ملف HTML/CSS/JS متكامل مدمج بالكامل جاهز للتشغيل والنسخ الفوري دون أي خادم خارجي.
            </p>
          </div>

          <div className="space-y-2 mt-3">
            <a
              href="/standalone_minia_portal.html"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-xs text-center"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>تشغيل الكود المستقل (نافذة جديدة)</span>
            </a>
            <a
              href="/standalone_minia_portal.html"
              download="minia_sports_portal_standalone.html"
              className="w-full py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition text-center"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تحميل ملف HTML المدمج</span>
            </a>
          </div>
        </div>
      </div>

      {/* Document Modal Preview */}
      {activeDocPreview && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 text-slate-800">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <h4 className="font-bold text-sm sm:text-base">
                  معاينة المستند الرسمي للطباعة والاعتماد
                </h4>
              </div>
              <button
                onClick={() => setActiveDocPreview(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {activeDocPreview === 'roster' && (
                <div className="space-y-4 border border-slate-300 p-6 rounded-2xl">
                  <div className="text-center border-b border-slate-300 pb-3 space-y-1">
                    <h5 className="font-black text-sm text-slate-900">
                      جمهورية مصر العربية • وزارة التعليم العالي
                    </h5>
                    <h6 className="font-bold text-xs text-slate-700">
                      جامعة المنيا • أسبوع شباب الجامعات والمعاهد العليا الـ 14 (2026)
                    </h6>
                    <p className="text-[11px] text-amber-700 font-bold">
                      كشف تفريغ وفد الجامعة المعتمد (الحد الأقصى 61 مشاركاً)
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <p>
                      <strong>اسم الجامعة:</strong> ........................................
                    </p>
                    <p>
                      <strong>رئيس الوفد:</strong> ........................................
                    </p>
                  </div>

                  <table className="w-full border-collapse border border-slate-300 text-right text-[11px]">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border border-slate-300 p-2">م</th>
                        <th className="border border-slate-300 p-2">المسابقة</th>
                        <th className="border border-slate-300 p-2">طلبة</th>
                        <th className="border border-slate-300 p-2">طالبات</th>
                        <th className="border border-slate-300 p-2">الإجمالي المعتمد</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-300 p-2">1</td>
                        <td className="border border-slate-300 p-2">خماسي كرة القدم</td>
                        <td className="border border-slate-300 p-2">8</td>
                        <td className="border border-slate-300 p-2">8</td>
                        <td className="border border-slate-300 p-2">16</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-2">2</td>
                        <td className="border border-slate-300 p-2">الكرة الطائرة</td>
                        <td className="border border-slate-300 p-2">9</td>
                        <td className="border border-slate-300 p-2">-</td>
                        <td className="border border-slate-300 p-2">9</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-2">3</td>
                        <td className="border border-slate-300 p-2">كرة السلة</td>
                        <td className="border border-slate-300 p-2">8</td>
                        <td className="border border-slate-300 p-2">-</td>
                        <td className="border border-slate-300 p-2">8</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-2">4</td>
                        <td className="border border-slate-300 p-2">تنس الطاولة</td>
                        <td className="border border-slate-300 p-2">2</td>
                        <td className="border border-slate-300 p-2">2</td>
                        <td className="border border-slate-300 p-2">4</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-2">5</td>
                        <td className="border border-slate-300 p-2">ألعاب القوى</td>
                        <td className="border border-slate-300 p-2">6</td>
                        <td className="border border-slate-300 p-2">6</td>
                        <td className="border border-slate-300 p-2">12</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-2">6</td>
                        <td className="border border-slate-300 p-2">رياضة البادل</td>
                        <td className="border border-slate-300 p-2">2</td>
                        <td className="border border-slate-300 p-2">-</td>
                        <td className="border border-slate-300 p-2">2</td>
                      </tr>
                      <tr className="bg-amber-50/60 font-bold">
                        <td className="border border-slate-300 p-2">7</td>
                        <td className="border border-slate-300 p-2">
                          جهاز فني وإداري (1 مدير + 4 مدربين + 5 مشرفين)
                        </td>
                        <td className="border border-slate-300 p-2">-</td>
                        <td className="border border-slate-300 p-2">-</td>
                        <td className="border border-slate-300 p-2">10</td>
                      </tr>
                      <tr className="bg-slate-200 font-extrabold">
                        <td colSpan={4} className="border border-slate-300 p-2 text-center">
                          الإجمالي الكلي الأقصى لقوام الوفد
                        </td>
                        <td className="border border-slate-300 p-2 text-center text-amber-700">
                          61 فرداً
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="pt-6 flex items-center justify-between text-xs">
                    <div>
                      <p>مشرف عام النشاط الرياضي بالجامعة</p>
                      <p className="mt-4 text-slate-400">التوقيع: ...........................</p>
                    </div>
                    <div>
                      <p>يعتمد عميد الكلية / نائب رئيس الجامعة</p>
                      <p className="mt-4 text-slate-400">الختم والتوقيع: ...........................</p>
                    </div>
                  </div>
                </div>
              )}

              {activeDocPreview === 'protest' && (
                <div className="space-y-4 border border-slate-300 p-6 rounded-2xl">
                  <div className="text-center border-b border-slate-300 pb-3 space-y-1">
                    <h5 className="font-black text-sm text-slate-900">
                      استمارة تقديم طعن رسمي - أسبوع شباب الجامعات الـ 14
                    </h5>
                    <p className="text-xs text-red-600 font-bold">
                      رسم الطعن 1000 جنيه مصري | المهلة القانونية: 60 دقيقة فقط من نهاية المباراة
                    </p>
                  </div>

                  <div className="space-y-3 text-xs leading-loose">
                    <p>
                      <strong>الجامعة الطاعنة:</strong> ........................................
                    </p>
                    <p>
                      <strong>المباراة محل الطعن:</strong> ........................................
                      <strong> ضد جامعة:</strong> ........................................
                    </p>
                    <p>
                      <strong>توقيت انتهاء المباراة:</strong> .....................{' '}
                      <strong>توقيت تقديم الطعن:</strong> .....................
                    </p>
                    <p>
                      <strong>رقم إيصال سداد الـ 1000 جنيه:</strong> ........................................
                    </p>
                    <p>
                      <strong>موضوع ومبررات الطعن:</strong>
                    </p>
                    <div className="h-28 border border-dashed border-slate-300 rounded-xl p-3 text-slate-400">
                      اكتب هنا أسباب الطعن والمواد اللائحية المخالفة...
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between text-xs">
                    <p>توقيع مشرف الوفد المعتمد: ..........................</p>
                    <p>استلام مشرف المباراة وتوقيعه: ..........................</p>
                  </div>
                </div>
              )}

              {activeDocPreview === 'venues' && (
                <div className="space-y-4 border border-slate-300 p-6 rounded-2xl">
                  <div className="text-center border-b border-slate-300 pb-3 space-y-1">
                    <h5 className="font-black text-sm text-slate-900">
                      دليل ملاعب ومجمعات الأنشطة الرياضية - جامعة المنيا
                    </h5>
                    <p className="text-xs text-slate-500">
                      خريطة تمركز الصالات والملاعب المستضيفة لفعاليات أسبوع شباب الجامعات 14
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <strong className="text-amber-800 block mb-1">
                        1. الصالة المغطاة الرئيسية (الملعب 1 و 2):
                      </strong>
                      <p className="text-slate-600">
                        تستضيف مباريات خماسي كرة القدم، الافتتاح والختام.
                      </p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <strong className="text-amber-800 block mb-1">
                        2. صالة الأنشطة الرياضية ومجمع الصالات 2:
                      </strong>
                      <p className="text-slate-600">
                        مباريات الكرة الطائرة ومنافسات كرة السلة طلبة.
                      </p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <strong className="text-amber-800 block mb-1">
                        3. المضمار الأولمبي باستاد جامعة المنيا:
                      </strong>
                      <p className="text-slate-600">
                        منافسات ألعاب القوى (المضمار والميدان والتتابع).
                      </p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <strong className="text-amber-800 block mb-1">
                        4. مجمع ملاعب البادل والمركز الأولمبي:
                      </strong>
                      <p className="text-slate-600">
                        مباريات البادل زوجي طلبة وبطولات تنس الطاولة.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setActiveDocPreview(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200"
              >
                إغلاق
              </button>
              <button
                onClick={handlePrintDoc}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة هذا المستند</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
