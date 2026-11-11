export interface QuizQuestion {
  value: number;
  options: string[];
}

export interface AnswerSubmit {
  value: number;
  selectedAnswer: string;
}

export interface AnswerResult {
  value: number;
  selectedAnswer: string;
  correctAnswer: string;
  correct: boolean;
}

export interface QuizResult {
  score: number;
  total: number;
  results: AnswerResult[];
}
