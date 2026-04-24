import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container animate-in">
      <div class="auth-card">
        <header class="auth-header">
          <h1>New Operator</h1>
          <p>Initialize your DevStickers identity</p>
        </header>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label>Email Address</label>
            <div class="input-wrapper">
              <input type="email" formControlName="email" placeholder="name@domain.com" 
                     [class.error]="isFieldInvalid('email')">
            </div>
            @if (isFieldInvalid('email')) {
              <span class="field-error">Valid email required</span>
            }
          </div>

          <div class="form-group">
            <label>Secure Password</label>
            <div class="input-wrapper">
              <input type="password" formControlName="password" placeholder="Min 6 characters"
                     [class.error]="isFieldInvalid('password')">
            </div>
            @if (isFieldInvalid('password')) {
              <span class="field-error">Security level too low (min 6 chars)</span>
            }
          </div>

          <div class="form-group">
            <label>Confirm Identity</label>
            <div class="input-wrapper">
              <input type="password" formControlName="confirmPassword" placeholder="Repeat password"
                     [class.error]="registerForm.errors?.['mismatch'] && registerForm.get('confirmPassword')?.touched">
            </div>
            @if (registerForm.errors?.['mismatch'] && registerForm.get('confirmPassword')?.touched) {
              <span class="field-error">Passwords do not match</span>
            }
          </div>

          @if (errorMessage()) {
            <div class="error-banner">
              <span class="icon">⚠️</span>
              <p>{{ errorMessage() }}</p>
            </div>
          }

          <button type="submit" class="btn btn-primary btn-auth" [disabled]="registerForm.invalid || loading()">
            {{ loading() ? 'Processing...' : 'Register Account' }}
          </button>
        </form>

        <footer class="auth-footer">
          <p>Already have an account? <a routerLink="/login">Login here</a></p>
        </footer>
      </div>
    </div>
  `,
  styles: [`
    .auth-container { display: flex; justify-content: center; align-items: center; min-height: 80vh; padding: var(--spacing-md); }
    .auth-card {
      background: var(--surface-color); border: 1px solid var(--border-color);
      border-radius: 24px; padding: var(--spacing-lg); width: 100%; max-width: 450px;
      box-shadow: var(--glow-purple); position: relative; overflow: hidden;
    }
    .auth-card::before {
      content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 4px;
      background: linear-gradient(90deg, var(--accent-purple), var(--accent-blue));
    }
    .auth-header { text-align: center; margin-bottom: var(--spacing-lg); }
    .auth-header h1 { font-size: 2rem; margin-bottom: 0.5rem; letter-spacing: -1px; }
    .auth-header p { color: var(--text-secondary); font-size: 0.9rem; }
    
    .auth-form { display: flex; flex-direction: column; gap: 1.25rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: var(--text-secondary); }
    .input-wrapper input {
      width: 100%; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color);
      padding: 0.9rem 1.1rem; border-radius: 12px; color: white; transition: all 0.3s;
      font-family: 'JetBrains Mono', monospace;
    }
    .input-wrapper input:focus { outline: none; border-color: var(--accent-purple); background: rgba(255,255,255,0.05); }
    .input-wrapper input.error { border-color: var(--accent-red); }
    
    .field-error { font-size: 0.7rem; color: var(--accent-red); margin-top: 0.3rem; display: block; }
    
    .btn-auth { width: 100%; padding: 1.1rem; font-size: 1rem; border-radius: 12px; margin-top: 1rem; background-color: var(--accent-purple); box-shadow: var(--glow-purple); }
    .btn-auth:hover { background-color: #c6a3ff; }
    
    .error-banner { background: rgba(255, 123, 114, 0.1); border: 1px solid var(--accent-red); padding: 0.8rem; border-radius: 10px; display: flex; gap: 0.8rem; align-items: center; color: var(--accent-red); font-size: 0.85rem; }
    .auth-footer { text-align: center; margin-top: var(--spacing-lg); color: var(--text-secondary); font-size: 0.9rem; }
    .auth-footer a { color: var(--accent-purple); font-weight: 600; text-decoration: underline; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);

  registerForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.cartService.syncAfterLogin();
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message || 'Registration failed. Try another email.');
      }
    });
  }
}
