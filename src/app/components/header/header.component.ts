import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <header class="main-header">
        <div class="container header-container">
            <nav class="navbar">
                <div class="logo-area" [routerLink]="['/']" title="Go to home">
                    <span class="logo-prefix">./</span><span class="logo-text">DevStickers</span>
                </div>
                <div class="nav-links">
                    <a [routerLink]="['/']" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
                    <a [routerLink]="['/collections']" routerLinkActive="active">Collections</a>
                    <a [routerLink]="['/about']" routerLinkActive="active">About</a>
                    <a [routerLink]="['/support']" routerLinkActive="active">Support</a>
                </div>
                <div class="nav-actions">
                    <button class="cart-btn" [routerLink]="['/cart']" [attr.data-count]="cartService.cartCount()">
                        <span class="cart-icon">🛒</span>
                        <span class="cart-text">Cart</span>
                        <span class="cart-badge" *ngIf="cartService.cartCount() > 0">{{ cartService.cartCount() }}</span>
                    </button>
                </div>
            </nav>
        </div>
    </header>
  `,
    styles: [`
    .main-header {
        background: rgba(13, 17, 23, 0.7);
        backdrop-filter: blur(15px) saturate(180%);
        -webkit-backdrop-filter: blur(15px) saturate(180%);
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        position: sticky;
        top: 0;
        z-index: 1000;
        padding: 0.75rem 0;
        transition: all 0.3s ease;
    }

    .navbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 60px;
    }

    .logo-area {
        cursor: pointer;
        font-family: 'JetBrains Mono', monospace;
        font-size: 1.4rem;
        font-weight: 800;
        display: flex;
        align-items: center;
    }

    .logo-prefix { color: var(--accent-blue); }
    .logo-text { 
        background: linear-gradient(90deg, #fff, var(--text-secondary));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .nav-links {
        display: flex;
        gap: 2.5rem;
    }

    .nav-links a {
        color: var(--text-secondary);
        font-weight: 500;
        font-size: 0.95rem;
        position: relative;
        letter-spacing: 0.5px;
        transition: all 0.2s ease;
    }

    .nav-links a:hover {
        color: #fff;
        text-shadow: 0 0 10px rgba(255,255,255,0.3);
    }

    .nav-links a.active {
        color: var(--accent-blue);
    }

    .nav-links a.active::after {
        content: '';
        position: absolute;
        bottom: -6px;
        left: 0;
        width: 100%;
        height: 2px;
        background: var(--accent-blue);
        box-shadow: 0 0 12px var(--accent-blue);
        border-radius: 2px;
    }

    .cart-btn {
        background: rgba(255,255,255,0.03);
        border: 1px solid var(--border-color);
        color: white;
        padding: 0.6rem 1.2rem;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
    }

    .cart-btn:hover {
        background: rgba(88, 166, 255, 0.1);
        border-color: var(--accent-blue);
        transform: translateY(-2px);
    }

    .cart-badge {
        position: absolute;
        top: -8px;
        right: -8px;
        background: var(--accent-blue);
        color: white;
        font-size: 0.7rem;
        font-weight: 700;
        min-width: 20px;
        height: 20px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 10px var(--accent-blue);
    }

    @media (max-width: 768px) {
        .nav-links {
            display: none;
        }
    }
  `]
})
export class HeaderComponent {
    cartService = inject(CartService);
}
