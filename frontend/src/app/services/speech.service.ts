import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SpeechService {
  readonly isSupported = !!window.speechSynthesis;

  /** Key of currently speaking word: "{text}:{lang}" */
  readonly speakingKey = signal<string | null>(null);

  speak(text: string, lang: string): void {
    if (!this.isSupported) return;

    // Take first form when word has alternatives, e.g. "un / una" → "un"
    const clean = text.split('/')[0].trim();
    const key = `${clean}:${lang}`;

    window.speechSynthesis.cancel();

    if (this.speakingKey() === key) {
      this.speakingKey.set(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = lang;
    utterance.rate = 0.85;

    utterance.onstart = () => this.speakingKey.set(key);
    utterance.onend = () => this.speakingKey.set(null);
    utterance.onerror = () => this.speakingKey.set(null);

    window.speechSynthesis.speak(utterance);
  }

  isSpeaking(text: string, lang: string): boolean {
    const clean = text.split('/')[0].trim();
    return this.speakingKey() === `${clean}:${lang}`;
  }
}
