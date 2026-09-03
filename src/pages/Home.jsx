import React from 'react';
import { Link } from 'react-router-dom';
import { Link2, MessageSquare, Image, Newspaper, ArrowRight, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

const LOGO_URL = 'https://media.base44.com/images/public/6a99c9233320bb9c009f36c5/35967b886_IMG_7384.PNG';

const tools = [
  { to: '/scan/link', icon: Link2, titleKey: 'tool_link', descKey: 'tool_link_desc', color: 'from-blue-500/20 to-blue-500/5', iconColor: 'text-blue-400' },
  { to: '/scan/screenshot', icon: Image, titleKey: 'tool_screenshot', descKey: 'tool_screenshot_desc', color: 'from-purple-500/20 to-purple-500/5', iconColor: 'text-purple-400' },
  { to: '/scan/message', icon: MessageSquare, titleKey: 'tool_message', descKey: 'tool_message_desc', color: 'from-cyan-500/20 to-cyan-500/5', iconColor: 'text-cyan-400' },
  { to: '/scan/news', icon: Newspaper, titleKey: 'tool_news', descKey: 'tool_news_desc', color: 'from-amber-500/20 to-amber-500/5', iconColor: 'text-amber-400' },
];

export default function Home() {
  const { t } = useLanguage();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden grid-pattern">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16 sm:pt-28 sm:pb-24 relative">
          <div className="max-w-3xl mx-auto text-center">
            <img
              src={LOGO_URL}
              alt="LinkScan"
              className="h-20 sm:h-24 w-auto rounded-xl mx-auto mb-6 animate-fade-in"
            />
            <h1 className="font-heading font-bold text-4xl sm:text-6xl lg:text-7xl tracking-tight mb-4 animate-slide-up">
              {t('hero_title')}
            </h1>
            <p className="text-xl sm:text-2xl gradient-text font-semibold mb-4 animate-slide-up">
              {t('hero_subtitle')}
            </p>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed animate-slide-up">
              {t('hero_desc')}
            </p>
            <Link to="/scan/link" className="inline-flex animate-scale-in">
              <button className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-base transition-all glow-primary hover:scale-105">
                <ShieldCheck className="w-5 h-5" />
                {t('hero_cta')}
                <ArrowRight className="w-5 h-5 rtl:rotate-180" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-center mb-2">{t('tools_title')}</h2>
        <p className="text-muted-foreground text-center mb-10">{t('hero_desc')}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tools.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <Link key={tool.to} to={tool.to} className="group">
                <div className="glass-card glass-card-hover p-6 h-full flex flex-col animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-7 h-7 ${tool.iconColor}`} />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">{t(tool.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground flex-1 leading-relaxed">{t(tool.descKey)}</p>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2.5 transition-all">
                    {t('open_scanner')} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

    </div>
  );
}