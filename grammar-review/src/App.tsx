import { useState, useEffect, useMemo } from 'react';
import type { Question, QuestionData, ReviewLevel } from './types';
import { useProgress } from './hooks/useProgress';
import { Dashboard } from './components/Dashboard';
import { ReviewCard } from './components/ReviewCard';
import { ListView } from './components/ListView';

type View = 'dashboard' | 'review' | 'list';

export default function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>('dashboard');
  const [filterTag, setFilterTag] = useState('all');
  const { progress, loaded, updateProgress, resetProgress } = useProgress();

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'data/questions.json')
      .then(res => {
        if (!res.ok) throw new Error('データの読み込みに失敗しました');
        return res.json();
      })
      .then((data: QuestionData) => {
        setQuestions(data.questions);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const allTags = useMemo(
    () => [...new Set(questions.map(q => q.grammar_tag))].sort(),
    [questions]
  );

  const filtered = useMemo(
    () => filterTag === 'all' ? questions : questions.filter(q => q.grammar_tag === filterTag),
    [questions, filterTag]
  );

  const handleMark = (id: string, level: ReviewLevel) => {
    updateProgress(id, level);
  };

  if (loading || !loaded) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f1f5f9' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 36, height: 36, margin: '0 auto 12px',
            border: '3px solid #e2e8f0', borderTop: '3px solid #3b82f6',
            borderRadius: '50%', animation: 'spin 0.8s linear infinite'
          }} />
          <div style={{ fontSize: 13, color: '#64748b' }}>読み込み中...</div>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f1f5f9' }}>
        <div style={{ textAlign: 'center', padding: 20 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
          <div style={{ fontSize: 15, color: '#dc2626', fontWeight: 600 }}>{error}</div>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 8 }}>public/data/questions.json を確認してください</div>
        </div>
      </div>
    );
  }

  if (view === 'review') {
    return (
      <ReviewCard
        questions={filtered}
        progress={progress}
        onMark={handleMark}
        onBack={() => setView('dashboard')}
      />
    );
  }

  if (view === 'list') {
    return (
      <ListView
        questions={filtered}
        progress={progress}
        onBack={() => setView('dashboard')}
      />
    );
  }

  return (
    <Dashboard
      questions={filtered}
      progress={progress}
      filterTag={filterTag}
      setFilterTag={setFilterTag}
      allTags={allTags}
      onStartReview={() => setView('review')}
      onShowList={() => setView('list')}
      onReset={resetProgress}
    />
  );
}
