import { useState, useCallback, useEffect } from 'react';
import type { Progress, ReviewLevel } from '../types';

const STORAGE_KEY = 'grammar-review-progress';

export function useProgress() {
  const [progress, setProgress] = useState<Progress>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setProgress(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, []);

  const updateProgress = useCallback((questionId: string, level: ReviewLevel) => {
    setProgress(prev => {
      const next = { ...prev, [questionId]: level };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const resetProgress = useCallback(() => {
    setProgress({});
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }, []);

  return { progress, loaded, updateProgress, resetProgress };
}
