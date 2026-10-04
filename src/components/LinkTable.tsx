import React, { useState } from "react";
import { Copy, Check, BarChart2, Trash2, ExternalLink } from "lucide-react";
import type { ShortURL } from "../types/api";
import { api } from "../api/client";

export const LinkTable: React.FC<{
  links: ShortURL[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onOpenAnalytics: (code: string) => void;
  onDeleteLink: (code: string) => void;
}> = ({ links, totalPages, currentPage, onPageChange, onOpenAnalytics, onDeleteLink }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleDelete = async (code: string) => {
    if (window.confirm(`Are you sure you want to deactivate /${code}? Redirects will return 410 Gone.`)) {
      await api.delete(`/api/urls/${code}/`);
      onDeleteLink(code);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-6">Short Link</th>
              <th className="py-3.5 px-6">Destination</th>
              <th className="py-3.5 px-6 text-center">Clicks</th>
              <th className="py-3.5 px-6">Created</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {links.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400">
                  No links created yet. Click "Create Link" to generate one.
                </td>
              </tr>
            ) : (
              links.map((link) => (
                <tr key={link.short_code} className="hover:bg-slate-50/50 transition">
                  <td className="py-4 px-6 font-medium text-slate-900">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600 font-semibold">{link.short_url}</span>
                      <button
                        onClick={() => handleCopy(link.short_code, link.short_url)}
                        className="text-slate-400 hover:text-slate-600"
                        title="Copy to clipboard"
                      >
                        {copiedCode === link.short_code ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-6 max-w-xs truncate text-slate-500">
                    <a
                      href={link.original_url}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline flex items-center gap-1 inline-flex"
                    >
                      {link.original_url}
                      <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                    </a>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 font-semibold text-xs rounded-full">
                      {link.total_clicks.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-500 text-xs">
                    {new Date(link.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onOpenAnalytics(link.short_code)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="View Detailed Analytics"
                      >
                        <BarChart2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(link.short_code)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Soft Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3.5 py-1.5 border border-slate-200 rounded-lg disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-slate-500">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3.5 py-1.5 border border-slate-200 rounded-lg disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};