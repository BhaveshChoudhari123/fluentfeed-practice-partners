import { BookOpenCheck, Clock3, RefreshCw, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import type { Mission, User } from '../types';

export function MissionPage({ user, onToast }: { user: User; onToast: (message: string, type?: 'success' | 'error') => void }) {
  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadMission() {
    setLoading(true);
    try { setMission(await api.getMission(user._id)); }
    catch (error) { setMission(null); if (error instanceof Error && !error.message.includes('unlock a mission')) onToast(error.message, 'error'); }
    finally { setLoading(false); }
  }

  useEffect(() => { void loadMission(); }, [user._id]);

  return <section className="mx-auto max-w-3xl space-y-6"><div><div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1.5 text-xs font-bold text-violet-700"><Sparkles className="h-3.5 w-3.5" /> Bonus feature</div><h1 className="mt-3 text-3xl font-black tracking-tight">Today's Practice Mission</h1><p className="mt-2 text-slate-500">A fresh conversation prompt to turn a connection into real practice.</p></div>
    {loading ? <div className="h-80 animate-pulse rounded-[32px] bg-slate-200" /> : mission ? <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-soft"><div className="bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-700 px-6 py-8 text-white sm:px-8"><div className="text-sm font-semibold text-blue-100">Discuss with your partner</div><h2 className="mt-3 text-3xl font-black leading-tight">{mission.topic}</h2></div><div className="p-6 sm:p-8"><div className="flex flex-wrap gap-3"><span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700"><Clock3 className="h-4 w-4" /> {mission.durationMinutes} minutes</span><span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700"><BookOpenCheck className="h-4 w-4" /> Vocabulary challenge</span></div><div className="mt-7 rounded-3xl bg-slate-50 p-5"><div className="text-sm font-bold text-slate-900">Instructions</div><p className="mt-2 leading-7 text-slate-600">{mission.instructions}</p></div><button onClick={() => void loadMission()} className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 font-bold text-white hover:bg-blue-700"><RefreshCw className="h-4 w-4" /> New topic</button></div></div> : <div className="rounded-[32px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-soft"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-violet-50 text-violet-700">💬</div><h2 className="mt-4 text-xl font-bold">Connect with a partner first</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">Once a practice request is accepted, your Practice Mission will unlock automatically.</p></div>}
  </section>;
}
