import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  ReceiptText,
  Search,
  Plus,
  CalendarDays,
  Pencil,
  Trash2,
  X,
  RotateCcw,
  TrendingUp,
  CircleDollarSign,
  ArrowRight,
} from "lucide-react";

import {
  createTransaction,
  deleteTransaction,
  fetchTransactions,
  updateTransaction,
} from "../redux/slices/transactionSlice";

const initialForm = {
  type: "expense",
  amount: "",
  category: "",
  description: "",
  date: "",
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const formatDate = (date) => {
  if (!date) return "No date";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "No date";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const inputClass =
  "w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

const labelClass = "mb-1.5 block text-sm font-semibold text-slate-700";

export default function Transactions() {
  const dispatch = useDispatch();

  const { transactions, loading, error } = useSelector(
    (state) => state.transactions
  );

  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("");

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const safeTransactions = Array.isArray(transactions)
    ? transactions
    : [];

  const totals = useMemo(
    () =>
      safeTransactions.reduce(
        (result, transaction) => {
          const amount = Number(transaction.amount) || 0;

          if (transaction.type === "income") {
            result.income += amount;
          } else {
            result.expenses += amount;
          }

          return result;
        },
        { income: 0, expenses: 0 }
      ),
    [safeTransactions]
  );

  const balance = totals.income - totals.expenses;

  const filteredTransactions = useMemo(() => {
    return safeTransactions.filter((transaction) => {
      const searchText = search.trim().toLowerCase();

      const matchesSearch =
        (transaction.category || "").toLowerCase().includes(searchText) ||
        (transaction.description || "").toLowerCase().includes(searchText);

      const matchesType =
        typeFilter === "all" || transaction.type === typeFilter;

      const transactionMonth = transaction.date
        ? transaction.date.slice(0, 7)
        : "";

      const matchesMonth =
        !monthFilter || transactionMonth === monthFilter;

      return matchesSearch && matchesType && matchesMonth;
    });
  }, [safeTransactions, search, typeFilter, monthFilter]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.amount ||
      Number(formData.amount) <= 0 ||
      !formData.category.trim() ||
      !formData.date
    ) {
      return;
    }

    const transactionData = {
      ...formData,
      amount: Number(formData.amount),
      category: formData.category.trim(),
      description: formData.description.trim(),
    };

    const result = editingId
      ? await dispatch(
          updateTransaction({
            id: editingId,
            transactionData,
          })
        )
      : await dispatch(createTransaction(transactionData));

    if (
      createTransaction.fulfilled.match(result) ||
      updateTransaction.fulfilled.match(result)
    ) {
      setFormData(initialForm);
      setEditingId(null);
    }
  };

  const handleEdit = (transaction) => {
    setEditingId(transaction._id);

    setFormData({
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.category,
      description: transaction.description || "",
      date: transaction.date ? transaction.date.slice(0, 10) : "",
    });

    document
      .getElementById("transaction-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(initialForm);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      dispatch(deleteTransaction(id));
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setMonthFilter("");
  };

  const handleAddTransaction = () => {
    handleCancelEdit();

    document
      .getElementById("transaction-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-full bg-slate-50 text-slate-900">
      <main className="mx-auto w-full max-w-[1600px] space-y-5 p-4 sm:p-5 lg:p-6">
        {/* Page heading */}
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              <span className="h-2 w-2 rounded-full bg-indigo-600" />
              PERSONAL FINANCE
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Transactions
            </h1>

            <p className="mt-1.5 max-w-2xl text-sm leading-5 text-slate-500 sm:text-base">
              Manage your income and expenses, and keep track of where your
              money goes.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddTransaction}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <Plus size={18} />
            Add transaction
          </button>
        </header>

        {/* Summary cards */}
        <section className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <SummaryCard
            title="Total Income"
            amount={totals.income}
            icon={ArrowDownLeft}
            iconClass="bg-emerald-50 text-emerald-600"
            description="Money received"
            accent="bg-emerald-500"
          />

          <SummaryCard
            title="Total Expenses"
            amount={totals.expenses}
            icon={ArrowUpRight}
            iconClass="bg-rose-50 text-rose-600"
            description="Money spent"
            accent="bg-rose-500"
          />

          <SummaryCard
            title="Net Balance"
            amount={balance}
            icon={Wallet}
            iconClass="bg-indigo-50 text-indigo-600"
            description="Income minus expenses"
            amountClass={balance < 0 ? "text-rose-600" : "text-slate-900"}
            accent="bg-indigo-500"
          />
        </section>

        {/* Add / edit form */}
        <section
          id="transaction-form"
          className="scroll-mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                {editingId ? (
                  <Pencil size={19} />
                ) : (
                  <CircleDollarSign size={21} />
                )}
              </div>

              <div className="min-w-0">
                <h2 className="font-bold text-slate-900">
                  {editingId ? "Edit transaction" : "New transaction"}
                </h2>
                <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                  {editingId
                    ? "Update your transaction details."
                    : "Add an income or expense to your records."}
                </p>
              </div>
            </div>

            {editingId && (
              <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                Editing
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-5">
            <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div className="min-w-0">
                <label className={labelClass} htmlFor="transaction-type">
                  Transaction type
                </label>
                <select
                  id="transaction-type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              <div className="min-w-0">
                <label className={labelClass} htmlFor="transaction-amount">
                  Amount (₹)
                </label>
                <input
                  id="transaction-amount"
                  type="number"
                  name="amount"
                  placeholder="e.g. 2500"
                  min="0.01"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              <div className="min-w-0">
                <label className={labelClass} htmlFor="transaction-category">
                  Category
                </label>
                <input
                  id="transaction-category"
                  type="text"
                  name="category"
                  placeholder="Food, Salary, Travel..."
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              <div className="min-w-0">
                <label className={labelClass} htmlFor="transaction-date">
                  Date
                </label>
                <input
                  id="transaction-date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              <div className="min-w-0 md:col-span-2">
                <label
                  className={labelClass}
                  htmlFor="transaction-description"
                >
                  Description{" "}
                  <span className="font-normal text-slate-400">
                    (optional)
                  </span>
                </label>
                <input
                  id="transaction-description"
                  type="text"
                  name="description"
                  placeholder="What was this transaction for?"
                  value={formData.description}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2.5 border-t border-slate-100 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {editingId ? <Pencil size={16} /> : <Plus size={17} />}
                {loading
                  ? "Please wait..."
                  : editingId
                    ? "Update transaction"
                    : "Save transaction"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  <X size={16} />
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Search and transaction history */}
        <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:px-5">
            <div>
              <h2 className="font-bold text-slate-900">
                Transaction history
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Find and manage your financial records.
              </p>
            </div>

            <span className="w-fit rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
              {filteredTransactions.length} of {safeTransactions.length} records
            </span>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-3 p-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="relative min-w-0">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                placeholder="Search transactions..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className={`${inputClass} pl-9`}
                aria-label="Search category or description"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className={inputClass}
              aria-label="Filter by transaction type"
            >
              <option value="all">All transactions</option>
              <option value="income">Income only</option>
              <option value="expense">Expenses only</option>
            </select>

            <div className="relative min-w-0">
              <CalendarDays
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="month"
                value={monthFilter}
                onChange={(event) => setMonthFilter(event.target.value)}
                className={`${inputClass} pl-9`}
                aria-label="Filter by month"
              />
            </div>

            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
            >
              <RotateCcw size={16} />
              Clear filters
            </button>
          </div>

          {error && (
            <div
              role="alert"
              className="mx-4 mb-4 rounded-lg border border-rose-100 bg-rose-50 p-3 text-sm text-rose-700 sm:mx-5"
            >
              {typeof error === "string"
                ? error
                : error.message || "Something went wrong. Please try again."}
            </div>
          )}

          <div className="space-y-3 px-4 pb-4 sm:px-5 sm:pb-5">
            {loading && safeTransactions.length === 0 && (
              <div className="rounded-xl border border-slate-100 bg-slate-50 py-10 text-center">
                <ReceiptText
                  size={24}
                  className="mx-auto text-indigo-500"
                />
                <p className="mt-3 text-sm text-slate-600">
                  Loading your transactions...
                </p>
              </div>
            )}

            {!loading && filteredTransactions.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center">
                <ReceiptText
                  size={27}
                  className="mx-auto text-slate-400"
                />

                <h3 className="mt-3 font-bold text-slate-800">
                  No transactions found
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Try another search or clear your filters.
                </p>

                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-3 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {filteredTransactions.map((transaction) => {
              const isIncome = transaction.type === "income";

              return (
                <article
                  key={transaction._id}
                  className="flex min-w-0 flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3.5 transition hover:border-indigo-200 hover:shadow-sm sm:flex-row sm:items-center sm:gap-4 sm:p-4"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                      isIncome
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-rose-50 text-rose-600"
                    }`}
                  >
                    {isIncome ? (
                      <ArrowDownLeft size={21} />
                    ) : (
                      <ArrowUpRight size={21} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="break-words text-sm font-bold text-slate-900">
                        {transaction.category}
                      </h3>

                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide ${
                          isIncome
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {isIncome ? "INCOME" : "EXPENSE"}
                      </span>
                    </div>

                    <p className="mt-1 break-words text-sm text-slate-500">
                      {transaction.description || "No description added"}
                    </p>

                    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400">
                      <CalendarDays size={13} />
                      {formatDate(transaction.date)}
                    </div>
                  </div>

                  <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 sm:ml-auto sm:min-w-[175px] sm:justify-end sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
                    <p
                      className={`whitespace-nowrap text-base font-bold tabular-nums ${
                        isIncome ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {isIncome ? "+" : "−"}
                      {formatCurrency(transaction.amount)}
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(transaction)}
                        aria-label={`Edit ${transaction.category}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                      >
                        <Pencil size={13} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(transaction._id)}
                        aria-label={`Delete ${transaction.category}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-semibold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {filteredTransactions.length > 0 && (
            <div className="flex flex-col justify-between gap-2 border-t border-slate-100 bg-slate-50/70 px-4 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:px-5">
              <span>
                Showing {filteredTransactions.length} transaction
                {filteredTransactions.length !== 1 ? "s" : ""}
              </span>

              <button
                type="button"
                onClick={handleAddTransaction}
                className="inline-flex items-center gap-1.5 font-semibold text-indigo-600 transition hover:text-indigo-700"
              >
                Add another transaction
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </section>

        <footer className="flex flex-col justify-between gap-2 border-t border-slate-200 py-3 text-xs text-slate-400 sm:flex-row">
          <span>Personal Finance Tracker</span>
          <span className="inline-flex items-center gap-1.5">
            <TrendingUp size={14} />
            Stay on top of your finances
          </span>
        </footer>
      </main>
    </div>
  );
}

function SummaryCard({
  title,
  amount,
  icon: Icon,
  iconClass,
  description,
  amountClass = "text-slate-900",
  accent,
}) {
  return (
    <article className="relative min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className={`absolute inset-x-0 top-0 h-1 ${accent}`} />

      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <p
            className={`mt-3 whitespace-nowrap text-lg font-bold tracking-tight tabular-nums sm:text-xl ${amountClass}`}
          >
            {formatCurrency(amount)}
          </p>

          <p className="mt-2 text-xs text-slate-400">{description}</p>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
        >
          <Icon size={21} />
        </div>
      </div>
    </article>
  );
}
