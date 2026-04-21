import { Component, inject, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'app-cart',
    imports: [CommonModule, RouterModule, NgOptimizedImage],
    template: `
    <div class="container cart-page animate-in">
        <h1>Your Shopping Cart</h1>
        
        @if (cartService.cartCount() > 0) {
            <div class="cart-layout">
                <div class="cart-items">
                    @for (item of cartService.getCartItems(); track item.id) {
                        <div class="cart-item">
                            <img [ngSrc]="item.image" [alt]="item.name" width="80" height="80">
                            <div class="item-info">
                                <h3>{{ item.name }}</h3>
                                <span class="tag">{{ item.tag }}</span>
                            </div>
                            <p class="price">{{ item.price | currency }}</p>
                        </div>
                    }
                </div>

                <aside class="summary">
                    <h3>Order Summary</h3>
                    <div class="summary-row">
                        <span>Subtotal</span>
                        <span>{{ subtotal() | currency }}</span>
                    </div>
                    <div class="summary-row">
                        <span>Shipping</span>
                        <span class="free">FREE</span>
                    </div>
                    <hr>
                    <div class="summary-row total">
                        <span>Total</span>
                        <span>{{ subtotal() | currency }}</span>
                    </div>
                    <button class="btn btn-primary checkout-btn">Proceed to Checkout</button>
                    <p class="crypto-note">We accept Bitcoin & Ethereum</p>
                </aside>
            </div>
        } @else {
            <div class="empty-state">
                <p>Your basket is empty. Time to add some flair to your laptop!</p>
                <button class="btn btn-primary" [routerLink]="['/collections']">Browse Stickers</button>
            </div>
        }
    </div>
  `,
    styles: [`
    .cart-page { padding: var(--spacing-lg) var(--spacing-sm); }
    h1 { margin-bottom: var(--spacing-lg); }
    
    .cart-layout {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: var(--spacing-lg);
    }
    
    .cart-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        background: var(--surface-color);
        padding: var(--spacing-sm);
        border-radius: 12px;
        margin-bottom: var(--spacing-sm);
        border: 1px solid var(--border-color);
    }
    
    .cart-item img { width: 80px; height: 80px; object-fit: contain; }
    .item-info { flex: 1; }
    .item-info h3 { font-size: 1.1rem; }
    .price { font-weight: 700; color: var(--accent-green); }
    
    .summary {
        background: var(--surface-color);
        padding: var(--spacing-md);
        border-radius: 12px;
        border: 1px solid var(--border-color);
        height: fit-content;
    }
    
    .summary h3 { margin-bottom: 1.5rem; }
    .summary-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
        color: var(--text-secondary);
    }
    
    .summary-row.total {
        color: var(--text-primary);
        font-weight: 700;
        font-size: 1.25rem;
        margin-top: 1rem;
    }
    
    .free { color: var(--accent-green); font-weight: 700; }
    hr { border: 0; border-top: 1px solid var(--border-color); margin: 1rem 0; }
    .checkout-btn { width: 100%; margin-top: 1.5rem; }
    .crypto-note { text-align: center; font-size: 0.75rem; color: var(--text-secondary); margin-top: 1rem; }
    
    .empty-state { text-align: center; padding: var(--spacing-lg) 0; }
    .empty-state p { margin-bottom: var(--spacing-md); color: var(--text-secondary); }
    
    @media (max-width: 768px) {
        .cart-layout { grid-template-columns: 1fr; }
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent {
    cartService = inject(CartService);

    subtotal = computed(() => 
        this.cartService.getCartItems().reduce((acc, item) => acc + item.price, 0)
    );
}
