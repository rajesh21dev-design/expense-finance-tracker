
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ReceiptText,
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

  if (loading) {
    return <p className="p-6 text-slate-500">Loading dashboard...</p>;
  }

  if (error) {
    return (
      <div className="m-6 rounded-lg bg-rose-50 p-4 text-rose-700">
        {error}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Financial Dashboard
          </h1>

          <p className="mt-2 text-slate-500">
            Track your income, expenses, and balance in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Total Income"
            amount={summary.totalIncome}
            icon={<TrendingUp size={20} />}
            color="green"
          />

          <SummaryCard
            title="Total Expenses"
            amount={summary.totalExpenses}
            icon={<TrendingDown size={20} />}
            color="red"
          />

          <SummaryCard
            title="Current Balance"
            amount={summary.balance}
            icon={<Wallet size={20} />}
            color="blue"
          />

          <SummaryCard
            title="Transactions"
            amount={summary.transactionCount}
            icon={<ReceiptText size={20} />}
            color="purple"
            isCurrency={false}
          />
        </div>
      </div>
    </main>
  );
}
