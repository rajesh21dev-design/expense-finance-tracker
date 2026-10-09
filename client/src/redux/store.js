import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import transactionReducer from "./slices/transactionSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionReducer,
  },
});

export default store;