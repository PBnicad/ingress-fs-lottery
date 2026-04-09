import type { Agent } from "../App";
import { useI18n } from "../i18n/context";

interface Props {
  enlAgents: Agent[];
  resAgents: Agent[];
}

function FactionGroup({
  label,
  agents,
  badgeText,
  color,
}: {
  label: string;
  agents: Agent[];
  badgeText: string;
  color: "enl" | "res";
}) {
  const colors = {
    enl: {
      bg: "bg-emerald-50/50",
      border: "border-emerald-200/60",
      text: "text-emerald-700",
      badge: "bg-emerald-100 text-emerald-700",
      rowBg: "bg-emerald-50/30",
    },
    res: {
      bg: "bg-blue-50/50",
      border: "border-blue-200/60",
      text: "text-blue-700",
      badge: "bg-blue-100 text-blue-700",
      rowBg: "bg-blue-50/30",
    },
  };

  const c = colors[color];

  return (
    <div className={`rounded-lg border ${c.border} ${c.bg} overflow-hidden`}>
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-inherit flex items-center justify-between">
        <span
          className={`text-[11px] font-mono uppercase tracking-[0.54px] font-medium ${c.text}`}
        >
          {label}
        </span>
        <span
          className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${c.badge}`}
        >
          {badgeText}
        </span>
      </div>

      {/* Agent list */}
      <div className="max-h-48 overflow-y-auto">
        <div className="flex flex-wrap gap-1.5 p-3">
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
    </div>
  );
}

export default function AgentList({ enlAgents, resAgents }: Props) {
  const { t } = useI18n();
  const total = enlAgents.length + resAgents.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono uppercase tracking-[0.54px] text-black/40">
          {t("agents.title")}
        </span>
        <span className="text-[12px] text-black/40">
          {t("agents.count").replace("{n}", String(total))}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FactionGroup
          label={t("agents.enl")}
          agents={enlAgents}
          badgeText={t("agents.badge").replace("{n}", String(enlAgents.length))}
          color="enl"
        />
        <FactionGroup
          label={t("agents.res")}
          agents={resAgents}
          badgeText={t("agents.badge").replace("{n}", String(resAgents.length))}
          color="res"
        />
      </div>
    </div>
  );
}
