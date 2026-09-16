"use client";

import React from "react";

export type SidebarSection =
  | "modes"
  | "wordLength"
  | "stats"
  | "multiplayer"
  | "hints";

export type ModeOption = "practice" | "daily" | "timed" | "blitz" | "challenge";

export type MatchType = 'endless' | 'firstTo3' | 'firstTo5';

interface SidebarProps {
  mode: ModeOption;
  onModeChange: (mode: ModeOption) => void;
  wordLength: number;
  onWordLengthChange: (len: number) => void;
  hardMode: boolean;
  onHardModeChange: (enabled: boolean) => void;
  onShowStats: () => void;
  twoPlayerEnabled: boolean;
  onTwoPlayerToggle: () => void;
  matchType: MatchType;
  onMatchTypeChange: (type: MatchType) => void;
  wordPack: 'default' | 'animals' | 'geography';
  onWordPackChange: (pack: 'default' | 'animals' | 'geography') => void;
}

export default function Sidebar({
  mode,
  onModeChange,
  wordLength,
  onWordLengthChange,
  hardMode,
  onHardModeChange,
  onShowStats,
  twoPlayerEnabled,
  onTwoPlayerToggle,
  matchType,
  onMatchTypeChange,
  wordPack,
  onWordPackChange,
}: SidebarProps) {
  const wordLengths = [4, 5, 6, 7];

  return (
    <aside className="fixed left-0 top-0 h-full w-56 bg-zinc-900 text-zinc-50 border-r border-zinc-800 flex flex-col p-4 gap-6">
      <div>
        <h1 className="text-xl font-bold mb-2">Next Wordle</h1>
        <p className="text-xs text-zinc-400">Modes & Settings</p>
      </div>

      <div>
        <h2 className="text-sm font-semibold mb-1">Mode</h2>
        <div className="flex flex-col gap-1">
          {(["practice", "daily", "timed", "blitz", "challenge"] as ModeOption[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => onModeChange(m)}
              className={`text-left text-xs px-2 py-1 rounded border transition-colors ${
                mode === m
                  ? "bg-zinc-100 text-zinc-900 border-zinc-400"
                  : "border-transparent hover:bg-zinc-800"
              }`}
            >
              {m.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold mb-1">Word length</h2>
        <div className="flex flex-wrap gap-1">
          {wordLengths.map((len) => (
            <button
              key={len}
              type="button"
              onClick={() => onWordLengthChange(len)}
              className={`text-xs w-8 py-1 rounded border transition-colors ${
                wordLength === len
                  ? "bg-zinc-100 text-zinc-900 border-zinc-400"
                  : "border-transparent hover:bg-zinc-800"
              }`}
            >
              {len}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold mb-1">Rules</h2>
        <label className="flex items-center gap-2 text-xs cursor-pointer">
          <input
            type="checkbox"
            checked={hardMode}
            onChange={(e) => onHardModeChange(e.target.checked)}
          />
          Hard mode
        </label>
      </div>

      <div>
        <h2 className="text-sm font-semibold mb-1">Multiplayer</h2>
        <button
          type="button"
          onClick={onTwoPlayerToggle}
          className={`text-xs px-2 py-1 rounded border transition-colors ${
            twoPlayerEnabled
              ? "bg-zinc-100 text-zinc-900 border-zinc-400"
              : "border-transparent hover:bg-zinc-800"
          }`}
        >
          {twoPlayerEnabled ? "Two-player ON" : "Two-player OFF"}
        </button>
        {twoPlayerEnabled && (
          <div className="mt-2 text-xs">
            <div className="mb-1 font-semibold">Match type</div>
            <div className="flex flex-col gap-1">
              {(['endless', 'firstTo3', 'firstTo5'] as MatchType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => onMatchTypeChange(t)}
                  className={`text-left px-2 py-1 rounded border transition-colors ${
                    matchType === t
                      ? 'bg-zinc-100 text-zinc-900 border-zinc-400'
                      : 'border-transparent hover:bg-zinc-800'
                  }`}
                >
                  {t === 'endless' && 'Endless'}
                  {t === 'firstTo3' && 'First to 3'}
                  {t === 'firstTo5' && 'First to 5'}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-sm font-semibold mb-1">Word pack</h2>
        <div className="flex flex-col gap-1 text-xs">
          {(['default', 'animals', 'geography'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onWordPackChange(p)}
              className={`text-left px-2 py-1 rounded border transition-colors ${
                wordPack === p
                  ? 'bg-zinc-100 text-zinc-900 border-zinc-400'
                  : 'border-transparent hover:bg-zinc-800'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <button
          type="button"
          onClick={onShowStats}
          className="text-xs px-2 py-1 rounded border border-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 hover:border-zinc-400 transition-colors"
        >
          View stats
        </button>
      </div>
    </aside>
  );
}
