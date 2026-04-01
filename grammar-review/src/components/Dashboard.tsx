import type { Question, Progress } from '../types';
import './Dashboard.css';

interface Props {
  questions: Question[];
  progress: Progress;
  filterTag: string;
  setFilterTag: (tag: string) => void;
  allTags: string[];
  onStartReview: () => void;
  onShowList: () => void;
  onReset: () => void;
}

export function Dashboard({ questions, progress, filterTag, setFilterTag, allTags, onStartReview, onShowList, onReset }: Props) {
  const total = questions.length;
  const mastered = questions.filter(q => (progress[q.id] || 0) >= 2).length;
  const inProgress = questions.filter(q => progress[q.id] === 1).length;
  const unreviewed = total - mastered - inProgress;
  const pct = total > 0 ? Math.round((mastered / total) * 100) : 0;

  const tagStats = allTags.map(tag => {
    const qs = questions.filter(q => q.grammar_tag === tag);
    const m = qs.filter(q => (progress[q.id] || 0) >= 2).length;
    return { tag, total: qs.length, mastered: m, rate: qs.length > 0 ? m / qs.length : 0 };
  }).sort((a, b) => a.rate - b.rate);

  return (
    <div className="dashboard">
      <header className="dash-header">
        <h1><span className="dash-icon">✏️</span>重要構文 復習アプリ</h1>
        <p className="dash-sub">間違えた問題を効率的に復習しよう</p>
      </header>

      <main className="dash-main">
        <div className="stat-grid">
          <div className="stat-card stat-total"><div className="stat-num">{total}</div><div className="stat-label">全問題</div></div>
          <div className="stat-card stat-unrev"><div className="stat-num">{unreviewed}</div><div className="stat-label">未復習</div></div>
          <div className="stat-card stat-prog"><div className="stat-num">{inProgress}</div><div className="stat-label">復習中</div></div>
          <div className="stat-card stat-done"><div className="stat-num">{mastered}</div><div className="stat-label">定着</div></div>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
          <span className="progress-label">{pct}% 定着</span>
        </div>

        <div className="action-row">
          <button className="btn-primary" onClick={onStartReview}>▶ 復習を開始</button>
          <button className="btn-secondary" onClick={onShowList}>📋 一覧</button>
          <button className="btn-danger" onClick={() => { if (confirm('進捗をリセットしますか？')) onReset(); }}>🔄</button>
        </div>

        <div className="filter-row">
          <select value={filterTag} onChange={e => setFilterTag(e.target.value)}>
            <option value="all">すべての構文 ({total}問)</option>
            {allTags.map(t => {
              const c = questions.filter(q => q.grammar_tag === t).length;
              return <option key={t} value={t}>{t} ({c}問)</option>;
            })}
          </select>
        </div>

        <h2 className="section-title">構文別 定着状況</h2>
        <div className="tag-list">
          {tagStats.map(({ tag, total: t, mastered: m, rate }) => (
            <button key={tag} className="tag-row" onClick={() => { setFilterTag(tag); onStartReview(); }}>
              <div className="tag-left">
                <span className={`tag-dot ${rate >= 1 ? 'dot-green' : rate > 0 ? 'dot-yellow' : 'dot-red'}`} />
                <span className="tag-name">{tag}</span>
              </div>
              <div className="tag-right">
                <span className="tag-count">{m}/{t}</span>
                <div className="mini-bar">
                  <div className={`mini-fill ${rate >= 1 ? 'fill-green' : rate > 0 ? 'fill-yellow' : 'fill-red'}`} style={{ width: `${rate * 100}%` }} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
