import { Check, Clock3, HeartHandshake, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';
import type { Connection, User } from '../types';

interface Props { user: User; onToast: (message: string, type?: 'success' | 'error') => void; }

export function ConnectionsPage({ user, onToast }: Props) {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try { const result = await api.getConnections(user._id); setConnections(result.connections); }
    catch (error) { onToast(error instanceof Error ? error.message : 'Unable to load connections.', 'error'); }
    finally { setLoading(false); }
  }

  useEffect(() => { void load(); }, [user._id]);

  const incomingPending = useMemo(() => connections.filter((item) => item.receiverId._id === user._id && item.status === 'pending'), [connections, user._id]);
  const outgoingPending = useMemo(() => connections.filter((item) => item.senderId._id === user._id && item.status === 'pending'), [connections, user._id]);
  const accepted = useMemo(() => connections.filter((item) => item.status === 'accepted'), [connections]);

  async function respond(id: string, status: 'accepted' | 'rejected') {
    try { await api.updateConnection(user._id, id, status); onToast(status === 'accepted' ? 'Connection accepted!' : 'Request rejected.'); await load(); }
    catch (error) { onToast(error instanceof Error ? error.message : 'Unable to update request.', 'error'); }
  }

  if (loading) return <div className="space-y-4"><div className="h-40 animate-pulse rounded-3xl bg-slate-200" /><div className="h-40 animate-pulse rounded-3xl bg-slate-200" /></div>;

  const Partner = ({ connection }: { connection: Connection }) => {
    const partner = connection.senderId._id === user._id ? connection.receiverId : connection.senderId;
    return <div className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-soft"><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 font-bold text-blue-700">{partner.name[0]}</div><div><div className="font-bold text-slate-900">{partner.name}</div><div className="text-sm text-slate-500">{partner.englishLevel} · {partner.learningGoal}</div></div></div><div className="rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">✓ Connected</div></div>;
  };

  return <section className="space-y-6"><div><div className="text-sm font-bold uppercase tracking-wider text-violet-600">Your network</div><h1 className="mt-1 text-3xl font-black tracking-tight">Connections</h1><p className="mt-2 text-slate-500">Accept requests and keep your best practice partners together.</p></div>
    <div className="grid gap-5 lg:grid-cols-2">
      <section className="space-y-3"><h2 className="flex items-center gap-2 font-bold"><HeartHandshake className="h-4 w-4 text-violet-600" />Incoming requests</h2>{incomingPending.length === 0 ? <Empty text="No incoming requests right now." /> : incomingPending.map((item) => <div key={item._id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft"><p className="font-semibold text-slate-900">{item.senderId.name} wants to practice English with you.</p><p className="mt-1 text-sm text-slate-500">{item.senderId.englishLevel} · {item.senderId.learningGoal}</p><div className="mt-4 flex gap-2"><button onClick={() => respond(item._id, 'accepted')} className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"><Check className="h-4 w-4" /> Accept</button><button onClick={() => respond(item._id, 'rejected')} className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-200"><X className="h-4 w-4" /> Reject</button></div></div>)}</section>
      <section className="space-y-3"><h2 className="flex items-center gap-2 font-bold"><Clock3 className="h-4 w-4 text-blue-600" />Outgoing requests</h2>{outgoingPending.length === 0 ? <Empty text="No pending outgoing requests." /> : outgoingPending.map((item) => <div key={item._id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft"><div className="font-bold">{item.receiverId.name}</div><p className="mt-1 text-sm text-slate-500">Waiting for them to respond.</p></div>)}</section>
    </div>
    <section className="space-y-3"><h2 className="font-bold">Connected partners</h2>{accepted.length === 0 ? <Empty text="Accept a request to start practicing together." /> : accepted.map((item) => <Partner key={item._id} connection={item} />)}</section>
  </section>;
}

function Empty({ text }: { text: string }) { return <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">{text}</div>; }
