import React from "react";
import Navbar from "./components/shared/Navbar";
import AppRouter from "./routes/AppRouter";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-gray-900">
      <Navbar />
      <div className="p-6">
        <AppRouter />
      </div>
    </div>
  );
}

export default App;
