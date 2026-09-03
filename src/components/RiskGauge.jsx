import React from 'react';

const levelConfig = {
  low: { color: 'hsl(142 71% 45%)', labelKey: 'risk_level_low', stroke: 142 },
  suspicious: { color: 'hsl(38 92% 50%)', labelKey: 'risk_level_suspicious', stroke: 38 },
  high: { color: 'hsl(0 84% 60%)', labelKey: 'risk_level_high', stroke: 0 },
};

export default function RiskGauge({ score, level, size = 200 }) {
  const config = levelConfig[level] || levelConfig.suspicious;
  const radius = (size - 24) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const stroke = size > 160 ? 12 : 8;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={config.color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease-out', filter: `drop-shadow(0 0 8px ${config.color})` }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading font-bold leading-none" style={{ fontSize: size * 0.28 }}>{score}</span>
        <span className="text-xs text-muted-foreground mt-1">/ 100</span>
      </div>
    </div>
  );
}