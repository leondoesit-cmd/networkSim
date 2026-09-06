'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { audioFeedback } from '@/lib/audioFeedback';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  className?: string;
  variant?: 'pill' | 'button';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  className = '', 
  variant = 'pill' 
}) => {
  const { lang, setLang } = useLanguage();

  const handleSelect = (newLang: 'he' | 'en') => {
    if (newLang !== lang) {
      audioFeedback.playKeyClick();
      setLang(newLang);
    }
  };

  if (variant === 'button') {
    return (
      <button
        id="btn-lang-toggle"
        onClick={() => handleSelect(lang === 'he' ? 'en' : 'he')}
        className={`min-h-[40px] px-3 py-1.5 rounded-xl bg-[#141824] hover:bg-[#1A2030] text-slate-200 border border-white/10 hover:border-blue-500/50 transition-all flex items-center gap-2 text-xs font-semibold cursor-pointer ${className}`}
        title={lang === 'he' ? 'Switch to English' : 'החלף לעברית'}
      >
        <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
        <span>{lang === 'he' ? '🇺🇸 English' : '🇮🇱 עברית'}</span>
      </button>
    );
  }

  return (
    <div 
      id="language-selector-header"
      className={`inline-flex items-center p-1 rounded-xl bg-[#141824] border border-white/10 shadow-inner ${className}`}
      role="group"
      aria-label="Language selection"
    >
      <button
        id="lang-btn-he"
        type="button"
        onClick={() => handleSelect('he')}
        className={`min-h-[34px] px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer select-none ${
          lang === 'he'
            ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
        }`}
        title="עברית (ברירת מחדל)"
      >
        <span className="text-xs">🇮🇱</span>
        <span className="hidden min-[380px]:inline">עברית</span>
      </button>

      <button
        id="lang-btn-en"
        type="button"
        onClick={() => handleSelect('en')}
        className={`min-h-[34px] px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer select-none ${
          lang === 'en'
            ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
        }`}
        title="English"
      >
        <span className="text-xs">🇺🇸</span>
        <span className="hidden min-[380px]:inline">English</span>
      </button>
    </div>
  );
};
