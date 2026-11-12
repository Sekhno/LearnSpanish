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
import { ShoppingPhrase } from '../models/shopping-phrase.model';
import { ShoppingItem, CATEGORY_LABELS, CATEGORY_ICONS } from '../models/shopping-item.model';
import { TestResult } from '../models/test-result.model';
import { ShoppingPracticeComponent } from './practice/shopping-practice.component';

const PHRASE_CATEGORY_LABELS: Record<string, string> = {
  greeting: 'Привітання',
  price:    'Ціна',
  location: 'Де знайти',
  quantity: 'Кількість',
  product:  'Про товар',
  payment:  'Оплата'
};

@Component({
  imports: [
    DatePipe,
    MatTabsModule, MatCardModule, MatProgressSpinnerModule,
    MatIconModule, MatButtonModule, MatTooltipModule,
    MatChipsModule, MatTableModule,
    MatFormFieldModule, MatInputModule,
    ShoppingPracticeComponent
  ],
  templateUrl: './shopping.component.html',
  styleUrl: './shopping.component.scss'
})
export class ShoppingComponent implements OnInit {
  private readonly topicsService = inject(TopicsService);
  private readonly quizService = inject(QuizService);
  readonly speech = inject(SpeechService);

  readonly phrases = signal<ShoppingPhrase[]>([]);
  readonly items = signal<ShoppingItem[]>([]);
  readonly testResults = signal<TestResult[]>([]);
  readonly loading = signal(true);
  readonly historyLoading = signal(false);

  readonly activeCategory = signal<string | null>(null);
  readonly phraseSearch = signal('');
  readonly itemSearch = signal('');

  readonly phraseCategories = computed(() =>
    [...new Set(this.phrases().map(p => p.category))]
  );

  readonly filteredPhrases = computed(() => {
    const cat = this.activeCategory();
    const q = this.phraseSearch().toLowerCase().trim();
    return this.phrases().filter(p => {
      if (cat && p.category !== cat) return false;
      if (!q) return true;
      return p.english.toLowerCase().includes(q) ||
             p.ukrainian.toLowerCase().includes(q) ||
             p.spanish.toLowerCase().includes(q) ||
             p.catalan.toLowerCase().includes(q);
    });
  });

  readonly filteredItems = computed(() => {
    const q = this.itemSearch().toLowerCase().trim();
    if (!q) return this.items();
    return this.items().filter(item =>
      item.english.toLowerCase().includes(q) ||
      item.ukrainian.toLowerCase().includes(q) ||
      item.spanish.toLowerCase().includes(q) ||
      item.catalan.toLowerCase().includes(q)
    );
  });

  readonly itemsByCategory = computed(() => {
    const grouped = new Map<string, ShoppingItem[]>();
    for (const item of this.filteredItems()) {
      const list = grouped.get(item.category) ?? [];
      list.push(item);
      grouped.set(item.category, list);
    }
    return grouped;
  });

  readonly categoryOrder = computed(() => [...this.itemsByCategory().keys()]);
  readonly allCategories = computed(() => [...new Set(this.items().map(i => i.category))]);

  readonly phraseColumns = ['english', 'ukrainian', 'spanish', 'catalan', 'notes'];
  readonly itemColumns   = ['english', 'ukrainian', 'spanish', 'catalan', 'notes'];
  readonly historyColumns = ['completedAt', 'score', 'percentage', 'status'];

  readonly categoryLabels = CATEGORY_LABELS;
  readonly categoryIcons  = CATEGORY_ICONS;
  readonly phraseCategoryLabels = PHRASE_CATEGORY_LABELS;

  ngOnInit(): void {
    this.topicsService.getShoppingPhrases().subscribe({
      next: (data) => { this.phrases.set(data); this.checkLoaded(); },
      error: () => this.loading.set(false)
    });
    this.topicsService.getShoppingItems().subscribe({
      next: (data) => { this.items.set(data); this.checkLoaded(); },
      error: () => this.loading.set(false)
    });
    this.loadHistory();
  }

  private checkLoaded(): void {
    if (this.phrases().length > 0 && this.items().length > 0) {
      this.loading.set(false);
    }
  }

  loadHistory(): void {
    this.historyLoading.set(true);
    this.quizService.getTestResults('shopping').subscribe({
      next: (results) => { this.testResults.set(results); this.historyLoading.set(false); },
      error: () => this.historyLoading.set(false)
    });
  }

  setCategory(cat: string | null): void {
    this.activeCategory.set(cat);
  }

  itemsForCategory(cat: string): ShoppingItem[] {
    return this.itemsByCategory().get(cat) ?? [];
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
