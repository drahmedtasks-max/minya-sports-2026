import React from 'react';
import { Users, Building2, Clock, AlertTriangle, ChevronLeft } from 'lucide-react';
import { OFFICIAL_INFO } from '../data/sportsData';

interface KeyMetricsProps {
  onSelectMetric: (targetSection: string) => void;
}

export const KeyMetrics: React.FC<KeyMetricsProps> = ({ onSelectMetric }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Metric 1: Total Delegation */}
      <div
        onClick={() => onSelectMetric('delegation')}
        className="group relative bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-amber-400/80 transition cursor-pointer text-center flex flex-col justify-between"
      >
        <div className="w-11 h-11 mx-auto mb-2 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center text-lg group-hover:bg-slate-900 group-hover:text-amber-400 transition-colors">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {OFFICIAL_INFO.totalDelegationMax}
          </div>
          <div className="text-xs font-bold text-slate-700 mt-0.5">إجمالي الوفد المعتمد</div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium leading-tight">
            35 طلبة | 16 طالبات | 10 إشراف وجهاز
          </div>
        </div>
        <div className="mt-2 text-[10px] text-amber-600 font-bold flex items-center justify-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <span>عرض جدول الحصص</span>
          <ChevronLeft className="w-3 h-3" />
        </div>
      </div>

      {/* Metric 2: Legal Quorum */}
      <div
        onClick={() => onSelectMetric('conditions')}
        className="group relative bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-amber-400/80 transition cursor-pointer text-center flex flex-col justify-between"
      >
        <div className="w-11 h-11 mx-auto mb-2 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-lg group-hover:bg-amber-600 group-hover:text-white transition-colors">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {OFFICIAL_INFO.quorumUniversities}
          </div>
          <div className="text-xs font-bold text-slate-700 mt-0.5">النصاب القانوني للعبة</div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium leading-tight">
            جامعات كحد أدنى لتنظيم المنافسة
          </div>
        </div>
        <div className="mt-2 text-[10px] text-amber-600 font-bold flex items-center justify-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <span>عرض شروط النصاب</span>
          <ChevronLeft className="w-3 h-3" />
        </div>
      </div>

      {/* Metric 3: Protest Window */}
      <div
        onClick={() => onSelectMetric('protest')}
        className="group relative bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-400/80 transition cursor-pointer text-center flex flex-col justify-between"
      >
        <div className="w-11 h-11 mx-auto mb-2 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            60 دقيقة
          </div>
          <div className="text-xs font-bold text-slate-700 mt-0.5">مهلة تقديم الطعن</div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium leading-tight">
            برسم {OFFICIAL_INFO.protestFeeEGP} ج.م يرد عند القبول
          </div>
        </div>
        <div className="mt-2 text-[10px] text-blue-600 font-bold flex items-center justify-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <span>تشغيل مؤقت الطعن</span>
          <ChevronLeft className="w-3 h-3" />
        </div>
      </div>

      {/* Metric 4: Fatal Delay Penalty */}
      <div
        onClick={() => onSelectMetric('crisis')}
        className="group relative bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-rose-400/80 transition cursor-pointer text-center flex flex-col justify-between"
      >
        <div className="w-11 h-11 mx-auto mb-2 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-lg group-hover:bg-rose-600 group-hover:text-white transition-colors">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-black text-rose-600 tracking-tight">
            15 دقيقة
          </div>
          <div className="text-xs font-bold text-slate-700 mt-0.5">زمن التأخير القاتل</div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium leading-tight">
            تطبيق شرط الانسحاب الفوري وخسارة اللقاء
          </div>
        </div>
        <div className="mt-2 text-[10px] text-rose-600 font-bold flex items-center justify-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <span>شجرة الجزاءات والحلول</span>
          <ChevronLeft className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
};
