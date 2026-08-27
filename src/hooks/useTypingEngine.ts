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

  // Timer intervals
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset or Init Test
  const initTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);

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
  }, [initTest]);

  // Complete test function
  const finishTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    setStatus('completed');

    const duration = settings.mode === 'time'
      ? (settings.timeOption - timeLeft <= 0 ? settings.timeOption : settings.timeOption - timeLeft)
      : timeElapsed;
    const finalDuration = Math.max(1, duration);

    const finalRawWpm = calculateRawWpm(totalKeystrokesRef.current, finalDuration);
    const finalNetWpm = calculateNetWpm(correctCharsCountRef.current, finalDuration);
    const finalAccuracy = calculateAccuracy(correctKeystrokesRef.current, totalKeystrokesRef.current);
    const finalConsistency = calculateConsistency(timelineRef.current);

    let modeSummaryStr = '';
    if (settings.mode === 'time') modeSummaryStr = `Time ${settings.timeOption}s`;
    else if (settings.mode === 'words') modeSummaryStr = `Words ${settings.wordOption}`;
    else if (settings.mode === 'quote') modeSummaryStr = `Quote (${settings.quoteOption})`;
    else if (settings.mode === 'code') modeSummaryStr = `Code (${settings.codeOption})`;

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

  // Start test on first keydown
  const startTest = useCallback(() => {
    setStatus('running');

    timerRef.current = setInterval(() => {
      setTimeElapsed((prevElapsed) => {
        const nextElapsed = prevElapsed + 1;

        const raw = calculateRawWpm(totalKeystrokesRef.current, nextElapsed);
        const net = calculateNetWpm(correctCharsCountRef.current, nextElapsed);
        const acc = calculateAccuracy(correctKeystrokesRef.current, totalKeystrokesRef.current);

        setLiveRawWpm(raw);
        setLiveWpm(net);
        setLiveAccuracy(acc);

        timelineRef.current.push({
          second: nextElapsed,
          wpm: net,
          rawWpm: raw,
          errors: incorrectCharsCountRef.current + extraCharsCountRef.current
        });

        return nextElapsed;
      });

      if (settings.mode === 'time') {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            finishTest();
            return 0;
          }
          return prevTime - 1;
        });
      }
    }, 1000);
  }, [settings.mode, finishTest]);

  // Keydown Handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent | KeyboardEvent) => {
    if (status === 'completed' || !isFocused) return;

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
      // Prevent leading empty space advancement
      if (currentCharIndex === 0 && currentWordIndex === 0) return;

      totalKeystrokesRef.current += 1;

      const currentWord = words[currentWordIndex];
      const isWordFullyCorrect = currentWord &&
        currentWord.chars.length === currentCharIndex &&
        currentWord.chars.every(c => c.state === 'correct');

      if (isWordFullyCorrect) {
        correctKeystrokesRef.current += 1;
        correctCharsCountRef.current += 1; // space character counted
      } else if (currentWord) {
        const untypedCount = currentWord.chars.filter(c => c.state === 'untyped').length;
        missedCharsCountRef.current += untypedCount;
      }

      // Check if we need to replenish words (Time mode endless stream)
      if (settings.mode === 'time' && words.length - currentWordIndex < 30) {
        setWords((prev) => [...prev, ...generateTestWords(settings)]);
      }

      // Completion conditions
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

      // Quote or Code mode finish check
      if (
        (settings.mode === 'quote' || settings.mode === 'code') &&
        currentWordIndex === words.length - 1 &&
        nextCharIndex >= currentWordObj.originalWord.length
      ) {
        setTimeout(finishTest, 50);
      }
    }
  }, [status, isFocused, currentWordIndex, currentCharIndex, words, settings, startTest, finishTest, playKeySound]);

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
