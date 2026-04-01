import type { Question, Progress } from '../types';
import './ListView.css';

interface Props {
  questions: Question[];
  progress: Progress;
  onBack: () => void;
}

const DOTS = ['🔴', '🟡', '🟢'];
const BG_CLASSES = ['list-bg-red', 'list-bg-yellow', 'list-bg-green'];

export function ListView({ questions, progress, onBack }: Props) {
  return (
    <div className="list-wrap">
      <div className="list-top">
        <button className="back-btn" onClick={onBack}>← ダッシュボード</button>
        <span className="list-count">全 {questions.length} 問</span>
      </div>

      <div className="list-container">
        {questions.map(q => {
          const lv = progress[q.id] || 0;
          return (
            <div key={q.id} className={`list-item ${BG_CLASSES[lv]}`}>
              <div className="list-header">
                <span className="list-id">{DOTS[lv]} {q.id}</span>
                <span className="badge badge-tag">{q.grammar_tag}</span>
              </div>
              <div className="list-jp">{q.japanese}</div>
              <div className="list-en">{q.english_blank}</div>
              <div className="list-ans">
                正答: <strong>{q.correct_answer}</strong>
                <span className="list-sep">|</span>
                誤答: <span className="list-wrong-text">{q.student_answer}</span>
              </div>
              {q.explanation && <div className="list-memo">💡 {q.explanation}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
