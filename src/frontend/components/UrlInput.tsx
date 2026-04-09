import { useState } from "react";
import type { Agent } from "../App";

interface Props {
  onResult: (url: string, title: string, agents: Agent[]) => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
  error: string;
  setError: (v: string) => void;
}

export default function UrlInput({
  onResult,
  loading,
  setLoading,
  setError,
}: Props) {
  const [url, setUrl] = useState("https://fevgames.net/ifs/event/?e=");

  const fetchAgents = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(
        `/api/agents?url=${encodeURIComponent(url)}`
      );
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || `请求失败 (${res.status})`);
      }
      const data = await res.json();
      onResult(url, data.eventTitle, data.agents);
    } catch (e: any) {
      setError(e.message || "获取名单失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-[11px] font-mono uppercase tracking-[0.54px] text-black/40">
        Event URL
      </label>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://fevgames.net/ifs/event/?e=..."
          className="flex-1 min-w-0 rounded-full bg-black/3 border border-black/10 px-4 py-2.5 text-[14px] tracking-[-0.01em] text-black placeholder-black/30 outline-none focus:border-black/30 focus-visible:outline-dashed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black transition-colors"
        />
        <button
          onClick={fetchAgents}
          disabled={loading || !url}
          className="px-6 py-2.5 bg-black text-white rounded-full text-[13px] font-medium tracking-[-0.01em] hover:bg-black/80 disabled:bg-black/20 disabled:text-white/50 transition-colors outline-none focus-visible:outline-dashed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black whitespace-nowrap"
        >
          {loading ? "获取中..." : "获取名单"}
        </button>
      </div>
    </div>
  );
}
