import type { OverviewMetrics } from "../types/api";

export interface MetricCardsProps {
  metrics: OverviewMetrics | null;
}

export const MetricCards = ({ metrics }: MetricCardsProps) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {/* Total Links */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">
          Total Links
        </p>

        <p className="mt-2 text-3xl font-bold text-slate-900">
          {metrics?.total_urls ?? 0}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Short URLs created
        </p>
      </div>

      {/* Total Clicks */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">
          Total Clicks
        </p>

        <p className="mt-2 text-3xl font-bold text-slate-900">
          {metrics?.total_clicks ?? 0}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Total visits across your links
        </p>
      </div>
    </div>
  );
};

export default MetricCards;
