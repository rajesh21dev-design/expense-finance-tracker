import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ReceiptText,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  RefreshCw,
  CalendarDays,
  CircleDollarSign,
} from "lucide-react";

import { fetchDashboardSummary } from "../redux/slices/dashboardSlice.js";
import { fetchTransactions } from "../redux/slices/transactionSlice.js";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const formatDate = (dateValue) => {
  if (!dateValue) return "Date unavailable";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getTransactionTitle = (transaction) =>
  transaction.description?.trim() ||
  transaction.category ||
  "Untitled transaction";

export default function Dashboard() {
  const dispatch = useDispatch();

  const { summary, loading, error } = useSelector(
    (state) => state.dashboard
  );

  const transactionState = useSelector(
    (state) => state.transactions
  );

  useEffect(() => {
    dispatch(fetchDashboardSummary());
    dispatch(fetchTransactions());
  }, [dispatch]);

  const transactions = Array.isArray(
    transactionState?.transactions
  )
    ? transactionState.transactions
    : [];

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => {
        const dateA = new Date(
          a.date || a.createdAt || 0
        ).getTime();

        const dateB = new Date(
          b.date || b.createdAt || 0
        ).getTime();

        return dateB - dateA;
      })
      .slice(0, 5);
  }, [transactions]);

  const cards = [
    {
      title: "Total Income",
      amount: summary?.totalIncome ?? 0,
      description: "Money received",
      icon: TrendingUp,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      amountColor: "text-emerald-600",
      accent: "bg-emerald-500",
    },
    {
      title: "Total Expenses",
      amount: summary?.totalExpenses ?? 0,
      description: "Money spent",
      icon: TrendingDown,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
      amountColor: "text-rose-600",
      accent: "bg-rose-500",
    },
    {
      title: "Current Balance",
      amount: summary?.balance ?? 0,
      description: "Your available balance",
      icon: Wallet,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
      amountColor: "text-slate-900",
      accent: "bg-indigo-500",
    },
    {
      title: "Transactions",
      amount: summary?.transactionCount ?? 0,
      description: "Recorded transactions",
      icon: ReceiptText,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
      amountColor: "text-slate-900",
      accent: "bg-violet-500",
      isCount: true,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 sm:space-y-8">

      {/* Page heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-600">
            <span className="h-2 w-2 rounded-full bg-indigo-600" />
            Financial overview
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Track your income, monitor expenses, and stay in control of your money.
          </p>
        </div>

        <Link
          to="/transactions"
          className="inline-flex w-fit shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700 sm:px-5"
        >
          <CircleDollarSign size={18} />
          Manage transactions
          <ArrowRight size={16} />
        </Link>
      </section>

      {/* Summary loading */}
      {loading && (
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
          <RefreshCw
            size={18}
            className="animate-spin text-indigo-600"
          />
          Refreshing your financial summary...
        </div>
      )}

      {/* Summary error */}
      {error && (
        <div className="flex flex-col justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 sm:flex-row sm:items-center">
          <p className="text-sm text-rose-700">{error}</p>

          <button
            type="button"
            onClick={() => dispatch(fetchDashboardSummary())}
            className="inline-flex items-center gap-2 self-start rounded-lg border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
          >
            <RefreshCw size={15} />
            Try again
          </button>
        </div>
      )}

      {/* Financial summary */}
      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Your finances
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              A snapshot of your financial activity
            </p>
          </div>

          <span className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 sm:inline-flex">
            <CalendarDays size={14} />
            All time
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.title}
                className="relative min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md sm:p-5"
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1 ${card.accent}`}
                />

                {/* Title and icon occupy their own row */}
                <div className="flex items-center justify-between gap-3">
                  <p className="min-w-0 text-sm font-medium text-slate-500">
                    {card.title}
                  </p>

                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${card.iconBg} ${card.iconColor} sm:h-11 sm:w-11`}
                  >
                    <Icon size={22} strokeWidth={2} />
                  </div>
                </div>

                {/* Full-width amount prevents currency wrapping */}
                <p
                  className={`mt-4 min-w-0 whitespace-nowrap text-[clamp(1.1rem,2vw,1.8rem)] font-bold leading-tight tracking-tight ${card.amountColor}`}
                >
                  {card.isCount
                    ? Number(card.amount).toLocaleString("en-IN")
                    : formatCurrency(card.amount)}
                </p>

                <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4">
                  {card.isCount ? (
                    <ReceiptText
                      size={15}
                      className="shrink-0 text-slate-400"
                    />
                  ) : (
                    <ArrowUpRight
                      size={15}
                      className="shrink-0 text-slate-400"
                    />
                  )}

                  <p className="text-xs text-slate-500">
                    {card.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Recent transactions */}
      <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 px-4 py-5 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Recent transactions
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Your latest financial activity
            </p>
          </div>

          <Link
            to="/transactions"
            className="inline-flex w-fit items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
          >
            View all
            <ArrowRight size={16} />
          </Link>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="flex flex-col items-center px-5 py-12 text-center sm:py-14">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <ReceiptText size={27} />
            </div>

            <h3 className="mt-4 text-base font-semibold text-slate-800">
              No transactions yet
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Your recent income and expenses will appear here when you add transactions.
            </p>

            <Link
              to="/transactions"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Add a transaction
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentTransactions.map((transaction) => {
              const isIncome =
                String(transaction.type).toLowerCase() === "income";

              const amount = Number(transaction.amount) || 0;
              const Icon = isIncome ? ArrowDownRight : ArrowUpRight;

              return (
                <div
                  key={transaction._id || transaction.id}
                  className="flex min-w-0 items-center justify-between gap-3 px-4 py-4 transition hover:bg-slate-50/80 sm:px-6"
                >
                  <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${
                        isIncome
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      <Icon size={21} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800 sm:text-base">
                        {getTransactionTitle(transaction)}
                      </p>

                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                        <span>
                          {transaction.category || "Uncategorized"}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span>
                          {formatDate(
                            transaction.date || transaction.createdAt
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p
                      className={`whitespace-nowrap text-xs font-bold sm:text-base ${
                        isIncome
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }`}
                    >
                      {isIncome ? "+" : "-"}
                      {formatCurrency(amount)}
                    </p>

                    <span
                      className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                        isIncome
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {transaction.type || "expense"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-4 sm:px-6">
          <Link
            to="/transactions"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-indigo-600"
          >
            Manage all transactions
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Helpful footer */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-5 text-white shadow-lg shadow-indigo-600/10 sm:p-8">
        <div className="relative z-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-indigo-50">
              <Wallet size={14} />
              Better financial habits
            </div>

            <h2 className="text-xl font-bold sm:text-2xl">
              Stay on top of your finances
            </h2>

            <p className="mt-2 text-sm leading-6 text-indigo-100 sm:text-base">
              Keep your records organized, review your spending, and make informed decisions about your money.
            </p>
          </div>

          <Link
            to="/transactions"
            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
          >
            Manage finances
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full border-[35px] border-white/10" />
        <div className="pointer-events-none absolute -bottom-24 right-36 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
      </section>
    </div>
  );
}
