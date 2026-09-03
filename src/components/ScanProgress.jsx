import React from 'react';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function ScanProgress({ step }) {
  const { t } = useLanguage();
  const steps = [
    { key: 'uploading', label: t('progress_uploading') },
    { key: 'reading', label: t('progress_reading') },
    { key: 'analyzing', label: t('progress_analyzing') },
    { key: 'calculating', label: t('progress_calculating') },
    { key: 'preparing', label: t('progress_preparing') },
  ];
  const activeIndex = steps.findIndex(s => s.key === step);

  return (
    <div className="glass-card p-8 max-w-md mx-auto text-center animate-fade-in">
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-pulse" />
        </div>
      </div>
      <h3 className="font-heading font-semibold text-lg mb-1">{t('analyzing')}</h3>
      <p className="text-sm text-muted-foreground mb-6">{steps[activeIndex]?.label}</p>
      <div className="flex justify-center gap-2">
        {steps.map((s, i) => (
          <div key={s.key}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i <= activeIndex ? 'bg-primary w-8' : 'bg-muted w-4'
            }`} />
        ))}
      </div>
    </div>
  );
}