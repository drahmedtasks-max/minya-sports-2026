import React, { useState } from 'react';
import {
  ShieldCheck,
  Palette,
  X,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Trophy,
  Sparkles,
  Sliders,
  Building2,
  Activity,
  Terminal,
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { USER_ROLES_CATALOG, ADMIN_CREDENTIALS_LIST } from '../data/sportsData';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onLoginSuccess: (user: UserProfile, targetAction?: 'admin_dashboard' | 'design_studio') => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
}) => {
  const [selectedRoleTab, setSelectedRoleTab] = useState<'director' | 'designer' | 'all'>('director');
  const [enteredPin, setEnteredPin] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Find user profiles
  const sportsDirectorProfile = USER_ROLES_CATALOG.find((u) => u.id === 'u-minia-basiouny') || USER_ROLES_CATALOG[1];
  const designerProfile = USER_ROLES_CATALOG.find((u) => u.id === 'u-designer') || {
    id: 'u-designer',
    name: 'أ/ مصمم الهوية البصرية والواجهات',
    role: 'designer' as UserRole,
    roleTitle: 'مصمم المنصة ومسؤول الهوية والشعارات والألوان',
    university: 'جامعة المنيا - الإدارة العامة لرعاية الطلاب',
    phone: '01099887766',
    avatarBg: 'bg-rose-600',
  };

  const handleQuickLogin = (roleType: 'director' | 'designer') => {
    setAuthError(null);
    if (roleType === 'director') {
      onLoginSuccess(sportsDirectorProfile, 'admin_dashboard');
      onClose();
    } else {
      onLoginSuccess(designerProfile, 'design_studio');
      onClose();
    }
  };

  const handlePinLogin = (roleType: 'director' | 'designer') => {
    setAuthError(null);
    const validPin = roleType === 'director' ? '2026' : 'designer';

    if (enteredPin.trim() === '' || enteredPin.trim() === validPin || enteredPin.trim() === '2026' || enteredPin.trim() === 'admin') {
      if (roleType === 'director') {
        onLoginSuccess(sportsDirectorProfile, 'admin_dashboard');
      } else {
        onLoginSuccess(designerProfile, 'design_studio');
      }
      onClose();
    } else {
      setAuthError(`رمز المرور غير صحيح. يمكنك استخدام الرمز التوضيحي (${validPin}) أو الضغط على تسجيل الدخول المباشر.`);
    }
  };

  const isDirectorCurrent = currentUser.id === sportsDirectorProfile.id;
  const isDesignerCurrent = currentUser.id === designerProfile.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white p-5 sm:p-6 flex items-center justify-between border-b-2 border-amber-500">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-base sm:text-xl text-white">
                  بوابة تسجيل الدخول الإداري والتصميم
                </h2>
                <span className="text-[10px] bg-amber-500/30 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/40">
                  لوحة التحكم 2026
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                نافذة خاصة بمدير النشاط الرياضي والمصمم الفني للاطلاع على الداش بورد وتخصيص الهوية
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active User Status Bar */}
        <div className="bg-slate-100 px-5 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">الحساب النشط حالياً:</span>
            <span className="font-extrabold text-slate-900">{currentUser.name}</span>
            <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-bold">
              {currentUser.roleTitle.split(' - ')[0]}
            </span>
          </div>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            متصل بالمنصة
          </span>
        </div>

        {/* Portal Role Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-2 gap-2 text-xs font-bold">
          <button
            onClick={() => {
              setSelectedRoleTab('director');
              setAuthError(null);
              setEnteredPin('');
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
              selectedRoleTab === 'director'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>مدير النشاط الرياضي</span>
          </button>

          <button
            onClick={() => {
              setSelectedRoleTab('designer');
              setAuthError(null);
              setEnteredPin('');
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
              selectedRoleTab === 'designer'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>المصمم ومطور الهوية</span>
          </button>

          <button
            onClick={() => {
              setSelectedRoleTab('all');
              setAuthError(null);
            }}
            className={`py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
              selectedRoleTab === 'all'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>باقي اللجان</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {/* TAB 1: SPORTS ACTIVITY DIRECTOR */}
          {selectedRoleTab === 'director' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      د/ أحمد بسيوني حسن
                    </h3>
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full border border-blue-300">
                      مدير الإدارة العامة للنشاط الرياضي
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    جامعة المنيا — الإدارة العامة لرعاية الطلاب (01007232345)
                  </p>
                  <p className="text-xs text-blue-900 font-medium mt-2 bg-white/70 p-2.5 rounded-xl border border-blue-100">
                    <strong>صلاحيات الحساب:</strong> الاطلاع على الداش بورد المركزي، اعتماد وإدخال نتائج المباريات مباشرة، البت في الطعون المرفوعة ورسوم الـ 1000 ج.م، إدارة التذاكر والبلاغات العاجلة، وإرسال تنبيهات البث الميداني.
                  </p>
                </div>
              </div>

              {isDirectorCurrent && (
                <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 flex items-center gap-2 text-xs text-emerald-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>أنت مسجل حالياً كمدير النشاط الرياضي. يمكنك الانتقال مباشرة للداش بورد:</span>
                </div>
              )}

              {/* PIN / Password Input */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                    <span>رمز الدخول السري / PIN (اختياري للتجربة: 2026):</span>
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">الرمز الافتراضي: 2026</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="password"
                    value={enteredPin}
                    onChange={(e) => setEnteredPin(e.target.value)}
                    placeholder="أدخل رمز المرور أو اضغط دخول مباشر..."
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handlePinLogin('director');
                    }}
                  />
                  <button
                    onClick={() => handlePinLogin('director')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-sm whitespace-nowrap"
                  >
                    دخول برمز
                  </button>
                </div>

                {authError && (
                  <div className="text-xs text-red-600 flex items-center gap-1.5 bg-red-50 p-2 rounded-xl border border-red-200">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  onClick={() => handleQuickLogin('director')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 active:scale-98"
                >
                  <Trophy className="w-4 h-4" />
                  <span>دخول مباشر كمدير النشاط وفتح الداش بورد</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: DESIGNER & BRANDING DIRECTOR */}
          {selectedRoleTab === 'designer' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md font-black">
                  <Palette className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      المصمم الفني ومطور الهوية البصرية
                    </h3>
                    <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                      إدارة التصميم والشعارات
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    مسؤول الهوية البصرية والجرافيك — رعاية الطلاب بجامعة المنيا
                  </p>
                  <p className="text-xs text-amber-950 font-medium mt-2 bg-white/70 p-2.5 rounded-xl border border-amber-200">
                    <strong>صلاحيات المصمم:</strong> رفع لوجو جامعة المنيا وأي شعار خاص بالبطولة أو الوزارة، التحكم الكامل في درجات الألوان (الذهبي، الكحلي، الزمردي، العنابي، أو كود HEX مخصص)، تعديل نمط الهيدر، واستوديو المعاينة الحية.
                  </p>
                </div>
              </div>

              {isDesignerCurrent && (
                <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 flex items-center gap-2 text-xs text-emerald-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>أنت مسجل حالياً بحساب المصمم الفني. اضغط أدناه لفتح استوديو التصميم:</span>
                </div>
              )}

              {/* PIN / Password Input */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                    <span>رمز دخول المصمم (اختياري للتجربة: designer):</span>
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">الرمز الافتراضي: designer</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="password"
                    value={enteredPin}
                    onChange={(e) => setEnteredPin(e.target.value)}
                    placeholder="أدخل رمز المصمم أو اضغط الدخول المباشر..."
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handlePinLogin('designer');
                    }}
                  />
                  <button
                    onClick={() => handlePinLogin('designer')}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl transition shadow-sm whitespace-nowrap"
                  >
                    دخول برمز
                  </button>
                </div>

                {authError && (
                  <div className="text-xs text-red-600 flex items-center gap-1.5 bg-red-50 p-2 rounded-xl border border-red-200">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  onClick={() => handleQuickLogin('designer')}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 active:scale-98"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>دخول مباشر كمصمم وفتح استوديو الهوية والألوان</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: ALL ORGANIZING COMMITTEES */}
          {selectedRoleTab === 'all' && (
            <div className="space-y-2.5 animate-in fade-in duration-150">
              <p className="text-xs text-slate-600 font-medium">
                اختر الحساب المطلوب لتسجيل الدخول السريع:
              </p>
              <div className="grid gap-2">
                {ADMIN_CREDENTIALS_LIST.map((cred) => (
                  <div
                    key={cred.id}
                    onClick={() => {
                      const user = USER_ROLES_CATALOG.find((u) => u.id === cred.userId) || sportsDirectorProfile;
                      onLoginSuccess(user, cred.id === 'designer' ? 'design_studio' : 'admin_dashboard');
                      onClose();
                    }}
                    className="p-3 bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 hover:border-amber-400 transition cursor-pointer flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                        {cred.id === 'sports_director' && <Trophy className="w-5 h-5 text-blue-400" />}
                        {cred.id === 'designer' && <Palette className="w-5 h-5 text-amber-400" />}
                        {cred.id === 'field_manager' && <Activity className="w-5 h-5 text-emerald-400" />}
                        {cred.id === 'sysadmin' && <Terminal className="w-5 h-5 text-purple-400" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs text-slate-900">{cred.label}</span>
                          <span className="text-[10px] text-slate-500">({cred.officialName})</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-snug">{cred.description}</p>
                      </div>
                    </div>
                    <span className="text-xs text-amber-600 font-bold whitespace-nowrap">دخول &larr;</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>نظام تسجيل دخول أسبوع شباب الجامعات الـ 14 - جامعة المنيا</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};
