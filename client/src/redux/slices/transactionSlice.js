import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3000/api/transactions";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get all transactions
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL, getAuthConfig());

      return response.data.transactions;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch transactions"
      );
    }
  }
);

// Create transaction
export const createTransaction = createAsyncThunk(
  "transactions/createTransaction",
  async (transactionData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        API_URL,
        transactionData,
        getAuthConfig()
      );

      return response.data.transaction;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create transaction"
      );
    }
  }
);

// Update transaction
export const updateTransaction = createAsyncThunk(
  "transactions/updateTransaction",
  async ({ id, transactionData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/${id}`,
        transactionData,
        getAuthConfig()
      );

      return response.data.transaction;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update transaction"
      );
    }
  }
);

// Delete transaction
export const deleteTransaction = createAsyncThunk(
  "transactions/deleteTransaction",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`, getAuthConfig());

      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete transaction"
      );
    }
  }
);

const transactionSlice = createSlice({
  name: "transactions",

  initialState: {
    transactions: [],
    loading: false,
    error: null,
  },

  reducers: {
    clearTransactionError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Fetch
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })

      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions.unshift(action.payload);
      })

      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.transactions.findIndex(
          (transaction) => transaction._id === action.payload._id
        );

        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      })

      .addCase(updateTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.loading = false;

        state.transactions = state.transactions.filter(
          (transaction) => transaction._id !== action.payload
        );
      })

      .addCase(deleteTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTransactionError } = transactionSlice.actions;

export default transactionSlice.reducer;