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
  Tag,
  Pencil,
  Trash2,
  X,
  RotateCcw,
  TrendingUp,
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
  }).format(amount || 0);

const formatDate = (date) => {
  if (!date) return "No date";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100";

const labelClass =
  "mb-2 block text-sm font-semibold text-slate-700";

const Transactions = () => {
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

  const totals = useMemo(() => {
    return safeTransactions.reduce(
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
    );
  }, [safeTransactions]);

  const balance = totals.income - totals.expenses;

  const filteredTransactions = useMemo(() => {
    return safeTransactions.filter((transaction) => {
      const searchText = search.trim().toLowerCase();

      const matchesSearch =
        (transaction.category || "")
          .toLowerCase()
          .includes(searchText) ||
        (transaction.description || "")
          .toLowerCase()
          .includes(searchText);

      const matchesType =
        typeFilter === "all" ||
        transaction.type === typeFilter;

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
      date: transaction.date
        ? transaction.date.slice(0, 10)
        : "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(initialForm);
  };

  const handleDelete = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this transaction?"
      )
    ) {
      dispatch(deleteTransaction(id));
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setMonthFilter("");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto w-full max-w-[1600px] space-y-7 p-4 sm:p-6 lg:p-8">
        {/* Page heading */}
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-violet-600">
              <span className="h-2 w-2 rounded-full bg-violet-600" />
              Personal Finance
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Transactions
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Track your income and expenses in one place.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              handleCancelEdit();
              document
                .getElementById("transaction-form")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
          >
            <Plus size={18} />
            Add transaction
          </button>
        </header>

        {/* Summary cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <SummaryCard
            title="Total Income"
            amount={totals.income}
            icon={ArrowDownLeft}
            iconClass="bg-emerald-50 text-emerald-600"
            description="Money received"
          />

          <SummaryCard
            title="Total Expenses"
            amount={totals.expenses}
            icon={ArrowUpRight}
            iconClass="bg-rose-50 text-rose-600"
            description="Money spent"
          />

          <SummaryCard
            title="Net Balance"
            amount={balance}
            icon={Wallet}
            iconClass="bg-violet-50 text-violet-600"
            description="Income minus expenses"
            amountClass={
              balance < 0 ? "text-rose-600" : "text-slate-900"
            }
          />
        </section>

        {/* Add / Edit form */}
        <section
          id="transaction-form"
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5 sm:px-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              {editingId ? <Pencil size={21} /> : <ReceiptText size={21} />}
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {editingId ? "Edit transaction" : "New transaction"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {editingId
                  ? "Update the details below."
                  : "Enter the details of your income or expense."}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-7">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              <div>
                <label className={labelClass}>
                  Transaction type
                </label>

                <select
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

              <div>
                <label className={labelClass}>
                  Amount (₹)
                </label>

                <input
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

              <div>
                <label className={labelClass}>Category</label>

                <input
                  type="text"
                  name="category"
                  placeholder="e.g. Food, Salary, Travel"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Date</label>

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>
                  Description
                  <span className="ml-1 font-normal text-slate-400">
                    (optional)
                  </span>
                </label>

                <input
                  type="text"
                  name="description"
                  placeholder="What was this transaction for?"
                  value={formData.description}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {editingId ? <Pencil size={17} /> : <Plus size={18} />}
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
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  <X size={17} />
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Search and filters */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Transaction history
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Search and filter your records.
              </p>
            </div>

            <span className="w-fit rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
              {filteredTransactions.length} of {safeTransactions.length} records
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                placeholder="Search transactions..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className={`${inputClass} pl-10`}
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

            <div className="relative">
              <CalendarDays
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="month"
                value={monthFilter}
                onChange={(event) => setMonthFilter(event.target.value)}
                className={`${inputClass} pl-10`}
                aria-label="Filter by month"
              />
            </div>

            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
            >
              <RotateCcw size={16} />
              Clear filters
            </button>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700"
            >
              {typeof error === "string"
                ? error
                : error.message || "Something went wrong. Please try again."}
            </div>
          )}

          {/* Transaction list */}
          <div className="mt-6 space-y-3">
            {loading && safeTransactions.length === 0 && (
              <div className="py-12 text-center text-sm text-slate-500">
                Loading your transactions...
              </div>
            )}

            {!loading && filteredTransactions.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                  <ReceiptText size={25} />
                </div>

                <h3 className="mt-4 font-bold text-slate-800">
                  No transactions found
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Try another search or clear your filters.
                </p>

                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-4 text-sm font-semibold text-violet-600 hover:text-violet-700"
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
                  className="group flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 transition hover:border-violet-200 hover:shadow-md sm:flex-row sm:items-center sm:gap-5 sm:p-5"
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                      isIncome
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-rose-50 text-rose-600"
                    }`}
                  >
                    {isIncome ? (
                      <ArrowDownLeft size={23} />
                    ) : (
                      <ArrowUpRight size={23} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-slate-900">
                        {transaction.category}
                      </h3>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
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

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays size={13} />
                        {formatDate(transaction.date)}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <Tag size={13} />
                        {transaction.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 sm:justify-end sm:border-0 sm:pt-0">
                    <p
                      className={`text-lg font-bold tabular-nums ${
                        isIncome ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {isIncome ? "+" : "−"}
                      {formatCurrency(Number(transaction.amount) || 0)}
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(transaction)}
                        aria-label={`Edit ${transaction.category}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(transaction._id)}
                        aria-label={`Delete ${transaction.category}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <footer className="flex flex-col justify-between gap-2 border-t border-slate-200 py-4 text-xs text-slate-400 sm:flex-row">
          <span>Personal Finance Tracker</span>
          <span className="inline-flex items-center gap-1.5">
            <TrendingUp size={14} />
            Stay on top of your finances
          </span>
        </footer>
      </main>
    </div>
  );
};

const SummaryCard = ({
  title,
  amount,
  icon: Icon,
  iconClass,
  description,
  amountClass = "text-slate-900",
}) => (
  <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p
          className={`mt-3 break-words text-2xl font-bold tracking-tight sm:text-3xl ${amountClass}`}
        >
          {formatCurrency(amount)}
        </p>
        <p className="mt-2 text-xs text-slate-400">{description}</p>
      </div>

      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconClass}`}
      >
        <Icon size={23} />
      </div>
    </div>
  </article>
);

export default Transactions;
