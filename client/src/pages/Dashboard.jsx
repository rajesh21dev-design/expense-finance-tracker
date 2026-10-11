import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ReceiptText,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

import { fetchDashboardSummary } from "../redux/slices/dashboardSlice.js";
import SummaryCard from "../components/dashboard/SummaryCard.jsx";

export default function Dashboard() {
  const dispatch = useDispatch();

  const { summary, loading, error } = useSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    dispatch(fetchDashboardSummary());
  }, [dispatch]);

  const cards = [
    {
      title: "Total Income",
      amount: summary?.totalIncome ?? 0,
      icon: TrendingUp,
      color: "green",
      description: "Your total earnings",
      trendIcon: ArrowUpRight,
    },
    {
      title: "Total Expenses",
      amount: summary?.totalExpenses ?? 0,
      icon: TrendingDown,
      color: "red",
      description: "Your total spending",
      trendIcon: ArrowDownRight,
    },
    {
      title: "Current Balance",
      amount: summary?.balance ?? 0,
      icon: Wallet,
      color: "blue",
      description: "Your available balance",
      trendIcon: Wallet,
    },
    {
      title: "Transactions",
      amount: summary?.transactionCount ?? 0,
      icon: ReceiptText,
      color: "purple",
      description: "All recorded transactions",
      trendIcon: ReceiptText,
      isCurrency: false,
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <p className="text-sm font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-700">
        <h2 className="font-semibold">Unable to load dashboard</h2>
        <p className="mt-1 text-sm">{error}</p>
        <button
          type="button"
          onClick={() => dispatch(fetchDashboardSummary())}
          className="mt-4 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {/* Page heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
            Overview
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Financial Dashboard
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
            Track your income, expenses, and balance in one place.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:self-auto">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span className="text-sm font-medium text-slate-600">
            Financial overview
          </span>
        </div>
      </section>

      {/* Summary cards */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800 sm:text-lg">
            Your Summary
          </h2>

          <span className="text-xs font-medium text-slate-400 sm:text-sm">
            All transactions
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 2xl:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;
            const TrendIcon = card.trendIcon;

            const styles = {
              green: {
                icon: "bg-emerald-50 text-emerald-600",
                accent: "bg-emerald-500",
              },
              red: {
                icon: "bg-rose-50 text-rose-600",
                accent: "bg-rose-500",
              },
              blue: {
                icon: "bg-blue-50 text-blue-600",
                accent: "bg-blue-500",
              },
              purple: {
                icon: "bg-violet-50 text-violet-600",
                accent: "bg-violet-500",
              },
            };

            const style = styles[card.color];

            return (
              <div
                key={card.title}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg sm:p-6"
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1 ${style.accent}`}
                />

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {card.title}
                    </p>

                    <p className="mt-4 break-words text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                      {card.isCurrency
                        ? new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                            maximumFractionDigits: 2,
                          }).format(Number(card.amount) || 0)
                        : new Intl.NumberFormat("en-IN").format(
                            Number(card.amount) || 0
                          )}
                    </p>
                  </div>

                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${style.icon}`}
                  >
                    <Icon size={23} strokeWidth={2} />
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 border-t border-slate-100 pt-4">
                  <TrendIcon size={16} className="text-slate-400" />
                  <p className="text-xs font-medium text-slate-500 sm:text-sm">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Informational section */}
      <section className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-white p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
            <Wallet size={24} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Stay on top of your finances
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Keep your income and expenses organized. Visit Transactions
              to add records, update existing entries, or review your
              spending history.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
