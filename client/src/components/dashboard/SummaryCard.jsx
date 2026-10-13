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
    blue: "bg-indigo-50 text-indigo-700",
    purple: "bg-violet-50 text-violet-700",
  };

  const formattedAmount = isCurrency
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(amount) || 0)
    : new Intl.NumberFormat("en-IN").format(
        Number(amount) || 0
      );

  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
      <div className="flex min-w-0 items-center justify-between gap-3">
        <p className="min-w-0 text-sm font-medium text-slate-500">
          {title}
        </p>

        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            colors[color] || colors.blue
          }`}
        >
          {icon}
        </span>
      </div>

      <p
        className="mt-4 whitespace-nowrap text-xl font-bold leading-tight tracking-tight text-slate-900 sm:text-2xl"
        title={formattedAmount}
      >
        {formattedAmount}
      </p>
    </div>
  );
}
