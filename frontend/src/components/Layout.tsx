import { BookOpen, Compass, HeartHandshake, UserRound } from 'lucide-react';
import type { ReactNode } from 'react';
import type { User } from '../types';

interface LayoutProps {
  user: User;
  activePage: string;
  onNavigate: (page: string) => void;
  onSwitchUser: (id: string) => void;
  allUsers: User[];
  children: ReactNode;
}

export function Layout({ user, activePage, onNavigate, onSwitchUser, allUsers, children }: LayoutProps) {
  const nav = [
    { key: 'matches', label: 'Find Partners', icon: Compass },
    { key: 'connections', label: 'Connections', icon: HeartHandshake },
    { key: 'mission', label: 'Practice Mission', icon: BookOpen },
    { key: 'profile', label: 'My Profile', icon: UserRound }
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_#dbeafe_0,_transparent_36%),linear-gradient(180deg,#f8fbff,#f8fafc)]">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <button onClick={() => onNavigate('matches')} className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg">F</div>
            <div className="text-left">
              <div className="text-lg font-extrabold tracking-tight">Fluent<span className="text-violet-600">Feed</span></div>
              <div className="hidden text-xs text-slate-500 sm:block">Practice. Connect. Improve.</div>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <select value={user._id} onChange={(e) => onSwitchUser(e.target.value)} className="max-w-[180px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400">
              {allUsers.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}
            </select>
            <div className="hidden rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 sm:block">Demo User</div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[220px_1fr]">
        <aside className="glass rounded-3xl border border-white/70 p-3 shadow-soft lg:sticky lg:top-[88px] lg:h-fit">
          <nav className="grid grid-cols-2 gap-2 lg:grid-cols-1">
            {nav.map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => onNavigate(key)} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${activePage === key ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
