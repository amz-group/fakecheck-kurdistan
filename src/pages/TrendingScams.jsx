import React, { useState, useEffect } from 'react';
import { TrendingUp, Flame, ShieldAlert, AlertTriangle, ShieldCheck, Search } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { base44 } from '@/api/base44Client';

const levelMeta = {
  low: { color: 'text-green-400 bg-green-500/10', key: 'risk_level_low', Icon: ShieldCheck },
  suspicious: { color: 'text-orange-400 bg-orange-500/10', key: 'risk_level_suspicious', Icon: AlertTriangle },
  high: { color: 'text-red-400 bg-red-500/10', key: 'risk_level_high', Icon: ShieldAlert },
};

const statusMeta = {
  verified: { color: 'text-red-400 bg-red-500/10', key: 'status_verified' },
  suspicious: { color: 'text-orange-400 bg-orange-500/10', key: 'status_suspicious_t' },
  investigating: { color: 'text-blue-400 bg-blue-500/10', key: 'status_investigating' },
};

export default function TrendingScams() {
  const { t } = useLanguage();
  const [scams, setScams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await base44.entities.TrendingScam.list('-created_date', 50);
        setScams(data);
      } catch (e) {} finally { setLoading(false); }
    })();
  }, []);

  const filtered = scams.filter(s =>
    !search || s.title?.toLowerCase().includes(search.toLowerCase()) || s.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-heading font-bold text-3xl flex items-center gap-2"><TrendingUp className="w-7 h-7 text-orange-400" />{t('trending_title')}</h1>
        <p className="text-muted-foreground mt-1">{t('trending_desc')}</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('search')}
          className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-muted/50 border border-white/5 focus:border-primary/50 outline-none text-sm" />
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground">{t('loading')}</div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center text-muted-foreground">
          <Flame className="w-12 h-12 mx-auto mb-3 opacity-40" />
          {t('no_data')}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((s, i) => {
            const lvl = levelMeta[s.risk_level] || levelMeta.suspicious;
            const st = statusMeta[s.status] || statusMeta.suspicious;
            const LvlIcon = lvl.Icon;
            return (
              <div key={s.id} className="glass-card glass-card-hover p-5 animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-11 h-11 rounded-xl ${lvl.color} flex items-center justify-center shrink-0`}>
                      <LvlIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{s.title}</h3>
                        {s.is_trending && (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 font-medium">
                            <Flame className="w-3 h-3" /> {t('trending_badge')}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{s.description}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-3 ps-14">
                  <span className={`text-xs px-2.5 py-1 rounded-md ${lvl.color} font-medium`}>{t(lvl.key)}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-md ${st.color} font-medium`}>{t(st.key)}</span>
                  <span className="text-xs px-2.5 py-1 rounded-md bg-muted text-muted-foreground capitalize">{s.platform}</span>
                  <span className="text-xs text-muted-foreground">{s.report_count} {t('report_count').toLowerCase()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}