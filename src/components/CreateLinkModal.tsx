import React, { useState } from "react";
import { X, Copy, Check, Sparkles } from "lucide-react";
import { api } from "../api/client";
import type { ShortURL, APIErrorEnvelope } from "../types/api";
import { AxiosError } from "axios";

export const CreateLinkModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onLinkCreated: (link: ShortURL) => void;
}> = ({ isOpen, onClose, onLinkCreated }) => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [createdLink, setCreatedLink] = useState<ShortURL | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const payload: Record<string, string> = { original_url: originalUrl.trim() };
      if (customCode.trim()) payload.custom_code = customCode.trim();

      const { data } = await api.post<ShortURL>("/api/urls/", payload);
      setCreatedLink(data);
      onLinkCreated(data);
    } catch (err) {
      const axiosErr = err as AxiosError<APIErrorEnvelope>;
      const backendMessage = axiosErr.response?.data?.error?.message;
      setErrorMsg(backendMessage || "Failed to create short link.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!createdLink) return;
    setErrorMsg(null);
    setCopied(false);

    try {
      await navigator.clipboard.writeText(createdLink.short_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy short URL:", error);
      setErrorMsg("Unable to copy the link. Please copy it manually.");
    }
  };

  const resetAndClose = () => {
    setOriginalUrl("");
    setCustomCode("");
    setErrorMsg(null);
    setCreatedLink(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            Create Short URL
          </h2>
          <button onClick={resetAndClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {createdLink ? (
          <div className="py-6 text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Your link is ready!</h3>
            <div className="mt-4 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2.5">
              <input
                type="text"
                readOnly
                value={createdLink.short_url}
                className="w-full bg-transparent text-sm font-medium text-blue-600 outline-none select-all"
              />
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            {errorMsg && (
              <p role="alert" className="mt-2 text-xs text-red-600">
                {errorMsg}
              </p>
            )}
            <button
              onClick={resetAndClose}
              className="mt-6 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-sm transition"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-medium text-red-600">
                {errorMsg}
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Destination URL
              </label>
              <input
                type="url"
                required
                placeholder="https://example.com/very/long/url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Custom Short Code (Optional)
              </label>
              <div className="flex items-center">
                <span className="bg-slate-100 text-slate-400 px-3.5 py-2.5 border border-r-0 border-slate-200 rounded-l-xl text-sm">
                  /
                </span>
                <input
                  type="text"
                  placeholder="my-launch-link"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-r-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-3">
              <button
                type="button"
                onClick={resetAndClose}
                className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition disabled:opacity-50"
              >
                {loading ? "Shortening..." : "Create Link"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};