'use client';

import styles from './Header.module.css';

interface HeaderProps {
  mode: 'practice' | 'daily';
  onModeChange: (mode: 'practice' | 'daily') => void;
}

export default function Header({ mode, onModeChange }: HeaderProps) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Next Wordle</h1>
      <div className={styles.modes}>
        {(['practice', 'daily'] as const).map((m) => (
          <button
            key={m}
            onClick={() => onModeChange(m)}
            className={`${styles.modeButton} ${mode === m ? styles.active : ''}`}
            type="button"
          >
            {m.toUpperCase()}
          </button>
        ))}
      </div>
    </header>
  );
}
