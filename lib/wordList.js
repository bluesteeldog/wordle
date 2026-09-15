const WORDS = [
  'CRANE',
  'BRAVE',
  'SLATE',
  'TRACE',
  'PLANT',
  'SHINE',
  'WORLD',
];

export function getRandomWord() {
  const index = Math.floor(Math.random() * WORDS.length);
  return WORDS[index];
}

// Simple daily word based on date seed
export function getDailyWord(date = new Date()) {
  const daySeed = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  let hash = 0;
  for (let i = 0; i < daySeed.length; i++) {
    hash = (hash * 31 + daySeed.charCodeAt(i)) >>> 0;
  }
  const index = hash % WORDS.length;
  return WORDS[index];
}