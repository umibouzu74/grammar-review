export interface Question {
  id: string;
  section: string;
  japanese: string;
  english_blank: string;
  correct_answer: string;
  student_answer: string;
  grammar_tag: string;
  university: string;
  explanation: string;
}

export interface QuestionData {
  metadata: {
    title: string;
    source: string;
    student: string;
    created: string;
    total_questions: number;
    wrong_count: number;
  };
  questions: Question[];
}

export type ReviewLevel = 0 | 1 | 2; // 0=未復習, 1=復習中, 2=定着済み

export interface Progress {
  [questionId: string]: ReviewLevel;
}
