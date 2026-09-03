import React from 'react';
import { BookOpen, Fish, Globe, KeyRound, Briefcase, ShoppingCart, Share2, TrendingUp, Lock, Shield, Search } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

const topics = [
  { icon: Fish, color: 'from-blue-500/20 to-blue-500/5 text-blue-400', title: 'What is Phishing?', body: 'Phishing is when scammers impersonate trusted organizations to steal your passwords, OTP codes, or banking details — usually via fake links in messages or emails. Always verify the sender through official channels before clicking.' },
  { icon: Globe, color: 'from-purple-500/20 to-purple-500/5 text-purple-400', title: 'How to Detect Fake Websites', body: 'Check the URL for misspellings, look for HTTPS and a valid padlock, verify the domain matches the real brand, and watch for poor design or unusual pop-ups. When in doubt, type the official address manually.' },
  { icon: KeyRound, color: 'from-red-500/20 to-red-500/5 text-red-400', title: 'OTP Scams', body: 'Never share one-time passwords with anyone. Legitimate organizations will never ask for your OTP. Scammers use urgency to pressure you — stop and verify before acting on any OTP request.' },
  { icon: Briefcase, color: 'from-green-500/20 to-green-500/5 text-green-400', title: 'Fake Job Scams', body: 'Be cautious of jobs offering high pay for little work, asking for upfront fees, or requesting personal documents early. Verify the company through official channels and never pay to get a job.' },
  { icon: ShoppingCart, color: 'from-orange-500/20 to-orange-500/5 text-orange-400', title: 'Online Shopping Scams', body: 'Watch for deals that are too good to be true, unknown sellers, no return policy, or requests for payment via wire or crypto. Use secure payment methods and check reviews before buying.' },
  { icon: Share2, color: 'from-cyan-500/20 to-cyan-500/5 text-cyan-400', title: 'Social Media Scams', body: 'Be wary of impersonation accounts, fake giveaways, romance scams, and links from strangers. Verify profiles, enable privacy settings, and never send money to someone you only met online.' },
  { icon: TrendingUp, color: 'from-amber-500/20 to-amber-500/5 text-amber-400', title: 'Investment Scams', body: 'Guaranteed high returns with no risk are always a scam. Avoid unregistered platforms, pressure to invest quickly, and schemes promising doubling of money. Verify with financial authorities first.' },
  { icon: Lock, color: 'from-indigo-500/20 to-indigo-500/5 text-indigo-400', title: 'How to Create Strong Passwords', body: 'Use at least 12 characters mixing letters, numbers, and symbols. Never reuse passwords. Use a password manager and enable two-factor authentication on every important account.' },
  { icon: Shield, color: 'from-pink-500/20 to-pink-500/5 text-pink-400', title: 'How to Protect Social Accounts', body: 'Enable two-factor authentication, review connected apps regularly, be selective with friend requests, and check your privacy settings. Never share login codes with anyone.' },
  { icon: Search, color: 'from-teal-500/20 to-teal-500/5 text-teal-400', title: 'How to Verify a Website', body: 'Check the domain name carefully, look for HTTPS, verify contact information, search for reviews, and use security tools like FakeCheck to scan the URL before interacting.' },
];

export default function Learn() {
  const { t } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <h1 className="font-heading font-bold text-3xl mb-2">{t('learn_title')}</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">{t('learn_desc')}</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {topics.map((topic, i) => {
          const Icon = topic.icon;
          return (
            <div key={i} className="glass-card glass-card-hover p-6 animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${topic.color} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-semibold text-base mb-2">{topic.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{topic.body}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}