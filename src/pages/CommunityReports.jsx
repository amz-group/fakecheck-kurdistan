import React, { useState, useEffect } from 'react';
import { Users, Flag, Plus, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Image } from '@/components/ui/image';

const scamTypes = [
  { value: 'phishing', label: 'Phishing' },
  { value: 'fake_prize', label: 'Fake Prize' },
  { value: 'otp_scam', label: 'OTP Scam' },
  { value: 'investment', label: 'Investment Scam' },
  { value: 'job_scam', label: 'Fake Job Offer' },
  { value: 'crypto_scam', label: 'Crypto Scam' },
  { value: 'impersonation', label: 'Impersonation' },
  { value: 'fake_shop', label: 'Fake Shop' },
  { value: 'other', label: 'Other' },
];

const platforms = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'sms', label: 'SMS' },
  { value: 'email', label: 'Email' },
  { value: 'website', label: 'Website' },
  { value: 'other', label: 'Other' },
];

const statusMeta = {
  pending: { icon: Clock, color: 'text-orange-400 bg-orange-500/10', key: 'status_pending' },
  approved: { icon: CheckCircle2, color: 'text-green-400 bg-green-500/10', key: 'status_approved' },
  rejected: { icon: XCircle, color: 'text-red-400 bg-red-500/10', key: 'status_rejected' },
};

export default function CommunityReports() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '', scam_type: 'phishing', description: '', url: '', phone_number: '', platform: 'whatsapp', country_region: '',
  });

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.ScamReport.filter({ status: 'approved' }, '-created_date', 50);
      setReports(data);
    } catch (e) {} finally { setLoading(false); }
  };

  useEffect(() => { loadReports(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await base44.entities.ScamReport.create({ ...form, status: 'pending' });
      toast({ title: '✓ Report submitted', description: 'Your report will appear after admin approval.' });
      setForm({ title: '', scam_type: 'phishing', description: '', url: '', phone_number: '', platform: 'whatsapp', country_region: '' });
      setShowForm(false);
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally { setSubmitting(false); }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-colors text-sm";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading font-bold text-3xl flex items-center gap-2"><Users className="w-7 h-7 text-primary" />{t('community_title')}</h1>
          <p className="text-muted-foreground mt-1">{t('community_desc')}</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}><Plus className="w-4 h-4 me-1" />{t('report_scam_title')}</Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card p-6 mb-8 animate-slide-up space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">{t('field_title')}</label>
              <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">{t('field_scam_type')}</label>
              <select value={form.scam_type} onChange={e => setForm({...form, scam_type: e.target.value})} className={inputClass}>
                {scamTypes.map(s => <option key={s.value} value={s.value} className="bg-card">{s.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">{t('field_description')}</label>
            <textarea required value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={4} className={inputClass + ' resize-none'} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">{t('field_url')}</label>
              <input type="url" value={form.url} onChange={e => setForm({...form, url: e.target.value})} dir="ltr" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">{t('field_phone')}</label>
              <input value={form.phone_number} onChange={e => setForm({...form, phone_number: e.target.value})} dir="ltr" className={inputClass} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">{t('field_platform')}</label>
              <select value={form.platform} onChange={e => setForm({...form, platform: e.target.value})} className={inputClass}>
                {platforms.map(p => <option key={p.value} value={p.value} className="bg-card">{p.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">{t('field_region')}</label>
              <input value={form.country_region} onChange={e => setForm({...form, country_region: e.target.value})} className={inputClass} />
            </div>
          </div>
          <div className="flex gap-3">
            <Button type="submit" disabled={submitting}>{t('submit_report')}</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>{t('cancel')}</Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-20 text-muted-foreground">{t('loading')}</div>
      ) : reports.length === 0 ? (
        <div className="glass-card p-12 text-center text-muted-foreground">
          <Flag className="w-12 h-12 mx-auto mb-3 opacity-40" />
          {t('no_data')}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((r, i) => (
            <div key={r.id} className="glass-card glass-card-hover p-5 animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-sm leading-snug">{r.title}</h3>
                <span className="shrink-0 text-xs px-2 py-1 rounded-md bg-primary/10 text-primary capitalize">{r.platform}</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{r.description}</p>
              {r.image_url && <Image src={r.image_url} alt={r.title} className="w-full h-32 object-cover rounded-lg mb-3" />}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Flag className="w-3.5 h-3.5" /> {r.report_count} {t('report_count').toLowerCase()}
                {r.is_trending && <span className="ms-auto px-2 py-0.5 rounded bg-orange-500/15 text-orange-400 font-medium">{t('trending_badge')}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}