export interface Agent {
  name: string;
  faction: "enl" | "res";
}

/**
 * Mulberry32 PRNG — 确定性伪随机数生成器
 * 同一个 seed 永远产生相同的随机数序列
 */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Fisher-Yates shuffle，使用确定性 PRNG
 * 取前 count 个作为中奖者
 */
export function draw(
  agents: Agent[],
  count: number,
  seed: number
): Agent[] {
  if (count > agents.length) {
    throw new Error(
      `抽奖人数 (${count}) 不能大于总人数 (${agents.length})`
    );
  }

  const rng = mulberry32(seed);
  const arr = [...agents];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr.slice(0, count);
}
