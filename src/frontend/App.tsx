import { useState, useRef, useEffect } from "react";
import UrlInput from "./components/UrlInput";
import AgentList from "./components/AgentList";
import LotteryForm from "./components/LotteryForm";
import LotteryResult from "./components/LotteryResult";
import ResultQuery from "./components/ResultQuery";
import { useI18n } from "./i18n/context";
import { localeNames, type Locale } from "./i18n/locales";

export interface Agent {
  name: string;
  faction: "enl" | "res";
}

export interface LotteryResultData {
  id: number;
  seed: number;
  winners: Agent[];
  createdAt: string;
}

export default function App() {
  const { locale, setLocale, t } = useI18n();
  const [tab, setTab] = useState<"lottery" | "query">("lottery");
  const [open, setOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const [eventUrl, setEventUrl] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<LotteryResultData | null>(null);

  const enlAgents = agents.filter((a) => a.faction === "enl");
  const resAgents = agents.filter((a) => a.faction === "res");

  const updateAgents = (newAgents: Agent[]) => {
    setAgents(newAgents);
    setResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-start justify-between">
            <h1 className="text-[1.75rem] sm:text-[2.5rem] leading-[1.05] tracking-[-0.04em] font-normal text-black">
              Ingress FS
              <br />
              <span className="text-[1.375rem] sm:text-[1.875rem] tracking-[-0.03em]">
                {t("app.title").replace("Ingress FS ", "")}
              </span>
            </h1>
            <div className="relative" ref={dropRef}>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.54px] px-4 py-2 rounded-full border border-black/10 bg-white text-black/60 outline-none focus:border-black/30 cursor-pointer transition-colors"
              >
                {localeNames[locale]}
                <svg
                  className={`w-3 h-3 text-black/30 transition-transform ${open ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {open && (
                <div className="absolute right-0 mt-1.5 py-1 rounded-xl border border-black/10 bg-white shadow-lg shadow-black/5 z-50 min-w-[120px] overflow-hidden">
                  {(["zh", "en", "ja"] as Locale[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        setLocale(l);
                        setOpen(false);
                      }}
                      className={`w-full text-left text-[12px] font-mono px-4 py-2 transition-colors outline-none ${
                        locale === l
                          ? "bg-black/5 text-black font-medium"
                          : "text-black/60 hover:bg-black/3"
                      }`}
                    >
                      {localeNames[l]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <p className="mt-2 sm:mt-3 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.54px] text-black/40">
            {t("app.subtitle")}
          </p>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-2 mb-6 sm:mb-8">
          {(["lottery", "query"] as const).map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => setTab(tabKey)}
              className={`px-4 sm:px-5 py-2 text-[13px] font-medium transition-all outline-none focus-visible:outline-dashed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
                tab === tabKey
                  ? "bg-black text-white rounded-full"
                  : "bg-transparent text-black/60 rounded-full hover:bg-black/5"
              }`}
            >
              {tabKey === "lottery" ? t("app.tab.lottery") : t("app.tab.query")}
            </button>
          ))}
        </div>

        {tab === "lottery" ? (
          <div className="space-y-5 sm:space-y-6">
            <UrlInput
              onResult={(url, title, list) => {
                setEventUrl(url);
                setEventTitle(title);
                setAgents(list);
                setResult(null);
                setError("");
              }}
              loading={loading}
              setLoading={setLoading}
              error={error}
              setError={setError}
            />

            <AgentList enlAgents={enlAgents} resAgents={resAgents} allAgents={agents} onUpdate={updateAgents} />

            {agents.length > 0 && (
              <>
                {/* Notice */}
                <div className="flex items-start gap-2.5 px-3 sm:px-4 py-3 rounded-lg bg-black/3 border border-black/6">
                  <p className="text-[12px] sm:text-[13px] text-black/60 leading-snug">
                    {t("app.notice")}
                  </p>
                </div>

                <LotteryForm
                  agents={agents}
                  eventUrl={eventUrl}
                  eventTitle={eventTitle}
                  onResult={setResult}
                  onError={setError}
                />
              </>
            )}

            {error && (
              <div className="px-3 sm:px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-[13px]">
                {error}
              </div>
            )}

            {result && (
              <LotteryResult
                result={result}
                agents={agents}
                eventTitle={eventTitle}
              />
            )}
          </div>
        ) : (
          <ResultQuery />
        )}
      </div>
    </div>
  );
}
