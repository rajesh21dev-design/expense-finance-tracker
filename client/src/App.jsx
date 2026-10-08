import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div>
            <h1 className="bg-red-300">Expense Finance Tracker</h1>
            <p>Frontend application is running.</p>
          </div>
        }
      />
    </Routes>
  );
}

export default App;