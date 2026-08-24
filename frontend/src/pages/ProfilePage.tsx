import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { api } from '../lib/api';
import type { ProfileForm, User } from '../types';

const initial: ProfileForm = { name: '', englishLevel: 'Intermediate', learningGoal: 'IELTS', nativeLanguage: '', country: 'India', preferredTime: 'Evening', bio: '' };

interface ProfilePageProps { user: User; onUserUpdated: (user: User) => void; onUserCreated: (user: User) => void; onToast: (message: string, type?: 'success' | 'error') => void; }

export function ProfilePage({ user, onUserUpdated, onUserCreated, onToast }: ProfilePageProps) {
  const [form, setForm] = useState<ProfileForm>(initial);
  const [loading, setLoading] = useState(false);
  const [createMode, setCreateMode] = useState(false);

  useEffect(() => {
    if (!createMode) setForm({ name: user.name, englishLevel: user.englishLevel, learningGoal: user.learningGoal, nativeLanguage: user.nativeLanguage, country: user.country, preferredTime: user.preferredTime, bio: user.bio });
  }, [user, createMode]);

  const update = (field: keyof ProfileForm, value: string) => setForm((current) => ({ ...current, [field]: value } as ProfileForm));

  async function save(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      if (createMode) {
        const result = await api.createProfile(form);
        onUserCreated(result.user);
        setCreateMode(false);
        onToast('New profile created successfully.');
      } else {
        const result = await api.updateProfile(user._id, form);
        onUserUpdated(result.user);
        onToast('Profile saved successfully.');
      }
    } catch (error) {
      onToast(error instanceof Error ? error.message : 'Unable to save profile.', 'error');
    } finally { setLoading(false); }
  }

  return (
    <section className="mx-auto max-w-3xl space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><div className="text-sm font-bold uppercase tracking-wider text-blue-600">Your English profile</div><h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">{createMode ? 'Create a new practice profile.' : 'Tell partners who you are.'}</h1><p className="mt-2 text-slate-500">Your profile powers the partner matching score.</p></div>{!createMode && <button type="button" onClick={() => { setCreateMode(true); setForm(initial); }} className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50">+ New profile</button>}{createMode && <button type="button" onClick={() => setCreateMode(false)} className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50">Cancel</button>}</div>
      <form onSubmit={save} className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="md:col-span-2"><span className="mb-2 block text-sm font-bold text-slate-700">Name</span><input required value={form.name} onChange={(e) => update('name', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-400" /></label>
          <label><span className="mb-2 block text-sm font-bold text-slate-700">English Level</span><select value={form.englishLevel} onChange={(e) => update('englishLevel', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-400"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label>
          <label><span className="mb-2 block text-sm font-bold text-slate-700">Learning Goal</span><select value={form.learningGoal} onChange={(e) => update('learningGoal', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-400"><option>IELTS</option><option>TOEFL</option><option>Job Interview</option><option>Daily Communication</option><option>Business English</option></select></label>
          <label><span className="mb-2 block text-sm font-bold text-slate-700">Native Language</span><input required value={form.nativeLanguage} onChange={(e) => update('nativeLanguage', e.target.value)} placeholder="Marathi" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-400" /></label>
          <label><span className="mb-2 block text-sm font-bold text-slate-700">Country</span><input required value={form.country} onChange={(e) => update('country', e.target.value)} placeholder="India" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-400" /></label>
          <label><span className="mb-2 block text-sm font-bold text-slate-700">Preferred Practice Time</span><select value={form.preferredTime} onChange={(e) => update('preferredTime', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-400"><option>Morning</option><option>Afternoon</option><option>Evening</option><option>Night</option></select></label>
          <label className="md:col-span-2"><span className="mb-2 block text-sm font-bold text-slate-700">Short Bio</span><textarea required rows={5} maxLength={280} value={form.bio} onChange={(e) => update('bio', e.target.value)} placeholder="Tell potential partners what you want to practice..." className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-400" /><div className="mt-1 text-right text-xs text-slate-400">{form.bio.length}/280</div></label>
        </div>
        <button disabled={loading} className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"><Save className="h-4 w-4" /> {loading ? 'Saving...' : 'Save profile'}</button>
      </form>
    </section>
  );
}
