const DEFAULT_WORD_LENGTH = 5;
const DEFAULT_MAX_ATTEMPTS = 6;

export type LetterStatus = 'correct' | 'present' | 'absent';

export interface GuessResult {
  word: string;
  result: LetterStatus[];
}

export interface GameState {
  mode: 'practice' | 'daily';
  targetWord: string;
  guesses: GuessResult[];
  status: 'in-progress' | 'won' | 'lost';
  maxAttempts: number;
}

// Evaluate a single guess against the target word
export function evaluateGuess(targetWord: string, guess: string): LetterStatus[] {
  const normalizedTarget = targetWord.toUpperCase();
  const normalizedGuess = guess.toUpperCase();

  if (
    normalizedTarget.length !== DEFAULT_WORD_LENGTH ||
    normalizedGuess.length !== DEFAULT_WORD_LENGTH
  ) {
    throw new Error(`Words must be ${DEFAULT_WORD_LENGTH} letters long.`);
  }

  const result: LetterStatus[] = Array(DEFAULT_WORD_LENGTH).fill('absent');
  const targetChars = normalizedTarget.split('');
  const guessChars = normalizedGuess.split('');

  const remainingTargetCounts: Record<string, number> = {};

  // First pass: mark correct positions
  for (let i = 0; i < DEFAULT_WORD_LENGTH; i++) {
    if (guessChars[i] === targetChars[i]) {
      result[i] = 'correct';
    } else {
      const ch = targetChars[i];
      remainingTargetCounts[ch] = (remainingTargetCounts[ch] || 0) + 1;
    }
  }

  // Second pass: mark present letters
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

export function createInitialGameState(targetWord: string, mode: 'practice' | 'daily'): GameState {
  return {
    mode,
    targetWord: targetWord.toUpperCase(),
    guesses: [],
    status: 'in-progress',
    maxAttempts: DEFAULT_MAX_ATTEMPTS,
  };
}

export function applyGuess(state: GameState, guess: string): GameState {
  if (state.status !== 'in-progress') return state;

  const result = evaluateGuess(state.targetWord, guess);
  const updatedGuesses: GuessResult[] = [
    ...state.guesses,
    { word: guess.toUpperCase(), result },
  ];

  let status: GameState['status'] = state.status;
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
