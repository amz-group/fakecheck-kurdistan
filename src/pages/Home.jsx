import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Link2, MessageSquare, Image, Newspaper, ArrowRight, TrendingUp, AlertTriangle, Users, Activity, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { base44 } from '@/api/base44Client';
import StatCard from '@/components/StatCard';

const tools = [
  { to: '/scan/link', icon: Link2, titleKey: 'tool_link', descKey: 'tool_link_desc', color: 'from-blue-500/20 to-blue-500/5', iconColor: 'text-blue-400' },
  { to: '/scan/screenshot', icon: Image, titleKey: 'tool_screenshot', descKey: 'tool_screenshot_desc', color: 'from-purple-500/20 to-purple-500/5', iconColor: 'text-purple-400' },
  { to: '/scan/message', icon: MessageSquare, titleKey: 'tool_message', descKey: 'tool_message_desc', color: 'from-cyan-500/20 to-cyan-500/5', iconColor: 'text-cyan-400' },
  { to: '/scan/news', icon: Newspaper, titleKey: 'tool_news', descKey: 'tool_news_desc', color: 'from-amber-500/20 to-amber-500/5', iconColor: 'text-amber-400' },
];

export default function Home() {
  const { t } = useLanguage();
  const [stats, setStats] = useState({ scans: 0, high: 0, suspicious: 0, reports: 0 });
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [allScans, reports] = await Promise.all([
          base44.entities.Scan.list('-created_date', 500),
          base44.entities.ScamReport.filter({ status: 'approved' }, '-created_date', 6),
        ]);
        setStats({
          scans: allScans.length,
          high: allScans.filter(s => s.risk_level === 'high').length,
          suspicious: allScans.filter(s => s.risk_level === 'suspicious').length,
          reports: reports.length,
        });
        setAlerts(reports);
      } catch (e) {
        // empty state
      }
    })();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden grid-pattern">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16 sm:pt-28 sm:pb-24 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card text-xs text-muted-foreground mb-6 animate-fade-in">
              <Shield className="w-3.5 h-3.5 text-primary" />
              {t('tagline')}
            </div>
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

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Activity} label={t('stats_total_scans')} value={stats.scans} color="primary" />
          <StatCard icon={AlertTriangle} label={t('stats_dangerous')} value={stats.high} color="red" />
          <StatCard icon={Shield} label={t('stats_suspicious')} value={stats.suspicious} color="orange" />
          <StatCard icon={Users} label={t('stats_reports')} value={stats.reports} color="green" />
        </div>
      </section>

      {/* Latest alerts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-bold text-2xl sm:text-3xl flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-orange-400" />
            {t('latest_alerts')}
          </h2>
        </div>
        {alerts.length === 0 ? (
          <div className="glass-card p-10 text-center text-muted-foreground">
            <AlertTriangle className="w-10 h-10 mx-auto mb-3 opacity-40" />
            {t('no_data')}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {alerts.map((alert, i) => (
              <div key={alert.id} className="glass-card glass-card-hover p-5 animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-semibold text-sm leading-snug">{alert.title}</h3>
                  <span className="shrink-0 text-xs px-2 py-1 rounded-md bg-orange-500/10 text-orange-400 capitalize">{alert.platform}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{alert.description}</p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users className="w-3.5 h-3.5" /> {alert.report_count} {t('report_count').toLowerCase()}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}