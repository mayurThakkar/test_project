import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { LoadingService } from './loading.service';
import { LoginRequest, LoginResponse, User } from '../models/login.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly cookieService = inject(CookieService);
  private readonly loadingService = inject(LoadingService);
  private readonly notificationService = inject(NotificationService);
  
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';
  private readonly LOGIN_LOADING_KEY = 'login-operation';
  
  private readonly _user = signal<User | null>(this.getUserFromStorage());
  private readonly _loading = signal(false);
  
  readonly user = this._user.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly isAuthenticated = computed(() => !!this._user() && !!this.getToken());
  
  readonly isGlobalLoading = computed(() => this.loadingService.isLoadingKey(this.LOGIN_LOADING_KEY));

  constructor() {
    this.initializeAuth();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    this._loading.set(true);
    this.loadingService.setLoading(this.LOGIN_LOADING_KEY, 'Authenticating user...');
    
    return this.http.post<LoginResponse>('/api/login', credentials).pipe(
      tap(response => {
        this.setAuthData(response.token, response.user);
        this._user.set(response.user);
        this._loading.set(false);
        this.loadingService.clearLoading(this.LOGIN_LOADING_KEY);
        this.router.navigate(['/dashboard']);
        this.notificationService.showSuccess('Login successful! Welcome.');
      }),
      catchError(error => {
        this._loading.set(false);
        this.loadingService.clearLoading(this.LOGIN_LOADING_KEY);
        this.notificationService.showError('Login failed. Please try again.');
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    this.clearAuthData();
    this._user.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.cookieService.get(this.TOKEN_KEY) || null;
  }

  private setAuthData(token: string, user: User): void {
    const cookieOptions = { 
      secure: true, 
      sameSite: 'Strict' as const,
      expires: 1
    };
    
    this.cookieService.set(this.TOKEN_KEY, token, cookieOptions);
    this.cookieService.set(this.USER_KEY, JSON.stringify(user), cookieOptions);
  }

  private clearAuthData(): void {
    this.cookieService.delete(this.TOKEN_KEY);
    this.cookieService.delete(this.USER_KEY);
  }

  private getUserFromStorage(): User | null {
    try {
      const userData = this.cookieService.get(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  private initializeAuth(): void {
    const token = this.getToken();
    const user = this.getUserFromStorage();
    
    if (token && user) {
      this._user.set(user);
    } else if (token || user) {
      this.clearAuthData();
    }
  }
}