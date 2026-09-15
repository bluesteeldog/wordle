'use client';

import { useEffect, useState } from 'react';
import GameBoard from '../components/GameBoard';
import Keyboard from '../components/Keyboard';
import Header from '../components/Header';
import { createInitialGameState, applyGuess } from '../lib/gameEngine';
import { getRandomWord, getDailyWord } from '../lib/wordList';

const WORD_LENGTH = 5;

export default function HomePage() {
  const [mode, setMode] = useState<'practice' | 'daily'>('practice');
  const [gameState, setGameState] = useState<any>(null);
  const [currentInput, setCurrentInput] = useState('');

  // Initialize game when mode changes
  useEffect(() => {
    const target = mode === 'daily' ? getDailyWord() : getRandomWord();
    setGameState(createInitialGameState(target, mode));
    setCurrentInput('');
  }, [mode]);

  function handlePhysicalKey(e: KeyboardEvent) {
    const key = e.key;

    if (key === 'Enter') {
      submitGuess();
    } else if (key === 'Backspace') {
      setCurrentInput((prev) => prev.slice(0, -1));
    } else if (/^[a-zA-Z]$/.test(key)) {
      setCurrentInput((prev) =>
        prev.length < WORD_LENGTH ? prev + key.toUpperCase() : prev
      );
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handlePhysicalKey);
    return () => window.removeEventListener('keydown', handlePhysicalKey);
  });

  function handleVirtualKey(key: string) {
    if (key === 'ENTER') {
      submitGuess();
    } else if (key === 'DEL') {
      setCurrentInput((prev) => prev.slice(0, -1));
    } else if (/^[A-Z]$/.test(key)) {
      setCurrentInput((prev) =>
        prev.length < WORD_LENGTH ? prev + key : prev
      );
    }
  }

  function submitGuess() {
    if (!gameState || gameState.status !== 'in-progress') return;
    if (currentInput.length !== WORD_LENGTH) return;

    const nextState = applyGuess(gameState, currentInput);
    setGameState(nextState);
    setCurrentInput('');
  }

  if (!gameState) {
    return <div>Loading game...</div>;
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-zinc-50">
      <Header mode={mode} onModeChange={setMode} />
      <GameBoard guesses={gameState.guesses} />
      <div className="mt-4 text-xl tracking-[0.3em]">
        {currentInput}
      </div>
      <div className="mt-6">
        <Keyboard onKey={handleVirtualKey} />
      </div>
      {gameState.status !== 'in-progress' && (
        <div className="mt-4 text-lg font-semibold">
          {gameState.status === 'won'
            ? 'You won!'
            : `You lost. The word was ${gameState.targetWord}.`}
        </div>
      )}
    </main>
  );
}
