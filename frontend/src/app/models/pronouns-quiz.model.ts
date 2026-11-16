export interface PronounsQuizQuestion {
  id: number;
  english: string;
  ukrainian: string;
  targetLanguage: string;
  options: string[];
}

export interface PronounsAnswerSubmit {
  id: number;
  targetLanguage: string;
  selectedAnswer: string;
}

export interface PronounsAnswerResult {
  id: number;
  english: string;
  targetLanguage: string;
  selectedAnswer: string;
  correctAnswer: string;
  correct: boolean;
}

export interface PronounsQuizResult {
  score: number;
  total: number;
  results: PronounsAnswerResult[];
}
