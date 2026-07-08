import Card from '@/components/ui/Card';

export default function AboutPage() {
  return (
    <main className="min-h-screen px-6 py-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <Card variant="purple" title="Who we are" description="Passionate about travel and simple booking">
          <div className="grid gap-8 lg:grid-cols-2">
            <p className="text-sm leading-7">
              We are a small team building delightful flight booking experiences. Our mission is to
              make travel planning colorful, simple, and fast — with honest pricing and helpful
              customer support.
            </p>
            <div className="space-y-4">
              <p className="text-sm">Founded in 2024, we've helped thousands discover new places.</p>
              <ul className="flex flex-col gap-2">
                <li className="inline-flex items-center gap-3">
                  <span className="inline-block h-3 w-3 rounded-full bg-white/90" /> Instant booking
                </li>
                <li className="inline-flex items-center gap-3">
                  <span className="inline-block h-3 w-3 rounded-full bg-white/90" /> Transparent fares
                </li>
                <li className="inline-flex items-center gap-3">
                  <span className="inline-block h-3 w-3 rounded-full bg-white/90" /> 24/7 support
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
