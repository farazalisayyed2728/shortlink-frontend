interface MetricCardsProps {
  totalLinks: number;
  totalClicks: number;
}

function MetricCards({
  totalLinks,
  totalClicks,
}: MetricCardsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {/* Total Links */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">
          Total Links
        </p>

        <p className="mt-2 text-3xl font-bold text-slate-900">
          {totalLinks}
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
          {totalClicks}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Total visits across your links
        </p>
      </div>
    </div>
  );
}

export default MetricCards;
