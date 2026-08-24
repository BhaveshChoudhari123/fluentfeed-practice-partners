import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { MatchCard } from '../components/MatchCard';
import { api } from '../lib/api';
import type { Match, User } from '../types';

interface MatchesPageProps {
  user: User;
  onToast: (message: string, type?: 'success' | 'error') => void;
}

export function MatchesPage({ user, onToast }: MatchesPageProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [level, setLevel] = useState('');
  const [goal, setGoal] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(true);
  const [connectingId, setConnectingId] = useState<string | null>(null);

  const loadMatches = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api.getMatches(user._id, { englishLevel: level, learningGoal: goal, country });
      setMatches(result.matches);
    } catch (error) {
      onToast(error instanceof Error ? error.message : 'Unable to load matches.', 'error');
    } finally {
      setLoading(false);
    }
  }, [user._id, level, goal, country, onToast]);

  useEffect(() => { void loadMatches(); }, [loadMatches]);

  async function connect(receiverId: string) {
    setConnectingId(receiverId);
    try {
      await api.createConnection(user._id, receiverId);
      onToast('Connection request sent!');
      await loadMatches();
    } catch (error) {
      onToast(error instanceof Error ? error.message : 'Could not send request.', 'error');
    } finally {
      setConnectingId(null);
    }
  }

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-[32px] bg-slate-900 px-6 py-8 text-white shadow-soft sm:px-8">
        <div className="max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold"><Sparkles className="h-3.5 w-3.5" /> Personalized partner matching</div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Find your English practice partner.</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">We compare your goals, English level, time, country, and native language to surface the five strongest matches.</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft">
        <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900"><SlidersHorizontal className="h-4 w-4" /> Filters</div>
        <div className="grid gap-3 md:grid-cols-3">
          <select value={level} onChange={(e) => setLevel(e.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"><option value="">All levels</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select>
          <select value={goal} onChange={(e) => setGoal(e.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"><option value="">All goals</option><option>IELTS</option><option>TOEFL</option><option>Job Interview</option><option>Daily Communication</option><option>Business English</option></select>
          <div className="relative"><Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-400" /></div>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"><div className="h-72 animate-pulse rounded-3xl bg-slate-200" /><div className="h-72 animate-pulse rounded-3xl bg-slate-200" /><div className="h-72 animate-pulse rounded-3xl bg-slate-200" /></div>
      ) : matches.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-soft"><div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-slate-100">🔎</div><h3 className="font-bold text-slate-900">No matches yet</h3><p className="mt-1 text-sm text-slate-500">Try changing the filters or create more practice profiles.</p></div>
      ) : (
        <div><div className="mb-3 text-sm font-semibold text-slate-500">Top {matches.length} matches</div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{matches.map((match) => <MatchCard key={match.user._id} match={match} onConnect={() => connect(match.user._id)} disabled={connectingId === match.user._id} />)}</div></div>
      )}
    </section>
  );
}
