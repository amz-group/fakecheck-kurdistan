import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldAlert, AlertTriangle, ShieldCheck, Flag, Bookmark, Clock, Lightbulb, Link2, MessageSquare, Image, Newspaper } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { base44 } from '@/api/base44Client';
import StatCard from '@/components/StatCard';

const scanTypeIcon = { link: Link2, message: MessageSquare, screenshot: Image, news: Newspaper };
const levelColor = { low: 'text-green-400', suspicious: 'text-orange-400', high: 'text-red-400' };

const tips = [
  'Never share OTP codes with anyone — banks never ask for them.',
  'Check the URL carefully before entering login details.',
  'Enable two-factor authentication on all important accounts.',
  'Be suspicious of urgent messages asking for money or personal info.',
  'Verify job offers through official company channels.',
];

export default function Dashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [scans, setScans] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [s, r] = await Promise.all([
          base44.entities.Scan.list('-created_date', 20),
          base44.entities.ScamReport.list('-created_date', 20),
        ]);
        setScans(s);
        setReports(r);
      } catch (e) {} finally { setLoading(false); }
    })();
  }, []);

  const stats = {
    total: scans.length,
    high: scans.filter(s => s.risk_level === 'high').length,
    suspicious: scans.filter(s => s.risk_level === 'suspicious').length,
    low: scans.filter(s => s.risk_level === 'low').length,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-heading font-bold text-3xl mb-6">{t('dashboard_title')}{user?.full_name ? `, ${user.full_name}` : ''}</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Activity} label={t('stats_total_scans')} value={stats.total} color="primary" />
        <StatCard icon={ShieldAlert} label={t('stats_dangerous')} value={stats.high} color="red" />
        <StatCard icon={AlertTriangle} label={t('stats_suspicious')} value={stats.suspicious} color="orange" />
        <StatCard icon={ShieldCheck} label={t('risk_level_low')} value={stats.low} color="green" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent scans */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold flex items-center gap-2"><Clock className="w-5 h-5 text-primary" />{t('recent_scans')}</h2>
            <Link to="/scan/link" className="text-sm text-primary hover:underline">{t('nav_scan')}</Link>
          </div>
          {loading ? (
            <p className="text-muted-foreground text-sm py-8 text-center">{t('loading')}</p>
          ) : scans.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Activity className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm mb-3">{t('no_data')}</p>
              <Link to="/scan/link" className="text-primary text-sm hover:underline">{t('hero_cta')}</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {scans.map(s => {
                const Icon = scanTypeIcon[s.scan_type] || Activity;
                return (
                  <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{s.input_summary || s.input_content?.slice(0, 60)}</p>
                      <p className="text-xs text-muted-foreground capitalize">{s.scan_type}</p>
                    </div>
                    <div className="text-end shrink-0">
                      <div className={`text-sm font-bold ${levelColor[s.risk_level]}`}>{s.risk_score}/100</div>
                      <div className="text-xs text-muted-foreground">{new Date(s.created_date).toLocaleDateString()}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Side column */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="font-heading font-semibold flex items-center gap-2 mb-4"><Flag className="w-5 h-5 text-primary" />{t('submitted_reports')}</h2>
            {reports.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('no_data')}</p>
            ) : (
              <div className="space-y-2">
                {reports.slice(0, 5).map(r => (
                  <div key={r.id} className="flex items-center justify-between gap-2 text-sm">
                    <span className="truncate">{r.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded capitalize ${r.status === 'approved' ? 'bg-green-500/10 text-green-400' : r.status === 'rejected' ? 'bg-red-500/10 text-red-400' : 'bg-orange-500/10 text-orange-400'}`}>{r.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-card p-6">
            <h2 className="font-heading font-semibold flex items-center gap-2 mb-4"><Lightbulb className="w-5 h-5 text-amber-400" />{t('security_tips')}</h2>
            <ul className="space-y-2.5">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />{tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}