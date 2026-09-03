import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Twitter, Facebook, Instagram, Send } from 'lucide-react';
import { useLanguage, languages } from '@/lib/LanguageContext';

export default function Footer() {
  const { t, lang, setLang } = useLanguage();

  return (
    <footer className="border-t border-white/5 bg-background/60 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/5">
          <p className="text-xs text-muted-foreground">© 2026 {t('brand_name')}. {t('footer_tagline')}.</p>
          <div className="flex gap-1">
            {Object.entries(languages).map(([code, cfg]) => (
              <button key={code} onClick={() => setLang(code)}
                className={`px-2.5 py-1 rounded-md text-xs transition-colors ${lang === code ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                {cfg.flag} {cfg.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}