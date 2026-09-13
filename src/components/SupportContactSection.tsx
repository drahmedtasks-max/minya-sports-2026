import React, { useState } from 'react';
import { Phone, MessageSquare, Building2, UserCheck, Copy, Check, Headphones } from 'lucide-react';
import { OFFICIAL_CONTACTS, OFFICIAL_INFO } from '../data/sportsData';

export const SupportContactSection: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyPhoneNumber = (phone: string, idx: number) => {
    navigator.clipboard.writeText(phone);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  return (
    <section id="support-contacts" className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-amber-400 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Headphones className="w-4 h-4" />
            </div>
            دليل التواصل والاستعلام والدعم الميداني المباشر
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            الإدارة العامة لرعاية الطلاب — إدارة النشاط الرياضي بجامعة المنيا (صفحة 8)
          </p>
        </div>

        <div className="text-xs text-amber-300 font-semibold bg-white/5 border border-white/10 px-3 py-1 rounded-xl w-fit">
          متاح على مدار الساعة أثناء فعاليات الأسبوع
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {OFFICIAL_CONTACTS.map((contact, idx) => (
          <div
            key={idx}
            className="bg-slate-900/90 hover:bg-slate-800/90 p-5 rounded-2xl border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-amber-400" />
                  <h3 className="font-extrabold text-base text-white">{contact.name}</h3>
                </div>
                <div className="text-xs text-amber-400/90 font-bold">{contact.role}</div>
                <div className="text-[11px] text-slate-400">{contact.department} — {contact.organization}</div>
              </div>

              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
              {/* Call Button */}
              <a
                href={`tel:${contact.phone}`}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-3.5 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>اتصال: {contact.phone}</span>
              </a>

              {/* WhatsApp Button */}
              <a
                href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(
                  `السلام عليكم دكتور، استفسار بخصوص لوائح النشاط الرياضي بأسبوع شباب الجامعات الـ 14 - جامعة المنيا:`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-2.5 rounded-xl transition flex items-center gap-1 active:scale-95"
                title="محادثة واتساب سريعة"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>واتساب</span>
              </a>

              {/* Copy Button */}
              <button
                onClick={() => copyPhoneNumber(contact.phone, idx)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs p-2.5 rounded-xl transition border border-slate-700"
                title="نسخ رقم الهاتف"
              >
                {copiedIndex === idx ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
