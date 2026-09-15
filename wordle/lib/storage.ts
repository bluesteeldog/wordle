const STATS_KEY = 'wordle_stats';

export interface Stats {
  gamesPlayed: number;
  wins: number;
  guessDistribution: Record<number, number>;
  currentStreak: number;
  maxStreak: number;
}

export function loadStats(): Stats | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STATS_KEY);
    return raw ? (JSON.parse(raw) as Stats) : null;
  } catch {
    return null;
  }
}

export function saveStats(stats: Stats): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // ignore
  }
}
