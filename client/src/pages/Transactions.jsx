import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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

const Transactions = () => {
  const dispatch = useDispatch();

  const { transactions, loading, error } = useSelector(
    (state) => state.transactions
  );

  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  // Search and filter states
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("");

  // Fetch transactions when the page loads
  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  // Handle form inputs
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add or update a transaction
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

    let result;

    if (editingId) {
      result = await dispatch(
        updateTransaction({
          id: editingId,
          transactionData,
        })
      );
    } else {
      result = await dispatch(createTransaction(transactionData));
    }

    // Reset the form only when the API operation succeeds
    if (
      createTransaction.fulfilled.match(result) ||
      updateTransaction.fulfilled.match(result)
    ) {
      setFormData(initialForm);
      setEditingId(null);
    }
  };

  // Load a transaction into the form for editing
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

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(initialForm);
  };

  // Delete a transaction
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      dispatch(deleteTransaction(id));
    }
  };

  // Search and filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const searchText = search.trim().toLowerCase();

    const matchesSearch =
      (transaction.category || "").toLowerCase().includes(searchText) ||
      (transaction.description || "").toLowerCase().includes(searchText);

    const matchesType =
      typeFilter === "all" || transaction.type === typeFilter;

    // Use the date's YYYY-MM prefix to compare against the selected month.
    const transactionMonth = transaction.date
      ? transaction.date.slice(0, 7)
      : "";

    const matchesMonth =
      !monthFilter || transactionMonth === monthFilter;

    return matchesSearch && matchesType && matchesMonth;
  });

  // Clear all filters
  const handleClearFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setMonthFilter("");
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Transactions
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your income and expenses.
        </p>
      </div>

      {/* Add / Edit Transaction Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-slate-800">
          {editingId ? "Edit Transaction" : "Add New Transaction"}
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Transaction Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Amount (₹)
            </label>
            <input
              type="number"
              name="amount"
              placeholder="Enter amount"
              min="0.01"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Category
            </label>
            <input
              type="text"
              name="category"
              placeholder="e.g. Food, Salary, Travel"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Description
            </label>
            <input
              type="text"
              name="description"
              placeholder="Add a note (optional)"
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : editingId
                ? "Update Transaction"
                : "Add Transaction"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="rounded-lg border border-slate-300 px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Search and Filters */}
      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">
          Search and Filter
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input
            type="search"
            placeholder="Search category or description..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="min-w-0 rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500"
          />

          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500"
          >
            <option value="all">All transactions</option>
            <option value="income">Income only</option>
            <option value="expense">Expenses only</option>
          </select>

          <input
            type="month"
            value={monthFilter}
            onChange={(event) => setMonthFilter(event.target.value)}
            aria-label="Filter transactions by month"
            className="rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500"
          />

          <button
            type="button"
            onClick={handleClearFilters}
            className="rounded-lg border border-slate-300 px-4 py-2.5 font-medium text-slate-700 hover:bg-slate-50"
          >
            Clear Filters
          </button>
        </div>

        <p className="text-sm text-slate-500">
          Showing {filteredTransactions.length} of {transactions.length}{" "}
          transactions
        </p>
      </section>

      {/* Error Message */}
      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {/* Transaction List */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-800">
          Transaction History
        </h2>

        {loading && transactions.length === 0 && (
          <p className="py-6 text-center text-slate-500">
            Loading transactions...
          </p>
        )}

        {!loading && filteredTransactions.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <p className="font-medium text-slate-700">
              No transactions found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or filters.
            </p>
          </div>
        )}

        {filteredTransactions.map((transaction) => (
          <div
            key={transaction._id}
            className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-800">
                {transaction.category}
              </h3>

              <p className="mt-1 break-words text-sm text-slate-500">
                {transaction.description || "No description"}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {transaction.date
                  ? new Date(transaction.date).toLocaleDateString()
                  : "No date"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:justify-end">
              <p
                className={`font-bold ${
                  transaction.type === "income"
                    ? "text-emerald-600"
                    : "text-rose-600"
                }`}
              >
                {transaction.type === "income" ? "+" : "-"}₹
                {Number(transaction.amount).toLocaleString("en-IN")}
              </p>

              <button
                type="button"
                onClick={() => handleEdit(transaction)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => handleDelete(transaction._id)}
                className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Transactions;