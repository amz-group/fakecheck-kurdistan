import React from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { Shield, AlertTriangle, AlertOctagon } from 'lucide-react';

export default function StatCard({ icon: Icon, label, value, color = 'primary' }) {
  const { t } = useLanguage();
  const colorMap = {
    primary: 'from-primary/20 to-blue-500/5 text-primary',
    green: 'from-green-500/20 to-green-500/5 text-green-400',
    orange: 'from-orange-500/20 to-orange-500/5 text-orange-400',
    red: 'from-red-500/20 to-red-500/5 text-red-400',
  };

  return (
    <div className="glass-card glass-card-hover p-5 animate-slide-up">
      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-2xl font-heading font-bold">{value?.toLocaleString() ?? 0}</div>
      <div className="text-sm text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}