import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice.js";
import transactionReducer from "./slices/transactionSlice.js";
import dashboardReducer from "./slices/dashboardSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionReducer,
    dashboard: dashboardReducer,
  },
});

export default store;
