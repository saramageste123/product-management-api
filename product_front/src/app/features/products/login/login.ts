import { Component, signal, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../service/auth.service';

type Fruit = 'banana' | 'orange' | 'apple';

interface LockState {
  unlockAt: number; // timestamp em ms
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent implements OnDestroy {

  private readonly MAX_ATTEMPTS = 3;
  private readonly LOCK_DURATION_MS = 60_000; // 1 minuto para testes — trocar para 5 min (300_000) antes do deploy final
  private readonly ANIMATION_DURATION_MS = 650;

  username = signal('');
  password = signal('');

  attempts = signal(0);
  currentFruit = signal<Fruit>('banana');
  previousFruit = signal<Fruit | null>(null);
  isAnimating = signal(false);

  errorMessage = signal('');
  submitting = signal(false);

  isLocked = signal(false);
  lockRemainingSeconds = signal(0);

  private lockIntervalId?: ReturnType<typeof setInterval>;
  private animationTimeoutId?: ReturnType<typeof setTimeout>;

  stateClass = computed(() => `state-${this.currentFruit()}`);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    if (this.lockIntervalId) clearInterval(this.lockIntervalId);
    if (this.animationTimeoutId) clearTimeout(this.animationTimeoutId);
  }

  fruitImage(fruit: Fruit): string {
    return `images/login/${fruit}.png`;
  }

  onUsernameChange(value: string): void {
    this.username.set(value);
    this.checkExistingLock();
  }

  private checkExistingLock(): void {
    const lock = this.readLock();

    if (lock && lock.unlockAt > Date.now()) {
      this.startLockCountdown(lock.unlockAt);
    }
  }

  submit(): void {
    if (this.isLocked() || this.submitting()) return;

    const user = this.username().trim();
    const pass = this.password();

    if (!user || !pass) {
      this.errorMessage.set('Please fill in all fields.');
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set('');

    this.authService.login(user, pass).subscribe({
      next: () => {
        this.submitting.set(false);
        this.clearLock();
        this.router.navigate(['/']);
      },
      error: () => {
        this.submitting.set(false);
        this.registerFailedAttempt();
      }
    });
  }

  private registerFailedAttempt(): void {
    const nextAttempts = this.attempts() + 1;
    this.attempts.set(nextAttempts);

    if (nextAttempts >= this.MAX_ATTEMPTS) {
      const unlockAt = Date.now() + this.LOCK_DURATION_MS;
      this.saveLock(unlockAt);
      this.startLockCountdown(unlockAt);
      return;
    }

    this.errorMessage.set('Incorrect username or password. Please check your information and try again.');
    this.transitionFruit(nextAttempts === 1 ? 'orange' : 'apple');
  }

  private transitionFruit(target: Fruit): void {
    if (this.currentFruit() === target) return;

    this.previousFruit.set(this.currentFruit());
    this.currentFruit.set(target);
    this.isAnimating.set(true);

    if (this.animationTimeoutId) clearTimeout(this.animationTimeoutId);

    this.animationTimeoutId = setTimeout(() => {
      this.isAnimating.set(false);
      this.previousFruit.set(null);
    }, this.ANIMATION_DURATION_MS);
  }

  private startLockCountdown(unlockAt: number): void {
    this.isLocked.set(true);
    this.transitionFruit('apple');

    if (this.lockIntervalId) clearInterval(this.lockIntervalId);

    const updateRemaining = () => {
      const remainingMs = unlockAt - Date.now();

      if (remainingMs <= 0) {
        this.unlockAccount();
        return;
      }

      this.lockRemainingSeconds.set(Math.ceil(remainingMs / 1000));
      this.errorMessage.set(this.buildLockMessage(this.lockRemainingSeconds()));
    };

    updateRemaining();
    this.lockIntervalId = setInterval(updateRemaining, 1000);
  }

  private buildLockMessage(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
      return `Account locked. Try again in ${minutes}m ${remainingSeconds}s.`;
    }

    return `Account locked. Try again in ${remainingSeconds}s.`;
  }

  private unlockAccount(): void {
    if (this.lockIntervalId) clearInterval(this.lockIntervalId);

    this.isLocked.set(false);
    this.lockRemainingSeconds.set(0);
    this.attempts.set(0);
    this.errorMessage.set('');
    this.transitionFruit('banana');
    this.clearLock();
  }

  // Persistência local do bloqueio (sobrevive a reload da página)
  // ⚠️ Isso é só uma conveniência de UX — a validação de verdade
  // precisa acontecer no backend quando o JWT existir.
  private lockKey(): string {
    return `login_lock_${this.username().trim().toLowerCase()}`;
  }

  private saveLock(unlockAt: number): void {
    const key = this.lockKey();
    if (!key.endsWith('_')) {
      localStorage.setItem(key, JSON.stringify({ unlockAt } as LockState));
    }
  }

  private readLock(): LockState | null {
    const key = this.lockKey();
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as LockState;
    } catch {
      return null;
    }
  }

  private clearLock(): void {
    localStorage.removeItem(this.lockKey());
  }
}