export interface ShoppingItem {
  id: number;
  category: string;
  english: string;
  ukrainian: string;
  spanish: string;
  catalan: string;
  notes: string | null;
}

export const CATEGORY_LABELS: Record<string, string> = {
  FRUIT:          'Фрукти',
  VEGETABLE:      'Овочі',
  MEAT:           'М\'ясо',
  SEAFOOD:        'Риба та морепродукти',
  DAIRY:          'Молочні продукти',
  BAKERY:         'Хлібобулочні',
  DRINKS:         'Напої',
  PANTRY:         'Бакалія',
  HYGIENE:        'Гігієна',
  EGGS:           'Яйця',
  MUSHROOMS:      'Гриби',
  CLEANING:       'Прибирання',
  HEALTH:         'Здоров\'я',
  RESTAURANT:     'Ресторан',
  TRANSPORT:      'Транспорт',
  HOUSING:        'Житло',
  CITY:           'Місто',
  SHOPPING:       'Шопінг',
  BANKING:        'Банківська справа',
  ADMINISTRATION: 'Адміністрація',
  COMMUNICATION:  'Комунікація',
  TECHNOLOGY:     'Технології',
  EMERGENCY:      'Екстрена ситуація',
  WEATHER:        'Погода',
  TIME:           'Час',
  NUMBERS:        'Числа',
  VERBS:          'Дієслова',
};

export const CATEGORY_ICONS: Record<string, string> = {
  FRUIT:          '🍎',
  VEGETABLE:      '🥦',
  MEAT:           '🥩',
  SEAFOOD:        '🐟',
  DAIRY:          '🥛',
  BAKERY:         '🍞',
  DRINKS:         '🥤',
  PANTRY:         '🫙',
  HYGIENE:        '🧴',
  EGGS:           '🥚',
  MUSHROOMS:      '🍄',
  CLEANING:       '🧹',
  HEALTH:         '💊',
  RESTAURANT:     '🍽️',
  TRANSPORT:      '🚌',
  HOUSING:        '🏠',
  CITY:           '🏙️',
  SHOPPING:       '🛒',
  BANKING:        '🏦',
  ADMINISTRATION: '🏛️',
  COMMUNICATION:  '📱',
  TECHNOLOGY:     '💻',
  EMERGENCY:      '🚨',
  WEATHER:        '☀️',
  TIME:           '⏰',
  NUMBERS:        '🔢',
  VERBS:          '📝',
};
