import React, { useRef } from 'react';
import { Share2, RotateCcw, ShieldCheck, AlertTriangle, ShieldAlert, Info, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import RiskGauge from './RiskGauge';
import WarningSignCard from './WarningSignCard';

const levelMeta = {
  low: { key: 'risk_level_low', Icon: ShieldCheck, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', hex: '#22c55e' },
  suspicious: { key: 'risk_level_suspicious', Icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', hex: '#f59e0b' },
  high: { key: 'risk_level_high', Icon: ShieldAlert, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', hex: '#ef4444' },
};

export default function AnalysisResult({ result, scanType, inputContent, onScanAnother }) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const shareRef = useRef(null);

  const meta = levelMeta[result.risk_level] || levelMeta.suspicious;
  const LevelIcon = meta.Icon;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t('brand_name'),
          text: `${t('risk_score')}: ${result.risk_score}/100 - ${t(meta.key)}`,
          url: window.location.href,
        });
      } catch (e) { /* cancelled */ }
    } else {
      handleDownload();
    }
  };

  const handleDownload = async () => {
    if (!shareRef.current) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(shareRef.current, { backgroundColor: '#080B12', scale: 2 });
      const link = document.createElement('a');
      link.download = `fakecheck-result-${result.risk_score}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top score card */}
      <div className={`glass-card border ${meta.border} p-6 sm:p-8`}>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <RiskGauge score={result.risk_score} level={result.risk_level} size={180} />
          <div className="flex-1 text-center sm:text-start">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${meta.bg} ${meta.color} text-sm font-semibold mb-3`}>
              <LevelIcon className="w-4 h-4" />
              {t(meta.key)}
            </div>
            <h2 className="font-heading font-bold text-xl mb-2">{t('risk_summary')}</h2>
            <p className="text-muted-foreground leading-relaxed">{result.summary}</p>
            {result.external_verification === 'unavailable' && (
              <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1.5 rounded-lg">
                <Info className="w-3.5 h-3.5" /> {t('external_unavailable')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Warning signs */}
      {result.warning_signs?.length > 0 && (
        <div>
          <h3 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            {t('detected_warnings')} ({result.warning_signs.length})
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {result.warning_signs.map((sign, i) => (
              <WarningSignCard key={i} sign={sign} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {result.recommendations?.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            {t('recommended_action')}
          </h3>
          <ul className="space-y-2.5">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                <span className="text-muted-foreground">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-2.5 text-xs text-muted-foreground bg-muted/40 p-4 rounded-xl">
        <Info className="w-4 h-4 mt-0.5 shrink-0" />
        <p>{t('disclaimer')}</p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={handleShare} variant="outline"><Share2 className="w-4 h-4 me-2" />{t('share_result')}</Button>
        <Button onClick={onScanAnother}><RotateCcw className="w-4 h-4 me-2" />{t('scan_another')}</Button>
      </div>

      {/* Hidden share card for download */}
      <div className="absolute -left-[9999px] top-0">
        <div ref={shareRef} className="w-[400px] p-8 rounded-2xl" style={{ background: '#080B12', border: `2px solid ${meta.hex}` }}>
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: meta.hex }}>
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-white text-lg">FakeCheck Kurdistan</div>
              <div className="text-xs text-white/60">Check Before You Click</div>
            </div>
          </div>
          <div className="text-center my-6">
            <div className="text-5xl font-bold" style={{ color: meta.hex }}>{result.risk_score}/100</div>
            <div className="text-xl font-semibold mt-2 uppercase tracking-wider" style={{ color: meta.hex }}>
              {t(meta.key)}
            </div>
          </div>
          <div className="text-center text-white/80 text-sm mb-4">
            {result.warning_signs?.length || 0} Warning Signs Detected
          </div>
          <div className="border-t border-white/10 pt-4 text-center text-xs text-white/40">
            Check Before You Click
          </div>
        </div>
      </div>
    </div>
  );
}