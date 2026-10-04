import { useEffect, useState } from "react";

import api from "./api/client";
import AuthForm from "./components/AuthForm";
import MetricCards from "./components/MetricCards";
import { useAuth } from "./context/AuthContext";

function App() {
  const { isAuthenticated, userEmail, logout } = useAuth();

  const [backendConnected, setBackendConnected] = useState(false);

  const [totalLinks, setTotalLinks] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);

  useEffect(() => {
    api
      .get("/health/")
      .then((response) => {
        console.log("Backend response:", response.data);
        setBackendConnected(true);
      })
      .catch((error) => {
        console.error("Backend error:", error);
        setBackendConnected(false);
      });
  }, []);

  // Backend is not connected
  if (!backendConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">
            ShortLink Analytics
          </h1>

          <p className="mt-4 text-lg text-slate-300">
            Checking backend...
          </p>
        </div>
      </div>
    );
  }

  // User is not logged in
  if (!isAuthenticated) {
    return <AuthForm />;
  }

  // User is logged in
  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="bg-slate-950 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-xl font-bold text-white">
            ShortLink Analytics
          </h1>

          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-300">
              {userEmail}
            </span>

            <button
              onClick={logout}
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-200"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="text-3xl font-bold text-slate-900">
          Dashboard
        </h2>

        <p className="mt-2 text-slate-600">
          Welcome back, {userEmail}.
        </p>

        {/* Metric Cards */}
        <div className="mt-8">
          <MetricCards
            totalLinks={totalLinks}
            totalClicks={totalClicks}
          />
        </div>

        {/* Backend Status */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">
            Backend Status
          </h3>

          <p className="mt-2 text-green-600">
            Backend connected successfully ✅
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
