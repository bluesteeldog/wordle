'use client';

import styles from './GameBoard.module.css';

interface Guess {
  word: string;
  result: string[];
}

interface GameBoardProps {
  guesses: Guess[];
  wordLength: number;
  maxAttempts: number;
}

export default function GameBoard({ guesses, wordLength, maxAttempts }: GameBoardProps) {
  const rows = [];

  for (let i = 0; i < maxAttempts; i++) {
    const guess = guesses[i];
    rows.push(
      <div key={i} className={styles.row}>
        {Array.from({ length: wordLength }).map((_, j) => {
          const letter = guess ? guess.word[j] : '';
          const status = guess ? guess.result[j] : 'empty';

          return (
            <div
              key={j}
              className={`${styles.tile} ${styles[status] || ''}`}
            >
              {letter}
            </div>
          );
        })}
      </div>
    );
  }

  return <div className={styles.board}>{rows}</div>;
}
