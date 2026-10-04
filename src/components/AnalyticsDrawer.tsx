import React, { useEffect, useState } from "react";
import { X, Globe, Smartphone, Compass } from "lucide-react";
import { api } from "../api/client";
import type { URLAnalytics } from "../types/api";

export const AnalyticsDrawer: React.FC<{
  shortCode: string | null;
  onClose: () => void;
}> = ({ shortCode, onClose }) => {
  const [data, setData] = useState<URLAnalytics | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!shortCode) return;
    setLoading(true);
    api
      .get<URLAnalytics>(`/api/urls/${shortCode}/analytics/?days=30`)
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [shortCode]);

  if (!shortCode) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl p-6 overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Analytics: /{shortCode}</h2>
            <p className="text-xs text-slate-400 truncate max-w-sm mt-0.5">{data?.original_url}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="py-24 text-center text-slate-400">Loading telemetry data...</div>
        ) : data ? (
          <div className="py-6 space-y-6">
            {/* KPI Badges */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-center">
                <p className="text-xs uppercase text-slate-500 font-semibold">Total Clicks</p>
                <h4 className="text-2xl font-bold text-slate-900 mt-1">{data.total_clicks}</h4>
              </div>
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-center">
                <p className="text-xs uppercase text-slate-500 font-semibold">Today's Clicks</p>
                <h4 className="text-2xl font-bold text-blue-600 mt-1">{data.today_clicks}</h4>
              </div>
            </div>

            {/* Time-Series Clicks Histogram (SVG) */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-blue-600" />
                Clicks Over Time (Last 30 Days)
              </h3>
              {data.clicks_by_day.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No clicks recorded in this period.</p>
              ) : (
                <div className="h-40 flex items-end gap-2 pt-4">
                  {data.clicks_by_day.map((pt) => {
                    const maxClicks = Math.max(...data.clicks_by_day.map((p) => p.clicks), 1);
                    const heightPercent = (pt.clicks / maxClicks) * 100;
                    return (
                      <div key={pt.date} className="flex-1 flex flex-col items-center group relative">
                        <div
                          style={{ height: `${Math.max(heightPercent, 8)}%` }}
                          className="w-full bg-blue-500 hover:bg-blue-600 rounded-t transition"
                        />
                        <span className="text-[10px] text-slate-400 mt-2 truncate w-full text-center">
                          {pt.date.slice(5)}
                        </span>
                        <div className="absolute -top-7 hidden group-hover:block bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded shadow">
                          {pt.clicks}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Devices & Referrers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-slate-400" /> Devices
                </h4>
                <div className="space-y-2">
                  {Object.entries(data.devices).map(([dev, count]) => (
                    <div key={dev} className="flex justify-between text-xs">
                      <span className="capitalize text-slate-600">{dev}</span>
                      <span className="font-semibold text-slate-900">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-400" /> Top Referrers
                </h4>
                <div className="space-y-2">
                  {data.top_referrers.length === 0 ? (
                    <p className="text-xs text-slate-400">Direct traffic only</p>
                  ) : (
                    data.top_referrers.map((ref) => (
                      <div key={ref.referrer} className="flex justify-between text-xs">
                        <span className="truncate max-w-[140px] text-slate-600">{ref.referrer}</span>
                        <span className="font-semibold text-slate-900">{ref.clicks}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};