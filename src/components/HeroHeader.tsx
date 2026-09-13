import React from 'react';
import {
  Trophy,
  Award,
  Building2,
  Calendar,
  Printer,
  Share2,
  Sparkles,
  UserCheck,
  Settings,
  ShieldAlert,
  Palette,
  Lock,
  KeyRound,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { UserProfile, BrandingConfig } from '../types';
import { THEME_PALETTES } from './BrandCustomizerModal';

interface HeroHeaderProps {
  onPrint: () => void;
  onShare: () => void;
  activeQuickTool: string | null;
  setActiveQuickTool: (tool: string | null) => void;
  currentUser: UserProfile;
  branding: BrandingConfig;
  onOpenRoleSwitcher: () => void;
  onOpenAdminDashboard: () => void;
  onOpenEmergencyModal: () => void;
  onOpenLoginModal: () => void;
  onOpenBrandCustomizer: () => void;
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({
  onPrint,
  onShare,
  currentUser,
  branding,
  onOpenRoleSwitcher,
  onOpenAdminDashboard,
  onOpenEmergencyModal,
  onOpenLoginModal,
  onOpenBrandCustomizer,
}) => {
  // Determine active accent color
  const activePalette = THEME_PALETTES.find((p) => p.key === branding.primaryColorTheme);
  const accentHex =
    branding.primaryColorTheme === 'custom'
      ? branding.customAccentHex || '#f59e0b'
      : activePalette?.hex || '#f59e0b';

  // Determine header gradient
  const getHeaderGradient = () => {
    switch (branding.headerStyle) {
      case 'deep_navy':
        return 'from-slate-950 via-slate-900 to-blue-950/95';
      case 'gradient':
        return 'from-slate-950 via-amber-950/80 to-slate-900';
      case 'clean_slate':
        return 'from-slate-900 via-slate-800 to-slate-900';
      case 'gold_obsidian':
      default:
        return 'from-slate-950 via-slate-900 to-amber-950/90';
    }
  };

  const isDesigner = currentUser.role === 'designer';
  const isLeadership = currentUser.role === 'minia_leadership' || currentUser.role === 'top_management';

  return (
    <header
      className={`relative bg-gradient-to-br ${getHeaderGradient()} text-white rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden space-y-5 transition-all duration-300`}
      style={{ borderBottom: `4px solid ${accentHex}` }}
    >
      {/* Background Decorative Pattern */}
      {branding.watermarkEnabled && (
        <div
          className="absolute -left-12 -bottom-12 opacity-10 pointer-events-none select-none transition-colors"
          style={{ color: accentHex }}
        >
          <Trophy className="w-80 h-80 stroke-1" />
        </div>
      )}
      <div
        className="absolute right-0 top-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: accentHex }}
      />

      {/* Top Bar with Login Portal & Active User Info */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shadow-xs border"
            style={{
              backgroundColor: `${accentHex}20`,
              color: accentHex,
              borderColor: `${accentHex}40`,
            }}
          >
            14
          </div>
          <span className="text-xs text-slate-300 font-bold hidden sm:inline">
            بوابة النشاط الرياضي المعتمدة • {branding.universityName}
          </span>
        </div>

        {/* Action Controls: Login Portal, Dashboard, Customizer & Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Dedicated Login Portal Button for Sports Director & Designer */}
          <button
            onClick={onOpenLoginModal}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-black px-3.5 py-1.5 rounded-xl transition shadow-md active:scale-95 border border-amber-300"
            title="تسجيل دخول مدير النشاط والمصمم"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>تسجيل الدخول (مدير النشاط / المصمم)</span>
          </button>

          {/* Designer Branding & Color Studio Button */}
          <button
            onClick={onOpenBrandCustomizer}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-amber-500/40 transition shadow-sm"
            title="تخصيص اللوجو والألوان ونمط التصميم"
          >
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            <span>استوديو الهوية والتصميم</span>
          </button>

          {/* Standalone Portal Direct Launch */}
          <a
            href="/minia_portal.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-amber-500/40 transition shadow-sm"
            title="فتح البوابة الموحدة المستقلة (Standalone Portal)"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span>البوابة الموحدة</span>
          </a>

          {/* Emergency Incident Button */}
          <button
            onClick={onOpenEmergencyModal}
            className="flex items-center gap-1.5 bg-red-600/90 hover:bg-red-600 text-white text-xs font-bold px-2.5 py-1.5 rounded-xl border border-red-500 transition shadow-sm"
            title="بلاغ طوارئ ميداني"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">طوارئ الملاعب</span>
          </button>

          {/* Admin Dashboard Quick Access */}
          <button
            onClick={onOpenAdminDashboard}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-extrabold px-3 py-1.5 rounded-xl border border-slate-700 transition shadow-sm"
            title="فتح الداش بورد المركزي"
          >
            <Settings className="w-3.5 h-3.5 text-amber-400" />
            <span>الداش بورد</span>
          </button>

          {/* Current Active Role Badge */}
          <button
            onClick={onOpenRoleSwitcher}
            className="flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-medium transition"
            title="انقر لتبديل الحساب أو الاطلاع على الهوية"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="font-bold">{currentUser.name.split(' ')[0]} {currentUser.name.split(' ')[1] || ''}</span>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-md font-mono border"
              style={{
                backgroundColor: `${accentHex}15`,
                color: accentHex,
                borderColor: `${accentHex}30`,
              }}
            >
              {isDesigner ? 'المصمم' : isLeadership ? 'مدير النشاط' : currentUser.roleTitle.split(' - ')[0]}
            </span>
            <UserCheck className="w-3.5 h-3.5 text-amber-400 mr-0.5" />
          </button>
        </div>
      </div>

      {/* Main Content with University Logo & Slogans */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="text-center lg:text-right space-y-3 max-w-2xl">
          {/* Jubilee and Host Tags */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
            <span
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border shadow-sm backdrop-blur-sm"
              style={{
                backgroundColor: `${accentHex}20`,
                color: accentHex,
                borderColor: `${accentHex}40`,
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {branding.jubileeText}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-200 text-xs font-semibold px-3 py-1 rounded-full border border-blue-400/30">
              <Calendar className="w-3.5 h-3.5" />
              أسبوع شباب الجامعات والمعاهد العليا
            </span>
          </div>

          {/* Titles & Slogans */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight">
            {branding.editionTitle}
          </h1>

          <div className="flex items-center justify-center lg:justify-start gap-2 text-lg sm:text-xl font-extrabold flex-wrap">
            <span style={{ color: accentHex }}>{branding.universityName}</span>
            <span className="text-slate-400 font-normal">—</span>
            <span
              className="bg-clip-text text-transparent bg-gradient-to-r"
              style={{
                backgroundImage: `linear-gradient(to right, ${accentHex}, #ffffff)`,
              }}
            >
              "{branding.sloganText}"
            </span>
          </div>

          <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed">
            المنصة الذكية المتكاملة للدليل التشغيلي الميداني، إدارة النتائج، التحكيم والطعون (1000 ج.م)، والاعتماد الرقمي
          </p>
        </div>

        {/* Logos & Organizer Section */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          {/* University Custom Logo & Tournament Emblem Display */}
          <div className="bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/15 text-right w-full sm:w-auto shadow-lg flex items-center gap-3.5">
            {/* Main University Logo (uploaded or vector fallback) */}
            {branding.universityLogoUrl ? (
              <img
                src={branding.universityLogoUrl}
                alt="لوجو الجامعة"
                className="w-14 h-14 object-contain rounded-xl bg-white/15 p-1 border border-white/30 shadow-md shrink-0"
              />
            ) : (
              <div
                className="w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 shadow-md"
                style={{
                  backgroundColor: `${accentHex}25`,
                  borderColor: `${accentHex}50`,
                  color: accentHex,
                }}
              >
                <Award className="w-7 h-7" />
              </div>
            )}

            {/* Tournament / Jubilee Emblem if set */}
            {branding.showSecondaryEmblem && branding.tournamentLogoUrl && (
              <img
                src={branding.tournamentLogoUrl}
                alt="شعار البطولة"
                className="w-12 h-12 object-contain rounded-xl bg-white/15 p-1 border border-white/30 shadow-md shrink-0"
              />
            )}

            <div>
              <div className="text-[11px] text-slate-300 flex items-center gap-1 font-medium">
                <Building2 className="w-3 h-3" style={{ color: accentHex }} />
                الجهة المنظمة والمشرفة
              </div>
              <div className="font-black text-sm text-white">{branding.universityName}</div>
              <div
                className="text-[10px] font-semibold"
                style={{ color: accentHex }}
              >
                {branding.departmentName}
              </div>
            </div>
          </div>

          {/* Quick Action Buttons: Print & Share */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
            <button
              onClick={onPrint}
              type="button"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold px-3.5 py-3 rounded-xl border border-slate-700 transition shadow-sm active:scale-95"
              title="طباعة الدليل التشغيلي"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>طباعة الدليل</span>
            </button>
            <button
              onClick={onShare}
              type="button"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 text-slate-950 text-xs font-bold px-3.5 py-3 rounded-xl transition shadow-md active:scale-95"
              style={{ backgroundColor: accentHex }}
              title="مشاركة الرابط"
            >
              <Share2 className="w-4 h-4" />
              <span>مشاركة</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
