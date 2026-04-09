import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { scrapeAgents } from "./scraper";
import { draw } from "./rng";
import { initDb, createLottery, getLotteryById } from "./db";

// ── Types ──────────────────────────────────────────
type Bindings = {
  DB: D1Database;
  ASSETS: Fetcher;
};

// ── Zod Schemas ────────────────────────────────────
const agentSchema = z.object({
  name: z.string(),
  faction: z.enum(["enl", "res"]),
});

const lotteryBodySchema = z.object({
  eventUrl: z.string().url(),
  eventTitle: z.string(),
  agents: z.array(agentSchema).min(1),
  winnerCount: z.number().int().positive(),
  seed: z.number().int().optional(),
});

// ── App ────────────────────────────────────────────
const app = new Hono<{ Bindings: Bindings }>();

// 爬取 Agent 名单
app.get("/api/agents", async (c) => {
  const url = c.req.query("url");
  if (!url) {
    return c.json({ error: "缺少 url 参数" }, 400);
  }

  try {
    const result = await scrapeAgents(url);
    return c.json(result);
  } catch (e: any) {
    return c.json({ error: e.message || "获取名单失败" }, 500);
  }
});

// 创建抽奖
app.post("/api/lottery", zValidator("json", lotteryBodySchema), async (c) => {
  const data = c.req.valid("json");
  const db = initDb(c.env.DB);
  const seed = data.seed ?? Date.now();

  const winners = draw(data.agents, data.winnerCount, seed);

  const lottery = await createLottery(db, {
    eventUrl: data.eventUrl,
    eventTitle: data.eventTitle,
    seed,
    winnerCount: data.winnerCount,
    agents: data.agents,
    winners,
  });

  return c.json({
    id: lottery.id,
    seed: lottery.seed,
    winners: lottery.winners,
    createdAt: lottery.createdAt,
  });
});

// 查询抽奖结果
app.get("/api/lottery/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (!id || id < 1) {
    return c.json({ error: "无效的 ID" }, 400);
  }

  const db = initDb(c.env.DB);
  const lottery = await getLotteryById(db, id);

  if (!lottery) {
    return c.json({ error: "抽奖记录不存在" }, 404);
  }

  return c.json(lottery);
});

export default app;
