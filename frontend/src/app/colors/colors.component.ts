import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { TopicsService } from '../services/topics.service';
import { QuizService } from '../services/quiz.service';
import { SpeechService } from '../services/speech.service';
import { ColorEntry } from '../models/color-entry.model';
import { TestResult } from '../models/test-result.model';
import { ColorsPracticeComponent } from './practice/colors-practice.component';

@Component({
  imports: [
    DatePipe,
    MatTabsModule, MatCardModule, MatProgressSpinnerModule,
    MatIconModule, MatButtonModule, MatTooltipModule,
    MatTableModule, MatFormFieldModule, MatInputModule, MatChipsModule,
    ColorsPracticeComponent
  ],
  templateUrl: './colors.component.html',
  styleUrl: './colors.component.scss'
})
export class ColorsComponent implements OnInit {
  private readonly topicsService = inject(TopicsService);
  private readonly quizService = inject(QuizService);
  readonly speech = inject(SpeechService);

  readonly colors = signal<ColorEntry[]>([]);
  readonly testResults = signal<TestResult[]>([]);
  readonly loading = signal(true);
  readonly historyLoading = signal(false);
  readonly search = signal('');

  readonly filteredColors = computed(() => {
    const q = this.search().toLowerCase().trim();
    if (!q) return this.colors();
    return this.colors().filter(c =>
      c.english.toLowerCase().includes(q) ||
      c.ukrainian.toLowerCase().includes(q) ||
      c.spanish.toLowerCase().includes(q) ||
      c.catalan.toLowerCase().includes(q)
    );
  });

  readonly columns = ['color', 'english', 'ukrainian', 'spanish', 'catalan'];
  readonly historyColumns = ['completedAt', 'score', 'percentage', 'status'];

  ngOnInit(): void {
    this.topicsService.getColors().subscribe({
      next: (data) => { this.colors.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
    this.loadHistory();
  }

  loadHistory(): void {
    this.historyLoading.set(true);
    this.quizService.getTestResults('colors').subscribe({
      next: (results) => { this.testResults.set(results); this.historyLoading.set(false); },
      error: () => this.historyLoading.set(false)
    });
  }

  scorePercent(r: TestResult): number {
    return Math.round((r.score / r.totalQuestions) * 100);
  }

  statusLabel(r: TestResult): string {
    const pct = this.scorePercent(r);
    if (pct >= 80) return 'Відмінно';
    if (pct >= 60) return 'Добре';
    return 'Невдача';
  }

  statusColor(r: TestResult): 'primary' | 'accent' | 'warn' {
    const pct = this.scorePercent(r);
    if (pct >= 80) return 'primary';
    if (pct >= 60) return 'accent';
    return 'warn';
  }
}
