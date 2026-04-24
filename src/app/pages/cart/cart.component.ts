import { Component, inject, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'app-cart',
    imports: [CommonModule, RouterModule, NgOptimizedImage],
    template: `
    <div class="container cart-page animate-in">
        <header class="cart-header">
            <h1>Your Shopping Cart</h1>
            @if (cartService.cartCount() > 0) {
                <button class="btn-text clear-btn" (click)="cartService.clearCart()">Clear Cart</button>
            }
        </header>
        
        @if (cartService.cartCount() > 0) {
            <div class="cart-layout">
                <div class="cart-items">
                    @for (item of cartService.getCartItems(); track item.product.id) {
                        <div class="cart-item">
                            <div class="item-main" [routerLink]="['/product', item.product.id]">
                                <img [ngSrc]="item.product.imageUrl" [alt]="item.product.name" width="100" height="100">
                                <div class="item-info">
                                    <h3>{{ item.product.name }}</h3>
                                    <span class="tag">{{ item.product.category }}</span>
                                    <p class="unit-price">{{ item.product.price | currency }} each</p>
                                </div>
                            </div>
                            
                            <div class="item-actions">
                                <div class="quantity-controls">
                                    <button class="qty-btn" (click)="cartService.updateQuantity(item.product.id, -1)" [disabled]="item.quantity <= 1">-</button>
                                    <span class="quantity">{{ item.quantity }}</span>
                                    <button class="qty-btn" (click)="cartService.updateQuantity(item.product.id, 1)">+</button>
                                </div>
                                <div class="item-total">
                                    <p class="total-price">{{ (item.product.price * item.quantity) | currency }}</p>
                                    <button class="remove-link" (click)="cartService.removeFromCart(item.product.id)">Remove</button>
                                </div>
                            </div>
                        </div>
                    }
                </div>

                <aside class="summary">
                    <h3>Order Summary</h3>
                    <div class="summary-details">
                        <div class="summary-row">
                            <span>Subtotal ({{ cartService.cartCount() }} items)</span>
                            <span>{{ cartService.subtotal() | currency }}</span>
                        </div>
                        <div class="summary-row">
                            <span>Estimated Shipping</span>
                            <span class="free">FREE</span>
                        </div>
                        <div class="summary-row">
                            <span>Estimated Tax</span>
                            <span>{{ tax() | currency }}</span>
                        </div>
                    </div>
                    <hr>
                    <div class="summary-row total">
                        <span>Total</span>
                        <span>{{ total() | currency }}</span>
                    </div>
                    <button class="btn btn-primary checkout-btn" (click)="checkout()">Proceed to Checkout</button>
                    
                    <div class="trust-badges">
                        <div class="badge">
                            <span class="icon">🔒</span>
                            <span>Secure Checkout</span>
                        </div>
                        <div class="badge">
                            <span class="icon">💎</span>
                            <span>Crypto Accepted</span>
                        </div>
                    </div>
                </aside>
            </div>
        } @else {
            <div class="empty-state">
                <div class="empty-icon">🛒</div>
                <h2>Your basket is empty</h2>
                <p>Looks like you haven't added any stickers yet. Time to add some flair to your laptop!</p>
                <button class="btn btn-primary" [routerLink]="['/']">Browse Collection</button>
            </div>
        }
    </div>
  `,
    styles: [`
    .cart-page { padding: var(--spacing-xl) var(--spacing-md); max-width: 1200px; margin: 0 auto; }
    
    .cart-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: var(--spacing-lg);
    }

    .cart-header h1 { margin: 0; font-size: 2.5rem; }
    
    .clear-btn { color: var(--accent-red); font-size: 0.9rem; }
    .clear-btn:hover { color: #ff9b94; }

    .cart-layout {
        display: grid;
        grid-template-columns: 1fr 350px;
        gap: var(--spacing-xl);
        align-items: start;
    }
    
    .cart-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: var(--surface-color);
        padding: var(--spacing-md);
        border-radius: 16px;
        margin-bottom: var(--spacing-md);
        border: 1px solid var(--border-color);
        transition: all 0.3s ease;
    }

    .cart-item:hover {
        border-color: var(--accent-blue);
        transform: translateX(5px);
    }
    
    .item-main {
        display: flex;
        gap: var(--spacing-md);
        align-items: center;
        cursor: pointer;
        flex: 1;
    }

    .item-main img {
        border-radius: 8px;
        background: var(--card-bg);
        padding: 0.5rem;
    }

    .item-info h3 { margin: 0 0 0.25rem 0; font-size: 1.25rem; }
    .unit-price { color: var(--text-secondary); font-size: 0.9rem; margin: 0.5rem 0 0 0; }
    
    .item-actions {
        display: flex;
        align-items: center;
        gap: var(--spacing-xl);
    }

    .quantity-controls {
        display: flex;
        align-items: center;
        background: var(--card-bg);
        border-radius: 8px;
        border: 1px solid var(--border-color);
        padding: 0.25rem;
    }

    .qty-btn {
        width: 32px;
        height: 32px;
        border-radius: 6px;
        border: none;
        background: transparent;
        color: white;
        cursor: pointer;
        font-size: 1.2rem;
        transition: background 0.2s;
    }

    .qty-btn:hover:not(:disabled) { background: rgba(255,255,255,0.05); }
    .qty-btn:disabled { opacity: 0.3; cursor: not-allowed; }

    .quantity {
        width: 40px;
        text-align: center;
        font-weight: 700;
        font-family: 'JetBrains Mono', monospace;
    }

    .item-total { text-align: right; min-width: 100px; }
    .total-price { font-weight: 700; color: var(--accent-green); font-size: 1.2rem; margin: 0; }
    
    .remove-link {
        background: none;
        border: none;
        color: var(--text-secondary);
        font-size: 0.8rem;
        cursor: pointer;
        padding: 0;
        margin-top: 0.25rem;
        text-decoration: underline;
    }

    .remove-link:hover { color: var(--accent-red); }

    .summary {
        background: var(--surface-color);
        padding: var(--spacing-lg);
        border-radius: 20px;
        border: 1px solid var(--border-color);
        position: sticky;
        top: 100px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    
    .summary h3 { margin-bottom: 2rem; font-size: 1.5rem; }
    .summary-details { display: flex; flex-direction: column; gap: 1rem; }

    .summary-row {
        display: flex;
        justify-content: space-between;
        color: var(--text-secondary);
    }
    
    .summary-row.total {
        color: var(--text-primary);
        font-weight: 800;
        font-size: 1.5rem;
        margin-top: 1rem;
    }
    
    .free { color: var(--accent-green); font-weight: 700; }
    hr { border: 0; border-top: 1px solid var(--border-color); margin: 1.5rem 0; }
    
    .checkout-btn { 
        width: 100%; 
        margin-top: 1rem; 
        padding: 1.2rem;
        font-size: 1.1rem;
        border-radius: 12px;
    }

    .trust-badges {
        margin-top: 2rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .badge {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.8rem;
        color: var(--text-secondary);
    }
    
    .empty-state { 
        text-align: center; 
        padding: var(--spacing-xl) var(--spacing-md);
        background: var(--surface-color);
        border-radius: 24px;
        border: 1px dashed var(--border-color);
        margin-top: var(--spacing-lg);
    }

    .empty-icon { font-size: 4rem; margin-bottom: 1.5rem; }
    .empty-state h2 { margin-bottom: 1rem; }
    .empty-state p { margin-bottom: 2rem; color: var(--text-secondary); max-width: 400px; margin-inline: auto; }
    
    @media (max-width: 900px) {
        .cart-layout { grid-template-columns: 1fr; }
        .summary { position: static; }
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent {
    cartService = inject(CartService);

    tax = computed(() => this.cartService.subtotal() * 0.08); // 8% tax
    total = computed(() => this.cartService.subtotal() + this.tax());

    checkout() {
        alert('Thank you for your order! Checkout simulation successful.');
        this.cartService.clearCart();
    }
}
