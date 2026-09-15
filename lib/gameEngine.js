// Basic configuration
const DEFAULT_WORD_LENGTH = 5;
const DEFAULT_MAX_ATTEMPTS = 6;

// Evaluate a single guess against the target word
// Returns an array of statuses per letter: 'correct' | 'present' | 'absent'
export function evaluateGuess(targetWord, guess) {
  const normalizedTarget = targetWord.toUpperCase();
  const normalizedGuess = guess.toUpperCase();

  if (
    normalizedTarget.length !== DEFAULT_WORD_LENGTH ||
    normalizedGuess.length !== DEFAULT_WORD_LENGTH
  ) {
    throw new Error(`Words must be ${DEFAULT_WORD_LENGTH} letters long.`);
  }

  const result = Array(DEFAULT_WORD_LENGTH).fill('absent');
  const targetChars = normalizedTarget.split('');
  const guessChars = normalizedGuess.split('');

  // First pass: mark correct positions
  const remainingTargetCounts = {};

  for (let i = 0; i < DEFAULT_WORD_LENGTH; i++) {
    if (guessChars[i] === targetChars[i]) {
      result[i] = 'correct';
    } else {
      const ch = targetChars[i];
      remainingTargetCounts[ch] = (remainingTargetCounts[ch] || 0) + 1;
    }
  }

  // Second pass: mark present letters (wrong position)
  for (let i = 0; i < DEFAULT_WORD_LENGTH; i++) {
    if (result[i] === 'correct') continue;

    const ch = guessChars[i];
    if (remainingTargetCounts[ch] && remainingTargetCounts[ch] > 0) {
      result[i] = 'present';
      remainingTargetCounts[ch] -= 1;
    }
  }

  return result;
}

// Create initial game state for a given target word
export function createInitialGameState(targetWord, mode = 'practice') {
  return {
    mode,
    targetWord: targetWord.toUpperCase(),
    guesses: [], // { word, result }[]
    status: 'in-progress', // 'in-progress' | 'won' | 'lost'
    maxAttempts: DEFAULT_MAX_ATTEMPTS,
  };
}

// Apply a guess to the game state
export function applyGuess(state, guess) {
  if (state.status !== 'in-progress') return state;

  const result = evaluateGuess(state.targetWord, guess);
  const updatedGuesses = [...state.guesses, { word: guess.toUpperCase(), result }];

  let status = state.status;
  if (result.every((r) => r === 'correct')) {
    status = 'won';
  } else if (updatedGuesses.length >= state.maxAttempts) {
    status = 'lost';
  }

  return {
    ...state,
    guesses: updatedGuesses,
    status,
  };
}