# Wordle-like Game – Vision and Features (Next.js)

## 1. Project Vision

Create a modern, fast, and fun word-guessing game inspired by Wordle, built with Next.js, that:
- Runs smoothly in the browser (mobile and desktop).
- Has replayability through multiple modes.
- Is easy to extend with new features and backend capabilities.

Primary outcome: **A playable MVP deployed on Vercel**, then iterative feature additions.

---

## 2. Core Gameplay (MVP)

- Fixed-length target word (start with 5 letters).
- Limited number of guesses (start with 6).
- Feedback per guess via colored tiles:
  - Correct letter, correct position.
  - Correct letter, wrong position.
  - Letter not in the word.
- Win/lose handling and game reset.

---

## 3. “Cool” Feature Set (Draft)

### 3.1 Game Modes

- **Daily Puzzle**
  - Same word for all players on a given day.
  - Initially client-side (date-seeded) to avoid backend.
  - Later, move to API route for more control.

- **Practice Mode**
  - Unlimited random puzzles from a word list.
  - Separate stats from daily mode.

- **Hard Mode**
  - Must reuse revealed letters in subsequent guesses.
  - Optional toggle.

- **Timed Mode (Stretch)**
  - Countdown timer with score based on speed.

### 3.2 Hints and Learning

- Optional hint system:
  - Reveal one random letter.
  - Reveal a structural hint (e.g., number of vowels).
- Post-game info:
  - Definition and example usage of the word.
  - (Later) integrate dictionary API.

### 3.3 Progression & Stats

- Streak tracking for daily mode.
- Basic stats:
  - Games played, win rate.
  - Guess distribution.
- Achievements (later):
  - Streak milestones.
  - Perfect/near-perfect games.

### 3.4 Visual/UX Enhancements

- Themes:
  - Light/Dark.
  - Later: extra themes (retro, high contrast).
- Accessibility:
  - Color-blind mode.
  - Keyboard shortcuts.
- Animations:
  - Tile reveal animations.
  - Win/lose transitions.

### 3.5 Sharing & Social (Phase 2+)

- Text-based share similar to classic Wordle.
- Optional image share.
- Friend challenge links with encoded word.
- Leaderboards for daily mode (requires backend).

---

## 4. Feature Prioritization

**MVP (High Priority):**
- Single mode game (practice or daily) with core mechanics.
- Working board, keyboard input, basic feedback.
- Reset/new game flow.

**Phase 1:**
- Daily vs practice mode switching.
- LocalStorage-based stats and streaks.
- Color-blind mode and basic themes.

**Phase 2:**
- Hard mode and hints.
- Sharing results.
- Animations and richer UI.

**Phase 3 (Advanced):**
- Friend challenge links.
- Leaderboards via API routes and database.
- Achievements and meta-progression.

---

## 5. Open Questions

- Final choice of styling approach (Tailwind vs CSS Modules vs styled-components).
- Whether to start with Next.js App Router or Pages Router (default to App Router unless changed).
- When to introduce backend/API features.
