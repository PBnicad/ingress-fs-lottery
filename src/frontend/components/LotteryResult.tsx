import type { Agent, LotteryResultData } from "../App";
import { useI18n } from "../i18n/context";
import type { Locale } from "../i18n/locales";

interface Props {
  result: LotteryResultData;
  agents: Agent[];
  eventTitle: string;
}

function FactionWinners({
  label,
  winners,
  badgeText,
  color,
  startIndex,
}: {
  label: string;
  winners: Agent[];
  badgeText: string;
  color: "enl" | "res";
  startIndex: number;
}) {
  if (winners.length === 0) return null;

  const c = {
    enl: {
      bg: "bg-emerald-50/50",
      border: "border-emerald-200/60",
      text: "text-emerald-700",
      badge: "bg-emerald-100 text-emerald-700",
    },
    res: {
      bg: "bg-blue-50/50",
      border: "border-blue-200/60",
      text: "text-blue-700",
      badge: "bg-blue-100 text-blue-700",
    },
  }[color];

  return (
    <div className={`rounded-lg border ${c.border} ${c.bg} overflow-hidden`}>
      <div className="px-4 py-2.5 flex items-center justify-between">
        <span
          className={`text-[11px] font-mono uppercase tracking-[0.54px] font-medium ${c.text}`}
        >
          {label}
        </span>
        <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${c.badge}`}>
          {badgeText}
        </span>
      </div>
      <div className="px-3 pb-3 space-y-1.5">
        {winners.map((winner, i) => (
          <div
            key={winner.name}
            className="flex items-center gap-3 px-2 py-2 rounded-md bg-white/60"
          >
            <span className="text-sm font-bold text-black/15 w-5 tabular-nums">
              {startIndex + i + 1}
            </span>
            <span
              className={`text-[14px] font-mono font-medium tracking-[-0.02em] ${c.text}`}
            >
              {winner.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const dateLocales: Record<string, Locale> = {
  zh: "zh-CN",
  en: "en-US",
  ja: "ja-JP",
};

export default function LotteryResult({ result, agents, eventTitle }: Props) {
  const { locale, t } = useI18n();
  const enlWinners = result.winners.filter((w) => w.faction === "enl");
  const resWinners = result.winners.filter((w) => w.faction === "res");
  const dl = dateLocales[locale] || "en-US";

  const copyResult = () => {
    const lines = [
      t("result.copy.header"),
      `${t("result.copy.event")}${eventTitle}`,
      `${t("result.copy.id")}${result.id}`,
      `${t("result.copy.seed")}${result.seed}`,
      `${t("result.copy.time")}${new Date(result.createdAt).toLocaleString(dl)}`,
      ``,
      `${t("result.copy.agents")}`,
      ...result.winners.map(
        (w) =>
          `- ${w.name} (${w.faction === "enl" ? t("result.copy.enl") : t("result.copy.res")})`
      ),
      ``,
      t("result.copy.summary")
        .replace("{total}", String(agents.length))
        .replace("{winners}", String(result.winners.length)),
    ];
    navigator.clipboard.writeText(lines.join("\n"));
  };

  return (
    <div className="border border-black/8 rounded-lg p-4 sm:p-5 space-y-4 sm:space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono uppercase tracking-[0.54px] text-black/40">
          {t("result.title")}
        </span>
        <button
          onClick={copyResult}
          className="text-[12px] px-4 py-1.5 bg-black/5 rounded-full hover:bg-black/10 transition-colors outline-none focus-visible:outline-dashed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          {t("result.copy")}
        </button>
      </div>

      {/* Meta */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="bg-black/2 rounded-lg p-2.5 sm:p-3">
          <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.54px] text-black/30 mb-1">
            {t("result.meta.id")}
          </div>
          <div className="text-base sm:text-xl font-mono font-semibold tracking-tight">
            #{result.id}
          </div>
        </div>
        <div className="bg-black/2 rounded-lg p-2.5 sm:p-3">
          <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.54px] text-black/30 mb-1">
            {t("result.meta.seed")}
          </div>
          <div className="text-[11px] sm:text-[12px] font-mono text-amber-700 break-all leading-tight">
            {result.seed}
          </div>
        </div>
        <div className="bg-black/2 rounded-lg p-2.5 sm:p-3">
          <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.54px] text-black/30 mb-1">
            {t("result.meta.time")}
          </div>
          <div className="text-[10px] sm:text-[11px] text-black/50 leading-tight">
            {new Date(result.createdAt).toLocaleString(dl)}
          </div>
        </div>
      </div>

      {/* Winners by faction */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono uppercase tracking-[0.54px] text-black/40">
          {t("result.winners").replace("{n}", String(result.winners.length))}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FactionWinners
            label={t("agents.enl")}
            winners={enlWinners}
            badgeText={t("result.badge").replace("{n}", String(enlWinners.length))}
            color="enl"
            startIndex={0}
          />
          <FactionWinners
            label={t("agents.res")}
            winners={resWinners}
            badgeText={t("result.badge").replace("{n}", String(resWinners.length))}
            color="res"
            startIndex={enlWinners.length}
          />
        </div>
        {enlWinners.length === 0 && resWinners.length === 0 && (
          <p className="text-[13px] text-black/30 text-center py-4">
            {t("result.noWinners")}
          </p>
        )}
      </div>
    </div>
  );
}
