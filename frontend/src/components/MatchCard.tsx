import { Clock3, Globe2, Languages, Send } from 'lucide-react';
import type { Match } from '../types';

interface MatchCardProps { match: Match; onConnect: () => void; disabled?: boolean; }

export function MatchCard({ match, onConnect, disabled }: MatchCardProps) {
  const { user, score } = match;
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-100 to-violet-100 text-lg font-extrabold text-slate-700">{user.name[0]}</div>
          <div>
            <h3 className="font-bold text-slate-900">{user.name}</h3>
            <p className="text-sm text-slate-500">{user.englishLevel} · {user.learningGoal}</p>
          </div>
        </div>
        <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-right">
          <div className="text-xl font-extrabold text-emerald-700">{score}%</div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">Match</div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5"><Globe2 className="h-3.5 w-3.5" />{user.country}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5"><Languages className="h-3.5 w-3.5" />{user.nativeLanguage}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5"><Clock3 className="h-3.5 w-3.5" />{user.preferredTime}</span>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600">{user.bio}</p>

      <button disabled={disabled} onClick={onConnect} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
        <Send className="h-4 w-4" /> Connect
      </button>
    </article>
  );
}
