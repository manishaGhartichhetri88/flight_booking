"use client";

import { useEffect, useMemo, useState } from 'react';

type UserRow = {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  mobile?: string | null;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
};

type FormState = {
  name: string;
  email: string;
  mobile: string;
  role: string;
  password: string;
};

type LoadState = 'loading' | 'ready' | 'error';

const api = '/api/admin';

const emptyForm: FormState = {
  name: '',
  email: '',
  mobile: '',
  role: 'user',
  password: '',
};

export default function AdminUsersCrud() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const editingUser = useMemo(() => users.find((user) => getUserId(user) === editingId), [editingId, users]);

  const loadUsers = async () => {
    setLoadState('loading');
    setError(null);
    try {
      const response = await fetch(`${api}/users`);
      if (!response.ok) throw new Error('Could not load users');
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
      setLoadState('ready');
    } catch (err) {
      setLoadState('error');
      setError(err instanceof Error ? err.message : 'Could not load users');
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const updateForm = (key: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const startCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setMessage(null);
    setError(null);
  };

  const startEdit = (user: UserRow) => {
    setEditingId(getUserId(user));
    setForm({
      name: user.name || '',
      email: user.email || '',
      mobile: user.mobile || '',
      role: user.role || 'user',
      password: '',
    });
    setMessage(null);
    setError(null);
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const payload: Record<string, string> = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        mobile: form.mobile.trim(),
        role: form.role,
      };

      if (form.password.trim()) payload.password = form.password;
      if (!editingId && !payload.password) {
        throw new Error('Password is required when creating a user.');
      }

      const response = await fetch(editingId ? `${api}/users/${editingId}` : `${api}/users`, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.message || data?.error || 'Could not save user');
      }

      setMessage(editingId ? 'User updated.' : 'User created.');
      setEditingId(null);
      setForm(emptyForm);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save user');
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async (user: UserRow) => {
    const id = getUserId(user);
    if (!id) return;
    const confirmed = window.confirm(`Delete ${user.email || user.name || 'this user'}?`);
    if (!confirmed) return;

    setMessage(null);
    setError(null);
    try {
      const response = await fetch(`${api}/users/${id}`, { method: 'DELETE' });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.message || data?.error || 'Could not delete user');

      if (editingId === id) startCreate();
      setUsers((current) => current.filter((row) => getUserId(row) !== id));
      setMessage('User deleted.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete user');
    }
  };

  return (
    <main className="space-y-6 pb-10">
      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-cyan-700">Access directory</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">Users</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Create, update, and remove user accounts through the backend users API.
            </p>
          </div>
          <button
            type="button"
            onClick={startCreate}
            className="w-fit rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            New user
          </button>
        </div>
      </section>

      {(message || error || loadState === 'error') && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            error || loadState === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}
        >
          {error || message}
        </div>
      )}

      <section className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <form onSubmit={submit} className="rounded-lg border border-slate-200 bg-white p-5">
          <div>
            <h2 className="text-base font-semibold text-slate-950">{editingUser ? 'Edit User' : 'Create User'}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {editingUser ? 'Leave password blank to keep the current password.' : 'Password is required for new users.'}
            </p>
          </div>

          <div className="mt-5 space-y-4">
            <Field label="Name">
              <input
                value={form.name}
                onChange={(event) => updateForm('name', event.target.value)}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-200"
                placeholder="Full name"
              />
            </Field>

            <Field label="Email">
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) => updateForm('email', event.target.value)}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-200"
                placeholder="user@example.com"
              />
            </Field>

            <Field label="Mobile">
              <input
                value={form.mobile}
                onChange={(event) => updateForm('mobile', event.target.value)}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-200"
                placeholder="98XXXXXXXX"
              />
            </Field>

            <Field label="Role">
              <select
                value={form.role}
                onChange={(event) => updateForm('role', event.target.value)}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-200"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="agent">Agent</option>
              </select>
            </Field>

            <Field label="Password">
              <input
                type="password"
                required={!editingId}
                minLength={6}
                value={form.password}
                onChange={(event) => updateForm('password', event.target.value)}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-200"
                placeholder={editingId ? 'Optional new password' : 'Minimum 6 characters'}
              />
            </Field>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Saving...' : editingId ? 'Update user' : 'Create user'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={startCreate}
                className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="flex flex-col gap-1 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-base font-semibold text-slate-950">User Accounts</h2>
            <p className="text-sm text-slate-500">{loadState === 'loading' ? 'Loading users...' : `${users.length} accounts`}</p>
          </div>

          {users.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">User</th>
                    <th className="px-5 py-3 font-semibold">Mobile</th>
                    <th className="px-5 py-3 font-semibold">Role</th>
                    <th className="px-5 py-3 font-semibold">Joined</th>
                    <th className="px-5 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((user, index) => (
                    <tr key={getUserId(user) || index} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <div className="font-medium text-slate-950">{user.name || 'Unnamed user'}</div>
                        <div className="mt-0.5 text-xs text-slate-500">{user.email || 'No email'}</div>
                      </td>
                      <td className="px-5 py-4 text-slate-700">{user.mobile || 'No mobile'}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-700">{formatDate(user.createdAt || user.updatedAt || '')}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(user)}
                            className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteUser(user)}
                            className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-5 py-12 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-500">0</div>
              <h3 className="mt-3 text-sm font-semibold text-slate-950">No users found</h3>
              <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">Create the first user with the form on this page.</p>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function getUserId(user: UserRow) {
  return user._id || user.id || '';
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not recorded';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
