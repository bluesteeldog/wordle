"use client";

import React from "react";
import type { Stats } from "../lib/storage";

interface StatsModalProps {
  open: boolean;
  onClose: () => void;
  stats: Stats | null;
}

export default function StatsModal({ open, onClose, stats }: StatsModalProps) {
  if (!open) return null;

  const gamesPlayed = stats?.gamesPlayed ?? 0;
  const wins = stats?.wins ?? 0;
  const winRate = gamesPlayed > 0 ? Math.round((wins / gamesPlayed) * 100) : 0;
  const currentStreak = stats?.currentStreak ?? 0;
  const maxStreak = stats?.maxStreak ?? 0;
  const guessDistribution = stats?.guessDistribution ?? {};

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 text-zinc-50 rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Statistics</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-zinc-400 hover:text-zinc-100"
          >
            Close
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6 text-center">
          <div>
            <div className="text-2xl font-semibold">{gamesPlayed}</div>
            <div className="text-[10px] uppercase text-zinc-400">Played</div>
          </div>
          <div>
            <div className="text-2xl font-semibold">{winRate}</div>
            <div className="text-[10px] uppercase text-zinc-400">Win %</div>
          </div>
          <div>
            <div className="text-2xl font-semibold">{currentStreak}</div>
            <div className="text-[10px] uppercase text-zinc-400">Current Streak</div>
          </div>
          <div>
            <div className="text-2xl font-semibold">{maxStreak}</div>
            <div className="text-[10px] uppercase text-zinc-400">Max Streak</div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2">Guess distribution</h3>
          <div className="flex flex-col gap-1 text-xs">
            {[1, 2, 3, 4, 5, 6].map((i) => {
              const count = guessDistribution[i] ?? 0;
              const maxCount = Math.max(...Object.values(guessDistribution), 1);
              const width = maxCount > 0 ? Math.max((count / maxCount) * 100, 10) : 10;
              return (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-3 text-right text-[10px]">{i}</span>
                  <div className="flex-1 bg-zinc-800 rounded overflow-hidden">
                    <div
                      className="bg-zinc-100 text-zinc-900 px-1 py-0.5 text-[10px]"
                      style={{ width: `${width}%` }}
                    >
                      {count}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
