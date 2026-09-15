# Implementation Roadmap – Wordle-like Game (Next.js)

## 1. MVP – Core Game in Next.js

### Milestone 1 – Project Setup

- [ ] Initialize Next.js app (`create-next-app`).
- [ ] Confirm styling choice (Tailwind vs CSS Modules).
- [ ] Set up basic layout in `app/page.jsx`.

### Milestone 2 – Game Logic

- [ ] Implement `lib/gameEngine.js`:
  - [ ] Function to evaluate a guess against the target word.
  - [ ] Function to build tile states (correct, wrong-position, absent).
  - [ ] Win/lose detection.

### Milestone 3 – MVP UI

- [ ] Create `components/GameBoard.jsx`.
- [ ] Create `components/Keyboard.jsx`.
- [ ] Wire them into `app/page.jsx`.
- [ ] Handle user input via keyboard and on-screen keyboard.
- [ ] Show basic win/lose state.

---

## 2. Phase 1 – Modes, Stats, and Persistence

### Milestone 4 – Modes

- [ ] Implement `lib/wordList.js` with static word list.
- [ ] Add daily vs practice mode selection.
- [ ] Ensure game state resets correctly when mode changes.

### Milestone 5 – Stats and Streaks

- [ ] Implement `lib/storage.js` as a localStorage wrapper.
- [ ] Track streak and basic stats.
- [ ] Create `components/StatsModal.jsx` and wire it to header.

### Milestone 6 – Accessibility & Visual Polish

- [ ] Color-blind mode and themes.
- [ ] Basic animations for tile reveals.
- [ ] Responsive layout.

---

## 3. Phase 2 – Cool Features

### Milestone 7 – Hard Mode & Hints

- [ ] Implement hard mode enforcement.
- [ ] Implement hint system (limited per game).

### Milestone 8 – Sharing & Social

- [ ] Text-based share results.
- [ ] Optional visual share.

---

## 4. Phase 3 – Backend-Enhanced Features

- [ ] API route for daily word.
- [ ] Leaderboards.
- [ ] Achievements and meta progression.

---

## 5. Progress Tracking

Update this file as milestones are completed, and cross-reference entries in `prompting-log.md` for major decisions.
