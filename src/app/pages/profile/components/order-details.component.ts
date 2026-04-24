import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from '../../../models/product.model';
import { ProductCardComponent } from '../../../features/product-card/product-card.component';

@Component({
  selector: 'app-order-details',
  imports: [CommonModule, ProductCardComponent],
  template: `
    <div class="order-details animate-in">
      <header class="details-header">
        <button class="btn-text" (click)="close.emit()">← Back to Missions</button>
        <div class="header-main">
            <h2>Order Details #{{ order().id.split('-')[0] }}</h2>
            <span class="order-badge" [class]="order().status.toLowerCase()">{{ order().status }}</span>
        </div>
      </header>

      <div class="items-grid">
        @for (item of order().items; track item.id) {
          <div class="item-wrapper">
            <app-product-card [product]="item.sticker" [showAddButton]="false"></app-product-card>
            <div class="item-qty-tag">x{{ item.quantity }}</div>
          </div>
        }
      </div>

      <footer class="details-footer">
        <div class="summary-card">
          <div class="summary-row">
            <span>Date:</span>
            <strong>{{ order().createdAt | date:'mediumDate' }}</strong>
          </div>
          <div class="summary-row total">
            <span>Total Paid:</span>
            <span class="total-val">{{ order().total | currency }}</span>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .order-details { background: var(--surface-color); border-radius: 24px; padding: var(--spacing-lg); border: 1px solid var(--border-color); }
    .details-header { margin-bottom: var(--spacing-lg); }
    .btn-text { background: none; border: none; color: var(--accent-blue); cursor: pointer; padding: 0; margin-bottom: 1rem; font-family: 'JetBrains Mono', monospace; }
    
    .header-main { display: flex; justify-content: space-between; align-items: center; }
    .header-main h2 { margin: 0; font-size: 1.8rem; }
    
    .order-badge { padding: 0.3rem 0.8rem; border-radius: 80px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
    .order-badge.pending { background: rgba(255, 123, 114, 0.1); color: var(--accent-red); border: 1px solid var(--accent-red); }
    .order-badge.completed { background: rgba(63, 185, 80, 0.1); color: var(--accent-green); border: 1px solid var(--accent-green); }

    .items-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); 
      gap: var(--spacing-md); 
      margin-bottom: var(--spacing-lg);
    }
    
    .item-wrapper { position: relative; }
    .item-qty-tag { 
        position: absolute; top: 10px; right: 10px; 
        background: var(--accent-blue); color: var(--bg-color); 
        padding: 0.2rem 0.5rem; border-radius: 6px; 
        font-weight: 800; font-size: 0.8rem; z-index: 10;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    }
    
    .details-footer { padding-top: var(--spacing-md); border-top: 1px solid var(--border-color); }
    .summary-card { background: var(--card-bg); padding: 1.5rem; border-radius: 16px; width: fit-content; margin-left: auto; min-width: 250px; }
    .summary-row { display: flex; justify-content: space-between; margin-bottom: 0.5rem; color: var(--text-secondary); }
    .summary-row.total { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color); color: var(--text-primary); }
    .total-val { font-size: 1.4rem; font-weight: 800; color: var(--accent-green); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderDetailsComponent {
  order = input.required<Order>();
  close = output<void>();
}
