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
            <span class="announcement">
                <span class="pulse-dot"></span>
                Free worldwide shipping on orders over $25!
            </span>
            <div class="top-links">
                <a [routerLink]="['/support']">Support</a>
                <a [routerLink]="['/about']">About Us</a>
            </div>
        </div>
    </div>

    <header class="main-header glass-panel">
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
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </div>
                    <div class="action-item" [routerLink]="['/admin']" title="Admin Dashboard">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                    </div>
                    <button class="cart-btn" [routerLink]="['/cart']">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
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
        background: rgba(0, 0, 0, 0.4);
        color: var(--text-secondary);
        font-size: 0.75rem;
        padding: 0.6rem 0;
        border-bottom: 1px solid var(--border-color);
        font-weight: 500;
        letter-spacing: 0.02em;
    }

    .top-bar-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .announcement {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .pulse-dot {
        width: 6px;
        height: 6px;
        background: var(--accent-green);
        border-radius: 50%;
        display: inline-block;
        box-shadow: 0 0 8px var(--accent-green);
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.5); opacity: 0.5; }
        100% { transform: scale(1); opacity: 1; }
    }

    .top-links {
        display: flex;
        gap: 1.5rem;
    }

    .top-links a {
        color: var(--text-secondary);
        transition: color 0.2s;
    }

    .top-links a:hover {
        color: white;
    }

    .main-header {
        position: sticky;
        top: 0;
        z-index: 1000;
        height: var(--header-height);
        display: flex;
        align-items: center;
        border-radius: 0 !important;
        border-left: none;
        border-right: none;
        border-top: none;
    }

    .header-container {
        max-width: var(--container-max-width);
        width: 100%;
    }

    .navbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .logo-area {
        cursor: pointer;
        font-family: 'JetBrains Mono', monospace;
        font-size: 1.5rem;
        font-weight: 800;
        display: flex;
        align-items: center;
        letter-spacing: -1px;
    }

    .logo-prefix { 
        color: var(--accent-blue);
        text-shadow: 0 0 15px rgba(var(--accent-blue-rgb), 0.5);
    }
    .logo-text { color: white; }

    .nav-links {
        display: flex;
        gap: 3rem;
    }

    .nav-links a {
        color: var(--text-primary);
        font-weight: 600;
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        position: relative;
        padding: 0.5rem 0;
    }

    .nav-links a::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0;
        height: 2px;
        background: var(--accent-blue);
        transition: width 0.3s ease;
        box-shadow: 0 0 8px var(--accent-blue);
    }

    .nav-links a:hover::after, .nav-links a.active::after {
        width: 100%;
    }

    .nav-links a:hover, .nav-links a.active {
        color: #fff;
    }

    .nav-actions {
        display: flex;
        align-items: center;
        gap: 1.5rem;
    }

    .action-item {
        cursor: pointer;
        color: var(--text-secondary);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
    }

    .action-item:hover {
        transform: translateY(-2px);
        color: var(--accent-blue);
        filter: drop-shadow(0 0 5px var(--accent-blue));
    }

    .cart-btn {
        background: rgba(88, 166, 255, 0.1);
        border: 1px solid rgba(88, 166, 255, 0.2);
        color: var(--accent-blue);
        width: 42px;
        height: 42px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        position: relative;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .cart-btn:hover {
        background: var(--accent-blue);
        color: white;
        transform: scale(1.05) translateY(-2px);
        box-shadow: 0 0 20px rgba(88, 166, 255, 0.4);
    }

    .cart-badge {
        position: absolute;
        top: -8px;
        right: -8px;
        background: var(--accent-purple);
        color: white;
        font-size: 0.65rem;
        font-weight: 800;
        min-width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid var(--bg-color);
        box-shadow: 0 0 10px rgba(var(--accent-purple-rgb), 0.5);
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
