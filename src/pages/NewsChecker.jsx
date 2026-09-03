import React, { useState } from 'react';
import { Newspaper, ShieldCheck, Link2, FileText, Heading } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { Button } from '@/components/ui/button';
import { useScan } from '@/hooks/useScan';
import ScanProgress from '@/components/ScanProgress';
import AnalysisResult from '@/components/AnalysisResult';

export default function NewsChecker() {
  const { t } = useLanguage();
  const [url, setUrl] = useState('');
  const [headline, setHeadline] = useState('');
  const [text, setText] = useState('');
  const { loading, step, result, error, analyze, reset } = useScan();

  const content = [url, headline, text].filter(Boolean).join('\n\n');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    analyze('news', content.trim());
  };

  if (result) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <AnalysisResult result={result} scanType="news" inputContent={content} onScanAnother={() => { reset(); setUrl(''); setHeadline(''); setText(''); }} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center mx-auto mb-4">
          <Newspaper className="w-8 h-8 text-amber-400" />
        </div>
        <h1 className="font-heading font-bold text-3xl mb-2">{t('tool_news')}</h1>
        <p className="text-muted-foreground">{t('tool_news_desc')}</p>
      </div>

      {loading ? (
        <ScanProgress step={step} />
      ) : (
        <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-1.5"><Link2 className="w-4 h-4" />{t('article_url')}</label>
            <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://news-site.com/article" dir="ltr"
              className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-colors text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-1.5"><Heading className="w-4 h-4" />{t('news_headline')}</label>
            <input type="text" value={headline} onChange={e => setHeadline(e.target.value)} placeholder="News headline..."
              className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-colors text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-1.5"><FileText className="w-4 h-4" />{t('article_text')}</label>
            <textarea value={text} onChange={e => setText(e.target.value)} rows={6} placeholder="Paste the full article text or social media news post..."
              className="w-full p-4 rounded-xl bg-muted/50 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-colors text-sm resize-none scrollbar-thin" />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" className="w-full h-12 text-base" disabled={!content.trim()}>
            <ShieldCheck className="w-5 h-5 me-2" /> {t('analyze_news')}
          </Button>
        </form>
      )}
    </div>
  );
}