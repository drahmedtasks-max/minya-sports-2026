import React, { useState } from 'react';
import { Trophy, Users, Clock, Award, ArrowRight, Filter, ChevronLeft } from 'lucide-react';
import { SPORTS_LIST } from '../data/sportsData';
import { SportRule } from '../types';

interface SportsDirectoryProps {
  searchQuery: string;
  onSelectSport: (sport: SportRule) => void;
}

export const SportsDirectory: React.FC<SportsDirectoryProps> = ({
  searchQuery,
  onSelectSport,
}) => {
  const [selectedGender, setSelectedGender] = useState<'all' | 'male_female' | 'male_only'>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'team' | 'individual' | 'racket'>('all');

  const filteredSports = SPORTS_LIST.filter((sport) => {
    const matchesQuery =
      searchQuery === '' ||
      sport.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sport.pointsSystem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sport.matchDuration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sport.specialRules.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesGender = selectedGender === 'all' || sport.gender === selectedGender;
    const matchesCategory = selectedCategory === 'all' || sport.category === selectedCategory;

    return matchesQuery && matchesGender && matchesCategory;
  });

  return (
    <section id="sports-directory" className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-5 sm:p-7 space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-600" />
            </div>
            مصفوفة التشريح الفني للألعاب الرياضية المعتمدة
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            دليل القواعد الفنية، مدد المباريات، احتساب النقاط، وأنظمة كسر التعادل
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full font-bold border border-slate-200">
            {SPORTS_LIST.length} ألعاب معتمدة
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80">
        {/* Gender Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500 font-bold ml-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            الفئة:
          </span>
          <button
            onClick={() => setSelectedGender('all')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
              selectedGender === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            الكل
          </button>
          <button
            onClick={() => setSelectedGender('male_female')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
              selectedGender === 'male_female'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            طلبة وطالبات
          </button>
          <button
            onClick={() => setSelectedGender('male_only')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
              selectedGender === 'male_only'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            طلبة فقط
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
              selectedCategory === 'all'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            كل الأنواع
          </button>
          <button
            onClick={() => setSelectedCategory('team')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
              selectedCategory === 'team'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            ألعاب جماعية
          </button>
          <button
            onClick={() => setSelectedCategory('racket')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
              selectedCategory === 'racket'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            مضارب (طاولة/بادل)
          </button>
          <button
            onClick={() => setSelectedCategory('individual')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
              selectedCategory === 'individual'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            ألعاب قوى
          </button>
        </div>
      </div>

      {/* Grid of Sports */}
      {filteredSports.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
          <Trophy className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">لا توجد ألعاب تطابق معايير البحث الحالية</p>
          <p className="text-xs text-slate-500 mt-1">جرّب تغيير كلمات البحث أو إعادة ضبط الفلاتر</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSports.map((sport) => (
            <div
              key={sport.id}
              onClick={() => onSelectSport(sport)}
              className="group bg-slate-50/70 hover:bg-white rounded-2xl p-5 border border-slate-200 hover:border-amber-400/90 shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2 group-hover:text-amber-600 transition-colors">
                    <span className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
                      <Trophy className="w-4 h-4" />
                    </span>
                    {sport.name}
                  </h3>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${
                      sport.gender === 'male_female'
                        ? 'bg-purple-50 text-purple-800 border-purple-200'
                        : 'bg-blue-50 text-blue-800 border-blue-200'
                    }`}
                  >
                    {sport.genderLabel}
                  </span>
                </div>

                {/* Body Specs */}
                <ul className="text-xs space-y-2 text-slate-700 leading-relaxed divide-y divide-slate-100">
                  <li className="pt-1.5 flex items-start gap-1.5">
                    <span className="font-bold text-slate-900 shrink-0">• قوام الفريق:</span>
                    <span className="text-slate-600 font-medium">{sport.squadSize.details}</span>
                  </li>

                  <li className="pt-1.5 flex items-start gap-1.5">
                    <span className="font-bold text-slate-900 shrink-0">• التوقيت:</span>
                    <span className="text-slate-600 font-medium">{sport.matchDuration}</span>
                  </li>

                  <li className="pt-1.5 flex items-start gap-1.5">
                    <span className="font-bold text-slate-900 shrink-0">• النقاط:</span>
                    <span className="text-slate-600 font-medium">{sport.pointsSystem}</span>
                  </li>

                  <li className="pt-1.5">
                    <span className="font-bold text-slate-900">• كسر التعادل: </span>
                    <span className="text-slate-600 font-medium">
                      {sport.tieBreakerSteps[0]} &larr; {sport.tieBreakerSteps[1] || 'القرعة'}
                    </span>
                  </li>

                  {sport.subEvents && (
                    <li className="pt-1.5">
                      <span className="font-bold text-emerald-800">• المسابقات المعتمدة: </span>
                      <span className="text-emerald-700 font-semibold">
                        7 سباقات ومسابقات مضمار وميدان + تتابع مختلط
                      </span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Card Footer Action */}
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-amber-700 group-hover:text-amber-800">
                <span className="flex items-center gap-1">
                  عرض كامل اللائحة الفنية والتنظيمية
                </span>
                <ChevronLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
