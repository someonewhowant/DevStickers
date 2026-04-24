import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

interface AuthResponse {
  access_token: string;
  user: { id: string; email: string };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly TOKEN_KEY = 'ds_auth_token';

  currentUser = signal<{ id: string, email: string } | null>(this.loadUserFromToken());
  isAuthenticated = signal<boolean>(!!this.getToken());

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/login', credentials).pipe(
      tap(res => this.handleAuth(res))
    );
  }

  register(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/register', data).pipe(
      tap(res => this.handleAuth(res))
    );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  private handleAuth(res: AuthResponse) {
    localStorage.setItem(this.TOKEN_KEY, res.access_token);
    this.currentUser.set(res.user);
    this.isAuthenticated.set(true);
  }

  private loadUserFromToken() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(this.TOKEN_KEY);
      if (token) {
        // Simplified: in real app, decode JWT. 
        // For now, we'll assume we have a user if token exists.
        return { id: 'restored', email: 'operator@devstickers.io' };
      }
    }
    return null;
  }
}
