import { useState } from "react";
import type { Agent } from "../App";
import { useI18n } from "../i18n/context";

interface Props {
  enlAgents: Agent[];
  resAgents: Agent[];
  allAgents: Agent[];
  onUpdate: (agents: Agent[]) => void;
}

function FactionGroup({
  label,
  agents,
  badgeText,
  color,
  editMode,
  onDelete,
}: {
  label: string;
  agents: Agent[];
  badgeText: string;
  color: "enl" | "res";
  editMode: boolean;
  onDelete: (name: string) => void;
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
        <span className={`text-[11px] font-mono uppercase tracking-[0.54px] font-medium ${c.text}`}>
          {label}
        </span>
        <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${c.badge}`}>
          {badgeText}
        </span>
      </div>

      {/* Agent list */}
      <div className="max-h-48 overflow-y-auto">
        <div className="flex flex-wrap gap-1.5 p-3">
          {agents.length === 0 && (
            <span className="text-[11px] text-black/25 font-mono py-2">—</span>
          )}
          {agents.map((agent) => (
            <span
              key={agent.name}
              className={`inline-flex items-center gap-1 text-[12px] px-2.5 py-1 rounded-full font-mono font-medium tracking-[-0.01em] ${c.badge} ${editMode ? "pr-1.5" : ""}`}
            >
              {agent.name}
              {editMode && (
                <button
                  onClick={() => onDelete(agent.name)}
                  className="w-4 h-4 rounded-full inline-flex items-center justify-center hover:bg-black/10 transition-colors text-[10px] leading-none cursor-pointer"
                  title="Remove"
                >
                  ×
                </button>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AgentList({ enlAgents, resAgents, allAgents, onUpdate }: Props) {
  const { t } = useI18n();
  const [editMode, setEditMode] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [addName, setAddName] = useState("");
  const [addFaction, setAddFaction] = useState<"enl" | "res">("enl");
  const [bulkText, setBulkText] = useState("");
  const total = allAgents.length;

  const handleDelete = (name: string) => {
    onUpdate(allAgents.filter((a) => a.name !== name));
  };

  const handleAdd = () => {
    const name = addName.trim();
    if (!name) return;
    if (allAgents.some((a) => a.name === name)) return;
    onUpdate([...allAgents, { name, faction: addFaction }]);
    setAddName("");
  };

  const handleBulkImport = () => {
    const lines = bulkText.split("\n").filter((l) => l.trim());
    const parsed: Agent[] = [];
    for (const line of lines) {
      const trimmed = line.trim();
      const match = trimmed.match(/^(ENL|RES)[:：]\s*(.+)$/i);
      if (match) {
        const faction = match[1].toLowerCase() as "enl" | "res";
        const name = match[2].trim();
        if (name && !parsed.some((a) => a.name === name) && !allAgents.some((a) => a.name === name)) {
          parsed.push({ name, faction });
        }
      } else {
        const name = trimmed;
        if (name && !parsed.some((a) => a.name === name) && !allAgents.some((a) => a.name === name)) {
          parsed.push({ name, faction: "enl" });
        }
      }
    }
    if (parsed.length > 0) {
      onUpdate([...allAgents, ...parsed]);
    }
    setBulkText("");
    setBulkMode(false);
  };

  const handleClearAll = () => {
    if (allAgents.length === 0) return;
    if (confirm(t("agents.edit.clearConfirm"))) {
      onUpdate([]);
      setEditMode(false);
      setBulkMode(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono uppercase tracking-[0.54px] text-black/40">
          {t("agents.title")}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-black/40">
            {t("agents.count").replace("{n}", String(total))}
          </span>
          <button
            onClick={() => setEditMode(!editMode)}
            className={`text-[11px] font-mono px-3 py-1 rounded-full border transition-colors cursor-pointer ${
              editMode
                ? "bg-black text-white border-black"
                : "bg-transparent text-black/50 border-black/15 hover:border-black/30 hover:text-black/70"
            }`}
          >
            {editMode ? t("agents.edit.done") : t("agents.edit.toggle")}
          </button>
        </div>
      </div>

      {/* Edit mode controls */}
      {editMode && (
        <div className="space-y-2.5">
          {/* Add single agent */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder={t("agents.edit.addPlaceholder")}
              className="flex-1 min-w-0 bg-black/3 border border-black/10 rounded-full px-3.5 py-2 text-[13px] tracking-[-0.01em] text-black placeholder-black/30 outline-none focus:border-black/30 transition-colors"
            />
            <div className="flex items-center rounded-full border border-black/10 bg-black/3 overflow-hidden shrink-0">
              <button
                onClick={() => setAddFaction("enl")}
                className={`px-2.5 py-1.5 text-[11px] font-mono transition-colors cursor-pointer ${
                  addFaction === "enl"
                    ? "bg-emerald-100 text-emerald-700 font-medium"
                    : "text-black/40 hover:text-black/60"
                }`}
              >
                ENL
              </button>
              <button
                onClick={() => setAddFaction("res")}
                className={`px-2.5 py-1.5 text-[11px] font-mono transition-colors cursor-pointer ${
                  addFaction === "res"
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "text-black/40 hover:text-black/60"
                }`}
              >
                RES
              </button>
            </div>
            <button
              onClick={handleAdd}
              disabled={!addName.trim()}
              className="px-4 py-2 bg-black text-white rounded-full text-[12px] font-medium disabled:bg-black/20 disabled:text-white/50 transition-colors cursor-pointer shrink-0"
            >
              {t("agents.edit.add")}
            </button>
          </div>

          {/* Bulk import toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBulkMode(!bulkMode)}
              className={`text-[11px] font-mono px-3 py-1 rounded-full border transition-colors cursor-pointer ${
                bulkMode
                  ? "bg-black/5 text-black/70 border-black/20"
                  : "bg-transparent text-black/40 border-black/10 hover:border-black/20 hover:text-black/60"
              }`}
            >
              {t("agents.edit.bulkToggle")}
            </button>
            {total > 0 && (
              <button
                onClick={handleClearAll}
                className="text-[11px] font-mono px-3 py-1 rounded-full border border-red-200 text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
              >
                {t("agents.edit.clearAll")}
              </button>
            )}
          </div>

          {/* Bulk textarea */}
          {bulkMode && (
            <div className="space-y-2">
              <textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder={t("agents.edit.bulkPlaceholder")}
                rows={5}
                className="w-full bg-black/3 border border-black/10 rounded-xl px-3.5 py-2.5 text-[12px] font-mono tracking-[-0.01em] text-black placeholder-black/30 outline-none focus:border-black/30 transition-colors resize-y"
              />
              <button
                onClick={handleBulkImport}
                disabled={!bulkText.trim()}
                className="px-4 py-1.5 bg-black text-white rounded-full text-[12px] font-medium disabled:bg-black/20 disabled:text-white/50 transition-colors cursor-pointer"
              >
                {t("agents.edit.bulkApply")}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Faction groups */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FactionGroup
          label={t("agents.enl")}
          agents={enlAgents}
          badgeText={t("agents.badge").replace("{n}", String(enlAgents.length))}
          color="enl"
          editMode={editMode}
          onDelete={handleDelete}
        />
        <FactionGroup
          label={t("agents.res")}
          agents={resAgents}
          badgeText={t("agents.badge").replace("{n}", String(resAgents.length))}
          color="res"
          editMode={editMode}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
