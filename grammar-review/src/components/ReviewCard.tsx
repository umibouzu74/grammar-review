import { useState } from 'react';
import type { Question, Progress, ReviewLevel } from '../types';
import './ReviewCard.css';

interface Props {
  questions: Question[];
  progress: Progress;
  onMark: (id: string, level: ReviewLevel) => void;
  onBack: () => void;
}

const LEVEL_LABELS = ['未復習', '復習中', '定着済み'] as const;
const LEVEL_CLASSES = ['lv-unrev', 'lv-prog', 'lv-done'] as const;

export function ReviewCard({ questions, progress, onMark, onBack }: Props) {
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);

  if (questions.length === 0) {
    return (
      <div className="review-wrap">
        <div className="review-top"><button className="back-btn" onClick={onBack}>← 戻る</button></div>
        <div className="empty-msg">該当する問題がありません</div>
      </div>
    );
  }

  if (finished) {
    const mastered = questions.filter(q => (progress[q.id] || 0) >= 2).length;
    return (
      <div className="review-wrap">
        <div className="finish-card">
          <div className="finish-emoji">🎉</div>
          <h2 className="finish-title">復習完了！</h2>
          <p className="finish-stat">{questions.length}問中 {mastered}問 定着</p>
          <button className="btn-primary finish-btn" onClick={onBack}>ダッシュボードへ</button>
        </div>
      </div>
    );
  }

  const q = questions[idx];
  const level = progress[q.id] || 0;

  const handleMark = (lv: ReviewLevel) => {
    onMark(q.id, lv);
    setRevealed(false);
    if (idx < questions.length - 1) {
      setIdx(idx + 1);
    } else {
      setFinished(true);
    }
  };

  return (
    <div className="review-wrap">
      <div className="review-top">
        <button className="back-btn" onClick={onBack}>← 戻る</button>
        <span className="review-counter">{idx + 1} / {questions.length}</span>
        <span className={`level-badge ${LEVEL_CLASSES[level]}`}>{LEVEL_LABELS[level]}</span>
      </div>

      <div className="review-progress-bar">
        <div className="review-progress-fill" style={{ width: `${((idx) / questions.length) * 100}%` }} />
      </div>

      <div className="card">
        <div className="card-block">
          <div className="card-label">日本文</div>
          <div className="card-jp">{q.japanese}</div>
        </div>

        <div className="card-divider" />

        <div className="card-block">
          <div className="card-label">英文（空所付き）</div>
          <div className="card-en">{q.english_blank}</div>
        </div>

        <div className="card-meta">
          <span className="badge badge-tag">{q.grammar_tag}</span>
          {q.university && <span className="badge badge-univ">{q.university}</span>}
          <span className="badge badge-sec">{q.section}</span>
        </div>

        {!revealed ? (
          <button className="reveal-btn" onClick={() => setRevealed(true)}>
            解答を表示する
          </button>
        ) : (
          <div className="answer-area">
            <div className="ans-block">
              <div className="ans-label">✅ 正答</div>
              <div className="ans-correct">{q.correct_answer}</div>
            </div>
            <div className="ans-block">
              <div className="ans-label">❌ あなたの解答</div>
              <div className="ans-wrong">{q.student_answer}</div>
            </div>
            {q.explanation && (
              <div className="memo-block">
                <div className="memo-label">💡 ポイント</div>
                <div className="memo-text">{q.explanation}</div>
              </div>
            )}
            <div className="rating-row">
              <button className="rate-btn rate-red" onClick={() => handleMark(0)}>😕<br/>もう一度</button>
              <button className="rate-btn rate-yellow" onClick={() => handleMark(1)}>🤔<br/>あやしい</button>
              <button className="rate-btn rate-green" onClick={() => handleMark(2)}>😄<br/>わかった！</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
