export default function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:block">
      <h2 className="text-lg font-semibold text-slate-900">Quick links</h2>
      <ul className="mt-6 space-y-3 text-sm text-slate-600">
        <li>Search flights</li>
        <li>Recent bookings</li>
        <li>Travel alerts</li>
      </ul>
    </aside>
  );
}
