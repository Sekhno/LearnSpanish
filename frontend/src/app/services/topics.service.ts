import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Topic } from '../models/topic.model';
import { NumberEntry } from '../models/number-entry.model';
import { ShoppingPhrase } from '../models/shopping-phrase.model';
import { ShoppingItem } from '../models/shopping-item.model';
import { ShoppingQuizQuestion, ShoppingAnswerSubmit, ShoppingQuizResult } from '../models/shopping-quiz.model';

@Injectable({
  providedIn: 'root'
})
export class TopicsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api';

  getTopics(): Observable<Topic[]> {
    return this.http.get<Topic[]>(`${this.apiUrl}/topics`);
  }

  getNumbers(): Observable<NumberEntry[]> {
    return this.http.get<NumberEntry[]>(`${this.apiUrl}/numbers`);
  }

  getShoppingPhrases(): Observable<ShoppingPhrase[]> {
    return this.http.get<ShoppingPhrase[]>(`${this.apiUrl}/shopping/phrases`);
  }

  getShoppingItems(): Observable<ShoppingItem[]> {
    return this.http.get<ShoppingItem[]>(`${this.apiUrl}/shopping/items`);
  }

  generateShoppingQuiz(): Observable<ShoppingQuizQuestion[]> {
    return this.http.get<ShoppingQuizQuestion[]>(`${this.apiUrl}/shopping/quiz`);
  }

  submitShoppingQuiz(answers: ShoppingAnswerSubmit[]): Observable<ShoppingQuizResult> {
    return this.http.post<ShoppingQuizResult>(`${this.apiUrl}/shopping/quiz/submit`, answers);
  }
}
