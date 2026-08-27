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

const QUOTES = {
  short: [
    { text: "Simplicity is prerequisite for reliability.", author: "Edsger W. Dijkstra" },
    { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
    { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
    { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
    { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
    { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" }
  ],
  medium: [
    { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
    { text: "The most damaging phrase in the language is: We've always done it this way.", author: "Grace Hopper" },
    { text: "Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away.", author: "Antoine de Saint-Exupéry" },
    { text: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
    { text: "The best error message is the one that never shows up.", author: "Thomas Fuchs" }
  ],
  long: [
    { text: "Programs must be written for people to read, and only incidentally for machines to execute. Software engineering is the art of building systems that outlive their creators through clarity and elegance.", author: "Abelson & Sussman" },
    { text: "Premature optimization is the root of all evil in programming. Yet we should not pass up our opportunities in the critical five percent of code that truly dictates overall throughput and user experience.", author: "Donald Knuth" },
    { text: "Typography is the craft of endowing human language with a durable visual form, and typing is the rhythmic gateway through which human intent turns into modern software.", author: "Robert Bringhurst" }
  ]
};

const CODE_SNIPPETS = {
  javascript: [
    "const calculateWpm = (chars, seconds) => Math.round((chars / 5) / (seconds / 60));",
    "function debounce(fn, delay) { let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); }; }",
    "const items = await Promise.all(urls.map(async url => (await fetch(url)).json()));",
    "export const useStore = create((set) => ({ count: 0, inc: () => set((s) => ({ count: s.count + 1 })) }));"
  ],
  python: [
    "def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target: return mid",
    "class TypingEngine:\n    def __init__(self, mode='time'):\n        self.mode = mode\n        self.wpm = 0",
    "sorted_data = sorted(dataset.items(), key=lambda item: item[1], reverse=True)"
  ],
  html: [
    "<main class=\"flex min-h-screen items-center justify-center p-6 bg-slate-950 text-slate-100\">",
    "<button type=\"button\" class=\"px-4 py-2 rounded-lg bg-amber-500 font-mono text-sm hover:brightness-110 transition\">",
    "<section id=\"typing-area\" aria-label=\"Interactive Typing Test\" tabindex=\"0\">"
  ],
  sql: [
    "SELECT u.id, u.username, COUNT(t.id) AS total_tests, AVG(t.wpm) AS avg_wpm FROM users u JOIN tests t ON u.id = t.user_id GROUP BY u.id HAVING avg_wpm > 100 ORDER BY avg_wpm DESC;",
    "CREATE TABLE IF NOT EXISTS typing_sessions (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL, wpm NUMERIC(5,2) NOT NULL, accuracy NUMERIC(5,2) NOT NULL, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());"
  ]
};

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
  let rawWords: string[] = [];

  if (settings.mode === 'quote') {
    const quotesList = QUOTES[settings.quoteOption];
    const selectedQuote = getRandomElement(quotesList);
    rawWords = selectedQuote.text.split(' ');
  } else if (settings.mode === 'code') {
    const codeList = CODE_SNIPPETS[settings.codeOption];
    const selectedCode = getRandomElement(codeList);
    rawWords = selectedCode.replace(/\n/g, ' ↵ ').split(' ').filter(w => w.length > 0);
  } else if (settings.mode === 'words') {
    const count = settings.wordOption;
    for (let i = 0; i < count; i++) {
      let word = getRandomElement(COMMON_WORDS);
      word = applyModifiers(word, settings.numbers, settings.punctuation);
      rawWords.push(word);
    }
  } else {
    for (let i = 0; i < 120; i++) {
      let word = getRandomElement(COMMON_WORDS);
      word = applyModifiers(word, settings.numbers, settings.punctuation);
      rawWords.push(word);
    }
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
