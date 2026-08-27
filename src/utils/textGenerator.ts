import type { TestSettings, WordData } from '../types/typing';

const COMMON_WORDS = [
  'the', 'be', 'of', 'and', 'a', 'to', 'in', 'he', 'have', 'it', 'that', 'for', 'they', 'I', 'with', 'as', 'not', 'on', 'she', 'at',
  'by', 'this', 'we', 'you', 'do', 'but', 'from', 'or', 'which', 'one', 'would', 'all', 'will', 'there', 'say', 'who', 'make', 'when', 'can', 'more',
  'if', 'no', 'man', 'out', 'other', 'so', 'what', 'time', 'up', 'go', 'about', 'than', 'into', 'could', 'state', 'only', 'new', 'year', 'some', 'take',
  'come', 'these', 'know', 'see', 'use', 'get', 'like', 'then', 'first', 'any', 'work', 'now', 'may', 'such', 'give', 'over', 'think', 'most', 'even', 'find',
  'day', 'also', 'after', 'way', 'many', 'must', 'look', 'before', 'great', 'back', 'through', 'long', 'where', 'much', 'should', 'well', 'people', 'down', 'own', 'just',
  'because', 'good', 'each', 'those', 'feel', 'seem', 'how', 'high', 'too', 'place', 'little', 'world', 'very', 'still', 'nation', 'hand', 'old', 'life', 'tell', 'write',
  'become', 'here', 'show', 'house', 'both', 'between', 'need', 'mean', 'call', 'develop', 'under', 'last', 'right', 'move', 'thing', 'general', 'school', 'never', 'same', 'another',
  'begin', 'while', 'number', 'part', 'turn', 'real', 'leave', 'might', 'want', 'point', 'form', 'off', 'child', 'few', 'small', 'since', 'against', 'ask', 'late', 'home',
  'interest', 'large', 'person', 'end', 'open', 'public', 'follow', 'during', 'present', 'without', 'again', 'hold', 'govern', 'around', 'possible', 'head', 'consider', 'word', 'program', 'problem',
  'however', 'lead', 'system', 'set', 'order', 'eye', 'plan', 'run', 'keep', 'face', 'fact', 'group', 'play', 'stand', 'increase', 'early', 'course', 'change', 'help', 'line'
];

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function applyModifiers(word: string, numbers: boolean, punctuation: boolean): string {
  let result = word;
  if (numbers && Math.random() < 0.25) {
    const num = Math.floor(Math.random() * 100).toString();
    result = Math.random() < 0.5 ? `${result}${num}` : num;
  }
  if (punctuation && Math.random() < 0.25) {
    const puncs = [',', '.', '!', '?', ';', ':', '"', "'", '(', ')'];
    const p = puncs[Math.floor(Math.random() * puncs.length)];
    if (p === '"' || p === "'") {
      result = `${p}${result}${p}`;
    } else if (p === '(' || p === ')') {
      result = `(${result})`;
    } else {
      result = `${result}${p}`;
    }
  }
  return result;
}

export function generateTestWords(settings: TestSettings): WordData[] {
  const rawWords: string[] = [];
  const count = settings.mode === 'words' ? settings.wordOption : 120;

  for (let i = 0; i < count; i++) {
    let word = getRandomElement(COMMON_WORDS);
    word = applyModifiers(word, settings.numbers, settings.punctuation);
    rawWords.push(word);
  }

  return rawWords.map((word, wordIndex) => ({
    id: `w-${wordIndex}-${Math.random().toString(36).substr(2, 5)}`,
    originalWord: word,
    chars: word.split('').map((char) => ({
      char,
      state: 'untyped' as const
    }))
  }));
}
