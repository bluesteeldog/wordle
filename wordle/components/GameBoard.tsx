'use client';

import styles from './GameBoard.module.css';

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

interface Guess {
  word: string;
  result: string[];
}

interface GameBoardProps {
  guesses: Guess[];
}

export default function GameBoard({ guesses }: GameBoardProps) {
  const rows = [];

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const guess = guesses[i];
    rows.push(
      <div key={i} className={styles.row}>
        {Array.from({ length: WORD_LENGTH }).map((_, j) => {
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
