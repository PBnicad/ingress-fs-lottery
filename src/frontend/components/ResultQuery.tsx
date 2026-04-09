import { useState } from "react";
import type { Agent } from "../App";

interface LotteryRecord {
  id: number;
  eventUrl: string;
  eventTitle: string;
  seed: number;
  winnerCount: number;
  agents: Agent[];
  winners: Agent[];
  createdAt: string;
}

function FactionGroup({
  label,
  agents,
  color,
}: {
  label: string;
  agents: Agent[];
  color: "enl" | "res";
}) {
  if (agents.length === 0) return null;

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
          {agents.length} 人
        </span>
      </div>
      <div className="px-3 pb-3 flex flex-wrap gap-1.5">
        {agents.map((agent) => (
          <span
            key={agent.name}
            className={`text-[12px] px-2.5 py-1 rounded-full font-mono font-medium tracking-[-0.01em] ${c.badge}`}
          >
            {agent.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ResultQuery() {
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [record, setRecord] = useState<LotteryRecord | null>(null);

  const query = async () => {
    setError("");
    setRecord(null);
    if (!id.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/lottery/${id}`);
      if (!res.ok) {
        const errData: any = await res.json().catch(() => ({}));
        throw new Error(errData?.error || "未找到该抽奖记录");
      }
      const data: LotteryRecord = await res.json();
      setRecord(data);
    } catch (e: any) {
      setError(e.message || "查询失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex gap-2">
        <input
          type="text"
          inputMode="numeric"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="输入抽奖 ID"
          className="flex-1 min-w-0 rounded-full bg-black/3 border border-black/10 px-4 py-2.5 text-[14px] tracking-[-0.01em] text-black placeholder-black/30 outline-none focus:border-black/30 focus-visible:outline-dashed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black transition-colors"
          onKeyDown={(e) => e.key === "Enter" && query()}
        />
        <button
          onClick={query}
          disabled={loading || !id.trim()}
          className="px-5 sm:px-6 py-2.5 bg-black text-white rounded-full text-[13px] font-medium tracking-[-0.01em] hover:bg-black/80 disabled:bg-black/15 disabled:text-white/40 transition-colors outline-none focus-visible:outline-dashed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black whitespace-nowrap"
        >
          {loading ? "查询中..." : "查询"}
        </button>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-[13px]">
          {error}
        </div>
      )}

      {record && (
        <div className="space-y-4">
          {/* Event info */}
          <div className="border border-black/8 rounded-lg p-4 space-y-3">
            <h3 className="text-[15px] sm:text-[16px] font-medium tracking-[-0.02em]">
              {record.eventTitle}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-[13px]">
              <div>
                <span className="text-black/40">ID: </span>
                <span className="font-mono font-medium">#{record.id}</span>
              </div>
              <div>
                <span className="text-black/40">Seed: </span>
                <span className="font-mono text-[11px] text-amber-700">
                  {record.seed}
                </span>
              </div>
              <div>
                <span className="text-black/40">时间: </span>
                <span className="text-[11px] text-black/60">
                  {new Date(record.createdAt).toLocaleString("zh-CN")}
                </span>
              </div>
            </div>
            <p className="text-[12px] text-black/40">
              共 {record.agents.length} 人参与，抽取 {record.winnerCount} 人
            </p>
          </div>

          {/* Winners by faction */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-[0.54px] text-black/40">
              Winners
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FactionGroup
                label="ENL · 启蒙军"
                agents={record.winners.filter((w) => w.faction === "enl")}
                color="enl"
              />
              <FactionGroup
                label="RES · 抵抗军"
                agents={record.winners.filter((w) => w.faction === "res")}
                color="res"
              />
            </div>
          </div>

          {/* All participants */}
          <details className="group">
            <summary className="text-[12px] text-black/40 cursor-pointer hover:text-black/60 transition-colors">
              查看全部参与者 ({record.agents.length} 人)
            </summary>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FactionGroup
                label="ENL · 启蒙军"
                agents={record.agents.filter((a) => a.faction === "enl")}
                color="enl"
              />
              <FactionGroup
                label="RES · 抵抗军"
                agents={record.agents.filter((a) => a.faction === "res")}
                color="res"
              />
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
