import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Save } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export default function Profile() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { setFullName(user?.full_name || ''); }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe({ full_name: fullName });
      toast({ title: '✓ Profile updated' });
    } catch (e) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally { setSaving(false); }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-heading font-bold text-3xl mb-6">{t('nav_profile')}</h1>

      <div className="glass-card p-6 sm:p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center text-2xl font-bold text-white">
            {(user?.full_name || user?.email || 'U')[0].toUpperCase()}
          </div>
          <div>
            <h2 className="font-heading font-semibold text-lg">{user?.full_name || 'User'}</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary mt-1 capitalize">
              <Shield className="w-3 h-3" /> {user?.role}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"><User className="w-4 h-4" />Full Name</label>
            <input value={fullName} onChange={e => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-white/5 focus:border-primary/50 outline-none text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"><Mail className="w-4 h-4" />Email</label>
            <input value={user?.email || ''} disabled
              className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-white/5 text-sm text-muted-foreground" />
          </div>
          <Button onClick={handleSave} disabled={saving}><Save className="w-4 h-4 me-2" />{t('save')}</Button>
        </div>
      </div>
    </div>
  );
}