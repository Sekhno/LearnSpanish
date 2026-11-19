import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Topic } from '../models/topic.model';
import { NumberEntry } from '../models/number-entry.model';
import { ShoppingPhrase } from '../models/shopping-phrase.model';
import { ShoppingItem } from '../models/shopping-item.model';
import { ShoppingQuizQuestion, ShoppingAnswerSubmit, ShoppingQuizResult } from '../models/shopping-quiz.model';
import { ColorEntry } from '../models/color-entry.model';
import { ColorsQuizQuestion, ColorsAnswerSubmit, ColorsQuizResult } from '../models/colors-quiz.model';
import { IntroductionPhrase } from '../models/introduction-phrase.model';
import { IntroductionQuizQuestion, IntroductionAnswerSubmit, IntroductionQuizResult } from '../models/introduction-quiz.model';
import { PronounEntry } from '../models/pronoun-entry.model';
import { PronounsQuizQuestion, PronounsAnswerSubmit, PronounsQuizResult } from '../models/pronouns-quiz.model';

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

  generateShoppingQuiz(categories?: string[], lang?: string): Observable<ShoppingQuizQuestion[]> {
    let params = new HttpParams();
    for (const cat of categories ?? []) {
      params = params.append('categories', cat);
    }
    if (lang) params = params.set('forceLang', lang);
    return this.http.get<ShoppingQuizQuestion[]>(`${this.apiUrl}/shopping/quiz`, { params });
  }

  submitShoppingQuiz(answers: ShoppingAnswerSubmit[]): Observable<ShoppingQuizResult> {
    return this.http.post<ShoppingQuizResult>(`${this.apiUrl}/shopping/quiz/submit`, answers);
  }

  getColors(): Observable<ColorEntry[]> {
    return this.http.get<ColorEntry[]>(`${this.apiUrl}/colors`);
  }

  generateColorsQuiz(lang?: string): Observable<ColorsQuizQuestion[]> {
    const params = lang ? new HttpParams().set('forceLang', lang) : undefined;
    return this.http.get<ColorsQuizQuestion[]>(`${this.apiUrl}/colors/quiz`, { params });
  }

  submitColorsQuiz(answers: ColorsAnswerSubmit[]): Observable<ColorsQuizResult> {
    return this.http.post<ColorsQuizResult>(`${this.apiUrl}/colors/quiz/submit`, answers);
  }

  getIntroductionPhrases(): Observable<IntroductionPhrase[]> {
    return this.http.get<IntroductionPhrase[]>(`${this.apiUrl}/introduction/phrases`);
  }

  generateIntroductionQuiz(lang?: string): Observable<IntroductionQuizQuestion[]> {
    const params = lang ? new HttpParams().set('forceLang', lang) : undefined;
    return this.http.get<IntroductionQuizQuestion[]>(`${this.apiUrl}/introduction/quiz`, { params });
  }

  submitIntroductionQuiz(answers: IntroductionAnswerSubmit[]): Observable<IntroductionQuizResult> {
    return this.http.post<IntroductionQuizResult>(`${this.apiUrl}/introduction/quiz/submit`, answers);
  }

  getPronouns(): Observable<PronounEntry[]> {
    return this.http.get<PronounEntry[]>(`${this.apiUrl}/pronouns`);
  }

  generatePronounsQuiz(lang?: string): Observable<PronounsQuizQuestion[]> {
    const params = lang ? new HttpParams().set('forceLang', lang) : undefined;
    return this.http.get<PronounsQuizQuestion[]>(`${this.apiUrl}/pronouns/quiz`, { params });
  }

  submitPronounsQuiz(answers: PronounsAnswerSubmit[]): Observable<PronounsQuizResult> {
    return this.http.post<PronounsQuizResult>(`${this.apiUrl}/pronouns/quiz/submit`, answers);
  }
}
