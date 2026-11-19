import { Component, inject, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface Module {
  id: string;
  number: number;
  title: string;
  status: 'completed' | 'available' | 'locked';
}

interface CefrLevel {
  level: 'A1' | 'A2' | 'B1' | 'B2';
  name: string;
  goal: string;
  color: string;
  unlocked: boolean;
  modules: Module[];
}

const ES_CURRICULUM: CefrLevel[] = [
  {
    level: 'A1', name: 'Начальный', color: '#4caf50',
    goal: 'Понимать простые фразы, рассказывать о себе, задавать базовые вопросы.',
    unlocked: true,
    modules: [
      { id: 'es-a1-001', number: 1,  title: 'Алфавит и произношение',  status: 'available' },
      { id: 'es-a1-002', number: 2,  title: 'Приветствия',             status: 'locked' },
      { id: 'es-a1-003', number: 3,  title: 'Знакомство',              status: 'locked' },
      { id: 'es-a1-004', number: 4,  title: 'Личные местоимения',      status: 'locked' },
      { id: 'es-a1-005', number: 5,  title: 'Основные глаголы',        status: 'locked' },
      { id: 'es-a1-006', number: 6,  title: 'Род и число',             status: 'locked' },
      { id: 'es-a1-007', number: 7,  title: 'Артикли',                 status: 'locked' },
      { id: 'es-a1-008', number: 8,  title: 'Числа',                   status: 'locked' },
      { id: 'es-a1-009', number: 9,  title: 'Дни и даты',              status: 'locked' },
      { id: 'es-a1-010', number: 10, title: 'Время',                   status: 'locked' },
      { id: 'es-a1-011', number: 11, title: 'Семья',                   status: 'locked' },
      { id: 'es-a1-012', number: 12, title: 'Внешность и характер',    status: 'locked' },
      { id: 'es-a1-013', number: 13, title: 'Еда и напитки',           status: 'locked' },
      { id: 'es-a1-014', number: 14, title: 'Дом и квартира',          status: 'locked' },
      { id: 'es-a1-015', number: 15, title: 'Цвета и одежда',          status: 'locked' },
      { id: 'es-a1-016', number: 16, title: 'Настоящее время',         status: 'locked' },
      { id: 'es-a1-017', number: 17, title: 'Неправильные глаголы',    status: 'locked' },
      { id: 'es-a1-018', number: 18, title: 'Вопросы и отрицания',     status: 'locked' },
      { id: 'es-a1-019', number: 19, title: 'Город и транспорт',       status: 'locked' },
      { id: 'es-a1-020', number: 20, title: 'Повседневные действия',   status: 'locked' },
      { id: 'es-a1-021', number: 21, title: 'Магазины и покупки',      status: 'locked' },
      { id: 'es-a1-022', number: 22, title: 'Итог A1',                 status: 'locked' }
    ]
  },
  {
    level: 'A2', name: 'Базовый', color: '#8bc34a',
    goal: 'Общаться в магазинах, транспорте, медицинских учреждениях, обсуждать прошлое и планы.',
    unlocked: false,
    modules: [
      { id: 'es-a2-001', number: 1,  title: 'Повторение настоящего',   status: 'locked' },
      { id: 'es-a2-002', number: 2,  title: 'Прошедшее время I',       status: 'locked' },
      { id: 'es-a2-003', number: 3,  title: 'Прошедшее время II',      status: 'locked' },
      { id: 'es-a2-004', number: 4,  title: 'Будущее время',           status: 'locked' },
      { id: 'es-a2-005', number: 5,  title: 'Модальные конструкции',   status: 'locked' },
      { id: 'es-a2-006', number: 6,  title: 'Возвратные глаголы',      status: 'locked' },
      { id: 'es-a2-007', number: 7,  title: 'Местоимения-дополнения',  status: 'locked' },
      { id: 'es-a2-008', number: 8,  title: 'Сравнения',               status: 'locked' },
      { id: 'es-a2-009', number: 9,  title: 'Предлоги',                status: 'locked' },
      { id: 'es-a2-010', number: 10, title: 'Рестораны',               status: 'locked' },
      { id: 'es-a2-011', number: 11, title: 'Здоровье',                status: 'locked' },
      { id: 'es-a2-012', number: 12, title: 'Жильё',                   status: 'locked' },
      { id: 'es-a2-013', number: 13, title: 'Работа',                  status: 'locked' },
      { id: 'es-a2-014', number: 14, title: 'Путешествия',             status: 'locked' },
      { id: 'es-a2-015', number: 15, title: 'Телефонные разговоры',    status: 'locked' },
      { id: 'es-a2-016', number: 16, title: 'Описание событий',        status: 'locked' },
      { id: 'es-a2-017', number: 17, title: 'Погода и природа',        status: 'locked' },
      { id: 'es-a2-018', number: 18, title: 'Привычки и предпочтения', status: 'locked' },
      { id: 'es-a2-019', number: 19, title: 'Цифровая жизнь',          status: 'locked' },
      { id: 'es-a2-020', number: 20, title: 'Итог A2',                 status: 'locked' }
    ]
  },
  {
    level: 'B1', name: 'Средний', color: '#ff9800',
    goal: 'Самостоятельно решать бытовые задачи, поддерживать разговор и аргументировать мнение.',
    unlocked: false,
    modules: [
      { id: 'es-b1-001', number: 1,  title: 'Система прошедших времён',  status: 'locked' },
      { id: 'es-b1-002', number: 2,  title: 'Будущее и вероятность',     status: 'locked' },
      { id: 'es-b1-003', number: 3,  title: 'Условное наклонение',       status: 'locked' },
      { id: 'es-b1-004', number: 4,  title: 'Subjuntivo I',              status: 'locked' },
      { id: 'es-b1-005', number: 5,  title: 'Повелительное наклонение',  status: 'locked' },
      { id: 'es-b1-006', number: 6,  title: 'Сложные предложения',       status: 'locked' },
      { id: 'es-b1-007', number: 7,  title: 'Косвенная речь',            status: 'locked' },
      { id: 'es-b1-008', number: 8,  title: 'Пассивные конструкции',     status: 'locked' },
      { id: 'es-b1-009', number: 9,  title: 'Мнение и аргументация',     status: 'locked' },
      { id: 'es-b1-010', number: 10, title: 'Эмоции и отношения',        status: 'locked' },
      { id: 'es-b1-011', number: 11, title: 'Работа и собеседование',    status: 'locked' },
      { id: 'es-b1-012', number: 12, title: 'Банки и финансы',           status: 'locked' },
      { id: 'es-b1-013', number: 13, title: 'Государственные услуги',    status: 'locked' },
      { id: 'es-b1-014', number: 14, title: 'Образование',               status: 'locked' },
      { id: 'es-b1-015', number: 15, title: 'Медиа и новости',           status: 'locked' },
      { id: 'es-b1-016', number: 16, title: 'Культура и традиции',       status: 'locked' },
      { id: 'es-b1-017', number: 17, title: 'Рассказ и пересказ',        status: 'locked' },
      { id: 'es-b1-018', number: 18, title: 'Письменная коммуникация',   status: 'locked' },
      { id: 'es-b1-019', number: 19, title: 'Дискуссии',                 status: 'locked' },
      { id: 'es-b1-020', number: 20, title: 'Итог B1',                   status: 'locked' }
    ]
  },
  {
    level: 'B2', name: 'Продвинутый', color: '#f44336',
    goal: 'Обсуждать сложные вопросы, понимать продолжительную речь, общаться в профессиональной среде.',
    unlocked: false,
    modules: [
      { id: 'es-b2-001', number: 1,  title: 'Сложные глагольные формы',    status: 'locked' },
      { id: 'es-b2-002', number: 2,  title: 'Subjuntivo II',               status: 'locked' },
      { id: 'es-b2-003', number: 3,  title: 'Условные предложения',        status: 'locked' },
      { id: 'es-b2-004', number: 4,  title: 'Продвинутые местоимения',     status: 'locked' },
      { id: 'es-b2-005', number: 5,  title: 'Стиль и регистр',             status: 'locked' },
      { id: 'es-b2-006', number: 6,  title: 'Идиомы и устойчивые выражения', status: 'locked' },
      { id: 'es-b2-007', number: 7,  title: 'Аргументация',                status: 'locked' },
      { id: 'es-b2-008', number: 8,  title: 'Общественные темы',           status: 'locked' },
      { id: 'es-b2-009', number: 9,  title: 'Профессиональная коммуникация', status: 'locked' },
      { id: 'es-b2-010', number: 10, title: 'Технический испанский',       status: 'locked' },
      { id: 'es-b2-011', number: 11, title: 'Сложное аудирование',         status: 'locked' },
      { id: 'es-b2-012', number: 12, title: 'Анализ текстов',              status: 'locked' },
      { id: 'es-b2-013', number: 13, title: 'Презентации',                 status: 'locked' },
      { id: 'es-b2-014', number: 14, title: 'Переговоры и конфликты',      status: 'locked' },
      { id: 'es-b2-015', number: 15, title: 'Официальные документы',       status: 'locked' },
      { id: 'es-b2-016', number: 16, title: 'Культура и общество',         status: 'locked' },
      { id: 'es-b2-017', number: 17, title: 'Сложные письменные тексты',   status: 'locked' },
      { id: 'es-b2-018', number: 18, title: 'Беглая речь',                 status: 'locked' },
      { id: 'es-b2-019', number: 19, title: 'Подготовка к экзамену',       status: 'locked' },
      { id: 'es-b2-020', number: 20, title: 'Итог B2',                     status: 'locked' }
    ]
  }
];

const CA_CURRICULUM: CefrLevel[] = ES_CURRICULUM.map(level => ({
  ...level,
  modules: level.modules.map(m => ({
    ...m,
    id: m.id.replace('es-', 'ca-'),
    status: 'locked' as const
  }))
}));

@Component({
  selector: 'app-course',
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './course.component.html',
  styleUrl: './course.component.scss'
})
export class CourseComponent {
  private readonly route = inject(ActivatedRoute);

  private readonly langParam = toSignal(
    this.route.params.pipe(map(p => p['lang'] as string)),
    { initialValue: 'es' }
  );

  readonly langCode = computed(() => this.langParam());

  readonly langName = computed(() =>
    this.langCode() === 'ca' ? 'Català' : 'Español'
  );

  readonly langNative = computed(() =>
    this.langCode() === 'ca' ? 'Каталанский' : 'Испанский'
  );

  readonly curriculum = computed(() =>
    this.langCode() === 'ca' ? CA_CURRICULUM : ES_CURRICULUM
  );

  readonly expandedLevel = { value: 'A1' };

  toggleLevel(level: string): void {
    this.expandedLevel.value = this.expandedLevel.value === level ? '' : level;
  }

  isExpanded(level: string): boolean {
    return this.expandedLevel.value === level;
  }

  statusIcon(status: string): string {
    if (status === 'completed') return 'check_circle';
    if (status === 'available') return 'play_circle';
    return 'lock';
  }
}
