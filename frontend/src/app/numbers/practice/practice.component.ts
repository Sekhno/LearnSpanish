import { Component, Output, EventEmitter, inject, signal, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { QuizService } from '../../services/quiz.service';
import { QuizQuestion, AnswerSubmit, QuizResult } from '../../models/quiz.model';

type QuizState = 'idle' | 'loading' | 'running' | 'submitting' | 'finished';

@Component({
  selector: 'app-practice',
  imports: [
    MatButtonModule, MatCardModule, MatIconModule,
    MatProgressBarModule, MatChipsModule, MatProgressSpinnerModule
  ],
  templateUrl: './practice.component.html',
  styleUrl: './practice.component.scss'
})
export class PracticeComponent {
  @Output() quizCompleted = new EventEmitter<void>();

  private readonly quizService = inject(QuizService);

  readonly state = signal<QuizState>('idle');
  readonly questions = signal<QuizQuestion[]>([]);
  readonly currentIndex = signal(0);
  readonly selectedAnswer = signal<string | null>(null);
  private readonly answers = signal<AnswerSubmit[]>([]);
  readonly result = signal<QuizResult | null>(null);

  readonly currentQuestion = computed(() => this.questions()[this.currentIndex()]);

  readonly progress = computed(() =>
    (this.currentIndex() / this.questions().length) * 100
  );

  readonly scorePercent = computed(() => {
    const r = this.result();
    if (!r) return 0;
    return Math.round((r.score / r.total) * 100);
  });

  readonly scoreColor = computed(() => {
    const pct = this.scorePercent();
    if (pct >= 80) return 'primary';
    if (pct >= 60) return 'accent';
    return 'warn';
  });

  startQuiz(): void {
    this.state.set('loading');
    this.currentIndex.set(0);
    this.answers.set([]);
    this.selectedAnswer.set(null);
    this.result.set(null);

    this.quizService.generateQuiz().subscribe({
      next: (questions) => {
        this.questions.set(questions);
        this.state.set('running');
      },
      error: () => { this.state.set('idle'); }
    });
  }

  selectAnswer(option: string): void {
    if (this.selectedAnswer() !== null) return;
    this.selectedAnswer.set(option);
  }

  nextQuestion(): void {
    const selected = this.selectedAnswer();
    if (selected === null) return;

    this.answers.update(a => [...a, {
      value: this.currentQuestion().value,
      selectedAnswer: selected
    }]);

    if (this.currentIndex() < this.questions().length - 1) {
      this.currentIndex.update(i => i + 1);
      this.selectedAnswer.set(null);
    } else {
      this.submitQuiz();
    }
  }

  private submitQuiz(): void {
    this.state.set('submitting');
    this.quizService.submitQuiz(this.answers()).subscribe({
      next: (result) => {
        this.result.set(result);
        this.state.set('finished');
        this.quizCompleted.emit();
      },
      error: () => { this.state.set('finished'); }
    });
  }

  getOptionClass(option: string): string {
    const selected = this.selectedAnswer();
    if (selected === null) return '';
    const correctAnswer = this.questions()[this.currentIndex()]
      ? this.getCorrectFromResult(this.currentQuestion().value) : null;

    if (option === selected) {
      return correctAnswer === null
        ? 'selected'
        : option === correctAnswer ? 'correct' : 'wrong';
    }
    if (correctAnswer && option === correctAnswer) {
      return 'correct';
    }
    return '';
  }

  private getCorrectFromResult(value: number): string | null {
    const r = this.result();
    if (!r) return null;
    return r.results.find(res => res.value === value)?.correctAnswer ?? null;
  }

  isAnswerRevealed(): boolean {
    return this.selectedAnswer() !== null;
  }
}
