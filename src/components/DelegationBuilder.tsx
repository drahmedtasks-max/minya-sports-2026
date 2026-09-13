import React, { useState } from 'react';
import { Users, AlertCircle, CheckCircle2, RotateCcw, Printer, ChevronDown, ChevronUp, Sparkles, Building2 } from 'lucide-react';
import { DELEGATION_QUOTA_TABLE, OFFICIAL_INFO } from '../data/sportsData';

export const DelegationBuilder: React.FC = () => {
  // Interactive delegation customizer state
  const [selectedCounts, setSelectedCounts] = useState({
    futsalMale: 8,
    futsalFemale: 8,
    volleyballMale: 9,
    basketballMale: 8,
    tableTennisMale: 2,
    tableTennisFemale: 2,
    athleticsMale: 6,
    athleticsFemale: 6,
    padelMale: 2,
    directorCount: 1,
    coachesCount: 4,
    supervisorsCount: 5,
  });

  const [showSimulator, setShowSimulator] = useState(false);

  // Totals calculations
  const totalMaleStudents =
    selectedCounts.futsalMale +
    selectedCounts.volleyballMale +
    selectedCounts.basketballMale +
    selectedCounts.tableTennisMale +
    selectedCounts.athleticsMale +
    selectedCounts.padelMale;

  const totalFemaleStudents =
    selectedCounts.futsalFemale +
    selectedCounts.tableTennisFemale +
    selectedCounts.athleticsFemale;

  const totalStudents = totalMaleStudents + totalFemaleStudents;
  const totalStaff = selectedCounts.directorCount + selectedCounts.coachesCount + selectedCounts.supervisorsCount;
  const grandTotal = totalStudents + totalStaff;

  const isMaleExceeded = totalMaleStudents > OFFICIAL_INFO.maleStudentsMax;
  const isFemaleExceeded = totalFemaleStudents > OFFICIAL_INFO.femaleStudentsMax;
  const isStaffExceeded = totalStaff > OFFICIAL_INFO.staffMax;
  const isTotalExceeded = grandTotal > OFFICIAL_INFO.totalDelegationMax;

  const resetToOfficialQuota = () => {
    setSelectedCounts({
      futsalMale: 8,
      futsalFemale: 8,
      volleyballMale: 9,
      basketballMale: 8,
      tableTennisMale: 2,
      tableTennisFemale: 2,
      athleticsMale: 6,
      athleticsFemale: 6,
      padelMale: 2,
      directorCount: 1,
      coachesCount: 4,
      supervisorsCount: 5,
    });
  };

  return (
    <section id="delegation-table" className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-5 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            جدول الأعداد المشاركة وتوزيع قوام الوفد الرياضي
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            الجدول الرسمي المعتمد بكتيب اللائحة (صفحة 8) — سقف الوفد 61 مشاركاً
          </p>
        </div>

        <button
          onClick={() => setShowSimulator(!showSimulator)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs"
        >
          <Sparkles className="w-4 h-4" />
          <span>{showSimulator ? 'إخفاء محاكي الوفد' : 'فتح محاكي تشكيل وفد الجامعة'}</span>
          {showSimulator ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Official Quota Table (Page 8) */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-xs text-right divide-y divide-slate-200">
          <thead className="bg-slate-900 text-white font-bold">
            <tr>
              <th className="p-3 w-10 text-center">م</th>
              <th className="p-3">المسابقة / البند</th>
              <th className="p-3 text-center bg-slate-800">طلبة</th>
              <th className="p-3 text-center bg-slate-800">طالبات</th>
              <th className="p-3 text-center">جهاز فني وإداري</th>
              <th className="p-3 text-center">مدير إدارة</th>
              <th className="p-3 text-center bg-amber-600 text-slate-950 font-black">الإجمالي</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white font-medium text-slate-800">
            <tr className="hover:bg-slate-50">
              <td className="p-3 text-center font-bold text-slate-400">1</td>
              <td className="p-3 font-bold text-slate-900">خماسي قدم</td>
              <td className="p-3 text-center font-bold">8</td>
              <td className="p-3 text-center font-bold">8</td>
              <td className="p-3 text-center text-slate-400">—</td>
              <td className="p-3 text-center text-slate-400">—</td>
              <td className="p-3 text-center font-black bg-amber-50 text-slate-900">16</td>
            </tr>

            <tr className="hover:bg-slate-50">
              <td className="p-3 text-center font-bold text-slate-400">2</td>
              <td className="p-3 font-bold text-slate-900">كرة طائرة</td>
              <td className="p-3 text-center font-bold">9</td>
              <td className="p-3 text-center text-slate-400">—</td>
              <td className="p-3 text-center text-slate-400">—</td>
              <td className="p-3 text-center text-slate-400">—</td>
              <td className="p-3 text-center font-black bg-amber-50 text-slate-900">9</td>
            </tr>

            <tr className="hover:bg-slate-50">
              <td className="p-3 text-center font-bold text-slate-400">3</td>
              <td className="p-3 font-bold text-slate-900">كرة سلة</td>
              <td className="p-3 text-center font-bold">8</td>
              <td className="p-3 text-center text-slate-400">—</td>
              <td className="p-3 text-center text-slate-400">—</td>
              <td className="p-3 text-center text-slate-400">—</td>
              <td className="p-3 text-center font-black bg-amber-50 text-slate-900">8</td>
            </tr>

            <tr className="hover:bg-slate-50">
              <td className="p-3 text-center font-bold text-slate-400">4</td>
              <td className="p-3 font-bold text-slate-900">تنس طاولة</td>
              <td className="p-3 text-center font-bold">2</td>
              <td className="p-3 text-center font-bold">2</td>
              <td className="p-3 text-center text-slate-400">—</td>
              <td className="p-3 text-center text-slate-400">—</td>
              <td className="p-3 text-center font-black bg-amber-50 text-slate-900">4</td>
            </tr>

            <tr className="hover:bg-slate-50">
              <td className="p-3 text-center font-bold text-slate-400">5</td>
              <td className="p-3 font-bold text-slate-900">ألعاب قوى</td>
              <td className="p-3 text-center font-bold">6</td>
              <td className="p-3 text-center font-bold">6</td>
              <td className="p-3 text-center text-slate-400">—</td>
              <td className="p-3 text-center text-slate-400">—</td>
              <td className="p-3 text-center font-black bg-amber-50 text-slate-900">12</td>
            </tr>

            <tr className="hover:bg-slate-50">
              <td className="p-3 text-center font-bold text-slate-400">6</td>
              <td className="p-3 font-bold text-slate-900">بادل</td>
              <td className="p-3 text-center font-bold">2</td>
              <td className="p-3 text-center text-slate-400">—</td>
              <td className="p-3 text-center text-slate-400">—</td>
              <td className="p-3 text-center text-slate-400">—</td>
              <td className="p-3 text-center font-black bg-amber-50 text-slate-900">2</td>
            </tr>

            <tr className="bg-slate-50/70">
              <td className="p-3 text-center font-bold text-slate-400">7</td>
              <td className="p-3 font-bold text-slate-900">مدير الإدارة + جهاز فني وإداري</td>
              <td className="p-3 text-center text-slate-400">—</td>
              <td className="p-3 text-center text-slate-400">—</td>
              <td className="p-3 text-center font-bold text-blue-900">
                9 (4 مدرب + 5 إشراف)
              </td>
              <td className="p-3 text-center font-bold text-blue-900">1</td>
              <td className="p-3 text-center font-black bg-amber-100 text-slate-950">10</td>
            </tr>

            {/* Total Row */}
            <tr className="bg-slate-900 text-white font-black text-sm">
              <td colSpan={2} className="p-3.5 text-center">
                الإجمــــــــــــــــــــــــالي العــــــــــــــام للوفـــــــــــد
              </td>
              <td className="p-3.5 text-center bg-slate-800 text-amber-300 font-extrabold">35</td>
              <td className="p-3.5 text-center bg-slate-800 text-amber-300 font-extrabold">16</td>
              <td className="p-3.5 text-center">9</td>
              <td className="p-3.5 text-center">1</td>
              <td className="p-3.5 text-center bg-amber-500 text-slate-950 text-base font-black">
                61
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="text-[11px] text-slate-500 flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          <strong>ملاحظة تنظيمية هامة:</strong> يتم توزيع الجهاز الفني والإداري (4 مدربين و 5 مشرفين) على الألعاب بما يضمن المرافقة الكاملة والإشراف المعتمد لكافة الفرق المشاركة.
        </span>
      </div>

      {/* Interactive Simulator Section */}
      {showSimulator && (
        <div className="bg-gradient-to-br from-slate-50 to-amber-50/40 p-5 sm:p-6 rounded-3xl border-2 border-amber-300/80 space-y-5 animate-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/80 pb-3">
            <div>
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                محاكي فحص وتشغيل وفد الجامعة التفاعلي
              </h3>
              <p className="text-xs text-slate-600">
                أدخل أعداد المشاركين من جامعتك للتحقق الفوري من مطابقتها للسقف الرسمي
              </p>
            </div>

            <button
              onClick={resetToOfficialQuota}
              className="flex items-center gap-1 text-xs text-slate-700 hover:text-slate-950 font-bold px-3 py-1.5 rounded-lg bg-white border border-slate-300 shadow-xs hover:bg-slate-100 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              إعادة ضبط للحد الأقصى (61)
            </button>
          </div>

          {/* Controls Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
            {/* Futsal */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 flex justify-between">
                <span>خماسي كرة القدم</span>
                <span className="text-[10px] text-slate-500">حد أقصى: 8 طلبة / 8 طالبات</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-600 block mb-1">طلبة (0 - 8):</label>
                  <input
                    type="number"
                    min="0"
                    max="8"
                    value={selectedCounts.futsalMale}
                    onChange={(e) =>
                      setSelectedCounts({ ...selectedCounts, futsalMale: Math.max(0, Math.min(8, Number(e.target.value) || 0)) })
                    }
                    className="w-full p-1.5 rounded-lg border border-slate-300 font-bold text-center"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-600 block mb-1">طالبات (0 - 8):</label>
                  <input
                    type="number"
                    min="0"
                    max="8"
                    value={selectedCounts.futsalFemale}
                    onChange={(e) =>
                      setSelectedCounts({ ...selectedCounts, futsalFemale: Math.max(0, Math.min(8, Number(e.target.value) || 0)) })
                    }
                    className="w-full p-1.5 rounded-lg border border-slate-300 font-bold text-center"
                  />
                </div>
              </div>
            </div>

            {/* Volleyball */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 flex justify-between">
                <span>الكرة الطائرة</span>
                <span className="text-[10px] text-slate-500">حد أقصى: 9 طلبة</span>
              </div>
              <div>
                <label className="text-[10px] text-slate-600 block mb-1">طلبة (0 - 9):</label>
                <input
                  type="number"
                  min="0"
                  max="9"
                  value={selectedCounts.volleyballMale}
                  onChange={(e) =>
                    setSelectedCounts({ ...selectedCounts, volleyballMale: Math.max(0, Math.min(9, Number(e.target.value) || 0)) })
                  }
                  className="w-full p-1.5 rounded-lg border border-slate-300 font-bold text-center"
                />
              </div>
            </div>

            {/* Basketball */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 flex justify-between">
                <span>كرة السلة</span>
                <span className="text-[10px] text-slate-500">حد أقصى: 8 طلبة</span>
              </div>
              <div>
                <label className="text-[10px] text-slate-600 block mb-1">طلبة (0 - 8):</label>
                <input
                  type="number"
                  min="0"
                  max="8"
                  value={selectedCounts.basketballMale}
                  onChange={(e) =>
                    setSelectedCounts({ ...selectedCounts, basketballMale: Math.max(0, Math.min(8, Number(e.target.value) || 0)) })
                  }
                  className="w-full p-1.5 rounded-lg border border-slate-300 font-bold text-center"
                />
              </div>
            </div>

            {/* Table Tennis */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 flex justify-between">
                <span>تنس الطاولة</span>
                <span className="text-[10px] text-slate-500">حد أقصى: 2 طلبة / 2 طالبات</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-600 block mb-1">طلبة (0 - 2):</label>
                  <input
                    type="number"
                    min="0"
                    max="2"
                    value={selectedCounts.tableTennisMale}
                    onChange={(e) =>
                      setSelectedCounts({ ...selectedCounts, tableTennisMale: Math.max(0, Math.min(2, Number(e.target.value) || 0)) })
                    }
                    className="w-full p-1.5 rounded-lg border border-slate-300 font-bold text-center"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-600 block mb-1">طالبات (0 - 2):</label>
                  <input
                    type="number"
                    min="0"
                    max="2"
                    value={selectedCounts.tableTennisFemale}
                    onChange={(e) =>
                      setSelectedCounts({ ...selectedCounts, tableTennisFemale: Math.max(0, Math.min(2, Number(e.target.value) || 0)) })
                    }
                    className="w-full p-1.5 rounded-lg border border-slate-300 font-bold text-center"
                  />
                </div>
              </div>
            </div>

            {/* Athletics */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 flex justify-between">
                <span>ألعاب القوى</span>
                <span className="text-[10px] text-slate-500">حد أقصى: 6 طلبة / 6 طالبات</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-600 block mb-1">طلبة (0 - 6):</label>
                  <input
                    type="number"
                    min="0"
                    max="6"
                    value={selectedCounts.athleticsMale}
                    onChange={(e) =>
                      setSelectedCounts({ ...selectedCounts, athleticsMale: Math.max(0, Math.min(6, Number(e.target.value) || 0)) })
                    }
                    className="w-full p-1.5 rounded-lg border border-slate-300 font-bold text-center"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-600 block mb-1">طالبات (0 - 6):</label>
                  <input
                    type="number"
                    min="0"
                    max="6"
                    value={selectedCounts.athleticsFemale}
                    onChange={(e) =>
                      setSelectedCounts({ ...selectedCounts, athleticsFemale: Math.max(0, Math.min(6, Number(e.target.value) || 0)) })
                    }
                    className="w-full p-1.5 rounded-lg border border-slate-300 font-bold text-center"
                  />
                </div>
              </div>
            </div>

            {/* Padel */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 flex justify-between">
                <span>رياضة البادل</span>
                <span className="text-[10px] text-slate-500">حد أقصى: 2 طلبة (زوجي)</span>
              </div>
              <div>
                <label className="text-[10px] text-slate-600 block mb-1">طلبة (0 - 2):</label>
                <input
                  type="number"
                  min="0"
                  max="2"
                  value={selectedCounts.padelMale}
                  onChange={(e) =>
                    setSelectedCounts({ ...selectedCounts, padelMale: Math.max(0, Math.min(2, Number(e.target.value) || 0)) })
                  }
                  className="w-full p-1.5 rounded-lg border border-slate-300 font-bold text-center"
                />
              </div>
            </div>

            {/* Staff */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2 sm:col-span-2 lg:col-span-3">
              <div className="font-bold text-slate-900 flex justify-between">
                <span>الجهاز الفني والإداري والإشراف</span>
                <span className="text-[10px] text-slate-500">سقف الجهاز: 10 (1 مدير + 4 مدربين + 5 إشراف)</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-slate-600 block mb-1">مدير الإدارة (0-1):</label>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    value={selectedCounts.directorCount}
                    onChange={(e) =>
                      setSelectedCounts({ ...selectedCounts, directorCount: Math.max(0, Math.min(1, Number(e.target.value) || 0)) })
                    }
                    className="w-full p-1.5 rounded-lg border border-slate-300 font-bold text-center"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-600 block mb-1">مدربون (0-4):</label>
                  <input
                    type="number"
                    min="0"
                    max="4"
                    value={selectedCounts.coachesCount}
                    onChange={(e) =>
                      setSelectedCounts({ ...selectedCounts, coachesCount: Math.max(0, Math.min(4, Number(e.target.value) || 0)) })
                    }
                    className="w-full p-1.5 rounded-lg border border-slate-300 font-bold text-center"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-600 block mb-1">إشراف (0-5):</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={selectedCounts.supervisorsCount}
                    onChange={(e) =>
                      setSelectedCounts({ ...selectedCounts, supervisorsCount: Math.max(0, Math.min(5, Number(e.target.value) || 0)) })
                    }
                    className="w-full p-1.5 rounded-lg border border-slate-300 font-bold text-center"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Validation Status Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className={`p-3 rounded-xl border text-center ${isMaleExceeded ? 'bg-rose-50 border-rose-300 text-rose-900' : 'bg-white border-slate-200 text-slate-900'}`}>
              <div className="text-[11px] text-slate-500 font-bold">طلبة مشاركون</div>
              <div className="text-xl font-black">{totalMaleStudents} / 35</div>
              {isMaleExceeded && <span className="text-[10px] text-rose-600 font-bold">تجاوز الحد!</span>}
            </div>

            <div className={`p-3 rounded-xl border text-center ${isFemaleExceeded ? 'bg-rose-50 border-rose-300 text-rose-900' : 'bg-white border-slate-200 text-slate-900'}`}>
              <div className="text-[11px] text-slate-500 font-bold">طالبات مشاركات</div>
              <div className="text-xl font-black">{totalFemaleStudents} / 16</div>
              {isFemaleExceeded && <span className="text-[10px] text-rose-600 font-bold">تجاوز الحد!</span>}
            </div>

            <div className={`p-3 rounded-xl border text-center ${isStaffExceeded ? 'bg-rose-50 border-rose-300 text-rose-900' : 'bg-white border-slate-200 text-slate-900'}`}>
              <div className="text-[11px] text-slate-500 font-bold">جهاز فني وإداري</div>
              <div className="text-xl font-black">{totalStaff} / 10</div>
              {isStaffExceeded && <span className="text-[10px] text-rose-600 font-bold">تجاوز الحد!</span>}
            </div>

            <div className={`p-3 rounded-xl border text-center ${isTotalExceeded ? 'bg-rose-50 border-rose-300 text-rose-900' : 'bg-amber-100/70 border-amber-300 text-slate-950'}`}>
              <div className="text-[11px] text-slate-600 font-bold">إجمالي الوفد</div>
              <div className="text-xl font-black">{grandTotal} / 61</div>
              {isTotalExceeded ? (
                <span className="text-[10px] text-rose-600 font-bold">تجاوز السقف!</span>
              ) : (
                <span className="text-[10px] text-emerald-700 font-bold">مطابق للائحة ✓</span>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
