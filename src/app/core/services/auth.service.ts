import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RegisterRequest, User } from '../../shared/models/user.model';
import { ApiResponse } from '../../shared/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly base = `${environment.apiBaseUrl}/api/auth`;

  private readonly _user = signal<User | null>(null);
  private readonly _bootstrapped = signal(false);

  readonly user = this._user.asReadonly();
  readonly bootstrapped = this._bootstrapped.asReadonly();
  readonly isAuthenticated = computed(() => !!this._user());

  async bootstrap(): Promise<void> {
    try {
      const res = await firstValueFrom(this.http.get<ApiResponse<User>>(`${this.base}/me`));
      if (res?.success && res.data) {
        this._user.set(res.data);
      } else {
        this._user.set(null);
      }
    } catch {
      this._user.set(null);
    } finally {
      this._bootstrapped.set(true);
    }
  }

  login(userNameOrEmail: string, password: string): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${this.base}/login`, {
      userNameOrEmail,
      password,
    });
  }

  register(req: RegisterRequest): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${this.base}/register`, req);
  }

  setUser(user: User | null): void {
    this._user.set(user);
  }

  logout(): void {
    this.http.post(`${this.base}/logout`, {}).subscribe({
      next: () => {
        this._user.set(null);
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        this._user.set(null);
        this.router.navigate(['/auth/login']);
      },
    });
  }

  hasRole(roles: string[]): boolean {
    const u = this._user();
    return !!u && roles.includes(u.role);
  }
}
