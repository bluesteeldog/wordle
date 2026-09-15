# Technical Plan – Wordle-like Game (Next.js)

## 1. Stack Decision

- **Framework**: Next.js (latest, App Router).
- **Language**: JavaScript (TypeScript can be added later if desired).
- **Styling**: Start with simple CSS Modules or Tailwind CSS (to be confirmed).
- **Deployment**: Vercel.

---

## 2. High-Level Architecture

### 2.1 App Structure (App Router)

- `app/` directory:
  - `app/page.jsx`: main game page (MVP).
  - Later: `app/stats/page.jsx`, `app/settings/page.jsx` for separate pages.
- Shared components:
  - `components/GameBoard.jsx`
  - `components/Keyboard.jsx`
  - `components/Header.jsx`
  - `components/StatsModal.jsx`
  - `components/SettingsModal.jsx`

### 2.2 Logic and Utilities

- `lib/gameEngine.js`:
  - Pure functions for game logic:
    - `createInitialGameState(mode)`
    - `evaluateGuess(targetWord, guess)`
    - `applyGuessToState(state, guessResult)`
    - `isGameOver(state)`

- `lib/wordList.js`:
  - Load word lists.
  - `getRandomWord()` for practice mode.
  - `getDailyWord(date)` for daily mode.

- `lib/storage.js`:
  - Wrapper around `localStorage` for:
    - Stats.
    - Streaks.
    - Preferences.

---

## 3. Data Structures

### 3.1 Game State

```js
{
  mode: 'daily' | 'practice' | 'hard',
  targetWord: 'CRANE',
  guesses: [
    {
      word: 'BRAVE',
      result: ['wrong-position', 'correct', 'absent', 'correct', 'absent']
    }
  ],
  status: 'in-progress' | 'won' | 'lost',
  maxAttempts: 6
}
```

### 3.2 Stats

```js
{
  gamesPlayed: 0,
  wins: 0,
  guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
  currentStreak: 0,
  maxStreak: 0
}
```

---

## 4. Implementation Plan (Technical)

1. **Bootstrap Next.js app**
   - `npx create-next-app@latest`.
   - Choose App Router.

2. **Implement core game logic (`lib/gameEngine.js`)**
   - Guess evaluation and tile coloring.
   - Win/lose checks.

3. **Create MVP UI**
   - `app/page.jsx` as a client component.
   - Basic board rendering and keyboard input.

4. **Integrate word list (`lib/wordList.js`)**
   - Static word list file in `public` or `lib`.
   - Functions for daily/practice modes.

5. **Add persistence (`lib/storage.js`)**
   - LocalStorage-based stats and preferences.

6. **Refine UX and add modes**
   - Mode selector in `Header`.
   - Stats and settings modals/pages.

---

## 5. Future Backend Plan

- Use Next.js API routes (`app/api/*`) for:
  - Daily word generation from server.
  - Leaderboard submissions and retrieval.
- Backing store options:
  - Vercel KV, Supabase, or a simple Postgres/PlanetScale DB.

This section will be expanded once we commit to backend features.
