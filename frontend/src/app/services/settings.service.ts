import { Injectable, signal, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  readonly spanishOnly = signal<boolean>(
    localStorage.getItem('spanishOnly') === 'true'
  );

  constructor() {
    effect(() => {
      localStorage.setItem('spanishOnly', String(this.spanishOnly()));
    });
  }

  setSpanishOnly(value: boolean): void {
    this.spanishOnly.set(value);
  }
}
