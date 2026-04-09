export default {
  // App
  "app.title": "Ingress FS 抽奖系统",
  "app.subtitle": "确定性抽奖 · 结果可复现",
  "app.tab.lottery": "抽奖",
  "app.tab.query": "查询结果",
  "app.notice": "仅可抽取已在 Auto Score Sheet 中的 Agent（即表格中已列出的玩家）。",

  // UrlInput
  "url.label": "Event URL",
  "url.placeholder": "输入 Event ID 或完整 URL",
  "url.error.invalid": "请输入纯数字 Event ID 或 fevgames.net 完整 URL",
  "url.error.fetch": "获取名单失败",
  "url.error.status": "请求失败",
  "url.button.fetch": "获取名单",
  "url.button.fetching": "获取中...",

  // AgentList
  "agents.title": "Agent List",
  "agents.count": "共 {n} 人",
  "agents.badge": "{n} 人",
  "agents.enl": "ENL · 启蒙军",
  "agents.res": "RES · 抵抗军",

  // LotteryForm
  "lottery.title": "Lottery Settings",
  "lottery.count.label": "中奖人数",
  "lottery.count.placeholder": "1",
  "lottery.count.error": "不能超过总人数 ({n})",
  "lottery.seed.label": "Seed（可选）",
  "lottery.seed.placeholder": "留空自动生成",
  "lottery.seed.error": "Seed 必须是整数",
  "lottery.error.draw": "抽奖失败",
  "lottery.error.status": "抽奖失败",
  "lottery.button.draw": "开始抽奖",
  "lottery.button.drawing": "抽奖中...",

  // LotteryResult
  "result.title": "Result",
  "result.winners": "Winners ({n})",
  "result.noWinners": "无中奖者",
  "result.copy": "复制结果",
  "result.meta.id": "ID",
  "result.meta.seed": "Seed",
  "result.meta.time": "Time",
  "result.badge": "{n} 人",
  "result.copy.header": "Ingress FS 抽奖结果",
  "result.copy.event": "活动: ",
  "result.copy.id": "抽奖 ID: ",
  "result.copy.seed": "Seed: ",
  "result.copy.time": "时间: ",
  "result.copy.agents": "中奖 Agent:",
  "result.copy.enl": "启蒙军/ENL",
  "result.copy.res": "抵抗军/RES",
  "result.copy.summary": "共 {total} 人参与，抽取 {winners} 人",

  // ResultQuery
  "query.placeholder": "输入抽奖 ID",
  "query.button": "查询",
  "query.button.querying": "查询中...",
  "query.error.notFound": "未找到该抽奖记录",
  "query.error.fail": "查询失败",
  "query.meta.id": "ID: ",
  "query.meta.seed": "Seed: ",
  "query.meta.time": "时间: ",
  "query.summary": "共 {total} 人参与，抽取 {winners} 人",
  "query.winners": "Winners",
  "query.allAgents": "查看全部参与者 ({n} 人)",
} as const;
