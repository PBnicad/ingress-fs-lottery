export default {
  // App
  "app.title": "Ingress FS Lottery",
  "app.subtitle": "Deterministic Lottery · Result Reproducible",
  "app.tab.lottery": "Lottery",
  "app.tab.query": "Query Result",
  "app.notice": "Only agents listed in the Auto Score Sheet are eligible for the draw.",

  // UrlInput
  "url.label": "Event URL",
  "url.placeholder": "Enter Event ID or full URL",
  "url.error.invalid": "Please enter a numeric Event ID or a valid fevgames.net URL",
  "url.error.fetch": "Failed to fetch agent list",
  "url.error.status": "Request failed",
  "url.button.fetch": "Fetch Agents",
  "url.button.fetching": "Fetching...",

  // AgentList
  "agents.title": "Agent List",
  "agents.count": "{n} agents total",
  "agents.badge": "{n}",
  "agents.enl": "ENL · Enlightened",
  "agents.res": "RES · Resistance",

  // LotteryForm
  "lottery.title": "Lottery Settings",
  "lottery.count.label": "Number of Winners",
  "lottery.count.placeholder": "1",
  "lottery.count.error": "Cannot exceed total agents ({n})",
  "lottery.seed.label": "Seed (optional)",
  "lottery.seed.placeholder": "Leave empty for auto",
  "lottery.seed.error": "Seed must be an integer",
  "lottery.error.draw": "Lottery failed",
  "lottery.error.status": "Lottery failed",
  "lottery.button.draw": "Start Lottery",
  "lottery.button.drawing": "Drawing...",

  // LotteryResult
  "result.title": "Result",
  "result.winners": "Winners ({n})",
  "result.noWinners": "No winners",
  "result.copy": "Copy Result",
  "result.meta.id": "ID",
  "result.meta.seed": "Seed",
  "result.meta.time": "Time",
  "result.badge": "{n}",
  "result.copy.header": "Ingress FS Lottery Result",
  "result.copy.event": "Event: ",
  "result.copy.id": "Lottery ID: ",
  "result.copy.seed": "Seed: ",
  "result.copy.time": "Time: ",
  "result.copy.agents": "Winning Agents:",
  "result.copy.enl": "Enlightened/ENL",
  "result.copy.res": "Resistance/RES",
  "result.copy.summary": "{total} participants, {winners} winners drawn",

  // ResultQuery
  "query.placeholder": "Enter Lottery ID",
  "query.button": "Query",
  "query.button.querying": "Querying...",
  "query.error.notFound": "Lottery record not found",
  "query.error.fail": "Query failed",
  "query.meta.id": "ID: ",
  "query.meta.seed": "Seed: ",
  "query.meta.time": "Time: ",
  "query.summary": "{total} participants, {winners} winners drawn",
  "query.winners": "Winners",
  "query.allAgents": "View all participants ({n})",
} as const;
