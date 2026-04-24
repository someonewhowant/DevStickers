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
        margin-bottom: var(--spacing-xl);
    }

    .cart-header h1 { margin: 0; font-size: clamp(2rem, 5vw, 3rem); font-weight: 800; letter-spacing: -0.02em; }
    
    .clear-btn { color: var(--accent-red); font-size: 0.9rem; font-weight: 600; }
    .clear-btn:hover { color: #ff9b94; text-decoration: underline; }

    .cart-layout {
        display: grid;
        grid-template-columns: 1fr 380px;
        gap: var(--spacing-xl);
        align-items: start;
    }
    
    .cart-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: var(--glass-bg);
        backdrop-filter: var(--glass-blur);
        padding: var(--spacing-lg);
        border-radius: 24px;
        margin-bottom: var(--spacing-md);
        border: 1px solid var(--glass-border);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: var(--glass-shadow);
    }

    .cart-item:hover {
        border-color: var(--accent-blue);
        transform: scale(1.01) translateX(5px);
    }
    
    .item-main {
        display: flex;
        gap: var(--spacing-lg);
        align-items: center;
        cursor: pointer;
        flex: 1;
    }

    .item-main img {
        border-radius: 16px;
        background: var(--card-bg);
        padding: 0.75rem;
        border: 1px solid var(--border-color);
    }

    .item-info h3 { margin: 0 0 0.25rem 0; font-size: 1.4rem; font-weight: 700; }
    .unit-price { color: var(--text-secondary); font-size: 0.95rem; margin: 0.5rem 0 0 0; font-family: 'JetBrains Mono', monospace; }
    
    .item-actions {
        display: flex;
        align-items: center;
        gap: 3rem;
    }

    .quantity-controls {
        display: flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        border: 1px solid var(--border-color);
        padding: 0.4rem;
    }

    .qty-btn {
        width: 36px;
        height: 36px;
        border-radius: 8px;
        border: none;
        background: transparent;
        color: white;
        cursor: pointer;
        font-size: 1.4rem;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .qty-btn:hover:not(:disabled) { background: rgba(255, 255, 255, 0.1); color: var(--accent-blue); }
    .qty-btn:disabled { opacity: 0.2; cursor: not-allowed; }

    .quantity {
        width: 45px;
        text-align: center;
        font-weight: 800;
        font-family: 'JetBrains Mono', monospace;
        font-size: 1.1rem;
    }

    .item-total { text-align: right; min-width: 120px; }
    .total-price { font-weight: 800; color: var(--accent-green); font-size: 1.4rem; margin: 0; font-family: 'JetBrains Mono', monospace; }
    
    .remove-link {
        background: none;
        border: none;
        color: var(--text-secondary);
        font-size: 0.85rem;
        cursor: pointer;
        padding: 0;
        margin-top: 0.5rem;
        transition: color 0.2s;
        text-decoration: underline;
        opacity: 0.6;
    }

    .remove-link:hover { color: var(--accent-red); opacity: 1; }

    .summary {
        background: var(--glass-bg);
        backdrop-filter: var(--glass-blur);
        padding: var(--spacing-xl);
        border-radius: 32px;
        border: 1px solid var(--glass-border);
        position: sticky;
        top: 100px;
        box-shadow: var(--glass-shadow);
    }
    
    .summary h3 { margin-bottom: 2.5rem; font-size: 1.75rem; font-weight: 800; letter-spacing: -0.02em; }
    .summary-details { display: flex; flex-direction: column; gap: 1.25rem; }

    .summary-row {
        display: flex;
        justify-content: space-between;
        color: var(--text-secondary);
        font-size: 1.05rem;
    }
    
    .summary-row.total {
        color: white;
        font-weight: 800;
        font-size: 1.75rem;
        margin-top: 1.5rem;
        font-family: 'JetBrains Mono', monospace;
    }
    
    .free { color: var(--accent-green); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    hr { border: 0; border-top: 1px solid var(--border-color); margin: 2rem 0; opacity: 0.5; }
    
    .checkout-btn { 
        width: 100%; 
        margin-top: 1rem; 
        padding: 1.4rem;
        font-size: 1.25rem;
        border-radius: 16px;
        box-shadow: 0 10px 20px rgba(88, 166, 255, 0.2);
    }

    .trust-badges {
        margin-top: 2.5rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding-top: 2rem;
        border-top: 1px dashed var(--border-color);
    }

    .badge {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 0.9rem;
        color: var(--text-secondary);
    }

    .badge .icon { font-size: 1.2rem; }
    
    .empty-state { 
        text-align: center; 
        padding: 6rem 2rem;
        background: var(--glass-bg);
        border-radius: 32px;
        border: 1px dashed var(--glass-border);
        margin-top: var(--spacing-lg);
    }

    .empty-icon { font-size: 5rem; margin-bottom: 2rem; filter: grayscale(1); opacity: 0.5; }
    .empty-state h2 { font-size: 2rem; margin-bottom: 1rem; }
    .empty-state p { margin-bottom: 3rem; color: var(--text-secondary); max-width: 450px; margin-inline: auto; line-height: 1.6; }
    
    @media (max-width: 960px) {
        .cart-layout { grid-template-columns: 1fr; }
        .summary { position: static; margin-top: var(--spacing-xl); }
        .cart-item { flex-direction: column; align-items: stretch; gap: var(--spacing-md); }
        .item-actions { justify-content: space-between; }
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
