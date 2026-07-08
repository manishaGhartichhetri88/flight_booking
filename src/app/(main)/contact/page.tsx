"use client";

import { useState } from 'react';
import Card from '@/components/ui/Card';

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'sent'>('idle');

  return (
    <main className="min-h-screen px-6 py-10 lg:px-16">
      <div className="mx-auto max-w-3xl">
        <Card variant="teal" title="Contact support" description="We're happy to help — send us a message">
          {status === 'sent' ? (
            <div className="rounded-lg bg-white/10 p-6 text-white">Thanks — we'll reply shortly.</div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStatus('sent');
              }}
              className="mt-4 grid gap-4"
            >
              <input required name="name" placeholder="Your name" className="rounded-xl p-3" />
              <input required name="email" type="email" placeholder="Email" className="rounded-xl p-3" />
              <textarea required name="message" placeholder="How can we help?" className="min-h-[140px] rounded-xl p-3" />
              <div className="flex justify-end">
                <button className="rounded-xl bg-white/10 px-5 py-2 text-white">Send message</button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </main>
  );
}
