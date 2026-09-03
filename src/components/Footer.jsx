import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Twitter, Facebook, Instagram, Send } from 'lucide-react';
import { useLanguage, languages } from '@/lib/LanguageContext';

export default function Footer() {
  const { t, lang, setLang } = useLanguage();

  return (
    <footer className="border-t border-white/5 bg-background/60 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-heading font-bold">{t('brand_name')}</div>
                <div className="text-xs text-muted-foreground">{t('footer_tagline')}</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">{t('hero_desc')}</p>
            <div className="flex gap-3 mt-4">
              {[Twitter, Facebook, Instagram, Send].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">{t('nav_scan')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/scan/link" className="hover:text-primary">{t('tool_link')}</Link></li>
              <li><Link to="/scan/message" className="hover:text-primary">{t('tool_message')}</Link></li>
              <li><Link to="/scan/screenshot" className="hover:text-primary">{t('tool_screenshot')}</Link></li>
              <li><Link to="/scan/news" className="hover:text-primary">{t('tool_news')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">{t('brand_name')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/learn" className="hover:text-primary">{t('footer_tips')}</Link></li>
              <li><a href="#" className="hover:text-primary">{t('privacy_policy')}</a></li>
              <li><a href="#" className="hover:text-primary">{t('terms')}</a></li>
              <li><a href="#" className="hover:text-primary">{t('contact')}</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-6 border-t border-white/5">
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