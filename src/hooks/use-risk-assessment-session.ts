import { useEffect, useState } from "react";

interface LogEntry {
  timestamp: number;
  action: string;
  payload?: unknown;
}

interface StoredState {
  currentQuestion: number;
  answers: Record<string, string>;
}

const STORAGE_KEY = "risk-assessment-state";
const LOG_KEY = "risk-assessment-log";

export function useRiskAssessmentSession(totalQuestions: number) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [log, setLog] = useState<LogEntry[]>([]);

  // Load persisted state on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: StoredState = JSON.parse(stored);
        setCurrentQuestion(parsed.currentQuestion);
        setAnswers(parsed.answers);
      }
      const storedLog = localStorage.getItem(LOG_KEY);
      if (storedLog) {
        setLog(JSON.parse(storedLog));
      }
    } catch {
      // ignore parsing errors
    }
  }, []);

  // Persist state changes
  useEffect(() => {
    const toStore: StoredState = { currentQuestion, answers };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }, [currentQuestion, answers]);

  // Persist log changes
  useEffect(() => {
    localStorage.setItem(LOG_KEY, JSON.stringify(log));
  }, [log]);

  const answerQuestion = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setLog(prev => [...prev, { timestamp: Date.now(), action: "answer", payload: { questionId, value } }]);
  };

  const nextQuestion = () => {
    setCurrentQuestion(prev => Math.min(prev + 1, totalQuestions - 1));
    setLog(prev => [...prev, { timestamp: Date.now(), action: "next" }]);
  };

  const previousQuestion = () => {
    setCurrentQuestion(prev => Math.max(prev - 1, 0));
    setLog(prev => [...prev, { timestamp: Date.now(), action: "previous" }]);
  };

    const clearStorage = () => {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LOG_KEY);
    };

    const resetSession = () => {
      setCurrentQuestion(0);
      setAnswers({});
      setLog(prev => [...prev, { timestamp: Date.now(), action: "reset" }]);
      clearStorage();
    };

    const completeSession = () => {
      setCurrentQuestion(0);
      setAnswers({});
      setLog(prev => [...prev, { timestamp: Date.now(), action: "complete" }]);
      clearStorage();
    };

  return {
    currentQuestion,
    answers,
    log,
    answerQuestion,
    nextQuestion,
    previousQuestion,
      resetSession,
      completeSession,
  };
}
