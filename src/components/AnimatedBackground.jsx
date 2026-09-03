import React, { useMemo } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Lock,
  KeyRound,
  Bug,
  Eye,
  Fingerprint,
  Radar,
} from 'lucide-react';

// Mix of protection + threat icons that "rain" down the screen.
const ICONS = [
  { Comp: Shield, tone: 'text-primary' },
  { Comp: ShieldCheck, tone: 'text-green-400' },
  { Comp: ShieldAlert, tone: 'text-orange-400' },
  { Comp: AlertTriangle, tone: 'text-amber-400' },
  { Comp: Lock, tone: 'text-blue-400' },
  { Comp: KeyRound, tone: 'text-indigo-400' },
  { Comp: Bug, tone: 'text-red-400' },
  { Comp: Eye, tone: 'text-cyan-400' },
  { Comp: Fingerprint, tone: 'text-purple-400' },
  { Comp: Radar, tone: 'text-sky-400' },
];

const COUNT = 26;

export default function AnimatedBackground() {
  // Deterministic pseudo-random so layout is stable across renders.
  const drops = useMemo(() => {
    const seeded = (i) => {
      const x = Math.sin(i * 99.13) * 10000;
      return x - Math.floor(x);
    };
    return Array.from({ length: COUNT }, (_, i) => {
      const icon = ICONS[i % ICONS.length];
      return {
        id: i,
        Comp: icon.Comp,
        tone: icon.tone,
        left: seeded(i) * 100, // % across width
        size: 16 + Math.floor(seeded(i + 7) * 26), // 16-42px
        duration: 9 + seeded(i + 3) * 10, // 9-19s
        delay: -(seeded(i + 11) * 16), // negative for staggered start
        opacity: 0.05 + seeded(i + 5) * 0.12, // 0.05-0.17
        drift: (seeded(i + 13) - 0.5) * 40, // horizontal sway px
      };
    });
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* base gradient wash */}
      <div className="absolute inset-0 bg-background" />
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 0%, hsl(217 83% 53% / 0.10), transparent 40%), radial-gradient(circle at 85% 5%, hsl(280 65% 60% / 0.08), transparent 35%)',
        }}
      />
      {/* falling icons */}
      {drops.map((d) => {
        const { Comp } = d;
        return (
          <span
            key={d.id}
            className="absolute top-[-10%] icon-rain"
            style={{
              left: `${d.left}%`,
              animationDuration: `${d.duration}s`,
              animationDelay: `${d.delay}s`,
              ['--drift']: `${d.drift}px`,
            }}
          >
            <Comp
              className={`${d.tone}`}
              style={{ width: d.size, height: d.size, opacity: d.opacity }}
              strokeWidth={1.5}
            />
          </span>
        );
      })}
      {/* subtle vignette to keep content readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/60" />
    </div>
  );
}