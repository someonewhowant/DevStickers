import { Component, inject, ChangeDetectionStrategy, input, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
    selector: 'app-product-card',
    imports: [CommonModule, NgOptimizedImage, RouterLink],
    template: `
    <div class="product-card glass-card animate-in" [id]="'sticker-' + product().id">
        <div class="tag-group">
            <span class="category-tag">{{ product().category }}</span>
        </div>
        <div class="image-wrapper" [routerLink]="['/product', product().id]">
            <img [ngSrc]="product().imageUrl" [alt]="product().name" width="160" height="160" priority="false">
            <div class="hover-overlay">
                <button class="quick-add-btn" (click)="addToCart($event)" [class.added]="added()" [title]="added() ? 'Successfully added' : 'Add to cart'">
                    @if (added()) {
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    } @else {
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    }
                </button>
            </div>
        </div>
        <div class="card-content" [routerLink]="['/product', product().id]">
            <h3 class="product-title">{{ product().name }}</h3>
            <div class="card-footer">
                <p class="price">{{ product().price | currency }}</p>
                <div class="rating">
                    <span class="star">★</span>
                    <span class="rating-val">4.9</span>
                </div>
            </div>
        </div>
    </div>
  `,
    styles: [`
    .product-card {
        display: flex;
        flex-direction: column;
        height: 100%;
        position: relative;
        padding-top: 1rem;
    }

    .tag-group {
        position: absolute;
        top: 1rem;
        left: 1rem;
        z-index: 2;
    }

    .category-tag {
        font-size: 0.65rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--accent-blue);
        background: rgba(var(--accent-blue-rgb), 0.1);
        padding: 0.25rem 0.6rem;
        border-radius: 6px;
        border: 1px solid rgba(var(--accent-blue-rgb), 0.2);
    }

    .image-wrapper {
        position: relative;
        margin: 0.5rem;
        border-radius: 12px;
        background: rgba(0,0,0,0.2);
        display: flex;
        justify-content: center;
        align-items: center;
        aspect-ratio: 1;
        overflow: hidden;
        cursor: pointer;
    }

    .image-wrapper img {
        width: 80%;
        height: auto;
        transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
    }

    .product-card:hover .image-wrapper img {
        transform: scale(1.1) rotate(6deg);
    }

    .hover-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0,0,0,0.2);
        opacity: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 0.3s ease;
    }

    .product-card:hover .hover-overlay {
        opacity: 1;
    }

    .quick-add-btn {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: #fff;
        color: #000;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transform: translateY(10px);
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        box-shadow: 0 8px 16px rgba(0,0,0,0.3);
    }

    .product-card:hover .quick-add-btn {
        transform: translateY(0);
    }

    .quick-add-btn:hover {
        background: var(--accent-blue);
        color: #fff;
        transform: scale(1.1);
    }

    .quick-add-btn.added {
        background: var(--accent-green);
        color: #fff;
    }

    .card-content {
        padding: 1rem 1.5rem 1.5rem;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        cursor: pointer;
    }

    .product-title {
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: #fff;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: auto;
    }

    .price {
        font-weight: 700;
        color: var(--accent-cyan);
        font-size: 1.25rem;
        margin: 0;
    }

    .rating {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.85rem;
        color: #ffd700;
    }

    .rating-val {
        color: var(--text-secondary);
        font-weight: 600;
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
    product = input.required<Product>();
    showAddButton = input<boolean>(true);
    added = signal(false);

    private cartService = inject(CartService);

    addToCart(event: Event) {
        event.stopPropagation();
        this.cartService.addToCart(this.product());

        this.added.set(true);
        setTimeout(() => this.added.set(false), 2000);
    }
}
