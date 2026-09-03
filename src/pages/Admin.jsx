import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Flag, TrendingUp, Globe, ShieldCheck, X, Check, Trash2, Plus, Search, Activity, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import StatCard from '@/components/StatCard';

const tabs = [
  { key: 'dashboard', icon: LayoutDashboard, labelKey: 'dashboard_title' },
  { key: 'reports', icon: Flag, labelKey: 'community_title' },
  { key: 'trending', icon: TrendingUp, labelKey: 'trending_title' },
  { key: 'domains', icon: Globe, label: 'Suspicious Domains' },
  { key: 'users', icon: Users, labelKey: 'nav_profile' },
];

export default function Admin() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [reports, setReports] = useState([]);
  const [trending, setTrending] = useState([]);
  const [domains, setDomains] = useState([]);
  const [users, setUsers] = useState([]);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [newDomain, setNewDomain] = useState({ domain: '', reason: '', risk_level: 'suspicious' });

  const loadAll = async () => {
    setLoading(true);
    try {
      const [r, tr, d, sc] = await Promise.all([
        base44.entities.ScamReport.list('-created_date', 100),
        base44.entities.TrendingScam.list('-created_date', 100),
        base44.entities.SuspiciousDomain.list('-created_date', 100),
        base44.entities.Scan.list('-created_date', 100),
      ]);
      setReports(r); setTrending(tr); setDomains(d); setScans(sc);
      try { setUsers(await base44.entities.User.list()); } catch (e) {}
    } catch (e) {} finally { setLoading(false); }
  };

  useEffect(() => { loadAll(); }, []);

  const updateReport = async (id, data, msg) => {
    try {
      await base44.entities.ScamReport.update(id, data);
      toast({ title: msg });
      loadAll();
    } catch (e) { toast({ title: 'Error', description: e.message, variant: 'destructive' }); }
  };

  const updateTrending = async (id, data, msg) => {
    try {
      await base44.entities.TrendingScam.update(id, data);
      toast({ title: msg });
      loadAll();
    } catch (e) { toast({ title: 'Error', description: e.message, variant: 'destructive' }); }
  };

  const addDomain = async (e) => {
    e.preventDefault();
    if (!newDomain.domain) return;
    try {
      await base44.entities.SuspiciousDomain.create(newDomain);
      setNewDomain({ domain: '', reason: '', risk_level: 'suspicious' });
      toast({ title: '✓ Domain added' });
      loadAll();
    } catch (err) { toast({ title: 'Error', description: err.message, variant: 'destructive' }); }
  };

  const deleteDomain = async (id) => {
    await base44.entities.SuspiciousDomain.delete(id);
    loadAll();
  };

  const stats = {
    scans: scans.length,
    reports: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    trending: trending.length,
  };

  const inputClass = "w-full px-3 py-2 rounded-lg bg-muted/50 border border-white/5 focus:border-primary/50 outline-none text-sm";

  if (user && user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="font-heading font-bold text-2xl mb-2">Access Denied</h1>
        <p className="text-muted-foreground">You need admin privileges to access this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 mb-6">
        <ShieldCheck className="w-7 h-7 text-primary" />
        <h1 className="font-heading font-bold text-3xl">{t('nav_admin')}</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto mb-6 pb-1 scrollbar-thin">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.key ? 'bg-primary text-white' : 'glass-card text-muted-foreground hover:text-foreground'
              }`}>
              <Icon className="w-4 h-4" /> {tab.label || t(tab.labelKey)}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground">{t('loading')}</div>
      ) : (
        <>
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Activity} label={t('stats_total_scans')} value={stats.scans} color="primary" />
                <StatCard icon={Flag} label={t('stats_reports')} value={stats.reports} color="orange" />
                <StatCard icon={AlertTriangle} label="Pending Reports" value={stats.pending} color="red" />
                <StatCard icon={TrendingUp} label={t('trending_title')} value={stats.trending} color="green" />
              </div>
              <div className="glass-card p-6">
                <h2 className="font-heading font-semibold mb-4">Recent Scans</h2>
                <div className="space-y-2">
                  {scans.slice(0, 10).map(s => (
                    <div key={s.id} className="flex items-center justify-between gap-2 text-sm py-2 border-b border-white/5">
                      <span className="capitalize text-muted-foreground">{s.scan_type}</span>
                      <span className="truncate flex-1 px-2">{s.input_summary || s.input_content?.slice(0, 50)}</span>
                      <span className={`font-bold ${s.risk_level === 'high' ? 'text-red-400' : s.risk_level === 'suspicious' ? 'text-orange-400' : 'text-green-400'}`}>{s.risk_score}/100</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div>
              <div className="relative mb-4">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('search')} className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-muted/50 border border-white/5 outline-none text-sm" />
              </div>
              <div className="space-y-3">
                {reports.filter(r => !search || r.title?.toLowerCase().includes(search.toLowerCase())).map(r => (
                  <div key={r.id} className="glass-card p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-semibold text-sm">{r.title}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded capitalize ${r.status === 'approved' ? 'bg-green-500/10 text-green-400' : r.status === 'rejected' ? 'bg-red-500/10 text-red-400' : 'bg-orange-500/10 text-orange-400'}`}>{r.status}</span>
                          <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground capitalize">{r.platform}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{r.description}</p>
                        {r.url && <p className="text-xs text-muted-foreground mt-1 truncate" dir="ltr">{r.url}</p>}
                      </div>
                      <div className="flex gap-1 shrink-0">
                        {r.status !== 'approved' && <button onClick={() => updateReport(r.id, { status: 'approved' }, '✓ Approved')} className="w-8 h-8 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 flex items-center justify-center"><Check className="w-4 h-4" /></button>}
                        {r.status !== 'rejected' && <button onClick={() => updateReport(r.id, { status: 'rejected' }, '✓ Rejected')} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center"><X className="w-4 h-4" /></button>}
                        <button onClick={() => updateReport(r.id, { is_trending: !r.is_trending }, r.is_trending ? '✓ Removed trending' : '✓ Marked trending')} className={`w-8 h-8 rounded-lg flex items-center justify-center ${r.is_trending ? 'bg-orange-500/20 text-orange-400' : 'bg-muted text-muted-foreground hover:bg-orange-500/10 hover:text-orange-400'}`}><TrendingUp className="w-4 h-4" /></button>
                        <button onClick={async () => { await base44.entities.ScamReport.delete(r.id); loadAll(); }} className="w-8 h-8 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 flex items-center justify-center"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'trending' && (
            <div className="space-y-3">
              {trending.map(s => (
                <div key={s.id} className="glass-card p-4 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-sm">{s.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded capitalize ${s.status === 'verified' ? 'bg-red-500/10 text-red-400' : s.status === 'investigating' ? 'bg-blue-500/10 text-blue-400' : 'bg-orange-500/10 text-orange-400'}`}>{s.status}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{s.description}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => updateTrending(s.id, { status: 'verified' }, '✓ Verified')} className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-medium">Verify</button>
                    <button onClick={() => updateTrending(s.id, { status: 'investigating' }, '✓ Investigating')} className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-xs font-medium">Investigate</button>
                    <button onClick={async () => { await base44.entities.TrendingScam.delete(s.id); loadAll(); }} className="w-8 h-8 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 flex items-center justify-center"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
              {trending.length === 0 && <p className="text-center py-10 text-muted-foreground">{t('no_data')}</p>}
            </div>
          )}

          {activeTab === 'domains' && (
            <div>
              <form onSubmit={addDomain} className="glass-card p-4 mb-4 grid sm:grid-cols-4 gap-3">
                <input placeholder="domain.com" value={newDomain.domain} onChange={e => setNewDomain({...newDomain, domain: e.target.value})} dir="ltr" className={inputClass + ' sm:col-span-2'} />
                <input placeholder="Reason" value={newDomain.reason} onChange={e => setNewDomain({...newDomain, reason: e.target.value})} className={inputClass} />
                <div className="flex gap-2">
                  <select value={newDomain.risk_level} onChange={e => setNewDomain({...newDomain, risk_level: e.target.value})} className={inputClass}>
                    <option value="low" className="bg-card">Low</option>
                    <option value="suspicious" className="bg-card">Suspicious</option>
                    <option value="high" className="bg-card">High</option>
                  </select>
                  <Button type="submit" size="sm"><Plus className="w-4 h-4" /></Button>
                </div>
              </form>
              <div className="space-y-2">
                {domains.map(d => (
                  <div key={d.id} className="glass-card p-4 flex items-center justify-between gap-3">
                    <div>
                      <span className="font-mono text-sm" dir="ltr">{d.domain}</span>
                      <span className={`ms-2 text-xs px-2 py-0.5 rounded capitalize ${d.risk_level === 'high' ? 'bg-red-500/10 text-red-400' : d.risk_level === 'suspicious' ? 'bg-orange-500/10 text-orange-400' : 'bg-green-500/10 text-green-400'}`}>{d.risk_level}</span>
                      {d.reason && <p className="text-xs text-muted-foreground mt-1">{d.reason}</p>}
                    </div>
                    <button onClick={() => deleteDomain(d.id)} className="w-8 h-8 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 flex items-center justify-center"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
                {domains.length === 0 && <p className="text-center py-10 text-muted-foreground">{t('no_data')}</p>}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="glass-card p-6">
              <div className="space-y-2">
                {users.map(u => (
                  <div key={u.id} className="flex items-center justify-between gap-3 py-3 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center text-sm font-bold text-white">
                        {(u.full_name || u.email || 'U')[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{u.full_name || 'User'}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-md capitalize ${u.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>{u.role}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}