'use client';

import styles from './Keyboard.module.css';

const ROWS: string[][] = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['ENTER','Z','X','C','V','B','N','M','DEL'],
];

interface KeyboardProps {
  onKey: (key: string) => void;
}

export default function Keyboard({ onKey }: KeyboardProps) {
  return (
    <div className={styles.keyboard}>
      {ROWS.map((row, i) => (
        <div key={i} className={styles.row}>
          {row.map((key) => (
            <button
              key={key}
              className={styles.key}
              onClick={() => onKey(key)}
              type="button"
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
