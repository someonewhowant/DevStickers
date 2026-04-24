import { Component, inject, signal, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/product.model';

@Component({
  selector: 'app-profile-orders',
  imports: [CommonModule],
  template: `
    <div class="orders-container">
      <header class="section-header">
        <h2>Deployment History</h2>
        <p>Your previous hardware upgrade missions</p>
      </header>

      @if (loading()) {
        <div class="loading-state">Scanning database...</div>
      } @else if (orders().length === 0) {
        <div class="empty-state">No missions accomplished yet.</div>
      } @else {
        <div class="orders-list">
          @for (order of orders(); track order.id) {
            <div class="order-row" (click)="selectOrder.emit(order)">
              <div class="order-id">#{{ order.id.split('-')[0] }}</div>
              <div class="order-date">{{ order.createdAt | date:'shortDate' }}</div>
              <div class="order-status" [class]="order.status.toLowerCase()">{{ order.status }}</div>
              <div class="order-total">{{ order.total | currency }}</div>
              <div class="order-action">→</div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .section-header { margin-bottom: var(--spacing-lg); }
    .section-header h2 { font-size: 1.8rem; margin-bottom: 0.3rem; }
    .section-header p { color: var(--text-secondary); font-size: 0.9rem; }
    
    .orders-list { display: flex; flex-direction: column; gap: 0.8rem; }
    .order-row { 
      background: var(--surface-color); border: 1px solid var(--border-color);
      padding: 1.2rem; border-radius: 12px; display: grid;
      grid-template-columns: 100px 1fr 120px 100px 40px; align-items: center;
      cursor: pointer; transition: all 0.2s;
    }
    .order-row:hover { border-color: var(--accent-blue); transform: translateX(5px); background: rgba(88, 166, 255, 0.05); }
    
    .order-id { font-family: 'JetBrains Mono', monospace; font-weight: 700; }
    .order-date { color: var(--text-secondary); font-size: 0.9rem; }
    .order-status { font-weight: 600; font-size: 0.8rem; text-transform: uppercase; text-align: center; border-radius: 6px; padding: 0.2rem 0.5rem; width: fit-content; }
    .order-status.pending { background: rgba(255, 123, 114, 0.1); color: var(--accent-red); }
    .order-status.completed { background: rgba(63, 185, 80, 0.1); color: var(--accent-green); }
    
    .order-total { font-weight: 700; color: var(--text-primary); text-align: right; }
    .order-action { text-align: right; color: var(--accent-blue); font-weight: 800; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileOrdersComponent {
  private orderService = inject(OrderService);
  orders = signal<Order[]>([]);
  loading = signal(true);
  selectOrder = output<Order>();

  constructor() {
    this.orderService.getOrders().subscribe(data => {
      this.orders.set(data);
      this.loading.set(false);
    });
  }
}
