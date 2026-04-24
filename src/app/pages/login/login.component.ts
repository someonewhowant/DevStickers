import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container animate-in">
      <div class="auth-card">
        <header class="auth-header">
          <h1>Welcome Back</h1>
          <p>Login to your operator account</p>
        </header>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label>Email Address</label>
            <div class="input-wrapper">
              <input type="email" formControlName="email" placeholder="name@domain.com" 
                     [class.error]="isFieldInvalid('email')">
              <span class="input-focus"></span>
            </div>
          </div>

          <div class="form-group">
            <label>Access Code</label>
            <div class="input-wrapper">
              <input type="password" formControlName="password" placeholder="••••••••"
                     [class.error]="isFieldInvalid('password')">
              <span class="input-focus"></span>
            </div>
          </div>

          @if (errorMessage()) {
            <div class="error-banner">
              <span class="icon">⚠️</span>
              <p>{{ errorMessage() }}</p>
            </div>
          }

          <button type="submit" class="btn btn-primary btn-auth" [disabled]="loginForm.invalid || loading()">
            {{ loading() ? 'Authenticating...' : 'Establish Connection' }}
          </button>
        </form>

        <footer class="auth-footer">
          <p>New operator? <a routerLink="/register">Register here</a></p>
        </footer>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      padding: var(--spacing-md);
    }
    .auth-card {
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: 24px;
      padding: var(--spacing-lg);
      width: 100%;
      max-width: 450px;
      box-shadow: var(--glow-blue);
      position: relative;
      overflow: hidden;
    }
    .auth-card::before {
      content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 4px;
      background: linear-gradient(90deg, var(--accent-blue), var(--accent-purple));
    }
    .auth-header { text-align: center; margin-bottom: var(--spacing-lg); }
    .auth-header h1 { font-size: 2rem; margin-bottom: 0.5rem; letter-spacing: -1px; }
    .auth-header p { color: var(--text-secondary); font-size: 0.9rem; }
    
    .auth-form { display: flex; flex-direction: column; gap: 1.5rem; }
    .form-group label { 
      display: block; margin-bottom: 0.6rem; font-size: 0.8rem; 
      font-weight: 600; text-transform: uppercase; color: var(--text-secondary);
      letter-spacing: 1px;
    }
    .input-wrapper { position: relative; }
    .input-wrapper input {
      width: 100%; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color);
      padding: 1rem 1.2rem; border-radius: 12px; color: white; transition: all 0.3s;
      font-family: 'JetBrains Mono', monospace; font-size: 0.95rem;
    }
    .input-wrapper input:focus { outline: none; border-color: var(--accent-blue); background: rgba(255,255,255,0.05); }
    .input-wrapper input.error { border-color: var(--accent-red); }
    
    .btn-auth { width: 100%; padding: 1.1rem; font-size: 1rem; border-radius: 12px; margin-top: 1rem; }
    
    .error-banner {
      background: rgba(255, 123, 114, 0.1); border: 1px solid var(--accent-red);
      padding: 0.8rem; border-radius: 10px; display: flex; gap: 0.8rem; align-items: center;
      color: var(--accent-red); font-size: 0.85rem; animation: shake 0.4s;
    }
    
    .auth-footer { text-align: center; margin-top: var(--spacing-lg); color: var(--text-secondary); font-size: 0.9rem; }
    .auth-footer a { color: var(--accent-blue); font-weight: 600; text-decoration: underline; }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.cartService.syncAfterLogin();
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message || 'Connection failed. Check credentials.');
      }
    });
  }
}
