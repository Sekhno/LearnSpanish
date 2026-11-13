export interface IntroductionQuizQuestion {
  id: number;
  english: string;
  ukrainian: string;
  targetLanguage: string;
  options: string[];
}

export interface IntroductionAnswerSubmit {
  id: number;
  targetLanguage: string;
  selectedAnswer: string;
}

export interface IntroductionAnswerResult {
  id: number;
  english: string;
  targetLanguage: string;
  selectedAnswer: string;
  correctAnswer: string;
  correct: boolean;
}

export interface IntroductionQuizResult {
  score: number;
  total: number;
  results: IntroductionAnswerResult[];
}
