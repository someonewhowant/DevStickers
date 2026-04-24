import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-success',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container success-page animate-in">
      <div class="success-card">
        <div class="icon-wrapper">
          <span class="check-icon">✓</span>
        </div>
        <h1>Mission Accomplished</h1>
        <p class="order-info">Order ID: <span class="highlight">#{{ orderId }}</span></p>
        <p class="description">
          Your hardware upgrade kit is being prepared for deployment. 
          A confirmation transmission has been sent to your primary email address.
        </p>
        
        <div class="actions">
          <button class="btn btn-primary" routerLink="/profile">View Deployments</button>
          <button class="btn btn-outline" routerLink="/">Back to Base</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .success-page {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 70vh;
      text-align: center;
    }
    .success-card {
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      padding: var(--spacing-lg);
      border-radius: 32px;
      max-width: 600px;
      box-shadow: var(--glow-green);
    }
    .icon-wrapper {
      width: 80px;
      height: 80px;
      background: var(--accent-green);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 2rem;
      font-size: 2.5rem;
      color: var(--bg-color);
      box-shadow: 0 0 30px rgba(63, 185, 80, 0.4);
    }
    h1 { font-size: 2.5rem; margin-bottom: 1rem; letter-spacing: -1px; }
    .order-info { font-family: 'JetBrains Mono', monospace; color: var(--text-secondary); margin-bottom: 1.5rem; }
    .highlight { color: var(--accent-blue); font-weight: 700; }
    .description { color: var(--text-secondary); line-height: 1.8; margin-bottom: 2.5rem; }
    .actions { display: flex; gap: 1rem; justify-content: center; }
  `]
})
export class OrderSuccessComponent {
  private route = inject(ActivatedRoute);
  orderId = this.route.snapshot.paramMap.get('id');
}
