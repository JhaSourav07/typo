import { useState, useEffect, useRef, useCallback } from 'react';
import type {
  TestSettings,
  EngineStatus,
  WordData,
  TimelineDataPoint,
  KeyAccuracyStats,
  TestResult
} from '../types/typing';
import { generateTestWords } from '../utils/textGenerator';
import {
  calculateRawWpm,
  calculateNetWpm,
  calculateAccuracy,
  calculateConsistency
} from '../utils/wpmCalculator';
import { useSoundEffects } from './useSoundEffects';

export function useTypingEngine(settings: TestSettings) {
  const [status, setStatus] = useState<EngineStatus>('idle');
  const [words, setWords] = useState<WordData[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(settings.timeOption);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [result, setResult] = useState<TestResult | null>(null);

  // Focus state
  const [isFocused, setIsFocused] = useState<boolean>(true);

  // Live metrics
  const [liveWpm, setLiveWpm] = useState<number>(0);
  const [liveRawWpm, setLiveRawWpm] = useState<number>(0);
  const [liveAccuracy, setLiveAccuracy] = useState<number>(100);

  // Keystroke Counters
  const totalKeystrokesRef = useRef<number>(0);
  const correctKeystrokesRef = useRef<number>(0);
  const correctCharsCountRef = useRef<number>(0);
  const incorrectCharsCountRef = useRef<number>(0);
  const extraCharsCountRef = useRef<number>(0);
  const missedCharsCountRef = useRef<number>(0);

  // Key accuracy tracking map
  const keyStatsRef = useRef<KeyAccuracyStats>({});
  const timelineRef = useRef<TimelineDataPoint[]>([]);

  // Sound synthesis
  const { playKeySound } = useSoundEffects(settings.soundProfile, settings.soundVolume);

  // High precision timestamp & timeout refs
  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const finishTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean Reset or Init Test
  const initTest = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (finishTimeoutRef.current) {
      clearTimeout(finishTimeoutRef.current);
      finishTimeoutRef.current = null;
    }
    startTimeRef.current = null;

    const newWords = generateTestWords(settings);
    setWords(newWords);
    setCurrentWordIndex(0);
    setCurrentCharIndex(0);
    setStatus('idle');
    setResult(null);
    setTimeLeft(settings.timeOption);
    setTimeElapsed(0);
    setLiveWpm(0);
    setLiveRawWpm(0);
    setLiveAccuracy(100);

    totalKeystrokesRef.current = 0;
    correctKeystrokesRef.current = 0;
    correctCharsCountRef.current = 0;
    incorrectCharsCountRef.current = 0;
    extraCharsCountRef.current = 0;
    missedCharsCountRef.current = 0;
    keyStatsRef.current = {};
    timelineRef.current = [];
  }, [settings]);

  useEffect(() => {
    initTest();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (finishTimeoutRef.current) clearTimeout(finishTimeoutRef.current);
    };
  }, [initTest]);

  // Complete test function
  const finishTest = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (finishTimeoutRef.current) {
      clearTimeout(finishTimeoutRef.current);
      finishTimeoutRef.current = null;
    }

    setStatus('completed');

    const duration = settings.mode === 'time'
      ? (settings.timeOption - timeLeft <= 0 ? settings.timeOption : settings.timeOption - timeLeft)
      : timeElapsed;
    const finalDuration = Math.max(1, duration);

    const finalRawWpm = calculateRawWpm(totalKeystrokesRef.current, finalDuration);
    const finalNetWpm = calculateNetWpm(correctCharsCountRef.current, finalDuration);
    const finalAccuracy = calculateAccuracy(correctKeystrokesRef.current, totalKeystrokesRef.current);
    const finalConsistency = calculateConsistency(timelineRef.current);

    const modeSummaryStr = settings.mode === 'time'
      ? `Time ${settings.timeOption}s`
      : `Words ${settings.wordOption}`;

    const finalResult: TestResult = {
      finalWpm: finalNetWpm,
      rawWpm: finalRawWpm,
      accuracy: finalAccuracy,
      consistency: finalConsistency,
      timeElapsed: finalDuration,
      totalChars: totalKeystrokesRef.current,
      correctChars: correctCharsCountRef.current,
      incorrectChars: incorrectCharsCountRef.current,
      extraChars: extraCharsCountRef.current,
      missedChars: missedCharsCountRef.current,
      timeline: [...timelineRef.current],
      keyStats: { ...keyStatsRef.current },
      modeSummary: modeSummaryStr,
      completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setResult(finalResult);
  }, [settings, timeLeft, timeElapsed]);

  // Start test on first keydown using monotonic performance.now()
  const startTest = useCallback(() => {
    if (status !== 'idle') return;

    setStatus('running');
    startTimeRef.current = performance.now();

    timerRef.current = setInterval(() => {
      if (!startTimeRef.current) return;
      const now = performance.now();
      const elapsedSeconds = Math.floor((now - startTimeRef.current) / 1000);

      setTimeElapsed(elapsedSeconds);

      if (settings.mode === 'time') {
        const remaining = settings.timeOption - elapsedSeconds;
        if (remaining <= 0) {
          setTimeLeft(0);
          finishTest();
          return;
        }
        setTimeLeft(remaining);
      }

      // Update live metrics
      const raw = calculateRawWpm(totalKeystrokesRef.current, elapsedSeconds);
      const net = calculateNetWpm(correctCharsCountRef.current, elapsedSeconds);
      const acc = calculateAccuracy(correctKeystrokesRef.current, totalKeystrokesRef.current);

      setLiveRawWpm(raw);
      setLiveWpm(net);
      setLiveAccuracy(acc);

      // Record timeline data point per second
      if (elapsedSeconds > 0 && timelineRef.current.length < elapsedSeconds) {
        timelineRef.current.push({
          second: elapsedSeconds,
          wpm: net,
          rawWpm: raw,
          errors: incorrectCharsCountRef.current + extraCharsCountRef.current
        });
      }
    }, 100);
  }, [status, settings.mode, settings.timeOption, finishTest]);

  // Keydown Handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent | KeyboardEvent) => {
    if (status === 'completed') return;

    if (['Tab', 'Space', 'Backspace'].includes(e.code) || e.key.length === 1) {
      if (e.key === ' ' || e.code === 'Space') e.preventDefault();
    }

    if (status === 'idle') {
      if (e.key.length === 1 || e.key === 'Backspace') {
        startTest();
      }
    }

    // Process Backspace
    if (e.key === 'Backspace') {
      totalKeystrokesRef.current += 1;

      if (e.ctrlKey || e.altKey) {
        setWords((prevWords) => {
          const next = [...prevWords];
          const curWord = { ...next[currentWordIndex] };
          curWord.chars = curWord.chars.filter(c => c.state !== 'extra').map(c => ({ ...c, state: 'untyped' as const }));
          next[currentWordIndex] = curWord;
          return next;
        });
        setCurrentCharIndex(0);
        playKeySound(false);
        return;
      }

      if (currentCharIndex > 0) {
        setWords((prevWords) => {
          const next = [...prevWords];
          const curWord = { ...next[currentWordIndex] };
          const targetChar = curWord.chars[currentCharIndex - 1];

          if (targetChar.state === 'extra') {
            curWord.chars.pop();
          } else {
            if (targetChar.state === 'correct') {
              correctCharsCountRef.current = Math.max(0, correctCharsCountRef.current - 1);
              correctKeystrokesRef.current = Math.max(0, correctKeystrokesRef.current - 1);
            } else if (targetChar.state === 'incorrect') {
              incorrectCharsCountRef.current = Math.max(0, incorrectCharsCountRef.current - 1);
            }
            curWord.chars[currentCharIndex - 1] = { ...targetChar, state: 'untyped', typedChar: undefined };
          }

          next[currentWordIndex] = curWord;
          return next;
        });

        setCurrentCharIndex((prev) => prev - 1);
        playKeySound(false);
      } else if (currentWordIndex > 0) {
        const prevWord = words[currentWordIndex - 1];
        if (prevWord) {
          setCurrentWordIndex(currentWordIndex - 1);
          setCurrentCharIndex(prevWord.chars.length);
        }
      }
      return;
    }

    // Process Spacebar (Advance Word)
    if (e.key === ' ' || e.code === 'Space') {
      // Prevent spacing on untyped empty word
      if (currentCharIndex === 0) return;

      const currentWord = words[currentWordIndex];

      if (settings.strictMode && currentWord) {
        const hasErrors = currentWord.chars.some(c => c.state === 'incorrect' || c.state === 'extra');
        if (hasErrors) {
          playKeySound(true);
          return;
        }
      }

      totalKeystrokesRef.current += 1;

      const isWordFullyCorrect = currentWord &&
        currentWord.chars.length === currentCharIndex &&
        currentWord.chars.every(c => c.state === 'correct');

      if (isWordFullyCorrect) {
        correctKeystrokesRef.current += 1;
        correctCharsCountRef.current += 1;
      } else if (currentWord) {
        const untypedCount = currentWord.chars.filter(c => c.state === 'untyped').length;
        missedCharsCountRef.current += untypedCount;
      }

      // Time mode endless streaming
      if (settings.mode === 'time' && words.length - currentWordIndex < 30) {
        setWords((prev) => [...prev, ...generateTestWords(settings)]);
      }

      // Word mode completion check vs Time mode endless stream
      const maxWordsTarget = settings.mode === 'words' ? settings.wordOption : words.length;

      if (currentWordIndex + 1 >= maxWordsTarget) {
        finishTest();
      } else {
        setCurrentWordIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
      }
      playKeySound(false);
      return;
    }

    // Process Printable Keystroke
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const typedChar = e.key;
      totalKeystrokesRef.current += 1;

      setWords((prevWords) => {
        const next = [...prevWords];
        const curWord = { ...next[currentWordIndex] };
        if (!curWord) return prevWords;

        const expectedCharObj = curWord.chars[currentCharIndex];
        const expectedChar = expectedCharObj ? expectedCharObj.char : null;

        if (!keyStatsRef.current[typedChar]) {
          keyStatsRef.current[typedChar] = { total: 0, errors: 0 };
        }
        keyStatsRef.current[typedChar].total += 1;

        if (expectedChar !== null && currentCharIndex < curWord.originalWord.length) {
          if (typedChar === expectedChar) {
            curWord.chars[currentCharIndex] = { ...expectedCharObj, state: 'correct', typedChar };
            correctKeystrokesRef.current += 1;
            correctCharsCountRef.current += 1;
            playKeySound(false);
          } else {
            curWord.chars[currentCharIndex] = { ...expectedCharObj, state: 'incorrect', typedChar };
            incorrectCharsCountRef.current += 1;
            keyStatsRef.current[typedChar].errors += 1;
            playKeySound(true);
          }
        } else {
          curWord.chars.push({
            char: typedChar,
            state: 'extra',
            typedChar
          });
          extraCharsCountRef.current += 1;
          keyStatsRef.current[typedChar].errors += 1;
          playKeySound(true);
        }

        next[currentWordIndex] = curWord;
        return next;
      });

      const nextCharIndex = currentCharIndex + 1;
      setCurrentCharIndex(nextCharIndex);

      const currentWordObj = words[currentWordIndex];

      // Word mode last character completion check
      if (
        settings.mode === 'words' &&
        currentWordIndex === settings.wordOption - 1 &&
        nextCharIndex >= currentWordObj.originalWord.length
      ) {
        finishTimeoutRef.current = setTimeout(finishTest, 20);
      }
    }
  }, [status, isFocused, currentWordIndex, currentCharIndex, words, settings, startTest, finishTest, playKeySound]);

  // Global window keydown listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (status !== 'completed' && isFocused) {
        handleKeyDown(e);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [status, isFocused, handleKeyDown]);

  return {
    status,
    words,
    currentWordIndex,
    currentCharIndex,
    timeLeft,
    timeElapsed,
    liveWpm,
    liveRawWpm,
    liveAccuracy,
    result,
    isFocused,
    setIsFocused,
    handleKeyDown,
    restartTest: initTest,
  };
}
