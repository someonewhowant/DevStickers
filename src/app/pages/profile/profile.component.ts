import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ProfileOrdersComponent } from './components/profile-orders.component';
import { OrderDetailsComponent } from './components/order-details.component';
import { Order } from '../../models/product.model';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ProfileOrdersComponent, OrderDetailsComponent],
  template: `
    <div class="container profile-page animate-in">
      <aside class="profile-sidebar">
        <div class="user-info">
          <div class="avatar">{{ authService.currentUser()?.email?.charAt(0) | uppercase }}</div>
          <h3>{{ authService.currentUser()?.email }}</h3>
          <span class="rank-tag">Level 1 Operator</span>
        </div>
        
        <nav class="profile-nav">
          <button class="nav-item active">Orders History</button>
          <button class="nav-item">Settings</button>
          <button class="nav-item logout" (click)="authService.logout()">Disconnect</button>
        </nav>
      </aside>

      <main class="profile-main">
        @if (selectedOrder(); as order) {
          <app-order-details [order]="order" (close)="selectedOrder.set(null)"></app-order-details>
        } @else {
          <app-profile-orders (selectOrder)="selectedOrder.set($event)"></app-profile-orders>
        }
      </main>
    </div>
  `,
  styles: [`
    .profile-page { 
      display: grid; grid-template-columns: 300px 1fr; gap: var(--spacing-lg); 
      padding: var(--spacing-lg) var(--spacing-md); 
    }
    
    .profile-sidebar { 
      background: var(--surface-color); border: 1px solid var(--border-color);
      border-radius: 24px; padding: var(--spacing-md); height: fit-content;
    }
    
    .user-info { text-align: center; margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1px solid var(--border-color); }
    .avatar { 
      width: 80px; height: 80px; background: var(--accent-blue); border-radius: 50%;
      margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center;
      font-size: 2rem; font-weight: 800; color: var(--bg-color);
    }
    .rank-tag { font-size: 0.7rem; color: var(--accent-blue); text-transform: uppercase; font-weight: 700; letter-spacing: 1px; }
    
    .profile-nav { display: flex; flex-direction: column; gap: 0.5rem; }
    .nav-item { 
      width: 100%; text-align: left; padding: 1rem; border: none; background: transparent;
      color: var(--text-secondary); cursor: pointer; border-radius: 12px; transition: all 0.2s;
      font-weight: 600;
    }
    .nav-item:hover { background: rgba(255,255,255,0.03); color: var(--text-primary); }
    .nav-item.active { background: rgba(88, 166, 255, 0.1); color: var(--accent-blue); }
    .nav-item.logout { margin-top: 2rem; color: var(--accent-red); }
    
    @media (max-width: 768px) {
      .profile-page { grid-template-columns: 1fr; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
  authService = inject(AuthService);
  selectedOrder = signal<Order | null>(null);
}
