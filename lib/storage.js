const STATS_KEY = 'wordle_stats';

export function loadStats() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STATS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStats(stats) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // ignore
  }
}