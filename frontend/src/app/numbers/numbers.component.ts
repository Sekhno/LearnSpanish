import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { TopicsService } from '../services/topics.service';
import { QuizService } from '../services/quiz.service';
import { SpeechService } from '../services/speech.service';
import { NumberEntry } from '../models/number-entry.model';
import { TestResult } from '../models/test-result.model';
import { PracticeComponent } from './practice/practice.component';

@Component({
  selector: 'app-numbers',
  imports: [
    DatePipe,
    MatTableModule, MatCardModule, MatProgressSpinnerModule,
    MatIconModule, MatTooltipModule, MatTabsModule, MatChipsModule,
    MatButtonModule,
    PracticeComponent
  ],
  templateUrl: './numbers.component.html',
  styleUrl: './numbers.component.scss'
})
export class NumbersComponent implements OnInit {
  private readonly topicsService = inject(TopicsService);
  private readonly quizService = inject(QuizService);
  readonly speech = inject(SpeechService);

  numbers: NumberEntry[] = [];
  testResults: TestResult[] = [];
  loading = true;
  historyLoading = false;

  displayedColumns = ['value', 'spanish', 'catalan', 'notes'];
  historyColumns = ['completedAt', 'score', 'percentage', 'status'];

  ngOnInit(): void {
    this.topicsService.getNumbers().subscribe({
      next: (data) => { this.numbers = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
    this.loadHistory();
  }

  loadHistory(): void {
    this.historyLoading = true;
    this.quizService.getTestResults('numbers').subscribe({
      next: (results) => { this.testResults = results; this.historyLoading = false; },
      error: () => { this.historyLoading = false; }
    });
  }

  scorePercent(r: TestResult): number {
    return Math.round((r.score / r.totalQuestions) * 100);
  }

  statusLabel(r: TestResult): string {
    const pct = this.scorePercent(r);
    if (pct >= 80) return 'Excellent';
    if (pct >= 60) return 'Pass';
    return 'Fail';
  }

  statusColor(r: TestResult): 'primary' | 'accent' | 'warn' {
    const pct = this.scorePercent(r);
    if (pct >= 80) return 'primary';
    if (pct >= 60) return 'accent';
    return 'warn';
  }
}
