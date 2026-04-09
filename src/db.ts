import { drizzle } from "drizzle-orm/d1";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { eq } from "drizzle-orm";

// ── Schema ──────────────────────────────────────────
export const lotteries = sqliteTable("lotteries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  eventUrl: text("event_url").notNull(),
  eventTitle: text("event_title").notNull(),
  seed: integer("seed").notNull(),
  winnerCount: integer("winner_count").notNull(),
  agents: text("agents", { mode: "json" })
    .$type<{ name: string; faction: string }[]>()
    .notNull(),
  winners: text("winners", { mode: "json" })
    .$type<{ name: string; faction: string }[]>()
    .notNull(),
  createdAt: text("created_at").notNull(),
});

// ── Init DB (run once per cold start) ───────────────
let initialized = false;

export function initDb(d1: D1Database) {
  const db = drizzle(d1);
  if (!initialized) {
    d1.exec(`
      CREATE TABLE IF NOT EXISTS lotteries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_url TEXT NOT NULL,
        event_title TEXT NOT NULL,
        seed INTEGER NOT NULL,
        winner_count INTEGER NOT NULL,
        agents TEXT NOT NULL,
        winners TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
    `);
    initialized = true;
  }
  return db;
}

// ── Operations ──────────────────────────────────────
export async function createLottery(
  db: ReturnType<typeof initDb>,
  data: {
    eventUrl: string;
    eventTitle: string;
    seed: number;
    winnerCount: number;
    agents: { name: string; faction: string }[];
    winners: { name: string; faction: string }[];
  }
) {
  const result = await db
    .insert(lotteries)
    .values({
      eventUrl: data.eventUrl,
      eventTitle: data.eventTitle,
      seed: data.seed,
      winnerCount: data.winnerCount,
      agents: data.agents,
      winners: data.winners,
      createdAt: new Date().toISOString(),
    })
    .returning();

  return result[0];
}

export async function getLotteryById(
  db: ReturnType<typeof initDb>,
  id: number
) {
  const result = await db
    .select()
    .from(lotteries)
    .where(eq(lotteries.id, id));
  return result[0] ?? null;
}
