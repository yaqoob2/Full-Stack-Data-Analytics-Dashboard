import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import DisputesPage from "./pages/DisputesPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/disputes" element={<DisputesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
