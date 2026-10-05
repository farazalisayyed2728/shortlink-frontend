import React, { useCallback, useState, useEffect } from "react";
import { Plus, Link as LinkIcon, LogOut } from "lucide-react";
import { api } from "./api/client";
import { useAuth } from "./context/useAuth";
import type {
  ShortURL,
  OverviewMetrics,
  PaginatedResponse,
} from "./types/api";
import { MetricCards } from "./components/MetricCards";
import { LinkTable } from "./components/LinkTable";
import { CreateLinkModal } from "./components/CreateLinkModal";
import { AnalyticsDrawer } from "./components/AnalyticsDrawer";

const DashboardContent: React.FC = () => {
  const { isAuthenticated, userEmail, login, register, logout } = useAuth();

  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);
  const [links, setLinks] = useState<ShortURL[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inspectCode, setInspectCode] = useState<string | null>(null);

  // Auth form states
  const [authEmail, setAuthEmail] = useState("");
  const [authPass, setAuthPass] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async (page = 1) => {
    if (!isAuthenticated) return;
    try {
      const [overviewRes, linksRes] = await Promise.all([
        api.get<OverviewMetrics>("/api/analytics/overview/"),
        api.get<PaginatedResponse<ShortURL>>(`/api/urls/?page=${page}&page_size=10`),
      ]);
      setMetrics(overviewRes.data);
      setLinks(linksRes.data.results);
      setTotalPages(linksRes.data.total_pages);
      setCurrentPage(linksRes.data.current_page);
    } catch (err) {
      console.error("Dashboard fetch failed:", err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // This effect synchronizes dashboard data with the authenticated session.
    // oxlint-disable-next-line react/set-state-in-effect
    void fetchDashboardData(currentPage);
  }, [fetchDashboardData, currentPage]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") {
        void fetchDashboardData(currentPage);
      }
    };

    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () =>
      document.removeEventListener("visibilitychange", refreshWhenVisible);
  }, [currentPage, fetchDashboardData, isAuthenticated]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      if (isRegistering) {
        await register(authEmail, authPass);
      } else {
        await login(authEmail, authPass);
      }
    } catch (err: any) {
      setAuthError(err.response?.data?.error?.message || "Authentication failed.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-blue-600 text-white rounded-lg">
              <LinkIcon className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">ShortLink Console</h1>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl">
                {authError}
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Email</label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Password</label>
              <input
                type="password"
                required
                value={authPass}
                onChange={(e) => setAuthPass(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 text-white font-medium text-sm rounded-xl hover:bg-blue-700 transition"
            >
              {isRegistering ? "Create Account" : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            {isRegistering ? "Already have an account?" : "Need an account?"}{" "}
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-blue-600 font-semibold hover:underline"
            >
              {isRegistering ? "Sign in" : "Register"}
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 text-white rounded-lg">
              <LinkIcon className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-900 tracking-tight text-lg">ShortLink</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-500 font-medium">{userEmail}</span>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              Create Link
            </button>
            <button onClick={logout} className="p-2 text-slate-400 hover:text-slate-600" title="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <MetricCards metrics={metrics} />
        <LinkTable
          links={links}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
          onOpenAnalytics={(code) => setInspectCode(code)}
          onDeleteLink={() => fetchDashboardData(currentPage)}
        />
      </main>

      <CreateLinkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLinkCreated={() => fetchDashboardData(1)}
      />

      <AnalyticsDrawer shortCode={inspectCode} onClose={() => setInspectCode(null)} />
    </div>
  );
};

export default function App() {
  return <DashboardContent />;
}