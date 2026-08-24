import { useEffect, useMemo, useState } from 'react';
import { Layout } from './components/Layout';
import { Toast } from './components/Toast';
import { api } from './lib/api';
import { ConnectionsPage } from './pages/ConnectionsPage';
import { MatchesPage } from './pages/MatchesPage';
import { MissionPage } from './pages/MissionPage';
import { ProfilePage } from './pages/ProfilePage';
import type { User } from './types';

export default function App() {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState(localStorage.getItem('fluentfeed-user-id') || '');
  const [page, setPage] = useState('matches');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [bootLoading, setBootLoading] = useState(true);

  async function loadUsers() {
    const result = await api.getUsers();
    setAllUsers(result.users);
    if (!userId && result.users.length) {
      setUserId(result.users[0]._id);
      localStorage.setItem('fluentfeed-user-id', result.users[0]._id);
    }
  }

  useEffect(() => {
    loadUsers().catch((error) => showToast(error instanceof Error ? error.message : 'Unable to connect to backend.', 'error')).finally(() => setBootLoading(false));
  }, []);

  const currentUser = useMemo(() => allUsers.find((item) => item._id === userId) || null, [allUsers, userId]);

  function showToast(message: string, type: 'success' | 'error' = 'success') {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3500);
  }

  function switchUser(id: string) {
    setUserId(id);
    localStorage.setItem('fluentfeed-user-id', id);
    setPage('matches');
  }

  function onUserUpdated(updated: User) {
    setAllUsers((current) => current.map((item) => item._id === updated._id ? updated : item));
  }

  function onUserCreated(created: User) {
    setAllUsers((current) => [...current, created]);
    setUserId(created._id);
    localStorage.setItem('fluentfeed-user-id', created._id);
  }

  if (bootLoading) return <div className="grid min-h-screen place-items-center bg-slate-50"><div className="text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-xl font-black text-white">F</div><div className="mt-4 font-bold text-slate-900">Loading FluentFeed...</div><div className="mt-1 text-sm text-slate-500">Connecting to the practice partner service.</div></div></div>;

  if (!currentUser) return <div className="grid min-h-screen place-items-center bg-slate-50 px-4"><div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-soft"><h1 className="text-2xl font-black">Backend not ready</h1><p className="mt-2 text-sm leading-6 text-slate-500">Run the backend, configure MongoDB, and seed the demo users using the instructions in README.md.</p></div></div>;

  return <>
    <Layout user={currentUser} activePage={page} onNavigate={setPage} onSwitchUser={switchUser} allUsers={allUsers}>
      {page === 'matches' && <MatchesPage user={currentUser} onToast={showToast} />}
      {page === 'connections' && <ConnectionsPage user={currentUser} onToast={showToast} />}
      {page === 'mission' && <MissionPage user={currentUser} onToast={showToast} />}
      {page === 'profile' && <ProfilePage user={currentUser} onUserUpdated={onUserUpdated} onUserCreated={onUserCreated} onToast={showToast} />}
    </Layout>
    {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
  </>;
}
