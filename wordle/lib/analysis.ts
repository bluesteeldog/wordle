import { evaluateGuess, type LetterStatus } from './gameEngine';
import { SOLUTION_WORDS, type WordPack } from './wordList';

export interface GuessAnalysis {
  guess: string;
  feedback: LetterStatus[];
  remainingCandidates: number;
}

function arraysEqual(a: LetterStatus[], b: LetterStatus[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((val, idx) => val === b[idx]);
}

export function computeGuessAnalyses(
  guesses: { word: string; result: LetterStatus[] }[],
  wordLength: number
): GuessAnalysis[] {
  let candidates = SOLUTION_WORDS.filter((w) => w.length === wordLength);

  const analyses: GuessAnalysis[] = [];

  for (const g of guesses) {
    candidates = candidates.filter((word) => {
      const feedback = evaluateGuess(word, g.word, wordLength);
      return arraysEqual(feedback, g.result);
    });

    analyses.push({
      guess: g.word,
      feedback: g.result,
      remainingCandidates: candidates.length,
    });
  }

  return analyses;
}

export interface OpeningRecommendation {
  word: string;
  description?: string;
}

const STATIC_OPENERS: Record<WordPack, Record<number, OpeningRecommendation[]>> = {
  default: {
    4: [{ word: 'TIME' }, { word: 'CODE' }],
    5: [{ word: 'CRANE' }, { word: 'SLATE' }, { word: 'WORLD' }],
    6: [{ word: 'PUZZLE' }, { word: 'OBJECT' }],
    7: [{ word: 'REQUEST' }, { word: 'NETWORK' }],
  },
  animals: {
    4: [{ word: 'LION' }, { word: 'WOLF' }],
    5: [{ word: 'TIGER' }, { word: 'HORSE' }],
    6: [{ word: 'MONKEY' }, { word: 'SPIDER' }],
    7: [{ word: 'GIRAFFE' }, { word: 'BUFFALO' }],
  },
  geography: {
    4: [{ word: 'OSLO' }, { word: 'LIMA' }],
    5: [{ word: 'PARIS' }, { word: 'TOKYO' }],
    6: [{ word: 'LONDON' }, { word: 'BERLIN' }],
    7: [{ word: 'NEWYORK' }, { word: 'CHICAGO' }],
  },
};

export function getOpeningRecommendations(
  pack: WordPack,
  wordLength: number
): OpeningRecommendation[] {
  return STATIC_OPENERS[pack]?.[wordLength] ?? [];
}
