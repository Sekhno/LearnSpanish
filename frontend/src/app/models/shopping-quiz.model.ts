export interface ShoppingQuizQuestion {
  id: number;
  english: string;
  ukrainian: string;
  targetLanguage: string;
  options: string[];
}

export interface ShoppingAnswerSubmit {
  id: number;
  targetLanguage: string;
  selectedAnswer: string;
}

export interface ShoppingAnswerResult {
  id: number;
  english: string;
  targetLanguage: string;
  selectedAnswer: string;
  correctAnswer: string;
  correct: boolean;
}

export interface ShoppingQuizResult {
  score: number;
  total: number;
  results: ShoppingAnswerResult[];
}
