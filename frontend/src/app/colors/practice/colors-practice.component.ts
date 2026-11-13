import { Component, Output, EventEmitter, inject, signal, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TopicsService } from '../../services/topics.service';
import {
  ColorsQuizQuestion,
  ColorsAnswerSubmit,
  ColorsQuizResult
} from '../../models/colors-quiz.model';

type QuizState = 'idle' | 'loading' | 'running' | 'submitting' | 'finished';

@Component({
  selector: 'app-colors-practice',
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatProgressBarModule, MatProgressSpinnerModule],
  templateUrl: './colors-practice.component.html',
  styleUrl: './colors-practice.component.scss'
})
export class ColorsPracticeComponent {
  @Output() quizCompleted = new EventEmitter<void>();

  private readonly topicsService = inject(TopicsService);

  readonly state = signal<QuizState>('idle');
  readonly questions = signal<ColorsQuizQuestion[]>([]);
  readonly currentIndex = signal(0);
  readonly selectedAnswer = signal<string | null>(null);
  private readonly answers = signal<ColorsAnswerSubmit[]>([]);
  readonly result = signal<ColorsQuizResult | null>(null);

  readonly currentQuestion = computed(() => this.questions()[this.currentIndex()]);

  readonly progress = computed(() =>
    (this.currentIndex() / this.questions().length) * 100
  );

  readonly scorePercent = computed(() => {
    const r = this.result();
    if (!r) return 0;
    return Math.round((r.score / r.total) * 100);
  });

  readonly langLabel = computed(() => {
    const q = this.currentQuestion();
    if (!q) return '';
    return q.targetLanguage === 'spanish' ? '🇪🇸 Іспанська' : '🏴󠁥󠁳󠁣󠁴󠁿 Каталанська';
  });

  startQuiz(): void {
    this.state.set('loading');
    this.currentIndex.set(0);
    this.answers.set([]);
    this.selectedAnswer.set(null);
    this.result.set(null);

    this.topicsService.generateColorsQuiz().subscribe({
      next: (questions) => { this.questions.set(questions); this.state.set('running'); },
      error: () => this.state.set('idle')
    });
  }

  selectAnswer(option: string): void {
    if (this.selectedAnswer() !== null) return;
    this.selectedAnswer.set(option);
  }

  nextQuestion(): void {
    const selected = this.selectedAnswer();
    if (selected === null) return;

    const q = this.currentQuestion();
    this.answers.update(a => [...a, { id: q.id, targetLanguage: q.targetLanguage, selectedAnswer: selected }]);

    if (this.currentIndex() < this.questions().length - 1) {
      this.currentIndex.update(i => i + 1);
      this.selectedAnswer.set(null);
    } else {
      this.submitQuiz();
    }
  }

  private submitQuiz(): void {
    this.state.set('submitting');
    this.topicsService.submitColorsQuiz(this.answers()).subscribe({
      next: (result) => {
        this.result.set(result);
        this.state.set('finished');
        this.quizCompleted.emit();
      },
      error: () => this.state.set('finished')
    });
  }

  getOptionState(option: string): 'default' | 'selected' | 'correct' | 'wrong' {
    const selected = this.selectedAnswer();
    if (selected === null) return 'default';

    const r = this.result();
    if (r) {
      const item = r.results[this.currentIndex()];
      if (option === item?.correctAnswer) return 'correct';
      if (option === selected && option !== item?.correctAnswer) return 'wrong';
      return 'default';
    }
    if (option === selected) return 'selected';
    return 'default';
  }

  isAnswerRevealed(): boolean {
    return this.selectedAnswer() !== null;
  }
}
