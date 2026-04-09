import { useState } from "react";
import type { Agent, LotteryResultData } from "../App";
import { useI18n } from "../i18n/context";

interface Props {
  agents: Agent[];
  eventUrl: string;
  eventTitle: string;
  onResult: (result: LotteryResultData) => void;
  onError: (msg: string) => void;
}

export default function LotteryForm({
  agents,
  eventUrl,
  eventTitle,
  onResult,
  onError,
}: Props) {
  const { t } = useI18n();
  const [count, setCount] = useState(1);
  const [seedInput, setSeedInput] = useState("");
  const [countError, setCountError] = useState("");
  const [drawing, setDrawing] = useState(false);

  const handleDraw = async () => {
    onError("");
    setDrawing(true);

    try {
      const body: any = {
        eventUrl,
        eventTitle,
        agents,
        winnerCount: count,
      };

      if (seedInput.trim()) {
        const seed = parseInt(seedInput, 10);
        if (isNaN(seed)) {
          throw new Error(t("lottery.seed.error"));
        }
        body.seed = seed;
      }

      const res = await fetch("/api/lottery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData: any = await res.json().catch(() => ({}));
        throw new Error(errData?.error || `${t("lottery.error.status")} (${res.status})`);
      }

      const data: LotteryResultData = await res.json();
      onResult(data);
    } catch (e: any) {
      onError(e.message || t("lottery.error.draw"));
    } finally {
      setDrawing(false);
    }
  };

  return (
    <div className="border border-black/8 rounded-lg p-4 sm:p-5 space-y-4">
      <span className="text-[11px] font-mono uppercase tracking-[0.54px] text-black/40">
        {t("lottery.title")}
      </span>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-[12px] text-black/50 mb-1.5">
            {t("lottery.count.label")}
          </label>
          <input
            type="text"
            inputMode="numeric"
            placeholder={t("lottery.count.placeholder")}
            value={count || ""}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "");
              const n = v ? Number(v) : 0;
              setCount(n);
              setCountError(
                n > agents.length
                  ? t("lottery.count.error").replace("{n}", String(agents.length))
                  : ""
              );
            }}
            className={`w-full rounded-lg bg-black/3 border px-3 py-2 text-[14px] tracking-[-0.01em] outline-none transition-colors ${
              countError
                ? "border-red-300 focus:border-red-400"
                : "border-black/10 focus:border-black/30"
            } focus-visible:outline-dashed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black`}
          />
          {countError && (
            <p className="text-[11px] text-red-500 mt-1">{countError}</p>
          )}
        </div>
        <div>
          <label className="block text-[12px] text-black/50 mb-1.5">
            {t("lottery.seed.label")}
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={seedInput}
            onChange={(e) => setSeedInput(e.target.value)}
            placeholder={t("lottery.seed.placeholder")}
            className="w-full rounded-lg bg-black/3 border border-black/10 px-3 py-2 text-[14px] tracking-[-0.01em] outline-none focus:border-black/30 focus-visible:outline-dashed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black transition-colors placeholder-black/25"
          />
        </div>
      </div>

      <button
        onClick={handleDraw}
        disabled={drawing || count < 1 || count > agents.length}
        className="w-full py-3 bg-black text-white rounded-full text-[14px] font-medium tracking-[-0.01em] hover:bg-black/80 disabled:bg-black/15 disabled:text-white/40 transition-colors outline-none focus-visible:outline-dashed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
      >
        {drawing ? t("lottery.button.drawing") : t("lottery.button.draw")}
      </button>
    </div>
  );
}
