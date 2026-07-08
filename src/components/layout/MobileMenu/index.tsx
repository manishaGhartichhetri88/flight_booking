export default function MobileMenu() {
  return (
    <div className="block lg:hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-slate-900">Menu</p>
      <div className="mt-4 space-y-3 text-sm text-slate-600">
        <p>Flights</p>
        <p>Bookings</p>
        <p>Profile</p>
      </div>
    </div>
  );
}
