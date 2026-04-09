import { useState } from "react";
import UrlInput from "./components/UrlInput";
import AgentList from "./components/AgentList";
import LotteryForm from "./components/LotteryForm";
import LotteryResult from "./components/LotteryResult";
import ResultQuery from "./components/ResultQuery";

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
  const [tab, setTab] = useState<"lottery" | "query">("lottery");

  const [eventUrl, setEventUrl] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<LotteryResultData | null>(null);

  const enlAgents = agents.filter((a) => a.faction === "enl");
  const resAgents = agents.filter((a) => a.faction === "res");

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-[1.75rem] sm:text-[2.5rem] leading-[1.05] tracking-[-0.04em] font-normal text-black">
            Ingress FS
            <br />
            <span className="text-[1.375rem] sm:text-[1.875rem] tracking-[-0.03em]">
              抽奖系统
            </span>
          </h1>
          <p className="mt-2 sm:mt-3 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.54px] text-black/40">
            Deterministic Lottery &middot; Result Reproducible
          </p>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-2 mb-6 sm:mb-8">
          {(["lottery", "query"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 sm:px-5 py-2 text-[13px] font-medium transition-all outline-none focus-visible:outline-dashed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
                tab === t
                  ? "bg-black text-white rounded-full"
                  : "bg-transparent text-black/60 rounded-full hover:bg-black/5"
              }`}
            >
              {t === "lottery" ? "抽奖" : "查询结果"}
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

            {agents.length > 0 && (
              <>
                {/* Notice */}
                <div className="flex items-start gap-2.5 px-3 sm:px-4 py-3 rounded-lg bg-black/3 border border-black/6">
                  <p className="text-[12px] sm:text-[13px] text-black/60 leading-snug">
                    仅可抽取已在 Auto Score
                    Sheet中的Agent（即表格中已列出的玩家）。
                  </p>
                </div>

                <AgentList enlAgents={enlAgents} resAgents={resAgents} />
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
