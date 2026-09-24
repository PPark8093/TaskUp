export type Difficulty = "easy" | "normal" | "hard";

export const DIFFICULTY_INFO: Record<Difficulty, { label: string; xp: number }> = {
  easy: { label: "쉬움", xp: 10 },
  normal: { label: "보통", xp: 20 },
  hard: { label: "어려움", xp: 30 },
};

export interface Task {
  id: string;
  title: string;
  difficulty: Difficulty;
  dueDate: string | null; // "YYYY-MM-DD"
  done: boolean;
  xpReward: number;
  createdAt: number; // ms
  completedAt: number | null; // ms
}

// 레벨 L → L+1 에 필요한 경험치 = L × 50 (1→2: 50, 2→3: 100, 3→4: 150 ...)
export function getLevelInfo(totalXp: number) {
  let level = 1;
  let remaining = totalXp;
  while (remaining >= level * 50) {
    remaining -= level * 50;
    level++;
  }
  return { level, xpInto: remaining, xpNeeded: level * 50 };
}

export function formatDate(ms: number): string {
  const d = new Date(ms);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export function isValidDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
}
