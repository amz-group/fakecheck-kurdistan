import React, { useState } from 'react';
import { Link2, ShieldCheck, Globe, Lock, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { Button } from '@/components/ui/button';
import { useScan } from '@/hooks/useScan';
import ScanProgress from '@/components/ScanProgress';
import AnalysisResult from '@/components/AnalysisResult';

const indicators = [
  { icon: Globe, text: 'Suspicious domain detection' },
  { icon: Link2, text: 'Phishing pattern analysis' },
  { icon: Lock, text: 'HTTP / HTTPS verification' },
  { icon: AlertCircle, text: 'Brand impersonation checks' },
];

export default function LinkScanner() {
  const { t } = useLanguage();
  const [url, setUrl] = useState('');
  const { loading, step, result, error, analyze, reset } = useScan();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    analyze('link', url.trim());
  };

  if (result) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <AnalysisResult result={result} scanType="link" inputContent={url} onScanAnother={() => { reset(); setUrl(''); }} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center mx-auto mb-4">
          <Link2 className="w-8 h-8 text-blue-400" />
        </div>
        <h1 className="font-heading font-bold text-3xl mb-2">{t('tool_link')}</h1>
        <p className="text-muted-foreground">{t('tool_link_desc')}</p>
      </div>

      {loading ? (
        <ScanProgress step={step} />
      ) : (
        <>
          <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8">
            <label className="block text-sm font-medium mb-2">{t('paste_url')}</label>
            <div className="relative">
              <Globe className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://example.com/suspicious-link"
                className="w-full ps-11 pe-4 py-3.5 rounded-xl bg-muted/50 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-colors text-sm"
                dir="ltr"
              />
            </div>
            {error && <p className="text-destructive text-sm mt-3">{error}</p>}
            <Button type="submit" className="w-full mt-4 h-12 text-base" disabled={!url.trim()}>
              <ShieldCheck className="w-5 h-5 me-2" /> {t('analyze_link')}
            </Button>
          </form>

          <div className="grid grid-cols-2 gap-3 mt-6">
            {indicators.map((ind, i) => {
              const Icon = ind.icon;
              return (
                <div key={i} className="glass-card p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground">{ind.text}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}