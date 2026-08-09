import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error';

@Injectable({ providedIn: 'root' })
export class ToastService {

  message = signal('');
  type = signal<ToastType>('success');
  visible = signal(false);

  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  show(message: string, type: ToastType = 'success', durationMs = 4000): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.message.set(message);
    this.type.set(type);
    this.visible.set(true);

    this.timeoutId = setTimeout(() => {
      this.visible.set(false);
      this.timeoutId = null;
    }, durationMs);
  }
}