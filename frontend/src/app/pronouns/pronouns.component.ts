import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TopicsService } from '../services/topics.service';
import { QuizService } from '../services/quiz.service';
import { SpeechService } from '../services/speech.service';
import { PronounEntry, PRONOUNS_CATEGORY_LABELS, PRONOUNS_CATEGORY_ICONS } from '../models/pronoun-entry.model';
import { TestResult } from '../models/test-result.model';
import { PronounsPracticeComponent } from './practice/pronouns-practice.component';

@Component({
  imports: [
    DatePipe,
    MatTabsModule, MatCardModule, MatProgressSpinnerModule,
    MatIconModule, MatButtonModule, MatTooltipModule,
    MatChipsModule, MatTableModule,
    MatFormFieldModule, MatInputModule,
    PronounsPracticeComponent
  ],
  templateUrl: './pronouns.component.html',
  styleUrl: './pronouns.component.scss'
})
export class PronounsComponent implements OnInit {
  private readonly topicsService = inject(TopicsService);
  private readonly quizService = inject(QuizService);
  readonly speech = inject(SpeechService);

  readonly pronouns = signal<PronounEntry[]>([]);
  readonly testResults = signal<TestResult[]>([]);
  readonly loading = signal(true);
  readonly historyLoading = signal(false);

  readonly activeCategory = signal<string | null>(null);
  readonly pronounSearch = signal('');

  readonly categories = computed(() =>
    [...new Set(this.pronouns().map(p => p.category))]
  );

  readonly filteredPronouns = computed(() => {
    const cat = this.activeCategory();
    const q = this.pronounSearch().toLowerCase().trim();
    return this.pronouns().filter(p => {
      if (cat && p.category !== cat) return false;
      if (!q) return true;
      return p.english.toLowerCase().includes(q) ||
             p.ukrainian.toLowerCase().includes(q) ||
             p.spanish.toLowerCase().includes(q) ||
             p.catalan.toLowerCase().includes(q);
    });
  });

  readonly pronounColumns = ['english', 'ukrainian', 'spanish', 'catalan', 'notes'];
  readonly historyColumns = ['completedAt', 'score', 'percentage', 'status'];

  readonly categoryLabels = PRONOUNS_CATEGORY_LABELS;
  readonly categoryIcons = PRONOUNS_CATEGORY_ICONS;

  ngOnInit(): void {
    this.topicsService.getPronouns().subscribe({
      next: (data) => { this.pronouns.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
    this.loadHistory();
  }

  loadHistory(): void {
    this.historyLoading.set(true);
    this.quizService.getTestResults('pronouns').subscribe({
      next: (results) => { this.testResults.set(results); this.historyLoading.set(false); },
      error: () => this.historyLoading.set(false)
    });
  }

  setCategory(cat: string | null): void {
    this.activeCategory.set(cat);
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
