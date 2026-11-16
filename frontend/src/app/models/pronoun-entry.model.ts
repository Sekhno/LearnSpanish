export interface PronounEntry {
  id: number;
  category: string;
  person: string | null;
  english: string;
  ukrainian: string;
  spanish: string;
  catalan: string;
  notes: string | null;
}

export const PRONOUNS_CATEGORY_LABELS: Record<string, string> = {
  personal_subject: 'Особові (підмет)',
  possessive:       'Присвійні',
  demonstrative:    'Вказівні',
  interrogative:    'Питальні'
};

export const PRONOUNS_CATEGORY_ICONS: Record<string, string> = {
  personal_subject: 'person',
  possessive:       'favorite_border',
  demonstrative:    'touch_app',
  interrogative:    'help_outline'
};
