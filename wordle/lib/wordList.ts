export type WordPack = 'default' | 'animals' | 'geography';

const WORD_PACKS: Record<WordPack, string[]> = {
  default: [
    // 4-letter
    'TIME', 'WORD', 'GAME', 'CODE', 'HARD', 'EASY', 'LENS', 'TASK', 'PLAY', 'UNIT',
    // 5-letter
    'CRANE', 'BRAVE', 'SLATE', 'TRACE', 'PLANT', 'SHINE', 'WORLD', 'LOGIC', 'QUERY',
    'TOKEN', 'ARRAY', 'STACK', 'QUEUE', 'INPUT', 'DEBUG', 'GUESS',
    // 6-letter
    'PUZZLE', 'OBJECT', 'SCRIPT', 'BINARY', 'LOGICS', 'PARSED', 'STRING', 'BUTTON',
    'SCREEN', 'RANDOM', 'TARGET', 'STREAK', 'STATUE', 'VECTOR',
    // 7-letter
    'REQUEST', 'REACTOR', 'PROMISE', 'CONSOLE', 'DISPLAY', 'ANALYZE', 'NETWORK',
    'CONTENT', 'ELEGANT', 'PACKAGE', 'LINTER',
  ],
  animals: [
    // 4-letter
    'LION', 'WOLF', 'DEER', 'MULE', 'DOVE', 'CRAB', 'SWAN', 'PUGS', 'MOLE', 'BASS',
    // 5-letter
    'HORSE', 'SHEEP', 'TIGER', 'ZEBRA', 'EAGLE', 'OTTER', 'PANDA', 'HYENA', 'KOALA',
    'RAVEN', 'WHALE', 'MOUSE', 'SHARK', 'SNAKE',
    // 6-letter
    'MONKEY', 'RABBIT', 'DONKEY', 'SPIDER', 'TURTLE', 'SALMON', 'PIGEON', 'JAGUAR',
    'PANTER',
    'COYOTE', 'GOPHER',
    // 7-letter
    'GIRAFFE', 'LEOPARD', 'BUFFALO', 'PENGUIN', 'HAMSTER', 'CHICKEN', 'DOLPHIN',
    'FLAMING',
    'LOBSTER', 'MEERKAT',
  ],
  geography: [
    // 4-letter
    'OSLO', 'LIMA', 'PERU', 'DOHA', 'KENT', 'YORK', 'ROME', 'BALI', 'CUBA', 'MALI',
    // 5-letter
    'PARIS', 'TOKYO', 'DELHI', 'CAIRO', 'LEEDS', 'MIAMI', 'SYDNY',
    'SOFIA', 'HANOI', 'DUBAI', 'OSAKA', 'KYOTO', 'TAMPA',
    // 6-letter
    'LONDON', 'ATHENS', 'BERLIN', 'MADRID', 'NAPLES', 'VIENNA', 'ZAGREB', 'MANILA',
    'BRISBA',
    // 7-letter
    'NEWYORK', 'CHICAGO', 'HAMBURG', 'WARSAW', 'LISBON', 'GENEVA', 'MONTREA',
    'JAKARTA', 'SANTIAG',
  ],
};

export function getRandomWord(
  pack: WordPack = 'default',
  length = 5
): string {
  const list = WORD_PACKS[pack].filter((w) => w.length === length);
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

export function getDailyWord(
  pack: WordPack = 'default',
  length = 5,
  date: Date = new Date()
): string {
  const list = WORD_PACKS[pack].filter((w) => w.length === length);
  const daySeed = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${pack}-${length}`;
  let hash = 0;
  for (let i = 0; i < daySeed.length; i++) {
    hash = (hash * 31 + daySeed.charCodeAt(i)) >>> 0;
  }
  const index = hash % list.length;
  return list[index];
}

export const SOLUTION_WORDS: string[] = WORD_PACKS.default;
