"use client";

import React, { useEffect, useState, useRef, ChangeEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type User = {
  _id: string;
  name?: string;
  email?: string;
  mobile?: string;
  location?: string;
  photos?: string[];
  passport?: string | null;
  cards?: Array<Record<string, any>>;
};

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bookings, setBookings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'payment' | 'bookings'>('profile');
  const [selectedPayment, setSelectedPayment] = useState('credit-card');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    (async () => {
      try {
        // Try to get fresh user data from API
        const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setLoading(false);
          // fetch bookings
          const b = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/auth/me/bookings', { headers: { Authorization: `Bearer ${token}` } });
          if (b.ok) setBookings(await b.json());
        } else {
          // Fall back to cached user
          const cached = localStorage.getItem('me');
          if (cached) {
            setUser(JSON.parse(cached));
          } else {
            // try registered profile saved in session (during sign up)
            const reg = sessionStorage.getItem('registeredProfile');
            if (reg) setUser(JSON.parse(reg));
          }
          setLoading(false);
        }
      } catch (e) {
        // Fall back to cached user
        const cached = localStorage.getItem('me');
        if (cached) {
          setUser(JSON.parse(cached));
        } else {
          const reg = sessionStorage.getItem('registeredProfile');
          if (reg) setUser(JSON.parse(reg));
        }
        setLoading(false);
      }
    })();
  }, [router]);

  const handleSave = async () => {
    if (!user) return;
    setError('');
    setSuccess('');
    if (newPassword && newPassword !== confirmPassword) return setError('Passwords do not match');
    if (newPassword && newPassword.length < 6) return setError('Password must be at least 6 characters');
    // validate Nepal mobile (10 digits)
    const digits = (user.mobile || '').toString().replace(/\D/g, '');
    if (!digits || digits.length !== 10) return setError('Phone number must be 10 digits (Nepal)');
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const payload: any = { name: user.name, mobile: user.mobile, location: user.location, photos: user.photos || [], passport: user.passport || null, cards: user.cards || [] };
      if (newPassword) payload.password = newPassword;
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error || 'Failed to save');
        setSaving(false);
        return;
      }
      const j = await res.json();
      setUser(j.user);
      setNewPassword('');
      setConfirmPassword('');
      setSuccess('Profile updated successfully!');
      try { localStorage.setItem('me', JSON.stringify(j.user)); } catch(e){}
      setTimeout(() => setSuccess(''), 3000);
      setSaving(false);
    } catch (e) {
      setError('Failed to save');
      setSaving(false);
    }
  };

  const handleProfilePictureUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/auth/upload-avatar', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(err.error || 'Failed to upload picture');
        setSaving(false);
        return;
      }

      const data = await res.json();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const fullPhotoUrl = apiUrl + data.photoUrl;
      setUser((u) => {
        if (!u) return u;
        const updatedUser = { ...u, photos: [fullPhotoUrl, ...(u.photos || [])] } as User;
        try { localStorage.setItem('me', JSON.stringify(updatedUser)); } catch(e){}
        window.dispatchEvent(new Event('authChanged'));
        return updatedUser;
      });
      setSuccess('Profile picture updated!');
      setTimeout(() => setSuccess(''), 3000);
      setSaving(false);
    } catch (e) {
      console.error(e);
      setError('Failed to upload picture');
      setSaving(false);
    }

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const signOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('me');
    window.dispatchEvent(new Event('authChanged'));
    router.push('/');
  };

  const paymentMethods = [
    {
      key: 'credit-card',
      label: 'Credit Card',
      subtitle: 'Visa, Mastercard',
      icon: '💳',
      iconBg: 'bg-indigo-600',
      description: 'Add your card details for fast checkout.',
      fields: [
        { key: 'holderName', label: 'Card Holder Name', placeholder: 'John Doe' },
        { key: 'number', label: 'Card Number', placeholder: '4242 4242 4242 4242' },
        { key: 'expiry', label: 'Expiry Date', placeholder: 'MM/YY' },
        { key: 'cvv', label: 'CVV', placeholder: '123' },
      ],
    },
    {
      key: 'debit-card',
      label: 'Debit Card',
      subtitle: 'Bank Debit Card',
      icon: '💳',
      iconBg: 'bg-slate-600',
      description: 'Add your debit card details for secure payments.',
      fields: [
        { key: 'holderName', label: 'Account Holder Name', placeholder: 'Jane Smith' },
        { key: 'number', label: 'Card Number', placeholder: '5555 5555 5555 5555' },
        { key: 'expiry', label: 'Expiry Date', placeholder: 'MM/YY' },
        { key: 'cvv', label: 'CVV', placeholder: '456' },
      ],
    },
    {
      key: 'esewa',
      label: 'Esewa',
      subtitle: 'Digital Wallet',
      icon: 'ই',
      iconBg: 'bg-red-500',
      description: 'Add your eSewa ID or phone number for quick payments.',
      fields: [
        { key: 'holderName', label: 'Account Name', placeholder: 'Ram Sharma' },
        { key: 'number', label: 'eSewa Phone / ID', placeholder: '98xxxxxxxx' },
      ],
    },
    {
      key: 'khalti',
      label: 'Khalti',
      subtitle: 'Digital Wallet',
      icon: 'K',
      iconBg: 'bg-purple-600',
      description: 'Store your Khalti details for wallet payments.',
      fields: [
        { key: 'holderName', label: 'Account Name', placeholder: 'Hari Khadka' },
        { key: 'number', label: 'Khalti Mobile / ID', placeholder: '98xxxxxxxx' },
      ],
    },
    {
      key: 'ime-pay',
      label: 'IME Pay',
      subtitle: 'Digital Wallet',
      icon: 'I',
      iconBg: 'bg-blue-600',
      description: 'Add your IME Pay details to complete payments faster.',
      fields: [
        { key: 'holderName', label: 'Account Name', placeholder: 'Sita Lama' },
        { key: 'number', label: 'IME Pay ID', placeholder: 'IME12345' },
      ],
    },
    {
      key: 'bank-transfer',
      label: 'Bank Transfer',
      subtitle: 'Direct Bank',
      icon: 'B',
      iconBg: 'bg-green-600',
      description: 'Enter your bank transfer details for offline payment confirmation.',
      fields: [
        { key: 'holderName', label: 'Account Holder Name', placeholder: 'Nabin Thapa' },
        { key: 'bankName', label: 'Bank Name', placeholder: 'Global IME Bank' },
        { key: 'number', label: 'Account Number', placeholder: '1234567890' },
      ],
    },
  ];

  const selectedMethod = paymentMethods.find((method) => method.key === selectedPayment) || paymentMethods[0];
  const selectedPaymentEntry = (user?.cards || []).find((card) => (card.method || card.type || '').toLowerCase() === selectedPayment) || null;

  const handlePaymentSelect = (methodKey: string) => {
    setSelectedPayment(methodKey);
    const exists = (user?.cards || []).some((card) => (card.method || card.type || '').toLowerCase() === methodKey);
    if (!exists && user) {
      setUser((u) => {
        if (!u) return u;
        return { ...u, cards: [...(u.cards || []), { method: methodKey, type: methodKey }] } as User;
      });
    }
  };

  const updatePaymentField = (field: string, value: string) => {
    if (!user) return;
    setUser((u) => {
      if (!u) return u;
      const cards = [...(u.cards || [])];
      const existingIndex = cards.findIndex((card) => (card.method || card.type || '').toLowerCase() === selectedPayment);
      const entry = existingIndex >= 0 ? cards[existingIndex] : { method: selectedPayment, type: selectedPayment };
      const updatedEntry = { ...entry, [field]: value };
      if (existingIndex >= 0) cards[existingIndex] = updatedEntry;
      else cards.push(updatedEntry);
      return { ...u, cards } as User;
    });
  };

  if (loading) return <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-6 py-10 lg:px-16 flex items-center justify-center"><p className="text-slate-600">Loading...</p></main>;
  if (!user) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-6 py-10 lg:px-16 flex items-center justify-center">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-center">
          <h1 className="text-3xl font-semibold text-slate-900">Profile</h1>
          <p className="mt-3 text-slate-600">Sign in to see and edit your profile.</p>
          <Link href="/login" className="mt-6 inline-block rounded-2xl bg-indigo-600 px-6 py-3 text-white font-medium hover:bg-indigo-700">Sign in now</Link>
        </div>
      </main>
    );
  }

  const initials = user.name ? user.name.split(' ').map(s => s[0]).slice(0, 2).join('') : (user.email || '').slice(0, 2).toUpperCase();
  const profilePhoto = user.photos?.[0];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-6 py-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt={user.name || 'Profile'} className="w-full h-full object-cover" />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={saving}
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-700 transition shadow-lg"
                  title="Change profile picture"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                  className="hidden"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">{user.name || 'User'}</h1>
                <p className="text-slate-600">{user.email}</p>
                <p className="text-sm text-slate-500 mt-1">{user.location || 'Location not set'}</p>
              </div>
            </div>
            <button onClick={signOut} className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100">Sign out</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition ${
              activeTab === 'profile'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Profile Info
          </button>
          <button
            onClick={() => setActiveTab('payment')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition ${
              activeTab === 'payment'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Payment
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition ${
              activeTab === 'bookings'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Booking History
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Personal Information</h2>

            {error && <div className="mb-4 rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-600">{error}</div>}
            {success && <div className="mb-4 rounded-2xl bg-green-50 border border-green-200 p-4 text-sm text-green-600">{success}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <input
                  value={user.name || ''}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:ring-2 focus:ring-indigo-200"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <input
                  value={user.email || ''}
                  disabled
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 bg-slate-50 text-slate-600 cursor-not-allowed"
                />
                <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                <input
                  value={user.mobile || ''}
                  onChange={(e) => setUser({ ...user, mobile: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:ring-2 focus:ring-indigo-200"
                  placeholder="+977 98xxxxxxxx"
                  type="tel"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Location / Address</label>
                <input
                  value={user.location || ''}
                  onChange={(e) => setUser({ ...user, location: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:ring-2 focus:ring-indigo-200"
                  placeholder="City, Country"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Passport / ID Number</label>
                <input
                  value={user.passport || ''}
                  onChange={(e) => setUser({ ...user, passport: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:ring-2 focus:ring-indigo-200"
                  placeholder="Enter passport or ID number"
                />
              </div>
            </div>

            <div className="mt-8 border-t border-slate-200 pt-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Change Password</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                  <input
                    type="password"
                    placeholder="Leave blank to keep current password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:ring-2 focus:ring-indigo-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-2xl bg-indigo-600 px-6 py-3 text-white font-medium hover:bg-indigo-700 disabled:opacity-60 transition"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {/* Payment Tab */}
        {activeTab === 'payment' && (
          <div className="space-y-6">
            {/* Cards Section */}
            <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Payment Methods</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentMethods.map((method) => {
                    const isActive = selectedPayment === method.key;
                    return (
                      <button
                        key={method.key}
                        type="button"
                        onClick={() => handlePaymentSelect(method.key)}
                        className={`rounded-2xl border-2 p-4 text-left transition ${isActive ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 hover:border-indigo-400'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-full ${method.iconBg} flex items-center justify-center text-white font-bold`}>
                            {method.icon}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{method.label}</p>
                            <p className="text-xs text-slate-600">{method.subtitle}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">{selectedMethod.label}</h3>
                  <p className="text-sm text-slate-600 mt-1">{selectedMethod.description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedMethod.fields.map((field) => (
                    <div key={field.key}>
                      <label className="mb-2 block text-sm font-medium text-slate-700">{field.label}</label>
                      <input
                        type="text"
                        placeholder={field.placeholder}
                        value={(selectedPaymentEntry?.[field.key] as string) || ''}
                        onChange={(e) => updatePaymentField(field.key, e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:ring-2 focus:ring-indigo-200"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Booking History</h2>

            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-600 mb-4">No bookings yet</p>
                <Link href="/flights" className="inline-block rounded-2xl bg-indigo-600 px-6 py-3 text-white font-medium hover:bg-indigo-700">
                  Browse Flights
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking, idx) => {
                  const flightId = booking.flightId || booking.flight?.id || booking.flight?._id;
                  const bookingId = booking._id || booking.bookingId || booking.id;
                  const bookingLink = bookingId ? `/booking/${bookingId}` : flightId ? `/flight/${flightId}` : '/flights';
                  return (
                    <Link key={idx} href={bookingLink} className="block rounded-2xl border border-slate-200 p-6 hover:shadow-md transition">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-slate-900">{booking.flightName || booking.to || booking.destination || 'Flight Booking'}</h3>
                          <p className="text-sm text-slate-600 mt-1">
                            {booking.from || 'Departure'} → {booking.to || 'Destination'}
                          </p>
                        </div>
                        <span className="inline-block rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-600">
                          {booking.status || 'Confirmed'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-slate-600">Date</p>
                          <p className="text-sm font-medium text-slate-900 mt-1">
                            {new Date(booking.createdAt || booking.date || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600">Passengers</p>
                          <p className="text-sm font-medium text-slate-900 mt-1">{booking.passengers || 1}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600">Price</p>
                          <p className="text-sm font-medium text-slate-900 mt-1">${booking.price || booking.cost || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-indigo-600">View Details →</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
