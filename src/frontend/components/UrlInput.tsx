import { useState } from "react";
import type { Agent } from "../App";
import { useI18n } from "../i18n/context";

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
  const { t } = useI18n();
  const fetchAgents = async () => {
    setError("");
    if (!resolved) {
      setError(t("url.error.invalid"));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/api/agents?url=${encodeURIComponent(resolved)}`
      );
      if (!res.ok) {
        const data: any = await res.json().catch(() => ({}));
        throw new Error(data?.error || `${t("url.error.status")} (${res.status})`);
      }
      const data: any = await res.json();
      onResult(resolved, data.eventTitle, data.agents);
    } catch (e: any) {
      setError(e.message || t("url.error.fetch"));
    } finally {
      setLoading(false);
    }
  };

  const PREFIX = "https://fevgames.net/ifs/event/?e=";

  const extractInput = (value: string): string => {
    const trimmed = value.trim();
    const match = trimmed.match(/^(?:https?:\/\/)?fevgames\.net\/ifs\/event\/\?e=(\d+)$/);
    if (match) return match[1];
    return trimmed;
  };

  const [input, setInput] = useState("");

  const resolved = (() => {
    const trimmed = input.trim();
    if (!trimmed) return "";
    if (/^\d+$/.test(trimmed)) return `${PREFIX}${trimmed}`;
    if (/^https?:\/\/fevgames\.net\/ifs\/event\/\?e=\d+/.test(trimmed)) return trimmed;
    return "";
  })();

  return (
    <div className="space-y-3">
      <label className="block text-[11px] font-mono uppercase tracking-[0.54px] text-black/40">
        {t("url.label")}
      </label>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 min-w-0 flex items-center rounded-full bg-black/3 border border-black/10 overflow-hidden focus-within:border-black/30 transition-colors">
          <span className="text-[12px] font-mono text-black/25 pl-4 pr-0 select-none whitespace-nowrap shrink-0">
            fevgames.net/ifs/event/?e=
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={input}
            onChange={(e) => setInput(extractInput(e.target.value))}
            placeholder={t("url.placeholder")}
            className="flex-1 min-w-0 bg-transparent px-3 py-2.5 text-[14px] tracking-[-0.01em] text-black placeholder-black/30 outline-none"
            onKeyDown={(e) => e.key === "Enter" && fetchAgents()}
          />
        </div>
        <button
          onClick={fetchAgents}
          disabled={loading || !resolved}
          className="px-6 py-2.5 bg-black text-white rounded-full text-[13px] font-medium tracking-[-0.01em] hover:bg-black/80 disabled:bg-black/20 disabled:text-white/50 transition-colors outline-none focus-visible:outline-dashed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black whitespace-nowrap"
        >
          {loading ? t("url.button.fetching") : t("url.button.fetch")}
        </button>
      </div>
    </div>
  );
}
