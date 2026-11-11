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
  FRUIT:     'Фрукти',
  VEGETABLE: 'Овочі',
  MEAT:      'М\'ясо',
  SEAFOOD:   'Риба та морепродукти',
  DAIRY:     'Молочні продукти',
  BAKERY:    'Хлібобулочні',
  DRINKS:    'Напої',
  PANTRY:    'Бакалія',
  HYGIENE:   'Гігієна'
};

export const CATEGORY_ICONS: Record<string, string> = {
  FRUIT:     '🍎',
  VEGETABLE: '🥦',
  MEAT:      '🥩',
  SEAFOOD:   '🐟',
  DAIRY:     '🥛',
  BAKERY:    '🍞',
  DRINKS:    '🥤',
  PANTRY:    '🫙',
  HYGIENE:   '🧴'
};
