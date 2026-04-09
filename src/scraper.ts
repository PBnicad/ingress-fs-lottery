export interface ScraperResult {
  eventTitle: string;
  agents: { name: string; faction: "enl" | "res" }[];
}

/**
 * 爬取 fevgames.net IFS 活动页面，解析 Agent 表格
 * 页面使用单引号属性: <td class='enl'> / <td class='res'>
 */
export async function scrapeAgents(url: string): Promise<ScraperResult> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`请求失败: ${res.status} ${res.statusText}`);
  }

  const html = await res.text();

  // 提取活动标题 — 匹配 <h2>#IngressFS - ...</h2>
  const titleMatch = html.match(
    /<h2[^>]*>\s*#IngressFS\s*-\s*(.*?)\s*<\/h2>/s
  );
  const eventTitle = titleMatch
    ? `#IngressFS - ${titleMatch[1].trim()}`
    : "";

  // 提取表格 body — 属性可能用单引号或双引号
  const bodyMatch = html.match(
    /<tbody[^>]*id=['"]autoScoreSheetTblBody['"][^>]*>([\s\S]*?)<\/tbody>/
  );
  if (!bodyMatch) {
    throw new Error("未找到 Agent 表格 (autoScoreSheetTblBody)");
  }

  const tbody = bodyMatch[1];

  // 匹配 <td class='enl'>Name</td> 或 <td class="res">Name</td>
  const agentRegex = /<td\s+class=['"](enl|res)['"][^>]*>\s*(\S+?)\s*<\/td>/gi;
  const agents: { name: string; faction: "enl" | "res" }[] = [];

  let match: RegExpExecArray | null;
  while ((match = agentRegex.exec(tbody)) !== null) {
    const faction = match[1] as "enl" | "res";
    const name = match[2].trim();
    if (name) {
      agents.push({ name, faction });
    }
  }

  if (agents.length === 0) {
    throw new Error("未解析到任何 Agent，请检查页面结构是否变化");
  }

  return { eventTitle, agents };
}
