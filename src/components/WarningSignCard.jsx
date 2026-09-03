import React from 'react';
import { AlertTriangle, ShieldAlert, Info } from 'lucide-react';

const severityConfig = {
  low: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  medium: { icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  high: { icon: ShieldAlert, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
};

export default function WarningSignCard({ sign, index }) {
  const config = severityConfig[sign.severity] || severityConfig.medium;
  const Icon = config.icon;

  return (
    <div className={`glass-card p-4 border ${config.border} animate-slide-up`} style={{ animationDelay: `${index * 80}ms` }}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-5 h-5 ${config.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm mb-1">{sign.title}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{sign.description}</p>
        </div>
      </div>
    </div>
  );
}