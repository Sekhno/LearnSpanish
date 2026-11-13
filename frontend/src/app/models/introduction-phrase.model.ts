export interface IntroductionPhrase {
  id: number;
  category: string;
  type: 'question' | 'answer';
  english: string;
  ukrainian: string;
  spanish: string;
  catalan: string;
  notes: string | null;
}

export const INTRO_CATEGORY_LABELS: Record<string, string> = {
  name:         'Знайомство та ім\'я',
  origin:       'Походження та місце',
  age:          'Вік',
  occupation:   'Робота та навчання',
  family:       'Родина',
  languages:    'Мови',
  contact:      'Контакти'
};

export const INTRO_CATEGORY_ICONS: Record<string, string> = {
  name:       'badge',
  origin:     'location_on',
  age:        'cake',
  occupation: 'work',
  family:     'family_restroom',
  languages:  'translate',
  contact:    'contact_phone'
};
