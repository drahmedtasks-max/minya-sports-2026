import React, { useState } from 'react';
import { FileText, ShieldAlert, CheckCircle, Search, Filter } from 'lucide-react';
import { GENERAL_CONDITIONS } from '../data/sportsData';
import { GeneralCondition } from '../types';

interface GeneralConditionsSectionProps {
  searchQuery: string;
}

export const GeneralConditionsSection: React.FC<GeneralConditionsSectionProps> = ({ searchQuery }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'eligibility' | 'organization' | 'medical_safety' | 'regulations'>('all');

  const filteredConditions = GENERAL_CONDITIONS.filter((cond) => {
    const matchesSearch =
      searchQuery === '' ||
      cond.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cond.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cond.id.toString() === searchQuery.trim();

    const matchesCategory = activeCategory === 'all' || cond.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <section id="general-conditions" className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-5 sm:p-7 space-y-5">
      {/* Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            الشروط العامة للنشاط الرياضي (16 بنداً إلزامياً)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            البنود التنظيمية والقانونية الرسمية الصادرة عن الإدارة العامة لرعاية الطلاب بجامعة المنيا
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              activeCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            الكل (16)
          </button>
          <button
            onClick={() => setActiveCategory('eligibility')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              activeCategory === 'eligibility'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            أهلية المشاركين
          </button>
          <button
            onClick={() => setActiveCategory('organization')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              activeCategory === 'organization'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            النصاب والتنظيم
          </button>
          <button
            onClick={() => setActiveCategory('medical_safety')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              activeCategory === 'medical_safety'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            الكشف الطبي والإشراف
          </button>
        </div>
      </div>

      {/* Conditions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredConditions.map((cond) => (
          <div
            key={cond.id}
            className={`p-4 rounded-2xl border transition-all ${
              cond.highlight
                ? 'bg-amber-50/60 border-amber-300/80 shadow-xs'
                : 'bg-slate-50/60 border-slate-200/80 hover:bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-xs ${
                  cond.highlight
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-800 text-white'
                }`}
              >
                {cond.id}
              </span>

              <div className="space-y-1 w-full">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900 text-sm">{cond.title}</h3>
                  {cond.highlight && (
                    <span className="text-[10px] bg-amber-200/70 text-amber-900 font-bold px-2 py-0.5 rounded-md">
                      بند جوهري
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{cond.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
