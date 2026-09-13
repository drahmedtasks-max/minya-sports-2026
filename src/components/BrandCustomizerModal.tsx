import React, { useState, useRef } from 'react';
import {
  Palette,
  Upload,
  Image as ImageIcon,
  Check,
  RefreshCcw,
  Sparkles,
  X,
  Eye,
  Sliders,
  Award,
  Layers,
  CheckCircle2,
  Trash2,
  FileCode,
  Globe,
  Building2,
  Trophy,
} from 'lucide-react';
import { BrandingConfig, ColorThemeKey, HeaderStyleKey } from '../types';
import { DEFAULT_BRANDING } from '../data/sportsData';

interface BrandCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  branding: BrandingConfig;
  onSaveBranding: (updated: BrandingConfig) => void;
}

export const THEME_PALETTES: {
  key: ColorThemeKey;
  name: string;
  hex: string;
  badgeClass: string;
  description: string;
}[] = [
  {
    key: 'gold',
    name: 'الذهبي الملكي لجامعة المنيا (الأصلي)',
    hex: '#f59e0b',
    badgeClass: 'bg-amber-500 text-slate-950',
    description: 'الهوية الرسمية لجامعة المنيا واليوبيل الذهبي (أصفر ذهبي مع كحلي أوبسيديان)',
  },
  {
    key: 'navy',
    name: 'الأزرق الملكي الأكاديمي',
    hex: '#2563eb',
    badgeClass: 'bg-blue-600 text-white',
    description: 'طابع أكاديمي رفيع للجامعات المصرية والاتحاد الرياضي للجامعات',
  },
  {
    key: 'emerald',
    name: 'الزمردي الرياضي الأولمبي',
    hex: '#059669',
    badgeClass: 'bg-emerald-600 text-white',
    description: 'روح حيوية ترمز للملاعب والمنافسات الرياضية والصعيد الأخضر',
  },
  {
    key: 'crimson',
    name: 'العنابي الرئاسي الفاخر',
    hex: '#e11d48',
    badgeClass: 'bg-rose-600 text-white',
    description: 'طابع احتفالي رسمي مميز يليق بافتتاح البطولات الكبرى',
  },
  {
    key: 'purple',
    name: 'البنفسجي الإبداعي',
    hex: '#7c3aed',
    badgeClass: 'bg-purple-600 text-white',
    description: 'يعبر عن شعار "نبدع" والابتكار الرقمي للشباب الجامعي',
  },
];

export const HEADER_STYLES: {
  key: HeaderStyleKey;
  name: string;
  previewClass: string;
  description: string;
}[] = [
  {
    key: 'gold_obsidian',
    name: 'كحلي أوبسيديان وذهبي (الافتراضي الفاخر)',
    previewClass: 'from-slate-950 via-slate-900 to-amber-950',
    description: 'تدرج كحلي عميق مع لمسات كهرمانية ذهبية فخمة',
  },
  {
    key: 'deep_navy',
    name: 'كحلي ملكي داكن (Deep Royal Navy)',
    previewClass: 'from-slate-950 via-slate-900 to-blue-950',
    description: 'هيبة أكاديمية رفيعة بصبغة زرقاء داكنة',
  },
  {
    key: 'gradient',
    name: 'تدرج ثلاثي حيوي (Dynamic Aurora)',
    previewClass: 'from-slate-950 via-amber-950/80 to-slate-900',
    description: 'تدرج لوني ثلاثي غني ومشرق مع لمعان ذهبي',
  },
  {
    key: 'clean_slate',
    name: 'رمادي مسطح تقني (Modern Tech)',
    previewClass: 'from-slate-900 via-slate-800 to-slate-900',
    description: 'طابع تقني حديث هادئ ومريح للعين',
  },
];

