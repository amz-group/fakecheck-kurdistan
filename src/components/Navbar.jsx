import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Menu, X, ChevronDown, LogOut } from 'lucide-react';
import { useLanguage, languages } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const { t, lang, setLang } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const langRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const navLinks = [
    { to: '/', label: t('nav_home') },
    { to: '/scan/link', label: t('nav_scan') },
    { to: '/learn', label: t('nav_learn') },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center glow-primary">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block leading-tight">
            <div className="font-heading font-bold text-sm">{t('brand_name')}</div>
            <div className="text-[10px] text-muted-foreground">{t('tagline')}</div>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === l.to ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Language switcher */}
          <div className="relative" ref={langRef}>
            <button onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
              <span>{languages[lang].flag}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {langOpen && (
              <div className="absolute end-0 mt-2 w-36 glass-card p-1 animate-scale-in">
                {Object.entries(languages).map(([code, cfg]) => (
                  <button key={code} onClick={() => { setLang(code); setLangOpen(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      lang === code ? 'bg-primary/15 text-primary' : 'hover:bg-white/5'
                    }`}>
                    <span>{cfg.flag}</span> {cfg.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {user ? (
            <div className="relative" ref={userRef}>
              <button onClick={() => setUserOpen(!userOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center text-xs font-bold text-white">
                  {(user.full_name || user.email || 'U')[0].toUpperCase()}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
              {userOpen && (
                <div className="absolute end-0 mt-2 w-48 glass-card p-1 animate-scale-in">
                  <div className="px-3 py-2 border-b border-white/5 mb-1">
                    <div className="text-xs font-medium truncate">{user.email}</div>
                  </div>
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-white/5 text-destructive">
                    <LogOut className="w-4 h-4" /> {t('nav_logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/login"><Button variant="ghost" size="sm">{t('nav_login')}</Button></Link>
              <Link to="/register"><Button size="sm">{t('register')}</Button></Link>
            </div>
          )}

          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-lg hover:bg-white/5">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="lg:hidden border-t border-white/5 bg-background/95 backdrop-blur-xl animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} className="block px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-white/5">
                {l.label}
              </Link>
            ))}
            {!user && (
              <div className="flex gap-2 pt-2 border-t border-white/5">
                <Link to="/login" className="flex-1"><Button variant="outline" className="w-full">{t('nav_login')}</Button></Link>
                <Link to="/register" className="flex-1"><Button className="w-full">{t('register')}</Button></Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}