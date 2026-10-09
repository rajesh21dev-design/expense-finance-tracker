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

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.amount || !formData.category || !formData.date) {
      return;
    }

    if (editingId) {
      await dispatch(
        updateTransaction({
          id: editingId,
          transactionData: {
            ...formData,
            amount: Number(formData.amount),
          },
        })
      );

      setEditingId(null);
    } else {
      await dispatch(
        createTransaction({
          ...formData,
          amount: Number(formData.amount),
        })
      );
    }

    setFormData(initialForm);
  };

  const handleEdit = (transaction) => {
    setEditingId(transaction._id);

    setFormData({
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.category,
      description: transaction.description || "",
      date: transaction.date.split("T")[0],
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      dispatch(deleteTransaction(id));
    }
  };

  return (
    <div>
      <h1>Transactions</h1>

      <form onSubmit={handleSubmit}>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
        />

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {editingId ? "Update Transaction" : "Add Transaction"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setFormData(initialForm);
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {error && <p>{error}</p>}

      {loading && <p>Loading...</p>}

      <div>
        {transactions.map((transaction) => (
          <div key={transaction._id}>
            <h3>{transaction.category}</h3>

            <p>
              {transaction.type === "income" ? "+" : "-"} ₹
              {transaction.amount}
            </p>

            <p>{transaction.description}</p>

            <p>{new Date(transaction.date).toLocaleDateString()}</p>

            <button onClick={() => handleEdit(transaction)}>
              Edit
            </button>

            <button onClick={() => handleDelete(transaction._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Transactions;