export const BrandCustomizerModal: React.FC<BrandCustomizerModalProps> = ({
  isOpen,
  onClose,
  branding,
  onSaveBranding,
}) => {
  const [activeTab, setActiveTab] = useState<'logos' | 'colors' | 'texts'>('logos');
  const [draftBranding, setDraftBranding] = useState<BrandingConfig>(branding);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const emblemInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle Logo File Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setDraftBranding((prev) => ({
          ...prev,
          universityLogoUrl: reader.result as string,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Emblem File Upload
  const handleEmblemUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setDraftBranding((prev) => ({
          ...prev,
          tournamentLogoUrl: reader.result as string,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    onSaveBranding(draftBranding);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  const handleResetToDefault = () => {
    if (window.confirm('هل أنت متأكد من استعادة هوية وتصميم المنصة الافتراضية؟')) {
      setDraftBranding(DEFAULT_BRANDING);
      onSaveBranding(DEFAULT_BRANDING);
    }
  };

  // Compute theme color for preview
  const activePalette = THEME_PALETTES.find((p) => p.key === draftBranding.primaryColorTheme);
  const currentAccentHex =
    draftBranding.primaryColorTheme === 'custom'
      ? draftBranding.customAccentHex || '#f59e0b'
      : activePalette?.hex || '#f59e0b';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white p-5 flex items-center justify-between border-b-2 border-amber-500">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-lg sm:text-xl text-white">
                  استوديو الهوية البصرية وتخصيص التصميم
                </h2>
                <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full">
                  صلاحية المصمم
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                التحكم الكامل في لوجو جامعة المنيا، شعارات البطولة، درجات الألوان، ونمط الهيدر
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

        {/* Live Preview Strip */}
        <div className="bg-slate-900 text-white p-4 border-b border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>معاينة حية فورية لمظهر الهيدر واللوجو والألوان:</span>
            </span>
            <span className="text-[10px] text-amber-400/90 font-mono">تحديث مباشر</span>
          </div>

          <div
            className={`p-4 rounded-2xl border transition shadow-inner flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r ${
              draftBranding.headerStyle === 'deep_navy'
                ? 'from-slate-950 via-slate-900 to-blue-950 border-blue-500/40'
                : draftBranding.headerStyle === 'clean_slate'
                ? 'from-slate-900 via-slate-800 to-slate-900 border-slate-700'
                : draftBranding.headerStyle === 'gradient'
                ? 'from-slate-950 via-amber-950/80 to-slate-900 border-amber-500/40'
                : 'from-slate-950 via-slate-900 to-amber-950 border-amber-500/40'
            }`}
          >
            {/* Logo + Titles Preview */}
            <div className="flex items-center gap-3">
              {draftBranding.universityLogoUrl ? (
                <img
                  src={draftBranding.universityLogoUrl}
                  alt="University Logo"
                  className="w-12 h-12 object-contain rounded-xl bg-white/10 p-1 border border-white/20 shadow-md"
                />
              ) : (
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xs text-white shadow-md border"
                  style={{ backgroundColor: `${currentAccentHex}33`, borderColor: currentAccentHex }}
                >
                  <Award className="w-7 h-7" style={{ color: currentAccentHex }} />
                </div>
              )}

              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className="text-[10px] font-extrabold px-2 py-0.5 rounded-full border"
                    style={{
                      backgroundColor: `${currentAccentHex}25`,
                      color: currentAccentHex,
                      borderColor: `${currentAccentHex}50`,
                    }}
                  >
                    {draftBranding.jubileeText}
                  </span>
                  {draftBranding.showSecondaryEmblem && (
                    <span className="text-[10px] bg-blue-500/20 text-blue-200 px-2 py-0.5 rounded-full border border-blue-400/30">
                      شعار البطولة
                    </span>
                  )}
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-white mt-1">
                  {draftBranding.editionTitle}
                </h3>
                <p className="text-xs" style={{ color: currentAccentHex }}>
                  {draftBranding.universityName} — "{draftBranding.sloganText}"
                </p>
              </div>
            </div>

            {/* Secondary Emblem & Action Button Preview */}
            <div className="flex items-center gap-2">
              {draftBranding.tournamentLogoUrl && (
                <img
                  src={draftBranding.tournamentLogoUrl}
                  alt="Tournament Emblem"
                  className="w-10 h-10 object-contain rounded-xl bg-white/10 p-1 border border-white/20"
                  title="الشعار الإضافي"
                />
              )}
              <button
                type="button"
                className="px-3.5 py-2 rounded-xl font-black text-xs shadow-md transition text-slate-950"
                style={{ backgroundColor: currentAccentHex }}
              >
                زر تجريبي
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('logos')}
            className={`flex-1 py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'logos'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>لوجو الجامعة والشعارات</span>
          </button>

          <button
            onClick={() => setActiveTab('colors')}
            className={`flex-1 py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'colors'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>الألوان وباليتات المنصة</span>
          </button>

          <button
            onClick={() => setActiveTab('texts')}
            className={`flex-1 py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'texts'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>الشعارات النصية والبيانات</span>
          </button>
        </div>

        {/* Studio Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: LOGOS & EMBLEMS */}
          {activeTab === 'logos' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* University Main Logo */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-5 h-5 text-amber-600" />
                    <div>
                      <h4 className="font-black text-sm text-slate-900">
                        1. لوجو جامعة المنيا الرسمي (University Logo)
                      </h4>
                      <p className="text-xs text-slate-500">
                        يظهر في أعلى الهيدر، البطاقات الرسمية المطبوعة، وكروت الاعتماد
                      </p>
                    </div>
                  </div>
                  {draftBranding.universityLogoUrl && (
                    <button
                      onClick={() => setDraftBranding((prev) => ({ ...prev, universityLogoUrl: '' }))}
                      className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1 p-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف اللوجو</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  {/* Upload Box */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-2xl p-4 text-center cursor-pointer transition bg-white group hover:bg-amber-50/40 flex flex-col items-center justify-center gap-2"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:scale-110 transition">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        اضغط لرفع لوجو الجامعة من جهازك
                      </p>
                      <p className="text-[10px] text-slate-400">PNG, JPG, SVG شفاف أو ملون</p>
                    </div>
                  </div>

                  {/* Direct Image URL input */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      <span>أو أدخل رابط اللوجو مباشرة (Image URL):</span>
                    </label>
                    <input
                      type="url"
                      value={draftBranding.universityLogoUrl}
                      onChange={(e) =>
                        setDraftBranding((prev) => ({ ...prev, universityLogoUrl: e.target.value }))
                      }
                      placeholder="https://example.com/minia-logo.png"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                    />
                    <p className="text-[10px] text-slate-500">
                      في حال عدم رفع صورة، يتم استخدام الأيقونة المتجهة الرسمية تلقائياً.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tournament & Secondary Emblem */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Trophy className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="font-black text-sm text-slate-900">
                        2. شعار الأسبوع الـ 14 / راية البطولة / شعار الوزارة (Tournament Emblem)
                      </h4>
                      <p className="text-xs text-slate-500">
                        شعار إضافي للحدث أو راية البطولة أو الاتحاد الرياضي للجامعات
                      </p>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={draftBranding.showSecondaryEmblem}
                      onChange={(e) =>
                        setDraftBranding((prev) => ({
                          ...prev,
                          showSecondaryEmblem: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 text-amber-500 rounded border-slate-300"
                    />
                    <span>إظهار في الهيدر</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  {/* Upload Box */}
                  <div
                    onClick={() => emblemInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-4 text-center cursor-pointer transition bg-white group hover:bg-blue-50/40 flex flex-col items-center justify-center gap-2"
                  >
                    <input
                      ref={emblemInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleEmblemUpload}
                      className="hidden"
                    />
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center group-hover:scale-110 transition">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        رفع شعار البطولة أو اليوبيل من الجهاز
                      </p>
                      <p className="text-[10px] text-slate-400">PNG, JPG, SVG</p>
                    </div>
                  </div>

                  {/* Direct Image URL input */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      <span>رابط الشعار الإضافي (Emblem URL):</span>
                    </label>
                    <input
                      type="url"
                      value={draftBranding.tournamentLogoUrl}
                      onChange={(e) =>
                        setDraftBranding((prev) => ({ ...prev, tournamentLogoUrl: e.target.value }))
                      }
                      placeholder="https://example.com/tournament-emblem.png"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                    {draftBranding.tournamentLogoUrl && (
                      <button
                        onClick={() =>
                          setDraftBranding((prev) => ({ ...prev, tournamentLogoUrl: '' }))
                        }
                        className="text-[11px] text-red-600 hover:text-red-700 font-bold"
                      >
                        إزالة الشعار الإضافي
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COLORS & PALETTES */}
          {activeTab === 'colors' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Preset Palettes */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-sm text-slate-900 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-amber-600" />
                    <span>باليتات الألوان المعتمدة (نقرة واحدة للتطبيق):</span>
                  </h4>
                  <span className="text-xs text-slate-500">اختر من القوالب الرسمية</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {THEME_PALETTES.map((palette) => {
                    const isSelected =
                      draftBranding.primaryColorTheme === palette.key &&
                      draftBranding.primaryColorTheme !== 'custom';
                    return (
                      <div
                        key={palette.key}
                        onClick={() =>
                          setDraftBranding((prev) => ({
                            ...prev,
                            primaryColorTheme: palette.key,
                          }))
                        }
                        className={`p-3.5 rounded-2xl border transition cursor-pointer flex flex-col justify-between gap-2 shadow-xs ${
                          isSelected
                            ? 'bg-slate-900 text-white border-amber-400 ring-2 ring-amber-400/30'
                            : 'bg-white hover:bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-4 h-4 rounded-full border border-white/40 shadow-xs"
                              style={{ backgroundColor: palette.hex }}
                            />
                            <span className="font-extrabold text-xs">{palette.name}</span>
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                        </div>
                        <p
                          className={`text-[11px] leading-relaxed ${
                            isSelected ? 'text-slate-300' : 'text-slate-500'
                          }`}
                        >
                          {palette.description}
                        </p>
                      </div>
                    );
                  })}

                  {/* Custom Color Option */}
                  <div
                    onClick={() =>
                      setDraftBranding((prev) => ({
                        ...prev,
                        primaryColorTheme: 'custom',
                      }))
                    }
                    className={`p-3.5 rounded-2xl border transition cursor-pointer flex flex-col justify-between gap-2 shadow-xs ${
                      draftBranding.primaryColorTheme === 'custom'
                        ? 'bg-slate-900 text-white border-amber-400 ring-2 ring-amber-400/30'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full border border-white/40 shadow-xs"
                          style={{ backgroundColor: draftBranding.customAccentHex || '#f59e0b' }}
                        />
                        <span className="font-extrabold text-xs">لون مخصص (Custom HEX)</span>
                      </div>
                      {draftBranding.primaryColorTheme === 'custom' && (
                        <CheckCircle2 className="w-4 h-4 text-amber-400" />
                      )}
                    </div>
                    <p
                      className={`text-[11px] leading-relaxed ${
                        draftBranding.primaryColorTheme === 'custom'
                          ? 'text-slate-300'
                          : 'text-slate-500'
                      }`}
                    >
                      تحديد كود لوني دقيق خاص بهوية الجامعة عبر أداة اختيار الألوان
                    </p>
                  </div>
                </div>
              </div>

              {/* Custom Color Picker if custom is selected */}
              {draftBranding.primaryColorTheme === 'custom' && (
                <div className="bg-amber-50/60 border border-amber-300 rounded-2xl p-4 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">
                      اختر اللون الدقيق (Hex Code):
                    </label>
                    <p className="text-[11px] text-slate-500">
                      سيتم تطبيق هذا اللون على الأزرار البارزة، البادجات، والحدود
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <input
                      type="color"
                      value={draftBranding.customAccentHex || '#f59e0b'}
                      onChange={(e) =>
                        setDraftBranding((prev) => ({ ...prev, customAccentHex: e.target.value }))
                      }
                      className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 bg-white p-0.5"
                    />
                    <input
                      type="text"
                      value={draftBranding.customAccentHex || '#f59e0b'}
                      onChange={(e) =>
                        setDraftBranding((prev) => ({ ...prev, customAccentHex: e.target.value }))
                      }
                      className="w-24 bg-white border border-slate-300 rounded-xl px-2 py-1.5 text-xs text-slate-800 font-mono text-center font-bold"
                    />
                  </div>
                </div>
              )}

              {/* Header Style Picker */}
              <div className="space-y-3">
                <h4 className="font-black text-sm text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-slate-700" />
                  <span>نمط خلفية الهيدر والبانر الرئيسي:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {HEADER_STYLES.map((style) => {
                    const isSelected = draftBranding.headerStyle === style.key;
                    return (
                      <div
                        key={style.key}
                        onClick={() =>
                          setDraftBranding((prev) => ({ ...prev, headerStyle: style.key }))
                        }
                        className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-slate-900 text-white border-amber-400 ring-2 ring-amber-400/20'
                            : 'bg-white hover:bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-6 h-6 rounded-lg bg-gradient-to-br ${style.previewClass} border border-white/20`}
                            />
                            <span className="font-bold text-xs">{style.name}</span>
                          </div>
                          <p
                            className={`text-[11px] ${
                              isSelected ? 'text-slate-300' : 'text-slate-500'
                            }`}
                          >
                            {style.description}
                          </p>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SLOGANS & BRANDING TEXTS */}
          {activeTab === 'texts' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <h4 className="font-black text-sm text-slate-900">
                  تعديل الشعارات اللفظية وعناوين البطولة:
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">عنوان البطولة / الأسبوع:</label>
                    <input
                      type="text"
                      value={draftBranding.editionTitle}
                      onChange={(e) =>
                        setDraftBranding((prev) => ({ ...prev, editionTitle: e.target.value }))
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">الجامعة المضيفة:</label>
                    <input
                      type="text"
                      value={draftBranding.universityName}
                      onChange={(e) =>
                        setDraftBranding((prev) => ({ ...prev, universityName: e.target.value }))
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">الشعار اللفظي الرسمي:</label>
                    <input
                      type="text"
                      value={draftBranding.sloganText}
                      onChange={(e) =>
                        setDraftBranding((prev) => ({ ...prev, sloganText: e.target.value }))
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">عبارة اليوبيل الذهبي:</label>
                    <input
                      type="text"
                      value={draftBranding.jubileeText}
                      onChange={(e) =>
                        setDraftBranding((prev) => ({ ...prev, jubileeText: e.target.value }))
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-bold text-slate-700">الجهة الإشرافية والمنظمة:</label>
                  <input
                    type="text"
                    value={draftBranding.departmentName}
                    onChange={(e) =>
                      setDraftBranding((prev) => ({ ...prev, departmentName: e.target.value }))
                    }
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleResetToDefault}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>استعادة الإعدادات الافتراضية</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-200 hover:bg-slate-300 rounded-xl transition"
            >
              إلغاء
            </button>

            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-black text-slate-950 bg-amber-500 hover:bg-amber-600 rounded-xl shadow-md transition active:scale-95"
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-900" />
                  <span>تم حفظ وتطبيق الهوية بنجاح!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>تطبيق وحفظ التعديلات فورياً</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
