const WORDS: string[] = [
  'CRANE',
  'BRAVE',
  'SLATE',
  'TRACE',
  'PLANT',
  'SHINE',
  'WORLD',
];

export function getRandomWord(): string {
  const index = Math.floor(Math.random() * WORDS.length);
  return WORDS[index];
}

export function getDailyWord(date: Date = new Date()): string {
  const daySeed = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  let hash = 0;
  for (let i = 0; i < daySeed.length; i++) {
    hash = (hash * 31 + daySeed.charCodeAt(i)) >>> 0;
  }
  const index = hash % WORDS.length;
  return WORDS[index];
}
