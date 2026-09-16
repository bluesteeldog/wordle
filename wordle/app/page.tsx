'use client';

import { useEffect, useState } from 'react';
import GameBoard from '../components/GameBoard';
import Keyboard from '../components/Keyboard';
import Sidebar, { ModeOption, type MatchType } from '../components/Sidebar';
import StatsModal from '../components/StatsModal';
import {
  createInitialGameState,
  applyGuess,
  enableTwoPlayer,
  useHint,
  type GameState,
} from '../lib/gameEngine';
import { getRandomWord, getDailyWord, type WordPack } from '../lib/wordList';
import { loadStats, saveStats, type Stats } from '../lib/storage';
import {
  computeGuessAnalyses,
  type GuessAnalysis,
  getOpeningRecommendations,
} from '../lib/analysis';

export default function HomePage() {
  const [mode, setMode] = useState<ModeOption>('practice');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentInput, setCurrentInput] = useState('');
  const [hardMode, setHardMode] = useState(false);
  const [wordLength, setWordLength] = useState(5);
  const [isTwoPlayer, setIsTwoPlayer] = useState(false);
  const [p1RoundWins, setP1RoundWins] = useState(0);
  const [p2RoundWins, setP2RoundWins] = useState(0);
  const [matchType, setMatchType] = useState<MatchType>('endless');
  const [wordPack, setWordPack] = useState<WordPack>('default');
  const [stats, setStats] = useState<Stats | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [guessAnalysis, setGuessAnalysis] = useState<GuessAnalysis[] | null>(null);

  // Load stats on mount
  useEffect(() => {
    setStats(loadStats());
  }, []);

  // Initialize game when mode or key settings change
  useEffect(() => {
    const target =
      mode === 'daily'
        ? getDailyWord(wordPack, wordLength)
        : getRandomWord(wordPack, wordLength);
    const config = {
      wordLength,
      maxAttempts: mode === 'timed' || mode === 'blitz' ? 6 : 6,
      hardMode,
      letterBudget: mode === 'budget' ? 3 : undefined,
    };
    let state = createInitialGameState(target, mode, config);
    if (isTwoPlayer) {
      state = enableTwoPlayer(state);
    }
    setGameState(state);
    setCurrentInput('');
    setGuessAnalysis(null);

    // set timer
    if (mode === 'timed') {
      setTimeRemaining(90);
    } else if (mode === 'blitz') {
      setTimeRemaining(180);
    } else {
      setTimeRemaining(null);
    }
  }, [mode, hardMode, wordLength, isTwoPlayer, wordPack]);

  // Timer effect
  useEffect(() => {
    if (timeRemaining === null || !gameState || gameState.status !== 'in-progress') return;
    if (timeRemaining <= 0) {
      setGameState({ ...gameState, status: 'timeout' });
      return;
    }
    const id = window.setTimeout(() => {
      setTimeRemaining((t) => (t === null ? t : t - 1));
    }, 1000);
    return () => window.clearTimeout(id);
  }, [timeRemaining, gameState]);

  function handlePhysicalKey(e: KeyboardEvent) {
    const key = e.key;

    if (key === 'Enter') {
      submitGuess();
    } else if (key === 'Backspace') {
      setCurrentInput((prev) => prev.slice(0, -1));
    } else if (/^[a-zA-Z]$/.test(key)) {
      setCurrentInput((prev) =>
        gameState && prev.length < gameState.config.wordLength
          ? prev + key.toUpperCase()
          : prev
      );
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handlePhysicalKey);
    return () => window.removeEventListener('keydown', handlePhysicalKey);
  });

  function validateHardModeConstraints(nextGuess: string): boolean {
    if (!gameState || !gameState.config.hardMode) return true;
    // Enforce that all revealed greens and yellows are respected
    const guessUpper = nextGuess.toUpperCase();

    // Track letters that must appear and exact positions
    const requiredLetters = new Set<string>();
    const requiredPositions: Record<number, string> = {};

    for (const g of gameState.guesses) {
      g.result.forEach((status, idx) => {
        const letter = g.word[idx];
        if (status === 'correct') {
          requiredPositions[idx] = letter;
          requiredLetters.add(letter);
        } else if (status === 'present') {
          requiredLetters.add(letter);
        }
      });
    }

    // Check positions
    for (const [idxStr, letter] of Object.entries(requiredPositions)) {
      const idx = Number(idxStr);
      if (guessUpper[idx] !== letter) return false;
    }

    // Check required letters present somewhere
    for (const letter of requiredLetters) {
      if (!guessUpper.includes(letter)) return false;
    }

    return true;
  }

  function handleVirtualKey(key: string) {
    if (key === 'ENTER') {
      submitGuess();
    } else if (key === 'DEL') {
      setCurrentInput((prev) => prev.slice(0, -1));
    } else if (/^[A-Z]$/.test(key)) {
      setCurrentInput((prev) =>
        gameState && prev.length < gameState.config.wordLength ? prev + key : prev
      );
    }
  }

  function updateStatsOnGameEnd(finalState: GameState) {
    if (!stats) {
      const empty: Stats = {
        gamesPlayed: 0,
        wins: 0,
        guessDistribution: {},
        currentStreak: 0,
        maxStreak: 0,
      };
      setStats(empty);
    }
    const current = stats ?? {
      gamesPlayed: 0,
      wins: 0,
      guessDistribution: {},
      currentStreak: 0,
      maxStreak: 0,
    };

    const next: Stats = { ...current };
    next.gamesPlayed += 1;

    if (finalState.status === 'won') {
      next.wins += 1;
      next.currentStreak += 1;
      if (next.currentStreak > next.maxStreak) next.maxStreak = next.currentStreak;
      const guessesUsed = finalState.guesses.length;
      next.guessDistribution[guessesUsed] =
        (next.guessDistribution[guessesUsed] ?? 0) + 1;
    } else {
      next.currentStreak = 0;
    }

    setStats(next);
    saveStats(next);
  }

  function submitGuess() {
    if (!gameState || gameState.status !== 'in-progress') return;
    if (currentInput.length !== gameState.config.wordLength) return;

    // Letter budget enforcement for budget mode
    const budget = gameState.config.letterBudget;
    if (budget !== undefined) {
      const totalCounts: Record<string, number> = {};
      // Previous guesses
      for (const g of gameState.guesses) {
        for (const ch of g.word) {
          totalCounts[ch] = (totalCounts[ch] ?? 0) + 1;
        }
      }
      // Current guess
      for (const ch of currentInput.toUpperCase()) {
        totalCounts[ch] = (totalCounts[ch] ?? 0) + 1;
        if (totalCounts[ch] > budget) {
          // Reject guess if it exceeds budget
          return;
        }
      }
    }

    if (!validateHardModeConstraints(currentInput)) {
      // In a full app you might show a toast; for now just ignore invalid hard-mode guesses
      return;
    }

    const nextState = applyGuess(gameState, currentInput);
    setGameState(nextState);
    setCurrentInput('');

    if (nextState.status === 'won' || nextState.status === 'lost') {
      updateStatsOnGameEnd(nextState);
      const analyses = computeGuessAnalyses(
        nextState.guesses,
        nextState.config.wordLength
      );
      setGuessAnalysis(analyses);
    } else {
      setGuessAnalysis(null);
    }
  }

  if (!gameState) {
    return <div>Loading game...</div>;
  }

  const minutes = timeRemaining !== null ? Math.floor(timeRemaining / 60) : null;
  const seconds = timeRemaining !== null ? timeRemaining % 60 : null;
  const timerLabel =
    timeRemaining !== null
      ? `${minutes}:${seconds?.toString().padStart(2, '0')}`
      : null;

  const isTwoPlayerMode = gameState.players.enabled;
  const currentPlayerLabel = isTwoPlayerMode
    ? gameState.players.current === 'player1'
      ? 'Player 1'
      : 'Player 2'
    : null;

  const player1Stats = gameState.players.stats.player1;
  const player2Stats = gameState.players.stats.player2;

  const openingRecommendations = getOpeningRecommendations(wordPack, wordLength);

  const maxRounds =
    matchType === 'firstTo3' ? 3 : matchType === 'firstTo5' ? 5 : Infinity;
  const matchWinner =
    maxRounds !== Infinity &&
    (p1RoundWins >= maxRounds ? 'player1' : p2RoundWins >= maxRounds ? 'player2' : null);

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-zinc-50">
      <Sidebar
        mode={mode}
        onModeChange={setMode}
        wordLength={wordLength}
        onWordLengthChange={setWordLength}
        hardMode={hardMode}
        onHardModeChange={setHardMode}
        onShowStats={() => setShowStats(true)}
        twoPlayerEnabled={isTwoPlayer}
        onTwoPlayerToggle={() => setIsTwoPlayer((v) => !v)}
        matchType={matchType}
        onMatchTypeChange={setMatchType}
        wordPack={wordPack}
        onWordPackChange={setWordPack}
      />
      <div className="ml-56 flex flex-col items-center justify-center min-h-screen p-4">
        <div className="flex flex-col gap-2 w-full max-w-md mb-4 text-sm text-zinc-500">
          <div className="flex justify-between">
            <div>Mode: {mode.toUpperCase()}</div>
            {timerLabel && <div>Time: {timerLabel}</div>}
          </div>

          {isTwoPlayerMode && (
            <div className="flex flex-col gap-1 text-xs text-zinc-400">
              <div className="flex justify-between items-center">
                <div>
                  Turn:{' '}
                  <span className="font-semibold text-zinc-200">
                    {currentPlayerLabel}
                  </span>
                </div>
                <div className="flex gap-3">
                  <span>
                    Match score – P1: {p1RoundWins} | P2: {p2RoundWins}
                    {matchType !== 'endless' && ` (first to ${maxRounds})`}
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <span>
                  P1 (this round) – G: {player1Stats.guesses} W: {player1Stats.wins}
                </span>
                <span>
                  P2 (this round) – G: {player2Stats.guesses} W: {player2Stats.wins}
                </span>
              </div>
            </div>
          )}
        </div>
        <GameBoard
          guesses={gameState.guesses}
          wordLength={gameState.config.wordLength}
          maxAttempts={gameState.config.maxAttempts}
        />
        <div className="mt-4 text-xl tracking-[0.3em] min-h-[1.5em]">
          {currentInput}
        </div>
        <div className="mt-6 flex flex-col items-center gap-3">
          <Keyboard onKey={handleVirtualKey} />
          {isTwoPlayerMode && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  // Update match score based on the last winner of the round
                  if (gameState.status !== 'in-progress') {
                    if (gameState.players.lastWinner === 'player1') {
                      setP1RoundWins((v) => v + 1);
                    } else if (gameState.players.lastWinner === 'player2') {
                      setP2RoundWins((v) => v + 1);
                    }
                  }

                  const target =
                    mode === 'daily'
                      ? getDailyWord(wordPack, wordLength)
                      : getRandomWord(wordPack, wordLength);
                  const config = {
                    wordLength,
                    maxAttempts:
                      mode === 'timed' || mode === 'blitz' ? 6 : 6,
                    hardMode,
                  };
                  let next = createInitialGameState(target, mode, config);
                  next = enableTwoPlayer(next);
                  setGameState(next);
                  setCurrentInput('');
                  setGuessAnalysis(null);
                }}
                className="text-xs px-3 py-1 rounded border border-zinc-600 text-zinc-300 hover:bg-zinc-100 hover:text-zinc-900 hover:border-zinc-400 transition-colors disabled:opacity-50"
                disabled={matchWinner !== null && matchType !== 'endless'}
              >
                {matchWinner && matchType !== 'endless'
                  ? 'Match finished'
                  : 'New round (two-player)'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setP1RoundWins(0);
                  setP2RoundWins(0);
                }}
                className="text-xs px-3 py-1 rounded border border-zinc-700 text-zinc-400 hover:bg-zinc-800"
              >
                Reset match
              </button>
            </div>
          )}
        </div>
        {gameState.status !== 'in-progress' && (
          <div className="mt-4 text-lg font-semibold text-center">
            {!isTwoPlayerMode && gameState.status === 'won' && 'You won!'}
            {!isTwoPlayerMode && gameState.status === 'lost' &&
              `You lost. The word was ${gameState.targetWord}.`}
            {!isTwoPlayerMode && gameState.status === 'timeout' &&
              `Time's up! The word was ${gameState.targetWord}.`}

            {isTwoPlayerMode && gameState.status === 'won' && (
              <>
                {gameState.players.lastWinner === 'player1' &&
                  `Player 1 wins this round! The word was ${gameState.targetWord}.`}
                {gameState.players.lastWinner === 'player2' &&
                  `Player 2 wins this round! The word was ${gameState.targetWord}.`}
              </>
            )}

            {isTwoPlayerMode && gameState.status === 'lost' &&
              `Nobody guessed it. The word was ${gameState.targetWord}.`}

            {isTwoPlayerMode && gameState.status === 'timeout' &&
              `Time's up! Nobody guessed it. The word was ${gameState.targetWord}.`}

            {isTwoPlayerMode && matchWinner && matchType !== 'endless' && (
              <div className="mt-2 text-sm text-zinc-300">
                {matchWinner === 'player1'
                  ? 'Player 1 wins the match!'
                  : 'Player 2 wins the match!'}
              </div>
            )}
          </div>
        )}

        {openingRecommendations.length > 0 && gameState.guesses.length === 0 && (
          <div className="mt-4 w-full max-w-md text-xs text-zinc-400">
            <div className="mb-1 font-semibold text-zinc-300">
              Recommended openers
            </div>
            <div className="flex flex-wrap gap-2">
              {openingRecommendations.map((rec) => (
                <button
                  key={rec.word}
                  type="button"
                  onClick={() => setCurrentInput(rec.word)}
                  className="px-2 py-1 rounded border border-zinc-700 hover:bg-zinc-800 font-mono"
                >
                  {rec.word}
                </button>
              ))}
            </div>
          </div>
        )}

        {guessAnalysis && guessAnalysis.length > 0 && (
          <div className="mt-4 w-full max-w-md text-xs text-zinc-300">
            <h3 className="font-semibold mb-2">Guess analysis</h3>
            <div className="space-y-1">
              {guessAnalysis.map((a, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-zinc-900/60 px-2 py-1 rounded"
                >
                  <div>
                    <span className="font-mono">{a.guess}</span>
                    <span className="ml-2 text-[10px] text-zinc-500">
                      Guess {index + 1}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Remaining candidates: {a.remainingCandidates}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <StatsModal open={showStats} onClose={() => setShowStats(false)} stats={stats} />
    </main>
  );
}
