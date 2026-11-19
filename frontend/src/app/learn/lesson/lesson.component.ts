import { Component, inject, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

type Tab = 'theory' | 'practice' | 'listening' | 'assessment';

interface TheoryPhrase {
  text: string;
  translation: string;
  note?: string;
}

interface Exercise {
  type: 'multiple_choice' | 'translation';
  prompt: string;
  options?: string[];
  correct: string;
}

// Demo lesson content — will be replaced with API data
const DEMO_LESSON = {
  id: 'es-a1-001',
  title: 'Алфавит и произношение',
  level: 'A1',
  language: 'Español',
  intro: 'Испанский алфавит состоит из 27 букв. Испанское произношение очень регулярно — слова читаются так, как пишутся.',
  phrases: [
    { text: 'Hola', translation: 'Привет', note: 'Универсальное неформальное приветствие' },
    { text: 'Buenos días', translation: 'Доброе утро', note: 'Используется до полудня' },
    { text: 'Buenas tardes', translation: 'Добрый день / вечер', note: 'После полудня' },
    { text: 'Buenas noches', translation: 'Доброй ночи', note: 'Поздний вечер и ночь' },
    { text: 'Adiós', translation: 'До свидания', note: 'Формальное прощание' },
    { text: 'Hasta luego', translation: 'До скорого', note: 'Неформальное "пока"' }
  ] as TheoryPhrase[],
  dialogue: [
    { speaker: 'A', text: '¡Hola! ¿Cómo estás?', translation: 'Привет! Как дела?' },
    { speaker: 'B', text: 'Muy bien, gracias. ¿Y tú?', translation: 'Очень хорошо, спасибо. А у тебя?' },
    { speaker: 'A', text: 'Bien también. ¡Hasta luego!', translation: 'Тоже хорошо. До скорого!' },
    { speaker: 'B', text: '¡Adiós!', translation: 'Пока!' }
  ],
  exercises: [
    {
      type: 'multiple_choice' as const,
      prompt: 'Как сказать "Доброе утро" по-испански?',
      options: ['Buenos días', 'Buenas noches', 'Buenas tardes', 'Hola'],
      correct: 'Buenos días'
    },
    {
      type: 'multiple_choice' as const,
      prompt: 'Что означает "Hasta luego"?',
      options: ['До свидания навсегда', 'До скорого', 'Доброй ночи', 'Привет'],
      correct: 'До скорого'
    },
    {
      type: 'translation' as const,
      prompt: 'Переведите: Привет!',
      correct: '¡Hola!'
    }
  ] as Exercise[]
};

@Component({
  selector: 'app-lesson',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatTabsModule],
  templateUrl: './lesson.component.html',
  styleUrl: './lesson.component.scss'
})
export class LessonComponent {
  private readonly route = inject(ActivatedRoute);

  private readonly params = toSignal(this.route.params, { initialValue: {} as Record<string, string> });

  readonly lang = computed(() => this.params()['lang'] ?? 'es');
  readonly lesson = DEMO_LESSON;

  readonly activeTab = signal<Tab>('theory');
  readonly showTranslation = signal(true);
  readonly currentExercise = signal(0);
  readonly selectedAnswer = signal<string | null>(null);
  readonly answerSubmitted = signal(false);
  readonly userInput = signal('');

  setTab(tab: Tab): void {
    this.activeTab.set(tab);
  }

  toggleTranslation(): void {
    this.showTranslation.update(v => !v);
  }

  selectAnswer(option: string): void {
    if (this.answerSubmitted()) return;
    this.selectedAnswer.set(option);
  }

  submitAnswer(): void {
    if (!this.selectedAnswer() && !this.userInput()) return;
    this.answerSubmitted.set(true);
  }

  nextExercise(): void {
    if (this.currentExercise() < this.lesson.exercises.length - 1) {
      this.currentExercise.update(v => v + 1);
      this.selectedAnswer.set(null);
      this.answerSubmitted.set(false);
      this.userInput.set('');
    }
  }

  isCorrect(): boolean {
    const ex = this.lesson.exercises[this.currentExercise()];
    const answer = ex.type === 'translation' ? this.userInput() : this.selectedAnswer();
    return answer?.toLowerCase().trim() === ex.correct.toLowerCase().trim();
  }
}
