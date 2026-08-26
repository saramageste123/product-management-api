import { Injectable } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';

// ⚠️ TEMPORÁRIO: este service simula autenticação enquanto o backend
// de login (Spring Security + JWT) não existe. Nenhuma validação real
// de segurança acontece aqui — é só pra desenvolver a tela de login
// de forma isolada. Substituir por chamada HTTP real assim que o
// backend estiver pronto.
@Injectable({ providedIn: 'root' })
export class AuthService {

  // Credencial fake só para testar o fluxo visual
  private readonly FAKE_USERNAME = 'admin';
  private readonly FAKE_PASSWORD = '12345678';

  login(username: string, password: string): Observable<boolean> {
    const isValid = username === this.FAKE_USERNAME && password === this.FAKE_PASSWORD;

    if (isValid) {
      return of(true).pipe(delay(400));
    }

    return throwError(() => new Error('Invalid credentials')).pipe(delay(400));
  }
}