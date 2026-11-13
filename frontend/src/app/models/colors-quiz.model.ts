export interface ColorsQuizQuestion {
  id: number;
  english: string;
  ukrainian: string;
  hex: string;
  targetLanguage: string;
  options: string[];
}

export interface ColorsAnswerSubmit {
  id: number;
  targetLanguage: string;
  selectedAnswer: string;
}

export interface ColorsAnswerResult {
  id: number;
  english: string;
  hex: string;
  targetLanguage: string;
  selectedAnswer: string;
  correctAnswer: string;
  correct: boolean;
}

export interface ColorsQuizResult {
  score: number;
  total: number;
  results: ColorsAnswerResult[];
}
