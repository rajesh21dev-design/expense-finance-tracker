import { Routes, Route } from "react-router-dom";

import Transactions from "./pages/Transactions";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div>
            <h1>Expense Finance Tracker</h1>
            <p>Frontend application is running.</p>
          </div>
        }
      />

      <Route path="/transactions" element={<Transactions />} />
    </Routes>
  );
}

export default App;