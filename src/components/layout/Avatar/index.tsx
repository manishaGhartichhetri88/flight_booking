"use client";

import Link from 'next/link';
import { useState } from 'react';

interface AvatarProps {
  name?: string;
  email?: string;
  photo?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Avatar({ name, email, photo, size = 'md' }: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  const initials = name
    ? name.split(' ').map((s) => s[0]).slice(0, 2).join('')
    : (email || '').slice(0, 2).toUpperCase();

  return (
    <Link
      href="/profile"
      className={`inline-flex items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-300 font-semibold text-slate-900 transition-all duration-200 hover:shadow-lg hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${sizeClasses[size]}`}
      aria-label={`Profile: ${name || email || 'User'}`}
      title={`Go to profile (${name || email || 'User'})`}
    >
      {photo && !imageError ? (
        <img
          src={photo}
          alt={name || 'User profile'}
          className={`h-full w-full rounded-full object-cover`}
          onError={() => setImageError(true)}
        />
      ) : (
        <span>{initials}</span>
      )}
    </Link>
  );
}
