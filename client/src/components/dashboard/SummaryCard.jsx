export default function SummaryCard({
  title,
  amount,
  icon,
  color,
  isCurrency = true,
}) {
  const colors = {
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-rose-50 text-rose-700",
    blue: "bg-blue-50 text-blue-700",
    purple: "bg-purple-50 text-purple-700",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>

        <span className={`rounded-lg p-2 ${colors[color] || colors.blue}`}>
          {icon}
        </span>
      </div>

      <p className="mt-4 text-2xl font-bold text-slate-900">
        {isCurrency
          ? `₹${Number(amount).toLocaleString("en-IN", {
              maximumFractionDigits: 2,
            })}`
          : Number(amount).toLocaleString("en-IN")}
      </p>
    </div>
  );
}
