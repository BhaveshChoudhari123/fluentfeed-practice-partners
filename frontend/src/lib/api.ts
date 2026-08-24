import type { Connection, Match, Mission, ProfileForm, User } from '../types';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

async function request<T>(path: string, options: RequestInit = {}, userId?: string): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body) headers.set('Content-Type', 'application/json');
  if (userId) headers.set('X-User-Id', userId);

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error(`Cannot reach the FluentFeed backend at ${API_URL}. Start the backend and verify VITE_API_URL.`);
  }

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json().catch(() => ({}))
    : { message: await response.text().catch(() => '') };

  if (!response.ok) throw new Error(data.message || `Request failed with status ${response.status}.`);
  return data as T;
}

export const api = {
  getUsers: () => request<{ users: User[] }>('/users'),
  getProfile: (userId: string) => request<{ user: User }>('/profile', {}, userId),
  createProfile: (body: ProfileForm) => request<{ user: User }>('/profile', { method: 'POST', body: JSON.stringify(body) }),
  updateProfile: (userId: string, body: ProfileForm) => request<{ user: User }>('/profile', { method: 'PUT', body: JSON.stringify(body) }, userId),
  getMatches: (userId: string, params: Record<string, string>) => {
    const search = new URLSearchParams(Object.entries(params).filter(([, value]) => value));
    const query = search.toString();
    return request<{ matches: Match[] }>(`/matches${query ? `?${query}` : ''}`, {}, userId);
  },
  getConnections: (userId: string) => request<{ connections: Connection[] }>('/connections', {}, userId),
  createConnection: (userId: string, receiverId: string) => request<{ connection: Connection }>('/connections', { method: 'POST', body: JSON.stringify({ receiverId }) }, userId),
  updateConnection: (userId: string, connectionId: string, status: 'accepted' | 'rejected') => request<{ connection: Connection }>(`/connections/${connectionId}`, { method: 'PUT', body: JSON.stringify({ status }) }, userId),
  getMission: (userId: string) => request<Mission>('/missions', {}, userId)
};
