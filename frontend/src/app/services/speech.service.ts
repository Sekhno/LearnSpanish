import { Injectable, signal } from '@angular/core';

/**
 * Plays pre-generated Piper TTS audio (WAV) via Web Audio API.
 * Drop-in replacement for the previous browser SpeechSynthesis service —
 * the public interface (isSupported, speak, isSpeaking, speakingKey) is identical.
 *
 * File path: /audio/{es|ca}/{djb2(text)}.wav
 * The djb2 hash here MUST match generate-audio.py's djb2() function.
 */
@Injectable({ providedIn: 'root' })
export class SpeechService {
  readonly isSupported = true;

  /** Key of currently speaking word: "{cleanText}:{lang}" */
  readonly speakingKey = signal<string | null>(null);

  private audioCtx: AudioContext | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private cache = new Map<string, AudioBuffer>();

  speak(text: string, lang: string): void {
    const clean = text.split('/')[0].trim();
    const key = `${clean}:${lang}`;

    // Stop current playback
    if (this.currentSource) {
      this.currentSource.stop();
      this.currentSource = null;
    }

    // Toggle off if same key
    if (this.speakingKey() === key) {
      this.speakingKey.set(null);
      return;
    }

    this.speakingKey.set(key);
    this.playAudio(clean, lang, key);
  }

  isSpeaking(text: string, lang: string): boolean {
    const clean = text.split('/')[0].trim();
    return this.speakingKey() === `${clean}:${lang}`;
  }

  private async playAudio(text: string, lang: string, key: string): Promise<void> {
    try {
      const langCode = lang.startsWith('es') ? 'es' : 'ca';
      const hash = this.djb2(text);
      const url = `http://localhost:8080/audio/${langCode}/${hash}.wav`;

      if (!this.audioCtx) {
        this.audioCtx = new AudioContext();
      }

      let buffer = this.cache.get(url);
      if (!buffer) {
        const response = await fetch(url, { credentials: 'include' });
        if (!response.ok) { this.speakingKey.set(null); return; }
        const arrayBuffer = await response.arrayBuffer();
        buffer = await this.audioCtx.decodeAudioData(arrayBuffer);
        this.cache.set(url, buffer);
      }

      // Check key is still current (user may have clicked again during fetch)
      if (this.speakingKey() !== key) return;

      const source = this.audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(this.audioCtx.destination);
      source.onended = () => {
        if (this.speakingKey() === key) {
          this.speakingKey.set(null);
        }
        this.currentSource = null;
      };
      source.start();
      this.currentSource = source;
    } catch {
      this.speakingKey.set(null);
    }
  }

  /**
   * DJB2 hash — MUST match generate-audio.py's djb2() function exactly.
   * Operates on UTF-16 code units (same as Python's ord() for BMP characters).
   */
  private djb2(text: string): string {
    let h = 5381;
    for (let i = 0; i < text.length; i++) {
      h = ((h << 5) + h) ^ text.charCodeAt(i);
      h = h >>> 0;
    }
    return h.toString(16).padStart(8, '0');
  }
}
