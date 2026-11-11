import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Topic } from '../models/topic.model';
import { NumberEntry } from '../models/number-entry.model';

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
}
