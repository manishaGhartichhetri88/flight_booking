'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

interface PaymentFormProps {
  flightId?: string;
}

export default function PaymentForm({ flightId }: PaymentFormProps) {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [cardholder, setCardholder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [paymentType, setPaymentType] = useState('Visa');
  const [savedPayment, setSavedPayment] = useState<any | null>(null);

  useEffect(() => {
    try {
      const cached = localStorage.getItem('me');
      if (cached) {
        const u = JSON.parse(cached);
        // support either u.payment or u.card shape
        const p = u.payment || u.card || null;
        if (p) setSavedPayment(p);
        // also prefill cardholder from profile name if available
        if (u.name) setCardholder(u.name);
        if (p && p.cardholderName && !cardholder) setCardholder(p.cardholderName);
      }
    } catch (e) {}
  }, []);

  const [saveCardToProfile, setSaveCardToProfile] = useState(false);

  const [altPayment, setAltPayment] = useState<'esewa' | 'khalti' | 'fonepay' | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);

    // If user opted to save card and is signed in, persist lightweight payment summary
    const token = localStorage.getItem('token');
    if (token && saveCardToProfile) {
      try {
        const cached = localStorage.getItem('me');
        const u = cached ? JSON.parse(cached) : {};
        u.payment = { cardholderName: cardholder, last4: cardNumber.slice(-4), type: paymentType };
        localStorage.setItem('me', JSON.stringify(u));
        setSavedPayment(u.payment);
      } catch (e) {}
    }

    // Simulate payment processing delay
    window.setTimeout(() => {
      router.push(flightId ? `/confirmation?flightId=${flightId}` : '/confirmation');
    }, 600);
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Payment information</h2>
      <p className="mt-2 text-sm text-slate-600">Securely complete your booking with your card details.</p>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <label className="block text-sm text-slate-700">
              Cardholder name
              <Input required placeholder="Jane Doe" value={cardholder} onChange={(e) => setCardholder(e.target.value)} />
            </label>
            <label className="block text-sm text-slate-700 mt-4">
              Card number
              <Input required placeholder="1234 5678 9012 3456" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
            </label>
          </div>
          {savedPayment && (
            <div className="ml-4 flex-shrink-0">
              <p className="text-sm text-slate-700">Saved card</p>
              <div className="mt-3 rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm">
                <p className="font-medium">{savedPayment.cardholderName || cardholder}</p>
                <p className="text-slate-500">{savedPayment.type || savedPayment.brand} •••• {savedPayment.last4}</p>
                <div className="mt-3">
                  <Button type="button" variant="secondary" onClick={() => {
                    // autofill masked card details — for demo we only fill cardholder and card number placeholder
                    setCardholder(savedPayment.cardholderName || cardholder);
                    if (savedPayment.last4) setCardNumber('•••• •••• •••• ' + savedPayment.last4);
                    if (savedPayment.type) setPaymentType(savedPayment.type);
                  }}>Use saved card</Button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block text-sm text-slate-700">
            Expiry date
            <Input required placeholder="MM/YY" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
          </label>
          <label className="block text-sm text-slate-700">
            CVC
            <Input required placeholder="123" value={cvc} onChange={(e) => setCvc(e.target.value)} />
          </label>
          <label className="block text-sm text-slate-700">
            Payment type
            <Select value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
              <option>Visa</option>
              <option>Mastercard</option>
              <option>American Express</option>
            </Select>
          </label>
        </div>
        {/* Save card checkbox (no popup) */}
        {localStorage && (
          <div className="flex items-center gap-3">
            {localStorage.getItem('token') && (
              <>
                <input id="saveCard" type="checkbox" className="w-4 h-4" checked={saveCardToProfile} onChange={(e) => setSaveCardToProfile(e.target.checked)} />
                <label htmlFor="saveCard" className="text-sm text-slate-700">Save this card to my profile for future payments</label>
              </>
            )}
          </div>
        )}

        {/* Alternative mobile payments */}
        <div>
          <p className="text-sm text-slate-700 mb-2">Or pay with</p>
          <div className="flex items-center gap-3">
            <Button type="button" variant="secondary" onClick={() => setAltPayment('esewa')}>eSewa</Button>
            <Button type="button" variant="secondary" onClick={() => setAltPayment('khalti')}>Khalti</Button>
            <Button type="button" variant="secondary" onClick={() => setAltPayment('fonepay')}>FonePay</Button>
          </div>
          {altPayment && (
            <div className="mt-4 flex items-start gap-4">
              <div>
                <p className="text-sm font-medium">{altPayment.toUpperCase()} QR</p>
                <img src={`https://chart.googleapis.com/chart?cht=qr&chs=220x220&chl=${encodeURIComponent(`pay:${altPayment}|flight:${flightId || ''}|ts:${Date.now()}`)}`} alt="payment-qr" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Scan this QR with your {altPayment} app to complete payment. After payment, click "I have paid" to continue.</p>
                <div className="mt-4">
                  <Button type="button" onClick={() => { router.push(flightId ? `/confirmation?flightId=${flightId}` : '/confirmation'); }}>I have paid</Button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button type="submit">Pay & confirm booking</Button>
          {submitted ? (
            <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-medium text-sky-700">Processing payment…</span>
          ) : (
            <span className="text-sm text-slate-500">You will be redirected to confirmation after payment.</span>
          )}
        </div>
      </form>
    </section>
  );
}
