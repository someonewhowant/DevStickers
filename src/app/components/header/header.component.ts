import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'app-header',
    imports: [CommonModule, RouterModule],
    template: `
    <!-- Top Bar -->
    <div class="top-bar">
        <div class="container top-bar-content">
            <span class="announcement">Free worldwide shipping on orders over $25! 🚀</span>
            <div class="top-links">
                <a [routerLink]="['/support']">Support</a>
                <a [routerLink]="['/about']">About Us</a>
            </div>
        </div>
    </div>

    <header class="main-header">
        <div class="container header-container">
            <nav class="navbar">
                <div class="logo-area" [routerLink]="['/']" title="Go to home">
                    <span class="logo-prefix">./</span><span class="logo-text">DevStickers</span>
                </div>
                
                <div class="nav-links">
                    <a [routerLink]="['/']" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Shop All</a>
                    <a [routerLink]="['/collections']" routerLinkActive="active">New Arrivals</a>
                    <a [routerLink]="['/collections']" routerLinkActive="active">Best Sellers</a>
                </div>

                <div class="nav-actions">
                    <div class="action-item search-trigger">
                        <span class="icon">🔍</span>
                    </div>
                    <div class="action-item" [routerLink]="['/admin']" title="Admin Dashboard">
                        <span class="icon">⚙️</span>
                    </div>
                    <button class="cart-btn" [routerLink]="['/cart']">
                        <span class="cart-icon">🛒</span>
                        @if (cartService.cartCount() > 0) {
                            <span class="cart-badge">{{ cartService.cartCount() }}</span>
                        }
                    </button>
                </div>
            </nav>
        </div>
    </header>
  `,
    styles: [`
    .top-bar {
        background: #000;
        color: var(--text-secondary);
        font-size: 0.75rem;
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--border-color);
    }

    .top-bar-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .top-links {
        display: flex;
        gap: 1.5rem;
    }

    .top-links a {
        color: var(--text-secondary);
        text-decoration: none;
    }

    .top-links a:hover {
        color: white;
    }

    .main-header {
        background: rgba(13, 17, 23, 0.85);
        backdrop-filter: blur(15px);
        border-bottom: 1px solid var(--border-color);
        position: sticky;
        top: 0;
        z-index: 1000;
        height: var(--header-height);
        display: flex;
        align-items: center;
    }

    .header-container {
        max-width: var(--container-max-width);
    }

    .navbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }

    .logo-area {
        cursor: pointer;
        font-family: 'JetBrains Mono', monospace;
        font-size: 1.5rem;
        font-weight: 800;
        display: flex;
        align-items: center;
    }

    .logo-prefix { color: var(--accent-blue); }
    .logo-text { color: white; }

    .nav-links {
        display: flex;
        gap: 3rem;
    }

    .nav-links a {
        color: var(--text-primary);
        font-weight: 600;
        font-size: 0.95rem;
        text-decoration: none;
        letter-spacing: 0.5px;
        transition: color 0.2s;
    }

    .nav-links a:hover, .nav-links a.active {
        color: var(--accent-blue);
    }

    .nav-actions {
        display: flex;
        align-items: center;
        gap: 1.5rem;
    }

    .action-item {
        cursor: pointer;
        font-size: 1.2rem;
        color: var(--text-primary);
        transition: transform 0.2s;
    }

    .action-item:hover {
        transform: scale(1.1);
        color: var(--accent-blue);
    }

    .cart-btn {
        background: var(--accent-blue);
        border: none;
        color: white;
        width: 45px;
        height: 45px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        position: relative;
        box-shadow: var(--glow-blue);
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .cart-btn:hover {
        transform: scale(1.1) rotate(5deg);
    }

    .cart-icon { font-size: 1.2rem; }

    .cart-badge {
        position: absolute;
        top: -5px;
        right: -5px;
        background: var(--accent-green);
        color: white;
        font-size: 0.7rem;
        font-weight: 800;
        min-width: 18px;
        height: 18px;
        border-radius: 9px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid var(--bg-color);
    }

    @media (max-width: 900px) {
        .nav-links { display: none; }
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
    cartService = inject(CartService);
}
