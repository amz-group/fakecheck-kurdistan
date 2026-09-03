import React, { useState } from 'react';
import { MessageSquare, ShieldCheck, AlertCircle, Clock, Gift, KeyRound } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { Button } from '@/components/ui/button';
import { useScan } from '@/hooks/useScan';
import ScanProgress from '@/components/ScanProgress';
import AnalysisResult from '@/components/AnalysisResult';

const patterns = [
  { icon: Clock, text: 'Urgency language' },
  { icon: Gift, text: 'Fake prizes' },
  { icon: KeyRound, text: 'OTP / password requests' },
  { icon: AlertCircle, text: 'Investment & crypto scams' },
];

export default function MessageScanner() {
  const { t } = useLanguage();
  const [message, setMessage] = useState('');
  const { loading, step, result, error, analyze, reset } = useScan();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    analyze('message', message.trim());
  };

  if (result) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <AnalysisResult result={result} scanType="message" inputContent={message} onScanAnother={() => { reset(); setMessage(''); }} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-8 h-8 text-cyan-400" />
        </div>
        <h1 className="font-heading font-bold text-3xl mb-2">{t('tool_message')}</h1>
        <p className="text-muted-foreground">{t('tool_message_desc')}</p>
      </div>

      {loading ? (
        <ScanProgress step={step} />
      ) : (
        <>
          <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8">
            <label className="block text-sm font-medium mb-2">{t('paste_message')}</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Paste your SMS, WhatsApp, Telegram, or email message here..."
              rows={7}
              className="w-full p-4 rounded-xl bg-muted/50 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-colors text-sm resize-none scrollbar-thin"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-muted-foreground">{message.length} / 10000</span>
            </div>
            {error && <p className="text-destructive text-sm mt-3">{error}</p>}
            <Button type="submit" className="w-full mt-4 h-12 text-base" disabled={!message.trim()}>
              <ShieldCheck className="w-5 h-5 me-2" /> {t('analyze_message')}
            </Button>
          </form>

          <div className="grid grid-cols-2 gap-3 mt-6">
            {patterns.map((p, i) => {
              const Icon = p.icon;
              return (
                <div key={i} className="glass-card p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="text-xs text-muted-foreground">{p.text}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}