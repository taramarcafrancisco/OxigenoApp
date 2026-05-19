export default function DashboardCard({ title, value, icon: Icon, tone = "blue", detail }) {
  const tones = {
    blue: "bg-blue-900 text-white",
    orange: "bg-orange-500 text-white",
    slate: "bg-slate-900 text-white",
    yellow: "bg-yellow-400 text-slate-950",
  };

  return (
    <article className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <strong className="mt-2 block text-3xl font-bold text-slate-950">{value}</strong>
        </div>
        <span className={`flex h-11 w-11 items-center justify-center rounded-md ${tones[tone] || tones.blue}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      {detail ? <p className="mt-4 text-sm text-slate-500">{detail}</p> : null}
    </article>
  );
}
