import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  Stethoscope,
  Activity,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  X,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useTranslation } from '../../i18n';
import { HEALTH_CONDITIONS, ALPHABET_LETTERS, HealthCondition } from '../../data/mockConditions';

export const ConditionsPage: React.FC = () => {
  const { t, isRTL, isArabic } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialLetter = searchParams.get('letter') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [selectedLetter, setSelectedLetter] = useState<string>(initialLetter);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [expandedConditionId, setExpandedConditionId] = useState<string | null>(null);

  // Sync state if URL query params change
  useEffect(() => {
    const letter = searchParams.get('letter');
    const query = searchParams.get('search');
    if (letter) {
      setSelectedLetter(letter.toUpperCase());
    } else if (!query) {
      setSelectedLetter('All');
    }
    if (query !== null) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  const handleSelectLetter = (letter: string) => {
    setSelectedLetter(letter);
    const newParams = new URLSearchParams(searchParams);
    if (letter === 'All') {
      newParams.delete('letter');
    } else {
      newParams.set('letter', letter);
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      newParams.set('search', searchQuery.trim());
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSelectedLetter('All');
    setSearchQuery('');
    setSearchParams({});
  };

  // Filter conditions
  const filteredConditions = useMemo(() => {
    return HEALTH_CONDITIONS.filter((item) => {
      const matchesLetter =
        selectedLetter === 'All' || item.letter.toUpperCase() === selectedLetter.toUpperCase();

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.specialist.toLowerCase().includes(query) ||
        (item.symptoms && item.symptoms.some((s) => s.toLowerCase().includes(query))) ||
        (item.causes && item.causes.some((c) => c.toLowerCase().includes(query)));

      return matchesLetter && matchesSearch;
    });
  }, [selectedLetter, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedConditionId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-[#081217] text-slate-100 selection:bg-slate-800 selection:text-white">
      {/* ========================================================================= */}
      {/* 1. HERO BANNER                                                            */}
      {/* ========================================================================= */}
      <section className="relative bg-gradient-to-r from-[#081217] via-[#0C1A22] to-[#081217] text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-slate-800">
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0C1A22] border border-slate-800 text-slate-200 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {isArabic
                ? 'رؤى سريرية شاملة حول الأسباب وعوامل الخطر والوقاية والعلاج'
                : 'Detailed Insights into Causes, Risk Factors, Prevention, and Management'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4">
            {isArabic ? 'دليل الأمراض والحالات الصحية' : 'Find Diseases & Health Conditions'}
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
            {isArabic
              ? 'ابحث بالاسم أو الأعراض أو الحرف الأول لاستكشاف الأدلة السريرية المعتمدة والتواصل مع نخبة الأطباء المتخصصين في الإمارات.'
              : 'Search our verified clinical database by symptom, medical condition, or alphabet to understand your health and connect with UAE’s top board-certified doctors.'}
          </p>

          {/* Centered Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto flex items-center bg-[#0C1A22] rounded-2xl p-1.5 border border-slate-800"
          >
            <div className="pl-4 pr-2 text-slate-400">
              <Search className="w-5 h-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isArabic
                  ? 'ابحث باسم المرض، العَرَض، أو التخصص...'
                  : 'Search diseases and conditions (e.g. Migraine, Asthma, Diabetes)...'
              }
              className="flex-1 py-2.5 px-2 text-white text-sm placeholder:text-slate-500 focus:outline-hidden bg-transparent"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  const newParams = new URLSearchParams(searchParams);
                  newParams.delete('search');
                  setSearchParams(newParams);
                }}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg mr-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#007B8A] hover:bg-[#00606B] text-white font-bold text-xs sm:text-sm rounded-xl border border-[#005F6B] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>{isArabic ? 'بحث' : 'Search'}</span>
            </button>
          </form>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. ALPHABET SELECTOR ROW                                                  */}
      {/* ========================================================================= */}
      <section className="bg-[#0A161D] border-b border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>{isArabic ? 'تصفح الأمراض والحالات حسب' : 'Diseases And Conditions By'}</span>
                <span className="italic text-slate-200 font-extrabold underline decoration-slate-600 decoration-wavy">
                  {isArabic ? 'الحرف الأول' : 'First Letter'}
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {isArabic
                  ? 'انقر على أي حرف لعرض جميع الحالات الطبية المصنفة تحته'
                  : 'Select any alphabet letter to instantly view matching conditions and specialists.'}
              </p>
            </div>

            {(selectedLetter !== 'All' || searchQuery) && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="self-start md:self-auto text-xs font-bold text-slate-300 bg-[#081217] border border-slate-800 hover:bg-slate-800 hover:text-white px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                <span>{isArabic ? 'إعادة ضبط التصفية' : 'Clear All Filters'}</span>
              </button>
            )}
          </div>

          {/* Alphabet Circular Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={() => handleSelectLetter('All')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedLetter === 'All'
                  ? 'bg-[#007B8A] text-white border border-[#005F6B] font-black'
                  : 'bg-[#0C1A22] border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
              }`}
            >
              {isArabic ? 'الكل' : 'All'}
            </button>

            {ALPHABET_LETTERS.map((letter) => {
              const isSelected = selectedLetter === letter;
              return (
                <button
                  key={letter}
                  type="button"
                  onClick={() => handleSelectLetter(letter)}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-black text-xs sm:text-sm transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#007B8A] text-white border border-[#005F6B] scale-105'
                      : 'bg-[#0C1A22] border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                  }`}
                  aria-label={`Letter ${letter}`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. RESULTS SECTION                                                        */}
      {/* ========================================================================= */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Results Counter Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
              {isArabic ? 'الحالات الصحية والأمراض' : 'Diseases And Conditions'}
            </h3>
            <span className="text-sm font-extrabold text-slate-200 bg-[#081217] px-3 py-0.5 rounded-full border border-slate-800">
              ({filteredConditions.length})
            </span>
          </div>

          {selectedLetter !== 'All' && (
            <span className="text-xs font-semibold text-slate-400">
              {isArabic ? `الحرف المختار: ${selectedLetter}` : `Showing letter: "${selectedLetter}"`}
            </span>
          )}
        </div>

        {/* Empty State */}
        {filteredConditions.length === 0 ? (
          <div className="bg-[#0C1A22] rounded-3xl border border-slate-800 p-12 text-center max-w-md mx-auto my-8">
            <div className="w-14 h-14 rounded-2xl bg-[#081217] text-slate-400 flex items-center justify-center mx-auto mb-4 border border-slate-800">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-white mb-1">
              {isArabic ? 'لم نتمكن من العثور على نتائج' : 'No matching health conditions found'}
            </h4>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              {isArabic
                ? 'جرّب البحث بكلمة أخرى أو تصفح الحروف الأبجدية الأخرى.'
                : 'Try searching for a different keyword or explore other alphabet letters.'}
            </p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-5 py-2.5 bg-[#007B8A] hover:bg-[#00606B] text-white rounded-xl text-xs font-bold transition-all border border-[#005F6B] cursor-pointer"
            >
              {isArabic ? 'عرض جميع الحالات' : 'View All Conditions'}
            </button>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredConditions.map((cond) => {
              const isExpanded = expandedConditionId === cond.id;

              return (
                <div
                  key={cond.id}
                  className="bg-[#0C1A22] rounded-2xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-5">
                    {/* Header: Letter Avatar & Specialist Tag */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-full bg-[#081217] text-slate-200 font-black text-sm flex items-center justify-center border border-slate-800">
                        {cond.letter}
                      </div>

                      <Link
                        to={`/doctors?specialty=${encodeURIComponent(cond.specialtyQuery)}`}
                        className="text-[11px] font-semibold text-slate-200 bg-[#081217] hover:bg-slate-800 hover:text-white px-2.5 py-1 rounded-full border border-slate-800 transition-colors flex items-center gap-1"
                        title={`Find ${cond.specialist}`}
                      >
                        <Stethoscope className="w-3 h-3 text-slate-400" />
                        <span>{cond.specialist}</span>
                      </Link>
                    </div>

                    {/* Condition Title */}
                    <h4 className="text-base font-black text-white tracking-tight">
                      {cond.name}
                    </h4>

                    {/* Overview description */}
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {cond.description}
                    </p>

                    {/* Symptoms preview badges */}
                    {cond.symptoms && cond.symptoms.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-800">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                          {isArabic ? 'أبرز الأعراض' : 'Common Symptoms'}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {cond.symptoms.slice(0, 3).map((sym) => (
                            <span
                              key={sym}
                              className="text-[11px] px-2 py-0.5 rounded-md bg-[#081217] text-slate-300 border border-slate-800 font-medium"
                            >
                              {sym}
                            </span>
                          ))}
                          {cond.symptoms.length > 3 && (
                            <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-[#081217] text-slate-500 font-bold border border-slate-800">
                              +{cond.symptoms.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Expanded Clinical Insights */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 text-xs animate-in fade-in-50 duration-200">
                        {cond.causes && cond.causes.length > 0 && (
                          <div className="bg-[#081217] rounded-xl p-3 border border-slate-800">
                            <h5 className="font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                              <Activity className="w-3.5 h-3.5 text-slate-400" />
                              <span>{isArabic ? 'الأسباب الشائعة' : 'Potential Causes'}</span>
                            </h5>
                            <ul className="list-disc list-inside text-slate-400 space-y-0.5 text-[11px] leading-relaxed">
                              {cond.causes.map((c, i) => (
                                <li key={i}>{c}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {cond.riskFactors && cond.riskFactors.length > 0 && (
                          <div className="bg-amber-950/20 rounded-xl p-3 border border-amber-500/20">
                            <h5 className="font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                              <span>{isArabic ? 'عوامل الخطر' : 'Risk Factors'}</span>
                            </h5>
                            <ul className="list-disc list-inside text-amber-200/80 space-y-0.5 text-[11px] leading-relaxed">
                              {cond.riskFactors.map((r, i) => (
                                <li key={i}>{r}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {cond.prevention && cond.prevention.length > 0 && (
                          <div className="bg-[#081217] rounded-xl p-3 border border-slate-800">
                            <h5 className="font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                              <span>{isArabic ? 'طرق الوقاية' : 'Prevention'}</span>
                            </h5>
                            <ul className="list-disc list-inside text-slate-400 space-y-0.5 text-[11px] leading-relaxed">
                              {cond.prevention.map((p, i) => (
                                <li key={i}>{p}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {cond.management && cond.management.length > 0 && (
                          <div className="bg-emerald-950/20 rounded-xl p-3 border border-emerald-500/20">
                            <h5 className="font-bold text-emerald-300 mb-1 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{isArabic ? 'العلاج والإدارة' : 'Clinical Management'}</span>
                            </h5>
                            <ul className="list-disc list-inside text-emerald-200/80 space-y-0.5 text-[11px] leading-relaxed">
                              {cond.management.map((m, i) => (
                                <li key={i}>{m}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="px-5 py-3.5 bg-[#081217]/50 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => toggleExpand(cond.id)}
                      className="text-xs font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                      <span>
                        {isExpanded
                          ? isArabic
                            ? 'إخفاء التفاصيل'
                            : 'Less Details'
                          : isArabic
                          ? 'تفاصيل سريرية'
                          : 'Clinical Details'}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-3 h-3 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-3 h-3 text-slate-500" />
                      )}
                    </button>

                    <Link
                      to={`/doctors?specialty=${encodeURIComponent(cond.specialtyQuery)}`}
                      className="text-xs font-bold text-slate-200 hover:text-white transition-colors flex items-center gap-1 group/btn"
                    >
                      <span>{isArabic ? 'حجز طبيب' : 'Find Doctors'}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 rtl:rotate-180 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 4. CLINICAL CALLOUT BANNER                                                */}
      {/* ========================================================================= */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-[#0C1A22] border border-slate-800 rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {isArabic ? 'استشارة طبية موثوقة' : 'Certified Specialist Network'}
            </span>
            <h3 className="text-2xl font-black mt-1 text-white">
              {isArabic
                ? 'هل تعاني من أعراض غير مؤكدة؟'
                : 'Unsure about your symptoms or which specialist to see?'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              {isArabic
                ? 'تواصل مع طبيب ممارس عام أو احجز استشارة حضورية في أحد المستشفيات المعتمدة لدينا في دبي وأبوظبي.'
                : 'Consult with UAE licensed General Practitioners or book a direct guaranteed in-person consultation across accredited facilities.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/doctors?specialty=General%20Practice"
              className="px-5 py-3 bg-[#007B8A] hover:bg-[#00606B] text-white font-bold rounded-xl text-xs sm:text-sm border border-[#005F6B] transition-all"
            >
              {isArabic ? 'استشر طبيب عام' : 'Consult General Practitioner'}
            </Link>
            <Link
              to="/specialties"
              className="px-5 py-3 bg-[#081217] hover:bg-slate-800 text-white font-bold rounded-xl text-xs sm:text-sm border border-slate-800 transition-all"
            >
              {isArabic ? 'تصفح التخصصات' : 'Explore All Specialties'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
