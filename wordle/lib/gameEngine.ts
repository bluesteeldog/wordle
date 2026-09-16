export type LetterStatus = 'correct' | 'present' | 'absent';

export type GameMode =
  | 'practice'
  | 'daily'
  | 'timed'
  | 'blitz'
  | 'challenge'
  | 'budget';

export interface GameConfig {
  wordLength: number;
  maxAttempts: number;
  hardMode: boolean;
  letterBudget?: number; // max total uses per letter (for budget mode)
}

export interface GuessResult {
  word: string;
  result: LetterStatus[];
}

export interface PlayerRoundStats {
  guesses: number;
  wins: number;
}

export interface PlayersState {
  enabled: boolean;
  current: 'player1' | 'player2';
  stats: {
    player1: PlayerRoundStats;
    player2: PlayerRoundStats;
  };
  lastWinner: 'player1' | 'player2' | 'none' | null;
}

export interface HintsState {
  used: number;
  revealedPositions: number[];
}

export interface GameState {
  mode: GameMode;
  config: GameConfig;
  targetWord: string;
  guesses: GuessResult[];
  status: 'in-progress' | 'won' | 'lost' | 'timeout';
  players: PlayersState;
  hints: HintsState;
}

// Evaluate a single guess against the target word
export function evaluateGuess(targetWord: string, guess: string, wordLength: number): LetterStatus[] {
  const normalizedTarget = targetWord.toUpperCase();
  const normalizedGuess = guess.toUpperCase();

  if (
    normalizedTarget.length !== wordLength ||
    normalizedGuess.length !== wordLength
  ) {
    throw new Error(`Words must be ${wordLength} letters long.`);
  }

  const result: LetterStatus[] = Array(wordLength).fill('absent');
  const targetChars = normalizedTarget.split('');
  const guessChars = normalizedGuess.split('');

  const remainingTargetCounts: Record<string, number> = {};

  // First pass: mark correct positions
  for (let i = 0; i < wordLength; i++) {
    if (guessChars[i] === targetChars[i]) {
      result[i] = 'correct';
    } else {
      const ch = targetChars[i];
      remainingTargetCounts[ch] = (remainingTargetCounts[ch] || 0) + 1;
    }
  }

  // Second pass: mark present letters
  for (let i = 0; i < wordLength; i++) {
    if (result[i] === 'correct') continue;

    const ch = guessChars[i];
    if (remainingTargetCounts[ch] && remainingTargetCounts[ch] > 0) {
      result[i] = 'present';
      remainingTargetCounts[ch] -= 1;
    }
  }

  return result;
}

export function createInitialGameState(
  targetWord: string,
  mode: GameMode,
  config: Partial<GameConfig> = {}
): GameState {
  const finalConfig: GameConfig = {
    wordLength: config.wordLength ?? 5,
    maxAttempts: config.maxAttempts ?? 6,
    hardMode: config.hardMode ?? false,
  };

  return {
    mode,
    config: finalConfig,
    targetWord: targetWord.toUpperCase(),
    guesses: [],
    status: 'in-progress',
    players: {
      enabled: false,
      current: 'player1',
      stats: {
        player1: { guesses: 0, wins: 0 },
        player2: { guesses: 0, wins: 0 },
      },
      lastWinner: null,
    },
    hints: {
      used: 0,
      revealedPositions: [],
    },
  };
}

export function applyGuess(state: GameState, guess: string): GameState {
  if (state.status !== 'in-progress') return state;

  const result = evaluateGuess(state.targetWord, guess, state.config.wordLength);
  const updatedGuesses: GuessResult[] = [
    ...state.guesses,
    { word: guess.toUpperCase(), result },
  ];

  let status: GameState['status'] = state.status;

  let players = state.players;

  if (players.enabled) {
    const current = players.current;

    // Update guess count for the player who just guessed
    players = {
      ...players,
      stats: {
        ...players.stats,
        [current]: {
          ...players.stats[current],
          guesses: players.stats[current].guesses + 1,
        },
      },
    };

    if (result.every((r) => r === 'correct')) {
      status = 'won';
      players = {
        ...players,
        stats: {
          ...players.stats,
          [current]: {
            ...players.stats[current],
            wins: players.stats[current].wins + 1,
          },
        },
        lastWinner: current,
      };
      // Do not switch current player on win
    } else if (updatedGuesses.length >= state.config.maxAttempts) {
      status = 'lost';
      players = {
        ...players,
        lastWinner: 'none',
      };
      // Do not switch current player on final losing guess
    } else {
      // Switch turns only if the game continues
      players = {
        ...players,
        current: current === 'player1' ? 'player2' : 'player1',
        lastWinner: null,
      };
    }
  } else {
    // Single-player behaviour
    if (result.every((r) => r === 'correct')) {
      status = 'won';
    } else if (updatedGuesses.length >= state.config.maxAttempts) {
      status = 'lost';
    }
  }

  return {
    ...state,
    guesses: updatedGuesses,
    status,
    players,
  };
}

export function enableTwoPlayer(state: GameState): GameState {
  return {
    ...state,
    players: {
      enabled: true,
      current: 'player1',
      stats: {
        player1: { guesses: 0, wins: 0 },
        player2: { guesses: 0, wins: 0 },
      },
      lastWinner: null,
    },
  };
}

export function useHint(state: GameState): GameState {
  if (state.status !== 'in-progress') return state;
  const { wordLength } = state.config;
  const availablePositions = Array.from({ length: wordLength }, (_, i) => i).filter(
    (i) => !state.hints.revealedPositions.includes(i)
  );
  if (availablePositions.length === 0) return state;
  const randomIndex =
    availablePositions[Math.floor(Math.random() * availablePositions.length)];
  return {
    ...state,
    hints: {
      used: state.hints.used + 1,
      revealedPositions: [...state.hints.revealedPositions, randomIndex],
    },
  };
}
