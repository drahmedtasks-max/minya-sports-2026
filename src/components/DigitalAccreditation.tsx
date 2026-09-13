import React, { useState } from 'react';
import { UserProfile, DelegateBadge } from '../types';
import { PARTICIPATING_UNIVERSITIES } from '../data/sportsData';
import { QrCode, ShieldCheck, Printer, Download, Award, User, Building2, Check, RefreshCw } from 'lucide-react';

interface DigitalAccreditationProps {
  currentUser: UserProfile;
}

export const DigitalAccreditation: React.FC<DigitalAccreditationProps> = ({ currentUser }) => {
  const [name, setName] = useState('محمد أحمد عبد الله');
  const [university, setUniversity] = useState(currentUser.university || 'جامعة المنيا');
  const [sport, setSport] = useState('خماسي كرة القدم');
  const [role, setRole] = useState<'player' | 'coach' | 'supervisor' | 'director'>('player');
  const [playerNumber, setPlayerNumber] = useState('7');
  const [nationalId, setNationalId] = useState('29905152401234');
  const [isVerified, setIsVerified] = useState(true);

  const getRoleTitle = (r: string) => {
    switch (r) {
      case 'player':
        return 'لاعب معتمد';
      case 'coach':
        return 'مدرب فني';
      case 'supervisor':
        return 'مشرف وفد';
      case 'director':
        return 'مدير النشاط الرياضي';
      default:
        return 'مشارك';
    }
  };

  const getRoleColor = (r: string) => {
    switch (r) {
      case 'player':
        return 'from-amber-500 to-amber-600 text-slate-950';
      case 'coach':
        return 'from-blue-600 to-blue-700 text-white';
      case 'supervisor':
        return 'from-purple-600 to-purple-700 text-white';
      case 'director':
        return 'from-emerald-600 to-emerald-700 text-white';
      default:
        return 'from-slate-700 to-slate-800 text-white';
    }
  };

  const badgeCode = `MINIA-14-YU-${Math.abs(
    (name.length * 31 + university.length * 17) % 9000
  ) + 1000}`;

  const handlePrintBadge = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xl border border-slate-200 space-y-6">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 flex items-center justify-center border border-amber-500/30">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900">
              البطاقة الذكية للمشارك الميداني (Digital Accreditation Badge)
            </h3>
            <p className="text-xs text-slate-500">
              استخراج بطاقة إثبات الاشتراك الرسمية المعتمدة والمزودة برمز التحقق السريع (QR Code)
            </p>
          </div>
        </div>

        <button
          onClick={handlePrintBadge}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-sm transition"
        >
          <Printer className="w-4 h-4" />
          <span>طباعة البطاقة الرسمية</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Inputs (Left on RTL) */}
        <div className="lg:col-span-6 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3.5 text-xs">
          <h4 className="font-bold text-sm text-slate-800 border-b border-slate-200 pb-2">
            بيانات المشارك بالوفد الرياضي:
          </h4>

          <div>
            <label className="block text-slate-700 font-medium mb-1">الاسم رباعي (كما بالرقم القومي):</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">الجامعة التابع لها:</label>
              <select
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-amber-500"
              >
                {PARTICIPATING_UNIVERSITIES.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">الصفة في الوفد:</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-amber-500"
              >
                <option value="player">لاعب رياضي</option>
                <option value="coach">مدرب فني</option>
                <option value="supervisor">مشرف إداري</option>
                <option value="director">مدير رعاية الطلاب / الإدارة</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">المسابقة الرياضية:</label>
              <select
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-amber-500"
              >
                <option value="خماسي كرة القدم">خماسي كرة القدم</option>
                <option value="الكرة الطائرة">الكرة الطائرة</option>
                <option value="كرة السلة">كرة السلة</option>
                <option value="ألعاب القوى">ألعاب القوى</option>
                <option value="تنس الطاولة">تنس الطاولة</option>
                <option value="رياضة البادل">رياضة البادل</option>
                <option value="إدارة البعثة">إدارة البعثة (عام)</option>
              </select>
            </div>

            {role === 'player' && (
              <div>
                <label className="block text-slate-700 font-medium mb-1">رقم الفانلة / القميص:</label>
                <input
                  type="text"
                  value={playerNumber}
                  onChange={(e) => setPlayerNumber(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-amber-500 font-mono font-bold"
                  placeholder="مثال: 7"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">الرقم القومي (14 رقم):</label>
            <input
              type="text"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
            📌 <strong>تذكير لائحي:</strong> طبقاً للبند 15 من الشروط العامة، يُلزم كل لاعب بإبراز
            هذه البطاقة المعتمدة لمشرف اللعبة وحكم المباراة قبل انطلاق اللقاء للتحقق من أهليته
            ولياقته الطبية.
          </div>
        </div>

        {/* Realistic Badge Mockup (Right on RTL) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <div className="w-full max-w-[340px] bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl p-5 shadow-2xl border-2 border-amber-500/40 relative overflow-hidden space-y-4">
            {/* Lanyard Hole Mockup */}
            <div className="w-16 h-3.5 bg-slate-800 rounded-full mx-auto border border-slate-700 shadow-inner"></div>

            {/* Badge Header */}
            <div className="text-center space-y-1 border-b border-slate-800 pb-3">
              <div className="text-[10px] font-bold tracking-wider text-amber-400">
                جامعة المنيا • رعاية الطلاب
              </div>
              <h5 className="font-extrabold text-xs sm:text-sm text-slate-100 leading-snug">
                أسبوع شباب الجامعات الـ 14
              </h5>
              <p className="text-[9px] text-slate-400">
                اليوبيل الذهبي (1976 - 2026) • من قلب الصعيد نبدع
              </p>
            </div>

            {/* Badge Photo & Details */}
            <div className="flex items-center gap-3.5 pt-1">
              <div className="w-20 h-24 bg-slate-800 rounded-2xl border-2 border-amber-400 flex flex-col items-center justify-center text-amber-400 shadow-md shrink-0 relative overflow-hidden">
                <User className="w-10 h-10 text-slate-500" />
                <span className="text-[8px] font-bold mt-1 text-slate-400">صورة معتمدة</span>
                <div className="absolute top-1 right-1 bg-amber-500 text-slate-950 text-[8px] font-black px-1 rounded-sm">
                  {role === 'player' ? `#${playerNumber}` : 'ID'}
                </div>
              </div>

              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="font-black text-sm text-white truncate">{name}</div>
                <div className="text-xs text-amber-300 font-bold truncate flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>{university}</span>
                </div>
                <div className="text-[11px] text-slate-300">
                  المسابقة: <strong className="text-slate-100">{sport}</strong>
                </div>
                <div
                  className={`text-[10px] font-black px-2.5 py-0.5 rounded-full inline-block bg-linear-to-r shadow-xs ${getRoleColor(
                    role
                  )}`}
                >
                  {getRoleTitle(role)}
                </div>
              </div>
            </div>

            {/* QR Code & Barcode Section */}
            <div className="bg-white text-slate-950 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-inner">
              <div className="space-y-1 text-[10px]">
                <span className="font-bold text-slate-600 block">كود الاعتماد الإلكتروني:</span>
                <span className="font-mono font-black text-xs text-slate-900 block tracking-wider">
                  {badgeCode}
                </span>
                <div className="flex items-center gap-1 text-[9px] text-emerald-700 font-bold pt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>مستوفٍ الفحص الطبي والأهلية</span>
                </div>
              </div>

              {/* Graphic QR Simulation */}
              <div className="w-16 h-16 bg-slate-900 text-white rounded-xl p-1.5 flex items-center justify-center shrink-0 border border-slate-700">
                <QrCode className="w-12 h-12 text-amber-400" />
              </div>
            </div>

            {/* Badge Footer Stamp */}
            <div className="pt-2 border-t border-slate-800 text-center text-[9px] text-slate-400 flex items-center justify-between">
              <span>ختم إدارة النشاط الرياضي</span>
              <span className="font-mono text-slate-500">2026-MINIA-OFFICIAL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
