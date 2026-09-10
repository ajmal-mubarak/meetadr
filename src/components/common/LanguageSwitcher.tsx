import React from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from '../../i18n';

interface LanguageSwitcherProps {
  variant?: 'compact' | 'full' | 'header';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'header',
  className = '',
}) => {
  const { language, setLanguage, isArabic } = useTranslation();

  const handleToggle = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const nextLanguageLabel = language === 'en' ? 'العربية' : 'English';
  const buttonTitle = language === 'en' ? 'التبديل إلى العربية (Switch to Arabic)' : 'Switch to English (التبديل إلى الإنجليزية)';

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={handleToggle}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs font-bold text-slate-800 hover:text-teal-700 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${className}`}
        aria-label={buttonTitle}
        title={buttonTitle}
      >
        <Globe className="w-3.5 h-3.5 text-teal-600 shrink-0" aria-hidden="true" />
        <span className="font-sans font-bold text-xs">{nextLanguageLabel}</span>
      </button>
    );
  }

  // Header variant (Single toggle button: in EN shows 'العربية', in AR shows 'English')
  return (
    <button
      id="site-language-switcher"
      type="button"
      onClick={handleToggle}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 active:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-800 hover:text-teal-700 transition-all cursor-pointer shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${className}`}
      aria-label={buttonTitle}
      title={buttonTitle}
    >
      <Globe className="w-3.5 h-3.5 text-teal-600 shrink-0" aria-hidden="true" />
      <span className="font-sans font-bold tracking-tight">{nextLanguageLabel}</span>
    </button>
  );
};
