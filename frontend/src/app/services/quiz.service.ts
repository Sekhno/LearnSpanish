import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuizQuestion, AnswerSubmit, QuizResult } from '../models/quiz.model';
import { TestResult } from '../models/test-result.model';

@Injectable({ providedIn: 'root' })
export class QuizService {
  private readonly http = inject(HttpClient);
  private readonly api = 'http://localhost:8080/api';

  generateQuiz(): Observable<QuizQuestion[]> {
    return this.http.get<QuizQuestion[]>(`${this.api}/quiz/numbers`);
  }

  submitQuiz(answers: AnswerSubmit[]): Observable<QuizResult> {
    return this.http.post<QuizResult>(`${this.api}/quiz/numbers/submit`, answers);
  }

  getTestResults(topicId: string): Observable<TestResult[]> {
    return this.http.get<TestResult[]>(`${this.api}/test-results`, {
      params: { topicId }
    });
  }
}
